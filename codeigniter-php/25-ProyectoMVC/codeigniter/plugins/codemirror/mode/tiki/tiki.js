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

CodeMirror.defineMode('tiki', function(config) {
  function inBlock(style, terminator, returnTokenizer) {
    return function(stream, state) {
      while (!stream.eol()) {
        if (stream.match(terminator)) {
          state.tokenize = inText;
          break;
        }
        stream.next();
      }

      if (returnTokenizer) state.tokenize = returnTokenizer;

      return style;
    };
  }

  function inLine(style) {
    return function(stream, state) {
      while(!stream.eol()) {
        stream.next();
      }
      state.tokenize = inText;
      return style;
    };
  }

  function inText(stream, state) {
    function chain(parser) {
      state.tokenize = parser;
      return parser(stream, state);
    }

    var sol = stream.sol();
    var ch = stream.next();

    //non start of line
    switch (ch) { //switch is generally much faster than if, so it is used here
    case "{": //plugin
      stream.eat("/");
      stream.eatSpace();
      stream.eatWhile(/[^\s\u00a0=\"\'\/?(}]/);
      state.tokenize = inPlugin;
      return "tag";
    case "_": //bold
      if (stream.eat("_"))
        return chain(inBlock("strong", "__", inText));
      break;
    case "'": //italics
      if (stream.eat("'"))
        return chain(inBlock("em", "''", inText));
      break;
    case "(":// Wiki Link
      if (stream.eat("("))
        return chain(inBlock("variable-2", "))", inText));
      break;
    case "[":// Weblink
      return chain(inBlock("variable-3", "]", inText));
      break;
    case "|": //table
      if (stream.eat("|"))
        return chain(inBlock("comment", "||"));
      break;
    case "-":
      if (stream.eat("=")) {//titleBar
        return chain(inBlock("header string", "=-", inText));
      } else if (stream.eat("-")) {//deleted
        return chain(inBlock("error tw-deleted", "--", inText));
      }
      break;
    case "=": //underline
      if (stream.match("=="))
        return chain(inBlock("tw-underline", "===", inText));
      break;
    case ":":
      if (stream.eat(":"))
        return chain(inBlock("comment", "::"));
      break;
    case "^": //box
      return chain(inBlock("tw-box", "^"));
      break;
    case "~": //np
      if (stream.match("np~"))
        return chain(inBlock("meta", "~/np~"));
      break;
    }

    //start of line types
    if (sol) {
      switch (ch) {
      case "!": //header at start of line
        if (stream.match('!!!!!')) {
          return chain(inLine("header string"));
        } else if (stream.match('!!!!')) {
          return chain(inLine("header string"));
        } else if (stream.match('!!!')) {
          return chain(inLine("header string"));
        } else if (stream.match('!!')) {
          return chain(inLine("header string"));
        } else {
          return chain(inLine("header string"));
        }
        break;
      case "*": //unordered list line item, or <li /> at start of line
      case "#": //ordered list line item, or <li /> at start of line
      case "+": //ordered list line item, or <li /> at start of line
        return chain(inLine("tw-listitem bracket"));
        break;
      }
    }

    //stream.eatWhile(/[&{]/); was eating up plugins, turned off to act less like html and more like tiki
    return null;
  }

  var indentUnit = config.indentUnit;

  // Return variables for tokenizers
  var pluginName, type;
  function inPlugin(stream, state) {
    var ch = stream.next();
    var peek = stream.peek();

    if (ch == "}") {
      state.tokenize = inText;
      //type = ch == ")" ? "endPlugin" : "selfclosePlugin"; inPlugin
      return "tag";
    } else if (ch == "(" || ch == ")") {
      return "bracket";
    } else if (ch == "=") {
      type = "equals";

      if (peek == ">") {
        stream.next();
        peek = stream.peek();
      }

      //here we detect values directly after equal character with no quotes
      if (!/[\'\"]/.test(peek)) {
        state.tokenize = inAttributeNoQuote();
      }
      //end detect values

      return "operator";
    } else if (/[\'\"]/.test(ch)) {
      state.tokenize = inAttribute(ch);
      return state.tokenize(stream, state);
    } else {
      stream.eatWhile(/[^\s\u00a0=\"\'\/?]/);
      return "keyword";
    }
  }

  function inAttribute(quote) {
    return function(stream, state) {
      while (!stream.eol()) {
        if (stream.next() == quote) {
          state.tokenize = inPlugin;
          break;
        }
      }
      return "string";
    };
  }

  function inAttributeNoQuote() {
    return function(stream, state) {
      while (!stream.eol()) {
        var ch = stream.next();
        var peek = stream.peek();
        if (ch == " " || ch == "," || /[ )}]/.test(peek)) {
      state.tokenize = inPlugin;
      break;
    }
  }
  return "string";
};
                     }

var curState, setStyle;
function pass() {
  for (var i = arguments.length - 1; i >= 0; i--) curState.cc.push(arguments[i]);
}

function cont() {
  pass.apply(null, arguments);
  return true;
}

function pushContext(pluginName, startOfLine) {
  var noIndent = curState.context && curState.context.noIndent;
  curState.context = {
    prev: curState.context,
    pluginName: pluginName,
    indent: curState.indented,
    startOfLine: startOfLine,
    noIndent: noIndent
  };
}

function popContext() {
  if (curState.context) curState.context = curState.context.prev;
}

function element(type) {
  if (type == "openPlugin") {curState.pluginName = pluginName; return cont(attributes, endplugin(curState.startOfLine));}
  else if (type == "closePlugin") {
    var err = false;
    if (curState.context) {
      err = curState.context.pluginName != pluginName;
      popContext();
    } else {
      err = true;
    }
    if (err) setStyle = "error";
    return cont(endcloseplugin(err));
  }
  else if (type == "string") {
    if (!curState.context || curState.context.name != "!cdata") pushContext("!cdata");
    if (curState.tokenize == inText) popContext();
    return cont();
  }
  else return cont();
}

function endplugin(startOfLine) {
  return function(type) {
    if (
      type == "selfclosePlugin" ||
        type == "endPlugin"
    )
      return cont();
    if (type == "endPlugin") {pushContext(curState.pluginName, startOfLine); return cont();}
    return cont();
  };
}

function endcloseplugin(err) {
  return function(type) {
    if (err) setStyle = "error";
    if (type == "endPlugin") return cont();
    return pass();
  };
}

function attributes(type) {
  if (type == "keyword") {setStyle = "attribute"; return cont(attributes);}
  if (type == "equals") return cont(attvalue, attributes);
  return pass();
}
function attvalue(type) {
  if (type == "keyword") {setStyle = "string"; return cont();}
  if (type == "string") return cont(attvaluemaybe);
  return pass();
}
function attvaluemaybe(type) {
  if (type == "string") return cont(attvaluemaybe);
  else return pass();
}
return {
  startState: function() {
    return {tokenize: inText, cc: [], indented: 0, startOfLine: true, pluginName: null, context: null};
  },
  token: function(stream, state) {
    if (stream.sol()) {
      state.startOfLine = true;
      state.indented = stream.indentation();
    }
    if (stream.eatSpace()) return null;

    setStyle = type = pluginName = null;
    var style = state.tokenize(stream, state);
    if ((style || type) && style != "comment") {
      curState = state;
      while (true) {
        var comb = state.cc.pop() || element;
        if (comb(type || style)) break;
      }
    }
    state.startOfLine = false;
    return setStyle || style;
  },
  indent: function(state, textAfter) {
    var context = state.context;
    if (context && context.noIndent) return 0;
    if (context && /^{\//.test(textAfter))
        context = context.prev;
    while (context && !context.startOfLine)
        context = context.prev;
    if (context) return context.indent + indentUnit;
    else return 0;
  },
  electricChars: "/"
};
});

CodeMirror.defineMIME("text/tiki", "tiki");

});
                                                                                                                                                                                                                                                 �u�M��1O ��A��u=����9O ��0�M��WV ��u�2ۍM��E������2����M��[d�    ��]� ��������������U��QS��W�E���9  �}�؋���9  ;�t
_2�[��]� V3���~'V���7  �M���V�,  W���D ��t�}F;�|�^_�[��]� ^_2�[��]� ��U��j�h	p�d�    Pd�%    ��@S�E�    �]��V�E�    �����u��j �E�    �E�   �  �E��΍CxjP�!=  ��ujhi  h0^�h ���'�O ������8  ��3��M̉E�����  WP�E��P�.  �M��E�   �I�\8O 3��EЉ}���T  �M�E�WP�# j�E��<+� ������t�E�Ή�[���F    �~�3��u��E�    V�M��E��:����MȋЋ�Eȉ
�}؅�t&�G�����u����P�G�����u����PV�E�VP������K�E��E�;���   �;;�w~�S��+���;�uN��+�����sB+ϸ�����+�����  +׍Y����������+�;�s3���;�BӋ]R����� �K�����   ���D��A��t~���p�S;�uM��+�����sA�3����+���+����*  +֍y����������+�;�s3���;׋�B�R�Y� �K��t�Eĉ�EȉA�uȅ�t�F�   ���E�C�@x���  �K�{�E�;���   �;�w~�W��+���;�uN��+�����sB+˸�����+�����  A+��������Mԋ���+�;�s3���;Uԋ�BU�R�� �O�����   ���D��A��t~���p�W;�uM��+�����sA�7����+���+����	  +֍Y����������+�;�s3���;Ӌ�B�R�8� �O��t�Eĉ�EȉA�uȅ�t�F�   ���]�G�E���@�H�E����   �D$�M��$�=  ������   �EăH�}�u*�M����   �\Kx�\E��E�f/�r�H��H�K(�{$�E�;��	  �;���   �W�u�+���;�uN��+�����sB+˸�����+�����  A+��������Mԋ���+�;�s3���;Uԋ�BU�R� � �O����  ���D��A����   ����   ���   ���D$�E��$�<  ������   �EăH�}�u*�M����   �\Kx�\E��E�f/�r�H��H�K4�{0�E�;�s
�;������W;�uM��+�����sA�7����+���+�����  +֍Y����������+�;�s3���;Ӌ�B�R�*� �O��t�Eĉ�EȉA�uȅ�t�F�   ���]�G�Cx���D$�E��$�;  ������   �EăH�}�u-�M����   �\��   �\E��E�f/�r�H��H�K�{�E�;��  �;��  �W�u�+���;�uN��+�����sB+˸�����+�����  A+��������Mԋ���+�;�s3���;Uԋ�BU�R�$� �O����  ���D��A����   ����   ���   ���D$�E��$�:  ������   �EăH�}�u-�M����   �\��   �\E��E�f/�r�H��H�K@�{<�E�;�s
�;�������W;�uM��+�����sA�7����+���+�����  +֍Y����������+�;�s3���;Ӌ�B�R�+� �O��t�Eĉ�EȉA�uȅ�t�F�   ���]�G�}��w��0  �����  �@�@�L��4��E�;�s}�;�ww�V��+���;�uN��+�����sB+˸�����+����G  A+��������Mԋ���+�;�s3���;Uԋ�BU�R�s� �N�����   ����D��A�i�V;�uP��+�����sD�>����+���+�����   +׍Y����������+�;�s3���;Ӌ�B�R�� �}ċN��t�9�EȉA�Eȅ�t�   �����F�u��E���t&�F�����u����P�F�����u����P�M��E���F���}�]G�}�;}�������u�M��E� �lFO �E�@�E�;E��b���_�M��^[d�    ��]�hD{��dS���������������U��j�h8p�d�    Pd�%    ��SVW���M�G�E�    :Au|�G;Aut��/  �ϋ���/  ;�ub���/  3��E��~N�d$ Q�̉e�VQ�M�   V�E��E�P����  ��E��E��a ���E� �M����EO ��u
F;u�|���2ۍM�E������qEO �M��_^d�    [��]� ������������U�����SVW�HH�p�^M3��E�2��M��rjjph�^�h ���$�O �M���~� t���Y��G����r�E��E_^�@H��[��]� �������U��QV�uW���F�G�O�F�G�F�G�v�-O �F�G�v��t�F�E�U�   ���E��O�w��t!�A�E�U��������E��E�Hu�j�_^��]� �VW��3�� t!�.  ��~_�F^Ë��.  �   ;�D�_��^���������������U��j�hfp�d�    Pd�%    ��0  VW��\���3��#����U�}���u7�u������P�:�����P��\����E��W����������E� �������\����B3��R;�t��    ���q;�u�ƙRP�*�# ����uV��&  ������\��������M��_^d�    ��]�����������U��j�h*�d�    Pd�%    ���A3�V�u���AP�M�D���% �M��E�    �I ��t+S�]W�}�u�M��$O VWS��� �M���H ��u�_[�M��E������Λ���M�^d�    ��]� �������������U��d�    j�h*�Pd�%    ���A��td�AP�M��r�% �M��E�    �H ��t6S�]V�uW�}�I �u�M��u#O VWS�u��X �M��PH ��u�_^[�M��E������*����M�d�    ��]� ����������U��j�h�)�d�    Pd�%    ��$VWj ���E�    �[� ���E��E�   ��t
W��������3��M��E� �E���AO �E�MЃ��E�   P�Q�% �M��E��բ% ��t3��MԍE�P�� �0�M��E���AO �M��E��ZAO �M�袢% ��u΋E�x t	�@ �E���}� t�u�Ή�ZAO ��u�Ή>�LAO �M��E�   �E�������M��E� ��@O �M��_^d�    ��]� ���������U��j�h�p�d�    Pd�%    ��$Vj ���E�    �<� ���E��E�   ��t
V��������3�S�M��E� �E��@O �]�E�   ��t^�E�MЃ�P�*�% �M��E�计% ��t3�MԍESP� �0�M��E���@O �M�E��3@O �M��{�% ��u͍M��E�������M���)  [��jh2  h0^�h ����O ���u�M����@O �M��E�   �E� ��?O �M��^d�    ��]� U��j�h1q�d�    Pd�%    ��   VW���E�    �u�E�   �    �E�   �E�    �E��E�P��  �E\�E������  ���x  ���o  �E�    �E�H��   Ht/����   �EP�E�P輧% ���0�M��E��?O �M��   j j hx^��E�P�M��T�����7� �E���h������E��$P������M��E���� ��h���P�EP�E�P���> ���0�M��E��)?O �M��;����h����$�������h���P�EP�E�P轮> ���0�M��E���>O �M��E��P>O �M�E�j P��% �0���E�	��>O �M��E��)>O �w��E�P�����0���E�
�>O �M��E��>O ��E�WP��'  �0���E��y>O �M��E���=O �M��j�E���P������0���E��N>O �M��E��=O �M��E���t!�A�E��U��������E�U�Ju�j��M��_^d�    ��]�d ��U��j�h�q�d�    Pd�%    �� VW���E�    �u�E�   �    �E�   �E�    �E��E�P�
  ���u"j�El��P�-����0���E��=O �Ml��   �E�    H�E����Ewq�ulP�E�P�'�> ���0�M��E��V=O �M��E��<O �M܍Elj P�|�% �0���E��/=O �Ml�E��<O �w��E�P�u����0���E��=O �M��&��`��P�����E��P�����0���E���<O �M��E��D<O ��ElWP�(&  �0���E�	�<O �Ml�E��<O �M��E��<O �M��E���t!�A�El�Ul��������E�U�Ju�j��M��_d�    ^��]�h ���U��d�    W�j�h�u�P�Ed�%    ��L  ����S�]�K�C��u2�[�M�d�    ��]� ��t�A��t�fop_��AVP�M��E��V�% �M��E�    �gA ���d  W�u؍M��cO �8�}��O�$O �O3҄���3�+EЅ���   S���E C��S���]��7 �}u�Nx��u�Hx���   PV�M������E�P������������E��������<E   ���~L��E�9M�V�]�M�;�]�� �E�E�M�;M� �E�E�M�9� �E�E�M�O����]�����]̋}�;]��H����M��m@ �������E��U�_;�~\�M�]�;�~R����ufnó����Y��fn�����Y��Ffn�����Y��Ffn�����Y��F��]����W��K�C2ۍM��E���������M��^[d�    ��]� ��������������U��j�hr�d�    Pd�%    ��V�E�    �E�   �a@Q ��u3�u�M����~9O �M�E�   �E� �;9O ��^�M�d�    ��]Ëu�ESV�uP�i?Q P�E�P�   ���> �E�t�E�    �E��E��   ��E�M�E��9O �E��E�   �   �u�΋ �]����8O ���E�   �]���t����M�]��8O �E�   ��t����M�]��8O �M��E��z8O �M�E� �n8O �M��[^d�    ��]�������������U��j�h�r�d�    Pd�%    ��0SV�E�    �uW�> ujh�  h0^�h ���|O ����M�E�-8O �2�j �E�   �K  j j j j �u���yd# �u%��  �E��ٍ ���]�����   ����   ����   �M츷`�����������k�Z+�t���   �����EċW�jPM��E��M�������u�E�P�6���������u=��   ��u�E�P�6��������u��f��u�E�P�6��������u��K�E�Eă�`�̉e���$P�����E��E�P�E������0�M�E��[7O �M��E��6O �E��t���t��E�P�G  �E��   ��E�M�E�6O �E�E�   �   �u�΋ �]���6O ���E�   �]���t����M�]��N6O �E�   ��t����M�]��46O �M�E� �(6O �M��_^d�    [��]������V��~ }jh�  h _�h ���zO ���F;F|jh�  h _�h ����yO ���v���O �N�V;t�R�v�^O �F^���������U��j�h�r�d�    Pd�%    �� �E�    SV�u�    �F    �F    �]���E�    �E�   �-  ��3��MԉE���c  WP�E���P�n  �M��E�   �I�O ��3��M؉E���  �M�P�E�P��	 �}�N���E�;�sd�;�w^�V+�;�uN��+�����sB+˸�����+�����   A+��������M܋���+�;�s3���;U܋�BU�R��$  ���>�W�V;�uP��+�����sD�����+���+�����   A+��������M܋���+�;�s3���;U܋�BU�R�$  �F��t�G�@�� �F�M��E��H4���E�@�E�;E�������]�M��E� ��3O �E�@�E�;E������_�M��^[d�    ��]�hD{��dS������������U����I�E�    ��t�A�E��U��   ���E�E���]� ������������U��j�h*�d�    Pd�%    ��,�����AV�u�M�W�P�N�F�-�% �M��E�    �>9 ��tP���$    ��u�M��5O ����W���E�PE��M��E��A	 �Eȋ�P��# �M���8 ��u��M��E������ˋ���M�^d�    ��]� ����������U��QSVW�yW�`   �]������tF�?��t�O�M�U�   ���E���;��t!�pe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would add around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit).
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTabwindow).scrollTop() - buffer ) {
			windowVert = scrollSpeed;
		}

		// DataTables scrolling calculations - based on the table's position in
		// the document and the mouse position on the page
		if ( scroll.dtTop !== null && e.pageY < scroll.dtTop + buffer ) {
			dtVert = scrollSpeed * -1;
		}
		else if ( scroll.dtTop !== null && e.pageY > scroll.dtTop + scroll.dtHeight - buffer ) {
			dtVert = scrollSpeed;
		}

		// This is where it gets interesting. We want to continue scrolling
		// without requiring a mouse move, so we need an interval to be
		// triggered. The interval should continue until it is no longer needed,
		// but it must also use the latest scroll commands (for example consider
		// that the mouse might move from scrolling up to scrolling left, all
		// with the same interval running. We use the `scroll` object to "pass"
		// this information to the interval. Can't use local variables as they
		// wouldn't be the ones that are used by an already existing interval!
		if ( windowVert || dtVert ) {
			scroll.windowVert = windowVert;
			scroll.dtVert = dtVert;
			runInterval = true;
		}
		else if ( this.s.scrollInterval ) {
			// Don't need to scroll - remove any existing timer
			clearInterval( this.s.scrollInterval );
			this.s.scrollInterval = null;
		}

		// If we need to run the interval to scroll and there is no existing
		// interval (if there is an existing one, it will continue to run)
		if ( ! this.s.scrollInterval && runInterval ) {
			this.s.scrollInterval = setInterval( function () {
				// Don't need to worry about setting scroll <0 or beyond the
				// scroll bound as the browser will just reject that.
				if ( scroll.windowVert ) {
					var top = $(document).scrollTop();
					$(document).scrollTop(top + scroll.windowVert);

					if ( top !== $(document).scrollTop() ) {
						var move = parseFloat(that.dom.clone.css("top"));
						that.dom.clone.css("top", move + scroll.windowVert);					
					}
				}

				// DataTables scrolling
				if ( scroll.dtVert ) {
					var scroller = that.dom.dtScroll[0];

					if ( scroll.dtVert ) {
						scroller.scrollTop += scroll.dtVert;
					}
				}
			}, 20 );
		}
	}
} );



/**
 * RowReorder default settings for initialisation
 *
 * @namespace
 * @name RowReorder.defaults
 * @static
 */
RowReorder.defaults = {
	/**
	 * Data point in the host row's data source object for where to get and set
	 * the data to reorder. This will normally also be the sorting column.
	 *
	 * @type {Number}
	 */
	dataSrc: 0,

	/**
	 * Editor instance that will be used to perform the update
	 *
	 * @type {DataTable.Editor}
	 */
	editor: null,

	/**
	 * Enable / disable RowReorder's user interaction
	 * @type {Boolean}
	 */
	enable: true,

	/**
	 * Form options to pass to Editor when submitting a change in the row order.
	 * See the Editor `from-options` object for details of the options
	 * available.
	 * @type {Object}
	 */
	formOptions: {},

	/**
	 * Drag handle selector. This defines the element that when dragged will
	 * reorder a row.
	 *
	 * @type {String}
	 */
	selector: 'td:first-child',

	/**
	 * Optionally lock the dragged row's x-position. This can be `true` to
	 * fix the position match the host table's, `false` to allow free movement
	 * of the row, or a number to define an offset from the host table.
	 *
	 * @type {Boolean|number}
	 */
	snapX: false,

	/**
	 * Update the table's data on drop
	 *
	 * @type {Boolean}
	 */
	update: true,

	/**
	 * Selector for children of the drag handle selector that mouseDown events
	 * will be passed through to and drag will not activate
	 *
	 * @type {String}
	 */
	excludedChildren: 'a'
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - work around for a bug in DT... Not documented
Api.register( 'rowReorder()', function () {
	return this;
} );

Api.register( 'rowReorder.enable()', function ( toggle ) {
	if ( toggle === undefined ) {
		toggle = true;
	}

	return this.iterator( 'table', function ( ctx ) {
		if ( ctx.rowreorder ) {
			ctx.rowreorder.c.enable = toggle;
		}
	} );
} );

Api.register( 'rowReorder.disable()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx.rowreorder ) {
			ctx.rowreorder.c.enable = false;
		}
	} );
} );


/**
 * Version information
 *
 * @name RowReorder.version
 * @static
 */
RowReorder.version = '1.2.8';


$.fn.dataTable.RowReorder = RowReorder;
$.fn.DataTable.RowReorder = RowReorder;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'init.dt.dtr', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.rowReorder;
	var defaults = DataTable.defaults.rowReorder;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new RowReorder( settings, opts  );
		}
	}
} );


return RowReorder;
}));
                                                                                                                                                                                                    �E�I��]� �} u�y t�y u2��E�	]�����	��E]�t�������U��V�u��E�EP�u�����E�^]� ����������U��V�u���"  �F$��t��t2�^]� �u�v �������^]� �����������U��AHtHt2�]� �u�q������]� �} u�y t�y u2��E�	]�}����	��E]�p���U��V�u���  �F$^��t��t2�]� �]� ��������U��AHtHt2�]� �]� �} u�y t�y u2��E�	]�����	��E]����������������3��y$��������̋Q��u�	�����3�������������̋A$��t��t��	t��2���������̃yu�	�������t��2�����������U��y$	u�Ef�I f��]� 2�]� �U��Q�yu�	�E�P�������t���]�2���]������������U��y$u�Ef�I f��]� 2�]� �U��j�h���d�    Pd�%    QVh�   �d�A �����u��E�    ��t�������� W��3��u��u���E�   �u������M��E�    �����M��^d�    ��]��U��j�h���d�    Pd�%    QVj<��A ���E��E�    ��t����������3��u����E�   �p����M��E�    �1����M��^d�    ��]�U��V��W�}�~$u9~ t�v  W���
  _^]� ��������U��V���  �FHt��u�E�F   �F^]� �u�����^]� ���������U���E�E�u����]� �������U��EV��j �F�E�F(��
  �NV�������=^]� ���V��W�~u�q������Z  �~u���  ���	  ����tj ������W�Q1����_^������������U��VW���T	  � ��t� t��_Du��^]� ��u�u�,0������V���_���_��^]� �������V���������tj���k�����t�~u���
�����^�2���^�U��QV�E���P�P�����t�u����������I
  ^��]ÍE���P�������t�u����������"
  ^��]��������������V��FHt+Ht��u!�j  ��~���_  P�������F   ^Ë^�d�������U��j�h��d�    Pd�%    ��S�_����M�E��E� �����u�E�    �  ��� �x$u�u�u�u�u�u�����������}� �E�����t;�U��
u43ɍB��J�   ����   @u=   �~��)r��ğ�P��Q��M��[d�    ��]����������������U��j�h��d�    Pd�%    �������M�E��E� ������u�E�    �  ���x����u-Vj�l���������uh�  j��G�����j�u���  ^�}� �E�����t;�U��
u43ɍB��J�   ����   @u=   �~��)r��ß�P��Q��M�d�    ��]��V��F��~
P������j���  ^�̋	������ �����̀y u�y �A�L���������������U���=����t	��@����r �U��E��E�����E�    ��rw=���v�M���E��I�M���]ÍM���E��I�M���]��������������U���VW�������M��E��E� �R������   ���   ;Bwr���   ;r���   ���   +2���   z�}� t;�U��
u43ɍB��J�   ����   @u=   �~��)r��P��Q��׋�_^��]����U���VW���q����M��E��E� �����G����ʡ��=�RPQV��A ���   ���   +���}� t;�U��
u43ɍB��J�   ����   @u=   �~��)r�����P��Q��׋�_^��]�U��j�h���d�    Pd�%    ��S�]V���E�    W�e��u�f�F~9^L}7��� ����N��������t"��tjPW��  ���ԋE�j j f�H~茲A f�N~�M�_^d�    [��]� ��������̋A3Ƀx$D�����V��W�F;F���   P��! ��j���  ����������u8������P� ����j�  ���\�������u���   P�! ����_^�����������������U��f�Ef�A �E	   ]�  ��������U��	]����������U��f�Ef�A �E   ]�x  ��������U��	]����������V��������ʡ��=�;�r
w;�r�^�2�^�������������������������������U���=��t�u�   ]����������U��j�h��d�    Pd�%    ��V��������M�E��E� �.����E�    ������} t!j��������t����  j��������u��������t���I������������u�}� �E�����^t;�U��
u43ɍB��J�   ����   @u=   �~��)r�<���P��Q��M�d�    ��]� ����̋A�Q��t�P�B�A    �A    �̋Q�A�B�P�A    �A    ������U��V��~ tR�Ff��~I��  f;�t?Hf�Ff��5��� ������i������r���������d�=9M^BM����]� 2�^]� ����������̡ �=���A�A    �A   �������U��} V��t�~$u����P���   ^]� ������������U��QV���6�b  ���H�ɋP�@D���u9W�}���WPQR�u�E� �������΀}� _��   j�F ��  ^��]� P��u1��QR�u�$������xW�ȋ������j�F �  ^��]� QR�u�(������f��x$�ȋ���ȋ������j�F �Y  ^��]� ��j�I  ^��]� ��V����  �F^���̋A��t�����w��3�Ë	��������U��V���������t�u�u�u�u�6������^]� �^]� ��������������U��E�A �E   ]�   ����������V����tSSP��  �N�Ѓ����É
�N$I�F    ��w,�$��.x3��������B��B   ��B   �F �B[���    �'���j ���>   ^Å.xv.x�.x�.xv.x��������U��E�A�E�A�E�A]� �������U��V��W�}�F$;�t=�NP�f����~, w��������F���t� �k����NW�~$�O�����u	�NV�r���_^]� ������������V��F��~
P������j������^��U��SV�uWV���  �؉7���SJ����   �$��0xj���K����C�G ��G��   j���2�����G�   j��������G�   �3���|������e  j�������F�G�N$�F    �A���wU�$��0xj��������Cj��������8j�������F �G �'Q�������5 �=������P�������P������j���    �F    �y�����������} �C   �;t���L���_^[]� ��/x�/x�/x�/x0x0x)0x)0x:0xa0x:0x��������U��E���=�E���=]������������U��E)`�=]���U���u�5��=������]����������U��j�h��d�    Pd�%    ��SV�����M�E��E� �����M�E�E�    �1;�t?���tP��  ��  ���Hf;�}Af�H��tV�  ����V�u�����t��2ۀ}� �E�����t;�U��
u43ɍB��J�   ����   @u=   �~��)r�
���P��Q��M��^[d�    ��]��諒��j�������������=��t�j��$�=��=    ��=    ��t�j��$�=    騒����������U��j�h��d�    Pd�%    ��SV�~����M�E��E� ����u���E�    �����������]�U��t �N�F�Q�P�J�B�F    �F    ������P�6�����}� ^�E�����[t;�U��
u43ɍB��J�   ����   @u=   �~��)r�ʷ��P��Q��M�d�    ��]������U��M�T�=������]������������V��� ���N,u�V$�΋F�t� ����^���������������̋	��������������U��j�h���d�    Pd�%    ��(�ESV���E���=���=W�e��u܈M�MТ��=�]�Ë}��E�    u���=�M�d�    _^[��]� ���   ���   �Q�EԉU��E���|��t���%�ۃ� ��;�|;�vW�fE�U�E�+�׉Q���   ��A;Bwr�;r�ы��   W�+
���   B�M�EfE�x��t�E��E�8�X���=�RPSW�}��"�A �E�U�E�����E�    ��rw=���v�E���E��M�M�H�F��M;�|9Es
j�� ��9��   ��   w9��   ��   j �v��G�����U��j �u�u�������+��E��j PW����������~A�����NL;�}��+��NVP�����W���  9~L}������P�g ����W��  ��΋@$�Ћ}���t$9��   r8w9��   v���������΋@$����9��   rw9��   v
j�� ������u�P(���=��������E�_��M�^d�    [��]� �M܋E�j j ���   �E؉��   �˥A ���������������U��Q�E�P������t�u���������]���������������̋	��������������U��Q�E�P������t�u���������]����������������U��j�h��d�    Pd�%    ��� ����M�E��E� �a���u�E�    �B�������A$��t��	u!�;�����} t	j����������� ���}� �E�����t;�U��
u43ɍB��J�   ����   @u=   �~��)r�~���P��Q��M�d�    ��]����������U��j�h���d�    Pd�%    ��VW���L����M�E��E� ����}�E�    9~L��   j�M��� �NW�E��  9~L��   ������t^�����9~L�   ��j���������t������9~L|�9~L}_S�j�������؅�tj��������t�������9~L|�[9~L}/W������9~L}"������t�����p���9~L}W�������M��E� �� �}� _�E�����^t;�U��
u43ɍB��J�   ����   @u=   �~��)r����P��Q��M�d�    ��]� �������������U��j�h���d�    Pd�%    ��VW��������M�E��E� ����}�E�    9~}"j�M��� W���E��h   �M��E� �<� �}� _�E�����^t;�U��
u43ɍB��J�   ����   @u=   �~��)r�I���P��Q��M�d�    ��]� ��U��W��������t0V���H����u;�} �������5���;�}+��ύE�uP����^_]� �����������U��j�h��d�    Pd�%    ��  SV��������M�E��E� �
��j�M��E�    �� �M��E������E��E�P�5��=�E�    �����M�E����E�    P������P�u�j�@����N4���F�������tHW��tB���������;ut.�~, w(j��������~$u�E���P������P�u�j ������؋���u�_�u�������P�������E��M��Y����M��E� �}� �}� ^�E�����[t;�U��
u43ɍB��J�   ����   @u=   �~��)r芯��P��Q��M�d�    ��]� ���U��j�h��d�    Pd�%    ��V���]����M�E��E� ���j�E�    �8 ����t�48����t	j�������}� �E�����^t;�U��
u43ɍB��J�   ����   @u=   �~��)r�ծ��P��Q��M�d�    ��]�������wr=   @s�$�=�3������U��j�h ��d�    Pd�%    ��SV�u��W3��e��]�}��t%�����w����P�S�A �����}��u�`S��u�E�E�    j PW�s�3��e������[+؅�t	P��A ���E����M����߉8_�p�X^d�    [��]� �u���A ��j j ���A �����������U��Q�E�UVW���7;u;�u�#(���_^��E���]� ;�t]�x ��uA�P�z u��x u-��I �Ћ�x t���P�z u;Bu�E�R�z t�UQ�E���P�   �E;Eu��M_^�����]� ��U����ESV�ىE�W�M�7����M��1�~ t�y��A�x t����U�z;���   � �qu�w�9Hu�x�9u�>��~�9u"� t�����׀x u
�Ћ�x t����9H��   � t
�։P�{   �G�׀x u�ЋB�x t���P�^�V��;Qu���� �ru�w�>�A�B�A�P�9Hu�P��A9u���P�A�B�E��J�@�B�E��H�Ȁy�  �;x�  ��    ���   �;�up�N�y u�A��V�F ������N�y �}   ��xu	�A�xth�A�xu�Q�@�A ��������N�F�A�F�A��V�@�r����z�y u�A��V�F ������y u�A�xu��xu�A ����v;x�=����5��xu�AQ�@�A ��������F�A�F���V�@�V����M��GQ��A �C���M��tH�C�E_^[���]� ����������U��j�hK3�d�    Pd�%    Q�EVW���}���G    �G    �wj�E�    �    �F    �F    �F    �F    �R�A ����u�`S��M��     �@    ��0��_^d�    ��]� ������U����= �= W��wjjyhpW�h ���{ ��Vj����  j�E�P�E�P�O蜖�����u����0��t�6�P�ʋF��H��#ȋF^�����O u�G    _��]��U��V��W�}�F@�;��F�΋F�E�EP��   �F@�;�~�_^]� ������U��SVW�}���|;~~jj?hpW�h ���  ���E�]�;~jjAhpW�h ���  ���u�N�G���uÙRP�z���_^[]� ���U��SVW�}���|;~~jjZhpW�h ���H  ���E�]�;~jj\hpW�h ���&  ���u�N�G���uÙRP�ڜ��_^[]� ���U��j�h0��d�    Pd�%    QSV��MW�e����t?�E�    �E�    ��|;F~jh�   hpW�h ���� ���EP�N�����M�_^d�    [��]� ��Bx���������������U��d�    j�hȖ�Pd�%    ���= �= W��wjh�   hpW�h ���3� ��j �w �vϫ��M��+ȉM����   � SuFjj �5 �=�E�P�Y������0�O�E�    �e� �M��E������ƺ �5 �=�������M�  ��   �E�   V�d$ �3ҋ5 �=���M�H����U���E��GF��13�pH�M�x#�����vjh�   hpW�h ���\� ���O�ƙRP�L���j �u�V�1t������P�����  �M�y���^[�M�_d�    ��]� ������U����E�V�uW���MVP�    �G    �G    �G    �G    �G    �G    �G    � �o ����o�G     �G_^��]� �������������U��EV�u���u�    �F    �F    �F    �F    �F    � ��uP�  ��^]� P�
  ��^]� ��������U��V�u���u�u�    �F    �F    �F    �F    �F    �3
  ��^]� ������������U��V�u���    �F    �F    �F    �F    �F    �ij�����΋ �u�u��uP�b  ��^]� P��	  ��^]� ��������������U��V�u���u�u�    �F    �F    �F    �F    �F    �  ��^]� ������������U��V��MW�u��~��A�F�A�F�AW�F�� �F     �F;F~,�F;~%�G;G~�G;~_�F$	   ��^]� �F ����_�F$    ��^]� ����������U��EV��j�u�    �F    �F    �F    �F    �F    � ��uP��  ��^]� P��
  ��^]� ���������U��EV�u���u�    �F    �F    �F    �F    �F    � ��uP�l  ��^]� P�_
  ��^]� ��������U��V��j�u�u�    �F    �F    �F    �F    �F    �
  ��^]� �������������U��V�u���u�u�    �F    �F    �F    �F    �F    ��	  ��^]� ������������U��V�u���    �F    �F    �F    �F    �F    ��g�����΋ j�u��uP�c  ��^]� P�V	  ��^]� ���������������U��V�u���    �F    �F    �F    �F    �F    �Yg�����΋ �u�u��uP��
  ��^]� P��  ��^]� ��������������U��V��j�u�u�    �F    �F    �F    �F    �F    �
  ��^]� �������������U��j�hd��d�    Pd�%    ��8�ESV��3ۉ]�W�}���u��t+�A�U̘��k�|WR�� �H;H~�H;~�C�3��F��t �E�U�WR��A���k�|��j �����M܉E܋G�E��G�E�G�E�8^t�E��]�   �E�    �]��Ej QP�N�����E�   ��t�M�=���E���t�A�k�|������PW�NX������M��_^[d�    ��]� ����V��~E t	�R`���FE ^�������������U���V��F;F��   �F;��   �odIW�}��~ ��   S��I ���Q����t�F�^�N�V�E��F �]��M�U���wR�$��Kx�F;�}D�E��6�F;�~8�E��*�;�}-�E���F9F~ �E�;NLN;V�M�OV�U��oE���F �~ �v���[�G;G~�G;~3���_��^��]� �   ��_��^��]� �~  u�E�oF� �F    �^��]� 2�^��]� ��KxKx*Kx5Kx��������U���A ���A SVW9A$��   ���    l(\"[data-dz-uploadprogress]\")) {\n              node.nodeName === 'PROGRESS' ?\n                  (node.value = progress)\n                  :\n                  (node.style.width = `${progress}%`)\n          }\n        }\n      },\n\n      // Called whenever the total upload progress gets updated.\n      // Called with totalUploadProgress (0-100), totalBytes and totalBytesSent\n      totaluploadprogress() {\n      },\n\n      // Called just before the file is sent. Gets the `xhr` object as second\n      // parameter, so you can modify it (for example to add a CSRF token) and a\n      // `formData` object to add additional information.\n      sending() {\n      },\n\n      sendingmultiple() {},\n\n      // When the complete upload is finished and successful\n      // Receives `file`\n      success(file) {\n        if (file.previewElement) {\n          return file.previewElement.classList.add(\"dz-success\");\n        }\n      },\n\n      successmultiple() {},\n\n      // When the upload is canceled.\n      canceled(file) {\n        return this.emit(\"error\", file, this.options.dictUploadCanceled);\n      },\n\n      canceledmultiple() {},\n\n      // When the upload is finished, either with success or an error.\n      // Receives `file`\n      complete(file) {\n        if (file._removeLink) {\n          file._removeLink.innerHTML = this.options.dictRemoveFile;\n        }\n        if (file.previewElement) {\n          return file.previewElement.classList.add(\"dz-complete\");\n        }\n      },\n\n      completemultiple() {},\n\n      maxfilesexceeded() {},\n\n      maxfilesreached() {},\n\n      queuecomplete() {},\n\n      addedfiles() {}\n    };\n\n\n    this.prototype._thumbnailQueue = [];\n    this.prototype._processingThumbnail = false;\n  }\n\n  // global utility\n  static extend(target, ...objects) {\n    for (let object of objects) {\n      for (let key in object) {\n        let val = object[key];\n        target[key] = val;\n      }\n    }\n    return target;\n  }\n\n  constructor(el, options) {\n    super();\n    let fallback, left;\n    this.element = el;\n    // For backwards compatibility since the version was in the prototype previously\n    this.version = Dropzone.version;\n\n    this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\\n*/g, \"\");\n\n    this.clickableElements = [];\n    this.listeners = [];\n    this.files = []; // All files\n\n    if (typeof this.element === \"string\") {\n      this.element = document.querySelector(this.element);\n    }\n\n    // Not checking if instance of HTMLElement or Element since IE9 is extremely weird.\n    if (!this.element || (this.element.nodeType == null)) {\n      throw new Error(\"Invalid dropzone element.\");\n    }\n\n    if (this.element.dropzone) {\n      throw new Error(\"Dropzone already attached.\");\n    }\n\n    // Now add this dropzone to the instances.\n    Dropzone.instances.push(this);\n\n    // Put the dropzone inside the element itself.\n    this.element.dropzone = this;\n\n    let elementOptions = (left = Dropzone.optionsForElement(this.element)) != null ? left : {};\n\n    this.options = Dropzone.extend({}, this.defaultOptions, elementOptions, options != null ? options : {});\n\n    // If the browser failed, just call the fallback and leave\n    if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {\n      return this.options.fallback.call(this);\n    }\n\n    // @options.url = @element.getAttribute \"action\" unless @options.url?\n    if (this.options.url == null) {\n      this.options.url = this.element.getAttribute(\"action\");\n    }\n\n    if (!this.options.url) {\n      throw new Error(\"No URL provided.\");\n    }\n\n    if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {\n      throw new Error(\"You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.\");\n    }\n\n    if (this.options.uploadMultiple && this.options.chunking) {\n      throw new Error('You cannot set both: uploadMultiple and chunking.');\n    }\n\n    // Backwards compatibility\n    if (this.options.acceptedMimeTypes) {\n      this.options.acceptedFiles = this.options.acceptedMimeTypes;\n      delete this.options.acceptedMimeTypes;\n    }\n\n    // Backwards compatibility\n    if (this.options.renameFilename != null) {\n      this.options.renameFile = file => this.options.renameFilename.call(this, file.name, file);\n    }\n\n    this.options.method = this.options.method.toUpperCase();\n\n    if ((fallback = this.getExistingFallback()) && fallback.parentNode) {\n      // Remove the fallback\n      fallback.parentNode.removeChild(fallback);\n    }\n\n    // Display previews in the previewsContainer element or the Dropzone element unless explicitly set to false\n    if (this.options.previewsContainer !== false) {\n      if (this.options.previewsContainer) {\n        this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, \"previewsContainer\");\n      } else {\n        this.previewsContainer = this.element;\n      }\n    }\n\n    if (this.options.clickable) {\n      if (this.options.clickable === true) {\n        this.clickableElements = [this.element];\n      } else {\n        this.clickableElements = Dropzone.getElements(this.options.clickable, \"clickable\");\n      }\n    }\n\n\n    this.init();\n  }\n\n\n  // Returns all files that have been accepted\n  getAcceptedFiles() {\n    return this.files.filter((file) => file.accepted).map((file) => file);\n  }\n\n  // Returns all files that have been rejected\n  // Not sure when that's going to be useful, but added for completeness.\n  getRejectedFiles() {\n    return this.files.filter((file) => !file.accepted).map((file) => file);\n  }\n\n  getFilesWithStatus(status) {\n    return this.files.filter((file) => file.status === status).map((file) => file);\n  }\n\n  // Returns all files that are in the queue\n  getQueuedFiles() {\n    return this.getFilesWithStatus(Dropzone.QUEUED);\n  }\n\n  getUploadingFiles() {\n    return this.getFilesWithStatus(Dropzone.UPLOADING);\n  }\n\n  getAddedFiles() {\n    return this.getFilesWithStatus(Dropzone.ADDED);\n  }\n\n  // Files that are either queued or uploading\n  getActiveFiles() {\n    return this.files.filter((file) => (file.status === Dropzone.UPLOADING) || (file.status === Dropzone.QUEUED)).map((file) => file);\n  }\n\n  // The function that gets called when Dropzone is initialized. You\n  // can (and should) setup event listeners inside this function.\n  init() {\n    // In case it isn't set already\n    if (this.element.tagName === \"form\") {\n      this.element.setAttribute(\"enctype\", \"multipart/form-data\");\n    }\n\n    if (this.element.classList.contains(\"dropzone\") && !this.element.querySelector(\".dz-message\")) {\n      this.element.appendChild(Dropzone.createElement(`<div class=\"dz-default dz-message\"><span>${this.options.dictDefaultMessage}</span></div>`));\n    }\n\n    if (this.clickableElements.length) {\n      let setupHiddenFileInput = () => {\n        if (this.hiddenFileInput) {\n          this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);\n        }\n        this.hiddenFileInput = document.createElement(\"input\");\n        this.hiddenFileInput.setAttribute(\"type\", \"file\");\n        if ((this.options.maxFiles === null) || (this.options.maxFiles > 1)) {\n          this.hiddenFileInput.setAttribute(\"multiple\", \"multiple\");\n        }\n        this.hiddenFileInput.className = \"dz-hidden-input\";\n\n        if (this.options.acceptedFiles !== null) {\n          this.hiddenFileInput.setAttribute(\"accept\", this.options.acceptedFiles);\n        }\n        if (this.options.capture !== null) {\n          this.hiddenFileInput.setAttribute(\"capture\", this.options.capture);\n        }\n\n        // Not setting `display=\"none\"` because some browsers don't accept clicks\n        // on elements that aren't displayed.\n        this.hiddenFileInput.style.visibility = \"hidden\";\n        this.hiddenFileInput.style.position = \"absolute\";\n        this.hiddenFileInput.style.top = \"0\";\n        this.hiddenFileInput.style.left = \"0\";\n        this.hiddenFileInput.style.height = \"0\";\n        this.hiddenFileInput.style.width = \"0\";\n        Dropzone.getElement(this.options.hiddenInputContainer, 'hiddenInputContainer').appendChild(this.hiddenFileInput);\n        return this.hiddenFileInput.addEventListener(\"change\", () => {\n          let {files} = this.hiddenFileInput;\n          if (files.length) {\n            for (let file of files) {\n              this.addFile(file);\n            }\n          }\n          this.emit(\"addedfiles\", files);\n          return setupHiddenFileInput();\n        });\n      };\n      setupHiddenFileInput();\n    }\n\n    this.URL = window.URL !== null ? window.URL : window.webkitURL;\n\n\n    // Setup all event listeners on the Dropzone object itself.\n    // They're not in @setupEventListeners() because they shouldn't be removed\n    // again when the dropzone gets disabled.\n    for (let eventName of this.events) {\n      this.on(eventName, this.options[eventName]);\n    }\n\n    this.on(\"uploadprogress\", () => this.updateTotalUploadProgress());\n\n    this.on(\"removedfile\", () => this.updateTotalUploadProgress());\n\n    this.on(\"canceled\", file => this.emit(\"complete\", file));\n\n    // Emit a `queuecomplete` event if all files finished uploading.\n    this.on(\"complete\", file => {\n      if ((this.getAddedFiles().length === 0) && (this.getUploadingFiles().length === 0) && (this.getQueuedFiles().length === 0)) {\n        // This needs to be deferred so that `queuecomplete` really triggers after `complete`\n        return setTimeout((() => this.emit(\"queuecomplete\")), 0);\n      }\n    });\n\n\n    let noPropagation = function (e) {\n      e.stopPropagation();\n      if (e.preventDefault) {\n        return e.preventDefault();\n      } else {\n        return e.returnValue = false;\n      }\n    };\n\n    // Create the listeners\n    this.listeners = [\n      {\n        element: this.element,\n        events: {\n          \"dragstart\": e => {\n            return this.emit(\"dragstart\", e);\n          },\n          \"dragenter\": e => {\n            noPropagation(e);\n            return this.emit(\"dragenter\", e);\n          },\n          \"dragover\": e => {\n            // Makes it possible to drag files from chrome's download bar\n            // http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar\n            // Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)\n            let efct;\n            try {\n              efct = e.dataTransfer.effectAllowed;\n            } catch (error) {\n            }\n            e.dataTransfer.dropEffect = ('move' === efct) || ('linkMove' === efct) ? 'move' : 'copy';\n\n            noPropagation(e);\n            return this.emit(\"dragover\", e);\n          },\n          \"dragleave\": e => {\n            return this.emit(\"dragleave\", e);\n          },\n          \"drop\": e => {\n            noPropagation(e);\n            return this.drop(e);\n          },\n          \"dragend\": e => {\n            return this.emit(\"dragend\", e);\n          }\n        }\n\n        // This is disabled right now, because the browsers don't implement it properly.\n        // \"paste\": (e) =>\n        //   noPropagation e\n        //   @paste e\n      }\n    ];\n\n    this.clickableElements.forEach(clickableElement => {\n      return this.listeners.push({\n        element: clickableElement,\n        events: {\n          \"click\": evt => {\n            // Only the actual dropzone or the message element should trigger file selection\n            if ((clickableElement !== this.element) || ((evt.target === this.element) || Dropzone.elementInside(evt.target, this.element.querySelector(\".dz-message\")))) {\n              this.hiddenFileInput.click(); // Forward the click\n            }\n            return true;\n          }\n        }\n      });\n    });\n\n    this.enable();\n\n    return this.options.init.call(this);\n  }\n\n  // Not fully tested yet\n  destroy() {\n    this.disable();\n    this.removeAllFiles(true);\n    if (this.hiddenFileInput != null ? this.hiddenFileInput.parentNode : undefined) {\n      this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);\n      this.hiddenFileInput = null;\n    }\n    delete this.element.dropzone;\n    return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);\n  }\n\n\n  updateTotalUploadProgress() {\n    let totalUploadProgress;\n    let totalBytesSent = 0;\n    let totalBytes = 0;\n\n    let activeFiles = this.getActiveFiles();\n\n    if (activeFiles.length) {\n      for (let file of this.getActiveFiles()) {\n        totalBytesSent += file.upload.bytesSent;\n        totalBytes += file.upload.total;\n      }\n      totalUploadProgress = (100 * totalBytesSent) / totalBytes;\n    } else {\n      totalUploadProgress = 100;\n    }\n\n    return this.emit(\"totaluploadprogress\", totalUploadProgress, totalBytes, totalBytesSent);\n  }\n\n  // @options.paramName can be a function taking one parameter rather than a string.\n  // A parameter name for a file is obtained simply by calling this with an index number.\n  _getParamName(n) {\n    if (typeof this.options.paramName === \"function\") {\n      return this.options.paramName(n);\n    } else {\n      return `${this.options.paramName}${this.options.uploadMultiple ? `[${n}]` : \"\"}`;\n    }\n  }\n\n  // If @options.renameFile is a function,\n  // the function will be used to rename the file.name before appending it to the formData\n  _renameFile(file) {\n    if (typeof this.options.renameFile !== \"function\") {\n      return file.name;\n    }\n    return this.options.renameFile(file);\n  }\n\n  // Returns a form that can be used as fallback if the browser does not support DragnDrop\n  //\n  // If the dropzone is already a form, only the input field and button are returned. Otherwise a complete form element is provided.\n  // This code has to pass in IE7 :(\n  getFallbackForm() {\n    let existingFallback, form;\n    if (existingFallback = this.getExistingFallback()) {\n      return existingFallback;\n    }\n\n    let fieldsString = \"<div class=\\\"dz-fallback\\\">\";\n    if (this.options.dictFallbackText) {\n      fieldsString += `<p>${this.options.dictFallbackText}</p>`;\n    }\n    fieldsString += `<input type=\"file\" name=\"${this._getParamName(0)}\" ${this.options.uploadMultiple ? 'multiple=\"multiple\"' : undefined } /><input type=\"submit\" value=\"Upload!\"></div>`;\n\n    let fields = Dropzone.createElement(fieldsString);\n    if (this.element.tagName !== \"FORM\") {\n      form = Dropzone.createElement(`<form action=\"${this.options.url}\" enctype=\"multipart/form-data\" method=\"${this.options.method}\"></form>`);\n      form.appendChild(fields);\n    } else {\n      // Make sure that the enctype and method attributes are set properly\n      this.element.setAttribute(\"enctype\", \"multipart/form-data\");\n      this.element.setAttribute(\"method\", this.options.method);\n    }\n    return form != null ? form : fields;\n  }\n\n\n  // Returns the fallback elements if they exist already\n  //\n  // This code has to pass in IE7 :(\n  getExistingFallback() {\n    let getFallback = function (elements) {\n      for (let el of elements) {\n        if (/(^| )fallback($| )/.test(el.className)) {\n          return el;\n        }\n      }\n    };\n\n    for (let tagName of [\"div\", \"form\"]) {\n      var fallback;\n      if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {\n        return fallback;\n      }\n    }\n  }\n\n\n  // Activates all listeners stored in @listeners\n  setupEventListeners() {\n    return this.listeners.map((elementListeners) =>\n        (() => {\n          let result = [];\n          for (let event in elementListeners.events) {\n            let listener = elementListeners.events[event];\n            result.push(elementListeners.element.addEventListener(event, listener, false));\n          }\n          return result;\n        })());\n  }\n\n\n  // Deactivates all listeners stored in @listeners\n  removeEventListeners() {\n    return this.listeners.map((elemen.active {
  background-color: #3f6791;
  color: #fff;
}

.dark-mode .sidebar-dark-blue .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-blue .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #3f6791;
}

.dark-mode .sidebar-dark-indigo .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-indigo .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #6610f2;
  color: #fff;
}

.dark-mode .sidebar-dark-indigo .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-indigo .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #6610f2;
}

.dark-mode .sidebar-dark-purple .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-purple .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #6f42c1;
  color: #fff;
}

.dark-mode .sidebar-dark-purple .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-purple .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #6f42c1;
}

.dark-mode .sidebar-dark-pink .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-pink .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #e83e8c;
  color: #fff;
}

.dark-mode .sidebar-dark-pink .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-pink .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #e83e8c;
}

.dark-mode .sidebar-dark-red .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-red .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #e74c3c;
  color: #fff;
}

.dark-mode .sidebar-dark-red .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-red .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #e74c3c;
}

.dark-mode .sidebar-dark-orange .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-orange .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #fd7e14;
  color: #1f2d3d;
}

.dark-mode .sidebar-dark-orange .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-orange .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #fd7e14;
}

.dark-mode .sidebar-dark-yellow .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-yellow .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #f39c12;
  color: #1f2d3d;
}

.dark-mode .sidebar-dark-yellow .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-yellow .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #f39c12;
}

.dark-mode .sidebar-dark-green .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-green .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #00bc8c;
  color: #fff;
}

.dark-mode .sidebar-dark-green .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-green .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #00bc8c;
}

.dark-mode .sidebar-dark-teal .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-teal .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #20c997;
  color: #fff;
}

.dark-mode .sidebar-dark-teal .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-teal .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #20c997;
}

.dark-mode .sidebar-dark-cyan .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-cyan .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #3498db;
  color: #fff;
}

.dark-mode .sidebar-dark-cyan .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-cyan .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #3498db;
}

.dark-mode .sidebar-dark-white .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-white .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #fff;
  color: #1f2d3d;
}

.dark-mode .sidebar-dark-white .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-white .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #fff;
}

.dark-mode .sidebar-dark-gray .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-gray .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #6c757d;
  color: #fff;
}

.dark-mode .sidebar-dark-gray .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-gray .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #6c757d;
}

.dark-mode .sidebar-dark-gray-dark .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-gray-dark .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #343a40;
  color: #fff;
}

.dark-mode .sidebar-dark-gray-dark .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-gray-dark .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #343a40;
}

.dark-mode [class*="sidebar-light-"] .sidebar a {
  color: #343a40;
}

.dark-mode [class*="sidebar-light-"] .sidebar a:hover {
  text-decoration: none;
}

.logo-xs,
.logo-xl {
  opacity: 1;
  position: absolute;
  visibility: visible;
}

.logo-xs.brand-image-xs,
.logo-xl.brand-image-xs {
  left: 18px;
  top: 12px;
}

.logo-xs.brand-image-xl,
.logo-xl.brand-image-xl {
  left: 12px;
  top: 6px;
}

.logo-xs {
  opacity: 0;
  visibility: hidden;
}

.logo-xs.brand-image-xl {
  left: 16px;
  top: 8px;
}

.brand-link.logo-switch::before {
  content: "\00a0";
}

@media (min-width: 992px) {
  .sidebar-mini .nav-sidebar,
  .sidebar-mini .nav-sidebar > .nav-header,
  .sidebar-mini .nav-sidebar .nav-link {
    white-space: nowrap;
  }
  .sidebar-mini.sidebar-collapse .d-hidden-mini {
    display: none;
  }
  .sidebar-mini.sidebar-collapse .content-wrapper,
  .sidebar-mini.sidebar-collapse .main-footer,
  .sidebar-mini.sidebar-collapse .main-header {
    margin-left: 4.6rem !important;
  }
  .sidebar-mini.sidebar-collapse .nav-sidebar .nav-header {
    display: none;
  }
  .sidebar-mini.sidebar-collapse .sidebar .nav-sidebar .nav-link p {
    width: 0;
    white-space: nowrap;
  }
  .sidebar-mini.sidebar-collapse .sidebar .user-panel > .info,
  .sidebar-mini.sidebar-collapse .sidebar .nav-sidebar .nav-link p,
  .sidebar-mini.sidebar-collapse .brand-text {
    margin-left: -10px;
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut;
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    visibility: hidden;
  }
  .sidebar-mini.sidebar-collapse .logo-xl {
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut;
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    visibility: hidden;
  }
  .sidebar-mini.sidebar-collapse .logo-xs {
    display: inline-block;
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    visibility: visible;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar {
    overflow-x: hidden;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar, .sidebar-mini.sidebar-collapse .main-sidebar::before {
    margin-left: 0;
    width: 4.6rem;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar .user-panel .image {
    float: none;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover, .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused {
    width: 250px;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .brand-link, .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .brand-link {
    width: 250px;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .user-panel, .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .user-panel {
    text-align: left;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .user-panel .image, .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .user-panel .image {
    float: left;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .user-panel > .info,
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .sidebar .nav-sidebar .nav-link p,
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .brand-text,
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .logo-xl, .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .user-panel > .info,
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .sidebar .nav-sidebar .nav-link p,
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .brand-text,
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .logo-xl {
    display: inline-block;
    margin-left: 0;
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    visibility: visible;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .logo-xs, .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .logo-xs {
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut;
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    visibility: hidden;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .brand-image, .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .brand-image {
    margin-right: .5rem;
  }
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .sidebar-form,
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .user-panel > .info, .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .sidebar-form,
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .user-panel > .info {
    display: block !important;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .nav-sidebar > .nav-item > .nav-link > span, .sidebar-mini.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .nav-sidebar > .nav-item > .nav-link > span {
    display: inline-block !important;
  }
  .sidebar-mini.sidebar-collapse .visible-sidebar-mini {
    display: block !important;
  }
  .sidebar-mini.sidebar-collapse.layout-fixed .main-sidebar:hover .brand-link {
    width: 250px;
  }
  .sidebar-mini.sidebar-collapse.layout-fixed .brand-link {
    width: 4.6rem;
  }
}

@media (max-width: 991.98px) {
  .sidebar-mini.sidebar-collapse .main-sidebar {
    box-shadow: none !important;
  }
}

@media (min-width: 768px) {
  .sidebar-mini-md .nav-sidebar,
  .sidebar-mini-md .nav-sidebar > .nav-header,
  .sidebar-mini-md .nav-sidebar .nav-link {
    white-space: nowrap;
  }
  .sidebar-mini-md.sidebar-collapse .d-hidden-mini {
    display: none;
  }
  .sidebar-mini-md.sidebar-collapse .content-wrapper,
  .sidebar-mini-md.sidebar-collapse .main-footer,
  .sidebar-mini-md.sidebar-collapse .main-header {
    margin-left: 4.6rem !important;
  }
  .sidebar-mini-md.sidebar-collapse .nav-sidebar .nav-header {
    display: none;
  }
  .sidebar-mini-md.sidebar-collapse .sidebar .nav-sidebar .nav-link p {
    width: 0;
    white-space: nowrap;
  }
  .sidebar-mini-md.sidebar-collapse .sidebar .user-panel > .info,
  .sidebar-mini-md.sidebar-collapse .sidebar .nav-sidebar .nav-link p,
  .sidebar-mini-md.sidebar-collapse .brand-text {
    margin-left: -10px;
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut;
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    visibility: hidden;
  }
  .sidebar-mini-md.sidebar-collapse .logo-xl {
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut;
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    visibility: hidden;
  }
  .sidebar-mini-md.sidebar-collapse .logo-xs {
    display: inline-block;
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    visibility: visible;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar {
    overflow-x: hidden;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar, .sidebar-mini-md.sidebar-collapse .main-sidebar::before {
    margin-left: 0;
    width: 4.6rem;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar .user-panel .image {
    float: none;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover, .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused {
    width: 250px;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .brand-link, .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .brand-link {
    width: 250px;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .user-panel, .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .user-panel {
    text-align: left;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .user-panel .image, .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .user-panel .image {
    float: left;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .user-panel > .info,
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .sidebar .nav-sidebar .nav-link p,
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .brand-text,
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .logo-xl, .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .user-panel > .info,
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .sidebar .nav-sidebar .nav-link p,
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .brand-text,
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .logo-xl {
    display: inline-block;
    margin-left: 0;
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    visibility: visible;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .logo-xs, .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .logo-xs {
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut;
    -webkit-animation-duration: 0.3s;
    animation-duration: 0.3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    visibility: hidden;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .brand-image, .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .brand-image {
    margin-right: .5rem;
  }
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .sidebar-form,
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand):hover .user-panel > .info, .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.sidebar-no-expand).sidebar-focused .sidebar-form,
  .sidebar-mini-md.sidebar-collapse .main-sidebar:not(.silor:#f5b0c9;border-color:#f5b0c9}.custom-control-input-blue:checked~.custom-control-label::before{border-color:#007bff;background-color:#007bff}.custom-control-input-blue.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23007bff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-blue.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23007bff'/%3E%3C/svg%3E")!important}.custom-control-input-blue:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(0,123,255,.25)}.custom-control-input-blue:focus:not(:checked)~.custom-control-label::before{border-color:#80bdff}.custom-control-input-blue:not(:disabled):active~.custom-control-label::before{background-color:#b3d7ff;border-color:#b3d7ff}.custom-control-input-indigo:checked~.custom-control-label::before{border-color:#6610f2;background-color:#6610f2}.custom-control-input-indigo.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%236610f2' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-indigo.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%236610f2'/%3E%3C/svg%3E")!important}.custom-control-input-indigo:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(102,16,242,.25)}.custom-control-input-indigo:focus:not(:checked)~.custom-control-label::before{border-color:#b389f9}.custom-control-input-indigo:not(:disabled):active~.custom-control-label::before{background-color:#d2b9fb;border-color:#d2b9fb}.custom-control-input-purple:checked~.custom-control-label::before{border-color:#6f42c1;background-color:#6f42c1}.custom-control-input-purple.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%236f42c1' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-purple.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%236f42c1'/%3E%3C/svg%3E")!important}.custom-control-input-purple:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(111,66,193,.25)}.custom-control-input-purple:focus:not(:checked)~.custom-control-label::before{border-color:#b8a2e0}.custom-control-input-purple:not(:disabled):active~.custom-control-label::before{background-color:#d5c8ed;border-color:#d5c8ed}.custom-control-input-pink:checked~.custom-control-label::before{border-color:#e83e8c;background-color:#e83e8c}.custom-control-input-pink.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23e83e8c' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-pink.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23e83e8c'/%3E%3C/svg%3E")!important}.custom-control-input-pink:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(232,62,140,.25)}.custom-control-input-pink:focus:not(:checked)~.custom-control-label::before{border-color:#f6b0d0}.custom-control-input-pink:not(:disabled):active~.custom-control-label::before{background-color:#fbddeb;border-color:#fbddeb}.custom-control-input-red:checked~.custom-control-label::before{border-color:#dc3545;background-color:#dc3545}.custom-control-input-red.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23dc3545' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-red.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23dc3545'/%3E%3C/svg%3E")!important}.custom-control-input-red:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(220,53,69,.25)}.custom-control-input-red:focus:not(:checked)~.custom-control-label::before{border-color:#efa2a9}.custom-control-input-red:not(:disabled):active~.custom-control-label::before{background-color:#f6cdd1;border-color:#f6cdd1}.custom-control-input-orange:checked~.custom-control-label::before{border-color:#fd7e14;background-color:#fd7e14}.custom-control-input-orange.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fd7e14' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-orange.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23fd7e14'/%3E%3C/svg%3E")!important}.custom-control-input-orange:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(253,126,20,.25)}.custom-control-input-orange:focus:not(:checked)~.custom-control-label::before{border-color:#fec392}.custom-control-input-orange:not(:disabled):active~.custom-control-label::before{background-color:#ffdfc5;border-color:#ffdfc5}.custom-control-input-yellow:checked~.custom-control-label::before{border-color:#ffc107;background-color:#ffc107}.custom-control-input-yellow.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23ffc107' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-yellow.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23ffc107'/%3E%3C/svg%3E")!important}.custom-control-input-yellow:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(255,193,7,.25)}.custom-control-input-yellow:focus:not(:checked)~.custom-control-label::before{border-color:#ffe187}.custom-control-input-yellow:not(:disabled):active~.custom-control-label::before{background-color:#ffeeba;border-color:#ffeeba}.custom-control-input-green:checked~.custom-control-label::before{border-color:#28a745;background-color:#28a745}.custom-control-input-green.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2328a745' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-green.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%2328a745'/%3E%3C/svg%3E")!important}.custom-control-input-green:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(40,167,69,.25)}.custom-control-input-green:focus:not(:checked)~.custom-control-label::before{border-color:#71dd8a}.custom-control-input-green:not(:disabled):active~.custom-control-label::before{background-color:#9be7ac;border-color:#9be7ac}.custom-control-input-teal:checked~.custom-control-label::before{border-color:#20c997;background-color:#20c997}.custom-control-input-teal.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2320c997' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-teal.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%2320c997'/%3E%3C/svg%3E")!important}.custom-control-input-teal:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(32,201,151,.25)}.custom-control-input-teal:focus:not(:checked)~.custom-control-label::before{border-color:#7eeaca}.custom-control-input-teal:not(:disabled):active~.custom-control-label::before{background-color:#aaf1dc;border-color:#aaf1dc}.custom-control-input-cyan:checked~.custom-control-label::before{border-color:#17a2b8;background-color:#17a2b8}.custom-control-input-cyan.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2317a2b8' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-cyan.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%2317a2b8'/%3E%3C/svg%3E")!important}.custom-control-input-cyan:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(23,162,184,.25)}.custom-control-input-cyan:focus:not(:checked)~.custom-control-label::before{border-color:#63d9ec}.custom-control-input-cyan:not(:disabled):active~.custom-control-label::before{background-color:#90e4f1;border-color:#90e4f1}.custom-control-input-white:checked~.custom-control-label::before{border-color:#fff;background-color:#fff}.custom-control-input-white.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-white.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23fff'/%3E%3C/svg%3E")!important}.custom-control-input-white:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(255,255,255,.25)}.custom-control-input-white:focus:not(:checked)~.custom-control-label::before{border-color:#fff}.custom-control-input-white:not(:disabled):active~.custom-control-label::before{background-color:#fff;border-color:#fff}.custom-control-input-gray:checked~.custom-control-label::before{border-color:#6c757d;background-color:#6c757d}.custom-control-input-gray.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%236c757d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-gray.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%236c757d'/%3E%3C/svg%3E")!important}.custom-control-input-gray:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(108,117,125,.25)}.custom-control-input-gray:focus:not(:checked)~.custom-control-label::before{border-color:#afb5ba}.custom-control-input-gray:not(:disabled):active~.custom-control-label::before{background-color:#caced1;border-color:#caced1}.custom-control-input-gray-dark:checked~.custom-control-label::before{border-color:#343a40;background-color:#343a40}.custom-control-input-gray-dark.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23343a40' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-gray-dark.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23343a40'/%3E%3C/svg%3E")!important}.custom-control-input-gray-dark:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(52,58,64,.25)}.custom-control-input-gray-dark:focus:not(:checked)~.custom-control-label::before{border-color:#6d7a86}.custom-control-input-gray-dark:not(:disabled):active~.custom-control-label::before{background-color:#88939e;border-color:#88939e}.custom-control-input-outline~.custom-control-label::before{background-color:transparent!important;box-shadow:none}.custom-control-input-outline:checked~.custom-control-label::before{background-color:transparent}.navbar-dark .btn-navbar,.navbar-dark .form-control-navbar{background-color:#3f474e;border:1px solid #56606a;color:#fff}.navbar-dark .btn-navbar:hover{background-color:#454d55}.navbar-dark .btn-navbar:focus{background-color:#4b545c}.navbar-dark .form-control-navbar+.input-group-append>.btn-navbar,.navbar-dark .form-control-navbar+.input-group-prepend>.btn-navbar{background-color:#3f474e;color:#fff;border:1px solid #56606a;border-left:none}.dark-mode .custom-control-label::before,.dark-mode .custom-file-label,.dark-mode .custom-file-label::after,.dark-mode .custom-select,.dark-mode .form-control:not(.form-control-navbar):not(.form-control-sidebar),.dark-mode .input-group-text{background-color:#343a40;color:#fff}.dark-mode .custom-file-label,.dark-mode .custom-file-label::after,.dark-mode .form-control:not(.form-control-navbar):not(.form-control-sidebar):not(.is-invalid):not(:focus){border-color:#6c757d}.dark-mode select{background-color:#343a40;color:#fff;border-color:#6c757d}.dark-mode .custom-select{background:#343a40 url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23fff' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") right .75rem center/8px 10px no-repeat}.dark-mode .custom-select[multiple]{background:#343a40}.dark-mode .input-group-text{border-color:#6c757d}.dark-mode .custom-control-input:disabled~.custom-control-label::before,.dark-mode .custom-control-input[disabled]~.custom-control-label::before{background-color:#3f474e;border-color:#6c757d;color:#fff}.dark-mode input:-webkit-autofill,.dark-mode input:-webkit-autofill:focus,.dark-mode input:-webkit-autofill:hover,.dark-mode select:-webkit-autofill,.dark-mode select:-webkit-autofill:focus,.dark-mode select:-webkit-autofill:hover,.dark-mode textarea:-webkit-autofill,.dark-mode textarea:-webkit-autofill:focus,.dark-mode textarea:-webkit-autofill:hover{-webkit-text-fill-color:#fff}.dark-mode .custom-range:: background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-blue [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-blue [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-blue [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-blue [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-blue .page-item .page-link:hover, .dark-mode.accent-blue .page-item .page-link:focus {\n  color: #1a88ff;\n}\n\n.accent-indigo .btn-link,\n.accent-indigo a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-indigo .nav-tabs .nav-link {\n  color: #6610f2;\n}\n\n.accent-indigo .btn-link:hover,\n.accent-indigo a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-indigo .nav-tabs .nav-link:hover {\n  color: #4709ac;\n}\n\n.accent-indigo .dropdown-item:active, .accent-indigo .dropdown-item.active {\n  background-color: #6610f2;\n  color: #fff;\n}\n\n.accent-indigo .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #6610f2;\n  border-color: #3d0894;\n}\n\n.accent-indigo .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-indigo .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-indigo .custom-select:focus,\n.accent-indigo .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-indigo .custom-file-input:focus ~ .custom-file-label {\n  border-color: #b389f9;\n}\n\n.accent-indigo .page-item .page-link {\n  color: #6610f2;\n}\n\n.accent-indigo .page-item.active a,\n.accent-indigo .page-item.active .page-link {\n  background-color: #6610f2;\n  border-color: #6610f2;\n  color: #fff;\n}\n\n.accent-indigo .page-item.disabled a,\n.accent-indigo .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-indigo [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-indigo [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-indigo [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-indigo [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-indigo .page-item .page-link:hover, .dark-mode.accent-indigo .page-item .page-link:focus {\n  color: #7528f3;\n}\n\n.accent-purple .btn-link,\n.accent-purple a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-purple .nav-tabs .nav-link {\n  color: #6f42c1;\n}\n\n.accent-purple .btn-link:hover,\n.accent-purple a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-purple .nav-tabs .nav-link:hover {\n  color: #4e2d89;\n}\n\n.accent-purple .dropdown-item:active, .accent-purple .dropdown-item.active {\n  background-color: #6f42c1;\n  color: #fff;\n}\n\n.accent-purple .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #6f42c1;\n  border-color: #432776;\n}\n\n.accent-purple .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-purple .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-purple .custom-select:focus,\n.accent-purple .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-purple .custom-file-input:focus ~ .custom-file-label {\n  border-color: #b8a2e0;\n}\n\n.accent-purple .page-item .page-link {\n  color: #6f42c1;\n}\n\n.accent-purple .page-item.active a,\n.accent-purple .page-item.active .page-link {\n  background-color: #6f42c1;\n  border-color: #6f42c1;\n  color: #fff;\n}\n\n.accent-purple .page-item.disabled a,\n.accent-purple .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-purple [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-purple [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-purple [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-purple [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-purple .page-item .page-link:hover, .dark-mode.accent-purple .page-item .page-link:focus {\n  color: #7e55c7;\n}\n\n.accent-pink .btn-link,\n.accent-pink a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-pink .nav-tabs .nav-link {\n  color: #e83e8c;\n}\n\n.accent-pink .btn-link:hover,\n.accent-pink a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-pink .nav-tabs .nav-link:hover {\n  color: #c21766;\n}\n\n.accent-pink .dropdown-item:active, .accent-pink .dropdown-item.active {\n  background-color: #e83e8c;\n  color: #fff;\n}\n\n.accent-pink .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #e83e8c;\n  border-color: #ac145a;\n}\n\n.accent-pink .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-pink .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-pink .custom-select:focus,\n.accent-pink .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-pink .custom-file-input:focus ~ .custom-file-label {\n  border-color: #f6b0d0;\n}\n\n.accent-pink .page-item .page-link {\n  color: #e83e8c;\n}\n\n.accent-pink .page-item.active a,\n.accent-pink .page-item.active .page-link {\n  background-color: #e83e8c;\n  border-color: #e83e8c;\n  color: #fff;\n}\n\n.accent-pink .page-item.disabled a,\n.accent-pink .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-pink [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-pink [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-pink [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-pink [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-pink .page-item .page-link:hover, .dark-mode.accent-pink .page-item .page-link:focus {\n  color: #eb559a;\n}\n\n.accent-red .btn-link,\n.accent-red a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-red .nav-tabs .nav-link {\n  color: #dc3545;\n}\n\n.accent-red .btn-link:hover,\n.accent-red a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-red .nav-tabs .nav-link:hover {\n  color: #a71d2a;\n}\n\n.accent-red .dropdown-item:active, .accent-red .dropdown-item.active {\n  background-color: #dc3545;\n  color: #fff;\n}\n\n.accent-red .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #dc3545;\n  border-color: #921925;\n}\n\n.accent-red .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-red .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-red .custom-select:focus,\n.accent-red .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-red .custom-file-input:focus ~ .custom-file-label {\n  border-color: #efa2a9;\n}\n\n.accent-red .page-item .page-link {\n  color: #dc3545;\n}\n\n.accent-red .page-item.active a,\n.accent-red .page-item.active .page-link {\n  background-color: #dc3545;\n  border-color: #dc3545;\n  color: #fff;\n}\n\n.accent-red .page-item.disabled a,\n.accent-red .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-red [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-red [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-red [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-red [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-red .page-item .page-link:hover, .dark-mode.accent-red .page-item .page-link:focus {\n  color: #e04b59;\n}\n\n.accent-orange .btn-link,\n.accent-orange a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-orange .nav-tabs .nav-link {\n  color: #fd7e14;\n}\n\n.accent-orange .btn-link:hover,\n.accent-orange a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-orange .nav-tabs .nav-link:hover {\n  color: #c35a02;\n}\n\n.accent-orange .dropdown-item:active, .accent-orange .dropdown-item.active {\n  background-color: #fd7e14;\n  color: #1f2d3d;\n}\n\n.accent-orange .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #fd7e14;\n  border-color: #aa4e01;\n}\n\n.accent-orange .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%231f2d3d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-orange .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-orange .custom-select:focus,\n.accent-orange .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-orange .custom-file-input:focus ~ .custom-file-label {\n  border-color: #fec392;\n}\n\n.accent-orange .page-item .page-link {\n  color: #fd7e14;\n}\n\n.accent-orange .page-item.active a,\n.accent-orange .page-item.active .page-link {\n  background-color: #fd7e14;\n  border-color: #fd7e14;\n  color: #fff;\n}\n\n.accent-orange .page-item.disabled a,\n.accent-orange .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-orange [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-orange [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-orange [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-orange [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-orange .page-item .page-link:hover, .dark-mode.accent-orange .page-item .page-link:focus {\n  color: #fd8c2d;\n}\n\n.accent-yellow .btn-link,\n.accent-yellow a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-yellow .nav-tabs .nav-link {\n  color: #ffc107;\n}\n\n.accent-yellow .btn-link:hover,\n.accent-yellow a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-yellow .nav-tabs .nav-link:hover {\n  color: #ba8b00;\n}\n\n.accent-yellow .dropdown-item:active, .accent-yellow .dropdown-item.active {\n  background-color: #ffc107;\n  color: #1f2d3d;\n}\n\n.accent-yellow .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #ffc107;\n  border-color: #a07800;\n}\n\n.accent-yellow .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%231f2d3d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-yellow .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-yellow .custom-select:focus,\n.accent-yellow .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-yellow .custom-file-input:focus ~ .custom-file-label {\n  border-color: #ffe187;\n}\n\n.accent-yellow .page-item .page-link {\n  color: #ffc107;\n}\n\n.accent-yellow .page-item.active a,\n.accent-yellow .page-item.active .page-link {\n  background-color: #ffc107;\n  border-color: #ffc107;\n  color: #fff;\n}\n\n.accent-yellow .page-item.disabled a,\n.accent-yellow .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-yellow [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-yellow [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-yellow [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-yellow [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-yellow .page-item .page-link:hover, .dark-mode.accent-yellow .page-item .page-link:focus {\n  color: #ffc721;\n}\n\n.accent-green .btn-link,\n.accent-green a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-green .nav-tabs .nav-link {\n  color: #28a745;\n}\n\n.accent-green .btn-link:hover,\n.accent-green a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-green .nav-tabs .nav-link:hover {\n  color: #19692c;\n}\n\n.accent-green .dropdown-item:active, .accent-green .dropdown-item.active {\n  background-color: #28a745;\n  color: #fff;\n}\n\n.accent-green .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #28a745;\n  border-color: #145523;\n}\n\n.accent-green .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");