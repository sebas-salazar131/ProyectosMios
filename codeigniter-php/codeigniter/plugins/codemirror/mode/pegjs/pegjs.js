// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../javascript/javascript"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../javascript/javascript"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("pegjs", function (config) {
  var jsMode = CodeMirror.getMode(config, "javascript");

  function identifier(stream) {
    return stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
  }

  return {
    startState: function () {
      return {
        inString: false,
        stringType: null,
        inComment: false,
        inCharacterClass: false,
        braced: 0,
        lhs: true,
        localState: null
      };
    },
    token: function (stream, state) {
      if (stream)

      //check for state changes
      if (!state.inString && !state.inComment && ((stream.peek() == '"') || (stream.peek() == "'"))) {
        state.stringType = stream.peek();
        stream.next(); // Skip quote
        state.inString = true; // Update state
      }
      if (!state.inString && !state.inComment && stream.match('/*')) {
        state.inComment = true;
      }

      //return state
      if (state.inString) {
        while (state.inString && !stream.eol()) {
          if (stream.peek() === state.stringType) {
            stream.next(); // Skip quote
            state.inString = false; // Clear flag
          } else if (stream.peek() === '\\') {
            stream.next();
            stream.next();
          } else {
            stream.match(/^.[^\\\"\']*/);
          }
        }
        return state.lhs ? "property string" : "string"; // Token style
      } else if (state.inComment) {
        while (state.inComment && !stream.eol()) {
          if (stream.match('*/')) {
            state.inComment = false; // Clear flag
          } else {
            stream.match(/^.[^\*]*/);
          }
        }
        return "comment";
      } else if (state.inCharacterClass) {
          while (state.inCharacterClass && !stream.eol()) {
            if (!(stream.match(/^[^\]\\]+/) || stream.match(/^\\./))) {
              state.inCharacterClass = false;
            }
          }
      } else if (stream.peek() === '[') {
        stream.next();
        state.inCharacterClass = true;
        return 'bracket';
      } else if (stream.match('//')) {
        stream.skipToEnd();
        return "comment";
      } else if (state.braced || stream.peek() === '{') {
        if (state.localState === null) {
          state.localState = CodeMirror.startState(jsMode);
        }
        var token = jsMode.token(stream, state.localState);
        var text = stream.current();
        if (!token) {
          for (var i = 0; i < text.length; i++) {
            if (text[i] === '{') {
              state.braced++;
            } else if (text[i] === '}') {
              state.braced--;
            }
          };
        }
        return token;
      } else if (identifier(stream)) {
        if (stream.peek() === ':') {
          return 'variable';
        }
        return 'variable-2';
      } else if (['[', ']', '(', ')'].indexOf(stream.peek()) != -1) {
        stream.next();
        return 'bracket';
      } else if (!stream.eatSpace()) {
        stream.next();
      }
      return null;
    }
  };
}, "javascript");

});
              r��|$d3ۋD$h�L$�4�    +��\$�<��t$$����t$�t$@�|$�����D$0�<�    �����|$(k�����������t$,�ˋt$�|$ �|$�D$,�T$(�\$�\$��D90��L0��T0��D��L��T�\$��\98��d8��l8��\��d��l�� �\$CL$0;\$r��<$�D$h�\$d���T$0���T$$����|$8�<Љ|$,������|$4�<�    +���ЉT$$�L$���|$@������ʉ\$<3��t$�t$��\$�t$�L$�|$(�\$�T$�L$�t$�|$ F��L��T��:�|$8��\��d ��:�|$,��l(��t0��:�|$4����|8��$:�|$0\$(����,:�|$$��4:�|$<��<:�� ;t$�{����t$���\$(���L$ًt$D�T$�;;��l  +����  �\$d�<����<Ӊ|$ ���   ��  �߃��\$t�D$��  �ۃ� ���\$�ÍX�D$h;��u  ���\$+�������|$�|$@�t$D�4Љt$,��    �\$�ۍ4��t$�t$d���<Ӌ���؉|$0�<Ӊ|$(�v����<؃|$ �׉\$�։\$$�t$D��   �$    �t$D�L$�T$�L$�T$,�D$0�4$�\$@�ދ|$(��T���\�����|$�����L���d� ��l�(����|$$�\$ ��������$���,�F;t$r��t$D�L$�T$�D$h�t$D�L$�T$�T$�\$�L$�t$�|$@������ �<X�����|$,����m���$��|X��7��h���|$0��|��E�����|X����P��,�|$(��d��]���4��|X��@����T���|X ��m���$���7��h ���|$$��| ��E������P(��d(�DX(����,�D$ ��]���4���;t$�����t$D�L$�T$�D$h;t$��   �\$d�<Љ|$�t$D�T$�<��t$�<��<׉|$�<؍<׉<$������<׉|$�<[��؍<��D$�<׉|$ �Ӌ$�\$fD  �\$@�ދ|$�����\�����|$ ��L���T���d� ��l�(����|$�\$��������$���,�F;t$Dr��t$D�T$�D$h���  �\$d�<�    +����<Ӊ|$��_��  �߃��\$t�D$��  �ۃ� ���\$�ÍX�D$h;���  ���\$+��\$@���߉t$D��|$�4�    �t$�ލ<ދ\$d��|$ �4[����|$ �<֋t$D�|$vU3ۉ$�t$D�L$�T$�D$ �׋L$�4$�|$��D�0��L�8������F\$@;�r�L$�t$D�L$�T$�D$h�\$@�\$�$�L$�T$�t$D�D$�\$�$�T$�    �    �t$ �4���F0�|F0����T0���|F8��m���$���n8��7��|8�t$���|$@��E�����փ�;T$r��t$D�L$�T$�D$h�D$@�\$�ÉD$�D$h;�sK�\$d�<�    +��[���<��<׉<$�|$Ë\$�Ћ$��D�0��L�8������G\$@;�r���w��H[_^Ã�H[_^��D$    냋|$@�t$D����t$�t$d��    �\$���D$    ��ى\$ �v��؋t$D�<Ӊ|$�����D$    �����t$D����t$�<Ћt$@�|$,�D$    ��    �\$�ۍ�ى\$�\$d�<؍4׋�����t$0�4׉t$(�<[��؍4��<։|$�t$D�Ӊ\$$���� �    �D$�T$�L$VWSU��,��ʋЋt$L�|$P�E ���������D$(������D$�v����l$�,ǉl$�����l$�,����,�l$ �,�    +�ǋ	�\$�4�t$$�{�����l���l$����  ���4�    ��3����$��L$3ۋ�E���L$P��D�L$��t��3��L�L$��L3��t30��T�L$��T3��\�L$��\3��d�L$ ��d3 ��l�L$$��l3(��|��|38�;l$�s����L$��������3ۋ$���3���C���L$P��D�L$��t��.��L�L$��L.��t.0��T�L$��T.��\�L$��\.��d�L$ ��d. ��l�L$$��l.(��|��|.8�;\$�s����L$��k��3ۋ$���3���C���L$P��D�L$��t��.��L�L$��L.��t.0��T�L$��T.��\�L$��\.��d�L$ ��d. ��l�L$$��l.(��|��|.8�;\$�s����L$����3����ۋ$�3ۉ$�,��G���L$P���L$��4��+���L$��L+��t+0���L$��T+���L$��\+��$�L$ ��d+ ��,�L$$��l+(��<��|+8�;|$�{������$�L$�>�\$;\$(��   �$�L$�\$�l$�t$�L$�D$PfD  �|$��������ϋ|$ ��\� ��$���,ϋ<$����J��4ϋ|$$��R��Z��<�A�|$��b ��j(��r0��z8��;L$(|���,][_^�@ �    �D$�T$�L$VWSU��(��
�\$H�l$L�>�������t� ׉|$$��������t$�4[��|$�|� �������l� �t$ �Z�����|$�l$�t���t$���W  ���4�    ��3�����T$��$3ۉL$�T$ @ �    ��E���L$L��D�L$��d��3��L�L$��L3��d3 ��T�L$��T3��\�L$��\3��l��l3(�;l$r��L$��������3�$���3���T$ �     ��E���L$L��D�L$��d��3��L�L$��L3��d3 ��T�L$��T3��\�L$��\3��l��l3(�;l$r��L$��k��3�$���3���T$ D  �    ��E���L$L��D�L$��d��3��L�L$��L3��d3 ��T�L$��T3��\�L$��\3��l��l3(�;l$r��L$����3����ۋ$�3ۉ$�t �D$ fD  ��G���L$L���L$��$��3���L$��L3��d3 ���L$��T3���L$��\3��,��l3(�;|$r����$�T$�L$�D= ;T$$}u�L$�\$�l$�t$�L$�     �    �|$L��������׋|$ ��\� ��,���$�B�|$�� ��H��P��X��` ��h(��;T$$|���(][_^�fD  �D$�T$�L$VWS��D�ڋ1�Ѓ��8  �D$d��L$@������΃���Y�����|���|$ ����  �|$`�\$@�t$<3��t$(���D$$�<�    ���������|$k��������ډt$؉4$�D$�T$�L$�|$�\$�$�D$�L$(f�     �L$(�|$�L$�\$�t$d��:��
����D0��L0��T0�t$$��d
��\:��l�L$(AT$��\0��d0��l0�� ;L$ r��|$`3ۋ����<�D$d��t$���t$@�<$�D$�ƋT$�<�    �������|$k���������\$0��\$�D$,�t$(�|$�ӋD$�L$0 �L$0�|$�L$(�\$�t$��D:��L
��T��D0��L0��T0�t$��d
��\:��l�L$0AT$,��\0��d0��l0�� ;L$ r��|$`�D$d�T$���\$�؉\$3��\$@����É|$(�<�    �������|$,k��������ډt$8؉t$�t$�D$4�|$�\$0�T$�D$�L$8@ �    �L$8�|$�L$0�\$,�t$(��D: ��L
 ��T ��D0��L0��T0�t$��d
(��\:(��l(�L$8AT$4��\0��d0��l0�� ;L$ r��|$�D$d�T$���\$03��\$`������|$8�<$��؉\$4�<��\$@������Љt$�t$�t$��D$�\$(�T$�|$,�D$d�\$�T$�L$�t$@ �    �|$$F��L��T��:�|$8��\��d ��:�|$,����l(��:�|$4\$(����$:�|$0��,:�� ;t$ r��t$���\$(���T$ڋt$<�L$�;;��F  +���L  �\$`�<����<ˉ|$���   �<  �߃��\$t�D$�  �ۃ� ���\$�{;��  �ލ<�+\$����މ\$�\$@�t$<�|$$�4�    �t$�ލ4��t$�t$`�<��ϋ�����\$ �ω\$(�<v������|$ �<ˉ|$,�΋t$<��   �$    �t$<�T$�L$�T$�D$(�4$�    �    �L$@�΋|$$�����L�����|$ ��T���\���d� ��l�(����|$,�L$��������$���,�F;t$r��t$<�T$�L$�D$d�$�t$<�T$�L$�T$�\$�ϋt$�|$@������ �<X�����|$$����m���$��|X��7��h���|$ ��|��E�����|X����P��,�|$(��d��]���4��|X��@����T���|X ��m���$���7��h ���<$��| ��E������P(��d(�DX(����,�D$��]���4���;t$�����t$<�T$�L$�D$d;t$��   �\$`�<ȉ|$�t$<�<��<��<ϋ��<؍<ω|$������<ω<$�<[���<��<ω|$Ë\$�ȉD$�$�L$@�ˋ|$�����L���ߋ|$��\���T���ߋ|$��d� ��l�(��ߋ|$�����,���$�C;\$<r���w��D[_^Ã�D[_^��D$    �(����t$<����t$�<ȋt$@�|$$�D$    ��    �\$�ۍ�ډ\$�\$`�<؍4ϋ�����t$ �4ωt$(�<[��؍4��<Ή|$,�t$<������D  �D$�T$�L$VWSU��(��ʋЋt$H�|$L�E ��������؉D$$��������D$�v�l$�,ǉl$�����4����l$�,�Ǎ{�����l$ �	�\$�l���l$���v  ���4�    ��3����$��L$3��     ��E���L$L��D�L$��t��3��L�L$��L3��t30��T�L$��T3��\�L$��\3��d�L$ ��d3 ��l��l3(�;l$r��L$��������3ۋ$���3��D  �    ��C���L$L��D�L$��t��.��L�L$��L.��t.0��T�L$��T.��\�L$��\.��d�L$ ��d. ��l��l.(�;\$r��L$��k��3ۋ$���3���C���L$L��D�L$��t��.��L�L$��L.��t.0��T�L$��T.��\�L$��\.��d�L$ ��d. ��l��l.(�;\$r��L$����3����ۋ$�3ۉ$�,@ �    ��G���L$L���L$��4��+���L$��L+��t+0���L$��T+���L$��\+��$�L$ ��d+ ��,��l+(�;|$r����$�L$�>�\$;\$$��   �$�L$�\$�l$�t$�L$�D$LfD  �|$��������$ϋ|$ ��T� �����,ϋ<$����J��4�A�|$��R��Z��b ��j(��r0��;L$$|���(][_^�f�     �D$�T$�L$VWS��`�؋�����
  ��$�   ��L$X������ȃ���q�����|���|$(���k  �D$\3��|$|�D$X�t$�4$���T$,�<�    ���������|$k���������T$�D$�L$$�|$�\$ �֋$�L$D  �    �L$�|$�L$�\$��$�   ��:��
����D0��L0��T0�t$,��d
��\:��l�L$AT$��\0��d0��l0�� ;L$(r��|$|������$�   �t$�<�t$X���|$0�T$�֋\$ �<�    �������|$k���������3��D$4�D$�$�T$�|$�t$�$�D$�L$4�     �L$4�|$�L$�\$�t$��D:��L
��T��D0��L0��T0�t$��d
��\:��l�L$4AT$��\0��d0��l0�� ;L$(r��|$|��$�   �\$ �4��4$�4�t$3��t$X����։|$�����|$D�<�    ������|$�D$H�D$�D$��|$8k��������T$4�|$�։T$<�|$@�t$�T$�D$�L$H@ �L$H�|$@�L$<�\$8�t$��D: ��L
 ��T ��D0��L0��T0�t$��d
(��\:(��l(�L$HAT$4��\0��d0��l0�� ;L$(r��D$\�\$ �L$$��$�   �|$(�\  �|$|�|$0���t$(�����t$H3��t$�|$�t$�t$�|$�t$4�\$ �L$$�D$\�|>0�|$L�|$�T$�\$�L$�|>0�|$P�|$�t>0�t$T�t$f��|$L���D$4������|$P��D
��L
(������|$T��T
��\
0�\$D��'��,��d
��l
8��@;t$Hr��D$\�\$ �L$$��$�   �T$4�|$H�������T$�t$��$�   ;|$(sp�t$0���D$\�\$ �L$$�T$�\$�ϋD$<�|$@A��L0��L2��D;0�|$8��D2��T;0��T2�� \$4;L$(rƋD$\�\$ �L$$��$�   �<$3��D$\�L$$�L$|���D$���D$0����|$4�<|$���|$X����D$0�������ʉL$�t$��L$�t$�\$ �|$�ދD$�L$�t$��|$,F��L��T��8�|$4��\��d ��8�|$��l(����8�|$��t0����$8�|$\$��,8�|$0��48�� ;t$(r��t$���t$���\$ �D$\�L$$�>;���  +����J  �t$|�<��4��<Ή|$=�   �;  �����t$t�D$�  �ރ� ���t$�֍r��$�   ;���  ���t$+�������|$�|$X�D$\�ʉD$,�4�    �t$�ލ�ÉD$�D$|�4<΋����|$0�<Ή|$(�4@��<�|$ �4ωt$�ȉD$�D$\��   �$    �D$\�L$$�\$ �L$�T$,�D$0�4$D  �     �\$X�ދ|$(��T���\�����|$�����L���d� ��l�(����|$�\$��������$���,�F;t$r��D$\�\$ �L$$��$�   �\$ �L$$�D$\�T$�\$�L$�t$�|$X������ �<X�����|$,����m���$��|X��7��h���|$0��|��E�����|X����P��,�|$(��d��]���4��|X��@����T���|X ��m���$���7��h ���|$��| ��E������P(��d(�DX(����,�D$��]���4���;t$�����D$\�\$ �L$$��$�   ;D$��   �t$|�<ʉ|$�D$\�L$$�<��<��<ω|$�<�<ω<$������<ϋǍ<v���<��<ϋ$�|$�4Ήt$�t$fD  �L$X�΋|$�����\�����|$��L���T���d� ��l�(����|$�L$��������$���,�F;t$\r��D$\�L$$��$�   ����  �t$|�<v����4ω4$����  ���t$t�D$�b  �D$   �T$�r��$�   ;��D  �Ћt$+փ���ЉT$�T$X�|$|�<�    �|$�ߍ�ӉT$��$�   ��vP3��t$�D$\�\$ �L$$�D$�T$�΋\$�4$�|$X��D�0����C;�r�T$�D$\�\$ �L$$��$�   �t$X�t$�t$�D$\�\$ �L$$�T$�t$�\$�L$�$�<���G0��L70�|$X��ȃ��{;L$r݋D$\�\$ �L$$��$�   �T$X�t$�։$��$�   ;�s,�t$|�<v�t$��׋|$X�ʋ$��D�0����F;�r���w��`[_^Ã�`[_^��D$    렋Ѓ���T$�T$X�t$|�D$    �<�    �|$�ߍ4׋�$�   �t$�����D$    �A����D$\����D$�4ʋD$X�t$,�D$    �<�    �|$�ߍ4ǋD$|�t$�4<΋����|$0�<Ή|$(�4@��<�4ωt$�ȉD$�D$\�����D$H    �����    VWS���T$ �L$�D$(��	� ����  ����   ����   ����   ����   ����   3���3�����L$�$�΋\$�������4V��Ӌ\$$�����A���;<$rҋ$�L$�������;�s%�$�T$�D$$�T$���C���<$t$;�r��[_^�3���t��~����   ����   �D$$��t���   �   �X;���   ��+؃���م�v+3��$3��L$�L$$�\$�������G;�r�$�L$��$���L$�\$$�|$�����4V�����Ã�;$r�$�L$����;��<����t$$�|$�������C;�r�����3��ы�3����둅��	�������������   ����   �T$��t����   �   �Z;���   ��+ڃ���م�v+3��$3��L$�L$$�\$���G����;�r�$�L$���$��L$�\$$�|$��׃������4F���;$r�$�L$����;��O����t$$�|$���C����;�r��1���3��ы�3҃����     �    VWSU��p��$�   ����$�   ����|$L���������|$@��$�   ������L$H��$�   ��$�   ��$�   �$�   ���   �|$\�<�    ��  �u ���D$P   �T$X��$�   ���   �|$DωL$<�|$L�,����  ���5  ��$�    ��  �T$T�$�   3��L$D�����\$`�<
��$�   ���΋�$�   �T$0�L$�l$,�|$(�D$H�D$PPS��$�   �P�P�PR�L$dQ���+ ��$�   �t$pSS��$�   ��$���l  ��$�   �L$T���   +�,	��  �T	����������H  ������$�   ����*���^  �|$L3ҋ|$,�D$4��    �|$H�؋L$(���؉t$8Él$<�49|$0�����,������D$ �\$$�l$h�t$l�L$d��$�   ��L$$�D$ D  �     ��B���|$l��3��D= �|$h��L3��T3��\3��L ��T= ��\ l$d;T$Lr��D$4�T�l$<�t$8�J��L$@;�vO�|$(��    �����L$@�D$4�t$0�<�D$,����D$H�,���D���L������L �D$4�T$HB�T$H;�$�   �1����D$4�D$4��p][_^�3���p][_^ú   �l�����~�$�   �L	��������l$���l$���  �l$D�4�    �l$H3ɋމT$����l$(�T$�D$4�<��<$�<+��|$��+����+���|$ꋜ$�   �4$���     �    ��@���|$��L��L9�|$����T��\��)��9��\1L$;D$r��ȋT$�D$4�t	�~�;|$������D$4��    ���݋D$���D$H�|$(����<���T� T$(��D����L������L��D$4�~����   ��D$4    �������I������~����T$T���3  ��$�   �|$L�������D$�D� �|$�<��<$�����|$������|$�|� ���<��|$�<�    +���D$4    �l$$�t$(�D$0�������|$ �|$\�L$�L$4�|$8�l$X�L$�\$`�ىT$,��$�   ��$�   ��$�   �D$XP��$�   �p��\j��WU��$�   PP�փ� ���O  WU�D$PP�փ����:  WU�D$PP�փ����%  WU�D$PP�փ����  WU�D$PP�փ�����   WU�D$PP�փ�����   WU�D$8PP�փ�����   WU�D$$PP�։D$D���|$4 ��   U��$�   �D$\P��$�   �P�@��P蘟  ���D$8���T$D$T$ �D$8�T$;\$L������|$L�\$`�l$$�t$(�T$,;|$@�  �����ύD$T��$�   P��$�   HQ�P��r����$�   �t$l��$�   PP��$�   �T$L�� ��t��p][_^���$�   �t$\��$�   ��QQ�T$<��$�   �T$<����u���$�   ���t$\���$�   PP�T$<��$�   �T$<����u���$�   �t$\��$�   �T� ��QQ��$�   �D$D���|$4 �h����t$X����$�   �D$\P��$�   x�W�
������D$H;D$@��   �ˍD$T��$�   P��$�   �P�����H�P�Q�x����$�   �t$l��$�   PP��$�   �� ���������$�   �t$\��$�   ��RR��$�   �D$D���|$4 ������t$X��$�   �D$\P��$�   �P���P�R�������D$H;�$�   ������ЍD$P���l$T�ډP�P��$�   ��$�   �H�QU��+ ��$�   �t$p��$�  arguments) }
      finally { endOperation(this); }
    }
  }
  function docMethodOp(f) {
    return function() {
      var cm = this.cm;
      if (!cm || cm.curOp) { return f.apply(this, arguments) }
      startOperation(cm);
      try { return f.apply(this, arguments) }
      finally { endOperation(cm); }
    }
  }

  // HIGHLIGHT WORKER

  function startWorker(cm, time) {
    if (cm.doc.highlightFrontier < cm.display.viewTo)
      { cm.state.highlight.set(time, bind(highlightWorker, cm)); }
  }

  function highlightWorker(cm) {
    var doc = cm.doc;
    if (doc.highlightFrontier >= cm.display.viewTo) { return }
    var end = +new Date + cm.options.workTime;
    var context = getContextBefore(cm, doc.highlightFrontier);
    var changedLines = [];

    doc.iter(context.line, Math.min(doc.first + doc.size, cm.display.viewTo + 500), function (line) {
      if (context.line >= cm.display.viewFrom) { // Visible
        var oldStyles = line.styles;
        var resetState = line.text.length > cm.options.maxHighlightLength ? copyState(doc.mode, context.state) : null;
        var highlighted = highlightLine(cm, line, context, true);
        if (resetState) { context.state = resetState; }
        line.styles = highlighted.styles;
        var oldCls = line.styleClasses, newCls = highlighted.classes;
        if (newCls) { line.styleClasses = newCls; }
        else if (oldCls) { line.styleClasses = null; }
        var ischange = !oldStyles || oldStyles.length != line.styles.length ||
          oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
        for (var i = 0; !ischange && i < oldStyles.length; ++i) { ischange = oldStyles[i] != line.styles[i]; }
        if (ischange) { changedLines.push(context.line); }
        line.stateAfter = context.save();
        context.nextLine();
      } else {
        if (line.text.length <= cm.options.maxHighlightLength)
          { processLine(cm, line.text, context); }
        line.stateAfter = context.line % 5 == 0 ? context.save() : null;
        context.nextLine();
      }
      if (+new Date > end) {
        startWorker(cm, cm.options.workDelay);
        return true
      }
    });
    doc.highlightFrontier = context.line;
    doc.modeFrontier = Math.max(doc.modeFrontier, context.line);
    if (changedLines.length) { runInOp(cm, function () {
      for (var i = 0; i < changedLines.length; i++)
        { regLineChange(cm, changedLines[i], "text"); }
    }); }
  }

  // DISPLAY DRAWING

  var DisplayUpdate = function(cm, viewport, force) {
    var display = cm.display;

    this.viewport = viewport;
    // Store some values that we'll need later (but don't want to force a relayout for)
    this.visible = visibleLines(display, cm.doc, viewport);
    this.editorIsHidden = !display.wrapper.offsetWidth;
    this.wrapperHeight = display.wrapper.clientHeight;
    this.wrapperWidth = display.wrapper.clientWidth;
    this.oldDisplayWidth = displayWidth(cm);
    this.force = force;
    this.dims = getDimensions(cm);
    this.events = [];
  };

  DisplayUpdate.prototype.signal = function (emitter, type) {
    if (hasHandler(emitter, type))
      { this.events.push(arguments); }
  };
  DisplayUpdate.prototype.finish = function () {
    for (var i = 0; i < this.events.length; i++)
      { signal.apply(null, this.events[i]); }
  };

  function maybeClipScrollbars(cm) {
    var display = cm.display;
    if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
      display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
      display.heightForcer.style.height = scrollGap(cm) + "px";
      display.sizer.style.marginBottom = -display.nativeBarWidth + "px";
      display.sizer.style.borderRightWidth = scrollGap(cm) + "px";
      display.scrollbarsClipped = true;
    }
  }

  function selectionSnapshot(cm) {
    if (cm.hasFocus()) { return null }
    var active = activeElt();
    if (!active || !contains(cm.display.lineDiv, active)) { return null }
    var result = {activeElt: active};
    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.anchorNode && sel.extend && contains(cm.display.lineDiv, sel.anchorNode)) {
        result.anchorNode = sel.anchorNode;
        result.anchorOffset = sel.anchorOffset;
        result.focusNode = sel.focusNode;
        result.focusOffset = sel.focusOffset;
      }
    }
    return result
  }

  function restoreSelection(snapshot) {
    if (!snapshot || !snapshot.activeElt || snapshot.activeElt == activeElt()) { return }
    snapshot.activeElt.focus();
    if (!/^(INPUT|TEXTAREA)$/.test(snapshot.activeElt.nodeName) &&
        snapshot.anchorNode && contains(document.body, snapshot.anchorNode) && contains(document.body, snapshot.focusNode)) {
      var sel = window.getSelection(), range = document.createRange();
      range.setEnd(snapshot.anchorNode, snapshot.anchorOffset);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      sel.extend(snapshot.focusNode, snapshot.focusOffset);
    }
  }

  // Does the actual updating of the line display. Bails out
  // (returning false) when there is nothing to be done and forced is
  // false.
  function updateDisplayIfNeeded(cm, update) {
    var display = cm.display, doc = cm.doc;

    if (update.editorIsHidden) {
      resetView(cm);
      return false
    }

    // Bail out if the visible area is already rendered and nothing changed.
    if (!update.force &&
        update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo &&
        (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) &&
        display.renderedView == display.view && countDirtyView(cm) == 0)
      { return false }

    if (maybeUpdateLineNumberWidth(cm)) {
      resetView(cm);
      update.dims = getDimensions(cm);
    }

    // Compute a suitable new viewport (from & to)
    var end = doc.first + doc.size;
    var from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
    var to = Math.min(end, update.visible.to + cm.options.viewportMargin);
    if (display.viewFrom < from && from - display.viewFrom < 20) { from = Math.max(doc.first, display.viewFrom); }
    if (display.viewTo > to && display.viewTo - to < 20) { to = Math.min(end, display.viewTo); }
    if (sawCollapsedSpans) {
      from = visualLineNo(cm.doc, from);
      to = visualLineEndNo(cm.doc, to);
    }

    var different = from != display.viewFrom || to != display.viewTo ||
      display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
    adjustView(cm, from, to);

    display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
    // Position the mover div to align with the current scroll position
    cm.display.mover.style.top = display.viewOffset + "px";

    var toUpdate = countDirtyView(cm);
    if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view &&
        (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo))
      { return false }

    // For big changes, we hide the enclosing element during the
    // update, since that speeds up the operations on most browsers.
    var selSnapshot = selectionSnapshot(cm);
    if (toUpdate > 4) { display.lineDiv.style.display = "none"; }
    patchDisplay(cm, display.updateLineNumbers, update.dims);
    if (toUpdate > 4) { display.lineDiv.style.display = ""; }
    display.renderedView = display.view;
    // There might have been a widget with a focused element that got
    // hidden or updated, if so re-focus it.
    restoreSelection(selSnapshot);

    // Prevent selection and cursors from interfering with the scroll
    // width and height.
    removeChildren(display.cursorDiv);
    removeChildren(display.selectionDiv);
    display.gutters.style.height = display.sizer.style.minHeight = 0;

    if (different) {
      display.lastWrapHeight = update.wrapperHeight;
      display.lastWrapWidth = update.wrapperWidth;
      startWorker(cm, 400);
    }

    display.updateLineNumbers = null;

    return true
  }

  function postUpdateDisplay(cm, update) {
    var viewport = update.viewport;

    for (var first = true;; first = false) {
      if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == displayWidth(cm)) {
        // Clip forced viewport to actual scrollable area.
        if (viewport && viewport.top != null)
          { viewport = {top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top)}; }
        // Updated line heights might result in the drawn area not
        // actually covering the viewport. Keep looping until it does.
        update.visible = visibleLines(cm.display, cm.doc, viewport);
        if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo)
          { break }
      } else if (first) {
        update.visible = visibleLines(cm.display, cm.doc, viewport);
      }
      if (!updateDisplayIfNeeded(cm, update)) { break }
      updateHeightsInViewport(cm);
      var barMeasure = measureForScrollbars(cm);
      updateSelection(cm);
      updateScrollbars(cm, barMeasure);
      setDocumentHeight(cm, barMeasure);
      update.force = false;
    }

    update.signal(cm, "update", cm);
    if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
      update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
      cm.display.reportedViewFrom = cm.display.viewFrom; cm.display.reportedViewTo = cm.display.viewTo;
    }
  }

  function updateDisplaySimple(cm, viewport) {
    var update = new DisplayUpdate(cm, viewport);
    if (updateDisplayIfNeeded(cm, update)) {
      updateHeightsInViewport(cm);
      postUpdateDisplay(cm, update);
      var barMeasure = measureForScrollbars(cm);
      updateSelection(cm);
      updateScrollbars(cm, barMeasure);
      setDocumentHeight(cm, barMeasure);
      update.finish();
    }
  }

  // Sync the actual display DOM structure with display.view, removing
  // nodes for lines that are no longer in view, and creating the ones
  // that are not there yet, and updating the ones that are out of
  // date.
  function patchDisplay(cm, updateNumbersFrom, dims) {
    var display = cm.display, lineNumbers = cm.options.lineNumbers;
    var container = display.lineDiv, cur = container.firstChild;

    function rm(node) {
      var next = node.nextSibling;
      // Works around a throw-scroll bug in OS X Webkit
      if (webkit && mac && cm.display.currentWheelTarget == node)
        { node.style.display = "none"; }
      else
        { node.parentNode.removeChild(node); }
      return next
    }

    var view = display.view, lineN = display.viewFrom;
    // Loop over the elements in the view, syncing cur (the DOM nodes
    // in display.lineDiv) with the view as we go.
    for (var i = 0; i < view.length; i++) {
      var lineView = view[i];
      if (lineView.hidden) ; else if (!lineView.node || lineView.node.parentNode != container) { // Not drawn yet
        var node = buildLineElement(cm, lineView, lineN, dims);
        container.insertBefore(node, cur);
      } else { // Already drawn
        while (cur != lineView.node) { cur = rm(cur); }
        var updateNumber = lineNumbers && updateNumbersFrom != null &&
          updateNumbersFrom <= lineN && lineView.lineNumber;
        if (lineView.changes) {
          if (indexOf(lineView.changes, "gutter") > -1) { updateNumber = false; }
          updateLineForChanges(cm, lineView, lineN, dims);
        }
        if (updateNumber) {
          removeChildren(lineView.lineNumber);
          lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
        }
        cur = lineView.node.nextSibling;
      }
      lineN += lineView.size;
    }
    while (cur) { cur = rm(cur); }
  }

  function updateGutterSpace(display) {
    var width = display.gutters.offsetWidth;
    display.sizer.style.marginLeft = width + "px";
    // Send an event to consumers responding to changes in gutter width.
    signalLater(display, "gutterChanged", display);
  }

  function setDocumentHeight(cm, measure) {
    cm.display.sizer.style.minHeight = measure.docHeight + "px";
    cm.display.heightForcer.style.top = measure.docHeight + "px";
    cm.display.gutters.style.height = (measure.docHeight + cm.display.barHeight + scrollGap(cm)) + "px";
  }

  // Re-align line numbers and gutter marks to compensate for
  // horizontal scrolling.
  function alignHorizontally(cm) {
    var display = cm.display, view = display.view;
    if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) { return }
    var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
    var gutterW = display.gutters.offsetWidth, left = comp + "px";
    for (var i = 0; i < view.length; i++) { if (!view[i].hidden) {
      if (cm.options.fixedGutter) {
        if (view[i].gutter)
          { view[i].gutter.style.left = left; }
        if (view[i].gutterBackground)
          { view[i].gutterBackground.style.left = left; }
      }
      var align = view[i].alignable;
      if (align) { for (var j = 0; j < align.length; j++)
        { align[j].style.left = left; } }
    } }
    if (cm.options.fixedGutter)
      { display.gutters.style.left = (comp + gutterW) + "px"; }
  }

  // Used to ensure that the line number gutter is still the right
  // size for the current document size. Returns true when an update
  // is needed.
  function maybeUpdateLineNumberWidth(cm) {
    if (!cm.options.lineNumbers) { return false }
    var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
    if (last.length != display.lineNumChars) {
      var test = display.measure.appendChild(elt("div", [elt("div", last)],
                                                 "CodeMirror-linenumber CodeMirror-gutter-elt"));
      var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
      display.lineGutter.style.width = "";
      display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
      display.lineNumWidth = display.lineNumInnerWidth + padding;
      display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
      display.lineGutter.style.width = display.lineNumWidth + "px";
      updateGutterSpace(cm.display);
      return true
    }
    return false
  }

  function getGutters(gutters, lineNumbers) {
    var result = [], sawLineNumbers = false;
    for (var i = 0; i < gutters.length; i++) {
      var name = gutters[i], style = null;
      if (typeof name != "string") { style = name.style; name = name.className; }
      if (name == "CodeMirror-linenumbers") {
        if (!lineNumbers) { continue }
        else { sawLineNumbers = true; }
      }
      result.push({className: name, style: style});
    }
    if (lineNumbers && !sawLineNumbers) { result.push({className: "CodeMirror-linenumbers", style: null}); }
    return result
  }

  // Rebuild the gutter elements, ensure the margin to the left of the
  // code matches their width.
  function renderGutters(display) {
    var gutters = display.gutters, specs = display.gutterSpecs;
    removeChildren(gutters);
    display.lineGutter = null;
    for (var i = 0; i < specs.length; ++i) {
      var ref = specs[i];
      var className = ref.className;
      var style = ref.style;
      var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + className));
      if (style) { gElt.style.cssText = style; }
      if (className == "CodeMirror-linenumbers") {
        display.lineGutter = gElt;
        gElt.style.width = (display.lineNumWidth || 1) + "px";
      }
    }
    gutters.style.display = specs.length ? "" : "none";
    updateGutterSpace(display);
  }

  function updateGutters(cm) {
    renderGutters(cm.display);
    regChange(cm);
    alignHorizontally(cm);
  }

  // The display handles the DOM integration, both for input reading
  // and content drawing. It holds references to DOM nodes and
  // display-related state.

  function Display(place, doc, input, options) {
    var d = this;
    this.input = input;

    // Covers bottom-right square when both scroll