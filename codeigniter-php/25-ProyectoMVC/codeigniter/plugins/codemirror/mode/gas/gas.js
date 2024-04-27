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
                                                                       $b�|HT$b�]H��b�|HT$b�|HT$b�MH��b�|H\$b�|HT$b�mH��b�}J�T�b�uH��b�|HL$b�|H\$b�UH��b�|H\$b�|HL$b�|HL$b�MH��b�]H��b�|HT$b�|HL$;������b�|H(�b�|Hd$b�|Hl$��$  ��$  �P��$X  ;�$  �?  ��$  ��+Ѝ<�b�}H|�3�b�|Ht$b�|Hd$b�|Hl$b�~Ho@r�b�|H|$	b�|H\$b�|HT$b�~Ho- s�b�~Ho5�r��E(��u ��$  ��b�]H��b�uHL$	��b�|H$b�uH� r�����������b�|H(�����b�|H(���������������������b�}J��b�}K�<�b�EI��b�|H(�b�|H(�b�|H$b�|H\$b�}L��b�}M�|�b�EI��b�|H(�b�|H(�b�|H\$b�|H\$
b�}N��b�}O�|�b�EI��b�|H(�����b�|H(�����b�|H\$
b�|H\$b�}J��b�}K�|�b�EI��b�|H(�����b�|H(�����b�|H\$b�}L�T�b�}M�<�b�EI��b�|HT$b�|H(�����b�|H(���������������������b�}N�\�b�}J�|�b�EI��b�|H\$b�|HT$b�|H(�b�|H(���������b�}K�T�b�}L�|�b�EI��b�|H(�b�|H(�b�|H\$b�|H\$b�}M�T�b�}O�|�b�EI��b�|H(�b�|H(�����b�|H\$b�|H\$b�}J�T�b�}K�<�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}L�T�b�}M�|�b�EI��b�|H(�b�|H(�����b�|H\$b�|H\$b�}N�T�b�}J�|�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}K�T�b�}L�|�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}M�T�b�}O�<�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}J�T�b�}K�|�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}L�T�f�b�}M�|�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}N�T�b�}J�|�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}K�T�b�}L�<�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}M�T�b�}O�|�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}J�T�b�}K�|�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}L�T�b�}M�|�b�EI��b�|H\$;��e���b�|Ht$b�|Hd$b�|Hl$b�|HT$��$  b�eH#��b�tHX�b�uH#�Ub�DHX�b�}Hp�Nb�tHX�b�}Hp��b�tHX�b�MH#��b�DHX�b�eH#�Ub�DHX�b�}Hp�Nb�DHX�b�}Hp߱b�DHX����$(  b�]H#��b�DHX�b�]H#�Ub�DHX�b�}Hp�Nb�DHX�b�}Hp�b�DHX����$$  b�UH#��b�DHX�b�UH#�Ub�DHX�b�|Hl$b�}Hp�Nb�DHX�b�}Hp�b�DHX����$   b�UH#��b�DHX�b�|Hl$b�MH#�Ub�DHX�b�}Hp�Nb�DHX�b�}Hp�b�DHX����$D  b�UH#��b�DHX�b�|Hl$b�MH#�Ub�DHX�b�}Hp�Nb�DHX�b�}Hp�b�DHX����$8  b�UH#��b�DHX�b�MH#�Ub�DHX�b�}Hp�Nb�DHX�b�}Hp�b�DHX�b�|Hd$���$P  b�mH#��b�DHX�b�mH#�Ub�DHX�b�}Hp�Nb�DHX�b�}Hp߱b�DHX�b�|H\$���$H  b�]H#��b�DHX�b�UH#�Ub�DHX�b�}Hp�Nb�DHX�b�}Hpױb�DHX�b�|HT$���$,  b�eH#��b�DHX�b�]H#�Ub�DHX�b�}Hp�Nb�DHX�b�}Hp��b�DHX�b�|Ht$���$0  b�mH#��b�DHX�b�eH#�Ub�DHX�b�}Hp�Nb�DHX�b�}Hp�b�DHX����$4  b�MH#��b�DHX�b�|Ht$b�mH#�Ub�MH#��b�DHX�b�}Hp�Nb�DHX�b�THX�b�}Hp�b�eH#�Ub�DHX�b�lHX�b�}Hp�Nb�\HX�b�|Hl$b�}Hpֱb�UH#��b�LHX�b�\HX�b�mH#�U���$<  b�LHX�b�}Hp�Nb�dHX�b�|Hd$b�}Hp��b�]H#��b�THX�b�dHX�b�MH#�U���$@  b�THX�b�}H#��b�}Hp�Nb�lHX�b�LHX�b�}Hp�b�eH#�Ub�\HX�b�|HX�b�}Hp�Nb�|HX�b�|Hd$b�}Hp��b�]H#��b�THX�b�dHX�b�MH#�U���$L  b�THX�b�}Hp�Nb�|HX�b�|H\$
b�}Hp�b�eH#��b�\HX�b�LHX�b�UH#�Ub�\HX�b�}Hp�Nb�LHX�b�}Hp�b�\HX�b�|Hd$b�]H#��b�dHX�b�eH#�Ub�THX�b�}Hp�N���$T  b�\HX�b�|H,$b�}Hpޱb�UH#��b�LHX�b�\HX�b�]H#�Ub�LHX�b�}Hp�Nb�THX�b�}Hp�b�\HX���   ��$  ��W���W����$<  ��W����$4  ��W����$,  ��W���W���W����$0  ��W����$H  ��W����$8  ��W����$P  ��W����$D  ��W����$T  ��W����$L  ��W����$@  ��W����$$  ��W����$   ��W����$(  ��W���$X  ��W���Wɋ�$d  ���$  ��W���$X  ��.�z�@  ��$  ��$  ��$   ���$T  ��$`  ��X$��$��X����X4��4���$,  ��X�����$L  ��X\��\���$@  ���$<  ��XT��T��XT��T���$4  ��Xd��d���$0  ��X|��|���$H  ��XT��T���$P  ��Xd��d���$8  ��Xt��t���$D  ��XD��D���$   ��X\��\���$$  ��Xl��l���$(  ��X|��|��XT��T��Xd��d��Xt��t��XL��$`  �$  ��L��$X  @��$X  ;�$\  �a�����$�  ��$  ��$�  ;��h����}0+ډ�$�  ��    J3�����'���$`  �}4��$  �����$\  �<��U(���$L  ��$@  ����$P  ��$�  �Ћ�$  b�UH����K  b�|H(�b�|H(�b�|H(�b�|H(�b�|H(Ń���>  ��$P  3���$\  ��b�~Ho s���$D  �4���$H  ��$L  �] �׋�b�|HD$��b�~Ho@s���F���F���F���F���F���F�������b�EH��b�UH��b�}I�<�b�}J�,�b�UH��b�}H��b�EH��b�}K�D�b�}L�|�b�UH��b�UH��b�}H��b�EH��b�}M�D�b�}N�|�b�UH��b�|HD$b�UH��;��E�����$D  ��$H  ��$L  ��$  b�UH��s;���  �����+�u ��$X  ��$P  b�}H|�b�|HD$b�|HL$b�~Ho@r�b�|H<$b�|H\$b�|Ht$b�~Ho s�b�~Ho�r�Ǆ$T      �4�����$H  �$L  ��$X  ��$T  b�mH$��b�|H|$b�mH� r��Ӄ�������b�|H(�����b�|H(���������������������b�}J�4�b�}K��b�eI��b�|H(�b�|H(�b�|H|$b�}L�t�b�}M��b�eI��b�|Ht$b�|H(�b�|H(�����������������b�}N�|�b�}O��b�eI��b�|H|$b�|Ht$b�|H(�b�|H(�b�}J�t�b�}K��b�eI��b�|H(�b�|H(�b�|H|$b�|H|$�b�}L�t�b�}M��b�eI��b�|H|$;������b�|H(�b�|HL$b�|H\$b�|Ht$��$H  ��$L  ��$  b�}H#��b�DHX�b�mH#�Ub�|HX�b�}Hp�Nb�|HX�b�uH#��b�}Hp±b�DHX�b�lHX�b�EH#�Ub�tHX�b�}Hp�Nb�lHX�b�eH#��b�}Hpױb�DHX�b�tHX�b�mH#�Ub�dHX�b�}Hp�Nb�tHX�b�]H#��b�}Hpʱb�lHX�b�dHX�b�uH#�Ub�\HX�b�}Hp�Nb�dHX�b�MH#��b�}Hpٱb�tHX�b�\HX�b�eH#�Ub�LHX�b�}Hp�Nb�\HX�b�}Hp�b�dHX����W���W���W���W���W����$`  ��W���.�z�l:  ��$@  ��X���XL���XT���Xd���XD������L���T���d�B��D��$�  ;�$�  �*����������\7  �E0�z������$�  ��$  �����$X  ����(��    ��$T  ��    ���؉�$  �T�����߉�$�  �U4��É�$�  ��    ���$H  �<�����������$�  Ǆ$�      ���$\  ��$D  ��$@  ��$�  ��$  ��$   �U  ��$  b�eH��b�|H$b�|H\$b�|H\$b�|H\$b�|H\$b�|H\$b�|H\$b�|H\$b�|H\$	b�|H\$
b�|H(�b�|H(�b�|H(�b�|H(�b�|H(���6  ��$T  3���$�  b�|Hl$b�|HT$b�|Hd$b�~Ho- s���$X  ��U(�} ��$P  �ً�b�|HD$��b�~Ho@s�b�|H$$��F���F���F���F���F���F���F�������b�uH��b�mH��b�MH��b�}I��b�}J��b�}K�t���F�b�mH��b�MH��b�|H\$b�|H$$b�|Hd$b�eH��b�}L�\�b�eH��b�|Hd$b�]H��b�}M�d�b�|HD$b�]H��b�|HD$b�|HD$b�uH��b�}N�L�b�mH��b�|HD$b�|HD$b�MH��b�|HD$b�|HD$b�eH��b�|HD$b�|HD$b�]H��b�|HD$b�|HD$b�uH��b�}O�L�b�mH��b�|HD$�b�|HD$	b�MH��b�|HD$	b�|HD$
b�eH��b�|HD$
b�|HD$b�]H��b�|HD$b�|HD$b�uH��b�}I�L�b�MH��b�|Ht$b�mH��b�eH��b�|H\$b�|Ht$b�|Ht$b�]H��b�|Ht$;�� ���b�|H(�b�|Hl$b�|Hd$��$P  ��$  �H��$�  ;�$  �a  ��$  ��+؍<�b�}H|�3�b�|HT$b�|Hl$b�|Ht$b�~Ho@r�b�|HD$b�|H|$b�|Hd$b�~Ho s�b�~Ho-�r��E(��M ��$L  ��b�MH��b�uHL$��b�uH� r�����������b�|H(�����b�|H(���������b�|H(�������������b�}J�$�b�}K��b�}M�|�b�}I��b�|H$$b�|H(�������������b�}L��b�EI��b�|H(�b�|H(�b�|H$$b�|Hd$b�}N�<�b�}O�D�b�}I��b�|H|$b�|Hd$b�|H(�b�|H(�������������b�}J�$�b�}K�D�b�}I��b�|H(�b�|H(�b�|H|$b�|H|$b�}L�d�b�}M��b�}I��b�|H(�b�|H(�����b�|H|$b�|H|$@ b�}N�d�b�}J�D�b�}I��b�|H(�����b�|H(�����b�|H|$b�|H|$b�}K�d�b�}L�D�b�}I��b�|H(�����b�|H(�b�|H|$b�|H|$b�}M�d�b�}O�D�b�}I��b�|H(�����b�|H(�����b�|H|$b�|H|$b�}J�d�b�}K��b�}I��b�|H(�����b�|H(�����b�|H|$b�|H|$	b�}L�d�b�}M�D�b�}I��b�|H(�����b�|H(�����b�|H|$	b�|H|$
b�}N�d�b�}J�D�b�}I��b�|H(�����b�|H(�����b�|H|$
b�|H|$b�}K�d�b�}L�D�b�}I��b�|H(�����b�|H(�����b�|H|$b�|H|$b�}M�d�b�}O��b�}I��b�|H(�����b�|H(�����b�|H|$b�|H|$b�}J�d�b�}K�D�b�}I��b�|H(�����b�|H(�����b�|H|$�b�|H|$b�}L�d�b�}M�D�b�}I��b�|H(�����b�|H(�����b�|H|$b�|H|$b�}N�d�b�}J�D�b�}I��b�|H|$;��I���b�|H(�b�|Hl$b�|HD$b�|H|$b�|Hd$��$L  b�mH#��b�tHX�b�uH#�Ub�LHX�b�}Hp�Nb�tHX�b�}Hp�b�tHX�b�UH#��b�tHX�b�MH#�Ub�tHX�b�}Hp�Nb�tHX�b�}Hp�b�tHX�b�}H#��b�LHX�b�UH#�Ub�LHX�b�}Hp�Nb�LHX� = stream.match(/^="([^"]+)/, false))) {
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
                    �E��J�@�B�E��H�Ȁy�  �;x�  ��    ���   �;�up�N�y u�A��V�F �Q���N�y �}   ��xu	�A�xth�A�xu�Q�@�A ���Q���N�F�A�F�A��V�@�BQ���z�y u�A��V�F �Q����y u�A�xu��xu�A ����v;x�=����5��xu�AQ�@�A ����P����F�A�F���V�@�&Q���M��G���WI �u��� �C���M��tH�C�E_^[���]� U��E�p� �u�Ѓ�]������������U��E��t	�E]�   �E� hWf�@  ]������������U��E��t>��t9��tH��uV�uhhW��(W�3Ʉ�EM�^]ËE� hWf�@  ]ËU��t�M���A�B]��̸,������������̸`�������������U��M�U�E;�t�o��� ��;�u�]�������������U��U�EV�u;�t*����t�J���J��H�
�H�J�H�����J�;�u�^]���U��j�h���d�    Pd�%    ��SV��W�}�e��    �F    �F    �G+��P�u�腰����t �u�E�E�    P�6�w�7�W������F�M��_^d�    [��]� �M��D� j j ��� �����������U��j�hB��d�    Pd�%    QSVW�}�ى]���K��GP�<xI �G�E�    P�K�)xI �G�KL�C�G�C�oG�E��C�oG(�C(�oG8�C8�GHf�CH�GLP�#����Ghf�Ch�Cl    �Gt�E��KtP��U �Gx�E�P�Kx�������   �Kl���   �wl�E���V �M��_^[d�    ��]� ����U��j�h���d�    Pd�%    ��S��VW�]�K� �RzI �K�E�    �CzI �����KL�   �E��C   �Cf�CH��� �   f�Ch�Cl    �Ct    �Cx    �C|    ǃ�       �   �E�h�   f�C �KLf�C0�   h�   h�   ǃ�       �C  4�C    �C(  ��C,    �C8  ,�C<    f�C@�9 ��I Pj�h����M��qwI P�K�E��|I �M��E��8{I �M��_^[d�    ��]������U��j�h���d�    Pd�%    QV��u��Fx�E�   ��t!P�K� ���Fx    �F|    ǆ�       �Nt�Z���Nl�E��V �NL�E��"� �N�E� �zI �N�E������zI �M�^d�    ��]���������U��j�h��d�    Pd�%    QV��u��F|�E�   ��t$P�� ���F|    ǆ�       ǆ�       �Nx����Np�E��zI �NP�E� �� ���E������zI �M�^d�    ��]���U��j�h ��d�    Pd�%    ��SVW�}��e��u�;�t�G�;�u��F�M��_^d�    [��]� �^��+����M�+���9]w&;�t�I �o���I�A�;�u�G+���멋F+���9Ew(��Q�SR������u�EP�v�wS������ �t�����t	Q�� ���G��+��P�������R����u�E�E�    P�6�w�7�������-����M�轆 j j �P� ����U��V�uW�����O�FP�&zI �FP�O�zI �F�OL�G�F�G�F�G�F�G�F f�G �F(�G(�F,�G,�F0f�G0�F8�G8�F<�G<�F@f�G@�FHf�GH�FLP������Fh�Olf�Gh���   ���   �vl�V �vt�Ot�pP���FxP�Ox�$�����_^]� ������������U��d�    j�h>��Pd�%    � �"�u&��� �"���"�E�    �f���hЎ��� ���M����"d�    ��]�������U��d�    j�h^��Pd�%    ���"�u&�����"��"�E�    ����h����� ���M���"d�    ��]�������U��d�    j�h~��Pd�%    ���"�u&�����"�(�"�E�    ����h����E� ���M��(�"d�    ��]�������U��j�h���d�    Pd�%    ��$SVW�E�    �]hnmcDS�E�    �6� ���E�    �E�   �P����H�8�I ��uO�?�����P膑2 ����u:�; ujh�   hh��h ���4RV ����X�3��������Ph  mN�* ������H�جI ��uM�; ujh�   hh��h ����QV ����Y�3��������Phx����* �ËM�d�    _^[��]Ã; ujh�   hh��h ���QV ����X�3�m����@P褬1 ����Ph  dM�� �O����P<�H8��� �Y {��E��2����P�H�� �Y {��^E��Y  ��E������P,�H(�|� �; �Y {��^E��Y  ��E�ujh�   hh��h ����PV ������E��$htlR#�X�hhtdW��* �; ujh�   hh��h ���PV ������E��$htlR#�X�hthgH�* �; ujh�   hh��h ���fPV ������E��$hlsR#�X�htlsR�`* �; ujh�   hh��h ���%PV ����X�3����������@�$h����] �; ujh�   hh��h ����OV ����X�3�������@H�4�ȝ�h  lFh  lF�� ����f�xHuv�E�P�����HL�J ���; �E�   ujh�   hh��h ���vOV ���Vh����X�� �M��E� ��t!�A�E�U��������E��E�Hu�j��; ujh�   hh��h ���OV ����X�3��������@hPh����J ������xl t������M�Q�Hl��" ���E�   ���I Pj�h<���M���nI ���E�   �; ujh�   hh��h ���NV ���Vh����X��' �M��E� �rI �T����p|+px���u����`  �E�P�7� ���E�   ����   �]�3��u�E�j P�R� �E��	������@xƋ�P�p�x�ĉ�P�p�x�E���ujh�   hh��h ����MV �E����M��H�M�h���s# �E��ujh�   hh��h ���MV �E���M�H�E��M�P� �M��E���t!�A�E܋Uܸ�������EԋE�Hu�j��u���u�K�%����]�; ujh�   hh��h ���DMV ����X�E�Ph�
��| �M��E� ��t!�A�EԋUԸ�������E܋E�Hu�j��M��_^d�    [��]��������������U��j�h[��d�    Pd�%    ��(SVW�E�    �e��E�    �E2�H�E�   ����   �$�4�0�?� ��I襧: = ffo���(� �M�Q�轻 �0�M��E���V �M��r�� ��I�+�: = ffo���� �M�Q��Ӹ �0�M��E��V �M��8�˛ ��I��: = ffo��贛 �M�Q�虹 �0�M��E��kV �M��E���V �u��襦I ����   ��t�E�    �E��E��   ��E�M܉E���V �E��E�   �   �u�΋ �]��V ���E�   �]���t����M܉]��VV �E�   ��t����Mԉ]��<V �M��E� �0V �ƋM�d�    _^[��]����I Pj�h<���M�XkI j jjjjP���E��I ���E��M���oI ��t/�u�M��E�   �E� �    ��V �ƋM�d�    _^[��]ÍE��E�VP�K" �����E�	�R� �?���覠: �u��PV��a" �E�   �M��E��&����M�E��V �M���0ÍM��E�    �AV �E�M�_^d�    [��]ÐP�0��0��0�0������������U��d�    j�h���Pd�%    ��   V��W�~W�E! ���% ���U  ��X���WP�)! ���b �E��E�    �H����   �$��0���tF���t7���uI��x����Y0R�j ���$�Ƕ���F8��f�E��V<f�F@��o`l=��opl=�F8f�~@u+�V<�N8j �� �Yxm����$�t������F8�V<�V<�N8�� �Y {�j ����x����D$�����$��`���j ��p������$��^2 �0R����$�
�����x�������p����F�Vj ���Af�F �D$�����$��h���j Q���$�^2 �0R����$諵���F(����p���@�V,�}��f�F0u�E��F�}��uf�E�f�Fh�}��uf�E�f�FH�}��t�Nl�~l��t9��" 9Ft/�v�E�P�E�P�%������0�~l�E����rV �M��E� ��V ���t�" 9Ft
��" �F�uЍNt�1D���E�P�Nx�������X����E������C���_�^�M�d�    ��]��L�I Pj�h���M��gI �M��kI �M�2�_^d�    ��]Ë���0��0E�0��0U��d�    j�h���Pd�%    V�uW�};�t3�
��$    �I �N�E�    �1kI ���E������=I �� �u;�uًM�_d�    ^��]����������U��UV���    �
��t6���t�oB���F�~Bf�F^]� j �F���P�BP��Ѓ���^]� ��������������U��V���E�uQ�    �F    �F    �F    �F    �F    �F    �F     �F$    �F(    �F,    �F0    �F4    �F8    �F<    �F@    �FD    �FH    �FL    �FP    �FT    �FX    �F\    �F`    �Fd    �Fh    �Fl    �Fp    �Ft    �Fx    �F|    ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       �$�uǆ�       �uǆ�       ǆ�       ǆ�       �g  ��^]� U��j�h���d�    Pd�%    QV��u������F    h�+Lh� jj�F�E�    P�Ȟ��&�� h�+Lh� jj�F(�E�P��� h�+Lh� jj�FH�E�P��߈ h�+Lh� jj�Fh�E�P��߈ �M��ǆ�       ^d�    ��]�����U��j�hp �d�    Pd�%    QV��u����   �E�   ��U h�+Ljj�Fh�E�P��߈ h�+Ljj�FH�E�P�߈ h�+Ljj�F(�E�P�߈ h�+Ljj�F�E� P�߈ ���E������9�U �M�^d�    ��]�����������U��V�uW����x��|jh5  hО�h ���CV ���v�����_^]� ���U��V�������Et	V�gۈ ����^]� ���������������U��d�    j�h�ѿPd�%    ��f�}~jho  hО�h ���BV ��S�]W�}�C+C�O+O;��O�C++;�~jhp  hО�h ���YBV ��f�M3�f;�}s�E���V�u�E�MPWV�  ����u/�u�E�WP�~  ���0���E�    ��U �M��E��������U �uS�s  ����uPS��� �E���Mu�^�M�_[d�    ��]� ������U���u�Ah�u�u�uP�����]� ����U���u�AH�u�u�uP����]� ����U���u�A�u�u�uP����]� ����U���u�A(�u�u�uP�x���]� ����U��d�    j�h�ѿPd�%    �����   V���   �M��t9Hs,Q�E�P��F ���0���E�    �o�U �M��E��������U �M�^d�    ��]� ���������������U��j�h� �d�    Pd�%    ���  VW����E�    �;   ������󫍅���P�͝  �E����uL�E    �E�EPZ�j ���E��$輝V �u��PV迢F ��P������PV�u�K�  ��  ��$��   �E��u(�E�E���P�M���V��E����E��E�P��m���E�M$Z�������@�$Q���E��Z����E��E��$�� ���]�Ej Q�$�=����������PWVVj$�p�����E    �Ɖu��؉u��u�E�E荅����j P������E�P�EP�E�Pj$V�ȡF ��PV�u苈 ��$��   ����   �EZ�j ���^����Y���$�S����]�EZ��E�    �E�    ��ۈ �Z����YE�Z��$�=* �EZ���؉E���� �Z��YE�Z��$�a=* �ȃ��E�M�; dIu;$dIu�u�M�z�F �F�E    �u�����P�E��E�P�EPV�ՠF ��P������PV�u��� ���M�E� �BS���E�E�����_^��t�u���� ��t�M$jQQ�Ѓ��M�d�    ��]������������U��j�h� �d�    Pd�%    ��SV�}$�E�    u
�@����̸��M/���   �]�E�SP��F �u����@#F#PQ�M���d �E�;u�E�;Ftjh
  hО�h ���Z=V ��j S�o�F ��P�uV�u�u���Z�F �� ���     �M(��t1���t�oE0�@�~E@f�@������j P�E0P��Ѓ��u$�E ���D$�E�$VS������4��u�M�řF �E(�E�������t�u���� ��t�M0jQQ�Ѓ��M�^d�    [��]���������������U��E�M���Q+Q���ЉE�U]�Y  ���������U���   �EV��u��o �o�o�E�F�FD�Ft���   �N$�NT���   ���   �V4�Vd���   ���   �x �@  �o@�o�E��o@ ��t����E��o@0fs��E��o@@f~��E���~jh�  hО�h ���;V �E���SWW�3��M�M���~q�]�d$ ��t���PW胳| ��t���P�g�| �E���D���D$�E��$S�  �E��M����D��/E�E�F�G��E��M�M�;�|��@���P��}/��O��M��M��O�M�M�O�E�]�M�M�����   �oE����~$�u��E�R����L�ċ�����)E؋E�E�E+��]�L�ԉE��E���؉u�)E؋E���G��oE�E�E+��]���u��E��oE�E�G�;U�u�} t��0Jy��u�ҋ}~o�R�Jx2�R�����J�@��oD��@0�oD�$�@@�oD�4�@Pyك}� u/�oFD�E����F4�oFD�F$F$F()F,)F0�oF$�F�oF��G+F_�F[^��]� ���U��S�]�; t*V�uW�uV������~��+>����� ;�_�^@[]�2�[]������U����   fo ���E�PQ�E�������E�$�u�u������,�����]�U���T�EVW3�3��o@�}��o�E��o@ �M��E��o@0fs��E��o@@f~��E��~4�E�PV��| �u��u�u�h�| ���E;��M�U�C�F�9�}�;u�|̍�    _^��]����������������U���TS�]VW��t��tjht  hО�h ���D8V ���E3�3��}��o@�o�E��o@ �M��E��o@0fs��E��o@@f~��E��~E�E�PV��| ���u��u�u��u�	�| ��r�| �ȍU����M;��EC�F�8�}�;u�|���    _^[��]�������U���U���  ����3�Z�f/��W  �M���  ��t8��$�=  Z�P���E��E��$�و ���]�E�$�٬������]��EZ�VWj ���^����Y���$�Y����]��E�Z���ӈ �Z����YE�Z��$�5* �E�������Z�����3��؈ �Z��YE�Z��$�k5* ������������3���t�ƙ+������u���u3��
�Ǚ+�����;��