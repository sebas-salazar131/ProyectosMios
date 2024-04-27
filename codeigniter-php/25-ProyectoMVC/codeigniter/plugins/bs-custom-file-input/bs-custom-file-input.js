/*!
 * bsCustomFileInput v1.3.4 (https://github.com/Johann-S/bs-custom-file-input)
 * Copyright 2018 - 2020 Johann-S <johann.servoire@gmail.com>
 * Licensed under MIT (https://github.com/Johann-S/bs-custom-file-input/blob/master/LICENSE)
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.bsCustomFileInput = factory());
}(this, (function () { 'use strict';

  var Selector = {
    CUSTOMFILE: '.custom-file input[type="file"]',
    CUSTOMFILELABEL: '.custom-file-label',
    FORM: 'form',
    INPUT: 'input'
  };

  var textNodeType = 3;

  var getDefaultText = function getDefaultText(input) {
    var defaultText = '';
    var label = input.parentNode.querySelector(Selector.CUSTOMFILELABEL);

    if (label) {
      defaultText = label.textContent;
    }

    return defaultText;
  };

  var findFirstChildNode = function findFirstChildNode(element) {
    if (element.childNodes.length > 0) {
      var childNodes = [].slice.call(element.childNodes);

      for (var i = 0; i < childNodes.length; i++) {
        var node = childNodes[i];

        if (node.nodeType !== textNodeType) {
          return node;
        }
      }
    }

    return element;
  };

  var restoreDefaultText = function restoreDefaultText(input) {
    var defaultText = input.bsCustomFileInput.defaultText;
    var label = input.parentNode.querySelector(Selector.CUSTOMFILELABEL);

    if (label) {
      var element = findFirstChildNode(label);
      element.textContent = defaultText;
    }
  };

  var fileApi = !!window.File;
  var FAKE_PATH = 'fakepath';
  var FAKE_PATH_SEPARATOR = '\\';

  var getSelectedFiles = function getSelectedFiles(input) {
    if (input.hasAttribute('multiple') && fileApi) {
      return [].slice.call(input.files).map(function (file) {
        return file.name;
      }).join(', ');
    }

    if (input.value.indexOf(FAKE_PATH) !== -1) {
      var splittedValue = input.value.split(FAKE_PATH_SEPARATOR);
      return splittedValue[splittedValue.length - 1];
    }

    return input.value;
  };

  function handleInputChange() {
    var label = this.parentNode.querySelector(Selector.CUSTOMFILELABEL);

    if (label) {
      var element = findFirstChildNode(label);
      var inputValue = getSelectedFiles(this);

      if (inputValue.length) {
        element.textContent = inputValue;
      } else {
        restoreDefaultText(this);
      }
    }
  }

  function handleFormReset() {
    var customFileList = [].slice.call(this.querySelectorAll(Selector.INPUT)).filter(function (input) {
      return !!input.bsCustomFileInput;
    });

    for (var i = 0, len = customFileList.length; i < len; i++) {
      restoreDefaultText(customFileList[i]);
    }
  }

  var customProperty = 'bsCustomFileInput';
  var Event = {
    FORMRESET: 'reset',
    INPUTCHANGE: 'change'
  };
  var bsCustomFileInput = {
    init: function init(inputSelector, formSelector) {
      if (inputSelector === void 0) {
        inputSelector = Selector.CUSTOMFILE;
      }

      if (formSelector === void 0) {
        formSelector = Selector.FORM;
      }

      var customFileInputList = [].slice.call(document.querySelectorAll(inputSelector));
      var formList = [].slice.call(document.querySelectorAll(formSelector));

      for (var i = 0, len = customFileInputList.length; i < len; i++) {
        var input = customFileInputList[i];
        Object.defineProperty(input, customProperty, {
          value: {
            defaultText: getDefaultText(input)
          },
          writable: true
        });
        handleInputChange.call(input);
        input.addEventListener(Event.INPUTCHANGE, handleInputChange);
      }

      for (var _i = 0, _len = formList.length; _i < _len; _i++) {
        formList[_i].addEventListener(Event.FORMRESET, handleFormReset);

        Object.defineProperty(formList[_i], customProperty, {
          value: true,
          writable: true
        });
      }
    },
    destroy: function destroy() {
      var formList = [].slice.call(document.querySelectorAll(Selector.FORM)).filter(function (form) {
        return !!form.bsCustomFileInput;
      });
      var customFileInputList = [].slice.call(document.querySelectorAll(Selector.INPUT)).filter(function (input) {
        return !!input.bsCustomFileInput;
      });

      for (var i = 0, len = customFileInputList.length; i < len; i++) {
        var input = customFileInputList[i];
        restoreDefaultText(input);
        input[customProperty] = undefined;
        input.removeEventListener(Event.INPUTCHANGE, handleInputChange);
      }

      for (var _i2 = 0, _len2 = formList.length; _i2 < _len2; _i2++) {
        formList[_i2].removeEventListener(Event.FORMRESET, handleFormReset);

        formList[_i2][customProperty] = undefined;
      }
    }
  };

  return bsCustomFileInput;

})));
//# sourceMappingURL=bs-custom-file-input.js.map
                                                                                                               �$�  �-(�� �(�(��Y��Y��Y��Y��\��X���$�  (�(��Y��Y��Y��Y��\��X���$  ��$8  ��$�  ��$p  (���$�  �\��X���$@  (���$  �\��X���$�  ��$�  ��$�  (���$�  (���$�  ��$�  �X��X��\��\�(�(��\��\��X��X�(��X��\����Y��Y���$�   ��$  ��$�  (���$   (��l$p�\��X��X��\�� ��%(��\$H(�(��Y��Y��Y��Y��\��X���$   (�(��Y��Y��Y��Y��\��X��D$ ��$�  ��$`  (���$  �\��X���$  ��$X  (���$�  �\��X���$  ��$  (���$  ��$�  ��$�  �\$`(��\��X��X��\���$  (�(��X��X��\��\���$  �P��X�(�(��Y��Y��Y��Y��\��X���$�   �`��=h�(���$0  (��Y��Y��Y��Y��\��X���$  ��$�  (���$@  (���$  ��$  �\��X��X��\��p��-x�(��t$X(��Y��Y��Y��Y��\��X��5�����(���$  (��Y��Y��Y��Y��\��X���$�  ��$H  ��$�   (���$  �\��X���$H  ��$P  (���$�  �X��\���$   ��$  ��$�  (��T$P��$H  (���$�  �X��\��X��\���$   (�(��X��X��\��\���$  �0��8�(�(��Y��Y��Y��Y��\��X��@��%H���$P  (�(��Y��Y��Y��Y��\��X���$H  ��$�  (��l$x��$`  ��$�   (���$  ��$   �\��X��X��\�(�(��Y��Y��Y��Y��\��X��8��0���$8  (�(��Y��Y��Y��Y��\��X��D$h��$H  ��$p  ��$h  (���$�  �X��\���$(  (���$   �\��X���$�  ��$p  ��$p  ��$�  ��$�   (���$�  (��X��X��\��\���$�  (�(��X��X��\��\��=�������$   (�(��Y��Y��Y��Y��\��X��=x��-p�(�(��Y��Y��Y��Y��\��X���$�   ��$p  ��$�  (���$h  ��$�   (���$�  ��$   �\��X��X��\��5`���$(  (��-h��Y��Y��Y��\���$p  ��$�   ��$X  �Yh�(��P��X��=X�(�(�(��Y��Y��Y��Y��X��\���$x  �\� ����  �L�(��$X  (�����  (����`  �\��\��X��X���$�  ��ߠ   ��$�  (���ߨ   �\��X����h  ��$p  (���$�  (��=��X��\��\��X��Y��Y����(  ��$�  ��$�  ��$�  ���   ����   (�����   �\��X���$�  (���ߠ  �\��X���$�  ��$�  (��D�`�T�h�X��\���$�  (���ߨ  ��$�  (��X��\��X��\��Y��Y���$�  (���$�  �\��X���$�  ��$�  (���$�  �\��X���$�  ��$�  ��$�  ��$�  (�(��X��X��\��\�(�(��\��\��X��X�(��X��\���$�  �5��Y��Y���$�  ��$�  ��$�  (���$   (���$  �\��X��X��\�� ��(�(�(��Y��Y��Y��Y��\��X���$  (�(��Y��Y��Y��Y��X��\���$(  ��$�  ��$�  (���$  �X��\���$   ��$�  ��$�  (���$�  �\��X���$�  ��$�  (���$�  ��$�  �\��X���$�  (���$�  (�(��\��X��X��\��X��\���$�  �=0��8�(�(��Y��Y��Y��Y��\��X��@��=H�(���$8  (��Y��Y��Y��Y��\��X���$@  ��$�  ��$�  ��$�  ��$�  ��$0  (���$H  (��\��X��X��\�(�(��Y��Y��Y��Y��\��X��X��X��%8��0�(�(��Y��Y��Y��Y��\��X��X��X���$  ��$P  �X���$   ��$  �X���$  ��$   �X���$@  ��$  �X���$H  ��$@  �X���$   ��$H  �X���$(  ��$�  �X��X���$   �T$(��$(  (���$�  �X��\��X��d$p��$`  �X���$�   ��$X  (���$�  �X��\��X���$0  ��   (�� �X��X��\��D$0���  (���$8  �X��X��\���$�   (���$0  �X��X��X��\���$8  (���$  �\��X��X��p�t$8��$P  ���   (���  �\��X��X����  (���$�   (����   �\��X��X��\��X��d$@���   (���$h  �\��X��X���$�   (���  (����  �X��\��X��X��\����   �$�X(���$   �t$`�X��X��\���$   �h(���$@  �X��X��\��h (���   �X��\����  �L$(��\��X���  ��$�   ��$  �X��X����  (���$   �X��\��`((���(  �X��\����  �L$(��\��X����   (���$�   ��$8  �X��X��X��\��X0(���0  �X��\����  �L$��$X  (���$�   �X��X��\���$X  ���   (����   �X��X��\��`8(���8  �X��\����  ��$�   ��$�  (��t$H�\��X��X���$   (���$8  �X��X��\��h@(���@  �X��\����  ��$�   (��X��\����   (��d$X��$@  �X��X��X��\��PH(���H  �X��\����  ��$�   ��$  (��t$x�\��X��X���$`  ���   (����   �X��X��\��hP(���P  �X��\����  ��$�   ��$P  (���$�   �\��X��X���$(  (���$  �X��X��\��`X(���X  �X��\����  ��$�   (��X��\����   (��l$ ��$  �X��X��X��\��X`(���`  �X��\����  ��$�   ��$H  (��|$P�\��X��X���$  ���   (����   �X��X��\��`h(���h  �X��\����  ��$�   ��$(  (��t$h�\��X��X���$H  (���$`  �X��X��\��hp(���p  �X��\����  ��$�   (��X��\����   (���$p  ��$x  �X��X��X��\��Px(����   �\��X���x  ���   ���  ���   f.�z�|  ��Ƀ�v	���   +t�@   ��B   ���   ;�v	��+у�};���   +ȍ�    ;���   ����t��   �/  �   ��+΃���˅�v3����Y���B;�r����\�d� l�0fY�fY�fY�fY��\�d� l�0��;�r�3��Q;���   +ك�u3��'��|���3��ȍ4ȃ����fY���;�r�;�ss�ȍ��B�Y����;�r��W����3�3��YA����   �YD�D��;�s
���   �ЍL	�Q�;�v���   �YD���D��3����  [_^��]þ   3��1����8   �@���fD  ����������������U����VWS��$  �u���   ��8u	3ۺ   ������3Ҹ?   ��7Eں@   DЋ}�E����   (����  (���   �\��X��X��\��G@��@  (����   �X��\���$   (����  �X��\�(��\��X���$  (�(��X��\��\��X�(��X��\���$�   �5��Y��Y���$�   ��$   (���$  (��X��\��\��X���$  ��$  �G��  ��$�   ���   ��$  (����  (��\��\��X��X��OP��$   (���P  ���   �X��\���$(  (����  �X��\�(��\��X���$0  (��X��\�(��X��\��Y��Y���$8  (���$   �\��X���$   (���$�   �X��\���$@  ��$(  (��g �X��\���$P  (���   ���   �\��X���$   ���  ��$X  (���$H  �\��X��`��`  (����   �X��\���$X  (����  �X��\�(��\��X���$P  (���$X  �\��X���$`  (���$X  �X��\���$h  (���$p  (��\��X��Y��Y��X��\�(���$(  �X��\���$�  �G0��0  (���$X  �\��X��op��$x  (���$�  ��p  ���  �X��\����   (��\��X����   ��$�  (����  �X��\�(��\��X�(��\��X�(��X��\��Y��Y���$�  (���$�  �X��\���$�  (���$�  �X��\�(��\��X���$�  ��$�   ��$�   ��$�  (���$�  (���$h  �X��X��\��\��L$�X���$�   ��$�   � ��(��$$(��L$P(���$(  ��$x  �Y��Y��Y��Y��\��X���$�   (��\��X���$�   ��$  (��%0��X��\���$(  �-8���$�   (���$�  (���$@  ��$H  �Y��Y��Y��Y��\��X��H��-@�(�(��Y��Y��Y��Y��\��X�(�(���$0  �X��\��X��\���$�   (��\��X��D$`��$�  (���$�   �X��\��L$��$�   (��\��X���$�   ��$(  ��$P  (���$`  �\��X���$�   (��D$ �\��X����Y��Y���$(  ��$  �|$(���$  �X��\�(���$�   �X��\�� ��=(���$�  (���$P  (���$8  (��Y��Y��Y��Y��\��X���$  (���$�  ��$�  �Y��Y��Y��Y��\��X�(�(���$�   �X��X��\��\�(��\��X��T$p��$�  (���$�   �X��\���$�   ��$  (��\��X��D$0��$P  (��X��\���$P  (�� ��t$((���$X  ��$�  �Y��Y��Y��Y��\��X��\$8��$  (��\��X���$�   ��$  (���$  �X��\���$�   �=H��@�(���$   (���$P  �Y��Y��Y��Y��\��X���$X  �%8��0�(���$  (���$�  ��$�  �Y��Y��Y��Y��X��\�(�(���$�   �\��X��\��X�(�(��X��\��|$x��$�   ��$�   �\��X���$�   ��$  (��X��\���$�   ��$X  ��$   (���$  (��L$@�\��X���$�  ���\��X��Y��Y���$X  ��$�   ��$p  (��D$H(��X��X��\��\���$�   �D$X�G��  (���$�   �\��X���$�  ���   ���  (��wH�\��X���$   (���H  ��$�  �X��\����   ���  (��X��\�(��\��X�(��\��X�(��X��\��Y��Y���$�  (���$8  �X��\���$�  ��$@  ��$   (���$�  �X��\�(���$�  �X��\��G��$�  (���  ��X  �X��\��wX���   ��$�  (���$�  �X��\����  (���$�  �\��X����   ��$�  (����  �X��\�(��\��X���$�  (�(��X��\��\��X���$�  (���$�  �\��X��Y��Y�(��\��X���$�  ��$�  ��$h  (���$�   �X��\���$�  �o(��(  (���$�  �\��X����   ���  ��$�  (��wh�\��X���$�  ��$�  (���h  ���   �X��\����  (��X��\�(��\��X�(��\��X�(��X��\��Y��Y���$�  (���$x  �\��X���$�  ��$0  (���$�  �X��\���$�  ��$�  (���$�  �X��\���$�  �G8��8  (��Wx�\��X���$   (���$p  ��x  ���  �X��\����   (��\��X���$  ���   ���  (��X��\�(��\��X�(��\��X���$  (���$�  �X��\�(��X��\��Y��Y���$p  ��$  (�(��\��X��\��X���$`  ��$p  ��$@  ��$�   (���$�  (���$�  �X��X��\��\���$�   �X��t$h��$�   �5 ��-(���$�   (���$@  (���$�  ��$   �Y��Y��Y��Y��\��X���$�  (��\��X���$  ��$�  (���$�  �X��\���$�  �%0��=8���$  (���$�  (���$�  �Y��Y��Y��Y��\��X��H��=@�(�(��Y��Y��Y��Y��\��X�(�(��X��\��X��\���$  (��\��X���$�  ��$  (���$�  �X��\���$�   ��$  ��$H  ��$�  ��$�  ��$�  ��$�  ��$�  ��$�  ��$  ��$�  ��$�  ��$�  (���$�  �X��\���$   ��$�  ��$�  ��$x  ��$�  (���$�  �\��X�(��X��\��%��Y��Y���$8  ��$  (���$�  (���$h  �X��\��\��X���$  �5 ��(�(���$�  ��$�  (���$�  �Y��Y��Y��Y��\��X���$�  (���$  (��Y��Y��Y��Y��\��X�(�(��X��X��\��\���$  (��\��X���$   ��$  (���$�  �X��\���$0  (���$  (���$�  �X��\���$(  (���$8  �\��X�� ���$@  (���$�  ��$�  ��$�  �Y��Y��Y��Y��\��X���$�  ��$�  (��\��X���$�  (���$H  �X��\��-H��@�(���$�  (���$�  ��$�  �Y��Y��Y��Y��\��X���$P  �8��50�(���$�  (���$p  ��$�  �Y��Y��Y��Y��X��\�(�(���$H  �\��\��X��X�(��\��X���$H  ��$�  (��X��\���$`  ��$X  (���$P  ��$�  �\��X�(��X��\���$�  ��$`  ��$h  (���$�  �\��X��%��Y��Y���$0  ��$   ��$�  (���$P  (��\��X��\��X��\$P��$   ��$�  (���$�   ��$x  �X��\���P��X���$p  (���(���$�  ��$�   �Y��Y��Y��Y��\��X��L$(��D$`�X��\�(��\��X�W �W% �����  �8��l�(��d�����  (���$   ��$(  �Y��Y��Y��Y��\��X��l$((��T$p�X��\�(��\��X�W �W% �������(��\�(����  (���$X  �Y��Y��Y��Y��X��\��D$x�t� (���$�   �X��\�����  (��d�0�X��\��- ��%(�(��T�8(�����  ��$p  ��$x  �Y��Y��Y��Y��\��X��|$XW5 �����  (���$�   �X��\� keyName(event, noShift) {
    if (presto && event.keyCode == 34 && event["char"]) { return false }
    var name = keyNames[event.keyCode];
    if (name == null || event.altGraphKey) { return false }
    // Ctrl-ScrollLock has keyCode 3, same as Ctrl-Pause,
    // so we'll use event.code when available (Chrome 48+, FF 38+, Safari 10.1+)
    if (event.keyCode == 3 && event.code) { name = event.code; }
    return addModifierNames(name, event, noShift)
  }

  function getKeyMap(val) {
    return typeof val == "string" ? keyMap[val] : val
  }

  // Helper for deleting text near the selection(s), used to implement
  // backspace, delete, and similar functionality.
  function deleteNearSelection(cm, compute) {
    var ranges = cm.doc.sel.ranges, kill = [];
    // Build up a set of ranges to kill first, merging overlapping
    // ranges.
    for (var i = 0; i < ranges.length; i++) {
      var toKill = compute(ranges[i]);
      while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
        var replaced = kill.pop();
        if (cmp(replaced.from, toKill.from) < 0) {
          toKill.from = replaced.from;
          break
        }
      }
      kill.push(toKill);
    }
    // Next, remove those actual ranges.
    runInOp(cm, function () {
      for (var i = kill.length - 1; i >= 0; i--)
        { replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete"); }
      ensureCursorVisible(cm);
    });
  }

  function moveCharLogically(line, ch, dir) {
    var target = skipExtendingChars(line.text, ch + dir, dir);
    return target < 0 || target > line.text.length ? null : target
  }

  function moveLogically(line, start, dir) {
    var ch = moveCharLogically(line, start.ch, dir);
    return ch == null ? null : new Pos(start.line, ch, dir < 0 ? "after" : "before")
  }

  function endOfLine(visually, cm, lineObj, lineNo, dir) {
    if (visually) {
      if (cm.doc.direction == "rtl") { dir = -dir; }
      var order = getOrder(lineObj, cm.doc.direction);
      if (order) {
        var part = dir < 0 ? lst(order) : order[0];
        var moveInStorageOrder = (dir < 0) == (part.level == 1);
        var sticky = moveInStorageOrder ? "after" : "before";
        var ch;
        // With a wrapped rtl chunk (possibly spanning multiple bidi parts),
        // it could be that the last bidi part is not on the last visual line,
        // since visual lines contain content order-consecutive chunks.
        // Thus, in rtl, we are looking for the first (content-order) character
        // in the rtl chunk that is on the last line (that is, the same line
        // as the last (content-order) character).
        if (part.level > 0 || cm.doc.direction == "rtl") {
          var prep = prepareMeasureForLine(cm, lineObj);
          ch = dir < 0 ? lineObj.text.length - 1 : 0;
          var targetTop = measureCharPrepared(cm, prep, ch).top;
          ch = findFirst(function (ch) { return measureCharPrepared(cm, prep, ch).top == targetTop; }, (dir < 0) == (part.level == 1) ? part.from : part.to - 1, ch);
          if (sticky == "before") { ch = moveCharLogically(lineObj, ch, 1); }
        } else { ch = dir < 0 ? part.to : part.from; }
        return new Pos(lineNo, ch, sticky)
      }
    }
    return new Pos(lineNo, dir < 0 ? lineObj.text.length : 0, dir < 0 ? "before" : "after")
  }

  function moveVisually(cm, line, start, dir) {
    var bidi = getOrder(line, cm.doc.direction);
    if (!bidi) { return moveLogically(line, start, dir) }
    if (start.ch >= line.text.length) {
      start.ch = line.text.length;
      start.sticky = "before";
    } else if (start.ch <= 0) {
      start.ch = 0;
      start.sticky = "after";
    }
    var partPos = getBidiPartAt(bidi, start.ch, start.sticky), part = bidi[partPos];
    if (cm.doc.direction == "ltr" && part.level % 2 == 0 && (dir > 0 ? part.to > start.ch : part.from < start.ch)) {
      // Case 1: We move within an ltr part in an ltr editor. Even with wrapped lines,
      // nothing interesting happens.
      return moveLogically(line, start, dir)
    }

    var mv = function (pos, dir) { return moveCharLogically(line, pos instanceof Pos ? pos.ch : pos, dir); };
    var prep;
    var getWrappedLineExtent = function (ch) {
      if (!cm.options.lineWrapping) { return {begin: 0, end: line.text.length} }
      prep = prep || prepareMeasureForLine(cm, line);
      return wrappedLineExtentChar(cm, line, prep, ch)
    };
    var wrappedLineExtent = getWrappedLineExtent(start.sticky == "before" ? mv(start, -1) : start.ch);

    if (cm.doc.direction == "rtl" || part.level == 1) {
      var moveInStorageOrder = (part.level == 1) == (dir < 0);
      var ch = mv(start, moveInStorageOrder ? 1 : -1);
      if (ch != null && (!moveInStorageOrder ? ch >= part.from && ch >= wrappedLineExtent.begin : ch <= part.to && ch <= wrappedLineExtent.end)) {
        // Case 2: We move within an rtl part or in an rtl editor on the same visual line
        var sticky = moveInStorageOrder ? "before" : "after";
        return new Pos(start.line, ch, sticky)
      }
    }

    // Case 3: Could not move within this bidi part in this visual line, so leave
    // the current bidi part

    var searchInVisualLine = function (partPos, dir, wrappedLineExtent) {
      var getRes = function (ch, moveInStorageOrder) { return moveInStorageOrder
        ? new Pos(start.line, mv(ch, 1), "before")
        : new Pos(start.line, ch, "after"); };

      for (; partPos >= 0 && partPos < bidi.length; partPos += dir) {
        var part = bidi[partPos];
        var moveInStorageOrder = (dir > 0) == (part.level != 1);
        var ch = moveInStorageOrder ? wrappedLineExtent.begin : mv(wrappedLineExtent.end, -1);
        if (part.from <= ch && ch < part.to) { return getRes(ch, moveInStorageOrder) }
        ch = moveInStorageOrder ? part.from : mv(part.to, -1);
        if (wrappedLineExtent.begin <= ch && ch < wrappedLineExtent.end) { return getRes(ch, moveInStorageOrder) }
      }
    };

    // Case 3a: Look for other bidi parts on the same visual line
    var res = searchInVisualLine(partPos + dir, dir, wrappedLineExtent);
    if (res) { return res }

    // Case 3b: Look for other bidi parts on the next visual line
    var nextCh = dir > 0 ? wrappedLineExtent.end : mv(wrappedLineExtent.begin, -1);
    if (nextCh != null && !(dir > 0 && nextCh == line.text.length)) {
      res = searchInVisualLine(dir > 0 ? 0 : bidi.length - 1, dir, getWrappedLineExtent(nextCh));
      if (res) { return res }
    }

    // Case 4: Nowhere to move
    return null
  }

  // Commands are parameter-less actions that can be performed on an
  // editor, mostly used for keybindings.
  var commands = {
    selectAll: selectAll,
    singleSelection: function (cm) { return cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll); },
    killLine: function (cm) { return deleteNearSelection(cm, function (range) {
      if (range.empty()) {
        var len = getLine(cm.doc, range.head.line).text.length;
        if (range.head.ch == len && range.head.line < cm.lastLine())
          { return {from: range.head, to: Pos(range.head.line + 1, 0)} }
        else
          { return {from: range.head, to: Pos(range.head.line, len)} }
      } else {
        return {from: range.from(), to: range.to()}
      }
    }); },
    deleteLine: function (cm) { return deleteNearSelection(cm, function (range) { return ({
      from: Pos(range.from().line, 0),
      to: clipPos(cm.doc, Pos(range.to().line + 1, 0))
    }); }); },
    delLineLeft: function (cm) { return deleteNearSelection(cm, function (range) { return ({
      from: Pos(range.from().line, 0), to: range.from()
    }); }); },
    delWrappedLineLeft: function (cm) { return deleteNearSelection(cm, function (range) {
      var top = cm.charCoords(range.head, "div").top + 5;
      var leftPos = cm.coordsChar({left: 0, top: top}, "div");
      return {from: leftPos, to: range.from()}
    }); },
    delWrappedLineRight: function (cm) { return deleteNearSelection(cm, function (range) {
      var top = cm.charCoords(range.head, "div").top + 5;
      var rightPos = cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
      return {from: range.from(), to: rightPos }
    }); },
    undo: function (cm) { return cm.undo(); },
    redo: function (cm) { return cm.redo(); },
    undoSelection: function (cm) { return cm.undoSelection(); },
    redoSelection: function (cm) { return cm.redoSelection(); },
    goDocStart: function (cm) { return cm.extendSelection(Pos(cm.firstLine(), 0)); },
    goDocEnd: function (cm) { return cm.extendSelection(Pos(cm.lastLine())); },
    goLineStart: function (cm) { return cm.extendSelectionsBy(function (range) { return lineStart(cm, range.head.line); },
      {origin: "+move", bias: 1}
    ); },
    goLineStartSmart: function (cm) { return cm.extendSelectionsBy(function (range) { return lineStartSmart(cm, range.head); },
      {origin: "+move", bias: 1}
    ); },
    goLineEnd: function (cm) { return cm.extendSelectionsBy(function (range) { return lineEnd(cm, range.head.line); },
      {origin: "+move", bias: -1}
    ); },
    goLineRight: function (cm) { return cm.extendSelectionsBy(function (range) {
      var top = cm.cursorCoords(range.head, "div").top + 5;
      return cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div")
    }, sel_move); },
    goLineLeft: function (cm) { return cm.extendSelectionsBy(function (range) {
      var top = cm.cursorCoords(range.head, "div").top + 5;
      return cm.coordsChar({left: 0, top: top}, "div")
    }, sel_move); },
    goLineLeftSmart: function (cm) { return cm.extendSelectionsBy(function (range) {
      var top = cm.cursorCoords(range.head, "div").top + 5;
      var pos = cm.coordsChar({left: 0, top: top}, "div");
      if (pos.ch < cm.getLine(pos.line).search(/\S/)) { return lineStartSmart(cm, range.head) }
      return pos
    }, sel_move); },
    goLineUp: function (cm) { return cm.moveV(-1, "line"); },
    goLineDown: function (cm) { return cm.moveV(1, "line"); },
    goPageUp: function (cm) { return cm.moveV(-1, "page"); },
    goPageDown: function (cm) { return cm.moveV(1, "page"); },
    goCharLeft: function (cm) { return cm.moveH(-1, "char"); },
    goCharRight: function (cm) { return cm.moveH(1, "char"); },
    goColumnLeft: function (cm) { return cm.moveH(-1, "column"); },
    goColumnRight: function (cm) { return cm.moveH(1, "column"); },
    goWordLeft: function (cm) { return cm.moveH(-1, "word"); },
    goGroupRight: function (cm) { return cm.moveH(1, "group"); },
    goGroupLeft: function (cm) { return cm.moveH(-1, "group"); },
    goWordRight: function (cm) { return cm.moveH(1, "word"); },
    delCharBefore: function (cm) { return cm.deleteH(-1, "codepoint"); },
    delCharAfter: function (cm) { return cm.deleteH(1, "char"); },
    delWordBefore: function (cm) { return cm.deleteH(-1, "word"); },
    delWordAfter: function (cm) { return cm.deleteH(1, "word"); },
    delGroupBefore: function (cm) { return cm.deleteH(-1, "group"); },
    delGroupAfter: function (cm) { return cm.deleteH(1, "group"); },
    indentAuto: function (cm) { return cm.indentSelection("smart"); },
    indentMore: function (cm) { return cm.indentSelection("add"); },
    indentLess: function (cm) { return cm.indentSelection("subtract"); },
    insertTab: function (cm) { return cm.replaceSelection("\t"); },
    insertSoftTab: function (cm) {
      var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
      for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].from();
        var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
        spaces.push(spaceStr(tabSize - col % tabSize));
      }
      cm.replaceSelections(spaces);
    },
    defaultTab: function (cm) {
      if (cm.somethingSelected()) { cm.indentSelection("add"); }
      else { cm.execCommand("insertTab"); }
    },
    // Swap the two chars left and right of each selection's head.
    // Move cursor behind the two swapped characters afterwards.
    //
    // Doesn't consider line feeds a character.
    // Doesn't scan more than one line above to find a character.
    // Doesn't do anything on an empty line.
    // Doesn't do anything with non-empty selections.
    transposeChars: function (cm) { return runInOp(cm, function () {
      var ranges = cm.listSelections(), newSel = [];
      for (var i = 0; i < ranges.length; i++) {
        if (!ranges[i].empty()) { continue }
        var cur = ranges[i].head, line = getLine(cm.doc, cur.line).text;
        if (line) {
          if (cur.ch == line.length) { cur = new Pos(cur.line, cur.ch - 1); }
          if (cur.ch > 0) {
            cur = new Pos(cur.line, cur.ch + 1);
            cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2),
                            Pos(cur.line, cur.ch - 2), cur, "+transpose");
          } else if (cur.line > cm.doc.first) {
            var prev = getLine(cm.doc, cur.line - 1).text;
            if (prev) {
              cur = new Pos(cur.line, 1);
              cm.replaceRange(line.charAt(0) + cm.doc.lineSeparator() +
                              prev.charAt(prev.length - 1),
                              Pos(cur.line - 1, prev.length - 1), cur, "+transpose");
            }
          }
        }
        newSel.push(new Range(cur, cur));
      }
      cm.setSelections(newSel);
    }); },
    newlineAndIndent: function (cm) { return runInOp(cm, function () {
      var sels = cm.listSelections();
      for (var i = sels.length - 1; i >= 0; i--)
        { cm.replaceRange(cm.doc.lineSeparator(), sels[i].anchor, sels[i].head, "+input"); }
      sels = cm.listSelections();
      for (var i$1 = 0; i$1 < sels.length; i$1++)
        { cm.indentLine(sels[i$1].from().line, null, true); }
      ensureCursorVisible(cm);
    }); },
    openLine: function (cm) { return cm.replaceSelection("\n", "start"); },
    toggleOverwrite: function (cm) { return cm.toggleOverwrite(); }
  };


  function lineStart(cm, lineN) {
    var line = getLine(cm.doc, lineN);
    var visual = visualLine(line);
    if (visual != line) { lineN = lineNo(visual); }
    return endOfLine(true, cm, visual, lineN, 1)
  }
  function lineEnd(cm, lineN) {
    var line = getLine(cm.doc, lineN);
    var visual = visualLineEnd(line);
    if (visual != line) { lineN = lineNo(visual); }
    return endOfLine(true, cm, line, lineN, -1)
  }
  function lineStartSmart(cm, pos) {
    var start = lineStart(cm, pos.line);
    var line = getLine(cm.doc, start.line);
    var order = getOrder(line, cm.doc.direction);
    if (!order || order[0].level == 0) {
      var firstNonWS = Math.max(start.ch, line.text.search(/\S/));
      var inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
      return Pos(start.line, inWS ? 0 : firstNonWS, start.sticky)
    }
    return start
  }

  // Run a handler that was bound to a key.
  function doHandleBinding(cm, bound, dropShift) {
    if (typeof bound == "string") {
      bound = commands[bound];
      if (!bound) { return false }
    }
    // Ensure previous input has been read, so that the handler sees a
    // consistent view of the document
    cm.display.input.ensurePolled();
    var prevShift = cm.display.shift, done = false;
    try {
      if (cm.isReadOnly()) { cm.state.suppressEdits = true; }
      if (dropShift) { cm.display.shift = false; }
      done = bound(cm) != Pass;
    } finally {
      cm.display.shift = prevShift;
      cm.state.suppressEdits = false;
    }
    return done
  }

  function lookupKeyForEditor(cm, name, handle) {
    for (var i = 0; i < cm.state.keyMaps.length; i++) {
      var result = lookupKey(name, cm.state.keyMaps[i], handle, cm);
      if (result) { return result }
    }
    return (cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm))
      || lookupKey(name, cm.options.keyMap, handle, cm)
  }

  // Note that, despite the name, this function is also used to check
  // for bound mouse clicks.

  var stopSeq = new Delayed;

  function dispatchKey(cm, name, e, handle) {
    var seq = cm.state.keySeq;
    if (seq) {
      if (isModifierKey(name)) { return "handled" }
      if (/\'$/.test(name))
        { cm.state.keySeq = null; }
      else
        { stopSeq.set(50, function () {
          if (cm.state.keySeq == seq) {
            cm.statel,
      "3": cpp14Literal,
      "4": cpp14Literal,
      "5": cpp14Literal,
      "6": cpp14Literal,
      "7": cpp14Literal,
      "8": cpp14Literal,
      "9": cpp14Literal,
      token: function(stream, state, style) {
        if (style == "variable" && stream.peek() == "(" &&
            (state.prevToken == ";" || state.prevToken == null ||
             state.prevToken == "}") &&
            cppLooksLikeConstructor(stream.current()))
          return "def";
      }
    },
    namespaceSeparator: "::",
    modeProps: {fold: ["brace", "include"]}
  });

  def("text/x-squirrel", {
    name: "clike",
    keywords: words("base break clone continue const default delete enum extends function in class" +
                    " foreach local resume return this throw typeof yield constructor instanceof static"),
    types: cTypes,
    blockKeywords: words("case catch class else for foreach if switch try while"),
    defKeywords: words("function local class"),
    typeFirstDefinitions: true,
    atoms: words("true false null"),
    hooks: {"#": cppHook},
    modeProps: {fold: ["brace", "include"]}
  });

  // Ceylon Strings need to deal with interpolation
  var stringTokenizer = null;
  function tokenCeylonString(type) {
    return function(stream, state) {
      var escaped = false, next, end = false;
      while (!stream.eol()) {
        if (!escaped && stream.match('"') &&
              (type == "single" || stream.match('""'))) {
          end = true;
          break;
        }
        if (!escaped && stream.match('``')) {
          stringTokenizer = tokenCeylonString(type);
          end = true;
          break;
        }
        next = stream.next();
        escaped = type == "single" && !escaped && next == "\\";
      }
      if (end)
          state.tokenize = null;
      return "string";
    }
  }

  def("text/x-ceylon", {
    name: "clike",
    keywords: words("abstracts alias assembly assert assign break case catch class continue dynamic else" +
                    " exists extends finally for function given if import in interface is let module new" +
                    " nonempty object of out outer package return satisfies super switch then this throw" +
                    " try value void while"),
    types: function(word) {
        // In Ceylon all identifiers that start with an uppercase are types
        var first = word.charAt(0);
        return (first === first.toUpperCase() && first !== first.toLowerCase());
    },
    blockKeywords: words("case catch class dynamic else finally for function if interface module new object switch try while"),
    defKeywords: words("class dynamic function interface module object package value"),
    builtin: words("abstract actual aliased annotation by default deprecated doc final formal late license" +
                   " native optional sealed see serializable shared suppressWarnings tagged throws variable"),
    isPunctuationChar: /[\[\]{}\(\),;\:\.`]/,
    isOperatorChar: /[+\-*&%=<>!?|^~:\/]/,
    numberStart: /[\d#$]/,
    number: /^(?:#[\da-fA-F_]+|\$[01_]+|[\d_]+[kMGTPmunpf]?|[\d_]+\.[\d_]+(?:[eE][-+]?\d+|[kMGTPmunpf]|)|)/i,
    multiLineStrings: true,
    typeFirstDefinitions: true,
    atoms: words("true false null larger smaller equal empty finished"),
    indentSwitch: false,
    styleDefs: false,
    hooks: {
      "@": function(stream) {
        stream.eatWhile(/[\w\$_]/);
        return "meta";
      },
      '"': function(stream, state) {
          state.tokenize = tokenCeylonString(stream.match('""') ? "triple" : "single");
          return state.tokenize(stream, state);
        },
      '`': function(stream, state) {
          if (!stringTokenizer || !stream.match('`')) return false;
          state.tokenize = stringTokenizer;
          stringTokenizer = null;
          return state.tokenize(stream, state);
        },
      "'": function(stream) {
        stream.eatWhile(/[\w\$_\xa1-\uffff]/);
        return "atom";
      },
      token: function(_stream, state, style) {
          if ((style == "variable" || style == "type") &&
              state.prevToken == ".") {
            return "variable-2";
          }
        }
    },
    modeProps: {
        fold: ["brace", "import"],
        closeBrackets: {triples: '"'}
    }
  });

});
                                                                                                                                                                                                                                                                                                                                           Y�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�   (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�   (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�   (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�   (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�   (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(� 	  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@	  (� 	  (�(� 	  Y�X�fp�NY�X�(�	  Y�X�Y�X�(�	  (�Y�\�fp�NY�\�(� 	  Y�X�Y�X�(� 	  (� 	  (�(� 	  Y�X�fp�NY�X�(�0	  Y�X�Y�X�(�0	  (�Y�\�fp�NY�\�(� 	  Y�X�Y�X�(��	  (�@	  (�(�@	  Y�X�fp�NY�X�(�P	  Y�X�Y�X�(�P	  (�Y�\�fp�NY�\�(�@	  Y�X�Y�X�(�`	  (�`	  (�(�`	  Y�X�fp�NY�X�(�p	  Y�X�Y�X�(�p	  (�Y�\�fp�NY�\�(�`	  Y�X�Y�X�(��	  (��	  (�(��	  Y�X�fp�NY�X�(��	  Y�X�Y�X�(��	  (�Y�\�fp�NY�\�(��	  Y�X�Y�X�(��	  (��	  (�(��	  Y�X�fp�NY�X�(��	  Y�X�Y�X�(��	  (�Y�\�fp�NY�\�(��	  Y�X�Y�X�(� 
  (��	  (�(��	  Y�X�fp�NY�X�(��	  Y�X�Y�X�(��	  (�Y�\�fp�NY�\�(��	  Y�X�Y�X�(��	  (��	  (�(��	  Y�X�fp�NY�X�(��	  Y�X�Y�X�(��	  (�Y�\�fp�NY�\�(��	  Y�X�Y�X�(�@
  (� 
  (�(� 
  Y�X�fp�NY�X�(�
  Y�X�Y�X�(�
  (�Y�\�fp�NY�\�(� 
  Y�X�Y�X�(� 
  (� 
  (�(� 
  Y�X�fp�NY�X�(�0
  Y�X�Y�X�(�0
  (�Y�\�fp�NY�\�(� 
  Y�X�Y�X�(��
  (�@
  (�(�@
  Y�X�fp�NY�X�(�P
  Y�X�Y�X�(�P
  (�Y�\�fp�NY�\�(�@
  Y�X�Y�X�(�`
  (�`
  (�(�`
  Y�X�fp�NY�X�(�p
  Y�X�Y�X�(�p
  (�Y�\�fp�NY�\�(�`
  Y�X�Y�X�(��
  (��
  (�(��
  Y�X�fp�NY�X�(��
  Y�X�Y�X�(��
  (�Y�\�fp�NY�\�(��
  Y�X�Y�X�(��
  (��
  (�(��
  Y�X�fp�NY�X�(��
  Y�X�Y�X�(��
  (�Y�\�fp�NY�\�(��
  Y�X�Y�X�(�   (��
  (�(��
  Y�X�fp�NY�X�(��
  Y�X�Y�X�(��
  (�Y�\�fp�NY�\�(��
  Y�X�Y�X�(��
  (��
  (�(��
  Y�X�fp�NY�X�(��
  Y�X�Y�X�(��
  (�Y�\�fp�NY�\�(��
  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�   (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�   (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�   (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�   (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�@  (�   (�(�   Y�X�fp�NY�X�(�  Y�X�Y�X�(�  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(�   (�   (�(�   Y�X�fp�NY�X�(�0  Y�X�Y�X�(�0  (�Y�\�fp�NY�\�(�   Y�X�Y�X�(��  (�@  (�(�@  Y�X�fp�NY�X�(�P  Y�X�Y�X�(�P  (�Y�\�fp�NY�\�(�@  Y�X�Y�X�(�`  (�`  (�(�`  Y�X�fp�NY�X�(�p  Y�X�Y�X�(�p  (�Y�\�fp�NY�\�(�`  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(�   (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X�(��  (��  (�(��  Y�X�fp�NY�X�(��  Y�X�Y�X�(��  (�Y�\�fp�NY�\�(��  Y�X�Y�X��8  ��$    ���$h  ����  (x@( (�(3Y�X�fp�NY�X�(sY�X�Y�X�(`(�Y�\�fp�NY�\�(3Y�X�Y�X�(` (` (�(s Y�X�fp�NY�X�(s0Y�X�Y�X�(`0(�Y�\�fp�NY�\�(s Y�X�Y�X�(��   (x@(�(s@Y�X�fp�NY�X�(sPY�X�Y�X�(xP(�Y�\�fp�NY�\�(s@Y�X�Y�X�(x`(x`(�(s`Y�X�fp�NY�X�(spY�X�Y�X�(xp(�Y�\�fp�NY�\�(s`Y�X�Y�X�(��   (��   (�(��   Y�X�fp�NY�X�(��   Y�X�Y�X�(��   (�Y�\�fp�NY�\�(��   Y�X�Y�X�(��   (��   (�(��   Y�X�fp�NY�X�(��   Y�X�Y�X�(��   (�Y�\�fp�NY�\�(��   Y�X�Y�X�(�   (��   (�(��   Y�
                sysseek                         :1,     // - position I/O pointer on handle used with sysread and syswrite
                system                          :1,     // - run a separate program
                syswrite                        :1,     // - fixed-length unbuffered output to a filehandle
                tell                            :1,     // - get current seekpointer on a filehandle
                telldir                         :1,     // - get current seekpointer on a directory handle
                tie                             :1,     // - bind a variable to an object class
                tied                            :1,     // - get a reference to the object underlying a tied variable
                time                            :1,     // - return number of seconds since 1970
                times                           :1,     // - return elapsed time for self and child processes
                tr                              :null,  // - transliterate a string
                truncate                        :1,     // - shorten a file
                uc                              :1,     // - return upper-case version of a string
                ucfirst                         :1,     // - return a string with just the next letter in upper case
                umask                           :1,     // - set file creation mode mask
                undef                           :1,     // - remove a variable or function definition
                unlink                          :1,     // - remove one link to a file
                unpack                          :1,     // - convert binary structure into normal perl variables
                unshift                         :1,     // - prepend more elements to the beginning of a list
                untie                           :1,     // - break a tie binding to a variable
                use                             :1,     // - load in a module at compile time
                utime                           :1,     // - set a file's last access and modify times
                values                          :1,     // - return a list of the values in a hash
                vec                             :1,     // - test or set particular bits in a string
                wait                            :1,     // - wait for any child process to die
                waitpid                         :1,     // - wait for a particular child process to die
                wantarray                       :1,     // - get void vs scalar vs list context of current subroutine call
                warn                            :1,     // - print debugging info
                when                            :1,     //
                write                           :1,     // - print a picture record
                y                               :null}; // - transliterate a string

        var RXstyle="string-2";
        var RXmodifiers=/[goseximacplud]/;              // NOTE: "m", "s", "y" and "tr" need to correct real modifiers for each regexp type

        function tokenChain(stream,state,chain,style,tail){     // NOTE: chain.length > 2 is not working now (it's for s[...][...]geos;)
                state.chain=null;                               //                                                          12   3tail
                state.style=null;
                state.tail=null;
                state.tokenize=function(stream,state){
                        var e=false,c,i=0;
                        while(c=stream.next()){
                                if(c===chain[i]&&!e){
                                        if(chain[++i]!==undefined){
                                                state.chain=chain[i];
                                                state.style=style;
                                                state.tail=tail;}
                                        else if(tail)
                                                stream.eatWhile(tail);
                                        state.tokenize=tokenPerl;
                                        return style;}
                                e=!e&&c=="\\";}
                        return style;};
                return state.tokenize(stream,state);}

        function tokenSOMETHING(stream,state,string){
                state.tokenize=function(stream,state){
                        if(stream.string==string)
                                state.tokenize=tokenPerl;
                        stream.skipToEnd();
                        return "string";};
                return state.tokenize(stream,state);}

        function tokenPerl(stream,state){
                if(stream.eatSpace())
                        return null;
                if(state.chain)
                        return tokenChain(stream,state,state.chain,state.style,state.tail);
                if(stream.match(/^(\-?((\d[\d_]*)?\.\d+(e[+-]?\d+)?|\d+\.\d*)|0x[\da-fA-F_]+|0b[01_]+|\d[\d_]*(e[+-]?\d+)?)/))
                        return 'number';
                if(stream.match(/^<<(?=[_a-zA-Z])/)){                  // NOTE: <<SOMETHING\n...\nSOMETHING\n
                        stream.eatWhile(/\w/);
                        return tokenSOMETHING(stream,state,stream.current().substr(2));}
                if(stream.sol()&&stream.match(/^\=item(?!\w)/)){// NOTE: \n=item...\n=cut\n
                        return tokenSOMETHING(stream,state,'=cut');}
                var ch=stream.next();
                if(ch=='"'||ch=="'"){                           // NOTE: ' or " or <<'SOMETHING'\n...\nSOMETHING\n or <<"SOMETHING"\n...\nSOMETHING\n
                        if(prefix(stream, 3)=="<<"+ch){
                                var p=stream.pos;
                                stream.eatWhile(/\w/);
                                var n=stream.current().substr(1);
                                if(n&&stream.eat(ch))
                                        return tokenSOMETHING(stream,state,n);
                                stream.pos=p;}
                        return tokenChain(stream,state,[ch],"string");}
                if(ch=="q"){
                        var c=look(stream, -2);
                        if(!(c&&/\w/.test(c))){
                                c=look(stream, 0);
                                if(c=="x"){
                                        c=look(stream, 1);
                                        if(c=="("){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,[")"],RXstyle,RXmodifiers);}
                                        if(c=="["){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,["]"],RXstyle,RXmodifiers);}
                                        if(c=="{"){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,["}"],RXstyle,RXmodifiers);}
                                        if(c=="<"){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,[">"],RXstyle,RXmodifiers);}
                                        if(/[\^'"!~\/]/.test(c)){
                                                eatSuffix(stream, 1);
                                                return tokenChain(stream,state,[stream.eat(c)],RXstyle,RXmodifiers);}}
                                else if(c=="q"){
                                        c=look(stream, 1);
                                        if(c=="("){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,[")"],"string");}
                                        if(c=="["){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,["]"],"string");}
                                        if(c=="{"){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,["}"],"string");}
                                        if(c=="<"){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,[">"],"string");}
                                        if(/[\^'"!~\/]/.test(c)){
                                                eatSuffix(stream, 1);
                                                return tokenChain(stream,state,[stream.eat(c)],"string");}}
                                else if(c=="w"){
                                        c=look(stream, 1);
                                        if(c=="("){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,[")"],"bracket");}
                                        if(c=="["){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,["]"],"bracket");}
                                        if(c=="{"){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,["}"],"bracket");}
                                        if(c=="<"){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,[">"],"bracket");}
                                        if(/[\^'"!~\/]/.test(c)){
                                                eatSuffix(stream, 1);
                                                return tokenChain(stream,state,[stream.eat(c)],"bracket");}}
                                else if(c=="r"){
                                        c=look(stream, 1);
                                        if(c=="("){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,[")"],RXstyle,RXmodifiers);}
                                        if(c=="["){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,["]"],RXstyle,RXmodifiers);}
                                        if(c=="{"){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,["}"],RXstyle,RXmodifiers);}
                                        if(c=="<"){
                                                eatSuffix(stream, 2);
                                                return tokenChain(stream,state,[">"],RXstyle,RXmodifiers);}
                                        if(/[\^'"!~\/]/.test(c)){
                                                eatSuffix(stream, 1);
                                                return tokenChain(stream,state,[stream.eat(c)],RXstyle,RXmodifiers);}}
                                else if(/[\^'"!~\/(\[{<]/.test(c)){
                                        if(c=="("){
                                                eatSuffix(stream, 1);
                                                return tokenChain(stream,state,[")"],"string");}
                                        if(c=="["){
                                                eatSuffix(stream, 1);
                                                return tokenChain(stream,state,["]"],"string");}
                                        if(c=="{"){
                                                eatSuffix(stream, 1);
                                                return tokenChain(stream,state,["}"],"string");}
                                        if(c=="<"){
                                                eatSuffix(stream, 1);
                                                return tokenChain(stream,state,[">"],"string");}
                                        if(/[\^'"!~\/]/.test(c)){
                                                return tokenChain(stream,state,[stream.eat(c)],"string");}}}}
                if(ch=="m"){
                        var c=look(stream, -2);
                        if(!(c&&/\w/.test(c))){
                                c=stream.eat(/[(\[{<\^'"!~\/]/);
                                if(c){
                                        if(/[\^'"!~\/]/.test(c)){
                                                return tokenChain(stream,state,[c],RXstyle,RXmodifiers);}
                                        if(c=="("){
                                                return tokenChain(stream,state,[")"],RXstyle,RXmodifiers);}
                                        if(c=="["){
                                                return tokenChain(stream,state,["]"],RXstyle,RXmodifiers);}
                                        if(c=="{"){
                                                return tokenChain(stream,state,["}"],RXstyle,RXmodifiers);}
                                        if(c=="<"){
                                                return tokenChain(stream,state,[">"],RXstyle,RXmodifiers);}}}}
                if(ch=="s"){
                        var c=/[\/>\]})\w]/.test(look(stream, -2));
                        if(!c){
                                c=stream.eat(/[(\[{<\^'"!~\/]/);
                                if(c){
                                        if(c=="[")
                                                return tokenChain(stream,state,["]","]"],RXstyle,RXmodifiers);
                                        if(c=="{")
                                                return tokenChain(stream,state,["}","}"],RXstyle,RXmodifiers);
                                        if(c=="<")
                                                return tokenChain(stream,state,[">",">"],RXstyle,RXmodifiers);
                                        if(c=="(")
                                                return tokenChain(stream,state,[")",")"],RXstyle,RXmodifiers);
                                        return tokenChain(stream,state,[c,c],RXstyle,RXmodifiers);}}}
                if(ch=="y"){
                        var c=/[\/>\]})\w]/.test(look(stream, -2));
                        if(!c){
                                c=stream.eat(/[(\[{<\^'"!~\/]/);
                                if(c){
                                        if(c=="[")
                                                return tokenChain(stream,state,["]","]"],RXstyle,RXmodifiers);
                                        if(c=="{")
                                                return tokenChain(stream,state,["}","}"],RXstyle,RXmodifiers);
                                        if(c=="<")
                                                return tokenChain(stream,state,[">",">"],RXstyle,RXmodifiers);
                                        if(c=="(")
                                                return tokenChain(stream,state,[")",")"],RXstyle,RXmodifiers);
                                        return tokenChain(stream,state,[c,c],RXstyle,RXmodifiers);}}}
                if(ch=="t"){
                        var c=/[\/>\]})\w]/.test(look(stream, -2));
                        if(!c){
                                c=stream.eat("r");if(c){
                                c=stream.eat(/[(\[{<\^'"!~\/]/);
                                if(c){
                                        if(c=="[")
                                                return tokenChain(stream,state,["]","]"],RXstyle,RXmodifiers);
                                        if(c=="{")
                                                return tokenChain(stream,state,["}","}"],RXstyle,RXmodifiers);
                                        if(c=="<")
                                                return tokenChain(stream,state,[">",">"],RXstyle,RXmodifiers);
                                        if(c=="(")
                                                return tokenChain(str