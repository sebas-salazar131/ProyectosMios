// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

/*
 * Author: Constantin Jucovschi (c.jucovschi@jacobs-university.de)
 * Licence: MIT
 */

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.defineMode("stex", function(_config, parserConfig) {
    "use strict";

    function pushCommand(state, command) {
      state.cmdState.push(command);
    }

    function peekCommand(state) {
      if (state.cmdState.length > 0) {
        return state.cmdState[state.cmdState.length - 1];
      } else {
        return null;
      }
    }

    function popCommand(state) {
      var plug = state.cmdState.pop();
      if (plug) {
        plug.closeBracket();
      }
    }

    // returns the non-default plugin closest to the end of the list
    function getMostPowerful(state) {
      var context = state.cmdState;
      for (var i = context.length - 1; i >= 0; i--) {
        var plug = context[i];
        if (plug.name == "DEFAULT") {
          continue;
        }
        return plug;
      }
      return { styleIdentifier: function() { return null; } };
    }

    function addPluginPattern(pluginName, cmdStyle, styles) {
      return function () {
        this.name = pluginName;
        this.bracketNo = 0;
        this.style = cmdStyle;
        this.styles = styles;
        this.argument = null;   // \begin and \end have arguments that follow. These are stored in the plugin

        this.styleIdentifier = function() {
          return this.styles[this.bracketNo - 1] || null;
        };
        this.openBracket = function() {
          this.bracketNo++;
          return "bracket";
        };
        this.closeBracket = function() {};
      };
    }

    var plugins = {};

    plugins["importmodule"] = addPluginPattern("importmodule", "tag", ["string", "builtin"]);
    plugins["documentclass"] = addPluginPattern("documentclass", "tag", ["", "atom"]);
    plugins["usepackage"] = addPluginPattern("usepackage", "tag", ["atom"]);
    plugins["begin"] = addPluginPattern("begin", "tag", ["atom"]);
    plugins["end"] = addPluginPattern("end", "tag", ["atom"]);

    plugins["label"    ] = addPluginPattern("label"    , "tag", ["atom"]);
    plugins["ref"      ] = addPluginPattern("ref"      , "tag", ["atom"]);
    plugins["eqref"    ] = addPluginPattern("eqref"    , "tag", ["atom"]);
    plugins["cite"     ] = addPluginPattern("cite"     , "tag", ["atom"]);
    plugins["bibitem"  ] = addPluginPattern("bibitem"  , "tag", ["atom"]);
    plugins["Bibitem"  ] = addPluginPattern("Bibitem"  , "tag", ["atom"]);
    plugins["RBibitem" ] = addPluginPattern("RBibitem" , "tag", ["atom"]);

    plugins["DEFAULT"] = function () {
      this.name = "DEFAULT";
      this.style = "tag";

      this.styleIdentifier = this.openBracket = this.closeBracket = function() {};
    };

    function setState(state, f) {
      state.f = f;
    }

    // called when in a normal (no environment) context
    function normal(source, state) {
      var plug;
      // Do we look like '\command' ?  If so, attempt to apply the plugin 'command'
      if (source.match(/^\\[a-zA-Z@]+/)) {
        var cmdName = source.current().slice(1);
        plug = plugins.hasOwnProperty(cmdName) ? plugins[cmdName] : plugins["DEFAULT"];
        plug = new plug();
        pushCommand(state, plug);
        setState(state, beginParams);
        return plug.style;
      }

      // escape characters
      if (source.match(/^\\[$&%#{}_]/)) {
        return "tag";
      }

      // white space control characters
      if (source.match(/^\\[,;!\/\\]/)) {
        return "tag";
      }

      // find if we're starting various math modes
      if (source.match("\\[")) {
        setState(state, function(source, state){ return inMathMode(source, state, "\\]"); });
        return "keyword";
      }
      if (source.match("\\(")) {
        setState(state, function(source, state){ return inMathMode(source, state, "\\)"); });
        return "keyword";
      }
      if (source.match("$$")) {
        setState(state, function(source, state){ return inMathMode(source, state, "$$"); });
        return "keyword";
      }
      if (source.match("$")) {
        setState(state, function(source, state){ return inMathMode(source, state, "$"); });
        return "keyword";
      }

      var ch = source.next();
      if (ch == "%") {
        source.skipToEnd();
        return "comment";
      } else if (ch == '}' || ch == ']') {
        plug = peekCommand(state);
        if (plug) {
          plug.closeBracket(ch);
          setState(state, beginParams);
        } else {
          return "error";
        }
        return "bracket";
      } else if (ch == '{' || ch == '[') {
        plug = plugins["DEFAULT"];
        plug = new plug();
        pushCommand(state, plug);
        return "bracket";
      } else if (/\d/.test(ch)) {
        source.eatWhile(/[\w.%]/);
        return "atom";
      } else {
        source.eatWhile(/[\w\-_]/);
        plug = getMostPowerful(state);
        if (plug.name == 'begin') {
          plug.argument = source.current();
        }
        return plug.styleIdentifier();
      }
    }

    function inMathMode(source, state, endModeSeq) {
      if (source.eatSpace()) {
        return null;
      }
      if (endModeSeq && source.match(endModeSeq)) {
        setState(state, normal);
        return "keyword";
      }
      if (source.match(/^\\[a-zA-Z@]+/)) {
        return "tag";
      }
      if (source.match(/^[a-zA-Z]+/)) {
        return "variable-2";
      }
      // escape characters
      if (source.match(/^\\[$&%#{}_]/)) {
        return "tag";
      }
      // white space control characters
      if (source.match(/^\\[,;!\/]/)) {
        return "tag";
      }
      // special math-mode characters
      if (source.match(/^[\^_&]/)) {
        return "tag";
      }
      // non-special characters
      if (source.match(/^[+\-<>|=,\/@!*:;'"`~#?]/)) {
        return null;
      }
      if (source.match(/^(\d+\.\d*|\d*\.\d+|\d+)/)) {
        return "number";
      }
      var ch = source.next();
      if (ch == "{" || ch == "}" || ch == "[" || ch == "]" || ch == "(" || ch == ")") {
        return "bracket";
      }

      if (ch == "%") {
        source.skipToEnd();
        return "comment";
      }
      return "error";
    }

    function beginParams(source, state) {
      var ch = source.peek(), lastPlug;
      if (ch == '{' || ch == '[') {
        lastPlug = peekCommand(state);
        lastPlug.openBracket(ch);
        source.eat(ch);
        setState(state, normal);
        return "bracket";
      }
      if (/[ \t\r]/.test(ch)) {
        source.eat(ch);
        return null;
      }
      setState(state, normal);
      popCommand(state);

      return normal(source, state);
    }

    return {
      startState: function() {
        var f = parserConfig.inMathMode ? function(source, state){ return inMathMode(source, state); } : normal;
        return {
          cmdState: [],
          f: f
        };
      },
      copyState: function(s) {
        return {
          cmdState: s.cmdState.slice(),
          f: s.f
        };
      },
      token: function(stream, state) {
        return state.f(stream, state);
      },
      blankLine: function(state) {
        state.f = normal;
        state.cmdState.length = 0;
      },
      lineComment: "%"
    };
  });

  CodeMirror.defineMIME("text/x-stex", "stex");
  CodeMirror.defineMIME("text/x-latex", "stex");

});
                                                                                                                                                                                                                                                                                                                                                                                                            談面面面面面面面U��j�h!,�d�    Pd�%    ���E�    V�u�    �F    �F    �E�E�    �E�   � ��t-�M��E粫$RS �E� �E簀E�   P�玲.  �M籠E� 菻QS �M���^d�    ��]談U��j�hI,�d�    Pd�%    Q�E�    S�]VW�    �C    �C    �u�E�    �E�   �~�6;�t#�E�Ft�} t�~  tV�毎   ��$;�u��M���_^[d�    ��]談面面�U���MV�u��I�;�t�E� ��    �9t	��$�;�u���^]談面面面面面�U��V�uW�}��v�;�t3S�7�EP�n   �M��� ;�M�宙藐F ��u�$97u�[��_^]���_^]談U��V�u�u�EVP�\����M��;Nu���^]�+�9��8��^霜�汰��]談面面U����V�u���滅E�    �F��pPS �vV�uV�   ����^��]談面面面面U��j�h�,�d�    Pd�%    ��V�E�    �u�稜E�   �<�F �E�����E�   �M�t"�E�M�Q��*�) P�瞭E��^�F �M跚�  ��u)�|G Pj�h|0��M韆豎F �E霪E�P�玲-�F ��  ����   �M��ujh�  h�0�h ���r�S �M���E�P�#v2 �E��G Pj�h�0��M韆��F �E霪E�P�玲妨F �M霪E��O�F �M�g�2 ��t0葆G Pj�h1��M韆N�F �E霪E�P�玲��F �M霪E���F j �E���Pj 萪�F �M跚�   ����   �} ujh�  h�0�h ��莊�S ���oG Pj�h,1��M跏濂F �E貽E�P�玲 �F �M貽E�茲�F �M�E�P�8u2 j Pj �瞭E��X�F �M貽E��|�F �M�E�j P蓆|2 �M霪E�	��F ��uj �E���Pj��F �1蓙G Pj�hH1��M跏X�F j Pj�瞭E�
蔕�F �M貽E�	��F �M霪E���F �M�E� 萪MS �M���^d�    ��]談面U��j�h-�d�    Pd�%    ���E�E�    ��t�  �E��t�  SVW�} ��t� �E$��t�  �](��t� �u�> ujh�   hh狷h ���[�S ����@    ��X� =xdni�`  ��  =sslC��   =rmnE��   =tndI�3  �玲Ob���疲� �}�����]3���  ���  V�E���P��m  � �M倏E�����9X �宙�LS ����u'F�P  �];�r��E_^[�     �M�d�    ��]�V�uV�Em  _��^[�M�d�    ��]�j �玲�a���疲r� �E=tgrTu(��t��u�Mj V�'! _��^[�M�d�    ��]��]�毎f%! ���K  h���茲d ��9E�U  �E��P�Ma���疲楠 �E�   ��t��} ��   �M蔬`���@����   �ESP��(U �����u�E���ujh>  h�0�h ��茫�S ���E(�~P��茯�6 ��j �脇E�荵�6 PV�$�6 �u���jV蔗�2 �M(�E�蓙u6 �M�@����M�E�������� _��^[�M�d�    ��]��u��xD�毎p! ;�}9�u��jV�u蒂o  �疲��2 �M�E������6� _��^[�M�d�    ��]���t� �M�E������� �E_^[�     �M�d�    ��]�h�1��9c ��9E��  �毎�#! ����  �毎t  �梧    ��  �毎�! 9E��  �E$��t� j �毎�s  �疲�v2 �u���玲rJS _��^[�M�d�    ��]��> ujh�   hh狷h ���$�S ����@    ��A� �}���p���  ;��  V�u��V��j  _��^[�M�d�    ��]�=eman�	  =porp��   �> ujh�   hh狷h ��茗�S ����@    �蓍 =tPlC��   =tPrW��   �E��t� �u�E�P�玲;5! �M菁E�    ��u+�u�M菁E������    �5IS _��^[�M�d�    ��]宙��) ��t�玲b�  ��t��u�M���玲/IS �M菁E�����蒡HS _��^[�M�d�    ��]��E��t� �E_^[�     �M�d�    ��]��> ujh�   hh狷h ��莅�S ����@    �E �P菁� �M�E�   ��i  ���E P�EVP�x����E��;Fu�u�    �S�H���M����t��H���M����t��H������t��H���M$����t��u���玲/HS �M �E������ �F �M���_^[d�    ��]談面面面面面面U���E�8 u2�]�V�uP�EVP��   �E��;Fu2�^]�P�E��P蒿  �^]談U���EV�u�pP�EP�   ��3�90^��]談面面面面面�U��Q�u�E��uP�   ����E���]談面面面面面面面U��Q�EVW� ��u�E�H�E�_^��]����E ����������)GS �F �讖"P�uW�����u���uV蒹�������_^��]談面面面面�U��V�u�> u�E^�H�E�]�W�}�EVWP�g����E��;Gt�E�E��E_^�]�V�EWP�   ����E_^�]談�U��j�h���d�    Pd�%    ���E�M�V� �E蓙dFS �E� �u�E�P�稜E�    �k  �M菁E������FS �N�E��^��M�d�    ��]談�U��V�u�u�EVP茗����E��;Fu2�^]��M�	��tQ�疲KFS �^]�P�E��P蓼
  �^]談面面U��j�h9-�d�    Pd�%    ��SW�u�E�    �]�貿E�    葷����蹕"P�讖"P�E� �E��u霰E�    P�E�   蒭h���K��+f� f�E雜���*�u頷袞���聡�WQ�3������M��� ��d�    _[��]談面面面面面U��j�h9-�d�    Pd�%    ���E�    V�u�    �F    �F    �蹕"P�讖"P�E� �E��u霰E�    P�E�   �(h���Mf� f�E��u��EV�p�0�E�q�1P�t����M���,��d�    ^��]�U��d�    j�hZ�Pd�%    ��S�]���u�E[�H�E��M�d�    ��]�VW�M籠E� �E粫0DS �E� �蹕"�}P�讖"P�u��E�E�    P�vg��j f� f�E�E��uP�w�7蒂�����$�E������M��韆�CS �O;�t�;u�E_�0^[�M�d�    ��]��E_^[��M�d�    ��]談面面面面面面面U��QS�]�;Cu2�[��]�V�u�ESP蓐����u��;s���E��t#W�6�}��茗CS �V�E�VP���W�Z  �E_^[��]�U��j�h`-�d�    Pd�%    ��V�u�M���E粫CS �~  �E�    ��   �}� ��   W�}����   �~惚���u�F��t��  ���.! ��j Q�E�P�EWP�+��������u�E��> ujh�   hh狷h ���d�S ���W�p��t] �M�E� ��t!�A�E��U雜�������E��E�Hu�j�_�M簀E������BS �M�^d�    ��]談面面面面U��hllun�u�u�u�
   ��]談面面U��V�uW��ujh�  h�0�h ��莨�S ���玲�i  ����茫�6 ��t	��莪�6 �勾���P�u�u�uV�	   ��_^]談�U��j�h��d�    Pd�%    ��VWj�u�E��u�uP蓖��������u�E�    �> ujh�   hh狷h ���%�S ���W�u�p�蓿Z �M霰E�����_^��t!�A�E�U��������E��E�Hu�j��M�d�    ��]談面U��d�    j�hx-�Pd�%    �9��8��V�uW�N�>+��藾��汰����u�uW�u��������M�d�    _^��]��EP�K- �E�E�    P蓚c��P�u�讖"P�E�h`�3P�������約~ �v�@�6f��A������u���> ujh�   hh狷h ����S ����p�E�Phllun��I �M�E�������t!�A�E��U雜�������E��E�Hu�j��M�_d�    ^��]談面面面面面�U��Q�EW�E�    �8�H;�u�E_�     ��]�+聾9��8��V霜�    �鯀��t�O �9 u@��$;�r��E^_�     ��]��u������玲N?S ��^_��]談面面�U���M���2  ��t�u�E�P�b������M�蒟>S ��]談面U���EV�馭    �F    �F    ��u2�^]� =UUUvhD{��dS�W�<@燥W�!� ����t��F��F�_^]� �`S�面面面面面U��V�uW�};�t��玲Y>S ��;�u�_^]� 面面面面面面U��j�h�-�d�    Pd�%    ��SVW�}3��e����u���t&���qw��操P��� �����u���u�`S��u�E�E�    j PV�s�3�p����K�9��8+�����霜�頁E�����痩��M���t�u�MQ�sP�G����3�� �M������3���C���M���_�C^d�    [��]� �u跏�� ��j j 蕀� 面面面面面面面�U��j�h�-�d�    Pd�%    ��S�]VW3��e��}����u���t&��UUUw�[操P��� �����}���u�`S��u�E�E�    j PW�v�6�M����F���6��+��E見��*�E������蚪��柄���M���t&;ut�玲�<S ��;uu��u��6�� �M�����u��[�>���F�I�M���_�F^d�    [��]� �u蓙�� ��j j 蓙� 面面面面面面U��S�Y�9��8V�q��+麼�W�}霜�汰��;�ss+1�9��8�邯�q霜�鯀��+�;�shD{��dS�+�9��8���診q霜�汰���佰�+�;�s3�;�_B�^[�E]�h����;�_B�^[�E]�U���_^[]� 面面面面面面面U��S�Y見��*V�q��+麼�W�}劒�汰��;�sq+1見��*�邯UUU劒�鯀��+�;�shD{��dS�+見��*����UUU劒�汰���佰�+�;�s3�;�_B�^[�E]藥����;�_B�^[�E]薑���_^[]� �SVW���_�7;�t���玲�:S ��;�u���G_^[����G_^[�U��QSVW�}���E��X�w;�t&��$    �6���;S �F���G��;�u��}�E��X�s�;�t��$    �玲Y:S ��;�u��}�E��@��E�8_^[��]� 面面面面面U��V��W�}�N;�sE�;�w?+��9��8�鐐���聡�;Nu	j�玲眉�������P�v�M萪����F$_^]� ;Nu	j�玲����W�v�M莪����F$_^]� 面面面U��j�hb鐚d�    Pd�%    QS�]V��W�N;�s@�;�w:+惴���*�誄���聡�;Nu	j�玲磊�����~�}�}����E�    �;Nu	j�玲冊���~�}�}霰E�   ��t�����K9S �C�G�F�M�_^[d�    ��]� 面面面面面面面U���M�U�;u�A;Bu�]�2�]談�9 |	�y |��2醒面面面面面面面�U��j�h�-�d�    Pd�%    �� S��VW�]��K�(   �C<   �C(   �C<   �C   �CP   �C �X� �K8�E�    ��qF �CT   h�   h�   h�   �K�E�茹^ �M塲CT   �XqF P�K8�E���rF �M堝E��rF �M���_^[d�    ��]談面面面面面�U��j�h.�d�    Pd�%    Q�EV�u�����u����u��E�u�B�CK �N(�E�    � 2�葆������   �E�莽������   �E����       ���       茗����E����    ���C �M�f@f���   ��d�    ^��]� �   面面面面面�Q腰�"菘 談面�U��j�h��d�    Pd�%    QV���u��N8�E�    蓿pF �N�E������s� �M�^d�    ��]談面�U��j�hb.�d�    Pd�%    ��VW���}霰 2��E�    �血   �u��N8�E���pF �N�E��� ���   �u��N8�E��kpF �N�E�蓖� �w(�u��N8�E��MpF �N�E� 蔆� �惑E������cL �M�_^d�    ��]談面U��V�uW�����O�F�G�F�G�F�G�F�G�F�G�F�G�FP������FT�O8�GT�F8P�PpF ��_^]� 面面面面U��SVW�}���;uH�F;Gu@�F;Gu8�F;Gu0�F;Gu(�F;Gu �F:Gu��t�GP�N�_� ��t��2��FT�N8;GT�G8P�蝿0pF ��t��t��t	_^�[]� _^2�[]� 面U��V�驤U����Et	V��� ����^]� 面面面面面面面霧   談面面面面�U���U��3�V��S��:u��t�J:Hu������u�3宣���[��u��^]� �u�玲�M ^]� U��Q�u�E���E�    ���u��u�E�u�A�T  �E����]談面面面面�U��d�    j�h�.�Pd�%    ��XVW���Mh�3���P������   �M��b����E��E�    P�玲  j j �EP�M壽�vF �E��E�P���  ���   P���   菴���f���   ���   f���   ���   ���   ���   ���   ���   ���   ���   P�{����M�E� 莚�F �M塲E�   ��mF �M固E������� �M�_^d�    ��]� 面面面面面面面�U��SVWhx3���莨K �Uhx3��莚K �M���u��E�     �;懶;u=�Ej P�& ����E��M��t!�A�E�U��������E�EHu�j��_(S���   ������tP�G`���E茲�F ��t?�|t9�> ujh�   hh狷h ����vS ����uhgnsU�p��h$ _^[]� S old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
		