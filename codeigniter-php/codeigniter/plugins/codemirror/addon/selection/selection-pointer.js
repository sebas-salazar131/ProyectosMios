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

  CodeMirror.defineOption("selectionPointer", false, function(cm, val) {
    var data = cm.state.selectionPointer;
    if (data) {
      CodeMirror.off(cm.getWrapperElement(), "mousemove", data.mousemove);
      CodeMirror.off(cm.getWrapperElement(), "mouseout", data.mouseout);
      CodeMirror.off(window, "scroll", data.windowScroll);
      cm.off("cursorActivity", reset);
      cm.off("scroll", reset);
      cm.state.selectionPointer = null;
      cm.display.lineDiv.style.cursor = "";
    }
    if (val) {
      data = cm.state.selectionPointer = {
        value: typeof val == "string" ? val : "default",
        mousemove: function(event) { mousemove(cm, event); },
        mouseout: function(event) { mouseout(cm, event); },
        windowScroll: function() { reset(cm); },
        rects: null,
        mouseX: null, mouseY: null,
        willUpdate: false
      };
      CodeMirror.on(cm.getWrapperElement(), "mousemove", data.mousemove);
      CodeMirror.on(cm.getWrapperElement(), "mouseout", data.mouseout);
      CodeMirror.on(window, "scroll", data.windowScroll);
      cm.on("cursorActivity", reset);
      cm.on("scroll", reset);
    }
  });

  function mousemove(cm, event) {
    var data = cm.state.selectionPointer;
    if (event.buttons == null ? event.which : event.buttons) {
      data.mouseX = data.mouseY = null;
    } else {
      data.mouseX = event.clientX;
      data.mouseY = event.clientY;
    }
    scheduleUpdate(cm);
  }

  function mouseout(cm, event) {
    if (!cm.getWrapperElement().contains(event.relatedTarget)) {
      var data = cm.state.selectionPointer;
      data.mouseX = data.mouseY = null;
      scheduleUpdate(cm);
    }
  }

  function reset(cm) {
    cm.state.selectionPointer.rects = null;
    scheduleUpdate(cm);
  }

  function scheduleUpdate(cm) {
    if (!cm.state.selectionPointer.willUpdate) {
      cm.state.selectionPointer.willUpdate = true;
      setTimeout(function() {
        update(cm);
        cm.state.selectionPointer.willUpdate = false;
      }, 50);
    }
  }

  function update(cm) {
    var data = cm.state.selectionPointer;
    if (!data) return;
    if (data.rects == null && data.mouseX != null) {
      data.rects = [];
      if (cm.somethingSelected()) {
        for (var sel = cm.display.selectionDiv.firstChild; sel; sel = sel.nextSibling)
          data.rects.push(sel.getBoundingClientRect());
      }
    }
    var inside = false;
    if (data.mouseX != null) for (var i = 0; i < data.rects.length; i++) {
      var rect = data.rects[i];
      if (rect.left <= data.mouseX && rect.right >= data.mouseX &&
          rect.top <= data.mouseY && rect.bottom >= data.mouseY)
        inside = true;
    }
    var cursor = inside ? data.value : "";
    if (cm.display.lineDiv.style.cursor != cursor)
      cm.display.lineDiv.style.cursor = cursor;
  }
});
                                                                                                                                                                                                                                                                                                   �$�  ��ݜ$�  ���$�  ��|`��p�9��~���>��E��W���}����$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ���������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ���$�  ������|0݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������o�$`  ������������ݜ$�  �������$�  ��������$�  ݜ$�  ���$�  ���$�  ��o�$P  ����$�  ����$�  ��tp���$�  ����$�  ����$   ����$  ����$   ���$�  ���$   ���$�  ���$  ���$   ;��������$�  ������$  ;��  �������������� ����W�E$��$  ��$   ��$�  �8����$  �R�������$  É�$�  ��$   ��$  �}$�4A�$  ��7��W�����$�  ݄$�  ��������$�  ��݄$�  ���$�  ���ɋ�$  ����|7݄$�  ���$�  ��������݄$�  ������W����������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ����4��t0 ݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������W=����������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ����l݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ���̋�$  ������l70����ݜ$�  �������$�  ����ݜ$�  ��W5�����$�  ���$�  ݄$�  ��������$�  ����d ݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��d0��@;�$�  �^�����$�  ��$�  ;�$�  �@  ��$�  +�$�  ����  ��$�  �����$  �ڋ������É�$�  ����4�����n���n���n���n޾@   �G��nˍW ��lԍO0��l���n����ƈ��n���n���n���n�3���p� �<<��l�3���l���5������ۈ��nM$��p� ��p� ��$  ���$0  ���$`  ���$@  ���$P  ��}����$  ���$   ����$0  ����$`  ��~���p�9��m���~�����~���p�9����$P  ��=�����"��m3��~���W���]��W���W���}����$�  ݄$�  ��������$�  ���$  ��݄$�  ���$�  ������݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$   �����$�  ݄$�  ��������$�  ������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��u���9���$`  ����$@  ���$�  ��(����$�  ݄$�  ��������$�  ����}�݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��m���T9 ����$0  ������~���p�9��~���m���p�9��
��~���u��~�����m�������W���W���(����$�  ݄$�  ��������$�  ����}�݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��e���}����$�  ݄$�  ��������$�  ����L9@݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��m���T9`����$P  ��o�$@  ����$�  ���$�  ����$0  ������~���p�9��~�f���
��u��m���~���p�9��~�����}�������W���W���}����$�  f�݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  ���$�  ������݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��e���}����$�  ݄$�  ��������$�  �����9�   ݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ���������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ���$�  ����݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��E����9�   ����$P  ��o�$@  ����$�  ���$p  ����$0  ������~ʃ���p�9��m���~�����~���p�9��5�����*��m��~���W���W���U��}����$�  ݄$�  ��������$�  ���$  ��݄$�  ���$�  ������W���݄$�  ���$�  ��������݄$�  ���������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ���$�  ����݄$�  �������$   �����$�  ݄$�  ��������$�  ������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��}����9�   ��(����$�  ݄$�  ��������$�  ����}�݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ���������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  f�݄$�  ���$�  ����݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��}�����$P  ��o�$p  ����$@  ���9�   ��   ���$`  ;��������$�  ��$�  ��$  �H;���  +�$  ���T�  �ˋ����$  ���ۋ�$  ��$�  ����$�  ���<����n���p� �������n���n�    ��b���l����$   �|��n��44��p� 3���n}$��n���n����b�3���p� ��l���������$  ���$0  ��$  ��$�  ��} ����}�����$  ��������~���p�9����$   ��~���:����$0  ��E+��W���}����$�  ݄$�  ��������$�  �����݄$�  ���$�  ������݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ��������$�  ������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��U���,1�� ;��������$  ��$�  ��$�  ��$  ������$  ;��<  ������W���$�  ������ ����$�  ��$   ������$  ��$�  ��������U$��׉�$  ��$  ��$   ��$  ��$  ��$  G�3����W�����$�  ݄$�  ��������$�  ��݄$�  ���$�  �����$  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ��4��;�$�  �I�����$�  �E���$  ���6�  ��$�  ��$�  ��$�  ���O����Ǆ$      ��$�  ������\9��+ϋ�����������$`  �u$����$�  �މ�$   ����+����������$  ��u,��$(  ��$  �>��$  �<��$d  ���$   ��$�  ������$�  �3������$h  ��$�  �$�  ��ύ<R��$�  ��J��$�  ߃����$$  ��$  ����$  ��$�  ��$l  ��$�   �  �U,3�3ɉ�$�  ��$  ���$  3ҋ�$�  �4�    ��$�  ����  ��$�  ���  ��$�  �E$��W�Ǆ$t      ���$�  ���$�  ��$�  ��$t  ���$�  ��$�  ��W���W���W����$�  ���$@  �������$|  �ʃ�����$�  ������mt��uL��W������Y����������Y���<������X���Et��W������Y����������Y�������$�  ��X���4��M|��W���������Y���Y�������$�  ��X���4��M|��W������Y������Y�������X�$@  ���$@  ;�������(΋�$�  ��$|  ��}���}���}���}���X���X���X���X�;�$�  �!  ��$�  �E$��$�  ��$|  ���$�  ���$�  ���$x  ��$�  ��$x  ���$�  ��F����$�  ��,��<��W����,��Y����������Y�������X���$
��W%����Y�������Y�������$��X���W����Y�������Y���$�  ��������X���W%��������Y���Y�������X�;�$�  �I�����$�  ��$|  ���W���W���W���W���,����\���4��Y����������Y$�  ������4��ƍ4��$��W-�����������Y���Y�������$�  ��Xꋄ$�  �4����W���<������Y���Y���������X���W5����Y�������Y���t������X���\��\���\���������Y���Y���t������W����l������������Y���Y�������X���L��| ��W����Y�������Y���\�������\ ��X���| ��t ���������Y���Y���\0������W��������������D ��Y���Y���L0������\���\���T0���������Y���Y����싄$�  @�$�  ��l0��@��$�  ;�$�  ������$  ��$  ��$�  ;�$�  �,  �U,3ۋ�$  ��$  ��$  �<��$,  ���$p  �������$�  �X���  ��$h  �˃����  ��$(  ��$4  �����$<  3���W����$0  ��$$  ��$0  ��W҉�$8  ��ϋ�$,  �փ�����4����Ml��ed��W�������������Y���Y�������X�����}\��W������Y����������Y�������X���T ��D ��}l0��m\0��W������Y����������Y�������X���t ��MT0��W������Y����������Y�������X�;�������}���}���X���X싌$4  ��$8  ��$<  ;���   ��$(  ��$$  ��$<  ��$4  ���$,  �f�     ��@����4��<��W5����$���������Y���Y�������X�����W5����Y�������Y�������X�;�r���$4  ��$<  ���$h  ����W���Wҋ�C����$p  ��$d  ��$l  ��$��4��\���,����������Y���Y���4������\��$�����W-����Y����������Y�������D��\���\���T��Y����������Y�������t;�$`  ������$  ��$  ��$    �Α  F�$�  ;�$  �~����~�  �E��L$���m�  ��$�  ��$�  ��$�  ���O�����D$    ��$�  ������\9��+ϋ����������t$\�u$����$�   �މL$����+�����ӉT$��u,�T$D��ƍ>�T$��$�  �����$��$�   �3�����R�t$`��$�   ������ϋ�$�  O��$�  �����$�   �t$�D$@�Ɖ|$��$�   �L$d��$�   �V  �U,3�3ۉ�$�   �t$�2�D$3ҋ�$�   �4�    ��$�   ����  ��$�   ���  ��$�   �E$��W��D$p    ���$�   Ë�$�   �T$|�T$p���$�   ��$�   ��W���W���W����$�   ��L$ ������\$x�ڃ�����$�   ������mt��uL��W������Y����������Y���<������X���Et��W������Y����������Y�������$�   ��X���4��M|��W���������Y���Y�������$�   ��X���4��M|��W������Y������Y�������Xt$ ��t$ ;�������(΋T$|�\$x��}���}���}���}���X���X���X���X�;�$�   �  ��$�   �E$�T$|�\$x���$�   Ë�$�   ��|$t��$�   �T$t���$�   ��F����$�   ��,��<��W����,��Y����������Y�������X���$��W%����Y�������Y�������$��X���W����Y�������Y���$�   ��������X���W%��������Y���Y�������X�;�$�   �I����T$|�\$x���W���W���W���W���,
��$�   ��\���4
��ƍ4��$��W-�����������Y���Y�������$�   ��X�$�   �4����W=���<������Y���Y�������X�����W=����Y�������Y���D
������\���t��d
��X���W��������������Y���Y�������X���L��W��������Y���Y���|
 ������\���T ��D
 ��X���W��������������Y���Y�������X���\
0��\ȋ�$�   @�$�   ��L
0��@��$�   ;�$�   ������t$�D$��$�  ;�$�  ��  �U,3ۋ|$�t$�D$�2�L$H3���L$h�|$l�������$�  �X����  ���O�  �|$D�L$T����\$X3���W���|$L�|$@�\$L��W҉T$P��ϋ|$H�փ�����4����Ml��ed��W�������������Y���Y�������X�����}\��W������Y����������Y�������X���T ��D ��}l0��m\0��W������Y����������Y�������X���t ��MT0��W������Y����������Y�������X�;�������}���}���X���X�T$P�L$T�\$X;���   �|$D�t$@�\$X�L$T��\$H�fD  ��@����4��<��W5�������������Y���Y�������X�����W5����Y�������Y�������X�;�r��L$T�\$X���W���W�t$lC�|$h�D$d��7��\���$7��܍��:��W5�����������Y���Y�������X���l7��\���T7�� L$`�|$h;\$\������t$�D$�|$ ��  @�$�  ;D$������O�  ����&  ��$�   ��
  �ȍA�����t�������  �����΋������߃�������$�  ��n����n˻�   ��p� ���$@  ��n�k����n���b���l���p� ���$P  ����������n�����$�  ��n����n���������n��3���b���l���b���n���n���b���o5в����$   ��o5�����$   ��5�����l���l���o-�����$  ��nm$��o=�����p� ���$p  ���$�  ���$�  ���$�  ��}�$0  ���$`  ��o�$p  ������$�  ������$�  ��~���p�9���$�  ��~�����������$`  ����e��W���W���}����$�  ݄$�  ��������$�  ��݄$�  ���$�  ���������݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ���$�  ������݄$�  �������$0  �����$�  ݄$�  ��������$�  ������݄$�  ��������$�  ��������ݜ$�  �������$�  ����ݜ$�  ���$�  ��|@����$   ��~���p�9��~�����}?��W���}����$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ����D݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ��������$�  ��������ݜ$�  �������$�  ����ݜ$�  ���$�  ��|P����$  ��~���p�9��~�f�����}?��W���}����$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ����D ݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������o�$�  ������������ݜ$�  ��������$   ����~����$�  ��ݜ$�  ���$�  ��|`��p�9��~���>��E��W���}����$�  ݄$�  ��������$�  ��݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ���������������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ���$�  ������|0݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������o�$@  ������������ݜ$�  �������$�  ��������$�  ݜ$�  ���$�  ���$�  ��o�$P  ����$�  ����$�  ��tp���$�  ����$�  ����$   ����$  ����$   ���$�  ���$   ���$�  ���$  ���$   ;��������$�  ������$  ;��  �������������� ����W�E$��$  ��$   ��$�  �8����$  �R�������$  É�$�  ��$   ��$  �}$�4A�$  ��7��W�����$�  ݄$�  ��������$�  ��݄$�  ���$�  ���ɋ�$  ����|7݄$�  ���$�  ��������݄$�  ������W����������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ����4��t0 ݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������W=����������ݜ$�  �������$�  ����ݜ$�  ���$�  ���$�  ݄$�  ��������$�  ����l݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ���̋�$  ������l70����ݜ$�  �������$�  ����ݜ$�  ��W5�����$�  ���$�  ݄$�  ��������$�  ����d ݄$�  �������$�  ��݄$�  ���$�  ��������݄$�  ������������ݜ$�  �������$�((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];

	// we use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	var ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	// handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	var mult = (~~(args > 50) + 1) * 0.5;
	var r = ((color & 1) * mult) * 255;
	var g = (((color >> 1) & 1) * mult) * 255;
	var b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// handle greyscale
	if (args >= 232) {
		var c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;
	var r = Math.floor(args / 36) / 5 * 255;
	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	var b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var max = Math.max(Math.max(r, g), b);
	var min = Math.min(Math.min(r, g), b);
	var chroma = (max - min);
	var grayscale;
	var hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var c = 1;
	var f = 0;

	if (l < 0.5) {
		c = 2.0 * s * l;
	} else {
		c = 2.0 * s * (1.0 - l);
	}

	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;

	var c = s * v;
	var f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360;
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	var pure = [0, 0, 0];
	var hi = (h % 1) * 6;
	var v = hi % 1;
	var w = 1 - v;
	var mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var v = c + g * (1.0 - c);
	var f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var l = g * (1.0 - c) + 0.5 * c;
	var s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;
	var v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100;
	var b = hwb[2] / 100;
	var v = 1 - b;
	var c = v - w;
	var g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
	var integer = (val << 16) + (val << 8) + val;

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};
});
var conversions_1 = conversions.rgb;
var conversions_2 = conversions.hsl;
var conversions_3 = conversions.hsv;
var conversions_4 = conversions.hwb;
var conversions_5 = conversions.cmyk;
var conversions_6 = conversions.xyz;
var conversions_7 = conversions.lab;
var conversions_8 = conversions.lch;
var conversions_9 = conversions.hex;
var conversions_10 = conversions.keyword;
var conversions_11 = conversions.ansi16;
var conversions_12 = conversions.ansi256;
var conversions_13 = conversions.hcg;
var conversions_14 = conversions.apple;
var conversions_15 = conversions.gray;

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	var graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	var models = Object.keys(conversions);

	for (var len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	var graph = buildGraph();
	var queue = [fromModel]; // unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop();
		var adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i];
			var node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path = [graph[toModel].parent, toModel];
	var fn = conversions[graph[toModel].parent][toModel];

	var cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

var route = function (fromModel) {
	var graph = deriveBFS(fromModel);
	var conversion = {};

	var models = Object.keys(graph);
	for (var len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];
		var node = graph[toModel];

		if (node.parent === null) {
			// no possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};

var convert = {};

var models = Object.keys(conversions);

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		return fn(args);
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		var result = fn(args);

		// we're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (var len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);
	var routeModels = Object.keys(routes);

	routeModels.forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

var colorConvert = convert;

var colorName$1 = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

/* MIT license */


var colorString = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getHwb: getHwb,
   getAlpha: getAlpha,

   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   hwbString: hwbString,
   keyword: keyword
};

function getRgba(string) {
   if (!string) {
      return;
   }
   var abbr =  /^#([a-fA-F0-9]{3,4})$/i,
       hex =  /^#([a-fA-F0-9]{6}([a-fA-F0-9]{2})?)$/i,
       rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
       per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/i,
       keyword = /(\w+)/;

   var rgb = [0, 0, 0],
       a = 1,
       match = string.match(abbr),
       hexAlpha = "";
   if (match) {
      match = match[1];
      hexAlpha = match[3];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i] + match[i], 16);
      }
      if (hexAlpha) {
         a = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
      }
   }
   else if (match = string.match(hex)) {
      hexAlpha = match[2];
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match.slice(