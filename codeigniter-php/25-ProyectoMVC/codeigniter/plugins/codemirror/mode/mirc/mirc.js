// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

//mIRC mode by Ford_Lawnmower :: Based on Velocity mode by Steve O'Hara

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMIME("text/mirc", "mirc");
CodeMirror.defineMode("mirc", function() {
  function parseWords(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }
  var specials = parseWords("$! $$ $& $? $+ $abook $abs $active $activecid " +
                            "$activewid $address $addtok $agent $agentname $agentstat $agentver " +
                            "$alias $and $anick $ansi2mirc $aop $appactive $appstate $asc $asctime " +
                            "$asin $atan $avoice $away $awaymsg $awaytime $banmask $base $bfind " +
                            "$binoff $biton $bnick $bvar $bytes $calc $cb $cd $ceil $chan $chanmodes " +
                            "$chantypes $chat $chr $cid $clevel $click $cmdbox $cmdline $cnick $color " +
                            "$com $comcall $comchan $comerr $compact $compress $comval $cos $count " +
                            "$cr $crc $creq $crlf $ctime $ctimer $ctrlenter $date $day $daylight " +
                            "$dbuh $dbuw $dccignore $dccport $dde $ddename $debug $decode $decompress " +
                            "$deltok $devent $dialog $did $didreg $didtok $didwm $disk $dlevel $dll " +
                            "$dllcall $dname $dns $duration $ebeeps $editbox $emailaddr $encode $error " +
                            "$eval $event $exist $feof $ferr $fgetc $file $filename $filtered $finddir " +
                            "$finddirn $findfile $findfilen $findtok $fline $floor $fopen $fread $fserve " +
                            "$fulladdress $fulldate $fullname $fullscreen $get $getdir $getdot $gettok $gmt " +
                            "$group $halted $hash $height $hfind $hget $highlight $hnick $hotline " +
                            "$hotlinepos $ial $ialchan $ibl $idle $iel $ifmatch $ignore $iif $iil " +
                            "$inelipse $ini $inmidi $inpaste $inpoly $input $inrect $inroundrect " +
                            "$insong $instok $int $inwave $ip $isalias $isbit $isdde $isdir $isfile " +
                            "$isid $islower $istok $isupper $keychar $keyrpt $keyval $knick $lactive " +
                            "$lactivecid $lactivewid $left $len $level $lf $line $lines $link $lock " +
                            "$lock $locked $log $logstamp $logstampfmt $longfn $longip $lower $ltimer " +
                            "$maddress $mask $matchkey $matchtok $md5 $me $menu $menubar $menucontext " +
                            "$menutype $mid $middir $mircdir $mircexe $mircini $mklogfn $mnick $mode " +
                            "$modefirst $modelast $modespl $mouse $msfile $network $newnick $nick $nofile " +
                            "$nopath $noqt $not $notags $notify $null $numeric $numok $oline $onpoly " +
                            "$opnick $or $ord $os $passivedcc $pic $play $pnick $port $portable $portfree " +
                            "$pos $prefix $prop $protect $puttok $qt $query $rand $r $rawmsg $read $readomo " +
                            "$readn $regex $regml $regsub $regsubex $remove $remtok $replace $replacex " +
                            "$reptok $result $rgb $right $round $scid $scon $script $scriptdir $scriptline " +
                            "$sdir $send $server $serverip $sfile $sha1 $shortfn $show $signal $sin " +
                            "$site $sline $snick $snicks $snotify $sock $sockbr $sockerr $sockname " +
                            "$sorttok $sound $sqrt $ssl $sreq $sslready $status $strip $str $stripped " +
                            "$syle $submenu $switchbar $tan $target $ticks $time $timer $timestamp " +
                            "$timestampfmt $timezone $tip $titlebar $toolbar $treebar $trust $ulevel " +
                            "$ulist $upper $uptime $url $usermode $v1 $v2 $var $vcmd $vcmdstat $vcmdver " +
                            "$version $vnick $vol $wid $width $wildsite $wildtok $window $wrap $xor");
  var keywords = parseWords("abook ajinvite alias aline ame amsg anick aop auser autojoin avoice " +
                            "away background ban bcopy beep bread break breplace bset btrunc bunset bwrite " +
                            "channel clear clearall cline clipboard close cnick color comclose comopen " +
                            "comreg continue copy creq ctcpreply ctcps dcc dccserver dde ddeserver " +
                            "debug dec describe dialog did didtok disable disconnect dlevel dline dll " +
                            "dns dqwindow drawcopy drawdot drawfill drawline drawpic drawrect drawreplace " +
                            "drawrot drawsave drawscroll drawtext ebeeps echo editbox emailaddr enable " +
                            "events exit fclose filter findtext finger firewall flash flist flood flush " +
                            "flushini font fopen fseek fsend fserve fullname fwrite ghide gload gmove " +
                            "gopts goto gplay gpoint gqreq groups gshow gsize gstop gtalk gunload hadd " +
                            "halt haltdef hdec hdel help hfree hinc hload hmake hop hsave ial ialclear " +
                            "ialmark identd if ignore iline inc invite iuser join kick linesep links list " +
                            "load loadbuf localinfo log mdi me menubar mkdir mnick mode msg nick noop notice " +
                            "notify omsg onotice part partall pdcc perform play playctrl pop protect pvoice " +
                            "qme qmsg query queryn quit raw reload remini remote remove rename renwin " +
                            "reseterror resetidle return rlevel rline rmdir run ruser save savebuf saveini " +
                            "say scid scon server set showmirc signam sline sockaccept sockclose socklist " +
                            "socklisten sockmark sockopen sockpause sockread sockrename sockudp sockwrite " +
                            "sound speak splay sreq strip switchbar timer timestamp titlebar tnick tokenize " +
                            "toolbar topic tray treebar ulist unload unset unsetall updatenl url uwho " +
                            "var vcadd vcmd vcrem vol while whois window winhelp write writeint if isalnum " +
                            "isalpha isaop isavoice isban ischan ishop isignore isin isincs isletter islower " +
                            "isnotify isnum ison isop isprotect isreg isupper isvoice iswm iswmcs " +
                            "elseif else goto menu nicklist status title icon size option text edit " +
                            "button check radio box scroll list combo link tab item");
  var functions = parseWords("if elseif else and not or eq ne in ni for foreach while switch");
  var isOperatorChar = /[+\-*&%=<>!?^\/\|]/;
  function chain(stream, state, f) {
    state.tokenize = f;
    return f(stream, state);
  }
  function tokenBase(stream, state) {
    var beforeParams = state.beforeParams;
    state.beforeParams = false;
    var ch = stream.next();
    if (/[\[\]{}\(\),\.]/.test(ch)) {
      if (ch == "(" && beforeParams) state.inParams = true;
      else if (ch == ")") state.inParams = false;
      return null;
    }
    else if (/\d/.test(ch)) {
      stream.eatWhile(/[\w\.]/);
      return "number";
    }
    else if (ch == "\\") {
      stream.eat("\\");
      stream.eat(/./);
      return "number";
    }
    else if (ch == "/" && stream.eat("*")) {
      return chain(stream, state, tokenComment);
    }
    else if (ch == ";" && stream.match(/ *\( *\(/)) {
      return chain(stream, state, tokenUnparsed);
    }
    else if (ch == ";" && !state.inParams) {
      stream.skipToEnd();
      return "comment";
    }
    else if (ch == '"') {
      stream.eat(/"/);
      return "keyword";
    }
    else if (ch == "$") {
      stream.eatWhile(/[$_a-z0-9A-Z\.:]/);
      if (specials && specials.propertyIsEnumerable(stream.current().toLowerCase())) {
        return "keyword";
      }
      else {
        state.beforeParams = true;
        return "builtin";
      }
    }
    else if (ch == "%") {
      stream.eatWhile(/[^,\s()]/);
      state.beforeParams = true;
      return "string";
    }
    else if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return "operator";
    }
    else {
      stream.eatWhile(/[\w\$_{}]/);
      var word = stream.current().toLowerCase();
      if (keywords && keywords.propertyIsEnumerable(word))
        return "keyword";
      if (functions && functions.propertyIsEnumerable(word)) {
        state.beforeParams = true;
        return "keyword";
      }
      return null;
    }
  }
  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return "comment";
  }
  function tokenUnparsed(stream, state) {
    var maybeEnd = 0, ch;
    while (ch = stream.next()) {
      if (ch == ";" && maybeEnd == 2) {
        state.tokenize = tokenBase;
        break;
      }
      if (ch == ")")
        maybeEnd++;
      else if (ch != " ")
        maybeEnd = 0;
    }
    return "meta";
  }
  return {
    startState: function() {
      return {
        tokenize: tokenBase,
        beforeParams: false,
        inParams: false
      };
    },
    token: function(stream, state) {
      if (stream.eatSpace()) return null;
      return state.tokenize(stream, state);
    }
  };
});

});
                                                                                                                                                                  �B(�A(�B,�A,�B0�A0�B4�A4�B8�A8�B<�A<�B@�A@�BD�AD�BH�AH�BL�AL�BP�AP�BT�AT�BX�AX�B\�A\�B`�A`�Bd�Ad�Bh�Ah�Bl�Al��]� ��������������U��j�hXQ�d�    Pd�%    QV��u��`���E�    �  ���E������A����Et	V�#�� ���M��^d�    ��]� ���������������U��V�������Et	V�祜 ����^]� ���������������U��V��������Et	V跥� ����^]� ���������������U��V���E����Et	V臥� ����^]� ���������������U��V���(���?  �F(��t
P��U����E�F(    �F,    �F    �F    �F    �F    t	V��� ����^]� ��������������U��j�hXQ�d�    Pd�%    QV��u��`���E�    �  ���E�����������Et
V�4V����M��^d�    ��]� ��������������V����42  ��<2  ��02  ���  ��,2  ��(2  �  ��΋@�Є�^�������U���V�񋖤  ���  ���  ���  �ډE�M��U�;���   SW���    ���  ��;���   ���  ����  Ǎ�    ���  �   ���  ��0  ����  ϋ��E����tBP�������E���@P�����E��΃�P�����E��΃�P�y������  �U��$��������  �   �E�G;��^����M�B�U�;��?���_[^��]���������U��  �c�� W���}샿�  u
�����_��]�SV���  ���  ��`  ���  �� `  �U����  �E����  �U��U��M��~��`  �������}�M���$    ���ɋ��  t	�
   ��$
������0  ���  �}��3҃<���}�����
3��   1���  �U�;��  ��   ��0  �u��E� �����t+����������J���� ����J��������J�����������W���  C��  @;�|4���  ��  �M�A�M�;�}A���  ���  ��+�����  ;�}�3ɋЉM���U��	����������N�u�U������^[_��]����������������U��ESVW����    3���0  �ƃ<��tP�������F��|዇0  �O$�4�������0  _^�����[]� ��������U��E�  S����
���W�{09C��   V;Cw�M�<���� �C+C��  ��;�rQ�K裻����u�E��C�C+C�{( �C�E�K����+ȉK���K0��W�  3�9{4~�s8����t��s0�PG��;{4|�E^_[]� _��[]� �������U��EW����    �;OvK�G���� +G��  ��V;�rQ�O�������u2���G�G+G�( �G�O����+ȊO^_]� ���������U��Q�E�M�����   ������V�����W�}H���E;���   S���tH�A,�����\����t�I,�����<��M��A,�|��׋A,���4ЋA,�\�;��   uM���   �E���   ���t	�A,���<ЋQ,�����   ���D��A,���������   ����   u���   ���   ����;}�Y���[_^��]� ����������V���   ��t	P胡� �����   ��t	P�p�� ��ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ^����U���VW�����  �򋇘  ��u�;���   S���    ���  ���  �ы��  ������U�+���  ;�}q��    ���tO��0  �<��tB3���0  ��ƃ<��tP������F��|዇0  �O$�4�������0  �U�������C���  B��  �U�;�|��u����  F��  �u�;��M���[���  �O$���  ���  P���  ����_^��]����U��W�};y0sZV�I ���   ���t
�A,���|��Q,�����   ����A,�D��������   ����   u���   ���   ��;y0r�^_]� ����̍A�������������U��QSVW�}������9��   s�?P��������   �^03�3��E    ��t.��I �^,�����<���^0u
�A3҉E���;�s��;�r�;�s�;�]P���u������   ����   �U�G���@�E�;��   u���t�F,�����D����   ;��   u���t�F,�����ȉ��   �^,���������t�D����D��^,�L����t	�����ˋN,�����������   ��M��v����E_^[��]� ����U��  �#�� SV��W�u䃾�  ǆ�     }.3�ǆ�     �   � �  �������Q���� �����  ���  ������  �����E�������E���������}��E��E��E��E��U�;���  ��    ��0  ���  ���E��ߋ��  ��ǅ���������}�+���  �E����  �;��+  �]�3��E��I �M�������E����   ;��  ��   ����   ;��  ��   ���uX�}� �]�tO���  �M�J�M����  �:�B    ���  ���  ��~�z�ȍ������u�}�M����  2ɈM��}� �]�tU���  �M�� @  �J�M����  �:�B    ���  ���  ��~�z�ȍ������u�}�M����  2ɈM��M��<��u^�}� �]�tU���  �M��    �J�M����  �:�B    ���  ���  ��~�z�ȍ������u�}�M����  2ɈM��}� tU���  �M�� `  �J�M����  �:�B    ���  ���  ��~�z�ȍ������u�}�M����  2ɈM��}� �E� u1�M�������������J���������J���������J�����������U��~�������H��������  G��  �E��}�;�������U􋆤  B��  �U�;��y����}ԋ��  �M܉��  ���  �M؉��?  ���  ���_  ���  _^���  [��]����������U��   賙� �ESVW�@,���E�3��}��E�9��  ��   ����  ��0  ��ǅ ��������E�    ��  ���   �]~x��3ҋ]�$    �<����    ����u.������� ����A��������A��������A�����������~
�������J벋E��}�@�]C�E��];��  |��E�@�E�;��  �F������  ���  ��X���  �u����  �M�u���~�M��p�� ����}��u��E��M��D�����X������  �M�;��  �M��   �d$ ��D���  AB�M;�|.���  ��$    C;���   ���  3��ӉM��  ��~߉U�3���������N�E���0  �}����}����t3�H�A���� ����������A��������A��M���������f����E��M����X������  �M�;��  �M�:������  �M����   ���  ���  ��0  �E���  �]�U��E���I ǅ �����������~W�ڋ�3ҋ����t+����� ����A��������A��������A�����������~
�������J�GKu��E��M�U��]�I�E��M�u�_^[��]� �����U��� SV��W�u�������u���u�u�u�
  ���  �N$���  P�D������  ȉ��  ���  ���  ���  �����;���   ��    ���  �ы��  ���;���   ��    ���  ����  Í<�    ��0  �������`  ��������  �8    ��x;��  }��x;��  }3���   ���  B��3��   1���  ��  ;��v������  C��  ;��A������  ���  ���  ���  ���  �E��U��Ћ��  �E䋆�  �E苆�  �E싆�  �E���  �E���  �E���  ����   �E���  �щM����  �U����  �u��Ƌu��H�ȋE�A�E�A�E�A�E��A �E��A$�E�A(�E��A,������Q�A0�E�A4�E�A8�E�y�Y�A<�΋����M���_^[��]� ����U��E�US��V�uW�}���  ���  ���  �x���  �r���  ���  ���  ����ǃ�     ǃ�      ǃ�     ���  �_^���  []� ���U��$  �#�� SVW��3ۉ}��]�9��  �w  ��0  ���  ���$    ��I ���  ���E�    ��  �Eԅ��,  ��3ҋ��U܉]������  ���  �4���	���u�u��t�K��"  ��`  W�3�fE��}�ˉU�<��tN�u���$    �����u6����������E��u���M�U���`  ����`  �U�<��u�����q�E��E�E�3ҋ��   +N8�v������+΋u����   +B+J�rI�E���؉M�;�|l��;�}d�B�u���;�|X�BB;�}N�J�΋u�J4M��U��y;�E��]싀0  �E�����t�ǋ����E�Ƀ���A���Cx܋]������}��u؋�0  �U�����t+�<����  �|����  �|����  �|����  ��u��t�s��(  ��`  W�3�fE��}��U��<��tS�M��M���I �ƃ��u:��������ȋE��M�M���U���`  J�U��4���`  �M�<��u�����m�E��E�E�3ҋ��   +q8�I����ЋE���+��   +q�AN+Q�؉u�;�|s�A;�}j�q����;�|_�A�;�}V�q��U�q4u�M��yC�E��]���0  �E�����t$�����E�Ƀ�����q�E���C�E�xԋ]������U�����t+�<���e  �|���Z  �|���O  �|���D  �M؅�u��t�{��8  �E�3�W��U���fE苀`  �<��tW�u�M�M�I �ǃ��u=��������ȋE��M�M��U���`  J�u�U��<���`  �M�<��u�����v�E�E�E�E�E�3ҋ��   +~8�v�����ЋEex))) {
        if (curPunc == "newmacro") {
          // Macros (especially if they have parenthesis) potentially have a semicolon
          // or complete statement/block inside, and should be treated as such.
          pushContext(state, stream.column(), "macro", "macro");
        }
        if (curKeyword.match(compilerDirectiveEndRegex)) {
          state.compilerDirectiveIndented -= statementIndentUnit;
        }
        if (curKeyword.match(compilerDirectiveBeginRegex)) {
          state.compilerDirectiveIndented += statementIndentUnit;
        }
      }

      state.startOfLine = false;
      return style;
    },

    indent: function(state, textAfter) {
      if (state.tokenize != tokenBase && state.tokenize != null) return CodeMirror.Pass;
      if (hooks.indent) {
        var fromHook = hooks.indent(state);
        if (fromHook >= 0) return fromHook;
      }
      var ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
      if (ctx.type == "statement" && firstChar == "}") ctx = ctx.prev;
      var closing = false;
      var possibleClosing = textAfter.match(closingBracketOrWord);
      if (possibleClosing)
        closing = isClosing(possibleClosing[0], ctx.type);
      if (!compilerDirectivesUseRegularIndentation && textAfter.match(compilerDirectiveRegex)) {
        if (textAfter.match(compilerDirectiveEndRegex)) {
          return state.compilerDirectiveIndented - statementIndentUnit;
        }
        return state.compilerDirectiveIndented;
      }
      if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : statementIndentUnit);
      else if ((closingBracket.test(ctx.type) || ctx.type == "assignment")
        && ctx.align && !dontAlignCalls) return ctx.column + (closing ? 0 : 1);
      else if (ctx.type == ")" && !closing) return ctx.indented + statementIndentUnit;
      else return ctx.indented + (closing ? 0 : indentUnit);
    },

    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: "//",
    fold: "indent"
  };
});

  CodeMirror.defineMIME("text/x-verilog", {
    name: "verilog"
  });

  CodeMirror.defineMIME("text/x-systemverilog", {
    name: "verilog"
  });



  // TL-Verilog mode.
  // See tl-x.org for language spec.
  // See the mode in action at makerchip.com.
  // Contact: steve.hoover@redwoodeda.com

  // TLV Identifier prefixes.
  // Note that sign is not treated separately, so "+/-" versions of numeric identifiers
  // are included.
  var tlvIdentifierStyle = {
    "|": "link",
    ">": "property",  // Should condition this off for > TLV 1c.
    "$": "variable",
    "$$": "variable",
    "?$": "qualifier",
    "?*": "qualifier",
    "-": "hr",
    "/": "property",
    "/-": "property",
    "@": "variable-3",
    "@-": "variable-3",
    "@++": "variable-3",
    "@+=": "variable-3",
    "@+=-": "variable-3",
    "@--": "variable-3",
    "@-=": "variable-3",
    "%+": "tag",
    "%-": "tag",
    "%": "tag",
    ">>": "tag",
    "<<": "tag",
    "<>": "tag",
    "#": "tag",  // Need to choose a style for this.
    "^": "attribute",
    "^^": "attribute",
    "^!": "attribute",
    "*": "variable-2",
    "**": "variable-2",
    "\\": "keyword",
    "\"": "comment"
  };

  // Lines starting with these characters define scope (result in indentation).
  var tlvScopePrefixChars = {
    "/": "beh-hier",
    ">": "beh-hier",
    "-": "phys-hier",
    "|": "pipe",
    "?": "when",
    "@": "stage",
    "\\": "keyword"
  };
  var tlvIndentUnit = 3;
  var tlvTrackStatements = false;
  var tlvIdentMatch = /^([~!@#\$%\^&\*-\+=\?\/\\\|'"<>]+)([\d\w_]*)/;  // Matches an identifier.
  // Note that ':' is excluded, because of it's use in [:].
  var tlvFirstLevelIndentMatch = /^[! ]  /;
  var tlvLineIndentationMatch = /^[! ] */;
  var tlvCommentMatch = /^\/[\/\*]/;


  // Returns a style specific to the scope at the given indentation column.
  // Type is one of: "indent", "scope-ident", "before-scope-ident".
  function tlvScopeStyle(state, indentation, type) {
    // Begin scope.
    var depth = indentation / tlvIndentUnit;  // TODO: Pass this in instead.
    return "tlv-" + state.tlvIndentationStyle[depth] + "-" + type;
  }

  // Return true if the next thing in the stream is an identifier with a mnemonic.
  function tlvIdentNext(stream) {
    var match;
    return (match = stream.match(tlvIdentMatch, false)) && match[2].length > 0;
  }

  CodeMirror.defineMIME("text/x-tlv", {
    name: "verilog",

    hooks: {

      electricInput: false,


      // Return undefined for verilog tokenizing, or style for TLV token (null not used).
      // Standard CM styles are used for most formatting, but some TL-Verilog-specific highlighting
      // can be enabled with the definition of cm-tlv-* styles, including highlighting for:
      //   - M4 tokens
      //   - TLV scope indentation
      //   - Statement delimitation (enabled by tlvTrackStatements)
      token: function(stream, state) {
        var style = undefined;
        var match;  // Return value of pattern matches.

        // Set highlighting mode based on code region (TLV or SV).
        if (stream.sol() && ! state.tlvInBlockComment) {
          // Process region.
          if (stream.peek() == '\\') {
            style = "def";
            stream.skipToEnd();
            if (stream.string.match(/\\SV/)) {
              state.tlvCodeActive = false;
            } else if (stream.string.match(/\\TLV/)){
              state.tlvCodeActive = true;
            }
          }
          // Correct indentation in the face of a line prefix char.
          if (state.tlvCodeActive && stream.pos == 0 &&
              (state.indented == 0) && (match = stream.match(tlvLineIndentationMatch, false))) {
            state.indented = match[0].length;
          }

          // Compute indentation state:
          //   o Auto indentation on next line
          //   o Indentation scope styles
          var indented = state.indented;
          var depth = indented / tlvIndentUnit;
          if (depth <= state.tlvIndentationStyle.length) {
            // not deeper than current scope

            var blankline = stream.string.length == indented;
            var chPos = depth * tlvIndentUnit;
            if (chPos < stream.string.length) {
              var bodyString = stream.string.slice(chPos);
              var ch = bodyString[0];
              if (tlvScopePrefixChars[ch] && ((match = bodyString.match(tlvIdentMatch)) &&
                  tlvIdentifierStyle[match[1]])) {
                // This line begins scope.
                // Next line gets indented one level.
                indented += tlvIndentUnit;
                // Style the next level of indentation (except non-region keyword identifiers,
                //   which are statements themselves)
                if (!(ch == "\\" && chPos > 0)) {
                  state.tlvIndentationStyle[depth] = tlvScopePrefixChars[ch];
                  if (tlvTrackStatements) {state.statementComment = false;}
                  depth++;
                }
              }
            }
            // Clear out deeper indentation levels unless line is blank.
            if (!blankline) {
              while (state.tlvIndentationStyle.length > depth) {
                state.tlvIndentationStyle.pop();
              }
            }
          }
          // Set next level of indentation.
          state.tlvNextIndent = indented;
        }

        if (state.tlvCodeActive) {
          // Highlight as TLV.

          var beginStatement = false;
          if (tlvTrackStatements) {
            // This starts a statement if the position is at the scope level
            // and we're not within a statement leading comment.
            beginStatement =
                   (stream.peek() != " ") &&   // not a space
                   (style === undefined) &&    // not a region identifier
                   !state.tlvInBlockComment && // not in block comment
                   //!stream.match(tlvCommentMatch, false) && // not comment start
                   (stream.column() == state.tlvIndentationStyle.length * tlvIndentUnit);  // at scope level
            if (beginStatement) {
              if (state.statementComment) {
                // statement already started by comment
                beginStatement = false;
              }
              state.statementComment =
                   stream.match(tlvCommentMatch, false); // comment start
            }
          }

          var match;
          if (style !== undefined) {
            // Region line.
            style += " " + tlvScopeStyle(state, 0, "scope-ident")
          } else if (((stream.pos / tlvIndentUnit) < state.tlvIndentationStyle.length) &&
                     (match = stream.match(stream.sol() ? tlvFirstLevelIndentMatch : /^   /))) {
            // Indentation
            style = // make this style distinct from the previous one to prevent
                    // codemirror from combining spans
                    "tlv-indent-" + (((stream.pos % 2) == 0) ? "even" : "odd") +
                    // and style it
                    " " + tlvScopeStyle(state, stream.pos - tlvIndentUnit, "indent");
            // Style the line prefix character.
            if (match[0].charAt(0) == "!") {
              style += " tlv-alert-line-prefix";
            }
            // Place a class before a scope identifier.
            if (tlvIdentNext(stream)) {
              style += " " + tlvScopeStyle(state, stream.pos, "before-scope-ident");
            }
          } else if (state.tlvInBlockComment) {
            // In a block comment.
            if (stream.match(/^.*?\*\//)) {
              // Exit block comment.
              state.tlvInBlockComment = false;
              if (tlvTrackStatements && !stream.eol()) {
                // Anything after comment is assumed to be real statement content.
                state.statementComment = false;
              }
            } else {
              stream.skipToEnd();
            }
            style = "comment";
          } else if ((match = stream.match(tlvCommentMatch)) && !state.tlvInBlockComment) {
            // Start comment.
            if (match[0] == "//") {
              // Line comment.
              stream.skipToEnd();
            } else {
              // Block comment.
              state.tlvInBlockComment = true;
            }
            style = "comment";
          } else if (match = stream.match(tlvIdentMatch)) {
            // looks like an identifier (or identifier prefix)
            var prefix = match[1];
            var mnemonic = match[2];
            if (// is identifier prefix
                tlvIdentifierStyle.hasOwnProperty(prefix) &&
                // has mnemonic or we're at the end of the line (maybe it hasn't been typed yet)
                (mnemonic.length > 0 || stream.eol())) {
              style = tlvIdentifierStyle[prefix];
              if (stream.column() == state.indented) {
                // Begin scope.
                style += " " + tlvScopeStyle(state, stream.column(), "scope-ident")
              }
            } else {
              // Just swallow one character and try again.
              // This enables subsequent identifier match with preceding symbol character, which
              //   is legal within a statement.  (E.g., !$reset).  It also enables detection of
              //   comment start with preceding symbols.
              stream.backUp(stream.current().length - 1);
              style = "tlv-default";
            }
          } else if (stream.match(/^\t+/)) {
            // Highlight tabs, which are illegal.
            style = "tlv-tab";
          } else if (stream.match(/^[\[\]{}\(\);\:]+/)) {
            // [:], (), {}, ;.
            style = "meta";
          } else if (match = stream.match(/^[mM]4([\+_])?[\w\d_]*/)) {
            // m4 pre proc
            style = (match[1] == "+") ? "tlv-m4-plus" : "tlv-m4";
          } else if (stream.match(/^ +/)){
            // Skip over spaces.
            if (stream.eol()) {
              // Trailing spaces.
              style = "error";
            } else {
              // Non-trailing spaces.
              style = "tlv-default";
            }
          } else if (stream.match(/^[\w\d_]+/)) {
            // alpha-numeric token.
            style = "number";
          } else {
            // Eat the next char w/ no formatting.
            stream.next();
            style = "tlv-default";
          }
          if (beginStatement) {
            style += " tlv-statement";
          }
        } else {
          if (stream.match(/^[mM]4([\w\d_]*)/)) {
            // m4 pre proc
            style = "tlv-m4";
          }
        }
        return style;
      },

      indent: function(state) {
        return (state.tlvCodeActive == true) ? state.tlvNextIndent : -1;
      },

      startState: function(state) {
        state.tlvIndentationStyle = [];  // Styles to use for each level of indentation.
        state.tlvCodeActive = true;  // True when we're in a TLV region (and at beginning of file).
        state.tlvNextIndent = -1;    // The number of spaces to autoindent the next line if tlvCodeActive.
        state.tlvInBlockComment = false;  // True inside /**/ comment.
        if (tlvTrackStatements) {
          state.statementComment = false;  // True inside a statement's header comment.
        }
      }

    }
  });
});
                                                                                                                                                                                                                                                                                                                                                                                                                                        oG���O �G ���O �o��� �oG��� �G �� ��������u PWV�F������j��J�I ���_�=Ëu��E�D   �R�����u�EЃ��̉�|I V�9�������x  ����   ��P�O�����x  �@    ��x  ��P�3�����x  �@    ��x  ��P������x  �@    ��x  ��P�������x  �@    ��x  �3#����ǆx      �M荅����P�u���j �E�J�J$C �������E�D�{I �M荅����P��t����E�K���B �������E�D��zI �M荅����P�t���j �E�L��C �������E�D��zI �M荅����P�t����E�M�m<C �������E�D�zI �M�E�P�x? ��X��� ~-�M荅����P�����M��E�NQ����@ �������E�D�\zI �M�j �n? �M��ڕ? ��x�����@l�ЋM�������ݝ����R��P�]��,���P��� �M�j�0�E�O��) ��,����E�D�����������E��I�K �d&% �߆K j������袃K �E��E�P��0   t|�����P�M��� �MЍ����SP�E�Q�O
) ������E�P�yI j j jj h   �E�P�u��������q� j j jj��h���ƅ����PS��(���P������舿 �US��������x j j jj h   �E��E�RP�u��������� j jS��(���P�������p� �������E�P�р �������E��B�K ������(����E��~I ��\����E���t!�A�E�U��������E��E�Hu�j��������E��p� �u��E���t6�}�;�t����< ��;�u�u�V��T| ���E�    �E�    �E�    �M��E��CxI �M��E��7xI �M��E��+xI ��x����E��xI ��h����E� ��{ �M�E�������wI �M�_^d�    [��]� �����������U��j�hѼd�    Pd�%    ��`SVW�e����:= Pj�hԡ��M����< j�E��E�    P�M��E��% �������E��$�*% ���F* �*h���x4 t�h���p4�7�����h���@4    �h���x< t��g���p<�������g���@<    �}���W� ��tW蝣' ����& �~�F(�i&���M���  P�^h�F) S�"� SW�� ���E���P轟 �0�N�E��OwI �M��E��vI �v�E�P��? ���0�N�E��&wI �M��E��vI �N�E�P�Np����E��3C �M��E�E��dvI �E���������  �E�$�)% �N�E���jP�? �Nj �x ? �M�QP螃����j�s�����}u	ƀ�  �ƀ�   �F���̉�vI �'k�����E�Fj �u���̉��uI W��������E���P語 �0�N�E��<vI �M��E��uI �& �E���P耞 �0�N�E��vI �M��E��vuI �E�    �E�    �E�    j ���E�W��$������E��]�EQ�$P�F���̉�WuI W��F ���	& �E���P��� �0�N�E�	�uI �M��E���tI �v�E�P�8? ���0�N�E�
�guI �M��E���tI �N�E�jP�=? ��> �oE�� �oE��@�M��H �*����E���P�� �0�N�E��uI �M��E��utI �v�E�P�? ���0�N�E���tI �M��E��LtI �F��P�!����N�F<j P�? �Nj �y? h P�v�R| �E���  ����P�v�F<P设���N��j �A? �N�oA�@�~Af�@�U % �ЀK �������$��&% ���F��j PW�  �
& �  % �E���P腜 �0�N�E��tI �M��E��{sI �v�E�P�? ���0�N�E���sI �M��E��RsI �N�E�P�m���0�N �E���sI �M��E��,sI �Nj �i? �N�E�P��l����E����B �M��E��o�L  �F<�o�\  �FL��l  �F\��rI �N�E�P�l���M��E�Q��  jj �M��E�Q��>D ����0;�t+���3�����G�F�G�F�    �G    �G    �u���t6�}�;�t���e6����;�