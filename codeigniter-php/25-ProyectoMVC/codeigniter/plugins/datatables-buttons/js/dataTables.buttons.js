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
�( u2����ψ]��E� �*�r����M��+��  Q��N�PPW�� �\�/������ۋ]t��t	�E9st�E �{ t�C ;Ct���d����S �s��u��<  �   ��  �H��  ;����   �H���   u���T�<�uǆ<      �H��,   t/��,  I�E�    ������(  EM�;�}�s$��R�p���
jR���s����<  ��<  �s�S$�UЋ��   �H���   ��H;�|��  �H��  ����B��P�X�����(  �MЋD�H�{ �E�t�C;Ct��蒀���S�s��u��<  �   ��  �H��  ;����   �H���   u���T�<�uǆ<      �H��,   t/��,  I�E�    ������(  EM�;�}�s��R�}o���
jR���r����<  ��<  �sj�jP�N�ẺC������N\�EԋFX��H�A�E���k���uԋM�9�u������EċL����   k��   |H�E�+�q�@�E��k���M�9D�u�����EċL��I�E���{ �E�t�C ;Ct���&~���S �s��u��<  �   ��  �H��  ;����   �H���   u���T�<�uǆ<      �H��,   t/��,  I�E�    ������(  EM�;�}�s$��R�An���
jR����p����<  ��<  �sj�jP�N�E��C$�����N\�EԋFX��H�A�E��j���uԋM�9�u�����E̋L����   k��   |H�E�+�q�@�E��oj���M�9D�u�q����E̋L��I��C�����5���{ �E�t�C ;Ct����|���S �s��u��<  �   ��  �H��  ;����   �H���   u���T�<�uǆ<      �H��,   t/��,  I�E�    ������(  EM�;�}�s$��R��l���
jR���o����<  ��<  �sj�jP�N�E؉C$�p����N\�EԋFX��H�A�E��fi���uԋM�9�u�f����E��L����   k��   |H�E�+�q�@�E��,i���M�9D�u�.����E��L��I�B����D���Q����<����H����E�    �?�������h��;�u��\�����h��;���  �K;M��v  �~�C�E�f�E��E�E�{ �E�t9K t���I{���S �s��u��<  �   ��  �H��  ;����   �H���   u���T�<�uǆ<      �H��,   t/��,  I�E�    ������(  EM�;�}�s$��R�dk���
jR����m����<  ��<  �s�S$�Uԋ��   �H���   ;�u��  �H��  ���R���C}����(  �Mԋ�Q�EԍM���j �     �����?�E��M�P����j�Wd�M�+�Q�������M܍�x���P�WX��x����yA���������]g����F    ���G�F��E��U�   ���E���h���P�*d�������E��g���E��E�    ��M��F�E��M��U�   ���E���h����E��E��U��������E؋E�Hu��h����xF ��f��9E�u������M�衯 �ȉE��c  ���������   �E��j P�����������M���W  �}܋ȉM��G,��t	�E�    �Q�O  ���E��űMčE�P�*h������� �\4��/��i  /����\  �E�;E���   �M�u�QjP����P���NP�E�E�FL��H�A�E��e���M�U9�u�����E�M�u��u؋L�S��D  i�H    H�E�+�Q��D����BP��$���P��>�����<J���MP���'���  �} ��   �M�u�QjP���PP���NP�E�E�FL��H�A�E�Ce���M�U9�u�C����E�M�u��u؋L�S��D  i�H    H�E�+�Q��D����BP��$���P�@>������F���MP���m&���  j�E�P�M��z����u������V�D���u��������E�蹈���G,�ΈE�������uP�������  �G,�ΈE�u�ڗ������   �G,�������E�u辗������   �u�u���j�u��4O���NP�E�E�FL��H�A�E�'d���M�U9�u�'����E�M�u��u؋L�S��D  i�H    H�E�+�Q��D����BP��$���P�$=�����C���MP���Q%���E������� �p���E���  �G,�ΈE�u���������  �G,�������E�u�ۖ���u�����  �u��j�u��QN���NP�E�E�FL��H�A�E�Dc���M�U9�u�D����E�M�u��u؋L�S��D  i�H    H�E�+�Q��D����BP��$���P�A<�����D���MP���n$������������E��	  ��ϋ������Pd;���  ��p���芳���( �M܋�����t+�E�P����j����+���W�����M܍�,���P�R  �-��U�R���E��j�Pd+���W�S����M܍�,���P�E�PX�o ��p�����p����~@f�E��2<���������b����F    ���G�F��E�U�   ���E�E�P��^�������E���a���E��E�    ��M��F�E��M�U�   ���E�E��E�	�E�U��������E�EHu�M��:A �a��9E�u苻���M��c� �ȉE�y^  ��������   �E��j P������Y����M�0�OR  �ȋE܉MԊ@,��t	�E    �Q�  ���E�u�}���j�u���K���OP�E�E�GL��H�A�E��`���}�M9�u�����E�u�j�L��u��}���D  i�H    H�A�E��E�+�ωE��K���OP�E��GL��H�A�E�`���}��M9�u舺���E�u��uԋL��u؋}��u��D  i�H    SVH�E��Q+9�M��A��D���P�zP������P�v9�����/C���M������P���!���������R���E��E��E�U��������E�EHu�M��? �}܋u�����������E���u��} ��  �űMčEP�hy������� �\4��/��`  /����S  �}� ��  �E�@;E���  j�E�P�M������u������V�*?���������E�苃���G,�ΈE�������uP�T�������  �G,�ΈE�u�l�������   �G,�������E�u�P�������   �u�u���j�u���I���NP�E�FL��H�A�E�^���u�M9�u輸���E�u��U��u؋L�S��D  i�H    H�A+��D����PP��$���P�7�����?���MP�I$�����E ������� ����E��  �G,�ΈE�u菑�����\  �G,�������E�u�s������@  �u�u���j�u���H���NP�E�FL��H�A�E��]���u�M9�u�߷���E�u��U��u؋L�S��D  i�H    H�A+��D����PP��$���P��6�����H=���MP�I$����������1
���E��=  �M܍U�������R�����Ej�Pd+���W�B����}܍�p���P�E���PX��p����ŋ�����R  ��p����"7���������]����F    ���G�F��E�U�   ���E�E�P��Y�������E���\���E��E�    ��M��F�E��M�U�   ���E�E��E��E�U��������E�EHu�M��*< �u\��9E�u�{����M��S� �ȉE�iY  ��������   �E��j P������I����M�0�?M  �ȋE܉M�@,��t	�E    �Q�  ���E�u��}���j�u���F���OP�E��GL��H�A�E��[���}��M9�u�ߵ���E�u�j�L��u�}���D  i�H    H�A�E��E�+�ωE �F���OP�E�GL��H�A�E�{[���}�M9�u�{����E�u�u��L��u�}��u؋�D  i�H    VSH�E �Q+9�M��A��D���P�zP������P�i4�����">���M������P�I$����������E���E��E��E�U��������E�EHu�M��~: �}܍���������E��   �u��j�u��E���NP�E�FL��H�A�E�Z���u�M9�u莴���E�u��U��u؋L�S��D  i�H    H�A+��D����PP��$���P�3������;���MP�I$����űMčE�P�\����E�W��\�����/�r/�����  �� ����E� �ǧ���]�?�M��E��s�Wd�M�+�V�� ���P�E�P�W`�} �2  �}� �(  �s�j�s�D������s�AL�IP��H�y�Y��9�u艳���L���D  i�H    H�C�Q+�BP����������   �s�j�s�&D������s�AL�IP��H�y�Y��9�u�!����L���D  i�H    H�C�Q+�BP��������u\�E�D���\M�(��Y@�@(��Y@�@(��Y@�@�@(�Y��@((��Y@,�@,�YH0�H0�� ����E������E��E��E�U��������E�EHu�M���7 ��D����E���������EʋM�d�    Y_^[��]� ������U��j�hj��d�    P��X  SVW��v�3�P�E�d�    �ى]�}��h  �E�    �E���G�G�G�G    �~ t�F ;Ft���ej���V �F$�v�E���u��<  �   ��  �H��  ;����   �H���   u���T�<�uǆ<      �H��,   t/��,  I�E    ������(  EM;�}�u���R�zZ���
jR���]����<  ��<  ���  j�j�M艋�  Q�N������N\�E��FX��H�A�E��V���u��M9�u�ܰ���E�L����   k��   |H�E�+�q�@�E�V���M9D�u褰���E�L��I�0��������Q���7*���E�H�E�    赘�����^V��;�u�u�v�OV��;�u�   �3����E�������E�   �E�U��������E��E�Hu��������1���������E��]0���} �E�������  �E�ˈE��  �u�����+����r�؍M���h  P�5�����E�   ���r�9E���  �u��I �E�������E�������E�������E�������E�������E��~E��� ����E���$����E���(����Eĉ�,����Eȉ�0����Ẻ�4����EЉ�8����Eԉ�<����E؉�@����E܉�D����E���H����E�fօ�����L���j������E�蹀���E���X����E���\����E���`����E���d����E���h����E��~E���l����E���p����E���t����Eĉ�x����Eȉ�|����ẺE��EЉE��EԉE��E؉E��E܉E��E��E��E�fօP����E��E�;�����E��  ��T���;���   �������\
���} �E�t�E9�T���t�E �M�EP�EP�u������P�u��P����u�P�k������t;�����u4��X�������������XG�G�������XG�G���t;�����u4��X�������������XG�G�������XG�G��P����E� �E��w����T���;��������j�M��E�����M��N�r�9E�������ǋM�d�    Y_^[��]� ���������������U��Q�M�E�Vj P�����u�Mj � �F$�EP������ �F(^��]��������������U���S��V�uW�{ t��~N�}  t�E��t�E �0���E$�ˉE���r��u���E� +��  ���j �E��E�j P�EP�  �EWɋ}�\������ �/�v%�u�E��P��   �W������\ ��E�\�/�v�u�E��P�������\ ��W�(��\�����/�v�Y4��������r��ȉE�+��E� �u �E�Vj j P�E�M�P���L  �}( � �G�E�Gt"��M�j�jV�uQ���Px�o �G�@�G_^[��]�$ U��j�u�u�  �E]� ���������U��E���  �]� �������������̋��  ����������U��EHtHtHu]ø   ]���������U����u��U�j �u�uR�Px�E��\E�E�E�E��\E�M�     �H�@�E�U�P�@    ��]� ��U���u�����3Ƀ����]� ���������U��EV��j �o �u��h  �o@��x  �o@ ���  �o@0���  �~@@fֆ�  �@H���  ����   �E    �E���  �E    �Eǆ�      ���  Ɔ�   ǆ�      ^]� �U���0�MW�����(��\M�S�]/��    �K  �%��/�V����u.ʟ��D{.̟��D{�,��Z��X����\�0��,��u���u.ʟ��D{.̟��D{	(��\��(��X��,�fn�[��\��M�\�/�r/���r�E  �?�}�E�Pu�  �~ �@f�E܉E�E�@�E�������~ �@f�E܉E�E�H�E�W3���~_�F��u�E�I �M��E�j j j P�E�P�J  ;}�u�u�E�
�E�  �?�E�� G�E�E��YE�EE�E��X�;}�|�_^��[��]� ��[��]� ���������U��S��V�S��tZ�}u ��~�{ u�C�KR�s�P�C    �4�K�G���C�KP�C��t�sj Q�j j j �K�PP�K�8G�����   ���   ��ti�}u"��~�~ u�Q�v���P�F    ^[]� ���F���F�NP���t�vj Q���PP����F��^[]� j j j ���PP���F��^[]� ���������U��j�h���d�    P���  SVW��v�3�P�E�d�    ���u�F+u�E�     �M�d�    Y_^[��]� ��L����!��������������h  P��p����,������E�    �PdP��p�����p���u�E���VP�����u���t�U�;�t���t��p����>_���U��u���u��<  �|��  �H��  ;����   �H���   u���N�<�uǆ<      �B��,   t)��,  I��3ۄ���(  E�;�}�u���R�bO���
jR����Q����<  ��<  �u�j�jS�N�]��׻���NX�V\���EQ�B�E��K���u�M9�u�ͥ���E�L����   k��   |H+�q�[�K��9D�u螥���L��I�%���������O,���j �M�Í�p���Q�u�M�S�u��u�Q���P\�u�G,��p����u�Q�E�M��u�S�u�VQ���P\�} �E��\E�]��d  ;u��[  �������m:  Q���E�j �M��     �����M�Q���F��7��jP�н���E���P�VX�M���$���������J����F    ���G�F���E�U�   ���E�E�P�G�������E��uJ���E��E�    ��M�F�E��M�U�   ���E�E��E��E�U��������E�EHu�M���) �"J��9E�u�(����u��M��]���P��������P�N� �EP�������N  ��E��\ �E�E��U��������E�EHu�M��l) �������E� ����ËM�d�    Y_^[��]� �������U��QV��~ u�F;F����t�M���4�} �U�Mu	;�����uW�~;�O�9VLV;�~
;�u�����_+��E    �E�U��M�I�^� ��]� �������������U��j�h ��d�    P��8SVW��v�3�P�E�d�    �M�E�P����M��E�    ��������H��;�u�u��H��;��<  �]�~�Sf�E��U�u�}��E���y3�����   �H���   ��;�O����   �u�H���   ;4���   RjV���A3���OL�ЋGP���U�A�@�<��5H��9u�<����O��D  i�H    H�A+1�M��4pV�T!������H����uV�M��@!�����9G����to�s�j�s��2���Ћ�S�HL�@P��A�@�4��G��9u迡���N��D  i�H    P�C�J+�A�M�P�� ������G�������2ۋE��E�   �E��U��������E�E�Hu�M��
#���M��E��!���ËM�d�    Y_^[��]�����������U��V���G��9�`  u������d  �u�u��t�u�u�V�P��^]� ������U��W����F��9�`  u�ؠ���u ��d  �u�u�u�u�u�u訮���E_]� V���F��9�`  u蛠����d  ^�?�����������������U��j�h(��d�    P��LV��v�3�P�E�d�    ��h  P�M��&������E�    �PdP�M��2j���F��9�`  u� �����d  �U�R�u��H�u�u��P�M�d�    Y^��]� ���U��j�hX��d�    P��\SVW��v�3�P�E�d�    �M��E��h  �E    �]��~ f�A�@�A�E���  ���i�����#  �{ t�C ;Ct���X���S �s��u��<  �|��  �H��  ;����   �H���   u���N�<�uǆ<      �B��,   t)��,  I��3�����(  E�;�}�s$��R�:H���
jR����J����<  ��<  �sj�jW�N�{$说���NX�؋V\��Q�r�D��9�u诞���L����   k��   |H+9�q�<�~D��9D�u胞���L��E�P���������|���]�{ t�C ;Ct����V���S �s��u��<  �|��  �H��  ;����   �H���   u���N�<�uǆ<      �B��,   t)��,  I��3�����(  E�;�}�s$��R�G���
jR���I����<  ��<  �sj�jW�N�{$荳���NX�؋V\��Q�r�C��9�u荝���L����   k��   |H+9�q�<�\C��9D�u�a����L��I����������u�M�V�E�#���]��M��E�    ;K��  V�M��R������   �u���t�U�;U�t�M��U���U��u���u��<  �z��  ��  �@;ȋ��   ���   �@u���L�<�uǆ<      �@��,   t'��,  �    IHȋ�(  ;�}�u���R��E���
jR���[H����<  ��<  �u��}����   ���   �@��H;�|��  ��  �@����G��P�W����(  �D�+E�����  �u���t�U�;U�t�M���U���U��u���u��<  �z��  ��  �@;ȋ��   ���   �@u���L�<�uǆ<      �@��,   t'��,  �    IHȋ�(  ;�}�u���R��D���
jR���`G����<  ��<  �u�j�jW�N�}��A����NX�؋V\���I�t
�:A��9�u�@����D�k��   |���   H+9�4�y�A��9D�u�����L��I����u���������2  �} �(  �u���t�U�;U�t�M��T���U��u���u��<  �z��  ��  �@;ȋ��   ���   �@u���L�<�uǆ<      �@��,   t'��,  �    IHȋ�(  ;�}�u���R�C���
jR���/F����<  ��<  �u�j�jW�N�}������NX�؋V\���I�t
�	@��9�u�����D�k��   |���   H+9�4�y��?��9D�u�����L��I�W���u�M�Q���	0���&  �u���t�U�;U�t�M��}S���U��u���u��<  �z��  ��  �@;ȋ��   ���   �@u���L�<�uǆ<      �@��,   t'��,  �    IHȋ�(  ;�}�u���R�sB���
jR���E����<  ��<  �u�j�jW�N�}������NX�؋V\���I�t
��>��9�u�����D�k��   |���   H+9�4�y�>��9D�u軘���L��I�/���u�M��uQ���~g���M���� /��  v� ���  j�M��:j���E���h  ;C�?����M�d�    Y_^[��]� ����U��j�h���d�    P��,SVW��v�3�P�E�d�    ���~E���E��}fփT  ��\  ��=����F    �G��G�F��E��U�   ���E�E�P��:��������`  �E�    ;�t?��M��U��������E�E�Hu���; ���G�F��E�U�   ���E�E��E������E�U��������E��E�Hu�M��� S�M�芬 �E�   �I �u��(=��;�u�EЋ@9E�|�E؋@9E���   �u��=��;�t��<��9E�u������M��0�EЋM�;H}�@�4���E؋H�E܍4���<��9u�͖���N�E���ԉ�E�B��Ph�u��<��;�t7�EȉE�U��������E��E�Hu�M��& �q<���E��E�    �2����EЋM�;H}	A�M������E؋M�;Hu�E�    ����A�M�������E��E������E�U��������E�E�Hu�M�� �M�d�    Y_^[��]� U��A�UV�uR���F    �F �PLW�� /�w(.����D{.�����D{��,�ȋƉN^]� �Z��X����\�0��,�ȋƉN^]� �������U��E�Q�P+��  �@ �]� ����U��E����  ����  ��t	���*  �M��   w��  ��Y�����Pwz���G��$��G���!  w!��  ������=�   wQ���G��$��G����"  �&  ��  ��%"  ��   ��  ��-!  ��  ����  ��
�x  ��o�����8�i  ��  �]  ��Q  �Q  ��  r��O  �=  ��������0�.  �� ������  ������=�   �  �� ���=�  ��   �� ���=�   ��   �� ���=�  ��   ��  ��=�  ��   �� ��=�  ��   ���������   �]Í�~������������H��$��H����)  w0t��#  wtu���"  �������4)  �������5)  vV�������+  �������+  s=�������������]ËM��"   w#t���   t��   v��   ���u�]Í�������v�  ��=�  v�2�]�dG��E�       �I dG��E�                   ��dG��E�    ��U��j�h���d�    P��,VW��v�3�P�E�d�    �M�E�P����M��E�    �y�����G7���};�u�u��87��;�t4�M�,����tW�M��o�����7����u>W�M��[�����t7����u*��V�g���P�1�������u�uV��������u3���   �E��E�   �E��U��������E�E�Hu�M��g���M��E������ƋM�d�    Y_^��]���������3�� ������������������������U���EV���p�t	V�(*������^]� ��������������U��Q�M�u�E�    ����   �E��]� ��������������U��j�hT��d�    P��   ��v�3ŉE�SVWP�E�d�    �}�u�E�    ��X���ǅd���    �5����G    �E�    ǅd���   葲��P�M���/���E��E�   P���3�����E� �M����Ť�����  h  �)������x����E�   ��t	�������3�P��\����E� ��������5����p���ǅt���    ���p����F��t�����l�����l����   ����h�����p����E�   ;�t[���l�����l������������x�����x���Hu���c����p������t����G���x�����x����  171a1d;\n  color: #fff;\n}\n\n.bg-gradient-gray-dark.btn:disabled, .bg-gradient-gray-dark.btn.disabled {\n  background-image: none !important;\n  border-color: #343a40;\n  color: #fff;\n}\n\n[class^=\"bg-\"].disabled {\n  opacity: .65;\n}\n\na.text-muted:hover {\n  color: #007bff !important;\n}\n\n.link-muted {\n  color: #5d6974;\n}\n\n.link-muted:hover, .link-muted:focus {\n  color: #464f58;\n}\n\n.link-black {\n  color: #6c757d;\n}\n\n.link-black:hover, .link-black:focus {\n  color: #e6e8ea;\n}\n\n.accent-primary .btn-link,\n.accent-primary a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-primary .nav-tabs .nav-link {\n  color: #007bff;\n}\n\n.accent-primary .btn-link:hover,\n.accent-primary a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-primary .nav-tabs .nav-link:hover {\n  color: #0056b3;\n}\n\n.accent-primary .dropdown-item:active, .accent-primary .dropdown-item.active {\n  background-color: #007bff;\n  color: #fff;\n}\n\n.accent-primary .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #007bff;\n  border-color: #004a99;\n}\n\n.accent-primary .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-primary .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-primary .custom-select:focus,\n.accent-primary .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-primary .custom-file-input:focus ~ .custom-file-label {\n  border-color: #80bdff;\n}\n\n.accent-primary .page-item .page-link {\n  color: #007bff;\n}\n\n.accent-primary .page-item.active a,\n.accent-primary .page-item.active .page-link {\n  background-color: #007bff;\n  border-color: #007bff;\n  color: #fff;\n}\n\n.accent-primary .page-item.disabled a,\n.accent-primary .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-primary [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-primary [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-primary [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-primary [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-primary .page-item .page-link:hover, .dark-mode.accent-primary .page-item .page-link:focus {\n  color: #1a88ff;\n}\n\n.accent-secondary .btn-link,\n.accent-secondary a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-secondary .nav-tabs .nav-link {\n  color: #6c757d;\n}\n\n.accent-secondary .btn-link:hover,\n.accent-secondary a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-secondary .nav-tabs .nav-link:hover {\n  color: #494f54;\n}\n\n.accent-secondary .dropdown-item:active, .accent-secondary .dropdown-item.active {\n  background-color: #6c757d;\n  color: #fff;\n}\n\n.accent-secondary .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #6c757d;\n  border-color: #3d4246;\n}\n\n.accent-secondary .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-secondary .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-secondary .custom-select:focus,\n.accent-secondary .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-secondary .custom-file-input:focus ~ .custom-file-label {\n  border-color: #afb5ba;\n}\n\n.accent-secondary .page-item .page-link {\n  color: #6c757d;\n}\n\n.accent-secondary .page-item.active a,\n.accent-secondary .page-item.active .page-link {\n  background-color: #6c757d;\n  border-color: #6c757d;\n  color: #fff;\n}\n\n.accent-secondary .page-item.disabled a,\n.accent-secondary .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-secondary [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-secondary [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-secondary [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-secondary [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-secondary .page-item .page-link:hover, .dark-mode.accent-secondary .page-item .page-link:focus {\n  color: #78828a;\n}\n\n.accent-success .btn-link,\n.accent-success a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-success .nav-tabs .nav-link {\n  color: #28a745;\n}\n\n.accent-success .btn-link:hover,\n.accent-success a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-success .nav-tabs .nav-link:hover {\n  color: #19692c;\n}\n\n.accent-success .dropdown-item:active, .accent-success .dropdown-item.active {\n  background-color: #28a745;\n  color: #fff;\n}\n\n.accent-success .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #28a745;\n  border-color: #145523;\n}\n\n.accent-success .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-success .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-success .custom-select:focus,\n.accent-success .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-success .custom-file-input:focus ~ .custom-file-label {\n  border-color: #71dd8a;\n}\n\n.accent-success .page-item .page-link {\n  color: #28a745;\n}\n\n.accent-success .page-item.active a,\n.accent-success .page-item.active .page-link {\n  background-color: #28a745;\n  border-color: #28a745;\n  color: #fff;\n}\n\n.accent-success .page-item.disabled a,\n.accent-success .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-success [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-success [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-success [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-success [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-success .page-item .page-link:hover, .dark-mode.accent-success .page-item .page-link:focus {\n  color: #2dbc4e;\n}\n\n.accent-info .btn-link,\n.accent-info a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-info .nav-tabs .nav-link {\n  color: #17a2b8;\n}\n\n.accent-info .btn-link:hover,\n.accent-info a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-info .nav-tabs .nav-link:hover {\n  color: #0f6674;\n}\n\n.accent-info .dropdown-item:active, .accent-info .dropdown-item.active {\n  background-color: #17a2b8;\n  color: #fff;\n}\n\n.accent-info .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #17a2b8;\n  border-color: #0c525d;\n}\n\n.accent-info .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-info .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-info .custom-select:focus,\n.accent-info .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-info .custom-file-input:focus ~ .custom-file-label {\n  border-color: #63d9ec;\n}\n\n.accent-info .page-item .page-link {\n  color: #17a2b8;\n}\n\n.accent-info .page-item.active a,\n.accent-info .page-item.active .page-link {\n  background-color: #17a2b8;\n  border-color: #17a2b8;\n  color: #fff;\n}\n\n.accent-info .page-item.disabled a,\n.accent-info .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-info [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-info [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-info [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-info [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-info .page-item .page-link:hover, .dark-mode.accent-info .page-item .page-link:focus {\n  color: #1ab6cf;\n}\n\n.accent-warning .btn-link,\n.accent-warning a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-warning .nav-tabs .nav-link {\n  color: #ffc107;\n}\n\n.accent-warning .btn-link:hover,\n.accent-warning a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-warning .nav-tabs .nav-link:hover {\n  color: #ba8b00;\n}\n\n.accent-warning .dropdown-item:active, .accent-warning .dropdown-item.active {\n  background-color: #ffc107;\n  color: #1f2d3d;\n}\n\n.accent-warning .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #ffc107;\n  border-color: #a07800;\n}\n\n.accent-warning .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%231f2d3d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-warning .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-warning .custom-select:focus,\n.accent-warning .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-warning .custom-file-input:focus ~ .custom-file-label {\n  border-color: #ffe187;\n}\n\n.accent-warning .page-item .page-link {\n  color: #ffc107;\n}\n\n.accent-warning .page-item.active a,\n.accent-warning .page-item.active .page-link {\n  background-color: #ffc107;\n  border-color: #ffc107;\n  color: #fff;\n}\n\n.accent-warning .page-item.disabled a,\n.accent-warning .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-warning [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-warning [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-warning [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-warning [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-warning .page-item .page-link:hover, .dark-mode.accent-warning .page-item .page-link:focus {\n  color: #ffc721;\n}\n\n.accent-danger .btn-link,\n.accent-danger a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-danger .nav-tabs .nav-link {\n  color: #dc3545;\n}\n\n.accent-danger .btn-link:hover,\n.accent-danger a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-danger .nav-tabs .nav-link:hover {\n  color: #a71d2a;\n}\n\n.accent-danger .dropdown-item:active, .accent-danger .dropdown-item.active {\n  background-color: #dc3545;\n  color: #fff;\n}\n\n.accent-danger .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #dc3545;\n  border-color: #921925;\n}\n\n.accent-danger .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-danger .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-danger .custom-select:focus,\n.accent-danger .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-danger .custom-file-input:focus ~ .custom-file-label {\n  border-color: #efa2a9;\n}\n\n.accent-danger .page-item .page-link {\n  color: #dc3545;\n}\n\n.accent-danger .page-item.active a,\n.accent-danger .page-item.active .page-link {\n  background-color: #dc3545;\n  border-color: #dc3545;\n  color: #fff;\n}\n\n.accent-danger .page-item.disabled a,\n.accent-danger .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-danger [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-danger [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-danger [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-danger [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-danger .page-item .page-link:hover, .dark-mode.accent-danger .page-item .page-link:focus {\n  color: #e04b59;\n}\n\n.accent-light .btn-link,\n.accent-light a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-light .nav-tabs .nav-link {\n  color: #f8f9fa;\n}\n\n.accent-light .btn-link:hover,\n.accent-light a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-light .nav-tabs .nav-link:hover {\n  color: #cbd3da;\n}\n\n.accent-light .dropdown-item:active, .accent-light .dropdown-item.active {\n  background-color: #f8f9fa;\n  color: #1f2d3d;\n}\n\n.accent-light .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #f8f9fa;\n  border-color: #bdc6d0;\n}\n\n.accent-light .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%231f2d3d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-light .form-control:focus:not(.is-invalid):not(.carousel-control-next {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 15%;\n  padding: 0;\n  color: #fff;\n  text-align: center;\n  background: none;\n  border: 0;\n  opacity: 0.5;\n  transition: opacity 0.15s ease;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .carousel-control-prev,\n  .carousel-control-next {\n    transition: none;\n  }\n}\n\n.carousel-control-prev:hover, .carousel-control-prev:focus,\n.carousel-control-next:hover,\n.carousel-control-next:focus {\n  color: #fff;\n  text-decoration: none;\n  outline: 0;\n  opacity: 0.9;\n}\n\n.carousel-control-prev {\n  left: 0;\n}\n\n.carousel-control-next {\n  right: 0;\n}\n\n.carousel-control-prev-icon,\n.carousel-control-next-icon {\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  background: 50% / 100% 100% no-repeat;\n}\n\n.carousel-control-prev-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E\");\n}\n\n.carousel-control-next-icon {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E\");\n}\n\n.carousel-indicators {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 15;\n  display: flex;\n  justify-content: center;\n  padding-left: 0;\n  margin-right: 15%;\n  margin-left: 15%;\n  list-style: none;\n}\n\n.carousel-indicators li {\n  box-sizing: content-box;\n  flex: 0 1 auto;\n  width: 30px;\n  height: 3px;\n  margin-right: 3px;\n  margin-left: 3px;\n  text-indent: -999px;\n  cursor: pointer;\n  background-color: #fff;\n  background-clip: padding-box;\n  border-top: 10px solid transparent;\n  border-bottom: 10px solid transparent;\n  opacity: .5;\n  transition: opacity 0.6s ease;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .carousel-indicators li {\n    transition: none;\n  }\n}\n\n.carousel-indicators .active {\n  opacity: 1;\n}\n\n.carousel-caption {\n  position: absolute;\n  right: 15%;\n  bottom: 20px;\n  left: 15%;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center;\n}\n\n@keyframes spinner-border {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.spinner-border {\n  display: inline-block;\n  width: 2rem;\n  height: 2rem;\n  vertical-align: -0.125em;\n  border: 0.25em solid currentColor;\n  border-right-color: transparent;\n  border-radius: 50%;\n  animation: .75s linear infinite spinner-border;\n}\n\n.spinner-border-sm {\n  width: 1rem;\n  height: 1rem;\n  border-width: 0.2em;\n}\n\n@keyframes spinner-grow {\n  0% {\n    transform: scale(0);\n  }\n  50% {\n    opacity: 1;\n    transform: none;\n  }\n}\n\n.spinner-grow {\n  display: inline-block;\n  width: 2rem;\n  height: 2rem;\n  vertical-align: -0.125em;\n  background-color: currentColor;\n  border-radius: 50%;\n  opacity: 0;\n  animation: .75s linear infinite spinner-grow;\n}\n\n.spinner-grow-sm {\n  width: 1rem;\n  height: 1rem;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .spinner-border,\n  .spinner-grow {\n    animation-duration: 1.5s;\n  }\n}\n\n.align-baseline {\n  vertical-align: baseline !important;\n}\n\n.align-top {\n  vertical-align: top !important;\n}\n\n.align-middle {\n  vertical-align: middle !important;\n}\n\n.align-bottom {\n  vertical-align: bottom !important;\n}\n\n.align-text-bottom {\n  vertical-align: text-bottom !important;\n}\n\n.align-text-top {\n  vertical-align: text-top !important;\n}\n\n.bg-primary {\n  background-color: #007bff !important;\n}\n\na.bg-primary:hover, a.bg-primary:focus,\nbutton.bg-primary:hover,\nbutton.bg-primary:focus {\n  background-color: #0062cc !important;\n}\n\n.bg-secondary {\n  background-color: #6c757d !important;\n}\n\na.bg-secondary:hover, a.bg-secondary:focus,\nbutton.bg-secondary:hover,\nbutton.bg-secondary:focus {\n  background-color: #545b62 !important;\n}\n\n.bg-success {\n  background-color: #28a745 !important;\n}\n\na.bg-success:hover, a.bg-success:focus,\nbutton.bg-success:hover,\nbutton.bg-success:focus {\n  background-color: #1e7e34 !important;\n}\n\n.bg-info {\n  background-color: #17a2b8 !important;\n}\n\na.bg-info:hover, a.bg-info:focus,\nbutton.bg-info:hover,\nbutton.bg-info:focus {\n  background-color: #117a8b !important;\n}\n\n.bg-warning {\n  background-color: #ffc107 !important;\n}\n\na.bg-warning:hover, a.bg-warning:focus,\nbutton.bg-warning:hover,\nbutton.bg-warning:focus {\n  background-color: #d39e00 !important;\n}\n\n.bg-danger {\n  background-color: #dc3545 !important;\n}\n\na.bg-danger:hover, a.bg-danger:focus,\nbutton.bg-danger:hover,\nbutton.bg-danger:focus {\n  background-color: #bd2130 !important;\n}\n\n.bg-light {\n  background-color: #f8f9fa !important;\n}\n\na.bg-light:hover, a.bg-light:focus,\nbutton.bg-light:hover,\nbutton.bg-light:focus {\n  background-color: #dae0e5 !important;\n}\n\n.bg-dark {\n  background-color: #343a40 !important;\n}\n\na.bg-dark:hover, a.bg-dark:focus,\nbutton.bg-dark:hover,\nbutton.bg-dark:focus {\n  background-color: #1d2124 !important;\n}\n\n.bg-white {\n  background-color: #fff !important;\n}\n\n.bg-transparent {\n  background-color: transparent !important;\n}\n\n.border {\n  border: 1px solid #dee2e6 !important;\n}\n\n.border-top {\n  border-top: 1px solid #dee2e6 !important;\n}\n\n.border-right {\n  border-right: 1px solid #dee2e6 !important;\n}\n\n.border-bottom {\n  border-bottom: 1px solid #dee2e6 !important;\n}\n\n.border-left {\n  border-left: 1px solid #dee2e6 !important;\n}\n\n.border-0 {\n  border: 0 !important;\n}\n\n.border-top-0 {\n  border-top: 0 !important;\n}\n\n.border-right-0 {\n  border-right: 0 !important;\n}\n\n.border-bottom-0 {\n  border-bottom: 0 !important;\n}\n\n.border-left-0 {\n  border-left: 0 !important;\n}\n\n.border-primary {\n  border-color: #007bff !important;\n}\n\n.border-secondary {\n  border-color: #6c757d !important;\n}\n\n.border-success {\n  border-color: #28a745 !important;\n}\n\n.border-info {\n  border-color: #17a2b8 !important;\n}\n\n.border-warning {\n  border-color: #ffc107 !important;\n}\n\n.border-danger {\n  border-color: #dc3545 !important;\n}\n\n.border-light {\n  border-color: #f8f9fa !important;\n}\n\n.border-dark {\n  border-color: #343a40 !important;\n}\n\n.border-white {\n  border-color: #fff !important;\n}\n\n.rounded-sm {\n  border-radius: 0.2rem !important;\n}\n\n.rounded {\n  border-radius: 0.25rem !important;\n}\n\n.rounded-top {\n  border-top-left-radius: 0.25rem !important;\n  border-top-right-radius: 0.25rem !important;\n}\n\n.rounded-right {\n  border-top-right-radius: 0.25rem !important;\n  border-bottom-right-radius: 0.25rem !important;\n}\n\n.rounded-bottom {\n  border-bottom-right-radius: 0.25rem !important;\n  border-bottom-left-radius: 0.25rem !important;\n}\n\n.rounded-left {\n  border-top-left-radius: 0.25rem !important;\n  border-bottom-left-radius: 0.25rem !important;\n}\n\n.rounded-lg {\n  border-radius: 0.3rem !important;\n}\n\n.rounded-circle {\n  border-radius: 50% !important;\n}\n\n.rounded-pill {\n  border-radius: 50rem !important;\n}\n\n.rounded-0 {\n  border-radius: 0 !important;\n}\n\n.clearfix::after {\n  display: block;\n  clear: both;\n  content: \"\";\n}\n\n.d-none {\n  display: none !important;\n}\n\n.d-inline {\n  display: inline !important;\n}\n\n.d-inline-block {\n  display: inline-block !important;\n}\n\n.d-block {\n  display: block !important;\n}\n\n.d-table {\n  display: table !important;\n}\n\n.d-table-row {\n  display: table-row !important;\n}\n\n.d-table-cell {\n  display: table-cell !important;\n}\n\n.d-flex {\n  display: flex !important;\n}\n\n.d-inline-flex {\n  display: inline-flex !important;\n}\n\n@media (min-width: 576px) {\n  .d-sm-none {\n    display: none !important;\n  }\n  .d-sm-inline {\n    display: inline !important;\n  }\n  .d-sm-inline-block {\n    display: inline-block !important;\n  }\n  .d-sm-block {\n    display: block !important;\n  }\n  .d-sm-table {\n    display: table !important;\n  }\n  .d-sm-table-row {\n    display: table-row !important;\n  }\n  .d-sm-table-cell {\n    display: table-cell !important;\n  }\n  .d-sm-flex {\n    display: flex !important;\n  }\n  .d-sm-inline-flex {\n    display: inline-flex !important;\n  }\n}\n\n@media (min-width: 768px) {\n  .d-md-none {\n    display: none !important;\n  }\n  .d-md-inline {\n    display: inline !important;\n  }\n  .d-md-inline-block {\n    display: inline-block !important;\n  }\n  .d-md-block {\n    display: block !important;\n  }\n  .d-md-table {\n    display: table !important;\n  }\n  .d-md-table-row {\n    display: table-row !important;\n  }\n  .d-md-table-cell {\n    display: table-cell !important;\n  }\n  .d-md-flex {\n    display: flex !important;\n  }\n  .d-md-inline-flex {\n    display: inline-flex !important;\n  }\n}\n\n@media (min-width: 992px) {\n  .d-lg-none {\n    display: none !important;\n  }\n  .d-lg-inline {\n    display: inline !important;\n  }\n  .d-lg-inline-block {\n    display: inline-block !important;\n  }\n  .d-lg-block {\n    display: block !important;\n  }\n  .d-lg-table {\n    display: table !important;\n  }\n  .d-lg-table-row {\n    display: table-row !important;\n  }\n  .d-lg-table-cell {\n    display: table-cell !important;\n  }\n  .d-lg-flex {\n    display: flex !important;\n  }\n  .d-lg-inline-flex {\n    display: inline-flex !important;\n  }\n}\n\n@media (min-width: 1200px) {\n  .d-xl-none {\n    display: none !important;\n  }\n  .d-xl-inline {\n    display: inline !important;\n  }\n  .d-xl-inline-block {\n    display: inline-block !important;\n  }\n  .d-xl-block {\n    display: block !important;\n  }\n  .d-xl-table {\n    display: table !important;\n  }\n  .d-xl-table-row {\n    display: table-row !important;\n  }\n  .d-xl-table-cell {\n    display: table-cell !important;\n  }\n  .d-xl-flex {\n    display: flex !important;\n  }\n  .d-xl-inline-flex {\n    display: inline-flex !important;\n  }\n}\n\n@media print {\n  .d-print-none {\n    display: none !important;\n  }\n  .d-print-inline {\n    display: inline !important;\n  }\n  .d-print-inline-block {\n    display: inline-block !important;\n  }\n  .d-print-block {\n    display: block !important;\n  }\n  .d-print-table {\n    display: table !important;\n  }\n  .d-print-table-row {\n    display: table-row !important;\n  }\n  .d-print-table-cell {\n    display: table-cell !important;\n  }\n  .d-print-flex {\n    display: flex !important;\n  }\n  .d-print-inline-flex {\n    display: inline-flex !important;\n  }\n}\n\n.embed-responsive {\n  position: relative;\n  display: block;\n  width: 100%;\n  padding: 0;\n  overflow: hidden;\n}\n\n.embed-responsive::before {\n  display: block;\n  content: \"\";\n}\n\n.embed-responsive .embed-responsive-item,\n.embed-responsive iframe,\n.embed-responsive embed,\n.embed-responsive object,\n.embed-responsive video {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: 0;\n}\n\n.embed-responsive-21by9::before {\n  padding-top: 42.857143%;\n}\n\n.embed-responsive-16by9::before {\n  padding-top: 56.25%;\n}\n\n.embed-responsive-4by3::before {\n  padding-top: 75%;\n}\n\n.embed-responsive-1by1::before {\n  padding-top: 100%;\n}\n\n.flex-row {\n  flex-direction: row !important;\n}\n\n.flex-column {\n  flex-direction: column !important;\n}\n\n.flex-row-reverse {\n  flex-direction: row-reverse !important;\n}\n\n.flex-column-reverse {\n  flex-direction: column-reverse !important;\n}\n\n.flex-wrap {\n  flex-wrap: wrap !important;\n}\n\n.flex-nowrap {\n  flex-wrap: nowrap !important;\n}\n\n.flex-wrap-reverse {\n  flex-wrap: wrap-reverse !important;\n}\n\n.flex-fill {\n  flex: 1 1 auto !important;\n}\n\n.flex-grow-0 {\n  flex-grow: 0 !important;\n}\n\n.flex-grow-1 {\n  flex-grow: 1 !important;\n}\n\n.flex-shrink-0 {\n  flex-shrink: 0 !important;\n}\n\n.flex-shrink-1 {\n  flex-shrink: 1 !important;\n}\n\n.justify-content-start {\n  justify-content: flex-start !important;\n}\n\n.justify-content-end {\n  justify-content: flex-end !important;\n}\n\n.justify-content-center {\n  justify-content: center !important;\n}\n\n.justify-content-between {\n  justify-content: space-between !important;\n}\n\n.justify-content-around {\n  justify-content: space-around !important;\n}\n\n.align-items-start {\n  align-items: flex-start !important;\n}\n\n.align-items-end {\n  align-items: flex-end !important;\n}\n\n.align-items-center {\n  align-items: center !important;\n}\n\n.align-items-baseline {\n  align-items: baseline !important;\n}\n\n.align-items-stretch {\n  align-items: stretch !important;\n}\n\n.align-content-start {\n  align-content: flex-start !important;\n}\n\n.align-content-end {\n  align-content: flex-end !important;\n}\n\n.align-content-center {\n  align-content: center !important;\n}\n\n.align-content-between {\n  align-content: space-between !important;\n}\n\n.align-content-around {\n  align-content: space-around !important;\n}\n\n.align-content-stretch {\n  align-content: stretch !important;\n}\n\n.align-self-auto {\n  align-self: auto !important;\n}\n\n.align-self-start {\n  align-self: flex-start !important;\n}\n\n.align-self-end {\n  align-self: flex-end !important;\n}\n\n.align-self-center {\n  align-self: center !important;\n}\n\n.align-self-baseline {\n  align-self: baseline !important;\n}\n\n.align-self-stretch {\n  align-self: stretch !important;\n}\n\n@media (min-width: 576px) {\n  .flex-sm-row {\n    flex-direction: row !important;\n  }\n  .flex-sm-column {\n    flex-direction: column !important;\n  }\n  .flex-sm-row-reverse {\n    flex-direction: row-reverse !important;\n  }\n  .flex-sm-column-reverse {\n    flex-direction: column-reverse !important;\n  }\n  .flex-sm-wrap {\n    flex-wrap: wrap !important;\n  }\n  .flex-sm-nowrap {\n    flex-wrap: nowrap !important;\n  }\n  .flex-sm-wrap-reverse {\n    flex-wrap: wrap-reverse !important;\n  }\n  .flex-sm-fill {\n    flex: 1 1 auto !important;\n  }\n  .flex-sm-grow-0 {\n    flex-grow: 0 !important;\n  }\n  .flex-sm-grow-1 {\n    flex-grow: 1 !important;\n  }\n  .flex-sm-shrink-0 {\n    flex-shrink: 0 !important;\n  }\n  .flex-sm-shrink-1 {\n    flex-shrink: 1 !important;\n  }\n  .justify-content-sm-start {\n    justify-content: flex-start !important;\n  }\n  .justify-content-sm-end {\n    justify-content: flex-end !important;\n  }\n  .justify-content-sm-center {\n    justify-content: center !important;\n  }\n  .justify-content-sm-between {\n    justify-content: space-between !important;\n  }\n  .justify-content-sm-around {\n    justify-content: space-around !important;\n  }\n  .align-items-sm-start {\n    align-items: flex-start !important;\n  }\n  .align-items-sm-end {\n    align-items: flex-end !important;\n  }\n  .align-items-sm-center {\n    align-items: center !important;\n  }\n  .align-items-sm-baseline {\n    align-items: baseline !important;\n  }\n  .align-items-sm-stretch {\n    align-items: stretch !important;\n  }\n  .align-content-sm-start {\n    align-content: flex-start !important;\n  }\n  .align-content-sm-end {\n    align-content: flex-end !important;\n  }\n  .align-content-sm-center {\n    align-content: center !important;\n  }\n  .align-content-sm-between {\n    align-content: space-between !important;\n  }\n  .align-content-sm-around {\n    align-content: space-around !important;\n  }\n  .align-content-sm-stretch {\n    align-content: stretch !important;\n  }\n  .align-self-sm-auto {\n    align-self: auto !important;\n  }\n  .align-self-sm-start {\n    align-self: flex-start !important;\n  }\n  .align-self-sm-end {\n    align-self: flex-end !important;\n  }\n  .align-self-sm-center {\n    align-self: center !important;\n  }\n  .align-self-sm-baseline {\n    align-self: baseline !important;\n  }\n  .align-self-sm-stretch {\n    align-self: stretch !important;\n  }\n}\n\n@media (min-width: 768px) {\n  .flex-md-row {\n    flex-direction: row !important;\n  }\n  .flex-md-column {\n    flex-direction: column !important;\n  }\n  .flex-md-row-reverse {\n    flex-direction: row-reverse !important;\n  }\n  .flex-md-column-reverse {\n    flex-direction: column-reverse !important;\n  }\n  .flex-md-wrap {\n    flex-wrap: wra