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
                                                        fYîfXİ(¸Ğ  (ïfYîf\ÅfpïNfYõf\Ö(³À  fYşfXÏfYîfXİ(¸à  (¸à  (ï(³à  fYîfXÅfpïNfYõfXÖ(³ğ  fYşfXÏfYîfXİ(¸ğ  (ïfYîf\ÅfpïNfYõf\Ö(³à  fYşfXÏfYîfXİ(¸@  (    (ì(³   fYîfXÅfpìNfYõfXÖ(³  fYæfXÌfYîfXİ(   (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXİ(    (    (ì(³   fYîfXÅfpìNfYõfXÖ(³0  fYæfXÌfYîfXİ( 0  (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXİ( €  (¸@  (ï(³@  fYîfXÅfpïNfYõfXÖ(³P  fYşfXÏfYîfXİ(¸P  (ïfYîf\ÅfpïNfYõf\Ö(³@  fYşfXÏfYîfXİ(¸`  (¸`  (ï(³`  fYîfXÅfpïNfYõfXÖ(³p  fYşfXÏfYîfXİ(¸p  (ïfYîf\ÅfpïNfYõf\Ö(³`  fYşfXÏfYîfXİ(¸À  ( €  (ì(³€  fYîfXÅfpìNfYõfXÖ(³  fYæfXÌfYîfXİ(   (ìfYîf\ÅfpìNfYõf\Ö(³€  fYæfXÌfYîfXİ(    (    (ì(³   fYîfXÅfpìNfYõfXÖ(³°  fYæfXÌfYîfXİ( °  (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXİ(    (¸À  (ï(³À  fYîfXÅfpïNfYõfXÖ(³Ğ  fYşfXÏfYîfXİ(¸Ğ  (ïfYîf\ÅfpïNfYõf\Ö(³À  fYşfXÏfYîfXİ(¸à  (¸à  (ï(³à  fYîfXÅfpïNfYõfXÖ(³ğ  fYşfXÏfYîfXİ(¸ğ  (ïfYîf\ÅfpïNfYõf\Ö(³à  fYşfXÏfYîfXİ(¸@  (    (ì(³   fYîfXÅfpìNfYõfXÖ(³  fYæfXÌfYîfXİ(   (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXİ(    (    (ì(³   fYîfXÅfpìNfYõfXÖ(³0  fYæfXÌfYîfXİ( 0  (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXİ( €  (¸@  (ï(³@  fYîfXÅfpïNfYõfXÖ(³P  fYşfXÏfYîfXİ(¸P  (ïfYîf\ÅfpïNfYõf\Ö(³@  fYşfXÏfYîfXİ(¸`  (¸`  (ï(³`  fYîfXÅfpïNfYõfXÖ(³p  fYşfXÏfYîfXİ(¸p  (ïfYîf\ÅfpïNfYõf\Ö(³`  fYşfXÏfYîfXİ(¸À  ( €  (ì(³€  fYîfXÅfpìNfYõfXÖ(³  fYæfXÌfYîfXİ(   (ìfYîf\ÅfpìNfYõf\Ö(³€  fYæfXÌfYîfXİ(    (    (ì(³   fYîfXÅfpìNfYõfXÖ(³°  fYæfXÌfYîfXİ( °  (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXİ(    (¸À  (ï(³À  fYîfXÅfpïNfYõfXÖ(³Ğ  fYşfXÏfYîfXİ(¸Ğ  (ïfYîf\ÅfpïNfYõf\Ö(³À  fYşfXÏfYîfXİ(¸à  (¸à  (ï(³à  fYîfXÅfpïNfYõfXÖ(³ğ  fYşfXÏfYîfXİ(¸ğ  (ïfYîf\ÅfpïNfYõf\Ö(³à  fYşfXÏfYîfXİÃ   éM  ¤$    ›    ‹¼$h  ƒÿŒ€  (x@( (ì(3fYîfXÅfpìNfYõfXÖ(sfYæfXÌfYîfXİ(`(ìfYîf\ÅfpìNfYõf\Ö(3fYæfXÌfYîfXİ(` (` (ì(s fYîfXÅfpìNfYõfXÖ(s0fYæfXÌfYîfXİ(`0(ìfYîf\ÅfpìNfYõf\Ö(s fYæfXÌfYîfXİ( €   (x@(ï(s@fYîfXÅfpïNfYõfXÖ(sPfYşfXÏfYîfXİ(xP(ïfYîf\ÅfpïNfYõf\Ö(s@fYşfXÏfYîfXİ(x`(x`(ï(s`fYîfXÅfpïNfYõfXÖ(spfYşfXÏfYîfXİ(xp(ïfYîf\ÅfpïNfYõf\Ö(s`fYşfXÏfYîfXİ(¸À   ( €   (ì(³€   fYîfXÅfpìNfYõfXÖ(³   fYæfXÌfYîfXİ(    (ìfYîf\ÅfpìNfYõf\Ö(³€   fYæfXÌfYîfXİ(     (     (ì(³    fYîfXÅfpìNfYõfXÖ(³°   fYæfXÌfYîfXİ( °   (ìfYîf\ÅfpìNfYõf\Ö(³    fYæfXÌfYîfXİ(    (¸À   (ï(³À   fYîfXÅfpïNfYõfXÖ(³Ğ   fYşfXÏfYîfXİ(¸Ğ   (ïfYîf\ÅfpïNfYõf\Ö(³À   fYşfXÏfYîfXİ(¸à   (¸à   (ï(³à   fYîfXÅfpïNfYõfXÖ(³ğ   fYşfXÏfYîfXİ(¸ğ   (ïfYîf\ÅfpïNfYõf\Ö(³à   fYşfXÏfYîfXİ(¸@  (    (ì(³   fYîfXÅfpìNfYõfXÖ(³  fYæfXÌfYîfXİ(   (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXİ(    (    (ì(³   fYîfXÅfpìNfYõfXÖ(³0  fYæfXÌfYîfXİ( 0  (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXİ( €  (¸@  (ï(³@  fYîfXÅfpïNfYõfXÖ(³P  fYşfXÏfYîfXİ(¸P  (ïfYîf\ÅfpïNfYõf\Ö(³@  fYşfXÏfYîfXİ(¸`  (¸`  (ï(³`  fYîfXÅfpïNfYõfXÖ(³p  fYşfXÏfYîfXİ(¸p  (ïfYîf\ÅfpïNfYõf\Ö(³`  fYşfXÏfYîfXİ(¸À  ( €  (ì(³€  fYîfXÅfpìNfYõfXÖ(³  fYæfXÌfYîfXİ(   (ìfYîf\ÅfpìNfYõf\Ö(³€  fYæfXÌfYîfXİ(    (    (ì(³   fYîfXÅfpìNfYõfXÖ(³°  fYæfXÌfYîfXİ( °  (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXİ(    (¸À  (ï(³À  fYîfXÅfpïNfYõfXÖ(³Ğ  fYşfXÏfYîfXİ(¸Ğ  (ïfYîf\ÅfpïNfYõf\Ö(³À  fYşfXÏfYîfXİ(¸à  (¸à  (ï(³à  fYîfXÅfpïNfYõfXÖ(³ğ  fYşfXÏfYîfXİ(¸ğ  (ïfYîf\ÅfpïNfYõf\Ö(³à  fYşfXÏfYîfXİ   Ã   ƒïƒÿ‘øÿÿƒÿ ¸  ¤$    tion afterImport(type) {
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
                      âÆÇEü   …ötƒÆë3ö‹NÇEĞ ¼Æ‰MÔ…Ét‹ÿP‹F‰EØ‹F‰EÜ‹F‰Eà‹EäÇEÄ”âÆÇEĞ âÆh@äì‹@ÇDä¨âÆ‹Eä‹@ÇEüÿÿÿÿÇDà    EÄPèw¡ ÌÌÌÌV‹ñÇ¸âÆÇFÄâÆÇF ¼Æ‹N…Ét‹‹@ÿĞ„ÀtÇF    ‹Î^ÿ%ÌVÆÌÌÌÌÌÌÌV‹ñ‹F ÇÌâÆÇFØâÆ‹@ÇD0 àâÆ‹F ‹HAø‰D1Ç¸âÆÇFÄâÆÇF ¼Æ‹N…Ét‹‹@ÿĞ„ÀtÇF    ‹Î^ÿ%ÌVÆÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhŒìºd¡    Pd‰%    ƒìVj,‹ñÿœUÆ‹ÈƒÄ‰MìÇEü    …Ét0jÆEğ FØÿuğPè…  …Àt‹H ƒÀ ^‹IÁ‹Môd‰    ‹å]Ã‹Mô3À^d‰    ‹å]ÃÌÌÌÌÌÌU‹ìjÿhÁìºd¡    Pd‰%    ƒì0ÇEğ    VqØÇEäxÛÇEì¼ÆÇEü    MÄVÇEğ   ÿ¸VÆÇEÄâÆÇEü   …ötƒÆë3ö‹NÇEĞ ¼Æ‰MÔ…Ét‹ÿP‹F‰EØ‹F‰EÜ‹F‰Eà‹EäÇEÄÌâÆÇEĞØâÆhPãì‹@ÇDäàâÆ‹Eä‹@ÇEüÿÿÿÿÇDà    EÄPèu¡ ÌÌÌÌU‹ìVÿu‹ñÿ¸VÆÇĞ»Æ‹Æ^]Â ÌÌÌÌ‹Ñ‹€x t‹@‰‹ÂÃ‹€y u‹A€x u6‹È‹A€x tõ‰
‹ÂÃ‹H€y ud$ ‹;u‰
‹I€y tï‹€x u‰
‹ÂÃÌÌU‹ìjÿh¬íºd¡    Pd‰%    ƒìƒ} SV‹ñÇEğ    W‰uìtÇF xÛÇF(¼ÆÇEü    ÇEğ   ‹}‹ÎWÿ¸VÆÇè»ÆÇEü   …ÿtOë3É^‰MÇ ¼Æ‹Q‰S…Òt
‹‹ÊÿP‹M‹A‰C‹A‰C‹A‰CÇEü   ‹F Ç$
ËÇ0
Ë‹@ÇD0 8
Ë‹F ‹HAø‰D1…ÿtƒÇë3ÿWSèŞ{ÿÿ‹MôƒÄ‹Æd‰    _^[‹å]Â ÌÌÌÌÌÌU‹ìjÿhìíºd¡    Pd‰%    ƒìƒ} SV‹ñÇEğ    W‰uìtÇF xÛÇF(¼ÆÇEü    ÇEğ   ‹}‹ÎWÿ¸VÆÇüáÆÇEü   …ÿtOë3É^‰MÇ ¼Æ‹Q‰S…Òt
‹‹ÊÿP‹M‹A‰C‹A‰C‹A‰CÇEü   ‹F Ç\âÆÇhâÆ‹@ÇD0 pâÆ‹F ‹HAø‰D1…ÿtƒÇë3ÿWSèŞzÿÿ‹MôƒÄ‹Æd‰    _^[‹å]Â ÌÌÌÌÌÌU‹ìjÿh,îºd¡    Pd‰%    ƒìSV‹ñÇEğ    W‰uìÇF xÛÇF(¼Æ‹}ÇEü    WÇEğ   ÿ¸VÆÇĞáÆÇEü   …ÿtOë3É^‰MÇ ¼Æ‹Q‰S…Òt
‹‹ÊÿP‹M‹A‰C‹A‰C‹A‰CÇEü   ‹F ÇxÛÇxÛ‹@ÇD0  xÛ‹F ‹HAø‰D1…ÿtƒÇë3ÿWSèæyÿÿ‹MôƒÄ‹Æd‰    _^[‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhlîºd¡    Pd‰%    ƒìƒ} SV‹ñÇEğ    W‰uìtÇF xÛÇF(¼ÆÇEü    ÇEğ   ‹}‹ÎWÿ¸VÆÇâÆÇEü   …ÿtOë3É^‰MÇ ¼Æ‹Q‰S…Òt
‹‹ÊÿP‹M‹A‰C‹A‰C‹A‰CÇEü   ‹F Ç”âÆÇ âÆ‹@ÇD0 ¨âÆ‹F ‹HAø‰D1…ÿtƒÇë3ÿWSèŞxÿÿ‹MôƒÄ‹Æd‰    _^[‹å]Â ÌÌÌÌÌÌU‹ìjÿh¬îºd¡    Pd‰%    ƒìƒ} SV‹ñÇEğ    W‰uìtÇF xÛÇF(¼ÆÇEü    ÇEğ   ‹}‹ÎWÿ¸VÆÇâÆÇEü   …ÿtOë3É^‰MÇ ¼Æ‹Q‰S…Òt
‹‹ÊÿP‹M‹A‰C‹A‰C‹A‰CÇEü   ‹F ÇÌâÆÇØâÆ‹@ÇD0 àâÆ‹F ‹HAø‰D1…ÿtƒÇë3ÿWSèŞwÿÿ‹MôƒÄ‹Æd‰    _^[‹å]Â ÌÌÌÌÌÌU‹ìQVÿu‹u‹ÎÇEü    ÿ¸VÆÇF ¼Æ‹ÆÇF    ÇF    ÇF    ÇFÿÿÿÿÇ
ËÇF
Ë^‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìQ‹MjÿuÇEü    èH  ‹E‹å]ÃÌU‹ì‹E·È‹Á%  €yHƒÈü@u"V‹Á¾d   ™÷ş^…Òu‹Á¹  ™÷ù…Òu°]Ã2À]ÃÌU‹ìQVÿu‹u‹ÎÇEü    ÿ¸VÆÇF ¼Æ‹ÆÇF    ÇF    ÇF    ÇFÿÿÿÿÇHâÆÇFTâÆ^‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìQ‹MjÿuÇEü    èˆ  ‹E‹å]ÃÌU‹ìjÿhÈîºd¡    Pd‰%    QV‹uW‹}‹ÏVÇEğ    ÿ¸VÆÇEü    OÇô»Æ‹F‰G‹F‰GFjÿj ÇA   ÇA    PÆ èõfÿÿ‹Mô‹ÇÇG, ¼ÆÇG0    ÇG4    ÇG8    ÇG<ÿÿÿÿÇŒ¼ÆÇG,˜¼Æ_^d‰    ‹å]ÃÌÌÌU‹ìjÿhïºd¡    Pd‰%    QÇEğ    V‹uWÇF@˜xÛÇFH¼Æ‹}‹ÎÇEü    WÇEğ   è$İÿÿÇEü   V,‹F@Ç ¼ÆÇ¬¼Æ‹@ÇD0@´¼Æ‹F@‹HAø‰D1<…ÿtG,ë3ÀPRèAuÿÿ‹MôƒÄ‹Æd‰    _^‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌU‹ìQVR‹ñÇEü    ÿ¸VÆÇF ¼Æ‹ÆÇF    ÇF    ÇF    ÇFÿÿÿÿÇ¬xÛÇFøwÛ^‹å]ÃÌÌÌÌU‹ìQVQR‹ñÇEü    è»  ‹Æ^‹å]ÃÌÌÌÌU‹ìjÿhÈîºd¡    Pd‰%    QV‹uW‹}‹ÏVÇEğ    ÿ¸VÆÇEü    OÇô»Æ‹F‰G‹F‰GFjÿj ÇA   ÇA    PÆ è%eÿÿ‹Mô‹ÇÇG, ¼ÆÇG0    ÇG4    ÇG8    ÇG<ÿÿÿÿÇìÇÇG,øÇ_^d‰    ‹å]ÃÌÌÌU‹ìjÿh4ïºd¡    Pd‰%    QÇEğ    V‹uWÇF@˜xÛÇFH¼Æ‹}‹ÎÇEü    WÇEğ   è$àÿÿÇEü   V,‹F@Ç ÇÇÇ‹@ÇD0@Ç‹F@‹HAø‰D1<…ÿtG,ë3ÀPRèqsÿÿ‹MôƒÄ‹Æd‰    _^‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌU‹ìƒäøjÿhïºd¡    Pd‰%    ƒì`SVWÇD$    D$fo ÅÛL$0jPÇD$$ ¼ÆóD$(ÇD$´xÛÿÈVÆÇD$H¼ÆÇD$0P¼ÆjD$ ÇD$x    PL$DèĞ  ¡h)P»   ÇD$Dè{ÛÇD$Hp{ÛÇD$L€   „Ã…(  Ã£h)Pj,ÆD$xÿœUÆ‹øƒÄ‰|$…ÿ„š   ÇG xÛÇG(¼ÆÆD$tÇ ¼Æ‹D$@‰G‹L$@ÇD$   …Ét‹ÿP‹D$D‰G‹D$H‰G‹D$L‰GD$PÇD$t   POÿ¸VÆÇGÜ»Æ‹G ÇÄ¼ÆÇGÌ¼Æ‹@ÇD8 Ø¼Æ‹G ‹@ÇD$t   ÇD8    ë3ÿWL$ÆD$xè¶  ‹‰l)P‹@£p)P…Àt	ƒÀ‹ËğÁ‹t$…öt&ƒÏÿN‹ÇğÁu‹‹ÎÿPFğÁ8Ou‹‹ÎÿPhPzÅèši¡ ƒÄ‹u¡l)P‰¡p)P‰F…ÀtƒÀğÁCL$<è7  ÇD$tÿÿÿÿL$0ÇD$d¼ÆÇD$H¼ÆÇD$0Ü»ÆÿÌVÆ‹L$ ÇD$ ¼Æ…Ét‹ÿR‹L$l‹Æ_^d‰    [‹å]ÃÌÌÌÌU‹ìƒäøjÿhîïºd¡    Pd‰%    ƒì`SVÇD$    D$fo ÅÛL$,WPÇD$  ¼ÆóD$$ÇD$}ÛÿÄVÆÇD$\¼ÆÇD$0d¼ÆjD$ ÇD$x    PL$Dè  ¡t)P»   ÇD$Dx|ÛÇD$Hp{ÛÇD$L€   „Ã…(  Ã£t)Pj,ÆD$xÿœUÆ‹øƒÄ‰|$…ÿ„š   ÇG xÛÇG(¼ÆÆD$tÇ ¼Æ‹D$@‰G‹L$@ÇD$   …Ét‹ÿP‹D$D‰G‹D$H‰G‹D$L‰GD$PÇD$t   POÿ¸VÆÇGĞ»Æ‹G Çè¼ÆÇGğ¼Æ‹@ÇD8 ü¼Æ‹G ‹@ÇD$t   ÇD8    ë3ÿWL$ÆD$xè  ‹‰x)P‹@£|)P…Àt	ƒÀ‹ËğÁ‹t$…öt&ƒÏÿN‹ÇğÁu‹‹ÎÿPFğÁ8Ou‹‹ÎÿPhzÅèLg¡ ƒÄ‹u¡x)P‰¡|)P‰F…ÀtƒÀğÁCL$<èy  ÇD$tÿÿÿÿL$0ÇD$d¼ÆÇD$\¼ÆÇD$0Ğ»ÆÿÌVÆ‹L$ ÇD$ ¼Æ…Ét‹ÿR‹L$l‹Æ_^d‰    [‹å]ÃÌÌÌÌÌÌU‹ìjÿhğºd¡    Pd‰%    ƒìSVW‰eğèJ	  ‹øÇEü    ‰}ìwfÇG  ‰uè‰uäÆEü…öt)‹E‹Îjÿj ‹ ÇF   ÇF    PÆ è%_ÿÿÇF    ‹Mô‹Ç_^d‰    [‹å]Â ÿuìÿ UÆƒÄj j è`f¡ ÌÌÌÌU‹ìjÿh ğºd¡    Pd‰%    ƒìS‹ÙÇEü    VW‰eğƒ{ ‰]äu(ÿu‹uÿuÿ3jVè
  ‹Æ‹Môd‰    _^[‹å]Â ‹‹E‹};u>ƒÀMPWèœ®ÿÿ„À„‚  ÿu‹u‹ËWÿujVèÀ  ‹Æ‹Môd‰    _^[‹å]Â ;ÁuC‹AMƒÀWPèW®ÿÿ„À„=  ÿu‹‹Ë‹uWÿpj Vèy  ‹Æ‹Môd‰    _^[‹å]Â ƒÀMïPWè®ÿÿ„Àtu‹EMè‰Eèèåïÿÿ‹uèMïWFPèõ­ÿÿ„ÀtS‹F‹ËÿuW€x t!V‹uj Vè  ‹Æ‹Môd‰    _^[‹å]Â ÿu‹ujVèó  ‹Æ‹Môd‰    _^[‹å]Â ‹EMïWƒÀPè­ÿÿ„Àtx‹uMè‰uèèÌÁÿÿ‹}è;;tGPÿuMïèf­ÿÿ„ÀtM‹u‹F‹Ëÿuÿu€x …hÿÿÿ‹uWjVè~  ‹Æ‹Môd‰    _^[‹å]Â ÿu‹Mäè  j j èad¡ ‹}ÿuEàÇEüÿÿÿÿWj P‹Ëèj  _^[‹‹E‰‹Môd‰    ‹å]Â U‹ìSW‹ùeffrh}ÛÿdSÆÿuè  ÿG‹Ø‹M‰K‹;Êu‰Z‹‰‹ë€} t‰‹;u‰ë‰Y‹;Hu‰X‹K‹Ã€y …~  V‹ÿ‹H‹q‹;Ê…«   ‹V€z „¤   ;Au:‹Á‹P‹
‰H‹
€y u‰A‹H‰J‹;Au‰Që‹H;u‰ë‰Q‰‰P‹HÆA‹H‹IÆA ‹H‹Q‹2‹N‰
‹N€y u‰Q‹J‰N‹;Qu‰q‰VéÌ   ‹J;Qu‰q‰Vé¹   ‰1‰Vé¯   €z uÆAÆB‹H‹IÆA ‹H‹Aé   ;u<‹Á‹‹J‰‹J€y u‰A‹H‰J‹;Au‰Që‹H;Au‰Që‰‰B‰P‹HÆA‹H‹IÆA ‹H‹Q‹r‹‰J‹€y u‰Q‹J‰N‹;Qu‰që‹J;u‰1ë‰q‰‰r‹H€y „†şÿÿ^‹_‹@Æ@‹E‰[]Â ÌU‹ìQVÿu‹u‹ÎÇEü    ÿ¸VÆÇF ¼Æ‹ÆÇF    ÇF    ÇF    ÇFÿÿÿÿÇ€âÆÇFŒâÆ^‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìQ‹MjÿuÇEü    èh  ‹E‹å]ÃÌU‹ìQVÿu‹u‹ÎÇEü    ÿ¸VÆÇF ¼Æ‹ÆÇF    ÇF    ÇF    ÇFÿÿÿÿÇ¸âÆÇFÄâÆ^‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìQ‹MjÿuÇEü    èè  ‹E‹å]ÃÌV‹ñè¸	  ÇF(¼Æ^ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhTğºd¡    Pd‰%    ƒìƒ} VW‹ùÇEğ    ‰}ìtÇG xÛÇG(¼ÆÇEü    ÇEğ   ‹uÇ ¼Æ‹N‰O…Ét‹ÿP‹F‰G‹F‰G‹F‰GFÇEü   POÿ¸VÆÇGÜ»Æ‹G ‹MôÇÄ¼ÆÇGÌ¼Æ‹@ÇD8 Ø¼Æ‹G ‹@ÇD8    ‹Ç_^d‰    ‹å]Â ÌÌÌV‹ñèX  ÇF(¼Æ^ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhTğºd¡    Pd‰%    ƒìƒ} VW‹ùÇEğ    ‰}ìtÇG xÛÇG(¼ÆÇEü    ÇEğ   ‹uÇ ¼Æ‹N‰O…Ét‹ÿP‹F‰G‹F‰G‹F‰GFÇEü   POÿ¸VÆÇGĞ»Æ‹G ‹MôÇè¼ÆÇGğ¼Æ‹@ÇD8 ü¼Æ‹G ‹@ÇD8    ‹Ç_^d‰    ‹å]Â ÌÌÌU‹ìV‹ñèÕ  öEÇF(¼Æt
Vÿ UÆƒÄ‹Æ^]Â ÌÌÌÌÌÌÌU‹ìjÿhhğºd¡    Pd‰%    QV‹uW‹ù‰}ğÇ ¼Æ‹N‰O…Ét‹ÿP‹F‰G‹F‰G‹F‰GFÇEü    POÿ¸VÆ‹Mô‹ÇÇGÜ»ÆÇH¼ÆÇGP¼Æ_^d‰    ‹å]Â ÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñè¥	  öEÇF(¼Æt
Vÿ UÆƒÄ‹Æ^]Â ÌÌÌÌÌÌÌU‹ìjÿhhğºd¡    Pd‰%    QV‹uW‹ù‰}ğÇ ¼Æ‹N‰O…Ét‹ÿP‹F‰G‹F‰G‹F‰GFÇEü    POÿ¸VÆ‹Mô‹ÇÇGĞ»ÆÇ\¼ÆÇGd¼Æ_^d‰    ‹å]Â ÌÌÌÌÌÌÌÌÌÌU‹ìV‹uƒ~$rÿvÿ UÆƒÄÇF$   ÇF     VÆF ÿ UÆƒÄ^]Â ÌÌÌÌÌÌVj,‹ñÿœUÆ‹ĞƒÄ…Òuÿ`SÆ‹J‰…Ét‹‰J…Ét‹‰‹Â^ÃÌÌÌÌÌÌÌÌU‹ìjÿh¬íºd¡    Pd‰%    ƒìƒ} SV‹ñÇEğ    W‰uìtÇF xÛÇF(¼ÆÇEü    ÇEğ   ‹}‹ÎWÿ¸VÆÇè»ÆÇEü   …ÿtOë3É^‰MÇ ¼Æ‹Q‰S…Òt
‹‹ÊÿP‹M‹A‰C‹A‰C‹A‰CÇEü   ‹F Ç$
ËÇ0
Ë‹@ÇD0 8
Ë‹F ‹HAø‰D1…ÿtƒÇë3ÿWSèdÿÿ‹MôƒÄ‹Æd‰    _^[‹å]Â ÌÌÌÌÌÌU‹ìjÿhìíºd¡    Pd‰%    ƒìƒ} SV‹ñÇEğ    W‰uìtÇF xÛÇF(¼ÆÇEü    ÇEğ   ‹}‹ÎWÿ¸VÆÇüáÆÇEü   …ÿtOë3É^‰MÇ ¼Æ‹Q‰S…Òt
‹‹ÊÿP‹M‹A‰C‹A‰C‹A‰CÇEü   ‹F Ç\âÆÇhâÆ‹@ÇD0 pâÆ‹F ‹HAø‰D1…ÿtƒÇë3ÿWSècÿÿ‹MôƒÄ‹Æd‰    _^[‹å]Â ÌÌÌÌÌÌU‹ìjÿh,îºd¡    Pd‰%    ƒìSV‹ñÇEğ    W‰uìÇF xÛÇF(¼Æ‹}ÇEü    WÇEğ   ÿ¸VÆÇĞáÆÇEü   …ÿtOë3É^‰MÇ ¼Æ‹Q‰S…Òt
‹‹ÊÿP‹M‹A‰C‹A‰C‹A‰CÇEü   ‹F ÇxÛÇxÛ‹@ÇD0  xÛ‹F ‹HAø‰D1…ÿtƒÇë3ÿWSè&bÿÿ‹MôƒÄ‹Æd‰    _^[‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhlîºd¡    Pd‰%    ƒìƒ} SV‹ñÇEğ    W‰uìtÇF xÛÇF(¼ÆÇEü    ÇEğ   ‹}‹ÎWÿ¸VÆÇâÆÇEü   …ÿtOë3É^‰MÇ ¼Æ‹Q‰S…Òt
‹‹ÊÿP‹M‹A‰C‹A‰C‹A‰CÇEü   ‹F Ç”âÆÇ âÆ‹@ÇD0 ¨âÆ‹F ‹HAø‰D1…ÿtƒÇë3ÿWSèaÿÿ‹MôƒÄ‹Æd‰    _^[‹å]Â ÌÌÌÌÌÌU‹ìjÿh¬îºd¡    Pd‰%    ƒìƒ} SV‹ñÇEğ    W‰uìtÇF xÛÇF(¼ÆÇEü    ÇEğ   ‹}‹ÎWÿ¸VÆÇâÆÇEü   …ÿtOë3É^‰MÇ ¼Æ‹Q‰S…Òt
‹‹ÊÿP‹M‹A‰C‹A‰C‹A‰CÇEü   ‹F ÇÌâÆÇØâÆ‹@ÇD0 àâÆ‹F ‹HAø‰D1…ÿtƒÇë3ÿWSè`ÿÿ‹MôƒÄ‹Æd‰    _^[‹å]Â ÌÌÌÌÌÌU‹ìjÿh¬ğºd¡    Pd‰%    ƒìƒ} SVW‹ùÇEğ    ‰}ìtÇG xÛÇG(¼ÆÇEü    ÇEğ   ‹]Ç ¼Æ‹K‰O…Ét‹ÿP‹C‰G‹C‰G‹C‰GCÇEü   POÿ¸VÆÇGÜ»ÆÇEü   ‹G ÇÄ¼ÆÇGÌ¼ÆS‹@WÇD8 Ø¼Æ‹G ‹HAø‰D9è9_ÿÿ‹MôƒÄ‹Çd‰    _^[‹å]Â ÌV‹ñÇFÌ¼ÆN‹F ÇÄ¼Æ‹@ÇD0 Ø¼Æ‹F ‹PBø‰D2ÇH¼ÆÇP¼ÆÇÜ»ÆÿÌVÆÇ ¼Æ‹N…Ét‹‹@ÿĞ„ÀtÇF    ^ÃÌÌÌÌÌÌÌÌÌU‹ìjÿhŒìºd¡    Pd‰%    ƒìVj,‹ñÿœUÆ‹ÈƒÄ‰MìÇEü    …Ét0jÆEğ FØÿuğPè…  …Àt‹H ƒÀ ^‹IÁ‹Môd‰    ‹å]Ã‹Mô3À^d‰    ‹å]ÃÌÌÌÌÌÌU‹ìjÿháğºd¡    Pd‰%    ƒì0ÇEğ    V‹ñÇEäxÛÇEì¼ÆÇEü    ‹NÜÇEğ   ÇEÄ ¼Æ‰MÈ…Ét‹ÿP‹Fà‰EÌ‹Fä‰EĞ‹Fè‰EÔFìÇEü   PMØÿ¸VÆ‹EäÇEÄÄ¼ÆÇEØÌ¼Æh¤æì‹@ÇDäØ¼Æ‹Eä‹@ÇEüÿÿÿÿÇDà    EÄPèÀU¡ ÌÌÌÌU‹ìjÿhñºd¡    Pd‰%    ƒìƒ} SVW‹ùÇEğ    ‰}ìtÇG xÛÇG(¼ÆÇEü    ÇEğ   ‹]Ç ¼Æ‹K‰O…Ét‹ÿP‹C‰G‹C‰G‹C‰GCÇEü   POÿ¸VÆÇGĞ»ÆÇEü   ‹G Çè¼ÆÇGğ¼ÆS‹@WÇD8 ü¼Æ‹G ‹HAø‰D9è©\ÿÿ‹MôƒÄ‹Çd‰    _^[‹å]Â ÌV‹ñÇFğ¼ÆN‹F Çè¼Æ‹@ÇD0 ü¼Æ‹F ‹PBø‰D2Ç\¼ÆÇd¼ÆÇĞ»ÆÿÌVÆÇ ¼Æ‹N…Ét‹‹@ÿĞ„ÀtÇF    ^ÃÌÌÌÌÌÌÌÌÌU‹ìjÿhŒìºd¡    Pd‰%    ƒìVj,‹ñÿœUÆ‹ÈƒÄ‰MìÇEü    …Ét0jÆEğ FØÿuğPèÕ  …Àt‹H ƒÀ ^‹IÁ‹Môd‰    ‹å]Ã‹Mô3À^d‰    ‹å]ÃÌÌÌÌÌÌU‹ìjÿháğºd¡    Pd‰%    ƒì0ÇEğ    V‹ñÇEäxÛÇEì¼ÆÇEü    ‹NÜÇEğ   ÇEÄ ¼Æ‰MÈ…Ét‹ÿP‹Fà‰EÌ‹Fä‰EĞ‹Fè‰EÔFìÇEü   PMØÿ¸VÆ‹EäÇEÄè¼ÆÇEØğ¼Æh”æì‹@ÇDäü¼Æ‹Eä‹@ÇEüÿÿÿÿÇDà    EÄPè0S¡ ÌÌÌÌU‹ìjÿh¬ğºd¡    Pd‰%    ƒìƒ} SVW‹ùÇEğ    ‰}ìtÇG xÛÇG(¼ÆÇEü    ÇEğ   ‹]Ç ¼Æ‹K‰O…Ét‹ÿP‹C‰G‹C‰G‹C‰GCÇEü   POÿ¸VÆÇGÜ»ÆÇEü   ‹G ÇÄ¼ÆÇGÌ¼ÆS‹@WÇD8 Ø¼Æ‹G ‹HAø‰D9èZÿÿ‹MôƒÄ‹Çd‰    _^[‹å]Â ÌU‹ìjÿhñºd¡    Pd‰%    ƒìƒ} SVW‹ùÇEğ    ‰}ìtÇG xÛÇG(¼ÆÇEü    ÇEğ   ‹]Ç ¼Æ‹K‰O…Ét‹ÿP‹C‰G‹C‰G‹C‰GCÇEü   POÿ¸VÆÇGĞ»ÆÇEü   ‹G Çè¼ÆÇGğ¼ÆS‹@WÇD8 ü¼Æ‹G ‹HAø‰D9è9Yÿÿ‹MôƒÄ‹Çd‰    _^[‹å]Â ÌU‹ìjÿh;ñºd¡    Pd‰%    QSV‹uW‹ù‰}ğ…öu3Àë‹F ‹@ƒÀ Æ‰ÇG    VMÇEü    è   ‹W‹‰O‰‹]…Ût&KƒÈÿğÁu‹‹ËÿPCƒÉÿğÁu‹‹ËÿPVVWè9ÿÿ‹MôƒÄ‹Çd‰    _^[‹å]Â ÌÌÌÌÌÌÌÌÌU‹ìjÿh;ñºd¡    Pd‰%    QSV‹uW‹ù‰}ğ…öu3Àë‹F ‹@ƒÀ Æ‰ÇG    VMÇEü    èà  ‹W‹‰O‰‹]…Ût&KƒÈÿğÁu‹‹ËÿPCƒÉÿğÁu‹‹ËÿPVVWèÑ8ÿÿ‹MôƒÄ‹Çd‰    _^[‹å]Â ÌÌÌÌÌÌÌÌÌ