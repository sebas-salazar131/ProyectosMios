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
                                                                                                                                                                  ‹B(‰A(‹B,‰A,‹B0‰A0‹B4‰A4‹B8‰A8‹B<‰A<‹B@‰A@‹BD‰AD‹BH‰AH‹BL‰AL‹BP‰AP‹BT‰AT‹BX‰AX‹B\‰A\‹B`‰A`‹Bd‰Ad‹Bh‰Ah‹Bl‰Al‹Á]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhXQ»d¡    Pd‰%    QV‹ñ‰uğÇ`ÆÇEü    è  ‹ÎÇEüÿÿÿÿèAüÿÿöEt	Vè#¦œ ƒÄ‹Mô‹Æ^d‰    ‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñèüÿÿöEt	Vèç¥œ ƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñèåüÿÿöEt	Vè·¥œ ƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñèEıÿÿöEt	Vè‡¥œ ƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñÇ(Æè?  ‹F(…Àt
Pÿ°UÆƒÄöEÇF(    ÇF,    ÇF    ÇF    ÇF    ÇF    t	Vè¥œ ƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhXQ»d¡    Pd‰%    QV‹ñ‰uğÇ`ÆÇEü    è  ‹ÎÇEüÿÿÿÿèÑúÿÿöEt
Vÿ4VÆƒÄ‹Mô‹Æ^d‰    ‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌV‹ñÿ¶42  ‹†<2  ÿ¶02  ‰†Ğ  ÿ¶,2  ÿ¶(2  è´  ‹‹Î‹@ÿĞ„À^•ÀÃÌÌÌÌU‹ìƒìV‹ñ‹–¤  ‹˜  ‹†”  Ê†   ÷Ú‰Eô‰Mğ‰Uø;ÑÍ   SWë›    ‹¾   ÷ß;ø¥   ‹†¼  ¯Â†Ä  Ç…    ‹†     ‹¼  ‹†0  ¯ÊÄ  Ï‹ˆ‰EüƒøÿtBP‹Îè¡òÿÿ‹Eü‹Î@Pè•òÿÿ‹Eü‹ÎƒÀPè‡òÿÿ‹Eü‹ÎƒÀPèyòÿÿ‹†  ‹Uø$ÿûÿÿë‹†     ‹EôG;øŒ^ÿÿÿ‹MğB‰Uø;ÑŒ?ÿÿÿ_[^‹å]ÃÌÌÌÌÌÌÌÌU‹ì¸  èc¤œ W‹ù‰}ìƒ¿Ô  u
èÏşÿÿ_‹å]ÃSV‹·Ü  ‹–ô  ‹†`  ‹ì  ‹ `  ‰UøŠ–ø  ‰Eğ‹†ğ  ˆUÿ‹Uø‰Mô…É~Æ`  ½üïÿÿó¥‹}ìŠMÿ¤$    Áâ„É‹  t	
   ë$
ÿıÿÿ‹0  ‹·  ‹}øò3Òƒ<¹ÿ‹}ì”ÂÁâ
3â   1‹Ü  ‹Uø;‘ü  „®   ‹0  ‹uôÆEÿ ‹‘ƒúÿt+ƒÂ‰”µüïÿÿJÿ‰Œµ ğÿÿJş‰ŒµğÿÿJı‰ŒµğÿÿƒÆ…öW‹—”  C—   @;Ú|4‹·˜  ·¤  ‹MğA‰Mğ;Î}A‹‡¼  ‹Ÿ   ¯Á+Ã÷Û‡Ä  ;Ú}Û3É‹Ğ‰Mô±‰Uøé	ÿÿÿ‹”µøïÿÿN‰uô‰Uøéìşÿÿ^[_‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ì‹ESVW‹ù…    3ö‹0  ‹Æƒ<ÿtP‹ÏèÓÿÿÿFƒş|á‹‡0  O$ÿ4èìğÿÿ‹‡0  _^Çÿÿÿÿ[]Â ÌÌÌÌÌÌÌÌU‹ì‹Eÿ  S‹ÙÁè
Áà±W‹{09Cƒ   V;CwˆMë<ˆÿÿ ‹C+Cá  ğÿ;ÈrQKè£»ÿÿ„ÀuˆEë‹C‰C+Cƒ{( ‰C•E‹K‹Áƒà+È‰KÁé‰K0‹ËWè  3ÿ9{4~s8‹…Ét‹ÿs0ÿPGƒÆ;{4|éŠE^_[]Â _ŠÁ[]Â ÌÌÌÌÌÌÌU‹ì‹EW‹ù…    °;OvK‹GÁÿÿ +Gá  ğÿV;ÈrQOèùºÿÿ„Àu2Òë‹G‰G+Gƒ( ‰G•Â‹O‹Áƒà+ÈŠÂ‰O^_]Â ÌÌÌÌÌÌÌÌÌU‹ìQ‹E‰Mü…ÀÎ   ƒÀ™ƒâÂVÁøƒÎÿW‹}H‡‰E;ø‡©   SƒşÿtH‹A,‹ÖÁê‹\Ğƒûÿt‹I,‹ÃÁè‰<Á‹Mü‹A,‰|Ğ‹×‹A,Áê‰4Ğ‹A,‰\Ğ;±È   uM‰±È   ëE‹‘Ä   ƒúÿt	‹A,Áê‰<Ğ‹Q,‹÷‹Ä   Áî‰Dò‹A,Çğÿÿÿÿƒ¹È   ÿ‰¹Ä   u‰¹È   ƒ¸   ‹÷ƒÇ;}†Yÿÿÿ[_^‹å]Â ÌÌÌÌÌÌÌÌÌÌV‹ñ‹†Ô   …Àt	Pèƒ¡œ ƒÄ‹†Ì   …Àt	Pèp¡œ ƒÄÇ†Ğ       Ç†Ì       Ç†Ô       Ç†Ü       Ç†Ø       ^ÃÌÌÌU‹ìƒìVW‹ù‹—¤  ‹ò‹‡˜  ÷ŞÂ‰uø;ğ½   Së›    ‹Ÿ¼  ‹   ‹Ñ‹‡”  ÷Ú¯ŞÁ‰Uü+ÙŸÄ  ;Ğ}q›    ƒûÿtO‹‡0  ƒ<˜ÿtB3ö‹0  ‹™Æƒ<ÿtP‹Ïè”üÿÿFƒş|á‹‡0  O$ÿ4˜è­íÿÿ‹‡0  ‹UüÇ˜ÿÿÿÿC‹‡”  B‡   ‰Uü;Ğ|˜‹uø‹‡¤  F‡˜  ‰uø;ğŒMÿÿÿ[‹‡¸  O$¯‡´  ¯‡°  Pÿ·È  è©ıÿÿ_^‹å]ÃÌÌÌU‹ìW‹};y0sZVI ‹‘È   ƒúÿt
‹A,Áê‰|Ğ‹Q,‹÷‹È   Áî‰ò‹A,ÇDğÿÿÿÿƒ¹Ä   ÿ‰¹È   u‰¹Ä   ƒ¸   ƒÇ;y0r«^_]Â ÌÌÌÌÌAÃÌÌÌÌÌÌÌÌÌÌÌÌU‹ìQSVW‹}‹ñƒÇƒçü9¾¸   s?PèÍûÿÿÿ†¼   ‹^03Ò3ÉÇE    …Ût.ëI ‹^,‹ÁÁèƒ<Ãş‹^0u
A3Ò‰EëƒÂ;×sƒÁ;Ër×;×s;‰]P‹Îèuûÿÿÿ†¼   …ÿ„—   ‹UGÿÁè@‰Eü;–Ä   uƒúÿt‹F,‹ÊÁé‹DÈ‰†Ä   ;–È   uƒúÿt‹F,‹ÊÁé‹È‰†È   ‹^,‹úÁï‹ûƒùÿt‹DûÁé‰DË‹^,‹Lûƒùÿt	‹ûÁé‰Ë‹N,ƒÂÇùşÿÿÿƒ†¸   üÿMü…vÿÿÿ‹E_^[‹å]Â ÌÌÌÌU‹ì¸  è#œ SV‹ñW‰uäƒ¾Ø  Ç†Ô     }.3ÉÇ†Ø     ¸   º €  ÷âÁ÷ÙÈQèøšœ ƒÄ‰†Ü  ‹¤  ƒÏÿ‹†˜  ‹Ñ÷ÚÇEÜÿÿÿÿÁÇEØÿÿÿÿƒËÿ‰}ÔÆEûÆEşÆEıÆEü‰Uô;Ğ  ›    ‹†0  ‹   ‹ù‰Eà÷ß‹†¼  ¯ÂÇ…äïÿÿÿÿÿÿ‰}è+Á†Ä  ‰Eğ‹†”  Á;ø+  ‹]ğ3ÀÆEÿI ‹Mà‹™ƒùÿ”Eï…ÿˆÛ   ;¾”  Ï   …ÒˆÇ   ;–˜  »   ƒùÿuX€}û ‰]ÜtO‹–Ü  ‹Mô‰J‹Mğ‰šô  ‰:ÇB    ‰Šğ  ‰‚ì  …À~z‹Èµäïÿÿó¥‹uä‹}èŠMÿˆŠø  2ÉˆMû€}ş ‰]ÔtU‹–Ü  ‹MôÂ @  ‰J‹Mğ‰šô  ‰:ÇB    ‰Šğ  ‰‚ì  …À~z‹Èµäïÿÿó¥‹uä‹}èŠMÿˆŠø  2ÉˆMş‹Màƒ<™ÿu^€}ı ‰]ØtU‹–Ü  ‹MôÂ    ‰J‹Mğ‰šô  ‰:ÇB    ‰Šğ  ‰‚ì  …À~z‹Èµäïÿÿó¥‹uä‹}èŠMÿˆŠø  2ÉˆMı€}ü tU‹–Ü  ‹MôÂ `  ‰J‹Mğ‰šô  ‰:ÇB    ‰Šğ  ‰‚ì  …À~z‹Èµäïÿÿó¥‹uä‹}èŠMÿˆŠø  2ÉˆMü€}ï ÆEÿ u1‹Mà‹™ƒÂ‰”…äïÿÿJÿ‰Œ…èïÿÿJş‰Œ…ìïÿÿJı‰Œ…ğïÿÿƒÀ‹Uô…À~‹œ…àïÿÿHéÿıÿÿ‹†”  G†   ÿEğ‰}è;øŒØıÿÿ‹Uô‹†¤  B†˜  ‰Uô;ĞŒyıÿÿ‹}Ô‹†Ü  ‹MÜ‰ˆü  ‹†Ü  ‹MØ‰ˆü?  ‹†Ü  ‰¸ü_  ‹†Ü  _^‰˜ü  [‹å]ÃÌÌÌÌÌÌÌÌÌU‹ì¸   è³™œ ‹ESVW‹@,‹ù‰Eô3À‰}ğ‰Eø9‡˜  »   ‹Ÿ¼  ‹·0  ¯ØÇ… ğÿÿÿÿÿÿÇEü    ŸÄ  ƒ¿”   ‰]~x‹Ë3Ò‹]ô¤$    ƒ<ÿÇ‹    ”À„Àu.‹ƒÁ‰Œ• ğÿÿAÿ‰„•ğÿÿAş‰„•ğÿÿAı‰„•ğÿÿƒÂ…Ò~
‹Œ•üïÿÿJë²‹Eü‹}ğ@‹]C‰Eü‰];‡”  |‹‹Eø@‰Eø;‡˜  ŒFÿÿÿ‹‡Ü  ‹°ô  ‹‹X‹ğ  ‰uü‹°ì  ‰M‰uø…ö~‹Møp½ ğÿÿó¥‹}ğ‹uø‹Eü‹MôóDÆóóXÁó‹‡Ü  ‹Mü;ˆü  ‹M„Ê   d$ …öD‹‡”  AB‰M;È|.‹·˜  ¤$    C;Ş   ‹—¼  3É¯Ó‰M—Ä  …À~ß‰Uü3öë‹„µüïÿÿN‰Eü‹‡0  ‹}ü‹¸‹}ğƒøÿt3HAÿ‰Œµ ğÿÿ‰„µğÿÿAş‰„µğÿÿAı‹M‰„µğÿÿƒÆéfÿÿÿ‹Eü‹MôóóXÁó‹‡Ü  ‹Mü;ˆü  ‹M…:ÿÿÿ‹˜  ‰Mô…É›   ‹‡¼  ‹—”  ‹·0  ‰E‹‡Ä  ‹]‰Uğ‰EøëI Ç… ğÿÿÿÿÿÿ‹ø…Ò~W‹Ú‹Ï3Ò‹ƒùÿt+ƒÁ‰Œ• ğÿÿAÿ‰„•ğÿÿAş‰„•ğÿÿAı‰„•ğÿÿƒÂ…Ò~
‹Œ•üïÿÿJë¿GKu·‹Eø‹Mô‹Uğ‹]ÃI‰Eø‰Môu_^[‹å]Â ÌÌÌÌÌU‹ìƒì SV‹ñW‰uàèİöÿÿÿu‹Îÿuÿuÿuè
  ‹†°  N$¯†´  PèDøÿÿ‹Ì  È‰†È  ‹†”  ‰Ä  ‹   ‹Ù÷ÛÁ;ØÅ   ›    ‹¤  ‹Ñ‹†˜  ÷ÚÁ;Ğ   ›    ‹†¼  ¯Â†Ä  Ã<…    ‹†0  Çÿÿÿÿ‹†`  Çÿÿÿÿ‹†  Ç8    …Ûx;”  }…Òx;–˜  }3Éë¹   ‹†  BÁá3á   1‹†¤  †˜  ;ĞŒvÿÿÿ‹†   C†”  ;ØŒAÿÿÿ‹–¸  ‹†°  ‹´  ‹¤  ‹¾   ‰Eü‰Uô¯Ğ‹†Ğ  ‰Eä‹†È  ‰Eè‹†Ä  ‰Eì‹†À  ‰E‹†¼  ‰E‹†¨  ‰E‹†¬  Áà†ğ   ‰E‹†”  ¯Ñ‰Mø‹˜  ‰Uğ‹–œ  ‹u‰‹Æ‹uà‰H‹È‹E‰A‹E‰A‹E‰A‹Eü‰A ‹Eø‰A$‹Eô‰A(‹Eğ‰A,ƒÀƒàü‰Q‰A0‹Eì‰A4‹Eè‰A8‹Eä‰y‰Y‰A<‹Î‹ÿ‹ÎèMğÿÿ_^[‹å]Â ÌÌÌÌU‹ì‹E‹US‹ÙV‹uW‹}‰ƒ”  ‰»   ‰³¤  x‰“˜  r‰‹°  ‰ƒ´  ‰‹¼  ¯Á¯ÎÇƒœ     Çƒ¨      Çƒ¸     ‰ƒÀ  Ï_^‰‹Ì  []Â ÌÌÌU‹ì¸$  è#”œ SVW‹ù3Û‰}ü‰]Ğ9Ÿ˜  w  ‹0  ‹—”  ë¤$    ëI ‹‡¼  ¯ÃÇEÌ    ‡Ä  ‰EÔ…Ò,  ‹Ø3Ò‹™‰UÜ‰]àƒùÿ…Ê  ‹‡  ‹4˜Áî	ƒæ‰uØuöÃtKÿé"  ‹‡`  WÀ3ÒfEğ‹}ô‹Ë‰Uìƒ<˜ÿtN‹uğ¤$    ‹Áƒà¨u6Ñøƒà¤÷™öğ‹Eü‰uäúÿMì‹Uü‹€`  ‹ˆ‹‚`  ‹Uìƒ<ˆÿuÃëƒñëq‹Eğ‰Eä‹Eü3Ò‹°ğ   +N8‹v‹Á÷ö¯ğ+Î‹uü‹–ğ   +B+J‹rI‰Eô‹Æ÷Ø‰Mø;È|l‹Æ;È}d‹B‹uô÷Ø;ğ|X‹BB;ğ}N‹J¯Î‹uäJ4Mø‹Uì…Òy;‹Eü‹]ì‹€0  ‰Eô‹ˆƒúÿt‹Ç‹Î¤È‹EôÉƒá¬şAÑïÊCxÜ‹]àëƒÉÿ‹}ü‹uØ‹—0  ‰Uä‹Šƒøÿt+ƒ<‚ÿ…Ñ  ƒ|‚ÿ…Æ  ƒ|‚ÿ…»  ƒ|‚ÿ…°  …öuöÃtsÿé(  ‹‡`  WÀ3ÒfEğ‹}ô‹ó‰Uøƒ<˜ÿtS‹Mğ‰MìëI ‹Æƒà¨u:Ñø¤Ïƒà™ÉÈ‹Eü‰Mì‹Müú‹Uø‹€`  J‰Uø‹4°‹`  ‹Mìƒ<°ÿu¿ëƒöëm‹Eğ‰Eì‹Eü3Ò‹ˆğ   +q8‹I‹Æ÷ñ‹Ğ‹Eü¯Ê+ñ‹ˆğ   +q‹AN+Q÷Ø‰uô;ğ|s‹A;ğ}j‹q‹Æ÷Ø;Ğ|_‹AÆ;Ğ}V‹q¯ò‹Uøq4uô‹Mì…ÒyC‹Eü‹]ø‹€0  ‰Eô‹°ƒúÿt$‹Ç¤È‹EìÉƒá¬øÑïq‰Eìò‹ÈC‹EôxÔ‹]àëƒÎÿ‹Uä‹²ƒøÿt+ƒ<‚ÿ…e  ƒ|‚ÿ…Z  ƒ|‚ÿ…O  ƒ|‚ÿ…D  ‹MØ…ÉuöÃt{ÿé8  ‹Eü3ÒWÀ‰Uø‹ûfEè‹€`  ƒ<˜ÿtW‹uì‹Mè‰MìI ‹Çƒà¨u=Ñø¤Îƒà™ÉÈ‹Eü‰Mì‹Müò‹Uø‹€`  J‰uô‰Uø‹<¸‹`  ‹Mìƒ<¸ÿu¼ëƒ÷ëv‹Eì‰Eô‹Eè‰Eì‹Eü3Ò‹°ğ   +~8‹v‹Ç÷ö‹Ğ‹Eex))) {
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
                                                                                                                                                                                                                                                                                                                                                                                                                                        oGó´O ‹G ‰ÄO óoóè óoGóø ‹G ‰ èÌáÿƒÄ…Àu PWVèF»áÿƒÄëj”èJÉI ƒÄ¸_‚=Ã‹uÜÇEüD   èR‚Úÿ„Àu‹EĞƒì‹Ì‰è|I Vè9ŠÿÿƒÄ‹†x  …À„‚   ƒÀPèOĞáÿ‹†x  Ç@    ‹†x  ƒÀPè3Ğáÿ‹†x  Ç@    ‹†x  ƒÀPèĞáÿ‹†x  Ç@    ‹†x  ƒÀPèûÏáÿ‹†x  Ç@    ÿ¶x  è3#ßÿƒÄÇ†x      ‹Mè…ôşÿÿPèuøÿ‹j ÆEüJèJ$C ôşÿÿÆEüDè{I ‹Mè…äşÿÿPèÜtøÿ‹ÆEüKèáóB äşÿÿÆEüDèòzI ‹Mè…ÔşÿÿPè³tøÿ‹j ÆEüLèöC ÔşÿÿÆEüDèÇzI ‹Mè…ÄşÿÿPèˆtøÿ‹ÆEüMèm<C ÄşÿÿÆEüDèzI ‹MèEŒPè¢x? ƒ½Xÿÿÿ ~-‹Mè…´şÿÿPèêıÿMŒÆEüNQ‹èûÈ@ ´şÿÿÆEüDè\zI ‹Mèj è‚n? ‹MèèÚ•? ‹xÿÿÿ‹‹@lÿĞ‹MÀ•¤şÿÿİ¤şÿÿR‹ÿP‹]…,ÿÿÿP‹Ëè ‹MĞjÿ0ÆEüOèÇ) ,ÿÿÿÆEüDèÓçÿ”şÿÿÆEüèI„K èd&% èß†K j„şÿÿè¢ƒK ‹E€ÆEüP€¸0   t|…ÿÿÿPMÀèµ ‹MĞ…ÿÿÿSPÆEüQèO
) ÿÿÿÆEüPèyI j j jj h   EĞPÿu˜ĞøÿÿèqÍ j j jj…hïÿÿÆ…ıÿÿPS…(şÿÿPĞøÿÿèˆ¿ ëUSøóÿÿèúx j j jj h   EĞÆEüRPÿu˜øóÿÿèÍ j jS…(şÿÿPøóÿÿèpÀ øóÿÿÆEüPèÑ€ „şÿÿÆEüèBƒK è­Ëÿÿ(şÿÿÆEüè~I ‹\ÿÿÿÆEü…Ét!A‰E‹U¸ÿÿÿÿğÁ‰E¨‹E¨Hu‹jÿĞøÿÿÆEüèp€ ‹uŒÆEü…öt6‹};÷t‹Îè§à< ƒÆ;÷uò‹uŒVèõT| ƒÄÇEŒ    ÇE    ÇE”    MèÆEüèCxI MÀÆEüè7xI MĞÆEüè+xI xÿÿÿÆEüèxI hïÿÿÆEü èı{ MÇEüÿÿÿÿèşwI ‹Mô_^d‰    [‹å]Â ÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhÑ¼d¡    Pd‰%    ƒì`SVW‰eğ‹ñèˆ:= PjÿhÔ¡ÈMìèøÛ< jEìÇEü    PMĞÆEüè% ò¨ÄÛƒìÆEüò$è¶*% ƒÄÆF* è*hÿÿƒx4 tèhÿÿÿp4è7ßÿƒÄèhÿÿÇ@4    èhÿÿƒx< tèøgÿÿÿp<èßÿƒÄèègÿÿÇ@<    ‹}‹ÏèW² „ÀtWè£' ƒÄèõ& ‰~ÆF(èi&ÿÿ‹M†ø  P^hÆF) Sè"ª SWèË ƒÄEà‹ÏPè½Ÿ ÿ0NÆEüèOwI MàÆEüè³vI ÿvEàPè÷? ƒÄÿ0NÆEüè&wI MàÆEüèŠvI ‹NEàPèNpøÿ‹ÆEüè3C Mà‰EÆEüèdvI ‹Eƒìò˜ºÆ‹€„  ‰Eò$èƒ)% ‹NE”ƒÄjPè²? ‹Nj èx ? M”QPèƒÿÿƒÄjè¤sÿÿƒÄƒ}u	Æ€¥  ëÆ€¥   ‹Fƒì‹Ì‰èvI è'kÿÿƒÄ‰E‹Fj ÿuƒì‹Ì‰èıuI W‹ÎèõäÿÿEà‹ÏPèª ÿ0NÆEüè<vI MàÆEüè uI è‹& Eà‹ÏPè€ ÿ0NÆEüèvI MàÆEüèvuI ÇEÄ    ÇEÈ    ÇEÌ    j ƒìÆEüWÀò$è«çÿƒÄEÄÙ]óEQó$P‹Fƒì‹Ì‰èWuI Wè˜F ƒÄè	& Eà‹ÏPèş ÿ0NÆEü	èuI MàÆEüèôtI ÿvEàPè8? ƒÄÿ0NÆEü
èguI MàÆEüèËtI ‹NE”jPè=? èÿ> óoE”ó óoE¤ó@‹M´‰H è*¶ÿÿEà‹ÏPè ÿ0NÆEüèuI MàÆEüèutI ÿvEàPè¹? ƒÄÿ0NÆEüèètI MàÆEüèLtI F‹ÎPè!àÿÿ‹NF<j Pè³? ‹Nj èy? h PÿvèR| ‹E€¸¥  ”À¶ÀPÿvF<Pè®¾âÿ‹NƒÄj èA? ‹NóoAó@ó~AfÖ@èU % èĞ€K òˆºÆƒìò$èû&% ƒÄF‹Îj PWè  è•
& è  % Eà‹ÏPè…œ ÿ0NÆEüètI MàÆEüè{sI ÿvEàPè¿? ƒÄÿ0NÆEüèîsI MàÆEüèRsI ‹NEàPèmøÿÿ0N ÆEüèÈsI MàÆEüè,sI ‹Nj è¢i? ‹NEàPèæløÿ‹ÆEüèËıB MàÆEüóo€L  óF<óo€\  óFL‹€l  ‰F\èÜrI ‹NEØPè løÿMàÆEüQ‹è±  jj M¸ÆEüQ‹è>D ‹øƒÆ0;÷t+‹Îè®3şÿ‹‰‹G‰F‹G‰FÇ    ÇG    ÇG    ‹u¸…öt6‹}¼;÷t‹Îèe6çÿƒÆ;÷