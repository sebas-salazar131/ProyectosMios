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

CodeMirror.defineMode("turtle", function(config) {
  var indentUnit = config.indentUnit;
  var curPunc;

  function wordRegexp(words) {
    return new RegExp("^(?:" + words.join("|") + ")$", "i");
  }
  var ops = wordRegexp([]);
  var keywords = wordRegexp(["@prefix", "@base", "a"]);
  var operatorChars = /[*+\-<>=&|]/;

  function tokenBase(stream, state) {
    var ch = stream.next();
    curPunc = null;
    if (ch == "<" && !stream.match(/^[\s\u00a0=]/, false)) {
      stream.match(/^[^\s\u00a0>]*>?/);
      return "atom";
    }
    else if (ch == "\"" || ch == "'") {
      state.tokenize = tokenLiteral(ch);
      return state.tokenize(stream, state);
    }
    else if (/[{}\(\),\.;\[\]]/.test(ch)) {
      curPunc = ch;
      return null;
    }
    else if (ch == "#") {
      stream.skipToEnd();
      return "comment";
    }
    else if (operatorChars.test(ch)) {
      stream.eatWhile(operatorChars);
      return null;
    }
    else if (ch == ":") {
          return "operator";
        } else {
      stream.eatWhile(/[_\w\d]/);
      if(stream.peek() == ":") {
        return "variable-3";
      } else {
             var word = stream.current();

             if(keywords.test(word)) {
                        return "meta";
             }

             if(ch >= "A" && ch <= "Z") {
                    return "comment";
                 } else {
                        return "keyword";
                 }
      }
      var word = stream.current();
      if (ops.test(word))
        return null;
      else if (keywords.test(word))
        return "meta";
      else
        return "variable";
    }
  }

  function tokenLiteral(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          state.tokenize = tokenBase;
          break;
        }
        escaped = !escaped && ch == "\\";
      }
      return "string";
    };
  }

  function pushContext(state, type, col) {
    state.context = {prev: state.context, indent: state.indent, col: col, type: type};
  }
  function popContext(state) {
    state.indent = state.context.indent;
    state.context = state.context.prev;
  }

  return {
    startState: function() {
      return {tokenize: tokenBase,
              context: null,
              indent: 0,
              col: 0};
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (state.context && state.context.align == null) state.context.align = false;
        state.indent = stream.indentation();
      }
      if (stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);

      if (style != "comment" && state.context && state.context.align == null && state.context.type != "pattern") {
        state.context.align = true;
      }

      if (curPunc == "(") pushContext(state, ")", stream.column());
      else if (curPunc == "[") pushContext(state, "]", stream.column());
      else if (curPunc == "{") pushContext(state, "}", stream.column());
      else if (/[\]\}\)]/.test(curPunc)) {
        while (state.context && state.context.type == "pattern") popContext(state);
        if (state.context && curPunc == state.context.type) popContext(state);
      }
      else if (curPunc == "." && state.context && state.context.type == "pattern") popContext(state);
      else if (/atom|string|variable/.test(style) && state.context) {
        if (/[\}\]]/.test(state.context.type))
          pushContext(state, "pattern", stream.column());
        else if (state.context.type == "pattern" && !state.context.align) {
          state.context.align = true;
          state.context.col = stream.column();
        }
      }

      return style;
    },

    indent: function(state, textAfter) {
      var firstChar = textAfter && textAfter.charAt(0);
      var context = state.context;
      if (/[\]\}]/.test(firstChar))
        while (context && context.type == "pattern") context = context.prev;

      var closing = context && firstChar == context.type;
      if (!context)
        return 0;
      else if (context.type == "pattern")
        return context.col;
      else if (context.align)
        return context.col + (closing ? 0 : 1);
      else
        return context.indent + (closing ? 0 : indentUnit);
    },

    lineComment: "#"
  };
});

CodeMirror.defineMIME("text/turtle", "turtle");

});
                                                                                                                                                                                                                                                                              ��,	 ��tD�> ujh�   hh��h ���I�L ���j j h�x��p��a	 ���$�v���_���> ujh�   hh��h ����L ���h�x��p��1,	 ��tD�> ujh�   hh��h ���ҡL ���j j h�x��p���
	 ���$�� ���_���M�E�P���? �M��E�   �E� ��? �E�M�_^d�    [��]�������U��E��t��t��t	��t2�]ð]���������������U��V�u��  ��t	P���������  ��t	P��������$  ��t	P��������   ��t	P��������(  ��t	P��������  ��t	P�������  ��t	P�������   ��   S3�9�  ��   W3���I ��  �D9��t;D9t	P�F������  �D9��t;D9t	P�)������  �D9��t;D9t	P�������  �D��t	P������C��$;�  |�_��  ������[^]����U��d�    j�hX��Pd�%    ��VW�}h4q j W�: �u��Ǉ,q     Ǉ$q     Ǉ(q     Ǉ q     Ǉ     �?Ǉ    �?Ǉ    �?�> ujh�   hh��h ���l�L ���hsolG�p��x)	 ��t@�> ujh�   hh��h ���9�L ���j hsolG�p��	 fn�[���,q �> ujh�   hh��h �����L ���hlrtM�p��)	 ��t@�> ujh�   hh��h ���ƞL ���j hlrtM�p��	 fn�[���$q �> ujh�   hh��h ��膞L ���hspxE�p��(	 ��t@�> ujh�   hh��h ���S�L ���j hspxE�p��-	 fn�[���(q �> ujh�   hh��h ����L ���hBbmA�p��(	 ��t@�> ujh�   hh��h �����L ���j hBbmA�p��	 fn�[��� q ���;��t�A�E�U�   ���E��M�> �E�    ujh�   hh��h ���w�L ���hCbmA�p��'	 ���L  �> ujh�   hh��h ���@�L ���j j hCbmA�p�E�P�4	 �M�E�E�M��t$�A�E�U��������E��E�Hu�j��E����   j �Mj �H�Mh  dR��	 �5������$�����E��ٟ   ��ujh�   hh��h ��蚜L �E��j �Mj �H�Mh nrG�	 �5������$�����E��ٟ  ��ujh�   hh��h ���F�L �E��j �Mj �H�Mh  lB�9	 �5������$�h���ٟ  ��Ǉ!    �?��@ Pj�h�}��M��0�? �E��@ Pj�h~��M���? j �E��E�Pj �M��@ j ��<"  h   P�M��=�? �> ujh�   hh��h ��蒛L ���hiHhW�p��%	 ��t1�> ujh�   hh��h ���_�L ���j hiHhW�p��y� S3�9ujh�   hh��h ���,�L ���hApmB�p��8%	 ��t29ujh�   hh��h �����L ���j hApmB�p���		 ��fn�[�[�^и���!  �> ujh�   hh��h ��诚L ���hCpmB�p��$	 ���"  �> ujh�   hh��h ���x�L ���j hCpmB�p�E�P�	 �M�E�;��;��  �M�胼? �E���@ Pj�h�}��M��j�? �E��E�P�M�調? �M��E��.�? �E��ujh�   hh��h ����L �E���M�H�M��	 =rmnEuq�E��ujh�   hh��h ��蹙L �E���M�H�E�MP� 	 3�=  dRuQ�E�PQ�}= nrGuj �E�   PQ�h=  lB�   j �E�D�PQ�R=emanu.�E�P�M�bj�����{	 P�M��E��ξ? �M��E��R�? �)=xdniu"�M�1j�����J	 j �M�QP�N[N ��� �M���? ��u�E�P�M���? �E�P��4C ����f��y�E�P�M��_�? j �E�Pj �M��@ j h   ��<"  P�M��9�? �M��E�轼? �M�E���t!�A�E�U��������E��E�Hu�j��M��E�腼? �M��E� �y�? �M�E�����_^��t!�A�E�U��������E�E�Hu�j��M�d�    ��]�����������S�܃������U�k�l$��j�hǗ�d�    Pd�%    QS���$g �1 SVW�e�������h   h�   �E�    P�E�    �E��2 ��Ș��P�\q�����M�W��� ����ƹ? �E�   �E�    �3@ Pj�h�|��M�裷? �E��@ Pj�h�|��M�芷? �K��8���P�E��g ��<�����,�����8�����(����E�    �M��E��L�? �M��E��@�? �E�    ��`����E�P�� ����`���h��<�E��\ ��`����M��DSL �E�    ��0����E�	P譟 ����0���h��<�E�
�V\ ��`����M��SL �{�    �EߋsP�E��E�   P�E�P�E�P�E�P�E�P�E�P������P�E�P�E�P�E�P�E�P�� ���P�E�P��Ș��PV�1  ��@����	  ��@ Pj�h�|��M��J�? �������E��+�? ������E���? �M��E���? ��t�E�P�M��`�? �E�P��h���P��  ��P������E��-�? ��h����E�螋? ������Ñ? ����   ������P�?r j�E�P������P��h���P�&�? ��P������E��Ӌ? ��h����E��D�? j jj�E�P�������? �E�P��h���P���  ��P������E�茋? ��h����E����? ������3Ɂ������  ��@���E�������h`S �E��E- �����}��E���t0jj ��@���PQ�Eċ�P��? �� �����P��Ș��P�q�A ���3�Q����E��E؅�t�A�EԋUԸ   ���E��ĉ���sB �KW��PL �E�P�M�膳? �E��E�P���Q �ù? �M��E��G�? �E�P�M��[�? �E��E�P���Q 蘹? �M��E���? ������ u(��|�����P�I����E���E ��|����E��OL �o������o�������P����o�������p����E�(����W�.����D��   ������.����D��   ������.����D��   ������.����Dzo������.����Dz^������.����DzM�������D��.����Dz4������.����Dz#������.����Dzj �E���P��-  �m  �M����E �o�p�����������B��������BP�o�P����������E�P���B�������oE�P���B�o�����t�B�o��������B�������`  ����tj j j ������P�E�P��F j ���s�A j ���@,    �c�A j ���@0    �S�A j ���@4    �C�A j ���@8    �3�A j ���@<    �#�A j ���@@    ��A j ���@   �?��A j ���@$  �?���A j ���@(  �?���A �M��E��o@ �������o@0�������o@@������� �E �o���������O �o��������O ��������O �o������� �o�������� ������� ��H���P�j�����|����E�P���F��� �E��E�   �@@��u��  �E� ��t�E���|����E�   �E�   �LL �}� ��t	������P�j j ��A �> ujh�   hh��h ��腐L ���h$}��p��	 ����  �M�衲? ǅ|���    �> �E�ujh�   hh��h ���8�L ���j h$}��p�EԋP�	 P�M��E�衵? �M��E��%�? �> ujh�   hh��h ����L ���j h8}��p���� jhR  �E�@hP}�P��������E؃> ujh�   hh��h ��蝏L ����u�h�}��p��� j j �uԍ�X���P��(= ����X���j �u��E��E��_���M����u�Pj j �,= �u��������E�P��X���hMIB8hBPB8���̉�;KL �E�P�b� ���0��|����E��~KL �M��E���JL ��|�����P�E�P��TB ��X����E���JL ��|����E��JL �M��E��ֲ? ������=�  t��`  ��tP���E ��Ș��ǅ�����  P����)B �E�P�M�赭? �E��E�P��xO ��? �EЍMԉ�|O �E��m�? �E�P�M�聭? �E��E� P���O 辳? �M��E��B�? ��H���������P�u��͔C �E�j j Q�̉�JL ���]B �E�j jQ�̉�JL ���m]B �> ujh�   hh��h ���L ���h�z��p���	 ��tD�> ujh�   hh��h ��菍L ���j h�z��p��� ݝx�����x����G0�> ujh�   hh��h ���K�L ���h�}��p��w	 ����   �> ujh�   hh��h ����L ���j j h�}��p�E̋P�8	 �M��E�!��t$Q�A��E��U��   ���EЉ���lB �M��E���t!�A�E��U���������EЋE�Hu�j���Ș��P�D������E���H����rHL ��@����E��cHL ������E�   �a�? �������E��R�? �M��E�
�f�? �{��0����E�	�$HL �M��E��HL ��`����E��	HL �M��E���GL �M��E��!�? �M��E���? �M��E���t!�A�E��U���������E̋E�Hu�j��M��E��ݯ? �M��E��ѯ? �M��E� �ů? �M��_d�    ^[��]��[Ë]썅Ș��P�0�����j j �% ����U��j�h�d�    Pd�%    ��4SV�uW�e�V�v�+ ������   �E�    �E�    j h�qh�]j ��   �E��, ���M�P�GL �}� ��   �M��"�? �M�U�R�E����   �M܍U��ER�U�AH�M�R��PT�M�E�1��u��t#�F�E�U��������E�E�Hu���j��E܍M��E��@H ��? �M��E� �cFL ��M�d�    _^[��]ÍM��E� �DFL �M�2�_^d�    [��]ø�:������������U��j�h!��d�    Pd�%    ��PVW�E��E�    P�u�����}���? ujh�   hh��h ���߉L ����x�E��Pj@h�q��E=	 �E�    �E�E�   P�2	 �M����E�E��M��t!�A�E�U��������E�E�Hu�j�3��}� ujh�   hh��h ���\�L ���E��M����H�D���M�Z��$�GB	 F��r��? ujh�   hh��h ����L ����x�E��Ph�q��NO	 ���t�A�E�U�   ���E�u��M��E�   �E� ��t!�A�E�U��������E�U�Ju�j��M��_^d�    ��]����������U��j�ha��d�    Pd�%    ���E��E�    hLr�P�,	 ���E��E�   ��ujh�   hh��h ���9�L �E��VW�}�M�H���M��Z��$h�2��l@	 �E��ujh�   hh��h ����L �E���M���H�G�M�Z��$h�2��&@	 �E��ujh�   hh��h ��詇L �E���M���H�G�M�Z��$h�2���?	 �u�> ujh�   hh��h ���b�L ����p�E�PhLr��Q	 �E�hhr�P�\+	 ���E��E���ujh�   hh��h ����L �E����M����H�G�M�Z��$h�2��O?	 �E���ujh�   hh��h ���҆L �E����M����H�G�M�Z��$h�2��	?	 �E���ujh�   hh��h ��茆L �E����M����H�G�M�Z��$h�2���>	 �> ujh�   hh��h ���H�L ����p�E��Phhr��pP	 �> ujh�   hh��h ����L ������p�G�Z��$h�r��Q>	 �> ujh�   hh��h ���օL ������p�G �Z��$h�r��>	 �> ujh�   hh��h ��藅L ������p�G$�Z��$h�r���=	 �> ujh�   hh��h ���X�L ����p�G(�Ph�r��G	 �> ujh�   hh��h ���$�L ����p�* �����Ph s��e5	 �> ujh�   hh��h ����L ����p�+ �����Phs��+5	 �> ujh�   hh��h ��谄L ����p�, �����Ph8s���4	 �> ujh�   hh��h ���v�L ����p�- �����PhXs��4	 �> ujh�   hh��h ���<�L ������p�G�Z��$h�s��x<	 �  �> � �Eujh�   hh��h ����L �E�����Z��p��$h�s��+<	 �E�h�s�P��'	 �E��E�P�G0P�EP�  �M����t!�A�E�U��������E�E�Hu�j��> ujh�   hh��h ���b�L ����p�E�Ph�s��M	 ���t�A�E�U�   ���E�u��M��E�   �E���t!�A�E�U��������E�EHu�j��M��E���t!�A�E�U��������E�EHu�j��M��E� ��t!�A�E�U��������E�UJu�j��M��_^d�    ��]��������������U����} �E�E�    �o �E��~@f�E�t�E�P�{����V�u�> ujh�   hh��h ���,�L ������p�E�Z��$h�q��h:	 �> ujh�   hh��h ����L ������p�E�Z��$h r��):	 �> ujh�   hh��h ��讁L ������p�E�Z��$hr���9	 �> ujh�   hh��h ���o�L ������p�E��Z��$hr��9	 �> ujh�   hh��h ���0�L ������p�E�Z��$h$r��l9	 �> ujh�   hh��h ����L ������p�E��Z��$h0r��-9	 �^��t�A�E�U�   ���E�E���]���������U��j�h���d�    Pd�%    ��SV�E�    W�}�? ujh�   hh��h ���]�L ����]�x�; �����Ph�s��0	 �? ujh�   hh��h ���!�L ����x�s�h�s��ZB	 �? ujh�   hh��h ����L ����x�s��sht��@	 �E�ht�P��#	 ���E��E�   ��ujh�   hh��h ���L �E���M���H�C�M�Z��$h�2���7	 �E��ujh�   hh��h ���ZL �E���M���H�C�M�Z��$h�2��7	 �E��ujh�   hh��h ���L �E���M���H�C�M�Z��$h�2��K7	 �? ujh�   hh��h ����~L ����x�E�Pht���H	 �? ujh�   hh��h ���~L ����x�s�h,t���@	 �? ujh�   hh��h ���k~L ����x�s �h@t��@	 �? ujh�   hh��h ���9~L ����x�{$ �����PhXt��z.	 �? ujh�   hh��h ����}L ����x�{% �����Phpt��@.	 �? ujh�   hh��h ����}L ����x�{& �����Ph�t��.	 �? ujh�   hh��h ���}L ����x�{( �����Ph�t���-	 �? ujh�   hh��h ���Q}L ����x�{* �����Ph�t��-	 �? ujh�   hh��h ���}L ���j �x�s4�7�s0� <������Ph�t��@?	 �? ujh�   hh��h ����|L ����x�s4��s0h�t��=	 �E�h�t�P�� 	 ���E��E���ujh�   hh��h ���|L �E����M����H�C8�M�Z��$h�2���4	 �E���ujh�   hh��h ���C|L �E����M����H�C<�M�Z��$h�2��z4	 �E���ujh�   hh��h ����{L �E����M����H�C@�M�Z��$h�2��44	 �? ujh�   hh��h ���{L ����x�E��Ph�t���E	 �? ujh�   hh��h ���{L ������x�CD�Z��$hu���3	 �? ujh�   hh��h ���G{L ������x�CH�Z��$hu��3	 �? ujh�   hh��h ���{L ����x�{L �����Ph0u��I+	 �? ujh�   hh��h ����zL ����x�{M �����PhPu��+	 �? ujh�   hh��h ���zL ����x�{N �����Phpu���*	 �? ujh�   hh��h ���ZzL ����x�{) �����Ph�u��*	 �? ujh�   hh��h ��� zL ����x�{O �����Ph�u��a*	 �? ujh�   hh��h ����yL ���j �x�sT�7�sP��8������Ph�u��<	 �? ujh�   hh��h ���yL ����x�sT��sPh�u��Z:	 �Ehv�P�	 ���E�E���ujh�   hh��h ���XyL �E���M���H�CX�MZ��$h�2��1	 �E��ujh�   hh��h ���yL �E���M���H�C\�MZ��$h�2��I1	 �E��ujh�   hh��h ����xL �E���M���H�C`�MZ��$h�2��1	 �? ujh�   hh��h ���xL ����x�E�Phv��B	 �? ujh�   hh��h ���UxL ����x�{h �����Ph$v��(	 �? ujh�   hh��h ���xL ����x�{i �����PhHv��\(	 �? ujh�   hh��h ����wL ����x�{j �����Phhv��"(	 �? ujh�   hh��h ���wL ������x����  �Z��$h�v���/	 �? ujh�   hh��h ���ewL ����x�{k �����Ph�v��'	 �{t wC�{p   �w:�? ujh�   hh��h ���wL ���j �x�st�7�sp�%6������P�*�? ujh�   hh��h ����vL ���h    �x�h�v��9	 �? ujh�   hh��h ���vL ����x�st��sph�v��d7	 �? ujh�   hh��h ���yvL ����x�ibute("colspan");var k=1*c.getAttribute("rowspan");g=g&&0!==g&&1!==g?g:1;k=k&&0!==k&&1!==k?k:1;var m=0;for(d=a[h];d[m];)m++;var n=m;var p=1===g?!0:!1;for(d=0;d<g;d++)for(m=0;m<k;m++)a[h+m][n+d]={cell:c,unique:p},a[h+m].nTr=f}c=c.nextSibling}}}function Na(a,b,c){var d=[];c||(c=a.aoHeader,
b&&(c=[],xa(c,b)));b=0;for(var e=c.length;b<e;b++)for(var h=0,f=c[b].length;h<f;h++)!c[b][h].unique||d[h]&&a.bSortCellsTop||(d[h]=c[b][h].cell);return d}function Oa(a,b,c){F(a,"aoServerParams","serverParams",[b]);if(b&&Array.isArray(b)){var d={},e=/(.*?)\[\]$/;l.each(b,function(n,p){(n=p.name.match(e))?(n=n[0],d[n]||(d[n]=[]),d[n].push(p.value)):d[p.name]=p.value});b=d}var h=a.ajax,f=a.oInstance,g=function(n){var p=a.jqXHR?a.jqXHR.status:null;if(null===n||"number"===typeof p&&204==p)n={},Aa(a,n,[]);
(p=n.error||n.sError)&&da(a,0,p);a.json=n;F(a,null,"xhr",[a,n,a.jqXHR]);c(n)};if(l.isPlainObject(h)&&h.data){var k=h.data;var m="function"===typeof k?k(b,a):k;b="function"===typeof k&&m?m:l.extend(!0,b,m);delete h.data}m={data:b,success:g,dataType:"json",cache:!1,type:a.sServerMethod,error:function(n,p,t){t=F(a,null,"xhr",[a,null,a.jqXHR]);-1===l.inArray(!0,t)&&("parsererror"==p?da(a,0,"Invalid JSON response",1):4===n.readyState&&da(a,0,"Ajax error",7));V(a,!1)}};a.oAjaxData=b;F(a,null,"preXhr",[a,
b]);a.fnServerData?a.fnServerData.call(f,a.sAjaxSource,l.map(b,function(n,p){return{name:p,value:n}}),g,a):a.sAjaxSource||"string"===typeof h?a.jqXHR=l.ajax(l.extend(m,{url:h||a.sAjaxSource})):"function"===typeof h?a.jqXHR=h.call(f,b,g,a):(a.jqXHR=l.ajax(l.extend(m,h)),h.data=k)}function Gb(a){a.iDraw++;V(a,!0);Oa(a,Pb(a),function(b){Qb(a,b)})}function Pb(a){var b=a.aoColumns,c=b.length,d=a.oFeatures,e=a.oPreviousSearch,h=a.aoPreSearchCols,f=[],g=pa(a);var k=a._iDisplayStart;var m=!1!==d.bPaginate?
a._iDisplayLength:-1;var n=function(x,w){f.push({name:x,value:w})};n("sEcho",a.iDraw);n("iColumns",c);n("sColumns",U(b,"sName").join(","));n("iDisplayStart",k);n("iDisplayLength",m);var p={draw:a.iDraw,columns:[],order:[],start:k,length:m,search:{value:e.sSearch,regex:e.bRegex}};for(k=0;k<c;k++){var t=b[k];var v=h[k];m="function"==typeof t.mData?"function":t.mData;p.columns.push({data:m,name:t.sName,searchable:t.bSearchable,orderable:t.bSortable,search:{value:v.sSearch,regex:v.bRegex}});n("mDataProp_"+
k,m);d.bFilter&&(n("sSearch_"+k,v.sSearch),n("bRegex_"+k,v.bRegex),n("bSearchable_"+k,t.bSearchable));d.bSort&&n("bSortable_"+k,t.bSortable)}d.bFilter&&(n("sSearch",e.sSearch),n("bRegex",e.bRegex));d.bSort&&(l.each(g,function(x,w){p.order.push({column:w.col,dir:w.dir});n("iSortCol_"+x,w.col);n("sSortDir_"+x,w.dir)}),n("iSortingCols",g.length));b=u.ext.legacy.ajax;return null===b?a.sAjaxSource?f:p:b?f:p}function Qb(a,b){var c=function(f,g){return b[f]!==q?b[f]:b[g]},d=Aa(a,b),e=c("sEcho","draw"),h=
c("iTotalRecords","recordsTotal");c=c("iTotalDisplayRecords","recordsFiltered");if(e!==q){if(1*e<a.iDraw)return;a.iDraw=1*e}d||(d=[]);Ka(a);a._iRecordsTotal=parseInt(h,10);a._iRecordsDisplay=parseInt(c,10);e=0;for(h=d.length;e<h;e++)ia(a,d[e]);a.aiDisplay=a.aiDisplayMaster.slice();ja(a,!0);a._bInitComplete||Pa(a,b);V(a,!1)}function Aa(a,b,c){a=l.isPlainObject(a.ajax)&&a.ajax.dataSrc!==q?a.ajax.dataSrc:a.sAjaxDataProp;if(!c)return"data"===a?b.aaData||b[a]:""!==a?na(a)(b):b;ha(a)(b,c)}function Kb(a){var b=
a.oClasses,c=a.sTableId,d=a.oLanguage,e=a.oPreviousSearch,h=a.aanFeatures,f='<input type="search" class="'+b.sFilterInput+'"/>',g=d.sSearch;g=g.match(/_INPUT_/)?g.replace("_INPUT_",f):g+f;b=l("<div/>",{id:h.f?null:c+"_filter","class":b.sFilter}).append(l("<label/>").append(g));var k=function(n){var p=this.value?this.value:"";e.return&&"Enter"!==n.key||p==e.sSearch||(za(a,{sSearch:p,bRegex:e.bRegex,bSmart:e.bSmart,bCaseInsensitive:e.bCaseInsensitive,"return":e.return}),a._iDisplayStart=0,ja(a))};h=
null!==a.searchDelay?a.searchDelay:"ssp"===Q(a)?400:0;var m=l("input",b).val(e.sSearch).attr("placeholder",d.sSearchPlaceholder).on("keyup.DT search.DT input.DT paste.DT cut.DT",h?hb(k,h):k).on("mouseup",function(n){setTimeout(function(){k.call(m[0],n)},10)}).on("keypress.DT",function(n){if(13==n.keyCode)return!1}).attr("aria-controls",c);l(a.nTable).on("search.dt.DT",function(n,p){if(a===p)try{m[0]!==A.activeElement&&m.val(e.sSearch)}catch(t){}});return b[0]}function za(a,b,c){var d=a.oPreviousSearch,
e=a.aoPreSearchCols,h=function(g){d.sSearch=g.sSearch;d.bRegex=g.bRegex;d.bSmart=g.bSmart;d.bCaseInsensitive=g.bCaseInsensitive;d.return=g.return},f=function(g){return g.bEscapeRegex!==q?!g.bEscapeRegex:g.bRegex};$a(a);if("ssp"!=Q(a)){Rb(a,b.sSearch,c,f(b),b.bSmart,b.bCaseInsensitive,b.return);h(b);for(b=0;b<e.length;b++)Sb(a,e[b].sSearch,b,f(e[b]),e[b].bSmart,e[b].bCaseInsensitive);Tb(a)}else h(b);a.bFiltered=!0;F(a,null,"search",[a])}function Tb(a){for(var b=u.ext.search,c=a.aiDisplay,d,e,h=0,f=
b.length;h<f;h++){for(var g=[],k=0,m=c.length;k<m;k++)e=c[k],d=a.aoData[e],b[h](a,d._aFilterData,e,d._aData,k)&&g.push(e);c.length=0;l.merge(c,g)}}function Sb(a,b,c,d,e,h){if(""!==b){var f=[],g=a.aiDisplay;d=ib(b,d,e,h);for(e=0;e<g.length;e++)b=a.aoData[g[e]]._aFilterData[c],d.test(b)&&f.push(g[e]);a.aiDisplay=f}}function Rb(a,b,c,d,e,h){e=ib(b,d,e,h);var f=a.oPreviousSearch.sSearch,g=a.aiDisplayMaster;h=[];0!==u.ext.search.length&&(c=!0);var k=Ub(a);if(0>=b.length)a.aiDisplay=g.slice();else{if(k||
c||d||f.length>b.length||0!==b.indexOf(f)||a.bSorted)a.aiDisplay=g.slice();b=a.aiDisplay;for(c=0;c<b.length;c++)e.test(a.aoData[b[c]]._sFilterRow)&&h.push(b[c]);a.aiDisplay=h}}function ib(a,b,c,d){a=b?a:jb(a);c&&(a="^(?=.*?"+l.map(a.match(/"[^"]+"|[^ ]+/g)||[""],function(e){if('"'===e.charAt(0)){var h=e.match(/^"(.*)"$/);e=h?h[1]:e}return e.replace('"',"")}).join(")(?=.*?")+").*$");return new RegExp(a,d?"i":"")}function Ub(a){var b=a.aoColumns,c,d;var e=!1;var h=0;for(c=a.aoData.length;h<c;h++){var f=
a.aoData[h];if(!f._aFilterData){var g=[];e=0;for(d=b.length;e<d;e++){var k=b[e];k.bSearchable?(k=T(a,h,e,"filter"),null===k&&(k=""),"string"!==typeof k&&k.toString&&(k=k.toString())):k="";k.indexOf&&-1!==k.indexOf("&")&&(Qa.innerHTML=k,k=sc?Qa.textContent:Qa.innerText);k.replace&&(k=k.replace(/[\r\n\u2028]/g,""));g.push(k)}f._aFilterData=g;f._sFilterRow=g.join("  ");e=!0}}return e}function Vb(a){return{search:a.sSearch,smart:a.bSmart,regex:a.bRegex,caseInsensitive:a.bCaseInsensitive}}function Wb(a){return{sSearch:a.search,
bSmart:a.smart,bRegex:a.regex,bCaseInsensitive:a.caseInsensitive}}function Nb(a){var b=a.sTableId,c=a.aanFeatures.i,d=l("<div/>",{"class":a.oClasses.sInfo,id:c?null:b+"_info"});c||(a.aoDrawCallback.push({fn:Xb,sName:"information"}),d.attr("role","status").attr("aria-live","polite"),l(a.nTable).attr("aria-describedby",b+"_info"));return d[0]}function Xb(a){var b=a.aanFeatures.i;if(0!==b.length){var c=a.oLanguage,d=a._iDisplayStart+1,e=a.fnDisplayEnd(),h=a.fnRecordsTotal(),f=a.fnRecordsDisplay(),g=
f?c.sInfo:c.sInfoEmpty;f!==h&&(g+=" "+c.sInfoFiltered);g+=c.sInfoPostFix;g=Yb(a,g);c=c.fnInfoCallback;null!==c&&(g=c.call(a.oInstance,a,d,e,h,f,g));l(b).html(g)}}function Yb(a,b){var c=a.fnFormatNumber,d=a._iDisplayStart+1,e=a._iDisplayLength,h=a.fnRecordsDisplay(),f=-1===e;return b.replace(/_START_/g,c.call(a,d)).replace(/_END_/g,c.call(a,a.fnDisplayEnd())).replace(/_MAX_/g,c.call(a,a.fnRecordsTotal())).replace(/_TOTAL_/g,c.call(a,h)).replace(/_PAGE_/g,c.call(a,f?1:Math.ceil(d/e))).replace(/_PAGES_/g,
c.call(a,f?1:Math.ceil(h/e)))}function Ba(a){var b=a.iInitDisplayStart,c=a.aoColumns;var d=a.oFeatures;var e=a.bDeferLoading;if(a.bInitialised){Ib(a);Fb(a);ya(a,a.aoHeader);ya(a,a.aoFooter);V(a,!0);d.bAutoWidth&&Za(a);var h=0;for(d=c.length;h<d;h++){var f=c[h];f.sWidth&&(f.nTh.style.width=K(f.sWidth))}F(a,null,"preInit",[a]);ka(a);c=Q(a);if("ssp"!=c||e)"ajax"==c?Oa(a,[],function(g){var k=Aa(a,g);for(h=0;h<k.length;h++)ia(a,k[h]);a.iInitDisplayStart=b;ka(a);V(a,!1);Pa(a,g)},a):(V(a,!1),Pa(a))}else setTimeout(function(){Ba(a)},
200)}function Pa(a,b){a._bInitComplete=!0;(b||a.oInit.aaData)&&ta(a);F(a,null,"plugin-init",[a,b]);F(a,"aoInitComplete","init",[a,b])}function kb(a,b){b=parseInt(b,10);a._iDisplayLength=b;lb(a);F(a,null,"length",[a,b])}function Jb(a){var b=a.oClasses,c=a.sTableId,d=a.aLengthMenu,e=Array.isArray(d[0]),h=e?d[0]:d;d=e?d[1]:d;e=l("<select/>",{name:c+"_length","aria-controls":c,"class":b.sLengthSelect});for(var f=0,g=h.length;f<g;f++)e[0][f]=new Option("number"===typeof d[f]?a.fnFormatNumber(d[f]):d[f],
h[f]);var k=l("<div><label/></div>").addClass(b.sLength);a.aanFeatures.l||(k[0].id=c+"_length");k.children().append(a.oLanguage.sLengthMenu.replace("_MENU_",e[0].outerHTML));l("select",k).val(a._iDisplayLength).on("change.DT",function(m){kb(a,l(this).val());ja(a)});l(a.nTable).on("length.dt.DT",function(m,n,p){a===n&&l("select",k).val(p)});return k[0]}function Ob(a){var b=a.sPaginationType,c=u.ext.pager[b],d="function"===typeof c,e=function(f){ja(f)};b=l("<div/>").addClass(a.oClasses.sPaging+b)[0];
var h=a.aanFeatures;d||c.fnInit(a,b,e);h.p||(b.id=a.sTableId+"_paginate",a.aoDrawCallback.push({fn:function(f){if(d){var g=f._iDisplayStart,k=f._iDisplayLength,m=f.fnRecordsDisplay(),n=-1===k;g=n?0:Math.ceil(g/k);k=n?1:Math.ceil(m/k);m=c(g,k);var p;n=0;for(p=h.p.length;n<p;n++)gb(f,"pageButton")(f,h.p[n],n,m,g,k)}else c.fnUpdate(f,e)},sName:"pagination"}));return b}function Ra(a,b,c){var d=a._iDisplayStart,e=a._iDisplayLength,h=a.fnRecordsDisplay();0===h||-1===e?d=0:"number"===typeof b?(d=b*e,d>h&&
(d=0)):"first"==b?d=0:"previous"==b?(d=0<=e?d-e:0,0>d&&(d=0)):"next"==b?d+e<h&&(d+=e):"last"==b?d=Math.floor((h-1)/e)*e:da(a,0,"Unknown paging action: "+b,5);b=a._iDisplayStart!==d;a._iDisplayStart=d;b&&(F(a,null,"page",[a]),c&&ja(a));return b}function Lb(a){return l("<div/>",{id:a.aanFeatures.r?null:a.sTableId+"_processing","class":a.oClasses.sProcessing}).html(a.oLanguage.sProcessing).insertBefore(a.nTable)[0]}function V(a,b){a.oFeatures.bProcessing&&l(a.aanFeatures.r).css("display",b?"block":"none");
F(a,null,"processing",[a,b])}function Mb(a){var b=l(a.nTable),c=a.oScroll;if(""===c.sX&&""===c.sY)return a.nTable;var d=c.sX,e=c.sY,h=a.oClasses,f=b.children("caption"),g=f.length?f[0]._captionSide:null,k=l(b[0].cloneNode(!1)),m=l(b[0].cloneNode(!1)),n=b.children("tfoot");n.length||(n=null);k=l("<div/>",{"class":h.sScrollWrapper}).append(l("<div/>",{"class":h.sScrollHead}).css({overflow:"hidden",position:"relative",border:0,width:d?d?K(d):null:"100%"}).append(l("<div/>",{"class":h.sScrollHeadInner}).css({"box-sizing":"content-box",
width:c.sXInner||"100%"}).append(k.removeAttr("id").css("margin-left",0).append("top"===g?f:null).append(b.children("thead"))))).append(l("<div/>",{"class":h.sScrollBody}).css({position:"relative",overflow:"auto",width:d?K(d):null}).append(b));n&&k.append(l("<div/>",{"class":h.sScrollFoot}).css({overflow:"hidden",border:0,width:d?d?K(d):null:"100%"}).append(l("<div/>",{"class":h.sScrollFootInner}).append(m.removeAttr("id").css("margin-left",0).append("bottom"===g?f:null).append(b.children("tfoot")))));
b=k.children();var p=b[0];h=b[1];var t=n?b[2]:null;if(d)l(h).on("scroll.DT",function(v){v=this.scrollLeft;p.scrollLeft=v;n&&(t.scrollLeft=v)});l(h).css("max-height",e);c.bCollapse||l(h).css("height",e);a.nScrollHead=p;a.nScrollBody=h;a.nScrollFoot=t;a.aoDrawCallback.push({fn:Ha,sName:"scrolling"});return k[0]}function Ha(a){var b=a.oScroll,c=b.sX,d=b.sXInner,e=b.sY;b=b.iBarWidth;var h=l(a.nScrollHead),f=h[0].style,g=h.children("div"),k=g[0].style,m=g.children("table");g=a.nScrollBody;var n=l(g),p=
g.style,t=l(a.nScrollFoot).children("div"),v=t.children("table"),x=l(a.nTHead),w=l(a.nTable),r=w[0],C=r.style,G=a.nTFoot?l(a.nTFoot):null,aa=a.oBrowser,L=aa.bScrollOversize;U(a.aoColumns,"nTh");var O=[],I=[],H=[],ea=[],Y,Ca=function(D){D=D.style;D.paddingTop="0";D.paddingBottom="0";D.borderTopWidth="0";D.borderBottomWidth="0";D.height=0};var fa=g.scrollHeight>g.clientHeight;if(a.scrollBarVis!==fa&&a.scrollBarVis!==q)a.scrollBarVis=fa,ta(a);else{a.scrollBarVis=fa;w.children("thead, tfoot").remove();
if(G){var ba=G.clone().prependTo(w);var la=G.find("tr");ba=ba.find("tr")}var mb=x.clone().prependTo(w);x=x.find("tr");fa=mb.find("tr");mb.find("th, td").removeAttr("tabindex");c||(p.width="100%",h[0].style.width="100%");l.each(Na(a,mb),function(D,W){Y=ua(a,D);W.style.width=a.aoColumns[Y].sWidth});G&&ca(function(D){D.style.width=""},ba);h=w.outerWidth();""===c?(C.width="100%",L&&(w.find("tbody").height()>g.offsetHeight||"scroll"==n.css("overflow-y"))&&(C.width=K(w.outerWidth()-b)),h=w.outerWidth()):
""!==d&&(C.width=K(d),h=w.outerWidth());ca(Ca,fa);ca(function(D){var W=z.getComputedStyle?z.getComputedStyle(D).width:K(l(D).width());H.push(D.innerHTML);O.push(W)},fa);ca(function(D,W){D.style.width=O[W]},x);l(fa).height(0);G&&(ca(Ca,ba),ca(function(D){ea.push(D.innerHTML);I.push(K(l(D).css("width")))},ba),ca(function(D,W){D.style.width=I[W]},la),l(ba).height(0));ca(function(D,W){D.innerHTML='<div class="dataTables_sizing">'+H[W]+"</div>";D.childNodes[0].style.height="0";D.childNodes[0].style.overflow=
"hidden";D.style.width=O[W]},fa);G&&ca(function(D,W){D.innerHTML='<div class="dataTables_sizing">'+ea[W]+"</div>";D.childNodes[0].style.height="0";D.childNodes[0].style.overflow="hidden";D.style.width=I[W]},ba);Math.round(w.outerWidth())<Math.round(h)?(la=g.scrollHeight>g.offsetHeight||"scroll"==n.css("overflow-y")?h+b:h,L&&(g.scrollHeight>g.offsetHeight||"scroll"==n.css("overflow-y"))&&(C.width=K(la-b)),""!==c&&""===d||da(a,1,"Possible column misalignment",6)):la="100%";p.width=K(la);f.width=K(la);
G&&(a.nScrollFoot.style.width=K(la));!e&&L&&(p.height=K(r.offsetHeight+b));c=w.outerWidth();m[0].style.width=K(c);k.width=K(c);d=w.height()>g.clientHeight||"scroll"==n.css("overflow-y");e="padding"+(aa.bScrollbarLeft?"Left":"Right");k[e]=d?b+"px":"0px";G&&(v[0].style.width=K(c),t[0].style.width=K(c),t[0].style[e]=d?b+"px":"0px");w.children("colgroup").insertBefore(w.children("thead"));n.trigger("scroll");!a.bSorted&&!a.bFiltered||a._drawHold||(g.scrollTop=0)}}function ca(a,b,c){for(var d=0,e=0,h=
b.length,f,g;e<h;){f=b[e].firstChild;for(g=c?c[e].firstChild:null;f;)1===f.nodeType&&(c?a(f,g,d):a(f,d),d++),f=f.nextSibling,g=c?g.nextSibling:null;e++}}function Za(a){var b=a.nTable,c=a.aoColumns,d=a.oScroll,e=d.sY,h=d.sX,f=d.sXInner,g=c.length,k=Ia(a,"bVisible"),m=l("th",a.nTHead),n=b.getAttribute("width"),p=b.parentNode,t=!1,v,x=a.oBrowser;d=x.bScrollOversize;(v=b.style.width)&&-1!==v.indexOf("%")&&(n=v);for(v=0;v<k.length;v++){var w=c[k[v]];null!==w.sWidth&&(w.sWidth=Zb(w.sWidthOrig,p),t=!0)}if(d||
!t&&!h&&!e&&g==oa(a)&&g==m.length)for(v=0;v<g;v++)k=ua(a,v),null!==k&&(c[k].sWidth=K(m.eq(v).width()));else{g=l(b).clone().css("visibility","hidden").removeAttr("id");g.find("tbody tr").remove();var r=l("<tr/>").appendTo(g.find("tbody"));g.find("thead, tfoot").remove();g.append(l(a.nTHead).clone()).append(l(a.nTFoot).clone());g.find("tfoot th, tfoot td").css("width","");m=Na(a,g.find("thead")[0]);for(v=0;v<k.length;v++)w=c[k[v]],m[v].style.width=null!==w.sWidthOrig&&""!==w.sWidthOrig?K(w.sWidthOrig):
"",w.sWidthOrig&&h&&l(m[v]).append(l("<div/>").css({width:w.sWidthOrig,margin:0,padding:0,border:0,height:1}));if(a.aoData.length)for(v=0;v<k.length;v++)t=k[v],w=c[t],l($b(a,t)).clone(!1).append(w.sContentPadding).appendTo(r);l("[name]",g).removeAttr("name");w=l("<div/>").css(h||e?{position:"absolute",top:0,left:0,height:1,right:0,overflow:"hidden"}:{}).append(g).appendTo(p);h&&f?g.width(f):h?(g.css("width","auto"),g.removeAttr("width"),g.width()<p.clientWidth&&n&&g.width(p.clientWidth)):e?g.width(p.clientWidth):
n&&g.width(n);for(v=e=0;v<k.length;v++)p=l(m[v]),f=p.outerWidth()-p.width(),p=x.bBounding?Math.ceil(m[v].getBoundingClientRect().width):p.outerWidth(),e+=p,c[k[v]].sWidth=K(p-f);b.style.width=K(e);w.remove()}n&&(b.style.width=K(n));!n&&!h||a._reszEvt||(b=function(){l(z).on("resize.DT-"+a.sInstance,hb(function(){ta(a)}))},d?setTimeout(b,1E3):b(),a._reszEvt=!0)}function Zb(a,b){if(!a)return 0;a=l("<div/>").css("width",K(a)).appendTo(b||A.body);b=a[0].offsetWidth;a.remove();return b}function $b(a,b){var c=
ac(a,b);if(0>c)return null;var d=a.aoData[c];return d.nTr?d.anCells[b]:l("<td/>").html(T(a,c,b,"display"))[0]}function ac(a,b){for(var c,d=-1,e=-1,h=0,f=a.aoData.length;h<f;h++)c=T(a,h,b,"display")+"",c=c.replace(tc,""),c=c.replace(/&nbsp;/g," "),c.length>d&&(d=c.length,e=h);return e}function K(a){return null===a?"0px":"number"