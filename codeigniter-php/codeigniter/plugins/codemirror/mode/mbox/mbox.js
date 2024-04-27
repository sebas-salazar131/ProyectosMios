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

var rfc2822 = [
  "From", "Sender", "Reply-To", "To", "Cc", "Bcc", "Message-ID",
  "In-Reply-To", "References", "Resent-From", "Resent-Sender", "Resent-To",
  "Resent-Cc", "Resent-Bcc", "Resent-Message-ID", "Return-Path", "Received"
];
var rfc2822NoEmail = [
  "Date", "Subject", "Comments", "Keywords", "Resent-Date"
];

CodeMirror.registerHelper("hintWords", "mbox", rfc2822.concat(rfc2822NoEmail));

var whitespace = /^[ \t]/;
var separator = /^From /; // See RFC 4155
var rfc2822Header = new RegExp("^(" + rfc2822.join("|") + "): ");
var rfc2822HeaderNoEmail = new RegExp("^(" + rfc2822NoEmail.join("|") + "): ");
var header = /^[^:]+:/; // Optional fields defined in RFC 2822
var email = /^[^ ]+@[^ ]+/;
var untilEmail = /^.*?(?=[^ ]+?@[^ ]+)/;
var bracketedEmail = /^<.*?>/;
var untilBracketedEmail = /^.*?(?=<.*>)/;

function styleForHeader(header) {
  if (header === "Subject") return "header";
  return "string";
}

function readToken(stream, state) {
  if (stream.sol()) {
    // From last line
    state.inSeparator = false;
    if (state.inHeader && stream.match(whitespace)) {
      // Header folding
      return null;
    } else {
      state.inHeader = false;
      state.header = null;
    }

    if (stream.match(separator)) {
      state.inHeaders = true;
      state.inSeparator = true;
      return "atom";
    }

    var match;
    var emailPermitted = false;
    if ((match = stream.match(rfc2822HeaderNoEmail)) ||
        (emailPermitted = true) && (match = stream.match(rfc2822Header))) {
      state.inHeaders = true;
      state.inHeader = true;
      state.emailPermitted = emailPermitted;
      state.header = match[1];
      return "atom";
    }

    // Use vim's heuristics: recognize custom headers only if the line is in a
    // block of legitimate headers.
    if (state.inHeaders && (match = stream.match(header))) {
      state.inHeader = true;
      state.emailPermitted = true;
      state.header = match[1];
      return "atom";
    }

    state.inHeaders = false;
    stream.skipToEnd();
    return null;
  }

  if (state.inSeparator) {
    if (stream.match(email)) return "link";
    if (stream.match(untilEmail)) return "atom";
    stream.skipToEnd();
    return "atom";
  }

  if (state.inHeader) {
    var style = styleForHeader(state.header);

    if (state.emailPermitted) {
      if (stream.match(bracketedEmail)) return style + " link";
      if (stream.match(untilBracketedEmail)) return style;
    }
    stream.skipToEnd();
    return style;
  }

  stream.skipToEnd();
  return null;
};

CodeMirror.defineMode("mbox", function() {
  return {
    startState: function() {
      return {
        // Is in a mbox separator
        inSeparator: false,
        // Is in a mail header
        inHeader: false,
        // If bracketed email is permitted. Only applicable when inHeader
        emailPermitted: false,
        // Name of current header
        header: null,
        // Is in a region of mail headers
        inHeaders: false
      };
    },
    token: readToken,
    blankLine: function(state) {
      state.inHeaders = state.inSeparator = state.inHeader = false;
    }
  };
});

CodeMirror.defineMIME("application/mbox", "mbox");
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                              �$�   ��$�   �D$PPP��$�   ��$�   ��$�   �D$XPP��$�   ��$�   ��$�   �D$tPP��$  ��$  ��$  SS��$  ��$  ��$  VV��$,  ����p�ߍ�$�   �\$��$|  �|$�Q�T$�U�A���T  ��5  ��$|  �4�   ��T[�t$$�\�
��$�   ������ǍU�D$(������ǉL$ ��$�   �A��t$�|$�A��L  ��$�   ��$�   ��PP��$�   ��$�   ��$�   �D$<PP��$�   ��$�   ��$�   �D$PPP��$�   ��$�   ��$�   �D$XPP��$�   ��$�   ��$�   �D$tPP��$  ��$  ��$  SS��$  ����`��$�   ��$�   �\$�|$�Q�T$�U�A��H  �4  ��$|  ��   Ѝt[�T$D��$�   �����<����Ћ�$�   �L$@�|$<��$�   ��$�   ����  ���������$�   ����U��$�   ������Љ|$4�R�T$\�ЉT$8�W�����T:���T$L���	  ��$|  3҉D$H�T$`�T$ �ߋ�$�   ���D$P����ǉ|$T��$�   �t$$�<�|$0�<D$8�D$X�ڋD$ �T$`�|$,�L$(D  �     �T$`�|$0�L$,�T$X��$|  ��;������D0��L0��T0�t$P��l��\;��d�T$`B\$T��\0��d0 ��l0(�� ;T$Lr���$|  ��$�   �����[׍ǋ�$�   �����\$X���ۉT$T�����\$`�|$l�<�\$8�D$     �t$$���T$d�>�T$t�T$ �L$(�D$h�9�D$p�;�D$x�؉|$0@ �    �D$ �|$p�L$t�D$x�t$T��D;��L��T��D2(��L20��T28�t$X��l��\;��d�D$ @\$h��\28��d2@��l2H�� ;D$Lr��D$H�t$$�L$(��$�   �|$L��2  �����$|  �T$(�T$0�|$L����|$|3��|$,�|$$�|$ �|
 ��$�   �L2 �t$8��$�   �D$H��$�   �T2 ��$�   �T$ �\$$�t$(�L$, ��$�   ���D$h�������$�   ��D2H��L2h�������$�   ��T2P��\2p�\$l��'��,��d2X��l2x��@;L$|r��D$H��$�   �T$|��L$h����;T$Lsd�����D$H��$�   �$|  �D$|�\$p�|$t@��D ��DH��L9 �|$x��LP��T9 ��TX�� L$h;D$LrƋD$H��$�   �|$L�N1  �T$0����$�   ���$|  �|$(��D$$��$�   �|$\���T$`���|$\�<������|$,�<�    +����t$L׃��щt$83��T$`3��t$ ��$�   �L$$�\$h��$|  �t$P�<�L$ �������D$l��
��L
 ��W��\��T��\0�t$T��g��l��d ��l@�t$X��w��|��t0��|P��G ��L �|$(��D@��L`�|$\�������T
@��\
`�T$P��g��l��d
P��l
p�T$T��w��|��t
`���
�   ��G��L��Dp����   ��W ��\ �|$(����   ����   �|$,���$|  ��'��,����   ����   �D$P��w��|����   ����   ��G��L���
�   ���
�   ��W��\����   ����   �t$(��g f���l ����   ����   �|$l�t$`� ��$|  ��6��<����   ����   ��F��L����   ����   ��V��\�D$X���
�   ���
   ��f��l����   ���  ��| �\$(�D$l�T$ ����v D$d���   ���   �T$ ;T$8�f�����T$h�֋D$0�$�   ��$�   T$8�J;L$L�m  �T$L+T$8�T$L����-  ��$�   ����D$\�������t$l���T$8��������$�   ���|$(�D$0    �>�L$$��$|  �t$,��$�   �<�|$ �|$P�t$ ��|$h�|$T��|$d�|$X��|$`�������L$$�T$0�|$p�ڃ����|$h������\��Q����L ��T��\0�|$d��a��l��d ��l@�|$`��q��|��t0��|P�|$p��A ��L L$l��D@��L`;T$\�j����T$0�D$0�T$(�t$,�$�   ƋL$\����;L$L��   ��$�   ���������ȉt$ ��$�   �t$8��������L$(��$�   ���$|  �|$$t$Pt$T�<1�|$,������t$X�D$H��$�   �ϋt$$�\$ �D$\D  �|$,@��3��L3��:�|$P��T3��\3��L:�|$T��d3 ��d
@��T: �|$X\$H��\:0�� ;D$Lr��D$\�D$H�D$\�L$(��$�   ы�$�   �$�   ;T$4�2  +T$4��$�   ����*  �����$|  �L$4��$�   �   �4ʉt$P��*  ��t��   ��*  �ރ� ���V;�$�   ��*  ��$�   ��+փ���׉T$(��$�   �t$$��$|  ��    �L$ �ٍ4��t$8�4���߉t$T�t$4�����׉L$0��L$,�[�<׍��t$$�T$L����   3ɉD$H3҉�$�   �\$T�D$PD  �    �|$8�����L���ϋ|$0��T���\���L��|$,��d� ��d�@��T� �|$L�$�   ��\�0A;�r��D$H��$�   ��$�   �D$H�T$ �\$8�L$,��$�   �Ƌ|$T���� �<P�������|P��m���$���7��h���|$0��|��E���L��|P��P����d��,�|P��]���t� ����@���|$L��T��m���d�0��h ��| �DP ��0���D$P��E���L�@��;t$(�&����D$H��$�   �L$(��$�   ��;�$�   ��   �L$4��$|  ��$�   �<Ή|$ ������<ω|$$�<ލ<ω|$,������<ω|$0�<[�\$ �4��4΋L$(�     �|$,��L���T���L��|$0�����\���T� �|$$��d� �����\�0��d�@A�$�   ;�$�   r���$�   ��$�   ��$�   ��$�  PP��w��$�   ��$�   ��$�   �D$\PP��$�   ��$�   ��$�   �D$hPP��$�   ��$�   ��$�   �D$tPP��$�   ��$�   ��$�   ��$�   PP��$  ����P�U��$�   �T$D������у���L$@�T$(�z�����L���L$0���&  ��$|  ����3���|$$�<ډ|$,������|$8�<[�|$ ���T$4�T$D������$�   ���ډD$<��$�   ���$�   ׋|$$��@ �    ��A����$|  ��D�t$,��dX����L(�t$8��L��d ��T8�t$4��T��\H��\D$<;L$0r���$�   ����$|  3�����|$$������|$8�|$ ���T$4�T$D������$�   ���ډD$<���׋|$$�    �    ��A����$|  ��D�t$,��dP����L �t$8��L��d ��T0�t$4��T��\@��\D$<;L$0r���$�   ����$|  3�����|$$������|$8�|$ ���|$D�����T$4���ډD$<Ћ�$�   �<���׋|$$D  �    ��A����$|  ��D�t$,��dH����L�t$8��L��d ��T(�t$4��T��\8��\D$<;L$0r���$�   ����$|  3�����|$8������|$4�|$ ��$�   ���T$<�T$D��������ى|$$�D  ��A����$|  ��7�|$,����L7�|$4��L��T7 �|$<��T��\70�|$8��\��d7@��d �;L$0r��ы|$$��$�   �ʋ�$�   ��$�   ��$�   �T$(;T$@��#  �L$D3ҋD$()D$@�<�    �߉�$�   �<ϋ�$|  �$�   �|$ �<��|$,�<ٍ<ǉ|$$������<ǉ|$0�<[���<�ˋڍ<Ǎ��D$  �t$,��\�0��d�@��ދt$$�����\���L��t$0��L���d� ��T� C��T�T$D;\$@r���$�   ��"  ��$|  ��   ��$�   ����t[�D$<ы�$�   �<�$�   �|$8�D$l����	  �ȋ��������$�   ����U�T$p����ȍ4Љ|$4�R�T$,�ЉT$X�W�����T:���T$D����  ��$|  3҉D$@�T$\�T$ �ߋ|$p���D$H����ǉ|$L��$�   �L$0�<�|$(�<D$X�D$P�ڋD$ �T$\�|$$�t$T�    �    �T$\�|$(�L$$�T$P��$|  ��;������D0��L0��T0�t$H��l��\;��d�T$\B\$L��\0��d0 ��l0(�� ;T$Dr���$|  ��$�   �����[׍<߉|$P�|$p�����T$L���ډT$\�L$03��t$TӉD$h�D$$ʉD$ �\$d��T$X�T$(�|$`�L$0�t$T�\$ �D$$�T$h�    �T$h�|$T�L$0�T$X�t$L��D;��L��T��D0(��L00��T08�t$P��l��\;��d�T$hB\$d��\08��d0@��l0H�� ;T$Dr��D$@�T$(��$�   �|$D��!  ��$�   3��T$(�|$D�����T$,���L$$�L$\�։T$,�T$p�|$T�D$ ��$�   �<������|$0�<�    +����ΉL$\�T$$�\$d��$|  �|$H�4�T$ �������D$X����L ��V��\�L$L��T��\0��f��l��d ��l@��v��|�t$,�|$PƋ�$|  ��t0��|P�� ����D@��L`�t$H��P��\��TP��\p��`��l��d`����   ��p��|��tp����   �|$X�D$0ǋ�$|  ��� ������   ����   ��P��\����   ����   ��`��l����   ����   �L$P��p��|����   ����   �D$X�L$\�D$`��������   ����   ���Q��\����   ����   �t$L��a��l����   ���   ��|�\$P��q����   ���  �T$ ���T$ ;T$T������D$d�D$ �T$(�$�   ��$�   T$T�J;L$D�%  �T$D+T$T�T$D����  �L$p����D$X�������L$h�ȋT$T��������$�   ���D$0    �t$(�<1�|$$��$|  �L$,��$�   �L$$��|$ �|$H�t$ ��|$d�|$L�T$P�T$\�|$`�T$0�ڃ����|$d������\��Q����L ��T��\0�|$`��a��l��d ��l@�|$\��q��|L$h��t0��|P;T$Xr��T$0�D$0�t$(�L$,΋�$�   ��L$X����;L$D��   �D$p�����������$�   ��t$T�L$ ��������$�   ��|$$��$|  t$Pt$Ht$L��L$(�D$@��$�   �|$,�L$P�t$$�\$ �D$XD  �    �|$,@��3��L3��:�|$H��T3��\3��L:�|$L\$@��\
0��T: �� ;D$Dr��D$X�D$@�D$X�L$(��$�   ы�$�   T$l;T$4��  +T$4�T$l���L  ��$|  �[�|$4�|$l�   �4ʍ��T$,�3  �r��t��   �  �ރ� ���V;T$l��  �|$l��+֋L$p���ډt$$׉T$(��    �t$4��$|  �T$ �ڍ<�|$H�<ٍ<��|$0������L$p�4��t$D�t$$�<���|$L��vn3ɉD$@3҉�$�   �ǋ\$H@ �    �|$0��L���T���L��|$D�����\���T� �|$,���T$p��\�0A;�r��D$@��$�   �T$p��$�   �։D$@�\$ �L$0�|$L���� �<X�����|$H����m���$��|X��h��7��|���|X��E���L�����P��,�|$D��d��]���t� ��@��T�DX�����D$,�|$p��m�����d�0��;t$(�M����D$@��$�   �L$(�T$p��;L$l��   �L$4��$|  ��$�   �<Ή|$$�<ލ<ω|$,������<ω|$ �<[�\$ �4��4΋L$( �|$$�����L���ϋ|$,��T���\���L���T� ��\�0AT$p;L$lr���$�   ��$�   ��$�   ��$�  PP��w��$�   ��$�   ��$�   �D$TPP��$�   ��$�   ��$�   ��$�   PP��$�   ��$�   ��$�   �D$pPP��$�   ����@�U��$�   �T$D������у���L$@�T$,�z�����L���L$4����  ��$|  ����3�щT$(�<ى|$0�<[�T$D���L$8�����|$ ����$�   �ډL$<��$�   �׉T$$�|$(�ȋT$$��$�   �     �    ��@����$|  ��D�t$0��T8����L(�t$8��L��T��\H��\L$<;D$4r�3ɋ�$|  ��$�   �����T$ ��|$(�<։|$$�|$D������$�   ���߉D$8���D$$��f�     ��C����$|  ��D�t$0��\@��9��L �t$(��L9��\9��T0��T9L$8;\$4r���$|  3���$�   �����t$DϋT$ �L$8�׋����L$(���ى|$$ϋ�$�   �Ѝ4��|$$��    ��@����$|  ��D�t$0��
��L�t$8��L
��T(�t$(��T
��\8��\
�;D$4r���$�   �ˋ�$|  3���ȉL$(�L$D���T$ �Ћ�����T$8��$�   �D$$Ћ��    �    ��G����$|  ���t$0����L�t$(��L��T �t$8��T��\0��\�;|$4r��ϋD$$��$�   �ы�$�   ��$�   ��$�   �T$,;T$@�=  �L$D3ҋD$,)D$@�<�    �߉�$�   �<ϋ�$|  �$�   �|$ �<��|$$�<ٍ<ǉ|$(���[����ًڍ��<ǋD$ �     �    �t$$��T� ��\�0��ދt$(�����T���L�C��L���\�T$D;\$@r���$�   �  ��$�   ��   ����$|  �ʋ�$�   �D$<��$�   ����  �������}�$�   ����|$\��    �L$8���L$H�ύ<��΍4��t$D�x�����t���t$L����  ��$|  3��T$X�t$T�t$ �ߋ|$\���T$P����׉|$,�|$H�D$4��$�   ��|$(�<T$D�T$0�ދD$ �T$T�|$$�L$@D  �T$T�|$(�L$$�T$0��$|  ��;������D0��L0��T0�t$P��l��\;��d�T$TB\$,��\0��d0 ��l0(�� ;T$Lr���$�   ����3��$|  �|$(�|$\������׉|$T��$�   �L$@T$H�T$D�T$,׉t$0�T$ �t$$�L$@�ދD$$�t$ �T$(�L$0�    �|$HA��3��d3��D;�|$@��l3��D(��L;�|$D��L0��l ��T;��$|  \$T��T8��8�|$P��d8�� ;L$Lr��L$0�L$T�L$0��$�   t$,�T$X�D$4��$�   ��$�   ;��L  +Ѓ���  �����$|  �4��t$ ����  ��t��   ��  �ރ� ���N;���  ��+΃���ʉL$,��$|  �<��|$(�<ٍǉL$$�L$\�<�    �ߍ<��$�   �|$0��v[3ɉT$X�D$4��$�   �ǋ\$(�ы|$$��L������L��|$ ��T������T� AT$\;�r͋T$X�D$4��$�   �L$\��$�   �ΉT$X�D$4�\$8�|$0�D$\���������<�����|$(��m���$��z���j��|��7���|$$��E���L��z���R�D$ ��d����,�T$\��]�����t� ��;t$,�h����T$X�D$4��$�   �L$\�t$,�ΉL$(;���   ��$|  �T$X��$�   �<ٍ4��t$ �4ǋ�����t$$�t$\�T$$�\$ �ǋ|$,��    �؍��t$(�$�   �����L���T������L���T� Gt$\;|$XrӋ�$�   ��$�   ��$�   ��$�  PP��w��$�   ��$�   ��$�   �D$TPP��$�   ��$�   ��$�   ��$�   PP��$�   ����0��$�   ������σ���E�D$4�L$0��    ���D$8�A�����D���D$@����  ��$�   ��$|  �|$(������ދt$4�����L$<���ىD$Dȋ�$�   �|$$�<v�T$,3҉T$H�4��|$8�T$ �t$L�ȋT$ �|$H��$�   D  �    �|$H���D$<��$|  �\$L��L8(�D$$��D>����T88��L��T�\$<��\>��l80��d; �|$HG��
��d
��l
T$D;|$@r��|$4�������؋�$�   �ˉt$TƋ�$�   ���$|  �L$L��3�ȉT$P�T$ �D$$ƉD$D�L$H�D$ �\$P�    �\$P����$|  �L$<�T$L�t$H��D��L��T(��0��L0��T0�t$D����d��l �\$PC��0��d0��l0D$T;\$@r��\$P�L$T�L$P��$�   D$$���$�   �|$(�T$,��$�   ��$�   ;|$0�  +|$0��������L$<���1  ��$�   �\$4�|$(�|$8��$�   ��    �؋�$�   ��$|  �D$L    �T$,�4+���Ë�$�   �D$@�D$0�t$$�<ٍ4��t$ �4ǋ�����t$D�ǉL$H�L$L��@ �L$L���|$ �T$D�D$H�t$@����L
��T ��3��L3��T3�t$$��\��d
��l(�L$LA��3��d3��l3\$8;L$<r���$�   �L	�|$(�T$,��$�   �L$ �L$ �I��L$$;���  ��$�   �t$4��$�   �T$$��    �ٍ<�$|  ǋ|$0|$ ������D�����L�����L��T���T��$�   �v  ��$�   ��   �$|  �D$8����  ������ʃ���E�D$d�L$0��$�   �q�����t�����~  ��$|  �T$`�T$d�D$<�<ى|$@�����ʋ��؉D$,���L$L�|$P�8��$�   �t$D3��t$\�t$$�<���|$T�����R��Љt$ ��T$4��D$H��$�   �|$X�\$ �D$$�T$\�L$(��T$\�|$T�L$X�T$H��$|  ��;������D0��L0��T0�t$@��l��\;��d�T$\B\$P��\0��d0 ��l0(�� ;T$Dr��t$D�T$`�D$<�L$(��$�   ����  �t$D����t$H3���$�   �L$(�T$`�T$,�<�L$4���ΉL$4�L$d�|$ ��$�   �<������|$$�<�    +����։T$,���|$ �\$P�D$T���7��$|  ��������L ��R��\�T$@�|$4��T��\0���'��,��d@��l`��w��|�|$$��tP��|p���������   ����   ��W��\�|$,����   ����   �t$L��'��,����   ����   ��w��|����   ����   �D$T��;D$H����������L$(�$�   �T$`�t$D��$�   �9�L$H�y;���  +t$H����
  �|$d�ǋ�������L$L�����ى|$4ȋ|$H���$�   �L$(�D$<�|$$�9�L$H���D$ ��$|  �D$,    �t$D��$�   �<L$@�D$<�ߋt$ �|$,�T$`�׃���������\��Vt$4����L ��T��\0;|$LrÉ|$,�D$,�L$(L$$�T$`��t$D��$�   �|$L�����L$4;���   �|$d���L$L������ǉL$ �L$H�$�   ���ǉ|$<��$�   ���D$,L$@ǋ�$|  �D$(�T$`�t$D��D$$��$�   �D$@�T$$�L$(�\$ �t$4�|$L��G��L����L�� \$<;|$Dr܉|$L�D$<�D$L��$�   L$,�T$`���$�   ;T$0��  +T$0����  ��$|  �|isplaySimple(cm, {top: val}); }
    setScrollTop(cm, val, true);
    if (gecko) { updateDisplaySimple(cm); }
    startWorker(cm, 100);
  }

  function setScrollTop(cm, val, forceScroll) {
    val = Math.max(0, Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight, val));
    if (cm.display.scroller.scrollTop == val && !forceScroll) { return }
    cm.doc.scrollTop = val;
    cm.display.scrollbars.setScrollTop(val);
    if (cm.display.scroller.scrollTop != val) { cm.display.scroller.scrollTop = val; }
  }

  // Sync scroller and scrollbar, ensure the gutter elements are
  // aligned.
  function setScrollLeft(cm, val, isScroller, forceScroll) {
    val = Math.max(0, Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth));
    if ((isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) && !forceScroll) { return }
    cm.doc.scrollLeft = val;
    alignHorizontally(cm);
    if (cm.display.scroller.scrollLeft != val) { cm.display.scroller.scrollLeft = val; }
    cm.display.scrollbars.setScrollLeft(val);
  }

  // SCROLLBARS

  // Prepare DOM reads needed to update the scrollbars. Done in one
  // shot to minimize update/measure roundtrips.
  function measureForScrollbars(cm) {
    var d = cm.display, gutterW = d.gutters.offsetWidth;
    var docH = Math.round(cm.doc.height + paddingVert(cm.display));
    return {
      clientHeight: d.scroller.clientHeight,
      viewHeight: d.wrapper.clientHeight,
      scrollWidth: d.scroller.scrollWidth, clientWidth: d.scroller.clientWidth,
      viewWidth: d.wrapper.clientWidth,
      barLeft: cm.options.fixedGutter ? gutterW : 0,
      docHeight: docH,
      scrollHeight: docH + scrollGap(cm) + d.barHeight,
      nativeBarWidth: d.nativeBarWidth,
      gutterWidth: gutterW
    }
  }

  var NativeScrollbars = function(place, scroll, cm) {
    this.cm = cm;
    var vert = this.vert = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
    var horiz = this.horiz = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
    vert.tabIndex = horiz.tabIndex = -1;
    place(vert); place(horiz);

    on(vert, "scroll", function () {
      if (vert.clientHeight) { scroll(vert.scrollTop, "vertical"); }
    });
    on(horiz, "scroll", function () {
      if (horiz.clientWidth) { scroll(horiz.scrollLeft, "horizontal"); }
    });

    this.checkedZeroWidth = false;
    // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
    if (ie && ie_version < 8) { this.horiz.style.minHeight = this.vert.style.minWidth = "18px"; }
  };

  NativeScrollbars.prototype.update = function (measure) {
    var needsH = measure.scrollWidth > measure.clientWidth + 1;
    var needsV = measure.scrollHeight > measure.clientHeight + 1;
    var sWidth = measure.nativeBarWidth;

    if (needsV) {
      this.vert.style.display = "block";
      this.vert.style.bottom = needsH ? sWidth + "px" : "0";
      var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
      // A bug in IE8 can cause this value to be negative, so guard it.
      this.vert.firstChild.style.height =
        Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
    } else {
      this.vert.scrollTop = 0;
      this.vert.style.display = "";
      this.vert.firstChild.style.height = "0";
    }

    if (needsH) {
      this.horiz.style.display = "block";
      this.horiz.style.right = needsV ? sWidth + "px" : "0";
      this.horiz.style.left = measure.barLeft + "px";
      var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
      this.horiz.firstChild.style.width =
        Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
    } else {
      this.horiz.style.display = "";
      this.horiz.firstChild.style.width = "0";
    }

    if (!this.checkedZeroWidth && measure.clientHeight > 0) {
      if (sWidth == 0) { this.zeroWidthHack(); }
      this.checkedZeroWidth = true;
    }

    return {right: needsV ? sWidth : 0, bottom: needsH ? sWidth : 0}
  };

  NativeScrollbars.prototype.setScrollLeft = function (pos) {
    if (this.horiz.scrollLeft != pos) { this.horiz.scrollLeft = pos; }
    if (this.disableHoriz) { this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz"); }
  };

  NativeScrollbars.prototype.setScrollTop = function (pos) {
    if (this.vert.scrollTop != pos) { this.vert.scrollTop = pos; }
    if (this.disableVert) { this.enableZeroWidthBar(this.vert, this.disableVert, "vert"); }
  };

  NativeScrollbars.prototype.zeroWidthHack = function () {
    var w = mac && !mac_geMountainLion ? "12px" : "18px";
    this.horiz.style.height = this.vert.style.width = w;
    this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
    this.disableHoriz = new Delayed;
    this.disableVert = new Delayed;
  };

  NativeScrollbars.prototype.enableZeroWidthBar = function (bar, delay, type) {
    bar.style.pointerEvents = "auto";
    function maybeDisable() {
      // To find out whether the scrollbar is still visible, we
      // check whether the element under the pixel in the bottom
      // right corner of the scrollbar box is the scrollbar box
      // itself (when the bar is still visible) or its filler child
      // (when the bar is hidden). If it is still visible, we keep
      // it enabled, if it's hidden, we disable pointer events.
      var box = bar.getBoundingClientRect();
      var elt = type == "vert" ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2)
          : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1);
      if (elt != bar) { bar.style.pointerEvents = "none"; }
      else { delay.set(1000, maybeDisable); }
    }
    delay.set(1000, maybeDisable);
  };

  NativeScrollbars.prototype.clear = function () {
    var parent = this.horiz.parentNode;
    parent.removeChild(this.horiz);
    parent.removeChild(this.vert);
  };

  var NullScrollbars = function () {};

  NullScrollbars.prototype.update = function () { return {bottom: 0, right: 0} };
  NullScrollbars.prototype.setScrollLeft = function () {};
  NullScrollbars.prototype.setScrollTop = function () {};
  NullScrollbars.prototype.clear = function () {};

  function updateScrollbars(cm, measure) {
    if (!measure) { measure = measureForScrollbars(cm); }
    var startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
    updateScrollbarsInner(cm, measure);
    for (var i = 0; i < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i++) {
      if (startWidth != cm.display.barWidth && cm.options.lineWrapping)
        { updateHeightsInViewport(cm); }
      updateScrollbarsInner(cm, measureForScrollbars(cm));
      startWidth = cm.display.barWidth; startHeight = cm.display.barHeight;
    }
  }

  // Re-synchronize the fake scrollbars with the actual size of the
  // content.
  function updateScrollbarsInner(cm, measure) {
    var d = cm.display;
    var sizes = d.scrollbars.update(measure);

    d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px";
    d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px";
    d.heightForcer.style.borderBottom = sizes.bottom + "px solid transparent";

    if (sizes.right && sizes.bottom) {
      d.scrollbarFiller.style.display = "block";
      d.scrollbarFiller.style.height = sizes.bottom + "px";
      d.scrollbarFiller.style.width = sizes.right + "px";
    } else { d.scrollbarFiller.style.display = ""; }
    if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
      d.gutterFiller.style.display = "block";
      d.gutterFiller.style.height = sizes.bottom + "px";
      d.gutterFiller.style.width = measure.gutterWidth + "px";
    } else { d.gutterFiller.style.display = ""; }
  }

  var scrollbarModel = {"native": NativeScrollbars, "null": NullScrollbars};

  function initScrollbars(cm) {
    if (cm.display.scrollbars) {
      cm.display.scrollbars.clear();
      if (cm.display.scrollbars.addClass)
        { rmClass(cm.display.wrapper, cm.display.scrollbars.addClass); }
    }

    cm.display.scrollbars = new scrollbarModel[cm.options.scrollbarStyle](function (node) {
      cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
      // Prevent clicks in the scrollbars from killing focus
      on(node, "mousedown", function () {
        if (cm.state.focused) { setTimeout(function () { return cm.display.input.focus(); }, 0); }
      });
      node.setAttribute("cm-not-content", "true");
    }, function (pos, axis) {
      if (axis == "horizontal") { setScrollLeft(cm, pos); }
      else { updateScrollTop(cm, pos); }
    }, cm);
    if (cm.display.scrollbars.addClass)
      { addClass(cm.display.wrapper, cm.display.scrollbars.addClass); }
  }

  // Operations are used to wrap a series of changes to the editor
  // state in such a way that each change won't have to update the
  // cursor and display (which would be awkward, slow, and
  // error-prone). Instead, display updates are batched and then all
  // combined and executed at once.

  var nextOpId = 0;
  // Start a new operation.
  function startOperation(cm) {
    cm.curOp = {
      cm: cm,
      viewChanged: false,      // Flag that indicates that lines might need to be redrawn
      startHeight: cm.doc.height, // Used to detect need to update scrollbar
      forceUpdate: false,      // Used to force a redraw
      updateInput: 0,       // Whether to reset the input textarea
      typing: false,           // Whether this reset should be careful to leave existing text (for compositing)
      changeObjs: null,        // Accumulated changes, for firing change events
      cursorActivityHandlers: null, // Set of handlers to fire cursorActivity on
      cursorActivityCalled: 0, // Tracks which cursorActivity handlers have been called already
      selectionChanged: false, // Whether the selection needs to be redrawn
      updateMaxLine: false,    // Set when the widest line needs to be determined anew
      scrollLeft: null, scrollTop: null, // Intermediate scroll position, not pushed to DOM yet
      scrollToPos: null,       // Used to scroll to a specific position
      focus: false,
      id: ++nextOpId,          // Unique ID
      markArrays: null         // Used by addMarkedSpan
    };
    pushOperation(cm.curOp);
  }

  // Finish an operation, updating the display and signalling delayed events
  function endOperation(cm) {
    var op = cm.curOp;
    if (op) { finishOperation(op, function (group) {
      for (var i = 0; i < group.ops.length; i++)
        { group.ops[i].cm.curOp = null; }
      endOperations(group);
    }); }
  }

  // The DOM updates done when an operation finishes are batched so
  // that the minimum number of relayouts are required.
  function endOperations(group) {
    var ops = group.ops;
    for (var i = 0; i < ops.length; i++) // Read DOM
      { endOperation_R1(ops[i]); }
    for (var i$1 = 0; i$1 < ops.length; i$1++) // Write DOM (maybe)
      { endOperation_W1(ops[i$1]); }
    for (var i$2 = 0; i$2 < ops.length; i$2++) // Read DOM
      { endOperation_R2(ops[i$2]); }
    for (var i$3 = 0; i$3 < ops.length; i$3++) // Write DOM (maybe)
      { endOperation_W2(ops[i$3]); }
    for (var i$4 = 0; i$4 < ops.length; i$4++) // Read DOM
      { endOperation_finish(ops[i$4]); }
  }

  function endOperation_R1(op) {
    var cm = op.cm, display = cm.display;
    maybeClipScrollbars(cm);
    if (op.updateMaxLine) { findMaxLine(cm); }

    op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null ||
      op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom ||
                         op.scrollToPos.to.line >= display.viewTo) ||
      display.maxLineChanged && cm.options.lineWrapping;
    op.update = op.mustUpdate &&
      new DisplayUpdate(cm, op.mustUpdate && {top: op.scrollTop, ensure: op.scrollToPos}, op.forceUpdate);
  }

  function endOperation_W1(op) {
    op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
  }

  function endOperation_R2(op) {
    var cm = op.cm, display = cm.display;
    if (op.updatedDisplay) { updateHeightsInViewport(cm); }

    op.barMeasure = measureForScrollbars(cm);

    // If the max line changed since it was last measured, measure it,
    // and ensure the document's width matches it.
    // updateDisplay_W2 will use these properties to do the actual resizing
    if (display.maxLineChanged && !cm.options.lineWrapping) {
      op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
      cm.display.sizerWidth = op.adjustWidthTo;
      op.barMeasure.scrollWidth =
        Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth);
      op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm));
    }

    if (op.updatedDisplay || op.selectionChanged)
      { op.preparedSelection = display.input.prepareSelection(); }
  }

  function endOperation_W2(op) {
    var cm = op.cm;

    if (op.adjustWidthTo != null) {
      cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
      if (op.maxScrollLeft < cm.doc.scrollLeft)
        { setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true); }
      cm.display.maxLineChanged = false;
    }

    var takeFocus = op.focus && op.focus == activeElt();
    if (op.preparedSelection)
      { cm.display.input.showSelection(op.preparedSelection, takeFocus); }
    if (op.updatedDisplay || op.startHeight != cm.doc.height)
      { updateScrollbars(cm, op.barMeasure); }
    if (op.updatedDisplay)
      { setDocumentHeight(cm, op.barMeasure); }

    if (op.selectionChanged) { restartBlink(cm); }

    if (cm.state.focused && op.updateInput)
      { cm.display.input.reset(op.typing); }
    if (takeFocus) { ensureFocus(op.cm); }
  }

  function endOperation_finish(op) {
    var cm = op.cm, display = cm.display, doc = cm.doc;

    if (op.updatedDisplay) { postUpdateDisplay(cm, op.update); }

    // Abort mouse wheel delta measurement, when scrolling explicitly
    if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos))
      { display.wheelStartX = display.wheelStartY = null; }

    // Propagate the scroll position to the actual DOM scroller
    if (op.scrollTop != null) { setScrollTop(cm, op.scrollTop, op.forceScroll); }

    if (op.scrollLeft != null) { setScrollLeft(cm, op.scrollLeft, true, true); }
    // If we need to scroll a specific position into view, do so.
    if (op.scrollToPos) {
      var rect = scrollPosIntoView(cm, clipPos(doc, op.scrollToPos.from),
                                   clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
      maybeScrollWindow(cm, rect);
    }

    // Fire events for markers that are hidden/unidden by editing or
    // undoing
    var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
    if (hidden) { for (var i = 0; i < hidden.length; ++i)
      { if (!hidden[i].lines.length) { signal(hidden[i], "hide"); } } }
    if (unhidden) { for (var i$1 = 0; i$1 < unhidden.length; ++i$1)
      { if (unhidden[i$1].lines.length) { signal(unhidden[i$1], "unhide"); } } }

    if (display.wrapper.offsetHeight)
      { doc.scrollTop = cm.display.scroller.scrollTop; }

    // Fire change events, and delayed event handlers
    if (op.changeObjs)
      { signal(cm, "changes", cm, op.changeObjs); }
    if (op.update)
      { op.update.finish(); }
  }

  // Run the given function in an operation
  function runInOp(cm, f) {
    if (cm.curOp) { return f() }
    startOperation(cm);
    try { return f() }
    finally { endOperation(cm); }
  }
  // Wraps a function in an operation. Returns the wrapped function.
  function operation(cm, f) {
    return function() {
      if (cm.curOp) { return f.apply(cm, arguments) }
      startOperation(cm);
      try { return f.apply(cm, arguments) }
      finally { endOperation(cm); }
    }
  }
  // Used to add methods to editor and doc instances, wrapping them in
  // operations.
  function methodOp(f) {
    return function() {
      if (this.curOp) { return f.apply(this, arguments) }
      startOperation(this);
      try { return f.apply(this, 