/*! Scroller 2.0.5
 * ©2011-2021 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Scroller
 * @description Virtual rendering for DataTables
 * @version     2.0.5
 * @file        dataTables.scroller.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2011-2021 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * Scroller is a virtual rendering plug-in for DataTables which allows large
 * datasets to be drawn on screen every quickly. What the virtual rendering means
 * is that only the visible portion of the table (and a bit to either side to make
 * the scrolling smooth) is drawn, while the scrolling container gives the
 * visual impression that the whole table is visible. This is done by making use
 * of the pagination abilities of DataTables and moving the table around in the
 * scrolling container DataTables adds to the page. The scrolling container is
 * forced to the height it would be for the full table display using an extra
 * element.
 *
 * Note that rows in the table MUST all be the same height. Information in a cell
 * which expands on to multiple lines will cause some odd behaviour in the scrolling.
 *
 * Scroller is initialised by simply including the letter 'S' in the sDom for the
 * table you want to have this feature enabled on. Note that the 'S' must come
 * AFTER the 't' parameter in `dom`.
 *
 * Key features include:
 *   <ul class="limit_length">
 *     <li>Speed! The aim of Scroller for DataTables is to make rendering large data sets fast</li>
 *     <li>Full compatibility with deferred rendering in DataTables for maximum speed</li>
 *     <li>Display millions of rows</li>
 *     <li>Integration with state saving in DataTables (scrolling position is saved)</li>
 *     <li>Easy to use</li>
 *   </ul>
 *
 *  @class
 *  @constructor
 *  @global
 *  @param {object} dt DataTables settings object or API instance
 *  @param {object} [opts={}] Configuration object for Scroller. Options 
 *    are defined by {@link Scroller.defaults}
 *
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.0+
 *
 *  @example
 *    $(document).ready(function() {
 *        $('#example').DataTable( {
 *            "scrollY": "200px",
 *            "ajax": "media/dataset/large.txt",
 *            "scroller": true,
 *            "deferRender": true
 *        } );
 *    } );
 */
var Scroller = function ( dt, opts ) {
	/* Sanity check - you just know it will happen */
	if ( ! (this instanceof Scroller) ) {
		alert( "Scroller warning: Scroller must be initialised with the 'new' keyword." );
		return;
	}

	if ( opts === undefined ) {
		opts = {};
	}

	var dtApi = $.fn.dataTable.Api( dt );

	/**
	 * Settings object which contains customisable information for the Scroller instance
	 * @namespace
	 * @private
	 * @extends Scroller.defaults
	 */
	this.s = {
		/**
		 * DataTables settings object
		 *  @type     object
		 *  @default  Passed in as first parameter to constructor
		 */
		dt: dtApi.settings()[0],

		/**
		 * DataTables API instance
		 *  @type     DataTable.Api
		 */
		dtApi: dtApi,

		/**
		 * Pixel location of the top of the drawn table in the viewport
		 *  @type     int
		 *  @default  0
		 */
		tableTop: 0,

		/**
		 * Pixel location of the bottom of the drawn table in the viewport
		 *  @type     int
		 *  @default  0
		 */
		tableBottom: 0,

		/**
		 * Pixel location of the boundary for when the next data set should be loaded and drawn
		 * when scrolling up the way.
		 *  @type     int
		 *  @default  0
		 *  @private
		 */
		redrawTop: 0,

		/**
		 * Pixel location of the boundary for when the next data set should be loaded and drawn
		 * when scrolling down the way. Note that this is actually calculated as the offset from
		 * the top.
		 *  @type     int
		 *  @default  0
		 *  @private
		 */
		redrawBottom: 0,

		/**
		 * Auto row height or not indicator
		 *  @type     bool
		 *  @default  0
		 */
		autoHeight: true,

		/**
		 * Number of rows calculated as visible in the visible viewport
		 *  @type     int
		 *  @default  0
		 */
		viewportRows: 0,

		/**
		 * setTimeout reference for state saving, used when state saving is enabled in the DataTable
		 * and when the user scrolls the viewport in order to stop the cookie set taking too much
		 * CPU!
		 *  @type     int
		 *  @default  0
		 */
		stateTO: null,

		stateSaveThrottle: function () {},

		/**
		 * setTimeout reference for the redraw, used when server-side processing is enabled in the
		 * DataTables in order to prevent DoSing the server
		 *  @type     int
		 *  @default  null
		 */
		drawTO: null,

		heights: {
			jump: null,
			page: null,
			virtual: null,
			scroll: null,

			/**
			 * Height of rows in the table
			 *  @type     int
			 *  @default  0
			 */
			row: null,

			/**
			 * Pixel height of the viewport
			 *  @type     int
			 *  @default  0
			 */
			viewport: null,
			labelHeight: 0,
			xbar: 0
		},

		topRowFloat: 0,
		scrollDrawDiff: null,
		loaderVisible: false,
		forceReposition: false,
		baseRowTop: 0,
		baseScrollTop: 0,
		mousedown: false,
		lastScrollTop: 0
	};

	// @todo The defaults should extend a `c` property and the internal settings
	// only held in the `s` property. At the moment they are mixed
	this.s = $.extend( this.s, Scroller.oDefaults, opts );

	// Workaround for row height being read from height object (see above comment)
	this.s.heights.row = this.s.rowHeight;

	/**
	 * DOM elements used by the class instance
	 * @private
	 * @namespace
	 *
	 */
	this.dom = {
		"force":    document.createElement('div'),
		"label":    $('<div class="dts_label">0</div>'),
		"scroller": null,
		"table":    null,
		"loader":   null
	};

	// Attach the instance to the DataTables instance so it can be accessed in
	// future. Don't initialise Scroller twice on the same table
	if ( this.s.dt.oScroller ) {
		return;
	}

	this.s.dt.oScroller = this;

	/* Let's do it */
	this.construct();
};



$.extend( Scroller.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods - to be exposed via the DataTables API
	 */

	/**
	 * Calculate and store information about how many rows are to be displayed
	 * in the scrolling viewport, based on current dimensions in the browser's
	 * rendering. This can be particularly useful if the table is initially
	 * drawn in a hidden element - for example in a tab.
	 *  @param {bool} [redraw=true] Redraw the table automatically after the recalculation, with
	 *    the new dimensions forming the basis for the draw.
	 *  @returns {void}
	 */
	measure: function ( redraw )
	{
		if ( this.s.autoHeight )
		{
			this._calcRowHeight();
		}

		var heights = this.s.heights;

		if ( heights.row ) {
			heights.viewport = this._parseHeight($(this.dom.scroller).css('max-height'));

			this.s.viewportRows = parseInt( heights.viewport / heights.row, 10 )+1;
			this.s.dt._iDisplayLength = this.s.viewportRows * this.s.displayBuffer;
		}

		var label = this.dom.label.outerHeight();
		
		heights.xbar = this.dom.scroller.offsetHeight - this.dom.scroller.clientHeight;
		heights.labelHeight = label;

		if ( redraw === undefined || redraw )
		{
			this.s.dt.oInstance.fnDraw( false );
		}
	},

	/**
	 * Get information about current displayed record range. This corresponds to
	 * the information usually displayed in the "Info" block of the table.
	 *
	 * @returns {object} info as an object:
	 *  {
	 *      start: {int}, // the 0-indexed record at the top of the viewport
	 *      end:   {int}, // the 0-indexed record at the bottom of the viewport
	 *  }
	*/
	pageInfo: function()
	{
		var 
			dt = this.s.dt,
			iScrollTop = this.dom.scroller.scrollTop,
			iTotal = dt.fnRecordsDisplay(),
			iPossibleEnd = Math.ceil(this.pixelsToRow(iScrollTop + this.s.heights.viewport, false, this.s.ani));

		return {
			start: Math.floor(this.pixelsToRow(iScrollTop, false, this.s.ani)),
			end: iTotal < iPossibleEnd ? iTotal-1 : iPossibleEnd-1
		};
	},

	/**
	 * Calculate the row number that will be found at the given pixel position
	 * (y-scroll).
	 *
	 * Please note that when the height of the full table exceeds 1 million
	 * pixels, Scroller switches into a non-linear mode for the scrollbar to fit
	 * all of the records into a finite area, but this function returns a linear
	 * value (relative to the last non-linear positioning).
	 *  @param {int} pixels Offset from top to calculate the row number of
	 *  @param {int} [intParse=true] If an integer value should be returned
	 *  @param {int} [virtual=false] Perform the calculations in the virtual domain
	 *  @returns {int} Row index
	 */
	pixelsToRow: function ( pixels, intParse, virtual )
	{
		var diff = pixels - this.s.baseScrollTop;
		var row = virtual ?
			(this._domain( 'physicalToVirtual', this.s.baseScrollTop ) + diff) / this.s.heights.row :
			( diff / this.s.heights.row ) + this.s.baseRowTop;

		return intParse || intParse === undefined ?
			parseInt( row, 10 ) :
			row;
	},

	/**
	 * Calculate the pixel position from the top of the scrolling container for
	 * a given row
	 *  @param {int} iRow Row number to calculate the position of
	 *  @returns {int} Pixels
	 */
	rowToPixels: function ( rowIdx, intParse, virtual )
	{
		var pixels;
		var diff = rowIdx - this.s.baseRowTop;

		if ( virtual ) {
			pixels = this._domain( 'virtualToPhysical', this.s.baseScrollTop );
			pixels += diff * this.s.heights.row;
		}
		else {
			pixels = this.s.baseScrollTop;
			pixels += diff * this.s.heights.row;
		}

		return intParse || intParse === undefined ?
			parseInt( pixels, 10 ) :
			pixels;
	},


	/**
	 * Calculate the row number that will be found at the given pixel position (y-scroll)
	 *  @param {int} row Row index to scroll to
	 *  @param {bool} [animate=true] Animate the transition or not
	 *  @returns {void}
	 */
	scrollToRow: function ( row, animate )
	{
		var that = this;
		var ani = false;
		var px = this.rowToPixels( row );

		// We need to know if the table will redraw or not before doing the
		// scroll. If it will not redraw, then we need to use the currently
		// displayed table, and scroll with the physical pixels. Otherwise, we
		// need to calculate the table's new position from the virtual
		// transform.
		var preRows = ((this.s.displayBuffer-1)/2) * this.s.viewportRows;
		var drawRow = row - preRows;
		if ( drawRow < 0 ) {
			drawRow = 0;
		}

		if ( (px > this.s.redrawBottom || px < this.s.redrawTop) && this.s.dt._iDisplayStart !== drawRow ) {
			ani = true;
			px = this._domain( 'virtualToPhysical', row * this.s.heights.row );

			// If we need records outside the current draw region, but the new
			// scrolling position is inside that (due to the non-linear nature
			// for larger numbers of records), we need to force position update.
			if ( this.s.redrawTop < px && px < this.s.redrawBottom ) {
				this.s.forceReposition = true;
				animate = false;
			}
		}

		if ( animate === undefined || animate )
		{
			this.s.ani = ani;
			$(this.dom.scroller).animate( {
				"scrollTop": px
			}, function () {
				// This needs to happen after the animation has completed and
				// the final scroll event fired
				setTimeout( function () {
					that.s.ani = false;
				}, 250 );
			} );
		}
		else
		{
			$(this.dom.scroller).scrollTop( px );
		}
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialisation for Scroller
	 *  @returns {void}
	 *  @private
	 */
	construct: function ()
	{
		var that = this;
		var dt = this.s.dtApi;

		/* Sanity check */
		if ( !this.s.dt.oFeatures.bPaginate ) {
			this.s.dt.oApi._fnLog( this.s.dt, 0, 'Pagination must be enabled for Scroller' );
			return;
		}

		/* Insert a div element that we can use to force the DT scrolling container to
		 * the height that would be required if the whole table was being displayed
		 */
		this.dom.force.style.position = "relative";
		this.dom.force.style.top = "0px";
		this.dom.force.style.left = "0px";
		this.dom.force.style.width = "1px";

		this.dom.scroller = $('div.'+this.s.dt.oClasses.sScrollBody, this.s.dt.nTableWrapper)[0];
		this.dom.scroller.appendChild( this.dom.force );
		this.dom.scroller.style.position = "relative";

		this.dom.table = $('>table', this.dom.scroller)[0];
		this.dom.table.style.position = "absolute";
		this.dom.table.style.top = "0px";
		this.dom.table.style.left = "0px";

		// Add class to 'announce' that we are a Scroller table
		$(dt.table().container()).addClass('dts DTS');

		// Add a 'loading' indicator
		if ( this.s.loadingIndicator )
		{
			this.dom.loader = $('<div class="dataTables_processing dts_loading">'+this.s.dt.oLanguage.sLoadingRecords+'</div>')
				.css('display', 'none');

			$(this.dom.scroller.parentNode)
				.css('position', 'relative')
				.append( this.dom.loader );
		}

		this.dom.label.appendTo(this.dom.scroller);

		/* Initial size calculations */
		if ( this.s.heights.row && this.s.heights.row != 'auto' )
		{
			this.s.autoHeight = false;
		}

		// Scrolling callback to see if a page change is needed
		this.s.ingnoreScroll = true;
		$(this.dom.scroller).on( 'scroll.dt-scroller', function (e) {
			that._scroll.call( that );
		} );

		// In iOS we catch the touchstart event in case the user tries to scroll
		// while the display is already scrolling
		$(this.dom.scroller).on('touchstart.dt-scroller', function () {
			that._scroll.call( that );
		} );

		$(this.dom.scroller)
			.on('mousedown.dt-scroller', function () {
				that.s.mousedown = true;
			})
			.on('mouseup.dt-scroller', function () {
				that.s.labelVisible = false;
				that.s.mousedown = false;
				that.dom.label.css('display', 'none');
			});

		// On resize, update the information element, since the number of rows shown might change
		$(window).on( 'resize.dt-scroller', function () {
			that.measure( false );
			that._info();
		} );

		// Add a state saving parameter to the DT state saving so we can restore the exact
		// position of the scrolling.
		var initialStateSave = true;
		var loadedState = dt.state.loaded();

		dt.on( 'stateSaveParams.scroller', function ( e, settings, data ) {
			if ( initialStateSave && loadedState ) {
				data.scroller = loadedState.scroller;
				initialStateSave = false;
			}
			else {
				// Need to used the saved position on init
				data.scroller = {
					topRow: that.s.topRowFloat,
					baseScrollTop: that.s.baseScrollTop,
					baseRowTop: that.s.baseRowTop,
					scrollTop: that.s.lastScrollTop
				};
			}
		} );

		if ( loadedState && loadedState.scroller ) {
			this.s.topRowFloat = loadedState.scroller.topRow;
			this.s.baseScrollTop = loadedState.scroller.baseScrollTop;
			this.s.baseRowTop = loadedState.scroller.baseRowTop;
		}

		this.measure( false );
	
		that.s.stateSaveThrottle = that.s.dt.oApi._fnThrottle( function () {
			that.s.dtApi.state.save();
		}, 500 );

		dt.on( 'init.scroller', function () {
			that.measure( false );

			// Setting to `jump` will instruct _draw to calculate the scroll top
			// position
			that.s.scrollType = 'jump';
			that._draw();

			// Update the scroller when the DataTable is redrawn
			dt.on( 'draw.scroller', function () {
				that._draw();
			});
		} );

		// Set height before the draw happens, allowing everything else to update
		/edArray,N=u.TypedArrayPrototype,B=u.aTypedArrayConstructor,q=u.isTypedArray,W="BYTES_PER_ELEMENT",H="Wrong length",Y=function(e,t){for(var n=0,r=t.length,i=new(B(e))(r);r>n;)i[n]=t[n++];return i},G=function(e,t){I(e,t,{get:function(){return L(this)[t]}})},Q=function(e){var t;return e instanceof M||"ArrayBuffer"==(t=g(e))||"SharedArrayBuffer"==t},$=function(e,t){return q(e)&&"symbol"!=typeof t&&t in e&&String(+t)==String(t)},V=function(e,t){return $(e,t=v(t,!0))?c(2,e[t]):U(e,t)},X=function(e,t,n){return!($(e,t=v(t,!0))&&m(n)&&y(n,"value"))||y(n,"get")||y(n,"set")||n.configurable||y(n,"writable")&&!n.writable||y(n,"enumerable")&&!n.enumerable?I(e,t,n):(e[t]=n.value,e)};o?(P||(F.f=V,S.f=X,G(N,"buffer"),G(N,"byteOffset"),G(N,"byteLength"),G(N,"length")),r({target:"Object",stat:!0,forced:!P},{getOwnPropertyDescriptor:V,defineProperty:X}),e.exports=function(e,t,n){var o=e.match(/\d+$/)[0]/8,u=e+(n?"Clamped":"")+"Array",s="get"+e,c="set"+e,v=i[u],y=v,g=y&&y.prototype,S={},F=function(e,t){I(e,t,{get:function(){return function(e,t){var n=L(e);return n.view[s](t*o+n.byteOffset,!0)}(this,t)},set:function(e){return function(e,t,r){var i=L(e);n&&(r=(r=O(r))<0?0:r>255?255:255&r),i.view[c](t*o+i.byteOffset,r,!0)}(this,t,e)},enumerable:!0})};P?a&&(y=t((function(e,t,n,r){return l(e,y,u),C(m(t)?Q(t)?void 0!==r?new v(t,d(n,o),r):void 0!==n?new v(t,d(n,o)):new v(t):q(t)?Y(y,t):E.call(y,t):new v(h(t)),e,y)})),x&&x(y,D),k(w(v),(function(e){e in y||f(y,e,v[e])})),y.prototype=g):(y=t((function(e,t,n,r){l(e,y,u);var i,a,s,c=0,f=0;if(m(t)){if(!Q(t))return q(t)?Y(y,t):E.call(y,t);i=t,f=d(n,o);var v=t.byteLength;if(void 0===r){if(v%o)throw _(H);if((a=v-f)<0)throw _(H)}else if((a=p(r)*o)+f>v)throw _(H);s=a/o}else s=h(t),i=new M(a=s*o);for(R(e,{buffer:i,byteOffset:f,byteLength:a,length:s,view:new z(i)});c<s;)F(e,c++)})),x&&x(y,D),g=y.prototype=b(N)),g.constructor!==y&&f(g,"constructor",y),j&&f(g,j,u),S[u]=y,r({global:!0,forced:y!=v,sham:!P},S),W in y||f(y,W,o),W in g||f(g,W,o),A(u)}):e.exports=function(){}},3832:function(e,t,n){var r=n(7854),i=n(7293),o=n(7072),a=n(260).NATIVE_ARRAY_BUFFER_VIEWS,u=r.ArrayBuffer,s=r.Int8Array;e.exports=!a||!i((function(){s(1)}))||!i((function(){new s(-1)}))||!o((function(e){new s,new s(null),new s(1.5),new s(e)}),!0)||i((function(){return 1!==new s(new u(2),1,void 0).length}))},3074:function(e,t,n){var r=n(260).aTypedArrayConstructor,i=n(6707);e.exports=function(e,t){for(var n=i(e,e.constructor),o=0,a=t.length,u=new(r(n))(a);a>o;)u[o]=t[o++];return u}},7321:function(e,t,n){var r=n(7908),i=n(7466),o=n(1246),a=n(7659),u=n(9974),s=n(260).aTypedArrayConstructor;e.exports=function(e){var t,n,l,c,f,p,h=r(e),d=arguments.length,v=d>1?arguments[1]:void 0,y=void 0!==v,g=o(h);if(null!=g&&!a(g))for(p=(f=g.call(h)).next,h=[];!(c=p.call(f)).done;)h.push(c.value);for(y&&d>2&&(v=u(v,arguments[2],2)),n=i(h.length),l=new(s(this))(n),t=0;n>t;t++)l[t]=y?v(h[t],t):h[t];return l}},9711:function(e){var t=0,n=Math.random();e.exports=function(e){return"Symbol("+String(void 0===e?"":e)+")_"+(++t+n).toString(36)}},3307:function(e,t,n){var r=n(133);e.exports=r&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},5112:function(e,t,n){var r=n(7854),i=n(2309),o=n(6656),a=n(9711),u=n(133),s=n(3307),l=i("wks"),c=r.Symbol,f=s?c:c&&c.withoutSetter||a;e.exports=function(e){return o(l,e)||(u&&o(c,e)?l[e]=c[e]:l[e]=f("Symbol."+e)),l[e]}},1361:function(e){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},8264:function(e,t,n){"use strict";var r=n(2109),i=n(7854),o=n(3331),a=n(6340),u=o.ArrayBuffer;r({global:!0,forced:i.ArrayBuffer!==u},{ArrayBuffer:u}),a("ArrayBuffer")},2222:function(e,t,n){"use strict";var r=n(2109),i=n(7293),o=n(3157),a=n(111),u=n(7908),s=n(7466),l=n(6135),c=n(5417),f=n(1194),p=n(5112),h=n(7392),d=p("isConcatSpreadable"),v=9007199254740991,y="Maximum allowed index exceeded",g=h>=51||!i((function(){var e=[];return e[d]=!1,e.concat()[0]!==e})),m=f("concat"),b=function(e){if(!a(e))return!1;var t=e[d];return void 0!==t?!!t:o(e)};r({target:"Array",proto:!0,forced:!g||!m},{concat:function(e){var t,n,r,i,o,a=u(this),f=c(a,0),p=0;for(t=-1,r=arguments.length;t<r;t++)if(b(o=-1===t?a:arguments[t])){if(p+(i=s(o.length))>v)throw TypeError(y);for(n=0;n<i;n++,p++)n in o&&l(f,p,o[n])}else{if(p>=v)throw TypeError(y);l(f,p++,o)}return f.length=p,f}})},7327:function(e,t,n){"use strict";var r=n(2109),i=n(2092).filter;r({target:"Array",proto:!0,forced:!n(1194)("filter")},{filter:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}})},2772:function(e,t,n){"use strict";var r=n(2109),i=n(1318).indexOf,o=n(9341),a=[].indexOf,u=!!a&&1/[1].indexOf(1,-0)<0,s=o("indexOf");r({target:"Array",proto:!0,forced:u||!s},{indexOf:function(e){return u?a.apply(this,arguments)||0:i(this,e,arguments.length>1?arguments[1]:void 0)}})},6992:function(e,t,n){"use strict";var r=n(5656),i=n(1223),o=n(7497),a=n(9909),u=n(654),s="Array Iterator",l=a.set,c=a.getterFor(s);e.exports=u(Array,"Array",(function(e,t){l(this,{type:s,target:r(e),index:0,kind:t})}),(function(){var e=c(this),t=e.target,n=e.kind,r=e.index++;return!t||r>=t.length?(e.target=void 0,{value:void 0,done:!0}):"keys"==n?{value:r,done:!1}:"values"==n?{value:t[r],done:!1}:{value:[r,t[r]],done:!1}}),"values"),o.Arguments=o.Array,i("keys"),i("values"),i("entries")},1249:function(e,t,n){"use strict";var r=n(2109),i=n(2092).map;r({target:"Array",proto:!0,forced:!n(1194)("map")},{map:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}})},7042:function(e,t,n){"use strict";var r=n(2109),i=n(111),o=n(3157),a=n(1400),u=n(7466),s=n(5656),l=n(6135),c=n(5112),f=n(1194)("slice"),p=c("species"),h=[].slice,d=Math.max;r({target:"Array",proto:!0,forced:!f},{slice:function(e,t){var n,r,c,f=s(this),v=u(f.length),y=a(e,v),g=a(void 0===t?v:t,v);if(o(f)&&("function"!=typeof(n=f.constructor)||n!==Array&&!o(n.prototype)?i(n)&&null===(n=n[p])&&(n=void 0):n=void 0,n===Array||void 0===n))return h.call(f,y,g);for(r=new(void 0===n?Array:n)(d(g-y,0)),c=0;y<g;y++,c++)y in f&&l(r,c,f[y]);return r.length=c,r}})},561:function(e,t,n){"use strict";var r=n(2109),i=n(1400),o=n(9958),a=n(7466),u=n(7908),s=n(5417),l=n(6135),c=n(1194)("splice"),f=Math.max,p=Math.min,h=9007199254740991,d="Maximum allowed length exceeded";r({target:"Array",proto:!0,forced:!c},{splice:function(e,t){var n,r,c,v,y,g,m=u(this),b=a(m.length),x=i(e,b),w=arguments.length;if(0===w?n=r=0:1===w?(n=0,r=b-x):(n=w-2,r=p(f(o(t),0),b-x)),b+n-r>h)throw TypeError(d);for(c=s(m,r),v=0;v<r;v++)(y=x+v)in m&&l(c,v,m[y]);if(c.length=r,n<r){for(v=x;v<b-r;v++)g=v+n,(y=v+r)in m?m[g]=m[y]:delete m[g];for(v=b;v>b-r+n;v--)delete m[v-1]}else if(n>r)for(v=b-r;v>x;v--)g=v+n-1,(y=v+r-1)in m?m[g]=m[y]:delete m[g];for(v=0;v<n;v++)m[v+x]=arguments[v+2];return m.length=b-r+n,c}})},8309:function(e,t,n){var r=n(9781),i=n(3070).f,o=Function.prototype,a=o.toString,u=/^\s*function ([^ (]*)/,s="name";r&&!(s in o)&&i(o,s,{configurable:!0,get:function(){try{return a.call(this).match(u)[1]}catch(e){return""}}})},489:function(e,t,n){var r=n(2109),i=n(7293),o=n(7908),a=n(9518),u=n(8544);r({target:"Object",stat:!0,forced:i((function(){a(1)})),sham:!u},{getPrototypeOf:function(e){return a(o(e))}})},1539:function(e,t,n){var r=n(1694),i=n(1320),o=n(288);r||i(Object.prototype,"toString",o,{unsafe:!0})},4916:function(e,t,n){"use strict";var r=n(2109),i=n(2261);r({target:"RegExp",proto:!0,forced:/./.exec!==i},{exec:i})},9714:function(e,t,n){"use strict";var r=n(1320),i=n(9670),o=n(7293),a=n(7066),u="toString",s=RegExp.prototype,l=s.toString,c=o((function(){return"/a/b"!=l.call({source:"a",flags:"b"})})),f=l.name!=u;(c||f)&&r(RegExp.prototype,u,(function(){var e=i(this),t=String(e.source),n=e.flags;return"/"+t+"/"+String(void 0===n&&e instanceof RegExp&&!("flags"in s)?a.call(e):n)}),{unsafe:!0})},8783:function(e,t,n){"use strict";var r=n(8710).charAt,i=n(9909),o=n(654),a="String Iterator",u=i.set,s=i.getterFor(a);o(String,"String",(function(e){u(this,{type:a,string:String(e),index:0})}),(function(){var e,t=s(this),n=t.string,i=t.index;return i>=n.length?{value:void 0,done:!0}:(e=r(n,i),t.index+=e.length,{value:e,done:!1})}))},4723:function(e,t,n){"use strict";var r=n(7007),i=n(9670),o=n(7466),a=n(4488),u=n(1530),s=n(7651);r("match",1,(function(e,t,n){return[function(t){var n=a(this),r=null==t?void 0:t[e];return void 0!==r?r.call(t,n):new RegExp(t)[e](String(n))},function(e){var r=n(t,e,this);if(r.done)return r.value;var a=i(e),l=String(this);if(!a.global)return s(a,l);var c=a.unicode;a.lastIndex=0;for(var f,p=[],h=0;null!==(f=s(a,l));){var d=String(f[0]);p[h]=d,""===d&&(a.lastIndex=u(l,o(a.lastIndex),c)),h++}return 0===h?null:p}]}))},5306:function(e,t,n){"use strict";var r=n(7007),i=n(9670),o=n(7466),a=n(9958),u=n(4488),s=n(1530),l=n(647),c=n(7651),f=Math.max,p=Math.min;r("replace",2,(function(e,t,n,r){var h=r.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,d=r.REPLACE_KEEPS_$0,v=h?"$":"$0";return[function(n,r){var i=u(this),o=null==n?void 0:n[e];return void 0!==o?o.call(n,i,r):t.call(String(i),n,r)},function(e,r){if(!h&&d||"string"==typeof r&&-1===r.indexOf(v)){var u=n(t,e,this,r);if(u.done)return u.value}var y=i(e),g=String(this),m="function"==typeof r;m||(r=String(r));var b=y.global;if(b){var x=y.unicode;y.lastIndex=0}for(var w=[];;){var E=c(y,g);if(null===E)break;if(w.push(E),!b)break;""===String(E[0])&&(y.lastIndex=s(g,o(y.lastIndex),x))}for(var k,A="",S=0,F=0;F<w.length;F++){E=w[F];for(var T=String(E[0]),C=f(p(a(E.index),g.length),0),L=[],R=1;R<E.length;R++)L.push(void 0===(k=E[R])?k:String(k));var I=E.groups;if(m){var U=[T].concat(L,C,g);void 0!==I&&U.push(I);var O=String(r.apply(void 0,U))}else O=l(T,g,C,L,I,r);C>=S&&(A+=g.slice(S,C)+O,S=C+T.length)}return A+g.slice(S)}]}))},3123:function(e,t,n){"use strict";var r=n(7007),i=n(7850),o=n(9670),a=n(4488),u=n(6707),s=n(1530),l=n(7466),c=n(7651),f=n(2261),p=n(7293),h=[].push,d=Math.min,v=4294967295,y=!p((function(){return!RegExp(v,"y")}));r("split",2,(function(e,t,n){var r;return r="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(e,n){var r=String(a(this)),o=void 0===n?v:n>>>0;if(0===o)return[];if(void 0===e)return[r];if(!i(e))return t.call(r,e,o);for(var u,s,l,c=[],p=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),d=0,y=new RegExp(e.source,p+"g");(u=f.call(y,r))&&!((s=y.lastIndex)>d&&(c.push(r.slice(d,u.index)),u.length>1&&u.index<r.length&&h.apply(c,u.slice(1)),l=u[0].length,d=s,c.length>=o));)y.lastIndex===u.index&&y.lastIndex++;return d===r.length?!l&&y.test("")||c.push(""):c.push(r.slice(d)),c.length>o?c.slice(0,o):c}:"0".split(void 0,0).length?function(e,n){return void 0===e&&0===n?[]:t.call(this,e,n)}:t,[function(t,n){var i=a(this),o=null==t?void 0:t[e];return void 0!==o?o.call(t,i,n):r.call(String(i),t,n)},function(e,i){var a=n(r,e,this,i,r!==t);if(a.done)return a.value;var f=o(e),p=String(this),h=u(f,RegExp),g=f.unicode,m=(f.ignoreCase?"i":"")+(f.multiline?"m":"")+(f.unicode?"u":"")+(y?"y":"g"),b=new h(y?f:"^(?:"+f.source+")",m),x=void 0===i?v:i>>>0;if(0===x)return[];if(0===p.length)return null===c(b,p)?[p]:[];for(var w=0,E=0,k=[];E<p.length;){b.lastIndex=y?E:0;var A,S=c(b,y?p:p.slice(E));if(null===S||(A=d(l(b.lastIndex+(y?0:E)),p.length))===w)E=s(p,E,g);else{if(k.push(p.slice(w,E)),k.length===x)return k;for(var F=1;F<=S.length-1;F++)if(k.push(S[F]),k.length===x)return k;E=w=A}}return k.push(p.slice(w)),k}]}),!y)},3210:function(e,t,n){"use strict";var r=n(2109),i=n(3111).trim;r({target:"String",proto:!0,forced:n(6091)("trim")},{trim:function(){return i(this)}})},2990:function(e,t,n){"use strict";var r=n(260),i=n(1048),o=r.aTypedArray;(0,r.exportTypedArrayMethod)("copyWithin",(function(e,t){return i.call(o(this),e,t,arguments.length>2?arguments[2]:void 0)}))},8927:function(e,t,n){"use strict";var r=n(260),i=n(2092).every,o=r.aTypedArray;(0,r.exportTypedArrayMethod)("every",(function(e){return i(o(this),e,arguments.length>1?arguments[1]:void 0)}))},3105:function(e,t,n){"use strict";var r=n(260),i=n(1285),o=r.aTypedArray;(0,r.exportTypedArrayMethod)("fill",(function(e){return i.apply(o(this),arguments)}))},5035:function(e,t,n){"use strict";var r=n(260),i=n(2092).filter,o=n(3074),a=r.aTypedArray;(0,r.exportTypedArrayMethod)("filter",(function(e){var t=i(a(this),e,arguments.length>1?arguments[1]:void 0);return o(this,t)}))},7174:function(e,t,n){"use strict";var r=n(260),i=n(2092).findIndex,o=r.aTypedArray;(0,r.exportTypedArrayMethod)("findIndex",(function(e){return i(o(this),e,arguments.length>1?arguments[1]:void 0)}))},4345:function(e,t,n){"use strict";var r=n(260),i=n(2092).find,o=r.aTypedArray;(0,r.exportTypedArrayMethod)("find",(function(e){return i(o(this),e,arguments.length>1?arguments[1]:void 0)}))},2846:function(e,t,n){"use strict";var r=n(260),i=n(2092).forEach,o=r.aTypedArray;(0,r.exportTypedArrayMethod)("forEach",(function(e){i(o(this),e,arguments.length>1?arguments[1]:void 0)}))},4731:function(e,t,n){"use strict";var r=n(260),i=n(1318).includes,o=r.aTypedArray;(0,r.exportTypedArrayMethod)("includes",(function(e){return i(o(this),e,arguments.length>1?arguments[1]:void 0)}))},7209:function(e,t,n){"use strict";var r=n(260),i=n(1318).indexOf,o=r.aTypedArray;(0,r.exportTypedArrayMethod)("indexOf",(function(e){return i(o(this),e,arguments.length>1?arguments[1]:void 0)}))},6319:function(e,t,n){"use strict";var r=n(7854),i=n(260),o=n(6992),a=n(5112)("iterator"),u=r.Uint8Array,s=o.values,l=o.keys,c=o.entries,f=i.aTypedArray,p=i.exportTypedArrayMethod,h=u&&u.prototype[a],d=!!h&&("values"==h.name||null==h.name),v=function(){return s.call(f(this))};p("entries",(function(){return c.call(f(this))})),p("keys",(function(){return l.call(f(this))})),p("values",v,!d),p(a,v,!d)},8867:function(e,t,n){"use strict";var r=n(260),i=r.aTypedArray,o=r.exportTypedArrayMethod,a=[].join;o("join",(function(e){return a.apply(i(this),arguments)}))},7789:function(e,t,n){"use strict";var r=n(260),i=n(6583),o=r.aTypedArray;(0,r.exportTypedArrayMethod)("lastIndexOf",(function(e){return i.apply(o(this),arguments)}))},3739:function(e,t,n){"use strict";var r=n(260),i=n(2092).map,o=n(6707),a=r.aTypedArray,u=r.aTypedArrayConstructor;(0,r.exportTypedArrayMethod)("map",(function(e){return i(a(this),e,arguments.length>1?arguments[1]:void 0,(function(e,t){return new(u(o(e,e.constructor)))(t)}))}))},4483:function(e,t,n){"use strict";var r=n(260),i=n(3671).right,o=r.aTypedArray;(0,r.exportTypedArrayMethod)("reduceRight",(function(e){return i(o(this),e,arguments.length,arguments.length>1?arguments[1]:void 0)}))},9368:function(e,t,n){"use strict";var r=n(260),i=n(3671).left,o=r.aTypedArray;(0,r.exportTypedArrayMethod)("reduce",(function(e){return i(o(this),e,arguments.length,arguments.length>1?arguments[1]:void 0)}))},2056:function(e,t,n){"use strict";var r=n(260),i=r.aTypedArray,o=r.exportTypedArrayMethod,a=Math.floor;o("reverse",(function(){for(var e,t=this,n=i(t).length,r=a(n/2),o=0;o<r;)e=t[o],t[o++]=t[--n],t[n]=e;return t}))},3462:function(e,t,n){"use strict";var r=n(260),i=n(7466),o=n(4590),a=n(7908),u=n(7293),s=r.aTypedArray;(0,r.exportTypedArrayMethod)("set",(function(e){s(this);var t=o(arguments.length>1?arguments[1]:void 0,1),n=this.length,r=a(e),u=i(r.length),l=0;if(u+t>n)throw RangeError("Wrong length");for(;l<u;)this[t+l]=r[l++]}),u((function(){new Int8Array(1).set({})})))},678:function(e,t,n){"use strict";var r=n(260),i=n(6707),o=n(7293),a=r.aTypedArray,u=r.aTypedArrayConstructor,s=r.exportTypedArrayMethod,l=[].slice;s("slice",(function(e,t){for(var n=l.call(a(this),e,t),r=i(this,this.constructor),o=0,s=n.length,c=new(u(r))(s);s>o;)c[o]=n[o++];return c}),o((function(){new Int8Array(1).slice()})))},7462:function(e,t,n){"use strict";var r=n(260),i=n(2092).some,o=r.aTypedArray;(0,r.exportTypedArrayMethod)("some",(function(e){return i(o(this),e,arguments.length>1?arguments[1]:void 0)}))},3824:function(e,t,n){"use strict";var r=n(260),i=r.aTypedArray,o=r.exportTypedArrayMethod,a=[].sort;o("sort",(function(e){return a.call(i(this),e)}))},5021:function(e,t,n){"use strict";var r=n(260),i=n(7466),o=n(1400),a=n(6707),u=r.aTypedArray;(0,r.exportTypedArrayMethod)("subarray",(function(e,t){var n=u(this),r=n.length,s=o(e,r);return new(a(n,n.constructor))(n.buffer,n.byteOffset+s*n.BYTES_PER_ELEMENT,i((void 0===t?r:o(t,r))-s))}))},297ght .form-control-navbar:focus,
.navbar-gray-dark.navbar-light .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #292d32;
  border-color: #1f2327 !important;
  color: #343a40;
}

.navbar-gray-dark.navbar-dark .form-control-navbar::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.navbar-gray-dark.navbar-dark .form-control-navbar::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.navbar-gray-dark.navbar-dark .form-control-navbar:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.navbar-gray-dark.navbar-dark .form-control-navbar::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.navbar-gray-dark.navbar-dark .form-control-navbar::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.navbar-gray-dark.navbar-dark .form-control-navbar,
.navbar-gray-dark.navbar-dark .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #3d444b;
  border-color: #495159;
  color: rgba(255, 255, 255, 0.8);
}

.navbar-gray-dark.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder {
  color: #fff;
}

.navbar-gray-dark.navbar-dark .form-control-navbar:focus::-moz-placeholder {
  color: #fff;
}

.navbar-gray-dark.navbar-dark .form-control-navbar:focus:-ms-input-placeholder {
  color: #fff;
}

.navbar-gray-dark.navbar-dark .form-control-navbar:focus::-ms-input-placeholder {
  color: #fff;
}

.navbar-gray-dark.navbar-dark .form-control-navbar:focus::placeholder {
  color: #fff;
}

.navbar-gray-dark.navbar-dark .form-control-navbar:focus,
.navbar-gray-dark.navbar-dark .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #3f474e;
  border-color: #495159 !important;
  color: #fff;
}

.navbar-nav-not-expanded {
  -ms-flex-direction: row;
  flex-direction: row;
}

.navbar-nav-not-expanded .dropdown-menu {
  position: absolute;
}

.navbar-nav-not-expanded .nav-link {
  padding-right: 1rem;
  padding-left: 1rem;
}

.dark-mode .nav-pills .nav-link {
  color: #ced4da;
}

.dark-mode .nav-tabs {
  border-color: #56606a;
}

.dark-mode .nav-tabs .nav-link:focus,
.dark-mode .nav-tabs .nav-link:hover {
  border-color: #56606a;
}

.dark-mode .nav-tabs .nav-item.show .nav-link,
.dark-mode .nav-tabs .nav-link.active {
  background-color: #343a40;
  border-color: #56606a #56606a transparent #56606a;
  color: #fff;
}

.dark-mode .nav-tabs.flex-column .nav-item.show .nav-link.active, .dark-mode .nav-tabs.flex-column .nav-item.show .nav-link:focus, .dark-mode .nav-tabs.flex-column .nav-item.show .nav-link:hover,
.dark-mode .nav-tabs.flex-column .nav-link.active,
.dark-mode .nav-tabs.flex-column .nav-link:focus,
.dark-mode .nav-tabs.flex-column .nav-link:hover {
  border-color: #56606a transparent #56606a #56606a;
}

.dark-mode .nav-tabs.flex-column .nav-item.show .nav-link:focus, .dark-mode .nav-tabs.flex-column .nav-item.show .nav-link:hover,
.dark-mode .nav-tabs.flex-column .nav-link:focus,
.dark-mode .nav-tabs.flex-column .nav-link:hover {
  background-color: #3f474e;
}

.dark-mode .nav-tabs.flex-column.nav-tabs-right {
  border-color: #56606a;
}

.dark-mode .nav-tabs.flex-column.nav-tabs-right .nav-link.active, .dark-mode .nav-tabs.flex-column.nav-tabs-right .nav-link:focus, .dark-mode .nav-tabs.flex-column.nav-tabs-right .nav-link:hover {
  border-color: #56606a #56606a #56606a transparent;
}

.dark-mode .navbar-light {
  background-color: #f8f9fa;
}

.dark-mode .navbar-dark {
  background-color: #343a40;
  border-color: #4b545c;
}

.dark-mode .navbar-primary {
  background-color: #3f6791;
  color: #fff;
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar::-webkit-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar::-moz-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar:-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar::-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar::placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar,
.dark-mode .navbar-primary.navbar-light .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #395d83;
  border-color: #315071;
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar:focus::-webkit-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar:focus::-moz-placeholder {
  color: #343a40;
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar:focus:-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar:focus::-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar:focus::placeholder {
  color: #343a40;
}

.dark-mode .navbar-primary.navbar-light .form-control-navbar:focus,
.dark-mode .navbar-primary.navbar-light .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #375a7f;
  border-color: #315071 !important;
  color: #343a40;
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar,
.dark-mode .navbar-primary.navbar-dark .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #45719f;
  border-color: #4d7eb1;
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar:focus::-moz-placeholder {
  color: #fff;
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar:focus:-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar:focus::-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar:focus::placeholder {
  color: #fff;
}

.dark-mode .navbar-primary.navbar-dark .form-control-navbar:focus,
.dark-mode .navbar-primary.navbar-dark .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #4774a3;
  border-color: #4d7eb1 !important;
  color: #fff;
}

.dark-mode .navbar-secondary {
  background-color: #6c757d;
  color: #fff;
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar::-webkit-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar::-moz-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar:-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar::-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar::placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar,
.dark-mode .navbar-secondary.navbar-light .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #636b72;
  border-color: #575e64;
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar:focus::-webkit-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar:focus::-moz-placeholder {
  color: #343a40;
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar:focus:-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar:focus::-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar:focus::placeholder {
  color: #343a40;
}

.dark-mode .navbar-secondary.navbar-light .form-control-navbar:focus,
.dark-mode .navbar-secondary.navbar-light .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #60686f;
  border-color: #575e64 !important;
  color: #343a40;
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar,
.dark-mode .navbar-secondary.navbar-dark .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #757f88;
  border-color: #838c94;
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar:focus::-moz-placeholder {
  color: #fff;
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar:focus:-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar:focus::-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar:focus::placeholder {
  color: #fff;
}

.dark-mode .navbar-secondary.navbar-dark .form-control-navbar:focus,
.dark-mode .navbar-secondary.navbar-dark .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #78828a;
  border-color: #838c94 !important;
  color: #fff;
}

.dark-mode .navbar-success {
  background-color: #00bc8c;
  color: #fff;
}

.dark-mode .navbar-success.navbar-light .form-control-navbar::-webkit-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-success.navbar-light .form-control-navbar::-moz-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-success.navbar-light .form-control-navbar:-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-success.navbar-light .form-control-navbar::-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-success.navbar-light .form-control-navbar::placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-success.navbar-light .form-control-navbar,
.dark-mode .navbar-success.navbar-light .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #00a87d;
  border-color: #008e6a;
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-success.navbar-light .form-control-navbar:focus::-webkit-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-success.navbar-light .form-control-navbar:focus::-moz-placeholder {
  color: #343a40;
}

.dark-mode .navbar-success.navbar-light .form-control-navbar:focus:-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-success.navbar-light .form-control-navbar:focus::-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-success.navbar-light .form-control-navbar:focus::placeholder {
  color: #343a40;
}

.dark-mode .navbar-success.navbar-light .form-control-navbar:focus,
.dark-mode .navbar-success.navbar-light .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #00a379;
  border-color: #008e6a !important;
  color: #343a40;
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar,
.dark-mode .navbar-success.navbar-dark .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #00d09b;
  border-color: #00eaae;
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar:focus::-moz-placeholder {
  color: #fff;
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar:focus:-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar:focus::-ms-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar:focus::placeholder {
  color: #fff;
}

.dark-mode .navbar-success.navbar-dark .form-control-navbar:focus,
.dark-mode .navbar-success.navbar-dark .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #00d69f;
  border-color: #00eaae !important;
  color: #fff;
}

.dark-mode .navbar-info {
  background-color: #3498db;
  color: #fff;
}

.dark-mode .navbar-info.navbar-light .form-control-navbar::-webkit-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-info.navbar-light .form-control-navbar::-moz-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-info.navbar-light .form-control-navbar:-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-info.navbar-light .form-control-navbar::-ms-input-placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-info.navbar-light .form-control-navbar::placeholder {
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-info.navbar-light .form-control-navbar,
.dark-mode .navbar-info.navbar-light .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #268fd5;
  border-color: #2280bf;
  color: rgba(52, 58, 64, 0.8);
}

.dark-mode .navbar-info.navbar-light .form-control-navbar:focus::-webkit-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-info.navbar-light .form-control-navbar:focus::-moz-placeholder {
  color: #343a40;
}

.dark-mode .navbar-info.navbar-light .form-control-navbar:focus:-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-info.navbar-light .form-control-navbar:focus::-ms-input-placeholder {
  color: #343a40;
}

.dark-mode .navbar-info.navbar-light .form-control-navbar:focus::placeholder {
  color: #343a40;
}

.dark-mode .navbar-info.navbar-light .form-control-navbar:focus,
.dark-mode .navbar-info.navbar-light .form-control-navbar:focus + .input-group-append .btn-navbar {
  background-color: #258cd1;
  border-color: #2280bf !important;
  color: #343a40;
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar::-moz-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar:-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar::-ms-input-placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar,
.dark-mode .navbar-info.navbar-dark .form-control-navbar + .input-group-append > .btn-navbar {
  background-color: #45a1de;
  border-color: #5bace2;
  color: rgba(255, 255, 255, 0.8);
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder {
  color: #fff;
}

.dark-mode .navbar-info.navbar-dark .form-control-navbar:focus::-moz-placeholder {
  color: #fff;
}
lid #ffc107}.card-yellow.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.card-yellow.card-outline-tabs>.card-header a.active,.card-yellow.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #ffc107}.bg-gradient-yellow>.card-header .btn-tool,.bg-yellow>.card-header .btn-tool,.card-yellow:not(.card-outline)>.card-header .btn-tool{color:rgba(31,45,61,.8)}.bg-gradient-yellow>.card-header .btn-tool:hover,.bg-yellow>.card-header .btn-tool:hover,.card-yellow:not(.card-outline)>.card-header .btn-tool:hover{color:#1f2d3d}.card.bg-gradient-yellow .bootstrap-datetimepicker-widget .table td,.card.bg-gradient-yellow .bootstrap-datetimepicker-widget .table th,.card.bg-yellow .bootstrap-datetimepicker-widget .table td,.card.bg-yellow .bootstrap-datetimepicker-widget .table th{border:none}.card.bg-gradient-yellow .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-gradient-yellow .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-gradient-yellow .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-gradient-yellow .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-gradient-yellow .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,.card.bg-yellow .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-yellow .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-yellow .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-yellow .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-yellow .bootstrap-datetimepicker-widget table thead tr:first-child th:hover{background-color:#dda600;color:#1f2d3d}.card.bg-gradient-yellow .bootstrap-datetimepicker-widget table td.today::before,.card.bg-yellow .bootstrap-datetimepicker-widget table td.today::before{border-bottom-color:#1f2d3d}.card.bg-gradient-yellow .bootstrap-datetimepicker-widget table td.active,.card.bg-gradient-yellow .bootstrap-datetimepicker-widget table td.active:hover,.card.bg-yellow .bootstrap-datetimepicker-widget table td.active,.card.bg-yellow .bootstrap-datetimepicker-widget table td.active:hover{background-color:#ffce3a;color:#1f2d3d}.card-green:not(.card-outline)>.card-header{background-color:#28a745}.card-green:not(.card-outline)>.card-header,.card-green:not(.card-outline)>.card-header a{color:#fff}.card-green:not(.card-outline)>.card-header a.active{color:#1f2d3d}.card-green.card-outline{border-top:3px solid #28a745}.card-green.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.card-green.card-outline-tabs>.card-header a.active,.card-green.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #28a745}.bg-gradient-green>.card-header .btn-tool,.bg-green>.card-header .btn-tool,.card-green:not(.card-outline)>.card-header .btn-tool{color:rgba(255,255,255,.8)}.bg-gradient-green>.card-header .btn-tool:hover,.bg-green>.card-header .btn-tool:hover,.card-green:not(.card-outline)>.card-header .btn-tool:hover{color:#fff}.card.bg-gradient-green .bootstrap-datetimepicker-widget .table td,.card.bg-gradient-green .bootstrap-datetimepicker-widget .table th,.card.bg-green .bootstrap-datetimepicker-widget .table td,.card.bg-green .bootstrap-datetimepicker-widget .table th{border:none}.card.bg-gradient-green .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-gradient-green .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-gradient-green .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-gradient-green .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-gradient-green .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,.card.bg-green .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-green .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-green .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-green .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-green .bootstrap-datetimepicker-widget table thead tr:first-child th:hover{background-color:#208637;color:#fff}.card.bg-gradient-green .bootstrap-datetimepicker-widget table td.today::before,.card.bg-green .bootstrap-datetimepicker-widget table td.today::before{border-bottom-color:#fff}.card.bg-gradient-green .bootstrap-datetimepicker-widget table td.active,.card.bg-gradient-green .bootstrap-datetimepicker-widget table td.active:hover,.card.bg-green .bootstrap-datetimepicker-widget table td.active,.card.bg-green .bootstrap-datetimepicker-widget table td.active:hover{background-color:#34ce57;color:#fff}.card-teal:not(.card-outline)>.card-header{background-color:#20c997}.card-teal:not(.card-outline)>.card-header,.card-teal:not(.card-outline)>.card-header a{color:#fff}.card-teal:not(.card-outline)>.card-header a.active{color:#1f2d3d}.card-teal.card-outline{border-top:3px solid #20c997}.card-teal.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.card-teal.card-outline-tabs>.card-header a.active,.card-teal.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #20c997}.bg-gradient-teal>.card-header .btn-tool,.bg-teal>.card-header .btn-tool,.card-teal:not(.card-outline)>.card-header .btn-tool{color:rgba(255,255,255,.8)}.bg-gradient-teal>.card-header .btn-tool:hover,.bg-teal>.card-header .btn-tool:hover,.card-teal:not(.card-outline)>.card-header .btn-tool:hover{color:#fff}.card.bg-gradient-teal .bootstrap-datetimepicker-widget .table td,.card.bg-gradient-teal .bootstrap-datetimepicker-widget .table th,.card.bg-teal .bootstrap-datetimepicker-widget .table td,.card.bg-teal .bootstrap-datetimepicker-widget .table th{border:none}.card.bg-gradient-teal .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-gradient-teal .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-gradient-teal .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-gradient-teal .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-gradient-teal .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,.card.bg-teal .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-teal .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-teal .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-teal .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-teal .bootstrap-datetimepicker-widget table thead tr:first-child th:hover{background-color:#1aa67d;color:#fff}.card.bg-gradient-teal .bootstrap-datetimepicker-widget table td.today::before,.card.bg-teal .bootstrap-datetimepicker-widget table td.today::before{border-bottom-color:#fff}.card.bg-gradient-teal .bootstrap-datetimepicker-widget table td.active,.card.bg-gradient-teal .bootstrap-datetimepicker-widget table td.active:hover,.card.bg-teal .bootstrap-datetimepicker-widget table td.active,.card.bg-teal .bootstrap-datetimepicker-widget table td.active:hover{background-color:#3ce0af;color:#fff}.card-cyan:not(.card-outline)>.card-header{background-color:#17a2b8}.card-cyan:not(.card-outline)>.card-header,.card-cyan:not(.card-outline)>.card-header a{color:#fff}.card-cyan:not(.card-outline)>.card-header a.active{color:#1f2d3d}.card-cyan.card-outline{border-top:3px solid #17a2b8}.card-cyan.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.card-cyan.card-outline-tabs>.card-header a.active,.card-cyan.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #17a2b8}.bg-cyan>.card-header .btn-tool,.bg-gradient-cyan>.card-header .btn-tool,.card-cyan:not(.card-outline)>.card-header .btn-tool{color:rgba(255,255,255,.8)}.bg-cyan>.card-header .btn-tool:hover,.bg-gradient-cyan>.card-header .btn-tool:hover,.card-cyan:not(.card-outline)>.card-header .btn-tool:hover{color:#fff}.card.bg-cyan .bootstrap-datetimepicker-widget .table td,.card.bg-cyan .bootstrap-datetimepicker-widget .table th,.card.bg-gradient-cyan .bootstrap-datetimepicker-widget .table td,.card.bg-gradient-cyan .bootstrap-datetimepicker-widget .table th{border:none}.card.bg-cyan .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-cyan .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-cyan .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-cyan .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-cyan .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,.card.bg-gradient-cyan .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-gradient-cyan .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-gradient-cyan .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-gradient-cyan .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-gradient-cyan .bootstrap-datetimepicker-widget table thead tr:first-child th:hover{background-color:#128294;color:#fff}.card.bg-cyan .bootstrap-datetimepicker-widget table td.today::before,.card.bg-gradient-cyan .bootstrap-datetimepicker-widget table td.today::before{border-bottom-color:#fff}.card.bg-cyan .bootstrap-datetimepicker-widget table td.active,.card.bg-cyan .bootstrap-datetimepicker-widget table td.active:hover,.card.bg-gradient-cyan .bootstrap-datetimepicker-widget table td.active,.card.bg-gradient-cyan .bootstrap-datetimepicker-widget table td.active:hover{background-color:#1fc8e3;color:#fff}.card-white:not(.card-outline)>.card-header{background-color:#fff}.card-white:not(.card-outline)>.card-header,.card-white:not(.card-outline)>.card-header a{color:#1f2d3d}.card-white:not(.card-outline)>.card-header a.active{color:#1f2d3d}.card-white.card-outline{border-top:3px solid #fff}.card-white.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.card-white.card-outline-tabs>.card-header a.active,.card-white.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #fff}.bg-gradient-white>.card-header .btn-tool,.bg-white>.card-header .btn-tool,.card-white:not(.card-outline)>.card-header .btn-tool{color:rgba(31,45,61,.8)}.bg-gradient-white>.card-header .btn-tool:hover,.bg-white>.card-header .btn-tool:hover,.card-white:not(.card-outline)>.card-header .btn-tool:hover{color:#1f2d3d}.card.bg-gradient-white .bootstrap-datetimepicker-widget .table td,.card.bg-gradient-white .bootstrap-datetimepicker-widget .table th,.card.bg-white .bootstrap-datetimepicker-widget .table td,.card.bg-white .bootstrap-datetimepicker-widget .table th{border:none}.card.bg-gradient-white .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-gradient-white .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-gradient-white .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-gradient-white .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-gradient-white .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,.card.bg-white .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-white .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-white .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-white .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-white .bootstrap-datetimepicker-widget table thead tr:first-child th:hover{background-color:#ebebeb;color:#1f2d3d}.card.bg-gradient-white .bootstrap-datetimepicker-widget table td.today::before,.card.bg-white .bootstrap-datetimepicker-widget table td.today::before{border-bottom-color:#1f2d3d}.card.bg-gradient-white .bootstrap-datetimepicker-widget table td.active,.card.bg-gradient-white .bootstrap-datetimepicker-widget table td.active:hover,.card.bg-white .bootstrap-datetimepicker-widget table td.active,.card.bg-white .bootstrap-datetimepicker-widget table td.active:hover{background-color:#fff;color:#1f2d3d}.card-gray:not(.card-outline)>.card-header{background-color:#6c757d}.card-gray:not(.card-outline)>.card-header,.card-gray:not(.card-outline)>.card-header a{color:#fff}.card-gray:not(.card-outline)>.card-header a.active{color:#1f2d3d}.card-gray.card-outline{border-top:3px solid #6c757d}.card-gray.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.card-gray.card-outline-tabs>.card-header a.active,.card-gray.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #6c757d}.bg-gradient-gray>.card-header .btn-tool,.bg-gray>.card-header .btn-tool,.card-gray:not(.card-outline)>.card-header .btn-tool{color:rgba(255,255,255,.8)}.bg-gradient-gray>.card-header .btn-tool:hover,.bg-gray>.card-header .btn-tool:hover,.card-gray:not(.card-outline)>.card-header .btn-tool:hover{color:#fff}.card.bg-gradient-gray .bootstrap-datetimepicker-widget .table td,.card.bg-gradient-gray .bootstrap-datetimepicker-widget .table th,.card.bg-gray .bootstrap-datetimepicker-widget .table td,.card.bg-gray .bootstrap-datetimepicker-widget .table th{border:none}.card.bg-gradient-gray .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-gradient-gray .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-gradient-gray .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-gradient-gray .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-gradient-gray .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,.card.bg-gray .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-gray .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-gray .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-gray .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-gray .bootstrap-datetimepicker-widget table thead tr:first-child th:hover{background-color:#596167;color:#fff}.card.bg-gradient-gray .bootstrap-datetimepicker-widget table td.today::before,.card.bg-gray .bootstrap-datetimepicker-widget table td.today::before{border-bottom-color:#fff}.card.bg-gradient-gray .bootstrap-datetimepicker-widget table td.active,.card.bg-gradient-gray .bootstrap-datetimepicker-widget table td.active:hover,.card.bg-gray .bootstrap-datetimepicker-widget table td.active,.card.bg-gray .bootstrap-datetimepicker-widget table td.active:hover{background-color:#868e96;color:#fff}.card-gray-dark:not(.card-outline)>.card-header{background-color:#343a40}.card-gray-dark:not(.card-outline)>.card-header,.card-gray-dark:not(.card-outline)>.card-header a{color:#fff}.card-gray-dark:not(.card-outline)>.card-header a.active{color:#1f2d3d}.card-gray-dark.card-outline{border-top:3px solid #343a40}.card-gray-dark.card-outline-tabs>.card-header a:hover{border-top:3px solid #dee2e6}.card-gray-dark.card-outline-tabs>.card-header a.active,.card-gray-dark.card-outline-tabs>.card-header a.active:hover{border-top:3px solid #343a40}.bg-gradient-gray-dark>.card-header .btn-tool,.bg-gray-dark>.card-header .btn-tool,.card-gray-dark:not(.card-outline)>.card-header .btn-tool{color:rgba(255,255,255,.8)}.bg-gradient-gray-dark>.card-header .btn-tool:hover,.bg-gray-dark>.card-header .btn-tool:hover,.card-gray-dark:not(.card-outline)>.card-header .btn-tool:hover{color:#fff}.card.bg-gradient-gray-dark .bootstrap-datetimepicker-widget .table td,.card.bg-gradient-gray-dark .bootstrap-datetimepicker-widget .table th,.card.bg-gray-dark .bootstrap-datetimepicker-widget .table td,.card.bg-gray-dark .bootstrap-datetimepicker-widget .table th{border:none}.card.bg-gradient-gray-dark .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-gradient-gray-dark .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-gradient-gray-dark .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-gradient-gray-dark .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-gradient-gray-dark .bootstrap-datetimepicker-widget table thead tr:first-child th:hover,.card.bg-gray-dark .bootstrap-datetimepicker-widget table td.day:hover,.card.bg-gray-dark .bootstrap-datetimepicker-widget table td.hour:hover,.card.bg-gray-dark .bootstrap-datetimepicker-widget table td.minute:hover,.card.bg-gray-dark .bootstrap-datetimepicker-widget table td.second:hover,.card.bg-gray-dark .bootstrap-datetimepicker-widget table thead tr:first-child th:hover{background-color:#222629;color:#fff}.card.bg-gradient-gray-dark .bootstrap-datetimepicker-widget table td.today::before,.card.bg-gray-dark .bootstrap-datetimepicker-widget table td.today::before{border-bottom-color:#fff}.card.bg-gradient-gray-dark .bootstrap-datetimepicker-widget table td.active,.card.bg-gradient-gray-dark .bootstrap-datetimepicker-widget table td.active:hover,.card.bg-gray-dark .bootstrap-datetimepicker-widget table td.active,.card.bg-gray-dark .  background-color: #343a40;\n  border-color: #343a40;\n  color: #fff;\n}\n\n.dark-mode .accent-gray-dark .page-item.disabled a,\n.dark-mode .accent-gray-dark .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.dark-mode .accent-gray-dark [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.dark-mode .accent-gray-dark [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.dark-mode .accent-gray-dark [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.dark-mode .accent-gray-dark [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode .dark-mode.accent-gray-dark .page-item .page-link:hover, .dark-mode .dark-mode.accent-gray-dark .page-item .page-link:focus {\n  color: #3f474e;\n}\n\n.dark-mode .border-dark {\n  border-color: #4b545c !important;\n}\n\n/*# sourceMappingURL=adminlte.css.map */","// Hover mixin and `$enable-hover-media-query` are deprecated.\n//\n// Originally added during our alphas and maintained during betas, this mixin was\n// designed to prevent `:hover` stickiness on iOS-an issue where hover styles\n// would persist after initial touch.\n//\n// For backward compatibility, we've kept these mixins and updated them to\n// always return their regular pseudo-classes instead of a shimmed media query.\n//\n// Issue: https://github.com/twbs/bootstrap/issues/25195\n\n@mixin hover() {\n  &:hover { @content; }\n}\n\n@mixin hover-focus() {\n  &:hover,\n  &:focus {\n    @content;\n  }\n}\n\n@mixin plain-hover-focus() {\n  &,\n  &:hover,\n  &:focus {\n    @content;\n  }\n}\n\n@mixin hover-focus-active() {\n  &:hover,\n  &:focus,\n  &:active {\n    @content;\n  }\n}\n","// stylelint-disable selector-list-comma-newline-after\n\n//\n// Headings\n//\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  margin-bottom: $headings-margin-bottom;\n  font-family: $headings-font-family;\n  font-weight: $headings-font-weight;\n  line-height: $headings-line-height;\n  color: $headings-color;\n}\n\nh1, .h1 { @include font-size($h1-font-size); }\nh2, .h2 { @include font-size($h2-font-size); }\nh3, .h3 { @include font-size($h3-font-size); }\nh4, .h4 { @include font-size($h4-font-size); }\nh5, .h5 { @include font-size($h5-font-size); }\nh6, .h6 { @include font-size($h6-font-size); }\n\n.lead {\n  @include font-size($lead-font-size);\n  font-weight: $lead-font-weight;\n}\n\n// Type display classes\n.display-1 {\n  @include font-size($display1-size);\n  font-weight: $display1-weight;\n  line-height: $display-line-height;\n}\n.display-2 {\n  @include font-size($display2-size);\n  font-weight: $display2-weight;\n  line-height: $display-line-height;\n}\n.display-3 {\n  @include font-size($display3-size);\n  font-weight: $display3-weight;\n  line-height: $display-line-height;\n}\n.display-4 {\n  @include font-size($display4-size);\n  font-weight: $display4-weight;\n  line-height: $display-line-height;\n}\n\n\n//\n// Horizontal rules\n//\n\nhr {\n  margin-top: $hr-margin-y;\n  margin-bottom: $hr-margin-y;\n  border: 0;\n  border-top: $hr-border-width solid $hr-border-color;\n}\n\n\n//\n// Emphasis\n//\n\nsmall,\n.small {\n  @include font-size($small-font-size);\n  font-weight: $font-weight-normal;\n}\n\nmark,\n.mark {\n  padding: $mark-padding;\n  background-color: $mark-bg;\n}\n\n\n//\n// Lists\n//\n\n.list-unstyled {\n  @include list-unstyled();\n}\n\n// Inline turns list items into inline-block\n.list-inline {\n  @include list-unstyled();\n}\n.list-inline-item {\n  display: inline-block;\n\n  &:not(:last-child) {\n    margin-right: $list-inline-padding;\n  }\n}\n\n\n//\n// Misc\n//\n\n// Builds on `abbr`\n.initialism {\n  @include font-size(90%);\n  text-transform: uppercase;\n}\n\n// Blockquotes\n.blockquote {\n  margin-bottom: $spacer;\n  @include font-size($blockquote-font-size);\n}\n\n.blockquote-footer {\n  display: block;\n  @include font-size($blockquote-small-font-size);\n  color: $blockquote-small-color;\n\n  &::before {\n    content: \"\\2014\\00A0\"; // em dash, nbsp\n  }\n}\n","// Lists\n\n// Unstyled keeps list items block level, just removes default browser padding and list-style\n@mixin list-unstyled() {\n  padding-left: 0;\n  list-style: none;\n}\n","// Responsive images (ensure images don't scale beyond their parents)\n//\n// This is purposefully opt-in via an explicit class rather than being the default for all `<img>`s.\n// We previously tried the \"images are responsive by default\" approach in Bootstrap v2,\n// and abandoned it in Bootstrap v3 because it breaks lots of third-party widgets (including Google Maps)\n// which weren't expecting the images within themselves to be involuntarily resized.\n// See also https://github.com/twbs/bootstrap/issues/18178\n.img-fluid {\n  @include img-fluid();\n}\n\n\n// Image thumbnails\n.img-thumbnail {\n  padding: $thumbnail-padding;\n  background-color: $thumbnail-bg;\n  border: $thumbnail-border-width solid $thumbnail-border-color;\n  @include border-radius($thumbnail-border-radius);\n  @include box-shadow($thumbnail-box-shadow);\n\n  // Keep them at most 100% wide\n  @include img-fluid();\n}\n\n//\n// Figures\n//\n\n.figure {\n  // Ensures the caption's text aligns with the image.\n  display: inline-block;\n}\n\n.figure-img {\n  margin-bottom: $spacer * .5;\n  line-height: 1;\n}\n\n.figure-caption {\n  @include font-size($figure-caption-font-size);\n  color: $figure-caption-color;\n}\n","// Image Mixins\n// - Responsive image\n// - Retina image\n\n\n// Responsive image\n//\n// Keep images from scaling beyond the width of their parents.\n\n@mixin img-fluid() {\n  // Part 1: Set a maximum relative to the parent\n  max-width: 100%;\n  // Part 2: Override the height to auto, otherwise images will be stretched\n  // when setting a width and height attribute on the img element.\n  height: auto;\n}\n\n\n// Retina image\n//\n// Short retina mixin for setting background-image and -size.\n\n@mixin img-retina($file-1x, $file-2x, $width-1x, $height-1x) {\n  background-image: url($file-1x);\n\n  // Autoprefixer takes care of adding -webkit-min-device-pixel-ratio and -o-min-device-pixel-ratio,\n  // but doesn't convert dppx=>dpi.\n  // There's no such thing as unprefixed min-device-pixel-ratio since it's nonstandard.\n  // Compatibility info: https://caniuse.com/css-media-resolution\n  @media only screen and (min-resolution: 192dpi), // IE9-11 don't support dppx\n    only screen and (min-resolution: 2dppx) { // Standardized\n    background-image: url($file-2x);\n    background-size: $width-1x $height-1x;\n  }\n  @include deprecate(\"`img-retina()`\", \"v4.3.0\", \"v5\");\n}\n","// stylelint-disable property-disallowed-list\n// Single side border-radius\n\n// Helper function to replace negative values with 0\n@function valid-radius($radius) {\n  $return: ();\n  @each $value in $radius {\n    @if type-of($value) == number {\n      $return: append($return, max($value, 0));\n    } @else {\n      $return: append($return, $value);\n    }\n  }\n  @return $return;\n}\n\n@mixin border-radius($radius: $border-radius, $fallback-border-radius: false) {\n  @if $enable-rounded {\n    border-radius: valid-radius($radius);\n  }\n  @else if $fallback-border-radius != false {\n    border-radius: $fallback-border-radius;\n  }\n}\n\n@mixin border-top-radius($radius) {\n  @if $enable-rounded {\n    border-top-left-radius: valid-radius($radius);\n    border-top-right-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-right-radius($radius) {\n  @if $enable-rounded {\n    border-top-right-radius: valid-radius($radius);\n    border-bottom-right-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-bottom-radius($radius) {\n  @if $enable-rounded {\n    border-bottom-right-radius: valid-radius($radius);\n    border-bottom-left-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-left-radius($radius) {\n  @if $enable-rounded {\n    border-top-left-radius: valid-radius($radius);\n    border-bottom-left-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-top-left-radius($radius) {\n  @if $enable-rounded {\n    border-top-left-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-top-right-radius($radius) {\n  @if $enable-rounded {\n    border-top-right-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-bottom-right-radius($radius) {\n  @if $enable-rounded {\n    border-bottom-right-radius: valid-radius($radius);\n  }\n}\n\n@mixin border-bottom-left-radius($radius) {\n  @if $enable-rounded {\n    border-bottom-left-radius: valid-radius($radius);\n  }\n}\n","@mixin box-shadow($shadow...) {\n  @if $enable-shadows {\n    $result: ();\n\n    @if (length($shadow) == 1) {\n      // We can pass `@include box-shadow(none);`\n      $result: $shadow;\n    } @else {\n      // Filter to avoid invalid properties for example `box-shadow: none, 1px 1px black;`\n      @for $i from 1 through length($shadow) {\n        @if nth($shadow, $i) != \"none\" {\n          $result: append($result, nth($shadow, $i), \"comma\");\n        }\n      }\n    }\n    @if (length($result) > 0) {\n      box-shadow: $result;\n    }\n  }\n}\n","// Inline code\ncode {\n  @include font-size($code-font-size);\n  color: $code-color;\n  word-wrap: break-word;\n\n  // Streamline the style when inside anchors to avoid broken underline and more\n  a > & {\n    color: inherit;\n  }\n}\n\n// User input typically entered via keyboard\nkbd {\n  padding: $kbd-padding-y $kbd-padding-x;\n  @include font-size($kbd-font-size);\n  color: $kbd-color;\n  background-color: $kbd-bg;\n  @include border-radius($border-radius-sm);\n  @include box-shadow($kbd-box-shadow);\n\n  kbd {\n    padding: 0;\n    @include font-size(100%);\n    font-weight: $nested-kbd-font-weight;\n    @include box-shadow(none);\n  }\n}\n\n// Blocks of code\npre {\n  display: block;\n  @include font-size($code-font-size);\n  color: $pre-color;\n\n  // Account for some code outputs that place code tags in pre tags\n  code {\n    @include font-size(inherit);\n    color: inherit;\n    word-break: normal;\n  }\n}\n\n// Enable scrollable blocks of code\n.pre-scrollable {\n  max-height: $pre-scrollable-max-height;\n  overflow-y: scroll;\n}\n","// Container widths\n//\n// Set the container width, and override it for fixed navbars in media queries.\n\n@if $enable-grid-classes {\n  // Single container class with breakpoint max-widths\n  .container,\n  // 100% wide container at all breakpoints\n  .container-fluid {\n    @include make-container();\n  }\n\n  // Responsive containers that are 100% wide until a breakpoint\n  @each $breakpoint, $container-max-width in $container-max-widths {\n    .container-#{$breakpoint} {\n      @extend .container-fluid;\n    }\n\n    @include media-breakpoint-up($breakpoint, $grid-breakpoints) {\n      %responsive-container-#{$breakpoint} {\n        max-width: $container-max-width;\n      }\n\n      // Extend each breakpoint which is smaller or equal to the current breakpoint\n      $extend-breakpoint: true;\n\n      @each $name, $width in $grid-breakpoints {\n        @if ($extend-breakpoint) {\n          .container#{breakpoint-infix($name, $grid-breakpoints)} {\n            @extend %responsive-container-#{$breakpoint};\n          }\n\n          // Once the current breakpoint is reached, stop extending\n          @if ($breakpoint == $name) {\n            $extend-breakpoint: false;\n          }\n        }\n      }\n    }\n  }\n}\n\n\n// Row\n//\n// Rows contain your columns.\n\n@if $enable-grid-classes {\n  .row {\n    @include make-row();\n  }\n\n  // Remove the negative margin from default .row, then the horizontal padding\n  // from all immediate children columns (to prevent runaway style inheritance).\n  .no-gutters {\n    margin-right: 0;\n    margin-left: 0;\n\n    > .col,\n    > [class*=\"col-\"] {\n      padding-right: 0;\n      padding-left: 0;\n    }\n  }\n}\n\n// Columns\n//\n// Common styles for small and large grid columns\n\n@if $enable-grid-classes {\n  @include make-grid-columns();\n}\n","/// Grid system\n//\n// Generate semantic grid columns with these mixins.\n\n@mixin make-container($gutter: $grid-gutter-width) {\n  width: 100%;\n  padding-right: $gutter * .5;\n  padding-left: $gutter * .5;\n  margin-right: auto;\n  margin-left: auto;\n}\n\n@mixin make-row($gutter: $grid-gutter-width) {\n  display: flex;\n  flex-wrap: wrap;\n  margin-right: -$gutter * .5;\n  margin-left: -$gutter * .5;\n}\n\n// For each breakpoint, define the maximum width of the container in a media query\n@mixin make-container-max-widths($max-widths: $container-max-widths, $breakpoints: $grid-breakpoints) {\n  @each $breakpoint, $container-max-width in $max-widths {\n    @include media-breakpoint-up($breakpoint, $breakpoints) {\n      max-width: $container-max-width;\n    }\n  }\n  @include deprecate(\"The `make-container-max-widths` mixin\", \"v4.5.2\", \"v5\");\n}\n\n@mixin make-col-ready($gutter: $grid-gutter-width) {\n  position: relative;\n  // Prevent columns from becoming too narrow when at smaller grid tiers by\n  // always setting `width: 100%;`. This works because we use `flex` values\n  // later on to override this initial width.\n  width: 100%;\n  padding-right: $gutter * .5;\n  padding-left: $gutter * .5;\n}\n\n@mixin make-col($size, $columns: $grid-columns) {\n  flex: 0 0 percentage(divide($size, $columns));\n  // Add a `max-width` to ensure content within each column does not blow out\n  // the width of the column. Applies to IE10+ and Firefox. Chrome and Safari\n  // do not appear to require this.\n  max-width: percentage(divide($size, $columns));\n}\n\n@mixin make-col-auto() {\n  flex: 0 0 auto;\n  width: auto;\n  max-width: 100%; // Reset earlier grid tiers\n}\n\n@mixin make-col-offset($size, $columns: $grid-columns) {\n  $num: divide($size, $columns);\n  margin-left: if($num == 0, 0, percentage($num));\n}\n\n// Row columns\n//\n// Specify on a parent element(e.g., .row) to force immediate children into NN\n// numberof columns. Supports wrapping to new lines, but does not do a Masonry\n// style grid.\n@mixin row-cols($count) {\n  > * {\n    flex: 0 0 divide(100%, $count);\n    max-width: divide(100%, $count);\n  }\n}\n","// Breakpoint viewport sizes and media queries.\n//\n// Breakpoints are defined as a map of (name: minimum width), order from small to large:\n//\n//    (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px)\n//\n// The map defined in the `$grid-breakpoints` global variable is used as the `$breakpoints` argument by default.\n\n// Name of the next breakpoint, or null for the last breakpoint.\n//\n//    >> breakpoint-next(sm)\n//    md\n//    >> breakpoint-next(sm, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px))\n//    md\n//    >> breakpoint-next(sm, $breakpoint-names: (xs sm md lg xl))\n//    md\n@function breakpoint-next($name, $breakpoints: $grid-breakpoints, $breakpoint-names: map-keys($breakpoints)) {\n  $n: index($breakpoint-names, $name);\n  @return if($n != null and $n < length($breakpoint-names), nth($breakpoint-names, $n + 1), null);\n}\n\n// Minimum breakpoint width. Null for the smallest (first) breakpoint.\n//\n//    >> breakpoint-min(sm, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px))\n//    576px\n@function breakpoint-min($name, $breakpoints: $grid-breakpoints) {\n  $min: map-get($breakpoints, $name);\n  @return if($min != 0, $min, null);\n}\n\n// Maximum breakpoint width. Null for the largest (last) breakpoint.\n// The maximum value is calculated as the minimum of the next one less 0.02px\n// to work around the limitations of `min-` and `max-` prefixes and viewports with fractional widths.\n// See https://www.w3.org/TR/mediaqueries-4/#mq-min-max\n// Uses 0.02px rather than 0.01px to work around a current rounding bug in Safari.\n// See https://bugs.webkit.org/show_bug.cgi?id=178261\n//\n//    >> breakpoint-max(sm, (xs: 0, sm: 576px, md: 768px, lg: 992px, xl: 1200px))\n//    767.98px\n@function breakpoint-max($name, $breakpoints: $grid-breakpoints) {\n  $next: breakpoint-next($name, $breakpoints);\n  @return if($next, breakpoint-min($next, $breakpoints) - .02, null);\n}\n\n// Retu