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
                                                                       $b�|HT$b�]H��b�|HT$b�|HT$b�MH��b�|H\$b�|HT$b�mH��b�}J�T�b�uH��b�|HL$b�|H\$b�UH��b�|H\$b�|HL$b�|HL$b�MH��b�]H��b�|HT$b�|HL$;������b�|H(�b�|Hd$b�|Hl$��$  ��$  �P��$X  ;�$  �?  ��$  ��+Ѝ<�b�}H|�3�b�|Ht$b�|Hd$b�|Hl$b�~Ho
b�}N��b�}O�|�b�EI��b�|H(�����b�|H(�����b�|H\$
b�|H\$b�}J��b�}K�|�b�EI��b�|H(�����b�|H(�����b�|H\$b�}L�T�b�}M�<�b�EI��b�|HT$b�|H(�����b�|H(���������������������b�}N�\�b�}J�|�b�EI��b�|H\$b�|HT$b�|H(�b�|H(���������b�}K�T�b�}L�|�b�EI��b�|H(�b�|H(�b�|H\$b�|H\$b�}M�T�b�}O�|�b�EI��b�|H(�b�|H(�����b�|H\$b�|H\$b�}J�T�b�}K�<�b�EI��b�|H(�����b�|H(�����b�|H\$b�|H\$b�}L�T�b�}M�|�b�EI��b�|H(�b�|H(�����b�|H\$b�|H\$
b�}Hp�b�eH#��b�\HX�b�LHX�b�UH#�Ub�\HX�b�}Hp�Nb�LHX�b�}Hp�b�\HX�b�|Hd$b�]H#��b�dHX�b�eH#�Ub�THX�b�}Hp�N���$T  b�\HX�b�|H,$b�}Hpޱb�UH#��b�LHX�b�\HX�b�]H#�Ub�LHX�b�}Hp�Nb�THX�b�}Hp�b�\HX���   ��$  ��W���W����$<  ��W����$4  ��W����$,  ��W���W���W����$0  ��W����$H  ��W����$8  ��W����$P  ��W����$D  ��W����$T  ��W����$L  ��W����$@  ��W����$$  ��W����$   ��W����$(  ��W���$X  ��W���Wɋ�$d  ���$  ��W���$X  ��.�z�@  ��$  ��$  ��$   ���$T  ��$`  ��X$��$��X����X4��4���$,  ��X�����$L  ��X\��\���$@  ���$<  ��XT��T��XT��T���$4  ��Xd��d���$0  ��X|��|���$H  ��XT��T���$P  ��Xd��d���$8  ��Xt��t���$D  ��XD��D���$   ��X\��\���$$  ��Xl��l���$(  ��X|��|��XT��T��Xd��d��Xt��t��XL��$`  �$  ��L��$X  @��$X  ;�$\  �a�����$�  ��$  ��$�  ;��h����}0+ډ�$�  ��    J3�����'���$`  �}4��$  �����$\  �<��U(���$L  ��$@  ����$P  ��$�  �Ћ�$  b�UH����K  b�|H(�b�|H(�b�|H(�b�|H(�b�|H(Ń���>  ��$P  3���$\  ��b�~Ho s���$D  �4���$H  ��$L  �] �׋�b�|HD$��b�~Ho@s���F���F���F���F���F���F�������b�EH��b�UH��b�}I�<�b�}J�,�b�UH��b�}H��b�EH��b�}K�D�b�}L�|�b�UH��b�UH��b�}H��b�EH��b�}M�D�b�}N�|�b�UH��b�|HD$b�UH��;��E�����$D  ��$H  ��$L  ��$  b�UH��s;���  �����+�u ��$X  ��$P  b�}H|�b�|HD$b�|HL$b�~Ho@r�b�|H<$b�|H\$b�|Ht$b�~Ho s�b�~Ho
b�|H(�b�|H(�b�|H(�b�|H(�b�|H(���6  ��$T  3���$�  b�|Hl$b�|HT$b�|Hd$b�~Ho- s���$X  ��U(�} ��$P  �ً�b�|HD$
b�eH��b�|HD$
b�|HD$b�]H��b�|HD$b�|HD$
b�}N�d�b�}J�D�b�}I��b�|H(�����b�|H(�����b�|H|$
b�|H|$b�}K�d�b�}L�D�b�}I��b�|H(�����b�|H(�����b�|H|$b�|H|$b�}M�d�b�}O��b�}I��b�|H(�����b�|H(�����b�|H|$b�|H|$
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
                    �E��J�@�B�E��H�Ȁy�  �;x�  ��    ���   �;�up�N�y u�A��V�F �Q���N�y
�H�J�H�����J�;�u�^]���U��j�h���d�    Pd�%    ��SV��W�}�e��    �F    �F    �G+��P�u�腰����t �u�E�E�    P�6�w�7�W������F�M��_^d�
��| �M��E� ��t!�A�EԋUԸ�������E܋E�Hu�j��M��_^d�
�����x�������p����F�Vj ���Af�F �D$�����$��h���j Q���$�^2 �
��" �F�uЍNt�1D���E�P�Nx�������X����E������C���_�^�M�d�
��$    �I �N�E�    �1kI ���E������=I �� �u;�uًM�_d�
��t6���t�oB���F�~Bf�F^]� j �F���P�BP��Ѓ���^]� ��������������U��V���E�uQ�    �F    �F    �F    �F    �F    �F    �F     �F$    �F(    �F,    �F0    �F4    �F8    �F<    �F@    �FD    �FH    �FL    �FP    �FT    �FX    �F\    �F`    �Fd    �Fh    �Fl    �Fp    �Ft    �Fx    �F|    ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       ǆ�       �$�uǆ�       �uǆ�       ǆ�       ǆ�       �g  ��^]� U��j�h���d�    Pd�%    QV��u������F    h�+Lh� jj�F�E�    P�Ȟ��&�� h�+Lh� jj�F(�E�P��� h�+Lh� jj�FH�E�P��߈ h�+Lh� jj�Fh�E�P��߈ �M��ǆ�       ^d�
�@����̸��M/���   �]�E�SP��F �u����@#F#PQ�M���d �E�;u�E�;Ftjh
  hО�h ���Z=V ��j S�o�F ��P�uV�u�u���Z�F �� ���     �M(��t1���t�oE0�@�~E@f�@������j P�E0P��Ѓ��u$�E ���D$�E�$VS������4��u�M�řF �E(�E�������t�u���� ��t�M0jQQ�Ѓ��M�^d�
�Ǚ+�����;��