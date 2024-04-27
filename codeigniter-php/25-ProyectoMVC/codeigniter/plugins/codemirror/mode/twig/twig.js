// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"),  require("../../addon/mode/multiplex"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../../addon/mode/multiplex"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode("twig:inner", function() {
    var keywords = ["and", "as", "autoescape", "endautoescape", "block", "do", "endblock", "else", "elseif", "extends", "for", "endfor", "embed", "endembed", "filter", "endfilter", "flush", "from", "if", "endif", "in", "is", "include", "import", "not", "or", "set", "spaceless", "endspaceless", "with", "endwith", "trans", "endtrans", "blocktrans", "endblocktrans", "macro", "endmacro", "use", "verbatim", "endverbatim"],
        operator = /^[+\-*&%=<>!?|~^]/,
        sign = /^[:\[\(\{]/,
        atom = ["true", "false", "null", "empty", "defined", "divisibleby", "divisible by", "even", "odd", "iterable", "sameas", "same as"],
        number = /^(\d[+\-\*\/])?\d+(\.\d+)?/;

    keywords = new RegExp("((" + keywords.join(")|(") + "))\\b");
    atom = new RegExp("((" + atom.join(")|(") + "))\\b");

    function tokenBase (stream, state) {
      var ch = stream.peek();

      //Comment
      if (state.incomment) {
        if (!stream.skipTo("#}")) {
          stream.skipToEnd();
        } else {
          stream.eatWhile(/\#|}/);
          state.incomment = false;
        }
        return "comment";
      //Tag
      } else if (state.intag) {
        //After operator
        if (state.operator) {
          state.operator = false;
          if (stream.match(atom)) {
            return "atom";
          }
          if (stream.match(number)) {
            return "number";
          }
        }
        //After sign
        if (state.sign) {
          state.sign = false;
          if (stream.match(atom)) {
            return "atom";
          }
          if (stream.match(number)) {
            return "number";
          }
        }

        if (state.instring) {
          if (ch == state.instring) {
            state.instring = false;
          }
          stream.next();
          return "string";
        } else if (ch == "'" || ch == '"') {
          state.instring = ch;
          stream.next();
          return "string";
        } else if (stream.match(state.intag + "}") || stream.eat("-") && stream.match(state.intag + "}")) {
          state.intag = false;
          return "tag";
        } else if (stream.match(operator)) {
          state.operator = true;
          return "operator";
        } else if (stream.match(sign)) {
          state.sign = true;
        } else {
          if (stream.eat(" ") || stream.sol()) {
            if (stream.match(keywords)) {
              return "keyword";
            }
            if (stream.match(atom)) {
              return "atom";
            }
            if (stream.match(number)) {
              return "number";
            }
            if (stream.sol()) {
              stream.next();
            }
          } else {
            stream.next();
          }

        }
        return "variable";
      } else if (stream.eat("{")) {
        if (stream.eat("#")) {
          state.incomment = true;
          if (!stream.skipTo("#}")) {
            stream.skipToEnd();
          } else {
            stream.eatWhile(/\#|}/);
            state.incomment = false;
          }
          return "comment";
        //Open tag
        } else if (ch = stream.eat(/\{|%/)) {
          //Cache close tag
          state.intag = ch;
          if (ch == "{") {
            state.intag = "}";
          }
          stream.eat("-");
          return "tag";
        }
      }
      stream.next();
    };

    return {
      startState: function () {
        return {};
      },
      token: function (stream, state) {
        return tokenBase(stream, state);
      }
    };
  });

  CodeMirror.defineMode("twig", function(config, parserConfig) {
    var twigInner = CodeMirror.getMode(config, "twig:inner");
    if (!parserConfig || !parserConfig.base) return twigInner;
    return CodeMirror.multiplexingMode(
      CodeMirror.getMode(config, parserConfig.base), {
        open: /\{[{#%]/, close: /[}#%]\}/, mode: twigInner, parseDelimiters: true
      }
    );
  });
  CodeMirror.defineMIME("text/x-twig", "twig");
});
                                          M��F? �M�E�'�F? �M��E�(�F? �N �E�P�E�)�z���M��E�*Q�W�a�B �M��E�)��K �EP�E�P�M���f? �M��~? ��t1�Ģ? Pj�hd���M��4D? �E��E�+P�M�tI? �M��E�)��G? �M��~? ��u�E�P�M�PI? �{�? Pj�h����M���C? �N�E�M�j j P�E�,�$"? P�M��E�-�I? �M��E�,�G? j �EPj�M��[�? j �E�Pj �M��K�? jh   ������P�M���T? ������Ph�z�S��U�h��S��U���;}�th���S��U����M��E�)�#G? �M��E�(�G? �M�E�'�G? �M��E�%��F? �E�G;}��Q����]��u�h�V��U�V��U�������P�M�E�$��F? �M��E�#��K �E���+  ��t|�u�������j jjPj���E�.�|�$ �	� ;Ëu�j jj�������E�#   Pj���E�0�P�$ �	�8 ;Ëu�j jj�������E�#   Pj���E�2�$�$ �E�#   �}�j �O �@�A ��P�����M����j��G(P�4�����=8�u�ш' �M��E���E? �������E��? �M��E���E? �M������M������M�������0����E��? �M��E��E? �M��E��E? �M��E� �E? �M�E������@�K �M��_^d�    [��]� �\ ;������U��j�d�    h���P��+  d�%    辺~ SVW���M�E�    ��P��u#�E���̉��K �u���u�  ����  �O ���' ��u�P�A �M�����P�a,  �u�9������G��t	����   �E�    j h�|h�|j �u�E���~ ���M�P���K �E�    j h}h�|j �u�E����~ ���M�P��K �E��t���+  ��E��t	���+  �G�M��E�� �K �M��E� ���K ������j h  h`��j@�
���������u
j��
)L ���E���PV�����P�����O �E�P�]��u�����E��ZfE �M��E� ����K �O �E�P�P���� �E�u�=��( �p  �	 u� u�u#�O �E�P������E�� TE �M��E��4�K �G��t��t��
t� t�O �E�P������ �M��E��@[ ���K �O �E�P�������G	P�Gj VPj �E���eE ���t�A�E��U�   ���E��M�M��E�	��K �O �E�P�r���� �M��E�	�@[��K j\��~ ���E��E���t	���$(E �3��M��E�	�E���K �u܍M��E����K �M��E�	�F�K �G�M�jPj j �EP���E �M���dE �M���E���t!�A�E��U��������E��E�Hu�j�V�Ӂ���E�E���PQ�$��S��  �E���̉���K S���  �E���̉���K S�������P�5  �E���̉���K S�]�����PS���R  �M��:dE �����E�̉��K V�������PS�y����E�G��t
��t��u'�O �E�P�s����GP�E��I~B �M��E���K �_�w;�t�I ���j ���;�u�G�M��G�3? �M���? �M��E� ���K �]�M�E��������K �M��_^d�    [��]� ��������U��j�hi��d�    Pd�%    ��@SVW�e�j h????h????�E�    藨L �����u�M��E��>? �]�E�j jjP���E��K"? S�����L S��K  ���E��j�~�L ����R��Q�L ���f�M V���E�    ����   ��h�   �]��}�~ ���E��E���t��� ������E��3��}��E���u
j��%L ��j`�C�~ �����u��E�����   �N�����? �F  �NT�E��(����=? �NX�E���=? ����F$ �F0   �F4    �F8  �F)  f�FD�FL    �FH    f�FP  �FR �F\    �F<    �F@    �F(�3��u��E���u
j��F$L ���M��F$ ��0 f�FD�>�M �FH�F �FQ�,����u�FR�E�MЉE����K �uй(�"�E��G�K �M��E���K �u�O�0? WVj!���M P�M��^� �E�    �`�"�u�E�	�@�`�"�A�E�Ef�@f�A�M�w?  ���WVj j j �E�
�P0�M�E�	��?  ����E�   �P(���j �PL�`�"�M��@ �`�"f�H��t���j����j����j��M��E��>? �M�������M�E��������K ��M�d�    _^[��]� �`�"�@ �`�"f�E�f�A�M���t�j��M�j���M؅�t�j���(;ÍM��E�   �V �M��E��=? �M��e����M�E������F�K �M�2�_^d�    [��]� �U��j�h퟼d�    Pd�%    ���  S��3�VW�M�M��M��M��J;? �E�E��Hf�����   Q�o1 ���M��j Q���R@�E�P�E�P�"�? ��P�M��E��R>? �M��E���<? �E�P�M����? �E�@�E�P�a�~ ���uă}��M��E�CM�@PQV�E��HV�V�uV�U�����M��"���}��E�r�u��Ұ~ ����uj V�U�����K ��t���P�n����E����B ���E���t�����p���� �K �M��H:? �E��E�    ���M ��t�/�M �E��M��t���+  ��u�K�E�    ����	  ���$    ��|�����? ��x����E���9? �M��E���9? �M��E�	��9? �M��E�
��9? �M��E��9? �K ��4���P�E���m���M��E�Q�u܋聽B ��4����E��2�K �M�E�j jjP� ? �M�舀? �E�P�E�P�M���Y? �E�P�M��<|? �M���q? ��t1軕? Pj�h<���M��+7? �E��E�P�M��k<? �M��E���:? �M��q? ��t1�~�? Pj�hd���M���6? �E��E�P�M��.<? �M��E��:? �M��Zq? ��u�E�P�M��
<? �5�? Pj�h����M��6? j �E��E�Pj�M��A�? j �E�Pj �M��1�? �{
ujh<r�h8r��M��7�? ��? Pj�h����M��R6? j �E��E�Pj�M���? j �E�Pj �M��ށ? j �E�Pj�M��΁? jh,  ��,���P�M���H? j�M���q? @�M�P������P�=G? �M��q? Ƅ���� �C����   ����   ����   �E�P��T���P�?  ����T����E��? ��t��T���P�M� ��j j�E�P��T�����? �E��E�P�M��:? ��T���P��|����? j�M��q? @�M�P������P�F? �M��q? �M��E�Ƅ���� ��8? ��T�����  ��������	? �������E�P�x� ��|���P�E�P������P��#? ���M���6? j jj�E��E�P��|����m? �M���}? �0�? Pj�hІ��M��4? j �E��E�Pj�M��<�? j �E�Pj �M��,�? j �E�Pj�M���? �E�P��T���P��}  ����T����E��:? ����   ��T���P��� ������   j j �E�P��T����h? �E�菒? Pj�hІ��M���3? �E��E�P�M��?9? �M��E���7? j �E�Pj�M��? j �E�Pj �M��s? j �E�Pj�M��c? �M��E��7? ��T���P��|�����	? j�M��[o? @�M�P������P��D? �M��Bo? ��T����E�Ƅ���� �	? �M��E��/7? �M��E��#7? �������E���? �E��E�����P������P������PV�Q������������赃 �E���t#�}� uj �u�������P��  P�?oF ���h�   h�   h�   ��������� ����������P�����M���@ �K ��<���P�E��h���u܋u썍D���Q����E��u���B ���u�8 t���	  �E���u�E� �E�t�����D����E�E����K �E��E�   �t�����<����E����K �}� ��   �{
u5�K ��$���P�h���M�u܃��M�M��V�E��4�B ��	u	�E� ��u��E��E��E�   �t�����$����E��c�K �}� ��  �{�K ����P�E�@Ph��;��|���P��L���P�g��������E�VP��B �Dy  ���E���L�����K �l  �K �����P�^g���M��u܃��E��M�M���t�B ��u"�C��t��t��	t
��t��u�E���E� �E��E�   �t���������E���K �}� ��  �K �����P��f��j ��h  �E� ��t  VQ�u܉M̋�Q�B ������E��B�K �MRB ���RB ���t  ��l  3�ǃ�     f���  ���"�u�����"�Mh0�"�  �=�m= t&�E�� '   tƃ�Q �P�"ǃ�      �ƃ�Q  �P�" ǃ�     fǃ�  ����E ǃ�     ���,�����   ��   ��h  ���"�K P��e�����h  jV�u��E�!�u��5�B ��,����E��F�K �Mh0�"�&  �=�m= t�E�� '   ��   �3�����E��E� �u�9�p  ~v��$    3�9�t  ~\��    ��l  �u�������0'  ���u�E���}� ���u�t�Ẽ��u�E�3��u�� ��u��1��B;�t  |�G;�p  |���|���P�K�)  �M��E���@ �������E��� �M��E��2? �M��E��2? �M��E��s2? �M��E�
�g2? �M��E�	�[2? �M��E��O2? ��x����E��@2? ��|����E��? �E܋u@�E�;�p����;����M��E��2? �M��E� �2? �M�E��������K �M�_^d�    [��]� �U��j�h@��d�    Pd�%    ��8���E�@�E�    ��t	���m  �E�    j h�|h�|j �u�E����~ ���M�P���K �E�    j h}h�|j �u�E��Ȯ~ ���M�P��K �Eԅ�t
���+  ��u�E܅���  ���+  ����  S�]VW�s �v�����C     �M��$/? �M��E���t�E�P�  �E���M܅�t"�E�P�  �E�P�M��=2? �M��E���0? �E�P�M���? �E�@�E�P�L�~ ���u�}��M��E�CM�@PQV�E��HV��C���E�C;Ctb��I �8�΋׊:u��t�Z:Yu������u�3��Ƀ���t#�M�y t	��D  t�]�WS�e8���������];Cu�S��@���3����t+�d$ ��`  ��tP�`����ǆ`      ��   ��uًs�{��t'��0  ��tP�/����ǆ0      ��   ��u�S���W�    �������    �M�����}�_^[r�u��ң~ ���M��E�   �E�    �E� �E��S/? �M��E���K �M��E� ��K �M�E��������K �M�d�    ��]� ������������U��j�hp��d�    Pd�%    ��  SVW�}2ۉM�w ��tW�   �	��$    ����  ��  u!��4  W�xS������t	W��M�����   ��  ��   ��D؅�u��}������u�E�x t��u�w ��������G     ���? Pj�hH���M��l*? �w�HV��E�    ��tZ�EVP�\? ��j j j j j�E��E�P�M�>? ��uj%��B�UL P��4  P�Ӄ��M�E� ��-? ��   ��u��]�{ ul�{	 uf�K j ��oA ��8 f.������D{F�u�K j �E    �oA Q��8 fZ��$�EWQ�$��J���E��WP�������? Pj�h|���M��t)? �M��E��h+? j �E��E�Pj �M��u? j�M��e? @�M�P������P�:? �M��e? ������h�   �D� ��P���  P�HV����E��M���,? �M��E� ��,? �M��E�������,? �M�_^[d�    ��]� ���̀y t3�A��t+��t&��t!��t��	t��t��t��t��t��2������VWh�+  ��躠~ ������V��  ���+  ���+  ���+   �����+  �����+  ���+  ���+   �����+  ���+  ���+  ���+  _���+  ^��������������VWh�+  ���:�~ ���O��Q�������_��^��������������VWh�+  ���
�~ ������V�5  ���+  �ƈ��+  ���+  ���+  ���+  _���+  ^����������VWh�+  ��躟~ ������V��  ���+  ��_���+  ^�����U��j�h���d�    Pd�%    ��VW�E�    ���uh4��V�E�    �� ���> �E�    �E�   ujh�   hh��h ���L ���SjhD���p��� ���+  ���? ��t0�> ujh�   hh��h ���vL ���ShRliF�p��Q� �GP�E�P��������E��E�   [;��;t3�> ujh�   hh��h ���#L ����p�E��PhX���K� �> ujh�   hh��h ����L ����p�G�Phh���'� �M��E� ��t!�A�E�U��������E�U�Ju�j��M��_^d�    ��]� �������U��j�h���d�    Pd�%    QVW�E�    ���uV�E�    �<����> �E�    �E�   ujh�   hh��h ���3L ����p���+  �Ph����w� �> ujh�   hh��h ����L ����p���+   �����Ph����:� �> ujh�   hh��h ���L ����p���+  �Ph؄��� �> ujh�   hh��h ���L ����p���+   �����Ph����ƴ �> ujh�   hh��h ���KL ����p���+  �Ph��菴 �> ujh�   hh��h ���L ����p���+  �Ph ���X� ���+  ���^? ��u0�> ujh�   hh��h ����L ���Wh0���q��� �M��_^d�    ��]� ���U��Q�u�E�    �m����E��]� ����U��j�h���d�    Pd�%    QVW�E�    ���uV�E�    �,����> �E�    �E�   ujh�   hh��h ���#L ����p���+  �Ph؄��g� �> ujh�   hh��h ����L ����p���+  �Ph���0� �> ujh�   hh��h ���L ����p���+  �Ph ����� ���+  ���\]? ��u0�> ujh�   hh��h ���mL ���Wh0���q��X� �M��_^d�    ��]� ����U��j�h���d�    Pd�%    QVW�E�    ��}W�E�    ������? ���+  �E�    �E�   ujh�   hh��h ����L ���Vh����y��� �M��_^d�    ��]� ����U��j�hѠ�d�    Pd�%    ���M�E�P�E�    �r? Q�E��E�   ��P� ? �u�'   ���M��E�   �E� �q%? �E�M�d�    ��]�U��j�h���d�    Pd�%    ��  V�E�    Q�E�E�   ��P�G ? ����������   h�+  �d�~ �����u��tt�����F    ���+  �E��D�����> h�+  �Fj P茛~ W������+  ������+  ǆ�+      f�Ffǆ�+  ����ǆ�+     �3���|����E���|����u�K ��d����E�P��|����� �u�΋�d����E���I�K ��d����E�   �E���K ��|����E����K �  ����   h�+  �d�~ ���E��E���t	���ǻ���3��M��E��E���K ��T����E�P�M��� �u�΋�T����E��軻K ��T����E�   �E��u�K �M��E��i�K �  ����   h�+  �ٗ~ ���E��E�	��t	��謳���3��M��E��E��Y�K ������E�
P�M��v� �u�΋�����E���0�K ������E�   �E�
��K �M��E��޺K ��  ����   h�+  �N�~ ���E��E���t	���!����3��M��E��E��κK ��D����E�P�M���� �u�΋�D����E��襺K ��D����E�   �E��_�K �M��E��S�K �o  h�+  ��u}�ǖ~ ���E��E���t	���Z����3��M��E��E��G�K ������E�P�M��d� �u�΋�����E����K ������E�   �E��عK �M��E��̹K ��  ��u}�E�~ ���E��E���t	���ȷ���3��M��E��E��ŹK ��4����E�P�M���� �u�΋�4����E��蜹K ��4����E�   �E��V�K �M��E��J�K �f  ��	��   迕~ ���E��E���t	��肸���3���t����E���t����9�K �������E�P��t����S� �u�΋������E����K �������E�   �E��ǸK ��t����E�踸K ��  ��
u}�1�~ ���E��E���t	���D����3��M��E��E�豸K ��$����E�P�M���� �u�΋�$����E��舸K ��$����E�   �E��B�K �M��E��6�K �R  ��u}诔~ ���E��E���t	�������3��M��E��E��/�K ��\����E�P�M��L� �u�΋�\����E����K ��\����E�   �E����K �M��E�贷K ��  ��u}�-�~ ���E��E���t	���`����3��M��E��E�護K ��L����E�P�M���� �u�΋�L����E� �脷K ��L����E�   �E��>�K �M��E��2�K �N  ��u}諓~ ���E��E�!��t	���^����3��M��E��E��+�K ��<����E�"P�M��H� �u�΋�<����E�#���K ��<����E�   �E�"輶K �M��E�谶K ��  ��u}�)�~ ���E��E�$��t	���,����3��M��E��E�詶K ��,����E�%P�M���� �u�΋�,����E�&�耶K ��,����E�   �E�%�:�K �M��E��.�K �J  ��u}角~ ���E��E�'��t	��芳���3��M��E��E��'�K ������E�(P�M��D� �u�΋�����E�)����K ������E�   �E�(踵K �M��E�謵K ��  ��u}�%�~ ���E��E�*��t	���h����3��M��E��E�襵K ������E�+P�M���� �u�΋�����E�,��|�K ������E�   �E�+�6�K �M��E��*�K �F  ��u}裑~ ���E��E�-��t	���F����3��M��E��E��#�K �������E�.P�M��@� �u�΋������E�/����K �������E�   �E�.贴K �M��E�訴K ��   ����   ��~ ���E��E�0��t	���@����3���l����E���l���藴K �������E�1P��l����� �u�΋������E�2��k�K �������E�   �E�1�%�K ��l����E���K �5藐~ ���E��E�3��t	���ʭ���3��u���E����K �E�   �M�E� �? �M��d�    ^��]��̸   ����������̸	   �����������U��Q�E�    �`v? �MPj�ĥ���? �E��]� �������U��Q�E�    �0v? �MPj�hЀ��? �E��]� �������U��Q�E�    � v? �MPj�h$���p? �E��]� �������U��Q�E�    ��u? �MPj�h\���@? �E��]� �������U��Q�E�    �u? �MPj�h���? �E��]� �������U��Q�E�    �pu? �MPj�hD����? �E��]� �������U��Q�E�    �@u? �MPj�h����? tring.call(a)});Array.prototype.includes||(Array.prototype.includes=mc);
String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")});String.prototype.includes||(String.prototype.includes=mc);u.util={throttle:function(a,b){var c=b!==q?b:200,d,e;return function(){var h=this,f=+new Date,g=arguments;d&&f<d+c?(clearTimeout(e),e=setTimeout(function(){d=q;a.apply(h,g)},c)):(d=f,a.apply(h,g))}},escapeRegex:function(a){return a.replace(vc,"\\$1")},set:function(a){if(l.isPlainObject(a))return u.util.set(a._);if(null===
a)return function(){};if("function"===typeof a)return function(c,d,e){a(c,"set",d,e)};if("string"!==typeof a||-1===a.indexOf(".")&&-1===a.indexOf("[")&&-1===a.indexOf("("))return function(c,d){c[a]=d};var b=function(c,d,e){e=cb(e);var h=e[e.length-1];for(var f,g,k=0,m=e.length-1;k<m;k++){if("__proto__"===e[k]||"constructor"===e[k])throw Error("Cannot set prototype values");f=e[k].match(Fa);g=e[k].match(sa);if(f){e[k]=e[k].replace(Fa,"");c[e[k]]=[];h=e.slice();h.splice(0,k+1);f=h.join(".");if(Array.isArray(d))for(g=
0,m=d.length;g<m;g++)h={},b(h,d[g],f),c[e[k]].push(h);else c[e[k]]=d;return}g&&(e[k]=e[k].replace(sa,""),c=c[e[k]](d));if(null===c[e[k]]||c[e[k]]===q)c[e[k]]={};c=c[e[k]]}if(h.match(sa))c[h.replace(sa,"")](d);else c[h.replace(Fa,"")]=d};return function(c,d){return b(c,d,a)}},get:function(a){if(l.isPlainObject(a)){var b={};l.each(a,function(d,e){e&&(b[d]=u.util.get(e))});return function(d,e,h,f){var g=b[e]||b._;return g!==q?g(d,e,h,f):d}}if(null===a)return function(d){return d};if("function"===typeof a)return function(d,
e,h,f){return a(d,e,h,f)};if("string"!==typeof a||-1===a.indexOf(".")&&-1===a.indexOf("[")&&-1===a.indexOf("("))return function(d,e){return d[a]};var c=function(d,e,h){if(""!==h){var f=cb(h);for(var g=0,k=f.length;g<k;g++){h=f[g].match(Fa);var m=f[g].match(sa);if(h){f[g]=f[g].replace(Fa,"");""!==f[g]&&(d=d[f[g]]);m=[];f.splice(0,g+1);f=f.join(".");if(Array.isArray(d))for(g=0,k=d.length;g<k;g++)m.push(c(d[g],e,f));d=h[0].substring(1,h[0].length-1);d=""===d?m:m.join(d);break}else if(m){f[g]=f[g].replace(sa,
"");d=d[f[g]]();continue}if(null===d||d[f[g]]===q)return q;d=d[f[g]]}}return d};return function(d,e){return c(d,e,a)}}};var S=function(a,b,c){a[b]!==q&&(a[c]=a[b])},Fa=/\[.*?\]$/,sa=/\(\)$/,na=u.util.get,ha=u.util.set,jb=u.util.escapeRegex,Qa=l("<div>")[0],sc=Qa.textContent!==q,tc=/<.*?>/g,hb=u.util.throttle,nc=[],N=Array.prototype,wc=function(a){var b,c=u.settings,d=l.map(c,function(h,f){return h.nTable});if(a){if(a.nTable&&a.oApi)return[a];if(a.nodeName&&"table"===a.nodeName.toLowerCase()){var e=
l.inArray(a,d);return-1!==e?[c[e]]:null}if(a&&"function"===typeof a.settings)return a.settings().toArray();"string"===typeof a?b=l(a):a instanceof l&&(b=a)}else return[];if(b)return b.map(function(h){e=l.inArray(this,d);return-1!==e?c[e]:null}).toArray()};var B=function(a,b){if(!(this instanceof B))return new B(a,b);var c=[],d=function(f){(f=wc(f))&&c.push.apply(c,f)};if(Array.isArray(a))for(var e=0,h=a.length;e<h;e++)d(a[e]);else d(a);this.context=Ma(c);b&&l.merge(this,b);this.selector={rows:null,
cols:null,opts:null};B.extend(this,this,nc)};u.Api=B;l.extend(B.prototype,{any:function(){return 0!==this.count()},concat:N.concat,context:[],count:function(){return this.flatten().length},each:function(a){for(var b=0,c=this.length;b<c;b++)a.call(this,this[b],b,this);return this},eq:function(a){var b=this.context;return b.length>a?new B(b[a],this[a]):null},filter:function(a){var b=[];if(N.filter)b=N.filter.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)a.call(this,this[c],c,this)&&b.push(this[c]);
return new B(this.context,b)},flatten:function(){var a=[];return new B(this.context,a.concat.apply(a,this.toArray()))},join:N.join,indexOf:N.indexOf||function(a,b){b=b||0;for(var c=this.length;b<c;b++)if(this[b]===a)return b;return-1},iterator:function(a,b,c,d){var e=[],h,f,g=this.context,k,m=this.selector;"string"===typeof a&&(d=c,c=b,b=a,a=!1);var n=0;for(h=g.length;n<h;n++){var p=new B(g[n]);if("table"===b){var t=c.call(p,g[n],n);t!==q&&e.push(t)}else if("columns"===b||"rows"===b)t=c.call(p,g[n],
this[n],n),t!==q&&e.push(t);else if("column"===b||"column-rows"===b||"row"===b||"cell"===b){var v=this[n];"column-rows"===b&&(k=Wa(g[n],m.opts));var x=0;for(f=v.length;x<f;x++)t=v[x],t="cell"===b?c.call(p,g[n],t.row,t.column,n,x):c.call(p,g[n],t,n,x,k),t!==q&&e.push(t)}}return e.length||d?(a=new B(g,a?e.concat.apply([],e):e),b=a.selector,b.rows=m.rows,b.cols=m.cols,b.opts=m.opts,a):this},lastIndexOf:N.lastIndexOf||function(a,b){return this.indexOf.apply(this.toArray.reverse(),arguments)},length:0,
map:function(a){var b=[];if(N.map)b=N.map.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)b.push(a.call(this,this[c],c));return new B(this.context,b)},pluck:function(a){return this.map(function(b){return b[a]})},pop:N.pop,push:N.push,reduce:N.reduce||function(a,b){return Cb(this,a,b,0,this.length,1)},reduceRight:N.reduceRight||function(a,b){return Cb(this,a,b,this.length-1,-1,-1)},reverse:N.reverse,selector:null,shift:N.shift,slice:function(){return new B(this.context,this)},sort:N.sort,
splice:N.splice,toArray:function(){return N.slice.call(this)},to$:function(){return l(this)},toJQuery:function(){return l(this)},unique:function(){return new B(this.context,Ma(this))},unshift:N.unshift});B.extend=function(a,b,c){if(c.length&&b&&(b instanceof B||b.__dt_wrapper)){var d,e=function(g,k,m){return function(){var n=k.apply(g,arguments);B.extend(n,n,m.methodExt);return n}};var h=0;for(d=c.length;h<d;h++){var f=c[h];b[f.name]="function"===f.type?e(a,f.val,f):"object"===f.type?{}:f.val;b[f.name].__dt_wrapper=
!0;B.extend(a,b[f.name],f.propExt)}}};B.register=y=function(a,b){if(Array.isArray(a))for(var c=0,d=a.length;c<d;c++)B.register(a[c],b);else{d=a.split(".");var e=nc,h;a=0;for(c=d.length;a<c;a++){var f=(h=-1!==d[a].indexOf("()"))?d[a].replace("()",""):d[a];a:{var g=0;for(var k=e.length;g<k;g++)if(e[g].name===f){g=e[g];break a}g=null}g||(g={name:f,val:{},methodExt:[],propExt:[],type:"object"},e.push(g));a===c-1?(g.val=b,g.type="function"===typeof b?"function":l.isPlainObject(b)?"object":"other"):e=h?
g.methodExt:g.propExt}}};B.registerPlural=J=function(a,b,c){B.register(a,c);B.register(b,function(){var d=c.apply(this,arguments);return d===this?this:d instanceof B?d.length?Array.isArray(d[0])?new B(d.context,d[0]):d[0]:q:d})};var oc=function(a,b){if(Array.isArray(a))return l.map(a,function(d){return oc(d,b)});if("number"===typeof a)return[b[a]];var c=l.map(b,function(d,e){return d.nTable});return l(c).filter(a).map(function(d){d=l.inArray(this,c);return b[d]}).toArray()};y("tables()",function(a){return a!==
q&&null!==a?new B(oc(a,this.context)):this});y("table()",function(a){a=this.tables(a);var b=a.context;return b.length?new B(b[0]):a});J("tables().nodes()","table().node()",function(){return this.iterator("table",function(a){return a.nTable},1)});J("tables().body()","table().body()",function(){return this.iterator("table",function(a){return a.nTBody},1)});J("tables().header()","table().header()",function(){return this.iterator("table",function(a){return a.nTHead},1)});J("tables().footer()","table().footer()",
function(){return this.iterator("table",function(a){return a.nTFoot},1)});J("tables().containers()","table().container()",function(){return this.iterator("table",function(a){return a.nTableWrapper},1)});y("draw()",function(a){return this.iterator("table",function(b){"page"===a?ja(b):("string"===typeof a&&(a="full-hold"===a?!1:!0),ka(b,!1===a))})});y("page()",function(a){return a===q?this.page.info().page:this.iterator("table",function(b){Ra(b,a)})});y("page.info()",function(a){if(0===this.context.length)return q;
a=this.context[0];var b=a._iDisplayStart,c=a.oFeatures.bPaginate?a._iDisplayLength:-1,d=a.fnRecordsDisplay(),e=-1===c;return{page:e?0:Math.floor(b/c),pages:e?1:Math.ceil(d/c),start:b,end:a.fnDisplayEnd(),length:c,recordsTotal:a.fnRecordsTotal(),recordsDisplay:d,serverSide:"ssp"===Q(a)}});y("page.len()",function(a){return a===q?0!==this.context.length?this.context[0]._iDisplayLength:q:this.iterator("table",function(b){kb(b,a)})});var pc=function(a,b,c){if(c){var d=new B(a);d.one("draw",function(){c(d.ajax.json())})}if("ssp"==
Q(a))ka(a,b);else{V(a,!0);var e=a.jqXHR;e&&4!==e.readyState&&e.abort();Oa(a,[],function(h){Ka(a);h=Aa(a,h);for(var f=0,g=h.length;f<g;f++)ia(a,h[f]);ka(a,b);V(a,!1)})}};y("ajax.json()",function(){var a=this.context;if(0<a.length)return a[0].json});y("ajax.params()",function(){var a=this.context;if(0<a.length)return a[0].oAjaxData});y("ajax.reload()",function(a,b){return this.iterator("table",function(c){pc(c,!1===b,a)})});y("ajax.url()",function(a){var b=this.context;if(a===q){if(0===b.length)return q;
b=b[0];return b.ajax?l.isPlainObject(b.ajax)?b.ajax.url:b.ajax:b.sAjaxSource}return this.iterator("table",function(c){l.isPlainObject(c.ajax)?c.ajax.url=a:c.ajax=a})});y("ajax.url().load()",function(a,b){return this.iterator("table",function(c){pc(c,!1===b,a)})});var ub=function(a,b,c,d,e){var h=[],f,g,k;var m=typeof b;b&&"string"!==m&&"function"!==m&&b.length!==q||(b=[b]);m=0;for(g=b.length;m<g;m++){var n=b[m]&&b[m].split&&!b[m].match(/[\[\(:]/)?b[m].split(","):[b[m]];var p=0;for(k=n.length;p<k;p++)(f=
c("string"===typeof n[p]?n[p].trim():n[p]))&&f.length&&(h=h.concat(f))}a=M.selector[a];if(a.length)for(m=0,g=a.length;m<g;m++)h=a[m](d,e,h);return Ma(h)},vb=function(a){a||(a={});a.filter&&a.search===q&&(a.search=a.filter);return l.extend({search:"none",order:"current",page:"all"},a)},wb=function(a){for(var b=0,c=a.length;b<c;b++)if(0<a[b].length)return a[0]=a[b],a[0].length=1,a.length=1,a.context=[a.context[b]],a;a.length=0;return a},Wa=function(a,b){var c=[],d=a.aiDisplay;var e=a.aiDisplayMaster;
var h=b.search;var f=b.order;b=b.page;if("ssp"==Q(a))return"removed"===h?[]:ra(0,e.length);if("current"==b)for(f=a._iDisplayStart,a=a.fnDisplayEnd();f<a;f++)c.push(d[f]);else if("current"==f||"applied"==f)if("none"==h)c=e.slice();else if("applied"==h)c=d.slice();else{if("removed"==h){var g={};f=0;for(a=d.length;f<a;f++)g[d[f]]=null;c=l.map(e,function(k){return g.hasOwnProperty(k)?null:k})}}else if("index"==f||"original"==f)for(f=0,a=a.aoData.length;f<a;f++)"none"==h?c.push(f):(e=l.inArray(f,d),(-1===
e&&"removed"==h||0<=e&&"applied"==h)&&c.push(f));return c},xc=function(a,b,c){var d;return ub("row",b,function(e){var h=hc(e),f=a.aoData;if(null!==h&&!c)return[h];d||(d=Wa(a,c));if(null!==h&&-1!==l.inArray(h,d))return[h];if(null===e||e===q||""===e)return d;if("function"===typeof e)return l.map(d,function(k){var m=f[k];return e(k,m._aData,m.nTr)?k:null});if(e.nodeName){h=e._DT_RowIndex;var g=e._DT_CellIndex;if(h!==q)return f[h]&&f[h].nTr===e?[h]:[];if(g)return f[g.row]&&f[g.row].nTr===e.parentNode?
[g.row]:[];h=l(e).closest("*[data-dt-row]");return h.length?[h.data("dt-row")]:[]}if("string"===typeof e&&"#"===e.charAt(0)&&(h=a.aIds[e.replace(/^#/,"")],h!==q))return[h.idx];h=kc(Ea(a.aoData,d,"nTr"));return l(h).filter(e).map(function(){return this._DT_RowIndex}).toArray()},a,c)};y("rows()",function(a,b){a===q?a="":l.isPlainObject(a)&&(b=a,a="");b=vb(b);var c=this.iterator("table",function(d){return xc(d,a,b)},1);c.selector.rows=a;c.selector.opts=b;return c});y("rows().nodes()",function(){return this.iterator("row",
function(a,b){return a.aoData[b].nTr||q},1)});y("rows().data()",function(){return this.iterator(!0,"rows",function(a,b){return Ea(a.aoData,b,"_aData")},1)});J("rows().cache()","row().cache()",function(a){return this.iterator("row",function(b,c){b=b.aoData[c];return"search"===a?b._aFilterData:b._aSortData},1)});J("rows().invalidate()","row().invalidate()",function(a){return this.iterator("row",function(b,c){wa(b,c,a)})});J("rows().indexes()","row().index()",function(){return this.iterator("row",function(a,
b){return b},1)});J("rows().ids()","row().id()",function(a){for(var b=[],c=this.context,d=0,e=c.length;d<e;d++)for(var h=0,f=this[d].length;h<f;h++){var g=c[d].rowIdFn(c[d].aoData[this[d][h]]._aData);b.push((!0===a?"#":"")+g)}return new B(c,b)});J("rows().remove()","row().remove()",function(){var a=this;this.iterator("row",function(b,c,d){var e=b.aoData,h=e[c],f,g;e.splice(c,1);var k=0;for(f=e.length;k<f;k++){var m=e[k];var n=m.anCells;null!==m.nTr&&(m.nTr._DT_RowIndex=k);if(null!==n)for(m=0,g=n.length;m<
g;m++)n[m]._DT_CellIndex.row=k}La(b.aiDisplayMaster,c);La(b.aiDisplay,c);La(a[d],c,!1);0<b._iRecordsDisplay&&b._iRecordsDisplay--;lb(b);c=b.rowIdFn(h._aData);c!==q&&delete b.aIds[c]});this.iterator("table",function(b){for(var c=0,d=b.aoData.length;c<d;c++)b.aoData[c].idx=c});return this});y("rows.add()",function(a){var b=this.iterator("table",function(d){var e,h=[];var f=0;for(e=a.length;f<e;f++){var g=a[f];g.nodeName&&"TR"===g.nodeName.toUpperCase()?h.push(Ja(d,g)[0]):h.push(ia(d,g))}return h},1),
c=this.rows(-1);c.pop();l.merge(c,b);return c});y("row()",function(a,b){return wb(this.rows(a,b))});y("row().data()",function(a){var b=this.context;if(a===q)return b.length&&this.length?b[0].aoData[this[0]]._aData:q;var c=b[0].aoData[this[0]];c._aData=a;Array.isArray(a)&&c.nTr&&c.nTr.id&&ha(b[0].rowId)(a,c.nTr.id);wa(b[0],this[0],"data");return this});y("row().node()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]].nTr||null:null});y("row.add()",function(a){a instanceof
l&&a.length&&(a=a[0]);var b=this.iterator("table",function(c){return a.nodeName&&"TR"===a.nodeName.toUpperCase()?Ja(c,a)[0]:ia(c,a)});return this.row(b[0])});l(A).on("plugin-init.dt",function(a,b){var c=new B(b);c.on("stateSaveParams",function(d,e,h){d=c.rows().iterator("row",function(f,g){return f.aoData[g]._detailsShow?g:q});h.childRows=c.rows(d).ids(!0).toArray()});(a=c.state.loaded())&&a.childRows&&c.rows(a.childRows).every(function(){F(b,null,"requestChild",[this])})});var yc=function(a,b,c,
d){var e=[],h=function(f,g){if(Array.isArray(f)||f instanceof l)for(var k=0,m=f.length;k<m;k++)h(f[k],g);else f.nodeName&&"tr"===f.nodeName.toLowerCase()?e.push(f):(k=l("<tr><td></td></tr>").addClass(g),l("td",k).addClass(g).html(f)[0].colSpan=oa(a),e.push(k[0]))};h(c,d);b._details&&b._details.detach();b._details=l(e);b._detailsShow&&b._details.insertAfter(b.nTr)},xb=function(a,b){var c=a.context;c.length&&(a=c[0].aoData[b!==q?b:a[0]])&&a._details&&(a._details.remove(),a._detailsShow=q,a._details=
q,l(a.nTr).removeClass("dt-hasChild"),qa(c[0]))},qc=function(a,b){var c=a.context;if(c.length&&a.length){var d=c[0].aoData[a[0]];d._details&&((d._detailsShow=b)?(d._details.insertAfter(d.nTr),l(d.nTr).addClass("dt-hasChild")):(d._details.detach(),l(d.nTr).removeClass("dt-hasChild")),F(c[0],null,"childRow",[b,a.row(a[0])]),zc(c[0]),qa(c[0]))}},zc=function(a){var b=new B(a),c=a.aoData;b.off("draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details");0<U(c,"_details").length&&(b.on("draw.dt.DT_details",
function(d,e){a===e&&b.rows({page:"current"}).eq(0).each(function(h){h=c[h];h._detailsShow&&h._details.insertAfter(h.nTr)})}),b.on("column-visibility.dt.DT_details",function(d,e,h,f){if(a===e)for(e=oa(e),h=0,f=c.length;h<f;h++)d=c[h],d._details&&d._details.children("td[colspan]").attr("colspan",e)}),b.on("destroy.dt.DT_details",function(d,e){if(a===e)for(d=0,e=c.length;d<e;d++)c[d]._details&&xb(b,d)}))};y("row().child()",function(a,b){var c=this.context;if(a===q)return c.length&&this.length?c[0].aoData[this[0]]._details:
q;!0===a?this.child.show():!1===a?xb(this):c.length&&this.length&&yc(c[0],c[0].aoData[this[0]],a,b);return this});y(["row().child.show()","row().child().show()"],function(a){qc(this,!0);return this});y(["row().child.hide()","row().child().hide()"],function(){qc(this,!1);return this});y(["row().child.remove()","row().child().remove()"],function(){xb(this);return this});y("row().child.isShown()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]]._detailsShow||!1:!1});var Ac=
/^([^:]+):(name|visIdx|visible)$/,rc=function(a,b,c,d,e){c=[];d=0;for(var h=e.length;d<h;d++)c.push(T(a,e[d],b));return c},Bc=function(a,b,c){var d=a.aoColumns,e=U(d,"sName"),h=U(d,"nTh");return ub("column",b,function(f){var g=hc(f);if(""===f)return ra(d.length);if(null!==g)return[0<=g?g:d.length+g];if("function"===typeof f){var k=Wa(a,c);return l.map(d,function(p,t){return f(t,rc(a,t,0,0,k),h[t])?t:null})}var m="string"===typeof f?f.match(Ac):"";if(m)switch(m[2