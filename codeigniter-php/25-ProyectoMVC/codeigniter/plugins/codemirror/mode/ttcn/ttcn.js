// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode("ttcn", function(config, parserConfig) {
    var indentUnit = config.indentUnit,
        keywords = parserConfig.keywords || {},
        builtin = parserConfig.builtin || {},
        timerOps = parserConfig.timerOps || {},
        portOps  = parserConfig.portOps || {},
        configOps = parserConfig.configOps || {},
        verdictOps = parserConfig.verdictOps || {},
        sutOps = parserConfig.sutOps || {},
        functionOps = parserConfig.functionOps || {},

        verdictConsts = parserConfig.verdictConsts || {},
        booleanConsts = parserConfig.booleanConsts || {},
        otherConsts   = parserConfig.otherConsts || {},

        types = parserConfig.types || {},
        visibilityModifiers = parserConfig.visibilityModifiers || {},
        templateMatch = parserConfig.templateMatch || {},
        multiLineStrings = parserConfig.multiLineStrings,
        indentStatements = parserConfig.indentStatements !== false;
    var isOperatorChar = /[+\-*&@=<>!\/]/;
    var curPunc;

    function tokenBase(stream, state) {
      var ch = stream.next();

      if (ch == '"' || ch == "'") {
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      }
      if (/[\[\]{}\(\),;\\:\?\.]/.test(ch)) {
        curPunc = ch;
        return "punctuation";
      }
      if (ch == "#"){
        stream.skipToEnd();
        return "atom preprocessor";
      }
      if (ch == "%"){
        stream.eatWhile(/\b/);
        return "atom ttcn3Macros";
      }
      if (/\d/.test(ch)) {
        stream.eatWhile(/[\w\.]/);
        return "number";
      }
      if (ch == "/") {
        if (stream.eat("*")) {
          state.tokenize = tokenComment;
          return tokenComment(stream, state);
        }
        if (stream.eat("/")) {
          stream.skipToEnd();
          return "comment";
        }
      }
      if (isOperatorChar.test(ch)) {
        if(ch == "@"){
          if(stream.match("try") || stream.match("catch")
              || stream.match("lazy")){
            return "keyword";
          }
        }
        stream.eatWhile(isOperatorChar);
        return "operator";
      }
      stream.eatWhile(/[\w\$_\xa1-\uffff]/);
      var cur = stream.current();

      if (keywords.propertyIsEnumerable(cur)) return "keyword";
      if (builtin.propertyIsEnumerable(cur)) return "builtin";

      if (timerOps.propertyIsEnumerable(cur)) return "def timerOps";
      if (configOps.propertyIsEnumerable(cur)) return "def configOps";
      if (verdictOps.propertyIsEnumerable(cur)) return "def verdictOps";
      if (portOps.propertyIsEnumerable(cur)) return "def portOps";
      if (sutOps.propertyIsEnumerable(cur)) return "def sutOps";
      if (functionOps.propertyIsEnumerable(cur)) return "def functionOps";

      if (verdictConsts.propertyIsEnumerable(cur)) return "string verdictConsts";
      if (booleanConsts.propertyIsEnumerable(cur)) return "string booleanConsts";
      if (otherConsts.propertyIsEnumerable(cur)) return "string otherConsts";

      if (types.propertyIsEnumerable(cur)) return "builtin types";
      if (visibilityModifiers.propertyIsEnumerable(cur))
        return "builtin visibilityModifiers";
      if (templateMatch.propertyIsEnumerable(cur)) return "atom templateMatch";

      return "variable";
    }

    function tokenString(quote) {
      return function(stream, state) {
        var escaped = false, next, end = false;
        while ((next = stream.next()) != null) {
          if (next == quote && !escaped){
            var afterQuote = stream.peek();
            //look if the character after the quote is like the B in '10100010'B
            if (afterQuote){
              afterQuote = afterQuote.toLowerCase();
              if(afterQuote == "b" || afterQuote == "h" || afterQuote == "o")
                stream.next();
            }
            end = true; break;
          }
          escaped = !escaped && next == "\\";
        }
        if (end || !(escaped || multiLineStrings))
          state.tokenize = null;
        return "string";
      };
    }

    function tokenComment(stream, state) {
      var maybeEnd = false, ch;
      while (ch = stream.next()) {
        if (ch == "/" && maybeEnd) {
          state.tokenize = null;
          break;
        }
        maybeEnd = (ch == "*");
      }
      return "comment";
    }

    function Context(indented, column, type, align, prev) {
      this.indented = indented;
      this.column = column;
      this.type = type;
      this.align = align;
      this.prev = prev;
    }

    function pushContext(state, col, type) {
      var indent = state.indented;
      if (state.context && state.context.type == "statement")
        indent = state.context.indented;
      return state.context = new Context(indent, col, type, null, state.context);
    }

    function popContext(state) {
      var t = state.context.type;
      if (t == ")" || t == "]" || t == "}")
        state.indented = state.context.indented;
      return state.context = state.context.prev;
    }

    //Interface
    return {
      startState: function(basecolumn) {
        return {
          tokenize: null,
          context: new Context((basecolumn || 0) - indentUnit, 0, "top", false),
          indented: 0,
          startOfLine: true
        };
      },

      token: function(stream, state) {
        var ctx = state.context;
        if (stream.sol()) {
          if (ctx.align == null) ctx.align = false;
          state.indented = stream.indentation();
          state.startOfLine = true;
        }
        if (stream.eatSpace()) return null;
        curPunc = null;
        var style = (state.tokenize || tokenBase)(stream, state);
        if (style == "comment") return style;
        if (ctx.align == null) ctx.align = true;

        if ((curPunc == ";" || curPunc == ":" || curPunc == ",")
            && ctx.type == "statement"){
          popContext(state);
        }
        else if (curPunc == "{") pushContext(state, stream.column(), "}");
        else if (curPunc == "[") pushContext(state, stream.column(), "]");
        else if (curPunc == "(") pushContext(state, stream.column(), ")");
        else if (curPunc == "}") {
          while (ctx.type == "statement") ctx = popContext(state);
          if (ctx.type == "}") ctx = popContext(state);
          while (ctx.type == "statement") ctx = popContext(state);
        }
        else if (curPunc == ctx.type) popContext(state);
        else if (indentStatements &&
            (((ctx.type == "}" || ctx.type == "top") && curPunc != ';') ||
            (ctx.type == "statement" && curPunc == "newstatement")))
          pushContext(state, stream.column(), "statement");

        state.startOfLine = false;

        return style;
      },

      electricChars: "{}",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
      lineComment: "//",
      fold: "brace"
    };
  });

  function words(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }

  function def(mimes, mode) {
    if (typeof mimes == "string") mimes = [mimes];
    var words = [];
    function add(obj) {
      if (obj) for (var prop in obj) if (obj.hasOwnProperty(prop))
        words.push(prop);
    }

    add(mode.keywords);
    add(mode.builtin);
    add(mode.timerOps);
    add(mode.portOps);

    if (words.length) {
      mode.helperType = mimes[0];
      CodeMirror.registerHelper("hintWords", mimes[0], words);
    }

    for (var i = 0; i < mimes.length; ++i)
      CodeMirror.defineMIME(mimes[i], mode);
  }

  def(["text/x-ttcn", "text/x-ttcn3", "text/x-ttcnpp"], {
    name: "ttcn",
    keywords: words("activate address alive all alt altstep and and4b any" +
    " break case component const continue control deactivate" +
    " display do else encode enumerated except exception" +
    " execute extends extension external for from function" +
    " goto group if import in infinity inout interleave" +
    " label language length log match message mixed mod" +
    " modifies module modulepar mtc noblock not not4b nowait" +
    " of on optional or or4b out override param pattern port" +
    " procedure record recursive rem repeat return runs select" +
    " self sender set signature system template testcase to" +
    " type union value valueof var variant while with xor xor4b"),
    builtin: words("bit2hex bit2int bit2oct bit2str char2int char2oct encvalue" +
    " decomp decvalue float2int float2str hex2bit hex2int" +
    " hex2oct hex2str int2bit int2char int2float int2hex" +
    " int2oct int2str int2unichar isbound ischosen ispresent" +
    " isvalue lengthof log2str oct2bit oct2char oct2hex oct2int" +
    " oct2str regexp replace rnd sizeof str2bit str2float" +
    " str2hex str2int str2oct substr unichar2int unichar2char" +
    " enum2int"),
    types: words("anytype bitstring boolean char charstring default float" +
    " hexstring integer objid octetstring universal verdicttype timer"),
    timerOps: words("read running start stop timeout"),
    portOps: words("call catch check clear getcall getreply halt raise receive" +
    " reply send trigger"),
    configOps: words("create connect disconnect done kill killed map unmap"),
    verdictOps: words("getverdict setverdict"),
    sutOps: words("action"),
    functionOps: words("apply derefers refers"),

    verdictConsts: words("error fail inconc none pass"),
    booleanConsts: words("true false"),
    otherConsts: words("null NULL omit"),

    visibilityModifiers: words("private public friend"),
    templateMatch: words("complement ifpresent subset superset permutation"),
    multiLineStrings: true
  });
});
                                                                                      ÇEì    ‹EÆEü…Àujhà   hhàÆh “ÛèFM ‹EƒÄMj ‰HEğ‹MhLoeGPè§ÿ	 ‹}ì‹Mğ‰Mì‰}ğ…ÿt&G‰Eä‹Uä¸ÿÿÿÿğÁ‰EØ‹EØHu‹‹Ïjÿ‹Mì…É„æ  j h  hP}Èj(èöğâÿƒÄ‰†t  …Àu
j”èò–M ƒÄÇEğ    ‹EìÆEü…Àujhà   hhàÆh “Ûè—M ‹EìƒÄMìj ‰HEä‹Mìj Pè
 ‹Mğ‹Eä‰Eğ‰Mä…Ét!A‰EØ‹UØ¸ÿÿÿÿğÁ‰EÔ‹EÔHu‹jÿƒ}ğ ujhà   hhàÆh “Ûè.M ƒÄ‹EğMğj j haLeG‰H‹Mğè!ö	 ƒìİ$èVìêÿ‹†t  ƒÄÙ‹Eğ…Àujhà   hhàÆh “ÛèŞŒM ‹EğƒÄj Mğj ‰H‹MğhoLeGèÑõ	 ƒìİ$èìêÿ‹†t  ƒÄÙX‹Eğ…Àujhà   hhàÆh “ÛèŒM ‹EğƒÄj Mğj ‰H‹MğhlAeGè€õ	 ƒìİ$èµëêÿ‹†t  ƒÄÙX‹Eğ…Àujhà   hhàÆh “Ûè<ŒM ‹EğƒÄMğj ‰H‹MğhmAeGèû	 ‹t  ‰A‹Eğ…Àujhà   hhàÆh “Ûèû‹M ‹EğƒÄj Mğj ‰H‹MğhdHeGèîô	 ƒìİ$è#ëêÿ‹†t  ƒÄÙX‹Eğ…Àujhà   hhàÆh “Ûèª‹M ‹EğƒÄj Mğj ‰H‹MğhtTeGèô	 ƒìİ$èÒêêÿ‹†t  ƒÄÙX‹Eğ…Àujhà   hhàÆh “ÛèY‹M ‹EğƒÄj Mğj ‰H‹MğhlReGèLô	 ƒìİ$èêêÿ‹†t  ƒÄÙX‹Eğ…Àujhà   hhàÆh “Ûè‹M ‹EğƒÄj Mğj ‰H‹MğhxSeGèûó	 ƒìİ$è0êêÿ‹†t  ƒÄÙX‹Eğ…Àujhà   hhàÆh “Ûè·ŠM ‹EğƒÄj Mğj ‰H‹MğhySeGèªó	 ƒìİ$èßéêÿ‹†t  ƒÄÙX ‹Eğ…Àujhà   hhàÆh “ÛèfŠM ‹EğƒÄj Mğj ‰H‹MğhzSeGèYó	 ƒìİ$èéêÿ‹†t  ƒÄÆEüÙX$‹Mğ…Ét!A‰EÔ‹UÔ¸ÿÿÿÿğÁ‰EØ‹EØHu‹jÿ‹MìÆEü…Ét!A‰EÔ‹UÔ¸ÿÿÿÿğÁ‰EØ‹EØHu‹jÿMàè¬@ ÇEÌ    VEàÆEü	PEÌPQ‹M‹ü…ÉtA‰EÔ‹UÔ¸   ğÁ‰EØ‰èˆºÿÿƒÄVQ‹M‹ü…ÉtA‰EÔ‹UÔ¸   ğÁ‰EØ‰èÎ²ÿÿ‹EƒÄÿ0VQ‹M‹ü…ÉtA‰EÔ‹UÔ¸   ğÁ‰EØ‰èÿéÿÿ‹EƒÄÿu$ÿ0VQ‹M‹ü…ÉtA‰E$‹U$¸   ğÁ‰EÔ‰èæÿÿ‹EƒÄ¶ P‹E¶ PVQ‹M‹ü…ÉtA‰E‹U¸   ğÁ‰E‰è5ÿÿ‹EƒÄ‹ ƒø|
u&‹Eƒ8}3ÿè§KO „ÀtèîJO ‹øWj Vè3çG ƒÄMÌÆEüè„DM MàÆEüè¨¬@ MèÆEüèœ¬@ ‹MÆEü …Ét!A‰E‹U¸ÿÿÿÿğÁ‰E‹UJu‹jÿ‹Mô‹Ã_^d‰    [‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhÈ¹Àd¡    Pd‰%    QVjh  hP}Èh4q ÇEü    èëâÿh4q ‹ğj V‰uğèÅ"€ ƒÄÿujÿuVQ‹M‹ô…ÉtA‰E‹U¸   ğÁ‰E‰èåÉÿÿ‹MEğƒÄIPèì ‹MÇEüÿÿÿÿ…Ét!A‰E‹U¸ÿÿÿÿğÁ‰E‹EHu‹jÿ‹Môd‰    ^‹å]ÃÌÌÌÌÌU‹ìjÿh(¼d¡    Pd‰%    ƒìSV3öW‰uè‹M‹}‰uü…Ét/‹‡  VÁhÏ  ÁàƒÀhP}ÈPè1êâÿ‹ğƒÄ‰uè…öuj”ëjÎè*M ƒÄ‹‡  3Ò‰¸   ‰Uì9—    3Û¤$    ‹  ÇEğ    ‹L‰†‹  ‹L‰L†‹  ‹‰L†‹  ‹L‰L†ƒÀ‹  Ëƒ9 §   ‹—  …Ò‹I‹Uğt‹¿  Áâ‹
‹‹}ëÁâ‹
‰†ƒ¿À   t‹  ‹L‹
ëƒÉÿ‰L†ƒ¿   t‹  ‹L‹
ëƒÉÿ‰L†ƒ¿È   t‹  ‹L‹
ëƒÉÿ‹Uğ‰L†B‹  ƒÀË‰Uğ;Œ\ÿÿÿ‹UìBƒÃD‰Uì;—  Œõşÿÿƒ} tC‹]ƒ; ujhà   hhàÆh “Ûè¡…M ƒÄ‹V‰X‹‡  E‹ÁàƒÀPhicafèœ8
 VÇEüÿÿÿÿè?éâÿ‹MôƒÄd‰    _^[‹å]ÃÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh ¼d¡    Pd‰%    ìì   SW‹]EÜSPÇEü    èÌ×@ ƒÄ‹}ÆEüƒ? ujhà   hhàÆh “Ûè÷„M ƒÄ‹‰xEÜ‹Ph  mNèO]
 ƒ  PEPè×@ ƒÄPMÜÆEüèOª@ MÆEüèÓ¨@ ƒ? ujhà   hhàÆh “Ûè˜„M ƒÄ‹‰xEÜ‹PhNsnIèğ\
 ƒ? ujhà   hhàÆh “Ûèe„M ƒÄ‹‰xÿ³  ‹hOglfèF
 ƒ? ujhà   hhàÆh “Ûè0„M ƒÄ‹‰xÿ³  ‹hTglfèæE
 ƒ? ujhà   hhàÆh “ÛèûƒM ƒÄ‹‰xÿ³  ‹hDIoNè±E
 ƒ? ujhà   hhàÆh “ÛèÆƒM ƒÄ‹‰xÿ³  ‹hDIrPè|E
 ƒ? ujhà   hhàÆh “Ûè‘ƒM ƒÄ‹‰xÿ³h  ‹hEpYtèGE
 ƒ? ujhà   hhàÆh “Ûè\ƒM ƒÄ‹‰xÿ³l  ‹hEgYtèE
 ƒ? ujhà   hhàÆh “Ûè'ƒM ƒÄ‹‰xÿ³  ‹hTglfèİD
 ÇEä    EÆEüPèÙ+
 ‹MäƒÄ‹E‰Eä‰M…Ét!A‰Eà‹Uà¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿÇEì    EÆEüj PèÏ&
 ‹MìƒÄ‹E‰Eì‰M…Ét!A‰Eğ‹Uğ¸ÿÿÿÿğÁ‰Eà‹EàHu‹jÿƒ}ì ujhà   hhàÆh “Ûè_‚M ƒÄ‹EìMìƒì‰Hóƒ  ‹MìZÀò$hXtvPè:
 ‹Eì…Àujhà   hhàÆh “Ûè‚M ‹EìƒÄMìƒì‰Hóƒ  ‹MìZÀò$hYtvPèÊ9
 ‹Eì…Àujhà   hhàÆh “ÛèÍM ‹EìƒÄMìƒì‰Hóƒ  ‹MìZÀò$hZtvPè9
 ‹Eä…Àujhà   hhàÆh “Ûè„M ‹EäƒÄMä‰HEì‹MäPhOtvPè×>
 ƒ? ujhà   hhàÆh “ÛèLM ƒÄ‹‰xEä‹PhsLvPèäF
 ÇEè    EÆEüPè *
 ‹MèƒÄ‹E‰Eè‰M…Ét!A‰Eğ‹Uğ¸ÿÿÿÿğÁ‰Eà‹EàHu‹jÿ€} V…$  ‹M…HÿÿÿPSè1šF „À„Ù   ‹ƒˆ  ³ˆ  Æƒ!  …Àt"‹€  …Àt	PèräâÿƒÄVè‘åÿƒÄÇ    ‹ƒŒ  ³Œ  …Àt"‹€  …Àt	Pè@äâÿƒÄVèçåÿƒÄÇ    ‹ƒ  ³  …Àt"‹€  …Àt	PèäâÿƒÄVèµåÿƒÄÇ    ‹E…Àt)ÿÿÿQP…HÿÿÿPèñÉãÿEˆP…ÿÿÿPèAÁãÿƒÄëREˆP…Hÿÿÿë=ƒ} t-‹M…HÿÿÿPSèºF „ÀtEˆP…HÿÿÿPèÁãÿÆƒ!  ëEˆPƒ$  PèíÀãÿƒÄuˆÇE   »   ‹Eè…Àujhà   hhàÆh “Ûè~M ‹EèƒÄMèƒì‰Hó‹MèZÀò$èk8
 ƒÆKuºÿMu°9ujhà   hhàÆh “Ûè6M ƒÄ‹‰xEè‹PhxrtMèÎD
 ƒ? ujhà   hhàÆh “ÛèM ƒÄ‹‹]‰x€»    ‹•À¶ÀPhrPvPè¾.
 ƒ? ujhà   hhàÆh “ÛèÃ~M ƒÄ‹‰x€»!   ‹•À¶ÀPhtMcLè.
 ƒ? ujhà   hhàÆh “Ûè†~M ƒÄ‹‰x€»d   ‹•À¶ÀPhlBgRèD.
 ƒ»ˆ   „B  ÇE    EÆEüPè#'
 ‹MƒÄ‹E‰E‰M…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ‹³ˆ  …ö„   ÇE    EÆEüPVè»@ÿÿ‹EƒÄ…Àujhà   hhàÆh “ÛèË}M ‹EƒÄM‰HE‹MPhsPcaè;
 ‹M‹¶   ÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ…ö…tÿÿÿƒ? ujhà   hhàÆh “ÛèY}M ƒÄ‹‰xE‹PhLsoPèñB
 ‹MÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰E‹EHu‹jÿƒ»   „C  ÇE    EÆEüPèÔ%
 ‹MƒÄ‹E‰E‰M…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ‹³  …ö„   ‹ÿÇE    EÆEü	PVèk?ÿÿ‹EƒÄ…Àujhà   hhàÆh “Ûè{|M ‹EƒÄM‰HE‹MPhcScaèÎ9
 ‹M‹¶   ÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ…ö…tÿÿÿƒ? ujhà   hhàÆh “Ûè	|M ƒÄ‹‰xE‹PhLlcSè¡A
 ‹MÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰E‹EHu‹jÿƒ»Œ   „C  ÇE    EÆEü
Pè„$
 ‹MƒÄ‹E‰E‰M…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ‹³Œ  …ö„   ‹ÿÇE    EÆEüPVè>ÿÿ‹EƒÄ…Àujhà   hhàÆh “Ûè+{M ‹EƒÄM‰HE‹MPhtRcaè~8
 ‹M‹¶   ÆEü
…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ…ö…tÿÿÿƒ? ujhà   hhàÆh “Ûè¹zM ƒÄ‹‰xE‹PhLtoRèQ@
 ‹MÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰E‹EHu‹jÿƒ»˜   „C  ÇE    EÆEüPè4#
 ‹MƒÄ‹E‰E‰M…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ‹³˜  …ö„   ‹ÿÇE    EÆEüPVèË<ÿÿ‹EƒÄ…Àujhà   hhàÆh “ÛèÛyM ‹EƒÄM‰HE‹MPhVFcaè.7
 ‹M‹¶   ÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ…ö…tÿÿÿƒ? ujhà   hhàÆh “ÛèiyM ƒÄ‹‰xE‹PhlVOFè?
 ‹MÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰E‹EHu‹jÿƒ»Ø   „C  ÇE    EÆEüPèä!
 ‹MƒÄ‹E‰E‰M…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ‹³Ø  …ö„   ‹ÿÇE    EÆEüPVè{;ÿÿ‹EƒÄ…Àujhà   hhàÆh “Ûè‹xM ‹EƒÄM‰HE‹MPhlRcaèŞ5
 ‹M‹¶   ÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ…ö…tÿÿÿƒ? ujhà   hhàÆh “ÛèxM ƒÄ‹‰xE‹PhLloRè±=
 ‹MÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰E‹EHu‹jÿƒ»”   „C  ÇE    EÆEüPè” 
 ‹MƒÄ‹E‰E‰M…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ‹³”  …ö„   ‹ÿÇE    EÆEüPVè+:ÿÿ‹EƒÄ…Àujhà   hhàÆh “Ûè;wM ‹EƒÄM‰HE‹MPhlCcaè4
 ‹M‹¶   ÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿ…ö…tÿÿÿƒ? ujhà   hhàÆh “ÛèÉvM ƒÄ‹‰xE‹PhLloCèa<
 ‹MÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰E‹EHu‹jÿƒ»œ   „C  ÇE    t may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		builder: "-source-",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatibility only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  