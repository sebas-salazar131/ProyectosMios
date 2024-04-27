/*! RowReorder 1.2.8
 * 2015-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     RowReorder
 * @description Row reordering extension for DataTables
 * @version     1.2.8
 * @file        dataTables.rowReorder.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2015-2020 SpryMedia Ltd.
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
 * RowReorder provides the ability in DataTables to click and drag rows to
 * reorder them. When a row is dropped the data for the rows effected will be
 * updated to reflect the change. Normally this data point should also be the
 * column being sorted upon in the DataTable but this does not need to be the
 * case. RowReorder implements a "data swap" method - so the rows being
 * reordered take the value of the data point from the row that used to occupy
 * the row's new position.
 *
 * Initialisation is done by either:
 *
 * * `rowReorder` parameter in the DataTable initialisation object
 * * `new $.fn.dataTable.RowReorder( table, opts )` after DataTables
 *   initialisation.
 * 
 *  @class
 *  @param {object} settings DataTables settings object for the host table
 *  @param {object} [opts] Configuration options
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.7+
 */
var RowReorder = function ( dt, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw 'DataTables RowReorder requires DataTables 1.10.8 or newer';
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.rowReorder,
		RowReorder.defaults,
		opts
	);

	// Internal settings
	this.s = {
		/** @type {integer} Scroll body top cache */
		bodyTop: null,

		/** @type {DataTable.Api} DataTables' API instance */
		dt: new DataTable.Api( dt ),

		/** @type {function} Data fetch function */
		getDataFn: DataTable.ext.oApi._fnGetObjectDataFn( this.c.dataSrc ),

		/** @type {array} Pixel positions for row insertion calculation */
		middles: null,

		/** @type {Object} Cached dimension information for use in the mouse move event handler */
		scroll: {},

		/** @type {integer} Interval object used for smooth scrolling */
		scrollInterval: null,

		/** @type {function} Data set function */
		setDataFn: DataTable.ext.oApi._fnSetObjectDataFn( this.c.dataSrc ),

		/** @type {Object} Mouse down information */
		start: {
			top: 0,
			left: 0,
			offsetTop: 0,
			offsetLeft: 0,
			nodes: []
		},

		/** @type {integer} Window height cached value */
		windowHeight: 0,

		/** @type {integer} Document outer height cached value */
		documentOuterHeight: 0,

		/** @type {integer} DOM clone outer height cached value */
		domCloneOuterHeight: 0
	};

	// DOM items
	this.dom = {
		/** @type {jQuery} Cloned row being moved around */
		clone: null,

		/** @type {jQuery} DataTables scrolling container */
		dtScroll: $('div.dataTables_scrollBody', this.s.dt.table().container())
	};

	// Check if row reorder has already been initialised on this table
	var settings = this.s.dt.settings()[0];
	var exisiting = settings.rowreorder;

	if ( exisiting ) {
		return exisiting;
	}

	if ( !this.dom.dtScroll.length ) {
		this.dom.dtScroll = $(this.s.dt.table().container(), 'tbody')
	}

	settings.rowreorder = this;
	this._constructor();
};


$.extend( RowReorder.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the RowReorder instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var table = $( dt.table().node() );

		// Need to be able to calculate the row positions relative to the table
		if ( table.css('position') === 'static' ) {
			table.css( 'position', 'relative' );
		}

		// listen for mouse down on the target column - we have to implement
		// this rather than using HTML5 drag and drop as drag and drop doesn't
		// appear to work on table rows at this time. Also mobile browsers are
		// not supported.
		// Use `table().container()` rather than just the table node for IE8 -
		// otherwise it only works once...
		$(dt.table().container()).on( 'mousedown.rowReorder touchstart.rowReorder', this.c.selector, function (e) {
			if ( ! that.c.enable ) {
				return;
			}

			// Ignore excluded children of the selector
			if ( $(e.target).is(that.c.excludedChildren) ) {
				return true;
			}

			var tr = $(this).closest('tr');
			var row = dt.row( tr );

			// Double check that it is a DataTable row
			if ( row.any() ) {
				that._emitEvent( 'pre-row-reorder', {
					node: row.node(),
					index: row.index()
				} );

				that._mouseDown( e, tr );
				return false;
			}
		} );

		dt.on( 'destroy.rowReorder', function () {
			$(dt.table().container()).off( '.rowReorder' );
			dt.off( '.rowReorder' );
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */
	
	/**
	 * Cache the measurements that RowReorder needs in the mouse move handler
	 * to attempt to speed things up, rather than reading from the DOM.
	 *
	 * @private
	 */
	_cachePositions: function ()
	{
		var dt = this.s.dt;

		// Frustratingly, if we add `position:relative` to the tbody, the
		// position is still relatively to the parent. So we need to adjust
		// for that
		var headerHeight = $( dt.table().node() ).find('thead').outerHeight();

		// Need to pass the nodes through jQuery to get them in document order,
		// not what DataTables thinks it is, since we have been altering the
		// order
		var nodes = $.unique( dt.rows( { page: 'current' } ).nodes().toArray() );
		var middles = $.map( nodes, function ( node, i ) {
			var top = $(node).position().top - headerHeight;

			return (top + top + $(node).outerHeight() ) / 2;
		} );

		this.s.middles = middles;
		this.s.bodyTop = $( dt.table().body() ).offset().top;
		this.s.windowHeight = $(window).height();
		this.s.documentOuterHeight = $(document).outerHeight();
	},


	/**
	 * Clone a row so it can be floated around the screen
	 *
	 * @param  {jQuery} target Node to be cloned
	 * @private
	 */
	_clone: function ( target )
	{
		var dt = this.s.dt;
		var clone = $( dt.table().node().cloneNode(false) )
			.addClass( 'dt-rowReorder-float' )
			.append('<tbody/>')
			.append( target.clone( false ) );

		// Match the table and column widths - read all sizes before setting
		// to reduce reflows
		var tableWidth = target.outerWidth();
		var tableHeight = target.outerHeight();
		var sizes = target.children().map( function () {
			return $(this).width();
		} );

		clone
			.width( tableWidth )
			.height( tableHeight )
			.find('tr').children().each( function (i) {
				this.style.width = sizes[i]+'px';
			} );

		// Insert into the document to have it floating around
		clone.appendTo( 'body' );

		this.dom.clone = clone;
		this.s.domCloneOuterHeight = clone.outerHeight();
	},


	/**
	 * Update the cloned item's position in the document
	 *
	 * @param  {object} e Event giving the mouse's position
	 * @private
	 */
	_clonePosition: function ( e )
	{
		var start = this.s.start;
		var topDiff = this._eventToPage( e, 'Y' ) - start.top;
		var leftDiff = this._eventToPage( e, 'X' ) - start.left;
		var snap = this.c.snapX;
		var left;
		var top = topDiff + start.offsetTop;

		if ( snap === true ) {
			left = start.offsetLeft;
		}
		else if ( typeof snap === 'number' ) {
			left = start.offsetLeft + snap;
		}
		else {
			left = leftDiff + start.offsetLeft;
		}

		if(top < 0) {
			top = 0
		}
		else if(top + this.s.domCloneOuterHeight > this.s.documentOuterHeight) {
			top = this.s.documentOuterHeight - this.s.domCloneOuterHeight;
		}

		this.dom.clone.css( {
			top: top,
			left: left
		} );
	},


	/**
	 * Emit an event on the DataTable for listeners
	 *
	 * @param  {string} name Event name
	 * @param  {array} args Event arguments
	 * @private
	 */
	_emitEvent: function ( name, args )
	{
		this.s.dt.iterator( 'table', function ( ctx, i ) {
			$(ctx.nTable).triggerHandler( name+'.dt', args );
		} );
	},


	/**
	 * Get pageX/Y position from an event, regardless of if it is a mouse or
	 * touch event.
	 *
	 * @param  {object} e Event
	 * @param  {string} pos X or Y (must be a capital)
	 * @private
	 */
	_eventToPage: function ( e, pos )
	{
		if ( e.type.indexOf( 'touch' ) !== -1 ) {
			return e.originalEvent.touches[0][ 'page'+pos ];
		}

		return e[ 'page'+pos ];
	},


	/**
	 * Mouse down event handler. Read initial positions and add event handlers
	 * for the move.
	 *
	 * @param  {object} e      Mouse event
	 * @param  {jQuery} target TR element that is to be moved
	 * @private
	 */
	_mouseDown: function ( e, target )
	{
		var that = this;
		var dt = this.s.dt;
		var start = this.s.start;

		var offset = target.offset();
		start.top = this._eventToPage( e, 'Y' );
		start.left = this._eventToPage( e, 'X' );
		start.offsetTop = offset.top;
		start.offsetLeft = offset.left;
		start.nodes = $.unique( dt.rows( { page: 'current' } ).nodes().toArray() );

		this._cachePositions();
		this._clone( target );
		this._clonePosition( e );

		this.dom.target = target;
		target.addClass( 'dt-rowReorder-moving' );

		$( document )
			.on( 'mouseup.rowReorder touchend.rowReorder', function (e) {
				that._mouseUp(e);
			} )
			.on( 'mousemove.rowReorder touchmove.rowReorder', function (e) {
				that._mouseMove(e);
			} );

		// Check if window is x-scrolling - if not, disable it for the duration
		// of the drag
		if ( $(window).width() === $(document).width() ) {
			$(document.body).addClass( 'dt-rowReorder-noOverflow' );
		}

		// Cache scrolling information so mouse move doesn't need to read.
		// This assumes that the window and DT scroller will not change size
		// during an row drag, which I think is a fair assumption
		var scrollWrapper = this.dom.dtScroll;
		this.s.scroll = {
			windowHeight: $(window).height(),
			windowWidth:  $(window).width(),
			dtTop:        scrollWrapper.length ? scrollWrapper.offset().top : null,
			dtLeft:       scrollWrapper.length ? scrollWrapper.offset().left : null,
			dtHeight:     scrollWrapper.length ? scrollWrapper.outerHeight() : null,
			dtWidth:      scrollWrapper.length ? scrollWrapper.outerWidth() : null
		};
	},


	/**
	 * Mouse move event handler - move the cloned row and shuffle the table's
	 * rows if required.
	 *
	 * @param  {object} e Mouse event
	 * @private
	 */
	_mouseMove: function ( e )
	{
		this._clonePosition( e );

		// Transform the mouse position into a position in the table's body
		var bodyY = this._eventToPage( e, 'Y' ) - this.s.bodyTop;
		var middles = this.s.middles;
		var insertPoint = null;
		var dt = this.s.dt;

		// Determine where the row should be inserted based on the mouse
		// position
		for ( var i=0, ien=middles.length ; i<ien ; i++ ) {
			if ( bodyY < middles[i] ) {
				insertPoint = i;
				break;
			}
		}

		if ( insertPoint === null ) {
			insertPoint = middles.length;
		}

		// Perform the DOM shuffle if it has changed from last time
		if ( this.s.lastInsert === null || this.s.lastInsert !== insertPoint ) {
			var nodes = $.unique( dt.rows( { page: 'current' } ).nodes().toArray() );

			if ( insertPoint > this.s.lastInsert ) {
				this.dom.target.insertAfter( nodes[ insertPoint-1 ] );
			}
			else {
				this.dom.target.insertBefore( nodes[ insertPoint ] );
			}

			this._cachePositions();

			this.s.lastInsert = insertPoint;
		}

		this._shiftScroll( e );
	},


	/**
	 * Mouse up event handler - release the event handlers and perform the
	 * table updates
	 *
	 * @param  {object} e Mouse event
	 * @private
	 */
	_mouseUp: function ( e )
	{
		var that = this;
		var dt = this.s.dt;
		var i, ien;
		var dataSrc = this.c.dataSrc;

		this.dom.clone.remove();
		this.dom.clone = null;

		this.dom.target.removeClass( 'dt-rowReorder-moving' );
		//this.dom.target = null;

		$(document).off( '.rowReorder' );
		$(document.body).removeClass( 'dt-rowReorder-noOverflow' );

		clearInterval( this.s.scrollInterval );
		this.s.scrollInterval = null;

		// Calculate the difference
		var startNodes = this.s.start.nodes;
		var endNodes = $.unique( dt.rows( { page: 'current' } ).nodes().toArray() );
		var idDiff = {};
		var fullDiff = [];
		var diffNodes = [];
		var getDataFn = this.s.getDataFn;
		var setDataFn = this.s.setDataFn;

		for ( i=0, ien=startNodes.length ; i<ien ; i++ ) {
			if ( startNodes[i] !== endNodes[i] ) {
				var id = dt.row( endNodes[i] ).id();
				var endRowData = dt.row( endNodes[i] ).data();
				var startRowData = dt.row( startNodes[i] ).data();

				if ( id ) {
					idDiff[ id ] = getDataFn( startRowData );
				}

				fullDiff.push( {
					node: endNodes[i],
					oldData: getDataFn( endRowData ),
					newData: getDataFn( startRowData ),
					newPosition: i,
					oldPosition: $.inArray( endNodes[i], startNodes )
				} );

				diffNodes.push( endNodes[i] );
			}
		}
		
		// Create event args
		var eventArgs = [ fullDiff, {
			dataSrc:       dataSrc,
			nodes:         diffNodes,
			values:        idDiff,
			triggerRow:    dt.row( this.dom.target ),
			originalEvent: e
		} ];
		
		// Emit event
		this._emitEvent( 'row-reorder', eventArgs );

		var update = function () {
			if ( that.c.update ) {
				for ( i=0, ien=fullDiff.length ; i<ien ; i++ ) {
					var row = dt.row( fullDiff[i].node );
					var rowData = row.data();

					setDataFn( rowData, fullDiff[i].newData );

					// Invalidate the cell that has the same data source as the dataSrc
					dt.columns().every( function () {
						if ( this.dataSrc() === dataSrc ) {
							dt.cell( fullDiff[i].node, this.index() ).invalidate( 'data' );
						}
					} );
				}

				// Trigger row reordered event
				that._emitEvent( 'row-reordered', eventArgs );

				dt.draw( false );
			}
		};

		// Editor interface
		if ( this.c.editor ) {
			// Disable user interaction while Editor is submitting
			this.c.enable = false;

			this.c.editor
				.edit(
					diffNodes,
					false,
					$.extend( {submit: 'changed'}, this.c.formOptions )
				)
				.multiSet( dataSrc, idDiff )
				.one( 'preSubmitCancelled.rowReorder', function () {
					that.c.enable = true;
					that.c.editor.off( '.rowReorder' );
					dt.draw( false );
				} )
				.one( 'submitUnsuccessful.rowReorder', function () {
					dt.draw( false );
				} )
				.one( 'submitSuccess.rowReorder', function () {
					update();
				} )
				.one( 'submitComplete', function () {
					that.c.enable = true;
					that.c.editor.off( '.rowReorder' );
				} )
				.submit();
		}
		else {
			update();
		}
	},


	/**
	 * Move the window and DataTables scrolling during a drag to scroll new
	 * content into view.
	 *
	 * This matches the `_shiftScroll` method used in AutoFill, but only
	 * horizontal scrolling is considered here.
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
			windowVert,
			dtVert;

		// Window calculations - based on the mouse position in the window,
		// regardless of scrolling
		if ( windowY < $(window).scrollTop() + buffer ) {
			windowVert = scrollSpeed * -1;
		}
		else if ( windowY > scroll.windowHeight + $(* If this is not null, then the user will be prompted before removing a file.\n       */\n      dictRemoveFileConfirmation: null,\n\n      /**\n       * Displayed if `maxFiles` is st and exceeded.\n       * The string `{{maxFiles}}` will be replaced by the configuration value.\n       */\n      dictMaxFilesExceeded: \"You can not upload any more files.\",\n\n      /**\n       * Allows you to translate the different units. Starting with `tb` for terabytes and going down to\n       * `b` for bytes.\n       */\n      dictFileSizeUnits: {tb: \"TB\", gb: \"GB\", mb: \"MB\", kb: \"KB\", b: \"b\"},\n      /**\n       * Called when dropzone initialized\n       * You can add event listeners here\n       */\n      init() {},\n\n      /**\n       * Can be an **object** of additional parameters to transfer to the server, **or** a `Function`\n       * that gets invoked with the `files`, `xhr` and, if it's a chunked upload, `chunk` arguments. In case\n       * of a function, this needs to return a map.\n       *\n       * The default implementation does nothing for normal uploads, but adds relevant information for\n       * chunked uploads.\n       *\n       * This is the same as adding hidden input fields in the form element.\n       */\n      params(files, xhr, chunk) {\n        if (chunk) {\n          return {\n            dzuuid: chunk.file.upload.uuid,\n            dzchunkindex: chunk.index,\n            dztotalfilesize: chunk.file.size,\n            dzchunksize: this.options.chunkSize,\n            dztotalchunkcount: chunk.file.upload.totalChunkCount,\n            dzchunkbyteoffset: chunk.index * this.options.chunkSize\n          };\n        }\n      },\n\n      /**\n       * A function that gets a [file](https://developer.mozilla.org/en-US/docs/DOM/File)\n       * and a `done` function as parameters.\n       *\n       * If the done function is invoked without arguments, the file is \"accepted\" and will\n       * be processed. If you pass an error message, the file is rejected, and the error\n       * message will be displayed.\n       * This function will not be called if the file is too big or doesn't match the mime types.\n       */\n      accept(file, done) {\n        return done();\n      },\n\n      /**\n       * The callback that will be invoked when all chunks have been uploaded for a file.\n       * It gets the file for which the chunks have been uploaded as the first parameter,\n       * and the `done` function as second. `done()` needs to be invoked when everything\n       * needed to finish the upload process is done.\n       */\n      chunksUploaded: function(file, done) { done(); },\n\n      /**\n       * Gets called when the browser is not supported.\n       * The default implementation shows the fallback input field and adds\n       * a text.\n       */\n      fallback() {\n        // This code should pass in IE7... :(\n        let messageElement;\n        this.element.className = `${this.element.className} dz-browser-not-supported`;\n\n        for (let child of this.element.getElementsByTagName(\"div\")) {\n          if (/(^| )dz-message($| )/.test(child.className)) {\n            messageElement = child;\n            child.className = \"dz-message\"; // Removes the 'dz-default' class\n            break;\n          }\n        }\n        if (!messageElement) {\n          messageElement = Dropzone.createElement(\"<div class=\\\"dz-message\\\"><span></span></div>\");\n          this.element.appendChild(messageElement);\n        }\n\n        let span = messageElement.getElementsByTagName(\"span\")[0];\n        if (span) {\n          if (span.textContent != null) {\n            span.textContent = this.options.dictFallbackMessage;\n          } else if (span.innerText != null) {\n            span.innerText = this.options.dictFallbackMessage;\n          }\n        }\n\n        return this.element.appendChild(this.getFallbackForm());\n      },\n\n\n      /**\n       * Gets called to calculate the thumbnail dimensions.\n       *\n       * It gets `file`, `width` and `height` (both may be `null`) as parameters and must return an object containing:\n       *\n       *  - `srcWidth` & `srcHeight` (required)\n       *  - `trgWidth` & `trgHeight` (required)\n       *  - `srcX` & `srcY` (optional, default `0`)\n       *  - `trgX` & `trgY` (optional, default `0`)\n       *\n       * Those values are going to be used by `ctx.drawImage()`.\n       */\n      resize(file, width, height, resizeMethod) {\n        let info = {\n          srcX: 0,\n          srcY: 0,\n          srcWidth: file.width,\n          srcHeight: file.height\n        };\n\n        let srcRatio = file.width / file.height;\n\n        // Automatically calculate dimensions if not specified\n        if ((width == null) && (height == null)) {\n          width = info.srcWidth;\n          height = info.srcHeight;\n        } else if ((width == null)) {\n          width = height * srcRatio;\n        } else if ((height == null)) {\n          height = width / srcRatio;\n        }\n\n        // Make sure images aren't upscaled\n        width = Math.min(width, info.srcWidth);\n        height = Math.min(height, info.srcHeight);\n\n        let trgRatio = width / height;\n\n        if ((info.srcWidth > width) || (info.srcHeight > height)) {\n          // Image is bigger and needs rescaling\n          if (resizeMethod === 'crop') {\n            if (srcRatio > trgRatio) {\n              info.srcHeight = file.height;\n              info.srcWidth = info.srcHeight * trgRatio;\n            } else {\n              info.srcWidth = file.width;\n              info.srcHeight = info.srcWidth / trgRatio;\n            }\n          } else if (resizeMethod === 'contain') {\n            // Method 'contain'\n            if (srcRatio > trgRatio) {\n              height = width / srcRatio;\n            } else {\n              width = height * srcRatio;\n            }\n          } else {\n            throw new Error(`Unknown resizeMethod '${resizeMethod}'`);\n          }\n        }\n\n        info.srcX = (file.width - info.srcWidth) / 2;\n        info.srcY = (file.height - info.srcHeight) / 2;\n\n        info.trgWidth = width;\n        info.trgHeight = height;\n\n        return info;\n      },\n\n      /**\n       * Can be used to transform the file (for example, resize an image if necessary).\n       *\n       * The default implementation uses `resizeWidth` and `resizeHeight` (if provided) and resizes\n       * images according to those dimensions.\n       *\n       * Gets the `file` as the first parameter, and a `done()` function as the second, that needs\n       * to be invoked with the file when the transformation is done.\n       */\n      transformFile(file, done) {\n        if ((this.options.resizeWidth || this.options.resizeHeight) && file.type.match(/image.*/)) {\n          return this.resizeImage(file, this.options.resizeWidth, this.options.resizeHeight, this.options.resizeMethod, done);\n        } else {\n          return done(file);\n        }\n      },\n\n\n      /**\n       * A string that contains the template used for each dropped\n       * file. Change it to fulfill your needs but make sure to properly\n       * provide all elements.\n       *\n       * If you want to use an actual HTML element instead of providing a String\n       * as a config option, you could create a div with the id `tpl`,\n       * put the template inside it and provide the element like this:\n       *\n       *     document\n       *       .querySelector('#tpl')\n       *       .innerHTML\n       *\n       */\n      previewTemplate: `\\\n<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>\\\n`,\n\n      // END OPTIONS\n      // (Required by the dropzone documentation parser)\n\n\n      /*\n       Those functions register themselves to the events on init and handle all\n       the user interface specific stuff. Overwriting them won't break the upload\n       but can break the way it's displayed.\n       You can overwrite them if you don't like the default behavior. If you just\n       want to add an additional event handler, register it on the dropzone object\n       and don't overwrite those options.\n       */\n\n\n\n\n      // Those are self explanatory and simply concern the DragnDrop.\n      drop(e) {\n        return this.element.classList.remove(\"dz-drag-hover\");\n      },\n      dragstart(e) {\n      },\n      dragend(e) {\n        return this.element.classList.remove(\"dz-drag-hover\");\n      },\n      dragenter(e) {\n        return this.element.classList.add(\"dz-drag-hover\");\n      },\n      dragover(e) {\n        return this.element.classList.add(\"dz-drag-hover\");\n      },\n      dragleave(e) {\n        return this.element.classList.remove(\"dz-drag-hover\");\n      },\n\n      paste(e) {\n      },\n\n      // Called whenever there are no files left in the dropzone anymore, and the\n      // dropzone should be displayed as if in the initial state.\n      reset() {\n        return this.element.classList.remove(\"dz-started\");\n      },\n\n      // Called when a file is added to the queue\n      // Receives `file`\n      addedfile(file) {\n        if (this.element === this.previewsContainer) {\n          this.element.classList.add(\"dz-started\");\n        }\n\n        if (this.previewsContainer) {\n          file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());\n          file.previewTemplate = file.previewElement; // Backwards compatibility\n\n          this.previewsContainer.appendChild(file.previewElement);\n          for (var node of file.previewElement.querySelectorAll(\"[data-dz-name]\")) {\n            node.textContent = file.name;\n          }\n          for (node of file.previewElement.querySelectorAll(\"[data-dz-size]\")) {\n            node.innerHTML = this.filesize(file.size);\n          }\n\n          if (this.options.addRemoveLinks) {\n            file._removeLink = Dropzone.createElement(`<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>${this.options.dictRemoveFile}</a>`);\n            file.previewElement.appendChild(file._removeLink);\n          }\n\n          let removeFileEvent = e => {\n            e.preventDefault();\n            e.stopPropagation();\n            if (file.status === Dropzone.UPLOADING) {\n              return Dropzone.confirm(this.options.dictCancelUploadConfirmation, () => this.removeFile(file));\n            } else {\n              if (this.options.dictRemoveFileConfirmation) {\n                return Dropzone.confirm(this.options.dictRemoveFileConfirmation, () => this.removeFile(file));\n              } else {\n                return this.removeFile(file);\n              }\n            }\n          };\n\n          for (let removeLink of file.previewElement.querySelectorAll(\"[data-dz-remove]\")) {\n             removeLink.addEventListener(\"click\", removeFileEvent);\n          }\n        }\n      },\n\n\n      // Called whenever a file is removed.\n      removedfile(file) {\n        if (file.previewElement != null && file.previewElement.parentNode != null) {\n          file.previewElement.parentNode.removeChild(file.previewElement);\n        }\n        return this._updateMaxFilesReachedClass();\n      },\n\n      // Called when a thumbnail has been generated\n      // Receives `file` and `dataUrl`\n      thumbnail(file, dataUrl) {\n        if (file.previewElement) {\n          file.previewElement.classList.remove(\"dz-file-preview\");\n          for (let thumbnailElement of file.previewElement.querySelectorAll(\"[data-dz-thumbnail]\")) {\n            thumbnailElement.alt = file.name;\n            thumbnailElement.src = dataUrl;\n          }\n\n          return setTimeout((() => file.previewElement.classList.add(\"dz-image-preview\")), 1);\n        }\n      },\n\n      // Called whenever an error occurs\n      // Receives `file` and `message`\n      error(file, message) {\n        if (file.previewElement) {\n          file.previewElement.classList.add(\"dz-error\");\n          if ((typeof message !== \"String\") && message.error) {\n            message = message.error;\n          }\n          for (let node of file.previewElement.querySelectorAll(\"[data-dz-errormessage]\")) {\n            node.textContent = message;\n          }\n        }\n      },\n\n      errormultiple() {\n      },\n\n      // Called when a file gets processed. Since there is a cue, not all added\n      // files are processed immediately.\n      // Receives `file`\n      processing(file) {\n        if (file.previewElement) {\n          file.previewElement.classList.add(\"dz-processing\");\n          if (file._removeLink) {\n            return file._removeLink.innerHTML = this.options.dictCancelUpload;\n          }\n        }\n      },\n\n      processingmultiple() {\n      },\n\n      // Called whenever the upload progress gets updated.\n      // Receives `file`, `progress` (percentage 0-100) and `bytesSent`.\n      // To get the total number of bytes of the file, use `file.size`\n      uploadprogress(file, progress, bytesSent) {\n        if (file.previewElement) {\n          for (let node of file.previewElement.querySelectorAl.sidebar-collapse .nav-legacy .sidebar > .nav-item > .nav-link .nav-icon,
.sidebar-mini-xs.sidebar-collapse .nav-legacy .sidebar > .nav-item > .nav-link .nav-icon {
  margin-left: .55rem;
}

.sidebar-mini.sidebar-collapse .nav-legacy .sidebar > .nav-item > .nav-link.active > .nav-icon,
.sidebar-mini-md.sidebar-collapse .nav-legacy .sidebar > .nav-item > .nav-link.active > .nav-icon,
.sidebar-mini-xs.sidebar-collapse .nav-legacy .sidebar > .nav-item > .nav-link.active > .nav-icon {
  margin-left: .36rem;
}

.sidebar-mini.sidebar-collapse .nav-legacy .sidebar.nav-child-indent .nav-treeview .nav-treeview,
.sidebar-mini-md.sidebar-collapse .nav-legacy .sidebar.nav-child-indent .nav-treeview .nav-treeview,
.sidebar-mini-xs.sidebar-collapse .nav-legacy .sidebar.nav-child-indent .nav-treeview .nav-treeview {
  padding-left: 0;
  margin-left: 0;
}

.sidebar-mini.sidebar-collapse.text-sm .nav-legacy .sidebar > .nav-item > .nav-link .nav-icon,
.sidebar-mini-md.sidebar-collapse.text-sm .nav-legacy .sidebar > .nav-item > .nav-link .nav-icon,
.sidebar-mini-xs.sidebar-collapse.text-sm .nav-legacy .sidebar > .nav-item > .nav-link .nav-icon {
  margin-left: .75rem;
}

.sidebar-mini.sidebar-collapse.text-sm .nav-legacy .sidebar > .nav-item > .nav-link.active > .nav-icon,
.sidebar-mini-md.sidebar-collapse.text-sm .nav-legacy .sidebar > .nav-item > .nav-link.active > .nav-icon,
.sidebar-mini-xs.sidebar-collapse.text-sm .nav-legacy .sidebar > .nav-item > .nav-link.active > .nav-icon {
  margin-left: calc(.75rem - 3px);
}

[class*="sidebar-dark"] .nav-legacy.nav-sidebar > .nav-item .nav-treeview,
[class*="sidebar-dark"] .nav-legacy.nav-sidebar > .nav-item > .nav-treeview {
  background-color: rgba(255, 255, 255, 0.05);
}

[class*="sidebar-dark"] .nav-legacy.nav-sidebar > .nav-item > .nav-link.active {
  color: #fff;
}

[class*="sidebar-dark"] .nav-legacy .nav-treeview > .nav-item > .nav-link.active, [class*="sidebar-dark"] .nav-legacy .nav-treeview > .nav-item > .nav-link:focus, [class*="sidebar-dark"] .nav-legacy .nav-treeview > .nav-item > .nav-link:hover {
  background-color: transparent;
  color: #fff;
}

[class*="sidebar-light"] .nav-legacy.nav-sidebar > .nav-item .nav-treeview,
[class*="sidebar-light"] .nav-legacy.nav-sidebar > .nav-item > .nav-treeview {
  background-color: rgba(0, 0, 0, 0.05);
}

[class*="sidebar-light"] .nav-legacy.nav-sidebar > .nav-item > .nav-link.active {
  color: #000;
}

[class*="sidebar-light"] .nav-legacy .nav-treeview > .nav-item > .nav-link.active, [class*="sidebar-light"] .nav-legacy .nav-treeview > .nav-item > .nav-link:focus, [class*="sidebar-light"] .nav-legacy .nav-treeview > .nav-item > .nav-link:hover {
  background-color: transparent;
  color: #000;
}

.nav-collapse-hide-child .menu-open > .nav-treeview {
  max-height: -webkit-min-content;
  max-height: -moz-min-content;
  max-height: min-content;
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.sidebar-collapse .sidebar:not(:hover) .nav-collapse-hide-child .menu-open > .nav-treeview {
  max-height: 0;
  -webkit-animation-name: fadeOut;
  animation-name: fadeOut;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.main-sidebar.sidebar-focused .nav-collapse-hide-child .sidebar-mini.sidebar-collapse .menu-open > .nav-treeview,
.main-sidebar:not(.sidebar-no-expand):hover .nav-collapse-hide-child .sidebar-mini.sidebar-collapse .menu-open > .nav-treeview, .main-sidebar.sidebar-focused
.nav-collapse-hide-child .sidebar-mini-md.sidebar-collapse .menu-open > .nav-treeview,
.main-sidebar:not(.sidebar-no-expand):hover
.nav-collapse-hide-child .sidebar-mini-md.sidebar-collapse .menu-open > .nav-treeview, .main-sidebar.sidebar-focused
.nav-collapse-hide-child .sidebar-mini-xs.sidebar-collapse .menu-open > .nav-treeview,
.main-sidebar:not(.sidebar-no-expand):hover
.nav-collapse-hide-child .sidebar-mini-xs.sidebar-collapse .menu-open > .nav-treeview {
  max-height: -webkit-min-content;
  max-height: -moz-min-content;
  max-height: min-content;
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.nav-compact .nav-link,
.nav-compact .nav-header {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.nav-compact .nav-header:not(:first-of-type) {
  padding-top: 0.75rem;
  padding-bottom: 0.25rem;
}

.nav-compact .nav-link > .right,
.nav-compact .nav-link > p > .right {
  top: .465rem;
}

.text-sm .nav-compact .nav-link > .right,
.text-sm .nav-compact .nav-link > p > .right {
  top: .7rem;
}

[class*="sidebar-dark"] .form-control-sidebar,
[class*="sidebar-dark"] .btn-sidebar {
  background-color: #3f474e;
  border: 1px solid #56606a;
  color: white;
}

[class*="sidebar-dark"] .form-control-sidebar:focus,
[class*="sidebar-dark"] .btn-sidebar:focus {
  border: 1px solid #7a8793;
}

[class*="sidebar-dark"] .btn-sidebar:hover {
  background-color: #454d55;
}

[class*="sidebar-dark"] .btn-sidebar:focus {
  background-color: #4b545c;
}

[class*="sidebar-dark"] .list-group-item {
  background-color: #454d55;
  border-color: #56606a;
  color: #c2c7d0;
}

[class*="sidebar-dark"] .list-group-item:hover {
  background-color: #4b545c;
}

[class*="sidebar-dark"] .list-group-item:focus {
  background-color: #515a63;
}

[class*="sidebar-dark"] .list-group-item .search-path {
  color: #adb5bd;
}

[class*="sidebar-light"] .form-control-sidebar,
[class*="sidebar-light"] .btn-sidebar {
  background-color: #f2f2f2;
  border: 1px solid #d9d9d9;
  color: #1f2d3d;
}

[class*="sidebar-light"] .form-control-sidebar:focus,
[class*="sidebar-light"] .btn-sidebar:focus {
  border: 1px solid #b3b3b3;
}

[class*="sidebar-light"] .btn-sidebar:hover {
  background-color: #ececec;
}

[class*="sidebar-light"] .btn-sidebar:focus {
  background-color: #e6e6e6;
}

[class*="sidebar-light"] .list-group-item {
  border-color: #d9d9d9;
}

[class*="sidebar-light"] .list-group-item:hover {
  background-color: #ececec;
}

[class*="sidebar-light"] .list-group-item:focus {
  background-color: #e6e6e6;
}

[class*="sidebar-light"] .list-group-item .search-path {
  color: #6c757d;
}

.sidebar .form-inline .input-group {
  width: 100%;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
}

.sidebar nav .form-inline {
  margin-bottom: .2rem;
}

.layout-boxed:not(.sidebar-mini):not(.sidebar-mini-md):not(.sidebar-mini-xs).sidebar-collapse .main-sidebar {
  margin-left: 0;
}

.layout-boxed:not(.sidebar-mini):not(.sidebar-mini-md):not(.sidebar-mini-xs) .content-wrapper,
.layout-boxed:not(.sidebar-mini):not(.sidebar-mini-md):not(.sidebar-mini-xs) .main-header,
.layout-boxed:not(.sidebar-mini):not(.sidebar-mini-md):not(.sidebar-mini-xs) .main-footer {
  z-index: 9999;
  position: relative;
}

.layout-boxed:not(.sidebar-mini):not(.sidebar-mini-md):not(.sidebar-mini-xs) .control-sidebar {
  z-index: 9999;
}

.sidebar-collapse .form-control-sidebar,
.sidebar-collapse .form-control-sidebar ~ .input-group-append,
.sidebar-collapse .sidebar-search-results {
  display: none;
}

[data-widget="sidebar-search"] input[type="search"]::-ms-clear, [data-widget="sidebar-search"] input[type="search"]::-ms-reveal {
  display: none;
  width: 0;
  height: 0;
}

[data-widget="sidebar-search"] input[type="search"]::-webkit-search-cancel-button, [data-widget="sidebar-search"] input[type="search"]::-webkit-search-decoration, [data-widget="sidebar-search"] input[type="search"]::-webkit-search-results-button, [data-widget="sidebar-search"] input[type="search"]::-webkit-search-results-decoration {
  display: none;
}

.sidebar-search-results {
  position: relative;
  display: none;
  width: 100%;
}

.sidebar-search-open .sidebar-search-results {
  display: inline-block;
}

.sidebar-search-results .search-title {
  margin-bottom: -.1rem;
}

.sidebar-search-results .list-group {
  position: absolute;
  width: 100%;
  z-index: 1039;
}

.sidebar-search-results .list-group > .list-group-item {
  padding: 0.375rem 0.75rem;
}

.sidebar-search-results .list-group > .list-group-item:-moz-focusring {
  margin-top: 0;
  border-left: 1px solid transparent;
  border-top: 0;
  border-bottom: 1px solid transparent;
}

.sidebar-search-results .list-group > .list-group-item:first-child {
  margin-top: 0;
  border-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.sidebar-search-results .search-path {
  font-size: 80%;
}

.sidebar-search-open .btn,
.sidebar-search-open .form-control {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

[class*="sidebar-dark"] .sidebar-custom {
  border-top: 1px solid #4f5962;
}

[class*="sidebar-light"] .sidebar-custom {
  border-top: 1px solid #dee2e6;
}

.layout-fixed.sidebar-collapse .hide-on-collapse {
  display: none;
}

.layout-fixed.sidebar-collapse:hover .hide-on-collapse {
  display: block;
}

.layout-fixed.text-sm .main-sidebar-custom .sidebar {
  height: calc(100% - ((2.93725rem + 3.8rem) + 1px));
}

.layout-fixed.text-sm .main-sidebar-custom .sidebar-custom {
  height: 3.8rem;
  padding: 0.85rem 0.5rem;
}

.layout-fixed .main-sidebar-custom {
  height: -webkit-fill-available;
  height: -moz-available;
  height: -ms-stretch;
  height: stretch;
}

.layout-fixed .main-sidebar-custom .sidebar {
  height: calc(100% - ((3.5rem + 4rem) + 1px));
}

.layout-fixed .main-sidebar-custom .sidebar-custom {
  height: 4rem;
  padding: 0.85rem 0.5rem;
}

.layout-fixed .main-sidebar-custom-lg .sidebar {
  height: calc(100% - ((3.5rem + 6rem) + 1px));
}

.layout-fixed .main-sidebar-custom-lg .sidebar-custom {
  height: 6rem;
}

.layout-fixed .main-sidebar-custom-xl .sidebar {
  height: calc(100% - ((3.5rem + 8rem) + 1px));
}

.layout-fixed .main-sidebar-custom-xl .sidebar-custom {
  height: 8rem;
}

.layout-fixed .main-sidebar-custom .pos-right,
.layout-fixed .main-sidebar-custom-lg .pos-right,
.layout-fixed .main-sidebar-custom-xl .pos-right {
  position: absolute;
  right: .5rem;
}

.sidebar-hidden .main-sidebar,
.sidebar-hidden.sidebar-mini.sidebar-collapse .main-sidebar {
  display: none !important;
}

.sidebar-hidden .content-wrapper,
.sidebar-hidden .main-header,
.sidebar-hidden.sidebar-mini.sidebar-collapse .content-wrapper,
.sidebar-hidden.sidebar-mini.sidebar-collapse .main-header {
  margin-left: 0 !important;
}

.dark-mode .sidebar-dark-primary .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-primary .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #3f6791;
  color: #fff;
}

.dark-mode .sidebar-dark-primary .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-primary .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #3f6791;
}

.dark-mode .sidebar-dark-secondary .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-secondary .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #6c757d;
  color: #fff;
}

.dark-mode .sidebar-dark-secondary .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-secondary .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #6c757d;
}

.dark-mode .sidebar-dark-success .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-success .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #00bc8c;
  color: #fff;
}

.dark-mode .sidebar-dark-success .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-success .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #00bc8c;
}

.dark-mode .sidebar-dark-info .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-info .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #3498db;
  color: #fff;
}

.dark-mode .sidebar-dark-info .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-info .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #3498db;
}

.dark-mode .sidebar-dark-warning .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-warning .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #f39c12;
  color: #1f2d3d;
}

.dark-mode .sidebar-dark-warning .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-warning .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #f39c12;
}

.dark-mode .sidebar-dark-danger .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-danger .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #e74c3c;
  color: #fff;
}

.dark-mode .sidebar-dark-danger .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-danger .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #e74c3c;
}

.dark-mode .sidebar-dark-light .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-light .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #f8f9fa;
  color: #1f2d3d;
}

.dark-mode .sidebar-dark-light .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-light .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #f8f9fa;
}

.dark-mode .sidebar-dark-dark .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-dark .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #343a40;
  color: #fff;
}

.dark-mode .sidebar-dark-dark .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-dark .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #343a40;
}

.dark-mode .sidebar-dark-lightblue .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-lightblue .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #86bad8;
  color: #1f2d3d;
}

.dark-mode .sidebar-dark-lightblue .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-lightblue .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #86bad8;
}

.dark-mode .sidebar-dark-navy .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-navy .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #002c59;
  color: #fff;
}

.dark-mode .sidebar-dark-navy .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-navy .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #002c59;
}

.dark-mode .sidebar-dark-olive .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-olive .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #74c8a3;
  color: #1f2d3d;
}

.dark-mode .sidebar-dark-olive .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-olive .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #74c8a3;
}

.dark-mode .sidebar-dark-lime .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-lime .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #67ffa9;
  color: #1f2d3d;
}

.dark-mode .sidebar-dark-lime .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-lime .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #67ffa9;
}

.dark-mode .sidebar-dark-fuchsia .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-fuchsia .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #f672d8;
  color: #1f2d3d;
}

.dark-mode .sidebar-dark-fuchsia .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-fuchsia .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #f672d8;
}

.dark-mode .sidebar-dark-maroon .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-maroon .nav-sidebar > .nav-item > .nav-link.active {
  background-color: #ed6c9b;
  color: #1f2d3d;
}

.dark-mode .sidebar-dark-maroon .nav-sidebar.nav-legacy > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-maroon .nav-sidebar.nav-legacy > .nav-item > .nav-link.active {
  border-color: #ed6c9b;
}

.dark-mode .sidebar-dark-blue .nav-sidebar > .nav-item > .nav-link.active,
.dark-mode .sidebar-light-blue .nav-sidebar > .nav-item > .nav-linke{background-color:#caced1}.custom-range.custom-range-gray::-ms-thumb{background-color:#6c757d}.custom-range.custom-range-gray::-ms-thumb:active{background-color:#caced1}.custom-range.custom-range-gray-dark:focus{outline:0}.custom-range.custom-range-gray-dark:focus::-webkit-slider-thumb{box-shadow:0 0 0 1px #fff,0 0 0 2px rgba(52,58,64,.25)}.custom-range.custom-range-gray-dark:focus::-moz-range-thumb{box-shadow:0 0 0 1px #fff,0 0 0 2px rgba(52,58,64,.25)}.custom-range.custom-range-gray-dark:focus::-ms-thumb{box-shadow:0 0 0 1px #fff,0 0 0 2px rgba(52,58,64,.25)}.custom-range.custom-range-gray-dark::-webkit-slider-thumb{background-color:#343a40}.custom-range.custom-range-gray-dark::-webkit-slider-thumb:active{background-color:#88939e}.custom-range.custom-range-gray-dark::-moz-range-thumb{background-color:#343a40}.custom-range.custom-range-gray-dark::-moz-range-thumb:active{background-color:#88939e}.custom-range.custom-range-gray-dark::-ms-thumb{background-color:#343a40}.custom-range.custom-range-gray-dark::-ms-thumb:active{background-color:#88939e}.custom-control-input-primary:checked~.custom-control-label::before{border-color:#007bff;background-color:#007bff}.custom-control-input-primary.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23007bff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-primary.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23007bff'/%3E%3C/svg%3E")!important}.custom-control-input-primary:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(0,123,255,.25)}.custom-control-input-primary:focus:not(:checked)~.custom-control-label::before{border-color:#80bdff}.custom-control-input-primary:not(:disabled):active~.custom-control-label::before{background-color:#b3d7ff;border-color:#b3d7ff}.custom-control-input-secondary:checked~.custom-control-label::before{border-color:#6c757d;background-color:#6c757d}.custom-control-input-secondary.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%236c757d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-secondary.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%236c757d'/%3E%3C/svg%3E")!important}.custom-control-input-secondary:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(108,117,125,.25)}.custom-control-input-secondary:focus:not(:checked)~.custom-control-label::before{border-color:#afb5ba}.custom-control-input-secondary:not(:disabled):active~.custom-control-label::before{background-color:#caced1;border-color:#caced1}.custom-control-input-success:checked~.custom-control-label::before{border-color:#28a745;background-color:#28a745}.custom-control-input-success.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2328a745' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-success.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%2328a745'/%3E%3C/svg%3E")!important}.custom-control-input-success:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(40,167,69,.25)}.custom-control-input-success:focus:not(:checked)~.custom-control-label::before{border-color:#71dd8a}.custom-control-input-success:not(:disabled):active~.custom-control-label::before{background-color:#9be7ac;border-color:#9be7ac}.custom-control-input-info:checked~.custom-control-label::before{border-color:#17a2b8;background-color:#17a2b8}.custom-control-input-info.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2317a2b8' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-info.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%2317a2b8'/%3E%3C/svg%3E")!important}.custom-control-input-info:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(23,162,184,.25)}.custom-control-input-info:focus:not(:checked)~.custom-control-label::before{border-color:#63d9ec}.custom-control-input-info:not(:disabled):active~.custom-control-label::before{background-color:#90e4f1;border-color:#90e4f1}.custom-control-input-warning:checked~.custom-control-label::before{border-color:#ffc107;background-color:#ffc107}.custom-control-input-warning.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23ffc107' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-warning.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23ffc107'/%3E%3C/svg%3E")!important}.custom-control-input-warning:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(255,193,7,.25)}.custom-control-input-warning:focus:not(:checked)~.custom-control-label::before{border-color:#ffe187}.custom-control-input-warning:not(:disabled):active~.custom-control-label::before{background-color:#ffeeba;border-color:#ffeeba}.custom-control-input-danger:checked~.custom-control-label::before{border-color:#dc3545;background-color:#dc3545}.custom-control-input-danger.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23dc3545' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-danger.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23dc3545'/%3E%3C/svg%3E")!important}.custom-control-input-danger:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(220,53,69,.25)}.custom-control-input-danger:focus:not(:checked)~.custom-control-label::before{border-color:#efa2a9}.custom-control-input-danger:not(:disabled):active~.custom-control-label::before{background-color:#f6cdd1;border-color:#f6cdd1}.custom-control-input-light:checked~.custom-control-label::before{border-color:#f8f9fa;background-color:#f8f9fa}.custom-control-input-light.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23f8f9fa' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-light.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23f8f9fa'/%3E%3C/svg%3E")!important}.custom-control-input-light:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(248,249,250,.25)}.custom-control-input-light:focus:not(:checked)~.custom-control-label::before{border-color:#fff}.custom-control-input-light:not(:disabled):active~.custom-control-label::before{background-color:#fff;border-color:#fff}.custom-control-input-dark:checked~.custom-control-label::before{border-color:#343a40;background-color:#343a40}.custom-control-input-dark.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23343a40' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-dark.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23343a40'/%3E%3C/svg%3E")!important}.custom-control-input-dark:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(52,58,64,.25)}.custom-control-input-dark:focus:not(:checked)~.custom-control-label::before{border-color:#6d7a86}.custom-control-input-dark:not(:disabled):active~.custom-control-label::before{background-color:#88939e;border-color:#88939e}.custom-control-input-lightblue:checked~.custom-control-label::before{border-color:#3c8dbc;background-color:#3c8dbc}.custom-control-input-lightblue.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%233c8dbc' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-lightblue.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%233c8dbc'/%3E%3C/svg%3E")!important}.custom-control-input-lightblue:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(60,141,188,.25)}.custom-control-input-lightblue:focus:not(:checked)~.custom-control-label::before{border-color:#99c5de}.custom-control-input-lightblue:not(:disabled):active~.custom-control-label::before{background-color:#c0dbeb;border-color:#c0dbeb}.custom-control-input-navy:checked~.custom-control-label::before{border-color:#001f3f;background-color:#001f3f}.custom-control-input-navy.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23001f3f' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-navy.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23001f3f'/%3E%3C/svg%3E")!important}.custom-control-input-navy:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(0,31,63,.25)}.custom-control-input-navy:focus:not(:checked)~.custom-control-label::before{border-color:#005ebf}.custom-control-input-navy:not(:disabled):active~.custom-control-label::before{background-color:#0077f2;border-color:#0077f2}.custom-control-input-olive:checked~.custom-control-label::before{border-color:#3d9970;background-color:#3d9970}.custom-control-input-olive.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%233d9970' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-olive.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%233d9970'/%3E%3C/svg%3E")!important}.custom-control-input-olive:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(61,153,112,.25)}.custom-control-input-olive:focus:not(:checked)~.custom-control-label::before{border-color:#87cfaf}.custom-control-input-olive:not(:disabled):active~.custom-control-label::before{background-color:#abdec7;border-color:#abdec7}.custom-control-input-lime:checked~.custom-control-label::before{border-color:#01ff70;background-color:#01ff70}.custom-control-input-lime.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2301ff70' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-lime.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%2301ff70'/%3E%3C/svg%3E")!important}.custom-control-input-lime:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(1,255,112,.25)}.custom-control-input-lime:focus:not(:checked)~.custom-control-label::before{border-color:#81ffb8}.custom-control-input-lime:not(:disabled):active~.custom-control-label::before{background-color:#b4ffd4;border-color:#b4ffd4}.custom-control-input-fuchsia:checked~.custom-control-label::before{border-color:#f012be;background-color:#f012be}.custom-control-input-fuchsia.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23f012be' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-fuchsia.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23f012be'/%3E%3C/svg%3E")!important}.custom-control-input-fuchsia:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(240,18,190,.25)}.custom-control-input-fuchsia:focus:not(:checked)~.custom-control-label::before{border-color:#f88adf}.custom-control-input-fuchsia:not(:disabled):active~.custom-control-label::before{background-color:#fbbaec;border-color:#fbbaec}.custom-control-input-maroon:checked~.custom-control-label::before{border-color:#d81b60;background-color:#d81b60}.custom-control-input-maroon.custom-control-input-outline:checked[type=checkbox]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23d81b60' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E")!important}.custom-control-input-maroon.custom-control-input-outline:checked[type=radio]~.custom-control-label::after{background-image:url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23d81b60'/%3E%3C/svg%3E")!important}.custom-control-input-maroon:focus~.custom-control-label::before{box-shadow:inset 0 0 0 transparent,0 0 0 .2rem rgba(216,27,96,.25)}.custom-control-input-maroon:focus:not(:checked)~.custom-control-label::before{border-color:#f083ab}.custom-control-input-maroon:not(:disabled):active~.custom-control-label::before{background-cotem .page-link:hover, .dark-mode.accent-dark .page-item .page-link:focus {\n  color: #3f474e;\n}\n\n.accent-lightblue .btn-link,\n.accent-lightblue a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-lightblue .nav-tabs .nav-link {\n  color: #3c8dbc;\n}\n\n.accent-lightblue .btn-link:hover,\n.accent-lightblue a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-lightblue .nav-tabs .nav-link:hover {\n  color: #296282;\n}\n\n.accent-lightblue .dropdown-item:active, .accent-lightblue .dropdown-item.active {\n  background-color: #3c8dbc;\n  color: #fff;\n}\n\n.accent-lightblue .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #3c8dbc;\n  border-color: #23536f;\n}\n\n.accent-lightblue .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-lightblue .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-lightblue .custom-select:focus,\n.accent-lightblue .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-lightblue .custom-file-input:focus ~ .custom-file-label {\n  border-color: #99c5de;\n}\n\n.accent-lightblue .page-item .page-link {\n  color: #3c8dbc;\n}\n\n.accent-lightblue .page-item.active a,\n.accent-lightblue .page-item.active .page-link {\n  background-color: #3c8dbc;\n  border-color: #3c8dbc;\n  color: #fff;\n}\n\n.accent-lightblue .page-item.disabled a,\n.accent-lightblue .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-lightblue [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-lightblue [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-lightblue [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-lightblue [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-lightblue .page-item .page-link:hover, .dark-mode.accent-lightblue .page-item .page-link:focus {\n  color: #4c99c6;\n}\n\n.accent-navy .btn-link,\n.accent-navy a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-navy .nav-tabs .nav-link {\n  color: #001f3f;\n}\n\n.accent-navy .btn-link:hover,\n.accent-navy a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-navy .nav-tabs .nav-link:hover {\n  color: black;\n}\n\n.accent-navy .dropdown-item:active, .accent-navy .dropdown-item.active {\n  background-color: #001f3f;\n  color: #fff;\n}\n\n.accent-navy .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #001f3f;\n  border-color: black;\n}\n\n.accent-navy .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-navy .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-navy .custom-select:focus,\n.accent-navy .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-navy .custom-file-input:focus ~ .custom-file-label {\n  border-color: #005ebf;\n}\n\n.accent-navy .page-item .page-link {\n  color: #001f3f;\n}\n\n.accent-navy .page-item.active a,\n.accent-navy .page-item.active .page-link {\n  background-color: #001f3f;\n  border-color: #001f3f;\n  color: #fff;\n}\n\n.accent-navy .page-item.disabled a,\n.accent-navy .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-navy [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-navy [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-navy [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-navy [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-navy .page-item .page-link:hover, .dark-mode.accent-navy .page-item .page-link:focus {\n  color: #002c59;\n}\n\n.accent-olive .btn-link,\n.accent-olive a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-olive .nav-tabs .nav-link {\n  color: #3d9970;\n}\n\n.accent-olive .btn-link:hover,\n.accent-olive a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-olive .nav-tabs .nav-link:hover {\n  color: #276248;\n}\n\n.accent-olive .dropdown-item:active, .accent-olive .dropdown-item.active {\n  background-color: #3d9970;\n  color: #fff;\n}\n\n.accent-olive .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #3d9970;\n  border-color: #20503b;\n}\n\n.accent-olive .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-olive .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-olive .custom-select:focus,\n.accent-olive .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-olive .custom-file-input:focus ~ .custom-file-label {\n  border-color: #87cfaf;\n}\n\n.accent-olive .page-item .page-link {\n  color: #3d9970;\n}\n\n.accent-olive .page-item.active a,\n.accent-olive .page-item.active .page-link {\n  background-color: #3d9970;\n  border-color: #3d9970;\n  color: #fff;\n}\n\n.accent-olive .page-item.disabled a,\n.accent-olive .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-olive [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-olive [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-olive [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-olive [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-olive .page-item .page-link:hover, .dark-mode.accent-olive .page-item .page-link:focus {\n  color: #44ab7d;\n}\n\n.accent-lime .btn-link,\n.accent-lime a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-lime .nav-tabs .nav-link {\n  color: #01ff70;\n}\n\n.accent-lime .btn-link:hover,\n.accent-lime a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-lime .nav-tabs .nav-link:hover {\n  color: #00b44e;\n}\n\n.accent-lime .dropdown-item:active, .accent-lime .dropdown-item.active {\n  background-color: #01ff70;\n  color: #1f2d3d;\n}\n\n.accent-lime .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #01ff70;\n  border-color: #009a43;\n}\n\n.accent-lime .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%231f2d3d' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-lime .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-lime .custom-select:focus,\n.accent-lime .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-lime .custom-file-input:focus ~ .custom-file-label {\n  border-color: #81ffb8;\n}\n\n.accent-lime .page-item .page-link {\n  color: #01ff70;\n}\n\n.accent-lime .page-item.active a,\n.accent-lime .page-item.active .page-link {\n  background-color: #01ff70;\n  border-color: #01ff70;\n  color: #fff;\n}\n\n.accent-lime .page-item.disabled a,\n.accent-lime .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-lime [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-lime [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-lime [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-lime [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-lime .page-item .page-link:hover, .dark-mode.accent-lime .page-item .page-link:focus {\n  color: #1bff7e;\n}\n\n.accent-fuchsia .btn-link,\n.accent-fuchsia a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-fuchsia .nav-tabs .nav-link {\n  color: #f012be;\n}\n\n.accent-fuchsia .btn-link:hover,\n.accent-fuchsia a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-fuchsia .nav-tabs .nav-link:hover {\n  color: #ab0b87;\n}\n\n.accent-fuchsia .dropdown-item:active, .accent-fuchsia .dropdown-item.active {\n  background-color: #f012be;\n  color: #fff;\n}\n\n.accent-fuchsia .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #f012be;\n  border-color: #930974;\n}\n\n.accent-fuchsia .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-fuchsia .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-fuchsia .custom-select:focus,\n.accent-fuchsia .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-fuchsia .custom-file-input:focus ~ .custom-file-label {\n  border-color: #f88adf;\n}\n\n.accent-fuchsia .page-item .page-link {\n  color: #f012be;\n}\n\n.accent-fuchsia .page-item.active a,\n.accent-fuchsia .page-item.active .page-link {\n  background-color: #f012be;\n  border-color: #f012be;\n  color: #fff;\n}\n\n.accent-fuchsia .page-item.disabled a,\n.accent-fuchsia .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-fuchsia [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-fuchsia [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-fuchsia [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-fuchsia [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-fuchsia .page-item .page-link:hover, .dark-mode.accent-fuchsia .page-item .page-link:focus {\n  color: #f22ac5;\n}\n\n.accent-maroon .btn-link,\n.accent-maroon a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-maroon .nav-tabs .nav-link {\n  color: #d81b60;\n}\n\n.accent-maroon .btn-link:hover,\n.accent-maroon a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-maroon .nav-tabs .nav-link:hover {\n  color: #941342;\n}\n\n.accent-maroon .dropdown-item:active, .accent-maroon .dropdown-item.active {\n  background-color: #d81b60;\n  color: #fff;\n}\n\n.accent-maroon .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #d81b60;\n  border-color: #7d1038;\n}\n\n.accent-maroon .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-maroon .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-maroon .custom-select:focus,\n.accent-maroon .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-maroon .custom-file-input:focus ~ .custom-file-label {\n  border-color: #f083ab;\n}\n\n.accent-maroon .page-item .page-link {\n  color: #d81b60;\n}\n\n.accent-maroon .page-item.active a,\n.accent-maroon .page-item.active .page-link {\n  background-color: #d81b60;\n  border-color: #d81b60;\n  color: #fff;\n}\n\n.accent-maroon .page-item.disabled a,\n.accent-maroon .page-item.disabled .page-link {\n  background-color: #fff;\n  border-color: #dee2e6;\n  color: #6c757d;\n}\n\n.accent-maroon [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #c2c7d0;\n}\n\n.accent-maroon [class*=\"sidebar-dark-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #fff;\n}\n\n.accent-maroon [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link) {\n  color: #343a40;\n}\n\n.accent-maroon [class*=\"sidebar-light-\"] .sidebar a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):hover {\n  color: #212529;\n}\n\n.dark-mode.accent-maroon .page-item .page-link:hover, .dark-mode.accent-maroon .page-item .page-link:focus {\n  color: #e4286d;\n}\n\n.accent-blue .btn-link,\n.accent-blue a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn),\n.accent-blue .nav-tabs .nav-link {\n  color: #007bff;\n}\n\n.accent-blue .btn-link:hover,\n.accent-blue a:not(.dropdown-item):not(.btn-app):not(.nav-link):not(.brand-link):not(.page-link):not(.badge):not(.btn):hover,\n.accent-blue .nav-tabs .nav-link:hover {\n  color: #0056b3;\n}\n\n.accent-blue .dropdown-item:active, .accent-blue .dropdown-item.active {\n  background-color: #007bff;\n  color: #fff;\n}\n\n.accent-blue .custom-control-input:checked ~ .custom-control-label::before {\n  background-color: #007bff;\n  border-color: #004a99;\n}\n\n.accent-blue .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\");\n}\n\n.accent-blue .form-control:focus:not(.is-invalid):not(.is-warning):not(.is-valid),\n.accent-blue .custom-select:focus,\n.accent-blue .custom-control-input:focus:not(:checked) ~ .custom-control-label::before,\n.accent-blue .custom-file-input:focus ~ .custom-file-label {\n  border-color: #80bdff;\n}\n\n.accent-blue .page-item .page-link {\n  color: #007bff;\n}\n\n.accent-blue .page-item.active a,\n.accent-blue .page-item.active .page-link {\n  background-color: #007bff;\n  border-color: #007bff;\n  color: #fff;\n}\n\n.accent-blue .page-item.disabled a,\n.accent-blue .page-item.disabled .page-link {\n 