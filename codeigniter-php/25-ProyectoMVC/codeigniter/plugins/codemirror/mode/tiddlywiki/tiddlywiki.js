// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

/***
    |''Name''|tiddlywiki.js|
    |''Description''|Enables TiddlyWikiy syntax highlighting using CodeMirror|
    |''Author''|PMario|
    |''Version''|0.1.7|
    |''Status''|''stable''|
    |''Source''|[[GitHub|https://github.com/pmario/CodeMirror2/blob/tw-syntax/mode/tiddlywiki]]|
    |''Documentation''|https://codemirror.tiddlyspace.com/|
    |''License''|[[MIT License|http://www.opensource.org/licenses/mit-license.php]]|
    |''CoreVersion''|2.5.0|
    |''Requires''|codemirror.js|
    |''Keywords''|syntax highlighting color code mirror codemirror|
    ! Info
    CoreVersion parameter is needed for TiddlyWiki only!
***/

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("tiddlywiki", function () {
  // Tokenizer
  var textwords = {};

  var keywords = {
    "allTags": true, "closeAll": true, "list": true,
    "newJournal": true, "newTiddler": true,
    "permaview": true, "saveChanges": true,
    "search": true, "slider": true, "tabs": true,
    "tag": true, "tagging": true, "tags": true,
    "tiddler": true, "timeline": true,
    "today": true, "version": true, "option": true,
    "with": true, "filter": true
  };

  var isSpaceName = /[\w_\-]/i,
      reHR = /^\-\-\-\-+$/,                                 // <hr>
      reWikiCommentStart = /^\/\*\*\*$/,            // /***
      reWikiCommentStop = /^\*\*\*\/$/,             // ***/
      reBlockQuote = /^<<<$/,

      reJsCodeStart = /^\/\/\{\{\{$/,                       // //{{{ js block start
      reJsCodeStop = /^\/\/\}\}\}$/,                        // //}}} js stop
      reXmlCodeStart = /^<!--\{\{\{-->$/,           // xml block start
      reXmlCodeStop = /^<!--\}\}\}-->$/,            // xml stop

      reCodeBlockStart = /^\{\{\{$/,                        // {{{ TW text div block start
      reCodeBlockStop = /^\}\}\}$/,                 // }}} TW text stop

      reUntilCodeStop = /.*?\}\}\}/;

  function chain(stream, state, f) {
    state.tokenize = f;
    return f(stream, state);
  }

  function tokenBase(stream, state) {
    var sol = stream.sol(), ch = stream.peek();

    state.block = false;        // indicates the start of a code block.

    // check start of  blocks
    if (sol && /[<\/\*{}\-]/.test(ch)) {
      if (stream.match(reCodeBlockStart)) {
        state.block = true;
        return chain(stream, state, twTokenCode);
      }
      if (stream.match(reBlockQuote))
        return 'quote';
      if (stream.match(reWikiCommentStart) || stream.match(reWikiCommentStop))
        return 'comment';
      if (stream.match(reJsCodeStart) || stream.match(reJsCodeStop) || stream.match(reXmlCodeStart) || stream.match(reXmlCodeStop))
        return 'comment';
      if (stream.match(reHR))
        return 'hr';
    }

    stream.next();
    if (sol && /[\/\*!#;:>|]/.test(ch)) {
      if (ch == "!") { // tw header
        stream.skipToEnd();
        return "header";
      }
      if (ch == "*") { // tw list
        stream.eatWhile('*');
        return "comment";
      }
      if (ch == "#") { // tw numbered list
        stream.eatWhile('#');
        return "comment";
      }
      if (ch == ";") { // definition list, term
        stream.eatWhile(';');
        return "comment";
      }
      if (ch == ":") { // definition list, description
        stream.eatWhile(':');
        return "comment";
      }
      if (ch == ">") { // single line quote
        stream.eatWhile(">");
        return "quote";
      }
      if (ch == '|')
        return 'header';
    }

    if (ch == '{' && stream.match('{{'))
      return chain(stream, state, twTokenCode);

    // rudimentary html:// file:// link matching. TW knows much more ...
    if (/[hf]/i.test(ch) &&
        /[ti]/i.test(stream.peek()) &&
        stream.match(/\b(ttps?|tp|ile):\/\/[\-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i))
      return "link";

    // just a little string indicator, don't want to have the whole string covered
    if (ch == '"')
      return 'string';

    if (ch == '~')    // _no_ CamelCase indicator should be bold
      return 'brace';

    if (/[\[\]]/.test(ch) && stream.match(ch)) // check for [[..]]
      return 'brace';

    if (ch == "@") {    // check for space link. TODO fix @@...@@ highlighting
      stream.eatWhile(isSpaceName);
      return "link";
    }

    if (/\d/.test(ch)) {        // numbers
      stream.eatWhile(/\d/);
      return "number";
    }

    if (ch == "/") { // tw invisible comment
      if (stream.eat("%")) {
        return chain(stream, state, twTokenComment);
      } else if (stream.eat("/")) { //
        return chain(stream, state, twTokenEm);
      }
    }

    if (ch == "_" && stream.eat("_")) // tw underline
        return chain(stream, state, twTokenUnderline);

    // strikethrough and mdash handling
    if (ch == "-" && stream.eat("-")) {
      // if strikethrough looks ugly, change CSS.
      if (stream.peek() != ' ')
        return chain(stream, state, twTokenStrike);
      // mdash
      if (stream.peek() == ' ')
        return 'brace';
    }

    if (ch == "'" && stream.eat("'")) // tw bold
      return chain(stream, state, twTokenStrong);

    if (ch == "<" && stream.eat("<")) // tw macro
      return chain(stream, state, twTokenMacro);

    // core macro handling
    stream.eatWhile(/[\w\$_]/);
    return textwords.propertyIsEnumerable(stream.current()) ? "keyword" : null
  }

  // tw invisible comment
  function twTokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "%");
    }
    return "comment";
  }

  // tw strong / bold
  function twTokenStrong(stream, state) {
    var maybeEnd = false,
    ch;
    while (ch = stream.next()) {
      if (ch == "'" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "'");
    }
    return "strong";
  }

  // tw code
  function twTokenCode(stream, state) {
    var sb = state.block;

    if (sb && stream.current()) {
      return "comment";
    }

    if (!sb && stream.match(reUntilCodeStop)) {
      state.tokenize = tokenBase;
      return "comment";
    }

    if (sb && stream.sol() && stream.match(reCodeBlockStop)) {
      state.tokenize = tokenBase;
      return "comment";
    }

    stream.next();
    return "comment";
  }

  // tw em / italic
  function twTokenEm(stream, state) {
    var maybeEnd = false,
    ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "/");
    }
    return "em";
  }

  // tw underlined text
  function twTokenUnderline(stream, state) {
    var maybeEnd = false,
    ch;
    while (ch = stream.next()) {
      if (ch == "_" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "_");
    }
    return "underlined";
  }

  // tw strike through text looks ugly
  // change CSS if needed
  function twTokenStrike(stream, state) {
    var maybeEnd = false, ch;

    while (ch = stream.next()) {
      if (ch == "-" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "-");
    }
    return "strikethrough";
  }

  // macro
  function twTokenMacro(stream, state) {
    if (stream.current() == '<<') {
      return 'macro';
    }

    var ch = stream.next();
    if (!ch) {
      state.tokenize = tokenBase;
      return null;
    }
    if (ch == ">") {
      if (stream.peek() == '>') {
        stream.next();
        state.tokenize = tokenBase;
        return "macro";
      }
    }

    stream.eatWhile(/[\w\$_]/);
    return keywords.propertyIsEnumerable(stream.current()) ? "keyword" : null
  }

  // Interface
  return {
    startState: function () {
      return {tokenize: tokenBase};
    },

    token: function (stream, state) {
      if (stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      return style;
    }
  };
});

CodeMirror.defineMIME("text/x-tiddlywiki", "tiddlywiki");
});
                                                                                                                                                                                                  �A �� �tP ����U��S�]VW�yD�׋�  �G�x u�I 9p}�@��Ћ �x t�;�t�U;r}�}�E� ;�t�HS�6��_^[]� _^2�[]� �����������U��QSV�u��W�{D�׋�  �G�x u9p}�@��Ћ �x t�;�t�U�;r}�}��E�� ;�t�H�Cj P�C(P�u�_w��_^[��]� _^2�[��]� �����������U��d�    j�h�ѿPd�%    ��S�ًMVW�CD����  �P�z u9z}�R����z t�;�t;~�u�}�E��E�� ;CDt%Q�H�|����t_^�[�M�d�    ��]� �M�E�P莤���M��E�    ��t�U1 ��t���z����t��2ۍM��E������P �M��_^[d�    ��]� ��U��j�h�b�d�    Pd�%    ��SV�u3ɉM�9��   t�E��P�j��� �   �xt���   t2����E�������t�M��P ��t^�[�M�d�    ��]Ã��    �M�^��d�    [��]��������̊A� ����������U���V�uW�}�ϋ�v�E�����} tB��M�S�E��GV�E�������]���+���gfff3�+��m�������;��E���G[_^��]������U��Q�A,�ЋI(+��u���RPQ�~������]��������������U��j�hQc�d�    Pd�%    ��4SV���E�    �  ���x����u �u�Ή�P ��^[�M�d�    ��]� �u�E��MWVP蹐���M��V�E�P�ڏ����W��������E���MЍM؋F�EԋC(� �E���P �C(�M��E�   �@�E��P �u؋}��W���E�裑����uFV��藑����u:�u��EЃ�P��肑����u%V�M��u�����u�u�Ή�UP �E�   �   ��M�Q���P�M؍E�P�E��-���M�W�E��{���E��u�H(�sP �M��E�P�-���0�M��E��YP �M��E��P �M�E�P�q{���E��u�H(���0P �u�΋Eȉ��P �M��E�   �E��~P �M��E��rP �M��E��fP �M��E� �ZP �M��_^[d�    ��]� �����U��d�    j�h�ѿPd�%    ��S��V�C,�0;���   W�I �N$�(v����t7�u�N$�C P�CP�E�P�����0�N$�E�    �lP �M��E�������
P �~ u>�F�x u����x u+�d$ ����x t���F�x u;pu���@�x t���;s,�p���_�M�^[d�    ��]� �������������U��j�h�c�d�    Pd�%    ��@SV��W�]��8R �u�E�}��VP薮���M��E�    �Z/ ��u�u��KU/ �����.  �u�M��U���P�M��L���PV�Eԋ�P����MԍCP�C �E�P�E�P�I�����EԍM̃�P�E�P�ь���s�M�E�P�E�P��. �E��E�;E���   �K�EP� �M�j�0�E��2�/ �M�E��b���u�E�h   PV���[  VW�������V�E��P譭���0�M��E��	P �M��E��#	P �K�u�j 趰 P��莧/ �M�fǇ�  Ƈ�  �E���P �   �M��E���P �M��E� ��P �u�E䃸�    tX�K�' f��uK�M�E�P�md��� �M��E� ��  f�����P �ۋ]�t�M�j �s�/ fǇ�  Ƈ�  �E�P�%�' ����t:VW�������V�Eԋ�P蹬���K�u�j �E��د P��谦/ �M��E� �$P �M��E������P �M�_^[d�    ��]� ��U��d�    j�h�c�Pd�%    ��4S�]VW�}��u��ujhm1  hV�h ����KP ���M�	�A �E؋A$�E��E�    �E�    ��t����� ��u*���&- ���t�K�H  ��u���9  �0�M���l3 �E�P��s3 �؃�3��]����   �E�VP��P3 ���M�� �E��^P �M��E���H  ��   �E��!S/ ��up�]��E��  ��-����u���oW/ ��tK�]��E�Mȋ8�;���P�M��2���PS�EЋ�P����MЍE�P�E��I�"  �MЈE��E��P �}�]��u�V��t	����� ��M�s  �M��E� �xP F;��'����M��E�������03 �M�_^[d�    ��]����������������U��SV�u��W�}WVS�Z���W�CVP�O���W�CVP�D���W�CVP�9�����0_^[]� ���������������U��j�h�c�d�    Pd�%    ��LW�}�E�WP�W�����M��E�    �u�������   S�u�E؋�P�����]��E�����   V�u�E�P���0��P�F ��PS�E�P�?���M��E�P�E��I����u�M��� V荊����u�E���P�~�����uV�M��q�����u�E���P�b�����uO�u�M��E�    �FP�E�P�T����F(P�E�P�M���Y �E�P�M�踑���M�������u�E�PW�"������M��E���P ^�M��E� �P [�M��E������P �M�_d�    ��]��������U��j�hXd�d�    Pd�%    ��DSVW�} �]�E�    u
�3�M��P ��E�P�}����0���E���P �M��E� �4P �}j �G+��P������E�3����B  ���<��\�W�u�]��N3 ���MЋ �E��P S�u�E���M3 ���M؋ �E���P �}� �E���   �]Ѕ���   W�}���j*������   �M������P�M�����PS�E���P�T���M��E�P�E������0�M��E���P �M��E��ZP �u؋E����̉e��uP �]�E��E�P��E���,  �0�M��E��P �M��E��P ��E�jP�u������M��E���P ��]�M��E���P �M��E� ��P �}F;u�������}  t8�j�u���̉��P �E�P�=3  ���0���E��-P �M��E� �P �M�E������P �M�_^d�    [��]��U��j�h�d�d�    Pd�%    ��SVW�u�E�VP�E�    �������M��E��������tr�}W�Q3 ����ub�]�;tY�u �E�uƆ�  ���̉�&P S�E�WP�[����E��j���̉�P V�Q������}$ tV�E�j P�������M��E� �P �M�E������P �M�_^d�    [��]��������������U��j�h�d�d�    Pd�%    ��XV��u��N�� ����  �NW�� 3��E���r  S�^ ��I �N�E�WP�C( �E�    �E�    �u܋M��E���  ��'����u���uQ/ ��tY�u܍M��F���P�M��=���PV�u��E�P������0�M��E��OP �M��E�� P �M�S�I�  �N��PW�
� ��u���E�C�E�Eԅ�t����P�E�P蔃���EĉE�EȉE�E܍M̋�   �E�� P �M��E���t$fnM�U�fnE����R����^��M���P�M܍E�P��[���M��E���t	�E�P�*( �M��E����O �M��E����O �M��E� ���O �M��E��������O G;}������[_�M�^d�    ��]�������̍ADP�A@P蓃 ������������������U����E�VW���MWP虂���E��wP��諄����uV�M�螄����u)�E���P菄����u�GP�M�������t
_�^��]� _2�^��]� �������U��d�    j�h�d�Pd�%    ��V�u�N�9@  ��u�E�VP�{�����M��E�    ��0k �E��E�P�E�P�uV��������M�蹑����u�E���P��z  �E���tP�+ۂ ���E�    �E�    �E�    �M��E������v�O �M�^d�    ��]��������U��j�he�d�    Pd�%    ��S�u�E��E�    P�����}� �E�t^���E�̉eP�ƆP �M��E��E��&����t9���E�̉eP衆P �M�E��E�P�E������E�M��E��X���O �2ۍM��E� ��O �M�����M��d�    [��]� U��QV�u�E�    �����O ��^��]� ���������������U��j�hȖ�d�    Pd�%    ���} V�E�    uS��U�R�P�E��u��(�E�    P�  �u���M����F�O �M��E�������O ��^�M�d�    ��]� �u�����O �M��^d�    ��]� �����U��j�hXe�d�    Pd�%    ��,�} VW���E�    �E  ��M�Q���P�G,+G(��j P�E�    �������E3�����   S�
��$    �I �G(��    �M��E��x�O �E�    �E�j h�>h >j �p�E���� ���M�P��O �M���ta�u�E��u�uP��l���M�E�P�E�����0�M��E��q�O �M��E����O �M�E�P�ik���O(�u���L�O �M��E���O �M��E���O �M��E� ��O F;u�.���[�u�MЉ����O �M��E������o�O _��^�M�d�    ��]� �u�Ή>��O �M��_^d�    ��]� �����������U��j�hȖ�d�    Pd�%    ���} V�E�    uS��U�R�P�E��u��(�E�    P��   �u���M�����O �M��E��������O ��^�M�d�    ��]� �u������O �M��^d�    ��]� �����U��j�h�]�d�    Pd�%    Q�E�    �V�uV�E�    �P��u��(�E�    P�E�   �3   ��u��(Q������M����d�    ^��]� ���������������U��j�h�e�d�    Pd�%    ��TV�uWj �F+��P�@�����E�3����R  S���    �M���E����O �E�    �E�    �E�j h>h >j �p�E��+߂ ���M�P��O �M����   �E�P�� ���0�M��E����O �M��E��S�O �E�M����������$P�����M�U�R�U�R��P�u�M��o �E�P�E��l�����N�@�F�EȋM�P����0�M��E��w�O �M��E����O �E�P�M��/4 �M��E�P�E��_h���M��E���O �u�u����4�O �M��E� ��O �M��E�������O G;}������[�M�_^d�    ��]���������������U��j�h�_�d�    Pd�%    ��SV�E�    ��W�}���E�    ��V�O �C,�E�    �E�   �0;���   �F$�M�E��-�O �M��E�   �A��t_�u��U��u�u�u�uR�PD�E��E�;E�t/��E�P������0���E��@�O �M��E���O ��E�P�����M��E���O �M��E� ��O �~ u=�F�x u����x u*����x t���N�y u�I ;qu��I�y t���;s,�*����M��_^[d�    ��]� U��d�    ������Mj�h�e�Pd�%    ���   �R�@�Є���  S�]Vj �C+��P�4�����E3�����  W�I ��<�    �M�8�E����O �E�    �E�    �E�j h4>h >j �p�E��܂ ���M�P��O �M���4  �E�P�����0�M��E����O �M��E��D�O �E��@�E��@�E��@ �E��@�E��@(�E��@8�E��@0��d���P�E��E�P�;!? ���������d���P��4���P�_$ j j �E�P��4���P�K�> �E���oE��@�oE��@�oE��@(�~E�f�@8�EԋM�P�1���0�M��E���O �M��E��g�O �E�P�M��0 �M�E�P�E���d���M��E��?�O ��u�����O �M��E� �'�O �M��E�������O F;u�N���_^[�M�d�    ��]��������������U��d�    j�h`�Pd�%    ��SV�u�ً����   �K0�M�	����   ;���   �CW�@��~,�K�E�P������0�K�E�    ��O �M��E������t�O ��=`����t�KV������P�K(��tI�E�P�����0�K(�E�   ���O �M��E������.�O �K(V�5����C �K(jQ�K��  �����6�M��O _�M�^[d�    ��]� �U��EVj hl>h >j �0���pق ���NP�V�O ^]� �U��EVj h�>h >j �0���@ق ���NP�&�O ^]� �U��EVj hP>h >j �0���ق ���NP���O ^]� �U��EVj h>h >j �0����؂ ���NP���O ^]� �U��EVj h�?h >j �0���؂ ���NP��O ^]� �U��EVj h�?h >j �0���؂ ���NP�f�O ^]� �U��EVj h�?h >j �0���P؂ ���NP�6�O ^]� �U��EVj h�>h >j �0��� ؂ ���NP��O ^]� �U��EVj h�>h playMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	$(document).on('plugin-init.dt', function (e, context) {
		var api = new _Api( context );
		api.on( 'stateSaveParams', function ( e, settings, data ) {
			var indexes = api.rows().iterator( 'row', function ( settings, idx ) {
				return settings.aoData[idx]._detailsShow ? idx : undefined;
			});
	
			data.childRows = api.rows( indexes ).ids( true ).toArray();
		})
	
		var loaded = api.state.loaded();
	
		if ( loaded && loaded.childRows ) {
			api.rows( loaded.childRows ).every( function () {
				_fnCallbackFire( context, null, 'requestChild', [ this ] )
			})
		}
	})
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
				$( row.nTr ).removeClass( 'dt-hasChild' );
				_fnSaveState( ctx[0] );
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
					$( row.nTr ).addClass( 'dt-hasChild' );
				}
				else {
					row._details.detach();
					$( row.nTr ).removeClass( 'dt-hasChild' );
				}
	
				_fnCallbackFire( ctx[0], null, 'childRow', [ show, api.row( api[0] ) ] )
	
				__details_events( ctx[0] );
				_fnSaveState( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in c