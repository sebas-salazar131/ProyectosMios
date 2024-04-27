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

CodeMirror.defineMode("gas", function(_config, parserConfig) {
  'use strict';

  // If an architecture is specified, its initialization function may
  // populate this array with custom parsing functions which will be
  // tried in the event that the standard functions do not find a match.
  var custom = [];

  // The symbol used to start a line comment changes based on the target
  // architecture.
  // If no architecture is pased in "parserConfig" then only multiline
  // comments will have syntax support.
  var lineCommentStartSymbol = "";

  // These directives are architecture independent.
  // Machine specific directives should go in their respective
  // architecture initialization function.
  // Reference:
  // http://sourceware.org/binutils/docs/as/Pseudo-Ops.html#Pseudo-Ops
  var directives = {
    ".abort" : "builtin",
    ".align" : "builtin",
    ".altmacro" : "builtin",
    ".ascii" : "builtin",
    ".asciz" : "builtin",
    ".balign" : "builtin",
    ".balignw" : "builtin",
    ".balignl" : "builtin",
    ".bundle_align_mode" : "builtin",
    ".bundle_lock" : "builtin",
    ".bundle_unlock" : "builtin",
    ".byte" : "builtin",
    ".cfi_startproc" : "builtin",
    ".comm" : "builtin",
    ".data" : "builtin",
    ".def" : "builtin",
    ".desc" : "builtin",
    ".dim" : "builtin",
    ".double" : "builtin",
    ".eject" : "builtin",
    ".else" : "builtin",
    ".elseif" : "builtin",
    ".end" : "builtin",
    ".endef" : "builtin",
    ".endfunc" : "builtin",
    ".endif" : "builtin",
    ".equ" : "builtin",
    ".equiv" : "builtin",
    ".eqv" : "builtin",
    ".err" : "builtin",
    ".error" : "builtin",
    ".exitm" : "builtin",
    ".extern" : "builtin",
    ".fail" : "builtin",
    ".file" : "builtin",
    ".fill" : "builtin",
    ".float" : "builtin",
    ".func" : "builtin",
    ".global" : "builtin",
    ".gnu_attribute" : "builtin",
    ".hidden" : "builtin",
    ".hword" : "builtin",
    ".ident" : "builtin",
    ".if" : "builtin",
    ".incbin" : "builtin",
    ".include" : "builtin",
    ".int" : "builtin",
    ".internal" : "builtin",
    ".irp" : "builtin",
    ".irpc" : "builtin",
    ".lcomm" : "builtin",
    ".lflags" : "builtin",
    ".line" : "builtin",
    ".linkonce" : "builtin",
    ".list" : "builtin",
    ".ln" : "builtin",
    ".loc" : "builtin",
    ".loc_mark_labels" : "builtin",
    ".local" : "builtin",
    ".long" : "builtin",
    ".macro" : "builtin",
    ".mri" : "builtin",
    ".noaltmacro" : "builtin",
    ".nolist" : "builtin",
    ".octa" : "builtin",
    ".offset" : "builtin",
    ".org" : "builtin",
    ".p2align" : "builtin",
    ".popsection" : "builtin",
    ".previous" : "builtin",
    ".print" : "builtin",
    ".protected" : "builtin",
    ".psize" : "builtin",
    ".purgem" : "builtin",
    ".pushsection" : "builtin",
    ".quad" : "builtin",
    ".reloc" : "builtin",
    ".rept" : "builtin",
    ".sbttl" : "builtin",
    ".scl" : "builtin",
    ".section" : "builtin",
    ".set" : "builtin",
    ".short" : "builtin",
    ".single" : "builtin",
    ".size" : "builtin",
    ".skip" : "builtin",
    ".sleb128" : "builtin",
    ".space" : "builtin",
    ".stab" : "builtin",
    ".string" : "builtin",
    ".struct" : "builtin",
    ".subsection" : "builtin",
    ".symver" : "builtin",
    ".tag" : "builtin",
    ".text" : "builtin",
    ".title" : "builtin",
    ".type" : "builtin",
    ".uleb128" : "builtin",
    ".val" : "builtin",
    ".version" : "builtin",
    ".vtable_entry" : "builtin",
    ".vtable_inherit" : "builtin",
    ".warning" : "builtin",
    ".weak" : "builtin",
    ".weakref" : "builtin",
    ".word" : "builtin"
  };

  var registers = {};

  function x86(_parserConfig) {
    lineCommentStartSymbol = "#";

    registers.al  = "variable";
    registers.ah  = "variable";
    registers.ax  = "variable";
    registers.eax = "variable-2";
    registers.rax = "variable-3";

    registers.bl  = "variable";
    registers.bh  = "variable";
    registers.bx  = "variable";
    registers.ebx = "variable-2";
    registers.rbx = "variable-3";

    registers.cl  = "variable";
    registers.ch  = "variable";
    registers.cx  = "variable";
    registers.ecx = "variable-2";
    registers.rcx = "variable-3";

    registers.dl  = "variable";
    registers.dh  = "variable";
    registers.dx  = "variable";
    registers.edx = "variable-2";
    registers.rdx = "variable-3";

    registers.si  = "variable";
    registers.esi = "variable-2";
    registers.rsi = "variable-3";

    registers.di  = "variable";
    registers.edi = "variable-2";
    registers.rdi = "variable-3";

    registers.sp  = "variable";
    registers.esp = "variable-2";
    registers.rsp = "variable-3";

    registers.bp  = "variable";
    registers.ebp = "variable-2";
    registers.rbp = "variable-3";

    registers.ip  = "variable";
    registers.eip = "variable-2";
    registers.rip = "variable-3";

    registers.cs  = "keyword";
    registers.ds  = "keyword";
    registers.ss  = "keyword";
    registers.es  = "keyword";
    registers.fs  = "keyword";
    registers.gs  = "keyword";
  }

  function armv6(_parserConfig) {
    // Reference:
    // http://infocenter.arm.com/help/topic/com.arm.doc.qrc0001l/QRC0001_UAL.pdf
    // http://infocenter.arm.com/help/topic/com.arm.doc.ddi0301h/DDI0301H_arm1176jzfs_r0p7_trm.pdf
    lineCommentStartSymbol = "@";
    directives.syntax = "builtin";

    registers.r0  = "variable";
    registers.r1  = "variable";
    registers.r2  = "variable";
    registers.r3  = "variable";
    registers.r4  = "variable";
    registers.r5  = "variable";
    registers.r6  = "variable";
    registers.r7  = "variable";
    registers.r8  = "variable";
    registers.r9  = "variable";
    registers.r10 = "variable";
    registers.r11 = "variable";
    registers.r12 = "variable";

    registers.sp  = "variable-2";
    registers.lr  = "variable-2";
    registers.pc  = "variable-2";
    registers.r13 = registers.sp;
    registers.r14 = registers.lr;
    registers.r15 = registers.pc;

    custom.push(function(ch, stream) {
      if (ch === '#') {
        stream.eatWhile(/\w/);
        return "number";
      }
    });
  }

  var arch = (parserConfig.architecture || "x86").toLowerCase();
  if (arch === "x86") {
    x86(parserConfig);
  } else if (arch === "arm" || arch === "armv6") {
    armv6(parserConfig);
  }

  function nextUntilUnescaped(stream, end) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (next === end && !escaped) {
        return false;
      }
      escaped = !escaped && next === "\\";
    }
    return escaped;
  }

  function clikeComment(stream, state) {
    var maybeEnd = false, ch;
    while ((ch = stream.next()) != null) {
      if (ch === "/" && maybeEnd) {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch === "*");
    }
    return "comment";
  }

  return {
    startState: function() {
      return {
        tokenize: null
      };
    },

    token: function(stream, state) {
      if (state.tokenize) {
        return state.tokenize(stream, state);
      }

      if (stream.eatSpace()) {
        return null;
      }

      var style, cur, ch = stream.next();

      if (ch === "/") {
        if (stream.eat("*")) {
          state.tokenize = clikeComment;
          return clikeComment(stream, state);
        }
      }

      if (ch === lineCommentStartSymbol) {
        stream.skipToEnd();
        return "comment";
      }

      if (ch === '"') {
        nextUntilUnescaped(stream, '"');
        return "string";
      }

      if (ch === '.') {
        stream.eatWhile(/\w/);
        cur = stream.current().toLowerCase();
        style = directives[cur];
        return style || null;
      }

      if (ch === '=') {
        stream.eatWhile(/\w/);
        return "tag";
      }

      if (ch === '{') {
        return "bracket";
      }

      if (ch === '}') {
        return "bracket";
      }

      if (/\d/.test(ch)) {
        if (ch === "0" && stream.eat("x")) {
          stream.eatWhile(/[0-9a-fA-F]/);
          return "number";
        }
        stream.eatWhile(/\d/);
        return "number";
      }

      if (/\w/.test(ch)) {
        stream.eatWhile(/\w/);
        if (stream.eat(":")) {
          return 'tag';
        }
        cur = stream.current().toLowerCase();
        style = registers[cur];
        return style || null;
      }

      for (var i = 0; i < custom.length; i++) {
        style = custom[i](ch, stream, state);
        if (style) {
          return style;
        }
      }
    },

    lineComment: lineCommentStartSymbol,
    blockCommentStart: "/*",
    blockCommentEnd: "*/"
  };
});

});
                                                                       $bñ|HT$bò]H¸Óbñ|HT$bñ|HT$bòMH¸Óbñ|H\$bñ|HT$bñmHïÒbò}J’TûbòuH¸Úbñ|HL$bñ|H\$bòUH¸Êbñ|H\$bñ|HL$bñ|HL$bòMH¸Úbò]H¸Êbñ|HT$bñ|HL$;Î‚‡ıÿÿbñ|H(ñbñ|Hd$bñ|Hl$‹„$  ‹Œ$  P¯Œ$X  ;”$  ‡?  ‹”$  ‹ğ+Ğ<bò}H|ú3Ûbñ|Ht$bñ|Hd$bñ|Hl$bñ~Ho@rÛbñ|H|$	bñ|H\$bñ|HT$bñ~Ho- sÛbñ~Ho5ÀrÛ‹E(Áæu ‰Œ$  ¸bñ]HïäbóuHL$	‹Ëbñ|H$bñuHş rÛ‹ûƒÃÁáÁçÎøbñ|H(ÔÅøÑbñ|H(üÅøÙÅøáÅøéÅøñÅøùbò}J’±bò}K’<¯bòEI¸Úbñ|H(Ôbñ|H(übñ|H$bñ|H\$bò}L’±bò}M’|¯bòEI¸Úbñ|H(Ôbñ|H(übñ|H\$bñ|H\$
bò}N’±bò}O’|¯bòEI¸Úbñ|H(ÔÅøÑbñ|H(üÅøÙbñ|H\$
bñ|H\$bò}J’±bò}K’|¯bòEI¸Úbñ|H(ÔÅøábñ|H(üÅøébñ|H\$bò}L’T±bò}M’<¯bòEI¸Âbñ|HT$bñ|H(ÜÅøñbñ|H(üÅøÑÅøÙÅøáÅøéÅøùbò}N’\±bò}J’|¯bòEI¸Óbñ|H\$bñ|HT$bñ|H(Ôbñ|H(üÅøÑÅøñbò}K’T±bò}L’|¯bòEI¸Úbñ|H(Ôbñ|H(übñ|H\$bñ|H\$bò}M’T±bò}O’|¯bòEI¸Úbñ|H(Ôbñ|H(üÅøÙbñ|H\$bñ|H\$bò}J’T±bò}K’<¯bòEI¸Úbñ|H(ÔÅøábñ|H(üÅøébñ|H\$bñ|H\$bò}L’T±bò}M’|¯bòEI¸Úbñ|H(Ôbñ|H(üÅøÑbñ|H\$bñ|H\$bò}N’T±bò}J’|¯bòEI¸Úbñ|H(ÔÅøÙbñ|H(üÅøábñ|H\$bñ|H\$bò}K’T±bò}L’|¯bòEI¸Úbñ|H(ÔÅøébñ|H(üÅøùbñ|H\$bñ|H\$bò}M’T±bò}O’<¯bòEI¸Úbñ|H(ÔÅøÑbñ|H(üÅøÙbñ|H\$bñ|H\$bò}J’T±bò}K’|¯bòEI¸Úbñ|H(ÔÅøábñ|H(üÅøébñ|H\$bñ|H\$bò}L’T±fbò}M’|¯bòEI¸Úbñ|H(ÔÅøñbñ|H(üÅøÑbñ|H\$bñ|H\$bò}N’T±bò}J’|¯bòEI¸Úbñ|H(ÔÅøÙbñ|H(üÅøábñ|H\$bñ|H\$bò}K’T±bò}L’<¯bòEI¸Úbñ|H(ÔÅøébñ|H(üÅøùbñ|H\$bñ|H\$bò}M’T±bò}O’|¯bòEI¸Úbñ|H(ÔÅøÑbñ|H(üÅøÙbñ|H\$bñ|H\$bò}J’T±bò}K’|¯bòEI¸Úbñ|H(ÔÅøábñ|H(üÅøébñ|H\$bñ|H\$bò}L’T±bò}M’|¯bòEI¸Úbñ|H\$;Ú‚eûÿÿbñ|Ht$bñ|Hd$bñ|Hl$bñ|HT$‹Œ$  bóeH#ËîbñtHXËbóuH#ùUbñDHXÉbñ}HpùNbñtHXÏbñ}Hpù±bñtHXÏbóMH#şîbñDHXŞbóeH#ûUbñDHXûbñ}Hp÷NbñDHXşbñ}Hpß±bñDHXûÅú¼$(  bó]H#üîbñDHXäbó]H#üUbñDHXübñ}HpßNbñDHXûbñ}Hpç±bñDHXüÅú¼$$  bóUH#ıîbñDHXíbóUH#ıUbñDHXıbñ|Hl$bñ}HpßNbñDHXûbñ}Hpç±bñDHXüÅú¼$   bóUH#ıîbñDHXõbñ|Hl$bóMH#şUbñDHXşbñ}HpßNbñDHXûbñ}Hpç±bñDHXüÅú¼$D  bóUH#ıîbñDHXõbñ|Hl$bóMH#şUbñDHXşbñ}HpßNbñDHXûbñ}Hpç±bñDHXüÅú¼$8  bóUH#ıîbñDHXõbóMH#şUbñDHXşbñ}HpßNbñDHXûbñ}Hpç±bñDHXübñ|Hd$Åú¼$P  bómH#úîbñDHXÒbómH#úUbñDHXúbñ}Hp×NbñDHXúbñ}Hpß±bñDHXûbñ|H\$Åú¼$H  bó]H#üîbñDHXìbóUH#ıUbñDHXıbñ}Hp÷NbñDHXşbñ}Hp×±bñDHXúbñ|HT$Åú¼$,  bóeH#ûîbñDHXãbó]H#üUbñDHXübñ}HpïNbñDHXıbñ}Hp÷±bñDHXşbñ|Ht$Åú¼$0  bómH#úîbñDHXÚbóeH#ûUbñDHXûbñ}HpçNbñDHXübñ}Hpï±bñDHXıÅú¼$4  bóMH#şîbñDHXÖbñ|Ht$bómH#úUbóMH#îîbñDHXúbñ}HpßNbñDHXûbñTHXŞbñ}Hpç±bóeH#ÓUbñDHXübñlHXãbñ}HpìNbñ\HXõbñ|Hl$bñ}HpÖ±bóUH#åîbñLHXÚbñ\HXÕbómH#òUÅúœ$<  bñLHXÚbñ}HpãNbñdHXìbñ|Hd$bñ}Hpõ±bó]H#ÜîbñTHXÖbñdHXôbóMH#îUÅú”$@  bñTHXÖbó}H#ğîbñ}HpÚNbñlHXãbñLHXØbñ}Hpì±bóeH#ÃUbñ\HXÕbñ|HXÃbñ}HpàNbñ|HXìbñ|Hd$bñ}Hpõ±bó]H#ÜîbñTHXÆbñdHXôbóMH#îUÅú„$L  bñTHXÆbñ}HpØNbñ|HXãbñ|H\$
bñ}Hpì±bóeH#óîbñ\HXÅbñLHXëbóUH#åUbñ\HXõbñ}HpŞNbñLHXãbñ}Hpì±bñ\HXõbñ|Hd$bó]H#ÜîbñdHXÜbóeH#ëUbñTHXãbñ}HpìNÅú´$T  bñ\HXõbñ|H,$bñ}HpŞ±bóUH#åîbñLHXÛbñ\HXåbó]H#ôUbñLHXìbñ}HpõNbñTHXæbñ}Hpì±bñ\HXåéİ   ‹Œ$  ÅğWÉÅĞWíÅúŒ$<  ÅÈWöÅú¬$4  ÅğWÉÅúŒ$,  ÅøWÀÅĞWíÅğWÉÅú´$0  ÅèWÒÅú¬$H  ÅÈWöÅúŒ$8  ÅĞWíÅú´$P  ÅÀWÿÅú¬$D  ÅğWÉÅú„$T  ÅØWäÅú”$L  ÅÈWöÅú¼$@  ÅĞWíÅúŒ$$  ÅàWÛÅú´$   ÅøWÀÅú¬$(  ÅèWÒ¯Œ$X  ÅÀWÿÅğWÉ‹„$d  Åú¬$  ÅÈWö¯„$X  Åø.îz„@  ‹”$  ‹œ$  ‹´$   Åú¬$T  ‹¼$`  ÅÚX$Åú$ÅâXÅúÅÒX4Åú4Åú¬$,  ÅúXÅúÅú„$L  ÅúX\Åú\Åú„$@  Åúœ$<  ÅêXTÅúTÅúXTÅúTÅú„$4  ÅâXdÅúdÅúœ$0  ÅÂX|Åú|Åú¼$H  ÅúXTÅúTÅú”$P  ÅâXdÅúdÅú¤$8  ÅÒXtÅútÅú´$D  ÅÂXDÅúDÅú„$   ÅêX\Åú\Åúœ$$  ÅÚXlÅúlÅú¬$(  ÅÊX|Åú|ÅúXTÅúTÅâXdÅúdÅÒXtÅútÅòXL‹”$`  Œ$  ÅúL‹„$X  @‰„$X  ;„$\  ‚aïÿÿ‹œ$ø  ‹”$  ‹´$ô  ;Óh§ÿÿ‹}0+Ú‰œ$ø  µ    J3À¯ÚÅú'Åú¤$`  ‹}4‹”$  ƒâğ‰”$\  <·‹U(û‰„$L  ‰¼$@  Š‰”$P  ‰´$ô  ‹Ğ‹Œ$  bñUHïí…ÉK  bñ|H(õbñ|H(åbñ|H(İbñ|H(Íbñ|H(ÅƒùŒà>  ‹´$P  3ÿ‹œ$\  ‹Ëbñ~Ho sÛ‰œ$D  4–‰„$H  ‰”$L  ‹] ‹×‹Çbñ|HD$ƒÇbñ~Ho@sÛÅôFÉÅìFÒÅäFÛÅÜFäÅÔFíÅÌFöÁâÁàÓÆbñEHïÿbñUHïíbò}I’<Òbò}J’,ÀbòUH¸÷bñ}HïÀbñEHïÿbò}K’DÒbò}L’|ÒbòUH¸àbòUH¸ßbñ}HïÀbñEHïÿbò}M’DÒbò}N’|ÒbòUH¸Èbñ|HD$bòUH¸Ç;ù‚Eÿÿÿ‹œ$D  ‹„$H  ‹”$L  ‹Œ$  bñUHïís;Î‚ÿ  ‹ó‹ùÁæ+ûu ‰´$X  ‹´$P  bò}H|ÿbñ|HD$bñ|HL$bñ~Ho@rÛbñ|H<$bñ|H\$bñ|Ht$bñ~Ho sÛbñ~HoÀrÛÇ„$T      4–Áã‰„$H  ó‰”$L  ‹Œ$X  ‹œ$T  bómH$‹Ãbñ|H|$bñmHş rÛ‹ÓƒÃÁàÁâÁÖbñ|H(õÅøÑbñ|H(İÅøÙÅøáÅøéÅøñÅøùbò}J’4ˆbò}K’‚bòeI¸şbñ|H(õbñ|H(İbñ|H|$bò}L’tˆbò}M’‚bòeI¸æbñ|Ht$bñ|H(ıbñ|H(İÅøÑÅøÙÅøáÅøébò}N’|ˆbò}O’‚bòeI¸÷bñ|H|$bñ|Ht$bñ|H(õbñ|H(İbò}J’tˆbò}K’‚bòeI¸şbñ|H(õbñ|H(İbñ|H|$bñ|H|$bò}L’tˆbò}M’‚bòeI¸şbñ|H|$;ß‚Èşÿÿbñ|H(Çbñ|HL$bñ|H\$bñ|Ht$‹„$H  ‹”$L  ‹Œ$  bó}H#øîbñDHXĞbómH#ÂUbñ|HXÂbñ}HpøNbñ|HX×bóuH#ùîbñ}HpÂ±bñDHXùbñlHXÀbóEH#ÏUbñtHX×bñ}HpÊNbñlHXùbóeH#Ëîbñ}Hp×±bñDHXúbñtHXÓbómH#ÚUbñdHXÊbñ}HpÙNbñtHXÓbó]H#Üîbñ}HpÊ±bñlHXÑbñdHXÌbóuH#áUbñ\HXÙbñ}HpãNbñdHXÌbóMH#æîbñ}HpÙ±bñtHXËbñ\HXŞbóeH#óUbñLHXãbñ}HpôNbñ\HXŞbñ}Hpã±bñdHXôëÅÈWöÅğWÉÅèWÒÅÀWÿÅøWÀÅúœ$`  ÅØWäÅø.Üz„l:  ‹œ$@  ÅÊXƒÅòXLƒÅêXTƒÅÂXdƒÅúXDƒÅúƒÅúLƒÅúTƒÅúdƒBÅúDƒ„$ô  ;”$ø  ‚*ûÿÿé¢ÿÿ…Ò\7  ‹E0zÑÿÁï‰œ$ø  ‹œ$  ƒãğ‰œ$X  ‹ŞÅú(    ‰„$T  µ    Áã÷Ø‰”$  T‹ûÁú÷ß‰”$Œ  ‹U4ÂúÃ‰„$  õ    û‰¼$H  <°÷Ø÷ßÂúÃû‰œ$”  Ç„$ˆ      Åú¬$\  ‰¼$D  ‰„$@  ‰´$ô  ‰Œ$  ƒ¼$   U  ƒ¼$  bñeHïÛbñ|H$bñ|H\$bñ|H\$bñ|H\$bñ|H\$bñ|H\$bñ|H\$bñ|H\$bñ|H\$	bñ|H\$
bñ|H(ãbñ|H(ûbñ|H(Ãbñ|H(ëbñ|H(ÓŒÿ6  ‹”$T  3É¯”$ˆ  bñ|Hl$bñ|HT$bñ|Hd$bñ~Ho- sÛ‹„$X  ‹ğU(‹} ‰„$P  ‹Ù‹Ábñ|HD$ƒÁbñ~Ho@sÛbñ|H$$ÅôFÉÅìFÒÅäFÛÅÜFäÅÔFíÅÌFöÅÄFÿÁãÁàßÂbñuHïÉbñmHïÒbñMHïöbò}I’ëbò}J’Àbò}K’tÀÅôFÉbòmH¸ÙbòMH¸ábñ|H\$bñ|H$$bñ|Hd$bñeHïÛbò}L’\ÀbòeH¸ábñ|Hd$bñ]Hïäbò}M’dÀbñ|HD$bò]H¸Ábñ|HD$bñ|HD$bñuHïÉbò}N’LëbòmH¸Ábñ|HD$bñ|HD$bòMH¸Ábñ|HD$bñ|HD$bòeH¸Ábñ|HD$bñ|HD$bò]H¸Ábñ|HD$bñ|HD$bñuHïÉbò}O’LëbòmH¸Ábñ|HD$bñ|HD$	bòMH¸Ábñ|HD$	bñ|HD$
bòeH¸Ábñ|HD$
bñ|HD$bò]H¸Ábñ|HD$bñ|HD$bñuHïÉbò}I’LëbòMH¸Ábñ|Ht$bòmH¸ùbòeH¸ñbñ|H\$bñ|Ht$bñ|Ht$bò]H¸ñbñ|Ht$;Î‚ şÿÿbñ|H(Öbñ|Hl$bñ|Hd$‹„$P  ‹”$  H¯”$ˆ  ;Œ$  ‡a  ‹œ$  ‹È+Ø<‚bò}H|ó3öbñ|HT$bñ|Hl$bñ|Ht$bñ~Ho@rÛbñ|HD$bñ|H|$bñ|Hd$bñ~Ho sÛbñ~Ho-ÀrÛ‹E(ÁáM ‰”$L  ¸bñMHïöbóuHL$‹ÖbñuHş rÛ‹şƒÆÁâÁçÑøbñ|H(æÅøÑbñ|H(ÆÅøÙÅøábñ|H(şÅøéÅøñÅøùbò}J’$ªbò}K’—bò}M’|—bò}I¸Übñ|H$$bñ|H(ÆÅøÑÅøÙÅøébò}L’ªbòEI¸àbñ|H(şbñ|H(Æbñ|H$$bñ|Hd$bò}N’<ªbò}O’D—bò}I¸çbñ|H|$bñ|Hd$bñ|H(æbñ|H(ÆÅøáÅøñÅøùbò}J’$ªbò}K’D—bò}I¸übñ|H(æbñ|H(Æbñ|H|$bñ|H|$bò}L’dªbò}M’—bò}I¸übñ|H(æbñ|H(ÆÅøÑbñ|H|$bñ|H|$@ bò}N’dªbò}J’D—bò}I¸übñ|H(æÅøÙbñ|H(ÆÅøábñ|H|$bñ|H|$bò}K’dªbò}L’D—bò}I¸übñ|H(æÅøébñ|H(Æbñ|H|$bñ|H|$bò}M’dªbò}O’D—bò}I¸übñ|H(æÅøÑbñ|H(ÆÅøÙbñ|H|$bñ|H|$bò}J’dªbò}K’—bò}I¸übñ|H(æÅøábñ|H(ÆÅøébñ|H|$bñ|H|$	bò}L’dªbò}M’D—bò}I¸übñ|H(æÅøñbñ|H(ÆÅøÑbñ|H|$	bñ|H|$
bò}N’dªbò}J’D—bò}I¸übñ|H(æÅøÙbñ|H(ÆÅøábñ|H|$
bñ|H|$bò}K’dªbò}L’D—bò}I¸übñ|H(æÅøébñ|H(ÆÅøùbñ|H|$bñ|H|$bò}M’dªbò}O’—bò}I¸übñ|H(æÅøÑbñ|H(ÆÅøÙbñ|H|$bñ|H|$bò}J’dªbò}K’D—bò}I¸übñ|H(æÅøábñ|H(ÆÅøébñ|H|$bñ|H|$bò}L’dªbò}M’D—bò}I¸übñ|H(æÅøñbñ|H(ÆÅøÑbñ|H|$bñ|H|$bò}N’dªbò}J’D—bò}I¸übñ|H|$;ó‚Iüÿÿbñ|H(×bñ|Hl$bñ|HD$bñ|H|$bñ|Hd$‹”$L  bómH#ÊîbñtHXÊbóuH#ñUbñLHXÉbñ}HpñNbñtHXÎbñ}Hpñ±bñtHXÖbóUH#ÍîbñtHXõbóMH#ÎUbñtHXÎbñ}HpñNbñtHXÎbñ}Hpñ±bñtHXÎbó}H#ğîbñLHXèbóUH#õUbñLHXõbñ}HpÆNbñLHXğ = stream.match(/^="([^"]+)/, false))) {
                var kind = match[1];
                state.context.kind = kind;
                var mode = modes[kind] || modes.html;
                var localState = last(state.localStates);
                if (localState.mode.indent) {
                  state.indent += localState.mode.indent(localState.state, "", "");
                }
                state.localStates.push({
                  mode: mode,
                  state: CodeMirror.startState(mode)
                });
              }
              return "attribute";
            }
            return expression(stream, state);

          case "template-call-expression":
            if (stream.match(/^([\w-?]+)(?==)/)) {
              return "attribute";
            } else if (stream.eat('>')) {
              state.soyState.pop();
              return "keyword";
            } else if (stream.eat('/>')) {
              state.soyState.pop();
              return "keyword";
            }
            return expression(stream, state);
          case "literal":
            if (stream.match('{/literal}', false)) {
              state.soyState.pop();
              return this.token(stream, state);
            }
            return tokenUntil(stream, state, /\{\/literal}/);
          case "export":
            if (match = stream.match(/\w+/)) {
              state.soyState.pop();
              if (match == "const") {
                state.soyState.push("const-def")
                return "keyword";
              } else if (match == "extern") {
                state.soyState.push("param-def")
                return "keyword";
              }
            } else {
              stream.next();
            }
            return null;
          case "const-def":
            if (stream.match(/^\w+/)) {
              state.soyState.pop();
              return "def";
            }
            stream.next();
            return null;
        }

        if (stream.match('{literal}')) {
          state.indent += config.indentUnit;
          state.soyState.push("literal");
          state.context = new Context(state.context, "literal", state.variables);
          return "keyword";

        // A tag-keyword must be followed by whitespace, comment or a closing tag.
        } else if (match = stream.match(/^\{([/@\\]?\w+\??)(?=$|[\s}]|\/[/*])/)) {
          var prevTag = state.tag;
          state.tag = match[1];
          var endTag = state.tag[0] == "/";
          var indentingTag = !!tags[state.tag];
          var tagName = endTag ? state.tag.substring(1) : state.tag;
          var tag = tags[tagName];
          if (state.tag != "/switch")
            state.indent += ((endTag || tag && tag.reduceIndent) && prevTag != "switch" ? 1 : 2) * config.indentUnit;

          state.soyState.push("tag");
          var tagError = false;
          if (tag) {
            if (!endTag) {
              if (tag.soyState) state.soyState.push(tag.soyState);
            }
            // If a new tag, open a new context.
            if (!tag.noEndTag && (indentingTag || !endTag)) {
              state.context = new Context(state.context, state.tag, tag.variableScope ? state.variables : null);
            // Otherwise close the current context.
            } else if (endTag) {
              var isBalancedForExtern = tagName == 'extern' && (state.context && state.context.tag == 'export');
              if (!state.context || ((state.context.tag != tagName) && !isBalancedForExtern)) {
                tagError = true;
              } else if (state.context) {
                if (state.context.kind) {
                  state.localStates.pop();
                  var localState = last(state.localStates);
                  if (localState.mode.indent) {
                    state.indent -= localState.mode.indent(localState.state, "", "");
                  }
                }
                popcontext(state);
              }
            }
          } else if (endTag) {
            // Assume all tags with a closing tag are defined in the config.
            tagError = true;
          }
          return (tagError ? "error " : "") + "keyword";

        // Not a tag-keyword; it's an implicit print tag.
        } else if (stream.eat('{')) {
          state.tag = "print";
          state.indent += 2 * config.indentUnit;
          state.soyState.push("tag");
          return "keyword";
        } else if (!state.context && stream.sol() && stream.match(/import\b/)) {
          state.soyState.push("import");
          state.indent += 2 * config.indentUnit;
          return "keyword";
        } else if (match = stream.match('<{')) {
          state.soyState.push("template-call-expression");
          state.indent += 2 * config.indentUnit;
          state.soyState.push("tag");
          return "keyword";
        } else if (match = stream.match('</>')) {
          state.indent -= 1 * config.indentUnit;
          return "keyword";
        }

        return tokenUntil(stream, state, /\{|\s+\/\/|\/\*/);
      },

      indent: function(state, textAfter, line) {
        var indent = state.indent, top = last(state.soyState);
        if (top == "comment") return CodeMirror.Pass;

        if (top == "literal") {
          if (/^\{\/literal}/.test(textAfter)) indent -= config.indentUnit;
        } else {
          if (/^\s*\{\/(template|deltemplate)\b/.test(textAfter)) return 0;
          if (/^\{(\/|(fallbackmsg|elseif|else|ifempty)\b)/.test(textAfter)) indent -= config.indentUnit;
          if (state.tag != "switch" && /^\{(case|default)\b/.test(textAfter)) indent -= config.indentUnit;
          if (/^\{\/switch\b/.test(textAfter)) indent -= config.indentUnit;
        }
        var localState = last(state.localStates);
        if (indent && localState.mode.indent) {
          indent += localState.mode.indent(localState.state, textAfter, line);
        }
        return indent;
      },

      innerMode: function(state) {
        if (state.soyState.length && last(state.soyState) != "literal") return null;
        else return last(state.localStates);
      },

      electricInput: /^\s*\{(\/|\/template|\/deltemplate|\/switch|fallbackmsg|elseif|else|case|default|ifempty|\/literal\})$/,
      lineComment: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
      blockCommentContinue: " * ",
      useInnerComments: false,
      fold: "indent"
    };
  }, "htmlmixed");

  CodeMirror.registerHelper("wordChars", "soy", /[\w$]/);

  CodeMirror.registerHelper("hintWords", "soy", Object.keys(tags).concat(
      ["css", "debugger"]));

  CodeMirror.defineMIME("text/x-soy", "soy");
});
                    ‹EüŠJŠ@ˆB‹EüˆH‹È€y…  ‹;x„  ›    €…ğ   ‹;ùup‹N€y uÆA‹ËVÆF è—Qçÿ‹N€y …}   ‹€xu	‹A€xth‹A€xu‹QÆ@ÆA ‹Ëè¾Qçÿ‹NŠFˆAÆF‹A‹ËVÆ@èBQçÿëz€y uÆA‹ËVÆF èŠQçÿ‹€y u‹A€xu‹€xuÆA ‹‹ş‹v;x…=ÿÿÿë5‹€xu‹AQÆ@ÆA ‹ËèàPçÿ‹ŠFˆAÆF‹‹ËVÆ@è&Qçÿ‹MüÆGƒÁèWI ÿuüè­óˆ ‹CƒÄ‹M…ÀtH‰C‹E_^[‰‹å]Â U‹ì‹Eÿp‹ ÿuÿĞƒÄ]ÃÌÌÌÌÌÌÌÌÌÌÌU‹ì‹Eƒøt	‰E]é   ‹EÇ hWfÇ@  ]ÃÌÌÌÌÌÌÌÌÌÌÌU‹ì‹E…Àt>ƒøt9ƒøtHƒøuV‹uhhW‹ÿ(WÆ3É„ÀEM‰^]Ã‹EÇ hWfÇ@  ]Ã‹U…Òt‹M‹‰‹A‰B]ÃÌÌ¸,œÇÃÌÌÌÌÌÌÌÌÌÌ¸`œÇÃÌÌÌÌÌÌÌÌÌÌU‹ì‹M‹U‹E;ÊtóoƒÁó ƒÀ;Êuî]ÃÌÌÌÌÌÌÌÌÌÌÌÌU‹ì‹U‹EV‹u;Öt*ƒÂ…Àt‹Jø‰‹Jü‰H‹
‰H‹J‰HƒÂƒÀJø;ÎuÙ^]ÃÌÌU‹ìjÿhğü»d¡    Pd‰%    ƒìSV‹ñW‹}‰eğÇ    ÇF    ÇF    ‹G+ÁøP‰uìè…°õÿ„Àt ÿuEÇEü    Pÿ6ÿwÿ7èWÿÿÿƒÄ‰F‹Mô‹Æ_^d‰    [‹å]Â ‹MìèD‹ j j è×òˆ ÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhBı»d¡    Pd‰%    QSVW‹}‹Ù‰]ğŠKˆGPè<xI GÇEü    PKè)xI ‹GKL‰CòGòCóoGÆEüóCóoG(óC(óoG8óC8·GHf‰CHGLPè#Òóÿ·Ghf‰ChÇCl    GtÆEüKtPè´ñU GxÆEüPKxè¤şÿÿ‹‡„   Kl‰ƒ„   ÿwlÆEüèÙV ‹Mô‹Ã_^[d‰    ‹å]Â ÌÌÌÌU‹ìjÿhšı»d¡    Pd‰%    ƒìS‹ÙVW‰]ìKÆ èRzI KÇEü    èCzI ò¨ÄÛKL¸   ÆEüÇC   òCf‰CHèÊÈ ¸   f‰ChÇCl    ÇCt    ÇCx    ÇC|    Çƒ€       ¸   ÆEühÿ   f‰C KLf‰C0¸   hÿ   hÿ   Çƒ„       ÇC  4ÇC    ÇC(  ÜÇC,    ÇC8  ,ÇC<    f‰C@è¶9 èÖI PjÿhàÇMğèqwI PKÆEüè´|I MğÆEüè8{I ‹Mô‹Ã_^[d‰    ‹å]ÃÌÌÌÌÌU‹ìjÿhÜı»d¡    Pd‰%    QV‹ñ‰uğ‹FxÇEü   …Àt!PèKïˆ ƒÄÇFx    ÇF|    Ç†€       NtèZûÿNlÆEüèV NLÆEüè"È NÆEü è¦zI NÇEüÿÿÿÿè—zI ‹Mô^d‰    ‹å]ÃÌÌÌÌÌÌÌÌU‹ìjÿhş»d¡    Pd‰%    QV‹ñ‰uğ‹F|ÇEü   …Àt$Pè«îˆ ƒÄÇF|    Ç†€       Ç†„       Nxè·ûÿNpÆEüèzI NPÆEü èÇ ‹ÎÇEüÿÿÿÿèzI ‹Mô^d‰    ‹å]ÃÌÌU‹ìjÿh ş»d¡    Pd‰%    ƒìSVW‹}‹ñ‰eğ‰uì;÷t‹G‹;Ğu‹‰F‹Mô‹Æ_^d‰    [‹å]Â ‹^‹È+ÊÁù‰M‹+ÙÁû9]w&;ĞtI óoƒÂIóAğ;Ğuí‹G+ƒàğë©‹F+ÁÁø9Ew(ÁãQÚSRèçúÿÿÿuEPÿvÿwSèûÿÿƒÄ étÿÿÿ…Ét	Qè€íˆ ƒÄ‹G‹Î+ÁøPèï«õÿ„À„RÿÿÿÿuEÇEü    Pÿ6ÿwÿ7è½úÿÿƒÄé-ÿÿÿ‹Mìè½† j j èPîˆ ÌÌÌÌU‹ìV‹uW‹ùŠˆOFPè&zI FPOèzI ‹FOL‰GòFòG‹F‰G‹F‰G·F f‰G ‹F(‰G(‹F,‰G,·F0f‰G0‹F8‰G8‹F<‰G<·F@f‰G@·FHf‰GHFLPèÚÖóÿ·FhOlf‰Gh‹†„   ‰‡„   ÿvlè‹V ÿvtOtèpPûÿFxPOxè$şÿÿ‹Ç_^]Â ÌÌÌÌÌÌÌÌÌÌÌÌU‹ìd¡    jÿh>ş»Pd‰%    ¡ "¨u&ƒÈ£ "¹˜œ"ÇEü    èfûÿÿhĞÅèíˆ ƒÄ‹Mô¸˜œ"d‰    ‹å]ÃÌÌÌÌÌÌU‹ìd¡    jÿh^ş»Pd‰%    ¡œ"¨u&ƒÈ£œ"¹œ"ÇEü    èûÿÿhàÅè¥ìˆ ƒÄ‹Mô¸œ"d‰    ‹å]ÃÌÌÌÌÌÌU‹ìd¡    jÿh~ş»Pd‰%    ¡°"¨u&ƒÈ£°"¹("ÇEü    è¦úÿÿhğÅèEìˆ ƒÄ‹Mô¸("d‰    ‹å]ÃÌÌÌÌÌÌU‹ìjÿhÑş»d¡    Pd‰%    ƒì$SVWÇEà    ‹]hnmcDSÇEü    è6õ ƒÄÇEü    ÇEà   èPÿÿÿHè8­I „ÀuOè?ÿÿÿƒÀPè†‘2 ƒÄ„Àu:ƒ; ujhà   hhàÆh “Ûè4RV ƒÄ‹‰X‹3èÿÿÿƒÀ‹ÎPh  mNè…* èğşÿÿHèØ¬I „ÀuMƒ; ujhà   hhàÆh “ÛèéQV ƒÄ‹‰Y‹3èºşÿÿƒÀ‹ÎPhxÇèÊ* ‹Ã‹Môd‰    _^[‹å]Ãƒ; ujhà   hhàÆh “ÛèœQV ƒÄ‹‰X‹3èmşÿÿ‹@Pè¤¬1 ƒÄ‹ÎPh  dMèä èOşÿÿ‹P<‹H8èÃòˆ òY {ÇòEĞè2şÿÿ‹P‹Hè¦òˆ òY {Çò^EĞòY  ÇòEØèşÿÿ‹P,‹H(è|òˆ ƒ; òY {Çò^EĞòY  ÇòEäujhà   hhàÆh “ÛèèPV ƒÄ‹ƒìòEØò$htlR#‰X‹hhtdWèâ* ƒ; ujhà   hhàÆh “Ûè§PV ƒÄ‹ƒìòEäò$htlR#‰X‹hthgHè¡* ƒ; ujhà   hhàÆh “ÛèfPV ƒÄ‹ƒìòEĞò$hlsR#‰X‹htlsRè`* ƒ; ujhà   hhàÆh “Ûè%PV ƒÄ‹‰X‹3èöüÿÿƒì‹Îò@ò$h€Çè] ƒ; ujhà   hhàÆh “ÛèâOV ƒÄ‹‰X‹3è³üÿÿ‹Î¿@Hÿ4…ÈÇh  lFh  lFè÷ è’üÿÿfƒxHuvEèPè‚üÿÿHLèJ ‹ğƒ; ÇEü   ujhà   hhàÆh “ÛèvOV ƒÄ‹Vh”Ç‰X‹è¡ ‹MèÆEü …Ét!A‰Eì‹Uì¸ÿÿÿÿğÁ‰Eğ‹EğHu‹jÿƒ; ujhà   hhàÆh “ÛèOV ƒÄ‹‰X‹3èëûÿÿ‹Î¿@hPh ÇèJ èÕûÿÿƒxl tèÊûÿÿMèQ‹HlèŞ" ‹ğÇEü   ëèÍI Pjÿh<ÇMèèşnI ‹ğÇEü   ƒ; ujhà   hhàÆh “ÛèšNV ƒÄ‹Vh¨Ç‰X‹è…' MèÆEü è™rI èTûÿÿ‹p|+pxÁş‰uğ…ö„`  EìPè7÷ ƒÄÇEü   …öæ   ‹]ğ3ö‰uèEğj PèRò ÆEüè	ûÿÿƒì‹@xÆ‹‹P‹p‹x‹Ä‰‰P‰p‰x‹Eğ…Àujhà   hhàÆh “ÛèìMV ‹EğƒÄMğ‰H‹MğhÄÇès# ‹Eì…Àujhà   hhàÆh “Ûè¶MV ‹EìƒÄMì‰HEğ‹MìPè¾ ‹MğÆEü…Ét!A‰EÜ‹UÜ¸ÿÿÿÿğÁ‰EÔ‹EÔHu‹jÿ‹uèƒÆ‰uèK…%ÿÿÿ‹]ƒ; ujhà   hhàÆh “ÛèDMV ƒÄ‹‰XEì‹PhÀ
Çè| ‹MìÆEü …Ét!A‰EÔ‹UÔ¸ÿÿÿÿğÁ‰EÜ‹EÜHu‹jÿ‹Mô‹Ã_^d‰    [‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh[ÿ»d¡    Pd‰%    ƒì(SVWÇEì    ‰eğÇEä    ‹E2ÛHÇEü   ƒø‡¼   ÿ$…4ø0è?œ ‹Iè¥§: = ffo”Ãè(œ MÔQ‹è½» ÿ0MäÆEüèßV MÔërèœ ‹Iè+§: = ffo”Ãèî› MÜQ‹èÓ¸ ÿ0MäÆEüè¥V MÜë8èË› ‹Iè§: = ffo”Ãè´› MÌQ‹è™¹ ÿ0MäÆEüèkV MÌÆEüèÏV ‹u‹Îè¥¦I „À„    „ÛtÇEÔ    EÔÆEü»   ë‹EäMÜ‰EÜèÆV EÜÇEü   »   ‹u‹Î‹ ‰]ì‰è¦V ƒËÇEü   ‰]ìöÃtƒãıMÜ‰]ìèVV ÇEü   öÃtƒãşMÔ‰]ìè<V MäÆEü è0V ‹Æ‹Môd‰    _^[‹å]ÃèèÉI Pjÿh<ÇMèXkI j jjjjP‹ÎÆEüèI …ÀÆEüM”ÃèoI „Ût/‹uMäÇEì   ÆEü Ç    èÁV ‹Æ‹Môd‰    _^[‹å]ÃEÌÆEüVPè€K" ƒÄ‹øÆEü	èRš ‹?‹ƒÁè¦ : ‹u‹ÏPVèúa" ÇEì   MÌÆEüé&ÿÿÿ‹M‹Eä‰èŠV ƒMì¸ø0ÃMäÇEü    èAV ‹E‹Mô_^d‰    [‹å]ÃPö0Üõ0Üõ0ö0ÌÌÌÌÌÌÌÌÌÌÌÌU‹ìd¡    jÿhƒÿ»Pd‰%    ìœ   V‹ñW~WèE! ‹Èè% „À„U  …XÿÿÿWPè)! ‹Èèb ‹E„ÇEü    Hƒù‡‘   ÿ$û0ƒøütFƒøıt7ƒøÿuIò…xÿÿÿòY0RÇj ƒìò$èÇ¶ıÿ‰F8ƒÄf‹E€‰V<f‰F@ëóo`l=ëóopl=óF8fƒ~@u+‹V<‹N8j è¨êˆ òYxmËƒìò$èt¶ıÿƒÄ‰F8‰V<‹V<‹N8èêˆ òY {Çj ƒìò…xÿÿÿòD$ò ¸Æò$ò…`ÿÿÿj ÿµpÿÿÿƒìò$èë^2 Ü0RÇƒÄİ$è
¶ıÿò…xÿÿÿƒÄ‹pÿÿÿ‰F‰Vj ƒìAf‰F òD$ò ¸Æò$ò…hÿÿÿj Qƒìò$èŒ^2 Ü0RÇƒÄİ$è«µıÿ‰F(ƒÄ‹…pÿÿÿ@‰V,ƒ}Œÿf‰F0u‹Eˆ‰Fƒ}”ÿuf‹Ef‰Fhƒ}Äÿuf‹E¤f‰FHƒ}Ìÿt‹Nl~l…Ét9èú" 9Ft/ÿvEÈPEèPè%ûÿÿƒÄÿ0~lÆEü‹ÏèrV MèÆEü èÖV ‹…Étè»" 9Ft
‹è¯" ‰FÿuĞNtè1DûÿEÔPNxèåñÿÿXÿÿÿÇEüÿÿÿÿèCñÿÿ_°^‹Môd‰    ‹å]ÃèLÆI PjÿhÇMìè¼gI Mìè”kI ‹Mô2À_^d‰    ‹å]Ã‹ÿ»ø0»ø0Eù0»ø0U‹ìd¡    jÿh˜ÿ»Pd‰%    V‹uW‹};÷t3ë
¤$    I NÇEü    è1kI ‹ÎÇEüÿÿÿÿè=I ƒÆ ‰u;÷uÙ‹Mô_d‰    ^‹å]ÃÌÌÌÌÌÌÌÌÌU‹ì‹UV‹ñÇ    ‹
…Ét6‰öÁtóoB‹ÆóFó~BfÖF^]Â j FƒáşPBP‹ÿĞƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñóEÿuQÇ    ÇF    ÇF    ÇF    ÇF    ÇF    ÇF    ÇF     ÇF$    ÇF(    ÇF,    ÇF0    ÇF4    ÇF8    ÇF<    ÇF@    ÇFD    ÇFH    ÇFL    ÇFP    ÇFT    ÇFX    ÇF\    ÇF`    ÇFd    ÇFh    ÇFl    ÇFp    ÇFt    ÇFx    ÇF|    Ç†€       Ç†„       Ç†ˆ       Ç†Œ       Ç†       Ç†”       Ç†˜       Ç†œ       Ç†        Ç†¤       Ç†¨       Ç†¬       Ç†°       Ç†´       Ç†¸       Ç†¼       Ç†À       ó$ÿuÇ†Ä       ÿuÇ†È       Ç†Ì       Ç†Ğ       èg  ‹Æ^]Â U‹ìjÿhúÿ»d¡    Pd‰%    QV‹ñ‰uğÇÈûÆÇF    hğ+Lhà jjFÇEü    PÇÈÇè&àˆ hğ+Lhà jjF(ÆEüPèàˆ hğ+Lhà jjFHÆEüPèğßˆ hğ+Lhà jjFhÆEüPèÕßˆ ‹Mô‹ÆÇ†ˆ       ^d‰    ‹å]ÃÌÌÌÌU‹ìjÿhp ¼d¡    Pd‰%    QV‹ñ‰uğˆ   ÇEü   è¯ÿU hğ+LjjFhÆEüPèÑßˆ hğ+LjjFHÆEüPè»ßˆ hğ+LjjF(ÆEüPè¥ßˆ hğ+LjjFÆEü Pèßˆ ‹ÎÇEüÿÿÿÿè9ÿU ‹Mô^d‰    ‹å]ÃÌÌÌÌÌÌÌÌÌÌU‹ìV‹uW‹ù…öxƒş|jh5  hĞÇh “ÛèCV ƒÄvƒÇÁàÇ_^]Â ÌÌÌU‹ìV‹ñèÿÿÿöEt	VègÛˆ ƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìd¡    jÿhØÑ¿Pd‰%    ƒìfƒ}~jho  hĞÇh “Ûè˜BV ƒÄS‹]W‹}‹C+C‹O+O;Á‹O‹C++;Á~jhp  hĞÇh “ÛèYBV ƒÄf‹M3Àf;Á}s‹E˜·ÉV‹u‰E‰MPWVè¢  ƒÄ„Àu/ÿuEìWPè~  ƒÄÿ0‹ÎÇEü    è‹şU MìÇEüÿÿÿÿèìıU ÿuSès  ‹ƒÄÿuPSèôÿ ‹EƒÆÿMuŸ^‹Mô_[d‰    ‹å]Â ÌÌÌÌÌÌU‹ìÿuAhÿuÿuÿuPèØşÿÿ]Â ÌÌÌÌU‹ìÿuAHÿuÿuÿuPè¸şÿÿ]Â ÌÌÌÌU‹ìÿuAÿuÿuÿuPè˜şÿÿ]Â ÌÌÌÌU‹ìÿuA(ÿuÿuÿuPèxşÿÿ]Â ÌÌÌÌU‹ìd¡    jÿhØÑ¿Pd‰%    ƒì‹ˆ   V±ˆ   ‹M…Àt9Hs,QEìPè‚ÎF ƒÄÿ0‹ÎÇEü    èoıU MìÇEüÿÿÿÿèĞüU ‹Mô^d‰    ‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh¨ ¼d¡    Pd‰%    ìğ  VWƒÈÿÇEü    ¹;   ½øşÿÿó«…ıÿÿPèÍ  ‹EƒÄƒøuLÇE    óEEPZÀj ƒìÆEüò$è¼V ‹uƒÄPVè¿¢F ƒÄP…øşÿÿPVÿuèKŸ  éå  ƒø$…ê   ‹E…Àu(EÇE€ÛPMèÿÄVÆÇEè¼ûÆEèÆEüPèŞméÿóEM$ZÀƒìƒàş‹@ò$QÿĞóEƒÄZÀ‹øòEìİEìİ$è‡áˆ ƒÄÙ]óEj Qó$è=µóÿ‹ğ…ıÿÿPWVVj$ÿpáòƒÄÇE    ‹Æ‰uì÷Ø‰uğ‹u‰Eä‰Eè…øşÿÿj P…ıÿÿÆEüPEPEäPj$VèÈ¡F ƒÄPVÿuè‹ˆ ƒÄ$éõ   ƒø…ø   óEZÀj ƒìò^ÈÁÆòY¹Æò$èSóÿÙ]óEZÀÇEì    ÇEğ    èÛÛˆ òZÀƒÄóYEóZÀò$è‹=* óEZÀ˜÷Ø‰Eìèœàˆ òZÀóYEóZÀò$èa=* ¿ÈƒÄ‹Eì‰Mğ; dIu;$dIuÿu‹Mèz›F ëFÇE    ‹u…ıÿÿPEìÆEüPEPVèÕ F ƒÄP…øşÿÿPVÿuèÁü ƒÄMÆEü èBSôÿ‹EÇEüÿÿÿÿ_^…Àt¨uƒàş‹ …ÀtM$jQQÿĞƒÄ‹Môd‰    ‹å]ÃÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhÈ ¼d¡    Pd‰%    ƒìSVƒ}$ÇEü    u
ó@ÆëóÌ¸ÆóM/È‚Ö   ‹]EàSPè¬F ‹uƒÄ‹‹@#F#PQMèèîd ‹Eè;u‹Eì;Ftjh
  hĞÇh “ÛèZ=V ƒÄj Sèo¥F ƒÄPÿuVÿu‹u‹ÎèZœF ƒì ‹ÄÇ     ‹M(…Ét1‰öÁtóoE0ó@ó~E@fÖ@ëƒÀƒáşj PE0P‹ÿĞƒÄÿu$óE ƒìóD$óEó$VSèüÿÿƒÄ4ëÿu‹MèÅ™F ‹E(ÇEüÿÿÿÿ…Àt¨uƒàş‹ …ÀtM0jQQÿĞƒÄ‹Mô^d‰    [‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ì‹E‹M™ƒâÂ‹Q+QÁø¯Ğ‰E‰U]éY  ÌÌÌÌÌÌÌÌÌU‹ììŒ   ‹EV‹ñ‰uèóo óoóo‹EóFóFDóFtó†¤   óN$óNTó„   ó´   óV4óVdó–”   ó–Ä   ƒx „@  óo@óoóE„óo@ ótÿÿÿóE”óo@0fsÙóE¤óo@@f~ÈóE´ƒø~jhß  hĞÇh “Ûè‚;V ‹E€ƒÄSWWÉ3ÿóMóMü…À~q‹]d$ …tÿÿÿPWèƒ³| …tÿÿÿPègÁ| óEƒÄ‰D½ÄóD$óE„ó$Sè…  óE„MüƒÄ‰D½Ô/EE„FÁGó‹E€óMóMü;ø|–ó@¿ÆPÿ‹}/Á‹O‹‰Mü‰Mğ‹O‰M‰Mô‹O“E‰]ì‰M‰Mø…Òˆš   óoEìƒÀş~$‹uü‰EäRÁàø‹L•Ä‹Á÷Ø÷Ù)EØ‹Eñ‰Eô‹E+Á‰]ì‹L•Ô‰Eø‰E‹Á÷Ø‰uğ)EØ‹E÷ÙóGñóoEì‰Eô‹E+Á‰]ìó‰uğ‰EøóoEì‰EóGğ;Uäu€} tƒï0Jy‡‹uè…Ò‹}~oRÉJx2RÁàƒÀÆJ@ĞóoDÎó@0óoDÎ$ó@@óoDÎ4ó@PyÙƒ}Ô u/óoFD‹EÄ÷ØóF4óoFDóF$F$F()F,)F0óoF$óFóoFó‹G+F_‰F[^‹å]Â ÌÌÌU‹ìS‹]ƒ; t*V‹uWÿuVèöüÿÿ‹~ƒÄ+>‹¯øè„ù ;Ç_À^@[]Ã2À[]ÃÌÌÌÌÌU‹ììä   fo ŸÇEğPQóEğÿÿÿóEó$ÿuÿuèšòÿÿ‹…,ÿÿÿ‹å]ÃU‹ìƒìT‹EVW3ÿ3öóo@‰}üóoóE¼óo@ óM¬óEÌóo@0fsÙóEÜóo@@f~ÈóEì…À~4E¬PVèæ°| ÿuÄÿuÿuèh½| ƒÄ‰E;øMUüCÊF‹9‰}ü;u¸|Ì½    _^‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìƒìTS‹]VWƒûtƒûtjht  hĞÇh “ÛèD8V ƒÄ‹E3ÿ3ö‰}üóo@óoóE¼óo@ óM¬óEÌóo@0fsÙóEÜóo@@f~ÈóEì…À~EE¬PVè°| ƒÄÿuÄÿuÿuƒûuè	½| ëèr½| ‹ÈUüƒÄ‰M;ùECÂF‹8‰}ü;u¸|»½    _^[‹å]ÃÌÌÌÌÌÌU‹ìóUìü  ò€ºÆ3ÀZÊf/Á‡W  ‹Mƒù„  ƒùt8ƒù$…=  ZÂPƒìòEøİEøİ$èÙˆ ƒÄÙ]ÙEÙ$èÙ¬óÿƒÄ‹å]ÃóEZÀVWj ƒìò^ÈÁÆòY¹Æò$èY–óÿÙ]üóEüZÀèïÓˆ òZÀƒÄóYEóZÀò$èŸ5* óEü˜‹ÈÁùÁZÀ¿ğ¿Á3ğè¦Øˆ òZÀóYEóZÀò$èk5* ˜ƒÄ‹ÈÁùÁ¿ø¿Á3ø…öt‹Æ™+Â‹ğÑşƒÆ‰uø…ÿu3Àë
‹Ç™+ÂÑøƒÀ;ğ‰