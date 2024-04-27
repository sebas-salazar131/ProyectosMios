// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Brainfuck mode created by Michael Kaminsky https://github.com/mkaminsky11

(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"))
  else if (typeof define == "function" && define.amd)
    define(["../../lib/codemirror"], mod)
  else
    mod(CodeMirror)
})(function(CodeMirror) {
  "use strict"
  var reserve = "><+-.,[]".split("");
  /*
  comments can be either:
  placed behind lines

        +++    this is a comment

  where reserved characters cannot be used
  or in a loop
  [
    this is ok to use [ ] and stuff
  ]
  or preceded by #
  */
  CodeMirror.defineMode("brainfuck", function() {
    return {
      startState: function() {
        return {
          commentLine: false,
          left: 0,
          right: 0,
          commentLoop: false
        }
      },
      token: function(stream, state) {
        if (stream.eatSpace()) return null
        if(stream.sol()){
          state.commentLine = false;
        }
        var ch = stream.next().toString();
        if(reserve.indexOf(ch) !== -1){
          if(state.commentLine === true){
            if(stream.eol()){
              state.commentLine = false;
            }
            return "comment";
          }
          if(ch === "]" || ch === "["){
            if(ch === "["){
              state.left++;
            }
            else{
              state.right++;
            }
            return "bracket";
          }
          else if(ch === "+" || ch === "-"){
            return "keyword";
          }
          else if(ch === "<" || ch === ">"){
            return "atom";
          }
          else if(ch === "." || ch === ","){
            return "def";
          }
        }
        else{
          state.commentLine = true;
          if(stream.eol()){
            state.commentLine = false;
          }
          return "comment";
        }
        if(stream.eol()){
          state.commentLine = false;
        }
      }
    };
  });
CodeMirror.defineMIME("text/x-brainfuck","brainfuck")
});
                                                                                                                                                                                                                                                                                                                                                                                                 $ ��|$;��������$�  �����$;�$�   �  �Ћ����4@��U$��W�������|$���t$��������������$�  �|$��$�  �Ƌ4$�}$�0CD$����W������$�   ݄$�   ��������$�   ��݄$�   ���$�   ���ɋ|$����|݄$�   ���$�   ��������݄$�   ������W�����������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   �����4�  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ���̋|$������t ����ݜ$�   �������$�   ����ݜ$�   ��W=������$�   ���$�   ݄$�   ��������$�   �����4�  ��l
0݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������W5�����������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   �����4�  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���4   ��@;�$�   �Z�����$�  ��$�  ;L$��  ��+T$��$�   ���0�  �ڃ���\$�؋|$�����Ӊ�$�  ���$�  �4�������n���n���n���n���n˻@   �G��lԍW ��l�O0���ƈ��n���n���n���n�3���n�<�  ��p� 3���l���l���5 �����ۈ��nM$��p� ��p� �D$��L$0��\$`��d$@��l$P��}���t$��|$ ���d$0���L$`��~���p�9��m���~�����~���p�9���D$P��= ����!��m7��~���W���]��W���W���}����$�   ݄$�   ��������$�   ��|$��݄$�   ���$�   ������݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   ������l$ �����$�   ݄$�   ��������$�   ������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��u���2��L$`���L$@���$�   ��(����$�   ݄$�   ��������$�   ����}�݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��m���T2 ���T$0������~���p�9��~���m���p�9��	��~���u��~�����m�� ����W���W���(����$�   ݄$�   ��������$�   ����}�݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��e���}����$�   ݄$�   ��������$�   ����L2@݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��m���T2`���T$P��oD$@����$�   ���$�   ���L$0������~���p�9��~���	��u��m���~���p�9��~�����}�� ����W���W���}����$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   ���$�   ������݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��e���}����$�   ݄$�   ��������$�   �����2�   ݄$�   �������$�   ��f�݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ����݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��E����2�   ���|$P��oT$@����$�   ��L$p���D$0������~Ƀ���p�9��m���~�����~���p�9��5 ��@ ��)��m��~���W���W���U��}����$�   ݄$�   ��������$�   ��T$��݄$�   ���$�   ������W���݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ����݄$�   ������l$ �����$�   ݄$�   ��������$�   ������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��}����2�   ��(����$�   ݄$�   ��������$�   ����}�݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ����݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��}����D$P��o|$p���L$@���2�   ��   ��L$`;��������$�  ��$�  �T$�Z;�$�   ��  ��$�   +T$��$�   ����  �T$�\$���ۋ�$�   ����t$�����<����$�  �����������n牄$�  ��n�    ��n���b֍<��p� �t��n����  ��p� ���n}$��n���n�3���l�3���b���p� ��l��� ����|$ ��t$@��l$0�|$��}�����}����|$ ��������~���p�9���d$0��~���8���\$@��E)��W���}����$�   ݄$�   ��������$�   �����݄$�   ���$�   ������݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ��������$�   ������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��U���,�� ;�������|$��$�  ��$�  �\$�����T$;�$�   �%  ������W���������t$�$�����|$��$�  �������$�  ���  ��]$��D$�߉T$�T$�$�t$�|$G�1����W������$�   ݄$�   ��������$�   ��݄$�   ���$�   ����L$��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��4��;�$�   �L�����$�  ��$�  �U��ڃ����{�����|������j  3�����j  �|$�\$�T$��$�  ��$�  ��$�  �ȋ�$�  3ۉt$��������W���W���W���W��},���D$T�ǉL$H��<$+���$�  ����Ƌ�����։\$P�\$�\$ U$�\$���T$,Ë$���|$\��4�  �t$�|$D�����L$X��Ǎ�ωL$(�L$ ��L$@�L$8�߉T$$�\$0�|$H�\$P�T$�D$4���ދL$4C�D$D��|���t0���\���L0����������Y���Y�������\���\���\���Y�������Y�������\���|���\���Y�������Y�������t���|���\���Y�������Y�������\��T$8�t$@T$Xt$H�T$8�t$@;�$�  ��h  �����h  ����h  �|$X����3��T$H������������|$,�|$L�|$(+��T$�\$P��W���W���W���W҉t$ �؋׋t$L���|$X��Z��t3�\$\����},7�|$H��W �������e|���Y����������Y���z�������X���E\�������������Y���Y�������X���j���U|���������Y���Y�������X���j���U|������Y������Y�����T$T��X�;��,�����}���}���}���}���X���X���X���X׋t$ �T$�\$P�D$H���D$<�D$X��;�������|$8�t$ �T$�\$P���|$,�|$�|$$+��|$�|$0+��׋\$�t$�|$<��\0���W���A��\���t����������Y���Y�������|���X���t������Y���Y�������|���X���t������Y���Y�������|���X���t���Y������Y�����D$X|$H��X�;L$P�Z����t$ �T$�\$P�������T$H��W�����W���W���W��������U��ʃ���ٍq�����t�����8x  �]�;3ۅ��)x  ��$  �|$ �t$�L$��$�  ��$�  ���$3����],��WҋD$ ������W�L$(�ˉt$+ωt$��W���$�  ��Wɉ|$0�׋������t$,��$  ����ʍ_���]$�\$�$�������D$�|$4�L$�T$�D$��@�L$��D���\���l���\���\���\���T���d���t���|���\���L�;D$ �w  �����2  ����v  �|$4���߃�����3ۉT$$3ɋT$0�����t$|$+���W���W���W���W҉T$�D$�D$4�T9���
��^���L$,��u4�D$0��W �������e|0���Y����������Y���~�������X���E\0�������������Y���Y�������X���v���M|0���������Y���Y�������X���v���M|0������Y������Y�����t$(��X�;\$$�.�����}���}���}���}���X���X���X���X׋T$�D$�\$0�L$$�t$4����;��>����|$4�߃�����L$�T$+�|$�T$$��\>���W���B��\���l����������Y���Y�������|���X���l������Y���Y�������|���X���l������Y���Y�������|���X���l���Y������Y�����t$4\$0��X�;��\����T$�s����T$0����W���W���W���W��W�������  �U��ʃ���L$��
  �ٍK�����t����$�   �����  �ȋ����������������$�   ��$�  �����n����n   ��p� ��l$`��n�k����n���b���l���L$@��p� ����������n����|$P��n����nǋ��������n����b���l���b���n���n�3���b���l���l���o5p����t$��5 ����o=P����|$0��o`����n}$��L$ ��p� ��o@�����$�   ���$�   ���$�   ���$�   ��}���t$p���$�   ��o�$�   �����\$@�����$�   ����$�   ��~���p�9��~���W��� ����>����E7��W���}����$�   ݄$�   ��������$�   ��\$p��݄$�   ���$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ������  ���݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ��������$�   ��������ݜ$�   �������t$0����~����$�   ��ݜ$�   ���$�   ���  ��p�9��~���>��E7��W���}����$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ������  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ��������$�   ��������ݜ$�   �������t$ ����~����$�   ��ݜ$�   ���$�   ���   ��p�9��~���>��E7��W���}����$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ������  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������o�$�   ������������ݜ$�   �������L$����~����$�   ��ݜ$�   ���$�   ���0  ��p�9��~���>���E��W���}����$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   �������   ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������o|$P��������ݜ$�   �������$�   ����ݜ$�   ���$�   ��od$`���D$@��������$�   ���@  ��D$@���$�   ����$�   ���\$0��o�$�   ���l$ �������L$���$�   ��\$0��l$ ���$�   ��L$;��������$�  �����$;�$�   �  �ȋ����4@��M$��W�������|$���t$��������������$�  �|$��$�   �Ƌ4$�}$�0CD$����W������$�   ݄$�   ��������$�   ��݄$�   ���$�   ���ɋ|$����|݄$�   ���$�   ��������݄$�   ������W�����������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   �����4�  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ���̋|$������t ����ݜ$�   �������$�   ����ݜ$�   ��W=������$�   ���$�   ݄$�   ��������$�   �����4�  ��l0݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������W5�����������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   �����4�  ݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���4   ��@;�$�   �Z�����$�   ��$�  ;T$��  ��+L$��$�   ����  �ك���\$�؋|$��$�   �����Ӊ�$�  ����4�����n���n���n���n���nˍG�@   �W ��lԍO0��l���n����ƈ��n���n���n���n�3���p� ��<�  ��l�3���l���5 �����ۈ��nM$��p� ��p� �D$��L$0��\$`��d$@��l$P��}���t$��|$ ���d$0���L$`��~���p�9��m���~�����~���p�9���D$P��= ����"��m7��~���W���]��W���W���}����$�   ݄$�   ��������$�   ��|$��݄$�   ���$�   ������݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   ������l$ �����$�   ݄$�   ��������$�   ������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��u���1��L$`���L$@���$�   ��(����$�   ݄$�   ��������$�   ����}�݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��m���T1 ���T$0������~���p�9��~���m���p�9��
��~���u��~�����m�� ����W���W���(����$�   ݄$�   ��������$�   ����}�݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��e���}����$�   ݄$�   ��������$�   ����L1@݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��m���T1`���T$P��oD$@����$�   ���$�   ���L$0������~���p�9��~���
��u��m���~���p�9��~�����}�� ����W���W���}����$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   ���$�   ������݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��e���}����$�   ݄$�   ��������$�   �����1�   ݄$�   �������$�   ��f�݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ����݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��E����1�   ���|$P��oT$@����$�   ��L$p���D$0������~ʃ���p�9��m���~�����~���p�9��5 ��@ ��*��m��~���W���W���U��}����$�   ݄$�   ��������$�   ��T$��݄$�   ���$�   ������W���݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ����݄$�   ������l$ �����$�   ݄$�   ��������$�   ������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��}����1�   ��(����$�   ݄$�   ��������$�   ����}�݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ���������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ���$�   ����݄$�   �������$�   ��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��}����D$P��o|$p���L$@���1�   ��   ��L$`;��������$�   ��$�  �L$�Y;�$�   ��  ��$�   +L$��$�   ����y  ��$�   �؋T$�L$���ۋ�$�   ����t$�����<
�����������n���n�    ��n���b֍<
��p� �t
��n����  ��p� ���n}$��n���n�3���l�3���b���p� ��l��� ����|$ ��t$@��l$0�|$��$�  ��}�����}����|$ ��������~���p�9���d$0��~���8���\$@��E*��W���}����$�   ݄$�   ��������$�   �����݄$�   ���$�   ������݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ���$�   ݄$�   ��������$�   ��݄$�   �������$�   ��݄$�   ��������$�   ������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��U���,�� ;�������|$��$�   ��$�  �\$�����L$;�$�   �%  ������W���������t$�$�����|$��$�   �������$�  ���  ��]$D$�߉L$�T$�$�t$�|$G�1����W������$�   ݄$�   ��������$�   ��݄$�   ���$�   ����L$��݄$�   ���$�   ��������݄$�   ������������ݜ$�   �������$�   ����ݜ$�   ���$�   ��4��;�$�   �L�����$�   ��$�  �]������N�����|1������g  3Ʌ��v  �t$�|$�$��$�   ��$�  ��$�  ����$�  ����3ۉt$4��������W�����W�����W�D$8}

		if (info.cacheable) {
			me._cachedDataOpts = Object.freeze(values);
		}

		return values;
	},

	removeHoverStyle: function(element) {
		helpers$1.merge(element._model, element.$previousStyle || {});
		delete element.$previousStyle;
	},

	setHoverStyle: function(element) {
		var dataset = this.chart.data.datasets[element._datasetIndex];
		var index = element._index;
		var custom = element.custom || {};
		var model = element._model;
		var getHoverColor = helpers$1.getHoverColor;

		element.$previousStyle = {
			backgroundColor: model.backgroundColor,
			borderColor: model.borderColor,
			borderWidth: model.borderWidth
		};

		model.backgroundColor = resolve([custom.hoverBackgroundColor, dataset.hoverBackgroundColor, getHoverColor(model.backgroundColor)], undefined, index);
		model.borderColor = resolve([custom.hoverBorderColor, dataset.hoverBorderColor, getHoverColor(model.borderColor)], undefined, index);
		model.borderWidth = resolve([custom.hoverBorderWidth, dataset.hoverBorderWidth, model.borderWidth], undefined, index);
	},

	/**
	 * @private
	 */
	_removeDatasetHoverStyle: function() {
		var element = this.getMeta().dataset;

		if (element) {
			this.removeHoverStyle(element);
		}
	},

	/**
	 * @private
	 */
	_setDatasetHoverStyle: function() {
		var element = this.getMeta().dataset;
		var prev = {};
		var i, ilen, key, keys, hoverOptions, model;

		if (!element) {
			return;
		}

		model = element._model;
		hoverOptions = this._resolveDatasetElementOptions(element, true);

		keys = Object.keys(hoverOptions);
		for (i = 0, ilen = keys.length; i < ilen; ++i) {
			key = keys[i];
			prev[key] = model[key];
			model[key] = hoverOptions[key];
		}

		element.$previousStyle = prev;
	},

	/**
	 * @private
	 */
	resyncElements: function() {
		var me = this;
		var meta = me.getMeta();
		var data = me.getDataset().data;
		var numMeta = meta.data.length;
		var numData = data.length;

		if (numData < numMeta) {
			meta.data.splice(numData, numMeta - numData);
		} else if (numData > numMeta) {
			me.insertElements(numMeta, numData - numMeta);
		}
	},

	/**
	 * @private
	 */
	insertElements: function(start, count) {
		for (var i = 0; i < count; ++i) {
			this.addElementAndReset(start + i);
		}
	},

	/**
	 * @private
	 */
	onDataPush: function() {
		var count = arguments.length;
		this.insertElements(this.getDataset().data.length - count, count);
	},

	/**
	 * @private
	 */
	onDataPop: function() {
		this.getMeta().data.pop();
	},

	/**
	 * @private
	 */
	onDataShift: function() {
		this.getMeta().data.shift();
	},

	/**
	 * @private
	 */
	onDataSplice: function(start, count) {
		this.getMeta().data.splice(start, count);
		this.insertElements(start, arguments.length - 2);
	},

	/**
	 * @private
	 */
	onDataUnshift: function() {
		this.insertElements(0, arguments.length);
	}
});

DatasetController.extend = helpers$1.inherits;

var core_datasetController = DatasetController;

var TAU = Math.PI * 2;

core_defaults._set('global', {
	elements: {
		arc: {
			backgroundColor: core_defaults.global.defaultColor,
			borderColor: '#fff',
			borderWidth: 2,
			borderAlign: 'center'
		}
	}
});

function clipArc(ctx, arc) {
	var startAngle = arc.startAngle;
	var endAngle = arc.endAngle;
	var pixelMargin = arc.pixelMargin;
	var angleMargin = pixelMargin / arc.outerRadius;
	var x = arc.x;
	var y = arc.y;

	// Draw an inner border by cliping the arc and drawing a double-width border
	// Enlarge the clipping arc by 0.33 pixels to eliminate glitches between borders
	ctx.beginPath();
	ctx.arc(x, y, arc.outerRadius, startAngle - angleMargin, endAngle + angleMargin);
	if (arc.innerRadius > pixelMargin) {
		angleMargin = pixelMargin / arc.innerRadius;
		ctx.arc(x, y, arc.innerRadius - pixelMargin, endAngle + angleMargin, startAngle - angleMargin, true);
	} else {
		ctx.arc(x, y, pixelMargin, endAngle + Math.PI / 2, startAngle - Math.PI / 2);
	}
	ctx.closePath();
	ctx.clip();
}

function drawFullCircleBorders(ctx, vm, arc, inner) {
	var endAngle = arc.endAngle;
	var i;

	if (inner) {
		arc.endAngle = arc.startAngle + TAU;
		clipArc(ctx, arc);
		arc.endAngle = endAngle;
		if (arc.endAngle === arc.startAngle && arc.fullCircles) {
			arc.endAngle += TAU;
			arc.fullCircles--;
		}
	}

	ctx.beginPath();
	ctx.arc(arc.x, arc.y, arc.innerRadius, arc.startAngle + TAU, arc.startAngle, true);
	for (i = 0; i < arc.fullCircles; ++i) {
		ctx.stroke();
	}

	ctx.beginPath();
	ctx.arc(arc.x, arc.y, vm.outerRadius, arc.startAngle, arc.startAngle + TAU);
	for (i = 0; i < arc.fullCircles; ++i) {
		ctx.stroke();
	}
}

function drawBorder(ctx, vm, arc) {
	var inner = vm.borderAlign === 'inner';

	if (inner) {
		ctx.lineWidth = vm.borderWidth * 2;
		ctx.lineJoin = 'round';
	} else {
		ctx.lineWidth = vm.borderWidth;
		ctx.lineJoin = 'bevel';
	}

	if (arc.fullCircles) {
		drawFullCircleBorders(ctx, vm, arc, inner);
	}

	if (inner) {
		clipArc(ctx, arc);
	}

	ctx.beginPath();
	ctx.arc(arc.x, arc.y, vm.outerRadius, arc.startAngle, arc.endAngle);
	ctx.arc(arc.x, arc.y, arc.innerRadius, arc.endAngle, arc.startAngle, true);
	ctx.closePath();
	ctx.stroke();
}

var element_arc = core_element.extend({
	_type: 'arc',

	inLabelRange: function(mouseX) {
		var vm = this._view;

		if (vm) {
			return (Math.pow(mouseX - vm.x, 2) < Math.pow(vm.radius + vm.hoverRadius, 2));
		}
		return false;
	},

	inRange: function(chartX, chartY) {
		var vm = this._view;

		if (vm) {
			var pointRelativePosition = helpers$1.getAngleFromPoint(vm, {x: chartX, y: chartY});
			var angle = pointRelativePosition.angle;
			var distance = pointRelativePosition.distance;

			// Sanitise angle range
			var startAngle = vm.startAngle;
			var endAngle = vm.endAngle;
			while (endAngle < startAngle) {
				endAngle += TAU;
			}
			while (angle > endAngle) {
				angle -= TAU;
			}
			while (angle < startAngle) {
				angle += TAU;
			}

			// Check if within the range of the open/close angle
			var betweenAngles = (angle >= startAngle && angle <= endAngle);
			var withinRadius = (distance >= vm.innerRadius && distance <= vm.outerRadius);

			return (betweenAngles && withinRadius);
		}
		return false;
	},

	getCenterPoint: function() {
		var vm = this._view;
		var halfAngle = (vm.startAngle + vm.endAngle) / 2;
		var halfRadius = (vm.innerRadius + vm.outerRadius) / 2;
		return {
			x: vm.x + Math.cos(halfAngle) * halfRadius,
			y: vm.y + Math.sin(halfAngle) * halfRadius
		};
	},

	getArea: function() {
		var vm = this._view;
		return Math.PI * ((vm.endAngle - vm.startAngle) / (2 * Math.PI)) * (Math.pow(vm.outerRadius, 2) - Math.pow(vm.innerRadius, 2));
	},

	tooltipPosition: function() {
		var vm = this._view;
		var centreAngle = vm.startAngle + ((vm.endAngle - vm.startAngle) / 2);
		var rangeFromCentre = (vm.outerRadius - vm.innerRadius) / 2 + vm.innerRadius;

		return {
			x: vm.x + (Math.cos(centreAngle) * rangeFromCentre),
			y: vm.y + (Math.sin(centreAngle) * rangeFromCentre)
		};
	},

	draw: function() {
		var ctx = this._chart.ctx;
		var vm = this._view;
		var pixelMargin = (vm.borderAlign === 'inner') ? 0.33 : 0;
		var arc = {
			x: vm.x,
			y: vm.y,
			innerRadius: vm.innerRadius,
			outerRadius: Math.max(vm.outerRadius - pixelMargin, 0),
			pixelMargin: pixelMargin,
			startAngle: vm.startAngle,
			endAngle: vm.endAngle,
			fullCircles: Math.floor(vm.circumference / TAU)
		};
		var i;

		ctx.save();

		ctx.fillStyle = vm.backgroundColor;
		ctx.strokeStyle = vm.borderColor;

		if (arc.fullCircles) {
			arc.endAngle = arc.startAngle + TAU;
			ctx.beginPath();
			ctx.arc(arc.x, arc.y, arc.outerRadius, arc.startAngle, arc.endAngle);
			ctx.arc(arc.x, arc.y, arc.innerRadius, arc.endAngle, arc.startAngle, true);
			ctx.closePath();
			for (i = 0; i < arc.fullCircles; ++i) {
				ctx.fill();
			}
			arc.endAngle = arc.startAngle + vm.circumference % TAU;
		}

		ctx.beginPath();
		ctx.arc(arc.x, arc.y, arc.outerRadius, arc.startAngle, arc.endAngle);
		ctx.arc(arc.x, arc.y, arc.innerRadius, arc.endAngle, arc.startAngle, true);
		ctx.closePath();
		ctx.fill();

		if (vm.borderWidth) {
			drawBorder(ctx, vm, arc);
		}

		ctx.restore();
	}
});

var valueOrDefault$1 = helpers$1.valueOrDefault;

var defaultColor = core_defaults.global.defaultColor;

core_defaults._set('global', {
	elements: {
		line: {
			tension: 0.4,
			backgroundColor: defaultColor,
			borderWidth: 3,
			borderColor: defaultColor,
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			capBezierPoints: true,
			fill: true, // do we fill in the area between the line and its base axis
		}
	}
});

var element_line = core_element.extend({
	_type: 'line',

	draw: function() {
		var me = this;
		var vm = me._view;
		var ctx = me._chart.ctx;
		var spanGaps = vm.spanGaps;
		var points = me._children.slice(); // clone array
		var globalDefaults = core_defaults.global;
		var globalOptionLineElements = globalDefaults.elements.line;
		var lastDrawnIndex = -1;
		var closePath = me._loop;
		var index, previous, currentVM;

		if (!points.length) {
			return;
		}

		if (me._loop) {
			for (index = 0; index < points.length; ++index) {
				previous = helpers$1.previousItem(points, index);
				// If the line has an open path, shift the point array
				if (!points[index]._view.skip && previous._view.skip) {
					points = points.slice(index).concat(points.slice(0, index));
					closePath = spanGaps;
					break;
				}
			}
			// If the line has a close path, add the first point again
			if (closePath) {
				points.push(points[0]);
			}
		}

		ctx.save();

		// Stroke Line Options
		ctx.lineCap = vm.borderCapStyle || globalOptionLineElements.borderCapStyle;

		// IE 9 and 10 do not support line dash
		if (ctx.setLineDash) {
			ctx.setLineDash(vm.borderDash || globalOptionLineElements.borderDash);
		}

		ctx.lineDashOffset = valueOrDefault$1(vm.borderDashOffset, globalOptionLineElements.borderDashOffset);
		ctx.lineJoin = vm.borderJoinStyle || globalOptionLineElements.borderJoinStyle;
		ctx.lineWidth = valueOrDefault$1(vm.borderWidth, globalOptionLineElements.borderWidth);
		ctx.strokeStyle = vm.borderColor || globalDefaults.defaultColor;

		// Stroke Line
		ctx.beginPath();

		// First point moves to it's starting position no matter what
		currentVM = points[0]._view;
		if (!currentVM.skip) {
			ctx.moveTo(currentVM.x, currentVM.y);
			lastDrawnIndex = 0;
		}

		for (index = 1; index < points.length; ++index) {
			currentVM = points[index]._view;
			previous = lastDrawnIndex === -1 ? helpers$1.previousItem(points, index) : points[lastDrawnIndex];

			if (!currentVM.skip) {
				if ((lastDrawnIndex !== (index - 1) && !spanGaps) || lastDrawnIndex === -1) {
					// There was a gap and this is the first point after the gap
					ctx.moveTo(currentVM.x, currentVM.y);
				} else {
					// Line to next point
					helpers$1.canvas.lineTo(ctx, previous._view, currentVM);
				}
				lastDrawnIndex = index;
			}
		}

		if (closePath) {
			ctx.closePath();
		}

		ctx.stroke();
		ctx.restore();
	}
});

var valueOrDefault$2 = helpers$1.valueOrDefault;

var defaultColor$1 = core_defaults.global.defaultColor;

core_defaults._set('global', {
	elements: {
		point: {
			radius: 3,
			pointStyle: 'circle',
			backgroundColor: defaultColor$1,
			borderColor: defaultColor$1,
			borderWidth: 1,
			// Hover
			hitRadius: 1,
			hoverRadius: 4,
			hoverBorderWidth: 1
		}
	}
});

function xRange(mouseX) {
	var vm = this._view;
	return vm ? (Math.abs(mouseX - vm.x) < vm.radius + vm.hitRadius) : false;
}

function yRange(mouseY) {
	var vm = this._view;
	return vm ? (Math.abs(mouseY - vm.y) < vm.radius + vm.hitRadius) : false;
}

var element_point = core_element.extend({
	_type: 'point',

	inRange: function(mouseX, mouseY) {
		var vm = this._view;
		return vm ? ((Math.pow(mouseX - vm.x, 2) + Math.pow(mouseY - vm.y, 2)) < Math.pow(vm.hitRadius + vm.radius, 2)) : false;
	},

	inLabelRange: xRange,
	inXRange: xRange,
	inYRange: yRange,

	getCenterPoint: function() {
		var vm = this._view;
		return {
			x: vm.x,
			y: vm.y
		};
	},

	getArea: function() {
		return Math.PI * Math.pow(this._view.radius, 2);
	},

	tooltipPosition: function() {
		var vm = this._view;
		return {
			x: vm.x,
			y: vm.y,
			padding: vm.radius + vm.borderWidth
		};
	},

	draw: function(chartArea) {
		var vm = this._view;
		var ctx = this._chart.ctx;
		var pointStyle = vm.pointStyle;
		var rotation = vm.rotation;
		var radius = vm.radius;
		var x = vm.x;
		var y = vm.y;
		var globalDefaults = core_defaults.global;
		var defaultColor = globalDefaults.defaultColor; // eslint-disable-line no-shadow

		if (vm.skip) {
			return;
		}

		// Clipping for Points.
		if (chartArea === undefined || helpers$1.canvas._isPointInArea(vm, chartArea)) {
			ctx.strokeStyle = vm.borderColor || defaultColor;
			ctx.lineWidth = valueOrDefault$2(vm.borderWidth, globalDefaults.elements.point.borderWidth);
			ctx.fillStyle = vm.backgroundColor || defaultColor;
			helpers$1.canvas.drawPoint(ctx, pointStyle, radius, x, y, rotation);
		}
	}
});

var defaultColor$2 = core_defaults.global.defaultColor;

core_defaults._set('global', {
	elements: {
		rectangle: {
			backgroundColor: defaultColor$2,
			borderColor: defaultColor$2,
			borderSkipped: 'bottom',
			borderWidth: 0
		}
	}
});

function isVertical(vm) {
	return vm && vm.width !== undefined;
}

/**
 * Helper function to get the bounds of the bar regardless of the orientation
 * @param bar {Chart.Element.Rectangle} the bar
 * @return {Bounds} bounds of the bar
 * @private
 */
function getBarBounds(vm) {
	var x1, x2, y1, y2, half;

	if (isVertical(vm)) {
		half = vm.width / 2;
		x1 = vm.x - half;
		x2 = vm.x + half;
		y1 = Math.min(vm.y, vm.base);
		y2 = Math.max(vm.y, vm.base);
	} else {
		half = vm.height / 2;
		x1 = Math.min(vm.x, vm.base);
		x2 = Math.max(vm.x, vm.base);
		y1 = vm.y - half;
		y2 = vm.y + half;
	}

	return {
		left: x1,
		top: y1,
		right: x2,
		bottom: y2
	};
}

function swap(orig, v1, v2) {
	return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}

function parseBorderSkipped(vm) {
	var edge = vm.borderSkipped;
	var res = {};

	if (!edge) {
		return res;
	}

	if (vm.horizontal) {
		if (vm.base > vm.x) {
			edge = swap(edge, 'left', 'right');
		}
	} else if (vm.base < vm.y) {
		edge = swap(edge, 'bottom', 'top');
	}

	res[edge] = true;
	return res;
}

function parseBorderWidth(vm, maxW, maxH) {
	var value = vm.borderWidth;
	var skip = parseBorderSkipped(vm);
	var t, r, b, l;

	if (helpers$1.isObject(value)) {
		t = +value.top || 0;
		r = +value.right || 0;
		b = +value.bottom || 0;
		l = +value.left || 0;
	} else {
		t = r = b = l = +value || 0;
	}

	return {
		t: skip.top || (t < 0) ? 0 : t > maxH ? maxH : t,
		r: skip.right || (r < 0) ? 0 : r > maxW ? maxW : r,
		b: skip.bottom || (b < 0) ? 0 : b > maxH ? maxH : b,
		l: skip.left || (l < 0) ? 0 : l > maxW ? maxW : l
	};
}

function boundingRects(vm) {
	var bounds = getBarBounds(vm);
	var width = bounds.right - bounds.left;
	var height = bounds.bottom - bounds.top;
	var border = parseBorderWidth(vm, width / 2, height / 2);

	return {
		outer: {
			x: bounds.left,
			y: bounds.top,
			w: width,
			h: height
		},
		inner: {
			x: bounds.left + border.l,
			y: bounds.top + border.t,
			w: width - border.l - border.r,
			h: height - border.t - border.b
		}
	};
}

function inRange(vm, x, y) {
	var skipX = x === null;
	var skipY = y === null;
	var bounds = !vm || (skipX && skipY) ? false : getBarBounds(vm);

	return bounds
		&& (skipX || x >= bounds.left && x <= bounds.right)
		&& (skipY || y >= bounds.top && y <= bounds.bottom);
}

var element_rectangle = core_element.extend({
	_type: 'rectangle',

	draw: function() {
		var ctx = this._chart.ctx;
		var vm = this._view;
		var rects = boundingRects(vm);
		var 