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

CodeMirror.defineMode("properties", function() {
  return {
    token: function(stream, state) {
      var sol = stream.sol() || state.afterSection;
      var eol = stream.eol();

      state.afterSection = false;

      if (sol) {
        if (state.nextMultiline) {
          state.inMultiline = true;
          state.nextMultiline = false;
        } else {
          state.position = "def";
        }
      }

      if (eol && ! state.nextMultiline) {
        state.inMultiline = false;
        state.position = "def";
      }

      if (sol) {
        while(stream.eatSpace()) {}
      }

      var ch = stream.next();

      if (sol && (ch === "#" || ch === "!" || ch === ";")) {
        state.position = "comment";
        stream.skipToEnd();
        return "comment";
      } else if (sol && ch === "[") {
        state.afterSection = true;
        stream.skipTo("]"); stream.eat("]");
        return "header";
      } else if (ch === "=" || ch === ":") {
        state.position = "quote";
        return null;
      } else if (ch === "\\" && state.position === "quote") {
        if (stream.eol()) {  // end of line?
          // Multiline value
          state.nextMultiline = true;
        }
      }

      return state.position;
    },

    startState: function() {
      return {
        position : "def",       // Current position, "def", "quote" or "comment"
        nextMultiline : false,  // Is the next line multiline value
        inMultiline : false,    // Is the current line a multiline value
        afterSection : false    // Did we just open a section
      };
    }

  };
});

CodeMirror.defineMIME("text/x-properties", "properties");
CodeMirror.defineMIME("text/x-ini", "properties");

});
                                                                                                                                                                                                                                                                                                                                                                                                    totype.onChange = function(change) {
    var startLine = change.from.line;
    var endLine = CodeMirror.changeEnd(change).line;
    var sizeChange = endLine - change.to.line;
    if (this.gap) {
      this.gap.from = Math.min(offsetLine(this.gap.from, startLine, sizeChange), change.from.line);
      this.gap.to = Math.max(offsetLine(this.gap.to, startLine, sizeChange), change.from.line);
    } else {
      this.gap = {from: change.from.line, to: endLine + 1};
    }

    if (sizeChange) for (var i = 0; i < this.matches.length; i++) {
      var match = this.matches[i];
      var newFrom = offsetLine(match.from.line, startLine, sizeChange);
      if (newFrom != match.from.line) match.from = CodeMirror.Pos(newFrom, match.from.ch);
      var newTo = offsetLine(match.to.line, startLine, sizeChange);
      if (newTo != match.to.line) match.to = CodeMirror.Pos(newTo, match.to.ch);
    }
    clearTimeout(this.update);
    var self = this;
    this.update = setTimeout(function() { self.updateAfterChange(); }, 250);
  };

  SearchAnnotation.prototype.updateAfterChange = function() {
    this.findMatches();
    this.annotation.update(this.matches);
  };

  SearchAnnotation.prototype.clear = function() {
    this.cm.off("change", this.changeHandler);
    this.annotation.clear();
  };
});
                                                                                                                                                                                                                                                ��t$0��$�  3��B�� �Ɓ��  [_^��]É|$0��$�  3��!�� �ǁ��  [_^��]�D  �     VWS���t$,�\$0���   ���   ���K  �|$4 �'  �D$���   �L$�H�L$3��T$�l$�F8����   ���   6��T$DT$���   t`�T$�C,=��T$�ȸ   ���   �,�    Dȸ   ��PU�T$�D�<��T$�������   3�P���   SPUjR��   ���t$8VUU��@  �����   ��tLj RSj Uj�t$,�D$�;  U�=��D$ �� �'��uE�t$8V��  �   P�T$RPRSS�h'���� ��uq�D$G��;|$4������l$3���[_^Ël$�   ��[_^Ã~8�������������t$8�t$8j��@  SSV�7�  ��8[_^Ël$�   ��[_^Ël$��[_^�D  VWS���|$, ��[_^Ã|$4 �I  �|$,�>  3ҋ\$,3ɋ|$@����t$43������t$�|$�$�|$( ��   �|$83��\$0�D$��L$؉T$�ƋL$@���D$<�ʍ�L$4F���;t$(rՋD$�L$�T$��L$D$;$r��$;\$,�B����|$@�D$8�L$4�t$0��    �Ӎ<��    �L$(��ƅ�~93��$3ҋ\$<�����F;�r�T$@�t$4�$C�<׍�;\$,r�������T$@C�t$4�<׍�;\$,r�������L$D$;$������V���3ۃ|$, �V�������fD  S��4�T$D�L$L�|$@ ��  �D$<�|$P ��  ����  �\$H3��D$�D$0�4$���\$�\$T�D$<�T$�|$���\$�\$0�t$�|$<��  �L$(�D$T�L$<�|$@�T$�\$0�|$����ǃ�t���  �   �X;��*  �|$,�|$<��+Ѓ���׋\$0�L$(��v$�L$(3��L$,��G;�r��|$���L$(��|$,�D�8��;�r��ٍB;D$<��   3��D$<+�u3��^��|��D$ ����D$$�D$H��|$�D$    �t$�L$(�<ǉ|$�|$$�D$ �L$�t$�D���;�r�L$(�t$��;��  �|$$�|$H��׋|$�׋|$$��G;�r��D$��F\$T�;t$@�������   F\$T;t$@�������   ����4[�3ۉ\$�4$�|$����  �ڃ�t����  �   �s;���  ��+�������v%3��t$�ǋt$P��G���;�r�t$�D$<�|$P�t$���t$Pڍ����<w� f�;\$r�t$�D$<�\$P��;���   �|$P��F���;�r�\$T�t$H�|$G�ى|$��;|$@�+����4$�|$������r�\$0�   �L$(3��%����D$0FD$T�D$0;t$@sȃ��y����؋D$T�|$@F�;�s����[������s��D$0FD$T�D$0;t$@s����<������|$<r�   3������L$(�D$T�L$<�|$@�T$뢋\$T�t$H�|$G�ى|$��;|$@�a����4$�|$�C���3������F\$T;t$@������4$�|$�!��� �    U����VWS���   �U �u�]��  ���   ��$�   ���   ������2  ���$  �}8 �@2  �}0������D$<����    ���T$d��$�   �t$8�U�u4�D$@    ЉT$H��    �u�Íލ<É|$ �ʋL$@�T$d�L$D�\$L�D$,�����   �E�T�������� �L$h����1  �\$H��    ��3ҋt$h����t$t�<L$L�ǉ\$l3ۍ<�3��     �t$l���4��fƍ4��(�fƍC�u(f�f�1T1�� ;T$tr��t$t�֋�����;t$hsC�L$H�<�    �߉D$p�|$L���<ǋE(��F����L��\$p;t$hr��u,��$�   �E(PP�U$��$�   ����$�    ��  ��$�   ����G  �]�D�3�������������m0  �\$$��    �����ىT$dى|$T�T$ �D$D�|$,�t$(�D$4    �������4���߉L$\��L$4Љt$0؉T$`�\$X�D$P�ыD$0�u(�     �    ��A���|$X��L��:�T�\�|$`�\$\�:�T$P;L$Tr��\$$�D	�t$(�T$d�H�;�vN�T$d��    �����ыL$ ���<\$,�M(�<����u(��D��L$D�L0��T$d���D$D�L$<�\$@CD$8L$LL$H�D$D�\$@;]8�Y����/  ��$�   �T$d�4�t$\3��u8�փ��+����N���������$�   ��$�   �|$`�ҋT$d�Z/  �|$\��$�   �߉t$L�u(��މ\$,���L$P���D$$����މ\$H��    +߉D$ ����ƉD$(�׉T$d�ƉD$0�4މt$4�ًu03����\$<��$�   �����|$8�<�    ���u4}�|$X�D$D�<�    ��}�|$T�D$@��$�   �],�}$�E(��$�   �D$�A��U�.  SV�E(PP�׃�����  SV�D$,PP�׃�����  SV�D$4PP�׃�����  SV�D$(PP�׃�����  SV�D$0PP�׃�����  SV�D$8PP�׃����~  SV�D$PPP�׃����i  SV�D$<PP�׉�$�   ����$�    �G  �T$@�D$T�M(�L$��$�   �t$U��9  �D$X�T$@�L$D��D$<T$8�D$X�T$@�L$D;�$�   ������t$L��$�   �L$P�T$d��$�   ��$�   ���D$`��$�   �]��$�   ��$�   ߋ}��$�   ��$�   ǉ�$�   ���r,  �u��ii����}(�t$\�Ɖ�$�   �����\$,��Ǎ։D$(�߉D$$�����4�ǉD$ �E0���������$�   �Y�A��|$�U�Y���c  �u,��$�   �E(PP�U$����t���   [_^��]��u,��$�   �D$4PP�U$����u��u,��$�   �D$0PP�U$����u��u,��$�   �D$,PP�U$����u��u,��$�   �D$(PP�U$����u��u,��$�   ��PP�U$�����o����u,��$�   �D$8PP�U$��$�   ����$�    �D����E4��$�   ���Ë](A�\$�Q�T$�U��[  ��*  �}(�t$\���D$,����ǉD$(���ǉD$$�ƍ����4�ǉD$ �E0�U������$�   A��|$��S  �u,��$�   �E(PP�U$����������u,��$�   �D$4PP�U$����������u,��$�   �D$0PP�U$�����j����u,��$�   �D$,PP�U$�����L����u,��$�   �D$(PP�U$�����.����u,��$�   ��PP�U$��$�   ����$�    �����E4��$�   ���Ë](A�\$�Q�T$�U�!M  �)  �}(�t$\���D$(�ƍ�����t$\�u0��ǉD$$�׉D$ ��    ����$�   A��U�|$��B  �u,��$�   �E(PP�U$�����k����u,��$�   �D$0PP�U$�����M����u,��$�   �D$,PP�U$�����/����u,��$�   �D$(PP�U$���������u,��$�   �D$dPP�U$��$�   ����$�    ������E4��$�   ���Ë](A�\$�Q�T$�U�"=  �(  �D$\�u(���<Ɖ|$H���֋U0����|$D�4�    ���$�   ��$�   �D$@�t$L���>  �E�<�u(��$�   ��������\$T�������ރ���\$X��    �|$0�<��\$,�4��\$L�����t$\��|$8�4ˉt$4�4I�< ��\$<��$�   ����  ���D$     ���t$`�D$$�L$d�T$(��$�   �|$P�L$ �t$<�T$8�D$4�\$L�}(��K��X�"�j�6�~���L��T��\��d� �l�(�t�0�|�8�|$T�C�K�P�X�b�j�v�~���L��T��\��d� �l�(�t�0�|�8�|$X�C �K(�P �X(�b �j(�v �~(���L��T��\��d� �l�(�t�0�|�8��|$\�C0�K8�P0�X8�b0�j8�v0�~8���L��T��\��d� �l�(�t�0�|�8���|$`����;L$P�����\$L�D$$�|$P�L$d�T$(��$�   ;|$0��  �4 �ލ|V��������t$8���&  ��3�����|$<�<�    �߉L$d�D$$���t$ ��L$L���L$4�M(�����|$T�<�|$0�<R�����|$P�����ǉD$X�T$(��$�   �֋\$ �L$,�|$4�����|$T�8�@�H �T f<fD(��:�T:(Ћ|$P�X0�d0�:�d:�h�|$0flf�f�4:|:�HfL�D$Xf�f�D�� �D$d�4F;\$<�T����D$$�L$d�T$(��$�   �t$<�����|$4�����|$0;t$8��   �D$$�<�    �����T$(�L$d��$�   �4�t$L���t$ �u(�����|$X�<�|$P�<R�����|$T�����ǉD$\�T$ �t$0�D$4�    �    �|$X�L$\�T� �8�\$P�|$T�L��l���l���\�0�d��L$<At$d��8�d���L$<;L$8r��D$$�L$d�T$(��$�   �4 �ލ|V��������t$0����#  ��3�����|$4�<�    �߉L$d�D$$���t$ �ϋ�L$L���L$8�M(���|$<�<R���ǉD$P�T$(�΋D$ �T$,��$�   @ �\$8���|$<���C(�L(�D9�L9�|$P�S8�\8�\$d�T9�\9�� �4^;D$4r��D$$�|$4�ˋT$(��$�   �����t$$����;|$0s�|$4�<�    �����L$d��$�   �ލ4ϋ��Rt$L�����t$ �u(����|$(|$4�L$ �t$$�T$(G�D�(�L�8�D�L��\$d;|$0r֋�$�   �u,��$�   �E(PP�U$���������u,��$�   �D$PPP�U$����������u,��$�   �D$LPP�U$����������u,��$�   �D$HPP�U$��$�   ����$�    �������$�   �U4���������    �Ã���|$(�6�M�4��}(�$�   ��\$P�׉L$,����ύ<��|$0�����4؉D$4�[��؉D$<�D$(�t$8��$�   � ����  �D$P���D$     �D$D�|$H�L$L�T$$�t$T�\$@�|$ �L$0�T$,�D$4�](�t$L���\����L��$��l��4��|��D$4� �H�P�X�` �h(�p0�x8�D$8�D��L��T��\��d��l��t��|�� �H�P�X�` �h(�p0�x8�D$H�D� �L�(�T� �\�(�d� �l�(�t� �|�(� �H�P�X�` �h(�p0�x8�D$<�D�0�L�8�\$D��T�0�\�8�d�0�l�8�t�0�|�8��\$4\$8\$H� �H�P�X�` �h(�p0�x8ÉD$<�D$4;|$@�i����D$4�t$T�\$@�T$$;��&  �D$(3��|$$� ���ۍTs����ʋT$P���L$ �M(��    ��ȋ������\$4�v�����t$TщD$0�L$,�D$$����@�t$,�D$$��L�t$T�4
�|
��\�t$0���L��$�l�T��\��d� �l�(�t�0�|�8|$P;D$ r��F  �U(�t$\�}0�����t$\�4�    ���$�   ��$�   �D$4���@  ��$�   ��](�E�<ˉ|$@����� ��|$<������Ɖ|$,�����������\$(�@��މ\$0��$�   ���l  �����D$$    �T$D�L$H�D$ ��$�   �|$8�T$$�\$0�D$,�L$(�}(��N��Y� �h�3�{���L��T��\��d� �l�(�t�0�|�8�|$@�F�N�Q�Y�`�h�s�{���L��T��\��d� �l�(�t�0�|�8�|$<�F �N(�Q �Y(�` �h(�s �{(���L��T��\��d� �l�(�t�0�|�8���|$D����;T$8������|$8�L$H�D$ ��$�   ;�}s�L$H��$�   �T$<�L$@�](D  �    ��N�V�^�f �n(�4����L����\��$��l���;|$H|���$�   �u,��$�   �E(PP�U$����������u,��$�   �D$<PP�U$����������u,��$�   �D$dPP�U$��$�   ����$�    ������}4��$�   �E�4�    ���������ڋU(����$�   �D$(�L$D�<���ΉT$0�����I�|$4�<֍Ή\$$�t$,��$�   ���f  �t$D�D$     ���|$8�\$H�t$<�D$@�|$ �L$ �M(�\$4�t$@�D$,���L����\��$��l�� �H�P�X�` �h(���L$0�D��L��t��|��T��\��1�y�A�I�Q �Y(�L$ �d� �l�(�t� �|�(�"�j�D� �L�(�r�z�d�0�l�8�T�0�\�8�t�0�|�8���\$<�B �J(\$,�\$0��Y�a�i�q �y(�;|$8������\$H�|$8;|$(��  �L$$�	���ڍDZ3ҋ�����D$D���t$ �u(�<�    ���3��L$(�ǋ������D$,��\$H�    ��B���\$(��L�\$H�$�l��\���L��T��\��d� �l�(t$D;T$ r���  �E(�T$\��$�   �|$h�4Љt$<����  �U�ǋ����2�U0�t$4}(�|$D�4�    ������Ѓ�����$�   �L�����������t$0�D$@�T$,����  ��$�   3��M�\$4���$�   ��    �����щT$Hk�����<2����|$8�։L$ �<����t$$�|$(���M(��|$8����F�L�8�|$(�l�D�8�|$$�L�T �\8�|$H�\(�$8�|$DD$ �d0�l;t$@r��u3ɋ|$0�D$4�����    �����$�   �։T$ k��������ǉT$(��T$ 3��؉|$$@ �    �}(C�D�d�D88�|$(�T1�\1�L9�|$D�lL$$�L8�T8 �\8(�d80�l88��@;\$@r���$�   �|$@�  ��$�   �\$4�Ë|$0�M�����T$@�ރ���T$H�9�$�   �����|$\�D$(�2Ǆ$�       �<�|$T�<[���D$X�L$ �9���|$d�<����D$P�9�D$L���    +�����։|$`��\$8��$�   �\$D�T$$�u(�|$T�L$(��|$X��
��$�   �����L@�W�\�T�\H�g�l�$�l@�w�|�|$P�t�|H����|$d���   ���   ��W�\���   ���   �g�l���   ���   �w�|�|$L���   ���   ����|$`��   ��@  ���W�\��  ��H  �g�l��   ��@  �w�|�|$8��  ��H  ����|$$���  ���  �D$\�W�\���  ���  �g�l���  ���  �|��$�   ���w���  ���  ��$�   ;L$H������t$(���ƋL$ �Ƌ�$�   ��$�   �D$H�P;T$@�o  �D$@+D$H�D$@����  �Ѓ���T$L�T$4������$�   �ً}�ۋt$0���D$H�T$T��$�   �������](�����$�   ��L$\��L$h����D$(    ȉt$X�4�D$(�|$$���L$P�t$8�T$ �t$8�T$X�L$\���$�   ���R�3�������\2�l2�|2��L@�T�\H�L$P�b�rD$T�$�l@�t�|H;|$L�v����|$(���D$(�T$ T$$�$�   ��$�   �T$L�����D$8;T$@�
  �M�t$0��$�   �\$4���1�ËL$L���ˋ�$�   ��T$H����L$(���������$�   �}(��D$T�D$h��ǉ�$�   ��\$Pt$ �L$$��$�   �\$(�t$8�T$L�    �    �|$TB�L�T�;�|$P�\��>�L>�\��@�$�   ;T$@r��T$L��$�   �D$L�t$ �L$$����$�   ��$�   �T$,�L$hɉL$h��    ;�}\��$�   ��$�   �L$,�\$D�t$4�}(��R�J�Z���8����L��\���;L$h|ȋ�$�   �u,��$�   �E(PP�U$����������u,��$�   �D$DPP�U$��$�   ����$�    ������E�u4���$�   �����<�    ��Ѓ�����L$D�\������ˉT$(��$�   ���|$0�L$4�T$,���~  �M���\$03���}(�|$8ˋ\$D�$�   �D$ �4�    �����\$$�E(�<1��΋�|$<��F���|$<�D0�:�|$8�L8�L
�T0�\8�T
�\
T$$;t$4r��M3ҋ\$0�|$D�D$ ����ˋ������$�   u(���t$<�49��ωt$8�\$$��E( ��F���|$8�D �:�|$<�L(�L
�T �\(�T
�\
T$$;t$4r��M3ҋ\$0�|$D�D$ ����ˋ�k���$�   u(���t$<�4��ωt$8�\$$��E(D  ��F���|$8�D�:�|$<�L�L
�T�\�T
�\
T$$;t$4r��]3ҋ|$0�D$ ��$�   ��$�   �;�����](�\$<�\$D�����ى\$8�E(�<��$�   �|$$���$�   �|$@ �    ��F���|$@��:�|$<�L�L
��\�T
�\
T$8;t$4r���$�   �\$8����\$$ӋD$ ��$�   � ;T$,��  �T$(�](��$�   �����ڍtA��������3���3҉L$ ��F����L��\���L��T��\�T$D;t$ r��E  ��$�   �D$T���	  �E�t$T�}0�������ƍ4�    �����$�   � �T$H�D$L�t$P�L$D����  �T �T$ ����������L$,���O  �E3��L$P��$�   �|$,�����D$H�Ћ����T$Xk��|$0�<�    �����$�   �������|$\�<�щ|$@�<���t$(�L$$�T�T$8�D�΋t$$�\$(�|$<�D$4�U(�|$@��|$8� �0��������D�LP��7�|$<�T�\X��'�,7�|$4�d �l`��7�<7�|$\�t(�|h�L$X��7�D0�Lp;\$0�b�����$�   �T$0�����D$(;T$,��   �E�t$P�L$H��$�   Ƌ�<�    �����։T$$k�����$�   �����|$X�<���|$@ЉT$8�<���t$4��|$<�\$$�T$(�t$0�M(�    �|$@F�\�\
(�;�|$8�D
�L;�|$<�L
�;�|$X�T
 �$;�d
0��@\$4;t$,r���$�   �D$ ������������  �u�T$P�L$X����L$\��$�   ��T$H�������$�   �4�    �t$,�މD$(���\$|�|$`�>�L$0����Ǆ$�       ��D$ ��\$x�R����|$4�<�|$8�<ى\$<�����|$t�<�|$@�<�|$pً|$,+����ϋ�$�   �T$$ǉD$l�D$0�|$.wrapper.ownerDocument, "mouseup", up);
  }

  // Used when mouse-selecting to adjust the anchor to the proper side
  // of a bidi jump depending on the visual position of the head.
  function bidiSimplify(cm, range) {
    var anchor = range.anchor;
    var head = range.head;
    var anchorLine = getLine(cm.doc, anchor.line);
    if (cmp(anchor, head) == 0 && anchor.sticky == head.sticky) { return range }
    var order = getOrder(anchorLine);
    if (!order) { return range }
    var index = getBidiPartAt(order, anchor.ch, anchor.sticky), part = order[index];
    if (part.from != anchor.ch && part.to != anchor.ch) { return range }
    var boundary = index + ((part.from == anchor.ch) == (part.level != 1) ? 0 : 1);
    if (boundary == 0 || boundary == order.length) { return range }

    // Compute the relative visual position of the head compared to the
    // anchor (<0 is to the left, >0 to the right)
    var leftSide;
    if (head.line != anchor.line) {
      leftSide = (head.line - anchor.line) * (cm.doc.direction == "ltr" ? 1 : -1) > 0;
    } else {
      var headIndex = getBidiPartAt(order, head.ch, head.sticky);
      var dir = headIndex - index || (head.ch - anchor.ch) * (part.level == 1 ? -1 : 1);
      if (headIndex == boundary - 1 || headIndex == boundary)
        { leftSide = dir < 0; }
      else
        { leftSide = dir > 0; }
    }

    var usePart = order[boundary + (leftSide ? -1 : 0)];
    var from = leftSide == (usePart.level == 1);
    var ch = from ? usePart.from : usePart.to, sticky = from ? "after" : "before";
    return anchor.ch == ch && anchor.sticky == sticky ? range : new Range(new Pos(anchor.line, ch, sticky), head)
  }


  // Determines whether an event happened in the gutter, and fires the
  // handlers for the corresponding event.
  function gutterEvent(cm, e, type, prevent) {
    var mX, mY;
    if (e.touches) {
      mX = e.touches[0].clientX;
      mY = e.touches[0].clientY;
    } else {
      try { mX = e.clientX; mY = e.clientY; }
      catch(e$1) { return false }
    }
    if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) { return false }
    if (prevent) { e_preventDefault(e); }

    var display = cm.display;
    var lineBox = display.lineDiv.getBoundingClientRect();

    if (mY > lineBox.bottom || !hasHandler(cm, type)) { return e_defaultPrevented(e) }
    mY -= lineBox.top - display.viewOffset;

    for (var i = 0; i < cm.display.gutterSpecs.length; ++i) {
      var g = display.gutters.childNodes[i];
      if (g && g.getBoundingClientRect().right >= mX) {
        var line = lineAtHeight(cm.doc, mY);
        var gutter = cm.display.gutterSpecs[i];
        signal(cm, type, cm, line, gutter.className, e);
        return e_defaultPrevented(e)
      }
    }
  }

  function clickInGutter(cm, e) {
    return gutterEvent(cm, e, "gutterClick", true)
  }

  // CONTEXT MENU HANDLING

  // To make the context menu work, we need to briefly unhide the
  // textarea (making it as unobtrusive as possible) to let the
  // right-click take effect on it.
  function onContextMenu(cm, e) {
    if (eventInWidget(cm.display, e) || contextMenuInGutter(cm, e)) { return }
    if (signalDOMEvent(cm, e, "contextmenu")) { return }
    if (!captureRightClick) { cm.display.input.onContextMenu(e); }
  }

  function contextMenuInGutter(cm, e) {
    if (!hasHandler(cm, "gutterContextMenu")) { return false }
    return gutterEvent(cm, e, "gutterContextMenu", false)
  }

  function themeChanged(cm) {
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +
      cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
    clearCaches(cm);
  }

  var Init = {toString: function(){return "CodeMirror.Init"}};

  var defaults = {};
  var optionHandlers = {};

  function defineOptions(CodeMirror) {
    var optionHandlers = CodeMirror.optionHandlers;

    function option(name, deflt, handle, notOnInit) {
      CodeMirror.defaults[name] = deflt;
      if (handle) { optionHandlers[name] =
        notOnInit ? function (cm, val, old) {if (old != Init) { handle(cm, val, old); }} : handle; }
    }

    CodeMirror.defineOption = option;

    // Passed to option handlers when there is no old value.
    CodeMirror.Init = Init;

    // These two are, on init, called from the constructor because they
    // have to be initialized before the editor can start at all.
    option("value", "", function (cm, val) { return cm.setValue(val); }, true);
    option("mode", null, function (cm, val) {
      cm.doc.modeOption = val;
      loadMode(cm);
    }, true);

    option("indentUnit", 2, loadMode, true);
    option("indentWithTabs", false);
    option("smartIndent", true);
    option("tabSize", 4, function (cm) {
      resetModeState(cm);
      clearCaches(cm);
      regChange(cm);
    }, true);

    option("lineSeparator", null, function (cm, val) {
      cm.doc.lineSep = val;
      if (!val) { return }
      var newBreaks = [], lineNo = cm.doc.first;
      cm.doc.iter(function (line) {
        for (var pos = 0;;) {
          var found = line.text.indexOf(val, pos);
          if (found == -1) { break }
          pos = found + val.length;
          newBreaks.push(Pos(lineNo, found));
        }
        lineNo++;
      });
      for (var i = newBreaks.length - 1; i >= 0; i--)
        { replaceRange(cm.doc, val, newBreaks[i], Pos(newBreaks[i].line, newBreaks[i].ch + val.length)); }
    });
    option("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function (cm, val, old) {
      cm.state.specialChars = new RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g");
      if (old != Init) { cm.refresh(); }
    });
    option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function (cm) { return cm.refresh(); }, true);
    option("electricChars", true);
    option("inputStyle", mobile ? "contenteditable" : "textarea", function () {
      throw new Error("inputStyle can not (yet) be changed in a running editor") // FIXME
    }, true);
    option("spellcheck", false, function (cm, val) { return cm.getInputField().spellcheck = val; }, true);
    option("autocorrect", false, function (cm, val) { return cm.getInputField().autocorrect = val; }, true);
    option("autocapitalize", false, function (cm, val) { return cm.getInputField().autocapitalize = val; }, true);
    option("rtlMoveVisually", !windows);
    option("wholeLineUpdateBefore", true);

    option("theme", "default", function (cm) {
      themeChanged(cm);
      updateGutters(cm);
    }, true);
    option("keyMap", "default", function (cm, val, old) {
      var next = getKeyMap(val);
      var prev = old != Init && getKeyMap(old);
      if (prev && prev.detach) { prev.detach(cm, next); }
      if (next.attach) { next.attach(cm, prev || null); }
    });
    option("extraKeys", null);
    option("configureMouse", null);

    option("lineWrapping", false, wrappingChanged, true);
    option("gutters", [], function (cm, val) {
      cm.display.gutterSpecs = getGutters(val, cm.options.lineNumbers);
      updateGutters(cm);
    }, true);
    option("fixedGutter", true, function (cm, val) {
      cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
      cm.refresh();
    }, true);
    option("coverGutterNextToScrollbar", false, function (cm) { return updateScrollbars(cm); }, true);
    option("scrollbarStyle", "native", function (cm) {
      initScrollbars(cm);
      updateScrollbars(cm);
      cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
      cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
    }, true);
    option("lineNumbers", false, function (cm, val) {
      cm.display.gutterSpecs = getGutters(cm.options.gutters, val);
      updateGutters(cm);
    }, true);
    option("firstLineNumber", 1, updateGutters, true);
    option("lineNumberFormatter", function (integer) { return integer; }, updateGutters, true);
    option("showCursorWhenSelecting", false, updateSelection, true);

    option("resetSelectionOnContextMenu", true);
    option("lineWiseCopyCut", true);
    option("pasteLinesPerSelection", true);
    option("selectionsMayTouch", false);

    option("readOnly", false, function (cm, val) {
      if (val == "nocursor") {
        onBlur(cm);
        cm.display.input.blur();
      }
      cm.display.input.readOnlyChanged(val);
    });

    option("screenReaderLabel", null, function (cm, val) {
      val = (val === '') ? null : val;
      cm.display.input.screenReaderLabelChanged(val);
    });

    option("disableInput", false, function (cm, val) {if (!val) { cm.display.input.reset(); }}, true);
    option("dragDrop", true, dragDropChanged);
    option("allowDropFileTypes", null);

    option("cursorBlinkRate", 530);
    option("cursorScrollMargin", 0);
    option("cursorHeight", 1, updateSelection, true);
    option("singleCursorHeightPerLine", true, updateSelection, true);
    option("workTime", 100);
    option("workDelay", 100);
    option("flattenSpans", true, resetModeState, true);
    option("addModeClass", false, resetModeState, true);
    option("pollInterval", 100);
    option("undoDepth", 200, function (cm, val) { return cm.doc.history.undoDepth = val; });
    option("historyEventDelay", 1250);
    option("viewportMargin", 10, function (cm) { return cm.refresh(); }, true);
    option("maxHighlightLength", 10000, resetModeState, true);
    option("moveInputWithCursor", true, function (cm, val) {
      if (!val) { cm.display.input.resetPosition(); }
    });

    option("tabindex", null, function (cm, val) { return cm.display.input.getField().tabIndex = val || ""; });
    option("autofocus", null);
    option("direction", "ltr", function (cm, val) { return cm.doc.setDirection(val); }, true);
    option("phrases", null);
  }

  function dragDropChanged(cm, value, old) {
    var wasOn = old && old != Init;
    if (!value != !wasOn) {
      var funcs = cm.display.dragFunctions;
      var toggle = value ? on : off;
      toggle(cm.display.scroller, "dragstart", funcs.start);
      toggle(cm.display.scroller, "dragenter", funcs.enter);
      toggle(cm.display.scroller, "dragover", funcs.over);
      toggle(cm.display.scroller, "dragleave", funcs.leave);
      toggle(cm.display.scroller, "drop", funcs.drop);
    }
  }

  function wrappingChanged(cm) {
    if (cm.options.lineWrapping) {
      addClass(cm.display.wrapper, "CodeMirror-wrap");
      cm.display.sizer.style.minWidth = "";
      cm.display.sizerWidth = null;
    } else {
      rmClass(cm.display.wrapper, "CodeMirror-wrap");
      findMaxLine(cm);
    }
    estimateLineHeights(cm);
    regChange(cm);
    clearCaches(cm);
    setTimeout(function () { return updateScrollbars(cm); }, 100);
  }

  // A CodeMirror instance represents an editor. This is the object
  // that user code is usually dealing with.

  function CodeMirror(place, options) {
    var this$1 = this;

    if (!(this instanceof CodeMirror)) { return new CodeMirror(place, options) }

    this.options = options = options ? copyObj(options) : {};
    // Determine effective options based on given values and defaults.
    copyObj(defaults, options, false);

    var doc = options.value;
    if (typeof doc == "string") { doc = new Doc(doc, options.mode, null, options.lineSeparator, options.direction); }
    else if (options.mode) { doc.modeOption = options.mode; }
    this.doc = doc;

    var input = new CodeMirror.inputStyles[options.inputStyle](this);
    var display = this.display = new Display(place, doc, input, options);
    display.wrapper.CodeMirror = this;
    themeChanged(this);
    if (options.lineWrapping)
      { this.display.wrapper.className += " CodeMirror-wrap"; }
    initScrollbars(this);

    this.state = {
      keyMaps: [],  // stores maps added by addKeyMap
      overlays: [], // highlighting overlays, as added by addOverlay
      modeGen: 0,   // bumped when mode/overlay changes, used to invalidate highlighting info
      overwrite: false,
      delayingBlurEvent: false,
      focused: false,
      suppressEdits: false, // used to disable editing during key handlers when in readOnly mode
      pasteIncoming: -1, cutIncoming: -1, // help recognize paste/cut edits in input.poll
      selectingText: false,
      draggingText: false,
      highlight: new Delayed(), // stores highlight worker timeout
      keySeq: null,  // Unfinished key sequence
      specialChars: null
    };

    if (options.autofocus && !mobile) { display.input.focus(); }

    // Override magic textarea content restore that IE sometimes does
    // on our hidden textarea on reload
    if (ie && ie_version < 11) { setTimeout(function () { return this$1.display.input.reset(true); }, 20); }

    registerEventHandlers(this);
    ensureGlobalHandlers();

    startOperation(this);
    this.curOp.forceUpdate = true;
    attachDoc(this, doc);

    if ((options.autofocus && !mobile) || this.hasFocus())
      { setTimeout(function () {
        if (this$1.hasFocus() && !this$1.state.focused) { onFocus(this$1); }
      }, 20); }
    else
      { onBlur(this); }

    for (var opt in optionHandlers) { if (optionHandlers.hasOwnProperty(opt))
      { optionHandlers[opt](this, options[opt], Init); } }
    maybeUpdateLineNumberWidth(this);
    if (options.finishInit) { options.finishInit(this); }
    for (var i = 0; i < initHooks.length; ++i) { initHooks[i](this); }
    endOperation(this);
    // Suppress optimizelegibility in Webkit, since it breaks text
    // measuring on line wrapping boundaries.
    if (webkit && options.lineWrapping &&
        getComputedStyle(display.lineDiv).textRendering == "optimizelegibility")
      { display.lineDiv.style.textRendering = "auto"; }
  }

  // The default configuration options.
  CodeMirror.defaults = defaults;
  // Functions to run when options are changed.
  CodeMirror.optionHandlers = optionHandlers;

  // Attach the necessary event handlers when initializing the editor
  function registerEventHandlers(cm) {
    var d = cm.display;
    on(d.scroller, "mousedown", operation(cm, onMouseDown));
    // Older IE's will not fire a second mousedown for a double click
    if (ie && ie_version < 11)
      { on(d.scroller, "dblclick", operation(cm, function (e) {
        if (signalDOMEvent(cm, e)) { return }
        var pos = posFromMouse(cm, e);
        if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) { return }
        e_preventDefault(e);
        var word = cm.findWordAt(pos);
        extendSelection(cm.doc, word.anchor, word.head);
      })); }
    else
      { on(d.scroller, "dblclick", function (e) { return signalDOMEvent(cm, e) || e_preventDefault(e); }); }
    // Some browsers fire contextmenu *after* opening the menu, at
    // which point we can't mess with it anymore. Context menu is
    // handled in onMouseDown for these browsers.
    on(d.scroller, "contextmenu", function (e) { return onContextMenu(cm, e); });
    on(d.input.getField(), "contextmenu", function (e) {
      if (!d.scroller.contains(e.target)) { onContextMenu(cm, e); }
    });

    // Used to suppress mouse event handling when a touch happens
    var touchFinished, prevTouch = {end: 0};
    function finishTouch() {
      if (d.activeTouch) {
        touchFinished = setTimeout(function () { return d.activeTouch = null; }, 1000);
        prevTouch = d.activeTouch;
        prevTouch.end = +new Date;
      }
    }
    function isMouseLikeTouchEvent(e) {
      if (e.touches.length != 1) { return false }
      var touch = e.touches[0];
      return touch.radiusX <= 1 && touch.radiusY <= 1
    }
    function farAway(touch, other) {
      if (other.left == null) { return true }
      var dx = other.left - touch.left, dy = other.top - touch.top;
      return dx * dx + dy * dy > 20 * 20
    }
    on(d.scroller, "touchstart", function (e) {
      if (!signalDOMEvent(cm, e) && !isMouseLikeTouchEvent(e) && !clickInGutter(cm, e)) {
        d.input.ensurePolled();
        clearTimeout(touchFinished);
        var now = +new Date;
        d.activeTouch = {start: now, moved: false,
                         prev: now - prevTouch.end <= 300 ? prevTouch : null};
        if (e.touches.length == 1) {
          d.activeTouch.left = e.touches[0].pageX;
          d.activeTouch.top = e.touches[0].pageY;
        }
      }
    });
    on(d.scroller, "touchmove", function () {
      if (d