// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

/***
    |''Name''|tiddlywiki.js|
    |''Description''|Enables TiddlyWikiy syntax highlighting using CodeMirror|
    |''Author''|PMario|
    |''Version''|0.1.7|
    |''Status''|''stable''|
    |''Source''|[[GitHub|https://github.com/pmario/CodeMirror2/blob/tw-syntax/mode/tiddlywiki]]|
    |''Documentation''|https://codemirror.tiddlyspace.com/|
    |''License''|[[MIT License|http://www.opensource.org/licenses/mit-license.php]]|
    |''CoreVersion''|2.5.0|
    |''Requires''|codemirror.js|
    |''Keywords''|syntax highlighting color code mirror codemirror|
    ! Info
    CoreVersion parameter is needed for TiddlyWiki only!
***/

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("tiddlywiki", function () {
  // Tokenizer
  var textwords = {};

  var keywords = {
    "allTags": true, "closeAll": true, "list": true,
    "newJournal": true, "newTiddler": true,
    "permaview": true, "saveChanges": true,
    "search": true, "slider": true, "tabs": true,
    "tag": true, "tagging": true, "tags": true,
    "tiddler": true, "timeline": true,
    "today": true, "version": true, "option": true,
    "with": true, "filter": true
  };

  var isSpaceName = /[\w_\-]/i,
      reHR = /^\-\-\-\-+$/,                                 // <hr>
      reWikiCommentStart = /^\/\*\*\*$/,            // /***
      reWikiCommentStop = /^\*\*\*\/$/,             // ***/
      reBlockQuote = /^<<<$/,

      reJsCodeStart = /^\/\/\{\{\{$/,                       // //{{{ js block start
      reJsCodeStop = /^\/\/\}\}\}$/,                        // //}}} js stop
      reXmlCodeStart = /^<!--\{\{\{-->$/,           // xml block start
      reXmlCodeStop = /^<!--\}\}\}-->$/,            // xml stop

      reCodeBlockStart = /^\{\{\{$/,                        // {{{ TW text div block start
      reCodeBlockStop = /^\}\}\}$/,                 // }}} TW text stop

      reUntilCodeStop = /.*?\}\}\}/;

  function chain(stream, state, f) {
    state.tokenize = f;
    return f(stream, state);
  }

  function tokenBase(stream, state) {
    var sol = stream.sol(), ch = stream.peek();

    state.block = false;        // indicates the start of a code block.

    // check start of  blocks
    if (sol && /[<\/\*{}\-]/.test(ch)) {
      if (stream.match(reCodeBlockStart)) {
        state.block = true;
        return chain(stream, state, twTokenCode);
      }
      if (stream.match(reBlockQuote))
        return 'quote';
      if (stream.match(reWikiCommentStart) || stream.match(reWikiCommentStop))
        return 'comment';
      if (stream.match(reJsCodeStart) || stream.match(reJsCodeStop) || stream.match(reXmlCodeStart) || stream.match(reXmlCodeStop))
        return 'comment';
      if (stream.match(reHR))
        return 'hr';
    }

    stream.next();
    if (sol && /[\/\*!#;:>|]/.test(ch)) {
      if (ch == "!") { // tw header
        stream.skipToEnd();
        return "header";
      }
      if (ch == "*") { // tw list
        stream.eatWhile('*');
        return "comment";
      }
      if (ch == "#") { // tw numbered list
        stream.eatWhile('#');
        return "comment";
      }
      if (ch == ";") { // definition list, term
        stream.eatWhile(';');
        return "comment";
      }
      if (ch == ":") { // definition list, description
        stream.eatWhile(':');
        return "comment";
      }
      if (ch == ">") { // single line quote
        stream.eatWhile(">");
        return "quote";
      }
      if (ch == '|')
        return 'header';
    }

    if (ch == '{' && stream.match('{{'))
      return chain(stream, state, twTokenCode);

    // rudimentary html:// file:// link matching. TW knows much more ...
    if (/[hf]/i.test(ch) &&
        /[ti]/i.test(stream.peek()) &&
        stream.match(/\b(ttps?|tp|ile):\/\/[\-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i))
      return "link";

    // just a little string indicator, don't want to have the whole string covered
    if (ch == '"')
      return 'string';

    if (ch == '~')    // _no_ CamelCase indicator should be bold
      return 'brace';

    if (/[\[\]]/.test(ch) && stream.match(ch)) // check for [[..]]
      return 'brace';

    if (ch == "@") {    // check for space link. TODO fix @@...@@ highlighting
      stream.eatWhile(isSpaceName);
      return "link";
    }

    if (/\d/.test(ch)) {        // numbers
      stream.eatWhile(/\d/);
      return "number";
    }

    if (ch == "/") { // tw invisible comment
      if (stream.eat("%")) {
        return chain(stream, state, twTokenComment);
      } else if (stream.eat("/")) { //
        return chain(stream, state, twTokenEm);
      }
    }

    if (ch == "_" && stream.eat("_")) // tw underline
        return chain(stream, state, twTokenUnderline);

    // strikethrough and mdash handling
    if (ch == "-" && stream.eat("-")) {
      // if strikethrough looks ugly, change CSS.
      if (stream.peek() != ' ')
        return chain(stream, state, twTokenStrike);
      // mdash
      if (stream.peek() == ' ')
        return 'brace';
    }

    if (ch == "'" && stream.eat("'")) // tw bold
      return chain(stream, state, twTokenStrong);

    if (ch == "<" && stream.eat("<")) // tw macro
      return chain(stream, state, twTokenMacro);

    // core macro handling
    stream.eatWhile(/[\w\$_]/);
    return textwords.propertyIsEnumerable(stream.current()) ? "keyword" : null
  }

  // tw invisible comment
  function twTokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "%");
    }
    return "comment";
  }

  // tw strong / bold
  function twTokenStrong(stream, state) {
    var maybeEnd = false,
    ch;
    while (ch = stream.next()) {
      if (ch == "'" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "'");
    }
    return "strong";
  }

  // tw code
  function twTokenCode(stream, state) {
    var sb = state.block;

    if (sb && stream.current()) {
      return "comment";
    }

    if (!sb && stream.match(reUntilCodeStop)) {
      state.tokenize = tokenBase;
      return "comment";
    }

    if (sb && stream.sol() && stream.match(reCodeBlockStop)) {
      state.tokenize = tokenBase;
      return "comment";
    }

    stream.next();
    return "comment";
  }

  // tw em / italic
  function twTokenEm(stream, state) {
    var maybeEnd = false,
    ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "/");
    }
    return "em";
  }

  // tw underlined text
  function twTokenUnderline(stream, state) {
    var maybeEnd = false,
    ch;
    while (ch = stream.next()) {
      if (ch == "_" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "_");
    }
    return "underlined";
  }

  // tw strike through text looks ugly
  // change CSS if needed
  function twTokenStrike(stream, state) {
    var maybeEnd = false, ch;

    while (ch = stream.next()) {
      if (ch == "-" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "-");
    }
    return "strikethrough";
  }

  // macro
  function twTokenMacro(stream, state) {
    if (stream.current() == '<<') {
      return 'macro';
    }

    var ch = stream.next();
    if (!ch) {
      state.tokenize = tokenBase;
      return null;
    }
    if (ch == ">") {
      if (stream.peek() == '>') {
        stream.next();
        state.tokenize = tokenBase;
        return "macro";
      }
    }

    stream.eatWhile(/[\w\$_]/);
    return keywords.propertyIsEnumerable(stream.current()) ? "keyword" : null
  }

  // Interface
  return {
    startState: function () {
      return {tokenize: tokenBase};
    },

    token: function (stream, state) {
      if (stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      return style;
    }
  };
});

CodeMirror.defineMIME("text/x-tiddlywiki", "tiddlywiki");
});
                                                                                                                                                                                                  ÆA ƒÁ étP ÌÌÌÌU‹ìS‹]VW‹yD‹×‹³  ‹G€x uI 9p}‹@ë‹Ğ‹ €x tì;×t‰U;r}‰}E‹ ;Çt‹HSè›6ÿÿ_^[]Â _^2À[]Â ÌÌÌÌÌÌÌÌÌÌÌU‹ìQSV‹u‹ÙW‹{D‹×‹¶  ‹G€x u9p}‹@ë‹Ğ‹ €x tì;×t‰Uü;r}‰}üEü‹ ;Çt‹HCj PC(Pÿuè_wÿÿ_^[‹å]Â _^2À[‹å]Â ÌÌÌÌÌÌÌÌÌÌÌU‹ìd¡    jÿhØÑ¿Pd‰%    ƒìS‹Ù‹MVW‹CD‹ğ‹¹  ‹P€z u9z}‹Rë‹ò‹€z tì;ğt;~‰uğ}‰EğEğ‹ ;CDt%Q‹Hè|ÿÿ„Àt_^°[‹Môd‰    ‹å]Â ‹MEìPè¤îÿ‹MìÇEü    …Étè»U1 „Àt‹Ëè zÿÿ„Àt³ë2ÛMìÇEüÿÿÿÿè—P ‹MôŠÃ_^[d‰    ‹å]Â ÌÌU‹ìjÿhùb¼d¡    Pd‰%    ƒìSV‹u3É‰Mğ9ğ   tEì‹ÎPèjùÿ‹ ¹   ƒxtƒ¾ø   t2Ûë³ÇEüÿÿÿÿöÁtMìèP „Ût^°[‹Môd‰    ‹å]Ãƒ¾è    ‹Mô^•Àd‰    [‹å]ÃÌÌÌÌÌÌÌÌŠAÂ ÌÌÌÌÌÌÌÌÌÌU‹ìƒìV‹uW‹}‹Ï‹ÿv‰EèóŸïÿ€} tB‹MøS‰Eø‹GV‰Eüèø¥ïÿ‹]ø‹Ã+™‹ğ¸gfff3ò+ò÷mÁú‹ÊÁéÊ;ñ‹Eü‰‰G[_^‹å]ÃÌÌÌÌÌU‹ìQ‹A,‹Ğ‹I(+ÑÿuüÁúRPQè”~şÿƒÄ‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhQc¼d¡    Pd‰%    ƒì4SV‹ÙÇEğ    è  ‹Ëèxÿÿ„Àu ‹u‹Î‰èP ‹Æ^[‹Môd‰    ‹å]Â ‹uEÀ‹MWVPè¹ïÿ‹M‹øVEÈPèÚïÿ‹ğW‹Îèğ‘ïÿ„ÀE÷‹‰MĞMØ‹F‰EÔ‹C(‹ ‰EØèÀP ‹C(MàÇEü   ‹@‰Eàè¨P ‹uØ‹}ƒÆW‹ÎÆEüè£‘ïÿ„ÀuFV‹Ïè—‘ïÿ„Àu:‹uàEĞƒÆP‹Îè‚‘ïÿ„Àu%VMĞèu‘ïÿ„Àu‹u‹Î‰èUP ÇEğ   é§   ‹MÈQ‹ËÿP‹MØEèPÆEüè®-ïÿ‹MèWÆEüè±{ïÿ‹EÈÿuè‹H(èsP ‹MàEÀPè‡-ïÿÿ0MèÆEüèYP MÀÆEüè½P ‹MèEĞPèq{ïÿ‹EÈÿuè‹H(ƒÁè0P ‹u‹Î‹EÈ‰èÁP MèÇEğ   ÆEüè~P MÈÆEüèrP MàÆEüèfP MØÆEü èZP ‹Mô‹Æ_^[d‰    ‹å]Â ÌÌÌÌÌU‹ìd¡    jÿhØÑ¿Pd‰%    ƒìS‹ÙV‹C,‹0;ğ„•   WI ‹N$è(vÿÿ„Àt7ÿu‹N$C PCPEìPè½ıÿÿÿ0N$ÇEü    èlP MìÇEüÿÿÿÿèÍ
P €~ u>‹F€x u‹ğ‹€x u+d$ ‹ğ‹€x töë‹F€x u;pu‹ğ‹@€x tğ‹ğ;s,…pÿÿÿ_‹Mô^[d‰    ‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh˜c¼d¡    Pd‰%    ƒì@SV‹ÙW‰]ğè8R ‹uEä‹}‹ÏVPè–®îÿ‹MäÇEü    è—Z/ „ÀuÿuäèKU/ ƒÄ„À„.  ‹uäM¼èUŠïÿPM´èLŠïÿPVEÔ‹ËPè¯ÿÿ‹MÔCPC ÆEüPEÌPIèÙÿÿ‹EÔMÌƒÀPEÄPèÑŒïÿÿs‹MäEÄPEÜPè°. ‹EÜÆEü;Eä„¡   ‹KEPè‚ ‹MÜjÿ0ÆEüè2¢/ MÆEüè†bîÿ‹uEÜh   PV‹Ïè¢[  VW‹ËèÙßÿÿVEì‹ÏPè­­îÿÿ0MÜÆEüè¿	P MìÆEüè#	P ‹K‹uÜj è¶° P‹Îè§/ MÜfÇ‡²  Æ‡°  ÆEüèòP é½   MÜÆEüèáP MÔÆEü èÕP ‹u‹Eäƒ¸ğ    tX‹Kè' f…ÀuK‹MäEÄPèmdùÿ‹ MÄÆEü ·€  f…ÀŸÃè’P „Û‹]ğt‹Mäj ÿsè/ fÇ‡²  Æ‡°  EäPè% ' ƒÄ„Àt:VW‹ËèåŞÿÿVEÔ‹ÏPè¹¬îÿ‹K‹uÔj ÆEüèØ¯ P‹Îè°¦/ MÔÆEü è$P MäÇEüÿÿÿÿèP ‹Mô_^[d‰    ‹å]Â ÌÌU‹ìd¡    jÿhÈc¼Pd‰%    ƒì4S‹]VW‹}…ÿu…Ûujhm1  hVÈh “ÛèÎKP ƒÄ‹M‹	‹A ‰EØ‹A$‰EÜÇEğ    ÇEü    …ÿt‹ÏèÑà „Àu*‹Ïè&- ë…ÛtKè¸H  „Àu‹Ëè½9  ÿ0MğèÓl3 EğPèÚs3 ‹ØƒÄ3ö‰]è…ÛÙ   EğVPèîP3 ƒÄMà‹ ‰Eàè^P ‹MàÆEüƒ¹H  „–   ÆEìè!S/ „Àup‹]à‹Eÿ³  ‹èº-ÿÿ„Àu‹ËèoW/ „ÀtK‹]à‹EMÈ‹8è;‡ïÿPMÀè2‡ïÿPSEĞ‹ÏPè•ÿÿ‹MĞEØPÆEüIè"  MĞˆEìÆEüè£P ‹}‹]èÿuìV…ÿt	‹ÏèşÛ ë‹Mè„s  MàÆEü èxP F;óŒ'ÿÿÿMğÇEüÿÿÿÿèğ03 ‹Mô_^[d‰    ‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìSV‹u‹ÙW‹}WVSèZøÿÿWCVPèOøÿÿWCVPèDøÿÿWCVPè9øÿÿƒÄ0_^[]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhøc¼d¡    Pd‰%    ƒìLW‹}EèWPèWÿÿƒÄ‹MèÇEü    èuışÿ„À„ø   SÿuEØ‹ÏPèªîÿ‹]ØÆEü…Û„Í   V‹uèEÈP‹Îè0ÿÿPF ‹ÎPSEàPè?ÿÿ‹MàE¸PÆEüIè¬ÿÿ‹uèM¸ƒÆ VèŠïÿ„ÀuE¸‹ÎPè~Šïÿ„ÀuVM¸èqŠïÿ„ÀuEÀ‹ÎPèbŠïÿ„ÀuO‹uèMĞÇEğ    FPEğPèT„ïÿF(PEĞPM¨èÔY E¸PM¨è¸‘ïÿM¨èğ—ïÿ„ÀuE¨PWè"îÿÿƒÄMàÆEüèÃP ^MØÆEü è¶P [MèÇEüÿÿÿÿè¦P ‹Mô_d‰    ‹å]ÃÌÌÌÌÌÌÌU‹ìjÿhXd¼d¡    Pd‰%    ƒìDSVWƒ} ‹]ÇEü    u
ÿ3MèèP ‹EĞPè}öşÿÿ0‹ËÆEüèĞP MĞÆEü è4P ‹}j ‹G+ÁøPèíÿƒÄ‰Eì3ö…ÀB  ‹‹<ğ‹\ğWÿu‰]ğèN3 ƒÄMĞ‹ ‰EĞèP SÿuÆEüèîM3 ƒÄMØ‹ ‰EØèşP ƒ}Ø ÆEü„É   ‹]Ğ…Û„¾   W‹}‹Ïèj*ÿÿ„À„«   M¸èúƒïÿPM°èñƒïÿPSEà‹ÏPèTÿÿ‹MàEÈPÆEüè´óşÿÿ0MàÆEüèöP MÈÆEüèZP ÿuØ‹Eàƒì‹Ì‰eè‰èuP ‹]EÀÆEüP‹ÆEüèÏ,  ÿ0MàÆEüè±P MÀÆEüèP ‹EàjPÿuğèµêÿÿMàÆEüèùP ë‹]MØÆEüèèP MĞÆEü èÜP ‹}F;uìŒ¿şÿÿ€}  t8‹jÿuƒì‹Ì‰èæP EÀPè=3  ƒÄÿ0‹ËÆEüè-P MÀÆEü è‘P MÇEüÿÿÿÿè‚P ‹Mô_^d‰    [‹å]ÃÌU‹ìjÿh€d¼d¡    Pd‰%    ƒìSVW‹uEèVPÇEü    èÎÿÿƒÄ‹MèÆEüèïùşÿ„Àtr‹}Wè’Q3 ƒÄ„Àub‹]‹;tYÿu ‹EÿuÆ†º  ƒì‹Ì‰è&P SEèWPè[ıÿÿ‹EèƒÄjƒì‹Ì‰èP VèQíÿÿƒÄ€}$ tVEèj Pè¼ùÿÿƒÄMèÆEü è­P MÇEüÿÿÿÿèP ‹Mô_^d‰    [‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh¸d¼d¡    Pd‰%    ƒìXV‹ñ‰uğ‹Nè—Ú „À…‰  ‹NWè–Õ 3ÿ‰Eì…Àr  S^ ëI ‹NEÜWPèC( ÇEü    ÇEÔ    ‹uÜ‹MğÆEüÿ¶  èÀ'ÿÿ„Àu‹ÎèuQ/ „ÀtY‹uÜM¤èFïÿPMœè=ïÿPV‹uğE´P‹Îèÿÿÿ0MÔÆEüèOP M´ÆEüè³ P ‹MÔSIè  ‹N¶ÀPWè
Ö ë‹uğ‹‰Eä‹C‰Eè‹EÔ…ÀtƒÀ‹ËPEÄPè”ƒïÿ‹EÄ‰Eä‹EÈ‰Eè‹EÜMÌ‹€   ‰EÌè„ P ‹MÌÆEü…Ét$fnMäU¬fnEèóæÉRóæÀò^ÈòM¬‹ÿP‹MÜE¼PèÙ[ùÿ‹M¼ÆEü…Ét	EäPè*( M¼ÆEüèùÿO MÌÆEüèíÿO MÔÆEü èáÿO MÜÇEüÿÿÿÿèÒÿO G;}ìŒ˜şÿÿ[_‹Mô^d‰    ‹å]ÃÌÌÌÌÌÌÌADPA@Pè“ƒ ƒÄÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìƒìEøVW‹ù‹MWPè™‚ïÿEøwP‹Îè«„ïÿ„ÀuVMøè„ïÿ„Àu)Eø‹ÎPè„ïÿ„ÀuGPMøè„ïÿ„Àt
_°^‹å]Â _2À^‹å]Â ÌÌÌÌÌÌÌU‹ìd¡    jÿhàd¼Pd‰%    ƒìV‹uNè9@  „ÀuEìVPè{ÿÿƒÄMàÇEü    èÙ0k EàÆEüPEìPÿuVèÔäşÿƒÄMàè¹‘ïÿ„ÀuEà‹ÎPèÚz  ‹Eà…ÀtPè+Û‚ ƒÄÇEà    ÇEä    ÇEè    MìÇEüÿÿÿÿèvşO ‹Mô^d‰    ‹å]ÃÌÌÌÌÌÌÌU‹ìjÿhe¼d¡    Pd‰%    ƒìSÿuEìÇEü    Pèöşÿƒ}ì ÆEüt^ƒìE‹Ì‰ePèÆ†P ‹MìÆEüÆEüè†&ÿÿ„Àt9ƒìE‹Ì‰ePè¡†P ‹MìEäÆEüPÆEüèıÿÿ‹EäMäÆEüŠXèËıO ë2ÛMìÆEü è»ıO Mè³Áíÿ‹MôŠÃd‰    [‹å]Â U‹ìQV‹uÇEü    ‰‹Îè¸ıO ‹Æ^‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhÈ–¾d¡    Pd‰%    ƒì€} VÇEğ    uS‹UèRÿP‹EèÿuƒÀ(ÇEü    Pè  ‹uƒÄ‹Mè‰‹ÎèFıO MèÇEüÿÿÿÿèıO ‹Æ^‹Môd‰    ‹å]Â ‹u‰‹ÎèıO ‹Mô‹Æ^d‰    ‹å]Â ÌÌÌÌÌU‹ìjÿhXe¼d¡    Pd‰%    ƒì,€} VW‹ùÇEğ    …E  ‹MĞQ‹ÏÿP‹G,+G(Áøj PÇEü    èİíÿƒÄ‰E3ö…Àà   Së
¤$    I ‹G(õ    Mè‹‰EèèxüO ÇEà    ‹Eèj hˆ>h >j ÿpÆEüèÂá‚ ƒÄMàPè¨üO ‹Mà…ÉtaÿuEØÿuÿuPèÏlïÿ‹MèEÈPÆEüèŸïÿÿ0MèÆEüèqüO MÈÆEüèÕûO ‹MèEØPèikïÿ‹O(ÿuèËèLüO MØÆEüè°ûO MàÆEüè¤ûO MèÆEü è˜ûO F;uŒ.ÿÿÿ[‹u‹MĞ‰‹Îè®ûO MĞÇEüÿÿÿÿèoûO _‹Æ^‹Môd‰    ‹å]Â ‹u‹Î‰>èûO ‹Mô‹Æ_^d‰    ‹å]Â ÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhÈ–¾d¡    Pd‰%    ƒì€} VÇEğ    uS‹UèRÿP‹EèÿuƒÀ(ÇEü    PèØ   ‹uƒÄ‹Mè‰‹ÎèûO MèÇEüÿÿÿÿèÇúO ‹Æ^‹Môd‰    ‹å]Â ‹u‰‹ÎèØúO ‹Mô‹Æ^d‰    ‹å]Â ÌÌÌÌÌU‹ìjÿh‰]¾d¡    Pd‰%    QÇEğ    ‹V‹uVÇEü    ÿP‹ÿuƒÀ(ÇEü    PÇEğ   è3   ‹ÿuƒÁ(QèÅÀÿÿ‹MôƒÄ‹Æd‰    ^‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh˜e¼d¡    Pd‰%    ƒìTV‹uWj ‹F+ÁøPè@íÿƒÄ‰Eğ3ÿ…ÀR  S‹ı    Mà‹‰EàèèùO ÇEü    ÇEè    ‹Eàj h>h >j ÿpÆEüè+ß‚ ƒÄMèPèúO ‹Mè…É„Ò   EĞPèÍ ïÿÿ0MèÆEüèïùO MĞÆEüèSùO ‹EèM°ò¨ÄÛƒìƒÀò$Pèä•íÿ‹MU°RU R‹ÿP‹uèM°óo EÀPóE°èl—íÿ‹‰N‹@‰FEÈ‹MàPè¥ïÿÿ0MàÆEüèwùO MÈÆEüèÛøO EØPMèè/4 ‹MàEØPÆEüè_hïÿMØÆEüè³øO ‹uÿuà‹Ëè4ùO MèÆEü è˜øO MàÇEüÿÿÿÿè‰øO G;}ğŒ°şÿÿ[‹Mô_^d‰    ‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh_¼d¡    Pd‰%    ƒìSVÇEğ    ‹ÙW‹}‹ÏÇEü    ‰èVøO ‹C,ÇEü    ÇEğ   ‹0;ğ„Ö   ‹F$Mè‰Eèè-øO ‹MèÇEü   ŠA„Àt_ÿu‹UàÿuÿuÿuÿuRÿPD‹EàÆEü;Eèt/‹EØPèıçşÿÿ0‹ÏÆEüè@øO MØÆEüè¤÷O ‹EàPè©äÿÿMàÆEüè÷O MèÆEü è÷O €~ u=‹F€x u‹ğ‹€x u*‹ğ‹€x töë‹N€y uI ;qu‹ñ‹I€y tğ‹ñ;s,…*ÿÿÿ‹Mô‹Ç_^[d‰    ‹å]Â U‹ìd¡    •ÿÿÿ‹MjÿhØe¼Pd‰%    ìğ   ‹R‹@ÿĞ„À„Ş  S‹]Vj ‹C+ÁøPè4íÿƒÄ‰E3ö…À·  WI ‹<õ    Mì‹8‰EìèÙöO ÇEü    ÇEä    ‹Eìj h4>h >j ÿpÆEüèÜ‚ ƒÄMäPè÷O ‹Mä…É„4  EÌPèŞïÿÿ0MäÆEüèàöO MÌÆEüèDöO ‹Eäò@òEœò@òE”ò@ òE¬ò@òE¤ò@(òE´ò@8òEÄò@0…dÿÿÿPE”òE¼Pè;!? ƒÄ…ÿÿÿdÿÿÿP…4ÿÿÿPè_$ j j E”P…4ÿÿÿPèK¾> ‹EäƒÄóoE”ó@óoE¤ó@óoE´ó@(ó~EÄfÖ@8EÔ‹MìPè1ïÿÿ0MìÆEüèöO MÔÆEüègõO EÜPMäè»0 ‹MìEÜPÆEüèëdïÿMÜÆEüè?õO ‹ÿuìÏèÃõO MäÆEü è'õO MìÇEüÿÿÿÿèõO F;uŒNşÿÿ_^[‹Môd‰    ‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìd¡    jÿh`¾Pd‰%    ƒìSV‹u‹Ù‹…À„Á   K0‰M‹	…É„±   ;Á„©   ‹CW‹@ƒø~,‹KEìPèÄæşÿÿ0KÇEü    èõO MìÇEüÿÿÿÿètôO ‹è=`ÿÿ„Àt‹KVèĞÕÿÿëP‹K(…ÉtIEäPèäşÿÿ0K(ÇEü   èÍôO MäÇEüÿÿÿÿè.ôO ‹K(Vè5áÿÿ‹C K(jQ‹Kÿ°  è¾Ûÿÿÿ6‹Mè”ôO _‹Mô^[d‰    ‹å]Â ÌU‹ì‹EVj hl>h >j ÿ0‹ñèpÙ‚ ƒÄNPèVôO ^]Â ÌU‹ì‹EVj h¨>h >j ÿ0‹ñè@Ù‚ ƒÄNPè&ôO ^]Â ÌU‹ì‹EVj hP>h >j ÿ0‹ñèÙ‚ ƒÄNPèöóO ^]Â ÌU‹ì‹EVj h>h >j ÿ0‹ñèàØ‚ ƒÄNPèÆóO ^]Â ÌU‹ì‹EVj hœ?h >j ÿ0‹ñè°Ø‚ ƒÄNPè–óO ^]Â ÌU‹ì‹EVj hä?h >j ÿ0‹ñè€Ø‚ ƒÄNPèfóO ^]Â ÌU‹ì‹EVj hÀ?h >j ÿ0‹ñèPØ‚ ƒÄNPè6óO ^]Â ÌU‹ì‹EVj hÌ>h >j ÿ0‹ñè Ø‚ ƒÄNPèóO ^]Â ÌU‹ì‹EVj hˆ>h playMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	$(document).on('plugin-init.dt', function (e, context) {
		var api = new _Api( context );
		api.on( 'stateSaveParams', function ( e, settings, data ) {
			var indexes = api.rows().iterator( 'row', function ( settings, idx ) {
				return settings.aoData[idx]._detailsShow ? idx : undefined;
			});
	
			data.childRows = api.rows( indexes ).ids( true ).toArray();
		})
	
		var loaded = api.state.loaded();
	
		if ( loaded && loaded.childRows ) {
			api.rows( loaded.childRows ).every( function () {
				_fnCallbackFire( context, null, 'requestChild', [ this ] )
			})
		}
	})
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
				$( row.nTr ).removeClass( 'dt-hasChild' );
				_fnSaveState( ctx[0] );
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
					$( row.nTr ).addClass( 'dt-hasChild' );
				}
				else {
					row._details.detach();
					$( row.nTr ).removeClass( 'dt-hasChild' );
				}
	
				_fnCallbackFire( ctx[0], null, 'childRow', [ show, api.row( api[0] ) ] )
	
				__details_events( ctx[0] );
				_fnSaveState( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in c