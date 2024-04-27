// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Define search commands. Depends on dialog.js or another
// implementation of the openDialog method.

// Replace works a little oddly -- it will do the replace on the next
// Ctrl-G (or whatever is bound to findNext) press. You prevent a
// replace by making sure the match is no longer selected when hitting
// Ctrl-G.

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("./searchcursor"), require("../dialog/dialog"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "./searchcursor", "../dialog/dialog"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  // default search panel location
  CodeMirror.defineOption("search", {bottom: false});

  function searchOverlay(query, caseInsensitive) {
    if (typeof query == "string")
      query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
    else if (!query.global)
      query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

    return {token: function(stream) {
      query.lastIndex = stream.pos;
      var match = query.exec(stream.string);
      if (match && match.index == stream.pos) {
        stream.pos += match[0].length || 1;
        return "searching";
      } else if (match) {
        stream.pos = match.index;
      } else {
        stream.skipToEnd();
      }
    }};
  }

  function SearchState() {
    this.posFrom = this.posTo = this.lastQuery = this.query = null;
    this.overlay = null;
  }

  function getSearchState(cm) {
    return cm.state.search || (cm.state.search = new SearchState());
  }

  function queryCaseInsensitive(query) {
    return typeof query == "string" && query == query.toLowerCase();
  }

  function getSearchCursor(cm, query, pos) {
    // Heuristic: if the query string is all lowercase, do a case insensitive search.
    return cm.getSearchCursor(query, pos, {caseFold: queryCaseInsensitive(query), multiline: true});
  }

  function persistentDialog(cm, text, deflt, onEnter, onKeyDown) {
    cm.openDialog(text, onEnter, {
      value: deflt,
      selectValueOnOpen: true,
      closeOnEnter: false,
      onClose: function() { clearSearch(cm); },
      onKeyDown: onKeyDown,
      bottom: cm.options.search.bottom
    });
  }

  function dialog(cm, text, shortText, deflt, f) {
    if (cm.openDialog) cm.openDialog(text, f, {value: deflt, selectValueOnOpen: true, bottom: cm.options.search.bottom});
    else f(prompt(shortText, deflt));
  }

  function confirmDialog(cm, text, shortText, fs) {
    if (cm.openConfirm) cm.openConfirm(text, fs);
    else if (confirm(shortText)) fs[0]();
  }

  function parseString(string) {
    return string.replace(/\\([nrt\\])/g, function(match, ch) {
      if (ch == "n") return "\n"
      if (ch == "r") return "\r"
      if (ch == "t") return "\t"
      if (ch == "\\") return "\\"
      return match
    })
  }

  function parseQuery(query) {
    var isRE = query.match(/^\/(.*)\/([a-z]*)$/);
    if (isRE) {
      try { query = new RegExp(isRE[1], isRE[2].indexOf("i") == -1 ? "" : "i"); }
      catch(e) {} // Not a regular expression after all, do a string search
    } else {
      query = parseString(query)
    }
    if (typeof query == "string" ? query == "" : query.test(""))
      query = /x^/;
    return query;
  }

  function startSearch(cm, state, query) {
    state.queryText = query;
    state.query = parseQuery(query);
    cm.removeOverlay(state.overlay, queryCaseInsensitive(state.query));
    state.overlay = searchOverlay(state.query, queryCaseInsensitive(state.query));
    cm.addOverlay(state.overlay);
    if (cm.showMatchesOnScrollbar) {
      if (state.annotate) { state.annotate.clear(); state.annotate = null; }
      state.annotate = cm.showMatchesOnScrollbar(state.query, queryCaseInsensitive(state.query));
    }
  }

  function doSearch(cm, rev, persistent, immediate) {
    var state = getSearchState(cm);
    if (state.query) return findNext(cm, rev);
    var q = cm.getSelection() || state.lastQuery;
    if (q instanceof RegExp && q.source == "x^") q = null
    if (persistent && cm.openDialog) {
      var hiding = null
      var searchNext = function(query, event) {
        CodeMirror.e_stop(event);
        if (!query) return;
        if (query != state.queryText) {
          startSearch(cm, state, query);
          state.posFrom = state.posTo = cm.getCursor();
        }
        if (hiding) hiding.style.opacity = 1
        findNext(cm, event.shiftKey, function(_, to) {
          var dialog
          if (to.line < 3 && document.querySelector &&
              (dialog = cm.display.wrapper.querySelector(".CodeMirror-dialog")) &&
              dialog.getBoundingClientRect().bottom - 4 > cm.cursorCoords(to, "window").top)
            (hiding = dialog).style.opacity = .4
        })
      };
      persistentDialog(cm, getQueryDialog(cm), q, searchNext, function(event, query) {
        var keyName = CodeMirror.keyName(event)
        var extra = cm.getOption('extraKeys'), cmd = (extra && extra[keyName]) || CodeMirror.keyMap[cm.getOption("keyMap")][keyName]
        if (cmd == "findNext" || cmd == "findPrev" ||
          cmd == "findPersistentNext" || cmd == "findPersistentPrev") {
          CodeMirror.e_stop(event);
          startSearch(cm, getSearchState(cm), query);
          cm.execCommand(cmd);
        } else if (cmd == "find" || cmd == "findPersistent") {
          CodeMirror.e_stop(event);
          searchNext(query, event);
        }
      });
      if (immediate && q) {
        startSearch(cm, state, q);
        findNext(cm, rev);
      }
    } else {
      dialog(cm, getQueryDialog(cm), "Search for:", q, function(query) {
        if (query && !state.query) cm.operation(function() {
          startSearch(cm, state, query);
          state.posFrom = state.posTo = cm.getCursor();
          findNext(cm, rev);
        });
      });
    }
  }

  function findNext(cm, rev, callback) {cm.operation(function() {
    var state = getSearchState(cm);
    var cursor = getSearchCursor(cm, state.query, rev ? state.posFrom : state.posTo);
    if (!cursor.find(rev)) {
      cursor = getSearchCursor(cm, state.query, rev ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
      if (!cursor.find(rev)) return;
    }
    cm.setSelection(cursor.from(), cursor.to());
    cm.scrollIntoView({from: cursor.from(), to: cursor.to()}, 20);
    state.posFrom = cursor.from(); state.posTo = cursor.to();
    if (callback) callback(cursor.from(), cursor.to())
  });}

  function clearSearch(cm) {cm.operation(function() {
    var state = getSearchState(cm);
    state.lastQuery = state.query;
    if (!state.query) return;
    state.query = state.queryText = null;
    cm.removeOverlay(state.overlay);
    if (state.annotate) { state.annotate.clear(); state.annotate = null; }
  });}

  function el(tag, attrs) {
    var element = tag ? document.createElement(tag) : document.createDocumentFragment();
    for (var key in attrs) {
      element[key] = attrs[key];
    }
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i]
      element.appendChild(typeof child == "string" ? document.createTextNode(child) : child);
    }
    return element;
  }

  function getQueryDialog(cm)  {
    return el("", null,
              el("span", {className: "CodeMirror-search-label"}, cm.phrase("Search:")), " ",
              el("input", {type: "text", "style": "width: 10em", className: "CodeMirror-search-field"}), " ",
              el("span", {style: "color: #888", className: "CodeMirror-search-hint"},
                 cm.phrase("(Use /re/ syntax for regexp search)")));
  }
  function getReplaceQueryDialog(cm) {
    return el("", null, " ",
              el("input", {type: "text", "style": "width: 10em", className: "CodeMirror-search-field"}), " ",
              el("span", {style: "color: #888", className: "CodeMirror-search-hint"},
                 cm.phrase("(Use /re/ syntax for regexp search)")));
  }
  function getReplacementQueryDialog(cm) {
    return el("", null,
              el("span", {className: "CodeMirror-search-label"}, cm.phrase("With:")), " ",
              el("input", {type: "text", "style": "width: 10em", className: "CodeMirror-search-field"}));
  }
  function getDoReplaceConfirm(cm) {
    return el("", null,
              el("span", {className: "CodeMirror-search-label"}, cm.phrase("Replace?")), " ",
              el("button", {}, cm.phrase("Yes")), " ",
              el("button", {}, cm.phrase("No")), " ",
              el("button", {}, cm.phrase("All")), " ",
              el("button", {}, cm.phrase("Stop")));
  }

  function replaceAll(cm, query, text) {
    cm.operation(function() {
      for (var cursor = getSearchCursor(cm, query); cursor.findNext();) {
        if (typeof query != "string") {
          var match = cm.getRange(cursor.from(), cursor.to()).match(query);
          cursor.replace(text.replace(/\$(\d)/g, function(_, i) {return match[i];}));
        } else cursor.replace(text);
      }
    });
  }

  function replace(cm, all) {
    if (cm.getOption("readOnly")) return;
    var query = cm.getSelection() || getSearchState(cm).lastQuery;
    var dialogText = all ? cm.phrase("Replace all:") : cm.phrase("Replace:")
    var fragment = el("", null,
                      el("span", {className: "CodeMirror-search-label"}, dialogText),
                      getReplaceQueryDialog(cm))
    dialog(cm, fragment, dialogText, query, function(query) {
      if (!query) return;
      query = parseQuery(query);
      dialog(cm, getReplacementQueryDialog(cm), cm.phrase("Replace with:"), "", function(text) {
        text = parseString(text)
        if (all) {
          replaceAll(cm, query, text)
        } else {
          clearSearch(cm);
          var cursor = getSearchCursor(cm, query, cm.getCursor("from"));
          var advance = function() {
            var start = cursor.from(), match;
            if (!(match = cursor.findNext())) {
              cursor = getSearchCursor(cm, query);
              if (!(match = cursor.findNext()) ||
                  (start && cursor.from().line == start.line && cursor.from().ch == start.ch)) return;
            }
            cm.setSelection(cursor.from(), cursor.to());
            cm.scrollIntoView({from: cursor.from(), to: cursor.to()});
            confirmDialog(cm, getDoReplaceConfirm(cm), cm.phrase("Replace?"),
                          [function() {doReplace(match);}, advance,
                           function() {replaceAll(cm, query, text)}]);
          };
          var doReplace = function(match) {
            cursor.replace(typeof query == "string" ? text :
                           text.replace(/\$(\d)/g, function(_, i) {return match[i];}));
            advance();
          };
          advance();
        }
      });
    });
  }

  CodeMirror.commands.find = function(cm) {clearSearch(cm); doSearch(cm);};
  CodeMirror.commands.findPersistent = function(cm) {clearSearch(cm); doSearch(cm, false, true);};
  CodeMirror.commands.findPersistentNext = function(cm) {doSearch(cm, false, true, true);};
  CodeMirror.commands.findPersistentPrev = function(cm) {doSearch(cm, true, true, true);};
  CodeMirror.commands.findNext = doSearch;
  CodeMirror.commands.findPrev = function(cm) {doSearch(cm, true);};
  CodeMirror.commands.clearSearch = clearSearch;
  CodeMirror.commands.replace = replace;
  CodeMirror.commands.replaceAll = function(cm) {replace(cm, true);};
});
                                                                fYîf\ÅfpìNfYõf\Ö(3fYæfXÌfYîfXÝ(` (` (ì(s fYîfXÅfpìNfYõfXÖ(s0fYæfXÌfYîfXÝ(`0(ìfYîf\ÅfpìNfYõf\Ö(s fYæfXÌfYîfXÝƒÿŽÇ  ( €   (x@(ï(s@fYîfXÅfpïNfYõfXÖ(sPfYþfXÏfYîfXÝ(xP(ïfYîf\ÅfpïNfYõf\Ö(s@fYþfXÏfYîfXÝ(x`(x`(ï(s`fYîfXÅfpïNfYõfXÖ(spfYþfXÏfYîfXÝ(xp(ïfYîf\ÅfpïNfYõf\Ö(s`fYþfXÏfYîfXÝƒÿŽë  (¸À   ( €   (ì(³€   fYîfXÅfpìNfYõfXÖ(³   fYæfXÌfYîfXÝ(    (ìfYîf\ÅfpìNfYõf\Ö(³€   fYæfXÌfYîfXÝ(     (     (ì(³    fYîfXÅfpìNfYõfXÖ(³°   fYæfXÌfYîfXÝ( °   (ìfYîf\ÅfpìNfYõf\Ö(³    fYæfXÌfYîfXÝƒÿŽî  (    (¸À   (ï(³À   fYîfXÅfpïNfYõfXÖ(³Ð   fYþfXÏfYîfXÝ(¸Ð   (ïfYîf\ÅfpïNfYõf\Ö(³À   fYþfXÏfYîfXÝ(¸à   (¸à   (ï(³à   fYîfXÅfpïNfYõfXÖ(³ð   fYþfXÏfYîfXÝ(¸ð   (ïfYîf\ÅfpïNfYõf\Ö(³à   fYþfXÏfYîfXÝƒÿŽñ  (¸@  (    (ì(³   fYîfXÅfpìNfYõfXÖ(³  fYæfXÌfYîfXÝ(   (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXÝ(    (    (ì(³   fYîfXÅfpìNfYõfXÖ(³0  fYæfXÌfYîfXÝ( 0  (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXÝƒÿ
Žô  ( €  (¸@  (ï(³@  fYîfXÅfpïNfYõfXÖ(³P  fYþfXÏfYîfXÝ(¸P  (ïfYîf\ÅfpïNfYõf\Ö(³@  fYþfXÏfYîfXÝ(¸`  (¸`  (ï(³`  fYîfXÅfpïNfYõfXÖ(³p  fYþfXÏfYîfXÝ(¸p  (ïfYîf\ÅfpïNfYõf\Ö(³`  fYþfXÏfYîfXÝƒÿŽ÷  (¸À  ( €  (ì(³€  fYîfXÅfpìNfYõfXÖ(³  fYæfXÌfYîfXÝ(   (ìfYîf\ÅfpìNfYõf\Ö(³€  fYæfXÌfYîfXÝ(    (    (ì(³   fYîfXÅfpìNfYõfXÖ(³°  fYæfXÌfYîfXÝ( °  (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXÝƒÿŽú   (    (¸À  (ï(³À  fYîfXÅfpïNfYõfXÖ(³Ð  fYþfXÏfYîfXÝ(¸Ð  (ïfYîf\ÅfpïNfYõf\Ö(³À  fYþfXÏfYîfXÝ(¸à  (¸à  (ï(³à  fYîfXÅfpïNfYõfXÖ(³ð  fYþfXÏfYîfXÝ(¸ð  (ïfYîf\ÅfpïNfYõf\Ö(³à  fYþfXÏfYîfXÝƒÿ~‹´$X  ƒþ u4(àfÁfá(òfÓfófXfXQ))Që\¤$        (àfÁfá(òfÓfóò)fifXÅòyfyfX×òfAòQfQ¤$        ‹„$<  „$l  ‰„$<  ‹Œ$D  ƒÁ ‰Œ$D  ‹œ$Ø  ‹¼$t  ƒï‰¼$t  ³ÿÿ¤$        Ä  []^_Ã    WVUSì  3ö¿   3ö3í¿   ‹„$¨  ‹ ‹ØƒàNƒøNE÷‰´$T  ƒãCƒûCEï‰¬$P  ‹´$°  ‹6‰´$„  ‹„$¬  ‹ ‰„$€  ‹¼$´  ‹?‰¼$|  ‰¼$h  ‹÷ƒæ‰´$d  ‹ßÑïGÑçƒþ Eß‰œ$h  ‹´$h  ƒæÑæÁæ‰´$$  ‹œ$À  ‹Áã‰œ$l  ‹´$È  ‹6Áæ‰´$L  ‹¼$Ô  ‹?‹ÇÑà+„$€  Áà‰„$,  ‹ÇÁà+„$€  Áà‰„$0  ‹ÇÁàx+„$€  Áà‰„$4  ‹ÇÁà+„$€  Áà‰„$8  Áç‰¼$\  ‹Œ$Ð  ‰Œ$D  ‹éƒå‹¼$\  ƒçï‰¬$X  ‹¬$Ä  ‰¬$`  ‹œ$Ø  ‹Û‹„$¼  ‰„$<  ‹¼$„  ƒï‰¼$x  Œ)Q  ¤$    ‹ÿÇ„$H     ‹¼$|  ‹”$L  ‹¬$`  ‹´$H  ‹„$T  ƒø …ù   ¤$    ‹ÿfïÀ(È¤$    ‹ÿƒÿ|[òe    òmòuò}f$*œ*   fl*ft*f|*)#‹   )k)s ){0ƒÅ ƒÃ@ƒïë ‹¼$d  ƒÿ tDòe    òmf$*œ*   fl*)#‹   )k)C )C0ƒÃ@¤$    ‹¬$`  lU ‰¬$`  ‹¼$|  ƒîÿÿÿé
  ¤$    ‹ÿ‹„$P  ƒø „   fïÀ(È¤$    ‹ÿƒÿ|kòe    feœ*   òmfmò4*ft*ò|*f|*)#‹   )k)s ){0lU ƒÃ@ƒïëŸ¤$    ¤$    ‹¼$d  ƒÿ tDòe    feœ*   òmfm)#‹   )k)C )C0ƒÃ@¤$    ‹¬$`  ƒÅ ‰¬$`  ‹¼$|  ƒîÿÿÿéû   ¤$    I fïÀ(È¤$    ‹ÿƒÿ|kòe    feœ*   òmfmò4*ft*ò|*f|*)#‹   f\Å)C)s f\Ï)K0WÀWÉlU ƒÃ@ƒïë‘‹¼$d  ƒÿ tDòe    feœ*   òmfm)#‹   f\Å)CWÀ)C )C0ƒÃ@‹¬$`  ƒÅ ‰¬$`  ‹¼$|  ƒîÿÿÿ‹œ$Ø  ‹„$¼  ‰„$<  ‹¼$€  ƒï‰¼$t  Œ“M  ‹”$\  ‹¬$H      ( fïÀ(È(Ð(Ø(kI L
 ‹¼$h  ÿ€   ŒÐ<  (x@( (ì(3fYîfXÅfpìNfYõfXÖ(sfYæfXÌfYîfXÝ(`(ìfYîf\ÅfpìNfYõf\Ö(3fYæfXÌfYîfXÝ(` (` (ì(s fYîfXÅfpìNfYõfXÖ(s0fYæfXÌfYîfXÝ(`0(ìfYîf\ÅfpìNfYõf\Ö(s fYæfXÌfYîfXÝ( €   (x@(ï(s@fYîfXÅfpïNfYõfXÖ(sPfYþfXÏfYîfXÝ(xP(ïfYîf\ÅfpïNfYõf\Ö(s@fYþfXÏfYîfXÝ(x`(x`(ï(s`fYîfXÅfpïNfYõfXÖ(spfYþfXÏfYîfXÝ(xp(ïfYîf\ÅfpïNfYõf\Ö(s`fYþfXÏfYîfXÝ(¸À   ( €   (ì(³€   fYîfXÅfpìNfYõfXÖ(³   fYæfXÌfYîfXÝ(    (ìfYîf\ÅfpìNfYõf\Ö(³€   fYæfXÌfYîfXÝ(     (     (ì(³    fYîfXÅfpìNfYõfXÖ(³°   fYæfXÌfYîfXÝ( °   (ìfYîf\ÅfpìNfYõf\Ö(³    fYæfXÌfYîfXÝ(    (¸À   (ï(³À   fYîfXÅfpïNfYõfXÖ(³Ð   fYþfXÏfYîfXÝ(¸Ð   (ïfYîf\ÅfpïNfYõf\Ö(³À   fYþfXÏfYîfXÝ(¸à   (¸à   (ï(³à   fYîfXÅfpïNfYõfXÖ(³ð   fYþfXÏfYîfXÝ(¸ð   (ïfYîf\ÅfpïNfYõf\Ö(³à   fYþfXÏfYîfXÝ(¸@  (    (ì(³   fYîfXÅfpìNfYõfXÖ(³  fYæfXÌfYîfXÝ(   (ìfYîf\ÅfpìNfYõf\Ö(³   fYæfXÌfYîfXÝ(    (    (ì(³   fYîfXÅfpìNfYõfXÖ(³0  fYæfXÌfYîfXÝ( 0  (ìfYîf\ÅfpìNfY return pass()
    return cont(pushlex(")"), maybeexpression, expect(")"), poplex)
  }
  function expressionInner(type, value, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef, maybeop);
    if (type == "class" || (isTS && value == "interface")) { cx.marked = "keyword"; return cont(pushlex("form"), classExpression, poplex); }
    if (type == "keyword c" || type == "async") return cont(noComma ? expressionNoComma : expression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    if (type == "quasi") return pass(quasi, maybeop);
    if (type == "new") return cont(maybeTarget(noComma));
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(maybeexpression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value) || isTS && value == "!") return cont(me);
      if (isTS && value == "<" && cx.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, false))
        return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { return pass(quasi, me); }
    if (type == ";") return;
    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
    if (isTS && value == "as") { cx.marked = "keyword"; return cont(typeexpr, me) }
    if (type == "regexp") {
      cx.state.lastType = cx.marked = "operator"
      cx.stream.backUp(cx.stream.pos - cx.stream.start - 1)
      return cont(expr)
    }
  }
  function quasi(type, value) {
    if (type != "quasi") return pass();
    if (value.slice(value.length - 2) != "${") return cont(quasi);
    return cont(maybeexpression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont(quasi);
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expressionNoComma);
  }
  function maybeTarget(noComma) {
    return function(type) {
      if (type == ".") return cont(noComma ? targetNoComma : target);
      else if (type == "variable" && isTS) return cont(maybeTypeArgs, noComma ? maybeoperatorNoComma : maybeoperatorComma)
      else return pass(noComma ? expressionNoComma : expression);
    };
  }
  function target(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorComma); }
  }
  function targetNoComma(_, value) {
    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorNoComma); }
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "async") {
      cx.marked = "property";
      return cont(objprop);
    } else if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
      var m // Work around fat-arrow-detection complication for detecting typescript typed arrow params
      if (isTS && cx.state.fatArrowAt == cx.stream.start && (m = cx.stream.match(/^\s*:\s*/, false)))
        cx.state.fatArrowAt = cx.stream.pos + m[0].length
      return cont(afterprop);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (cx.style + " property");
      return cont(afterprop);
    } else if (type == "jsonld-keyword") {
      return cont(afterprop);
    } else if (isTS && isModifier(value)) {
      cx.marked = "keyword"
      return cont(objprop)
    } else if (type == "[") {
      return cont(expression, maybetype, expect("]"), afterprop);
    } else if (type == "spread") {
      return cont(expressionNoComma, afterprop);
    } else if (value == "*") {
      cx.marked = "keyword";
      return cont(objprop);
    } else if (type == ":") {
      return pass(afterprop)
    }
  }
  function getterSetter(type) {
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ":") return cont(expressionNoComma);
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end, sep) {
    function proceed(type, value) {
      if (sep ? sep.indexOf(type) > -1 : type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(function(type, value) {
          if (type == end || value == end) return pass()
          return pass(what)
        }, proceed);
      }
      if (type == end || value == end) return cont();
      if (sep && sep.indexOf(";") > -1) return pass(what)
      return cont(expect(end));
    }
    return function(type, value) {
      if (type == end || value == end) return cont();
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++)
      cx.cc.push(arguments[i]);
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type, value) {
    if (isTS) {
      if (type == ":") return cont(typeexpr);
      if (value == "?") return cont(maybetype);
    }
  }
  function maybetypeOrIn(type, value) {
    if (isTS && (type == ":" || value == "in")) return cont(typeexpr)
  }
  function mayberettype(type) {
    if (isTS && type == ":") {
      if (cx.stream.match(/^\s*\w+\s+is\b/, false)) return cont(expression, isKW, typeexpr)
      else return cont(typeexpr)
    }
  }
  function isKW(_, value) {
    if (value == "is") {
      cx.marked = "keyword"
      return cont()
    }
  }
  function typeexpr(type, value) {
    if (value == "keyof" || value == "typeof" || value == "infer" || value == "readonly") {
      cx.marked = "keyword"
      return cont(value == "typeof" ? expressionNoComma : typeexpr)
    }
    if (type == "variable" || value == "void") {
      cx.marked = "type"
      return cont(afterType)
    }
    if (value == "|" || value == "&") return cont(typeexpr)
    if (type == "string" || type == "number" || type == "atom") return cont(afterType);
    if (type == "[") return cont(pushlex("]"), commasep(typeexpr, "]", ","), poplex, afterType)
    if (type == "{") return cont(pushlex("}"), typeprops, poplex, afterType)
    if (type == "(") return cont(commasep(typearg, ")"), maybeReturnType, afterType)
    if (type == "<") return cont(commasep(typeexpr, ">"), typeexpr)
    if (type == "quasi") { return pass(quasiType, afterType); }
  }
  function maybeReturnType(type) {
    if (type == "=>") return cont(typeexpr)
  }
  function typeprops(type) {
    if (type.match(/[\}\)\]]/)) return cont()
    if (type == "," || type == ";") return cont(typeprops)
    return pass(typeprop, typeprops)
  }
  function typeprop(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property"
      return cont(typeprop)
    } else if (value == "?" || type == "number" || type == "string") {
      return cont(typeprop)
    } else if (type == ":") {
      return cont(typeexpr)
    } else if (type == "[") {
      return cont(expect("variable"), maybetypeOrIn, expect("]"), typeprop)
    } else if (type == "(") {
      return pass(functiondecl, typeprop)
    } else if (!type.match(/[;\}\)\],]/)) {
      return cont()
    }
  }
  function quasiType(type, value) {
    if (type != "quasi") return pass();
    if (value.slice(value.length - 2) != "${") return cont(quasiType);
    return cont(typeexpr, continueQuasiType);
  }
  function continueQuasiType(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont(quasiType);
    }
  }
  function typearg(type, value) {
    if (type == "variable" && cx.stream.match(/^\s*[?:]/, false) || value == "?") return cont(typearg)
    if (type == ":") return cont(typeexpr)
    if (type == "spread") return cont(typearg)
    return pass(typeexpr)
  }
  function afterType(type, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
    if (value == "|" || type == "." || value == "&") return cont(typeexpr)
    if (type == "[") return cont(typeexpr, expect("]"), afterType)
    if (value == "extends" || value == "implements") { cx.marked = "keyword"; return cont(typeexpr) }
    if (value == "?") return cont(typeexpr, expect(":"), typeexpr)
  }
  function maybeTypeArgs(_, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeexpr, ">"), poplex, afterType)
  }
  function typeparam() {
    return pass(typeexpr, maybeTypeDefault)
  }
  function maybeTypeDefault(_, value) {
    if (value == "=") return cont(typeexpr)
  }
  function vardef(_, value) {
    if (value == "enum") {cx.marked = "keyword"; return cont(enumdef)}
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(pattern) }
    if (type == "variable") { register(value); return cont(); }
    if (type == "spread") return cont(pattern);
    if (type == "[") return contCommasep(eltpattern, "]");
    if (type == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    if (type == "spread") return cont(pattern);
    if (type == "}") return pass();
    if (type == "[") return cont(expression, expect(']'), expect(':'), proppattern);
    return cont(expect(":"), pattern, maybeAssign);
  }
  function eltpattern() {
    return pass(pattern, maybeAssign)
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
  }
  function forspec(type, value) {
    if (value == "await") return cont(forspec);
    if (type == "(") return cont(pushlex(")"), forspec1, poplex);
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef, forspec2);
    if (type == "variable") return cont(forspec2);
    return pass(forspec2)
  }
  function forspec2(type, value) {
    if (type == ")") return cont()
    if (type == ";") return cont(forspec2)
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression, forspec2) }
    return pass(expression, forspec2)
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, statement, popcontext);
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondef)
  }
  function functiondecl(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondecl);}
    if (type == "variable") {register(value); return cont(functiondecl);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, mayberettype, popcontext);
    if (isTS && value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, functiondecl)
  }
  function typename(type, value) {
    if (type == "keyword" || type == "variable") {
      cx.marked = "type"
      return cont(typename)
    } else if (value == "<") {
      return cont(pushlex(">"), commasep(typeparam, ">"), poplex)
    }
  }
  function funarg(type, value) {
    if (value == "@") cont(expression, funarg)
    if (type == "spread") return cont(funarg);
    if (isTS && isModifier(value)) { cx.marked = "keyword"; return cont(funarg); }
    if (isTS && type == "this") return cont(maybetype, maybeAssign)
    return pass(pattern, maybetype, maybeAssign);
  }
  function classExpression(type, value) {
    // Class expressions may have an optional name.
    if (type == "variable") return className(type, value);
    return classNameAfter(type, value);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(type, value) {
    if (value == "<") return cont(pushlex(">"), commasep(typeparam, ">"), poplex, classNameAfter)
    if (value == "extends" || value == "implements" || (isTS && type == ",")) {
      if (value == "implements") cx.marked = "keyword";
      return cont(isTS ? typeexpr : expression, classNameAfter);
    }
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "async" ||
        (type == "variable" &&
         (value == "static" || value == "get" || value == "set" || (isTS && isModifier(value))) &&
         cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false))) {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      return cont(classfield, classBody);
    }
    if (type == "number" || type == "string") return cont(classfield, classBody);
    if (type == "[")
      return cont(expression, maybetype, expect("]"), classfield, classBody)
    if (value == "*") {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (isTS && type == "(") return pass(functiondecl, classBody)
    if (type == ";" || type == ",") return cont(classBody);
    if (type == "}") return cont();
    if (value == "@") return cont(expression, classBody)
  }
  function classfield(type, value) {
    if (value == "!") return cont(classfield)
    if (value == "?") return cont(classfield)
    if (type == ":") return cont(typeexpr, maybeAssign)
    if (value == "=") return cont(expressionNoComma)
    var context = cx.state.lexical.prev, isInterface = context && context.info == "interface"
    return pass(isInterface ? functiondecl : functiondef)
  }
  function afterExport(type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    if (type == "{") return cont(commasep(exportField, "}"), maybeFrom, expect(";"));
    return pass(statement);
  }
  function exportField(type, value) {
    if (value == "as") { cx.marked = "keyword"; return cont(expect("variable")); }
    if (type == "variable") return pass(expressionNoComma, exportField);
  }
  func