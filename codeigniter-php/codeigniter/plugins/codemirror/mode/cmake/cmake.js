// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    define(["../../lib/codemirror"], mod);
  else
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("cmake", function () {
  var variable_regex = /({)?[a-zA-Z0-9_]+(})?/;

  function tokenString(stream, state) {
    var current, prev, found_var = false;
    while (!stream.eol() && (current = stream.next()) != state.pending) {
      if (current === '$' && prev != '\\' && state.pending == '"') {
        found_var = true;
        break;
      }
      prev = current;
    }
    if (found_var) {
      stream.backUp(1);
    }
    if (current == state.pending) {
      state.continueString = false;
    } else {
      state.continueString = true;
    }
    return "string";
  }

  function tokenize(stream, state) {
    var ch = stream.next();

    // Have we found a variable?
    if (ch === '$') {
      if (stream.match(variable_regex)) {
        return 'variable-2';
      }
      return 'variable';
    }
    // Should we still be looking for the end of a string?
    if (state.continueString) {
      // If so, go through the loop again
      stream.backUp(1);
      return tokenString(stream, state);
    }
    // Do we just have a function on our hands?
    // In 'cmake_minimum_required (VERSION 2.8.8)', 'cmake_minimum_required' is matched
    if (stream.match(/(\s+)?\w+\(/) || stream.match(/(\s+)?\w+\ \(/)) {
      stream.backUp(1);
      return 'def';
    }
    if (ch == "#") {
      stream.skipToEnd();
      return "comment";
    }
    // Have we found a string?
    if (ch == "'" || ch == '"') {
      // Store the type (single or double)
      state.pending = ch;
      // Perform the looping function to find the end
      return tokenString(stream, state);
    }
    if (ch == '(' || ch == ')') {
      return 'bracket';
    }
    if (ch.match(/[0-9]/)) {
      return 'number';
    }
    stream.eatWhile(/[\w-]/);
    return null;
  }
  return {
    startState: function () {
      var state = {};
      state.inDefinition = false;
      state.inInclude = false;
      state.continueString = false;
      state.pending = false;
      return state;
    },
    token: function (stream, state) {
      if (stream.eatSpace()) return null;
      return tokenize(stream, state);
    }
  };
});

CodeMirror.defineMIME("text/x-cmake", "cmake");

});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           color: 'rgba(0, 0, 0, .2)',
            zeroLineColor: 'transparent'
          },
          ticks: $.extend({
            beginAtZero: true,
            suggestedMax: 200
          }, ticksStyle)
        }],
        xAxes: [{
          display: true,
          gridLines: {
            display: false
          },
          ticks: ticksStyle
        }]
      }
    }
  })
})

// lgtm [js/unused-local-variable]
                                                                                                 �   �������ʐ݄$�   ����(����  ��������ݜ$�   ������$�   ����ݜ$�   f�$�   (�f���  fo�$�   f��f�l$ f~�f����  ��   �?�wf�f����$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~������7�oݜ$�   ��������f���$�   f��ݜ$�   f�$�   ��$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   �������ʐ݄$�   ����(����  ��������ݜ$�   ������$�   ����ݜ$�   f�$�   (�f���  fo�$�   ��  fo�f��f�l$f~�f����  �@ �f�f����$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~������?�oݜ$�   ��������f���$�   f��ݜ$�   f�$�   ��$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ����(�����݄$�   ������������ݜ$�   ������$�   ����ݜ$�   f�f�$�   ���  ���  (�f�foL$Pfo�$�   f��f��f����   ��(  f�$�   fod$@fol$pfo|$0f��f��fl$pf|$0f�$�   fo�$�   fo|$ f��fot$f��f��f�$�   f|$ ft$�7��������D$;�$�   ��  �������E$f��������+�$�  �|$�4$�T$4�48���t$�4R������L$0Ɖ|$�$�T$�ݜ�  �}$�4�d0 Cfd0(�7fT7W�����$�   ݄$�   f�����$�   ��݄$�   ��$�   ���ɋ|$��݄$�   ��$�   ��������݄$�   �����\7��������f\7W�����$�   f�ݜ�  ����W%�������ݜ�  ݄$�   ��$�   ����݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����$�   f��̋|$���������l70fl78W-���ݜ�  ����L$����ݜ�  ݄$�   ��$�   ����݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ������$�   ����f�����ݜ�  ��������ݜ�  ݄$�   ��$�   ����݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ������������ݜ�  ����������@;�$�   �����ݜ�  �T$4�L$0;L$�  ��+|$���2�  �ߋD$�����f�ۉ\$��$�  ��fnu$fp� (5p��f|$ �T$4����fn��    fn�fp� �Pfn�3�fn덜�  fb�fp� fn�fn�3�fb�4$�L$0fl�fl������t$�T$4�$fD$fL$@�|$foD$ fo�f�ȃ�f��f~�fs�f�d$@f�l$f���f���f�f����$�   ݄$�   f�����$�   ��f~�݄$�   f����$�   ������݄$�   ��$�   ��������݄$�   ��������������ݜ$�   ����f~�����f�f����$�   ݜ$�   f�$�   ��$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����)<��������ݜ$�   ������$�   ����ݜ$�   f�$�   )L��f�f����$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~������?�Gݜ$�   ��������f���$�   f��ݜ$�   f�$�   ��$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   �������� ݄$�   ����)L ��������f�d$@foL$ f�l$f��f��ݜ$�   ����f~�������$�   ݜ$�   f�$�   )D0�?�Gf�f����$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~�������Oݜ$�   ��������f���$�   f��ݜ$�   f�$�   ��$�   @ ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����f�d$@��������foD$ f�l$f��f��ݜ$�   ����f~�������$�   ݜ$�   f�$�   )|@)LP��f�f����$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~��������ݜ$�   ��������f�f����$�   ݜ$�   f�$�   ��$�   ݄$�   f�����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����)|`��������ݜ$�   ������$�   ����ݜ$�   f�$�   )Tp�   f�d$@;�f�l$�K����|$�L$0�Ǎ^+ƉD$;���   �L$03ۋL$�����T$4���f����$�  ��������<�  }$���$�3��$����\�F��fTW�����$�   ݄$�   f�����$�   ��݄$�   ��$�   �����$�  ��݄$�   ��$�   ��������݄$�   �����������������������;t$�e����\��T$4�L$0�E�0�ƃ����  �}$�],+�$�  +�$�  �D$   ���}x  �4$�T$4�\$�|$�   �L$0�t$�ދ���\$��$�  �D$�L$�\$ �t$���B����D$$f��f��f��f�҅��  �D$�   �|$��$�  �T$�8��$�  �Ћ|$ �D�F�t8�ft8�fD�(�W���W=���(�f��f�f�fY�fY�fX��48ft8fX�(�W=���f��fY�fY�fX��t8ft8fX�(�W=���f��fY�fY�fX��t8 ft8(�fX�fY�(�W=���f��fY�fX��$�  fX�;t$$�#����|$�T$�L$B�D$ ��<�  ��<�  �t�ft�f\�(�W���f��f�f�fY�fY�fX��\�f\��\f\f\�(�W-���f��fY�fY��<fX��\ f|f\(f\�f\�(�(�W%���W���f��f��fY�fY�fY�fY�fX�fX��$fd�lfl�L fL(�$�  �L$;T$0������t$�   ���D$;�������T$4�4$�L$0��+�;��z\  ���a  ���  ���2  ��3ҋu,�ɍ�L\  �$�L$03ɋ����\$3�4$f����$�  �L$�T$���  Af��  �D$�0f\0f\�(�(�W���f��f�f�fY�fY�fX��0f\0ÉD$;L$0��t  ����f����~��}$3҉T$�D$��L$�L$�    �9BfL9W���(�W����0�d0�f��f�f�fY�fY�fX��$�  fX�;T$r��D$�L$������$�  �u$+����M,�\$�T> fT>(W���(�W���f��)�$�   ��$�  �t>���L>0�ft>fL>8�<��$�  �|$�������|$��W����R��(�W���f��)�$�   �D70fD78W���(�W-���f��)�$�   �l7 fl7(��W-����I��(�W%���f��)�$�   �d20fd28W%���(�W=���f��)�$�   ��$�  f�$�  )�$�   W=���f��)|$p��$�  f�$�  )|$`W=���f��)|$P��$�  f�$�  )|$@W=���f��)|$0��$�  ��W5����f�$�  (����)|$ �W=����W����$    f��f��)|$�\$�׋L$�t$�<$)�$�   )�$   )�$�   �&G�vf�f�fY�$�   fYt$pfX�(��6fvf�f�fY�$�   fY�fX��:fzf\�(�f�f�fYd$`fY|$PfX��:(�fz�.�vf�f�f�f�fY�fY�$�   fY�$   fY�$�   fX�fX�fX��(fhf\�(�f�f�fY|$@fYl$0fX��(fh���6�f��f�f�fY�fY�$�   fX�f��:�r��f�f�fY�fY�$�   fX�(�f�f�fY�$�   fY�$�   fX�fX�fX��)fif\�(�f�f�fYd$ fYl$fX��)fi��;��Y����`W  ��$�  f�$�  ��$�  (��}$��+�W=���f��)�$�   ��$�  f�$�  �t7�d7 �T: )|$ ft7fd7(fT:(W=�����$�  f����)|$��$�  �<W%���W���(���(�f�$�  ��$�  W5����ًu,(�)<$�W=���W����W��������f���W�����D$0    �f��f��)�$�   )d$P)t$@f��)�$�   )T$p)\$`($$(l$(t$ �L$0�A�^f�f�fY�$�   fY�$�   fX�(��f^f�f�fYT$@fY�fX��fRf\�(�f�f�fY�fY�fX��fR����N��f�f�fY\$PfYL$`fX�(�f�f�fY\$pfY�$�   fX�fX��fPf\�(�f�f�fY�fY�fX��fP��;������U  ��$�  �\$�]$+����M,��$�  �t;��ft;�W5���(�W-���f��)�$@  �l; fl;(W-���(�W���f��)�$0  �\;0f\;8W���(�W���f��)�$   �T;@fT;H�<��W�����(�W���f��)�$  �L@fLH��$�  �|$�������|$��W����R��(�W���f��)�$   �D@fDHW���(�W%���f��)�$�   �d0fd8W%���(�W=���f��)�$�   �| f|(����W=���)�$p  W=���f��)�$�   �|@f|HW=���)�$`  W=���f��)�$�   �|0f|8�IW=�����)�$P  W=���f��)�$�   ��$�  f�$�  )�$�   W=���f��)�$�   ��$�  f�$�  )�$�   W=���f��)|$p��$�  f�$�  )|$`W=���f��)|$P��$�  f�$�  )|$@W=���f��)|$0��$�  ��f�$�  �������)|$ �W=�����$    �f���ϋ\$�t$�<$)|$)�$�  )�$�  )�$�  �6G�~f�f�fY�$�   fY�$�   fX�(��>f~f�f�fY�$�  fY�$@  fX��)fif\�(�f�f�fY�$�   fYl$pfX��)(�fi�6�ff�f�f�f�fY�$�  fY�$0  fY�$p  fY�$�   fX�fX�fX��:fzf\�(�f�f�fYl$`fY|$PfX��:fz�&�vf�f�fY�fY�$   fX��)�af�f�fY�$�  fY�$�   fX�(�f�f�fY�$P  fY�$�   fX�fX�fX��+fkf\�(�f�f�fYt$@fYl$0fX��+fk���>�f��f�f�fY�fY�$  fX��1�y��f�f�fY�fY�$�   fX�fX��2�z��f�f�fY�$`  fY�$�   fX�(�f�f�fY�$   fY�fX�fX�fX��(fhf\�(�f�f�fYd$ fYl$fX��(fh��;|$�|����nO  �E� �؃���  �M�u,+�$�  �9�M$+�$�  �$   ���t$��  �T$4�|$$�\$�D$�L$��$�  �<$�ϻ   ���<$΍s�f��f��f��f�����  ����|$�|$��$�  �D$   �t$(�D$ �\$�ߋt$�|$�L3�GfL3�W���(�W����t��|�f��f�f�fY�fY�fX��4fX��|f�f�fY�fY�fX��tfX��|f�f�fY�fY�fX��t fX��|(�f�f�fY�fY�fX��$�  fX�;|$(�;����D$ �\$�Cf\f\��dfd�L�f\��T fL�fT(f\�f\��L�fL��f\�dfd�T fT(�;\$$�i����<$���t$;|$�D����T$4�\$�D$;��DM  �M$+�+�$�  ���$�M,�u��+�$�  ��$  �<�6��Ǆ$      ��$  �$��  ���W  ����   ����L  �t$����$  ��3���3҉�$  މ�$  f���D$��$�  �AfLf\��fL�;L$��e  ��f��~ы�3����4$�T$�L$E$�֋$ �FfLW���(�W�����d�f��f�f�fY�fY�fX��$�  fX�;t$r��T$�L$�S����}$�D$��$�  �o fo(W-���(�W%���f��)d$P�w�g0fwfg8������$  ���<$��W%����R��(�W���f��)T$@�T0fT8W���(�W���f��)\$0�\ f\(��W�����(�W���f��)D$ �D
0fD
8�@��W����W5���(���(�W=����W�����f��f��)|$�D$�׋$��$  ��$  )d$p)�$�   )t$`�&G�nf�f�fYd$`fY�fX��:fzf\��:(�fz�&�vf�f�f�f�fY�$�   fYt$PfY|$ fY�fX�fX�fX��+fkf\��+fk���6�f��f�f�fYt$pfYd$@fX��:�r��f�f�fY�fYt$0fX�(�f�f�fYl$fY�fX�fX�fX��)fif\��)fi��;�������I  ���u$�\
 f\
(��$�  �F���n fF�<Ifn(W���W-���(�W���(���(�����$  �W5����W%����W����f��f��f��)$��$  ��$  �9F�Af�f�fY<$fY�fX��
fJf\��
fJ���9�A��f�f�fY�fY�fX�(�f�f�fY�fY�fX�fX��fKf\��fK��;��l����eH  �}$�D$�����wfwW5���(�W-���f��)�$�   �o fo(W-����_0(�f_8W%���W���f��)�$�   )�$�   �g@��$�  W���fgH��f��)�$�   �\@��f\H��$  ���<$��W%����R��(�W���f��W���)T$p(��T@fTHW���W���f��(�)L$`�L0W���fL8f��)D$PW����D (�fD(��W=���W�����f��)|$@(�W=���f��)|$0�|
@f|
HW=���)�$�   W=���f��)|$ �|
0f|
8�v����W=����������)�$�   �W=�����f���ǋ$��$  ��$  )|$)�$�   )�$   )�$�   �6G�ff�f�fY�$�   fY�$�   fX��(fhf\��((�fh�>�ff�f�f�f�fY�$   fY�$�   fYl$0fY�fX�fX�fX��2frf\��2fr�.�~f�f�fY�$�   fY�$�   fX�� �hf�f�fY�fYl$@fX�(�f�f�fY�$�   fYt$fX�fX�fX��)fif\��)fi���>�f��f�f�fY�$�   fYd$pfX��0�x��f�f�fY�fY|$PfX�fX��2�z��f�f�fY�$�   fY|$ fX�(�f�f�fYl$`fY�fX�fX�fX��+fkf\��+fk��;|$�*����{D  ����  ���D  �E� �؃����+ˋ���$  �ߍq����]  �}�D$�$�?�|$(�}$+�$�  �|$�},+�$�  �|$�T$4�t$��$�  �D$(�׋��Ѕ��7j  ����t$�L$�ύC��f��f��f��f���L$$��$�  �ȉL$ ;\$(��   ����L$�T$�\$�ыL$ �\$$�t3�@ft3�(��\��L�W=���f��f�f�fY�fY�fX��t3�ft3�fX�(�W=���f��fY�fY�fX��t3�ft3�fX�(�W=���f��fY�fY�fX��t3�ft3��fX�fY�(�W=���f��fY�fX��$�  fX�;D$(�,����T$�\$�\2�Kf\2�f\��d2�fd2��L2�f\��T2�fL2�fT2�f\�f\��L2�fL2��\2�f\2��d2�fd2��T2�fT2��$�   ���U����L$����D$(;L$�$����[  �}�?�ǃ���D$��	  �ȍA�����\����$�   ���y  ������f���������$�   ���fn�   fp� fn��fl$0fn����fn���k���fb�fp� fD$@fn���fl�f�$�   fn��fn�3�fb�fo=P��fn΋�������fb�fo@��fn�fn�fL$fb�fnM$fl�fl�fl�fo0��f|$ fo`��fp� ����f|$PfD$`fT$pf�$�   f�$�   fo�$�   foD$Pf��f�d$pf~�fs�f~��>�V��$�   ݄$�   ����$�   f����݄$�   ��$�   �����0��݄$�   ��$�   ��������݄$�   �����h�Ã���������ݜ$�   ������$�   ����ݜ$�   f�$�   ��$�   (�݄$�   ��$�   ����݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ��������������;�f����  fo�$�   ݜ$�   f��������$�   ����f�d$ݜ$�   f~�f�$�   ���  (�f����  ���  �6��~��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~�����ݜ$�   ������$�   �����&ݜ$�   �nf�$�   ��$�   ݄$�   ����$�   (���݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ������������f����  fo�ݜ$�   f��������$�   ����f�t$ ݜ$�   f~�f�$�   (�f����  ��   ��  �.�f��$�   ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~�����ݜ$�   ������$�   �����6ݜ$�   �~f�$�   ��$�   (�݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ������������ݜ$�   ������$�   ����ݜ$�   f�$�   (�f���  fo�$�   ��  fo�f��f�|$`f~�f����  ���  �.�f��$�    ݄$�   ����$�   ��݄$�   ������$�   ��݄$�   ��$�   ��������݄$�   ����fs�����f~�����ݜ$�   ������$�   �����ݜ$�   �~ftion,horizontal:i.isHorizontal(),weight:i.weight});return a}(t),n=ue(le(e,"left"),!0),i=ue(le(e,"right")),a=ue(le(e,"top"),!0),r=ue(le(e,"bottom"));return{leftAndTop:n.concat(a),rightAndBottom:i.concat(r),chartArea:le(e,"chartArea"),vertical:n.concat(i),horizontal:a.concat(r)}}(t.boxes),l=s.vertical,u=s.horizontal,d=Object.freeze({outerWidth:e,outerHeight:n,padding:a,availableWidth:r,vBoxMaxWidth:r/2/l.length,hBoxMaxHeight:o/2}),h=se({maxPadding:se({},a),w:r,h:o,x:a.left,y:a.top},a);!function(t,e){var n,i,a;for(n=0,i=t.length;n<i;++n)(a=t[n]).width=a.horizontal?a.box.fullWidth&&e.availableWidth:e.vBoxMaxWidth,a.height=a.horizontal&&e.hBoxMaxHeight}(l.concat(u),d),fe(l,h,d),fe(u,h,d)&&fe(l,h,d),function(t){var e=t.maxPadding;function n(n){var i=Math.max(e[n]-t[n],0);return t[n]+=i,i}t.y+=n("top"),t.x+=n("left"),n("right"),n("bottom")}(h),ge(s.leftAndTop,h,d),h.x+=h.w,h.y+=h.h,ge(s.rightAndBottom,h,d),t.chartArea={left:h.left,top:h.top,right:h.left+h.w,bottom:h.top+h.h},B.each(s.chartArea,(function(e){var n=e.box;se(n,t.chartArea),n.update(h.w,h.h)}))}}},ve=(me=Object.freeze({__proto__:null,default:"@keyframes chartjs-render-animation{from{opacity:.99}to{opacity:1}}.chartjs-render-monitor{animation:chartjs-render-animation 1ms}.chartjs-size-monitor,.chartjs-size-monitor-expand,.chartjs-size-monitor-shrink{position:absolute;direction:ltr;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none;visibility:hidden;z-index:-1}.chartjs-size-monitor-expand>div{position:absolute;width:1000000px;height:1000000px;left:0;top:0}.chartjs-size-monitor-shrink>div{position:absolute;width:200%;height:200%;left:0;top:0}"}))&&me.default||me,be="$chartjs",ye="chartjs-size-monitor",xe="chartjs-render-monitor",_e="chartjs-render-animation",we=["animationstart","webkitAnimationStart"],ke={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"};function Me(t,e){var n=B.getStyle(t,e),i=n&&n.match(/^(\d+)(\.\d+)?px$/);return i?Number(i[1]):void 0}var Se=!!function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("e",null,e)}catch(t){}return t}()&&{passive:!0};function De(t,e,n){t.addEventListener(e,n,Se)}function Ce(t,e,n){t.removeEventListener(e,n,Se)}function Pe(t,e,n,i,a){return{type:t,chart:e,native:a||null,x:void 0!==n?n:null,y:void 0!==i?i:null}}function Te(t){var e=document.createElement("div");return e.className=t||"",e}function Oe(t,e,n){var i,a,r,o,s=t[be]||(t[be]={}),l=s.resizer=function(t){var e=Te(ye),n=Te(ye+"-expand"),i=Te(ye+"-shrink");n.appendChild(Te()),i.appendChild(Te()),e.appendChild(n),e.appendChild(i),e._reset=function(){n.scrollLeft=1e6,n.scrollTop=1e6,i.scrollLeft=1e6,i.scrollTop=1e6};var a=function(){e._reset(),t()};return De(n,"scroll",a.bind(n,"expand")),De(i,"scroll",a.bind(i,"shrink")),e}((i=function(){if(s.resizer){var i=n.options.maintainAspectRatio&&t.parentNode,a=i?i.clientWidth:0;e(Pe("resize",n)),i&&i.clientWidth<a&&n.canvas&&e(Pe("resize",n))}},r=!1,o=[],function(){o=Array.prototype.slice.call(arguments),a=a||this,r||(r=!0,B.requestAnimFrame.call(window,(function(){r=!1,i.apply(a,o)})))}));!function(t,e){var n=t[be]||(t[be]={}),i=n.renderProxy=function(t){t.animationName===_e&&e()};B.each(we,(function(e){De(t,e,i)})),n.reflow=!!t.offsetParent,t.classList.add(xe)}(t,(function(){if(s.resizer){var e=t.parentNode;e&&e!==l.parentNode&&e.insertBefore(l,e.firstChild),l._reset()}}))}function Ae(t){var e=t[be]||{},n=e.resizer;delete e.resizer,function(t){var e=t[be]||{},n=e.renderProxy;n&&(B.each(we,(function(e){Ce(t,e,n)})),delete e.renderProxy),t.classList.remove(xe)}(t),n&&n.parentNode&&n.parentNode.removeChild(n)}var Fe={disableCSSInjection:!1,_enabled:"undefined"!=typeof window&&"undefined"!=typeof document,_ensureLoaded:function(t){if(!this.disableCSSInjection){var e=t.getRootNode?t.getRootNode():document;!function(t,e){var n=t[be]||(t[be]={});if(!n.containsStyles){n.containsStyles=!0,e="/* Chart.js */\n"+e;var i=document.createElement("style");i.setAttribute("type","text/css"),i.appendChild(document.createTextNode(e)),t.appendChild(i)}}(e.host?e:document.head,ve)}},acquireContext:function(t,e){"string"==typeof t?t=document.getElementById(t):t.length&&(t=t[0]),t&&t.canvas&&(t=t.canvas);var n=t&&t.getContext&&t.getContext("2d");return n&&n.canvas===t?(this._ensureLoaded(t),function(t,e){var n=t.style,i=t.getAttribute("height"),a=t.getAttribute("width");if(t[be]={initial:{height:i,width:a,style:{display:n.display,height:n.height,width:n.width}}},n.display=n.display||"block",null===a||""===a){var r=Me(t,"width");void 0!==r&&(t.width=r)}if(null===i||""===i)if(""===t.style.height)t.height=t.width/(e.options.aspectRatio||2);else{var o=Me(t,"height");void 0!==r&&(t.height=o)}}(t,e),n):null},releaseContext:function(t){var e=t.canvas;if(e[be]){var n=e[be].initial;["height","width"].forEach((function(t){var i=n[t];B.isNullOrUndef(i)?e.removeAttribute(t):e.setAttribute(t,i)})),B.each(n.style||{},(function(t,n){e.style[n]=t})),e.width=e.width,delete e[be]}},addEventListener:function(t,e,n){var i=t.canvas;if("resize"!==e){var a=n[be]||(n[be]={});De(i,e,(a.proxies||(a.proxies={}))[t.id+"_"+e]=function(e){n(function(t,e){var n=ke[t.type]||t.type,i=B.getRelativePosition(t,e);return Pe(n,e,i.x,i.y,t)}(e,t))})}else Oe(i,n,t)},removeEventListener:function(t,e,n){var i=t.canvas;if("resize"!==e){var a=((n[be]||{}).proxies||{})[t.id+"_"+e];a&&Ce(i,e,a)}else Ae(i)}};B.addEvent=De,B.removeEvent=Ce;var Ie=Fe._enabled?Fe:{acquireContext:function(t){return t&&t.canvas&&(t=t.canvas),t&&t.getContext("2d")||null}},Le=B.extend({initialize:function(){},acquireContext:function(){},releaseContext:function(){},addEventListener:function(){},removeEventListener:function(){}},Ie);Y._set("global",{plugins:{}});var Re={_plugins:[],_cacheId:0,register:function(t){var e=this._plugins;[].concat(t).forEach((function(t){-1===e.indexOf(t)&&e.push(t)})),this._cacheId++},unregister:function(t){var e=this._plugins;[].concat(t).forEach((function(t){var n=e.indexOf(t);-1!==n&&e.splice(n,1)})),this._cacheId++},clear:function(){this._plugins=[],this._cacheId++},count:function(){return this._plugins.length},getAll:function(){return this._plugins},notify:function(t,e,n){var i,a,r,o,s,l=this.descriptors(t),u=l.length;for(i=0;i<u;++i)if("function"==typeof(s=(r=(a=l[i]).plugin)[e])&&((o=[t].concat(n||[])).push(a.options),!1===s.apply(r,o)))return!1;return!0},descriptors:function(t){var e=t.$plugins||(t.$plugins={});if(e.id===this._cacheId)return e.descriptors;var n=[],i=[],a=t&&t.config||{},r=a.options&&a.options.plugins||{};return this._plugins.concat(a.plugins||[]).forEach((function(t){if(-1===n.indexOf(t)){var e=t.id,a=r[e];!1!==a&&(!0===a&&(a=B.clone(Y.global.plugins[e])),n.push(t),i.push({plugin:t,options:a||{}}))}})),e.descriptors=i,e.id=this._cacheId,i},_invalidate:function(t){delete t.$plugins}},Ne={constructors:{},defaults:{},registerScaleType:function(t,e,n){this.constructors[t]=e,this.defaults[t]=B.clone(n)},getScaleConstructor:function(t){return this.constructors.hasOwnProperty(t)?this.constructors[t]:void 0},getScaleDefaults:function(t){return this.defaults.hasOwnProperty(t)?B.merge(Object.create(null),[Y.scale,this.defaults[t]]):{}},updateScaleDefaults:function(t,e){this.defaults.hasOwnProperty(t)&&(this.defaults[t]=B.extend(this.defaults[t],e))},addScalesToLayout:function(t){B.each(t.scales,(function(e){e.fullWidth=e.options.fullWidth,e.position=e.options.position,e.weight=e.options.weight,pe.addBox(t,e)}))}},We=B.valueOrDefault,Ye=B.rtl.getRtlAdapter;Y._set("global",{tooltips:{enabled:!0,custom:null,mode:"nearest",position:"average",intersect:!0,backgroundColor:"rgba(0,0,0,0.8)",titleFontStyle:"bold",titleSpacing:2,titleMarginBottom:6,titleFontColor:"#fff",titleAlign:"left",bodySpacing:2,bodyFontColor:"#fff",bodyAlign:"left",footerFontStyle:"bold",footerSpacing:2,footerMarginTop:6,footerFontColor:"#fff",footerAlign:"left",yPadding:6,xPadding:6,caretPadding:2,caretSize:5,cornerRadius:6,multiKeyBackground:"#fff",displayColors:!0,borderColor:"rgba(0,0,0,0)",borderWidth:0,callbacks:{beforeTitle:B.noop,title:function(t,e){var n="",i=e.labels,a=i?i.length:0;if(t.length>0){var r=t[0];r.label?n=r.label:r.xLabel?n=r.xLabel:a>0&&r.index<a&&(n=i[r.index])}return n},afterTitle:B.noop,beforeBody:B.noop,beforeLabel:B.noop,label:function(t,e){var n=e.datasets[t.datasetIndex].label||"";return n&&(n+=": "),B.isNullOrUndef(t.value)?n+=t.yLabel:n+=t.value,n},labelColor:function(t,e){var n=e.getDatasetMeta(t.datasetIndex).data[t.index]._view;return{borderColor:n.borderColor,backgroundColor:n.backgroundColor}},labelTextColor:function(){return this._options.bodyFontColor},afterLabel:B.noop,afterBody:B.noop,beforeFooter:B.noop,footer:B.noop,afterFooter:B.noop}}});var ze={average:function(t){if(!t.length)return!1;var e,n,i=0,a=0,r=0;for(e=0,n=t.length;e<n;++e){var o=t[e];if(o&&o.hasValue()){var s=o.tooltipPosition();i+=s.x,a+=s.y,++r}}return{x:i/r,y:a/r}},nearest:function(t,e){var n,i,a,r=e.x,o=e.y,s=Number.POSITIVE_INFINITY;for(n=0,i=t.length;n<i;++n){var l=t[n];if(l&&l.hasValue()){var u=l.getCenterPoint(),d=B.distanceBetweenPoints(e,u);d<s&&(s=d,a=l)}}if(a){var h=a.tooltipPosition();r=h.x,o=h.y}return{x:r,y:o}}};function Ee(t,e){return e&&(B.isArray(e)?Array.prototype.push.apply(t,e):t.push(e)),t}function Ve(t){return("string"==typeof t||t instanceof String)&&t.indexOf("\n")>-1?t.split("\n"):t}function He(t){var e=Y.global;return{xPadding:t.xPadding,yPadding:t.yPadding,xAlign:t.xAlign,yAlign:t.yAlign,rtl:t.rtl,textDirection:t.textDirection,bodyFontColor:t.bodyFontColor,_bodyFontFamily:We(t.bodyFontFamily,e.defaultFontFamily),_bodyFontStyle:We(t.bodyFontStyle,e.defaultFontStyle),_bodyAlign:t.bodyAlign,bodyFontSize:We(t.bodyFontSize,e.defaultFontSize),bodySpacing:t.bodySpacing,titleFontColor:t.titleFontColor,_titleFontFamily:We(t.titleFontFamily,e.defaultFontFamily),_titleFontStyle:We(t.titleFontStyle,e.defaultFontStyle),titleFontSize:We(t.titleFontSize,e.defaultFontSize),_titleAlign:t.titleAlign,titleSpacing:t.titleSpacing,titleMarginBottom:t.titleMarginBottom,footerFontColor:t.footerFontColor,_footerFontFamily:We(t.footerFontFamily,e.defaultFontFamily),_footerFontStyle:We(t.footerFontStyle,e.defaultFontStyle),footerFontSize:We(t.footerFontSize,e.defaultFontSize),_footerAlign:t.footerAlign,footerSpacing:t.footerSpacing,footerMarginTop:t.footerMarginTop,caretSize:t.caretSize,cornerRadius:t.cornerRadius,backgroundColor:t.backgroundColor,opacity:0,legendColorBackground:t.multiKeyBackground,displayColors:t.displayColors,borderColor:t.borderColor,borderWidth:t.borderWidth}}function Be(t,e){return"center"===e?t.x+t.width/2:"right"===e?t.x+t.width-t.xPadding:t.x+t.xPadding}function je(t){return Ee([],Ve(t))}var Ue=X.extend({initialize:function(){this._model=He(this._options),this._lastActive=[]},getTitle:function(){var t=this,e=t._options,n=e.callbacks,i=n.beforeTitle.apply(t,arguments),a=n.title.apply(t,arguments),r=n.afterTitle.apply(t,arguments),o=[];return o=Ee(o,Ve(i)),o=Ee(o,Ve(a)),o=Ee(o,Ve(r))},getBeforeBody:function(){return je(this._options.callbacks.beforeBody.apply(this,arguments))},getBody:function(t,e){var n=this,i=n._options.callbacks,a=[];return B.each(t,(function(t){var r={before:[],lines:[],after:[]};Ee(r.before,Ve(i.beforeLabel.call(n,t,e))),Ee(r.lines,i.label.call(n,t,e)),Ee(r.after,Ve(i.afterLabel.call(n,t,e))),a.push(r)})),a},getAfterBody:function(){return je(this._options.callbacks.afterBody.apply(this,arguments))},getFooter:function(){var t=this,e=t._options.callbacks,n=e.beforeFooter.apply(t,arguments),i=e.footer.apply(t,arguments),a=e.afterFooter.apply(t,arguments),r=[];return r=Ee(r,Ve(n)),r=Ee(r,Ve(i)),r=Ee(r,Ve(a))},update:function(t){var e,n,i,a,r,o,s,l,u,d,h=this,c=h._options,f=h._model,g=h._model=He(c),m=h._active,p=h._data,v={xAlign:f.xAlign,yAlign:f.yAlign},b={x:f.x,y:f.y},y={width:f.width,height:f.height},x={x:f.caretX,y:f.caretY};if(m.length){g.opacity=1;var _=[],w=[];x=ze[c.position].call(h,m,h._eventPosition);var k=[];for(e=0,n=m.length;e<n;++e)k.push((i=m[e],a=void 0,r=void 0,o=void 0,s=void 0,l=void 0,u=void 0,d=void 0,a=i._xScale,r=i._yScale||i._scale,o=i._index,s=i._datasetIndex,l=i._chart.getDatasetMeta(s).controller,u=l._getIndexScale(),d=l._getValueScale(),{xLabel:a?a.getLabelForIndex(o,s):"",yLabel:r?r.getLabelForIndex(o,s):"",label:u?""+u.getLabelForIndex(o,s):"",value:d?""+d.getLabelForIndex(o,s):"",index:o,datasetIndex:s,x:i._model.x,y:i._model.y}));c.filter&&(k=k.filter((function(t){return c.filter(t,p)}))),c.itemSort&&(k=k.sort((function(t,e){return c.itemSort(t,e,p)}))),B.each(k,(function(t){_.push(c.callbacks.labelColor.call(h,t,h._chart)),w.push(c.callbacks.labelTextColor.call(h,t,h._chart))})),g.title=h.getTitle(k,p),g.beforeBody=h.getBeforeBody(k,p),g.body=h.getBody(k,p),g.afterBody=h.getAfterBody(k,p),g.footer=h.getFooter(k,p),g.x=x.x,g.y=x.y,g.caretPadding=c.caretPadding,g.labelColors=_,g.labelTextColors=w,g.dataPoints=k,y=function(t,e){var n=t._chart.ctx,i=2*e.yPadding,a=0,r=e.body,o=r.reduce((function(t,e){return t+e.before.length+e.lines.length+e.after.length}),0);o+=e.beforeBody.length+e.afterBody.length;var s=e.title.length,l=e.footer.length,u=e.titleFontSize,d=e.bodyFontSize,h=e.footerFontSize;i+=s*u,i+=s?(s-1)*e.titleSpacing:0,i+=s?e.titleMarginBottom:0,i+=o*d,i+=o?(o-1)*e.bodySpacing:0,i+=l?e.footerMarginTop:0,i+=l*h,i+=l?(l-1)*e.footerSpacing:0;var c=0,f=function(t){a=Math.max(a,n.measureText(t).width+c)};return n.font=B.fontString(u,e._titleFontStyle,e._titleFontFamily),B.each(e.title,f),n.font=B.fontString(d,e._bodyFontStyle,e._bodyFontFamily),B.each(e.beforeBody.concat(e.afterBody),f),c=e.displayColors?d+2:0,B.each(r,(function(t){B.each(t.before,f),B.each(t.lines,f),B.each(t.after,f)})),c=0,n.font=B.fontString(h,e._footerFontStyle,e._footerFontFamily),B.each(e.footer,f),{width:a+=2*e.xPadding,height:i}}(this,g),b=function(t,e,n,i){var a=t.x,r=t.y,o=t.caretSize,s=t.caretPadding,l=t.cornerRadius,u=n.xAlign,d=n.yAlign,h=o+s,c=l+s;return"right"===u?a-=e.width:"center"===u&&((a-=e.width/2)+e.width>i.width&&(a=i.width-e.width),a<0&&(a=0)),"top"===d?r+=h:r-="bottom"===d?e.height+h:e.height/2,"center"===d?"left"===u?a+=h:"right"===u&&(a-=h):"left"===u?a-=c:"right"===u&&(a+=c),{x:a,y:r}}(g,y,v=function(t,e){var n,i,a,r,o,s=t._model,l=t._chart,u=t._chart.chartArea,d="center",h="center";s.y<e.height?h="top":s.y>l.height-e.height&&(h="bottom");var c=(u.left+u.right)/2,f=(u.top+u.bottom)/2;"center"===h?(n=function(t){return t<=c},i=function(t){return t>c}):(n=function(t){return t<=e.width/2},i=function(t){return t>=l.width-e.width/2}),a=function(t){return t+e.width+s.caretSize+s.caretPadding>l.width},r=function(t){return t-e.width-s.caretSize-s.caretPadding<0},o=function(t){return t<=f?"top":"bottom"},n(s.x)?(d="left",a(s.x)&&(d="center",h=o(s.y))):i(s.x)&&(d="right",r(s.x)&&(d="center",h=o(s.y)));var g=t._options;return{xAlign:g.xAlign?g.xAlign:d,yAlign:g.yAlign?g.yAlign:h}}(this,y),h._chart)}else g.opacity=0;return g.xAlign=v.xAlign,g.yAlign=v.yAlign,g.x=b.x,g.y=b.y,g.width=y.width,g.height=y.height,g.caretX=x.x,g.caretY=x.y,h._model=g,t&&c.custom&&c.custom.call(h,g),h},drawCaret:function(t,e){var n=this._chart.ctx,i=this._view,a=this.getCaretPosition(t,e,i);n.lineTo(a.x1,a.y1),n.lineTo(a.x2,a.y2),n.lineTo(a.x3,a.y3)},getCaretPosition:function(t,e,n){var i,a,r,o,s,l,u=n.caretSize,d=n.cornerRadius,h=n.xAlign,c=n.yAlign,f=t.x,g=t.y,m=e.width,p=e.height;if("center"===c)s=g+p/2,"left"===h?(a=(i=f)-u,r=i,o=s+u,l=s-u):(a=(i=f+m)+u,r=i,o=s-u,l=s+u);else if("left"===h?(i=(a=f+d+u)-u,r=a+u):"right"===h?(i=(a=f+m-d-u)-u,r=a+u):(i=(a=n.caretX)-u,r=a+u),"top"===c)s=(o=g)-u,l=o;else{s=(o=g+p)+u,l=o;var v=r;r=i,i=v}return{x1:i,x2:a,x3:r,y1:o,y2:s,y3:l}},drawTitle:function(t,e,n){var i,a,r,o=e.title,s=o.length;if(s){var l=Ye(e.rtl,e.x,e.width);for(t.x=Be(e,e._titleAlign),n.textAlign=l.textAlign(e._titleAlign),n.textBaseline="middle",i=e.titleFontSize,a=e.titleSpacing,n.fillStyle=e.titleFontColor,n.font=B.fontString(i,e._titleFontStyle,e._titleFontFamily),r=0;r<s;++r)n.fillText(o[r],l.x(t.x),t.y+i/2),t.y+=i+a,r+1===s&&(t.y+=e.titleMarginBottom-a)}},drawBody:function(t,e,n){var i,a,r,o,s,l,u,d,h=e.bodyFontSize,c=e.bodySpacing,f=e._bodyAlign,g=e.body,m=e.displayColors,p=0,v=m?Be(e,"lAlign = findAlignedLines(dv, other);

    // Clear old aligners
    var aligners = dv.mv.aligners;
    for (var i = 0; i < aligners.length; i++)
      aligners[i].clear();
    aligners.length = 0;

    var cm = [dv.edit, dv.orig], scroll = [], offset = []
    if (other) cm.push(other.orig);
    for (var i = 0; i < cm.length; i++) {
      scroll.push(cm[i].getScrollInfo().top);
      offset.push(-cm[i].getScrollerElement().getBoundingClientRect().top)
    }

    if (offset[0] != offset[1] || cm.length == 3 && offset[1] != offset[2])
      alignLines(cm, offset, [0, 0, 0], aligners)
    for (var ln = 0; ln < linesToAlign.length; ln++)
      alignLines(cm, offset, linesToAlign[ln], aligners);

    for (var i = 0; i < cm.length; i++)
      cm[i].scrollTo(null, scroll[i]);
  }

  function alignLines(cm, cmOffset, lines, aligners) {
    var maxOffset = -1e8, offset = [];
    for (var i = 0; i < cm.length; i++) if (lines[i] != null) {
      var off = cm[i].heightAtLine(lines[i], "local") - cmOffset[i];
      offset[i] = off;
      maxOffset = Math.max(maxOffset, off);
    }
    for (var i = 0; i < cm.length; i++) if (lines[i] != null) {
      var diff = maxOffset - offset[i];
      if (diff > 1)
        aligners.push(padAbove(cm[i], lines[i], diff));
    }
  }

  function padAbove(cm, line, size) {
    var above = true;
    if (line > cm.lastLine()) {
      line--;
      above = false;
    }
    var elt = document.createElement("div");
    elt.className = "CodeMirror-merge-spacer";
    elt.style.height = size + "px"; elt.style.minWidth = "1px";
    return cm.addLineWidget(line, elt, {height: size, above: above, mergeSpacer: true, handleMouseEvents: true});
  }

  function drawConnectorsForChunk(dv, chunk, sTopOrig, sTopEdit, w) {
    var flip = dv.type == "left";
    var top = dv.orig.heightAtLine(chunk.origFrom, "local", true) - sTopOrig;
    if (dv.svg) {
      var topLpx = top;
      var topRpx = dv.edit.heightAtLine(chunk.editFrom, "local", true) - sTopEdit;
      if (flip) { var tmp = topLpx; topLpx = topRpx; topRpx = tmp; }
      var botLpx = dv.orig.heightAtLine(chunk.origTo, "local", true) - sTopOrig;
      var botRpx = dv.edit.heightAtLine(chunk.editTo, "local", true) - sTopEdit;
      if (flip) { var tmp = botLpx; botLpx = botRpx; botRpx = tmp; }
      var curveTop = " C " + w/2 + " " + topRpx + " " + w/2 + " " + topLpx + " " + (w + 2) + " " + topLpx;
      var curveBot = " C " + w/2 + " " + botLpx + " " + w/2 + " " + botRpx + " -1 " + botRpx;
      attrs(dv.svg.appendChild(document.createElementNS(svgNS, "path")),
            "d", "M -1 " + topRpx + curveTop + " L " + (w + 2) + " " + botLpx + curveBot + " z",
            "class", dv.classes.connect);
    }
    if (dv.copyButtons) {
      var copy = dv.copyButtons.appendChild(elt("div", dv.type == "left" ? "\u21dd" : "\u21dc",
                                                "CodeMirror-merge-copy"));
      var editOriginals = dv.mv.options.allowEditingOriginals;
      copy.title = dv.edit.phrase(editOriginals ? "Push to left" : "Revert chunk");
      copy.chunk = chunk;
      copy.style.top = (chunk.origTo > chunk.origFrom ? top : dv.edit.heightAtLine(chunk.editFrom, "local") - sTopEdit) + "px";
      copy.setAttribute("role", "button");

      if (editOriginals) {
        var topReverse = dv.edit.heightAtLine(chunk.editFrom, "local") - sTopEdit;
        var copyReverse = dv.copyButtons.appendChild(elt("div", dv.type == "right" ? "\u21dd" : "\u21dc",
                                                         "CodeMirror-merge-copy-reverse"));
        copyReverse.title = "Push to right";
        copyReverse.chunk = {editFrom: chunk.origFrom, editTo: chunk.origTo,
                             origFrom: chunk.editFrom, origTo: chunk.editTo};
        copyReverse.style.top = topReverse + "px";
        dv.type == "right" ? copyReverse.style.left = "2px" : copyReverse.style.right = "2px";
        copyReverse.setAttribute("role", "button");
      }
    }
  }

  function copyChunk(dv, to, from, chunk) {
    if (dv.diffOutOfDate) return;
    var origStart = chunk.origTo > from.lastLine() ? Pos(chunk.origFrom - 1) : Pos(chunk.origFrom, 0)
    var origEnd = Pos(chunk.origTo, 0)
    var editStart = chunk.editTo > to.lastLine() ? Pos(chunk.editFrom - 1) : Pos(chunk.editFrom, 0)
    var editEnd = Pos(chunk.editTo, 0)
    var handler = dv.mv.options.revertChunk
    if (handler)
      handler(dv.mv, from, origStart, origEnd, to, editStart, editEnd)
    else
      to.replaceRange(from.getRange(origStart, origEnd), editStart, editEnd)
  }

  // Merge view, containing 0, 1, or 2 diff views.

  var MergeView = CodeMirror.MergeView = function(node, options) {
    if (!(this instanceof MergeView)) return new MergeView(node, options);

    this.options = options;
    var origLeft = options.origLeft, origRight = options.origRight == null ? options.orig : options.origRight;

    var hasLeft = origLeft != null, hasRight = origRight != null;
    var panes = 1 + (hasLeft ? 1 : 0) + (hasRight ? 1 : 0);
    var wrap = [], left = this.left = null, right = this.right = null;
    var self = this;

    if (hasLeft) {
      left = this.left = new DiffView(this, "left");
      var leftPane = elt("div", null, "CodeMirror-merge-pane CodeMirror-merge-left");
      wrap.push(leftPane);
      wrap.push(buildGap(left));
    }

    var editPane = elt("div", null, "CodeMirror-merge-pane CodeMirror-merge-editor");
    wrap.push(editPane);

    if (hasRight) {
      right = this.right = new DiffView(this, "right");
      wrap.push(buildGap(right));
      var rightPane = elt("div", null, "CodeMirror-merge-pane CodeMirror-merge-right");
      wrap.push(rightPane);
    }

    (hasRight ? rightPane : editPane).className += " CodeMirror-merge-pane-rightmost";

    wrap.push(elt("div", null, null, "height: 0; clear: both;"));

    var wrapElt = this.wrap = node.appendChild(elt("div", wrap, "CodeMirror-merge CodeMirror-merge-" + panes + "pane"));
    this.edit = CodeMirror(editPane, copyObj(options));

    if (left) left.init(leftPane, origLeft, options);
    if (right) right.init(rightPane, origRight, options);
    if (options.collapseIdentical)
      this.editor().operation(function() {
        collapseIdenticalStretches(self, options.collapseIdentical);
      });
    if (options.connect == "align") {
      this.aligners = [];
      alignChunks(this.left || this.right, true);
    }
    if (left) left.registerEvents(right)
    if (right) right.registerEvents(left)


    var onResize = function() {
      if (left) makeConnections(left);
      if (right) makeConnections(right);
    };
    CodeMirror.on(window, "resize", onResize);
    var resizeInterval = setInterval(function() {
      for (var p = wrapElt.parentNode; p && p != document.body; p = p.parentNode) {}
      if (!p) { clearInterval(resizeInterval); CodeMirror.off(window, "resize", onResize); }
    }, 5000);
  };

  function buildGap(dv) {
    var lock = dv.lockButton = elt("div", null, "CodeMirror-merge-scrolllock");
    lock.setAttribute("role", "button");
    var lockWrap = elt("div", [lock], "CodeMirror-merge-scrolllock-wrap");
    CodeMirror.on(lock, "click", function() { setScrollLock(dv, !dv.lockScroll); });
    var gapElts = [lockWrap];
    if (dv.mv.options.revertButtons !== false) {
      dv.copyButtons = elt("div", null, "CodeMirror-merge-copybuttons-" + dv.type);
      CodeMirror.on(dv.copyButtons, "click", function(e) {
        var node = e.target || e.srcElement;
        if (!node.chunk) return;
        if (node.className == "CodeMirror-merge-copy-reverse") {
          copyChunk(dv, dv.orig, dv.edit, node.chunk);
          return;
        }
        copyChunk(dv, dv.edit, dv.orig, node.chunk);
      });
      gapElts.unshift(dv.copyButtons);
    }
    if (dv.mv.options.connect != "align") {
      var svg = document.createElementNS && document.createElementNS(svgNS, "svg");
      if (svg && !svg.createSVGRect) svg = null;
      dv.svg = svg;
      if (svg) gapElts.push(svg);
    }

    return dv.gap = elt("div", gapElts, "CodeMirror-merge-gap");
  }

  MergeView.prototype = {
    constructor: MergeView,
    editor: function() { return this.edit; },
    rightOriginal: function() { return this.right && this.right.orig; },
    leftOriginal: function() { return this.left && this.left.orig; },
    setShowDifferences: function(val) {
      if (this.right) this.right.setShowDifferences(val);
      if (this.left) this.left.setShowDifferences(val);
    },
    rightChunks: function() {
      if (this.right) { ensureDiff(this.right); return this.right.chunks; }
    },
    leftChunks: function() {
      if (this.left) { ensureDiff(this.left); return this.left.chunks; }
    }
  };

  function asString(obj) {
    if (typeof obj == "string") return obj;
    else return obj.getValue();
  }

  // Operations on diffs
  var dmp;
  function getDiff(a, b, ignoreWhitespace) {
    if (!dmp) dmp = new diff_match_patch();

    var diff = dmp.diff_main(a, b);
    // The library sometimes leaves in empty parts, which confuse the algorithm
    for (var i = 0; i < diff.length; ++i) {
      var part = diff[i];
      if (ignoreWhitespace ? !/[^ \t]/.test(part[1]) : !part[1]) {
        diff.splice(i--, 1);
      } else if (i && diff[i - 1][0] == part[0]) {
        diff.splice(i--, 1);
        diff[i][1] += part[1];
      }
    }
    return diff;
  }

  function getChunks(diff) {
    var chunks = [];
    if (!diff.length) return chunks;
    var startEdit = 0, startOrig = 0;
    var edit = Pos(0, 0), orig = Pos(0, 0);
    for (var i = 0; i < diff.length; ++i) {
      var part = diff[i], tp = part[0];
      if (tp == DIFF_EQUAL) {
        var startOff = !startOfLineClean(diff, i) || edit.line < startEdit || orig.line < startOrig ? 1 : 0;
        var cleanFromEdit = edit.line + startOff, cleanFromOrig = orig.line + startOff;
        moveOver(edit, part[1], null, orig);
        var endOff = endOfLineClean(diff, i) ? 1 : 0;
        var cleanToEdit = edit.line + endOff, cleanToOrig = orig.line + endOff;
        if (cleanToEdit > cleanFromEdit) {
          if (i) chunks.push({origFrom: startOrig, origTo: cleanFromOrig,
                              editFrom: startEdit, editTo: cleanFromEdit});
          startEdit = cleanToEdit; startOrig = cleanToOrig;
        }
      } else {
        moveOver(tp == DIFF_INSERT ? edit : orig, part[1]);
      }
    }
    if (startEdit <= edit.line || startOrig <= orig.line)
      chunks.push({origFrom: startOrig, origTo: orig.line + 1,
                   editFrom: startEdit, editTo: edit.line + 1});
    return chunks;
  }

  function endOfLineClean(diff, i) {
    if (i == diff.length - 1) return true;
    var next = diff[i + 1][1];
    if ((next.length == 1 && i < diff.length - 2) || next.charCodeAt(0) != 10) return false;
    if (i == diff.length - 2) return true;
    next = diff[i + 2][1];
    return (next.length > 1 || i == diff.length - 3) && next.charCodeAt(0) == 10;
  }

  function startOfLineClean(diff, i) {
    if (i == 0) return true;
    var last = diff[i - 1][1];
    if (last.charCodeAt(last.length - 1) != 10) return false;
    if (i == 1) return true;
    last = diff[i - 2][1];
    return last.charCodeAt(last.length - 1) == 10;
  }

  function chunkBoundariesAround(chunks, n, nInEdit) {
    var beforeE, afterE, beforeO, afterO;
    for (var i = 0; i < chunks.length; i++) {
      var chunk = chunks[i];
      var fromLocal = nInEdit ? chunk.editFrom : chunk.origFrom;
      var toLocal = nInEdit ? chunk.editTo : chunk.origTo;
      if (afterE == null) {
        if (fromLocal > n) { afterE = chunk.editFrom; afterO = chunk.origFrom; }
        else if (toLocal > n) { afterE = chunk.editTo; afterO = chunk.origTo; }
      }
      if (toLocal <= n) { beforeE = chunk.editTo; beforeO = chunk.origTo; }
      else if (fromLocal <= n) { beforeE = chunk.editFrom; beforeO = chunk.origFrom; }
    }
    return {edit: {before: beforeE, after: afterE}, orig: {before: beforeO, after: afterO}};
  }

  function collapseSingle(cm, from, to) {
    cm.addLineClass(from, "wrap", "CodeMirror-merge-collapsed-line");
    var widget = document.createElement("span");
    widget.className = "CodeMirror-merge-collapsed-widget";
    widget.title = cm.phrase("Identical text collapsed. Click to expand.");
    var mark = cm.markText(Pos(from, 0), Pos(to - 1), {
      inclusiveLeft: true,
      inclusiveRight: true,
      replacedWith: widget,
      clearOnEnter: true
    });
    function clear() {
      mark.clear();
      cm.removeLineClass(from, "wrap", "CodeMirror-merge-collapsed-line");
    }
    if (mark.explicitlyCleared) clear();
    CodeMirror.on(widget, "click", clear);
    mark.on("clear", clear);
    CodeMirror.on(widget, "click", clear);
    return {mark: mark, clear: clear};
  }

  function collapseStretch(size, editors) {
    var marks = [];
    function clear() {
      for (var i = 0; i < marks.length; i++) marks[i].clear();
    }
    for (var i = 0; i < editors.length; i++) {
      var editor = editors[i];
      var mark = collapseSingle(editor.cm, editor.line, editor.line + size);
      marks.push(mark);
      mark.mark.on("clear", clear);
    }
    return marks[0].mark;
  }

  function unclearNearChunks(dv, margin, off, clear) {
    for (var i = 0; i < dv.chunks.length; i++) {
      var chunk = dv.chunks[i];
      for (var l = chunk.editFrom - margin; l < chunk.editTo + margin; l++) {
        var pos = l + off;
        if (pos >= 0 && pos < clear.length) clear[pos] = false;
      }
    }
  }

  function collapseIdenticalStretches(mv, margin) {
    if (typeof margin != "number") margin = 2;
    var clear = [], edit = mv.editor(), off = edit.firstLine();
    for (var l = off, e = edit.lastLine(); l <= e; l++) clear.push(true);
    if (mv.left) unclearNearChunks(mv.left, margin, off, clear);
    if (mv.right) unclearNearChunks(mv.right, margin, off, clear);

    for (var i = 0; i < clear.length; i++) {
      if (clear[i]) {
        var line = i + off;
        for (var size = 1; i < clear.length - 1 && clear[i + 1]; i++, size++) {}
        if (size > margin) {
          var editors = [{line: line, cm: edit}];
          if (mv.left) editors.push({line: getMatchingOrigLine(line, mv.left.chunks), cm: mv.left.orig});
          if (mv.right) editors.push({line: getMatchingOrigLine(line, mv.right.chunks), cm: mv.right.orig});
          var mark = collapseStretch(size, editors);
          if (mv.options.onCollapse) mv.options.onCollapse(mv, line, size, mark);
        }
      }
    }
  }

  // General utilities

  function elt(tag, content, className, style) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (style) e.style.cssText = style;
    if (typeof content == "string") e.appendChild(document.createTextNode(content));
    else if (content) for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);
    return e;
  }

  function clear(node) {
    for (var count = node.childNodes.length; count > 0; --count)
      node.removeChild(node.firstChild);
  }

  function attrs(elt) {
    for (var i = 1; i < arguments.length; i += 2)
      elt.setAttribute(arguments[i], arguments[i+1]);
  }

  function copyObj(obj, target) {
    if (!target) target = {};
    for (var prop in obj) if (obj.hasOwnProperty(prop)) target[prop] = obj[prop];
    return target;
  }

  function moveOver(pos, str, copy, other) {
    var out = copy ? Pos(pos.line, pos.ch) : pos, at = 0;
    for (;;) {
      var nl = str.indexOf("\n", at);
      if (nl == -1) break;
      ++out.line;
      if (other) ++other.line;
      at = nl + 1;
    }
    out.ch = (at ? 0 : out.ch) + (str.length - at);
    if (other) other.ch = (at ? 0 : other.ch) + (str.length - at);
    return out;
  }

  // Tracks collapsed markers and line widgets, in order to be able to
  // accurately align the content of two editors.

  var F_WIDGET = 1, F_WIDGET_BELOW = 2, F_MARKER = 4

  function TrackAlignable(cm) {
    this.cm = cm
    this.alignable = []
    this.height = cm.doc.height
    var self = this
    cm.on("markerAdded", function(_, marker) {
      if (!marker.collapsed) return
      var found = marker.find(1)
      if (found != null) self.set(found.line, F_MARKER)
    })
    cm.on("markerCleared", function(_, marker, _min, max) {
      if (max != null && marker.collapsed)
        self.check(max, F_MARKER, self.hasMarker)
    })
    c