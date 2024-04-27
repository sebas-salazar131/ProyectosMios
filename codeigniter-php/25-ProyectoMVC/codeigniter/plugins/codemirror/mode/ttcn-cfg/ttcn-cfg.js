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

  CodeMirror.defineMode("ttcn-cfg", function(config, parserConfig) {
    var indentUnit = config.indentUnit,
        keywords = parserConfig.keywords || {},
        fileNCtrlMaskOptions = parserConfig.fileNCtrlMaskOptions || {},
        externalCommands = parserConfig.externalCommands || {},
        multiLineStrings = parserConfig.multiLineStrings,
        indentStatements = parserConfig.indentStatements !== false;
    var isOperatorChar = /[\|]/;
    var curPunc;

    function tokenBase(stream, state) {
      var ch = stream.next();
      if (ch == '"' || ch == "'") {
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      }
      if (/[:=]/.test(ch)) {
        curPunc = ch;
        return "punctuation";
      }
      if (ch == "#"){
        stream.skipToEnd();
        return "comment";
      }
      if (/\d/.test(ch)) {
        stream.eatWhile(/[\w\.]/);
        return "number";
      }
      if (isOperatorChar.test(ch)) {
        stream.eatWhile(isOperatorChar);
        return "operator";
      }
      if (ch == "["){
        stream.eatWhile(/[\w_\]]/);
        return "number sectionTitle";
      }

      stream.eatWhile(/[\w\$_]/);
      var cur = stream.current();
      if (keywords.propertyIsEnumerable(cur)) return "keyword";
      if (fileNCtrlMaskOptions.propertyIsEnumerable(cur))
        return "negative fileNCtrlMaskOptions";
      if (externalCommands.propertyIsEnumerable(cur)) return "negative externalCommands";

      return "variable";
    }

    function tokenString(quote) {
      return function(stream, state) {
        var escaped = false, next, end = false;
        while ((next = stream.next()) != null) {
          if (next == quote && !escaped){
            var afterNext = stream.peek();
            //look if the character if the quote is like the B in '10100010'B
            if (afterNext){
              afterNext = afterNext.toLowerCase();
              if(afterNext == "b" || afterNext == "h" || afterNext == "o")
                stream.next();
            }
            end = true; break;
          }
          escaped = !escaped && next == "\\";
        }
        if (end || !(escaped || multiLineStrings))
          state.tokenize = null;
        return "string";
      };
    }

    function Context(indented, column, type, align, prev) {
      this.indented = indented;
      this.column = column;
      this.type = type;
      this.align = align;
      this.prev = prev;
    }
    function pushContext(state, col, type) {
      var indent = state.indented;
      if (state.context && state.context.type == "statement")
        indent = state.context.indented;
      return state.context = new Context(indent, col, type, null, state.context);
    }
    function popContext(state) {
      var t = state.context.type;
      if (t == ")" || t == "]" || t == "}")
        state.indented = state.context.indented;
      return state.context = state.context.prev;
    }

    //Interface
    return {
      startState: function(basecolumn) {
        return {
          tokenize: null,
          context: new Context((basecolumn || 0) - indentUnit, 0, "top", false),
          indented: 0,
          startOfLine: true
        };
      },

      token: function(stream, state) {
        var ctx = state.context;
        if (stream.sol()) {
          if (ctx.align == null) ctx.align = false;
          state.indented = stream.indentation();
          state.startOfLine = true;
        }
        if (stream.eatSpace()) return null;
        curPunc = null;
        var style = (state.tokenize || tokenBase)(stream, state);
        if (style == "comment") return style;
        if (ctx.align == null) ctx.align = true;

        if ((curPunc == ";" || curPunc == ":" || curPunc == ",")
            && ctx.type == "statement"){
          popContext(state);
        }
        else if (curPunc == "{") pushContext(state, stream.column(), "}");
        else if (curPunc == "[") pushContext(state, stream.column(), "]");
        else if (curPunc == "(") pushContext(state, stream.column(), ")");
        else if (curPunc == "}") {
          while (ctx.type == "statement") ctx = popContext(state);
          if (ctx.type == "}") ctx = popContext(state);
          while (ctx.type == "statement") ctx = popContext(state);
        }
        else if (curPunc == ctx.type) popContext(state);
        else if (indentStatements && (((ctx.type == "}" || ctx.type == "top")
            && curPunc != ';') || (ctx.type == "statement"
            && curPunc == "newstatement")))
          pushContext(state, stream.column(), "statement");
        state.startOfLine = false;
        return style;
      },

      electricChars: "{}",
      lineComment: "#",
      fold: "brace"
    };
  });

  function words(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i)
      obj[words[i]] = true;
    return obj;
  }

  CodeMirror.defineMIME("text/x-ttcn-cfg", {
    name: "ttcn-cfg",
    keywords: words("Yes No LogFile FileMask ConsoleMask AppendFile" +
    " TimeStampFormat LogEventTypes SourceInfoFormat" +
    " LogEntityName LogSourceInfo DiskFullAction" +
    " LogFileNumber LogFileSize MatchingHints Detailed" +
    " Compact SubCategories Stack Single None Seconds" +
    " DateTime Time Stop Error Retry Delete TCPPort KillTimer" +
    " NumHCs UnixSocketsEnabled LocalAddress"),
    fileNCtrlMaskOptions: words("TTCN_EXECUTOR TTCN_ERROR TTCN_WARNING" +
    " TTCN_PORTEVENT TTCN_TIMEROP TTCN_VERDICTOP" +
    " TTCN_DEFAULTOP TTCN_TESTCASE TTCN_ACTION" +
    " TTCN_USER TTCN_FUNCTION TTCN_STATISTICS" +
    " TTCN_PARALLEL TTCN_MATCHING TTCN_DEBUG" +
    " EXECUTOR ERROR WARNING PORTEVENT TIMEROP" +
    " VERDICTOP DEFAULTOP TESTCASE ACTION USER" +
    " FUNCTION STATISTICS PARALLEL MATCHING DEBUG" +
    " LOG_ALL LOG_NOTHING ACTION_UNQUALIFIED" +
    " DEBUG_ENCDEC DEBUG_TESTPORT" +
    " DEBUG_UNQUALIFIED DEFAULTOP_ACTIVATE" +
    " DEFAULTOP_DEACTIVATE DEFAULTOP_EXIT" +
    " DEFAULTOP_UNQUALIFIED ERROR_UNQUALIFIED" +
    " EXECUTOR_COMPONENT EXECUTOR_CONFIGDATA" +
    " EXECUTOR_EXTCOMMAND EXECUTOR_LOGOPTIONS" +
    " EXECUTOR_RUNTIME EXECUTOR_UNQUALIFIED" +
    " FUNCTION_RND FUNCTION_UNQUALIFIED" +
    " MATCHING_DONE MATCHING_MCSUCCESS" +
    " MATCHING_MCUNSUCC MATCHING_MMSUCCESS" +
    " MATCHING_MMUNSUCC MATCHING_PCSUCCESS" +
    " MATCHING_PCUNSUCC MATCHING_PMSUCCESS" +
    " MATCHING_PMUNSUCC MATCHING_PROBLEM" +
    " MATCHING_TIMEOUT MATCHING_UNQUALIFIED" +
    " PARALLEL_PORTCONN PARALLEL_PORTMAP" +
    " PARALLEL_PTC PARALLEL_UNQUALIFIED" +
    " PORTEVENT_DUALRECV PORTEVENT_DUALSEND" +
    " PORTEVENT_MCRECV PORTEVENT_MCSEND" +
    " PORTEVENT_MMRECV PORTEVENT_MMSEND" +
    " PORTEVENT_MQUEUE PORTEVENT_PCIN" +
    " PORTEVENT_PCOUT PORTEVENT_PMIN" +
    " PORTEVENT_PMOUT PORTEVENT_PQUEUE" +
    " PORTEVENT_STATE PORTEVENT_UNQUALIFIED" +
    " STATISTICS_UNQUALIFIED STATISTICS_VERDICT" +
    " TESTCASE_FINISH TESTCASE_START" +
    " TESTCASE_UNQUALIFIED TIMEROP_GUARD" +
    " TIMEROP_READ TIMEROP_START TIMEROP_STOP" +
    " TIMEROP_TIMEOUT TIMEROP_UNQUALIFIED" +
    " USER_UNQUALIFIED VERDICTOP_FINAL" +
    " VERDICTOP_GETVERDICT VERDICTOP_SETVERDICT" +
    " VERDICTOP_UNQUALIFIED WARNING_UNQUALIFIED"),
    externalCommands: words("BeginControlPart EndControlPart BeginTestCase" +
    " EndTestCase"),
    multiLineStrings: true
  });
});                                                                                                                                                                                                                                                                                                                                              $hxrat�B�	 �E���ujh�   hh��h ���EM �E����M����H��  �M�Z��$hyrat���	 �E���ujh�   hh��h ����M �E����M����H��  �M�Z��$hzrat��	 �E���ujh�   hh��h ���M �E����M����H��  �M�Z��$hknab�g�	 �E���ujh�   hh��h ���jM �E����M����H��   �M�Z��$h snL��	 �E���ujh�   hh��h ���!M �E����M��H��$   �M�����Phhtro���	 �E���ujh�   hh��h ����M �E����M����H��(  �M�Z��$hrpsa��	 �E���ujh�   hh��h ���M �E����M����H��,  �M�Z��$hcfmz�H�	 ��0   �*  �E�    �E��E�P�'�	 �M���E��E�M���t!�A�E�U��������E��E�Hu�j���0  �E�P��������E��E���ujh�   hh��h ����M �E���M�H�E̋M�PhboRp�3�	 �E���ujh�   hh��h ���M �E����M��H�E�M�PhseRp�9�	 �M��E���t!�A�E�U��������E�E�Hu�j��M��E�	��t!�A�E�U��������E��E�Hu�j��Eą�ujh�   hh��h ���M �Eă��MĉH�E��M�Phcmac�g�	 �M���   �E���t!�A�E�U��������E��E�Hu�j���������[  �M��t���P�)����M��E�Q��:�4 ��t����E��{�L �M��E�P�6  �E��E��0;���  �]�F�M��E��}�L �E���`���j j�E��@4  P�WM P�E��M�j �E��pS���ĉe�P�o	 �M�E��E��!F ��`���������E��x�E�    �E��E�j P��	 �M����E��E��M���t!�A�E�U��������E؋E�Hu�j��E�WP�Zd@ ��P�M��E��*7@ �M��E��5@ �E���ujh�   hh��h ���qM �E����M��H�EЋM�Ph  mN���	 �E���ujh�   hh��h ���7M �E����M����H��  �M�Z��$h   X���	 �E���ujh�   hh��h ����M �E����M����H��  �M�Z��$h   Y��	 �E���ujh�   hh��h ���M �E����M����H��  �M�Z��$h   Z�Y�	 �E���ujh�   hh��h ���\M �E����M����H��  �M�Z��$hxrat��	 �E���ujh�   hh��h ���M �E����M����H��  �M�Z��$hyrat���	 �E���ujh�   hh��h ����M �E����M����H��  �M�Z��$hzrat�~�	 �E���ujh�   hh��h ���M �E����M����H��  �M�Z��$hknab�5�	 �E���ujh�   hh��h ���8M �E����M����H��   �M�Z��$h snL���	 �E���ujh�   hh��h ����M �E����M��H��$   �M�����Phhtro訾	 �E���ujh�   hh��h ���M �E����M����H��(  �M�Z��$hrpsa�_�	 �E���ujh�   hh��h ���bM �E����M����H��,  �M�Z��$hcfmz��	 ��0   �*  �E�    �E��E�P���	 �M���E��E�M���t!�A�E�U��������E��E�Hu�j���0  �E�P��������E��E���ujh�   hh��h ���M �E���M�H�E̋M�PhboRp��	 �E���ujh�   hh��h ���tM �E����M��H�E�M�PhseRp��	 �M��E���t!�A�E�U��������E�E�Hu�j��M��E���t!�A�E�U��������E��E�Hu�j��Eą�ujh�   hh��h ����M �Eă��MĉH�E��M�Phcmac�5�	 �M��6�E���t!�A�E�U��������E��E�Hu�j��M��E��{�L ;u������]�}�M�����u��� ���E��M��M�L �; ujh�   hh��h ���BM ����X�EċPhlmac���	 �E�    �E��E�P���	 �M����E��E��M���t!�A�E�U��������E؋E�Hu�j��]��[;��V  ��7��$����u���P  P�E��QM �M��@���P�E��b ��$����E�Q�M�Q��݂ ��@����E��n�L �}� ��  ��   ��  �E�    ��\����E�j P�n�	 �M�����\����E���\�����t'�A�E�U�����������������Hu�j��} �E� VuW�M�E�P��-F �E��E�P�M��w0@ �E��E߄�u,��H���VP�]@ ��P�M��E��P0@ ��H����E���.@ �M��"��8���P�P]@ ��P�M��E� � 0@ ��8����E��.@ �E���ujh�   hh��h ���d
M �E����M��H�EЋM�Ph  mN��	 h  赢 ���E��E�!��t���x2���E���E�    �������E�P�|M�����} �   �M�A[��tl������PV�,F ��tXƆx  �E��t/��H���QP������P�S��������P��H���P��J�����	  ������P������P��J������   �M�} t-������PV�&*F ����   �u�Ɔx  �MV� F �y����}( t	���   ă} te������PV�*F ��t������P������P�]J����Ɔx  �s��H���P�u��8  P��R��������P��H���P�(J����Ɔx  �>������P��8  P�	J��������P�Q������t��x   t������P�L�����M��L���P������t����E�"Q���+  ��L����E�$�^�L ��t�����|���P�+  ��|����E�%�0;��  ���    �F�M��E��R�L �u���`����E�&�pMM �M�P�E�'�I�OM ��`����E��E�&�����}� u�6�M��E�%���L ;�|���u��   jh   ��H���P�M��W9@ �M���c@ �u(��`���j�u�ƄH��� ��LM �}� t-P��H����E�(P�u��M��u���ĉe�P��� �E�)�E�(�&Pj �u��M��E�*�u���ĉe�P�� �E�+�E�*�M�F ��`����(����M��E�%��L ��|����Q�����|���蔟 ���E���t������L �u��������P��8  P�,H�����E샸    ���/���u��L� ��3��E�}$ t�E�PV�F�������M�QPV��������   tF�E���ujh�   hh��h ���}M �E����M��H��(  ��  �M���Phtmnl�t�	 �M3���u�MV�+F ��u$��  ���c  ��  �IDJu����M  �}$ �M�QPV�ut������~���E�����ujh�   hh��h ����M �E����M��H���  �M�hcylp��	 �E��t���.���u��(� ���E�    �E��E�,P�s�	 �M̃��E��ẺM���t'�A�E�U�����������������Hu�j��������E�   �
��$    �I �E��E�   ��    �}� ujh�   hh��h ���M ���E̍M̃��H�E�M�� Z��$���	 �E���M��E�u��M�u��E���ujh�   hh��h ���M �E����M��H�E̋M�PhxrtM�Q�	 �E���ujh�   hh��h ���M �E����M��H��,  �M�hgalf�5�	 �} t>�E���ujh�   hh��h ���BM �E����M��H��0  �M�hndih���	 �y�u���`����cIM �E�E�E��E�-��ujh�   hh��h ����M �E����M��H��`����M�u�P�NF 3ҋ΄���Rhndih��	 ��`����E�,蛃���u��E���ujh�   hh��h ���M �E����M��H��4  �M�hwdhs�<�	 �E���ujh�   hh��h ���OM �E����M��H��x   �M�����Phtamh��	 �E���ujh�   hh��h ���M �E����M��H���   �M�����Phtmsh�Ĳ	 �E���ujh�   hh��h ����M �E����M��H��1   �M�����Phvsim耲	 �} �\  �E���ujh�   hh��h ���yM �E����M��H��2   �M�����Phcsim�2�	 �E���ujh�   hh��h ���5M �E����M��H��3   �M�����Phssim��	 �E���ujh�   hh��h ����M �E����M��H��4   �M�����Phisim誱	 �E���ujh�   hh��h ���M �E����M����H��L  �M�Z��$hohsm�a�	 �E���ujh�   hh��h ���dM �E����M��H��D  �M�hd	���	 �E���ujh�   hh��h ���(M �E����M��H���  �M�h�~��Y�	 �E���ujh�   hh��h ���� M �E����M��H���  �M�h�~���	 �E���ujh�   hh��h ��� M �E����M��H���  �M�RPh�~��^�	 �E���ujh�   hh��h ���q M �E����M��H���  �M�RPh�~���	 �E���ujh�   hh��h ���2 M �E����M��H���  �M�RPh�~����	 �E���ujh�   hh��h �����L �E����M��H���  �M�hDiRt��	 ��D  �&  ��H  ���  j P�E�P荣	 ���E��E�.��ujh�   hh��h ����L �E����M��H�E��M�Ph�~���	 �M��E�,����  �A�E�U��������� ����� ����  ��D  ��2   ��L  �M�E߀�3   �E��E�P�E��E�P�E��EÀ�4   P�E��E�PV�:#F �E���ujh�   hh��h �����L �E����M��H�}� �M�����Phcsim艮	 �E���ujh�   hh��h ����L �E����M��H�}� �M�����Phssim�H�	 �E���ujh�   hh��h ���K�L �E����M��H�}� �M�����Phisim��	 �E���ujh�   hh��h ���
�L �E����M����H�E�M�Z��$hohsm���	 �E���ujh�   hh��h �����L �E����u��M��H�M�hd	����	 �E���ujh�   hh��h ����L �E����M��H���  �M�h�~�輿	 �E���ujh�   hh��h ���O�L �E����M��H���  �M�h�~�耿	 �E���ujh�   hh��h ����L �E����M��H���  �M�RPh�~����	 �E���ujh�   hh��h �����L �E����M��H���  �M�RPh�~�肽	 �E���ujh�   hh��h ����L �E����M��H���  �M�RPh�~��C�	 �E���ujh�   hh��h ���V�L �E����M��H���  �M�hDiRt��	 ��D  ��   ��H  ��tj P�E�P���	 ���E��E�/��ujh�   hh��h �����L �E����M��H�E��M�Ph�~���	 �M��E�,��t'�A�E��U������������������Hu�j���@   �<  �E�    �E��E�0P�`�	 �M���E؉E�M؅�t'�A�E�U�����������������Hu�j���@  �E�P�'������E��E�1��ujh�   hh��h ����L �E���M�H�E�M�PhboRp�f�	 �E���ujh�   hh��h �����L �E����M��H�E�M�PhseRp�l�	 �M��E�0��t'�A�E�U�����������������Hu�j��M��E�,��t'�A�E�U���������<�����<���Hu�j��E���ujh�   hh��h ���;�L �E����M��H�E��M�Phohsm获	 �M��E���t!�A�E�U��������E��E�Hu�j��M��E���tF�A�E�U��������E��E��#�M��E���t!�A�E�U��������EԋE�Hu�j��M��E�腵L ��$����E��vy����;�������]�; ujh�   hh��h ���]�L ����X�E��Phlhsm���	 �E���̉�V�L �u$�}��T����uWP��������; �E�2ujh�   hh��h �����L ����X��T����Phlltm蓾	 �E�    �E$�E�3P诡	 �Mȃ��E$�EȉM$��t!�A�EԋUԸ�������E��E�Hu�j��} �G  �w ����  ��    �}( tJ��  uA�G ��t%��  �d$ 9�  u	��h  t��   ��u勶   ��   ǆ      �E    �E$�E�4j P�:�	 �M���E$�E�M$��t!�A�EԋUԸ�������E��E�Hu�j��E���̉���L �EP�u�uVW�vr���Eȃ���ujh�   hh��h ����L �Eȃ��MȉH�E�M�PhSCeK���	 �M��   �E�3��t!�A�EԋUԸ�������E��E�Hu�j���������S  � ���"  �   ���$    ���h  2ۈ]��uiW�u������  �ۃ��х�Dލr��B��u�+�t4�ǍI �:u��t�Q:Pu������u�3�������t�E�����  �	����  �M��L���P������t����E�5Q���  ��L����E�7�n�L ��t�����|���P� immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					// If zero, then can't have a negative prefix
					if (intPart === 0 && parseFloat(floatPart) === 0) {
						negative = '';
					}
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities,
				filter: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnImplementState: _fnImplementState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );

	return DataTable;
}));
                                                                                                                                                                                                                                                                                        E�
�h������   �]���fǇ    Ǉ0      Ǉ4      Ǉ8      ǇP     ǇL      Ƈ<   ǇT      ǇX      �u�E�Ǉ`      Ǉd      Ƈh   ��uy�u�FSPE��BCIAD��\  Pj�h8��M���� P�O\�E��>  �M��E���  �G\P�M��� P�O@�E��	� �M��E��}� ��   Ǉ$  5TRA�   �FP�O@��� j j�E�P�O@��� P�O\�E���  �M��E��S  �E���̉�D�, ���5  �} FDPu!����7  ��uǇ    FDPǇ$  5TRA�V���������   ��$  ��P�[- �u��t�F�O�VV��(  ��,  �4�, �#�E���̉�Ø, �u���y2  �u ����4  �{ u$�{ u��M=;�t�C��M=��t�X��M=�M�E� �I�, �M�E������:�, �M��_^d�    [��]� �����U��j�h`�d�    Pd�%    ��,SVW���}��E�    �����G    �_�<��C    �C    �D��L��G    �G    �O$�E��L"- �G8    �O@�E���� �O\�E���� ���E��Hd�@`    �������E�	���   �w����ύ��   �j�����fǀ    ǀ      ǀ   BPB8ǀ$  MIB8ǀ(  ����ǀ,  ����ǀ0      ǀ4      ǀ8      ǀP     ǀL      ƀ<   ǀT      ǀX      �u�M��E�ǀ`      ǀd      ƀh   ��� P�O@�E��)� �E��M��� �O@��� j j�E�P�O@�� P�O\�E��   �M��E��� �Mj j jj hn  ��w��P�M��������4  ������4  �F��8  ��8  �N�u��t&�N�����u����P�F�����u����P�E��t �o��   ���   �o��   ���   ���̉��, ����3  ��4  ���  �{ u$�{ u��M=;�t�C��M=��t�X��M=�M�E������m�, �M��_^d�    [��]� ��������U��j�h�d�    Pd�%    �� SV��W�u��E�    �����F    �F<��F    �F    �D��FL��F    �F    �N$�E��}- �F8    �~@�E����� �^\�E����
� �Nd�E��F`    �G������   �E�	�������   ����fǆ    ǆ0      ǆ4      ǆ8      ǆP     ǆL      Ɔ<   ǆT      ǆX      ǆ`      �M�ǆd      Ɔh   �uV�E��,� P���E��� �M��E��� V���� �E�}��u�O��   �E��$  �F�VV��(  ��,  �I�, � �Gu%�x u��M=;�t�H��M=��t�A��M=�M�E������|�, �M��_^[d�    ��]� �������U��j�h��d�    Pd�%    QSV��W�]��E�    �����C    �{�<��G    �G    �D��L��C    �C    �K$�E��- �C8    �K@�E��� �K\�E��� �Kd�E��C`    �\������   �E�	�������   ����fǃ    ǃ      ǃ   ekafǃ$  ekafǃ(  ����ǃ,  ����ǃ0      ǃ4      ǃ8      ǃP     ǃL      ƃ<   ǃT      ǃX      �E�E�P�K$ǃ`      ǃd      ƃh   ��- � u$� u��M=;�t�G��M=��t�x�=�M=�M�U���M��_^[d�    ��]� ��������U��j�h@�d�    Pd�%    QV��W�u������F    �~�E�    �<��G    �G    �D��L��F    �F    �N$�E���- �F8    �N@�E��\� �N\�E��`� �Nd�E��F`    �������   �E���������   �����fǆ    ǆ      ǆ   ekafǆ$  ekafǆ(  ����ǆ,  ����ǆ0      ǆ4      ǆ8      ǆP     ǆL      Ɔ<   ǆT      ǆX      ǆ`      ǆd      Ɔh   � u$� u��M=;�t�G��M=��t�x�=�M=�M��_^d�    ��]�����U��j�h��d�    Pd�%    QV��u������F    �E�N(�T��E�    �o �F�o@�F�����E�NP�FH�����Np��� �M��ǆ�      ǆ�       Ɔ�    ǆ�       ^d�    ��]� �����������U��j�h��d�    Pd�%    QV��u������F    �N�E�    �T������N(�����NP�FH   �����Np�0� �M��ǆ�      ǆ�       Ɔ�    ǆ�       ^d�    ��]�����������Vj jhMkLU����f. �����^�������<�9�M=u�A��M=�Q��t�A�B�Q��t�A�B�A    �A    ���+   ������������+   ������������+   �����������Q��M=��s�������Q��M=�s�������Q��M=�s�������U��j�hX�d�    Pd�%    QV��u���E�    ��P���̌���M�^d�    ��]��������������U��j�h9�d�    Pd�%    QV��u��4��N`�E�   �� �~Pr�v<��i_ ���FP   �FL    �F< �~8r�v$��i_ ���F8   �F4    �F$ �~ r�v�i_ ���F    ���F    �F �E�������, �M�^d�    ��]�������VW���w��t8S�_ ;�t���j ���;�u��w�Di_ ���G    �G     �G$    [��_^�$�, ����U��j�h��d�    Pd�%    ��SV��W�~�u��L��D���X  �E�   ��t&�C�����u����P�C�����u����P��P  r��<  �h_ ��ǆP     ǆL      Ɔ<   ��8  �E�	��t&�C�����u����P�C�����u����P��0  �E���t!�A�E��U��������E�E�Hu�j��Nd�E�������N\�E��� �N@�E��~� �N8�E��b�, �N$�ZO���N�E��N�, �N�E��B�, �<�9=�M=u�G��M=�O��t�G�A�O��t�G�A���G    �G    �E�������, �M�_^[d�    ��]������U��j�hG��d�    Pd�%    ��$V��u��T��E�    �~Hu0�E�   �E�    �E� �E��E�P�9  �}�r�u��g_ �����   �E���t!�A�E��U��������E�E�Hu�j����   r���   ��f_ ��ǆ�      �Npǆ�       Ɔ�    �E� �� ���E�������, �M�^d�    ��]���VW���w ��t8S�_$;�t���j ���@;�u��w �Tf_ ���G     �G$    �G(    [��_^�4�, ����U��ESVW����p�@    �     ��_�w��t&����K����u����P�C��0Nu����P��_^[]� ��������U��j�h`��d�    Pd�%    ��S�]VW���e��}�;�tb��K;�u	����a  �P�w�ы+�+�����;�wP�uQ�sP���������G;�t�ؐ���j ���@;�u�]�C+����G�M��_^d�    [��]� �G+���;�w*�u���Q�VP�>����u�EP�w�sV�������$벅�t�wQ���G~���7��d_ ���C��+��P�`  ��t��u�E�E�    P�7�s�3�������c����M��o��j j �e_ ������U��QVW�}��GP�N�y� �G$P�N$�}� �G(P�N(�q� �G,�N,;�t
j�j P��]���GDP�ND�Q� �GHP�NH�E� �GLP�NL�9� �GP�NT�FP�GTP�� �p��t�G�E�U�   ���E��Np�~p��t!�A�E�U��������E��E�Hu�j�_��^��]� ������U��VW�}��W�� ��t(�F;Gu �F;Gu�Ff.G���Dz_�^]� _2�^]� ������������U��y< �Et�� P�A P�we����]� �y8 t+��8�8 tP�I8���������U����t	�   ]� 3�]� �����E]�p� U��d�    j�hh#�Pd�%    �����u+�E�E���P�M���V��E����E��E�    P�4����u����AP�B�ЋM��d�    ��]� ����   ����������U��V���<�95�M=u�F��M=�N��t�F�A�N��t�F�A�E�F    �F    t	V�>b_ ����^]� ������U��V��������Et	V�b_ ����^]� ���������������U��V�������Et	V��a_ ����^]� ���������������U��V�������Et	V�a_ ����^]� ���������������U��V���%����Et	V�a_ ����^]� ���������������U��V��������Et	V�Wa_ ����^]� ���������������U��M���t�x t	Q�M� �]��U��j�h�]�d�    Pd�%    QS���E�    W�}�E�    �s`W�&  ���{`�E�    �E�   u=��dV�7����y= �N;�t
j�j P�dZ���7������P�N`�� �7�������Fd^�M��_[d�    ��]� �U��j�h��d�    Pd�%    ��V�u��M��� �u�E��E�    ����P�_� ���(   �M��E�����詽 �M�d�    ^��]� ��������U��j�h���d�    Pd�%    ��SVW���u$�E�    ��ujh�  h��h ���L�, �����   P�w`�E�P�V%  ���0�_�E���裃, �M��E� ��, �G`��u�3�Od�x= P����1  �u$����u��0  P��/  �	�EP�*8  �` u���-���S���% ���!  ��t	��   t����   P�30  �M�E�����蔼 �M�_^[d�    ��]�  �U��j�h���d�    Pd�%    ��4SVW�e��E�    �E  Pj�hP��M��� j�E��E�P�M��!# �M��E��E� �]�3�u�;stxj h    h    �E��R- �����}�V�M��E�莵 �E��E�P���_l- ����P�M��E��̻ �M��Ā���E�   ��똸�|ZËu�]���E�   뀍M��E� �d$ �M�_^d�    [��]ø�|Z��������������V���X� W��F    �F    �F^á�M=��t���t��ƀh   �@��t���u��������������2�� �����������U��d�    j�h���Pd�%    ��W���M����   SV�0����\T"�0�������uV�\T"�E�    �}����M�Q����Z���؁�<  ;�t)�r
�7�]_ ���G   ���G    S� �MV���}�r�u���\_ ��V�\T"�����^[_�M�d�    ��]� ��P  ��<  �@    r� �M��  _d�    ��]� ��U��d�    j�h�ѿPd�%    ��V��W�~`tq��  ��tjh�  h��h �����, ���~ uI��4  ��t?P�E�P�?� ���0�N�E�    �+�, �M��E������, _�^�M�d�    ��]ËM�2�_^d�    ��]���������U��QS�]��VhH[I�E�    �T
- ��t�u���    �`, ��^[��]ËMW�?������7;wt��    �S��$�
- ��u!��;wu�u���    �, _��^[��]Ë�u����, _��^[��]����������U��d�    j�hX6�Pd�%    V�E��u3���p�M�E������~, �M��d�    ^��]����������U��j�h@��d�    Pd�%    ��8S���E�    ��4   VW��4  �e���  �  ���+  �M��^� �E��E�    P���l  ���ԙ- ��  f��u�M��1� ��u7�} t$�u�M��E������    �F    �ط �D  h�������, ��j ��$  ��   ��M- �����u�E��E�P���h- �{`uV�������E�f���u�E� �u��M���r���} �E�t.�E��Q�. ��j Vj����   �Є��E�   ������   ���  ��t	�����@��0  ��t�A�E�U�   ���E܉M�j�E��E�PQ���E�    �0�E�P�W� ���0�     �u�M��E��=����E��P�B+  V���E    �c�����P���M�����M��E���t!�A�E�U��������E��E�Hu�j��M��E���w���M��d{���M��E������U� �  �&�Z��E�   �u�M��E��    �F    �w���M��{���M��E������� �|  �E��P�@Q  �8�     �}�M��E�   ��z���E�    j h    h    �E���K- ���M�P�n|���u��W�#f- �} t.�E�
蔃. ��j Wj����   �Є��E�	   �����  ��0  ��t�A�E�U�   ���E܉M�j�E��E�PQ���E�    �8�EP讁 ���8�     �M�E�藓��W��4  �E�    ���������O���M��s����M��E�	��t!�A�E�U��������E܋E�Hu�j�����E��P�M���y���M��E������y���7�������u���O�N��t���   ���ƋM�d�    _^[��]� ���ZËu��E�	   �}�    �G    ����E��R�M��Gy���M��?y���M��_^d�    [��]� ����������U��j�h��d�    Pd�%    ���} �E�    ujhz  h��h ����, ��SV�M��� �M�E�uVP�I\�]��   �E��   �E�P�}�����M��E��l  ��u6���a  ��u8Et&j j j jj�E���P�� ��t�E���P��� 2ۄ��E��M����q� �M��E� �e� �M�E������&y, �M��^[d�    ��]�����U��d�    j�h���Pd�%    ��\  SVW�}����� �؁�DFilt)��EFilt!��AFiltjh�  h��h ���ż, ����軓 ���uȃ�}h&������, ��j ������fǅ����  P���[� h�   ������P��������t, ������P�M��- �E��E�    P�u�E�P��������M��E���ujh�  h��h ���*�, �M��hH[I��$�- ��tjh�  h��h�����, ���E�M���$P��- ��ujh�  h��h���ѻ, ����u!��EFilu�E��@`   �E�ƀ  �  �Eċ�P荕 ���E�蒒 �ωE�舒 �ωE�辒 �ẺU��E�    �E�    �E�����  ��膏 ����  j j j �E�WP�]���M����E��E��M���t!�A�E؋Uظ�������EԋE�Hu�j��}� ujh�   hh��h ����, ���E��M�hp��H�M��E�����  �E���ujh�   hh��h ��谺, �E���j �M�j �H�EԋM�hp�P��.��P�E��E�P��~ ���0�M��E���v, �M��E��Tv, �M��E���t!�A�E؋Uظ�������E��E�Hu�j��E���ujh�   hh��h ����, �E����M��H�M�hp�����E���ujh�   hh��h ����, �E����M��H�M������u�M��U�����EFil�y  j j j �E�WP�	\�����E��E�P������������M�P�E��Id�s����������E�������M�Id�ٲ ���E�t�u�@`   �M�Id�����R�@`   �M�Id��u��P�M��p� �M��u�E�	�Id�����M�Id��u��� ;E�t�E�@L�M��E��� ���E�ǀ�   �  �`�u���ۏ ���   �ϋu��� ���   �ϋu���� ���   �ϋu��� ���   �ϋu��ی ���   �ϋu��;� ݞ�   �u��軏 ���   ���   �M��E���t!�A�EԋUԸ�������E��E�Hu�j��uȍE�P��l����A� �M�P�E�
�I@衮 ��l����E��� �M�E�P�I\�� �E�M܉�   �E�M䉈$  �E��E܅�t���E�U�   ���EԋE�U��E���0  ��0  ��t!�A�E�U��������E܋E�Hu�j��E�M̉�(  �E�MЉ�,  �M��u��I8��s, ��AFilu	��蜎 �Z�E�x uQ��EFiltI�MЅ�|B�E���r9jQP�E�P�P ���M��0���E��s, �M��E���r, �E�W�H�J ����   �EЋ�P�ܐ jh�   �������E�P�M��� ������ �E�   �E�    �E� u3���������Q�A��u�+�Q������P�M���J���M�E���<  �E�;�t
j�j P�H���}�/ on draw complete without worry for roder.
		dt.on( 'preDraw.dt.scroller', function () {
			that._scrollForce();
		} );

		// Destructor
		dt.on( 'destroy.scroller', function () {
			$(window).off( 'resize.dt-scroller' );
			$(that.dom.scroller).off('.dt-scroller');
			$(that.s.dt.nTable).off( '.scroller' );

			$(that.s.dt.nTableWrapper).removeClass('DTS');
			$('div.DTS_Loading', that.dom.scroller.parentNode).remove();

			that.dom.table.style.position = "";
			that.dom.table.style.top = "";
			that.dom.table.style.left = "";
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Automatic calculation of table row height. This is just a little tricky here as using
	 * initialisation DataTables has tale the table out of the document, so we need to create
	 * a new table and insert it into the document, calculate the row height and then whip the
	 * table out.
	 *  @returns {void}
	 *  @private
	 */
	_calcRowHeight: function ()
	{
		var dt = this.s.dt;
		var origTable = dt.nTable;
		var nTable = origTable.cloneNode( false );
		var tbody = $('<tbody/>').appendTo( nTable );
		var container = $(
			'<div class="'+dt.oClasses.sWrapper+' DTS">'+
				'<div class="'+dt.oClasses.sScrollWrapper+'">'+
					'<div class="'+dt.oClasses.sScrollBody+'"></div>'+
				'</div>'+
			'</div>'
		);

		// Want 3 rows in the sizing table so :first-child and :last-child
		// CSS styles don't come into play - take the size of the middle row
		$('tbody tr:lt(4)', origTable).clone().appendTo( tbody );
        var rowsCount = $('tr', tbody).length;

        if ( rowsCount === 1 ) {
            tbody.prepend('<tr><td>&#160;</td></tr>');
            tbody.append('<tr><td>&#160;</td></tr>');
		}
		else {
            for (; rowsCount < 3; rowsCount++) {
                tbody.append('<tr><td>&#160;</td></tr>');
            }
		}
	
		$('div.'+dt.oClasses.sScrollBody, container).append( nTable );

		// If initialised using `dom`, use the holding element as the insert point
		var insertEl = this.s.dt.nHolding || origTable.parentNode;

		if ( ! $(insertEl).is(':visible') ) {
			insertEl = 'body';
		}

		// Remove form element links as they might select over others (particularly radio and checkboxes)
		container.find("input").removeAttr("name");

		container.appendTo( insertEl );
		this.s.heights.row = $('tr', tbody).eq(1).outerHeight();

		container.remove();
	},

	/**
	 * Draw callback function which is fired when the DataTable is redrawn. The main function of
	 * this method is to position the drawn table correctly the scrolling container for the rows
	 * that is displays as a result of the scrolling position.
	 *  @returns {void}
	 *  @private
	 */
	_draw: function ()
	{
		var
			that = this,
			heights = this.s.heights,
			iScrollTop = this.dom.scroller.scrollTop,
			iTableHeight = $(this.s.dt.nTable).height(),
			displayStart = this.s.dt._iDisplayStart,
			displayLen = this.s.dt._iDisplayLength,
			displayEnd = this.s.dt.fnRecordsDisplay();

		// Disable the scroll event listener while we are updating the DOM
		this.s.skip = true;

		// If paging is reset
		if ( (this.s.dt.bSorted || this.s.dt.bFiltered) && displayStart === 0 && !this.s.dt._drawHold ) {
			this.s.topRowFloat = 0;
		}

		iScrollTop = this.s.scrollType === 'jump' ?
			this._domain( 'virtualToPhysical', this.s.topRowFloat * heights.row ) :
			iScrollTop;

		// Store positional information so positional calculations can be based
		// upon the current table draw position
		this.s.baseScrollTop = iScrollTop;
		this.s.baseRowTop = this.s.topRowFloat;

		// Position the table in the virtual scroller
		var tableTop = iScrollTop - ((this.s.topRowFloat - displayStart) * heights.row);
		if ( displayStart === 0 ) {
			tableTop = 0;
		}
		else if ( displayStart + displayLen >= displayEnd ) {
			tableTop = heights.scroll - iTableHeight;
		}

		this.dom.table.style.top = tableTop+'px';

		/* Cache some information for the scroller */
		this.s.tableTop = tableTop;
		this.s.tableBottom = iTableHeight + this.s.tableTop;

		// Calculate the boundaries for where a redraw will be triggered by the
		// scroll event listener
		var boundaryPx = (iScrollTop - this.s.tableTop) * this.s.boundaryScale;
		this.s.redrawTop = iScrollTop - boundaryPx;
		this.s.redrawBottom = iScrollTop + boundaryPx > heights.scroll - heights.viewport - heights.row ?
			heights.scroll - heights.viewport - heights.row :
			iScrollTop + boundaryPx;

		this.s.skip = false;

		// Restore the scrolling position that was saved by DataTable's state
		// saving Note that this is done on the second draw when data is Ajax
		// sourced, and the first draw when DOM soured
		if ( this.s.dt.oFeatures.bStateSave && this.s.dt.oLoadedState !== null &&
			 typeof this.s.dt.oLoadedState.scroller != 'undefined' )
		{
			// A quirk of DataTables is that the draw callback will occur on an
			// empty set if Ajax sourced, but not if server-side processing.
			var ajaxSourced = (this.s.dt.sAjaxSource || that.s.dt.ajax) && ! this.s.dt.oFeatures.bServerSide ?
				true :
				false;

			if ( ( ajaxSourced && this.s.dt.iDraw == 2) ||
			     (!ajaxSourced && this.s.dt.iDraw == 1) )
			{
				setTimeout( function () {
					$(that.dom.scroller).scrollTop( that.s.dt.oLoadedState.scroller.scrollTop );

					// In order to prevent layout thrashing we need another
					// small delay
					setTimeout( function () {
						that.s.ingnoreScroll = false;
					}, 0 );
				}, 0 );
			}
		}
		else {
			that.s.ingnoreScroll = false;
		}

		// Because of the order of the DT callbacks, the info update will
		// take precedence over the one we want here. So a 'thread' break is
		// needed.  Only add the thread break if bInfo is set
		if ( this.s.dt.oFeatures.bInfo ) {
			setTimeout( function () {
				that._info.call( that );
			}, 0 );
		}

		$(this.s.dt.nTable).triggerHandler('position.dts.dt', tableTop);

		// Hide the loading indicator
		if ( this.dom.loader && this.s.loaderVisible ) {
			this.dom.loader.css( 'display', 'none' );
			this.s.loaderVisible = false;
		}
	},

	/**
	 * Convert from one domain to another. The physical domain is the actual
	 * pixel count on the screen, while the virtual is if we had browsers which
	 * had scrolling containers of infinite height (i.e. the absolute value)
	 *
	 *  @param {string} dir Domain transform direction, `virtualToPhysical` or
	 *    `physicalToVirtual` 
	 *  @returns {number} Calculated transform
	 *  @private
	 */
	_domain: function ( dir, val )
	{
		var heights = this.s.heights;
		var diff;
		var magic = 10000; // the point at which the non-linear calculations start to happen

		// If the virtual and physical height match, then we use a linear
		// transform between the two, allowing the scrollbar to be linear
		if ( heights.virtual === heights.scroll ) {
			return val;
		}

		// In the first 10k pixels and the last 10k pixels, we want the scrolling
		// to be linear. After that it can be non-linear. It would be unusual for
		// anyone to mouse wheel through that much.
		if ( val < magic ) {
			return val;
		}
		else if ( dir === 'virtualToPhysical' && val >= heights.virtual - magic ) {
			diff = heights.virtual - val;
			return heights.scroll - diff;
		}
		else if ( dir === 'physicalToVirtual' && val >= heights.scroll - magic ) {
			diff = heights.scroll - val;
			return heights.virtual - diff;
		}

		// Otherwise, we want a non-linear scrollbar to take account of the
		// redrawing regions at the start and end of the table, otherwise these
		// can stutter badly - on large tables 30px (for example) scroll might
		// be hundreds of rows, so the table would be redrawing every few px at
		// the start and end. Use a simple linear eq. to stop this, effectively
		// causing a kink in the scrolling ratio. It does mean the scrollbar is
		// non-linear, but with such massive data sets, the scrollbar is going
		// to be a best guess anyway
		var m = (heights.virtual - magic - magic) / (heights.scroll - magic - magic);
		var c = magic - (m*magic);

		return dir === 'virtualToPhysical' ?
			(val-c) / m :
			(m*val) + c;
	},

	/**
	 * Update any information elements that are controlled by the DataTable based on the scrolling
	 * viewport and what rows are visible in it. This function basically acts in the same way as
	 * _fnUpdateInfo in DataTables, and effectively replaces that function.
	 *  @returns {void}
	 *  @private
	 */
	_info: function ()
	{
		if ( !this.s.dt.oFeatures.bInfo )
		{
			return;
		}

		var
			dt = this.s.dt,
			language = dt.oLanguage,
			iScrollTop = this.dom.scroller.scrollTop,
			iStart = Math.floor( this.pixelsToRow(iScrollTop, false, this.s.ani)+1 ),
			iMax = dt.fnRecordsTotal(),
			iTotal = dt.fnRecordsDisplay(),
			iPossibleEnd = Math.ceil( this.pixelsToRow(iScrollTop+this.s.heights.viewport, false, this.s.ani) ),
			iEnd = iTotal < iPossibleEnd ? iTotal : iPossibleEnd,
			sStart = dt.fnFormatNumber( iStart ),
			sEnd = dt.fnFormatNumber( iEnd ),
			sMax = dt.fnFormatNumber( iMax ),
			sTotal = dt.fnFormatNumber( iTotal ),
			sOut;

		if ( dt.fnRecordsDisplay() === 0 &&
			   dt.fnRecordsDisplay() == dt.fnRecordsTotal() )
		{
			/* Empty record set */
			sOut = language.sInfoEmpty+ language.sInfoPostFix;
		}
		else if ( dt.fnRecordsDisplay() === 0 )
		{
			/* Empty record set after filtering */
			sOut = language.sInfoEmpty +' '+
				language.sInfoFiltered.replace('_MAX_', sMax)+
					language.sInfoPostFix;
		}
		else if ( dt.fnRecordsDisplay() == dt.fnRecordsTotal() )
		{
			/* Normal record set */
			sOut = language.sInfo.
					replace('_START_', sStart).
					replace('_END_',   sEnd).
					replace('_MAX_',   sMax).
					replace('_TOTAL_', sTotal)+
				language.sInfoPostFix;
		}
		else
		{
			/* Record set after filtering */
			sOut = language.sInfo.
					replace('_START_', sStart).
					replace('_END_',   sEnd).
					replace('_MAX_',   sMax).
					replace('_TOTAL_', sTotal) +' '+
				language.sInfoFiltered.replace(
					'_MAX_',
					dt.fnFormatNumber(dt.fnRecordsTotal())
				)+
				language.sInfoPostFix;
		}

		var callback = language.fnInfoCallback;
		if ( callback ) {
			sOut = callback.call( dt.oInstance,
				dt, iStart, iEnd, iMax, iTotal, sOut
			);
		}

		var n = dt.aanFeatures.i;
		if ( typeof n != 'undefined' )
		{
			for ( var i=0, iLen=n.length ; i<iLen ; i++ )
			{
				$(n[i]).html( sOut );
			}
		}

		// DT doesn't actually (yet) trigger this event, but it will in future
		$(dt.nTable).triggerHandler( 'info.dt' );
	},

	/**
	 * Parse CSS height property string as number
	 *
	 * An attempt is made to parse the string as a number. Currently supported units are 'px',
	 * 'vh', and 'rem'. 'em' is partially supported; it works as long as the parent element's
	 * font size matches the body element. Zero is returned for unrecognized strings.
	 *  @param {string} cssHeight CSS height property string
	 *  @returns {number} height
	 *  @private
	 */
	_parseHeight: function(cssHeight) {
		var height;
		var matches = /^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(px|em|rem|vh)$/.exec(cssHeight);

		if (matches === null) {
			return 0;
		}

		var value = parseFloat(matches[1]);
		var unit = matches[2];

		if ( unit === 'px' ) {
			height = value;
		}
		else if ( unit === 'vh' ) {
			height = ( value / 100 ) * $(window).height();
		}
		else if ( unit === 'rem' ) {
			height = value * parseFloat($(':root').css('font-size'));
		}
		else if ( unit === 'em' ) {
			height = value * parseFloat($('body').css('font-size'));
		}

		return height ?
			height :
			0;
	},

	/**
	 * Scrolling function - fired whenever the scrolling position is changed.
	 * This method needs to use the stored values to see if the table should be
	 * redrawn as we are moving towards the end of the information that is
	 * currently drawn or not. If needed, then it will redraw the table based on
	 * the new position.
	 *  @returns {void}
	 *  @private
	 */
	_scroll: function ()
	{
		var
			that = this,
			heights = this.s.heights,
			iScrollTop = this.dom.scroller.scrollTop,
			iTopRow;

		if ( this.s.skip ) {
			return;
		}

		if ( this.s.ingnoreScroll ) {
			return;
		}

		if ( iScrollTop === this.s.lastScrollTop ) {
			return;
		}

		/* If the table has been sorted or filtered, then we use the redraw that
		 * DataTables as done, rather than performing our own
		 */
		if ( this.s.dt.bFiltered || this.s.dt.bSorted ) {
			this.s.lastScrollTop = 0;
			return;
		}

		/* Update the table's information display for what is now in the viewport */
		this._info();

		/* We don't want to state save on every scroll event - that's heavy
		 * handed, so use a timeout to update the state saving only when the
		 * scrolling has finished
		 */
		clearTimeout( this.s.stateTO );
		this.s.stateTO = setTimeout( function () {
			that.s.dtApi.state.save();
		}, 250 );

		this.s.scrollType = Math.abs(iScrollTop - this.s.lastScrollTop) > heights.viewport ?
			'jump' :
			'cont';

		this.s.topRowFloat = this.s.scrollType === 'cont' ?
			this.pixelsToRow( iScrollTop, false, false ) :
			this._domain( 'physicalToVirtual', iScrollTop ) / heights.row;

		if ( this.s.topRowFloat < 0 ) {
			this.s.topRowFloat = 0;
		}

		/* Check if the scroll point is outside the trigger boundary which would required
		 * a DataTables redraw
		 */
		if ( this.s.forceReposition || iScrollTop < this.s.redrawTop || iScrollTop > this.s.redrawBottom ) {
			var preRows = Math.ceil( ((this.s.displayBuffer-1)/2) * this.s.viewportRows );

			iTopRow = parseInt(this.s.topRowFloat, 10) - preRows;
			this.s.forceReposition = false;

			if ( iTopRow <= 0 ) {
				/* At the start of the table */
				iTopRow = 0;
			}
			else if ( iTopRow + this.s.dt._iDisplayLength > this.s.dt.fnRecordsDisplay() ) {
				/* At the end of the table */
				iTopRow = this.s.dt.fnRecordsDisplay() - this.s.dt._iDisplayLength;
				if ( iTopRow < 0 ) {
					iTopRow = 0;
				}
			}
			else if ( iTopRow % 2 !== 0 ) {
				// For the row-striping classes (odd/even) we want only to start
				// on evens otherwise the stripes will change between draws and
				// look rubbish
				iTopRow++;
			}

			// Store calcuated value, in case the following condition is not met, but so
			// that the draw function will still use it.
			this.s.targetTop = iTopRow;

			if ( iTopRow != this.s.dt._iDisplayStart ) {
				/* Cache the new table position for quick lookups */
				this.s.tableTop = $(this.s.dt.nTable).offset().top;
				this.s.tableBottom = $(this.s.dt.nTable).height() + this.s.tableTop;

				var draw = function () {
					that.s.dt._iDisplayStart = that.s.targetTop;
					that.s.dt.oApi._fnDraw( that.s.dt );
				};

				/* Do the DataTables redraw based on the calculated start point - note that when
				 * using server-side processing we introduce a small delay to not DoS the server...
				 */
				if ( this.s.dt.oFeatures.bServerSide ) {
					this.s.forceReposition = true;

					clearTimeout( this.s.drawTO );
					this.s.drawTO = setTimeout( draw, this.s.serverWait );
				}
				else {
					draw();
				}

				if ( this.dom.loader && ! this.s.loaderVisible ) {
					this.dom.loader.css( 'display', 'block' );
					this.s.loaderVisible = true;
				}
			}
		}
		else {
			this.s.topRowFloat = this.pixelsToRow( iScrollTop, false, true );
		}

		this.s.lastScrollTop = iScrollTop;
		this.s.stateSaveThrottle();

		if ( this.s.scrollType === 'jump' && this.s.mousedown ) {
			this.s.labelVisible = true;
		}
		if (this.s.labelVisible) {
			var labelFactor = (heights.viewport-heights.labelHeight - heights.xbar) / heights.scroll;

			this.dom.label
				.html( this.s.dt.fnFormatNumber( parseInt( this.s.topRowFloat, 10 )+1 ) )
				.css( 'top', iScrollTop + (iScrollTop * labelFactor) )
				.css( 'display', 'block' );
		}
	},

	/**
	 * Force the scrolling container to have height beyond that of just the
	 * table that has been drawn so the user can scroll the whole data set.
	 *
	 * Note that if the calculated required scrolling height exceeds a maximum
	 * value (1 million pixels - hard-coded) the forcing element will be set
	 * only to that maximum value and virtual / physical domain transforms will
	 * be used to allow Scroller to display tables of any number of records.
	 *  @returns {void}
	 *  @private
	 */
	_scrollForce: function ()
	{
		var heights = this.s.heights;
		var max = 1000000;

		heights.virtual = heights.row * 4:function(e,t,n){"use strict";var r=n(7854),i=n(260),o=n(7293),a=r.Int8Array,u=i.aTypedArray,s=i.exportTypedArrayMethod,l=[].toLocaleString,c=[].slice,f=!!a&&o((function(){l.call(new a(1))}));s("toLocaleString",(function(){return l.apply(f?c.call(u(this)):u(this),arguments)}),o((function(){return[1,2].toLocaleString()!=new a([1,2]).toLocaleString()}))||!o((function(){a.prototype.toLocaleString.call([1,2])})))},5016:function(e,t,n){"use strict";var r=n(260).exportTypedArrayMethod,i=n(7293),o=n(7854).Uint8Array,a=o&&o.prototype||{},u=[].toString,s=[].join;i((function(){u.call({})}))&&(u=function(){return s.call(this)});var l=a.toString!=u;r("toString",u,l)},2472:function(e,t,n){n(9843)("Uint8",(function(e){return function(t,n,r){return e(this,t,n,r)}}))},4747:function(e,t,n){var r=n(7854),i=n(8324),o=n(8533),a=n(8880);for(var u in i){var s=r[u],l=s&&s.prototype;if(l&&l.forEach!==o)try{a(l,"forEach",o)}catch(e){l.forEach=o}}},3948:function(e,t,n){var r=n(7854),i=n(8324),o=n(6992),a=n(8880),u=n(5112),s=u("iterator"),l=u("toStringTag"),c=o.values;for(var f in i){var p=r[f],h=p&&p.prototype;if(h){if(h[s]!==c)try{a(h,s,c)}catch(e){h[s]=c}if(h[l]||a(h,l,f),i[f])for(var d in o)if(h[d]!==o[d])try{a(h,d,o[d])}catch(e){h[d]=o[d]}}}},1637:function(e,t,n){"use strict";n(6992);var r=n(2109),i=n(5005),o=n(590),a=n(1320),u=n(2248),s=n(8003),l=n(4994),c=n(9909),f=n(5787),p=n(6656),h=n(9974),d=n(648),v=n(9670),y=n(111),g=n(30),m=n(9114),b=n(8554),x=n(1246),w=n(5112),E=i("fetch"),k=i("Headers"),A=w("iterator"),S="URLSearchParams",F="URLSearchParamsIterator",T=c.set,C=c.getterFor(S),L=c.getterFor(F),R=/\+/g,I=Array(4),U=function(e){return I[e-1]||(I[e-1]=RegExp("((?:%[\\da-f]{2}){"+e+"})","gi"))},O=function(e){try{return decodeURIComponent(e)}catch(t){return e}},_=function(e){var t=e.replace(R," "),n=4;try{return decodeURIComponent(t)}catch(e){for(;n;)t=t.replace(U(n--),O);return t}},M=/[!'()~]|%20/g,z={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},P=function(e){return z[e]},j=function(e){return encodeURIComponent(e).replace(M,P)},D=function(e,t){if(t)for(var n,r,i=t.split("&"),o=0;o<i.length;)(n=i[o++]).length&&(r=n.split("="),e.push({key:_(r.shift()),value:_(r.join("="))}))},N=function(e){this.entries.length=0,D(this.entries,e)},B=function(e,t){if(e<t)throw TypeError("Not enough arguments")},q=l((function(e,t){T(this,{type:F,iterator:b(C(e).entries),kind:t})}),"Iterator",(function(){var e=L(this),t=e.kind,n=e.iterator.next(),r=n.value;return n.done||(n.value="keys"===t?r.key:"values"===t?r.value:[r.key,r.value]),n})),W=function(){f(this,W,S);var e,t,n,r,i,o,a,u,s,l=arguments.length>0?arguments[0]:void 0,c=this,h=[];if(T(c,{type:S,entries:h,updateURL:function(){},updateSearchParams:N}),void 0!==l)if(y(l))if("function"==typeof(e=x(l)))for(n=(t=e.call(l)).next;!(r=n.call(t)).done;){if((a=(o=(i=b(v(r.value))).next).call(i)).done||(u=o.call(i)).done||!o.call(i).done)throw TypeError("Expected sequence with length 2");h.push({key:a.value+"",value:u.value+""})}else for(s in l)p(l,s)&&h.push({key:s,value:l[s]+""});else D(h,"string"==typeof l?"?"===l.charAt(0)?l.slice(1):l:l+"")},H=W.prototype;u(H,{append:function(e,t){B(arguments.length,2);var n=C(this);n.entries.push({key:e+"",value:t+""}),n.updateURL()},delete:function(e){B(arguments.length,1);for(var t=C(this),n=t.entries,r=e+"",i=0;i<n.length;)n[i].key===r?n.splice(i,1):i++;t.updateURL()},get:function(e){B(arguments.length,1);for(var t=C(this).entries,n=e+"",r=0;r<t.length;r++)if(t[r].key===n)return t[r].value;return null},getAll:function(e){B(arguments.length,1);for(var t=C(this).entries,n=e+"",r=[],i=0;i<t.length;i++)t[i].key===n&&r.push(t[i].value);return r},has:function(e){B(arguments.length,1);for(var t=C(this).entries,n=e+"",r=0;r<t.length;)if(t[r++].key===n)return!0;return!1},set:function(e,t){B(arguments.length,1);for(var n,r=C(this),i=r.entries,o=!1,a=e+"",u=t+"",s=0;s<i.length;s++)(n=i[s]).key===a&&(o?i.splice(s--,1):(o=!0,n.value=u));o||i.push({key:a,value:u}),r.updateURL()},sort:function(){var e,t,n,r=C(this),i=r.entries,o=i.slice();for(i.length=0,n=0;n<o.length;n++){for(e=o[n],t=0;t<n;t++)if(i[t].key>e.key){i.splice(t,0,e);break}t===n&&i.push(e)}r.updateURL()},forEach:function(e){for(var t,n=C(this).entries,r=h(e,arguments.length>1?arguments[1]:void 0,3),i=0;i<n.length;)r((t=n[i++]).value,t.key,this)},keys:function(){return new q(this,"keys")},values:function(){return new q(this,"values")},entries:function(){return new q(this,"entries")}},{enumerable:!0}),a(H,A,H.entries),a(H,"toString",(function(){for(var e,t=C(this).entries,n=[],r=0;r<t.length;)e=t[r++],n.push(j(e.key)+"="+j(e.value));return n.join("&")}),{enumerable:!0}),s(W,S),r({global:!0,forced:!o},{URLSearchParams:W}),o||"function"!=typeof E||"function"!=typeof k||r({global:!0,enumerable:!0,forced:!0},{fetch:function(e){var t,n,r,i=[e];return arguments.length>1&&(y(t=arguments[1])&&(n=t.body,d(n)===S&&((r=t.headers?new k(t.headers):new k).has("content-type")||r.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"),t=g(t,{body:m(0,String(n)),headers:m(0,r)}))),i.push(t)),E.apply(this,i)}}),e.exports={URLSearchParams:W,getState:C}},285:function(e,t,n){"use strict";n(8783);var r,i=n(2109),o=n(9781),a=n(590),u=n(7854),s=n(6048),l=n(1320),c=n(5787),f=n(6656),p=n(1574),h=n(8457),d=n(8710).codeAt,v=n(3197),y=n(8003),g=n(1637),m=n(9909),b=u.URL,x=g.URLSearchParams,w=g.getState,E=m.set,k=m.getterFor("URL"),A=Math.floor,S=Math.pow,F="Invalid scheme",T="Invalid host",C="Invalid port",L=/[A-Za-z]/,R=/[\d+-.A-Za-z]/,I=/\d/,U=/^(0x|0X)/,O=/^[0-7]+$/,_=/^\d+$/,M=/^[\dA-Fa-f]+$/,z=/[\u0000\t\u000A\u000D #%/:?@[\\]]/,P=/[\u0000\t\u000A\u000D #/:?@[\\]]/,j=/^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,D=/[\t\u000A\u000D]/g,N=function(e,t){var n,r,i;if("["==t.charAt(0)){if("]"!=t.charAt(t.length-1))return T;if(!(n=q(t.slice(1,-1))))return T;e.host=n}else if(X(e)){if(t=v(t),z.test(t))return T;if(null===(n=B(t)))return T;e.host=n}else{if(P.test(t))return T;for(n="",r=h(t),i=0;i<r.length;i++)n+=$(r[i],H);e.host=n}},B=function(e){var t,n,r,i,o,a,u,s=e.split(".");if(s.length&&""==s[s.length-1]&&s.pop(),(t=s.length)>4)return e;for(n=[],r=0;r<t;r++){if(""==(i=s[r]))return e;if(o=10,i.length>1&&"0"==i.charAt(0)&&(o=U.test(i)?16:8,i=i.slice(8==o?1:2)),""===i)a=0;else{if(!(10==o?_:8==o?O:M).test(i))return e;a=parseInt(i,o)}n.push(a)}for(r=0;r<t;r++)if(a=n[r],r==t-1){if(a>=S(256,5-t))return null}else if(a>255)return null;for(u=n.pop(),r=0;r<n.length;r++)u+=n[r]*S(256,3-r);return u},q=function(e){var t,n,r,i,o,a,u,s=[0,0,0,0,0,0,0,0],l=0,c=null,f=0,p=function(){return e.charAt(f)};if(":"==p()){if(":"!=e.charAt(1))return;f+=2,c=++l}for(;p();){if(8==l)return;if(":"!=p()){for(t=n=0;n<4&&M.test(p());)t=16*t+parseInt(p(),16),f++,n++;if("."==p()){if(0==n)return;if(f-=n,l>6)return;for(r=0;p();){if(i=null,r>0){if(!("."==p()&&r<4))return;f++}if(!I.test(p()))return;for(;I.test(p());){if(o=parseInt(p(),10),null===i)i=o;else{if(0==i)return;i=10*i+o}if(i>255)return;f++}s[l]=256*s[l]+i,2!=++r&&4!=r||l++}if(4!=r)return;break}if(":"==p()){if(f++,!p())return}else if(p())return;s[l++]=t}else{if(null!==c)return;f++,c=++l}}if(null!==c)for(a=l-c,l=7;0!=l&&a>0;)u=s[l],s[l--]=s[c+a-1],s[c+--a]=u;else if(8!=l)return;return s},W=function(e){var t,n,r,i;if("number"==typeof e){for(t=[],n=0;n<4;n++)t.unshift(e%256),e=A(e/256);return t.join(".")}if("object"==typeof e){for(t="",r=function(e){for(var t=null,n=1,r=null,i=0,o=0;o<8;o++)0!==e[o]?(i>n&&(t=r,n=i),r=null,i=0):(null===r&&(r=o),++i);return i>n&&(t=r,n=i),t}(e),n=0;n<8;n++)i&&0===e[n]||(i&&(i=!1),r===n?(t+=n?":":"::",i=!0):(t+=e[n].toString(16),n<7&&(t+=":")));return"["+t+"]"}return e},H={},Y=p({},H,{" ":1,'"':1,"<":1,">":1,"`":1}),G=p({},Y,{"#":1,"?":1,"{":1,"}":1}),Q=p({},G,{"/":1,":":1,";":1,"=":1,"@":1,"[":1,"\\":1,"]":1,"^":1,"|":1}),$=function(e,t){var n=d(e,0);return n>32&&n<127&&!f(t,e)?e:encodeURIComponent(e)},V={ftp:21,file:null,http:80,https:443,ws:80,wss:443},X=function(e){return f(V,e.scheme)},K=function(e){return""!=e.username||""!=e.password},Z=function(e){return!e.host||e.cannotBeABaseURL||"file"==e.scheme},J=function(e,t){var n;return 2==e.length&&L.test(e.charAt(0))&&(":"==(n=e.charAt(1))||!t&&"|"==n)},ee=function(e){var t;return e.length>1&&J(e.slice(0,2))&&(2==e.length||"/"===(t=e.charAt(2))||"\\"===t||"?"===t||"#"===t)},te=function(e){var t=e.path,n=t.length;!n||"file"==e.scheme&&1==n&&J(t[0],!0)||t.pop()},ne=function(e){return"."===e||"%2e"===e.toLowerCase()},re={},ie={},oe={},ae={},ue={},se={},le={},ce={},fe={},pe={},he={},de={},ve={},ye={},ge={},me={},be={},xe={},we={},Ee={},ke={},Ae=function(e,t,n,i){var o,a,u,s,l,c=n||re,p=0,d="",v=!1,y=!1,g=!1;for(n||(e.scheme="",e.username="",e.password="",e.host=null,e.port=null,e.path=[],e.query=null,e.fragment=null,e.cannotBeABaseURL=!1,t=t.replace(j,"")),t=t.replace(D,""),o=h(t);p<=o.length;){switch(a=o[p],c){case re:if(!a||!L.test(a)){if(n)return F;c=oe;continue}d+=a.toLowerCase(),c=ie;break;case ie:if(a&&(R.test(a)||"+"==a||"-"==a||"."==a))d+=a.toLowerCase();else{if(":"!=a){if(n)return F;d="",c=oe,p=0;continue}if(n&&(X(e)!=f(V,d)||"file"==d&&(K(e)||null!==e.port)||"file"==e.scheme&&!e.host))return;if(e.scheme=d,n)return void(X(e)&&V[e.scheme]==e.port&&(e.port=null));d="","file"==e.scheme?c=ye:X(e)&&i&&i.scheme==e.scheme?c=ae:X(e)?c=ce:"/"==o[p+1]?(c=ue,p++):(e.cannotBeABaseURL=!0,e.path.push(""),c=we)}break;case oe:if(!i||i.cannotBeABaseURL&&"#"!=a)return F;if(i.cannotBeABaseURL&&"#"==a){e.scheme=i.scheme,e.path=i.path.slice(),e.query=i.query,e.fragment="",e.cannotBeABaseURL=!0,c=ke;break}c="file"==i.scheme?ye:se;continue;case ae:if("/"!=a||"/"!=o[p+1]){c=se;continue}c=fe,p++;break;case ue:if("/"==a){c=pe;break}c=xe;continue;case se:if(e.scheme=i.scheme,a==r)e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.query=i.query;else if("/"==a||"\\"==a&&X(e))c=le;else if("?"==a)e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.query="",c=Ee;else{if("#"!=a){e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.path.pop(),c=xe;continue}e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,e.path=i.path.slice(),e.query=i.query,e.fragment="",c=ke}break;case le:if(!X(e)||"/"!=a&&"\\"!=a){if("/"!=a){e.username=i.username,e.password=i.password,e.host=i.host,e.port=i.port,c=xe;continue}c=pe}else c=fe;break;case ce:if(c=fe,"/"!=a||"/"!=d.charAt(p+1))continue;p++;break;case fe:if("/"!=a&&"\\"!=a){c=pe;continue}break;case pe:if("@"==a){v&&(d="%40"+d),v=!0,u=h(d);for(var m=0;m<u.length;m++){var b=u[m];if(":"!=b||g){var x=$(b,Q);g?e.password+=x:e.username+=x}else g=!0}d=""}else if(a==r||"/"==a||"?"==a||"#"==a||"\\"==a&&X(e)){if(v&&""==d)return"Invalid authority";p-=h(d).length+1,d="",c=he}else d+=a;break;case he:case de:if(n&&"file"==e.scheme){c=me;continue}if(":"!=a||y){if(a==r||"/"==a||"?"==a||"#"==a||"\\"==a&&X(e)){if(X(e)&&""==d)return T;if(n&&""==d&&(K(e)||null!==e.port))return;if(s=N(e,d))return s;if(d="",c=be,n)return;continue}"["==a?y=!0:"]"==a&&(y=!1),d+=a}else{if(""==d)return T;if(s=N(e,d))return s;if(d="",c=ve,n==de)return}break;case ve:if(!I.test(a)){if(a==r||"/"==a||"?"==a||"#"==a||"\\"==a&&X(e)||n){if(""!=d){var w=parseInt(d,10);if(w>65535)return C;e.port=X(e)&&w===V[e.scheme]?null:w,d=""}if(n)return;c=be;continue}return C}d+=a;break;case ye:if(e.scheme="file","/"==a||"\\"==a)c=ge;else{if(!i||"file"!=i.scheme){c=xe;continue}if(a==r)e.host=i.host,e.path=i.path.slice(),e.query=i.query;else if("?"==a)e.host=i.host,e.path=i.path.slice(),e.query="",c=Ee;else{if("#"!=a){ee(o.slice(p).join(""))||(e.host=i.host,e.path=i.path.slice(),te(e)),c=xe;continue}e.host=i.host,e.path=i.path.slice(),e.query=i.query,e.fragment="",c=ke}}break;case ge:if("/"==a||"\\"==a){c=me;break}i&&"file"==i.scheme&&!ee(o.slice(p).join(""))&&(J(i.path[0],!0)?e.path.push(i.path[0]):e.host=i.host),c=xe;continue;case me:if(a==r||"/"==a||"\\"==a||"?"==a||"#"==a){if(!n&&J(d))c=xe;else if(""==d){if(e.host="",n)return;c=be}else{if(s=N(e,d))return s;if("localhost"==e.host&&(e.host=""),n)return;d="",c=be}continue}d+=a;break;case be:if(X(e)){if(c=xe,"/"!=a&&"\\"!=a)continue}else if(n||"?"!=a)if(n||"#"!=a){if(a!=r&&(c=xe,"/"!=a))continue}else e.fragment="",c=ke;else e.query="",c=Ee;break;case xe:if(a==r||"/"==a||"\\"==a&&X(e)||!n&&("?"==a||"#"==a)){if(".."===(l=(l=d).toLowerCase())||"%2e."===l||".%2e"===l||"%2e%2e"===l?(te(e),"/"==a||"\\"==a&&X(e)||e.path.push("")):ne(d)?"/"==a||"\\"==a&&X(e)||e.path.push(""):("file"==e.scheme&&!e.path.length&&J(d)&&(e.host&&(e.host=""),d=d.charAt(0)+":"),e.path.push(d)),d="","file"==e.scheme&&(a==r||"?"==a||"#"==a))for(;e.path.length>1&&""===e.path[0];)e.path.shift();"?"==a?(e.query="",c=Ee):"#"==a&&(e.fragment="",c=ke)}else d+=$(a,G);break;case we:"?"==a?(e.query="",c=Ee):"#"==a?(e.fragment="",c=ke):a!=r&&(e.path[0]+=$(a,H));break;case Ee:n||"#"!=a?a!=r&&("'"==a&&X(e)?e.query+="%27":e.query+="#"==a?"%23":$(a,H)):(e.fragment="",c=ke);break;case ke:a!=r&&(e.fragment+=$(a,Y))}p++}},Se=function(e){var t,n,r=c(this,Se,"URL"),i=arguments.length>1?arguments[1]:void 0,a=String(e),u=E(r,{type:"URL"});if(void 0!==i)if(i instanceof Se)t=k(i);else if(n=Ae(t={},String(i)))throw TypeError(n);if(n=Ae(u,a,null,t))throw TypeError(n);var s=u.searchParams=new x,l=w(s);l.updateSearchParams(u.query),l.updateURL=function(){u.query=String(s)||null},o||(r.href=Te.call(r),r.origin=Ce.call(r),r.protocol=Le.call(r),r.username=Re.call(r),r.password=Ie.call(r),r.host=Ue.call(r),r.hostname=Oe.call(r),r.port=_e.call(r),r.pathname=Me.call(r),r.search=ze.call(r),r.searchParams=Pe.call(r),r.hash=je.call(r))},Fe=Se.prototype,Te=function(){var e=k(this),t=e.scheme,n=e.username,r=e.password,i=e.host,o=e.port,a=e.path,u=e.query,s=e.fragment,l=t+":";return null!==i?(l+="//",K(e)&&(l+=n+(r?":"+r:"")+"@"),l+=W(i),null!==o&&(l+=":"+o)):"file"==t&&(l+="//"),l+=e.cannotBeABaseURL?a[0]:a.length?"/"+a.join("/"):"",null!==u&&(l+="?"+u),null!==s&&(l+="#"+s),l},Ce=function(){var e=k(this),t=e.scheme,n=e.port;if("blob"==t)try{return new URL(t.path[0]).origin}catch(e){return"null"}return"file"!=t&&X(e)?t+"://"+W(e.host)+(null!==n?":"+n:""):"null"},Le=function(){return k(this).scheme+":"},Re=function(){return k(this).username},Ie=function(){return k(this).password},Ue=function(){var e=k(this),t=e.host,n=e.port;return null===t?"":null===n?W(t):W(t)+":"+n},Oe=function(){var e=k(this).host;return null===e?"":W(e)},_e=function(){var e=k(this).port;return null===e?"":String(e)},Me=function(){var e=k(this),t=e.path;return e.cannotBeABaseURL?t[0]:t.length?"/"+t.join("/"):""},ze=function(){var e=k(this).query;return e?"?"+e:""},Pe=function(){return k(this).searchParams},je=function(){var e=k(this).fragment;return e?"#"+e:""},De=function(e,t){return{get:e,set:t,configurable:!0,enumerable:!0}};if(o&&s(Fe,{href:De(Te,(function(e){var t=k(this),n=String(e),r=Ae(t,n);if(r)throw TypeError(r);w(t.searchParams).updateSearchParams(t.query)})),origin:De(Ce),protocol:De(Le,(function(e){var t=k(this);Ae(t,String(e)+":",re)})),username:De(Re,(function(e){var t=k(this),n=h(String(e));if(!Z(t)){t.username="";for(var r=0;r<n.length;r++)t.username+=$(n[r],Q)}})),password:De(Ie,(function(e){var t=k(this),n=h(String(e));if(!Z(t)){t.password="";for(var r=0;r<n.length;r++)t.password+=$(n[r],Q)}})),host:De(Ue,(function(e){var t=k(this);t.cannotBeABaseURL||Ae(t,String(e),he)})),hostname:De(Oe,(function(e){var t=k(this);t.cannotBeABaseURL||Ae(t,String(e),de)})),port:De(_e,(function(e){var t=k(this);Z(t)||(""==(e=String(e))?t.port=null:Ae(t,e,ve))})),pathname:De(Me,(function(e){var t=k(this);t.cannotBeABaseURL||(t.path=[],Ae(t,e+"",be))})),search:De(ze,(function(e){var t=k(this);""==(e=String(e))?t.query=null:("?"==e.charAt(0)&&(e=e.slice(1)),t.query="",Ae(t,e,Ee)),w(t.searchParams).updateSearchParams(t.query)})),searchParams:De(Pe),hash:De(je,(function(e){var t=k(this);""!=(e=String(e))?("#"==e.charAt(0)&&(e=e.slice(1)),t.fragment="",Ae(t,e,ke)):t.fragment=null}))}),l(Fe,"toJSON",(function(){return Te.call(this)}),{enumerable:!0}),l(Fe,"toString",(function(){return Te.call(this)}),{enumerable:!0}),b){var Ne=b.createObjectURL,Be=b.revokeObjectURL;Ne&&l(Se,"createObjectURL",(function(e){return Ne.apply(b,arguments)})),Be&&l(Se,"revokeObjectURL",(function(e){return Be.apply(b,arguments)}))}y(Se,"URL"),i({global:!0,forced:!a,sham:!o},{U
.dark-mode .navbar-info.navbar-dark .form-control-navbar:focus:-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar:focus::-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar:focus::placeholder {
  color: #fff;
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar:focus,
.dark-mode .navbar-info.navbar-dark .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #4aa3df;
  border-color: #5bace2 !important;
  color: #fff;
}

.dark-mode .navbar-warning {
  background-color: #f39c12;
  color: #1f2d3d;
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar::-webkit-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar::-moz-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar:-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar::-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar::placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar,
.dark-mode .navbar-warning.navbar-light .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #e5910c;
  border-color: #cd820a;
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar:focus::-webkit-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar:focus::-moz-placeholder {
  color: #343a40;
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar:focus:-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar:focus::-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar:focus::placeholder {
  color: #343a40;
}

.dark-mode .navbar-warning.navbar-light .form-control-navbar:focus,
.dark-mode .navbar-warning.navbar-light .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #e08e0b;
  border-color: #cd820a !important;
  color: #343a40;
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar,
.dark-mode .navbar-warning.navbar-dark .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #f4a425;
  border-color: #f5ae3e;
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar:focus::-moz-placeholder {
  color: #fff;
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar:focus:-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar:focus::-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar:focus::placeholder {
  color: #fff;
}

.dark-mode .navbar-warning.navbar-dark .form-control-navbar:focus,
.dark-mode .navbar-warning.navbar-dark .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #f4a62a;
  border-color: #f5ae3e !important;
  color: #fff;
}

.dark-mode .navbar-danger {
  background-color: #e74c3c;
  color: #fff;
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar::-webkit-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar::-moz-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar:-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar::-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar::placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar,
.dark-mode .navbar-danger.navbar-light .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #e53b2a;
  border-color: #da2d1b;
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar:focus::-webkit-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar:focus::-moz-placeholder {
  color: #343a40;
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar:focus:-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar:focus::-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar:focus::placeholder {
  color: #343a40;
}

.dark-mode .navbar-danger.navbar-light .form-control-navbar:focus,
.dark-mode .navbar-danger.navbar-light .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #e43725;
  border-color: #da2d1b !important;
  color: #343a40;
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar,
.dark-mode .navbar-danger.navbar-dark .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #e95d4e;
  border-color: #ec7265;
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar:focus::-moz-placeholder {
  color: #fff;
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar:focus:-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar:focus::-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar:focus::placeholder {
  color: #fff;
}

.dark-mode .navbar-danger.navbar-dark .form-control-navbar:focus,
.dark-mode .navbar-danger.navbar-dark .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #ea6153;
  border-color: #ec7265 !important;
  color: #fff;
}

.dark-mode .navbar-lightblue {
  background-color: #86bad8;
  color: #1f2d3d;
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar::-webkit-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar::-moz-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar:-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar::-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar::placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar,
.dark-mode .navbar-lightblue.navbar-light .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #76b1d3;
  border-color: #63a6cd;
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar:focus::-webkit-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar:focus::-moz-placeholder {
  color: #343a40;
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar:focus:-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar:focus::-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar:focus::placeholder {
  color: #343a40;
}

.dark-mode .navbar-lightblue.navbar-light .form-control-navbar:focus,
.dark-mode .navbar-lightblue.navbar-light .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #72afd2;
  border-color: #63a6cd !important;
  color: #343a40;
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar,
.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #95c3dd;
  border-color: #a9cee3;
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar:focus::-moz-placeholder {
  color: #fff;
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar:focus:-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar:focus::-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar:focus::placeholder {
  color: #fff;
}

.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar:focus,
.dark-mode .navbar-lightblue.navbar-dark .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #99c5de;
  border-color: #a9cee3 !important;
  color: #fff;
}

.dark-mode .navbar-navy {
  background-color: #002c59;
  color: #fff;
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar::-webkit-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar::-moz-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar:-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar::-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar::placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar,
.dark-mode .navbar-navy.navbar-light .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #002244;
  border-color: #00152b;
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar:focus::-webkit-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar:focus::-moz-placeholder {
  color: #343a40;
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar:focus:-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar:focus::-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar:focus::placeholder {
  color: #343a40;
}

.dark-mode .navbar-navy.navbar-light .form-control-navbar:focus,
.dark-mode .navbar-navy.navbar-light .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #001f3f;
  border-color: #00152b !important;
  color: #343a40;
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar,
.dark-mode .navbar-navy.navbar-dark .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #00366d;
  border-color: #004286;
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar:focus::-moz-placeholder {
  color: #fff;
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar:focus:-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar:focus::-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar:focus::placeholder {
  color: #fff;
}

.dark-mode .navbar-navy.navbar-dark .form-control-navbar:focus,
.dark-mode .navbar-navy.navbar-dark .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #003872;
  border-color: #004286 !important;
  color: #fff;
}

.dark-mode .navbar-olive {
  background-color: #74c8a3;
  color: #1f2d3d;
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar::-webkit-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar::-moz-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar:-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar::-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar::placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar,
.dark-mode .navbar-olive.navbar-light .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #66c299;
  border-color: #53bb8d;
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar:focus::-webkit-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar:focus::-moz-placeholder {
  color: #343a40;
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar:focus:-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar:focus::-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar:focus::placeholder {
  color: #343a40;
}

.dark-mode .navbar-olive.navbar-light .form-control-navbar:focus,
.dark-mode .navbar-olive.navbar-light .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #62c096;
  border-color: #53bb8d !important;
  color: #343a40;
}

.dark-mode .navbar-olive.navbar-dark .form-control-navbar::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-olive.navbar-dark .form-control-navbar::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-olive.navbar-dark .form-control-navbar:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-olive.navbar-dark .form-control-navbar::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-olive.navbar-dark .form-control-navbar::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-olive.navbar-dark .form-control-navbar,
.dark-mode .navbar-olive.navbar-dark .form-control-navbabootstrap-datetimepicker-widget table td.active:hover{background-color:#4b545c;color:#fff}.card{box-shadow:0 0 1px rgba(0,0,0,.125),0 1px 3px rgba(0,0,0,.2);margin-bottom:1rem}.card.bg-dark .card-header{border-color:#383f45}.card.bg-dark,.card.bg-dark .card-body{color:#fff}.card.maximized-card{height:100%!important;left:0;max-height:100%!important;max-width:100%!important;position:fixed;top:0;width:100%!important;z-index:1040}.card.maximized-card.was-collapsed .card-body{display:block!important}.card.maximized-card .card-body{overflow:auto}.card.maximized-card [data-card-widgett=collapse]{display:none}.card.maximized-card .card-footer,.card.maximized-card .card-header{border-radius:0!important}.card.collapsed-card .card-body,.card.collapsed-card .card-footer{display:none}.card .nav.flex-column:not(.nav-sidebar)>li{border-bottom:1px solid rgba(0,0,0,.125);margin:0}.card .nav.flex-column:not(.nav-sidebar)>li:last-of-type{border-bottom:0}.card.height-control .card-body{max-height:300px;overflow:auto}.card .border-right{border-right:1px solid rgba(0,0,0,.125)}.card .border-left{border-left:1px solid rgba(0,0,0,.125)}.card.card-tabs:not(.card-outline)>.card-header{border-bottom:0}.card.card-tabs:not(.card-outline)>.card-header .nav-item:first-child .nav-link{border-left-color:transparent}.card.card-tabs.card-outline .nav-item{border-bottom:0}.card.card-tabs.card-outline .nav-item:first-child .nav-link{border-left:0;margin-left:0}.card.card-tabs .card-tools{margin:.3rem .5rem}.card.card-tabs:not(.expanding-card).collapsed-card .card-header{border-bottom:0}.card.card-tabs:not(.expanding-card).collapsed-card .card-header .nav-tabs{border-bottom:0}.card.card-tabs:not(.expanding-card).collapsed-card .card-header .nav-tabs .nav-item{margin-bottom:0}.card.card-tabs.expanding-card .card-header .nav-tabs .nav-item{margin-bottom:-1px}.card.card-outline-tabs{border-top:0}.card.card-outline-tabs .card-header .nav-item:first-child .nav-link{border-left:0;margin-left:0}.card.card-outline-tabs .card-header a{border-top:3px solid transparent}.card.card-outline-tabs .card-header a:hover{border-top:3px solid #dee2e6}.card.card-outline-tabs .card-header a.active:hover{margin-top:0}.card.card-outline-tabs .card-tools{margin:.5rem .5rem .3rem}.card.card-outline-tabs:not(.expanding-card).collapsed-card .card-header{border-bottom:0}.card.card-outline-tabs:not(.expanding-card).collapsed-card .card-header .nav-tabs{border-bottom:0}.card.card-outline-tabs:not(.expanding-card).collapsed-card .card-header .nav-tabs .nav-item{margin-bottom:0}.card.card-outline-tabs.expanding-card .card-header .nav-tabs .nav-item{margin-bottom:-1px}html.maximized-card{overflow:hidden}.card-body::after,.card-footer::after,.card-header::after{display:block;clear:both;content:""}.card-header{background-color:transparent;border-bottom:1px solid rgba(0,0,0,.125);padding:.75rem 1.25rem;position:relative;border-top-left-radius:.25rem;border-top-right-radius:.25rem}.collapsed-card .card-header{border-bottom:0}.card-header>.card-tools{float:right;margin-right:-.625rem}.card-header>.card-tools .input-group,.card-header>.card-tools .nav,.card-header>.card-tools .pagination{margin-bottom:-.3rem;margin-top:-.3rem}.card-header>.card-tools [data-toggle=tooltip]{position:relative}.card-title{float:left;font-size:1.1rem;font-weight:400;margin:0}.card-text{clear:both}.btn-tool{background-color:transparent;color:#adb5bd;font-size:.875rem;margin:-.75rem 0;padding:.25rem .5rem}.btn-group.show .btn-tool,.btn-tool:hover{color:#495057}.btn-tool:focus,.show .btn-tool{box-shadow:none!important}.text-sm .card-title{font-size:1rem}.text-sm .nav-link{padding:.4rem .8rem}.card-body>.table{margin-bottom:0}.card-body>.table>thead>tr>td,.card-body>.table>thead>tr>th{border-top-width:0}.card-body .fc{margin-top:5px}.card-body .full-width-chart{margin:-19px}.card-body.p-0 .full-width-chart{margin:-9px}.chart-legend{padding-left:0;list-style:none;margin:10px 0}@media (max-width:576px){.chart-legend>li{float:left;margin-right:10px}}.card-comments{background-color:#f8f9fa}.card-comments .card-comment{border-bottom:1px solid #e9ecef;padding:8px 0}.card-comments .card-comment::after{display:block;clear:both;content:""}.card-comments .card-comment:last-of-type{border-bottom:0}.card-comments .card-comment:first-of-type{padding-top:0}.card-comments .card-comment img{height:1.875rem;width:1.875rem;float:left}.card-comments .comment-text{color:#78838e;margin-left:40px}.card-comments .username{color:#495057;display:block;font-weight:600}.card-comments .text-muted{font-size:12px;font-weight:400}.todo-list{list-style:none;margin:0;overflow:auto;padding:0}.todo-list>li{border-radius:2px;background-color:#f8f9fa;border-left:2px solid #e9ecef;color:#495057;margin-bottom:2px;padding:10px}.todo-list>li:last-of-type{margin-bottom:0}.todo-list>li>input[type=checkbox]{margin:0 10px 0 5px}.todo-list>li .text{display:inline-block;font-weight:600;margin-left:5px}.todo-list>li .badge{font-size:.7rem;margin-left:10px}.todo-list>li .tools{color:#dc3545;display:none;float:right}.todo-list>li .tools>.fa,.todo-list>li .tools>.fab,.todo-list>li .tools>.fad,.todo-list>li .tools>.fal,.todo-list>li .tools>.far,.todo-list>li .tools>.fas,.todo-list>li .tools>.ion,.todo-list>li .tools>.svg-inline--fa{cursor:pointer;margin-right:5px}.todo-list>li:hover .tools{display:inline-block}.todo-list>li.done{color:#697582}.todo-list>li.done .text{font-weight:500;text-decoration:line-through}.todo-list>li.done .badge{background-color:#adb5bd!important}.todo-list .primary{border-left-color:#007bff}.todo-list .secondary{border-left-color:#6c757d}.todo-list .success{border-left-color:#28a745}.todo-list .info{border-left-color:#17a2b8}.todo-list .warning{border-left-color:#ffc107}.todo-list .danger{border-left-color:#dc3545}.todo-list .light{border-left-color:#f8f9fa}.todo-list .dark{border-left-color:#343a40}.todo-list .lightblue{border-left-color:#3c8dbc}.todo-list .navy{border-left-color:#001f3f}.todo-list .olive{border-left-color:#3d9970}.todo-list .lime{border-left-color:#01ff70}.todo-list .fuchsia{border-left-color:#f012be}.todo-list .maroon{border-left-color:#d81b60}.todo-list .blue{border-left-color:#007bff}.todo-list .indigo{border-left-color:#6610f2}.todo-list .purple{border-left-color:#6f42c1}.todo-list .pink{border-left-color:#e83e8c}.todo-list .red{border-left-color:#dc3545}.todo-list .orange{border-left-color:#fd7e14}.todo-list .yellow{border-left-color:#ffc107}.todo-list .green{border-left-color:#28a745}.todo-list .teal{border-left-color:#20c997}.todo-list .cyan{border-left-color:#17a2b8}.todo-list .white{border-left-color:#fff}.todo-list .gray{border-left-color:#6c757d}.todo-list .gray-dark{border-left-color:#343a40}.todo-list .handle{cursor:move;display:inline-block;margin:0 5px}.card-input{max-width:200px}.card-default .nav-item:first-child .nav-link{border-left:0}.dark-mode .card-primary:not(.card-outline)>.card-header{background-color:#3f6791}.dark-mode .card-primary:not(.card-outline)>.card-header,.dark-mode .card-primary:not(.card-outline)>.card-header a{color:#fff}.dark-mode .card-primary:not(.card-outline)>.card-header a.active{color:#1f2d3d}.dark-mode .card-primary.card-outline{border-top:3px solid #3f6791}.dark-mode .card-primary.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.dark-mode .card-primary.card-outline-tabs>.card-header a.active,.dark-mode .card-primary.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #3f6791}.dark-mode .bg-gradient-primary>.card-header .btn-tool,.dark-mode .bg-primary>.card-header .btn-tool,.dark-mode .card-primary:not(.card-outline)>.card-header .btn-tool{color:rgba(255,255,255,.8)}.dark-mode .bg-gradient-primary>.card-header .btn-tool:hover,.dark-mode .bg-primary>.card-header .btn-tool:hover,.dark-mode .card-primary:not(.card-outline)>.card-header .btn-tool:hover{color:#fff}.dark-mode .card.bg-gradient-primary .bootstrap-datetimepicker-widget .table td,.dark-mode .card.bg-gradient-primary .bootstrap-datetimepicker-widget .table th,.dark-mode .card.bg-primary .bootstrap-datetimepicker-widget .table td,.dark-mode .card.bg-primary .bootstrap-datetimepicker-widget .table th{border:none}.dark-mode .card.bg-gradient-primary .bootstrap-datetimepicker-widget table td.day:hover,.dark-mode .card.bg-gradient-primary .bootstrap-datetimepicker-widget table td.hour:hover,.dark-mode .card.bg-gradient-primary .bootstrap-datetimepicker-widget table td.minute:hover,.dark-mode .card.bg-gradient-primary .bootstrap-datetimepicker-widget table td.second:hover,.dark-mode .card.bg-gradient-primary .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,.dark-mode .card.bg-primary .bootstrap-datetimepicker-widget table td.day:hover,.dark-mode .card.bg-primary .bootstrap-datetimepicker-widget table td.hour:hover,.dark-mode .card.bg-primary .bootstrap-datetimepicker-widget table td.minute:hover,.dark-mode .card.bg-primary .bootstrap-datetimepicker-widget table td.second:hover,.dark-mode .card.bg-primary .bootstrap-datetimepicker-widget table thead tr:first-child th:hover{background-color:#335375;color:#fff}.dark-mode .card.bg-gradient-primary .bootstrap-datetimepicker-widget table td.today::before,.dark-mode .card.bg-primary .bootstrap-datetimepicker-widget table td.today::before{border-bottom-color:#fff}.dark-mode .card.bg-gradient-primary .bootstrap-datetimepicker-widget table td.active,.dark-mode .card.bg-gradient-primary .bootstrap-datetimepicker-widget table td.active:hover,.dark-mode .card.bg-primary .bootstrap-datetimepicker-widget table td.active,.dark-mode .card.bg-primary .bootstrap-datetimepicker-widget table td.active:hover{background-color:#5080b3;color:#fff}.dark-mode .card-secondary:not(.card-outline)>.card-header{background-color:#6c757d}.dark-mode .card-secondary:not(.card-outline)>.card-header,.dark-mode .card-secondary:not(.card-outline)>.card-header a{color:#fff}.dark-mode .card-secondary:not(.card-outline)>.card-header a.active{color:#1f2d3d}.dark-mode .card-secondary.card-outline{border-top:3px solid #6c757d}.dark-mode .card-secondary.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.dark-mode .card-secondary.card-outline-tabs>.card-header a.active,.dark-mode .card-secondary.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #6c757d}.dark-mode .bg-gradient-secondary>.card-header .btn-tool,.dark-mode .bg-secondary>.card-header .btn-tool,.dark-mode .card-secondary:not(.card-outline)>.card-header .btn-tool{color:rgba(255,255,255,.8)}.dark-mode .bg-gradient-secondary>.card-header .btn-tool:hover,.dark-mode .bg-secondary>.card-header .btn-tool:hover,.dark-mode .card-secondary:not(.card-outline)>.card-header .btn-tool:hover{color:#fff}.dark-mode .card.bg-gradient-secondary .bootstrap-datetimepicker-widget .table td,.dark-mode .card.bg-gradient-secondary .bootstrap-datetimepicker-widget .table th,.dark-mode .card.bg-secondary .bootstrap-datetimepicker-widget .table td,.dark-mode .card.bg-secondary .bootstrap-datetimepicker-widget .table th{border:none}.dark-mode .card.bg-gradient-secondary .bootstrap-datetimepicker-widget table td.day:hover,.dark-mode .card.bg-gradient-secondary .bootstrap-datetimepicker-widget table td.hour:hover,.dark-mode .card.bg-gradient-secondary .bootstrap-datetimepicker-widget table td.minute:hover,.dark-mode .card.bg-gradient-secondary .bootstrap-datetimepicker-widget table td.second:hover,.dark-mode .card.bg-gradient-secondary .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,.dark-mode .card.bg-secondary .bootstrap-datetimepicker-widget table td.day:hover,.dark-mode .card.bg-secondary .bootstrap-datetimepicker-widget table td.hour:hover,.dark-mode .card.bg-secondary .bootstrap-datetimepicker-widget table td.minute:hover,.dark-mode .card.bg-secondary .bootstrap-datetimepicker-widget table td.second:hover,.dark-mode .card.bg-secondary .bootstrap-datetimepicker-widget table thead tr:first-child th:hover{background-color:#596167;color:#fff}.dark-mode .card.bg-gradient-secondary .bootstrap-datetimepicker-widget table td.today::before,.dark-mode .card.bg-secondary .bootstrap-datetimepicker-widget table td.today::before{border-bottom-color:#fff}.dark-mode .card.bg-gradient-secondary .bootstrap-datetimepicker-widget table td.active,.dark-mode .card.bg-gradient-secondary .bootstrap-datetimepicker-widget table td.active:hover,.dark-mode .card.bg-secondary .bootstrap-datetimepicker-widget table td.active,.dark-mode .card.bg-secondary .bootstrap-datetimepicker-widget table td.active:hover{background-color:#868e96;color:#fff}.dark-mode .card-success:not(.card-outline)>.card-header{background-color:#00bc8c}.dark-mode .card-success:not(.card-outline)>.card-header,.dark-mode .card-success:not(.card-outline)>.card-header a{color:#fff}.dark-mode .card-success:not(.card-outline)>.card-header a.active{color:#1f2d3d}.dark-mode .card-success.card-outline{border-top:3px solid #00bc8c}.dark-mode .card-success.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.dark-mode .card-success.card-outline-tabs>.card-header a.active,.dark-mode .card-success.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #00bc8c}.dark-mode .bg-gradient-success>.card-header .btn-tool,.dark-mode .bg-success>.card-header .btn-tool,.dark-mode .card-success:not(.card-outline)>.card-header .btn-tool{color:rgba(255,255,255,.8)}.dark-mode .bg-gradient-success>.card-header .btn-tool:hover,.dark-mode .bg-success>.card-header .btn-tool:hover,.dark-mode .card-success:not(.card-outline)>.card-header .btn-tool:hover{color:#fff}.dark-mode .card.bg-gradient-success .bootstrap-datetimepicker-widget .table td,.dark-mode .card.bg-gradient-success .bootstrap-datetimepicker-widget .table th,.dark-mode .card.bg-success .bootstrap-datetimepicker-widget .table td,.dark-mode .card.bg-success .bootstrap-datetimepicker-widget .table th{border:none}.dark-mode .card.bg-gradient-success .bootstrap-datetimepicker-widget table td.day:hover,.dark-mode .card.bg-gradient-success .bootstrap-datetimepicker-widget table td.hour:hover,.dark-mode .card.bg-gradient-success .bootstrap-datetimepicker-widget table td.minute:hover,.dark-mode .card.bg-gradient-success .bootstrap-datetimepicker-widget table td.second:hover,.dark-mode .card.bg-gradient-success .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,.dark-mode .card.bg-success .bootstrap-datetimepicker-widget table td.day:hover,.dark-mode .card.bg-success .bootstrap-datetimepicker-widget table td.hour:hover,.dark-mode .card.bg-success .bootstrap-datetimepicker-widget table td.minute:hover,.dark-mode .card.bg-success .bootstrap-datetimepicker-widget table td.second:hover,.dark-mode .card.bg-success .bootstrap-datetimepicker-widget table thead tr:first-child th:hover{background-color:#00936e;color:#fff}.dark-mode .card.bg-gradient-success .bootstrap-datetimepicker-widget table td.today::before,.dark-mode .card.bg-success .bootstrap-datetimepicker-widget table td.today::before{border-bottom-color:#fff}.dark-mode .card.bg-gradient-success .bootstrap-datetimepicker-widget table td.active,.dark-mode .card.bg-gradient-success .bootstrap-datetimepicker-widget table td.active:hover,.dark-mode .card.bg-success .bootstrap-datetimepicker-widget table td.active,.dark-mode .card.bg-success .bootstrap-datetimepicker-widget table td.active:hover{background-color:#00efb2;color:#fff}.dark-mode .card-info:not(.card-outline)>.card-header{background-color:#3498db}.dark-mode .card-info:not(.card-outline)>.card-header,.dark-mode .card-info:not(.card-outline)>.card-header a{color:#fff}.dark-mode .card-info:not(.card-outline)>.card-header a.active{color:#1f2d3d}.dark-mode .card-info.card-outline{border-top:3px solid #3498db}.dark-mode .card-info.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.dark-mode .card-info.card-outline-tabs>.card-header a.active,.dark-mode .card-info.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #3498db}.dark-mode .bg-gradient-info>.card-header .btn-tool,.dark-mode .bg-info>.card-header .btn-tool,.dark-mode .card-info:not(.card-outline)>.card-header .btn-tool{color:rgba(255,255,255,.8)}.dark-mode .bg-gradient-info>.card-header .btn-tool:hover,.dark-mode .bg-info>.card-header .btn-tool:hover,.dark-mode .card-info:not(.card-outline)>.card-header .btn-tool:hover{color:#fff}.drns a blank string if smallest breakpoint, otherwise returns the name with a dash in front.\n// Useful for making responsive utilities.\n//\n//    >> breakpoint-infix(xs, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px))\n//    \"\"  (Returns a blank string)\n//    >> breakpoint-infix(sm, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px))\n//    \"-sm\"\n@function breakpoint-infix($name, $breakpoints: $grid-breakpoints) {\n  @return if(breakpoint-min($name, $breakpoints) == null, \"\", \"-#{$name}\");\n}\n\n// Media of at least the minimum breakpoint width. No query for the smallest breakpoint.\n// Makes the @content apply to the given breakpoint and wider.\n@mixin media-breakpoint-up($name, $breakpoints: $grid-breakpoints) {\n  $min: breakpoint-min($name, $breakpoints);\n  @if $min {\n    @media (min-width: $min) {\n      @content;\n    }\n  } @else {\n    @content;\n  }\n}\n\n// Media of at most the maximum breakpoint width. No query for the largest breakpoint.\n// Makes the @content apply to the given breakpoint and narrower.\n@mixin media-breakpoint-down($name, $breakpoints: $grid-breakpoints) {\n  $max: breakpoint-max($name, $breakpoints);\n  @if $max {\n    @media (max-width: $max) {\n      @content;\n    }\n  } @else {\n    @content;\n  }\n}\n\n// Media that spans multiple breakpoint widths.\n// Makes the @content apply between the min and max breakpoints\n@mixin media-breakpoint-between($lower, $upper, $breakpoints: $grid-breakpoints) {\n  $min: breakpoint-min($lower, $breakpoints);\n  $max: breakpoint-max($upper, $breakpoints);\n\n  @if $min != null and $max != null {\n    @media (min-width: $min) and (max-width: $max) {\n      @content;\n    }\n  } @else if $max == null {\n    @include media-breakpoint-up($lower, $breakpoints) {\n      @content;\n    }\n  } @else if $min == null {\n    @include media-breakpoint-down($upper, $breakpoints) {\n      @content;\n    }\n  }\n}\n\n// Media between the breakpoint's minimum and maximum widths.\n// No minimum for the smallest breakpoint, and no maximum for the largest one.\n// Makes the @content apply only to the given breakpoint, not viewports any wider or narrower.\n@mixin media-breakpoint-only($name, $breakpoints: $grid-breakpoints) {\n  $min: breakpoint-min($name, $breakpoints);\n  $max: breakpoint-max($name, $breakpoints);\n\n  @if $min != null and $max != null {\n    @media (min-width: $min) and (max-width: $max) {\n      @content;\n    }\n  } @else if $max == null {\n    @include media-breakpoint-up($name, $breakpoints) {\n      @content;\n    }\n  } @else if $min == null {\n    @include media-breakpoint-down($name, $breakpoints) {\n      @content;\n    }\n  }\n}\n","// Framework grid generation\n//\n// Used only by Bootstrap to generate the correct number of grid classes given\n// any value of `$grid-columns`.\n\n@mixin make-grid-columns($columns: $grid-columns, $gutter: $grid-gutter-width, $breakpoints: $grid-breakpoints) {\n  // Common properties for all breakpoints\n  %grid-column {\n    position: relative;\n    width: 100%;\n    padding-right: $gutter * .5;\n    padding-left: $gutter * .5;\n  }\n\n  @each $breakpoint in map-keys($breakpoints) {\n    $infix: breakpoint-infix($breakpoint, $breakpoints);\n\n    @if $columns > 0 {\n      // Allow columns to stretch full width below their breakpoints\n      @for $i from 1 through $columns {\n        .col#{$infix}-#{$i} {\n          @extend %grid-column;\n        }\n      }\n    }\n\n    .col#{$infix},\n    .col#{$infix}-auto {\n      @extend %grid-column;\n    }\n\n    @include media-breakpoint-up($breakpoint, $breakpoints) {\n      // Provide basic `.col-{bp}` classes for equal-width flexbox columns\n      .col#{$infix} {\n        flex-basis: 0;\n        flex-grow: 1;\n        max-width: 100%;\n      }\n\n      @if $grid-row-columns > 0 {\n        @for $i from 1 through $grid-row-columns {\n          .row-cols#{$infix}-#{$i} {\n            @include row-cols($i);\n          }\n        }\n      }\n\n      .col#{$infix}-auto {\n        @include make-col-auto();\n      }\n\n      @if $columns > 0 {\n        @for $i from 1 through $columns {\n          .col#{$infix}-#{$i} {\n            @include make-col($i, $columns);\n          }\n        }\n      }\n\n      .order#{$infix}-first { order: -1; }\n\n      .order#{$infix}-last { order: $columns + 1; }\n\n      @for $i from 0 through $columns {\n        .order#{$infix}-#{$i} { order: $i; }\n      }\n\n      @if $columns > 0 {\n        // `$columns - 1` because offsetting by the width of an entire row isn't possible\n        @for $i from 0 through ($columns - 1) {\n          @if not ($infix == \"\" and $i == 0) { // Avoid emitting useless .offset-0\n            .offset#{$infix}-#{$i} {\n              @include make-col-offset($i, $columns);\n            }\n          }\n        }\n      }\n    }\n  }\n}\n","//\n// Basic Bootstrap table\n//\n\n.table {\n  width: 100%;\n  margin-bottom: $spacer;\n  color: $table-color;\n  background-color: $table-bg; // Reset for nesting within parents with `background-color`.\n\n  th,\n  td {\n    padding: $table-cell-padding;\n    vertical-align: top;\n    border-top: $table-border-width solid $table-border-color;\n  }\n\n  thead th {\n    vertical-align: bottom;\n    border-bottom: (2 * $table-border-width) solid $table-border-color;\n  }\n\n  tbody + tbody {\n    border-top: (2 * $table-border-width) solid $table-border-color;\n  }\n}\n\n\n//\n// Condensed table w/ half padding\n//\n\n.table-sm {\n  th,\n  td {\n    padding: $table-cell-padding-sm;\n  }\n}\n\n\n// Border versions\n//\n// Add or remove borders all around the table and between all the columns.\n\n.table-bordered {\n  border: $table-border-width solid $table-border-color;\n\n  th,\n  td {\n    border: $table-border-width solid $table-border-color;\n  }\n\n  thead {\n    th,\n    td {\n      border-bottom-width: 2 * $table-border-width;\n    }\n  }\n}\n\n.table-borderless {\n  th,\n  td,\n  thead th,\n  tbody + tbody {\n    border: 0;\n  }\n}\n\n// Zebra-striping\n//\n// Default zebra-stripe styles (alternating gray and transparent backgrounds)\n\n.table-striped {\n  tbody tr:nth-of-type(#{$table-striped-order}) {\n    background-color: $table-accent-bg;\n  }\n}\n\n\n// Hover effect\n//\n// Placed here since it has to come after the potential zebra striping\n\n.table-hover {\n  tbody tr {\n    @include hover() {\n      color: $table-hover-color;\n      background-color: $table-hover-bg;\n    }\n  }\n}\n\n\n// Table backgrounds\n//\n// Exact selectors below required to override `.table-striped` and prevent\n// inheritance to nested tables.\n\n@each $color, $value in $theme-colors {\n  @include table-row-variant($color, theme-color-level($color, $table-bg-level), theme-color-level($color, $table-border-level));\n}\n\n@include table-row-variant(active, $table-active-bg);\n\n\n// Dark styles\n//\n// Same table markup, but inverted color scheme: dark background and light text.\n\n// stylelint-disable-next-line no-duplicate-selectors\n.table {\n  .thead-dark {\n    th {\n      color: $table-dark-color;\n      background-color: $table-dark-bg;\n      border-color: $table-dark-border-color;\n    }\n  }\n\n  .thead-light {\n    th {\n      color: $table-head-color;\n      background-color: $table-head-bg;\n      border-color: $table-border-color;\n    }\n  }\n}\n\n.table-dark {\n  color: $table-dark-color;\n  background-color: $table-dark-bg;\n\n  th,\n  td,\n  thead th {\n    border-color: $table-dark-border-color;\n  }\n\n  &.table-bordered {\n    border: 0;\n  }\n\n  &.table-striped {\n    tbody tr:nth-of-type(#{$table-striped-order}) {\n      background-color: $table-dark-accent-bg;\n    }\n  }\n\n  &.table-hover {\n    tbody tr {\n      @include hover() {\n        color: $table-dark-hover-color;\n        background-color: $table-dark-hover-bg;\n      }\n    }\n  }\n}\n\n\n// Responsive tables\n//\n// Generate series of `.table-responsive-*` classes for configuring the screen\n// size of where your table will overflow.\n\n.table-responsive {\n  @each $breakpoint in map-keys($grid-breakpoints) {\n    $next: breakpoint-next($breakpoint, $grid-breakpoints);\n    $infix: breakpoint-infix($next, $grid-breakpoints);\n\n    &#{$infix} {\n      @include media-breakpoint-down($breakpoint) {\n        display: block;\n        width: 100%;\n        overflow-x: auto;\n        -webkit-overflow-scrolling: touch;\n\n        // Prevent double border on horizontal scroll due to use of `display: block;`\n        > .table-bordered {\n          border: 0;\n        }\n      }\n    }\n  }\n}\n","// Tables\n\n@mixin table-row-variant($state, $background, $border: null) {\n  // Exact selectors below required to override `.table-striped` and prevent\n  // inheritance to nested tables.\n  .table-#{$state} {\n    &,\n    > th,\n    > td {\n      background-color: $background;\n    }\n\n    @if $border != null {\n      th,\n      td,\n      thead th,\n      tbody + tbody {\n        border-color: $border;\n      }\n    }\n  }\n\n  // Hover states for `.table-hover`\n  // Note: this is not available for cells or rows within `thead` or `tfoot`.\n  .table-hover {\n    $hover-background: darken($background, 5%);\n\n    .table-#{$state} {\n      @include hover() {\n        background-color: $hover-background;\n\n        > td,\n        > th {\n          background-color: $hover-background;\n        }\n      }\n    }\n  }\n}\n","// stylelint-disable selector-no-qualifying-type\n\n//\n// Textual form controls\n//\n\n.form-control {\n  display: block;\n  width: 100%;\n  height: $input-height;\n  padding: $input-padding-y $input-padding-x;\n  font-family: $input-font-family;\n  @include font-size($input-font-size);\n  font-weight: $input-font-weight;\n  line-height: $input-line-height;\n  color: $input-color;\n  background-color: $input-bg;\n  background-clip: padding-box;\n  border: $input-border-width solid $input-border-color;\n\n  // Note: This has no effect on <select>s in some browsers, due to the limited stylability of `<select>`s in CSS.\n  @include border-radius($input-border-radius, 0);\n\n  @include box-shadow($input-box-shadow);\n  @include transition($input-transition);\n\n  // Unstyle the caret on `<select>`s in IE10+.\n  &::-ms-expand {\n    background-color: transparent;\n    border: 0;\n  }\n\n  // Customize the `:focus` state to imitate native WebKit styles.\n  @include form-control-focus($ignore-warning: true);\n\n  // Placeholder\n  &::placeholder {\n    color: $input-placeholder-color;\n    // Override Firefox's unusual default opacity; see https://github.com/twbs/bootstrap/pull/11526.\n    opacity: 1;\n  }\n\n  // Disabled and read-only inputs\n  //\n  // HTML5 says that controls under a fieldset > legend:first-child won't be\n  // disabled if the fieldset is disabled. Due to implementation difficulty, we\n  // don't honor that edge case; we style them as disabled anyway.\n  &:disabled,\n  &[readonly] {\n    background-color: $input-disabled-bg;\n    // iOS fix for unreadable disabled content; see https://github.com/twbs/bootstrap/issues/11655.\n    opacity: 1;\n  }\n}\n\ninput[type=\"date\"],\ninput[type=\"time\"],\ninput[type=\"datetime-local\"],\ninput[type=\"month\"] {\n  &.form-control {\n    appearance: none; // Fix appearance for date inputs in Safari\n  }\n}\n\nselect.form-control {\n  // Remove select outline from select box in FF\n  &:-moz-focusring {\n    color: transparent;\n    text-shadow: 0 0 0 $input-color;\n  }\n\n  &:focus::-ms-value {\n    // Suppress the nested default white text on blue background highlight given to\n    // the selected option text when the (still closed) <select> receives focus\n    // in IE and (under certain conditions) Edge, as it looks bad and cannot be made to\n    // match the appearance of the native widget.\n    // See https://github.com/twbs/bootstrap/issues/19398.\n    color: $input-color;\n    background-color: $input-bg;\n  }\n}\n\n// Make file inputs better match text inputs by forcing them to new lines.\n.form-control-file,\n.form-control-range {\n  display: block;\n  width: 100%;\n}\n\n\n//\n// Labels\n//\n\n// For use with horizontal and inline forms, when you need the label (or legend)\n// text to align with the form controls.\n.col-form-label {\n  padding-top: add($input-padding-y, $input-border-width);\n  padding-bottom: add($input-padding-y, $input-border-width);\n  margin-bottom: 0; // Override the `<label>/<legend>` default\n  @include font-size(inherit); // Override the `<legend>` default\n  line-height: $input-line-height;\n}\n\n.col-form-label-lg {\n  padding-top: add($input-padding-y-lg, $input-border-width);\n  padding-bottom: add($input-padding-y-lg, $input-border-width);\n  @include font-size($input-font-size-lg);\n  line-height: $input-line-height-lg;\n}\n\n.col-form-label-sm {\n  padding-top: add($input-padding-y-sm, $input-border-width);\n  padding-bottom: add($input-padding-y-sm, $input-border-width);\n  @include font-size($input-font-size-sm);\n  line-height: $input-line-height-sm;\n}\n\n\n// Readonly controls as plain text\n//\n// Apply class to a readonly input to make it appear like regular plain\n// text (without any border, background color, focus indicator)\n\n.form-control-plaintext {\n  display: block;\n  width: 100%;\n  padding: $input-padding-y 0;\n  margin-bottom: 0; // match inputs if this class comes on inputs with default margins\n  @include font-size($input-font-size);\n  line-height: $input-line-height;\n  color: $input-plaintext-color;\n  background-color: transparent;\n  border: solid transparent;\n  border-width: $input-border-width 0;\n\n  &.form-control-sm,\n  &.form-control-lg {\n    padding-right: 0;\n    padding-left: 0;\n  }\n}\n\n\n// Form control sizing\n//\n// Build on `.form-control` with modifier classes to decrease or increase the\n// height and font-size of form controls.\n//\n// Repeated in `_input_group.scss` to avoid Sass extend issues.\n\n.form-control-sm {\n  height: $input-height-sm;\n  padding: $input-padding-y-sm $input-padding-x-sm;\n  @include font-size($input-font-size-sm);\n  line-height: $input-line-height-sm;\n  @include border-radius($input-border-radius-sm);\n}\n\n.form-control-lg {\n  height: $input-height-lg;\n  padding: $input-padding-y-lg $input-padding-x-lg;\n  @include font-size($input-font-size-lg);\n  line-height: $input-line-height-lg;\n  @include border-radius($input-border-radius-lg);\n}\n\n// stylelint-disable-next-line no-duplicate-selectors\nselect.form-control {\n  &[size],\n  &[multiple] {\n    height: auto;\n  }\n}\n\ntextarea.form-control {\n  height: auto;\n}\n\n// Form groups\n//\n// Designed to help with the organization and spacing of vertical forms. For\n// horizontal forms, use the predefined grid classes.\n\n.form-group {\n  margin-bottom: $form-group-margin-bottom;\n}\n\n.form-text {\n  display: block;\n  margin-top: $form-text-margin-top;\n}\n\n\n// Form grid\n//\n// Special replacement for our grid system's `.row` for tighter form layouts.\n\n.form-row {\n  display: flex;\n  flex-wrap: wrap;\n  margin-right: -$form-grid-gutter-width * .5;\n  margin-left: -$form-grid-gutter-width * .5;\n\n  > .col,\n  > [class*=\"col-\"] {\n    padding-right: $form-grid-gutter-width * .5;\n    padding-left: $form-grid-gutter-width * .5;\n  }\n}\n\n\n// Checkboxes and radios\n//\n// Indent the labels to position radios/checkboxes as hanging controls.\n\n.form-check {\n  position: relative;\n  display: block;\n  padding-left: $form-check-input-gutter;\n}\n\n.form-check-input {\n  position: absolute;\n  margin-top: $form-check-input-margin-y;\n  margin-left: -$form-check-input-gutter;\n\n  // Use [disabled] and :disabled for workaround https://github.com/twbs/bootstrap/issues/28247\n  &[disabled] ~ .form-check-label,\n  &:disabled ~ .form-check-label {\n    color: $text-muted;\n  }\n}\n\n.form-check-label {\n  margin-bottom: 0; // Override default `<label>` bottom margin\n}\n\n.form-check-inline {\n  display: inline-flex;\n  align-items: center;\n  padding-left: 0; // Override base .form-check\n  margin-right: $form-check-inline-margin-x;\n\n  // Undo .form-check-input defaults and add some `margin-right`.\n  .form-check-input {\n    position: static;\n    margin-top: 0;\n    margin-right: $form-check-inline-input-margin-x;\n    margin-left: 0;\n  }\n}\n\n\n// Form validation\n//\n// Provide feedback to users wh