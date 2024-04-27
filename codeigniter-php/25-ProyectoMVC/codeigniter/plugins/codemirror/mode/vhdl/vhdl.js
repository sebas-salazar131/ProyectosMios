// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

// Originally written by Alf Nielsen, re-written by Michael Zhou
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

function words(str) {
  var obj = {}, words = str.split(",");
  for (var i = 0; i < words.length; ++i) {
    var allCaps = words[i].toUpperCase();
    var firstCap = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    obj[words[i]] = true;
    obj[allCaps] = true;
    obj[firstCap] = true;
  }
  return obj;
}

function metaHook(stream) {
  stream.eatWhile(/[\w\$_]/);
  return "meta";
}

CodeMirror.defineMode("vhdl", function(config, parserConfig) {
  var indentUnit = config.indentUnit,
      atoms = parserConfig.atoms || words("null"),
      hooks = parserConfig.hooks || {"`": metaHook, "$": metaHook},
      multiLineStrings = parserConfig.multiLineStrings;

  var keywords = words("abs,access,after,alias,all,and,architecture,array,assert,attribute,begin,block," +
      "body,buffer,bus,case,component,configuration,constant,disconnect,downto,else,elsif,end,end block,end case," +
      "end component,end for,end generate,end if,end loop,end process,end record,end units,entity,exit,file,for," +
      "function,generate,generic,generic map,group,guarded,if,impure,in,inertial,inout,is,label,library,linkage," +
      "literal,loop,map,mod,nand,new,next,nor,null,of,on,open,or,others,out,package,package body,port,port map," +
      "postponed,procedure,process,pure,range,record,register,reject,rem,report,return,rol,ror,select,severity,signal," +
      "sla,sll,sra,srl,subtype,then,to,transport,type,unaffected,units,until,use,variable,wait,when,while,with,xnor,xor");

  var blockKeywords = words("architecture,entity,begin,case,port,else,elsif,end,for,function,if");

  var isOperatorChar = /[&|~><!\)\(*#%@+\/=?\:;}{,\.\^\-\[\]]/;
  var curPunc;

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (hooks[ch]) {
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == '"') {
      state.tokenize = tokenString2(ch);
      return state.tokenize(stream, state);
    }
    if (ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    }
    if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      curPunc = ch;
      return null;
    }
    if (/[\d']/.test(ch)) {
      stream.eatWhile(/[\w\.']/);
      return "number";
    }
    if (ch == "-") {
      if (stream.eat("-")) {
        stream.skipToEnd();
        return "comment";
      }
    }
    if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return "operator";
    }
    stream.eatWhile(/[\w\$_]/);
    var cur = stream.current();
    if (keywords.propertyIsEnumerable(cur.toLowerCase())) {
      if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
      return "keyword";
    }
    if (atoms.propertyIsEnumerable(cur)) return "atom";
    return "variable";
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next, end = false;
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) {end = true; break;}
        escaped = !escaped && next == "--";
      }
      if (end || !(escaped || multiLineStrings))
        state.tokenize = tokenBase;
      return "string";
    };
  }
  function tokenString2(quote) {
    return function(stream, state) {
      var escaped = false, next, end = false;
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) {end = true; break;}
        escaped = !escaped && next == "--";
      }
      if (end || !(escaped || multiLineStrings))
        state.tokenize = tokenBase;
      return "string-2";
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
    return state.context = new Context(state.indented, col, type, null, state.context);
  }
  function popContext(state) {
    var t = state.context.type;
    if (t == ")" || t == "]" || t == "}")
      state.indented = state.context.indented;
    return state.context = state.context.prev;
  }

  // Interface
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
      if (style == "comment" || style == "meta") return style;
      if (ctx.align == null) ctx.align = true;

      if ((curPunc == ";" || curPunc == ":") && ctx.type == "statement") popContext(state);
      else if (curPunc == "{") pushContext(state, stream.column(), "}");
      else if (curPunc == "[") pushContext(state, stream.column(), "]");
      else if (curPunc == "(") pushContext(state, stream.column(), ")");
      else if (curPunc == "}") {
        while (ctx.type == "statement") ctx = popContext(state);
        if (ctx.type == "}") ctx = popContext(state);
        while (ctx.type == "statement") ctx = popContext(state);
      }
      else if (curPunc == ctx.type) popContext(state);
      else if (ctx.type == "}" || ctx.type == "top" || (ctx.type == "statement" && curPunc == "newstatement"))
        pushContext(state, stream.column(), "statement");
      state.startOfLine = false;
      return style;
    },

    indent: function(state, textAfter) {
      if (state.tokenize != tokenBase && state.tokenize != null) return 0;
      var firstChar = textAfter && textAfter.charAt(0), ctx = state.context, closing = firstChar == ctx.type;
      if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : indentUnit);
      else if (ctx.align) return ctx.column + (closing ? 0 : 1);
      else return ctx.indented + (closing ? 0 : indentUnit);
    },

    electricChars: "{}"
  };
});

CodeMirror.defineMIME("text/x-vhdl", "vhdl");

});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ��{ ��j j ���{ ����������������U��j�h�ټd�    Pd�%    ���ESVW3��e��}�م�t%=�Q wi�(  P��{ �����}��u�`S��u�E��E�    j PW�s�3�A����C���3�ȉE�+θ���(�E�������������E��t!;u�t���������(  ;u�u��3��{ ��iE(  �M�;ǉCiE�(  �_�C^d�    [��]� �u����{ ��j j ���{ �U��SVW�����g݋w�_+���֋u�������;�s>+���g���E>���������+�;�shD{��dS��1��P�@���P������_^[]� �U��S�Y����*V�q��+���W�}�������;�ss+1����*���
�������+�;�shD{��dS�+����*�������
���������+�;�s3�;�_B�^[�E]������;�_B�^[�E]�����_^[]� ��������������U��S�Y����(V�q��+���W�}�������;�ss+1����(���Q �������+�;�shD{��dS�+����(�����Q ���������+�;�s3�;�_B�^[�E]�X����;�_B�^[�E]�E���_^[]� ��������������SVW���_�7;�t���N�X�����;�u��G_^[ËƉG_^[����������������SVW���_�7;�t�����	�����0;�u��G_^[ËƉG_^[�U����ES��V�u�]�;u;su蟕���E�M^[���]� ;�tJ�KW��;�t��V��觝I ����;�u�E�]��K���M�;�t�ً�������;�u�E�]��{_�M^[�����]� ��U��V��W�}�N;�s]�;�wW+����g�����������;Nu	j��������Vk�%��t[�o_��oA�B�A �B �A$�B$�F%^]� ;Nu	j�������N��t�o��oG�A�G �A �G$�A$�F%_^]� �����U��j�hb�d�    Pd�%    QV��W�}�N;�sL�;�wF+�����*���������;Nu	j���������ȋN�M�M��E�    ��t;���B�);Nu	j���o����N�M�M��E�   ��t���GP���˙I �F�M�_^d�    ��]� �����U��V�uW�};�t^��(�F���tP�o�{ ���F�    �F�    �    �F��tP�K�{ ���F�    �F�    �F�    �N���x< ��,�F�;�u�_^]����������������U��j�h�ټd�    Pd�%    ��S�]V�uW�}�e��}��E�    ;���   �}�E���tB��O��F�G�F�G�F�G�FP�gs< �F�E�P�O�7����F �E�P�O �wo����,�E� �}��,뜋u�};�tV�u��   ��,��;�u�j j �n�{ �M��_^d�    [��]����������������U��j�h�ټd�    Pd�%    QW�}�}��E�    ��tGV�u�O���F�G�F�G�F�G�FP�r< �F�E�P�O�o����F �E�P�O �n��^�M�_d�    ��]� �������������U��V�u�F ��tP��{ ���F     �F$    �F(    �F��tP�e�{ ���F    �F    �F    �N^]��v< �����U��j�h=ڼd�    Pd�%    QV��u�����F    �E�    �F    �F    �F    �F     �F$    �F(    �F,    �F0    �F4    �F8    �F<    �F@    �FD    �FH����FL    �FT    �FX    �F\    �F`    �Fd    �Fh    �Np�E�����ǆ�       W�ǆ�       ǆ�       ǆ�       ���   ǆ�       Ɔ�    ��ǆ�       ǆ�       ǆ�       ���   �Fl    ��  �M��^d�    ��]������U���V����t.�u��M�Q�vP�1����6��{ ���    �F    �F    ^��]���������������U��j�h�ڼd�    Pd�%    ��SV��W�u�����E�   �{  ����  ���   �E���t?�u�M�Q���   P�������   �&�{ ��ǆ�       ǆ�       ǆ�       �Np�E�������NH�E������F<��tP���{ ���F<    �F@    �FD    �F0��tP��{ ���F0    �F4    �F8    �~$�E���t8�^(;�t�I ���I�����%;�u��v$�x�{ ���F$    �F(    �F,    �~��t9�^;�t�d$ ��������;�u��v�8�{ ���F    �F    �F     �N�E� �I �N�E������wI �M�_^[d�    ��]�������U��V���U����Et	V���{ ����^]� �����������������  �����������U��E�  �E�  ]� �������������SVW���Ol��t�_����Ol��t�j��Gl    �OH�C������|  �O��
I �O��
I �_�w;�t����������;�u�G�G�_(�w$;�t�����������%;�u�G$�G(_^[ËƉG(_^[����������������U��j�h�ڼd�    Pd�%    ��SVW���WX����*+WT���E�    ���������   �E�M�Q�M�E�    ��  �/ P�*T, �M���u��Q ����   �E�    �E�    �Ej h�qh�]j ��   �E��T�{ ���M�P�:
I �}� u2��V�E    j�E���{ ���E��E���t���Y� ���3��OH�E��u������E����t��裇 V���{ ���M��E��>	I �M��E� �2	I �2ۍM�E������	I �M��_^[d�    ��]� ����������U��j�h ۼd�    Pd�%    ��SV�񸫪�*W�e��u�VX+VT���������te�E�    ������NX����*+NT���������t@j$��{ ����t��臿�����3ɉNl��uh�q��E��E�   P��{ �FHP�<����M�_^d�    [��]Ëu�Nl��t�����Nl��t�j��Fl    ��=���U��j�h�R�d�    Pd�%    QVWj����{ ���E��E�    ��t���d  ���3��u�G���E������̉��I ����P�M��_d�    ^��]� ����������Vj���P ����t�@�� ܦ��3����   ^��t�@�   ���������������U��j�h�R�d�    Pd�%    QVWjP�����{ ���E��E�    ��t���  ���3��v�O0�E������I �u�O��G�F�G�F�G�F�G�FP�p< �FP�O�J����F P�O$������M��_^d�    ��]� ����������V�񋆸   ��tP�P ��ǆ�       ^���������������Ɓ�    ���������Ɓ�   ��������̋��   ����������U��d�    j�h(ۼPd�%    ��V����   ����   �F@+F<W��3�����   S�F<��    ��x8 �x   �E�    �M��E�    �3l< �F<�M��E�   ��p8�[I �N<����ݥ< �F<�M����P�Ko< �E�P�N`� ���M��E�   ��m< �M��E������I �F@G+F<��;��_���[_�M�^d�    ��]��������������̊��   ����������U�싉�   3�;M��]� �����������Ɓ�   ���������U��j�h�ۼd�    Pd�%    ��pSVW��3��_$�E܋3�E�C�}�;�t����$    ��������%;�u�}��C�O���  �E�P�v����M؃8 ���I ����  �O�E�P�T�����E�    �6�B ���E������M����bI ����  �w�;���  �]�M���N���E�V���E�   �̋@��WI �E�P辚E ���M��E����6  ��U�R�P�E��E�P�E�H������M��E�Q��ў���M��E���I �MȍE�jjP�E�P���  �M��E���t"�E�P������E��ȉ]��|�I �E���u�E� �E�   ��t�M�����y����}� tB�M��E�P�G��j$���E�	�:�I P�E�P�HV����E��M��@����M�E�P�I$������M��E��%I �M��E��I �M��E��=k< �M��E��I �M��E������B�����;�������M�d�    _^[��]Ë]�{(�s$;�t��������%;�u�C$�MЉC(�E��I �M��E�����������M�_^d�    [��]����������U��j�h�ۼd�    Pd�%    ��SVW�e�����������   �NX����*+NT���E�    �������t2��M�d�    _^[��]ËN�gfff+N���������t�3����N�gfff+N���������;�s2�F�������P�R���   �E�H�E�P�N0�<� G빸0�=ËM��_^d�    [��]�U��j�h�ۼd�    Pd�%    ��SVW�e����(�����t��M�d�    _^[��]Ë���E�    ��C<3��C@���   �颋.+��   ��}��������;�s��k�,��   Q���P���   �ЍE�U�U�JL�K@;�s@�C<�}�;ǋ}�w3�}�+���;KDu
j�K<������K@��t�C<����}�C@G�p���;KDuj�K<�����U�C@��t��C@G�K������=ËM�2�_^d�    [��]���������������U��j�h�ۼd�    Pd�%    ��SVW��e��u���������I  �E�3��E�    �F4+F0���}�;���   �F4��    +F0�N0��@P��GP��������tc�F0���P�E���K ��E�H0�E���@���=Ëu�}�F0�E�    �����������uG�s������=Ëu��E�������}� �E�����t)��ǆ�      �$  ���M����M�d�    _^[��]ËF42�+F02���3Ʌ�tU�~4+~0����u�F0��8Pt���u�F0���x t�A;�r؄�u��t���  ���������t
ǆ�      �M�_^d�    [��]����U��j�h�ۼd�    Pd�%    ��SVW��e��u��e������I  �E�3��E�    �F@+F<���}�;���   �F@��    +F<�N<��@P��GP��@������tc�F<���P�E��QK ��E�H<�E���@D�' >Ëu�}�F<�E�    ����@�^�����uG�s����R >Ëu��E�������}� �E�����t)��ǆ�      �   �������M�d�    _^[��]ËF@2�+F<2���3Ʌ�tU�~@+~<����u�F<��8PDt���u�F<���xH t�A;�r؄�u��t���)   ���R�����t
ǆ�      �M�_^d�    [��]����V���   ��^�P   V��W3��F4+F0����t(�F0����t�j��F0��    �F4G+F0��;�r؋F0_�F4^�������������U���V��W3��F@+F<����t/��$    �F<����t�j��F<��    �F@G+F<��;�r؋F<�u��F@�E�P���   ���   �������   �NH�����   �����_^��]��������������V���������t�Np�L����Nj�r�> ��^�*���^���������U��j�hXZ�d�    Pd�%    QV���E�    ������u^�d$ ���   ��u�Pj���  �E���̉��H ����u�@�Є�u��ǆ�      ����jj
���  j
j ���v  �M�E�������H �M�d�    ^��]� ������V�������jj���=  �������jj���+  ��^�������V���������u��ǆ�      ����jj����  ^�������SVjj����  ��΋@��jj�Ί���  ^��[���������Vjj���  �������jj���  jj	���  ����Pj	j
���  ���   ��t	jdjd�Ѓ�j
j ���g  ^������U��j�hܼd�    Pd�%    ��VW���E�   �uƆ�    �Nǆ�       ��Y���u�N���H �u�N���H ����P$����P(�������N��tS�E�P�������E��x}B �M�Ft�E����H �N�E�P�]����0�Nx�E��o�H �M��E����H �Np�[�������B����M�E� ��H �M�E�������H �M�_^d�    ��]� �����U��E���   ]� V���(�����u?j j���9   ��΋@�Є�u��ǆ�      �+������D������������^�����^����U����E�E���   V�u�u��E�U�M�E���
�E�9u�^����]� �������U��j�h(ܼd�    Pd�%    ��,V��M������U�M��E�    ��EȋB�E̋B�EЋB�EԍBP�=b< �u�M��"�, �u�M�������E�P���   �x  �E��E�����^��tP���{ ���E�    �E�    �E�    �E܅�tP���{ ���E�    �E�    �E�    �M��N`< �M�d�    ��]� ��������������U��j�h�ܼd�    Pd�%    ��8�����   +��   SV���   �E�颋.3���W�������t0����M��E9��   �N�颋.+C���,�������;�r׍M��E�    �E�    ��]< fo@���E��E�    W��E�    �EЋM�E�P�E�    �I觑���u�M��E�Q���? �M��E� ��H �E��t� �EȉEċ}�M�;���   �E�;���   +���;M�uj�M��m����M��E܍�����   ���B�   �}k�,u��F$;�sH�N ;�wA+���;F(u
j�N �%����V$��t�N ����D��B�F$_^[�M�d�    ��]� ;F(u
j�N ������N$��t
���G�A�F$_^[�M�d�    ��]� ;M�uj�M������M���t���G�A�M��u���M��M��m����^�E�;�s~���;�wv+ʸ颋.���������;^u	j���  k�,�~�}�}�E�����   ��O��C�G�C�G�C�G�CP��X< �C�E�P�O�����E��C �Y;^u	j���  �~�}�}�E���tC�E��O��E��G�EĉG�EȉG�E�P�X< �E��E�P�O�S����E��E�P�O �T���F,�E��E�������tP��{ ���E�    �E�    �E�    �EЅ�tP�d�{ ���E�    �E�    �E�    �M���\< �M�_^[d�    ��]� ���U��j�h�ܼd�    Pd�%    ��S�]VW3��e��u����t#��]t�wk�,P���{ �����u��u�`S��u�E�E�    j PV�w�7�����O�颋.+�����E�����������E���t�u�MQ�wP������7��{ ���M�k�,�7ƉGkE�,ƉG_^d�    [��]� �u��P�{ ��j j �b�{ ������U��S�Y�颋.V�q��+���W�}�������;�ss+1�颋.��]t��������+�;�shD{��dS�+�颋.����]t����������+�;�s3�;�_B�^[�E]�����;�_B�^[�E]�u���_^[]� ��������������U��V��W�}�N;�sB�;�w<+��颋.���������;Nu	j������k�,�MP�v�����F,_^]� ;Nu	j�������W�v�M������F,_^]� ���������V���4���N�F    �F    �����nformation so mouse move doesn't need to read.
		// This assumes that the window and DT scroller will not change size
		// during an AutoFill drag, which I think is a fair assumption
		var scrollWrapper = this.dom.dtScroll;
		this.s.scroll = {
			windowHeight: $(window).height(),
			windowWidth:  $(window).width(),
			dtTop:        scrollWrapper ? scrollWrapper.offset().top : null,
			dtLeft:       scrollWrapper ? scrollWrapper.offset().left : null,
			dtHeight:     scrollWrapper ? scrollWrapper.outerHeight() : null,
			dtWidth:      scrollWrapper ? scrollWrapper.outerWidth() : null
		};
	},


	/**
	 * Mouse drag - selects the end cell and update the selection display for
	 * the end user
	 *
	 * @param  {object} e Mouse move event
	 * @private
	 */
	_mousemove: function ( e )
	{	
		var that = this;
		var dt = this.s.dt;
		var name = e.target.nodeName.toLowerCase();
		if ( name !== 'td' && name !== 'th' ) {
			return;
		}

		this._drawSelection( e.target, e );
		this._shiftScroll( e );
	},


	/**
	 * End mouse drag - perform the update actions
	 *
	 * @param  {object} e Mouse up event
	 * @private
	 */
	_mouseup: function ( e )
	{
		$(document.body).off( '.autoFill' );

		var that = this;
		var dt = this.s.dt;
		var select = this.dom.select;
		select.top.remove();
		select.left.remove();
		select.right.remove();
		select.bottom.remove();

		this.dom.handle.css( 'display', 'block' );

		// Display complete - now do something useful with the selection!
		var start = this.s.start;
		var end = this.s.end;

		// Haven't selected multiple cells, so nothing to do
		if ( start.row === end.row && start.column === end.column ) {
			return;
		}

		var startDt = dt.cell( ':eq('+start.row+')', start.column+':visible', {page:'current'} );

		// If Editor is active inside this cell (inline editing) we need to wait for Editor to
		// submit and then we can loop back and trigger the fill.
		if ( $('div.DTE', startDt.node()).length ) {
			var editor = dt.editor();

			editor
				.on( 'submitSuccess.dtaf close.dtaf', function () {
					editor.off( '.dtaf');

					setTimeout( function () {
						that._mouseup( e );
					}, 100 );
				} )
				.on( 'submitComplete.dtaf preSubmitCancelled.dtaf close.dtaf', function () {
					editor.off( '.dtaf');
				} );

			// Make the current input submit
			editor.submit();

			return;
		}

		// Build a matrix representation of the selected rows
		var rows       = this._range( start.row, end.row );
		var columns    = this._range( start.column, end.column );
		var selected   = [];
		var dtSettings = dt.settings()[0];
		var dtColumns  = dtSettings.aoColumns;
		var enabledColumns = dt.columns( this.c.columns ).indexes();

		// Can't use Array.prototype.map as IE8 doesn't support it
		// Can't use $.map as jQuery flattens 2D arrays
		// Need to use a good old fashioned for loop
		for ( var rowIdx=0 ; rowIdx<rows.length ; rowIdx++ ) {
			selected.push(
				$.map( columns, function (column) {
					var row = dt.row( ':eq('+rows[rowIdx]+')', {page:'current'} ); // Workaround for M581
					var cell = dt.cell( row.index(), column+':visible' );
					var data = cell.data();
					var cellIndex = cell.index();
					var editField = dtColumns[ cellIndex.column ].editField;

					if ( editField !== undefined ) {
						data = dtSettings.oApi._fnGetObjectDataFn( editField )( dt.row( cellIndex.row ).data() );
					}

					if ( enabledColumns.indexOf(cellIndex.column) === -1 ) {
						return;
					}

					return {
						cell:  cell,
						data:  data,
						label: cell.data(),
						index: cellIndex
					};
				} )
			);
		}

		this._actionSelector( selected );
		
		// Stop shiftScroll
		clearInterval( this.s.scrollInterval );
		this.s.scrollInterval = null;
	},


	/**
	 * Create an array with a range of numbers defined by the start and end
	 * parameters passed in (inclusive!).
	 * 
	 * @param  {integer} start Start
	 * @param  {integer} end   End
	 * @private
	 */
	_range: function ( start, end )
	{
		var out = [];
		var i;

		if ( start <= end ) {
			for ( i=start ; i<=end ; i++ ) {
				out.push( i );
			}
		}
		else {
			for ( i=start ; i>=end ; i-- ) {
				out.push( i );
			}
		}

		return out;
	},


	/**
	 * Move the window and DataTables scrolling during a drag to scroll new
	 * content into view. This is done by proximity to the edge of the scrolling
	 * container of the mouse - for example near the top edge of the window
	 * should scroll up. This is a little complicated as there are two elements
	 * that can be scrolled - the window and the DataTables scrolling view port
	 * (if scrollX and / or scrollY is enabled).
	 *
	 * @param  {object} e Mouse move event object
	 * @private
	 */
	_shiftScroll: function ( e )
	{
		var that = this;
		var dt = this.s.dt;
		var scroll = this.s.scroll;
		var runInterval = false;
		var scrollSpeed = 5;
		var buffer = 65;
		var
			windowY = e.pageY - document.body.scrollTop,
			windowX = e.pageX - document.body.scrollLeft,
			windowVert, windowHoriz,
			dtVert, dtHoriz;

		// Window calculations - based on the mouse position in the window,
		// regardless of scrolling
		if ( windowY < buffer ) {
			windowVert = scrollSpeed * -1;
		}
		else if ( windowY > scroll.windowHeight - buffer ) {
			windowVert = scrollSpeed;
		}

		if ( windowX < buffer ) {
			windowHoriz = scrollSpeed * -1;
		}
		else if ( windowX > scroll.windowWidth - buffer ) {
			windowHoriz = scrollSpeed;
		}

		// DataTables scrolling calculations - based on the table's position in
		// the document and the mouse position on the page
		if ( scroll.dtTop !== null && e.pageY < scroll.dtTop + buffer ) {
			dtVert = scrollSpeed * -1;
		}
		else if ( scroll.dtTop !== null && e.pageY > scroll.dtTop + scroll.dtHeight - buffer ) {
			dtVert = scrollSpeed;
		}

		if ( scroll.dtLeft !== null && e.pageX < scroll.dtLeft + buffer ) {
			dtHoriz = scrollSpeed * -1;
		}
		else if ( scroll.dtLeft !== null && e.pageX > scroll.dtLeft + scroll.dtWidth - buffer ) {
			dtHoriz = scrollSpeed;
		}

		// This is where it gets interesting. We want to continue scrolling
		// without requiring a mouse move, so we need an interval to be
		// triggered. The interval should continue until it is no longer needed,
		// but it must also use the latest scroll commands (for example consider
		// that the mouse might move from scrolling up to scrolling left, all
		// with the same interval running. We use the `scroll` object to "pass"
		// this information to the interval. Can't use local variables as they
		// wouldn't be the ones that are used by an already existing interval!
		if ( windowVert || windowHoriz || dtVert || dtHoriz ) {
			scroll.windowVert = windowVert;
			scroll.windowHoriz = windowHoriz;
			scroll.dtVert = dtVert;
			scroll.dtHoriz = dtHoriz;
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
					document.body.scrollTop += scroll.windowVert;
				}
				if ( scroll.windowHoriz ) {
					document.body.scrollLeft += scroll.windowHoriz;
				}

				// DataTables scrolling
				if ( scroll.dtVert || scroll.dtHoriz ) {
					var scroller = that.dom.dtScroll[0];

					if ( scroll.dtVert ) {
						scroller.scrollTop += scroll.dtVert;
					}
					if ( scroll.dtHoriz ) {
						scroller.scrollLeft += scroll.dtHoriz;
					}
				}
			}, 20 );
		}
	},


	/**
	 * Update the DataTable after the user has selected what they want to do
	 *
	 * @param  {false|undefined} result Return from the `execute` method - can
	 *   be false internally to do nothing. This is not documented for plug-ins
	 *   and is used only by the cancel option.
	 * @param {array} cells Information about the selected cells from the key
	 *     up function, argumented with the set values
	 * @private
	 */
	_update: function ( result, cells )
	{
		// Do nothing on `false` return from an execute function
		if ( result === false ) {
			return;
		}

		var dt = this.s.dt;
		var cell;
		var columns = dt.columns( this.c.columns ).indexes();

		// Potentially allow modifications to the cells matrix
		this._emitEvent( 'preAutoFill', [ dt, cells ] );

		this._editor( cells );

		// Automatic updates are not performed if `update` is null and the
		// `editor` parameter is passed in - the reason being that Editor will
		// update the data once submitted
		var update = this.c.update !== null ?
			this.c.update :
			this.c.editor ?
				false :
				true;

		if ( update ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cell = cells[i][j];

					if ( columns.indexOf(cell.index.column) !== -1 ) {
						cell.cell.data( cell.set );
					}
				}
			}

			dt.draw(false);
		}

		this._emitEvent( 'autoFill', [ dt, cells ] );
	}
} );


/**
 * AutoFill actions. The options here determine how AutoFill will fill the data
 * in the table when the user has selected a range of cells. Please see the
 * documentation on the DataTables site for full details on how to create plug-
 * ins.
 *
 * @type {Object}
 */
AutoFill.actions = {
	increment: {
		available: function ( dt, cells ) {
			var d = cells[0][0].label;

			// is numeric test based on jQuery's old `isNumeric` function
			return !isNaN( d - parseFloat( d ) );
		},

		option: function ( dt, cells ) {
			return dt.i18n(
				'autoFill.increment',
				'Increment / decrement each cell by: <input type="number" value="1">'
			);
		},

		execute: function ( dt, cells, node ) {
			var value = cells[0][0].data * 1;
			var increment = $('input', node).val() * 1;

			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = value;

					value += increment;
				}
			}
		}
	},

	fill: {
		available: function ( dt, cells ) {
			return true;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fill', 'Fill all cells with <i>%d</i>', cells[0][0].label );
		},

		execute: function ( dt, cells, node ) {
			var value = cells[0][0].data;

			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = value;
				}
			}
		}
	},

	fillHorizontal: {
		available: function ( dt, cells ) {
			return cells.length > 1 && cells[0].length > 1;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fillHorizontal', 'Fill cells horizontally' );
		},

		execute: function ( dt, cells, node ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = cells[i][0].data;
				}
			}
		}
	},

	fillVertical: {
		available: function ( dt, cells ) {
			return cells.length > 1;
		},

		option: function ( dt, cells ) {
			return dt.i18n('autoFill.fillVertical', 'Fill cells vertically' );
		},

		execute: function ( dt, cells, node ) {
			for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
				for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
					cells[i][j].set = cells[0][j].data;
				}
			}
		}
	},

	// Special type that does not make itself available, but is added
	// automatically by AutoFill if a multi-choice list is shown. This allows
	// sensible code reuse
	cancel: {
		available: function () {
			return false;
		},

		option: function ( dt ) {
			return dt.i18n('autoFill.cancel', 'Cancel' );
		},

		execute: function () {
			return false;
		}
	}
};


/**
 * AutoFill version
 * 
 * @static
 * @type      String
 */
AutoFill.version = '2.3.9';


/**
 * AutoFill defaults
 * 
 * @namespace
 */
AutoFill.defaults = {
	/** @type {Boolean} Ask user what they want to do, even for a single option */
	alwaysAsk: false,

	/** @type {string|null} What will trigger a focus */
	focus: null, // focus, click, hover

	/** @type {column-selector} Columns to provide auto fill for */
	columns: '', // all

	/** @type {Boolean} Enable AutoFill on load */
	enable: true,

	/** @type {boolean|null} Update the cells after a drag */
	update: null, // false is editor given, true otherwise

	/** @type {DataTable.Editor} Editor instance for automatic submission */
	editor: null,

	/** @type {boolean} Enable vertical fill */
	vertical: true,

	/** @type {boolean} Enable horizontal fill */
	horizontal: true
};


/**
 * Classes used by AutoFill that are configurable
 * 
 * @namespace
 */
AutoFill.classes = {
	/** @type {String} Class used by the selection button */
	btn: 'btn'
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - Not documented
Api.register( 'autoFill()', function () {
	return this;
} );

Api.register( 'autoFill().enabled()', function () {
	var ctx = this.context[0];

	return ctx.autoFill ?
		ctx.autoFill.enabled() :
		false;
} );

Api.register( 'autoFill().enable()', function ( flag ) {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx.autoFill ) {
			ctx.autoFill.enable( flag );
		}
	} );
} );

Api.register( 'autoFill().disable()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx.autoFill ) {
			ctx.autoFill.disable();
		}
	} );
} );


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.autofill', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.autoFill;
	var defaults = DataTable.defaults.autoFill;

	if ( init || defaults ) {
		var opts = $.extend( {}, init, defaults );

		if ( init !== false ) {
			new AutoFill( settings, opts  );
		}
	}
} );


// Alias for access
DataTable.AutoFill = AutoFill;
DataTable.AutoFill = AutoFill;


return AutoFill;
}));
                                                                                                                                                                                                                                                            ���ts�M��� �M� �E�2 �} �E�tH�������pZ �E�E�Pj9�������{x �u������VP�u��u�  ���E��������Z �M�E�����M��E��۹( ��tB�E�P�EV���̉�E�A�7�G
P��$  P��   ��  ��  P�u�X  ��,�������E� �&Z �M��E�����������M�_^d�    [��]� ����U���|SV�uW�}��PW�E��` �M��P�E�P�$) �M�]�;���   �E�U�;���   +�+���W�fE��E�V�E��M��E��UPW�!  �E�P�M�� ��tT�]���* �u�E��u�P�E�P�Vh ���Eȋ�j�u�u�P�@l ��M�VVQW���P�e �E�P�M��a ��u�_^[��]�������U��j�h�>�d�    Pd�%    ��|S�]V�u��PS�#_ �M��P�E�P�3) �E�;E���   �E�;E���   ���   �M�E�z0 �E�W��M�+E�+M���fE��E�V�E썍x����E��E�    PS�U��� �E�P��x���� ��tlW�}���* �u��E��u�P�E�P�Bg �M�E���VP�  �M��tj jV�E�P��o ��u��M�VVQS���P��c �E�P��x����7 ��u�_�M�E������s���M�^[d�    ��]����U��d�    ����j�h%?�Pd�%    ��  S�]V�u0�Ƌf;�u�B�k�|�D�E��D�E��D�E��D �M,�E��E�P�E�P��) �E�;E��  �E�;E��  Wj �׬������X���P�HV �}��X���j:W�E�    �p` ��X���P�������| ��`����E��V �} �E�t$j�~�������`���P�_W j:W��`����!` ��`���P�������O| �} ��`�����X����E�E���h���P�U ��h����E�P�E$P�ho �E���M�W�+E�+M����E�fE�V���U��E�}�PS��P����A� �E�P��P���� ����  ��* �u��E�WP�E�P�$e �������$�h ��3����X��� tQ�; ujh�   h03�h ���e�( �����X����E�VP�3� �M ���X���j W�-�������P� �u0G��;|��a �������$�?h ���} ujj �u ��������5��j Pj V�E��E�P��X���P�u�������E���������B���; �E�.  jh�   h03�h ����( ���  �������$�g ��3������`��� tN�; ujh�   h03�h ���[�( �����`����E�VP�3� �M ���`���j W�#�������P� �u0G��;|��` �E�P�u��`����u�M�P�a8��j �u �������E��4���M��E�QPj V�E�P��X���P�u�������E���������A���; ujh�   h03�h ����( ���E��M��E�E���y����_ �} tT��P�����tj jh����E�P��k ��u4�M�U�Vj R���h���R�P�; ujh�   h03�h ���0�( ���_ �E�P��P����� �}܄��T�����h����E��S �������E�� } ��`����E��qS �������E� �} ��X����E������PS _�M�^[d�    ��]����������������U��V�uW�};}t S��+�W��� �D3���F��;}u�[              === luxon.DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
                }
            },
            // eslint-disable-next-line sort-keys
            '!=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.not', i18n.conditions.date.not);
                },
                init: Criteria.initDate,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison, that) {
                    return luxon.DateTime.fromFormat(value, that.s.dateFormat).ts
                        !== luxon.DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
                }
            },
            '<': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.before', i18n.conditions.date.before);
                },
                init: Criteria.initDate,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison, that) {
                    return luxon.DateTime.fromFormat(value, that.s.dateFormat).ts
                        < luxon.DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
                }
            },
            '>': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.after', i18n.conditions.date.after);
                },
                init: Criteria.initDate,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison, that) {
                    return luxon.DateTime.fromFormat(value, that.s.dateFormat).ts
                        > luxon.DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
                }
            },
            'between': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.between', i18n.conditions.date.between);
                },
                init: Criteria.init2Date,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison, that) {
                    var val = luxon.DateTime.fromFormat(value, that.s.dateFormat).ts;
                    var comp0 = luxon.DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
                    var comp1 = luxon.DateTime.fromFormat(comparison[1], that.s.dateFormat).ts;
                    if (comp0 < comp1) {
                        return comp0 <= val && val <= comp1;
                    }
                    else {
                        return comp1 <= val && val <= comp0;
                    }
                }
            },
            // eslint-disable-next-line sort-keys
            '!between': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.notBetween', i18n.conditions.date.notBetween);
                },
                init: Criteria.init2Date,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison, that) {
                    var val = luxon.DateTime.fromFormat(value, that.s.dateFormat).ts;
                    var comp0 = luxon.DateTime.fromFormat(comparison[0], that.s.dateFormat).ts;
                    var comp1 = luxon.DateTime.fromFormat(comparison[1], that.s.dateFormat).ts;
                    if (comp0 < comp1) {
                        return !(+comp0 <= +val && +val <= +comp1);
                    }
                    else {
                        return !(+comp1 <= +val && +val <= +comp0);
                    }
                }
            },
            'null': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.empty', i18n.conditions.date.empty);
                },
                init: Criteria.initNoValue,
                inputValue: function () {
                    return;
                },
                isInputValid: function () {
                    return true;
                },
                search: function (value) {
                    return value === null || value === undefined || value.length === 0;
                }
            },
            // eslint-disable-next-line sort-keys
            '!null': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.notEmpty', i18n.conditions.date.notEmpty);
                },
                init: Criteria.initNoValue,
                inputValue: function () {
                    return;
                },
                isInputValid: function () {
                    return true;
                },
                search: function (value) {
                    return !(value === null || value === undefined || value.length === 0);
                }
            }
        };
        // The order of the conditions will make eslint sad :(
        // Has to be in this order so that they are displayed correctly in select elements
        // Also have to disable member ordering for this as the private methods used are not yet declared otherwise
        // eslint-disable-next-line @typescript-eslint/member-ordering
        Criteria.numConditions = {
            '=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.equals', i18n.conditions.number.equals);
                },
                init: Criteria.initSelect,
                inputValue: Criteria.inputValueSelect,
                isInputValid: Criteria.isInputValidSelect,
                search: function (value, comparison) {
                    return +value === +comparison[0];
                }
            },
            // eslint-disable-next-line sort-keys
            '!=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.not', i18n.conditions.number.not);
                },
                init: Criteria.initSelect,
                inputValue: Criteria.inputValueSelect,
                isInputValid: Criteria.isInputValidSelect,
                search: function (value, comparison) {
                    return +value !== +comparison[0];
                }
            },
            '<': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.lt', i18n.conditions.number.lt);
                },
                init: Criteria.initInput,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    return +value < +comparison[0];
                }
            },
            '<=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.lte', i18n.conditions.number.lte);
                },
                init: Criteria.initInput,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    return +value <= +comparison[0];
                }
            },
            '>=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.gte', i18n.conditions.number.gte);
                },
                init: Criteria.initInput,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    return +value >= +comparison[0];
                }
            },
            // eslint-disable-next-line sort-keys
            '>': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.gt', i18n.conditions.number.gt);
                },
                init: Criteria.initInput,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    return +value > +comparison[0];
                }
            },
            'between': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.between', i18n.conditions.number.between);
                },
                init: Criteria.init2Input,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    if (+comparison[0] < +comparison[1]) {
                        return +comparison[0] <= +value && +value <= +comparison[1];
                    }
                    else {
                        return +comparison[1] <= +value && +value <= +comparison[0];
                    }
                }
            },
            // eslint-disable-next-line sort-keys
            '!between': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.notBetween', i18n.conditions.number.notBetween);
                },
                init: Criteria.init2Input,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    if (+comparison[0] < +comparison[1]) {
                        return !(+comparison[0] <= +value && +value <= +comparison[1]);
                    }
                    else {
                        return !(+comparison[1] <= +value && +value <= +comparison[0]);
                    }
                }
            },
            'null': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.empty', i18n.conditions.number.empty);
                },
                init: Criteria.initNoValue,
                inputValue: function () {
                    return;
                },
                isInputValid: function () {
                    return true;
                },
                search: function (value) {
                    return value === null || value === undefined || value.length === 0;
                }
            },
            // eslint-disable-next-line sort-keys
            '!null': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.notEmpty', i18n.conditions.number.notEmpty);
                },
                init: Criteria.initNoValue,
                inputValue: function () {
                    return;
                },
                isInputValid: function () {
                    return true;
                },
                search: function (value) {
                    return !(value === null || value === undefined || value.length === 0);
                }
            }
        };
        // The order of the conditions will make eslint sad :(
        // Has to be in this order so that they are displayed correctly in select elements
        // Also have to disable member ordering for this as the private methods used are not yet declared otherwise
        // eslint-disable-next-line @typescript-eslint/member-ordering
        Criteria.numFmtConditions = {
            '=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.equals', i18n.conditions.number.equals);
                },
                init: Criteria.initSelect,
                inputValue: Criteria.inputValueSelect,
                isInputValid: Criteria.isInputValidSelect,
                search: function (value, comparison) {
                    var val = value.indexOf('-') === 0 ?
                        '-' + value.replace(/[^0-9.]/g, '') :
                        value.replace(/[^0-9.]/g, '');
                    var comp = comparison[0].indexOf('-') === 0 ?
                        '-' + comparison[0].replace(/[^0-9.]/g, '') :
                        comparison[0].replace(/[^0-9.]/g, '');
                    return +val === +comp;
                }
            },
            // eslint-disable-next-line sort-keys
            '!=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.not', i18n.conditions.number.not);
                },
                init: Criteria.initSelect,
                inputValue: Criteria.inputValueSelect,
                isInputValid: Criteria.isInputValidSelect,
                search: function (value, comparison) {
                    var val = value.indexOf('-') === 0 ?
                        '-' + value.replace(/[^0-9.]/g, '') :
                        value.replace(/[^0-9.]/g, '');
                    var comp = comparison[0].indexOf('-') === 0 ?
                        '-' + comparison[0].replace(/[^0-9.]/g, '') :
                        comparison[0].replace(/[^0-9.]/g, '');
                    return +val !== +comp;
                }
            },
            '<': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.lt', i18n.conditions.number.lt);
                },
                init: Criteria.initInput,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    var val = value.indexOf('-') === 0 ?
                        '-' + value.replace(/[^0-9.]/g, '') :
                        value.replace(/[^0-9.]/g, '');
                    var comp = comparison[0].indexOf('-') === 0 ?
                        '-' + comparison[0].replace(/[^0-9.]/g, '') :
                        comparison[0].replace(/[^0-9.]/g, '');
                    return +val < +comp;
                }
            },
            '<=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.lte', i18n.conditions.number.lte);
                },
                init: Criteria.initInput,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    var val = value.indexOf('-') === 0 ?
                        '-' + value.replace(/[^0-9.]/g, '') :
                        value.replace(/[^0-9.]/g, '');
                    var comp = comparison[0].indexOf('-') === 0 ?
                        '-' + comparison[0].replace(/[^0-9.]/g, '') :
                        comparison[0].replace(/[^0-9.]/g, '');
                    return +val <= +comp;
                }
            },
            '>=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.number.gte', i18n.conditions.number.gte);
                },
                init: Criteria.initInput,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    var val = value.indexOf('-') === 0 ?
                        '-' + value.replace(/[^0-9.]/g, '') :
                        value.replace(/[^0-9.]/g, '');
                    var comp = comparison[0].indexOf('-') === 0 ?
                        '-' + comparison[0].replace(/[^0-9.]/g, '') :
                        comparison[0].replace(/[^0-9.]/g, '');
                    return +val >= +comp;
                }
            },
            // eslint-disable-next-line sort-keys
            '>': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.numbe