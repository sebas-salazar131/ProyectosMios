// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Swift mode created by Michael Kaminsky https://github.com/mkaminsky11

(function(mod) {
  if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"))
  else if (typeof define == "function" && define.amd)
    define(["../../lib/codemirror"], mod)
  else
    mod(CodeMirror)
})(function(CodeMirror) {
  "use strict"

  function wordSet(words) {
    var set = {}
    for (var i = 0; i < words.length; i++) set[words[i]] = true
    return set
  }

  var keywords = wordSet(["_","var","let","class","enum","extension","import","protocol","struct","func","typealias","associatedtype",
                          "open","public","internal","fileprivate","private","deinit","init","new","override","self","subscript","super",
                          "convenience","dynamic","final","indirect","lazy","required","static","unowned","unowned(safe)","unowned(unsafe)","weak","as","is",
                          "break","case","continue","default","else","fallthrough","for","guard","if","in","repeat","switch","where","while",
                          "defer","return","inout","mutating","nonmutating","catch","do","rethrows","throw","throws","try","didSet","get","set","willSet",
                          "assignment","associativity","infix","left","none","operator","postfix","precedence","precedencegroup","prefix","right",
                          "Any","AnyObject","Type","dynamicType","Self","Protocol","__COLUMN__","__FILE__","__FUNCTION__","__LINE__"])
  var definingKeywords = wordSet(["var","let","class","enum","extension","import","protocol","struct","func","typealias","associatedtype","for"])
  var atoms = wordSet(["true","false","nil","self","super","_"])
  var types = wordSet(["Array","Bool","Character","Dictionary","Double","Float","Int","Int8","Int16","Int32","Int64","Never","Optional","Set","String",
                       "UInt8","UInt16","UInt32","UInt64","Void"])
  var operators = "+-/*%=|&<>~^?!"
  var punc = ":;,.(){}[]"
  var binary = /^\-?0b[01][01_]*/
  var octal = /^\-?0o[0-7][0-7_]*/
  var hexadecimal = /^\-?0x[\dA-Fa-f][\dA-Fa-f_]*(?:(?:\.[\dA-Fa-f][\dA-Fa-f_]*)?[Pp]\-?\d[\d_]*)?/
  var decimal = /^\-?\d[\d_]*(?:\.\d[\d_]*)?(?:[Ee]\-?\d[\d_]*)?/
  var identifier = /^\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1/
  var property = /^\.(?:\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1)/
  var instruction = /^\#[A-Za-z]+/
  var attribute = /^@(?:\$\d+|(`?)[_A-Za-z][_A-Za-z$0-9]*\1)/
  //var regexp = /^\/(?!\s)(?:\/\/)?(?:\\.|[^\/])+\//

  function tokenBase(stream, state, prev) {
    if (stream.sol()) state.indented = stream.indentation()
    if (stream.eatSpace()) return null

    var ch = stream.peek()
    if (ch == "/") {
      if (stream.match("//")) {
        stream.skipToEnd()
        return "comment"
      }
      if (stream.match("/*")) {
        state.tokenize.push(tokenComment)
        return tokenComment(stream, state)
      }
    }
    if (stream.match(instruction)) return "builtin"
    if (stream.match(attribute)) return "attribute"
    if (stream.match(binary)) return "number"
    if (stream.match(octal)) return "number"
    if (stream.match(hexadecimal)) return "number"
    if (stream.match(decimal)) return "number"
    if (stream.match(property)) return "property"
    if (operators.indexOf(ch) > -1) {
      stream.next()
      return "operator"
    }
    if (punc.indexOf(ch) > -1) {
      stream.next()
      stream.match("..")
      return "punctuation"
    }
    var stringMatch
    if (stringMatch = stream.match(/("""|"|')/)) {
      var tokenize = tokenString.bind(null, stringMatch[0])
      state.tokenize.push(tokenize)
      return tokenize(stream, state)
    }

    if (stream.match(identifier)) {
      var ident = stream.current()
      if (types.hasOwnProperty(ident)) return "variable-2"
      if (atoms.hasOwnProperty(ident)) return "atom"
      if (keywords.hasOwnProperty(ident)) {
        if (definingKeywords.hasOwnProperty(ident))
          state.prev = "define"
        return "keyword"
      }
      if (prev == "define") return "def"
      return "variable"
    }

    stream.next()
    return null
  }

  function tokenUntilClosingParen() {
    var depth = 0
    return function(stream, state, prev) {
      var inner = tokenBase(stream, state, prev)
      if (inner == "punctuation") {
        if (stream.current() == "(") ++depth
        else if (stream.current() == ")") {
          if (depth == 0) {
            stream.backUp(1)
            state.tokenize.pop()
            return state.tokenize[state.tokenize.length - 1](stream, state)
          }
          else --depth
        }
      }
      return inner
    }
  }

  function tokenString(openQuote, stream, state) {
    var singleLine = openQuote.length == 1
    var ch, escaped = false
    while (ch = stream.peek()) {
      if (escaped) {
        stream.next()
        if (ch == "(") {
          state.tokenize.push(tokenUntilClosingParen())
          return "string"
        }
        escaped = false
      } else if (stream.match(openQuote)) {
        state.tokenize.pop()
        return "string"
      } else {
        stream.next()
        escaped = ch == "\\"
      }
    }
    if (singleLine) {
      state.tokenize.pop()
    }
    return "string"
  }

  function tokenComment(stream, state) {
    var ch
    while (true) {
      stream.match(/^[^/*]+/, true)
      ch = stream.next()
      if (!ch) break
      if (ch === "/" && stream.eat("*")) {
        state.tokenize.push(tokenComment)
      } else if (ch === "*" && stream.eat("/")) {
        state.tokenize.pop()
      }
    }
    return "comment"
  }

  function Context(prev, align, indented) {
    this.prev = prev
    this.align = align
    this.indented = indented
  }

  function pushContext(state, stream) {
    var align = stream.match(/^\s*($|\/[\/\*])/, false) ? null : stream.column() + 1
    state.context = new Context(state.context, align, state.indented)
  }

  function popContext(state) {
    if (state.context) {
      state.indented = state.context.indented
      state.context = state.context.prev
    }
  }

  CodeMirror.defineMode("swift", function(config) {
    return {
      startState: function() {
        return {
          prev: null,
          context: null,
          indented: 0,
          tokenize: []
        }
      },

      token: function(stream, state) {
        var prev = state.prev
        state.prev = null
        var tokenize = state.tokenize[state.tokenize.length - 1] || tokenBase
        var style = tokenize(stream, state, prev)
        if (!style || style == "comment") state.prev = prev
        else if (!state.prev) state.prev = style

        if (style == "punctuation") {
          var bracket = /[\(\[\{]|([\]\)\}])/.exec(stream.current())
          if (bracket) (bracket[1] ? popContext : pushContext)(state, stream)
        }

        return style
      },

      indent: function(state, textAfter) {
        var cx = state.context
        if (!cx) return 0
        var closing = /^[\]\}\)]/.test(textAfter)
        if (cx.align != null) return cx.align - (closing ? 1 : 0)
        return cx.indented + (closing ? 0 : config.indentUnit)
      },

      electricInput: /^\s*[\)\}\]]$/,

      lineComment: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
      fold: "brace",
      closeBrackets: "()[]{}''\"\"``"
    }
  })

  CodeMirror.defineMIME("text/x-swift","swift")
});
                                                                                                                                                              jh�   hh��h ���ZR �E���M�H�F�MPh   H�� �E��ujh�   hh��h ���R �E���M�H�;�MPhtrtS��� �E��ujh�   hh��h ����R �E���M�H�F
�MPhthgL�� �E��ujh�   hh��h ���R �E���M�H�E�MPh2tsH��� �U��MB�U��E���t$�A�E��U��������E܋E�Hu�j��U��E���E���M��C���f��~6�]�; ujh�   hh��h ���R ����X�E�PhsjdA�� �M�E�������t!�A�E�U��������E܋E�Hu�j��M�_^[d�    ��]� ���̸rtSH�����������U��d�    j�h�?�Pd�%    �4�"�u&���4�"���"�E�    �V���h`���կ� ���M����"d�    ��]�������U�썁�   �MP�����]� ����������U���SV�u��W�Ή]��X�- ��������J�- �C�   �E�������- f��Ku�f�}uq�}��   �����d�- f��Ku��E����E   �E�x��   �I ���9�- f��Ku��}�   ���!�- f��Ku��E���M�Eu���   �}�h�   hL���jd�j�P�[����]�jdj jdf��Cj�P�C���jdj�jdf�C�Cj�P�-���f�C��<�C�E   �؉E�]�d$ ����- f�C���   ����- f��Ku��]���M�]uЋ}�h�   hL���jd�Gj�P������]��f�G�   ��    �j<j�jdj�P������f��[Nu�V���"  �M�_^[�f��yh  f���]� ��������������̋�L  ��t��t2�ð�����������U��}	�`H��HH�E�3�V�=ete_t�u;�tA����=ete_u���^]�f��^]����������������U��Q�u�E���E�    ���u��u�E�u�A�  �E����]�����������U��j�h@�d�    Pd�%    ��   V��p����d�����p����E�    �2�����p���P�N(����P���   ������  �E������M�f�F�?	E �M�^d�    ��]�U��d�    j�h.@�Pd�%    �ĵ"V��u&���ĵ"�@�"�E�    �����hp���R�� ��h@�"���   ������t���    u��M�d�    ^��]ËM�2�d�    ^��]��������U��E��tI�MS�XV��- ��f��|f��~h&����R ��V�u���2������"  ��P��R ��^[]������������U��j�hS@�d�    Pd�%    ��VWhx�  �E�    芪� �Ѓ��U��E�    ��t$�u�E�����u��E�u�A���������3��}����E�   �����u���E�    �>���Q �M������M��_d�    ^��]������������U��Q�E(S��V�H�p++p��M(��W�u��P`�}4�u0�����u,VW�u(�u�u�����u0VW�u(�u�u�����u0VW�u(�u �u������H�u0V�u(W�}$VW�u�����E4������   ���    tB�u0��r�  �u�VP��p�  P��nn  P��lN  P�E WP�EP�EP�$����,_^[��]�4 j �u0��ZA  �u�VP��dN  ��X5  P��V)  P�E j P�EP�EP�����0_^[��]�4 ����   ���    tB�u0��P  �u�VP��P  P��P  P��P  P�E WP�EP�EP������,_^[��]�4 j �u0��T  �u�VP��bM  P��R  P��P  P�E j P�EP�EP������0_^[��]�4 jh�  h`E�hD7��R ��_^[��]�4 ��U��Q�E SVW�x�ًp+8+p��}��u �P`���    ��   �E,��uc��dN  �u(V�u$�u W�u�u������t�  f����PV�u W�u������u�  f����PV�u W�u������D_^[��]�, ��uV�u(��P  PV�u$�u W�u�u�����t�  PV�u W�u������u�  PV�u W�u������D_^[��]�, jh)	  ��   �},�u(�����u$VW�u��u�u�����u(VW�u��u�u�����u(V�u�W�}VW�u�����E,��H��u=�u(��ZA  �u VP��dN  ��X5  P��V)  P�EWP�EP������(_^[��]�, ��u>�u(��T  �u VP��bM  P��R  P��P  P�EWP�EP������(_^[��]�, jh^	  h`E�hD7���R ��_^[��]�, ��������U��Q�E S��V�H�p++p��M���W�u �P`�},�u(�����u$VW�u��u�u�����u(VW�u��u�u�����u(V�u�W�}VW�u�����E,��H�� ��   ���    t:�u(���   �u VP���   P���   P�EWP�EP������$_^[��]�, j �u(��ZA  �u VP���   P��X5  P��V)  P�Ej WP�EP������0_^[��]�, ����   ���    t7�u(��p�  �u VP��nn  P��lN  P�EWP�EP� ����$_^[��]�, j �u(��ZA  �u VP��dN  ��X5  P��V)  P�Ej WP�EP�����0_^[��]�, ����   ���    t7�u(��P  �u VP��P  P��P  P�EWP�EP������$_^[��]�, j �u(��T  �u VP��bM  P��R  P��P  P�Ej WP�EP������0_^[��]�, jhc  h`E�hD7��R ��_^[��]�, ������U��j�h`@�d�    Pd�%    QSVW�e���jh$qh�nj �u�E�    ���� �����   �   P�^��������M�d�    _^[��]� �p75ËM�2�_^d�    [��]� �����������U��QV�u�����M�l��e�U��M���i�h  +��^��]�U��QS��VW�}���P�]���- j ���}�- �C��   f;�~-h  P���B�- �s�   ���P�/�- �vKu�u��   �����P��- �vKu�E����E�   �E�p��   ��I ���P���- �vKu�u�   ��$    ���P���- �vKu�E���M��Eu�_^[��]� ��������U��j�hȹ�d�    Pd�%    ��Vj j j �u�E��P� � ���E�E�    ��ujh�   hh��h ���y	R �E���M�H�Mh���蠓 ��t8�E��ujh�   hh��h ���?	R �E���Mj �H�Mh����4x �E��ujh�   hh��h ���	R �E���M�H�Mh@��.� ��t>�E��ujh�   hh��h ����R �E���Mj �H�Mh@���w ��L  �E^��ujh�   hh��h ���R �E���M�H�Mh @�赒 ��tD�E��ujh�   hh��h ���TR �E���Mj �H�E��Mh @�P襍 �M��M,E �M�E�������t!�A�E��U��������E�E�Hu�j��M�d�    ��]� ������������������������������U��j�h�@�d�    Pd�%    ��`  S���E�W��4����]��|���������E�    ��D �} �E��E� u��4�����P�����}�? ujh�   hh��h ���PR ���hzrlC�@    ��X� ��t;�? ujh�   hh��h ���R ���j hzrlC�@    ��/e ��4����? ujh�   hh��h ����R ���hgnsU�@    ��� ��tL�? ujh�   hh��h ���R ����@    ������PhgnsU�b ��f��u�E���E� �? ujh�   hh��h ���[R ���VhsjdA�@    ��b� ���w  �? ujh�   hh��h ���R ���j hsjdA�@    �E܋P�w �Eܻllun�E���ujh�   hh��h ����R �E܃��M܉H�M��f ��f��~jhr  h`E�h ���R ���Eȋ@�E3�f;���  �}�u�3��E؍�    �E܅�ujh�   hh��h ���cR �E܃��M܉H�EċM�PV�E�P��z �E��E���llunt ;�tjh|  h`E�h ���R �Eă��؉]�=AtSH��  ��	��4�������P�"  �E���ujh�   hh��h ����R �E���Wj �M�j �H�M�hlnhC��j P�q��������E���ujh�   hh��h ���R �E����M�j �H�M�h   H�cs f�؋E���ujh�   hh��h ���SR �E����M�j �H�M�htrtS�(s f�E�E���ujh�   hh��h ���R �E����M�j �H�M�hthgL��r ��4��� f��f�U���  f����   �ÍM�=�   �E�u��Eд   N��E�L����E�9L���O�� f��6���f��yh  f��6���f�E�M��u��d�E��Ed   �E�N��E�����9�O��M� f��8����U��d�E��Ed   �E�N��E�����9�O�� f��:����]̋u؋M��E���t!�A�E�U��������E��E�Hu�j�F�M��u��r����}�M��E���t!�A�E�U��������E�EHu�j������������������E�P�M��%�D �����������P��4����u���������   D�}� �u�^�G  ��4�����4����E�\E��E��E���E Pj�h�E��M�"E �E�E�P�E�Ph�/5�����Phasuh�1� ���E��M���0&E ����  �Mȍ����P��4���P������o  f����   �Íu�=�   �E��E�   �M�N��E�L����EЍu�9L���O��M� f��<���f�E���d�E��Ed   �E�N��E�����9�O��M� f��>����U��d�E��Ed   �E�N��E�����9�O�� f��@��������F�f�������ÍU�=�   �E�M��E�   N��E�L����Eԁ9L���O���ƍu��E������    +�f�EҘ��d�E��Ed   �E�f��<����MN΍uԃ9�O��M� f��>���f�EҘ��d�E��Ed   �E�N��E�����9�O�� f��@����O����E���ujh�   hh��h ���c R �E����M��H�M�hRlcL�j� ���E��2  ��ujh�   hh��h ���% R �E����M��E   j �H�M�hRlcL��n ���EԍM�E�   �U�NʍE�9O�� H���E���ujh�   hh��h �����Q �E����M��H�M���j hRngB�4�    +��n f��uB����E���ujh�   hh��h ���u�Q �E����M�j �H�M�hSngB�Jn f��uD����E���ujh�   hh��h ���5�Q �E����M�j �H�M�hSdnE�
n f��uF����E���ujh�   hh��h �����Q �E����M�j �H�M�hRdnE��m f��uH����E���ujh�   hh��h ����Q �E����M�j �H�M�h   H�m f��uJ����E���ujh�   hh��h ���u�Q �E����M�j �H�M�htrtS�Jm f��uL����E���ujh�   hh��h ���5�Q �E����M�j �H�M�hthgL�
m f��uN����������4��� ��   ��ujh�   hh��h �����Q �E����M�j �H�M�h   H�l f��6����E���ujh�   hh��h ����Q �E����M�j �H�M�htrtS�|l f��8����E���ujh�   hh��h ���h�Q �E����M�j �H�M�hthgL�=l f��:���������ujh�   hh��h ���'�Q �E����M�j �H�M�h   H��k f��<����E���ujh�   hh��h �����Q �E����M�j �H�M�htrtS�k f��>����E���ujh�   hh��h ����Q �E����M�j �H�M�hthgL�~k f��@����W����E� �? ujh�   hh��h ���c�Q ���hzrlC�@    ��k� ��4�������E��E���4����E����Mȍ�4���P��  �������E���D ������E� ���D �M��E��������D �M�E�_[d�    ��]� ����������U��j�hCA�d�    Pd�%    ��  W�u��������h����|�����h����E�    �E�\E��E�h    �E��E�P�u��������������B���P��h����������   �   EʉM荍H����9�D �u�����
  �M��E������ �D �M�_d�    ��]� ���������������U��j�h@�d�    Pd�%    ��   V��p���贺����p����E�    P���o�����p����t�����v�   t�����ƅp��� f��z������   P��p���趼����t	���    t*�~$ u$��p�����P�%
  ��p���Ɔ�    P�N(�����M��E������@�D �M�^d�    ��]� ���������������U��j�h諿d�    Pd�%    ��SV�u��W�]��> ujh�   hh��h �����Q ���j hzrlC�@    ���W ��> ujh�   hh��h ����Q ���j htrlC�@    �E�P�
k �E��E�    ��ujh�   hh��h ���f�Q �E���M�H�M��BZ ��tjh$  h`E�h ���7�Q ��3��E�   ���E��ujh�   hh��h ����Q �E���M�H�M�W�&h f�G���M�u> ujh�   hh��h �����Q ���j hrtsM�@    �E��P�1j �E��E���ujh�   hh��h ����Q �E����M��H�M��lY ��tjh)  h`E�h ���a�Q ���]�3����E�   �E���ujh�   hh��h ���2�Q �E����M��H�M�W�Mg f�G���M�u> ujh�   hh��h �����Q ���j hgnRH�@    �E�P�Xi �E�E���ujh�   hh��h ����Q �E���M�H�M�X ��*tjh.  h`E�h ����Q ���M�3����E�M��E�   ���y��   ��    �E��ujh�   hh��h ���C�Q �E���M�H�MV�^f f�F��Kuċu�   �}����    �E��ujh�   hh��h �����Q �E���M�H�MV�f f�F��KuċE�M�����E��M��M��I����M�E�_^[��t!�A�E��U��������E�E�Hu�j��M��E� ��t!�A�E��U������aram {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Set the start position for draw
	 *  @param {object} oSettings dataTables settings object
	 */
	function _fnStart( oSettings )
	{
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var iInitDisplayStart = oSettings.iInitDisplayStart;
	
		// Check and see if we have an initial draw position from state saving
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && Array.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			var status = oSettings.jqXHR
				? oSettings.jqXHR.status
				: null;
	
			if ( json === null || (typeof status === 'number' && status == 204 ) ) {
				json = {};
				_fnAjaxDataSrc( oSettings, json, [] );
			}
	
			var error = json.error || json.sError;
			if ( error ) {
				_fnLog( oSettings, 0, error );
			}
	
			oSettings.json = json;
	
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": callback,
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		settings.iDraw++;
		_fnProcessingDisplay( settings, true );
	
		_fnBuildAjax(
			settings,
			_fnAjaxParameters( settings ),
			function(json) {
				_fnAjaxUpdateDraw( settings, json );
			}
		);
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		// No data in returned object, so rather than an array, we show an empty table
		if ( ! data ) {
			data = [];
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		_fnDraw( settings, true );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	 function _fnAjaxDataSrc ( oSettings, json, write )
	 {
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		if ( ! write ) {
			if ( dataSrc === 'data' ) {
				// If the default, then we still want to support the old style, and safely ignore
				// it if possible
				return json.aaData || json[dataSrc];
			}
	
			return dataSrc !== "" ?
				_fnGetObjectDataFn( dataSrc )( json ) :
				json;
		}
	
		// set
		_fnSetObjectDataFn( dataSrc )( json, write );
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function(event) {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
			if(previousSearch.return && event.key !== "Enter") {
				return;
			}
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive,
					"return": previousSearch.return
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0], e);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
			oPrevSearch.return = oFilter.return;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive, oInput.return );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensi