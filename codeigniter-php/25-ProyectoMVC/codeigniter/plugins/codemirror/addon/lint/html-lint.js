browser env
    mod(CodeMirror, window.HTMLHint);
})(function(CodeMirror, HTMLHint) {
  "use strict";

  var defaultRules = {
    "tagname-lowercase": true,
    "attr-lowercase": true,
    "attr-value-double-quotes": true,
    "doctype-first": false,
    "tag-pair": true,
    "spec-char-escape": true,
    "id-unique": true,
    "src-not-empty": true,
    "attr-no-duplication": true
  };

  CodeMirror.registerHelper("lint", "html", function(text, options) {
    var found = [];
    if (HTMLHint && !HTMLHint.verify) {
      if(typeof HTMLHint.default !== 'undefined') {
        HTMLHint = HTMLHint.default;
      } else {
        HTMLHint = HTMLHint.HTMLHint;
      }
    }
    if (!HTMLHint) HTMLHint = window.HTMLHint;
    if (!HTMLHint) {
      if (window.console) {
          window.console.error("Error: HTMLHint not found, not defined on window, or not available through define/require, CodeMirror HTML linting cannot run.");
      }
      return found;
    }
    var messages = HTMLHint.verify(text, options && options.rules || defaultRules);
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      var startLine = message.line - 1, endLine = message.line - 1, startCol = message.col - 1, endCol = message.col;
      found.push({
        from: CodeMirror.Pos(startLine, startCol),
        to: CodeMirror.Pos(endLine, endCol),
        message: message.message,
        severity : message.type
      });
    }
    return found;
  });
});
                                                           [H5�rΖQ�b����D1��8٠9�m�\�:sqn�����X��ѿk���@| �������t�z�UB%e6]��L�U��c��N�N7�L�ꒃy�z%^� &q����M�6Q���,�O�8O�� h"��N�:�s$ ��`��ӣS���f��l����Ax{��Cu�5��i����P��ܶ���
�EWg�A�Q0Fח�ηoḓ�/��x�o���-iտ>tn�[0�B�ժ���8o!9��'zؠ�����r
�{�LC��|��i�F�TI���7Á��V�xRyc.�6nG�Sv�i�[QY���0�ZH���4��G߷1��Ǣv��A頷!���}B<�-��t�n�j9㺢Sh�_����v�{����ۥuJ�i1����]��Z]g��:P���a47O] �8��s*ŌD/y����R��ߕ��g�֒�-�