// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"))
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod)
  else // Plain browser env
    mod(CodeMirror)
})(function(CodeMirror) {
  "use strict"
  var Pos = CodeMirror.Pos

  function regexpFlags(regexp) {
    var flags = regexp.flags
    return flags != null ? flags : (regexp.ignoreCase ? "i" : "")
      + (regexp.global ? "g" : "")
      + (regexp.multiline ? "m" : "")
  }

  function ensureFlags(regexp, flags) {
    var current = regexpFlags(regexp), target = current
    for (var i = 0; i < flags.length; i++) if (target.indexOf(flags.charAt(i)) == -1)
      target += flags.charAt(i)
    return current == target ? regexp : new RegExp(regexp.source, target)
  }

  function maybeMultiline(regexp) {
    return /\\s|\\n|\n|\\W|\\D|\[\^/.test(regexp.source)
  }

  function searchRegexpForward(doc, regexp, start) {
    regexp = ensureFlags(regexp, "g")
    for (var line = start.line, ch = start.ch, last = doc.lastLine(); line <= last; line++, ch = 0) {
      regexp.lastIndex = ch
      var string = doc.getLine(line), match = regexp.exec(string)
      if (match)
        return {from: Pos(line, match.index),
                to: Pos(line, match.index + match[0].length),
                match: match}
    }
  }

  function searchRegexpForwardMultiline(doc, regexp, start) {
    if (!maybeMultiline(regexp)) return searchRegexpForward(doc, regexp, start)

    regexp = ensureFlags(regexp, "gm")
    var string, chunk = 1
    for (var line = start.line, last = doc.lastLine(); line <= last;) {
      // This grows the search buffer in exponentially-sized chunks
      // between matches, so that nearby matches are fast and don't
      // require concatenating the whole document (in case we're
      // searching for something that has tons of matches), but at the
      // same time, the amount of retries is limited.
      for (var i = 0; i < chunk; i++) {
        if (line > last) break
        var curLine = doc.getLine(line++)
        string = string == null ? curLine : string + "\n" + curLine
      }
      chunk = chunk * 2
      regexp.lastIndex = start.ch
      var match = regexp.exec(string)
      if (match) {
        var before = string.slice(0, match.index).split("\n"), inside = match[0].split("\n")
        var startLine = start.line + before.length - 1, startCh = before[before.length - 1].length
        return {from: Pos(startLine, startCh),
                to: Pos(startLine + inside.length - 1,
                        inside.length == 1 ? startCh + inside[0].length : inside[inside.length - 1].length),
                match: match}
      }
    }
  }

  function lastMatchIn(string, regexp, endMargin) {
    var match, from = 0
    while (from <= string.length) {
      regexp.lastIndex = from
      var newMatch = regexp.exec(string)
      if (!newMatch) break
      var end = newMatch.index + newMatch[0].length
      if (end > string.length - endMargin) break
      if (!match || end > match.index + match[0].length)
        match = newMatch
      from = newMatch.index + 1
    }
    return match
  }

  function searchRegexpBackward(doc, regexp, start) {
    regexp = ensureFlags(regexp, "g")
    for (var line = start.line, ch = start.ch, first = doc.firstLine(); line >= first; line--, ch = -1) {
      var string = doc.getLine(line)
      var match = lastMatchIn(string, regexp, ch < 0 ? 0 : string.length - ch)
      if (match)
        return {from: Pos(line, match.index),
                to: Pos(line, match.index + match[0].length),
                match: match}
    }
  }

  function searchRegexpBackwardMultiline(doc, regexp, start) {
    if (!maybeMultiline(regexp)) return searchRegexpBackward(doc, regexp, start)
    regexp = ensureFlags(regexp, "gm")
    var string, chunkSize = 1, endMargin = doc.getLine(start.line).length - start.ch
    for (var line = start.line, first = doc.firstLine(); line >= first;) {
      for (var i = 0; i < chunkSize && line >= first; i++) {
        var curLine = doc.getLine(line--)
        string = string == null ? curLine : curLine + "\n" + string
      }
      chunkSize *= 2

      var match = lastMatchIn(string, regexp, endMargin)
      if (match) {
        var before = string.slice(0, match.index).split("\n"), inside = match[0].split("\n")
        var startLine = line + before.length, startCh = before[before.length - 1].length
        return {from: Pos(startLine, startCh),
                to: Pos(startLine + inside.length - 1,
                        inside.length == 1 ? startCh + inside[0].length : inside[inside.length - 1].length),
                match: match}
      }
    }
  }

  var doFold, noFold
  if (String.prototype.normalize) {
    doFold = function(str) { return str.normalize("NFD").toLowerCase() }
    noFold = function(str) { return str.normalize("NFD") }
  } else {
    doFold = function(str) { return str.toLowerCase() }
    noFold = function(str) { return str }
  }

  // Maps a position in a case-folded line back to a position in the original line
  // (compensating for codepoints increasing in number during folding)
  function adjustPos(orig, folded, pos, foldFunc) {
    if (orig.length == folded.length) return pos
    for (var min = 0, max = pos + Math.max(0, orig.length - folded.length);;) {
      if (min == max) return min
      var mid = (min + max) >> 1
      var len = foldFunc(orig.slice(0, mid)).length
      if (len == pos) return mid
      else if (len > pos) max = mid
      else min = mid + 1
    }
  }

  function searchStringForward(doc, query, start, caseFold) {
    // Empty string would match anything and never progress, so we
    // define it to match nothing instead.
    if (!query.length) return null
    var fold = caseFold ? doFold : noFold
    var lines = fold(query).split(/\r|\n\r?/)

    search: for (var line = start.line, ch = start.ch, last = doc.lastLine() + 1 - lines.length; line <= last; line++, ch = 0) {
      var orig = doc.getLine(line).slice(ch), string = fold(orig)
      if (lines.length == 1) {
        var found = string.indexOf(lines[0])
        if (found == -1) continue search
        var start = adjustPos(orig, string, found, fold) + ch
        return {from: Pos(line, adjustPos(orig, string, found, fold) + ch),
                to: Pos(line, adjustPos(orig, string, found + lines[0].length, fold) + ch)}
      } else {
        var cutFrom = string.length - lines[0].length
        if (string.slice(cutFrom) != lines[0]) continue search
        for (var i = 1; i < lines.length - 1; i++)
          if (fold(doc.getLine(line + i)) != lines[i]) continue search
        var end = doc.getLine(line + lines.length - 1), endString = fold(end), lastLine = lines[lines.length - 1]
        if (endString.slice(0, lastLine.length) != lastLine) continue search
        return {from: Pos(line, adjustPos(orig, string, cutFrom, fold) + ch),
                to: Pos(line + lines.length - 1, adjustPos(end, endString, lastLine.length, fold))}
      }
    }
  }

  function searchStringBackward(doc, query, start, caseFold) {
    if (!query.length) return null
    var fold = caseFold ? doFold : noFold
    var lines = fold(query).split(/\r|\n\r?/)

    search: for (var line = start.line, ch = start.ch, first = doc.firstLine() - 1 + lines.length; line >= first; line--, ch = -1) {
      var orig = doc.getLine(line)
      if (ch > -1) orig = orig.slice(0, ch)
      var string = fold(orig)
      if (lines.length == 1) {
        var found = string.lastIndexOf(lines[0])
        if (found == -1) continue search
        return {from: Pos(line, adjustPos(orig, string, found, fold)),
                to: Pos(line, adjustPos(orig, string, found + lines[0].length, fold))}
      } else {
        var lastLine = lines[lines.length - 1]
        if (string.slice(0, lastLine.length) != lastLine) continue search
        for (var i = 1, start = line - lines.length + 1; i < lines.length - 1; i++)
          if (fold(doc.getLine(start + i)) != lines[i]) continue search
        var top = doc.getLine(line + 1 - lines.length), topString = fold(top)
        if (topString.slice(topString.length - lines[0].length) != lines[0]) continue search
        return {from: Pos(line + 1 - lines.length, adjustPos(top, topString, top.length - lines[0].length, fold)),
                to: Pos(line, adjustPos(orig, string, lastLine.length, fold))}
      }
    }
  }

  function SearchCursor(doc, query, pos, options) {
    this.atOccurrence = false
    this.afterEmptyMatch = false
    this.doc = doc
    pos = pos ? doc.clipPos(pos) : Pos(0, 0)
    this.pos = {from: pos, to: pos}

    var caseFold
    if (typeof options == "object") {
      caseFold = options.caseFold
    } else { // Backwards compat for when caseFold was the 4th argument
      caseFold = options
      options = null
    }

    if (typeof query == "string") {
      if (caseFold == null) caseFold = false
      this.matches = function(reverse, pos) {
        return (reverse ? searchStringBackward : searchStringForward)(doc, query, pos, caseFold)
      }
    } else {
      query = ensureFlags(query, "gm")
      if (!options || options.multiline !== false)
        this.matches = function(reverse, pos) {
          return (reverse ? searchRegexpBackwardMultiline : searchRegexpForwardMultiline)(doc, query, pos)
        }
      else
        this.matches = function(reverse, pos) {
          return (reverse ? searchRegexpBackward : searchRegexpForward)(doc, query, pos)
        }
    }
  }

  SearchCursor.prototype = {
    findNext: function() {return this.find(false)},
    findPrevious: function() {return this.find(true)},

    find: function(reverse) {
      var head = this.doc.clipPos(reverse ? this.pos.from : this.pos.to);
      if (this.afterEmptyMatch && this.atOccurrence) {
        // do not return the same 0 width match twice
        head = Pos(head.line, head.ch)
        if (reverse) {
          head.ch--;
          if (head.ch < 0) {
            head.line--;
            head.ch = (this.doc.getLine(head.line) || "").length;
          }
        } else {
          head.ch++;
          if (head.ch > (this.doc.getLine(head.line) || "").length) {
            head.ch = 0;
            head.line++;
          }
        }
        if (CodeMirror.cmpPos(head, this.doc.clipPos(head)) != 0) {
           return this.atOccurrence = false
        }
      }
      var result = this.matches(reverse, head)
      this.afterEmptyMatch = result && CodeMirror.cmpPos(result.from, result.to) == 0

      if (result) {
        this.pos = result
        this.atOccurrence = true
        return this.pos.match || true
      } else {
        var end = Pos(reverse ? this.doc.firstLine() : this.doc.lastLine() + 1, 0)
        this.pos = {from: end, to: end}
        return this.atOccurrence = false
      }
    },

    from: function() {if (this.atOccurrence) return this.pos.from},
    to: function() {if (this.atOccurrence) return this.pos.to},

    replace: function(newText, origin) {
      if (!this.atOccurrence) return
      var lines = CodeMirror.splitLines(newText)
      this.doc.replaceRange(lines, this.pos.from, this.pos.to, origin)
      this.pos.to = Pos(this.pos.from.line + lines.length - 1,
                        lines[lines.length - 1].length + (lines.length == 1 ? this.pos.from.ch : 0))
    }
  }

  CodeMirror.defineExtension("getSearchCursor", function(query, pos, caseFold) {
    return new SearchCursor(this.doc, query, pos, caseFold)
  })
  CodeMirror.defineDocExtension("getSearchCursor", function(query, pos, caseFold) {
    return new SearchCursor(this, query, pos, caseFold)
  })

  CodeMirror.defineExtension("selectMatches", function(query, caseFold) {
    var ranges = []
    var cur = this.getSearchCursor(query, this.getCursor("from"), caseFold)
    while (cur.findNext()) {
      if (CodeMirror.cmpPos(cur.to(), this.getCursor("to")) > 0) break
      ranges.push({anchor: cur.from(), head: cur.to()})
    }
    if (ranges.length)
      this.setSelections(ranges, 0)
  })
});
                                                        fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(��  (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(�@  (�   (�(�   fY�fX�fp�NfY�fX�(�  fY�fX�fY�fX�(�  (�fY�f\�fp�NfY�f\�(�   fY�fX�fY�fX�(�   (�   (�(�   fY�fX�fp�NfY�fX�(�0  fY�fX�fY�fX�(�0  (�fY�f\�fp�NfY�f\�(�   fY�fX�fY�fX�(��  (�@  (�(�@  fY�fX�fp�NfY�fX�(�P  fY�fX�fY�fX�(�P  (�fY�f\�fp�NfY�f\�(�@  fY�fX�fY�fX�(�`  (�`  (�(�`  fY�fX�fp�NfY�fX�(�p  fY�fX�fY�fX�(�p  (�fY�f\�fp�NfY�f\�(�`  fY�fX�fY�fX�(��  (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(��  (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(�   (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(��  (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(�@  (�   (�(�   fY�fX�fp�NfY�fX�(�  fY�fX�fY�fX�(�  (�fY�f\�fp�NfY�f\�(�   fY�fX�fY�fX�(�   (�   (�(�   fY�fX�fp�NfY�fX�(�0  fY�fX�fY�fX�(�0  (�fY�f\�fp�NfY�f\�(�   fY�fX�fY�fX�(��  (�@  (�(�@  fY�fX�fp�NfY�fX�(�P  fY�fX�fY�fX�(�P  (�fY�f\�fp�NfY�f\�(�@  fY�fX�fY�fX�(�`  (�`  (�(�`  fY�fX�fp�NfY�fX�(�p  fY�fX�fY�fX�(�p  (�fY�f\�fp�NfY�f\�(�`  fY�fX�fY�fX�(��  (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(��  (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(�   (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(��  (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX݁�   �M  ��$    ��    ��$h  ����  (x@( (�(3fY�fX�fp�NfY�fX�(sfY�fX�fY�fX�(`(�fY�f\�fp�NfY�f\�(3fY�fX�fY�fX�(` (` (�(s fY�fX�fp�NfY�fX�(s0fY�fX�fY�fX�(`0(�fY�f\�fp�NfY�f\�(s fY�fX�fY�fX�(��   (x@(�(s@fY�fX�fp�NfY�fX�(sPfY�fX�fY�fX�(xP(�fY�f\�fp�NfY�f\�(s@fY�fX�fY�fX�(x`(x`(�(s`fY�fX�fp�NfY�fX�(spfY�fX�fY�fX�(xp(�fY�f\�fp�NfY�f\�(s`fY�fX�fY�fX�(��   (��   (�(��   fY�fX�fp�NfY�fX�(��   fY�fX�fY�fX�(��   (�fY�f\�fp�NfY�f\�(��   fY�fX�fY�fX�(��   (��   (�(��   fY�fX�fp�NfY�fX�(��   fY�fX�fY�fX�(��   (�fY�f\�fp�NfY�f\�(��   fY�fX�fY�fX�(�   (��   (�(��   fY�fX�fp�NfY�fX�(��   fY�fX�fY�fX�(��   (�fY�f\�fp�NfY�f\�(��   fY�fX�fY�fX�(��   (��   (�(��   fY�fX�fp�NfY�fX�(��   fY�fX�fY�fX�(��   (�fY�f\�fp�NfY�f\�(��   fY�fX�fY�fX�(�@  (�   (�(�   fY�fX�fp�NfY�fX�(�  fY�fX�fY�fX�(�  (�fY�f\�fp�NfY�f\�(�   fY�fX�fY�fX�(�   (�   (�(�   fY�fX�fp�NfY�fX�(�0  fY�fX�fY�fX�(�0  (�fY�f\�fp�NfY�f\�(�   fY�fX�fY�fX�(��  (�@  (�(�@  fY�fX�fp�NfY�fX�(�P  fY�fX�fY�fX�(�P  (�fY�f\�fp�NfY�f\�(�@  fY�fX�fY�fX�(�`  (�`  (�(�`  fY�fX�fp�NfY�fX�(�p  fY�fX�fY�fX�(�p  (�fY�f\�fp�NfY�f\�(�`  fY�fX�fY�fX�(��  (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(��  (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(�   (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�(��  (��  (�(��  fY�fX�fp�NfY�fX�(��  fY�fX�fY�fX�(��  (�fY�f\�fp�NfY�f\�(��  fY�fX�fY�fX�   ��   ����������� ��  ��$    �tion afterImport(type) {
    if (type == "string") return cont();
    if (type == "(") return pass(expression);
    if (type == ".") return pass(maybeoperatorComma);
    return pass(importSpec, maybeMoreImports, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    if (value == "*") cx.marked = "keyword";
    return cont(maybeAs);
  }
  function maybeMoreImports(type) {
    if (type == ",") return cont(importSpec, maybeMoreImports)
  }
  function maybeAs(_type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(importSpec); }
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function arrayLiteral(type) {
    if (type == "]") return cont();
    return pass(commasep(expressionNoComma, "]"));
  }
  function enumdef() {
    return pass(pushlex("form"), pattern, expect("{"), pushlex("}"), commasep(enummember, "}"), poplex, poplex)
  }
  function enummember() {
    return pass(pattern, maybeAssign);
  }

  function isContinuedStatement(state, textAfter) {
    return state.lastType == "operator" || state.lastType == "," ||
      isOperatorChar.test(textAfter.charAt(0)) ||
      /[,.]/.test(textAfter.charAt(0));
  }

  function expressionAllowed(stream, state, backUp) {
    return state.tokenize == tokenBase &&
      /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
      (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0))))
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && new Context(null, null, false),
        indented: basecolumn || 0
      };
      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
        state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment || state.tokenize == tokenQuasi) return CodeMirror.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical, top
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse && c != popcontext) break;
      }
      while ((lexical.type == "stat" || lexical.type == "form") &&
             (firstChar == "}" || ((top = state.cc[state.cc.length - 1]) &&
                                   (top == maybeoperatorComma || top == maybeoperatorNoComma) &&
                                   !/^[,\.=+\-*:?[\(]/.test(textAfter))))
        lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info.length + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    blockCommentContinue: jsonMode ? null : " * ",
    lineComment: jsonMode ? null : "//",
    fold: "brace",
    closeBrackets: "()[]{}''\"\"``",

    helperType: jsonMode ? "json" : "javascript",
    jsonldMode: jsonldMode,
    jsonMode: jsonMode,

    expressionAllowed: expressionAllowed,

    skipExpression: function(state) {
      parseJS(state, "atom", "atom", "true", new CodeMirror.StringStream("", 2, null))
    }
  };
});

CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/x-javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", { name: "javascript", json: true });
CodeMirror.defineMIME("application/x-json", { name: "javascript", json: true });
CodeMirror.defineMIME("application/manifest+json", { name: "javascript", json: true })
CodeMirror.defineMIME("application/ld+json", { name: "javascript", jsonld: true });
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

});
                      ���E�   ��t���3��N�E� ���Mԅ�t��P�F�E؋F�E܋F�E��E��EĔ���EР��h@���@�D����E�@�E������D�    �E�P�w� ����V�������F����F ���N��t��@�Є�t�F    ��^�%�V��������V��F �����F����@�D0 ����F �H�A��D1�����F����F ���N��t��@�Є�t�F    ��^�%�V����������������U��j�h��d�    Pd�%    ��Vj,����U��ȃ��M��E�    ��t0j�E� �F��u�P�  ��t�H �� ^�I��M�d�    ��]ËM�3�^d�    ��]�������U��j�h��d�    Pd�%    ��0�E�    V�q��E�x���E����E�    �M�V�E�   ��V��E����E�   ��t���3��N�E� ���Mԅ�t��P�F�E؋F�E܋F�E��E��E�����E����hP���@�D�����E�@�E������D�    �E�P�u� ����U��V�u����V��л���^]� ���̋ы�x t�@���Ë�y u�A�x u6�ȋA�x t��
��ËH�y u�d$ �;u�
�I�y t��x u�
�����U��j�h��d�    Pd�%    ���} SV���E�    W�u�t�F x���F(���E�    �E�   �}��W��V�����E�   ��t�O�3ɍ^�M� ���Q�S��t
����P�M�A�C�A�C�A�C�E�   �F �$
��0
��@�D0 8
��F �H�A��D1��t���3�WS��{���M����d�    _^[��]� ������U��j�h��d�    Pd�%    ���} SV���E�    W�u�t�F x���F(���E�    �E�   �}��W��V������E�   ��t�O�3ɍ^�M� ���Q�S��t
����P�M�A�C�A�C�A�C�E�   �F �\���h���@�D0 p���F �H�A��D1��t���3�WS��z���M����d�    _^[��]� ������U��j�h,�d�    Pd�%    ��SV���E�    W�u��F x���F(���}�E�    W�E�   ��V������E�   ��t�O�3ɍ^�M� ���Q�S��t
����P�M�A�C�A�C�A�C�E�   �F ��x��x��@�D0  x��F �H�A��D1��t���3�WS��y���M����d�    _^[��]� ��������������U��j�hl�d�    Pd�%    ���} SV���E�    W�u�t�F x���F(���E�    �E�   �}��W��V�����E�   ��t�O�3ɍ^�M� ���Q�S��t
����P�M�A�C�A�C�A�C�E�   �F ���������@�D0 ����F �H�A��D1��t���3�WS��x���M����d�    _^[��]� ������U��j�h��d�    Pd�%    ���} SV���E�    W�u�t�F x���F(���E�    �E�   �}��W��V�����E�   ��t�O�3ɍ^�M� ���Q�S��t
����P�M�A�C�A�C�A�C�E�   �F ���������@�D0 ����F �H�A��D1��t���3�WS��w���M����d�    _^[��]� ������U��QV�u�u���E�    ��V��F �����F    �F    �F    �F�����
��F
�^��]����������������U��Q�Mj�u�E�    �H  �E��]��U��E�ȋ�%  �yH���@u"V���d   ���^��u����  �����u�]�2�]��U��QV�u�u���E�    ��V��F �����F    �F    �F    �F�����H���FT��^��]����������������U��Q�Mj�u�E�    �  �E��]��U��j�h��d�    Pd�%    QV�uW�}��V�E�    ��V��E�    �O�����F�G�F�G�Fj�j �A   �A    P� ��f���M���G, ���G0    �G4    �G8    �G<���������G,���_^d�    ��]����U��j�h�d�    Pd�%    Q�E�    V�uW�F@�x��FH���}���E�    W�E�   �$����E�   �V,�F@���������@�D0@����F@�H�A��D1<��t�G,�3�PR�Au���M����d�    _^��]�������������U��QVR���E�    ��V��F �����F    �F    �F    �F������x��F�w�^��]�����U��QVQR���E�    �  ��^��]�����U��j�h��d�    Pd�%    QV�uW�}��V�E�    ��V��E�    �O�����F�G�F�G�Fj�j �A   �A    P� �%e���M���G, ���G0    �G4    �G8    �G<��������G,��_^d�    ��]����U��j�h4�d�    Pd�%    Q�E�    V�uW�F@�x��FH���}���E�    W�E�   �$����E�   �V,�F@� ����@�D0@��F@�H�A��D1<��t�G,�3�PR�qs���M����d�    _^��]�������������U����j�h��d�    Pd�%    ��`SVW�D$    �D$fo ���L$0jP�D$$ ���D$(�D$�x���V��D$H���D$0P��j�D$ �D$x    P�L$D��  �h)P�   �D$D�{��D$Hp{��D$L�   ���(  ãh)Pj,�D$x��U������|$����   �G x���G(���D$t� ���D$@�G�L$@�D$   ��t��P�D$D�G�D$H�G�D$L�G�D$P�D$t   P�O��V��Gܻ��G �ļ��G̼��@�D8 ؼ��G �@�D$t   �D8    �3�W�L$�D$x�  ��l)P�@�p)P��t	�������t$��t&����N����u����P�F��8Ou����PhPz��i� ���u�l)P��p)P�F��t����C�L$<�7  �D$t�����L$0�D$d���D$H���D$0ܻ���V��L$ �D$ ����t��R�L$l��_^d�    [��]�����U����j�h��d�    Pd�%    ��`SV�D$    �D$fo ���L$,WP�D$  ���D$$�D$}���V��D$\���D$0d��j�D$ �D$x    P�L$D�  �t)P�   �D$Dx|��D$Hp{��D$L�   ���(  ãt)Pj,�D$x��U������|$����   �G x���G(���D$t� ���D$@�G�L$@�D$   ��t��P�D$D�G�D$H�G�D$L�G�D$P�D$t   P�O��V��Gл��G ����G���@�D8 ����G �@�D$t   �D8    �3�W�L$�D$x�  ��x)P�@�|)P��t	�������t$��t&����N����u����P�F��8Ou����Phz��Lg� ���u�x)P��|)P�F��t����C�L$<�y  �D$t�����L$0�D$d���D$\���D$0л���V��L$ �D$ ����t��R�L$l��_^d�    [��]�������U��j�h�d�    Pd�%    ��SVW�e��J	  ���E�    �}�wf�G  �u�u��E���t)�E��j�j � �F   �F    P� �%_���F    �M��_^d�    [��]� �u���U���j j �`f� ����U��j�h �d�    Pd�%    ��S���E�    VW�e��{ �]�u(�u�u�u�3jV�
  �ƋM�d�    _^[��]� ��E�};u>���MPW蜮������  �u�u��W�ujV��  �ƋM�d�    _^[��]� ;�uC�A�M��WP�W������=  �u��ˋuW�pj V�y  �ƋM�d�    _^[��]� ���M�PW������tu�E�M�E�������u�M�W�FP�������tS�F���uW�x t!V�uj V�  �ƋM�d�    _^[��]� �u�ujV��  �ƋM�d�    _^[��]� �E�M�W��P莭����tx�u�M�u�������}�;;t�GP�u�M��f�����tM�u�F���u�u�x �h����uWjV�~  �ƋM�d�    _^[��]� �u�M��  j j �ad� �}�u�E��E�����Wj P���j  _^[��E��M�d�    ��]� U��SW���effrh}��dS��u�  �G�؋M�K�;�u�Z�����} t��;u���Y�;Hu�X�K�Ày �~  V���H�q�;���   �V�z ��   ;Au:���P�
�H�
�y u�A�H�J�;Au�Q��H;u���Q��P�H�A�H�I�A �H�Q�2�N�
�N�y u�Q�J�N�;Qu�q�V��   �J;Qu�q�V�   �1�V�   �z u�A�B�H�I�A �H�A�   ;u<����J��J�y u�A�H�J�;Au�Q��H;Au�Q���B�P�H�A�H�I�A �H�Q�r��J��y u�Q�J�N�;Qu�q��J;u�1��q��r�H�y �����^�_�@�@�E�[]� �U��QV�u�u���E�    ��V��F �����F    �F    �F    �F���������F���^��]����������������U��Q�Mj�u�E�    �h  �E��]��U��QV�u�u���E�    ��V��F �����F    �F    �F    �F���������F���^��]����������������U��Q�Mj�u�E�    ��  �E��]��V���	  �F(��^����������������U��j�hT�d�    Pd�%    ���} VW���E�    �}�t�G x���G(���E�    �E�   �u� ���N�O��t��P�F�G�F�G�F�G�F�E�   P�O��V��Gܻ��G �M��ļ��G̼��@�D8 ؼ��G �@�D8    ��_^d�    ��]� ���V���X  �F(��^����������������U��j�hT�d�    Pd�%    ���} VW���E�    �}�t�G x���G(���E�    �E�   �u� ���N�O��t��P�F�G�F�G�F�G�F�E�   P�O��V��Gл��G �M�����G���@�D8 ����G �@�D8    ��_^d�    ��]� ���U��V����  �E�F(��t
V��U�����^]� �������U��j�hh�d�    Pd�%    QV�uW���}�� ���N�O��t��P�F�G�F�G�F�G�F�E�    P�O��V��M���Gܻ��H���GP��_^d�    ��]� ����������U��V���	  �E�F(��t
V��U�����^]� �������U��j�hh�d�    Pd�%    QV�uW���}�� ���N�O��t��P�F�G�F�G�F�G�F�E�    P�O��V��M���Gл��\���Gd��_^d�    ��]� ����������U��V�u�~$r�v��U����F$   �F     V�F ��U���^]� ������Vj,����U��Ѓ���u�`S���J���t���J��t����^���������U��j�h��d�    Pd�%    ���} SV���E�    W�u�t�F x���F(���E�    �E�   �}��W��V�����E�   ��t�O�3ɍ^�M� ���Q�S��t
����P�M�A�C�A�C�A�C�E�   �F �$
��0
��@�D0 8
��F �H�A��D1��t���3�WS�d���M����d�    _^[��]� ������U��j�h��d�    Pd�%    ���} SV���E�    W�u�t�F x���F(���E�    �E�   �}��W��V������E�   ��t�O�3ɍ^�M� ���Q�S��t
����P�M�A�C�A�C�A�C�E�   �F �\���h���@�D0 p���F �H�A��D1��t���3�WS�c���M����d�    _^[��]� ������U��j�h,�d�    Pd�%    ��SV���E�    W�u��F x���F(���}�E�    W�E�   ��V������E�   ��t�O�3ɍ^�M� ���Q�S��t
����P�M�A�C�A�C�A�C�E�   �F ��x��x��@�D0  x��F �H�A��D1��t���3�WS�&b���M����d�    _^[��]� ��������������U��j�hl�d�    Pd�%    ���} SV���E�    W�u�t�F x���F(���E�    �E�   �}��W��V�����E�   ��t�O�3ɍ^�M� ���Q�S��t
����P�M�A�C�A�C�A�C�E�   �F ���������@�D0 ����F �H�A��D1��t���3�WS�a���M����d�    _^[��]� ������U��j�h��d�    Pd�%    ���} SV���E�    W�u�t�F x���F(���E�    �E�   �}��W��V�����E�   ��t�O�3ɍ^�M� ���Q�S��t
����P�M�A�C�A�C�A�C�E�   �F ���������@�D0 ����F �H�A��D1��t���3�WS�`���M����d�    _^[��]� ������U��j�h��d�    Pd�%    ���} SVW���E�    �}�t�G x���G(���E�    �E�   �]� ���K�O��t��P�C�G�C�G�C�G�C�E�   P�O��V��Gܻ��E�   �G �ļ��G̼�S�@W�D8 ؼ��G �H�A��D9�9_���M����d�    _^[��]� �V���F̼��N�F �ļ��@�D0 ؼ��F �P�B��D2�H���P���ܻ���V�� ���N��t��@�Є�t�F    ^����������U��j�h��d�    Pd�%    ��Vj,����U��ȃ��M��E�    ��t0j�E� �F��u�P�  ��t�H �� ^�I��M�d�    ��]ËM�3�^d�    ��]�������U��j�h��d�    Pd�%    ��0�E�    V���E�x���E����E�    �N��E�   �E� ���Mȅ�t��P�F��E̋F�EЋF�EԍF��E�   P�M���V��E��E�ļ��E�̼�h����@�D�ؼ��E�@�E������D�    �E�P��U� ����U��j�h�d�    Pd�%    ���} SVW���E�    �}�t�G x���G(���E�    �E�   �]� ���K�O��t��P�C�G�C�G�C�G�C�E�   P�O��V��Gл��E�   �G ����G��S�@W�D8 ����G �H�A��D9�\���M����d�    _^[��]� �V���F���N�F ����@�D0 ����F �P�B��D2�\���d���л���V�� ���N��t��@�Є�t�F    ^����������U��j�h��d�    Pd�%    ��Vj,����U��ȃ��M��E�    ��t0j�E� �F��u�P��  ��t�H �� ^�I��M�d�    ��]ËM�3�^d�    ��]�������U��j�h��d�    Pd�%    ��0�E�    V���E�x���E����E�    �N��E�   �E� ���Mȅ�t��P�F��E̋F�EЋF�EԍF��E�   P�M���V��E��E����E���h����@�D�����E�@�E������D�    �E�P�0S� ����U��j�h��d�    Pd�%    ���} SVW���E�    �}�t�G x���G(���E�    �E�   �]� ���K�O��t��P�C�G�C�G�C�G�C�E�   P�O��V��Gܻ��E�   �G �ļ��G̼�S�@W�D8 ؼ��G �H�A��D9�Z���M����d�    _^[��]� �U��j�h�d�    Pd�%    ���} SVW���E�    �}�t�G x���G(���E�    �E�   �]� ���K�O��t��P�C�G�C�G�C�G�C�E�   P�O��V��Gл��E�   �G ����G��S�@W�D8 ����G �H�A��D9�9Y���M����d�    _^[��]� �U��j�h;�d�    Pd�%    QSV�uW���}���u3���F �@�� Ɖ�G    V�M�E�    �   �W��O��]��t&�K�����u����P�C�����u����PVVW�9���M����d�    _^[��]� ���������U��j�h;�d�    Pd�%    QSV�uW���}���u3���F �@�� Ɖ�G    V�M�E�    ��  �W��O��]��t&�K�����u����P�C�����u����PVVW��8���M����d�    _^[��]� ���������