/*! Buttons for DataTables 2.2.2
 * ©2016-2022 SpryMedia Ltd - datatables.net/license
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


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

// Allow for jQuery slim
function _fadeIn(el, duration, fn) {
	if ($.fn.animate) {
		el
			.stop()
			.fadeIn( duration, fn );

	}
	else {
		el.css('display', 'block');

		if (fn) {
			fn.call(el);
		}
	}
}

function _fadeOut(el, duration, fn) {
	if ($.fn.animate) {
		el
			.stop()
			.fadeOut( duration, fn );
	}
	else {
		el.css('display', 'none');
		
		if (fn) {
			fn.call(el);
		}
	}
}

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// If not created with a `new` keyword then we return a wrapper function that
	// will take the settings object for a DT. This allows easy use of new instances
	// with the `layout` option - e.g. `topLeft: $.fn.dataTable.Buttons( ... )`.
	if ( !(this instanceof Buttons) ) {
		return function (settings) {
			return new Buttons( settings, dt ).container();
		};
	}

	// If there is no config set it to an empty object
	if ( typeof( config ) === 'undefined' ) {
		config = {};	
	}
	
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( Array.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @param {boolean} [draw=true] Trigger a draw. Set a false when adding
	 *   lots of buttons, until the last button.
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx, draw )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton(
			buttons,
			config,
			config !== undefined ? config.split : undefined,
			(config === undefined || config.split === undefined || config.split.length === 0) && base !== undefined,
			false,
			idx
		);

		if (draw === undefined || draw === true) {
			this._draw();
		}
	
		return this;
	},

	/**
	 * Clear buttons from a collection and then insert new buttons
	 */
	collectionRebuild: function ( node, newButtons )
	{
		var button = this._nodeToButton( node );
		
		if(newButtons !== undefined) {
			var i;
			// Need to reverse the array
			for (i=button.buttons.length-1; i>=0; i--) {
				this.remove(button.buttons[i].node);
			}
	
			for (i=0; i<newButtons.length; i++) {
				var newBtn = newButtons[i];

				this._expandButton(
					button.buttons,
					newBtn,
					newBtn !== undefined && newBtn.config !== undefined && newBtn.config.split !== undefined,
					true,
					newBtn.parentConf !== undefined && newBtn.parentConf.split !== undefined,
					i,
					newBtn.parentConf
				);
			}
		}

		this._draw(button.collection, button.buttons);
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node)
			.addClass( this.c.dom.button.disabled )
			.attr('disabled', true);

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node)
			.removeClass( this.c.dom.button.disabled )
			.removeAttr('disabled');

		return this;
	},

	/**
	 * Get a button's index
	 * 
	 * This is internally recursive
	 * @param {element} node Button to get the index of
	 * @return {string} Button index
	 */
	index: function ( node, nested, buttons )
	{
		if ( ! nested ) {
			nested = '';
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var inner = buttons[i].buttons;

			if (buttons[i].node === node) {
				return nested + i;
			}

			if ( inner && inner.length ) {
				var match = this.index(node, i + '-', inner);

				if (match !== null) {
					return match;
				}
			}
		}

		return null;
	},


	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node of the buttons container if no button is given
	 * @param  {node} [node] Button node
	 * @return {jQuery} Button element, or container
	 */
	node: function ( node )
	{
		if ( ! node ) {
			return this.dom.container;
		}

		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Set / get a processing class on the selected button
	 * @param {element} node Triggering button node
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	processing: function ( node, flag )
	{
		var dt = this.s.dt;
		var button = this._nodeToButton( node );

		if ( flag === undefined ) {
			return $(button.node).hasClass( 'processing' );
		}

		$(button.node).toggleClass( 'processing', flag );

		$(dt.table().node()).triggerHandler( 'buttons-processing.dt', [
			flag, dt.button( node ), dt, $(node), button.conf
		] );

		return this;
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		button.conf.destroying = true;

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode
				.children( linerTag )
				.eq(0)
				.filter(':not(.dt-down-arrow)')
				.html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function ( e, settings ) {
			if ( settings === dtSettings ) {
				that.destroy();
			}
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );
			container.append( ' ' );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, split, inCollection, inSplit, attachPoint, parentConf )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var isSplit = false;
		var buttons = ! Array.isArray( button ) ?
			[ button ] :
			button;
		
		if(button === undefined ) {
			buttons = !Array.isArray(split) ?
				[ split ] :
				split;
		}

		if (button !== undefined && button.split !== undefined) {
			isSplit = true;
		}
			
		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			if( conf.config !== undefined && conf.config.split) {
				isSplit = true;
			}
			else {
				isSplit = false;
			}
			
			// If the configuration is an array, then expand the buttons at this
			// point
			if ( Array.isArray( conf ) ) {
				this._expandButton( attachTo, conf, built !== undefined && built.conf !== undefined ? built.conf.split : undefined, inCollection, parentConf !== undefined && parentConf.split !== undefined, attachPoint, parentConf );
				continue;
			}

			var built = this._buildButton( conf, inCollection, conf.split !== undefined || (conf.config !== undefined && conf.config.split !== undefined), inSplit );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined && attachPoint !== null ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			
			if ( built.conf.buttons || built.conf.split ) {
				built.collection = $('<'+(isSplit ? this.c.dom.splitCollection.tag : this.c.dom.collection.tag)+'/>');

				built.conf._collection = built.collection;

				if(built.conf.split) {
					for(var j = 0; j < built.conf.split.length; j++) {
						if(typeof built.conf.split[j] === "object") {
							built.conf.split[j].parent = parentConf;
							if(built.conf.split[j].collectionLayout === undefined) {
								built.conf.split[j].collectionLayout = built.conf.collectionLayout;
							}
							if(built.conf.split[j].dropup === undefined) {
								built.conf.split[j].dropup = built.conf.dropup;
							}
							if(built.conf.split[j].fade === undefined) {
								built.conf.split[j].fade = built.conf.fade;
							}
						}
					}
				}
				else {
					$(built.node).append($('<span class="dt-down-arrow">'+this.c.dom.splitDropdown.text+'</span>'))
				}

				this._expandButton( built.buttons, built.conf.buttons, built.conf.split, !isSplit, isSplit, attachPoint, built.conf );
			}
			built.conf.parent = parentConf;

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection, isSplit, inSplit )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var splitDom = this.c.dom.split;
		var splitCollectionDom = this.c.dom.sp){var a=this.s.colOpts;a=void 0!==a.options?a.options:null!==this.customPaneSettings&&void 0!==this.customPaneSettings.options?this.customPaneSettings.options:void 0;if(void 0!==a){var b=this.s.dt.rows({search:"applied"}).data().toArray(),
c=this.s.dt.rows({search:"applied"}),e=this.s.dt.rows().data().toArray(),d=this.s.dt.rows(),f=[];this.s.dtPane.clear();for(var g=0;g<a.length;g++){var k=a[g],p=""!==k.label?k.label:this.emptyMessage(),m=k.className,x=p,z="function"===typeof k.value?k.value:[],y=0,w=p,u=0;if("function"===typeof k.value){for(var B=0;B<b.length;B++)k.value.call(this.s.dt,b[B],c[0][B])&&y++;for(B=0;B<e.length;B++)k.value.call(this.s.dt,e[B],d[0][B])&&u++;"function"!==typeof z&&z.push(k.filter)}(!this.c.cascadePanes||
this.c.cascadePanes&&0!==y)&&f.push(this.addRow(x,z,y,u,w,p,m))}return f}};h.prototype._getOptions=function(){var a=this.s.dt.settings()[0].aoColumns[this.s.index].searchPanes,b=l.extend(!0,{},h.defaults,{collapse:null,emptyMessage:!1,initCollapsed:null,orthogonal:{threshold:null},threshold:null},a);void 0!==a&&void 0!==a.hideCount&&void 0===a.viewCount&&(b.viewCount=!a.hideCount);return b};h.prototype._makeSelection=function(){this.updateTable();this.s.updating=!0;this.s.dt.draw();this.s.updating=
!1};h.prototype._populatePane=function(a){void 0===a&&(a=!1);var b=this.s.dt;this.s.rowData.arrayFilter=[];this.s.rowData.bins={};var c=this.s.dt.settings()[0];if(!this.s.dt.page.info().serverSide){var e=0;for(a=(!this.c.cascadePanes&&!this.c.viewTotal||this.s.clearing||a?b.rows().indexes():b.rows({search:"applied"}).indexes()).toArray();e<a.length;e++)this._populatePaneArray(a[e],this.s.rowData.arrayFilter,c)}};h.prototype._populatePaneArray=function(a,b,c,e){void 0===e&&(e=this.s.rowData.bins);
var d=this.s.colOpts;if("string"===typeof d.orthogonal)c=c.oApi._fnGetCellData(c,a,this.s.index,d.orthogonal),this.s.rowData.filterMap.set(a,c),this._addOption(c,c,c,c,b,e);else{var f=c.oApi._fnGetCellData(c,a,this.s.index,d.orthogonal.search);null===f&&(f="");"string"===typeof f&&(f=f.replace(/<[^>]*>/g,""));this.s.rowData.filterMap.set(a,f);e[f]?e[f]++:(e[f]=1,this._addOption(f,c.oApi._fnGetCellData(c,a,this.s.index,d.orthogonal.display),c.oApi._fnGetCellData(c,a,this.s.index,d.orthogonal.sort),
c.oApi._fnGetCellData(c,a,this.s.index,d.orthogonal.type),b,e));this.s.rowData.totalOptions++}};h.prototype._reloadSelect=function(a){if(void 0!==a){for(var b,c=0;c<a.searchPanes.panes.length;c++)if(a.searchPanes.panes[c].id===this.s.index){b=c;break}if(void 0!==b){c=this.s.dtPane;var e=c.rows({order:"index"}).data().map(function(g){return null!==g.filter?g.filter.toString():null}).toArray(),d=0;for(a=a.searchPanes.panes[b].selected;d<a.length;d++){b=a[d];var f=-1;null!==b&&(f=e.indexOf(b.toString()));
-1<f&&(this.s.serverSelecting=!0,c.row(f).select(),this.s.serverSelecting=!1)}}}};h.prototype._search=function(a,b){for(var c=this.s.colOpts,e=this.s.dt,d=0,f=this.selections;d<f.length;d++){var g=f[d];"string"===typeof g.filter&&"string"===typeof a&&(g.filter=g.filter.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"'));if(Array.isArray(a)){if(a.includes(g.filter))return!0}else if("function"===typeof g.filter)if(g.filter.call(e,e.row(b).data(),b)){if("or"===c.combiner)return!0}else{if("and"===
c.combiner)return!1}else if(a===g.filter||("string"!==typeof a||0!==a.length)&&a==g.filter||null===g.filter&&"string"===typeof a&&""===a)return!0}return"and"===c.combiner?!0:!1};h.prototype._searchContSetup=function(){this.c.controls&&this.s.colOpts.controls&&this.dom.searchButton.appendTo(this.dom.searchLabelCont);!1===this.c.dtOpts.searching||!1===this.s.colOpts.dtOpts.searching||null!==this.customPaneSettings&&void 0!==this.customPaneSettings.dtOpts&&void 0!==this.customPaneSettings.dtOpts.searching&&
!this.customPaneSettings.dtOpts.searching||this.dom.searchLabelCont.appendTo(this.dom.searchCont)};h.prototype._searchExtras=function(){var a=this.s.updating;this.s.updating=!0;var b=this.s.dtPane.rows({selected:!0}).data().pluck("filter").toArray(),c=b.indexOf(this.emptyMessage()),e=l(this.s.dtPane.table().container());-1<c&&(b[c]="");0<b.length?e.addClass(this.classes.selected):0===b.length&&e.removeClass(this.classes.selected);this.s.updating=a};h.prototype._uniqueRatio=function(a,b){return 0<
b&&(0<this.s.rowData.totalOptions&&!this.s.dt.page.info().serverSide||this.s.dt.page.info().serverSide&&0<this.s.tableLength)?a/this.s.rowData.totalOptions:1};h.prototype._updateCommon=function(a){void 0===a&&(a=!1);if(!(this.s.dt.page.info().serverSide||void 0===this.s.dtPane||this.s.filteringActive&&!this.c.cascadePanes&&!0!==a||!0===this.c.cascadePanes&&!0===this.s.selectPresent||this.s.lastSelect&&this.s.lastCascade)){a=this.s.colOpts;var b=this.s.dtPane.rows({selected:!0}).data().toArray(),c=
this.s.rowData;this.s.dtPane.clear();if(this.colExists){0===c.arrayFilter.length?this._populatePane(!this.s.filteringActive):this.c.cascadePanes&&this.s.dt.rows().data().toArray().length===this.s.dt.rows({search:"applied"}).data().toArray().length?(c.arrayFilter=c.arrayOriginal,c.bins=c.binsOriginal):(this.c.viewTotal||this.c.cascadePanes)&&this._populatePane(!this.s.filteringActive);this.c.viewTotal?this._detailsPane():c.binsTotal=c.bins;this.c.viewTotal&&!this.c.cascadePanes&&(c.arrayFilter=c.arrayTotals);
for(var e=function(k){if(k&&(void 0!==c.bins[k.filter]&&0!==c.bins[k.filter]&&d.c.cascadePanes||!d.c.cascadePanes||d.s.clearing)){var p=d.addRow(k.display,k.filter,d.c.viewTotal?void 0!==c.bins[k.filter]?c.bins[k.filter]:0:c.bins[k.filter],d.c.viewTotal?String(c.binsTotal[k.filter]):c.bins[k.filter],k.sort,k.type),m=b.findIndex(function(x){return x.filter===k.filter});-1!==m&&(p.select(),b.splice(m,1))}},d=this,f=0,g=c.arrayFilter;f<g.length;f++)e(g[f])}if(void 0!==a.searchPanes&&void 0!==a.searchPanes.options||
void 0!==a.options||null!==this.customPaneSettings&&void 0!==this.customPaneSettings.options)for(e=function(k){var p=b.findIndex(function(m){if(m.display===k.data().display)return!0});-1!==p&&(k.select(),b.splice(p,1))},f=0,g=this._getComparisonRows();f<g.length;f++)a=g[f],e(a);for(e=0;e<b.length;e++)a=b[e],a=this.addRow(a.display,a.filter,0,this.c.viewTotal?a.total:0,a.display,a.display),this.s.updating=!0,a.select(),this.s.updating=!1;this.s.dtPane.draw();this.s.dtPane.table().node().parentNode.scrollTop=
this.s.scrollTop}};h.version="1.3.0";h.classes={bordered:"dtsp-bordered",buttonGroup:"dtsp-buttonGroup",buttonSub:"dtsp-buttonSub",clear:"dtsp-clear",clearAll:"dtsp-clearAll",clearButton:"clearButton",collapseAll:"dtsp-collapseAll",collapseButton:"dtsp-collapseButton",container:"dtsp-searchPane",countButton:"dtsp-countButton",disabledButton:"dtsp-disabledButton",hidden:"dtsp-hidden",hide:"dtsp-hide",layout:"dtsp-",name:"dtsp-name",nameButton:"dtsp-nameButton",nameCont:"dtsp-nameCont",narrow:"dtsp-narrow",
paneButton:"dtsp-paneButton",paneInputButton:"dtsp-paneInputButton",pill:"dtsp-pill",rotated:"dtsp-rotated",search:"dtsp-search",searchCont:"dtsp-searchCont",searchIcon:"dtsp-searchIcon",searchLabelCont:"dtsp-searchButtonCont",selected:"dtsp-selected",smallGap:"dtsp-smallGap",subRow1:"dtsp-subRow1",subRow2:"dtsp-subRow2",subRowsContainer:"dtsp-subRowsContainer",title:"dtsp-title",topRow:"dtsp-topRow"};h.defaults={cascadePanes:!1,clear:!0,collapse:!0,combiner:"or",container:function(a){return a.table().container()},
controls:!0,dtOpts:{},emptyMessage:null,hideCount:!1,i18n:{clearPane:"&times;",count:"{total}",countFiltered:"{shown} ({total})",emptyMessage:"<em>No data</em>"},initCollapsed:!1,layout:"auto",name:void 0,orderable:!0,orthogonal:{display:"display",filter:"filter",hideCount:!1,search:"filter",show:void 0,sort:"sort",threshold:.6,type:"type",viewCount:!0},preSelect:[],threshold:.6,viewCount:!0,viewTotal:!1};return h}(),v,A,F=function(){function h(a,b,c){var e=this;void 0===c&&(c=!1);this.regenerating=
!1;if(!A||!A.versionCheck||!A.versionCheck("1.10.0"))throw Error("SearchPane requires DataTables 1.10 or newer");if(!A.select)throw Error("SearchPane requires Select");var d=new A.Api(a);this.classes=v.extend(!0,{},h.classes);this.c=v.extend(!0,{},h.defaults,b);this.dom={clearAll:v('<button type="button">Clear All</button>').addClass(this.classes.clearAll),collapseAll:v('<button type="button">Collapse All</button>').addClass(this.classes.collapseAll),container:v("<div/>").addClass(this.classes.panes).text(d.i18n("searchPanes.loadMessage",
this.c.i18n.loadMessage)),emptyMessage:v("<div/>").addClass(this.classes.emptyMessage),options:v("<div/>").addClass(this.classes.container),panes:v("<div/>").addClass(this.classes.container),showAll:v('<button type="button">Show All</button>').addClass(this.classes.showAll).addClass(this.classes.disabledButton).attr("disabled","true"),title:v("<div/>").addClass(this.classes.title),titleRow:v("<div/>").addClass(this.classes.titleRow),wrapper:v("<div/>")};this.s={colOpts:[],dt:d,filterCount:0,filterPane:-1,
page:0,paging:!1,panes:[],selectionList:[],serverData:{},stateRead:!1,updating:!1};if(void 0===d.settings()[0]._searchPanes){this._getState();if(this.s.dt.page.info().serverSide)d.on("preXhr.dt",function(f,g,k){void 0===k.searchPanes&&(k.searchPanes={});void 0===k.searchPanes_null&&(k.searchPanes_null={});f=0;for(g=e.s.selectionList;f<g.length;f++){var p=g[f],m=e.s.dt.column(p.index).dataSrc();void 0===k.searchPanes[m]&&(k.searchPanes[m]={});void 0===k.searchPanes_null[m]&&(k.searchPanes_null[m]=
{});for(var x=0;x<p.rows.length;x++)k.searchPanes[m][x]=p.rows[x].filter,null===k.searchPanes[m][x]&&(k.searchPanes_null[m][x]=!0)}});d.on("xhr",function(f,g,k,p){k&&k.searchPanes&&k.searchPanes.options&&(e.s.serverData=k,e.s.serverData.tableLength=k.recordsTotal,e._serverTotals())});d.settings()[0]._searchPanes=this;this.dom.clearAll.text(d.i18n("searchPanes.clearMessage",this.c.i18n.clearMessage));this.dom.collapseAll.text(d.i18n("searchPanes.collapseMessage",this.c.i18n.collapseMessage));this.dom.showAll.text(d.i18n("searchPanes.showMessage",
this.c.i18n.showMessage));if(this.s.dt.settings()[0]._bInitComplete||c)this._paneDeclare(d,a,b);else d.one("preInit.dt",function(f){e._paneDeclare(d,a,b)});return this}}h.prototype.clearSelections=function(){this.dom.container.find("."+this.classes.search.replace(/\s+/g,".")).each(function(){v(this).val("");v(this).trigger("input")});var a=[];this.s.selectionList=[];for(var b=0,c=this.s.panes;b<c.length;b++){var e=c[b];void 0!==e.s.dtPane&&a.push(e.clearPane())}return a};h.prototype.getNode=function(){return this.dom.container};
h.prototype.rebuild=function(a,b){void 0===a&&(a=!1);void 0===b&&(b=!1);this.dom.emptyMessage.remove();var c=[];!1===a&&this.dom.panes.empty();for(var e=0,d=this.s.panes;e<d.length;e++){var f=d[e];if(!1===a||f.s.index===a)f.clearData(),c.push(f.rebuildPane(void 0!==this.s.selectionList[this.s.selectionList.length-1]?f.s.index===this.s.selectionList[this.s.selectionList.length-1].index:!1,this.s.dt.page.info().serverSide?this.s.serverData:void 0,null,b)),this.dom.panes.append(f.dom.container)}this.c.cascadePanes||
this.c.viewTotal?this.redrawPanes(!0):this._updateSelection();this._updateFilterCount();this._attachPaneContainer();this.s.dt.draw(!b);this.resizePanes();return 1===c.length?c[0]:c};h.prototype.redrawPanes=function(a){void 0===a&&(a=!1);var b=this.s.dt;if(!this.s.updating&&!this.s.dt.page.info().serverSide){for(var c=!0,e=this.s.filterPane,d=null,f=0,g=this.s.panes;f<g.length;f++){var k=g[f];void 0!==k.s.dtPane&&(d+=k.s.dtPane.rows({selected:!0}).data().toArray().length)}if(0===d&&b.rows({search:"applied"}).data().toArray().length===
b.rows().data().toArray().length)c=!1;else if(this.c.viewTotal){b=0;for(f=this.s.panes;b<f.length;b++)if(k=f[b],void 0!==k.s.dtPane){g=k.s.dtPane.rows({selected:!0}).data().toArray().length;if(0===g)for(var p=0,m=this.s.selectionList;p<m.length;p++){var x=m[p];x.index===k.s.index&&0!==x.rows.length&&(g=x.rows.length)}0<g&&-1===e?e=k.s.index:0<g&&(e=null)}0===d&&(e=null)}f=void 0;b=[];if(this.regenerating)for(f=-1,1===b.length&&null!==d&&0!==d&&(f=b[0].index),a=0,b=this.s.panes;a<b.length;a++){if(k=
b[a],void 0!==k.s.dtPane){g=!0;k.s.filteringActive=!0;if(-1!==e&&null!==e&&e===k.s.index||!1===c||k.s.index===f)g=!1,k.s.filteringActive=!1;k.updatePane(g?c:g)}}else{g=0;for(p=this.s.panes;g<p.length;g++)if(k=p[g],k.s.selectPresent){this.s.selectionList.push({index:k.s.index,protect:!1,rows:k.s.dtPane.rows({selected:!0}).data().toArray()});break}else k.s.deselect&&(f=k.s.index,m=k.s.dtPane.rows({selected:!0}).data().toArray(),0<m.length&&this.s.selectionList.push({index:k.s.index,protect:!0,rows:m}));
if(0<this.s.selectionList.length)for(g=this.s.selectionList[this.s.selectionList.length-1].index,p=0,m=this.s.panes;p<m.length;p++)k=m[p],k.s.lastSelect=k.s.index===g;for(k=0;k<this.s.selectionList.length;k++)if(this.s.selectionList[k].index!==f||!0===this.s.selectionList[k].protect){g=!1;for(p=k+1;p<this.s.selectionList.length;p++)this.s.selectionList[p].index===this.s.selectionList[k].index&&(g=!0);g||(b.push(this.s.selectionList[k]),this.s.selectionList[k].protect=!1)}f=-1;1===b.length&&null!==
d&&0!==d&&(f=b[0].index);p=0;for(m=this.s.panes;p<m.length;p++)if(k=m[p],void 0!==k.s.dtPane){g=!0;k.s.filteringActive=!0;if(-1!==e&&null!==e&&e===k.s.index||!1===c||k.s.index===f)g=!1,k.s.filteringActive=!1;k.updatePane(g?c:!1)}if(0<b.length&&(b.length<this.s.selectionList.length||a))for(this._cascadeRegen(b,d),g=b[b.length-1].index,e=0,a=this.s.panes;e<a.length;e++)k=a[e],k.s.lastSelect=k.s.index===g;else if(0<b.length)for(k=0,a=this.s.panes;k<a.length;k++)if(b=a[k],void 0!==b.s.dtPane){g=!0;b.s.filteringActive=
!0;if(-1!==e&&null!==e&&e===b.s.index||!1===c||b.s.index===f)g=!1,b.s.filteringActive=!1;b.updatePane(g?c:g)}}this._updateFilterCount();c&&0!==d||(this.s.selectionList=[])}};h.prototype.resizePanes=function(){if("auto"===this.c.layout){var a=v(this.s.dt.searchPanes.container()).width(),b=Math.floor(a/260);a=1;for(var c=0,e=[],d=0,f=this.s.panes;d<f.length;d++){var g=f[d];g.s.displayed&&e.push(g.s.index)}g=e.length;if(b===g)a=b;else for(;1<b;b--)if(d=g%b,0===d){a=b;c=0;break}else d>c&&(a=b,c=d);e=
0!==c?e.slice(e.length-c,e.length):[];b=0;for(d=this.s.panes;b<d.length;b++)g=d[b],g.s.displayed&&(f="columns-"+(e.includes(g.s.index)?c:a),g.resize(f))}else for(a=0,c=this.s.panes;a<c.length;a++)g=c[a],g.adjustTopRow();return this};h.prototype._attach=function(){var a=this;this.dom.container.removeClass(this.classes.hide);this.dom.titleRow.removeClass(this.classes.hide);this.dom.titleRow.remove();this.dom.title.appendTo(this.dom.titleRow);this.c.clear&&(this.dom.clearAll.appendTo(this.dom.titleRow),
this.dom.clearAll.on("click.dtsps",function(){a.clearSelections()}));this.c.collapse&&this._setCollapseListener();this.dom.titleRow.appendTo(this.dom.container);for(var b=0,c=this.s.panes;b<c.length;b++)c[b].dom.container.appendTo(this.dom.panes);this.dom.panes.appendTo(this.dom.container);0===v("div."+this.classes.container).length&&this.dom.container.prependTo(this.s.dt);return this.dom.container};h.prototype._attachExtras=function(){this.dom.container.removeClass(this.classes.hide);this.dom.titleRow.removeClass(this.classes.hide);
this.dom.titleRow.remove();this.dom.title.appendTo(this.dom.titleRow);this.c.clear&&this.dom.clearAll.appendTo(this.dom.titleRow);this.c.collapse&&(this.dom.showAll.appendTo(this.dom.titleRow),this.dom.collapseAll.appendTo(this.dom.titleRow));this.dom.titleRow.appendTo(this.dom.container);return this.dom.container};h.prototype._attachMessage=function(){try{var a=this.s.dt.i18n("searchPanes.emptyPanes",this.c.i18n.emptyPanes)}catch(b){a=null}if(null===a)this.dom.container.addClass(this.classes.hide),
this.dom.titleRow.removeClass(this.classes.hide);else return this.dom.container.removeClass(this.classes.hide),this.dom.titleRow.addClass(this.classes.hide),this.dom.emptyMessage.text(a),this.dom.emptyMessage.appendTo(this.dom.container),this.dom.container};h.prototype._attachPaneContainer=function(){for(var a=0,b=this.s.panes;a<b.length;a++)if(!0===b[a].s.displayed)return this._attach();return this._attachMessage()};h.prototype._cascadeRegen=function(a,b){this.regenerating=!0;var c=-1;1===a.length&&
null!==b&&0!==b&&(c=a[0].index);for(var e=0,d=this.s.panes;e<d.length;e++)b=d[e],b.setCascadeRegen(!0),b.setClear(!0),(void 0!==b.s.dtPane&&b.s.index===c||void 0!==b.s.dtPane)&&b.clearPane(),b.setg-icon-es-ca.flag-icon-squared{background-image:url(../flags/1x1/es-ca.svg)}.flag-icon-es-ga{background-image:url(../flags/4x3/es-ga.svg)}.flag-icon-es-ga.flag-icon-squared{background-image:url(../flags/1x1/es-ga.svg)}.flag-icon-eu{background-image:url(../flags/4x3/eu.svg)}.flag-icon-eu.flag-icon-squared{background-image:url(../flags/1x1/eu.svg)}.flag-icon-gb-eng{background-image:url(../flags/4x3/gb-eng.svg)}.flag-icon-gb-eng.flag-icon-squared{background-image:url(../flags/1x1/gb-eng.svg)}.flag-icon-gb-nir{background-image:url(../flags/4x3/gb-nir.svg)}.flag-icon-gb-nir.flag-icon-squared{background-image:url(../flags/1x1/gb-nir.svg)}.flag-icon-gb-sct{background-image:url(../flags/4x3/gb-sct.svg)}.flag-icon-gb-sct.flag-icon-squared{background-image:url(../flags/1x1/gb-sct.svg)}.flag-icon-gb-wls{background-image:url(../flags/4x3/gb-wls.svg)}.flag-icon-gb-wls.flag-icon-squared{background-image:url(../flags/1x1/gb-wls.svg)}.flag-icon-un{background-image:url(../flags/4x3/un.svg)}.flag-icon-un.flag-icon-squared{background-image:url(../flags/1x1/un.svg)}.flag-icon-xk{background-image:url(../flags/4x3/xk.svg)}.flag-icon-xk.flag-icon-squared{background-image:url(../flags/1x1/xk.svg)}
                                                                                                                                                                                                                                                                                                                                                       U��j�h���d�    P��L  SVW��v�3�P�E�d�    ���}܀} �E�  �E �  u�w�6n���E ;�t�E�} u
�( u2����ψ]��E� �*�r����M��+��  Q��N�PPW�� �\�/������ۋ]t
jR���s����<  ��<  �s�S$�UЋ��   �H���   ��H;�|��  �H��  ����B��P�X�����(  �MЋD�H�{ �E�t�C;Ct��蒀���S�s��u��<  �   ��  �H��  ;����   �H���   u���T�<�uǆ<      �H��,   t/��,  I�E�    ������(  EM�;�}
jR���r����<  ��<  �sj�jP�N�ẺC������N\�EԋFX��H�A�E���k���uԋM�9�u������EċL����   k��   |H�E�+�q�@�E��k���M�9D�u�����EċL��I�E���{ �E�t�C ;Ct���&~���S �s��u��<  �   ��  �H��  ;����   �H���   u���T�<�uǆ<      �H��,   t/��,  I�E�    ������(  EM�;�}
jR����p����<  ��<  �sj�jP�N�E��C$�����N\�EԋFX��H�A�E��j���uԋM�9�u�����E̋L����   k��   |H�E�+�q�@�E��oj���M�9D�u�q����E̋L��I��C�����5���{ �E�t�C ;Ct����|���S �s��u��<  �   ��  �H��  ;����   �H���   u���T�<�uǆ<      �H��,   t/��,  I�E�    ������(  EM�;�}
jR���o����<  ��<  �sj�jP�N�E؉C$�p����N\�EԋFX��H�A�E��fi���uԋM�9�u�f����E��L����   k��   |H�E�+�q�@�E��,i���M�9D�u�.����E��L��I�B����D���Q����<����H����E�    �?�������h��;�u��\�����h��;���  �K;M��v  �~�C�E�f�E��E�E�{ �E�t9K t���I{���S �s��u��<  �   ��  �H��  ;����   �H���   u���T�<�uǆ<      �H��,   t/��,  I�E�    ������(  EM�;�}
jR����m����<  ��<  �s�S$�Uԋ��   �H���   ;�u��  �H��  ���R���C}����(  �Mԋ�Q�EԍM���j �     �����?�E��M�P����j�Wd�M�+�Q�������M܍�x���P�WX��x����yA���������]g����F    ���G�F��E��U�   ���E���h���P�*d�������E��g���E��E�    ��M��F�E��M��U�   ���E���h����E��E��U��������E؋E�Hu��h����xF ��f��9E�u������M�衯 �ȉE��c  ���������   �E��j P�����������M���W  �}܋ȉM��G,��t	�E�    �Q�O  ���E��űMčE�P�*h���
���E��=  �M܍U�������R�����Ej�Pd+���W�B����}܍�p���P�E���PX��p����ŋ�����R  ��p����"7���������]����F    ���G�F��E�U�   ���E�E�P��Y�������E���\���E��E�    ��M��F�E��M�U�   ���E�E��E��E�U��������E�EHu�M��*< �u\��9E�u�{����M��S� �ȉE�iY  ��������   �E��j P������I����M�0�?M  �ȋE܉M�@,��t	�E    �Q�  ���E�u��}���j�u���F���OP�E��GL��H�A�E��[���}��M9�u�ߵ���E�u�j�L��u�}���D  i�H    H�A�E��E�+�ωE �F���OP�E�GL��H�A�E�{[���}�M9�u�{����E�u�u��L��u�}��u؋�D  i�H    VSH�E �Q+9�M��A��D���P�zP������P�i4�����">���M������P�I$����������E���E��E��E�U��������E�EHu�M��~: �}܍���������E��   �u��j�u��E���NP�E�FL��H�A�E�Z���u�M9�u莴���E�u��U��u؋L�S��D  i�H    H�A+��D����PP��$���P�3������;���MP�I$����űMčE�P�\����E�W��\��
jR���]����<  ��<  ���  j�j�M艋�  Q�N������N\�E��FX��H�A�E��V���u��M9�u�ܰ���E�L����   k��   |H�E�+�q�@�E�V���M9D�u褰���E�L��I�0��������Q���7*���E�H�E�    赘�����^V��;�u�u�v�OV��;�u�   �3����E�������E�   �E�U��������E��E�Hu��������1���������E��]0���} �E�������  �E�ˈE��  �u�����+����r�؍M���h  P�5�����E�   ���r�9E���  �u��I �E�������E�������E�������E�������E�������E��~E��� ����E���$����E���(����Eĉ�,����Eȉ�0����Ẻ�4����EЉ�8����Eԉ�<����E؉�@����E܉�D����E���H����E�fօ�����L���j������E�蹀���E���X����E���\����E���`����E���d����E���h����E��~E���l����E���p����E���t����Eĉ�x����Eȉ�|����ẺE��EЉE��EԉE��E؉E��E܉E��E��E��E�fօP����E��E�;�����E��  ��T���;���   �������\
���} �E�t�E9�T���t�E �M�EP�EP�u������P�u��P����u�P�k������t;�����u4��X�������������XG�G�������XG�G���t;�����u4��X�������������XG�G�������XG�G��P����E� �E��w����T���;��������j�M��E�����M��N�r�9E�������ǋM�d�
�E�  �?�E�� G�E�E��YE�EE�E��X�;}�|�_^��[��]� ��[��]� ���������U��S��V�S��tZ�}u ��~�{ u
jR����Q����<  ��<  �u�j�jS�N�]��׻���NX�V\���EQ�B�E��K���u�M9�u�ͥ���E�L����   k��   |H+�q�[�K��9D�u螥���L��I�%���������O,���j �M�Í�p���Q�u�M�S�u��u�Q���P\�u�G,��p����u�Q�E�M��u�S�u�VQ���P\�} �E��\E�]��d  ;u��[  �������m:  Q���E�j �M��     �����M�Q���F��7��jP�н���E���P�VX�M���$���������J����F    ���G�F���E�U�   ���E�E�P�G�������E��uJ���E��E�    ��M�F�E��M�U�   ���E�E��E��E�U��������E�EHu�M���) �"J��9E�u�(����u��M��]���P��������P�N� �EP�������N  ��E��\ �E�E��U��������E�EHu�M��l) �������E� ����ËM�d�
;�u�����_+��E    �E�U��M�I�^� ��]� �������������U��j�h ��d�    P��8SVW��v�3�P�E�d�    �M�E�P����M��E�    ��������H��;�u�u��H��;��<  �]�~�Sf�E��U�u�}��E���y3�����   �H���   ��;�O����   �u�H���   ;4���   RjV���A3���OL�ЋGP���U�A�@�<��5H��9u�<����O��D  i�H    H�A+1�M��4pV�T!������H����uV�M��@!�����9G����to�s�j�s��2���Ћ�S�HL�@P��A�@�4��G��9u迡���N��D  i�H    P�C�J+�A�M�P�� ������G�������2ۋE��E�   �E��U��������E�E�Hu�M��
#���M��E��!���ËM�d�
jR����J����<  ��<  �sj�jW�N�{$说���NX�؋V\��Q�r�D��9�u诞���L����   k��   |H+9�q�<�~D��9D�u胞���L��E�P���������|���]�{ t�C ;Ct����V���S �s��u��<  �|��  �H��  ;����   �H���   u���N�<�uǆ<      �B��,   t)��,  I��3�����(  E�;�}
jR���I����<  ��<  �sj�jW�N�{$荳���NX�؋V\��Q�r�C��9�u荝���L����   k��   |H+9�q�<�\C��9D�u�a����L��I����������u�M�V�E�#���]��M��E�    ;K��  V�M��R������   �u���t�U�;U�t�M��U���U��u���u��<  �z��  ��  �@;ȋ��   ���   �@u���L�<�uǆ<      �@��,   t'��,  �    IHȋ�(  ;�}
jR���[H����<  ��<  �u��}����   ���   �@��H;�|��  ��  �@����G��P�W����(  �D�+E�����  �u���t�U�;U�t�M���U���U��u���u��<  �z��  ��  �@;ȋ��   ���   �@u���L�<�uǆ<      �@��,   t'��,  �    IHȋ�(  ;�}
jR���`G����<  ��<  �u�j�jW�N�}��A����NX�؋V\���I�t
�:A��9�u�@����D�k��   |���   H+9�4�y�A��9D�u�����L��I����u���������2  �} �(  �u���t�U�;U�t�M��T���U��u���u��<  �z��  ��  �@;ȋ��   ���   �@u���L�<�uǆ<      �@��,   t'��,  �    IHȋ�(  ;�}
jR���/F����<  ��<  �u�j�jW�N�}������NX�؋V\���I�t
�	@��9�u�����D�k��   |���   H+9�4�y��?��9D�u�����L��I�W���u�M�Q���	0���&  �u���t�U�;U�t�M��}S���U��u���u��<  �z��  ��  �@;ȋ��   ���   �@u���L�<�uǆ<      �@��,   t'��,  �    IHȋ�(  ;�}
jR���E����<  ��<  �u�j�jW�N�}������NX�؋V\���I�t
��>��9�u�����D�k��   |���   H+9�4�y�>��9D�u軘���L��I�/���u�M��uQ���~g���M���� /��  v� ���  j�M��:j���E���h  ;C�?����M�d�
�x  ��o�����8�i  ��  �]  ��Q  �Q  ��  r��O  �=  ��������0�.  �� ������  ������=�   �  �� ���=�  ��   �� ���=�   ��   �� ���=�  ��   ��  ��=�  ��   �� ��=�  ��   ���������   �]Í�~������������H��$��H����)  w0t��#  w