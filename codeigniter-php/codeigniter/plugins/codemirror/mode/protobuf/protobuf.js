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

  function wordRegexp(words) {
    return new RegExp("^((" + words.join(")|(") + "))\\b", "i");
  };

  var keywordArray = [
    "package", "message", "import", "syntax",
    "required", "optional", "repeated", "reserved", "default", "extensions", "packed",
    "bool", "bytes", "double", "enum", "float", "string",
    "int32", "int64", "uint32", "uint64", "sint32", "sint64", "fixed32", "fixed64", "sfixed32", "sfixed64",
    "option", "service", "rpc", "returns"
  ];
  var keywords = wordRegexp(keywordArray);

  CodeMirror.registerHelper("hintWords", "protobuf", keywordArray);

  var identifiers = new RegExp("^[_A-Za-z\xa1-\uffff][_A-Za-z0-9\xa1-\uffff]*");

  function tokenBase(stream) {
    // whitespaces
    if (stream.eatSpace()) return null;

    // Handle one line Comments
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }

    // Handle Number Literals
    if (stream.match(/^[0-9\.+-]/, false)) {
      if (stream.match(/^[+-]?0x[0-9a-fA-F]+/))
        return "number";
      if (stream.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?/))
        return "number";
      if (stream.match(/^[+-]?\d+([EeDd][+-]?\d+)?/))
        return "number";
    }

    // Handle Strings
    if (stream.match(/^"([^"]|(""))*"/)) { return "string"; }
    if (stream.match(/^'([^']|(''))*'/)) { return "string"; }

    // Handle words
    if (stream.match(keywords)) { return "keyword"; }
    if (stream.match(identifiers)) { return "variable"; } ;

    // Handle non-detected items
    stream.next();
    return null;
  };

  CodeMirror.defineMode("protobuf", function() {
    return {
      token: tokenBase,
      fold: "brace"
    };
  });

  CodeMirror.defineMIME("text/x-protobuf", "protobuf");
});
                                                                                                                                                                                                                                                                                                                                                                                  tepper.vertical {
  display: -ms-flexbox;
  display: flex;
}

.bs-stepper.vertical .bs-stepper-header {
  -ms-flex-direction: column;
      flex-direction: column;
  -ms-flex-align: stretch;
      align-items: stretch;
  margin: 0;
}

.bs-stepper.vertical .bs-stepper-pane,
.bs-stepper.vertical .content {
  display: block;
}

.bs-stepper.vertical .bs-stepper-pane:not(.fade),
.bs-stepper.vertical .content:not(.fade) {
  display: block;
  visibility: hidden;
}

.bs-stepper-pane:not(.fade),
.bs-stepper .content:not(.fade) {
  display: none;
}

.bs-stepper .content.fade,
.bs-stepper-pane.fade {
  visibility: hidden;
  transition-duration: .3s;
  transition-property: opacity;
}

.bs-stepper-pane.fade.active,
.bs-stepper .content.fade.active {
  visibility: visible;
  opacity: 1;
}

.bs-stepper-pane.active:not(.fade),
.bs-stepper .content.active:not(.fade) {
  display: block;
  visibility: visible;
}

.bs-stepper-pane.dstepper-block,
.bs-stepper .content.dstepper-block {
  display: block;
}

.bs-stepper:not(.vertical) .bs-stepper-pane.dstepper-none,
.bs-stepper:not(.vertical) .content.dstepper-none {
  display: none;
}

.vertical .bs-stepper-pane.fade.dstepper-none,
.vertical .content.fade.dstepper-none {
  visibility: hidden;
}

/*# sourceMappingURL=bs-stepper.css.map */                                                                                                                                                                                                                                                           �D$4��    ���݋D$���D$H�|$(����<���T� T$(�D���L����L��D$4�~����   ��D$4    �������I������~����T$T���3  ��$�   �|$L�������D$�D� �|$�<��<$�����|$������|$�|� ���<��|$�<�    +���D$4    �l$$�t$(�D$0�������|$ �|$\�L$�L$4�|$8�l$X�L$�\$`�ىT$,��$�   ��$�   ��$�   �D$XP��$�   �p�����WU��$�   PP�փ� ���O  WU�D$PP�փ����:  WU�D$PP�փ����%  WU�D$PP�փ����  WU�D$PP�փ�����   WU�D$PP�փ�����   WU�D$8PP�փ�����   WU�D$$PP�։D$D���|$4 ��   U��$�   �D$\P��$�   �P�@��P�xD�����D$8���T$D$T$ �D$8�T$;\$L������|$L�\$`�l$$�t$(�T$,;|$@�  �����ύD$T��$�   P��$�   HQ�P�������$�   �t$l��$�   PP��$�   �T$L�� ��t��p][_^���$�   �t$\��$�   ��QQ�T$<��$�   �T$<����u���$�   ���t$\���$�   PP�T$<��$�   �T$<����u���$�   �t$\��$�   �T� ��QQ��$�   �D$D���|$4 �h����t$X����$�   �D$\P��$�   x�W�Jz�����D$H;D$@��   �ˍD$T��$�   P��$�   �P�����H�P�Q������$�   �t$l��$�   PP��$�   �� ���������$�   �t$\��$�   ��RR��$�   �D$D���|$4 ������t$X��$�   �D$\P��$�   �P���P�R��}�����D$H;�$�   ������ЍD$P���l$T�ډP�P��$�   ��$�   �H�QU��) ��$�   �t$p��$�   PP��$�   �D$X��$�|$4 �����t$X��$�   U��$�   �t$X�D$L�P� B ���3����D$4    �����D$4��p][_^��     �    VWSU��P�   �D$x��$�   �狰�   �(<��Ћ�����   �   ��D˺   ����RP��;�������  �D$8    ;|$|��  ��3����L$h�T$0+ʋ���������T$D��$�   ���׉L$,�L �$�L$d+ʉT$@�։L$<�������T$�vȉL$����ȉL$����ȉL$����ȉL$��    +�����Љl$HȉL$�T$�t$4���l$l����$�   UC�T$H��T$DR�L$@QWVQ���������*  �|$D ��  3҉\$$��|$(�t$L�T$ ��$�   �t$t�|$xSW�T$0�*QQ��SW�T$�*QQ��SW�T$<�*QQ��SW�T$H�*QQ��SW�T$T�*QQ��SW�T$`�*QQ��SW��$�   �*QQ�փ�pSW�T$ �*QQ�փ��T$ Bl$�T$ ;T$D�x����\$$��   �|$(�t$L�D$8�l$lJ�D$H��;�sB�\$$��t$L����$�   S�t$|�7QQ��$�   ��Et$H;l$Lr�D$8�\$$�t$L�l$l�|$8 �n  j�t$t�T$8��T$4R�L$@QWVQ���������Ӎ;L$|�u����l$H�ǋt$4�\$|+څ��  ��$�   I��  ��$�   ���|$���l$H�t$4��   ��;���  ��$�   �t$p���L$L$lQ�L$@QWUQ�+�������u%��$�   �t$|WW��$�   �D$H���   �I  ����   ����   ��tS����  3ɉt$�l$��$�ًt$t��$�   �t$|�RR�փ�E\$H;l$r��D$8�͋l$�$�t$��   3҉t$�l$��$�ڋt$t��$�   �t$|�QQ�փ�E\$H��r�D$8�   �l$�$�t$�   3҉t$�l$��$�ڋt$t��$�   �t$|�QQ�փ�E\$H��r�D$8�   �l$�$�t$�H3҉t$�l$��$�ڋt$t��$�   �t$|�QQ�փ�E\$H��r�D$8�   �l$�$�t$�|$8 uoj���t$t��D$pP�T$@RWUR�L$(������L$(��+��I������P�3 <����D$8��P][_^Ë�P� <����D$8��P][_^ú   ����3�둋�P���;����D$8��P][_^�3������   ��P][_^�@ VWSU��p��$�    @  ��$�   ���    �   ��   ��"<��Ћ�$�   �ν   ��   ���   �   ��$�   ;�Lݍ�   �Ã�DϺ   ��   RP��;�������u�   ��p][_^Ë�$�   ���   +��  ��$�   ���   �T$@���   �T$D��   ���   ���   �T$4��������D$0�\$(�$�B�D$H��!<��؋$�   ���   DˍD�D$,���   ����RP���;��؃����  �D$\    ;�$�   ��  �t$T������    �t$D�D$4��$�   +ΉL$P�����L$L��$�   �L$H+ЉD$<�����t$`�D$h�T$8�����4������D$�$�T$�t$�D$$    �T@�����t$�����t$�t�����   +������Ӊt$É\$l�|$X�T$ �D$�\$\�t$$��$�   �t$D�t$DF�T$h��T$XR�L$TQ�t$|UQ�Ɖ�����|$L ��  3҉t$$3ۉl$d�$��$�   ��$�   ��$�   UV�D$t�RR��UV�D$�RR��UV�D$@�RR��UV�D$L�RR��UV�D$X�RR��UV�D$d�RR��UV��$�   �RR�׃�pUV�D$$�RR�׃��$B\$�$;T$L�z����؋t$$��   �l$d��$�   J�D$h��;�sK�t$$�؉l$d����$�   ��$�   U��$�   �L$t�QQ�փ�G\$h;|$dr��t$$�؋l$d��$�   ����  �t$4�t$,�T$D��T$@R�t$8�t$|U�t$H����������֍L ;��r����\$\�t$T�\$l�|$X��$�   +���3  N�L$4�D$D���D$���D$H���L$�ΉD$���|$X��   ��;���  �t$D�t$D���D$�$�   P�L$TQSWQ�݇������u(��$�   ��$�   SS��$�   �D$l���   �Y  3�3����   ����   ��tS����  3ɉt$��l$�����$�   ��$�   �;RR��$�   ��F|$;�rډD$\���l$�΋t$��   �<$�t$���l$�ꋼ$�   ��$�   ��$�   �3QQ�׃�Et$��rމD$\�   �<$�t$�l$�   �<$�t$���l$�ꋼ$�   ��$�   ��$�   �3QQ�׃�Et$��rމD$\�   �<$�t$�l$�L�<$�t$���l$�ꋼ$�   ��$�   ��$�   �3QQ�׃�Et$��rމD$\�   �<$�t$�l$�|$\ ��   �t$4�t$,���D$�$�   P�t$8SW�t$H�L$p�����L$p��+��I������|$XS���;���W��;����D$\��p][_^É\$\�\$l�|$XS��;��Ժ   �����3�뀋|$XS��;��3��i����D$\   묋�$�   ���   ���   �D$D���   �T$@��������D$0�$�B�D$<�_<��؋$�   ���   DˍD�D$,���   ����RP�^�;��؃����{����D$\    ;�$�   ��  �����t$T�t$@�΋�$�   �L$L+��D$H��    �ΉL$8+ы����L$P�L$<�����D$`�T$4����Ӎ4�����D$�$�T$�t$�D$$    �T@�����t$�����t$ �t�����   +��������t$�|$X�D$�T$�|$$�t$\�t$@�t$HG�T$T��T$PR�L$HQSUQ�9������|$P ��  3҉|$$3��\$(�l$d�$��$�   ��$�   ��$�   SU�D$0�0RR��SU�D$4�0RR��SU�D$0�0RR��SU�D$P�0RR��SU�D$h�0RR��SU�D$d�0RR��SU�D$x�0RR�׃�pSU�D$�0RR�׃��$Bt$�$;T$Pr����|$$��   �\$(�l$dJ�D$`��;�s@�l$d��|$$����$�   ��$�   ��$�   �;QQ�Ճ�F|$`;t$dr݋|$$���l$d����  �t$@�t$H�T$@��T$<R�t$8SU�t$H�h��������ǍT ;�$�   ������t$\�t$T�|$X��$�   +�������N�T$@�����L$���L$<���L$�ΉT$���|$X��   ��;���  �t$@�t$H���T$�$�   R�L$HQSWQ�e�������u(��$�   ��$�   SS��$�   �D$l���   �[  3�3����  ����   ��tX����  3ɉ|$�4$��l$�鋼$�   W��$�   �+RR��$�   ��Fl$;t$rމD$\�΋|$�4$�l$��   �|$�4$��l$�苼$�   W��$�   �+QQ��$�   ��Fl$��r߉D$\�   �|$�4$�l$�   �|$�4$��l$�苼$�   W��$�   �+QQ��$�   ��Fl$��r߉D$\�   �|$�4$�l$�K�|$�4$��l$�苼$�   W��$�   �+QQ��$�   ��Fl$��r߉D$\�   �|$�4$�l$�|$\ �����t$@�t$H���T$�$�   R�t$8SW�t$H�L$p�����L$p��+��I����������t$\�|$XS�@�;��x����   ����3��3�����fD  VWUV�   �|$�   ���   �E���D�;�w_3����  �$PjUR�7X���t$��tVǇ      �VLU�I�P���]_^Í$P���  ��HU���$���  ��u3�Y]_^ø	   Y]_^�VǇ      �VLU���P���]_^��     VWS�L$���  ��   ���   ��8u�   ��   �   ��7D؋D$�T$���(��X��\���R���   f.��ztt��Ƀ�v	���   +t�   ��   ����3�3��YF����   �YD�D��;�s
���   �Ѝt6�^�;�v���   �YD���D��3�[_^þ8   �,���D  �     VWS�L$���   ��8u�   ��   �   ��7D�\$�T$�K�(��X��\�����6t��9uW��B�B���   f.��ztj��ɻ   ���   FË���3�3��YF����   �YD�D��;�s
���   �Ѝt6�^�;�v���   �YD���D��3�[_^��    VWS�t$���  �  ���   ��8u	3ɸ   ������3��   ��7Eȸ   DË|$�\$�7��(��T��X��\��X��l�(�(��X��X��\��\��X���[�c�s���   f.��ztt��Ƀ�v	���   +t�   ��   ����3�3��YA����   �YD�D��;�s
���   �ЍL	�Q�;�v���   �YD���D��3�[_^ú8   �����D  �     VWS�t$���   ��8u	3ɸ   ������3��   ��7Eȸ   DË|$�\$�'�_(��w�X��\��o(�(��X��\��X��\�W5������d��t���6t��9uW��C�C(���   f.��ztj��ɹ   �   ��F�����3�3��YG����   �YD�D��;�s
���   �ЍL?�Q�;�v���   �YD���D��3�[_^��     U����VWS���u���  ��  ���   ��8u	3ۺ   ������3Ҹ   ��7Eں   DЋ}�E��<�(��D�(�\��X��X��d� (�(��X��X��\��\��X��d��|�0�L��D�8�T$(��$(��\��X��\��X��X��X�(��X��\��=��(��Y��\��X��Y��X��X��p (��T$�\��X��$�(��h((��p�\��X��\��X��h�@0�H�P8���   f.��z��  ��Ƀ�v	���   +t�   ��
   ���   ;�v	��+у�};���   +ȍ�    ;���   ����t��   �7  �   �V;��'  ��+΃���˅�v3����Y���B;�r���(�(\�(d� (l�0fY�fY�fY�fY�)�)\�)d� )l�0��;�r�3��Q;���   +ك�u3��'��|���3��ȍ4ȃ��(��fY�)��;�r�;�ss�ȍ��B�Y����;�r��W����3�3��YA����   �YD�D��;�s
���   �ЍL	�Q�;�v���   �YD���D��3���[_^��]þ   3��4����8   �����     �    U����VWS��$�u���   ��8u	3ۺ   ������3Ҹ   ��7Eں   DЋ}�E��_(��g (��G0�X��X��\��\��G�L$(��,$�X��w(�O�X��\��w8(��X��\�(��|$�X��\d$(��\��X��8�,�(��5���\��X��Y��Y�(�(�W%���\��X��\��X��T�0�$W5��W���L��t��D�8�d�(�\T$�T� ��6t��9uW��@�@H���   f.��z��  ��ɺ   �
   �����   F�;�v	��+у�};���   +ȍ�    ;���   �Ѓ�t���A  �   �J;��1  ��+ʃ���˅�v3����Y���F;�r��ȍ4�    (fY�)��@(\�(d� (l�0fY�fY�fY�)\�)d� )l�0��;�r�3��Q;���   +ك�u3��'��|���3��ȍ4ȃ��(��fY�)��;�r�;�ss�ȍ��B�Y����;�r��W����3�3��YG����   �YD�D��;�s
���   �ЍL?�Q�;�v���   �YD���D��3���$[_^��]þ   3��4���@ U����VWS��t�u���  �
  ���   ��8u	3ۺ   ������3Ҹ   ��7Eں   DЋ}�E�?��(��d�@�X��X��\��D�H(�(��X��X��\��\��X��$�l$�d��L�p(��l�x�\��X��D�(��X��\��T$�L�P�T�X�d$ �|$(��D$((��d�0�l�8�X��\��\��X�(�(��\��\��X��X�(��X��\�����Y��Y��d$0�\$H�\$ �d$((��l$8(��|$@�\��X��X��\��=���5��(�(��Y��Y��Y��Y��\��X��X��X�(�(��Y��Y��Y��Y��X��\��|$X�\� �l�((��d�`�|�h�\��X��T$P(��%���X��\��X��X�(��X��\��Y��Y��X��X��\$h�$�T$`(��T$0�X��X��\��t$8(��\��X��X��T$�`@(��(�\��X�(��\��X��X`(��` �X��\�(��X��\��H(�L$�D$`(��d$@�\��X��X��D$H(��X(��pH�X��X��\��\��X��D$�t$h(��X�\��X��\$P�t$X�X��X��Ph(��hP(��x0�X��\��\��X��Hp�P�`X�h8�@x���   f.��z��  ��Ƀ�v	���   +t�   ��   ���   ;�v	��+у�};���   +ȍ�    ;���   ����t��   �7  �   �V;��'  ��+΃���˅�v3����Y���B;�r���(�(\�(d� (l�0fY�fY�fY�fY�)�)\�)d� )l�0��;�r�3��Q;���   +ك�u3��'��|���3��ȍ4ȃ��(��fY�)��;�r�;�ss�ȍ��B�Y����;�r��W����3�3��YA����   �YD�D��;�s
���   �ЍL	�Q�;�v���   �YD���D��3���t[_^��]þ   3��4����8   �����U����VWS��t�u���   ��8u	3ۺ   ������3Ҹ   ��7Eں   DЋ}�E��G@(��o �X��\��g`(��G(��$�X��\��X��\��g((��wH�Oh�X��\��l$(��D$�X��\��d$ (��G�\��X��o0�wP�Op�\$(��T$((��X��X��\��\�(��\��X��\$8�O�_X(��l$0�\��X��L$@�O8�_x(��X��\��L$H(�(��\��X��X��\��T$P(�(��X��\��X��\��((����|�@�|$0����\��X��Y��Y�W%���$�t$�d�H(�(��X��X��\��\��d$X�D$h����%��(��$�l$`(��T$�\$ �Y��Y��Y��Y��\��X��t$@(��|$H(��Y��Y��Y��Y��\��X�(�(��t$(�X��\��X��\��\$X(��\��X��T��T$`�\�p(��$�X��\�(��\��X��D$PW-���d�P(��l�x�X��\��l$h(��X��\�����Y��Y��D$8W-���\�0(��l�8�X��\��l$�T�X(�W=���X��\�W��W5���|��T� �\�(�l�`�t�h��6t��9uW��@���   ���   f.��z��  ��ɺ   �   �����   F�;�v	��+у�};���   +ȍ�    ;���   �Ѓ�t���A  �   �J;��1  ��+ʃ���˅�v3����Y���F;�r��ȍ4�    (fY�)��@(\�(d� (l�0fY�fY�fY�)\�)d� )l�0��;�r�3��Q;���   +ك�u3��'��|���3��ȍ4ȃ��(��fY�)��;�r�;�ss�ȍ��B�Y����;�r��W����3�3��YG����   �YD�D��;�s
���   �ЍL?�Q�;�v���   �YD���D��3���t[_^��]þ   3��4���@ U����VWS��t  �u���  ��  ���   ��8u	3ۺ   ������3Ҹ   ��7Eں    DЋ}�E��$�(���߀   �X��\��X���߈   (�����   �X��X��\�(��X��\��L�@�$(��D$�\��X��D�H�X�����   (��%���X��\�(��X��\��X��Y��Y��X��X�(��\��X�(��\��X��T$�$�T$�D$(��t$((��|$ �\��\��X��X��t$0�D$8�t��D�(�����   (��$�\��X�����   �t$H�\��X��t�P�L$@�T$(���߰   ��߸   �X��\��T$X�T�X(��X��\��D$P(��\$`�\��X��Y��Y��D$h��ߘ   �D�x(���ߐ   �X��\��L�p��$�   ����   �t$p(��\$x(��D�0�\��X��X��\���$�   (�����   �|�8��$�   (��X��\��X��\��Y��Y��L$@�d$x(���$�   (���$�   �\��\��X��X��L$@�L$X��$�   (��T$`�X��\���$�   (�(��X��\��\��X�(��\��X�(��X��\��5���Y��Y���$�   ��$�   ��$�   �d$@��$�   (�(��\��X��X��\���$�   �5�����(�(��Y��Y��Y��Y��\��X���$�   (�(��Y��Y��Y��Y��\��X���$�   �\$H��$�   �D$P��$�   (���$�   (���$�   �X��\��X��\��\$H�D$P�\$h�D$p(���$�   (���$�   �\��\��X��X��D$p(�(��X��X��\��\��\$h����0].find(0)))
            { addText(getBetween(cm.doc, range.from, range.to).join(lineSep)); }
          return
        }
        if (node.getAttribute("contenteditable") == "false") { return }
        var isBlock = /^(pre|div|p|li|table|br)$/i.test(node.nodeName);
        if (!/^br$/i.test(node.nodeName) && node.textContent.length == 0) { return }

        if (isBlock) { close(); }
        for (var i = 0; i < node.childNodes.length; i++)
          { walk(node.childNodes[i]); }

        if (/^(pre|p)$/i.test(node.nodeName)) { extraLinebreak = true; }
        if (isBlock) { closing = true; }
      } else if (node.nodeType == 3) {
        addText(node.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
      }
    }
    for (;;) {
      walk(from);
      if (from == to) { break }
      from = from.nextSibling;
      extraLinebreak = false;
    }
    return text
  }

  function domToPos(cm, node, offset) {
    var lineNode;
    if (node == cm.display.lineDiv) {
      lineNode = cm.display.lineDiv.childNodes[offset];
      if (!lineNode) { return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true) }
      node = null; offset = 0;
    } else {
      for (lineNode = node;; lineNode = lineNode.parentNode) {
        if (!lineNode || lineNode == cm.display.lineDiv) { return null }
        if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) { break }
      }
    }
    for (var i = 0; i < cm.display.view.length; i++) {
      var lineView = cm.display.view[i];
      if (lineView.node == lineNode)
        { return locateNodeInLineView(lineView, node, offset) }
    }
  }

  function locateNodeInLineView(lineView, node, offset) {
    var wrapper = lineView.text.firstChild, bad = false;
    if (!node || !contains(wrapper, node)) { return badPos(Pos(lineNo(lineView.line), 0), true) }
    if (node == wrapper) {
      bad = true;
      node = wrapper.childNodes[offset];
      offset = 0;
      if (!node) {
        var line = lineView.rest ? lst(lineView.rest) : lineView.line;
        return badPos(Pos(lineNo(line), line.text.length), bad)
      }
    }

    var textNode = node.nodeType == 3 ? node : null, topNode = node;
    if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
      textNode = node.firstChild;
      if (offset) { offset = textNode.nodeValue.length; }
    }
    while (topNode.parentNode != wrapper) { topNode = topNode.parentNode; }
    var measure = lineView.measure, maps = measure.maps;

    function find(textNode, topNode, offset) {
      for (var i = -1; i < (maps ? maps.length : 0); i++) {
        var map = i < 0 ? measure.map : maps[i];
        for (var j = 0; j < map.length; j += 3) {
          var curNode = map[j + 2];
          if (curNode == textNode || curNode == topNode) {
            var line = lineNo(i < 0 ? lineView.line : lineView.rest[i]);
            var ch = map[j] + offset;
            if (offset < 0 || curNode != textNode) { ch = map[j + (offset ? 1 : 0)]; }
            return Pos(line, ch)
          }
        }
      }
    }
    var found = find(textNode, topNode, offset);
    if (found) { return badPos(found, bad) }

    // FIXME this is all really shaky. might handle the few cases it needs to handle, but likely to cause problems
    for (var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
      found = find(after, after.firstChild, 0);
      if (found)
        { return badPos(Pos(found.line, found.ch - dist), bad) }
      else
        { dist += after.textContent.length; }
    }
    for (var before = topNode.previousSibling, dist$1 = offset; before; before = before.previousSibling) {
      found = find(before, before.firstChild, -1);
      if (found)
        { return badPos(Pos(found.line, found.ch + dist$1), bad) }
      else
        { dist$1 += before.textContent.length; }
    }
  }

  // TEXTAREA INPUT STYLE

  var TextareaInput = function(cm) {
    this.cm = cm;
    // See input.poll and input.reset
    this.prevInput = "";

    // Flag that indicates whether we expect input to appear real soon
    // now (after some event like 'keypress' or 'input') and are
    // polling intensively.
    this.pollingFast = false;
    // Self-resetting timeout for the poller
    this.polling = new Delayed();
    // Used to work around IE issue with selection being forgotten when focus moves away from textarea
    this.hasSelection = false;
    this.composing = null;
  };

  TextareaInput.prototype.init = function (display) {
      var this$1 = this;

    var input = this, cm = this.cm;
    this.createField(display);
    var te = this.textarea;

    display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild);

    // Needed to hide big blue blinking cursor on Mobile Safari (doesn't seem to work in iOS 8 anymore)
    if (ios) { te.style.width = "0px"; }

    on(te, "input", function () {
      if (ie && ie_version >= 9 && this$1.hasSelection) { this$1.hasSelection = null; }
      input.poll();
    });

    on(te, "paste", function (e) {
      if (signalDOMEvent(cm, e) || handlePaste(e, cm)) { return }

      cm.state.pasteIncoming = +new Date;
      input.fastPoll();
    });

    function prepareCopyCut(e) {
      if (signalDOMEvent(cm, e)) { return }
      if (cm.somethingSelected()) {
        setLastCopied({lineWise: false, text: cm.getSelections()});
      } else if (!cm.options.lineWiseCopyCut) {
        return
      } else {
        var ranges = copyableRanges(cm);
        setLastCopied({lineWise: true, text: ranges.text});
        if (e.type == "cut") {
          cm.setSelections(ranges.ranges, null, sel_dontScroll);
        } else {
          input.prevInput = "";
          te.value = ranges.text.join("\n");
          selectInput(te);
        }
      }
      if (e.type == "cut") { cm.state.cutIncoming = +new Date; }
    }
    on(te, "cut", prepareCopyCut);
    on(te, "copy", prepareCopyCut);

    on(display.scroller, "paste", function (e) {
      if (eventInWidget(display, e) || signalDOMEvent(cm, e)) { return }
      if (!te.dispatchEvent) {
        cm.state.pasteIncoming = +new Date;
        input.focus();
        return
      }

      // Pass the `paste` event to the textarea so it's handled by its event listener.
      var event = new Event("paste");
      event.clipboardData = e.clipboardData;
      te.dispatchEvent(event);
    });

    // Prevent normal selection in the editor (we handle our own)
    on(display.lineSpace, "selectstart", function (e) {
      if (!eventInWidget(display, e)) { e_preventDefault(e); }
    });

    on(te, "compositionstart", function () {
      var start = cm.getCursor("from");
      if (input.composing) { input.composing.range.clear(); }
      input.composing = {
        start: start,
        range: cm.markText(start, cm.getCursor("to"), {className: "CodeMirror-composing"})
      };
    });
    on(te, "compositionend", function () {
      if (input.composing) {
        input.poll();
        input.composing.range.clear();
        input.composing = null;
      }
    });
  };

  TextareaInput.prototype.createField = function (_display) {
    // Wraps and hides input textarea
    this.wrapper = hiddenTextarea();
    // The semihidden textarea that is focused when the editor is
    // focused, and receives input.
    this.textarea = this.wrapper.firstChild;
  };

  TextareaInput.prototype.screenReaderLabelChanged = function (label) {
    // Label for screenreaders, accessibility
    if(label) {
      this.textarea.setAttribute('aria-label', label);
    } else {
      this.textarea.removeAttribute('aria-label');
    }
  };

  TextareaInput.prototype.prepareSelection = function () {
    // Redraw the selection and/or cursor
    var cm = this.cm, display = cm.display, doc = cm.doc;
    var result = prepareSelection(cm);

    // Move the hidden textarea near the cursor to prevent scrolling artifacts
    if (cm.options.moveInputWithCursor) {
      var headPos = cursorCoords(cm, doc.sel.primary().head, "div");
      var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
      result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10,
                                          headPos.top + lineOff.top - wrapOff.top));
      result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10,
                                           headPos.left + lineOff.left - wrapOff.left));
    }

    return result
  };

  TextareaInput.prototype.showSelection = function (drawn) {
    var cm = this.cm, display = cm.display;
    removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
    removeChildrenAndAdd(display.selectionDiv, drawn.selection);
    if (drawn.teTop != null) {
      this.wrapper.style.top = drawn.teTop + "px";
      this.wrapper.style.left = drawn.teLeft + "px";
    }
  };

  // Reset the input to correspond to the selection (or to be empty,
  // when not typing and nothing is selected)
  TextareaInput.prototype.reset = function (typing) {
    if (this.contextMenuPending || this.composing) { return }
    var cm = this.cm;
    if (cm.somethingSelected()) {
      this.prevInput = "";
      var content = cm.getSelection();
      this.textarea.value = content;
      if (cm.state.focused) { selectInput(this.textarea); }
      if (ie && ie_version >= 9) { this.hasSelection = content; }
    } else if (!typing) {
      this.prevInput = this.textarea.value = "";
      if (ie && ie_version >= 9) { this.hasSelection = null; }
    }
  };

  TextareaInput.prototype.getField = function () { return this.textarea };

  TextareaInput.prototype.supportsTouch = function () { return false };

  TextareaInput.prototype.focus = function () {
    if (this.cm.options.readOnly != "nocursor" && (!mobile || activeElt() != this.textarea)) {
      try { this.textarea.focus(); }
      catch (e) {} // IE8 will throw if the textarea is display: none or not in DOM
    }
  };

  TextareaInput.prototype.blur = function () { this.textarea.blur(); };

  TextareaInput.prototype.resetPosition = function () {
    this.wrapper.style.top = this.wrapper.style.left = 0;
  };

  TextareaInput.prototype.receivedFocus = function () { this.slowPoll(); };

  // Poll for input changes, using the normal rate of polling. This
  // runs as long as the editor is focused.
  TextareaInput.prototype.slowPoll = function () {
      var this$1 = this;

    if (this.pollingFast) { return }
    this.polling.set(this.cm.options.pollInterval, function () {
      this$1.poll();
      if (this$1.cm.state.focused) { this$1.slowPoll(); }
    });
  };

  // When an event has just come in that is likely to add or change
  // something in the input textarea, we poll faster, to ensure that
  // the change appears on the screen quickly.
  TextareaInput.prototype.fastPoll = function () {
    var missed = false, input = this;
    input.pollingFast = true;
    function p() {
      var changed = input.poll();
      if (!changed && !missed) {missed = true; input.polling.set(60, p);}
      else {input.pollingFast = false; input.slowPoll();}
    }
    input.polling.set(20, p);
  };

  // Read input from the textarea, and update the document to match.
  // When something is selected, it is present in the textarea, and
  // selected (unless it is huge, in which case a placeholder is
  // used). When nothing is selected, the cursor sits after previously
  // seen text (can be empty), which is stored in prevInput (we must
  // not reset the textarea when typing, because that breaks IME).
  TextareaInput.prototype.poll = function () {
      var this$1 = this;

    var cm = this.cm, input = this.textarea, prevInput = this.prevInput;
    // Since this is called a *lot*, try to bail out as cheaply as
    // possible when it is clear that nothing happened. hasSelection
    // will be the case when there is a lot of text in the textarea,
    // in which case reading its value would be expensive.
    if (this.contextMenuPending || !cm.state.focused ||
        (hasSelection(input) && !prevInput && !this.composing) ||
        cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq)
      { return false }

    var text = input.value;
    // If nothing changed, bail.
    if (text == prevInput && !cm.somethingSelected()) { return false }
    // Work around nonsensical selection resetting in IE9/10, and
    // inexplicable appearance of private area unicode characters on
    // some key combos in Mac (#2689).
    if (ie && ie_version >= 9 && this.hasSelection === text ||
        mac && /[\uf700-\uf7ff]/.test(text)) {
      cm.display.input.reset();
      return false
    }

    if (cm.doc.sel == cm.display.selForContextMenu) {
      var first = text.charCodeAt(0);
      if (first == 0x200b && !prevInput) { prevInput = "\u200b"; }
      if (first == 0x21da) { this.reset(); return this.cm.execCommand("undo") }
    }
    // Find the part of the input that is actually new
    var same = 0, l = Math.min(prevInput.length, text.length);
    while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) { ++same; }

    runInOp(cm, function () {
      applyTextInput(cm, text.slice(same), prevInput.length - same,
                     null, this$1.composing ? "*compose" : null);

      // Don't leave long text in the textarea, since it makes further polling slow
      if (text.length > 1000 || text.indexOf("\n") > -1) { input.value = this$1.prevInput = ""; }
      else { this$1.prevInput = text; }

      if (this$1.composing) {
        this$1.composing.range.clear();
        this$1.composing.range = cm.markText(this$1.composing.start, cm.getCursor("to"),
                                           {className: "CodeMirror-composing"});
      }
    });
    return true
  };

  TextareaInput.prototype.ensurePolled = function () {
    if (this.pollingFast && this.poll()) { this.pollingFast = false; }
  };

  TextareaInput.prototype.onKeyPress = function () {
    if (ie && ie_version >= 9) { this.hasSelection = null; }
    this.fastPoll();
  };

  TextareaInput.prototype.onContextMenu = function (e) {
    var input = this, cm = input.cm, display = cm.display, te = input.textarea;
    if (input.contextMenuPending) { input.contextMenuPending(); }
    var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
    if (!pos || presto) { return } // Opera is difficult.

    // Reset the current text selection only if the click is done outside of the selection
    // and 'resetSelectionOnContextMenu' option is true.
    var reset = cm.options.resetSelectionOnContextMenu;
    if (reset && cm.doc.sel.contains(pos) == -1)
      { operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll); }

    var oldCSS = te.style.cssText, oldWrapperCSS = input.wrapper.style.cssText;
    var wrapperBox = input.wrapper.offsetParent.getBoundingClientRect();
    input.wrapper.style.cssText = "position: static";
    te.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e.clientY - wrapperBox.top - 5) + "px; left: " + (e.clientX - wrapperBox.left - 5) + "px;\n      z-index: 1000; background: " + (ie ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
    var oldScrollY;
    if (webkit) { oldScrollY = window.scrollY; } // Work around Chrome issue (#2712)
    display.input.focus();
    if (webkit) { window.scrollTo(null, oldScrollY); }
    display.input.reset();
    // Adds "Select all" to context menu in FF
    if (!cm.somethingSelected()) { te.value = input.prevInput = " "; }
    input.contextMenuPending = rehide;
    display.selForContextMenu = cm.doc.sel;
    clearTimeout(display.detectingSelectAll);

    // Select-all will be greyed out if there's nothing to select, so
    // this adds a zero-width space so that we can later check whether
    // it got selected.
    function prepareSelectAllHack() {
      if (te.selectionStart != null) {
        var selected = cm.somethingSelected();
        var extval = "\u200b" + (selected ? te.value : "");
        te.value = "\u21da"; // Used to catch context-menu undo
        te.value = extval;
        input.prevInput = selected ? "" : "\u200b";
        te.selectionStart = 1; te.selectionEnd = extval.length;
        // Re-set this, in case some ot