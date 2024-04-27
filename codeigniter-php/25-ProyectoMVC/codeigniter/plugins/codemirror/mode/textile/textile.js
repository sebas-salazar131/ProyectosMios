// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") { // CommonJS
    mod(require("../../lib/codemirror"));
  } else if (typeof define == "function" && define.amd) { // AMD
    define(["../../lib/codemirror"], mod);
  } else { // Plain browser env
    mod(CodeMirror);
  }
})(function(CodeMirror) {
  "use strict";

  var TOKEN_STYLES = {
    addition: "positive",
    attributes: "attribute",
    bold: "strong",
    cite: "keyword",
    code: "atom",
    definitionList: "number",
    deletion: "negative",
    div: "punctuation",
    em: "em",
    footnote: "variable",
    footCite: "qualifier",
    header: "header",
    html: "comment",
    image: "string",
    italic: "em",
    link: "link",
    linkDefinition: "link",
    list1: "variable-2",
    list2: "variable-3",
    list3: "keyword",
    notextile: "string-2",
    pre: "operator",
    p: "property",
    quote: "bracket",
    span: "quote",
    specialChar: "tag",
    strong: "strong",
    sub: "builtin",
    sup: "builtin",
    table: "variable-3",
    tableHeading: "operator"
  };

  function startNewLine(stream, state) {
    state.mode = Modes.newLayout;
    state.tableHeading = false;

    if (state.layoutType === "definitionList" && state.spanningLayout &&
        stream.match(RE("definitionListEnd"), false))
      state.spanningLayout = false;
  }

  function handlePhraseModifier(stream, state, ch) {
    if (ch === "_") {
      if (stream.eat("_"))
        return togglePhraseModifier(stream, state, "italic", /__/, 2);
      else
        return togglePhraseModifier(stream, state, "em", /_/, 1);
    }

    if (ch === "*") {
      if (stream.eat("*")) {
        return togglePhraseModifier(stream, state, "bold", /\*\*/, 2);
      }
      return togglePhraseModifier(stream, state, "strong", /\*/, 1);
    }

    if (ch === "[") {
      if (stream.match(/\d+\]/)) state.footCite = true;
      return tokenStyles(state);
    }

    if (ch === "(") {
      var spec = stream.match(/^(r|tm|c)\)/);
      if (spec)
        return tokenStylesWith(state, TOKEN_STYLES.specialChar);
    }

    if (ch === "<" && stream.match(/(\w+)[^>]+>[^<]+<\/\1>/))
      return tokenStylesWith(state, TOKEN_STYLES.html);

    if (ch === "?" && stream.eat("?"))
      return togglePhraseModifier(stream, state, "cite", /\?\?/, 2);

    if (ch === "=" && stream.eat("="))
      return togglePhraseModifier(stream, state, "notextile", /==/, 2);

    if (ch === "-" && !stream.eat("-"))
      return togglePhraseModifier(stream, state, "deletion", /-/, 1);

    if (ch === "+")
      return togglePhraseModifier(stream, state, "addition", /\+/, 1);

    if (ch === "~")
      return togglePhraseModifier(stream, state, "sub", /~/, 1);

    if (ch === "^")
      return togglePhraseModifier(stream, state, "sup", /\^/, 1);

    if (ch === "%")
      return togglePhraseModifier(stream, state, "span", /%/, 1);

    if (ch === "@")
      return togglePhraseModifier(stream, state, "code", /@/, 1);

    if (ch === "!") {
      var type = togglePhraseModifier(stream, state, "image", /(?:\([^\)]+\))?!/, 1);
      stream.match(/^:\S+/); // optional Url portion
      return type;
    }
    return tokenStyles(state);
  }

  function togglePhraseModifier(stream, state, phraseModifier, closeRE, openSize) {
    var charBefore = stream.pos > openSize ? stream.string.charAt(stream.pos - openSize - 1) : null;
    var charAfter = stream.peek();
    if (state[phraseModifier]) {
      if ((!charAfter || /\W/.test(charAfter)) && charBefore && /\S/.test(charBefore)) {
        var type = tokenStyles(state);
        state[phraseModifier] = false;
        return type;
      }
    } else if ((!charBefore || /\W/.test(charBefore)) && charAfter && /\S/.test(charAfter) &&
               stream.match(new RegExp("^.*\\S" + closeRE.source + "(?:\\W|$)"), false)) {
      state[phraseModifier] = true;
      state.mode = Modes.attributes;
    }
    return tokenStyles(state);
  };

  function tokenStyles(state) {
    var disabled = textileDisabled(state);
    if (disabled) return disabled;

    var styles = [];
    if (state.layoutType) styles.push(TOKEN_STYLES[state.layoutType]);

    styles = styles.concat(activeStyles(
      state, "addition", "bold", "cite", "code", "deletion", "em", "footCite",
      "image", "italic", "link", "span", "strong", "sub", "sup", "table", "tableHeading"));

    if (state.layoutType === "header")
      styles.push(TOKEN_STYLES.header + "-" + state.header);

    return styles.length ? styles.join(" ") : null;
  }

  function textileDisabled(state) {
    var type = state.layoutType;

    switch(type) {
    case "notextile":
    case "code":
    case "pre":
      return TOKEN_STYLES[type];
    default:
      if (state.notextile)
        return TOKEN_STYLES.notextile + (type ? (" " + TOKEN_STYLES[type]) : "");
      return null;
    }
  }

  function tokenStylesWith(state, extraStyles) {
    var disabled = textileDisabled(state);
    if (disabled) return disabled;

    var type = tokenStyles(state);
    if (extraStyles)
      return type ? (type + " " + extraStyles) : extraStyles;
    else
      return type;
  }

  function activeStyles(state) {
    var styles = [];
    for (var i = 1; i < arguments.length; ++i) {
      if (state[arguments[i]])
        styles.push(TOKEN_STYLES[arguments[i]]);
    }
    return styles;
  }

  function blankLine(state) {
    var spanningLayout = state.spanningLayout, type = state.layoutType;

    for (var key in state) if (state.hasOwnProperty(key))
      delete state[key];

    state.mode = Modes.newLayout;
    if (spanningLayout) {
      state.layoutType = type;
      state.spanningLayout = true;
    }
  }

  var REs = {
    cache: {},
    single: {
      bc: "bc",
      bq: "bq",
      definitionList: /- .*?:=+/,
      definitionListEnd: /.*=:\s*$/,
      div: "div",
      drawTable: /\|.*\|/,
      foot: /fn\d+/,
      header: /h[1-6]/,
      html: /\s*<(?:\/)?(\w+)(?:[^>]+)?>(?:[^<]+<\/\1>)?/,
      link: /[^"]+":\S/,
      linkDefinition: /\[[^\s\]]+\]\S+/,
      list: /(?:#+|\*+)/,
      notextile: "notextile",
      para: "p",
      pre: "pre",
      table: "table",
      tableCellAttributes: /[\/\\]\d+/,
      tableHeading: /\|_\./,
      tableText: /[^"_\*\[\(\?\+~\^%@|-]+/,
      text: /[^!"_=\*\[\(<\?\+~\^%@-]+/
    },
    attributes: {
      align: /(?:<>|<|>|=)/,
      selector: /\([^\(][^\)]+\)/,
      lang: /\[[^\[\]]+\]/,
      pad: /(?:\(+|\)+){1,2}/,
      css: /\{[^\}]+\}/
    },
    createRe: function(name) {
      switch (name) {
      case "drawTable":
        return REs.makeRe("^", REs.single.drawTable, "$");
      case "html":
        return REs.makeRe("^", REs.single.html, "(?:", REs.single.html, ")*", "$");
      case "linkDefinition":
        return REs.makeRe("^", REs.single.linkDefinition, "$");
      case "listLayout":
        return REs.makeRe("^", REs.single.list, RE("allAttributes"), "*\\s+");
      case "tableCellAttributes":
        return REs.makeRe("^", REs.choiceRe(REs.single.tableCellAttributes,
                                            RE("allAttributes")), "+\\.");
      case "type":
        return REs.makeRe("^", RE("allTypes"));
      case "typeLayout":
        return REs.makeRe("^", RE("allTypes"), RE("allAttributes"),
                          "*\\.\\.?", "(\\s+|$)");
      case "attributes":
        return REs.makeRe("^", RE("allAttributes"), "+");

      case "allTypes":
        return REs.choiceRe(REs.single.div, REs.single.foot,
                            REs.single.header, REs.single.bc, REs.single.bq,
                            REs.single.notextile, REs.single.pre, REs.single.table,
                            REs.single.para);

      case "allAttributes":
        return REs.choiceRe(REs.attributes.selector, REs.attributes.css,
                            REs.attributes.lang, REs.attributes.align, REs.attributes.pad);

      default:
        return REs.makeRe("^", REs.single[name]);
      }
    },
    makeRe: function() {
      var pattern = "";
      for (var i = 0; i < arguments.length; ++i) {
        var arg = arguments[i];
        pattern += (typeof arg === "string") ? arg : arg.source;
      }
      return new RegExp(pattern);
    },
    choiceRe: function() {
      var parts = [arguments[0]];
      for (var i = 1; i < arguments.length; ++i) {
        parts[i * 2 - 1] = "|";
        parts[i * 2] = arguments[i];
      }

      parts.unshift("(?:");
      parts.push(")");
      return REs.makeRe.apply(null, parts);
    }
  };

  function RE(name) {
    return (REs.cache[name] || (REs.cache[name] = REs.createRe(name)));
  }

  var Modes = {
    newLayout: function(stream, state) {
      if (stream.match(RE("typeLayout"), false)) {
        state.spanningLayout = false;
        return (state.mode = Modes.blockType)(stream, state);
      }
      var newMode;
      if (!textileDisabled(state)) {
        if (stream.match(RE("listLayout"), false))
          newMode = Modes.list;
        else if (stream.match(RE("drawTable"), false))
          newMode = Modes.table;
        else if (stream.match(RE("linkDefinition"), false))
          newMode = Modes.linkDefinition;
        else if (stream.match(RE("definitionList")))
          newMode = Modes.definitionList;
        else if (stream.match(RE("html"), false))
          newMode = Modes.html;
      }
      return (state.mode = (newMode || Modes.text))(stream, state);
    },

    blockType: function(stream, state) {
      var match, type;
      state.layoutType = null;

      if (match = stream.match(RE("type")))
        type = match[0];
      else
        return (state.mode = Modes.text)(stream, state);

      if (match = type.match(RE("header"))) {
        state.layoutType = "header";
        state.header = parseInt(match[0][1]);
      } else if (type.match(RE("bq"))) {
        state.layoutType = "quote";
      } else if (type.match(RE("bc"))) {
        state.layoutType = "code";
      } else if (type.match(RE("foot"))) {
        state.layoutType = "footnote";
      } else if (type.match(RE("notextile"))) {
        state.layoutType = "notextile";
      } else if (type.match(RE("pre"))) {
        state.layoutType = "pre";
      } else if (type.match(RE("div"))) {
        state.layoutType = "div";
      } else if (type.match(RE("table"))) {
        state.layoutType = "table";
      }

      state.mode = Modes.attributes;
      return tokenStyles(state);
    },

    text: function(stream, state) {
      if (stream.match(RE("text"))) return tokenStyles(state);

      var ch = stream.next();
      if (ch === '"')
        return (state.mode = Modes.link)(stream, state);
      return handlePhraseModifier(stream, state, ch);
    },

    attributes: function(stream, state) {
      state.mode = Modes.layoutLength;

      if (stream.match(RE("attributes")))
        return tokenStylesWith(state, TOKEN_STYLES.attributes);
      else
        return tokenStyles(state);
    },

    layoutLength: function(stream, state) {
      if (stream.eat(".") && stream.eat("."))
        state.spanningLayout = true;

      state.mode = Modes.text;
      return tokenStyles(state);
    },

    list: function(stream, state) {
      var match = stream.match(RE("list"));
      state.listDepth = match[0].length;
      var listMod = (state.listDepth - 1) % 3;
      if (!listMod)
        state.layoutType = "list1";
      else if (listMod === 1)
        state.layoutType = "list2";
      else
        state.layoutType = "list3";

      state.mode = Modes.attributes;
      return tokenStyles(state);
    },

    link: function(stream, state) {
      state.mode = Modes.text;
      if (stream.match(RE("link"))) {
        stream.match(/\S+/);
        return tokenStylesWith(state, TOKEN_STYLES.link);
      }
      return tokenStyles(state);
    },

    linkDefinition: function(stream, state) {
      stream.skipToEnd();
      return tokenStylesWith(state, TOKEN_STYLES.linkDefinition);
    },

    definitionList: function(stream, state) {
      stream.match(RE("definitionList"));

      state.layoutType = "definitionList";

      if (stream.match(/\s*$/))
        state.spanningLayout = true;
      else
        state.mode = Modes.attributes;

      return tokenStyles(state);
    },

    html: function(stream, state) {
      stream.skipToEnd();
      return tokenStylesWith(state, TOKEN_STYLES.html);
    },

    table: function(stream, state) {
      state.layoutType = "table";
      return (state.mode = Modes.tableCell)(stream, state);
    },

    tableCell: function(stream, state) {
      if (stream.match(RE("tableHeading")))
        state.tableHeading = true;
      else
        stream.eat("|");

      state.mode = Modes.tableCellAttributes;
      return tokenStyles(state);
    },

    tableCellAttributes: function(stream, state) {
      state.mode = Modes.tableText;

      if (stream.match(RE("tableCellAttributes")))
        return tokenStylesWith(state, TOKEN_STYLES.attributes);
      else
        return tokenStyles(state);
    },

    tableText: function(stream, state) {
      if (stream.match(RE("tableText")))
        return tokenStyles(state);

      if (stream.peek() === "|") { // end of cell
        state.mode = Modes.tableCell;
        return tokenStyles(state);
      }
      return handlePhraseModifier(stream, state, stream.next());
    }
  };

  CodeMirror.defineMode("textile", function() {
    return {
      startState: function() {
        return { mode: Modes.newLayout };
      },
      token: function(stream, state) {
        if (stream.sol()) startNewLine(stream, state);
        return state.mode(stream, state);
      },
      blankLine: blankLine
    };
  });

  CodeMirror.defineMIME("text/x-textile", "textile");
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    H‹MÈÿuĞIèàºP MĞÆEüèDºP jèÅ–ƒ ‹ğƒÄ‰uÆEü…öt‹EÈƒì‹Ì‰èNºP ‹ÎèÇÇïÿë3ÀMĞÆEü‰EĞè4ºP ‹MèÿuĞƒÁÆEüè‚ºP MĞÆEüèæ¹P MÆEüèÚ¹P MÆEü	èÎ¹P MØÆEüèÂ¹P MàÆEüè¶¹P MÆEüèª¹P MÈÆEüè¹P M¸ÆEüè’¹P MÀÆEüè†¹P M°ÆEüèz¹P M¨ÆEüèn¹P M ÆEü èb¹P M˜ÇEüÿÿÿÿèS¹P ‹Mô_^d‰    [‹å]Â U‹ìjÿh»T¼d¡    Pd‰%    ƒìHVW‹ùÇEÌ    ÇEü    ÇEÔ    EÄÆEüPEÔPEÌPÿuÿuÿuèNµÿÿÇEÜ    ÇEä    ‹EÌj hè>h >j ÿpÆEüèaƒ ƒÄMÜ‹ğVèE¹P …öujhã  h`ZÈh “Ûè«üP ƒÄ‹EÔj hè>h >j ÿpèƒ ƒÄMä‹ğVè¹P …öujhã  h`ZÈh “ÛègüP ƒÄM¬èÌ€5 E¬ÆEüPEÄP‹EäƒÀP‹EÜƒÀPè=vúÿj è®”ƒ ƒÄ‰EÆEü…ÀtM¬Q‹ÈèÆïÿë3ÀMìÆEü‰Eìè*¸P ÿuìOÆEüè{¸P MìÆEüèß·P M¬ÆEüèÓ„5 MäÆEüèÇ·P MÜÆEüè»·P MÔÆEü è¯·P MÌÇEüÿÿÿÿè ·P ‹Mô_^d‰    ‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhU¼d¡    Pd‰%    ƒìhSV‹ÙÇEÄ    ÇEü    ÇEÌ    EìÆEüPEÌPEÄPÿuÿuÿuè³ÿÿÇEÔ    ÇEÜ    ‹EÄj h4>h >j ÿpÆEüè¡œƒ ƒÄMÔ‹ğVè…·P …öujhã  h`ZÈh “ÛèëúP ƒÄ‹EÌj h4>h >j ÿpè]œƒ ƒÄMÜ‹ğVèA·P …öujhã  h`ZÈh “Ûè§úP ƒÄ‹uÜMŒW‹}ÔƒÆƒÇèò> òuìEäƒìò4$VWPè'  ƒÄóo Fò4$PGPEäPóEŒè  Qòt$óo óEœòF òD$òG ò$è»   ƒÄF(İ]¬ò4$PG(PEäPè¿
  j@óo óE´èw’ƒ ƒÄ‰EÆEü_…ÀtMŒQ‹Èè5Åïÿë3ÀMìÆEü‰EìèòµP ÿuìKÆEüèC¶P MìÆEüè§µP MÜÆEüè›µP MÔÆEüèµP MÌÆEü èƒµP MÄÇEüÿÿÿÿètµP ‹Mô^[d‰    ‹å]Â ÌÌU‹ìòMò]f(Áò-ÈÁÆò\Ãò¹Æf/ÅvëI ò\Êf(Áò\Ãf/Åwîò%€Çf(Áò\Ãf/àrë›    òXÊf(Áò\Ãf/àsîò\ËòYMòXËf/ÍòMv›    ò\Êf/ÍwöòMf/áròXÊf/ásöòMİE]ÃÌÌÌÌÌÌÌU‹ìƒì‹E‹U‹MS‹ÚÇEü
   +ØV‰]øq‹Ù+ØWx‰]ô‹Â+Á‰EğR_şSè2 ƒÄ„À…  ‹Mƒì¿¿	+ÈfnÁóæÀòYEò$èR÷$ ¿ƒÄÁ© ÿÿÿt÷ĞÁø¶Àƒìf‰Fü‹Eø¿8¿+ÈfnÁóæÀòYEò$è÷$ ¿ƒÄÁ© ÿÿÿt÷ĞÁø‹Môƒì¶Àf‰9‹Eğ¿0¿G+ÈfnÁóæÀòYEò$èÌö$ ¿OƒÄÁ© ÿÿÿt÷ĞÁø¶Àƒìf‰‹E¿H¿G+ÈfnÁóæÀòYEò$èŠö$ ¿OƒÄÁ© ÿÿÿt÷ĞÁø¶Àf‰Fë
‹‰Fü‹C‰‹UƒÇƒÂƒÆÿMü‰U…¾şÿÿ_^[‹å]ÃÌÌÌU‹ìVW‹}‹G,w(‹+ÁÁø…À„Õ   Sƒø„º   ‹‹]ƒÀP‹Ëè)8ğÿ„À…¢   ‹FS‹HøƒÁè8ğÿ„Àt‹F‹M‹@ø‹ƒÀPÿR[_^]ÃS‹Ïèßäÿÿ‹V‹ø‹Â+ÁøHÿ;ùu‹M‹BøƒÀP‹ÿR[_^]Ã…ÿxU;ø}Q‹‹ùƒy t SƒÁèü4ğÿ„Àu‹MSWV‹pes have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.ariaTitle || col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if (settings._bLoadingState) {
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		settings.oSavedState = state;
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
		
		if ( settings.oFeatures.bStateSave && !settings.bDestroying )
		{
			settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
		}	
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var loaded = function(state) {
			_fnImplementState(settings, state, callback);
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			_fnImplementState( settings, state, callback );
		}
		// otherwise, wait for the loaded callback to be executed
	
		return true;
	}
	
	function _fnImplementState ( settings, s, callback) {
		var i, ien;
		var columns = settings.aoColumns;
		settings._bLoadingState = true;
	
		// When StateRestore was introduced the state could now be implemented at any time
		// Not just initialisation. To do this an api instance is required in some places
		var api = settings._bInitComplete ? new DataTable.Api(settings) : null;
	
		if ( ! s || ! s.time ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Allow custom and plug-in manipulation functions to alter the saved data set and
		// cancelling of loading by returning false
		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
		if ( $.inArray( false, abStateLoad ) !== -1 ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Reject old data
		var duration = settings.iStateDuration;
		if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Number of columns have changed - all bets are off, no restore of settings
		if ( s.columns && columns.length !== s.columns.length ) {
			settings._bLoadingState = false;
			callback();
			return;
		}
	
		// Store the saved state so it might be accessed at any time
		settings.oLoadedState = $.extend( true, {}, s );
	
		// Restore key features - todo - for 1.11 this needs to be done by
		// subscribed events
		if ( s.start !== undefined ) {
			if(api === null) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			else {
				_fnPageChange(settings, s.start/s.length);
	
			}
		}
		if ( s.length !== undefined ) {
			settings._iDisplayLength   = s.length;
		}
	
		// Order
		if ( s.order !== undefined ) {
			settings.aaSorting = [];
			$.each( s.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}
	
		// Search
		if ( s.search !== undefined ) {
			$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
		}
	
		// Columns
		if ( s.columns ) {
			for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
				var col = s.columns[i];
	
				// Visibility
				if ( col.visible !== undefined ) {
					// If the api is defined, the table has been initialised so we need to use it rather than internal settings
					if (api) {
						// Don't redraw the columns on every iteration of this loop, we will do this at the end instead
						api.column(i).visible(col.visible, false);
					}
					else {
						columns[i].bVisible = col.visible;
					}
				}
	
				// Search
				if ( col.search !== undefined ) {
					$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
				}
			}
			
			// If the api is defined then we need to adjust the columns once the visibility has been changed
			if (api) {
				api.columns.adjust();
			}
		}
	
		settings._bLoadingState = false;
		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
		callback();
	};
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {e