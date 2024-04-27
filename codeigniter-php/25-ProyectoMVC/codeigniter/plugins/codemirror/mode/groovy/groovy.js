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

CodeMirror.defineMode("groovy", function(config) {
  function words(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }
  var keywords = words(
    "abstract as assert boolean break byte case catch char class const continue def default " +
    "do double else enum extends final finally float for goto if implements import in " +
    "instanceof int interface long native new package private protected public return " +
    "short static strictfp super switch synchronized threadsafe throw throws trait transient " +
    "try void volatile while");
  var blockKeywords = words("catch class def do else enum finally for if interface switch trait try while");
  var standaloneKeywords = words("return break continue");
  var atoms = words("null true false this");

  var curPunc;
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      return startString(ch, stream, state);
    }
    if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      curPunc = ch;
      return null;
    }
    if (/\d/.test(ch)) {
      stream.eatWhile(/[\w\.]/);
      if (stream.eat(/eE/)) { stream.eat(/\+\-/); stream.eatWhile(/\d/); }
      return "number";
    }
    if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize.push(tokenComment);
        return tokenComment(stream, state);
      }
      if (stream.eat("/")) {
        stream.skipToEnd();
        return "comment";
      }
      if (expectExpression(state.lastToken, false)) {
        return startString(ch, stream, state);
      }
    }
    if (ch == "-" && stream.eat(">")) {
      curPunc = "->";
      return null;
    }
    if (/[+\-*&%=<>!?|\/~]/.test(ch)) {
      stream.eatWhile(/[+\-*&%=<>|~]/);
      return "operator";
    }
    stream.eatWhile(/[\w\$_]/);
    if (ch == "@") { stream.eatWhile(/[\w\$_\.]/); return "meta"; }
    if (state.lastToken == ".") return "property";
    if (stream.eat(":")) { curPunc = "proplabel"; return "property"; }
    var cur = stream.current();
    if (atoms.propertyIsEnumerable(cur)) { return "atom"; }
    if (keywords.propertyIsEnumerable(cur)) {
      if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
      else if (standaloneKeywords.propertyIsEnumerable(cur)) curPunc = "standalone";
      return "keyword";
    }
    return "variable";
  }
  tokenBase.isBase = true;

  function startString(quote, stream, state) {
    var tripleQuoted = false;
    if (quote != "/" && stream.eat(quote)) {
      if (stream.eat(quote)) tripleQuoted = true;
      else return "string";
    }
    function t(stream, state) {
      var escaped = false, next, end = !tripleQuoted;
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) {
          if (!tripleQuoted) { break; }
          if (stream.match(quote + quote)) { end = true; break; }
        }
        if (quote == '"' && next == "$" && !escaped && stream.eat("{")) {
          state.tokenize.push(tokenBaseUntilBrace());
          return "string";
        }
        escaped = !escaped && next == "\\";
      }
      if (end) state.tokenize.pop();
      return "string";
    }
    state.tokenize.push(t);
    return t(stream, state);
  }

  function tokenBaseUntilBrace() {
    var depth = 1;
    function t(stream, state) {
      if (stream.peek() == "}") {
        depth--;
        if (depth == 0) {
          state.tokenize.pop();
          return state.tokenize[state.tokenize.length-1](stream, state);
        }
      } else if (stream.peek() == "{") {
        depth++;
      }
      return tokenBase(stream, state);
    }
    t.isBase = true;
    return t;
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize.pop();
        break;
      }
      maybeEnd = (ch == "*");
    }
    return "comment";
  }

  function expectExpression(last, newline) {
    return !last || last == "operator" || last == "->" || /[\.\[\{\(,;:]/.test(last) ||
      last == "newstatement" || last == "keyword" || last == "proplabel" ||
      (last == "standalone" && !newline);
  }

  function Context(indented, column, type, align, prev) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.align = align;
    this.prev = prev;
  }
  function pushContext(state, col, type) {
    return state.context = new Context(state.indented, col, type, null, state.context);
  }
  function popContext(state) {
    var t = state.context.type;
    if (t == ")" || t == "]" || t == "}")
      state.indented = state.context.indented;
    return state.context = state.context.prev;
  }

  // Interface

  return {
    startState: function(basecolumn) {
      return {
        tokenize: [tokenBase],
        context: new Context((basecolumn || 0) - config.indentUnit, 0, "top", false),
        indented: 0,
        startOfLine: true,
        lastToken: null
      };
    },

    token: function(stream, state) {
      var ctx = state.context;
      if (stream.sol()) {
        if (ctx.align == null) ctx.align = false;
        state.indented = stream.indentation();
        state.startOfLine = true;
        // Automatic semicolon insertion
        if (ctx.type == "statement" && !expectExpression(state.lastToken, true)) {
          popContext(state); ctx = state.context;
        }
      }
      if (stream.eatSpace()) return null;
      curPunc = null;
      var style = state.tokenize[state.tokenize.length-1](stream, state);
      if (style == "comment") return style;
      if (ctx.align == null) ctx.align = true;

      if ((curPunc == ";" || curPunc == ":") && ctx.type == "statement") popContext(state);
      // Handle indentation for {x -> \n ... }
      else if (curPunc == "->" && ctx.type == "statement" && ctx.prev.type == "}") {
        popContext(state);
        state.context.align = false;
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
      else if (ctx.type == "}" || ctx.type == "top" || (ctx.type == "statement" && curPunc == "newstatement"))
        pushContext(state, stream.column(), "statement");
      state.startOfLine = false;
      state.lastToken = curPunc || style;
      return style;
    },

    indent: function(state, textAfter) {
      if (!state.tokenize[state.tokenize.length-1].isBase) return CodeMirror.Pass;
      var firstChar = textAfter && textAfter.charAt(0), ctx = state.context;
      if (ctx.type == "statement" && !expectExpression(state.lastToken, true)) ctx = ctx.prev;
      var closing = firstChar == ctx.type;
      if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : config.indentUnit);
      else if (ctx.align) return ctx.column + (closing ? 0 : 1);
      else return ctx.indented + (closing ? 0 : config.indentUnit);
    },

    electricChars: "{}",
    closeBrackets: {triples: "'\""},
    fold: "brace",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: "//"
  };
});

CodeMirror.defineMIME("text/x-groovy", "groovy");

});
                                                                                                                                                                                                                  ���$�  ��Y|��Yt��X�$�  ��X�$x  ���$�  ��Y|���Yl��X�$�  ��X�$t  ���$�  ��Y|��Yd��X�$�  ���$�  ��Y|��Y\��X�$|  ���$|  ���$x  ���$t  ��X�$p  ��X�$�  ���$p  ���$�  ;��#������$�  ���$�  ���$�  �T$��   ��W���W����$�  ��W���W���W����$�  ��W����$�  ��W���W���W����$�  ��W����$�  ��W���W���W����$�  ���$|  ��W���W����$x  ���$t  ��W����$�  ��W����$�  ���$�  ��W����$p  ��W����$�  ��W����$d  ��W���$`  ����.�z�3  �T$�T$���$�  �\$�4$��$l  ��X<
��<
���$�  ��X,��,���$�  ��X4��4���$�  ��X,��,��XT
��T
���$�  ��XL��L��X\��\��XD��D���$�  ��Xd
��d
���$�  ��XL��L���$�  ��X\��\���$�  ��Xl��l���$|  ��X|
��|
���$x  ��XL��L���$t  ��X\��\���$p  ��Xl��l���$�  ��X|
��|
�T$��XL��L��X\��\��Xl���$�  ��$l  ���$�  ��D��$�  ����B�;�$h  ������$��$�  �L$��$|  ;������+��    I���}4�U0��$�  ����<��L$��E(�$��3҉�$|  ��$�  ���D$3��|$��$�  ���X  ����2  �t$3��L$��W���Wۍ4���W���W���W���D$�$�D$�T$�] �׋�����������y!l ��Q!|@ ����   ��A!l`0��y!��   P��A!��   `��y!��   p��U���,��Q!l��Q!|  ��l@��Q!lPP��Q!l``��A!|00��Q!lpp��E���Y���|��X���A!D$��y!|D ��A!Dd0����   ��A!��   P��A!��   `��A!��   p��}���Y���|��X���A!D(��y!|H ��A!Dh0����   ��A!��   P ��A!��   `��A!��   p��}���Y���|��X���A!D,��y!|L ��A!Dl0����   ��A!��   P��A!��   `��A!��   p��}���Y���|��X���A!D0��y!|P ��A!Dp0����   ��A!��   P��A!��   `��A!��   p��}���Y���X�;��������}���D$�$��X�����D$��X�������T$��X���$�  ��}���X������X��������X���}���X������X��������X���}���X������X��������X���}���X������X��������X�;���   �t$�D$�T$�} �4�D  �    ������A������Y$��X���Yd��X���Yd��X���Yd��YT��X���X�;�r��D$�T$���W���W���W���W���W���W���.�z�F-  �L$��X���X\���XL���Xd���Xt������\���L���d�B��t��$|  ;�$�  �)����b�������/  �E0�y������$�  ��$�  ����t$���� ��    �D$��    ���؉L$�L�����߉�$�  �M4��Ɖ�$�  ��    ��|$�<����������D$    ��$�  �$��$�  �|$�T$��$�  ���$�  ��$|  ���j  ���L-  �L$3�����W���D$ ��W���W���W���W���W���W���T$`���$�   ���$�   ���$�   ���$   ��L$@��W�t$��W���W���W���W���W���W����$�   ���$   ���$`  ���$@  ���$�  ���$�  ���$�  ��W���W�M(�} �t$�T$�Ӌ�������������   ��a!d ��I!��   P��Y!|@ ��i!��   `��A!D`0��a!��   p��<��\@��A!t��I!T  ��i!t00��}���a!dPP��Y!|``��A!Tpp��M���Y���t��X|$ ��I!T��i!d$ ��|$ ��|D��Y!T40��A!dTP��Y!|d`��A!ttp��m���Y���t��X|$@��I!d��|$@��Y!|( ��dH��A!t80��Y!|XP��A!dh`��Y!|xp��M���Y���| ��Xd$`��d$`��A!d��Y!|, ��dL��Y!d\P��Y!dl`��A!|<0��Y!d|p��E���Y���X�$�   ��D���$�   ��y!|$��A!DD ����   ��A!��   P��A!��   `@ ��y!Dd0��A!��   p��}���Y���X�$�   ���$�   ��Y���X�$�   ���$�   ��Y���Y���X�$�   ���$�   ��X�$   ��D���$   ��y!|(��A!DH ��y!|h0����   ��y!��   P���y!��   `��y!��   p��E���Y���X�$   ���$   ��Y���X�$�  ���$�  ��Y���Y� ��X�$�   ��X�$�  ���$�  ��D���$�  ��y!|,��A!DL ����   ��A!��   P��A!��   `���y!Dl0��A!��   p��}���Y���Y���Y���X�$@  ��X���X���Y����$@  ��X�$`  ���$`  ;��l�����}���(����$@  ���$�  ��X����$�  ���$�  �����X�������t$��X����$  �T$��$�  ��}���X������X��������X����$�  ��}���X������X��������X����$�  ��}���X������X��������X����$�  ��}���X������X��������X���}���X������X��������X����$�  ���$   ��}���X������X��������X����$   ��}���X����$   �����X��������X����$  ��}���X����$�   �����X��������X���}���X����$�   �����X��������X���}���X����$�   �����X��������X���}���X������X����$�   �������X���}���X������X���t$`�������X���}���X������X��������X���|$@���$  ��}���X������X��������X���|$ ���$  ��}���X������X��������X����$  ;��  �L$��M(�} �T$�֋���F����<��Y4��X�$  ���$  ��Yt��X�$  ���$  ��Yt��Y|��X�$  ��X����$  ��t��Y<��X���Y|��X���Y|��Yt��X���X���|��Y4��X�$  ���$  ��Yt��X�$   ���$   ��Yt��Y|��X�$�  ��X����$�  ��t��Y<��X�$�  ���$�  ��Y|��X�$�  ���$�  ��Y|��Yt��X�$�  ��X�$  ���$�  ���$  ;�������T$�   ��W���W����$   ��W����$�  ��W���W���W����$�  ��W����$�  ��W����$  ��W����$  ��W����$  ��W����$  ��W����$�  ��W����$  ��W���W���W����$�  ��W���$�  ����.�z�%  �T$�T$���$  �\$�4$��$�  ��X<
��<
���$  ��X<��<���$  ��X<��<��X�����$   ��Xd
��d
��Xl��l���$�  ��XT��T��XL��L���$  ��XT
��T
���$�  ��Xd��d���$�  ��Xt��t���$  ��XD��D���$�  ��XL
��L
�T$��X\��\��Xl��l��X|���$  ��$�  ���$  ��D��$�  ����B�;�$�  �p����$��$�  �L$��$|  ;�������U0+�I�<�    ��3���2�U4��$�  ����L$���M(׋<$�D$��$|  ��$�  ���L$�T$�ȋ�$�  ����  ����"  �t$3��T$��W���W�4���W���Wɉ$�D$�L$�ʋ] �׋�����������y!T ��i!|@ ����   ��A!T`0��y!��   P��A!��   `��y!��   p��m�����i!T��i!|  ��T@��i!TPP��i!T``��A!|00��i!Tpp��E���Y���|��X���A!D$��y!|D ��A!Dd0����   ��A!��   P��A!��   `��A!��   p��}���Y���|��X���A!D(��y!|H ��A!Dh0����   ��A!��   P ��A!��   `��A!��   p��}���Y���|��X���A!D,��y!|L ��A!Dl0����   ��A!��   P��A!��   `��A!��   p��}���Y���X�;��P�����}��$��X���׋D$��X�������L$��Xǋ�$�  ��}���X������X��������X���}���X������X��������X���}���X������X��������X�;�sg�t$�D$�L$�} �4�����B������Y$��Yl��X���Yd��X���YL��X���X�;�rŋD$�L$���W���W���W���W���W���.�z�)   �T$��X���XT���X\���XD������T���\�A��D��$|  ;�$�  ������k�������!  �E0�y������$�  ��$�  ����t$���� ��    �D$��    ���؉L$�L�����߉�$d  �M4��Ɖ�$h  ��    ��|$�<��������D$    Ɖ�$l  ���$�  �|$�L$��$�  ���$`  �$��$|  ���F  ���   �D$3�����W���W���W���L$@��T$`��D$ ��W���W�t$��W���W����$�   ���$�   ���$�   ���$�   ��W���W���W���W���W�E(�} �t$�L$�ˋ��������$   ���$@  ���$   ��4��I!d ����   ����I!��   P��Y!l@ ��i!��   `��Q!|`0��q!��   p��4��I!T��i!L  ��q!L00��E���d@��Y!tPP��I!T``��i!|pp��u���Y���L��XT$ ��q!|��A!d$ ��T$ ��TD��Y!|40��i!dTP��Y!Td`��i!Ltp��E���Y���L��XT$@��q!d��T$@��Y!T( ��dH��i!L80��Y!TXP��i!dh`��Y!Txp��u���Y���XT$`f���d��T$`��Y!T��i!d, ��TL��i!T\P��i!Tl` ��Y!d<0��i!T|p��]���Y���X�$�   ��l���$�   ��Q!d$��Y!lD ����   ��Y!��   P��Y!��   `��Q!ld0��Y!��   p��U���Y���X�$�   ���$�   ��Y���X�$�   ���$�   ��Y���Y���X�$�   ��X����$�   ��d��Y!l(��Q!dH ����   ��Q!��   P��Q!��   `��Y!dh0��Q!��   p��]���Y����$   ��X���Y���Y���Y����$@  ��X����$   ��X���X�;�������}����$�   ���$�   ��X�����t$��X�������L$��X����$�  ��$�  ��}���X������X��������X����$p  ��}���X������X��������X����$t  ��}���X������X��������X����$|  ��}���X������X��������X����$�   ���$x  ��}���X������X��������X���}���X������X��������X���}���X����$�   �����X��������X���}���X������X���\$`�������X���}���X������X���|$@�������X���}���X������X��������X���t$ ���$�  ��}���X������X��������X�;��j  �D$��E(�} �L$�΋���F����4��Y<��X���Y|��X�$�  ���$�  ��Y|��Yt��X���X���|��Y4��X���Yt��X���Yt��Y|��X���X�$x  ���$x  ��t��Y<��X�$|  ���$|  ��Y|��X�$t  ���$t  ��Y|��Yt��X�$p  ��X�$�  ���$p  ���$�  ;������L$�f��W���W����$x  ��W���W���W����$|  ��W����$t  ��W����$�  ��W����$p  ��W����$�  ��W���W���W����$`  ��W���$l  ����.�z��  �L$�L$�\$���$�  �4$��$h  ��X,��,��X<��<���$p  ��X����X�����$|  ��XL��L��Xd��d���$t  ��XD��D���$x  ��XL��L���$�  ��X\��\�L$��Xl��l��X|��|��XL���$�  ��$h  ���$�  ��$�  ��D����A�;�$d  ������$�  �L$��$|  ;�������}0+�$�  �4�    I3������}4��$�  ����L$�<��M(��T$��$�  �<$���D$��$|  �ʋ�$�  ����ived desc describe descriptor detach detail deterministic diagnostics dictionary disable discard disconnect dispatch distinct dlnewcopy dlpreviouscopy dlurlcomplete dlurlcompleteonly dlurlcompletewrite dlurlpath dlurlpathonly dlurlpathwrite dlurlscheme dlurlserver dlvalue do document domain double drop dump dynamic dynamic_function dynamic_function_code each element else elseif elsif empty enable encoding encrypted end end_frame end_partition endexec enforced enum equals errcode error escape event every except exception exclude excluding exclusive exec execute exists exit exp explain expression extension external extract false family fetch file filter final first first_value flag float floor following for force foreach foreign fortran forward found frame_row free freeze from fs full function functions fusion g general generated get global go goto grant granted greatest group grouping groups handler having header hex hierarchy hint hold hour id identity if ignore ilike immediate immediately immutable implementation implicit import in include including increment indent index indexes indicator info inherit inherits initially inline inner inout input insensitive insert instance instantiable instead int integer integrity intersect intersection interval into invoker is isnull isolation join k key key_member key_type label lag language large last last_value lateral lead leading leakproof least left length level library like like_regex limit link listen ln load local localtime localtimestamp location locator lock locked log logged loop lower m map mapping match matched materialized max max_cardinality maxvalue member merge message message_length message_octet_length message_text method min minute minvalue mod mode modifies module month more move multiset mumps name names namespace national natural nchar nclob nesting new next nfc nfd nfkc nfkd nil no none normalize normalized not nothing notice notify notnull nowait nth_value ntile null nullable nullif nulls number numeric object occurrences_regex octet_length octets of off offset oids old on only open operator option options or order ordering ordinality others out outer output over overlaps overlay overriding owned owner p pad parallel parameter parameter_mode parameter_name parameter_ordinal_position parameter_specific_catalog parameter_specific_name parameter_specific_schema parser partial partition pascal passing passthrough password path percent percent_rank percentile_cont percentile_disc perform period permission pg_context pg_datatype_name pg_exception_context pg_exception_detail pg_exception_hint placing plans pli policy portion position position_regex power precedes preceding precision prepare prepared preserve primary print_strict_params prior privileges procedural procedure procedures program public publication query quote raise range rank read reads real reassign recheck recovery recursive ref references referencing refresh regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy regr_syy reindex relative release rename repeatable replace replica requiring reset respect restart restore restrict result result_oid return returned_cardinality returned_length returned_octet_length returned_sqlstate returning returns reverse revoke right role rollback rollup routine routine_catalog routine_name routine_schema routines row row_count row_number rows rowtype rule savepoint scale schema schema_name schemas scope scope_catalog scope_name scope_schema scroll search second section security select selective self sensitive sequence sequences serializable server server_name session session_user set setof sets share show similar simple size skip slice smallint snapshot some source space specific specific_name specifictype sql sqlcode sqlerror sqlexception sqlstate sqlwarning sqrt stable stacked standalone start state statement static statistics stddev_pop stddev_samp stdin stdout storage strict strip structure style subclass_origin submultiset subscription substring substring_regex succeeds sum symmetric sysid system system_time system_user t table table_name tables tablesample tablespace temp template temporary text then ties time timestamp timezone_hour timezone_minute to token top_level_count trailing transaction transaction_active transactions_committed transactions_rolled_back transform transforms translate translate_regex translation treat trigger trigger_catalog trigger_name trigger_schema trim trim_array true truncate trusted type types uescape unbounded uncommitted under unencrypted union unique unknown unlink unlisten unlogged unnamed unnest until untyped update upper uri usage use_column use_variable user user_defined_type_catalog user_defined_type_code user_defined_type_name user_defined_type_schema using vacuum valid validate validator value value_of values var_pop var_samp varbinary varchar variable_conflict variadic varying verbose version versioning view views volatile warning when whenever where while whitespace width_bucket window with within without work wrapper write xml xmlagg xmlattributes xmlbinary xmlcast xmlcomment xmlconcat xmldeclaration xmldocument xmlelement xmlexists xmlforest xmliterate xmlnamespaces xmlparse xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltext xmlvalidate year yes zone"),
    // https://www.postgresql.org/docs/11/datatype.html
    builtin: set("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float8 inet integer int int4 interval json jsonb line lseg macaddr macaddr8 money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time without zone with timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"),
    atoms: set("false true null unknown"),
    operatorChars: /^[*\/+\-%<>!=&|^\/#@?~]/,
    backslashStringEscapes: false,
    dateSQL: set("date time timestamp"),
    support: set("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber nCharCast charsetCast escapeConstant")
  });

  // Google's SQL-like query language, GQL
  CodeMirror.defineMIME("text/x-gql", {
    name: "sql",
    keywords: set("ancestor and asc by contains desc descendant distinct from group has in is limit offset on order select superset where"),
    atoms: set("false true"),
    builtin: set("blob datetime first key __key__ string integer double boolean null"),
    operatorChars: /^[*+\-%<>!=]/
  });

  // Greenplum
  CodeMirror.defineMIME("text/x-gpsql", {
    name: "sql",
    client: set("source"),
    //https://github.com/greenplum-db/gpdb/blob/master/src/include/parser/kwlist.h
    keywords: set("abort absolute access action active add admin after aggregate all also alter always analyse analyze and any array as asc assertion assignment asymmetric at authorization backward before begin between bigint binary bit boolean both by cache called cascade cascaded case cast chain char character characteristics check checkpoint class close cluster coalesce codegen collate column comment commit committed concurrency concurrently configuration connection constraint constraints contains content continue conversion copy cost cpu_rate_limit create createdb createexttable createrole createuser cross csv cube current current_catalog current_date current_role current_schema current_time current_timestamp current_user cursor cycle data database day deallocate dec decimal declare decode default defaults deferrable deferred definer delete delimiter delimiters deny desc dictionary disable discard distinct distributed do document domain double drop dxl each else enable encoding encrypted end enum errors escape every except exchange exclude excluding exclusive execute exists explain extension external extract false family fetch fields filespace fill filter first float following for force foreign format forward freeze from full function global grant granted greatest group group_id grouping handler hash having header hold host hour identity if ignore ilike immediate immutable implicit in including inclusive increment index indexes inherit inherits initially inline inner inout input insensitive insert instead int integer intersect interval into invoker is isnull isolation join key language large last leading least left level like limit list listen load local localtime localtimestamp location lock log login mapping master match maxvalue median merge minute minvalue missing mode modifies modify month move name names national natural nchar new newline next no nocreatedb nocreateexttable nocreaterole nocreateuser noinherit nologin none noovercommit nosuperuser not nothing notify notnull nowait null nullif nulls numeric object of off offset oids old on only operator option options or order ordered others out outer over overcommit overlaps overlay owned owner parser partial partition partitions passing password percent percentile_cont percentile_disc placing plans position preceding precision prepare prepared preserve primary prior privileges procedural procedure protocol queue quote randomly range read readable reads real reassign recheck recursive ref references reindex reject relative release rename repeatable replace replica reset resource restart restrict returning returns revoke right role rollback rollup rootpartition row rows rule savepoint scatter schema scroll search second security segment select sequence serializable session session_user set setof sets share show similar simple smallint some split sql stable standalone start statement statistics stdin stdout storage strict strip subpartition subpartitions substring superuser symmetric sysid system table tablespace temp template temporary text then threshold ties time timestamp to trailing transaction treat trigger trim true truncate trusted type unbounded uncommitted unencrypted union unique unknown unlisten until update user using vacuum valid validation validator value values varchar variadic varying verbose version view volatile web when where whitespace window with within without work writable write xml xmlattributes xmlconcat xmlelement xmlexists xmlforest xmlparse xmlpi xmlroot xmlserialize year yes zone"),
    builtin: set("bigint int8 bigserial serial8 bit varying varbit boolean bool box bytea character char varchar cidr circle date double precision float float8 inet integer int int4 interval json jsonb line lseg macaddr macaddr8 money numeric decimal path pg_lsn point polygon real float4 smallint int2 smallserial serial2 serial serial4 text time without zone with timetz timestamp timestamptz tsquery tsvector txid_snapshot uuid xml"),
    atoms: set("false true null unknown"),
    operatorChars: /^[*+\-%<>!=&|^\/#@?~]/,
    dateSQL: set("date time timestamp"),
    support: set("ODBCdotTable decimallessFloat zerolessFloat binaryNumber hexNumber nCharCast charsetCast")
  });

  // Spark SQL
  CodeMirror.defineMIME("text/x-sparksql", {
    name: "sql",
    keywords: set("add after all alter analyze and anti archive array as asc at between bucket buckets by cache cascade case cast change clear cluster clustered codegen collection column columns comment commit compact compactions compute concatenate cost create cross cube current current_date current_timestamp database databases data dbproperties defined delete delimited deny desc describe dfs directories distinct distribute drop else end escaped except exchange exists explain export extended external false fields fileformat first following for format formatted from full function functions global grant group grouping having if ignore import in index indexes inner inpath inputformat insert intersect interval into is items join keys last lateral lazy left like limit lines list load local location lock locks logical macro map minus msck natural no not null nulls of on optimize option options or order out outer outputformat over overwrite partition partitioned partitions percent preceding principals purge range recordreader recordwriter recover reduce refresh regexp rename repair replace reset restrict revoke right rlike role roles rollback rollup row rows schema schemas select semi separated serde serdeproperties set sets show skewed sort sorted start statistics stored stratify struct table tables tablesample tblproperties temp temporary terminated then to touch transaction transactions transform true truncate unarchive unbounded uncache union unlock unset use using values view when where window with"),
    builtin: set("abs acos acosh add_months aggregate and any approx_count_distinct approx_percentile array array_contains array_distinct array_except array_intersect array_join array_max array_min array_position array_remove array_repeat array_sort array_union arrays_overlap arrays_zip ascii asin asinh assert_true atan atan2 atanh avg base64 between bigint bin binary bit_and bit_count bit_get bit_length bit_or bit_xor bool_and bool_or boolean bround btrim cardinality case cast cbrt ceil ceiling char char_length character_length chr coalesce collect_list collect_set concat concat_ws conv corr cos cosh cot count count_if count_min_sketch covar_pop covar_samp crc32 cume_dist current_catalog current_database current_date current_timestamp current_timezone current_user date date_add date_format date_from_unix_date date_part date_sub date_trunc datediff day dayofmonth dayofweek dayofyear decimal decode degrees delimited dense_rank div double e element_at elt encode every exists exp explode explode_outer expm1 extract factorial filter find_in_set first first_value flatten float floor forall format_number format_string from_csv from_json from_unixtime from_utc_timestamp get_json_object getbit greatest grouping grouping_id hash hex hour hypot if ifnull in initcap inline inline_outer input_file_block_length input_file_block_start input_file_name inputformat instr int isnan isnotnull isnull java_method json_array_length json_object_keys json_tuple kurtosis lag last last_day last_value lcase lead least left length levenshtein like ln locate log log10 log1p log2 lower lpad ltrim make_date make_dt_interval make_interval make_timestamp make_ym_interval map map_concat map_entries map_filter map_from_arrays map_from_entries map_keys map_values map_zip_with max max_by md5 mean min min_by minute mod monotonically_increasing_id month months_between named_struct nanvl negative next_day not now nth_value ntile nullif nvl nvl2 octet_length or outputformat overlay parse_url percent_rank percentile percentile_approx pi pmod posexplode posexplode_outer position positive pow power printf quarter radians raise_error rand randn random rank rcfile reflect regexp regexp_extract regexp_extract_all regexp_like regexp_replace repeat replace reverse right rint rlike round row_number rpad rtrim schema_of_csv schema_of_json second sentences sequence sequencefile serde session_window sha sha1 sha2 shiftleft shiftright shiftrightunsigned shuffle sign signum sin sinh size skewness slice smallint some sort_array soundex space spark_partition_id split sqrt stack std stddev stddev_pop stddev_samp str_to_map string struct substr substring substring_index sum tan tanh textfile timestamp timestamp_micros timestamp_millis timestamp_seconds tinyint to_csv to_date to_json to_timestamp to_unix_timestamp to_utc_timestamp transform transform_keys transform_values translate trim trunc try_add try_divide typeof ucase unbase64 unhex uniontype unix_date unix_micros unix_millis unix_seconds unix_timestamp upper uuid var_pop var_samp variance version weekday weekofyear when width_bucket window xpath xpath_boolean xpath_double xpath_float xpath_int xpath_long xpath_number xpath_short xpath_string xxhash64 year zip_with"),
    atoms: set("false true null"),
    operatorChars: /^[*\/+\-%<>!=~&|^]/,
    dateSQL: set("date time timestamp"),
    support: set("ODBCdotTable doubleQuote zerolessFloat")
  });

  // Esper
  CodeMirror.defineMIME("text/x-esper", {
    name: "sql",
    client: set("source"),
    // http://www.espertech.com/esper/release-5.5.0/esper-reference/html/appendix_keywords.html
    keywords: set("alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit after all and as at asc avedev avg between by case cast coalesce count create current_timestamp day days d