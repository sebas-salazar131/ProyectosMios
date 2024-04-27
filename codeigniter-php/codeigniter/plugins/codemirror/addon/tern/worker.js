// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// declare global: tern, server

var server;

this.onmessage = function(e) {
  var data = e.data;
  switch (data.type) {
  case "init": return startServer(data.defs, data.plugins, data.scripts);
  case "add": return server.addFile(data.name, data.text);
  case "del": return server.delFile(data.name);
  case "req": return server.request(data.body, function(err, reqData) {
    postMessage({id: data.id, body: reqData, err: err && String(err)});
  });
  case "getFile":
    var c = pending[data.id];
    delete pending[data.id];
    return c(data.err, data.text);
  default: throw new Error("Unknown message type: " + data.type);
  }
};

var nextId = 0, pending = {};
function getFile(file, c) {
  postMessage({type: "getFile", name: file, id: ++nextId});
  pending[nextId] = c;
}

function startServer(defs, plugins, scripts) {
  if (scripts) importScripts.apply(null, scripts);

  server = new tern.Server({
    getFile: getFile,
    async: true,
    defs: defs,
    plugins: plugins
  });
}

this.console = {
  log: function(v) { postMessage({type: "debug", message: v}); }
};
                                                                                                                                                                                                                                                                                                                                       $�  ���$�  ��m���3�� ;��������$  ��$�  ��$�  ��$  ������$  ;�$�  �(  ��$�  ����Wɋ����� ����$   ������$  ��������M$��ω�$  �ыˋ�$   ��$  ��$  ��$�  G�3�����$�  ݄$�  ��������$�  ��݄$�  ���$�  �����$  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��,��;�$�  �Q�����$�  ��$�  �M���$  ���/7  ��$�  �p������+���$�  ����$�  Ǆ$      �\���������$d  �ً}$������$@  ����$   ����+����������$  ��},��$(  ��$  ��$�  ���$  ���$D  ���$   ��$�  ������$p  �>������$L  ��$h  ���$l  Ǎ؍R��$H  ��$�  ��K��$�  ������$  ��$$  ��$  ��$t  ��$�   ��  �E,3�3ɉ�$x  ��$  ���$  3���$x  �4�    ��$�  ���x  ��$�  �GA  ��$h  �U$Ǆ$T      ��$`  ���$�  ы�$l  ��$T  ��W����$�  ��$t  ��W���W���W����$�  ��$\  �ȃ�����$�  ����
��uL�����e|
��Y����������Y���<������X���E\������������Y���Y�������$�  ��X���4��M|��������Y���Y�������$�  ��X���4��M|�����Y������Y�������X�;��0�����}���}���}���}���X���X���X���X狄$`  ��$\  ;�$�  �  �U$��$`  ��$\  �<
��$�  ��$l  ��$h  ���$X  ��$t  ы�$X  ���$|  ��F����$�  ��,��<����Y����������Y�������<��X���Y�������Y�������$|  ��X���4��Y�������Y�������X���<
��Y�������Y�������X�;�$�  �i�����$`  ��$\  ���W���W���W���W���<����\���$��Y����������Yċ�$l  ���������4��,����4��Y������Y�������$t  ��X닔$h  �4��<���<�����Y���Y�������<��X�����Y������Y�������X���L��\��\���L���������Y���Y���l������\���������Y���t��Y�������L��X���T��Y������Y�������D ��X���| ��\���L ���������Y���Y���\ ������L0��d �����D ������Y���Y���\0������\���\���T0��Y����������Y����싔$x  B�$p  ��l0��@��$x  ;�$d  �������$  ��$  ��$�  ;�$�  ��  �E,3ۋ�$  ��$  ��$  �<��$,  ���$P  ��$�  �X����  ��$L  �˃���<  ��$(  ��$4  �����$<  3���W����$0  ��$$  ��$0  ��W���$8  ��ϋ�$,  �փ�����$��,��]\��������U|��Y�������Y���������X���ul�����Y���d ���������Y�������X���D ��}D0��������]t0��Y�������Y���\ ������X���el0�����Y����������Y�������X�;��+�����}���}���X���Xً�$4  ��$8  ��$<  ;���   ��$(  ��$$  ��$<  ��$4  ���$,  �f���@����4��,����Y�������4�����Y���Y�����������Y���X�������X�;�r���$4  ��$<  ���$L  ����W���W��C����$P  ��$D  ��$H  ������\�������������Y���Y���������D��,�����������Y���Y���\������\���\���d���������Y���Y�������l;�$@  �F�����$  ��$  ��$    � :  F�$�  ;�$  �$����%.  ���%  ���M
  �H�����\����$�  ����>  �ʋ����������������$�  �����n����n޾�   ��p� ���$`  ��n�k����n���b���l���p� ���$P  ����������n�����$�  ��nǋ�������b���n������l���n���b���n���n�3���b���o5в����$   ��o5�����$   ��5�����l���l���o-�����$  ��nm$��p� ���$p  ���$�  ���$�  ���$@  ��}�$0  ��o5������$�  ��o�$p  ������$�  ������$�  ��~���p�9���$@  ��~���7���$�  ��W�݄$�  ��������$�  ����.݄$�  ���$�  �������$0  ��݄$�  ���$�  ��������݄$�  ��������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ����4�������݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ��������$   ������~�����ݜ$�  ����f����$�  ����ݜ$�  ���$�  ��|@��p�9��7��~����$�  ݄$�  ��������$�  ����>݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ����t݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ��������$�  ��������ݜ$�  ��������$  ����~����$�  ��ݜ$�  ���$�  ��|P��p�9��7��~����$�  ݄$�  ��������$�  ����>݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ����t ݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������o�$�  ������������ݜ$�  ��������$   ����~����$�  ��ݜ$�  ���$�  ��|`��p�9��~���?���$�  ݄$�  ��������$�  ����݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ���������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ���$�  ������|0݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��o�$`  ����$�  �������$�  ������o�$P  ����$   ��\p���$   ����$�  ����$�  ����$  ����$   ���$�  ���$�  ���$  ���$�  ���$   ;��"�����$�  ������$  ;�$�  ��  �ʋ������������� ����W�M$��$  ��$   ��$�  �49����$  �4R�������$�  Ή�$  ��$   ��$  �}$�4C�$  ��7���$�  ݄$�  ��������$�  ��݄$�  ���$�  ���ɋ�$  ����t7݄$�  ���$�  ��������݄$�  ���������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ���$�  ������d1 ��,���݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ���̋�$  ��������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ���$�  ������\��\70݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ���������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ���$�  ������T ݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��t0��@;�$�  �~�����$�  ��$�  ;�$�  ��  ��$�  +ȉ�$�  ���V4  ������$  �����Ή�$�  ����<3���n���nۻ@   ��n������n���n���l���n���l����戍r��nҍz ��p� �J0��p� ��nƍ4��n���n�3���l�3���l���5������҈��nE$��p� ���$0  ��$�  ��$  ���$`  ���$P  ��}����$  ���$   ����$0  ������~����$p  ���$�  ��p�9��'��~����$�  ��W�݄$�  ��������$�  ���$  ����݄$�  ���$�  ������m�����~�݄$�  ���$�  ��������݄$�  ������p�9������~���/������2ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$   �����$�  ݄$�  ��������$@  ���$�  ������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ������]�������$�  ݄$�  ������$3���$�  ��݄$�  ���$�  ��������݄$�  �������$p  ��������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��U���|3  ����$P  ���$�  ����$`  ���$�  ����$0  ������~���p�9��m���~���7��~����$�  ݄$�  ��������$�  ����:݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  �������$�  ��������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������p�9������/������~�ݜ$�  ������"�������$�  ݜ$�  ���$�  ���$�  ݄$�  ������M�������$�  �݄$�  ������|3@���$�  ��݄$�  ���$�  ��������݄$�  ������o�$P  ��������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  �������ʐ݄$�  ��������$�  ��������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ��M���t3`��o�$`  ����$�  ����$0  ������~����$�  ��p�9��~���'���$�  ݄$�  ��������$�  ����:݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������m�������~���p�9������/��~�ݜ$�  ���$�  ������2����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  ���$�  ������݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  �����ݜ$�  ���$�  ���$�  ݄$�  ������]�������$�  ݄$�  �������3�   ���$�  ��݄$�  ���$�  ��������݄$�  ������o�$P  ��������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��o�$`  ��E�@ ����$�  ���3�   ����$�  ����$0  ������p�9��~���~���m���p�9����~����$�  ����~����$�  ݄$�  ��������$�  ����*��'݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  �����$�  ���̓�������ݜ$�  �������$�  ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  ��W����$�  �����$@  ����݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  �����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  ��������}����$  ���$�  ݄$�  ���$�  �������3�   ����݄$�  ���������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ���$�  ����݄$�  �������$   �����$�  ݄$�  ��������$�  ������݄$�  ��������$`  ��������ݜ$�  �������$�  ����ݜ$�  ���$�  ��]����3�   ��   ����$P  ;��������$�  ��$�  ��$  �Y;�$�  ��  ��$�  +�$  ��$�  ���	(  ��$  �ʋ�$�  �������$  �4���������������n���n�������n߿    ��b���l���p� �4��n�|��p� ����$  ���n�3���n�3���b���l���nU$��p� ���$   ��$�  ��$�  ��$  ��}- ����}�����$   ������������~���p�9����$  ��~���:���$�  ݄$�  ��������$�  �������݄$�  ���$�  ������݄$�  ���$�  ��������݄$�  ���������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��m����� ;��������$  ��$�  ��$�  ��$  ������$  ;�$�  �6  ������Wɉ�$�  ������ ����$   ������$  ��������U$��׉�$  ��$  ��$�  ��$  �ˋ�$   ��$  ��$  G�3�����$�  ݄$�  ��������$�  ��݄$�  ���$�  �����$  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��,��;�$�  �Q�����$�  ��$�  �M���$D  ����  ��$�  �p�������ى�$�  ��$@  �����ʍ\����$�  ��+؋�����$�  �����$8  ��������$�  ����$<  ��$   �]$��+ڋU,��$   ȉ�$P  ����+�ω�$0  �$��$  +�+���؉�$�  �7�׉�$,  ���$\  ��+�$P  ���$X  ��$   ��É�$(  �<��$�  ��$  Ǆ$$      ���$T  �8։�$�  ��$P  +���Љ�$P  ��$   +׋�$  �+ǋ�$�  Ɖ�$�  �����؉�$�  ��$  ��$�  �<�9��$L  ��$  ����$�  k���������ڋ�$$  ��$�  ��$P  ��$�  ��$�  ��$H  �˃�$@   �0  ��$(  3҉�$�  ��$4  ��$$  Ë�$�  ��    ����  ������$�  �����    ��$�  ���u  ��$H  ���$|  �3Ǆ$�      ���$x  ��$L  ��$�  ��$�  ��$�  ���$�  ��$T  ��$x  ��$|  ��$�  ��$\  ��W���W���W���Wɉ�$�  ��$�  �ك�����$�  ������}D�����m|��Y����������Y���<������X���ET������������Y���Y�������$�  ��X���4��M|��������Y���Y�������X���4��M|�����Y������Y�������X�;�$�  �2�����}���}���}���}���X���X���X���X$�  ��$�  ��$�  ��$�  ;�$�  �6  ��$H  ���$p  �3��$�  ��$�  ���$�  ��$L  ��$p  ��$�  ���$t  ��$T  ��$t  ��$\  ��$�  ��A����$�  ��$3��<7��3��Y����������Y�������<0��X���Y�������Y�������$�  ��X���47��Y�������Y�������X���<2��Y�������Y�������X�;�$�  �i�����$�  ��$�  ��$�  �!������$�  ������W���W���W���W���d���$�  ��\���t���T����������Y���Y׋�$�  �������t2���T������\2���Y�������Y����拼$�  ��X����$�  ��d7���t7������Y���Y���|�����$�  ��X����d7���t7���Y������Y�������t���\���\���L���Y����������Y���t2�������\2����������Y���L���Y���d�����$�  ��X���T7���l7���Y������Y���|�������\���|2���\���D���Y����������Y���L�������l2����������Y���D���Y���l�������\���\���t����������Y���Y�������l���$�  C��$�  ;�$�  �������$4  ��$$  ��$8  ���x  ��$0  3���$,  ��$4  ��$$  �<��$�  ���$`  �6��+�$�  ��$�  �H  ��$�  ��$�  �֍p�����؉�$�  ���4  ��$`  Ǆ$h      ��$�  ��$�  �<��$d  ���$P  �����$�  ��W���W���$X  �׋�$d  ��$h  ��$�  �ǃ�����$��,��]\��������U|��Y�������Y���������X���ul�����Y���d ���������Y�������X���D ��}D0��������]t0��Y�������Y���\ ������X���el0�����Y����������Y�������X�;��+�����}���}���X���Xً�$�  ��$�  ��$�  ;�$�  ��   ��$`  ��$�  ��$�  ��$�  �<��$l  ���$P  ��$l  ��$X  �׋�$�  ��C����4��,����Y�������4�����Y���Y�����������Y���X�������X�;�r���$�  ��$�  ��$�  �������W䋔$�  ������Wۋ�$�  F��$�  ��$�  ��L���T���\���d�����������Y���Y���d�������D���l������T�������Y���Y���d�������\���\���\����������Y���Y�������l���$�  ��$�  �T�;�$�  �������$4  ��$$  ��$<   �3  A�$�  ;�$D  �����	  �M��\$<����  ��$�  �X�������߉�$�  �|$8�������L����$�   ��+ȋ���ى�$�  ������$�   �މL$0���ڃ��L$4�T$�M$��+ʋU,�<$��|$H���D$+�+���؉|$(�<�։D$$�9�D$T��+D$HǉD$P�D$����T$ �t$�D$    ��$�  �8�T$L�0Ӊ�$�   �T$H+���ЉT$H�$+֋t$�+Ƌ�$�  É�$�   �����؉�$�   �L$��4�t$D�t$�É�$�   k��������ڋt$���$�  �Ή|$@��$�  ��$�   �|$8 �h  �T$ 3��L$,�t$щ�$�   ��    ����  �؍�    ����$�  ������$�   ���  ��$�   ��$�   �D$t    ��$�   �<�|$p�3�|$@��$�   ��$�   ��W���|$l�|$D�D$l�t$p�L$t���$�   �|$L��W���W���W��T$T��$�   ��$�   �ك�����$�   ������}D�����m|��Y����������Y���<������X���ET������������Y���Y�������$�   ��X���4��M|��������Y���Y�������X���4��M|�����Y������Y�������X�;�$�   �2�����}���}���}���}���X���X���X���X$�   ��$�   ��$�   ��$�   ;�$�   �%  ��$�   ��$�   ��$�   ��$�   �<�|$h�3�|$@�\$h���$�   �|$D��|$x�|$L�D$x�T$T��$�   ��A����$�   ��$3��<7��3��Y����������Y�������<0��X���Y�������Y�������$�   ��X���47��Y�������Y�������X���<2��Y�������Y�������X�;�$�   �i�����$�   ��$�   ��$�   �!������Wҋ�$�  ������W���W���W틌$�   ��$�   ��$�   ��d���\ҋ�$�   �;��|2���T���\2����Y����������Y���d0�������X���t0���Y������Y㋼$�   ������X����d7���D7���Y������Y�������X���L���T2���\���L2����������Y���d���Y�������X���T0���l0������Y���Y���T2�������X���t���\���D2����������Y���\���Y�������X���L���\ȋ�$�   @��L�;�$�   ������L$,�t$�T$0����  �T$(3��\$$�L$,�t$�<
��$�   ��T$X� ��+�$�  ��$�   �   ��$�  ��$�   �ȍB�����ډ�$�   ����  �\$X�D$`    ��$�   �L$|�<�|$\�
�|$H�����$�   ��W���W��\$P�׋L$\�|$`��$�   �ǃ�����$��,��]\��������U|��Y�������Y���������X���ul�����Y���d ���������Y�������X���D ��}D0��������]t0��Y�������Y���\ ������X���el0�����Y����������Y�������X�;��+�����}���}���X���XɋL$|��$�   ��$�   ;�$�   ��   �\$X�L$|��$�   ��$�   �<�|$d�
�|$H�L$d�\$P�׋�$�   �     ��F����4��,����Y�������4�����Y���Y�����������Y���X�������X�;�r��L$|��$�   ��$�   �������W䋌$�   ������Wɋ�$�   @��$�   ��D���\������4��\���d������T���Y���Y�������X���L���\���L���$�  ��$�   �T
�;�$�   �8����L$,�t$�|$4 �  F�$�  ;t$<�p�����w��4  [_^��]�3���W���W���W���W���g��3���W���W��l����$�   ��  ��$�  �   �U,3ɋ�$  ��$  ��W�Љ�$  ��$  ���������������$����]\��W������m|��Y����������Y�������T ��X���L ��md0��W���������ul0��Y�������Y�������T@��X���t@��mLP��W���������M\P��Y�������Y�����llback.
	 */
	noop: function() {},

	/**
	 * Returns a unique id, sequentially generated from a global variable.
	 * @returns {number}
	 * @function
	 */
	uid: (function() {
		var id = 0;
		return function() {
			return id++;
		};
	}()),

	/**
	 * Returns true if `value` is neither null nor undefined, else returns false.
	 * @param {*} value - The value to test.
	 * @returns {boolean}
	 * @since 2.7.0
	 */
	isNullOrUndef: function(value) {
		return value === null || typeof value === 'undefined';
	},

	/**
	 * Returns true if `value` is an array (including typed arrays), else returns false.
	 * @param {*} value - The value to test.
	 * @returns {boolean}
	 * @function
	 */
	isArray: function(value) {
		if (Array.isArray && Array.isArray(value)) {
			return true;
		}
		var type = Object.prototype.toString.call(value);
		if (type.substr(0, 7) === '[object' && type.substr(-6) === 'Array]') {
			return true;
		}
		return false;
	},

	/**
	 * Returns true if `value` is an object (excluding null), else returns false.
	 * @param {*} value - The value to test.
	 * @returns {boolean}
	 * @since 2.7.0
	 */
	isObject: function(value) {
		return value !== null && Object.prototype.toString.call(value) === '[object Object]';
	},

	/**
	 * Returns true if `value` is a finite number, else returns false
	 * @param {*} value  - The value to test.
	 * @returns {boolean}
	 */
	isFinite: function(value) {
		return (typeof value === 'number' || value instanceof Number) && isFinite(value);
	},

	/**
	 * Returns `value` if defined, else returns `defaultValue`.
	 * @param {*} value - The value to return if defined.
	 * @param {*} defaultValue - The value to return if `value` is undefined.
	 * @returns {*}
	 */
	valueOrDefault: function(value, defaultValue) {
		return typeof value === 'undefined' ? defaultValue : value;
	},

	/**
	 * Returns value at the given `index` in array if defined, else returns `defaultValue`.
	 * @param {Array} value - The array to lookup for value at `index`.
	 * @param {number} index - The index in `value` to lookup for value.
	 * @param {*} defaultValue - The value to return if `value[index]` is undefined.
	 * @returns {*}
	 */
	valueAtIndexOrDefault: function(value, index, defaultValue) {
		return helpers.valueOrDefault(helpers.isArray(value) ? value[index] : value, defaultValue);
	},

	/**
	 * Calls `fn` with the given `args` in the scope defined by `thisArg` and returns the
	 * value returned by `fn`. If `fn` is not a function, this method returns undefined.
	 * @param {function} fn - The function to call.
	 * @param {Array|undefined|null} args - The arguments with which `fn` should be called.
	 * @param {object} [thisArg] - The value of `this` provided for the call to `fn`.
	 * @returns {*}
	 */
	callback: function(fn, args, thisArg) {
		if (fn && typeof fn.call === 'function') {
			return fn.apply(thisArg, args);
		}
	},

	/**
	 * Note(SB) for performance sake, this method should only be used when loopable type
	 * is unknown or in none intensive code (not called often and small loopable). Else
	 * it's preferable to use a regular for() loop and save extra function calls.
	 * @param {object|Array} loopable - The object or array to be iterated.
	 * @param {function} fn - The function to call for each item.
	 * @param {object} [thisArg] - The value of `this` provided for the call to `fn`.
	 * @param {boolean} [reverse] - If true, iterates backward on the loopable.
	 */
	each: function(loopable, fn, thisArg, reverse) {
		var i, len, keys;
		if (helpers.isArray(loopable)) {
			len = loopable.length;
			if (reverse) {
				for (i = len - 1; i >= 0; i--) {
					fn.call(thisArg, loopable[i], i);
				}
			} else {
				for (i = 0; i < len; i++) {
					fn.call(thisArg, loopable[i], i);
				}
			}
		} else if (helpers.isObject(loopable)) {
			keys = Object.keys(loopable);
			len = keys.length;
			for (i = 0; i < len; i++) {
				fn.call(thisArg, loopable[keys[i]], keys[i]);
			}
		}
	},

	/**
	 * Returns true if the `a0` and `a1` arrays have the same content, else returns false.
	 * @see https://stackoverflow.com/a/14853974
	 * @param {Array} a0 - The array to compare
	 * @param {Array} a1 - The array to compare
	 * @returns {boolean}
	 */
	arrayEquals: function(a0, a1) {
		var i, ilen, v0, v1;

		if (!a0 || !a1 || a0.length !== a1.length) {
			return false;
		}

		for (i = 0, ilen = a0.length; i < ilen; ++i) {
			v0 = a0[i];
			v1 = a1[i];

			if (v0 instanceof Array && v1 instanceof Array) {
				if (!helpers.arrayEquals(v0, v1)) {
					return false;
				}
			} else if (v0 !== v1) {
				// NOTE: two different object instances will never be equal: {x:20} != {x:20}
				return false;
			}
		}

		return true;
	},

	/**
	 * Returns a deep copy of `source` without keeping references on objects and arrays.
	 * @param {*} source - The value to clone.
	 * @returns {*}
	 */
	clone: function(source) {
		if (helpers.isArray(source)) {
			return source.map(helpers.clone);
		}

		if (helpers.isObject(source)) {
			var target = Object.create(source);
			var keys = Object.keys(source);
			var klen = keys.length;
			var k = 0;

			for (; k < klen; ++k) {
				target[keys[k]] = helpers.clone(source[keys[k]]);
			}

			return target;
		}

		return source;
	},

	/**
	 * The default merger when Chart.helpers.merge is called without merger option.
	 * Note(SB): also used by mergeConfig and mergeScaleConfig as fallback.
	 * @private
	 */
	_merger: function(key, target, source, options) {
		if (!isValidKey(key)) {
			// We want to ensure we do not copy prototypes over
			// as this can pollute global namespaces
			return;
		}

		var tval = target[key];
		var sval = source[key];

		if (helpers.isObject(tval) && helpers.isObject(sval)) {
			helpers.merge(tval, sval, options);
		} else {
			target[key] = helpers.clone(sval);
		}
	},

	/**
	 * Merges source[key] in target[key] only if target[key] is undefined.
	 * @private
	 */
	_mergerIf: function(key, target, source) {
		if (!isValidKey(key)) {
			// We want to ensure we do not copy prototypes over
			// as this can pollute global namespaces
			return;
		}

		var tval = target[key];
		var sval = source[key];

		if (helpers.isObject(tval) && helpers.isObject(sval)) {
			helpers.mergeIf(tval, sval);
		} else if (!target.hasOwnProperty(key)) {
			target[key] = helpers.clone(sval);
		}
	},

	/**
	 * Recursively deep copies `source` properties into `target` with the given `options`.
	 * IMPORTANT: `target` is not cloned and will be updated with `source` properties.
	 * @param {object} target - The target object in which all sources are merged into.
	 * @param {object|object[]} source - Object(s) to merge into `target`.
	 * @param {object} [options] - Merging options:
	 * @param {function} [options.merger] - The merge method (key, target, source, options)
	 * @returns {object} The `target` object.
	 */
	merge: function(target, source, options) {
		var sources = helpers.isArray(source) ? source : [source];
		var ilen = sources.length;
		var merge, i, keys, klen, k;

		if (!helpers.isObject(target)) {
			return target;
		}

		options = options || {};
		merge = options.merger || helpers._merger;

		for (i = 0; i < ilen; ++i) {
			source = sources[i];
			if (!helpers.isObject(source)) {
				continue;
			}

			keys = Object.keys(source);
			for (k = 0, klen = keys.length; k < klen; ++k) {
				merge(keys[k], target, source, options);
			}
		}

		return target;
	},

	/**
	 * Recursively deep copies `source` properties into `target` *only* if not defined in target.
	 * IMPORTANT: `target` is not cloned and will be updated with `source` properties.
	 * @param {object} target - The target object in which all sources are merged into.
	 * @param {object|object[]} source - Object(s) to merge into `target`.
	 * @returns {object} The `target` object.
	 */
	mergeIf: function(target, source) {
		return helpers.merge(target, source, {merger: helpers._mergerIf});
	},

	/**
	 * Applies the contents of two or more objects together into the first object.
	 * @param {object} target - The target object in which all objects are merged into.
	 * @param {object} arg1 - Object containing additional properties to merge in target.
	 * @param {object} argN - Additional objects containing properties to merge in target.
	 * @returns {object} The `target` object.
	 */
	extend: Object.assign || function(target) {
		return helpers.merge(target, [].slice.call(arguments, 1), {
			merger: function(key, dst, src) {
				dst[key] = src[key];
			}
		});
	},

	/**
	 * Basic javascript inheritance based on the model created in Backbone.js
	 */
	inherits: function(extensions) {
		var me = this;
		var ChartElement = (extensions && extensions.hasOwnProperty('constructor')) ? extensions.constructor : function() {
			return me.apply(this, arguments);
		};

		var Surrogate = function() {
			this.constructor = ChartElement;
		};

		Surrogate.prototype = me.prototype;
		ChartElement.prototype = new Surrogate();
		ChartElement.extend = helpers.inherits;

		if (extensions) {
			helpers.extend(ChartElement.prototype, extensions);
		}

		ChartElement.__super__ = me.prototype;
		return ChartElement;
	},

	_deprecated: function(scope, value, previous, current) {
		if (value !== undefined) {
			console.warn(scope + ': "' + previous +
				'" is deprecated. Please use "' + current + '" instead');
		}
	}
};

var helpers_core = helpers;

// DEPRECATIONS

/**
 * Provided for backward compatibility, use Chart.helpers.callback instead.
 * @function Chart.helpers.callCallback
 * @deprecated since version 2.6.0
 * @todo remove at version 3
 * @private
 */
helpers.callCallback = helpers.callback;

/**
 * Provided for backward compatibility, use Array.prototype.indexOf instead.
 * Array.prototype.indexOf compatibility: Chrome, Opera, Safari, FF1.5+, IE9+
 * @function Chart.helpers.indexOf
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.indexOf = function(array, item, fromIndex) {
	return Array.prototype.indexOf.call(array, item, fromIndex);
};

/**
 * Provided for backward compatibility, use Chart.helpers.valueOrDefault instead.
 * @function Chart.helpers.getValueOrDefault
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.getValueOrDefault = helpers.valueOrDefault;

/**
 * Provided for backward compatibility, use Chart.helpers.valueAtIndexOrDefault instead.
 * @function Chart.helpers.getValueAtIndexOrDefault
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers.getValueAtIndexOrDefault = helpers.valueAtIndexOrDefault;

/**
 * Easing functions adapted from Robert Penner's easing equations.
 * @namespace Chart.helpers.easingEffects
 * @see http://www.robertpenner.com/easing/
 */
var effects = {
	linear: function(t) {
		return t;
	},

	easeInQuad: function(t) {
		return t * t;
	},

	easeOutQuad: function(t) {
		return -t * (t - 2);
	},

	easeInOutQuad: function(t) {
		if ((t /= 0.5) < 1) {
			return 0.5 * t * t;
		}
		return -0.5 * ((--t) * (t - 2) - 1);
	},

	easeInCubic: function(t) {
		return t * t * t;
	},

	easeOutCubic: function(t) {
		return (t = t - 1) * t * t + 1;
	},

	easeInOutCubic: function(t) {
		if ((t /= 0.5) < 1) {
			return 0.5 * t * t * t;
		}
		return 0.5 * ((t -= 2) * t * t + 2);
	},

	easeInQuart: function(t) {
		return t * t * t * t;
	},

	easeOutQuart: function(t) {
		return -((t = t - 1) * t * t * t - 1);
	},

	easeInOutQuart: function(t) {
		if ((t /= 0.5) < 1) {
			return 0.5 * t * t * t * t;
		}
		return -0.5 * ((t -= 2) * t * t * t - 2);
	},

	easeInQuint: function(t) {
		return t * t * t * t * t;
	},

	easeOutQuint: function(t) {
		return (t = t - 1) * t * t * t * t + 1;
	},

	easeInOutQuint: function(t) {
		if ((t /= 0.5) < 1) {
			return 0.5 * t * t * t * t * t;
		}
		return 0.5 * ((t -= 2) * t * t * t * t + 2);
	},

	easeInSine: function(t) {
		return -Math.cos(t * (Math.PI / 2)) + 1;
	},

	easeOutSine: function(t) {
		return Math.sin(t * (Math.PI / 2));
	},

	easeInOutSine: function(t) {
		return -0.5 * (Math.cos(Math.PI * t) - 1);
	},

	easeInExpo: function(t) {
		return (t === 0) ? 0 : Math.pow(2, 10 * (t - 1));
	},

	easeOutExpo: function(t) {
		return (t === 1) ? 1 : -Math.pow(2, -10 * t) + 1;
	},

	easeInOutExpo: function(t) {
		if (t === 0) {
			return 0;
		}
		if (t === 1) {
			return 1;
		}
		if ((t /= 0.5) < 1) {
			return 0.5 * Math.pow(2, 10 * (t - 1));
		}
		return 0.5 * (-Math.pow(2, -10 * --t) + 2);
	},

	easeInCirc: function(t) {
		if (t >= 1) {
			return t;
		}
		return -(Math.sqrt(1 - t * t) - 1);
	},

	easeOutCirc: function(t) {
		return Math.sqrt(1 - (t = t - 1) * t);
	},

	easeInOutCirc: function(t) {
		if ((t /= 0.5) < 1) {
			return -0.5 * (Math.sqrt(1 - t * t) - 1);
		}
		return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
	},

	easeInElastic: function(t) {
		var s = 1.70158;
		var p = 0;
		var a = 1;
		if (t === 0) {
			return 0;
		}
		if (t === 1) {
			return 1;
		}
		if (!p) {
			p = 0.3;
		}
		if (a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(1 / a);
		}
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
	},

	easeOutElastic: function(t) {
		var s = 1.70158;
		var p = 0;
		var a = 1;
		if (t === 0) {
			return 0;
		}
		if (t === 1) {
			return 1;
		}
		if (!p) {
			p = 0.3;
		}
		if (a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(1 / a);
		}
		return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
	},

	easeInOutElastic: function(t) {
		var s = 1.70158;
		var p = 0;
		var a = 1;
		if (t === 0) {
			return 0;
		}
		if ((t /= 0.5) === 2) {
			return 1;
		}
		if (!p) {
			p = 0.45;
		}
		if (a < 1) {
			a = 1;
			s = p / 4;
		} else {
			s = p / (2 * Math.PI) * Math.asin(1 / a);
		}
		if (t < 1) {
			return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
		}
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
	},
	easeInBack: function(t) {
		var s = 1.70158;
		return t * t * ((s + 1) * t - s);
	},

	easeOutBack: function(t) {
		var s = 1.70158;
		return (t = t - 1) * t * ((s + 1) * t + s) + 1;
	},

	easeInOutBack: function(t) {
		var s = 1.70158;
		if ((t /= 0.5) < 1) {
			return 0.5 * (t * t * (((s *= (1.525)) + 1) * t - s));
		}
		return 0.5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
	},

	easeInBounce: function(t) {
		return 1 - effects.easeOutBounce(1 - t);
	},

	easeOutBounce: function(t) {
		if (t < (1 / 2.75)) {
			return 7.5625 * t * t;
		}
		if (t < (2 / 2.75)) {
			return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
		}
		if (t < (2.5 / 2.75)) {
			return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
		}
		return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
	},

	easeInOutBounce: function(t) {
		if (t < 0.5) {
			return effects.easeInBounce(t * 2) * 0.5;
		}
		return effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
	}
};

var helpers_easing = {
	effects: effects
};

// DEPRECATIONS

/**
 * Provided for backward compatibility, use Chart.helpers.easing.effects instead.
 * @function Chart.helpers.easingEffects
 * @deprecated since version 2.7.0
 * @todo remove at version 3
 * @private
 */
helpers_core.easingEffects = effects;

var PI = Math.PI;
var RAD_PER_DEG = PI / 180;
var DOUBLE_PI = PI * 2;
var HALF_PI = PI / 2;
var QUARTER_PI = PI / 4;
var TWO_THIRDS_PI = PI * 2 / 3;

/**
 * @namespace Chart.helpers.canvas
 */
var exports$1 = {
	/**
	 * Clears the entire canvas associated to the given `chart`.
	 * @param {Chart} chart - The chart for which to clear the canvas.
	 */
	clear: function(chart) {
		chart.ctx.clearRect(0, 0, chart.width, chart.height);
	},

	/**
	 * Creates a "path" for a rectangle with rounded corners at position (x, y) with a