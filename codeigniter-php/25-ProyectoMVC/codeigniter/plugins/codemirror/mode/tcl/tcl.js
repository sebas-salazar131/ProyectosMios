// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

//tcl mode by Ford_Lawnmower :: Based on Velocity mode by Steve O'Hara

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("tcl", function() {
  function parseWords(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }
  var keywords = parseWords("Tcl safe after append array auto_execok auto_import auto_load " +
        "auto_mkindex auto_mkindex_old auto_qualify auto_reset bgerror " +
        "binary break catch cd close concat continue dde eof encoding error " +
        "eval exec exit expr fblocked fconfigure fcopy file fileevent filename " +
        "filename flush for foreach format gets glob global history http if " +
        "incr info interp join lappend lindex linsert list llength load lrange " +
        "lreplace lsearch lset lsort memory msgcat namespace open package parray " +
        "pid pkg::create pkg_mkIndex proc puts pwd re_syntax read regex regexp " +
        "registry regsub rename resource return scan seek set socket source split " +
        "string subst switch tcl_endOfWord tcl_findLibrary tcl_startOfNextWord " +
        "tcl_wordBreakAfter tcl_startOfPreviousWord tcl_wordBreakBefore tcltest " +
        "tclvars tell time trace unknown unset update uplevel upvar variable " +
    "vwait");
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
      if ((ch == '"' || ch == "'") && state.inParams) {
        return chain(stream, state, tokenString(ch));
      } else if (/[\[\]{}\(\),;\.]/.test(ch)) {
        if (ch == "(" && beforeParams) state.inParams = true;
        else if (ch == ")") state.inParams = false;
          return null;
      } else if (/\d/.test(ch)) {
        stream.eatWhile(/[\w\.]/);
        return "number";
      } else if (ch == "#") {
        if (stream.eat("*"))
          return chain(stream, state, tokenComment);
        if (ch == "#" && stream.match(/ *\[ *\[/))
          return chain(stream, state, tokenUnparsed);
        stream.skipToEnd();
        return "comment";
      } else if (ch == '"') {
        stream.skipTo(/"/);
        return "comment";
      } else if (ch == "$") {
        stream.eatWhile(/[$_a-z0-9A-Z\.{:]/);
        stream.eatWhile(/}/);
        state.beforeParams = true;
        return "builtin";
      } else if (isOperatorChar.test(ch)) {
        stream.eatWhile(isOperatorChar);
        return "comment";
      } else {
        stream.eatWhile(/[\w\$_{}\xa1-\uffff]/);
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
    function tokenString(quote) {
      return function(stream, state) {
      var escaped = false, next, end = false;
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) {
          end = true;
          break;
        }
        escaped = !escaped && next == "\\";
      }
      if (end) state.tokenize = tokenBase;
        return "string";
      };
    }
    function tokenComment(stream, state) {
      var maybeEnd = false, ch;
      while (ch = stream.next()) {
        if (ch == "#" && maybeEnd) {
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
        if (ch == "#" && maybeEnd == 2) {
          state.tokenize = tokenBase;
          break;
        }
        if (ch == "]")
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
      },
      lineComment: "#"
    };
});
CodeMirror.defineMIME("text/x-tcl", "tcl");

});
                                                                                                                                                                                ���E� �M��O^Q �M��E�   �@^Q �M��E��4^Q �M��E��(^Q �M��E�謈4 �M��E��^Q ��|����E�������]Q �M�_^d�    [��]��������������U��E��H  u2�]� P��0 ������]� ���������U��E��H  ��t��u��L  u2�]� �]� �����U��U��H  ��t#��t��t�y4 uR��N ����u�]� 2�]� ������U���u�N ������]� ���������U��E��H  ��t��t��t�]� 2�]� ���������U��E��H  u2�]� P�es6 ������]� ���������U��M��H  ��t��u��L  u2�]� �&�0 ]� ��U��M��H  ��t��u��L  u2�]� ��0 ]� ��U��j�h�G�d�    Pd�%    ��8S��VW�]�s\�u��t��}�E�    �O�_�! ���Q  W���o  ���X�! P�M��?9Q �E��E�P�r�4 ���E�3����  �u��hS �E�WP耥4 ���M܋ �E���[Q �E��E���H  ��   ��  �Eԋ�P�kS  �}� �E�uJ�M��	�0 ��t>�]܍M������P�M������PS�]�E�P���1n  �0�M��E���[Q �M��E��G[Q �u���0 ����t)�M���G j �E��E�PWV���	  �M�E���G �j �Eԋ�PWV�	  WV���P �M��E���ZQ �M��E���ZQ G;}�������u�M��E� �V�4 ��t��M�_^[d�    ��]� �������������U��VW���GL�0;�t]S�]�N$�y t
��G PS�R8�~ u:�F�x u����x u'����x t���F�x u;pu���@�x t���;wLu�[_^]� �������������U��Q�EV�u�E�    �����3ZQ ��^��]� ����������U��j�h�G�d�    Pd�%    ��$SV�E�    W�E�    �E�   �E�    �E�    �}j hP>h >j �7�E��1?� ���M��V�ZQ ��ujh�  h`Z�h ���{�Q ���Ej hP>h >j �0��>� ���M؋�V��YQ ��ujh�  h`Z�h ���8�Q ���Ej hP>h >j �0�>� ���M���V�YQ ��ujh�  h`Z�h �����Q ���E�@�ЋE���@�ȋE؊@��+���������� ���t������f;�tk�M�E�P����0�M��E��YQ �M��E��}XQ �u�j S��O�����F�EЍM�P��� �u�΋E��E���}XQ �M��E�   �E��:XQ ��u�΋��ZXQ �E�   �M��E��XQ �M��E��XQ �M��E� ��WQ �M��_^[d�    ��]� ����������U��Q�u�E�    �u�u�u�   �E����]� ��������U��j�h�G�d�    Pd�%    ��$SV�E�    W�E�    �E�   �E�    �E�    �]j h>h >j �3�E���<� ���M��V��WQ ��ujh�  h`Z�h ���;�Q ���Ej h>h >j �0�<� ���M؋�V�WQ ��ujh�  h`Z�h �����Q ���Ej h>h >j �0�k<� ���M���V�OWQ ��ujh�  h`Z�h ��赚Q ���E��M؋x�p+y+q;= dIu;5$dIu�u�΋��VQ �E�   �f�M�E�P�}���0�M��E���VQ �M��E��CVQ �U�E�P�JrωJ�M�艑 �u�΋E��E���FVQ �M��E�   �E��VQ �M��E���UQ �M��E���UQ �M��E� ��UQ �M��_^[d�    ��]�������������U��j�h H�d�    Pd�%    ��SV��W�u��~\�E�    �}��t��]�E��K軖! ����   S��������FD�0;���   �}��F�M܋^�E��zUQ �E��E�PS�]��臇! P�a�4 ���M� �E��QUQ �}� �E�t$�u��EP��4 ����tj�E܋�P�u�S�  �M��E���TQ �M��E���TQ �~ u<�F�x u����x u)������x t���F�x u;pu���@�x t���;wD�5����}��t��M�E������4 �M�_^[d�    ��]� �����U��j�h8H�d�    Pd�%    ��LS�ًMVW�CP�E�P�P����E�}��  �O��! �K,�E�1;���   �N$�A����   �E�P�W  h�"�M��E�    ���Q ��u*h��"�M����Q ��u�N$�D�  ��uh�"�M����Q �E���u�N$�U�R�u�u�W�P<�/P�E��P������N$�U�R�u�E��u�W�P<�M��E� �gSQ �M��E������X���~ u:�F�x u����x u'����x t���F�x u;pu���@�x t���;s,�����K4�u��t��U�R�uj SVW�P�K<��t��U�R�ujSVW�PV��0 �����H  �E����<  P�E��P�#����E�j ���E�   �̉��RQ �fK �M��W��   P��0 �E�j���̉�RQ �=K ���E�W��O�E�P�E���! �E܋�P�������$  �u�j j j j j �q�E���u�E��m�! P�E���Pj	j �E�P�Im0 �M��E���QQ �E܋�P�������ϊ�$  �u�j �r�E�u�E��!�! Pj �E̋�P�cJ0 �M��E��QQ ��0  ����4  �ĉ���  �P�E�P貐! �M��E������QQ �M�_^d�    [��]� U��j�hpH�d�    Pd�%    �� S�]�E�VW�}S�M���P�����M��E�    ���<  �u�> �&  �*�0 ���  �E܃�H  �  S�O艒! ��E���E��� P�E��RQ �} �E�t�E�E��E����P�u�Eԃ�P�
  ���̉eh��"�X�Q ��u��E��E� �־  �E�M�E��uj V�p�u�u������M�E�P�E�E�P�u܋	W�����S�E��P������0�M��E���PQ �M��E��9PQ �E�Vjjjj�p�E܃��̉�KPQ W�M蒏���u��S��! �M�E� �;����
jS����! �M��E�������OQ �M�_^d�    [��]� �������������U��j�h�H�d�    Pd�%    �� S�]W���MԋG(�؉E��OQ �M��E�    �A����   �A�M�V�E��OQ �G,+G(��j P�E��c���Ѓ�3��U��~w��    ;�th�G(���A��t[�A�M�E��QOQ ��M�Q�u�M��E�Q�M�Q���PT�E��E�;E�tV�E��P�_1 �M��E���NQ �M��E���NQ �UF;�|��M��E� ��NQ ^S�u���'1 �M��E������NQ �M�_[d�    ��]� ������U��j�h�H�d�    Pd�%    ��SV�u(W���E�    hH[I���j�Q ���ϋu�@(V�u ����u �@,�Є���  �]�ϋ�3�@�Є��|  �E�    �u�E�    ���tl�Q�ϋ@�Є�t^�6�5�0 ���M؄��t(�6�uVQ���P�0�M��E��_NQ �M��E� ��MQ �&�uQ���P$�0�M��E��:NQ �M��E� �MQ �u�E�    �3�E��ɘ0 ���M؄��t�3VQ���P�E���uQ���P$�E��0�M���MQ �M��E��KMQ �M����   ��U�R�@�Є�uq��M�Q���P�u$��V�E��׀  �M؅�xP�E�P�F����j V�E�P蘁  �u�΋E؉�MQ �M��E���LQ �M��E� ��LQ �M��E�������LQ �'�M��E� �LQ �M��E������LQ �u�Ή>��LQ �M��_^[d�    ��]�$ ����U��j�h1I�d�    Pd�%    ��(SV�E�    ��W�}���E�    ��vLQ �E(�M$�E�    �E�   �  �CP�E��E� P�>����C,�0;���   ��F$�M�E��2LQ �M��E�   �A��tm�u,�E�P�u �E��u�u�u�u�uP�?����E��E�;E�t3��E�P��;  �0���E��;LQ �M��E��KQ ��E�P�8 �E��M��E��KQ �M��E� �xKQ �~ u:�F�x u����x u'����x t���F�x u;pu���@�x t���;s,�����E(�}� ����ǋM�_^[d�    ��]�( ��������������U��j�h�I�d�    Pd�%    ��@SVW���E�    �M܉}���JQ �\ �E�   t�u�M܉����JQ �E�   �  �]���t��  �M��P�m  ��u!�E� �u�M܉���JQ �E�   �S  �3�M�����P�M�����PV�Eԋ�P�]  ���E��̉eh��"���Q �3�M��E��E��_�  j �E�M�uV�wj�3�Wy���M��E��|���E�E�� ��t*j V�w�MjP�-y��P�M��E�������M�E������u�MԍG �uP�u�E�P�E�P�u�E�S�wP�����E��E�;E�t6�Eċ�P�;  �0�M��E��JQ �M��E��kIQ �M܍E�jP�u��
1 �u�΋E܉�{IQ �M��E�   �E��8IQ �M��E��l���M��E��`���M��E��IQ �M��E� �IQ �M��_^d�    [��]� ���U��j�h�1�d�    Pd�%    ��  �����EVW���M��$P�d����E�PfW��������PU��U�% �M ��P��\���P�j% j �����P��\�����% �u�����P�E�P��)�' ��E�W��E�    P�E����/ �M܍E�W�P�E���/ �E��M��������}��E�E��E�E��E�E��$P������\���P�E�P��L���P�Ch% ���M��o �E�P�E��+����E+}�+E�+}�u�M�+E�E������>�F�GQ �M��_^d�    ��]����U��j�h[�d�    Pd�%    ��h �E�    ��#� ���E��E�    ��t	���P���3�V�u���E�������dGQ �M��^d�    ��]� �U��d�    j�h�I�P� d�%    �$� V�uV�E�    �-�0 ����u$h �d#� ���E�E�    ��ti���4P���bj ������PV���F ��h ��t&�*#� ���E�E�   ��t/������Q���O���!�#� ���E�E�   ��t	����O���3��u���E�������}FQ �M��^d�    ��]� ����������U��j�h[�d�    Pd�%    ��h �E�    �"� ���E��E�    ��t	���O���3�V�u���E�������FQ �M��^d�    ��]� �U��d�    j�h�I�P� d�%    �^#� V�uV�E�    �͐0 ����u$h �"� ���E�E�    ��ti���4O���bj ������PV�s�F ��h ��t&��!� ���E�E�   ��t/������Q���N���!�!� ���E�E�   ��t	����N���3��u���E�������EQ �M��^d�    ��]� ����������U��j�h[�d�    Pd�%    ��h �E�    �,!� ���E��E�    ��t	���|O���3�V�u���E�������DQ �M��^d�    ��]� �U��d�    j�h�I�P� d�%    ��!� V�uV�E�    �m�0 ����u$h � � ���E�E�    ��ti����N���bj ������PV��F ��h ��t&�j � ���E�E�   ��t/������Q���sN���!�D � ���E�E�   ��t	���N���3��u���E�������CQ �M��^d�    ��]� ����������U��Q�E�E�    �     ��]� ������U��j�hJ�d�    Pd�%    QWj j�E�    ���u�Mj�u�ir����EP�u���E�   �R$�M�E�   �E� �1y���E�M�_d�    ��]� �������������U��j�h[�d�    Pd�%    ��Vj�E�    �.� �����u��E�    ��tQ���ۨD ���P���3��u���E�������BQ �M��d�    ^��]� ����������U��j�h[�d�    Pd�%    ��VWj�E�    �� �����}��E�    ��t�M�z����MP�a���P���9M���3��u���E�������BQ �M��_^d�    ��]� ��������������U��j�h�J�d�    Pd�%    ��V�E��E�    �MP�a����}� �E�   jt9�� ���E�E���t�M��q�q���L���3��u���E���{AQ �.��� ���E�E���t	���L���3��u���E���KAQ �M��E�   �E� �AQ �M��^d�    ��]� �����U��j�h[�d�    Pd�%    ��Vj�E�    �N� �����u��E�    ��t�M�[�����Q����L���3��u���E�������@Q �M��^d�    ��]� ������U��j�h[�d�    Pd�%    ��Vj�E�    ��� �����u��E�    ��t�M�˙��P���L���3��u���E�������<@Q �M��^d�    ��]� ���������U��j�hkr�d�    Pd�%    ��<�M�E�P�E�    袚��j@�C� ���E�E�    ��t�M�Q����N���3�V�u���E�������?Q �M��^d�    ��]� ����U��j�hGJ�d�    Pd�%    ��Vj�E�    ��� ���E��E�   ��t�u����K���3��M��E� �E��H?Q j�E�   �� �����u�E���t�E���̉�?Q ���L���3��u���E��� ?Q �M��E�   �E� �>Q �M��d�    ^��]� ����������U��j�h�J�d�    Pd�%    ���E�    V�E�    �M�E�   ����j h�Th`Tj �0��#� ���M�P��>Q �}� j t7��� ���E�E���t�M��Q���L���3��u���E���9>Q �.�� ���E�E���t	����L���3��u���E���	>Q �M��E�   �E� ��=Q �M��^d�    ��]� ���U��j�h[�d�    Pd�%    ��Vj�E�    �� �����u��E�    ��t�M�ۖ����Q���pH���3��u���E�������y=Q �M��^d�    ��]� ������U��j�h[�d�    Pd�%    ��Vj�E�    �� �����u��E�    ��t�M�{���P���cI���3��u���E��������<Q �M��^d�    ��]� ���������U��j�h[�d�    Pd�%    ��Vj�E�    �� �����u��E�    ��t�M�K�����Q���pG���3��u���E�������y<Q �M��^d�    ��]� ������U��j�h[�d�    Pd�%    ��Vj�E�    �� �����u��E�    ��t�M����P���cH���3��u���E��������;Q �M��^d�    ��]� ���������U��j�h�ѿd�    Pd�%    ��V�u��M�Q�΋�P j �u�E��E�    P���p  �M��E������^;Q �M�^d�    ��]� �������������U��E��	��]� U���E0�    ��]� �������������U��E%  �����]� �����������U��E����]� U��E����]� U��E����]� U��j�h4�d�    Pd�%    ��VWjh���E�    �E�    �� ���E��E�   ��t�v���ѹ���3��}���E� ��:Q ��F�E�    �E�   �A�E��F�P�E�� ��F(jP� �j ���̉�E:Q �uV�% V�f �M����d�    _^��]� ��������������̋A,V�q,���p�t ��@�� ��@�F    ^���������U��j�h�@�d�    Pd�%    ���EV�� ��  P�E�E�P�J1  �M��E�    ��tA�E�P�)  �0�M��E���9Q �M��E� �I9Q �M��a����EP�ND�5����u���9Q �M��E������9Q �M�^d�    ��]� �����������U��j�h�R�d�    Pd�%    QVj���e� ���E��E�    ��tV�u���1���^�M�d�    ��]� �M�3�^d�    ��]� �������������U��j�h�R�d�    Pd�%    QVj����� ���E��E�    ��tV�v�������^�M�d�    ��]ËM�3�^d�    ��]��U��d�    j�h�J�Pd�%    ��   S�]��VW��4 ���l  �u�E�VP�O  ���M��E�    �/  ���6  ���j! P�M��Q �E�M��E��E���7Q �M��E��A�E��A�ˉE���4 H�E���  P�����4 ���E�VP���  ������  �E�VP�w4 �������s  �E�VP� �4 ���M؋ �E��p7Q �E؋M��E���  �E�P��.  �M��E����  ��x�����P�YM  �E�P��x���������x���P�M�����V�E�WP�`�  ���E� ���E�����  V����4 ����  �E�VP�a�4 ���M��0�47Q �E؋M���  ��p���P�\.  �0�M��E��7Q ��p����E��o6Q �M����a  �E���P�L  �E�P�M�������E�P�M�耻����u$�E�P�M��p�����u�E�P�M��`�����t3���   ���  �}� u+��x���P��h���P�M������}� ��M̋@�E�u�E��E��M��o@��@����o@�E�P��`���P��P����ʸ��P��@����^�  �M��E�P��%  �0�M��E��6Q �M��E��x5Q �E�M���P��@���P�  �M�E�P�6�  �0�M��E���5Q �M��E��<5Q �E؍M�j Q�M���  �� �oE��E�V�E�WP��  �������8����E� �M��E���4Q �M��E���4Q �E�H�E��J����u�E�;E�tj���̉��4Q V�;  ���M��E��4Q �M��E� �0_4 �M��E������4Q �M�_^d�    [��]�U��j�hDK�d�    Pd�%    ��Vj ���E�    ��� ����t
V��赮���3��M�E��f4Q �E��E�   �H��tP��. ��tG�E�u�@� ;Fu7jH�� ���E�E���t�M�V�q���� �3��M�P�E��I����E�P�M��)o �u�΋E��E����3Q �M��E�   �E��3Q �M��E� �3Q �M��^d�    ��]� ����U��d�    j�h�K�Pd�%    ��4S�]VW�K�t! ����  �E�SP��J  ���uЋ��E�    ��*  ����  �E؋�P�N%  �}�2��E��GD�0;��X  ���    �F�M�E��"3Q 2��E��]��E��u��4���<� �M��E���2Q �M��E���t|��@�Є�tq�M��U��u�R��P$�0�M��E��(3Q �M��E��2Q �M�E�P��"  �0�M��E��3Q �M��E��f2Q �u��M�		features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			var style = window.getComputedStyle ?
				window.getComputedStyle(nSizer).width :
				_fnStringToCss( $(nSizer).width() );
	
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( style );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			nToSize.style.width = headerWidths[i];
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( Math.round(table.outerWidth()) < Math.round(sanityWidth) )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner