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

CodeMirror.defineMode("haskell", function(_config, modeConfig) {

  function switchState(source, setState, f) {
    setState(f);
    return f(source, setState);
  }

  // These should all be Unicode extended, as per the Haskell 2010 report
  var smallRE = /[a-z_]/;
  var largeRE = /[A-Z]/;
  var digitRE = /\d/;
  var hexitRE = /[0-9A-Fa-f]/;
  var octitRE = /[0-7]/;
  var idRE = /[a-z_A-Z0-9'\xa1-\uffff]/;
  var symbolRE = /[-!#$%&*+.\/<=>?@\\^|~:]/;
  var specialRE = /[(),;[\]`{}]/;
  var whiteCharRE = /[ \t\v\f]/; // newlines are handled in tokenizer

  function normal(source, setState) {
    if (source.eatWhile(whiteCharRE)) {
      return null;
    }

    var ch = source.next();
    if (specialRE.test(ch)) {
      if (ch == '{' && source.eat('-')) {
        var t = "comment";
        if (source.eat('#')) {
          t = "meta";
        }
        return switchState(source, setState, ncomment(t, 1));
      }
      return null;
    }

    if (ch == '\'') {
      if (source.eat('\\')) {
        source.next();  // should handle other escapes here
      }
      else {
        source.next();
      }
      if (source.eat('\'')) {
        return "string";
      }
      return "string error";
    }

    if (ch == '"') {
      return switchState(source, setState, stringLiteral);
    }

    if (largeRE.test(ch)) {
      source.eatWhile(idRE);
      if (source.eat('.')) {
        return "qualifier";
      }
      return "variable-2";
    }

    if (smallRE.test(ch)) {
      source.eatWhile(idRE);
      return "variable";
    }

    if (digitRE.test(ch)) {
      if (ch == '0') {
        if (source.eat(/[xX]/)) {
          source.eatWhile(hexitRE); // should require at least 1
          return "integer";
        }
        if (source.eat(/[oO]/)) {
          source.eatWhile(octitRE); // should require at least 1
          return "number";
        }
      }
      source.eatWhile(digitRE);
      var t = "number";
      if (source.match(/^\.\d+/)) {
        t = "number";
      }
      if (source.eat(/[eE]/)) {
        t = "number";
        source.eat(/[-+]/);
        source.eatWhile(digitRE); // should require at least 1
      }
      return t;
    }

    if (ch == "." && source.eat("."))
      return "keyword";

    if (symbolRE.test(ch)) {
      if (ch == '-' && source.eat(/-/)) {
        source.eatWhile(/-/);
        if (!source.eat(symbolRE)) {
          source.skipToEnd();
          return "comment";
        }
      }
      var t = "variable";
      if (ch == ':') {
        t = "variable-2";
      }
      source.eatWhile(symbolRE);
      return t;
    }

    return "error";
  }

  function ncomment(type, nest) {
    if (nest == 0) {
      return normal;
    }
    return function(source, setState) {
      var currNest = nest;
      while (!source.eol()) {
        var ch = source.next();
        if (ch == '{' && source.eat('-')) {
          ++currNest;
        }
        else if (ch == '-' && source.eat('}')) {
          --currNest;
          if (currNest == 0) {
            setState(normal);
            return type;
          }
        }
      }
      setState(ncomment(type, currNest));
      return type;
    };
  }

  function stringLiteral(source, setState) {
    while (!source.eol()) {
      var ch = source.next();
      if (ch == '"') {
        setState(normal);
        return "string";
      }
      if (ch == '\\') {
        if (source.eol() || source.eat(whiteCharRE)) {
          setState(stringGap);
          return "string";
        }
        if (source.eat('&')) {
        }
        else {
          source.next(); // should handle other escapes here
        }
      }
    }
    setState(normal);
    return "string error";
  }

  function stringGap(source, setState) {
    if (source.eat('\\')) {
      return switchState(source, setState, stringLiteral);
    }
    source.next();
    setState(normal);
    return "error";
  }


  var wellKnownWords = (function() {
    var wkw = {};
    function setType(t) {
      return function () {
        for (var i = 0; i < arguments.length; i++)
          wkw[arguments[i]] = t;
      };
    }

    setType("keyword")(
      "case", "class", "data", "default", "deriving", "do", "else", "foreign",
      "if", "import", "in", "infix", "infixl", "infixr", "instance", "let",
      "module", "newtype", "of", "then", "type", "where", "_");

    setType("keyword")(
      "\.\.", ":", "::", "=", "\\", "<-", "->", "@", "~", "=>");

    setType("builtin")(
      "!!", "$!", "$", "&&", "+", "++", "-", ".", "/", "/=", "<", "<*", "<=",
      "<$>", "<*>", "=<<", "==", ">", ">=", ">>", ">>=", "^", "^^", "||", "*",
      "*>", "**");

    setType("builtin")(
      "Applicative", "Bool", "Bounded", "Char", "Double", "EQ", "Either", "Enum",
      "Eq", "False", "FilePath", "Float", "Floating", "Fractional", "Functor",
      "GT", "IO", "IOError", "Int", "Integer", "Integral", "Just", "LT", "Left",
      "Maybe", "Monad", "Nothing", "Num", "Ord", "Ordering", "Rational", "Read",
      "ReadS", "Real", "RealFloat", "RealFrac", "Right", "Show", "ShowS",
      "String", "True");

    setType("builtin")(
      "abs", "acos", "acosh", "all", "and", "any", "appendFile", "asTypeOf",
      "asin", "asinh", "atan", "atan2", "atanh", "break", "catch", "ceiling",
      "compare", "concat", "concatMap", "const", "cos", "cosh", "curry",
      "cycle", "decodeFloat", "div", "divMod", "drop", "dropWhile", "either",
      "elem", "encodeFloat", "enumFrom", "enumFromThen", "enumFromThenTo",
      "enumFromTo", "error", "even", "exp", "exponent", "fail", "filter",
      "flip", "floatDigits", "floatRadix", "floatRange", "floor", "fmap",
      "foldl", "foldl1", "foldr", "foldr1", "fromEnum", "fromInteger",
      "fromIntegral", "fromRational", "fst", "gcd", "getChar", "getContents",
      "getLine", "head", "id", "init", "interact", "ioError", "isDenormalized",
      "isIEEE", "isInfinite", "isNaN", "isNegativeZero", "iterate", "last",
      "lcm", "length", "lex", "lines", "log", "logBase", "lookup", "map",
      "mapM", "mapM_", "max", "maxBound", "maximum", "maybe", "min", "minBound",
      "minimum", "mod", "negate", "not", "notElem", "null", "odd", "or",
      "otherwise", "pi", "pred", "print", "product", "properFraction", "pure",
      "putChar", "putStr", "putStrLn", "quot", "quotRem", "read", "readFile",
      "readIO", "readList", "readLn", "readParen", "reads", "readsPrec",
      "realToFrac", "recip", "rem", "repeat", "replicate", "return", "reverse",
      "round", "scaleFloat", "scanl", "scanl1", "scanr", "scanr1", "seq",
      "sequence", "sequence_", "show", "showChar", "showList", "showParen",
      "showString", "shows", "showsPrec", "significand", "signum", "sin",
      "sinh", "snd", "span", "splitAt", "sqrt", "subtract", "succ", "sum",
      "tail", "take", "takeWhile", "tan", "tanh", "toEnum", "toInteger",
      "toRational", "truncate", "uncurry", "undefined", "unlines", "until",
      "unwords", "unzip", "unzip3", "userError", "words", "writeFile", "zip",
      "zip3", "zipWith", "zipWith3");

    var override = modeConfig.overrideKeywords;
    if (override) for (var word in override) if (override.hasOwnProperty(word))
      wkw[word] = override[word];

    return wkw;
  })();



  return {
    startState: function ()  { return { f: normal }; },
    copyState:  function (s) { return { f: s.f }; },

    token: function(stream, state) {
      var t = state.f(stream, function(s) { state.f = s; });
      var w = stream.current();
      return wellKnownWords.hasOwnProperty(w) ? wellKnownWords[w] : t;
    },

    blockCommentStart: "{-",
    blockCommentEnd: "-}",
    lineComment: "--"
  };

});

CodeMirror.defineMIME("text/x-haskell", "haskell");

});
                           Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜XﬁÅ√   Èc  çI ãº$h  Éˇ åp  (x@(3(ÓYÙX∆(sYÊXÃ(`YÏX’YÙXﬁ(` (s (ÓYÙX∆(s0YÊXÃ(`0YÏX’YÙXﬁ(†Ä   (s@(ÓY˜X∆(sPY˛Xœ(xPYÔX’Y˜Xﬁ(x`(s`(ÓY˜X∆(spY˛Xœ(xpYÔX’Y˜Xﬁ(∏¿   (≥Ä   (ÓYÙX∆(≥ê   YÊXÃ(†ê   YÏX’YÙXﬁ(††   (≥†   (ÓYÙX∆(≥∞   YÊXÃ(†∞   YÏX’YÙXﬁ(†   (≥¿   (ÓY˜X∆(≥–   Y˛Xœ(∏–   YÔX’Y˜Xﬁ(∏‡   (≥‡   (ÓY˜X∆(≥   Y˛Xœ(∏   YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ   Å√   ÉÔ Éˇ çß¸ˇˇÉˇ éÓ  ç§$    ç§$    ( (x@(3(ÓYÙX∆(sYÊXÃ(`YÏX’YÙXﬁÉˇéö  (` (s (ÓYÙX∆(s0YÊXÃ(`0YÏX’YÙXﬁÉˇéf  (†Ä   (s@(ÓY˜X∆(sPY˛Xœ(xPYÔX’Y˜XﬁÉˇé/  (x`(s`(ÓY˜X∆(spY˛Xœ(xpYÔX’Y˜XﬁÉˇé˚  (∏¿   (≥Ä   (ÓYÙX∆(≥ê   YÊXÃ(†ê   YÏX’YÙXﬁÉˇ
éª  (††   (≥†   (ÓYÙX∆(≥∞   YÊXÃ(†∞   YÏX’YÙXﬁÉˇé{  (†   (≥¿   (ÓY˜X∆(≥–   Y˛Xœ(∏–   YÔX’Y˜XﬁÉˇé;  (∏‡   (≥‡   (ÓY˜X∆(≥   Y˛Xœ(∏   YÔX’Y˜XﬁÉˇé˚  (∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁÉˇéª  (†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁÉˇé{  (†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜XﬁÉˇé;  (∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜XﬁÉˇé˚   (∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁÉˇéª   (††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁÉˇé{   (†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜XﬁÉˇ~?(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜XﬁÉˇ ~çI ú$(  ç§$    ãˇã¥$X  É˛ u$Ú|¬X)Ú|ÀX
)
Î<ç§$        Ú|¬!aXƒAÚ|À,
l
XÕ
L
ãˇçQãÑ$@  ÉÌèç‹ˇˇç§$    çõ    ãÑ$@  Ñ$l  âÑ$@  ãå$H  É¡âå$H  ãú$ÿ  ã¨$L  ãº$t  ÉÔâº$t  ç5‹ˇˇ    ãå$H  å$<  âå$H  ãº$x  ÉÔâº$x  çD⁄ˇˇçd$ ãº$x  É«âº$x  Éˇ Ñvä  Éˇ}Éˇç¯%  ÉˇçœK  ÉˇÑñq  «Ñ$L     ãº$|  ãî$P  ã¨$`  ã¥$L  ãÑ$T  É¯ÑØ   ç§$    ç§$    êfÔ¿(»ç§$    ãˇÉˇ|+Úe )#Ú,*)kÉ≈É√ ÉÔÎﬂç§$    ç§$    êãº$d  Éˇ t$ÛE Ú¿)Û*Ú…)KÉ√ ç§$    êã¨$`  çlU â¨$`  ãº$|  ÉÓènˇˇˇÈπ   ç§$    ãˇfÔ¿(»ç§$    ãˇÉˇ|;Ûe Û4*Ê∆‰àÛmÛt*Ó∆Ìà)#)kçlU É√ ÉÔÎ≈    ãº$d  Éˇ t$ÛE f∆¿ ÛMf∆… ))KÉ√ çõ    ã¨$`  É≈â¨$`  ãº$|  ÉÓè_ˇˇˇç§$    ç§$    êãú$ÿ  ãÑ$º  âÑ$@  ãº$Ä  ÉÔâº$t  å‰#  ãî$\  ã¨$L  çõ    ( fÔ¿(–fÔ…(Ÿ(kI L
 ãº$h  Åˇ   åo  ç§$    ç§$    ê(x@(3(ÓYÙX∆(sYÊXÃ(`YÏX’YÙXﬁ(` (s (ÓYÙX∆(s0YÊXÃ(`0YÏX’YÙXﬁ(†Ä   (s@(ÓY˜X∆(sPY˛Xœ(xPYÔX’Y˜Xﬁ(x`(s`(ÓY˜X∆(spY˛Xœ(xpYÔX’Y˜Xﬁ(∏¿   (≥Ä   (ÓYÙX∆(≥ê   YÊXÃ(†ê   YÏX’YÙXﬁ(††   (≥†   (ÓYÙX∆(≥∞   YÊXÃ(†∞   YÏX’YÙXﬁ(†   (≥¿   (ÓY˜X∆(≥–   Y˛Xœ(∏–   YÔX’Y˜Xﬁ(∏‡   (≥‡   (ÓY˜X∆(≥   Y˛Xœ(∏   YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜Xﬁ(∏@  (≥   (ÓYÙX∆(≥  YÊXÃ(†  YÏX’YÙXﬁ(†   (≥   (ÓYÙX∆(≥0  YÊXÃ(†0  YÏX’YÙXﬁ(†Ä  (≥@  (ÓY˜X∆(≥P  Y˛Xœ(∏P  YÔX’Y˜Xﬁ(∏`  (≥`  (ÓY˜X∆(≥p  Y˛Xœ(∏p  YÔX’Y˜Xﬁ(∏¿  (≥Ä  (ÓYÙX∆(≥ê  YÊXÃ(†ê  YÏX’YÙXﬁ(††  (≥†  (ÓYÙX∆(≥∞  YÊXÃ(†∞  YÏX’YÙXﬁ(†   (≥¿  (ÓY˜X∆(≥–  Y˛Xœ(∏–  YÔX’Y˜Xﬁ(∏‡  (≥‡  (ÓY˜X∆(≥  Y˛Xœ(∏  YÔX’Y˜.string))) {
        stream.match(/^[a-z-]+/);
        override = "variable-3";
        if (endOfLine(stream)) return pushContext(state, stream, "block");
        return popContext(state);
      }
      return popAndPass(type, stream, state);
    };


    /**
     * atBlock
     */
    states.atBlock = function(type, stream, state) {
      if (type == "(") return pushContext(state, stream, "atBlock_parens");
      if (typeIsBlock(type, stream)) {
        return pushContext(state, stream, "block");
      }
      if (typeIsInterpolation(type, stream)) {
        return pushContext(state, stream, "interpolation");
      }
      if (type == "word") {
        var word = stream.current().toLowerCase();
        if (/^(only|not|and|or)$/.test(word))
          override = "keyword";
        else if (documentTypes.hasOwnProperty(word))
          override = "tag";
        else if (mediaTypes.hasOwnProperty(word))
          override = "attribute";
        else if (mediaFeatures.hasOwnProperty(word))
          override = "property";
        else if (nonStandardPropertyKeywords.hasOwnProperty(word))
          override = "string-2";
        else override = wordAsValue(stream.current());
        if (override == "tag" && endOfLine(stream)) {
          return pushContext(state, stream, "block");
        }
      }
      if (type == "operator" && /^(not|and|or)$/.test(stream.current())) {
        override = "keyword";
      }
      return state.context.type;
    };

    states.atBlock_parens = function(type, stream, state) {
      if (type == "{" || type == "}") return state.context.type;
      if (type == ")") {
        if (endOfLine(stream)) return pushContext(state, stream, "block");
        else return pushContext(state, stream, "atBlock");
      }
      if (type == "word") {
        var word = stream.current().toLowerCase();
        override = wordAsValue(word);
        if (/^(max|min)/.test(word)) override = "property";
        if (override == "tag") {
          tagVariablesRegexp.test(word) ? override = "variable-2" : override = "atom";
        }
        return state.context.type;
      }
      return states.atBlock(type, stream, state);
    };


    /**
     * Keyframes
     */
    states.keyframes = function(type, stream, state) {
      if (stream.indentation() == "0" && ((type == "}" && startOfLine(stream)) || type == "]" || type == "hash"
                                          || type == "qualifier" || wordIsTag(stream.current()))) {
        return popAndPass(type, stream, state);
      }
      if (type == "{") return pushContext(state, stream, "keyframes");
      if (type == "}") {
        if (startOfLine(stream)) return popContext(state, true);
        else return pushContext(state, stream, "keyframes");
      }
      if (type == "unit" && /^[0-9]+\%$/.test(stream.current())) {
        return pushContext(state, stream, "keyframes");
      }
      if (type == "word") {
        override = wordAsValue(stream.current());
        if (override == "block-keyword") {
          override = "keyword";
          return pushContext(state, stream, "keyframes");
        }
      }
      if (/@(font-face|media|supports|(-moz-)?document)/.test(type)) {
        return pushContext(state, stream, endOfLine(stream) ? "block" : "atBlock");
      }
      if (type == "mixin") {
        return pushContext(state, stream, "block", 0);
      }
      return state.context.type;
    };


    /**
     * Interpolation
     */
    states.interpolation = function(type, stream, state) {
      if (type == "{") popContext(state) && pushContext(state, stream, "block");
      if (type == "}") {
        if (stream.string.match(/^\s*(\.|#|:|\[|\*|&|>|~|\+|\/)/i) ||
            (stream.string.match(/^\s*[a-z]/i) && wordIsTag(firstWordOfLine(stream)))) {
          return pushContext(state, stream, "block");
        }
        if (!stream.string.match(/^(\{|\s*\&)/) ||
            stream.match(/\s*[\w-]/,false)) {
          return pushContext(state, stream, "block", 0);
        }
        return pushContext(state, stream, "block");
      }
      if (type == "variable-name") {
        return pushContext(state, stream, "variableName", 0);
      }
      if (type == "word") {
        override = wordAsValue(stream.current());
        if (override == "tag") override = "atom";
      }
      return state.context.type;
    };


    /**
     * Extend/s
     */
    states.extend = function(type, stream, state) {
      if (type == "[" || type == "=") return "extend";
      if (type == "]") return popContext(state);
      if (type == "word") {
        override = wordAsValue(stream.current());
        return "extend";
      }
      return popContext(state);
    };


    /**
     * Variable name
     */
    states.variableName = function(type, stream, state) {
      if (type == "string" || type == "[" || type == "]" || stream.current().match(/^(\.|\$)/)) {
        if (stream.current().match(/^\.[\w-]+/i)) override = "variable-2";
        return "variableName";
      }
      return popAndPass(type, stream, state);
    };


    return {
      startState: function(base) {
        return {
          tokenize: null,
          state: "block",
          context: new Context("block", base || 0, null)
        };
      },
      token: function(stream, state) {
        if (!state.tokenize && stream.eatSpace()) return null;
        style = (state.tokenize || tokenBase)(stream, state);
        if (style && typeof style == "object") {
          type = style[1];
          style = style[0];
        }
        override = style;
        state.state = states[state.state](type, stream, state);
        return override;
      },
      indent: function(state, textAfter, line) {

        var cx = state.context,
            ch = textAfter && textAfter.charAt(0),
            indent = cx.indent,
            lineFirstWord = firstWordOfLine(textAfter),
            lineIndent = line.match(/^\s*/)[0].replace(/\t/g, indentUnitString).length,
            prevLineFirstWord = state.context.prev ? state.context.prev.line.firstWord : "",
            prevLineIndent = state.context.prev ? state.context.prev.line.indent : lineIndent;

        if (cx.prev &&
            (ch == "}" && (cx.type == "block" || cx.type == "atBlock" || cx.type == "keyframes") ||
             ch == ")" && (cx.type == "parens" || cx.type == "atBlock_parens") ||
             ch == "{" && (cx.type == "at"))) {
          indent = cx.indent - indentUnit;
        } else if (!(/(\})/.test(ch))) {
          if (/@|\$|\d/.test(ch) ||
              /^\{/.test(textAfter) ||
/^\s*\/(\/|\*)/.test(textAfter) ||
              /^\s*\/\*/.test(prevLineFirstWord) ||
              /^\s*[\w-\.\[\]\'\"]+\s*(\?|:|\+)?=/i.test(textAfter) ||
/^(\+|-)?[a-z][\w-]*\(/i.test(textAfter) ||
/^return/.test(textAfter) ||
              wordIsBlock(lineFirstWord)) {
            indent = lineIndent;
          } else if (/(\.|#|:|\[|\*|&|>|~|\+|\/)/.test(ch) || wordIsTag(lineFirstWord)) {
            if (/\,\s*$/.test(prevLineFirstWord)) {
              indent = prevLineIndent;
            } else if (/^\s+/.test(line) && (/(\.|#|:|\[|\*|&|>|~|\+|\/)/.test(prevLineFirstWord) || wordIsTag(prevLineFirstWord))) {
              indent = lineIndent <= prevLineIndent ? prevLineIndent : prevLineIndent + indentUnit;
            } else {
              indent = lineIndent;
            }
          } else if (!/,\s*$/.test(line) && (wordIsVendorPrefix(lineFirstWord) || wordIsProperty(lineFirstWord))) {
            if (wordIsBlock(prevLineFirstWord)) {
              indent = lineIndent <= prevLineIndent ? prevLineIndent : prevLineIndent + indentUnit;
            } else if (/^\{/.test(prevLineFirstWord)) {
              indent = lineIndent <= prevLineIndent ? lineIndent : prevLineIndent + indentUnit;
            } else if (wordIsVendorPrefix(prevLineFirstWord) || wordIsProperty(prevLineFirstWord)) {
              indent = lineIndent >= prevLineIndent ? prevLineIndent : lineIndent;
            } else if (/^(\.|#|:|\[|\*|&|@|\+|\-|>|~|\/)/.test(prevLineFirstWord) ||
                      /=\s*$/.test(prevLineFirstWord) ||
                      wordIsTag(prevLineFirstWord) ||
                      /^\$[\w-\.\[\]\'\"]/.test(prevLineFirstWord)) {
              indent = prevLineIndent + indentUnit;
            } else {
              indent = lineIndent;
            }
          }
        }
        return indent;
      },
      electricChars: "}",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
      blockCommentContinue: " * ",
      lineComment: "//",
      fold: "indent"
    };
  });

  // developer.mozilla.org/en-US/docs/Web/HTML/Element
  var tagKeywords_ = ["a","abbr","address","area","article","aside","audio", "b", "base","bdi", "bdo","bgsound","blockquote","body","br","button","canvas","caption","cite", "code","col","colgroup","data","datalist","dd","del","details","dfn","div", "dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1", "h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe", "img","input","ins","kbd","keygen","label","legend","li","link","main","map", "mark","marquee","menu","menuitem","meta","meter","nav","nobr","noframes", "noscript","object","ol","optgroup","option","output","p","param","pre", "progress","q","rp","rt","ruby","s","samp","script","section","select", "small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","track", "u","ul","var","video"];

  // github.com/codemirror/CodeMirror/blob/master/mode/css/css.js
  // Note, "url-prefix" should precede "url" in order to match correctly in documentTypesRegexp
  var documentTypes_ = ["domain", "regexp", "url-prefix", "url"];
  var mediaTypes_ = ["all","aural","braille","handheld","print","projection","screen","tty","tv","embossed"];
  var mediaFeatures_ = ["width","min-width","max-width","height","min-height","max-height","device-width","min-device-width","max-device-width","device-height","min-device-height","max-device-height","aspect-ratio","min-aspect-ratio","max-aspect-ratio","device-aspect-ratio","min-device-aspect-ratio","max-device-aspect-ratio","color","min-color","max-color","color-index","min-color-index","max-color-index","monochrome","min-monochrome","max-monochrome","resolution","min-resolution","max-resolution","scan","grid","dynamic-range","video-dynamic-range"];
  var propertyKeywords_ = ["align-content","align-items","align-self","alignment-adjust","alignment-baseline","anchor-point","animation","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-timing-function","appearance","azimuth","backface-visibility","background","background-attachment","background-clip","background-color","background-image","background-origin","background-position","background-repeat","background-size","baseline-shift","binding","bleed","bookmark-label","bookmark-level","bookmark-state","bookmark-target","border","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-decoration-break","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","clear","clip","color","color-profile","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","content","counter-increment","counter-reset","crop","cue","cue-after","cue-before","cursor","direction","display","dominant-baseline","drop-initial-after-adjust","drop-initial-after-align","drop-initial-before-adjust","drop-initial-before-align","drop-initial-size","drop-initial-value","elevation","empty-cells","fit","fit-position","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","float-offset","flow-from","flow-into","font","font-feature-settings","font-family","font-kerning","font-language-override","font-size","font-size-adjust","font-stretch","font-style","font-synthesis","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-ligatures","font-variant-numeric","font-variant-position","font-weight","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-position","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphens","icon","image-orientation","image-rendering","image-resolution","inline-box-align","justify-content","left","letter-spacing","line-break","line-height","line-stacking","line-stacking-ruby","line-stacking-shift","line-stacking-strategy","list-style","list-style-image","list-style-position","list-style-type","margin","margin-bottom","margin-left","margin-right","margin-top","marker-offset","marks","marquee-direction","marquee-loop","marquee-play-count","marquee-speed","marquee-style","max-height","max-width","min-height","min-width","move-to","nav-down","nav-index","nav-left","nav-right","nav-up","object-fit","object-position","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-style","overflow-wrap","overflow-x","overflow-y","padding","padding-bottom","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","page-policy","pause","pause-after","pause-before","perspective","perspective-origin","pitch","pitch-range","play-during","position","presentation-level","punctuation-trim","quotes","region-break-after","region-break-before","region-break-inside","region-fragment","rendering-intent","resize","rest","rest-after","rest-before","richness","right","rotation","rotation-point","ruby-align","ruby-overhang","ruby-position","ruby-span","shape-image-threshold","shape-inside","shape-margin","shape-outside","size","speak","speak-as","speak-header","speak-numeral","speak-punctuation","speech-rate","stress","string-set","tab-size","table-layout","target","target-name","target-new","target-position","text-align","text-align-last","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-style","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-height","text-indent","text-justify","text-outline","text-overflow","text-shadow","text-size-adjust","text-space-collapse","text-transform","text-underline-position","text-wrap","top","transform","transform-origin","transform-style","transition","transition-delay","transition-duration","transition-property","transition-timing-function","unicode-bidi","vertical-align","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","volume","white-space","widows","width","will-change","word-break","word-spacing","word-wrap","z-index","clip-path","clip-rule","mask","enable-background","filter","flood-color","flood-opacity","lighting-color","stop-color","stop-opacity","pointer-events","color-interpolation","color-interpolation-filters","color-rendering","fill","fill-opacity","fill-rule","image-rendering","marker","marker-end","marker-mid","marker-start","shape-rendering","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","text-rendering","baseline-shift","dominant-baseline","glyph-orientation-horizontal","glyph-orientation-vertical","text-anchor","writing-mode","font-smoothing","osx-font-smoothing"];
  var nonStandardPropertyKeywords_ = ["scrollbar-arrow-color","scrollbar-base-color","scrollbar-dark-shadow-color","scrollbar-face-color","scrollbar-highl= init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Convert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Convert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string - but it
						// must not be empty
						if ( detectedType === 'html' && ! _empty(cache[k]) ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node et