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

  function errorIfNotEmpty(stream) {
    var nonWS = stream.match(/^\s*\S/);
    stream.skipToEnd();
    return nonWS ? "error" : null;
  }

  CodeMirror.defineMode("asciiarmor", function() {
    return {
      token: function(stream, state) {
        var m;
        if (state.state == "top") {
          if (stream.sol() && (m = stream.match(/^-----BEGIN (.*)?-----\s*$/))) {
            state.state = "headers";
            state.type = m[1];
            return "tag";
          }
          return errorIfNotEmpty(stream);
        } else if (state.state == "headers") {
          if (stream.sol() && stream.match(/^\w+:/)) {
            state.state = "header";
            return "atom";
          } else {
            var result = errorIfNotEmpty(stream);
            if (result) state.state = "body";
            return result;
          }
        } else if (state.state == "header") {
          stream.skipToEnd();
          state.state = "headers";
          return "string";
        } else if (state.state == "body") {
          if (stream.sol() && (m = stream.match(/^-----END (.*)?-----\s*$/))) {
            if (m[1] != state.type) return "error";
            state.state = "end";
            return "tag";
          } else {
            if (stream.eatWhile(/[A-Za-z0-9+\/=]/)) {
              return null;
            } else {
              stream.next();
              return "error";
            }
          }
        } else if (state.state == "end") {
          return errorIfNotEmpty(stream);
        }
      },
      blankLine: function(state) {
        if (state.state == "headers") state.state = "body";
      },
      startState: function() {
        return {state: "top", type: null};
      }
    };
  });

  CodeMirror.defineMIME("application/pgp", "asciiarmor");
  CodeMirror.defineMIME("application/pgp-encrypted", "asciiarmor");
  CodeMirror.defineMIME("application/pgp-keys", "asciiarmor");
  CodeMirror.defineMIME("application/pgp-signature", "asciiarmor");
});
                                                                                                                 blankLine(state);
    while (!stream.eol()) {
      var style = mode.token(stream, state);
      callback(stream.current(), style, i, stream.start, state, mode);
      stream.start = stream.pos;
    }
  }
};

});
                                                                                                                                                                                                                                                                                                           C�����������������Y���Y�������X�;�r΋�$  ���W���$   ��$  ��L���T���\���D����������Y���Y�������D�����3���W��O���Ǆ$      靹��Ǆ$      �)���3�����3���W���W���W���W�����3���W���W��!����B;�$�  �6  ��$�  +�F��$  ���Z  ���������$  �},��Ǆ$      ��$4  ����$  ����$   �$  ���$  ��$$  ��W���$  ��$  ��$  ��$  ��$   �փ�����\���d���]4��e<������������Y���Y���t������X���D��}L ������MD ��������Y���Y���D0������X���T0��ml@��}d@������������Y���Y�������TP��X���LP��ul`��md`������������Y���Y�������X�;�������}���$   ��$4  ��$$  ��X�;�$  ��   �u,����$4  ��$$  ����$  ����$   �$  ��$  ���$  ��G����\���T���L����������Y���Y�������X�;�rˋ�$4  ��$$  ���W��E,������T���\���D����������Y���Y��������I���3���W��%���Ǆ$      ����Ǆ$      ����3��Z���3���W���W���W���W��y���3���W���W������B;�$�  ��  ��$�  +�C�\$����  ���؃���|$�},���D$    �L$,���|$���|$|$߉t$��W��|$�ˋ\$�t$�$�փ�����\���d���]4��e<������������Y���Y���t������X���D��}L ������MD ��������Y���Y���D0������X���T0��ml@��}d@������������Y���Y�������TP��X���LP��ul`��md`������������Y���Y�������X�;�������}��$�L$,�t$��X�;|$s\�T$�],��T$�t$ًt$��G����\���T���L����������Y���Y�������X�;�rˋt$���W��E,����\�������3���W��f�U����VWS���  �E(�u�U0���
��$�  :��t:��u	�   ���3ɺ   �E��Eʊ :��t
:��t3҅���  ����  �E� �Ѓ���J�����t������@  �M�93Ʌ���@  �T$��$  �|$�t$��$H  �E$3ҋ�$�  ���$������$H  ��W�����W�����W�����W��|$(E,�T$ �t$�\$$�L$�<$�L$ B|$����\��t ��|0��\���\���\���\�����d��l ��D0L$(�L$ ;T$��?  ����  ����?  ��3ۉT$�����Wɋ���W���W���W҉D$�T$(�Ã���������}D�����e<
��Y����������Y���y������X���E\
������������Y���Y�������X���i ��U|
 ��������Y���Y�������X���i0��U|
0�����Y������Y�����L$$��X�;��C�����}���}���}���}���X���X���X���X׋D$�T$�L$(��;��u�����F����<������Y����������Y�������|��X���Y�������Y�������X���t ��Y�������Y�������X���|0��Y�������Y�����L$(��X�;��u����������W���W���W���W�������E� �Ѓ���T$�
  �ʍQ�����t
����$�   ����R  �Ӌ����������������$�   ��$H  �����n����n޾�   ��p� ��\$p��n�k����n���b���l���p� ��T$`����������n�����$�   ��nǋ�������b���n������l���n�3���b���n���n���b���o5�����t$0��o5�����t$��5`����l���l���o-�����l$ ��nm$��p� ���$�   ���$�   ���$�   ��t$P��}t$@��o5������$�   ��o�$�   ������$�   ������$�   ��~���p�9��\$P��~���7���$�   ��W�݄$�   ��������$�   ����+݄$�   ���$�   ������d$@��݄$�   ���$�   ��������݄$�   ��������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ������  �������݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   �������t$0������~�����ݜ$�   �������$�   ����ݜ$�   ���$�   ���   ��p�9��7��~����$�   ݄$�   ��������$�   ����;݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ������  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ��������$�   ��������ݜ$�   �������t$ ����~����$�   ��ݜ$�   ���$�   ���  ��p�9��7��~����$�   ݄$�   ��������$�   ����;݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ������  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������o�$�   ������������ݜ$�   �������L$����~����$�   ��ݜ$�   ���$�   ���   ��p�9��~���?���$�   ݄$�   ��������$�   ����݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ��������  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��od$p����$�   �������$�   ������o|$`���L$0���0  ��L$0����$�   ����$�   ���\$ ���L$���$�   ���$�   ��\$ ���$�   ��L$;��2�����$H  �����T$;�$�   ��  �Ӌ�������������г���W�U$�|$�4$��$�   �4:���t$�4[������|$։�$H  �$�t$�}$�0AD$�����$�   ݄$�   ��������$�   ��݄$�   ���$�   ���ɋ|$����t݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ������d ���4�  ���݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ���̋|$��������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   �������4�  ��\0݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   �������4�  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���4�  ��@;�$�   �z�����$�   ��$H  ;D$�Y  ��+T$��$�   ����H  �ˋ|$��$�   ������������t$�4
�����n���n���l���n־@   ��n��G��l��W ���戍O0��n���n���n�3���n�3���n�<�  ��p� ��l���l���5`�����҈��nE$��p� ��D$0��$H  ���D$��\$`��n���p� ��l$P��}���t$��|$ ���L$0������~���d$p���$�   ��p�9��'��~����$�   ��W�݄$�   ��������$�   ��L$����݄$�   ���$�   ������m�����~�݄$�   ���$�   ��������݄$�   ������p�9������~���/������3ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   ������\$ �����$�   ݄$�   �������D$@���$�   ������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ������]�������$�   ݄$�   ������$
���$�   ��݄$�   ���$�   ��������݄$�   ������d$p��������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��U���|
 ���|$P���$�   ���d$`���$�   ���l$0������~���p�9��m���~���7��~����$�   ݄$�   ��������$�   ����;݄$�   �������$�   �݄$�   ���$�   ��������݄$�   �������$�   ��������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������p�9������/������~�ݜ$�   ������#�������$�   ݜ$�   ���$�   ���$�   ݄$�   ������M�������$�   ݄$�   ������|
@���$�   ��݄$�   ���$�   ��������݄$�   ������o|$P��������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ��������$�   ��������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ��M���t
`��ot$`����$�   ���l$0������~����$�   ��p�9��~���'���$�   ݄$�   ��������$�   ����;݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������m�������~���p�9������/��~�ݜ$�   ���$�   ������3����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   ���$�   ������݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ������]�������$�   ݄$�   �������
�   ���$�   ��݄$�   ���$�   ��������݄$�   ������od$P��������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ����$�   ��oD$`��E�����$�   ���
�   ����$�   ���l$0������p�9��~���~���m���p�9����~����$�   �����~����$�   ݄$�   ��������$�   ����+f���'݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   �����$�   ���̓�������ݜ$�   �������$�   ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   ��W����$�   ����\$@����݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   ��������}���D$���$�   ݄$�   ���$�   �������
�   ����݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ����݄$�   ������L$ �����$�   ݄$�   ��������$�   ������݄$�   �������T$`��������ݜ$�   �������$�   ����ݜ$�   ���$�   ��]����
�   ��   ���d$P;��'�����$�   ��$H  �T$�J;�$�   �v  ��$�   +T$��$�   ����<  ��$�   �ˋD$�T$���ҋ�$�   ����t$�����<�����������n���n���b��<��nٍt�    ���  ��l����n���n�3���b���n���l�3���nU$��p� ��p� ��p� �|$��T$0��\$ ��$H  ��}-�����}����|$0������������~���p�9���L$ ��~���;���$�   ݄$�   ��������$�   �������݄$�   ���$�   ������݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��m����� ;�������|$��$�   ��$H  �L$�����T$;�$�   �  ������W�����г��t$�$�����|$��$H  �������$�   ���  ��M$ÉD$�ωT$�T$�$�t$�|$G�3�����$�   ݄$�   ��������$�   ��݄$�   ���$�   ����\$��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��,��;�$�   �T�����$�   ��$H  �U������N�����|1�����Z-  3Ʌ��?9  �t$�|$�T$��$�   ��$H  �E$3ҋ�$�  ���$������$H  ��W�����W�����W�����W��|$(E,�T$ �t$�\$$�L$�<$�\$ ����B|$��<����  ��\�����  ���������Y���Y���������L��\���Y�������Y�������L ��|��\���|0��Y���\�������Y�������Y���t ������Y�������\0\$(�\$ ;�$�   �,  ����  ����+  ��3ۉT$�����Wɋ���W���W���W҉D$�T$(�Ã���������}D�����e<
��Y����������Y���y������X���E\
������������Y���Y�������X���i ��U|
 ��������Y���Y�������X���i0��U|
0�����Y������Y�����L$$��X�;��C�����}���}���}���}���X���X���X���X׋D$�T$�L$(��;�������F����<������Y����������Y�������|��X���Y�������Y�������X���t ��Y�������Y�������X���|0��Y�������Y�����L$(��X�;��u���������W���W���W���W��n�������  �E� �Ѓ���T$�*
  �ʍQ�����t
����$�   ���=E  �Ӌ����������������$�   ��$H  �����n����n   ��p� ��l$`��n�k����n���b���l���p� ��L$P����������n����d$0��n����nǋ��������n��3���b���l���n���n���T$ ��b���b���l���l���`����o=�����|$��n}$��p� ��|$@��o�����o�����o������$�   ���$�   ���$�   ���$�   ��}���T$p���$�   ��oD$@�����L$P������$�   ��~���p�9��L$p��~������$�   ��W�݄$�   ��������$�   ����#݄$�   ���$�   ���������݄$�   ���$�   ��������݄$�   ��������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ��������  ݄$�   �������$�   �����$�   ݄$�   ��������$�   ������݄$�   �������l$ ��������ݜ$�   �������$�   ����ݜ$�   ���$�   ���   ���|$��~���p�9��~���/��;���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ������  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ��������$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���  ����$�   ��~���p�9��~���/��;���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ������  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������o�$�   ��������������~�ݜ$�   �������$�   ����ݜ$�   ���$�   ���   ��p�9��~���?���$�   ݄$�   ��������$�   ����݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ������  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��o\$`���|$P������|$P��o|$0����$�   �������0  ���$�   ���D$ ���L$����$�   ����$�   ��D$ ��L$���$�   ���$�   ���$�   ;��2�����$H  ����;�$�   ��  �T$�Ӌ�������������W���г�U$�4$�|$��$�  �4:�t$�����4[���։T$��$H  �|$�T$�$�E$�|$�4��0��t7���$�   A݄$�   ��������$�   ��݄$�   ���$�   ���������݄$�   ���$�   ��������݄$�   ���̋|$��������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ������d7 ����  ���݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ���̋|$��������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ��������  ��\70݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ��������  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ����\$��������ݜ$�   �������$�   ����ݜ$�   ���$�   ����  ��@;�$�   �y�����$�  ��$H  ;D$�Y  ��+T$��$�   ���;  �ˋ|$��$�  ������������t$�4
�����n���n���l���n־@   ��n��G��l��W ���戍O0��n���n���n�3���n�3���n�<�  ��p� ��l���l���5`�����҈��nE$��p� ��D$0��$H  ���D$��\$`��n���p� ��l$P��}���t$��|$ ���L$0������~���d$p���$�   ��p�9��'��~����$�   ��W�݄$�   ��������$�   ��L$����݄$�   ���$�   ������m�����~�݄$�   ���$�   ��������݄$�   ������p�9������~���/������3ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   ������\$ �����$�   ݄$�   �������D$@���$�   ������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ������]�������$�   ݄$�   ������$
���$�   ��݄$�   ���$�   ��������݄$�   ������d$p��������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��U���|
 ���|$P���$�   ���d$`���$�   ���l$0������~���p�9��m���~���7��~����$�   ݄$�   ��������$�   ����;݄$�   �������$�   �
	 * given size (width, height) and the same `radius` for all corners.
	 * @param {CanvasRenderingContext2D} ctx - The canvas 2D Context.
	 * @param {number} x - The x axis of the coordinate for the rectangle starting point.
	 * @param {number} y - The y axis of the coordinate for the rectangle starting point.
	 * @param {number} width - The rectangle's width.
	 * @param {number} height - The rectangle's height.
	 * @param {number} radius - The rounded amount (in pixels) for the four corners.
	 * @todo handle `radius` as top-left, top-right, bottom-right, bottom-left array/object?
	 */
	roundedRect: function(ctx, x, y, width, height, radius) {
		if (radius) {
			var r = Math.min(radius, height / 2, width / 2);
			var left = x + r;
			var top = y + r;
			var right = x + width - r;
			var bottom = y + height - r;

			ctx.moveTo(x, top);
			if (left < right && top < bottom) {
				ctx.arc(left, top, r, -PI, -HALF_PI);
				ctx.arc(right, top, r, -HALF_PI, 0);
				ctx.arc(right, bottom, r, 0, HALF_PI);
				ctx.arc(left, bottom, r, HALF_PI, PI);
			} else if (left < right) {
				ctx.moveTo(left, y);
				ctx.arc(right, top, r, -HALF_PI, HALF_PI);
				ctx.arc(left, top, r, HALF_PI, PI + HALF_PI);
			} else if (top < bottom) {
				ctx.arc(left, top, r, -PI, 0);
				ctx.arc(left, bottom, r, 0, PI);
			} else {
				ctx.arc(left, top, r, -PI, PI);
			}
			ctx.closePath();
			ctx.moveTo(x, y);
		} else {
			ctx.rect(x, y, width, height);
		}
	},

	drawPoint: function(ctx, style, radius, x, y, rotation) {
		var type, xOffset, yOffset, size, cornerRadius;
		var rad = (rotation || 0) * RAD_PER_DEG;

		if (style && typeof style === 'object') {
			type = style.toString();
			if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(rad);
				ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
				ctx.restore();
				return;
			}
		}

		if (isNaN(radius) || radius <= 0) {
			return;
		}

		ctx.beginPath();

		switch (style) {
		// Default includes circle
		default:
			ctx.arc(x, y, radius, 0, DOUBLE_PI);
			ctx.closePath();
			break;
		case 'triangle':
			ctx.moveTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
			rad += TWO_THIRDS_PI;
			ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
			rad += TWO_THIRDS_PI;
			ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
			ctx.closePath();
			break;
		case 'rectRounded':
			// NOTE: the rounded rect implementation changed to use `arc` instead of
			// `quadraticCurveTo` since it generates better results when rect is
			// almost a circle. 0.516 (instead of 0.5) produces results with visually
			// closer proportion to the previous impl and it is inscribed in the
			// circle with `radius`. For more details, see the following PRs:
			// https://github.com/chartjs/Chart.js/issues/5597
			// https://github.com/chartjs/Chart.js/issues/5858
			cornerRadius = radius * 0.516;
			size = radius - cornerRadius;
			xOffset = Math.cos(rad + QUARTER_PI) * size;
			yOffset = Math.sin(rad + QUARTER_PI) * size;
			ctx.arc(x - xOffset, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
			ctx.arc(x + yOffset, y - xOffset, cornerRadius, rad - HALF_PI, rad);
			ctx.arc(x + xOffset, y + yOffset, cornerRadius, rad, rad + HALF_PI);
			ctx.arc(x - yOffset, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
			ctx.closePath();
			break;
		case 'rect':
			if (!rotation) {
				size = Math.SQRT1_2 * radius;
				ctx.rect(x - size, y - size, 2 * size, 2 * size);
				break;
			}
			rad += QUARTER_PI;
			/* falls through */
		case 'rectRot':
			xOffset = Math.cos(rad) * radius;
			yOffset = Math.sin(rad) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + yOffset, y - xOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			ctx.lineTo(x - yOffset, y + xOffset);
			ctx.closePath();
			break;
		case 'crossRot':
			rad += QUARTER_PI;
			/* falls through */
		case 'cross':
			xOffset = Math.cos(rad) * radius;
			yOffset = Math.sin(rad) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			ctx.moveTo(x + yOffset, y - xOffset);
			ctx.lineTo(x - yOffset, y + xOffset);
			break;
		case 'star':
			xOffset = Math.cos(rad) * radius;
			yOffset = Math.sin(rad) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			ctx.moveTo(x + yOffset, y - xOffset);
			ctx.lineTo(x - yOffset, y + xOffset);
			rad += QUARTER_PI;
			xOffset = Math.cos(rad) * radius;
			yOffset = Math.sin(rad) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			ctx.moveTo(x + yOffset, y - xOffset);
			ctx.lineTo(x - yOffset, y + xOffset);
			break;
		case 'line':
			xOffset = Math.cos(rad) * radius;
			yOffset = Math.sin(rad) * radius;
			ctx.moveTo(x - xOffset, y - yOffset);
			ctx.lineTo(x + xOffset, y + yOffset);
			break;
		case 'dash':
			ctx.moveTo(x, y);
			ctx.lineTo(x + Math.cos(rad) * radius, y + Math.sin(rad) * radius);
			break;
		}

		ctx.fill();
		ctx.stroke();
	},

	/**
	 * Returns true if the point is inside the rectangle
	 * @param {object} point - The point to test
	 * @param {object} area - The rectangle
	 * @returns {boolean}
	 * @private
	 */
	_isPointInArea: function(point, area) {
		var epsilon = 1e-6; // 1e-6 is margin in pixels for accumulated error.

		return point.x > area.left - epsilon && point.x < area.right + epsilon &&
			point.y > area.top - epsilon && point.y < area.bottom + epsilon;
	},

	clipArea: function(ctx, area) {
		ctx.save();
		ctx.beginPath();
		ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
		ctx.clip();
	},

	unclipArea: function(ctx) {
		ctx.restore();
	},

	lineTo: function(ctx, previous, target, flip) {
		var stepped = target.steppedLine;
		if (stepped) {
			if (stepped === 'middle') {
				var midpoint = (previous.x + target.x) / 2.0;
				ctx.lineTo(midpoint, flip ? target.y : previous.y);
				ctx.lineTo(midpoint, flip ? previous.y : target.y);
			} else if ((stepped === 'after' && !flip) || (stepped !== 'after' && flip)) {
				ctx.lineTo(previous.x, target.y);
			} else {
				ctx.lineTo(target.x, previous.y);
			}
			ctx.lineTo(target.x, target.y);
			return;
		}

		if (!target.tension) {
			ctx.lineTo(target.x, target.y);
			return;
		}

		ctx.bezierCurveTo(
			flip ? previous.controlPointPreviousX : previous.controlPointNextX,
			flip ? previous.controlPointPreviousY : previous.controlPointNextY,
			flip ? target.controlPointNextX : target.controlPointPreviousX,
			flip ? target.controlPointNextY : target.controlPointPreviousY,
			target.x,
			target.y);
	}
};

var helpers_canvas = exports$1;

// DEPRECATIONS

/**
 * Provided for backward compatibility, use Chart.helpers.canvas.clear instead.
 * @namespace Chart.helpers.clear
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers_core.clear = exports$1.clear;

/**
 * Provided for backward compatibility, use Chart.helpers.canvas.roundedRect instead.
 * @namespace Chart.helpers.drawRoundedRectangle
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers_core.drawRoundedRectangle = function(ctx) {
	ctx.beginPath();
	exports$1.roundedRect.apply(exports$1, arguments);
};

var defaults = {
	/**
	 * @private
	 */
	_set: function(scope, values) {
		return helpers_core.merge(this[scope] || (this[scope] = {}), values);
	}
};

// TODO(v3): remove 'global' from namespace.  all default are global and
// there's inconsistency around which options are under 'global'
defaults._set('global', {
	defaultColor: 'rgba(0,0,0,0.1)',
	defaultFontColor: '#666',
	defaultFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
	defaultFontSize: 12,
	defaultFontStyle: 'normal',
	defaultLineHeight: 1.2,
	showLines: true
});

var core_defaults = defaults;

var valueOrDefault = helpers_core.valueOrDefault;

/**
 * Converts the given font object into a CSS font string.
 * @param {object} font - A font object.
 * @return {string} The CSS font string. See https://developer.mozilla.org/en-US/docs/Web/CSS/font
 * @private
 */
function toFontString(font) {
	if (!font || helpers_core.isNullOrUndef(font.size) || helpers_core.isNullOrUndef(font.family)) {
		return null;
	}

	return (font.style ? font.style + ' ' : '')
		+ (font.weight ? font.weight + ' ' : '')
		+ font.size + 'px '
		+ font.family;
}

/**
 * @alias Chart.helpers.options
 * @namespace
 */
var helpers_options = {
	/**
	 * Converts the given line height `value` in pixels for a specific font `size`.
	 * @param {number|string} value - The lineHeight to parse (eg. 1.6, '14px', '75%', '1.6em').
	 * @param {number} size - The font size (in pixels) used to resolve relative `value`.
	 * @returns {number} The effective line height in pixels (size * 1.2 if value is invalid).
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
	 * @since 2.7.0
	 */
	toLineHeight: function(value, size) {
		var matches = ('' + value).match(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
		if (!matches || matches[1] === 'normal') {
			return size * 1.2;
		}

		value = +matches[2];

		switch (matches[3]) {
		case 'px':
			return value;
		case '%':
			value /= 100;
			break;
		}

		return size * value;
	},

	/**
	 * Converts the given value into a padding object with pre-computed width/height.
	 * @param {number|object} value - If a number, set the value to all TRBL component,
	 *  else, if and object, use defined properties and sets undefined ones to 0.
	 * @returns {object} The padding values (top, right, bottom, left, width, height)
	 * @since 2.7.0
	 */
	toPadding: function(value) {
		var t, r, b, l;

		if (helpers_core.isObject(value)) {
			t = +value.top || 0;
			r = +value.right || 0;
			b = +value.bottom || 0;
			l = +value.left || 0;
		} else {
			t = r = b = l = +value || 0;
		}

		return {
			top: t,
			right: r,
			bottom: b,
			left: l,
			height: t + b,
			width: l + r
		};
	},

	/**
	 * Parses font options and returns the font object.
	 * @param {object} options - A object that contains font options to be parsed.
	 * @return {object} The font object.
	 * @todo Support font.* options and renamed to toFont().
	 * @private
	 */
	_parseFont: function(options) {
		var globalDefaults = core_defaults.global;
		var size = valueOrDefault(options.fontSize, globalDefaults.defaultFontSize);
		var font = {
			family: valueOrDefault(options.fontFamily, globalDefaults.defaultFontFamily),
			lineHeight: helpers_core.options.toLineHeight(valueOrDefault(options.lineHeight, globalDefaults.defaultLineHeight), size),
			size: size,
			style: valueOrDefault(options.fontStyle, globalDefaults.defaultFontStyle),
			weight: null,
			string: ''
		};

		font.string = toFontString(font);
		return font;
	},

	/**
	 * Evaluates the given `inputs` sequentially and returns the first defined value.
	 * @param {Array} inputs - An array of values, falling back to the last value.
	 * @param {object} [context] - If defined and the current value is a function, the value
	 * is called with `context` as first argument and the result becomes the new input.
	 * @param {number} [index] - If defined and the current value is an array, the value
	 * at `index` become the new input.
	 * @param {object} [info] - object to return information about resolution in
	 * @param {boolean} [info.cacheable] - Will be set to `false` if option is not cacheable.
	 * @since 2.7.0
	 */
	resolve: function(inputs, context, index, info) {
		var cacheable = true;
		var i, ilen, value;

		for (i = 0, ilen = inputs.length; i < ilen; ++i) {
			value = inputs[i];
			if (value === undefined) {
				continue;
			}
			if (context !== undefined && typeof value === 'function') {
				value = value(context);
				cacheable = false;
			}
			if (index !== undefined && helpers_core.isArray(value)) {
				value = value[index];
				cacheable = false;
			}
			if (value !== undefined) {
				if (info && !cacheable) {
					info.cacheable = false;
				}
				return value;
			}
		}
	}
};

/**
 * @alias Chart.helpers.math
 * @namespace
 */
var exports$2 = {
	/**
	 * Returns an array of factors sorted from 1 to sqrt(value)
	 * @private
	 */
	_factorize: function(value) {
		var result = [];
		var sqrt = Math.sqrt(value);
		var i;

		for (i = 1; i < sqrt; i++) {
			if (value % i === 0) {
				result.push(i);
				result.push(value / i);
			}
		}
		if (sqrt === (sqrt | 0)) { // if value is a square number
			result.push(sqrt);
		}

		result.sort(function(a, b) {
			return a - b;
		}).pop();
		return result;
	},

	log10: Math.log10 || function(x) {
		var exponent = Math.log(x) * Math.LOG10E; // Math.LOG10E = 1 / Math.LN10.
		// Check for whole powers of 10,
		// which due to floating point rounding error should be corrected.
		var powerOf10 = Math.round(exponent);
		var isPowerOf10 = x === Math.pow(10, powerOf10);

		return isPowerOf10 ? powerOf10 : exponent;
	}
};

var helpers_math = exports$2;

// DEPRECATIONS

/**
 * Provided for backward compatibility, use Chart.helpers.math.log10 instead.
 * @namespace Chart.helpers.log10
 * @deprecated since version 2.9.0
 * @todo remove at version 3
 * @private
 */
helpers_core.log10 = exports$2.log10;

var getRtlAdapter = function(rectX, width) {
	return {
		x: function(x) {
			return rectX + rectX + width - x;
		},
		setWidth: function(w) {
			width = w;
		},
		textAlign: function(align) {
			if (align === 'center') {
				return align;
			}
			return align === 'right' ? 'left' : 'right';
		},
		xPlus: function(x, value) {
			return x - value;
		},
		leftForLtr: function(x, itemWidth) {
			return x - itemWidth;
		},
	};
};

var getLtrAdapter = function() {
	return {
		x: function(x) {
			return x;
		},
		setWidth: function(w) { // eslint-disable-line no-unused-vars
		},
		textAlign: function(align) {
			return align;
		},
		xPlus: function(x, value) {
			return x + value;
		},
		leftForLtr: function(x, _itemWidth) { // eslint-disable-line no-unused-vars
			return x;
		},
	};
};

var getAdapter = function(rtl, rectX, width) {
	return rtl ? getRtlAdapter(rectX, width) : getLtrAdapter();
};

var overrideTextDirection = function(ctx, direction) {
	var style, original;
	if (direction === 'ltr' || direction === 'rtl') {
		style = ctx.canvas.style;
		original = [
			style.getPropertyValue('direction'),
			style.getPropertyPriority('direction'),
		];

		style.setProperty('direction', direction, 'important');
		ctx.prevTextDirection = original;
	}
};

var restoreTextDirection = function(ctx) {
	var original = ctx.prevTextDirection;
	if (original !== undefined) {
		delete ctx.prevTextDirection;
		ctx.canvas.style.setProperty('direction', original[0], original[1]);
	}
};

var helpers_rtl = {
	getRtlAdapter: getAdapter,
	overrideTextDirection: overrideTextDirection,
	restoreTextDirection: restoreTextDirection,
};

var helpers$1 = helpers_core;
var easing = helpers_easing;
var canvas = helpers_canvas;
var options = helpers_options;
var math = helpers_math;
var rtl = helpers_rtl;
helpers$1.easing = easing;
helpers$1.canvas = canvas;
helpers$1.options = options;
helpers$1.math = math;
helpers$1.rtl = rtl;

function interpolate(start, view, model, ease) {
	var keys = Object.keys(model);
	var i, ilen, key, actual, origin, target, type, c0, c1;

	for (i = 0, ilen = keys.length; i < ilen; ++i) {
		key = keys[i];

		target = model[key];

		// if a value is added to the model after pivot() has been called, the view
		// doesn't contain it, so let's initialize the view to the target value.
		if (!view.hasOwnProperty(key)) {
			view[key] = target;
		}

		actual = view[key];

		if (actual === target || key[0] === '_') {
			continue;
		}

		if (!start.hasOwnProperty(key)) {
			start[key] = actual;
		}

		origin = start[key];

		type = typeof 