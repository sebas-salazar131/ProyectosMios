/*! AutoFill 2.3.9
 * Â©2008-2021 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     AutoFill
 * @description Add Excel like click and drag auto-fill options to DataTables
 * @version     2.3.9
 * @file        dataTables.autoFill.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2010-2021 SpryMedia Ltd.
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


var _instance = 0;

/** 
 * AutoFill provides Excel like auto-fill features for a DataTable
 *
 * @class AutoFill
 * @constructor
 * @param {object} oTD DataTables settings object
 * @param {object} oConfig Configuration object for AutoFill
 */
var AutoFill = function( dt, opts )
{
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw( "Warning: AutoFill requires DataTables 1.10.8 or greater");
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.autoFill,
		AutoFill.defaults,
		opts
	);

	/**
	 * @namespace Settings object which contains customisable information for AutoFill instance
	 */
	this.s = {
		/** @type {DataTable.Api} DataTables' API instance */
		dt: new DataTable.Api( dt ),

		/** @type {String} Unique namespace for events attached to the document */
		namespace: '.autoFill'+(_instance++),

		/** @type {Object} Cached dimension information for use in the mouse move event handler */
		scroll: {},

		/** @type {integer} Interval object used for smooth scrolling */
		scrollInterval: null,

		handle: {
			height: 0,
			width: 0
		},

		/**
		 * Enabled setting
		 * @type {Boolean}
		 */
		enabled: false
	};


	/**
	 * @namespace Common and useful DOM elements for the class instance
	 */
	this.dom = {
		/** @type {jQuery} AutoFill handle */
		handle: $('<div class="dt-autofill-handle"/>'),

		/**
		 * @type {Object} Selected cells outline - Need to use 4 elements,
		 *   otherwise the mouse over if you back into the selected rectangle
		 *   will be over that element, rather than the cells!
		 */
		select: {
			top:    $('<div class="dt-autofill-select top"/>'),
			right:  $('<div class="dt-autofill-select right"/>'),
			bottom: $('<div class="dt-autofill-select bottom"/>'),
			left:   $('<div class="dt-autofill-select left"/>')
		},

		/** @type {jQuery} Fill type chooser background */
		background: $('<div class="dt-autofill-background"/>'),

		/** @type {jQuery} Fill type chooser */
		list: $('<div class="dt-autofill-list">'+this.s.dt.i18n('autoFill.info', '')+'<ul/></div>'),

		/** @type {jQuery} DataTables scrolling container */
		dtScroll: null,

		/** @type {jQuery} Offset parent element */
		offsetParent: null
	};


	/* Constructor logic */
	this._constructor();
};



$.extend( AutoFill.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods (exposed via the DataTables API below)
	 */
	enabled: function ()
	{
		return this.s.enabled;
	},


	enable: function ( flag )
	{
		var that = this;

		if ( flag === false ) {
			return this.disable();
		}

		this.s.enabled = true;

		this._focusListener();

		this.dom.handle.on( 'mousedown', function (e) {
			that._mousedown( e );
			return false;
		} );

		return this;
	},

	disable: function ()
	{
		this.s.enabled = false;

		this._focusListenerRemove();

		return this;
	},


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
		var dtScroll = $('div.dataTables_scrollBody', this.s.dt.table().container());

		// Make the instance accessible to the API
		dt.settings()[0].autoFill = this;

		if ( dtScroll.length ) {
			this.dom.dtScroll = dtScroll;

			// Need to scroll container to be the offset parent
			if ( dtScroll.css('position') === 'static' ) {
				dtScroll.css( 'position', 'relative' );
			}
		}

		if ( this.c.enable !== false ) {
			this.enable();
		}

		dt.on( 'destroy.autoFill', function () {
			that._focusListenerRemove();
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Display the AutoFill drag handle by appending it to a table cell. This
	 * is the opposite of the _detach method.
	 *
	 * @param  {node} node TD/TH cell to insert the handle into
	 * @private
	 */
	_attach: function ( node )
	{
		var dt = this.s.dt;
		var idx = dt.cell( node ).index();
		var handle = this.dom.handle;
		var handleDim = this.s.handle;

		if ( ! idx || dt.columns( this.c.columns ).indexes().indexOf( idx.column ) === -1 ) {
			this._detach();
			return;
		}

		if ( ! this.dom.offsetParent ) {
			// We attach to the table's offset parent
			this.dom.offsetParent = $( dt.table().node() ).offsetParent();
		}

		if ( ! handleDim.height || ! handleDim.width ) {
			// Append to document so we can get its size. Not expecting it to
			// change during the life time of the page
			handle.appendTo( 'body' );
			handleDim.height = handle.outerHeight();
			handleDim.width = handle.outerWidth();
		}

		// Might need to go through multiple offset parents
		var offset = this._getPosition( node, this.dom.offsetParent );

		this.dom.attachedTo = node;
		handle
			.css( {
				top: offset.top + node.offsetHeight - handleDim.height,
				left: offset.left + node.offsetWidth - handleDim.width
			} )
			.appendTo( this.dom.offsetParent );
	},


	/**
	 * Determine can the fill type should be. This can be automatic, or ask the
	 * end user.
	 *
	 * @param {array} cells Information about the selected cells from the key
	 *     up function
	 * @private
	 */
	_actionSelector: function ( cells )
	{
		var that = this;
		var dt = this.s.dt;
		var actions = AutoFill.actions;
		var available = [];

		// "Ask" each plug-in if it wants to handle this data
		$.each( actions, function ( key, action ) {
			if ( action.available( dt, cells ) ) {
				available.push( key );
			}
		} );

		if ( available.length === 1 && this.c.alwaysAsk === false ) {
			// Only one action available - enact it immediately
			var result = actions[ available[0] ].execute( dt, cells );
			this._update( result, cells );
		}
		else if ( available.length > 1 ) {
			// Multiple actions available - ask the end user what they want to do
			var list = this.dom.list.children('ul').empty();

			// Add a cancel option
			available.push( 'cancel' );

			$.each( available, function ( i, name ) {
				list.append( $('<li/>')
					.append(
						'<div class="dt-autofill-question">'+
							actions[ name ].option( dt, cells )+
						'<div>'
					)
					.append( $('<div class="dt-autofill-button">' )
						.append( $('<button class="'+AutoFill.classes.btn+'">'+dt.i18n('autoFill.button', '&gt;')+'</button>')
							.on( 'click', function () {
								var result = actions[ name ].execute(
									dt, cells, $(this).closest('li')
								);
								that._update( result, cells );

								that.dom.background.remove();
								that.dom.list.remove();
							} )
						)
					)
				);
			} );

			this.dom.background.appendTo( 'body' );
			this.dom.list.appendTo( 'body' );

			this.dom.list.css( 'margin-top', this.dom.list.outerHeight()/2 * -1 );
		}
	},


	/**
	 * Remove the AutoFill handle from the document
	 *
	 * @private
	 */
	_detach: function ()
	{
		this.dom.attachedTo = null;
		this.dom.handle.detach();
	},


	/**
	 * Draw the selection outline by calculating the range between the start
	 * and end cells, then placing the highlighting elements to draw a rectangle
	 *
	 * @param  {node}   target End cell
	 * @param  {object} e      Originating event
	 * @private
	 */
	_drawSelection: function ( target, e )
	{
		// Calculate boundary for start cell to this one
		var dt = this.s.dt;
		var start = this.s.start;
		var startCell = $(this.dom.start);
		var end = {
			row: this.c.vertical ?
				dt.rows( { page: 'current' } ).nodes().indexOf( target.parentNode ) :
				start.row,
			column: this.c.horizontal ?
				$(target).index() :
				start.column
		};
		var colIndx = dt.column.index( 'toData', end.column );
		var endRow =  dt.row( ':eq('+end.row+')', { page: 'current' } ); // Workaround for M581
		var endCell = $( dt.cell( endRow.index(), colIndx ).node() );

		// Be sure that is a DataTables controlled cell
		if ( ! dt.cell( endCell ).any() ) {
			return;
		}

		// if target is not in the columns available - do nothing
		if ( dt.columns( this.c.columns ).indexes().indexOf( colIndx ) === -1 ) {
			return;
		}

		this.s.end = end;

		var top, bottom, left, right, height, width;

		top    = start.row    < end.row    ? startCell : endCell;
		bottom = start.row    < end.row    ? endCell   : startCell;
		left   = start.column < end.column ? startCell : endCell;
		right  = start.column < end.column ? endCell   : startCell;

		top    = this._getPosition( top.get(0) ).top;
		left   = this._getPosition( left.get(0) ).left;
		height = this._getPosition( bottom.get(0) ).top + bottom.outerHeight() - top;
		width  = this._getPosition( right.get(0) ).left + right.outerWidth() - left;

		var select = this.dom.select;
		select.top.css( {
			top: top,
			left: left,
			width: width
		} );

		select.left.css( {
			top: top,
			left: left,
			height: height
		} );

		select.bottom.css( {
			top: top + height,
			left: left,
			width: width
		} );

		select.right.css( {
			top: top,
			left: left + width,
			height: height
		} );
	},


	/**
	 * Use the Editor API to perform an update based on the new data for the
	 * cells
	 *
	 * @param {array} cells Information about the selected cells from the key
	 *     up function
	 * @private
	 */
	_editor: function ( cells )
	{
		var dt = this.s.dt;
		var editor = this.c.editor;

		if ( ! editor ) {
			return;
		}

		// Build the object structure for Editor's multi-row editing
		var idValues = {};
		var nodes = [];
		var fields = editor.fields();

		for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
			for ( var j=0, jen=cells[i].length ; j<jen ; j++ ) {
				var cell = cells[i][j];

				// Determine the field name for the cell being edited
				var col = dt.settings()[0].aoColumns[ cell.index.column ];
				var fieldName = col.editField;

				if ( fieldName === undefined ) {
					var dataSrc = col.mData;

					// dataSrc is the `field.data` property, but we need to set
					// using the field name, so we need to translate from the
					// data to the name
					for ( var k=0, ken=fields.length ; k<ken ; k++ ) {
						var field = editor.field( fields[k] );

						if ( field.dataSrc() === dataSrc ) {
							fieldName = field.name();
							break;
						}
					}
				}

				if ( ! fieldName ) {
					throw 'Could not automatically determine field data. '+
						'Please see https://datatables.net/tn/11';
				}

				if ( ! idValues[ fieldName ] ) {
					idValues[ fieldName ] = {};
				}

				var id = dt.row( cell.index.row ).id();
				idValues[ fieldName ][ id ] = cell.set;

				// Keep a list of cells so we can activate the bubble editing
				// with them
				nodes.push( cell.index );
			}
		}

		// Perform the edit using bubble editing as it allows us to specify
		// the cells to be edited, rather than using full rows
		editor
			.bubble( nodes, false )
			.multiSet( idValues )
			.submit();
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
	 * Attach suitable listeners (based on the configuration) that will attach
	 * and detach the AutoFill handle in the document.
	 *
	 * @private
	 */
	_focusListener: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var namespace = this.s.namespace;
		var focus = this.c.focus !== null ?
			this.c.focus :
			dt.init().keys || dt.settings()[0].keytable ?
				'focus' :
				'hover';

		// All event listeners attached here are removed in the `destroy`
		// callback in the constructor
		if ( focus === 'focus' ) {
			dt
				.on( 'key-focus.autoFill', function ( e, dt, cell ) {
					that._attach( cell.node() );
				} )
				.on( 'key-blur.autoFill', function ( e, dt, cell ) {
					that._detach();
				} );
		}
		else if ( focus === 'click' ) {
			$(dt.table().body()).on( 'click'+namespace, 'td, th', function (e) {
				that._attach( this );
			} );

			$(document.body).on( 'click'+namespace, function (e) {
				if ( ! $(e.target).parents().filter( dt.table().body() ).length ) {
					that._detach();
				}
			} );
		}
		else {
			$(dt.table().body())
				.on( 'mouseenter'+namespace, 'td, th', function (e) {
					that._attach( this );
				} )
				.on( 'mouseleave'+namespace, function (e) {
					if ( $(e.relatedTarget).hasClass('dt-autofill-handle') ) {
						return;
					}

					that._detach();
				} );
		}
	},


	_focusListenerRemove: function ()
	{
		var dt = this.s.dt;

		dt.off( '.autoFill' );
		$(dt.table().body()).off( this.s.namespace );
		$(document.body).off( this.s.namespace );
	},


	/**
	 * Get the position of a node, relative to another, including any scrolling
	 * offsets.
	 * @param  {Node}   node         Node to get the position of
	 * @param  {jQuery} targetParent Node to use as the parent
	 * @return {object}              Offset calculation
	 * @private
	 */
	_getPosition: function ( node, targetParent )
	{
		var
			currNode = node,
			currOffsetParent,
			top = 0,
			left = 0;

		if ( ! targetParent ) {
			targetParent = $( $( this.s.dt.table().node() )[0].offsetParent );
		}

		do {
			// Don't use jQuery().position() the behaviour changes between 1.x and 3.x for
			// tables
			var positionTop = currNode.offsetTop;
			var positionLeft = currNode.offsetLeft;

			// jQuery doesn't give a `table` as the offset parent oddly, so use DOM directly
			currOffsetParent = $( currNode.offsetParent );

			top += positionTop + parseInt( currOffsetParent.css('border-top-width') || 0 ) * 1;
			left += positionLeft + parseInt( currOffsetParent.css('border-left-width') || 0 ) * 1;

			// Emergency fall back. Shouldn't happen, but just in case!
			if ( currNode.nodeName.toLowerCase() === 'body' ) {
				break;
			}

			currNode = currOffsetParent.get(0); // for next loop
		}
		while ( currOffsetParent.get(0) !== targetParent.get(0) )

		return {
			top: top,
			left: left
		};
	},


	/**
	 * Start mouse drag - selects the start cell
	 *
	 * @param  {object} e Mouse down event
	 * @private
	 */
	_mousedown: function ( e )
	{
		var that = this;
		var dt = this.s.dt;

		this.dom.start = this.dom.attachedTo;
		this.s.start = {
			row: dt.rows( { page: 'current' } ).nodes().indexOf( $(this.dom.start).parent()[0] ),
			column: $(this.dom.start).index()
		};

		$(document.body)
			.on( 'mousemove.autoFill', function (e) {
				that._mousemove( e );
			} )
			.on( 'mouseup.autoFill', function (e) {
				that._mouseup( e );
			} );

		var select = this.dom.select;
		var offsetParent = $( dt.table().node() ).offsetParent();
		select.top.appendTo( offsetParent );
		select.left.appendTo( offsetParent );
		select.right.appendTo( offsetParent );
		select.bottom.appendTo( offsetParent );

		this._drawSelection( this.dom.start, e );

		this.dom.handle.css( 'display', 'none' );

		// Cache scrolling i}
            return allFilled;
        };
        /**
         * Default function for getting select conditions
         */
        Criteria.inputValueSelect = function (el) {
            var values = [];
            // Go through the select elements and push each selected option to the return array
            for (var _i = 0, el_3 = el; _i < el_3.length; _i++) {
                var element = el_3[_i];
                if (element.is('select')) {
                    values.push(Criteria._escapeHTML(element.children('option:selected').data('sbv')));
                }
            }
            return values;
        };
        /**
         * Default function for getting input conditions
         */
        Criteria.inputValueInput = function (el) {
            var values = [];
            // Go through the input elements and push each value to the return array
            for (var _i = 0, el_4 = el; _i < el_4.length; _i++) {
                var element = el_4[_i];
                if (element.is('input')) {
                    values.push(Criteria._escapeHTML(element.val()));
                }
            }
            return values;
        };
        /**
         * Function that is run on each element as a call back when a search should be triggered
         */
        Criteria.updateListener = function (that, el) {
            // When the value is changed the criteria is now complete so can be included in searches
            // Get the condition from the map based on the key that has been selected for the condition
            var condition = that.s.conditions[that.s.condition];
            that.s.filled = condition.isInputValid(that.dom.value, that);
            that.s.value = condition.inputValue(that.dom.value, that);
            if (!that.s.filled) {
                that.s.dt.draw();
                return;
            }
            if (!Array.isArray(that.s.value)) {
                that.s.value = [that.s.value];
            }
            for (var i = 0; i < that.s.value.length; i++) {
                // If the value is an array we need to sort it
                if (Array.isArray(that.s.value[i])) {
                    that.s.value[i].sort();
                }
                // Otherwise replace the decimal place character for i18n
                else if (that.s.type.includes('num') &&
                    (that.s.dt.settings()[0].oLanguage.sDecimal !== '' ||
                        that.s.dt.settings()[0].oLanguage.sThousands !== '')) {
                    var splitRD = [that.s.value[i].toString()];
                    if (that.s.dt.settings()[0].oLanguage.sDecimal !== '') {
                        splitRD = that.s.value[i].split(that.s.dt.settings()[0].oLanguage.sDecimal);
                    }
                    if (that.s.dt.settings()[0].oLanguage.sThousands !== '') {
                        for (var j = 0; j < splitRD.length; j++) {
                            splitRD[j] = splitRD[j].replace(that.s.dt.settings()[0].oLanguage.sThousands, ',');
                        }
                    }
                    that.s.value[i] = splitRD.join('.');
                }
            }
            // Take note of the cursor position so that we can refocus there later
            var idx = null;
            var cursorPos = null;
            for (var i = 0; i < that.dom.value.length; i++) {
                if (el === that.dom.value[i][0]) {
                    idx = i;
                    if (el.selectionStart !== undefined) {
                        cursorPos = el.selectionStart;
                    }
                }
            }
            // Trigger a search
            that.s.dt.draw();
            // Refocus the element and set the correct cursor position
            if (idx !== null) {
                that.dom.value[idx].removeClass(that.classes.italic);
                that.dom.value[idx].focus();
                if (cursorPos !== null) {
                    that.dom.value[idx][0].setSelectionRange(cursorPos, cursorPos);
                }
            }
        };
        // The order of the conditions will make eslint sad :(
        // Has to be in this order so that they are displayed correctly in select elements
        // Also have to disable member ordering for this as the private methods used are not yet declared otherwise
        // eslint-disable-next-line @typescript-eslint/member-ordering
        Criteria.dateConditions = {
            '=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.equals', i18n.conditions.date.equals);
                },
                init: Criteria.initDate,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    value = value.replace(/(\/|-|,)/g, '-');
                    return value === comparison[0];
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
                search: function (value, comparison) {
                    value = value.replace(/(\/|-|,)/g, '-');
                    return value !== comparison[0];
                }
            },
            '<': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.before', i18n.conditions.date.before);
                },
                init: Criteria.initDate,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    value = value.replace(/(\/|-|,)/g, '-');
                    return value < comparison[0];
                }
            },
            '>': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.after', i18n.conditions.date.after);
                },
                init: Criteria.initDate,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    value = value.replace(/(\/|-|,)/g, '-');
                    return value > comparison[0];
                }
            },
            'between': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.between', i18n.conditions.date.between);
                },
                init: Criteria.init2Date,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison) {
                    value = value.replace(/(\/|-|,)/g, '-');
                    if (comparison[0] < comparison[1]) {
                        return comparison[0] <= value && value <= comparison[1];
                    }
                    else {
                        return comparison[1] <= value && value <= comparison[0];
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
                search: function (value, comparison) {
                    value = value.replace(/(\/|-|,)/g, '-');
                    if (comparison[0] < comparison[1]) {
                        return !(comparison[0] <= value && value <= comparison[1]);
                    }
                    else {
                        return !(comparison[1] <= value && value <= comparison[0]);
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
        Criteria.momentDateConditions = {
            '=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.equals', i18n.conditions.date.equals);
                },
                init: Criteria.initDate,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison, that) {
                    return moment(value, that.s.dateFormat).valueOf() ===
                        moment(comparison[0], that.s.dateFormat).valueOf();
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
                    return moment(value, that.s.dateFormat).valueOf() !==
                        moment(comparison[0], that.s.dateFormat).valueOf();
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
                    return moment(value, that.s.dateFormat).valueOf() < moment(comparison[0], that.s.dateFormat).valueOf();
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
                    return moment(value, that.s.dateFormat).valueOf() > moment(comparison[0], that.s.dateFormat).valueOf();
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
                    var val = moment(value, that.s.dateFormat).valueOf();
                    var comp0 = moment(comparison[0], that.s.dateFormat).valueOf();
                    var comp1 = moment(comparison[1], that.s.dateFormat).valueOf();
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
                    var val = moment(value, that.s.dateFormat).valueOf();
                    var comp0 = moment(comparison[0], that.s.dateFormat).valueOf();
                    var comp1 = moment(comparison[1], that.s.dateFormat).valueOf();
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
        Criteria.luxonDateConditions = {
            '=': {
                conditionName: function (dt, i18n) {
                    return dt.i18n('searchBuilder.conditions.date.equals', i18n.conditions.date.equals);
                },
                init: Criteria.initDate,
                inputValue: Criteria.inputValueInput,
                isInputValid: Criteria.isInputValidInput,
                search: function (value, comparison, that) {
                    return luxon.DateTime.fromFormat(value, that.s.dateFormat).ts
          =b}(),r}()}));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ß^_ÃÌÌÌÌÌÌÌÌÌÌÌÌéÛıÿÿÌÌÌÌÌÌÌÌÌÌÌé+şÿÿÌÌÌÌÌÌÌÌÌÌÌé{şÿÿÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh“Äd¡    PQV¡ vø3ÅPEôd£    ‹ñ‰uğN0ÇEü   èÿÿÿNÆEü èlıÿÿ‹ÎÇEüÿÿÿÿèî–ğÿ‹Môd‰    Y^‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh³Äd¡    PQV¡ vø3ÅPEôd£    ‹ñ‰uğN<ÇEü   èèşÿÿNÆEü è\ıÿÿ‹ÎÇEüÿÿÿÿè~–ğÿ‹Môd‰    Y^‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìƒì‹AƒÁ‰Eü‹Uü¸ÿÿÿÿğÁ‰Eø‹EøHuèç ‹å]ÃÌÌÌƒÁ8é¨ìÏÿÌÌÌÌÌÌÌÌÇA    ÇAÿÿÿÿÇAÿÿÿÿÇA    ÇAÿÿÿÿÇAÿÿÿÿÃÌÌÌÌÌU‹ìjÿh`Äd¡    PƒìVW¡ vø3ÅPEôd£    ‹ù‰}è‹‡d  ÇäïÍÇG ğÍÇG8ğÍÇ‡`  XğÍÇ‡h  pğÍÇ‡p  ˆğÍÇ‡x   ğÍÇ‡€  ¸ğÍ‹@Ç„8d  ĞğÍ‹ˆ  ÇEü   …Ét&€¿   u‹‡d  ‹@d  ÇPèª£ùÿ‹Èè3©ùÿ·  ‰uìN<ÆEü	ènıÿÿNÆEüèâûÿÿ‹ÎÆEüè•ğÿ‹‡ì  ì  ÆEü‰Eğ‹Uğ¸ÿÿÿÿğÁ‰Eì‹EìHuèŠ ‹‡ä  ä  ÆEü‰Eì‹Uì¸ÿÿÿÿğÁ‰Eğ‹EğHuè] ‹‡Ü  Ü  ÆEü‰Eì‹Uì¸ÿÿÿÿğÁ‰Eğ‹EğHuè0 ·œ  ‰uìN0ÆEüè{üÿÿNÆEü
èÏúÿÿ‹ÎÆEüèT”ğÿ‹‡”  ”  ÆEü‰Eì‹Uì¸ÿÿÿÿğÁ‰Eğ‹EğHuè× ‹‡Œ  Œ  ÆEü ‰Eì‹Uì¸ÿÿÿÿğÁ‰Eğ‹EğHuèª ‹ÏÇEüÿÿÿÿèìXñÿ‹Môd‰    Y_^‹å]ÃÌÌÌÌÌÌÌÌÌÌÌU‹ì‹U‹A;Bu&ŠA:Bu‹A;BuŠA:BuŠA:Bu°]Â 2À]Â ÌÌÌÌÌÌU‹ìƒìVÿu‹ñÇEü    EğPNèî÷ÿ‹U‹^ó~ ‰
‹H‹ÂfÖB‰J‹å]Â ƒééê  ƒééB  ƒéé:  éT  é/  ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñèåùÿÿöEt	Vèé!ğÿƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñèuúÿÿöEt	Vè¹!ğÿƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñè%ùÿÿöEt	Vè‰!ğÿƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñèµùÿÿöEt	VèY!ğÿƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh“Äd¡    PQV¡ vø3ÅPEôd£    ‹ñ‰uğN0ÇEü   è8úÿÿNÆEü èŒøÿÿ‹ÎÇEüÿÿÿÿè’ğÿöEt	Vèâ ğÿƒÄ‹Æ‹Môd‰    Y^‹å]Â ÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh³Äd¡    PQV¡ vø3ÅPEôd£    ‹ñ‰uğN<ÇEü   èøùÿÿNÆEü èløÿÿ‹ÎÇEüÿÿÿÿè‘ğÿöEt	Vèb ğÿƒÄ‹Æ‹Môd‰    Y^‹å]Â ÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñèÕòğÿöEt	Vè) ğÿƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìöEV‹ñÇìÍt	VèøğÿƒÄ‹Æ^]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñèûÿÿT  èjµğÿöEt	Vè¾ğÿƒÄ‹Æ^]Â ÌÌÌÌU‹ìƒì$V‹ñ‹‹@ÿĞ„À„ï   ‹F4‹@H9F8t‹F8@‹Ny‹F4‹@;È~
QPNèo"ğÿ‹N0…É„»   S‹]W9~0‹N0…Ét‹yƒÁèÙöÿÿÿv0èAğÿƒÄ‰~0‹N0…ÉuÕ_[^‹å]Â …z   ‹AƒÁ‰EüEøPEğ‰Mø‰MğMÜPÇEô    èËÿÿ€}ì ‹}àu
;}è”À„Àu!MÜèÄ„	 P‹EÜN‹@Pÿvè«"ğÿ‹N0…Ét‹yƒÁèIöÿÿÿv0è±ğÿƒÄ‰~0_[^‹å]Â ÌÌU‹ìƒì$V‹ñ‹‹@ÿĞ„À„ï   ‹F@‹@H9FDt‹FD@‹Ny‹F@‹@;È~
QPNè_!ğÿ‹N<…É„»   S‹]W9~0‹N<…Ét‹yƒÁè)öÿÿÿv<è1ğÿƒÄ‰~<‹N<…ÉuÕ_[^‹å]Â …z   ‹AƒÁ‰EüEøPEğ‰Mø‰MğMÜPÇEô    èÊÿÿ€}ì ‹}àu
;}è”À„Àu!MÜè´ƒ	 P‹EÜN‹@ĞPÿvè›!ğÿ‹N<…Ét‹yƒÁè™õÿÿÿv<è¡ğÿƒÄ‰~<_[^‹å]Â ÌÌU‹ìƒìV‹u‹F…À„‘   3ÉHSHÁW‹}@‹F‹\ˆ‹Ïèÿkñÿ;Øto‹ÏèÄuñÿ;Øtd‹Ïè¹uñÿ‹Ï‰Eèßkñÿ‹~‹Ø‹E‰Eø‹F‰]ôÆEü ;~uYMô;Èv;+È¸«ªª*÷éÑú‹ÂÁèÂ;F}$‹E‹Î‰EìEèjPW‰]èÆEğ è<!ğÿ_[‹Æ^‹å]ÃjEô‹ÎPWè%!ğÿ_[‹Æ^‹å]Ãˆ…Ét‰‹Eø‰AŠEüˆAÿF‹Æ_[^‹å]ÃÌÌÌÌÌÌÌÌU‹ìjÿhÄd¡    PìÌ   SVW¡ vø3ÅPEôd£    ‰MÈj(èKğÿƒÄ‰EğÇEü    …Àtÿu‹Èè $ÿÿë3ÀPMÀÇEüÿÿÿÿè»ñÿ‹ğèU(ğÿ‰EàÇEä    ‹‰Mà‹F‰Eä‰Mì‹Uì¸   ğÁ‰EÜƒìÇEü   ‹ôè(ğÿ‰ÇF    ‹Eà‰‹Eä‰F‹‰Eì‹Uì¸   ğÁ‰EğEĞPèÜİùÿƒÄ‹‹p‹}‹UU‰}˜‹‡  ‰U¸ÇEè    ÆEü‹H‹‡  ‰]ğ‹Á;Â‰EìMìE¸MÈEèƒ9 MÁM˜‹ ‰EœèÿğÿjE˜‹ÏPEPèñÿÿuE‹ÏVSPèñÿ‹EĞÆEü‰Eğ‹Uğ¸ÿÿÿÿğÁ‰Eè‹EèHuMĞè	Îÿ‹E ƒø„Æ  ‹]Èƒøu‹‹ˆ  è:Eøÿ€¸â    „¦  ‹uè'ğÿ9ƒŒ  uèğÿ‹“  ‰UÌ‰uğÇEè    ‹‚  ‹H‹‚  Uğ‹Á;ÆM ‰E MÊEèƒ9 MÁMÌ‹ ‰EĞè/şğÿ‹UĞ‹uÌ…Òu‰–<  ë|‹†  ‹H‹†  ;Á‹†”   ‹H‹†˜   u‹ÁëNƒ<ÁuÇ†<      ëBƒ¾,   t)‹,  I˜À3ÿ„À‹†(  EÏ;ˆ}ÿuÔ‹ÎRè“)ñÿë
jR‹Îè',ñÿ‰†<  ‹¾<  NjÿjWè–Ğÿ‹NX‹V\ÁâQ‹J4Áè&ğÿ9uè€ğÿ‹N‹¤   k‰¨   |H+9‹Q4ÂèÛ%ğÿ9Fuèáğÿ‹NIèÿõÿ‹Èèñıÿ‹MP…tÿÿÿPèÿşõÿ‹Èè˜ıÿÿutÿÿÿÆEüèöüõÿ„Àt2Ûéƒ  j j j jj j j M¤èÅğÿÇE¤ ñÍtÿÿÿÆEüè¯şõÿÿu‹øKÿu…(ÿÿÿPèHcñÿ‹ğ‹‹Ïj ÆEüÿR@PE¤VPè  ‹uƒÄÆEüè%ğÿ9ƒŒ  uè"ğÿ‹“  ‰U¼‰u ÇEğ    ‹‚  ‹H‹‚  U ‹Á;ÆM‰EMÊEğƒ9 MÁM¼‹ ‰EÀè9üğÿ‹UÀ‹u¼…Òu‰–<  ë|‹†  ‹H‹†  ;Á‹†”   ‹H‹†˜   u‹ÁëNƒ<ÁuÇ†<      ëBƒ¾,   t)‹,  I˜À3ÿ„À‹†(  EÏ;ˆ}ÿuÄ‹ÎRè'ñÿë
jR‹Îè1*ñÿ‰†<  ‹¾<  NjÿjWè”Ğÿ‹NX‹V\ÁâQ‹J4Áè$ğÿ9uè~ğÿ‹N‹¤   k‰¨   |H+9‹Q4Âèå#ğÿ9Fuèë}ğÿ‹NIè ıõÿ‹Èè‰îıÿ…À”Eè¾#ğÿ9ƒ”  uèÁ}ğÿÿu‹‹ˆ  ÿ³˜  è—ùÿPÿu…tÿÿÿÿuDÿÿÿPèDÎÿÿ3öÆEüE¤‰uÜ‰EØ9u¬~"EØPDÿÿÿè‘B  ‹E¬;ğu3öëF‰uÜ;ğ|ŞDÿÿÿè3'  ‹XÿÿÿŠØÆEü‰M‹U¸ÿÿÿÿğÁ‰E‹MIuXÿÿÿèÄ M¤ÆEüè˜ïÿÿ‹EŒÆEü‰E‹U¸ÿÿÿÿğÁ‰E‹EHuMŒè¡şÍÿ…xÿÿÿ‰E‹ÈÆEü	èe÷ÿ‰E‹U¸ÿÿÿÿğÁ‰E‹EHuxÿÿÿèöÿ‹E€ÆEü‰E‹U¸ÿÿÿÿğÁ‰E‹EHuM€ècÓ’ÿÇ…tÿÿÿ Çë2Û‹EàÇEüÿÿÿÿ‰E‹U¸ÿÿÿÿğÁ‰E‹EHuMàèû ŠÃ‹Môd‰    Y_^[‹å]Â ÌÌÌÌÌU‹ìjÿhHÄd¡    Pƒì8SVW¡ vø3ÅPEôd£    ‹Ù‰]à‹è   è(ÑÿÇ     ‹ƒ”   ‹H‹ƒ˜   ƒ<Á ~JKè)Ñÿ‹ğƒ~ t0‹ÎèÖğÿ¿F‹NP‹…Étÿvj Qëj j j ‹ÎÿPP‹Îèığÿj Kè“.ÑÿKdè›'Ñÿj ‹ËÇ     èÜ&ñÿ‹}3ö9w.  èi!ğÿ9ƒh  uèl{ğÿ‹W¶‹‹l  ƒìÂ‹Ä‹9RPÿWEÔPèøFõÿƒÄE¼ÇEü    P‹Ëè£ÿÿ‰Eì‹MƒìÆEü‹ü‹Il‹±è	!ğÿ‰ÇG    ‹EÔ‰‹EØ‰G‹‰Eğ‹Uğ¸   ğÁ‰EÜEÌPèÈÖùÿƒÄSÿpÆEüÿ0‹EìP‹èĞñÿ‹EÌÆEü‰Eì‹Uì¸ÿÿÿÿğÁ‰Eè‹EèHuMÌèYüÍÿ‹EÔÇEÀ    ÇEÄÿÿÿÿÇEÈÿÿÿÿÇEüÿÿÿÿ‰Eì‹Uì¸ÿÿÿÿğÁ‰Eä‹EäHuMÔè
  ‹}‹G;ğu3öëF‹]à;ğŒÒşÿÿ‹Môd‰    Y_^[‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh½Äd¡    Pì  ¡ vø3Å‰EğVWPEôd£    ‹E‹}‹u‰}ˆ‰µxÿÿÿ‰Eœèéù ‰EŒè±ü ó~‹N‰…dÿÿÿfÖ…Xÿÿÿ‰`ÿÿÿfo°ÆË2ÀóE ˆE›‹ÁóE°ÇEü    ó~ÇEÀÆEÄfÖ…PÿÿÿfÖ…|ÿÿÿ‰E„‹xÿÿÿ‹u€ÆEü;q„g  ‹½|ÿÿÿPjV‹Ïè=
ğÿ‹OL‹WPÁâ‰EQ‰E„‹J<Áè0ğÿ9uè7yğÿ‹O‹D  i‘H    P‹Æ‹J+·APèp¬ğÿ‹ÈƒÄ‰tÿÿÿƒùTuo‹E‹½|ÿÿÿ‹ÏPjVèÌ	ğÿ‹OP‹Ğ‹GLÁá‰U‰U„H‹A<Ğè½ğÿ9uèÄxğÿ‹Oi‘H    ‹D  P‹Æ‹J+ºû  f9AƒÓ  3ÉéÒ  ƒùO…É  ó~…Pÿÿÿ‹EfÖ…hÿÿÿ‰…pÿÿÿ‹•|ÿÿÿÆEü‹‚ˆ   ‹H‹‚Œ   ;4Áu3ÿë~‹…xÿÿÿ‰½lÿÿÿ;x„d  ÿu‹hÿÿÿjWè	ğÿ‹Ğ‹…hÿÿÿ‰•pÿÿÿ‹HL‹@PÁàA‹@Ğ‰E”èìğÿ‹M”9uèğwğÿ‹E”‹H‹D  i‘H    P‹Ç‹J+·APèÖ³ğÿƒÄ„À„ê   ÿµpÿÿÿ‹hÿÿÿjWÆE›èƒğÿ‹•hÿÿÿ‰…pÿÿÿ‹JL‹RPÁâQ‹JÁ‰E”èmğÿ‹M”9uèqwğÿ‹E”ÿuj‹HV‹D  i‰H    H+9‹Ax‹½|ÿÿÿ‹Ï‰E”èğÿ‹OP‹Ğ‹GLÁá‰U‰U„H‹A<Ğèğÿ9uèwğÿ‹O‹D  i‘H    P‹Æ+‹JA‹E”· P·PèòÉğÿPè<ªğÿƒÄÆEü‹Èë‹tÿÿÿÆEüë‹tÿÿÿ3Àƒø%ƒJ  ÆDÈ @ƒø%|ïAşƒøq‡ö   ¶€liÿ$…ğhÆEåé  ÆEÏé  ÆEĞéú   ÆEàéñ   ÆEÎéè   ÆEÍéß   ÆEÑéÖ   ÆEÕéÍ   ÆEÒéÄ   ÆEÓé»   ÆEÔé²   ÆEÖé©   ÆE×é    ÆEØé—   ÆEÙé   ÆEÚé…   ÆEİëÆEŞëyÆEÛësÆEßëmÆEäëgÆEÜëaÆEâë[ÆEÏfÇEÊÆEÉÆEÌëGÆEÉëAfÇEÊë9fÇEÊÆEáë-€} t
‹}œÆD=Èë fo°ÆËóEÈÇEèóEØÆEì‹}œ2Ò9µ\ÿÿÿtJƒùutEŠD= „Àt8T=Èt€|=È t„Àu2Òë*3Àp›    €|  t€|È ¶ÒEÖ@ƒø%|è‹u€ë²€}› t7‹½|ÿÿÿ‹‡ˆ   ‹H‹‡Œ   ;4Áu3öëF‰u€2Àó~…|ÿÿÿˆE›fÖ…Pÿÿÿ„Òt(3À€|  t€|È t¹   ë3ÉˆL @ƒø%|ßéi  ÿÿÿè­Tÿÿ…|ÿÿÿÆEüP…XÿÿÿPôşÿÿèĞBÏÿóo ó…ÿÿÿó~HfÖ$ÿÿÿ‹@‰…,ÿÿÿ‹EŒ€|  u2‹Eœ€|  u(‹…dÿÿÿ€|  u3É3À‰ÿÿÿI 8L u@ƒø%|ôë‹È‰ÿÿÿ‹Eˆ‹x‹P‰}”;×ui½ÿÿÿ;xvK‹Ç‹}ˆ+GÁø;E”}9Š…,ÿÿÿ‰ğşÿÿó…ôşÿÿˆ…ÿÿÿfÖÿÿÿj…ğşÿÿÆEüPR‹ÏèèğÿëH‹ÇjÿÿÿQR‹ÈèÓğÿë3ÁâPt(‰
óo…ÿÿÿóBó~…$ÿÿÿfÖBŠ…,ÿÿÿˆB‹Eˆÿ@‹Eó~…Pÿÿÿ‰…`ÿÿÿEÈj%PE fÖ…XÿÿÿPèu ƒÄÆEü‹½|ÿÿÿ‹‡ˆ   ‹H‹‡Œ   ;4Áu3öëF‹…xÿÿÿ‰u€;ptó~…|ÿÿÿ‹EfÖ…Pÿÿÿé¢ùÿÿ‹}ˆ‹µxÿÿÿ‹…\ÿÿÿÆEü ;F„3  4ÿÿÿèãRÿÿFÆEüP…XÿÿÿPôşÿÿè	AÏÿ‹uŒóo €|5  ó…4ÿÿÿó~HfÖDÿÿÿ‹@‰…Lÿÿÿu=‹Eœ€|  u.‹…dÿÿÿ€|  u!3ö3À‰uŒ‰µ0ÿÿÿ€|  u@ƒø%|óëè„ ‹ğ‰uŒ‰µ0ÿÿÿ‹O‹W;Ñue‹w…0ÿÿÿ;ÆvE+ÆÁø;Á}<‹EŒ‰…ğşÿÿŠ…Lÿÿÿó…ôşÿÿˆ…ÿÿÿfÖÿÿÿj…ğşÿÿÆEüPR‹Ïè ğÿëCj…0ÿÿÿ‹ÏPRèğÿë0ÁâWt%‰2óo…4ÿÿÿóBó~…DÿÿÿfÖBŠ…LÿÿÿˆBÿG‹Môd‰    Y_^‹Mğ3Íèi‚ ‹å]Ãd
ddd%d.d7d@dIdRd[dddmdvddˆd‘d—dãdd£dÉd©d¯dµd»d¿dÏdÕdİdéd  	
ÌÌU‹ìjÿhAÄd¡    Pƒì(VW¡ vø3ÅPEôd£    ‹ñ‹‹@ÿĞ„Àtq‹F4‹@H9F8tejè
ğÿ‹øƒÄ‰}ğÇEü    …ÿt@‹N8FA‰Eè‹@‰Eìy‹F4‹H‹F4‰EàEèPEà‰MäPMÌè…¶ÿÿPÿu‹Ïèê·ÿÿ‹Èë3É‹F0‰A‰N0‹Môd‰    Y_^‹å]Â ÌÌÌÌÌÌÌÌU‹ìjÿhAÄd¡    Pƒì(VW¡ vø3ÅPEôd£    ‹ñ‹‹@ÿĞ„Àtq‹F@‹@H9FDtejèY	ğÿ‹øƒÄ‰}ğÇEü    …ÿt@‹NDFA‰Eè‹@‰Eìy‹F@‹H‹F@‰EàEèPEà‰MäPMÌèÅµÿÿPÿu‹Ïèê·ÿÿ‹Èë3É‹F<‰A‰N<‹Môd‰    Y_^‹å]Â ÌÌÌÌÌÌÌÌU‹ìjÿhøÄd¡    Pƒì,SVW¡ vø3ÅPEôd£    ‹ùÇEğ    è:añÿƒø…¹   Eì‹ÏPèVañÿ‹ğèÏğÿ9uèÖnğÿ‹^EØP‹Ïè8añÿ‹ğè±ğÿ9uè¸nğÿ‹NEÈPèL’ğÿ‹Ëpè†ğÿ;ufj EÔÇEÔ    P‹ÏÇEØ   ÆEÜ èOŒñÿEàPè&ÂğÿƒÄPj ‹ÏÇEü    è²€ñÿ‹EàÇEüÿÿÿÿ‰Eğ‹Uğ¸ÿÿÿÿğÁ‰Eè‹EèHuMàèèïÍÿ‹Môd‰    Y_^[‹å]ÃÌÌÌÌÌÌV‹ñèøB  9†¬  ^”ÀÃÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìV‹ñ‹‹@ÿĞ„Àte‹F0…Àt^S‹]WI 9~.‹N0…Ét‹yƒÁè*ßÿÿÿv0è’ğÿƒÄ‰~0‹F0…ÀuÕ_[^]Â u ‹N0…Ét‹yƒÁèúŞÿÿÿv0èbğÿƒÄ‰~0_[^]Â ÌÌÌÌÌU‹ìV‹ñ‹‹@ÿĞ„Àte‹F<…Àt^S‹]WI 9~.‹N<…Ét‹yƒÁè
ßÿÿÿv<èğÿƒÄ‰~<‹F<…ÀuÕ_[^]Â u ‹N<…Ét‹yƒÁèÚŞÿÿÿv<èâğÿƒÄ‰~<_[^]Â ÌÌÌÌÌU‹ìƒìEìÇEü    Pèzâğÿ‹U‹ó~@‰
‹H‹ÂfÖB‰J‹å]Â ÌÌÌÌÌÌÌÌÌÌÌU‹ìƒìV‹ñÇEü    EğPNè„‘  ‹Uó~ ‹H‹Â‰2fÖB‰J^‹å]Â ÌÌÌÌÌÌÌU‹ìQV‹ñÇEü    è­^ñÿ‹U;Â‹MLĞVRèk ÿÿ‹E^‹å]Â ÌU‹ìQQ‹Mj ÇEü    èJ ÿÿ‹E‹å]Â ÌU‹ìjÿh3 Äd¡    Pìœ   SVW¡ vø3ÅPEôd£    ‹Ù‹uE¤ÇEğ    ÿvPèmÿÿÿ‹øÿ6…XÿÿÿÇEü    P‹ËèTÿÿÿ‹MWPÆEüèö ÿÿ‹E‹Môd‰    Y_^[‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhs Äd¡    PƒìVW¡ vø3ÅPEôd£    jh´Ahä/j ÿuÇEğ    èÊt j8‹øèğÿ‹ğƒÄ‰uÇEü    …ötGÆEüPNÇ(ÌèJ=Ïÿë3öVMèÇEüÿÿÿÿèÆ£ñÿ‹ğèÿğÿ‹}‰ÇG    ‹‰‹N‰O‹‰M‹U¸   ğÁ‰E‹Ç‹Môd‰    Y_^‹å]Â U‹ìjÿhs Äd¡    PƒìVW¡ vø3ÅPEôd£    jhTBhä/j ÿuÇEğ    èús j‹øè3ğÿ‹ğƒÄ‰uÇEü    …öt<ÆEüÇÈÌèQğÿ‰FÇF    ‹G‰F‹G‰F‹F‰E‹U¸   ğÁ‰Eìë3öVMèÇEüÿÿÿÿèÒ¢ñÿ‹ğèğÿ‹}‰ÇG    ‹‰‹N‰O‹‰M‹U¸   ğÁ‰E‹Ç‹Môd‰    Y_^‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌU‹ìƒìVWjhàAhä/j ÿuÇEü    ès j‹ğèRğÿƒÄ…ÀtÇ PÌ‹N‰H‹N‰Hë3ÀPMôè,¢ñÿ‹ğèeğÿ‹}‰ÇG    ‹‰‹N‰O‹‰M‹U¸   ğÁ‰E‹Ç_^‹å]Â ÌU‹ìjÿhs Äd¡    PƒìVW¡ vø3ÅPEôd£    jh,Bhä/j ÿuÇEğ    èjr j(‹øè£ğÿ‹ğƒÄ‰uÇEü    …ötGÆEüPNÇ Ìè
4Ïÿë3öVMèÇEüÿÿÿÿèf¡ñÿ‹ğèŸğÿ‹}‰ÇG    ‹‰‹N‰O‹‰M‹U¸   ğÁ‰E‹Ç‹Môd‰    Y_^‹å]Â U‹ìjÿhs Äd¡    PƒìVW¡ vø3ÅPEôd£    jhBhä/j ÿuÇEğ    èšq j(‹øèÓğÿ‹ğƒÄ‰uÇEü    …ötGÆEüPNÇxÌèú3Ïÿë3öVMèÇEüÿÿÿÿè– ñÿ‹ğèÏğÿ‹}‰ÇG    ‹‰‹N‰O‹‰M‹U¸   ğÁ‰E‹Ç‹Môd‰    Y_^‹å]Â U‹ìƒì‹UW‹z‹‰Eø;z}vSV‹ud$ ‹@ŠˆMÿ€ù
tK‹V‹^;Óu2Eÿ;Fv+F;Ã}jEşˆMşPR‹ÎèhğÿëjEÿ‹ÎPRèXğÿë‹FÂtˆÿF‹U‹Eø;xu3ÿëG;z|•^[_‹å]ÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìƒì‹UV‹r‹‰Eô;rÀ   SW‹}‹@·p‰Müƒù
u…ötfƒ|pş„„   ¹   ë& ùÿÿfƒø	wÁĞù  ëùÿÿfƒø	w	Á@ù  ‰Mü‹W‹_;Óu7Eü;Gv+GÑø;Ã}·Á‹Ï‰EøEøjPRè‚ğÿë jEü‹ÏPRèrğÿë‹GP…Àtf‰ÿG‹U‹Eô;pu3öëF;rŒGÿÿÿ_[^‹å]ÃU‹ìjÿh	!Äd¡    Pìœ  ¡ vø3Å‰EğSVWPEôd£    ‹Ñ‰•¸üÿÿ‹]3É‰¼üÿÿ9K%  ›    ‹C4IÁæ‹Ê‰µXüÿÿÿ40…lüÿÿPè0ùÿÿ‹C‹püÿÿÇEü    ;L0¸  …ÈüÿÿÇ…Üûÿÿ    ‰…Ğûÿÿ‰…Øûÿÿ…Üşÿÿ‰…àûÿÿ‰…èûÿÿ…°ûÿÿ‰…¨ûÿÿFÇ…ìûÿÿ    ‰…`üÿÿë¤$    ‹µˆüÿÿ…öt
‹•Œüÿÿ;ÑtlüÿÿèÁÿÿ‹•Œüÿÿ‹µˆüÿÿ…Òu‰–<  ë‹†  ‹H‹†  ;Á‹†”   ‹H‹†˜   u‹ÁëQƒ<ÁuÇ†<      ëEƒ¾,   t,‹,  I˜À3ÿ„À‹†(  EÏ;ˆ}ÿµüÿÿ‹ÎRèÜñÿë
jR‹Îèpñÿ‰†<  ‹¾<  ‹µˆüÿÿjÿjWN‰½üÿÿèKzĞÿ‹NX‹V\ÁâQ‹J4ÁèD
ğÿ9uèKdğÿ‹N‹¤   k‰¨   |H+9‹Q4Âè
ğÿ9Fuèdğÿ‹NIè“ãõÿ‹ÈèLÕıÿ‹µ|üÿÿ‹Ø…öt‹•€üÿÿ;•püÿÿtlüÿÿè·ÿÿ‹•€üÿÿ‹µ|üÿÿ…Òu‰–<  ë‹†  ‹H‹†  ;Á‹†”   ‹H‹†˜   u‹ÁëQƒ<ÁuÇ†<      ëEƒ¾,   t,‹,  I˜À3ÿ„À‹†(  EÏ;ˆ}ÿµ„üÿÿ‹ÎRè¢ñÿë
jR‹Îè6ñÿ‰†<  ‹¾<  ‹µ|üÿÿjÿjWN‰½„üÿÿèyĞÿ‹NX‹V\ÁâQ‹J4Áè
	ğÿ9uècğÿ‹N‹¤   k‰¨   |H+9‹Q4ÂèŞğÿ9Fuèäbğÿ‹NIèYâõÿS¬ûÿÿQ‹Èèªòüÿ‹…tüÿÿ‰…üÿÿ‹…xüÿÿ‰…üÿÿ‹…|üÿÿ‰…üÿÿ‹…€üÿÿ‰…üÿÿ‹…„üÿÿ‰…üÿÿ‹…ˆüÿÿó~…lüÿÿ‰… üÿÿ‹…Œüÿÿ‰…$üÿÿ‹…üÿÿ‰…(üÿÿ‹…”üÿÿ‰…,üÿÿ‹…˜üÿÿ‰…0üÿÿ‹…œüÿÿ‰…4üÿÿ‹… üÿÿ‰…8üÿÿ‹…¤üÿÿ‰…<üÿÿ‹…¨üÿÿ‰…@üÿÿ‹…¬üÿÿ‰…Düÿÿ‹…°üÿÿ‰…Hüÿÿ‹…´üÿÿfÖ…üÿÿ‰…Lüÿÿj üÿÿÆEüè3ÿÿ‹]‹Xüÿÿ‹Cÿt‹¸üÿÿ…\ûÿÿPè;õÿÿ‹ğ…üÿÿÆEüP‹Îè‡ÿÿ„ÀtIóoó…üÿÿóoFó…üÿÿóoF ó…$üÿÿóoF0ó…4üÿÿó~F@fÖ…Düÿÿ‹FH‰…Lüÿÿj …ÜüÿÿÆEüPj jh   jjÈüÿÿèuûïÿÇ…ÈüÿÿˆÓÍ…üÿÿÆEüPlüÿÿèõÿÿ„À„´   lüÿÿèBÿÿ‹Ğüÿÿ‹½Ôüÿÿ·Ğ‰•Àüÿÿ;ÏuN‹µÌüÿÿ…Àüÿÿ;Æv'+ÆÑø;Ç}‹Â‰…Äüÿÿ…ÄüÿÿjPQÈüÿÿèÔşïÿë4j…ÀüÿÿPQÈüÿÿè½şïÿë‹…ÌüÿÿH…Àt	f‰‹ĞüÿÿA‰Ğüÿÿlüÿÿè³*ÿÿ…üÿÿPlüÿÿèAÿÿ„À…Lÿÿÿj …ğşÿÿPj jh   jjÜşÿÿèxúïÿÇ…Üşÿÿ ÓÍ¬ûÿÿÆEüè_ßõÿ‹Ğüÿÿ‹ğ…Üşÿÿ‰ÔûÿÿP…ĞûÿÿP…ØûÿÿPğûÿÿèQ¦ÿÿ…ğûÿÿPÇ…düÿÿ    Ç…hüÿÿ    ‹düÿÿQ‹ÎÆEüÿ   ‹…hüÿÿÆEü…Àt
Pÿ4ÚIƒÄ‹…äşÿÿğûÿÿ‰…äûÿÿ…àûÿÿP…èûÿÿPèä¥ÿÿ€½ üÿÿ ‹½ôûÿÿu;½üûÿÿ”À„Àu&‹…ğûÿÿğûÿÿ‹pè_	 P7P‹E‹Èÿpèòüïÿóo…üÿÿ‹…LüÿÿÜşÿÿ‰…´üÿÿó…lüÿÿÆEüóo…üÿÿó…|üÿÿóo…$üÿÿó…Œüÿÿóo…4üÿÿó…œüÿÿó~…DüÿÿfÖ…¬üÿÿè§r–ÿÈüÿÿÆEüètÿÇ…üÿÿ    Ç…üÿÿÿÿÿÿÇ…üÿÿÿÿÿÿ‹…ÄûÿÿÆEü	‰…Äüÿÿ‹•Äüÿÿ¸ÿÿÿÿğÁ‰…Tüÿÿ‹…TüÿÿHuÄûÿÿè!àÍÿ°ûÿÿÆEü
è¢F÷ÿ‰…Äüÿÿ‹•Äüÿÿ¸ÿÿÿÿğÁ‰…Püÿÿ‹…PüÿÿHu°ûÿÿè“öÿ‹…¸ûÿÿÆEü‰…Äüÿÿ‹•Äüÿÿ¸ÿÿÿÿğÁ‰…\üÿÿ‹…\üÿÿHu¸ûÿÿèÊ´’ÿ‹C‹•`üÿÿ‹püÿÿÆEü ;Œøÿÿ‹C‹¼üÿÿÇEüÿÿÿÿ;Èu3ÉëA‹•¸üÿÿ‰¼üÿÿ;ÈŒá÷ÿÿ‹Môd‰    Y_^[‹Mğ3Íè^n ‹å]Â ÌÌÌU‹ìjÿhH!Äd¡    PƒìSVW¡ vø3ÅPEôd£    ‹ù‹u‹V…Ò~€~ u‹‹ÎRÿvÿP‹ÏÇF    è‚»ÿ‹}3É‹Ğ‰M‰Uè9OX  ¤$    ‹GI‹Êÿ4˜EÜPèÜÑğÿ‹G‹}àÇEü    ;|˜ê      ‹]Ü‰Eìÿuä‹ËjWè»íïÿ‹KL‹SPÁâ‰EäQ‹JÁ‰Eğè®ğÿ‹Mğ9uè²\ğÿ‹Eğ‹Hi‘H    ‹D  P‹Ç+‹J‹VA;Vu;‹^;Ëv$‹Á+ÃÑø;F}·‹Î‰EğEğjPRèúïÿ‹]Üë#jQR‹Îèqúïÿ‹]Üë‹FP…Òtf‹f‰ÿF‹ƒˆ   ‹H‹ƒŒ   ;<Áu3ÿëG‹E‹Mì‰}à‹@;<Œ#ÿÿÿ‹}‹MÇEüÿÿÿÿÇEÜ    ‹GÇEàÿÿÿÿÇEäÿÿÿÿ;Èu3ÉëA‹Uè‰M;ÈŒ¯şÿÿ‹Môd‰    Y_^[‹å]Â ÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿh½!Äd¡    PƒìHSVW¡ vø3ÅPEôd£    3Ûj8‰]ğè,õïÿ‹ğƒÄ‰uìÇEü   …öt#SSSjÿM¬èÌùúÿ»   ÆEüP‹Î‰]ğèXùşÿë3ÀPMàÇEü   èä“ñÿ‹ğèğÿ‹}‰ÇG    ‹‰‹F‰G‹Á‰Eì‹Uì¸   ğÁ‰EèƒËÇEü    öÃt!ƒãş‰]ğMÌÇEü   è—ÏÿM´ÆEüè£n–ÿ‹Ç‹Môd‰    Y_^[‹å]Â ÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhë!Äd¡    PƒìVW¡ vø3ÅPEôd£    jÇEğ    è+ôïÿ‹øƒÄ‰}ìÇEü    …ÿtƒì‹ôèN ğÿ‹Ï‰ÇF    ènÿÿë3ÀPMèÇEüÿÿÿÿèê’ñÿ‹ğè# ğÿ‹}‰ÇG    ‹‰‹N‰O‹‰M‹U¸   ğÁ‰Eä‹Ç‹Môd‰    Y_^‹å]Â ÌÌÌÌU‹ìjÿhë!Äd¡    PƒìVW¡ vø3ÅPEôd£    j(ÇEğ    èkóïÿƒÄ‰EìÇEü    …Àt	‹Èèóüşÿë3ÀPMäÇEüÿÿÿÿè?’ñÿ‹ğèxÿïÿ‹}‰ÇG    ‹‰‹N‰O‹‰M‹U¸   ğÁ‰Eì‹Ç‹Môd‰    Y_^‹å]Â ÌÌÌÌÌÌÌÌÌU‹ìjÿhë!Äd¡    PƒìVW¡ vø3ÅPEôd£    j(ÇEğ    è»òïÿƒÄ‰EìÇEü    …Àt	‹Èèóúşÿë3ÀPMäÇEüÿÿÿÿè‘ñÿ‹ğèÈşïÿ‹}‰ÇG    ‹‰‹N‰O‹‰M‹U¸   ğÁ‰Eì‹Ç‹Môd‰    Y_^‹å]Â ÌÌÌÌÌÌÌÌÌU‹ìjÿhl"Äd¡    PƒìhVW¡ vø3ÅPEôd£    ‹ñÇEì    ‹NèXøÿƒÀ(MŒPèŒ#ÏÿÿvMÔÇEü   è:÷ EŒÆEüPE°PMÔèÖ- j(ÆEüèËñïÿ‹ğƒÄ‰uèÆEü…ötƒì$E°‹ÌPè=#Ïÿ‹Îè¶úşÿë3ÀPMàÆEüè•ñÿ‹ğèÎıïÿ‹}‰ÇG    ‹‰‹F‰G‹Á‰Eğ‹Uğ¸   ğÁ‰EèÇEì   ‹EÈÆEü‰Eğ‹Uğ¸ÿÿÿÿğÁ‰Eè‹EèHuMÈè6ÙÍÿM´ÆEüèÊ×ÍÿÇE° ÇÇEÔôÌ‹E¤ÇEü   ‰Eè‹Uè¸ÿÿÿÿğÁ‰Eğ‹EğHuM¤èòØÍÿMÆEüè†×Íÿ‹Ç‹Môd‰    Y_^‹å]Â ÌU‹ìjÿhë!Äd¡    PƒìVW¡ vø3ÅPEôd£    ‹ùj(ÇEğ    è™ğïÿ‹ğƒÄ‰uìÇEü    …öt‹OèÎøÿƒÀ‹ÎPècøşÿë3ÀPMäÇEüÿÿÿÿè_ñÿ‹ğè˜üïÿ‹}‰ÇG    ‹‰‹N‰O‹‰M‹U¸   ğÁ‰Eì‹Ç‹Môd‰    Y_^‹å]Â ÌÌÌÌÌÌÌÌÌV‹ñèHüïÿ9t'W‹ÎèÜûïÿ‹~…ÿt‹Ïè^@yÿWè–V ƒÄÇF    _^ÃÌÌÌÌÌÌÌÌÌÌÌV‹qèüïÿ3É;ğ^•ÀÃÌÌÌÌÌÌÌÌÌÌÌÌÌÌU‹ìjÿhÉÂd¡    PƒìV¡ vø3ÅPEôd£    ‹ñèC>ñÿ‰EÜ‹Îj EØÇEØ    PÆEà èˆsñÿ‹ÎèÑiñÿ„ÀuGEäPèT©ğÿƒÄPj ‹ÎÇEü    èàgñÿ‹EäÇEüÿÿÿÿ‰Eğ‹Uğ¸ÿÿÿÿğÁ‰Eì‹EìHuMäè×Íÿ‹Môd‰    Y^‹å]ÃÌÌÌÌÌÌU‹ìƒìVjh|Bh¬Xj ÿuè¡^ ƒÄMì‹ğèö¦ÿÿP‹Îè>Ìÿÿ^‹å]Â ÌÌÌÌÌÌÌU‹ìjÿh¹"Äd¡    Pƒì(SVW¡ vø3ÅPEôd£    ‹ùÇEğ    ÿu‹u‹]VSÇEü    èH=ñÿƒ~ ÇEü    ÇEğ   „é  ‹v‹Ïè=ñÿ9Œ×  è‰úïÿ9‡”  uèŒTğÿ‹·˜  ‹Ïèï<ñÿ‹  ‰uà‰EÇEì    ‹Q‹  u‹Ê;ÈU‰MMÖEìMàƒ: MÂ‹ ‰EäèœÑğÿ‹}ä‹uà‹Uè‰uĞ‰}Ô‰UØ…ÿ„[  ‹†  ‹H‹†  ;<Á‹†”   ‹H‹†˜   u‹ÁëRƒ<ÁuÇ†<      ëFƒ¾,   t-‹,  IÇE    ˜À„À‹†(  EM;<ˆ}RW‹Îèôüğÿë
jW‹Îèˆÿğÿ‰†<  ‹†”   ‹–<  ‰U‰UØ‹H‹†˜   ;Áu‹†  ‹H‹†  ‹ÁëR‹ÎèÖñÿ‹†(  ‹M‹ˆ+ø…‹   EÜPMĞèf  ‹uà‹UäJÇEü   ‰Uä‹†ˆ   ‹H‹†Œ   ‹Áx;Ğ~‹Ğ‰Uäó~Eà‹}Ü‹Eè‰}ÌfÖEĞ‰EØ‹†ˆ   ‹Œ   ÆEü‹@‹4ÈƒÉÿ‹EÔ;ÖDÁƒÀ‰EÔx;Æ~‹Æ‰EÔPR‹ÏèÇİğÿ‹Ã‹Môd‰    Y_^[‹å]Â ÌU‹ìjÿh#Äd¡    Pì  SVW¡ vø3ÅPEôd£    ‹Ù‰]ğ‹u…äşÿÿVPèğåÿÿ…0ÿÿÿÇEü    Päşÿÿè'ÿÿ‹E‰0‰p‹³Œ  è4øïÿ;ğu2À‹Môd‰    Y_^[‹å]Â èøïÿ9ƒŒ  uèRğÿ‹“  ‹µ0ÿÿÿ‰UÌ‰uÈ‹‚  ÇEì    ‹H‹‚  UÈ‹Á;ÆM‰EMÊEìƒ9 MÁMÌ‹ ‰EĞè)Ïğÿ‹EÌM¼‰E¼‹EĞ‰EÀ‹EÔ‰EÄEØPè»S ÿuä‹uà‹]Ü‹ËjVÆEüètgĞÿ‹KP‹Ğ‹CLÁá‰UäH‹A<Ğèh÷ïÿ9uèoQğÿ‹O‹¤   k‰¨   |H‹Æ+‹Q@<Âè:÷ïÿ9Guè@Qğÿ‹O…LÿÿÿPƒÁènĞõÿ‹Èè÷Éıÿ…LÿÿÿÆEüPpÿÿÿè‘Ïÿ…pÿÿÿÆEüPLÿÿÿèKÎõÿ„À„Ã  ‹}Ø‹‡”   ‹H‹‡˜   ‹ÁH;ğ}F‹ÏPè>ñÿ‹‡”   ‹H‹‡˜   ;4Áu‹‡  ‹H‹‡  ‹ÁëV‹Ïèñÿ‹‡(  ‹°‹M‰…ö„X  ‹ƒˆ   N‰uà‹H‹ƒŒ   ‹Áx;ğ~‹ğ‰uàÿuä‹ËjVè:fĞÿ‹KL‹SPÁâ‰EäQ‹JÁ‰Eè-öïÿ‹M9uè1Pğÿ‹E‹H‹¤   k‰¨   |H‹Æ+@Å   A‰Eèòõïÿ‹M9uèöOğÿ‹E‹HE˜PƒÁè$Ïõÿ‹Èè­ÈıÿPpÿÿÿÆEüèıÉÏÿ‹E°ÆEü‰E‹U¸ÿÿÿÿğÁ‰Eì‹EìHuM°èVÑÍÿEœ‰E”‹ÈÆEüèÕ7÷ÿ‰E‹U¸ÿÿÿÿğÁ‰EÈ‹EÈHuMœèÕpöÿ‹E¤ÆEü‰E‹U¸ÿÿÿÿğÁ‰Eè‹EèHuM¤è¦’ÿ…pÿÿÿÆEüPLÿÿÿèˆÌõÿ„À…@şÿÿèõïÿ‹uğ9†Œ  uèOğÿ‹–  ‹µ0ÿÿÿ‰UÌ‰uğ‹‚  ÇEè    ‹H‹‚  Uğ‹Á;ÆM‰EMÊEèƒ9 MÁMÌ‹ ‰EĞè,Ìğÿ‹EÌM¼‰…@ÿÿÿ‹EĞ‰…Dÿÿÿ‹EÔó~…@ÿÿÿ‰EÄ…<ÿÿÿPfÖE¼è¨P óofoÁark-mode .custom-control-input-dark:not(:disabled):active ~ .custom-control-label::before {
  background-color: #88939e;
  border-color: #88939e;
}

.dark-mode .custom-control-input-lightblue:checked ~ .custom-control-label::before {
  border-color: #86bad8;
  background-color: #86bad8;
}

.dark-mode .custom-control-input-lightblue.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2386bad8' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-lightblue.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%2386bad8'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-lightblue:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(134, 186, 216, 0.25);
}

.dark-mode .custom-control-input-lightblue:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #e6f1f7;
}

.dark-mode .custom-control-input-lightblue:not(:disabled):active ~ .custom-control-label::before {
  background-color: white;
  border-color: white;
}

.dark-mode .custom-control-input-navy:checked ~ .custom-control-label::before {
  border-color: #002c59;
  background-color: #002c59;
}

.dark-mode .custom-control-input-navy.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23002c59' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-navy.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23002c59'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-navy:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(0, 44, 89, 0.25);
}

.dark-mode .custom-control-input-navy:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #006ad8;
}

.dark-mode .custom-control-input-navy:not(:disabled):active ~ .custom-control-label::before {
  background-color: #0c84ff;
  border-color: #0c84ff;
}

.dark-mode .custom-control-input-olive:checked ~ .custom-control-label::before {
  border-color: #74c8a3;
  background-color: #74c8a3;
}

.dark-mode .custom-control-input-olive.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2374c8a3' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-olive.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%2374c8a3'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-olive:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(116, 200, 163, 0.25);
}

.dark-mode .custom-control-input-olive:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #cfecdf;
}

.dark-mode .custom-control-input-olive:not(:disabled):active ~ .custom-control-label::before {
  background-color: #f4fbf8;
  border-color: #f4fbf8;
}

.dark-mode .custom-control-input-lime:checked ~ .custom-control-label::before {
  border-color: #67ffa9;
  background-color: #67ffa9;
}

.dark-mode .custom-control-input-lime.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2367ffa9' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-lime.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%2367ffa9'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-lime:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(103, 255, 169, 0.25);
}

.dark-mode .custom-control-input-lime:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #e7fff1;
}

.dark-mode .custom-control-input-lime:not(:disabled):active ~ .custom-control-label::before {
  background-color: white;
  border-color: white;
}

.dark-mode .custom-control-input-fuchsia:checked ~ .custom-control-label::before {
  border-color: #f672d8;
  background-color: #f672d8;
}

.dark-mode .custom-control-input-fuchsia.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23f672d8' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-fuchsia.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23f672d8'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-fuchsia:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(246, 114, 216, 0.25);
}

.dark-mode .custom-control-input-fuchsia:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #feeaf9;
}

.dark-mode .custom-control-input-fuchsia:not(:disabled):active ~ .custom-control-label::before {
  background-color: white;
  border-color: white;
}

.dark-mode .custom-control-input-maroon:checked ~ .custom-control-label::before {
  border-color: #ed6c9b;
  background-color: #ed6c9b;
}

.dark-mode .custom-control-input-maroon.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23ed6c9b' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-maroon.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23ed6c9b'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-maroon:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(237, 108, 155, 0.25);
}

.dark-mode .custom-control-input-maroon:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #fbdee8;
}

.dark-mode .custom-control-input-maroon:not(:disabled):active ~ .custom-control-label::before {
  background-color: white;
  border-color: white;
}

.dark-mode .custom-control-input-blue:checked ~ .custom-control-label::before {
  border-color: #3f6791;
  background-color: #3f6791;
}

.dark-mode .custom-control-input-blue.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%233f6791' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-blue.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%233f6791'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-blue:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(63, 103, 145, 0.25);
}

.dark-mode .custom-control-input-blue:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #85a7ca;
}

.dark-mode .custom-control-input-blue:not(:disabled):active ~ .custom-control-label::before {
  background-color: #a9c1da;
  border-color: #a9c1da;
}

.dark-mode .custom-control-input-indigo:checked ~ .custom-control-label::before {
  border-color: #6610f2;
  background-color: #6610f2;
}

.dark-mode .custom-control-input-indigo.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%236610f2' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-indigo.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%236610f2'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-indigo:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(102, 16, 242, 0.25);
}

.dark-mode .custom-control-input-indigo:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #b389f9;
}

.dark-mode .custom-control-input-indigo:not(:disabled):active ~ .custom-control-label::before {
  background-color: #d2b9fb;
  border-color: #d2b9fb;
}

.dark-mode .custom-control-input-purple:checked ~ .custom-control-label::before {
  border-color: #6f42c1;
  background-color: #6f42c1;
}

.dark-mode .custom-control-input-purple.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%236f42c1' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-purple.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%236f42c1'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-purple:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(111, 66, 193, 0.25);
}

.dark-mode .custom-control-input-purple:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #b8a2e0;
}

.dark-mode .custom-control-input-purple:not(:disabled):active ~ .custom-control-label::before {
  background-color: #d5c8ed;
  border-color: #d5c8ed;
}

.dark-mode .custom-control-input-pink:checked ~ .custom-control-label::before {
  border-color: #e83e8c;
  background-color: #e83e8c;
}

.dark-mode .custom-control-input-pink.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23e83e8c' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-pink.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23e83e8c'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-pink:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(232, 62, 140, 0.25);
}

.dark-mode .custom-control-input-pink:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #f6b0d0;
}

.dark-mode .custom-control-input-pink:not(:disabled):active ~ .custom-control-label::before {
  background-color: #fbddeb;
  border-color: #fbddeb;
}

.dark-mode .custom-control-input-red:checked ~ .custom-control-label::before {
  border-color: #e74c3c;
  background-color: #e74c3c;
}

.dark-mode .custom-control-input-red.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23e74c3c' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-red.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23e74c3c'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-red:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(231, 76, 60, 0.25);
}

.dark-mode .custom-control-input-red:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #f5b4ae;
}

.dark-mode .custom-control-input-red:not(:disabled):active ~ .custom-control-label::before {
  background-color: #fbdedb;
  border-color: #fbdedb;
}

.dark-mode .custom-control-input-orange:checked ~ .custom-control-label::before {
  border-color: #fd7e14;
  background-color: #fd7e14;
}

.dark-mode .custom-control-input-orange.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23fd7e14' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-orange.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23fd7e14'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-orange:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(253, 126, 20, 0.25);
}

.dark-mode .custom-control-input-orange:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #fec392;
}

.dark-mode .custom-control-input-orange:not(:disabled):active ~ .custom-control-label::before {
  background-color: #ffdfc5;
  border-color: #ffdfc5;
}

.dark-mode .custom-control-input-yellow:checked ~ .custom-control-label::before {
  border-color: #f39c12;
  background-color: #f39c12;
}

.dark-mode .custom-control-input-yellow.custom-control-input-outline:checked[type="checkbox"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23f39c12' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-yellow.custom-control-input-outline:checked[type="radio"] ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%23f39c12'/%3E%3C/svg%3E") !important;
}

.dark-mode .custom-control-input-yellow:focus ~ .custom-control-label::before {
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0), 0 0 0 0.2rem rgba(243, 156, 18, 0.25);
}

.dark-mode .custom-control-input-yellow:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #f9cf8b;
}

.dark-mode .custom-control-input-yellow:not(:disabled):active ~ .custom-control-label::before {
  background-color: #fce3bc;
  border-co-container--default .select2-green .select2-selection--multiple .select2-selection__choice__remove,.select2-green .select2-container--default .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.select2-container--default .select2-green .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-green .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.select2-container--default .select2-green.select2-container--focus .select2-selection--multiple,.select2-green .select2-container--default.select2-container--focus .select2-selection--multiple{border-color:#71dd8a}.select2-teal+.select2-container--default.select2-container--open .select2-selection--single{border-color:#7eeaca}.select2-teal+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#7eeaca}.select2-container--default .select2-teal .select2-dropdown .select2-search__field:focus,.select2-container--default .select2-teal .select2-search--inline .select2-search__field:focus,.select2-container--default .select2-teal.select2-dropdown .select2-search__field:focus,.select2-teal .select2-container--default .select2-dropdown .select2-search__field:focus,.select2-teal .select2-container--default .select2-search--inline .select2-search__field:focus,.select2-teal .select2-container--default.select2-dropdown .select2-search__field:focus{border:1px solid #7eeaca}.select2-container--default .select2-teal .select2-results__option--highlighted,.select2-teal .select2-container--default .select2-results__option--highlighted{background-color:#20c997;color:#fff}.select2-container--default .select2-teal .select2-results__option--highlighted[aria-selected],.select2-container--default .select2-teal .select2-results__option--highlighted[aria-selected]:hover,.select2-teal .select2-container--default .select2-results__option--highlighted[aria-selected],.select2-teal .select2-container--default .select2-results__option--highlighted[aria-selected]:hover{background-color:#1ebc8d;color:#fff}.select2-container--default .select2-teal .select2-selection--multiple:focus,.select2-teal .select2-container--default .select2-selection--multiple:focus{border-color:#7eeaca}.select2-container--default .select2-teal .select2-selection--multiple .select2-selection__choice,.select2-teal .select2-container--default .select2-selection--multiple .select2-selection__choice{background-color:#20c997;border-color:#1cb386;color:#fff}.select2-container--default .select2-teal .select2-selection--multiple .select2-selection__choice__remove,.select2-teal .select2-container--default .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.select2-container--default .select2-teal .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-teal .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.select2-container--default .select2-teal.select2-container--focus .select2-selection--multiple,.select2-teal .select2-container--default.select2-container--focus .select2-selection--multiple{border-color:#7eeaca}.select2-cyan+.select2-container--default.select2-container--open .select2-selection--single{border-color:#63d9ec}.select2-cyan+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#63d9ec}.select2-container--default .select2-cyan .select2-dropdown .select2-search__field:focus,.select2-container--default .select2-cyan .select2-search--inline .select2-search__field:focus,.select2-container--default .select2-cyan.select2-dropdown .select2-search__field:focus,.select2-cyan .select2-container--default .select2-dropdown .select2-search__field:focus,.select2-cyan .select2-container--default .select2-search--inline .select2-search__field:focus,.select2-cyan .select2-container--default.select2-dropdown .select2-search__field:focus{border:1px solid #63d9ec}.select2-container--default .select2-cyan .select2-results__option--highlighted,.select2-cyan .select2-container--default .select2-results__option--highlighted{background-color:#17a2b8;color:#fff}.select2-container--default .select2-cyan .select2-results__option--highlighted[aria-selected],.select2-container--default .select2-cyan .select2-results__option--highlighted[aria-selected]:hover,.select2-cyan .select2-container--default .select2-results__option--highlighted[aria-selected],.select2-cyan .select2-container--default .select2-results__option--highlighted[aria-selected]:hover{background-color:#1596aa;color:#fff}.select2-container--default .select2-cyan .select2-selection--multiple:focus,.select2-cyan .select2-container--default .select2-selection--multiple:focus{border-color:#63d9ec}.select2-container--default .select2-cyan .select2-selection--multiple .select2-selection__choice,.select2-cyan .select2-container--default .select2-selection--multiple .select2-selection__choice{background-color:#17a2b8;border-color:#148ea1;color:#fff}.select2-container--default .select2-cyan .select2-selection--multiple .select2-selection__choice__remove,.select2-cyan .select2-container--default .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.select2-container--default .select2-cyan .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-cyan .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.select2-container--default .select2-cyan.select2-container--focus .select2-selection--multiple,.select2-cyan .select2-container--default.select2-container--focus .select2-selection--multiple{border-color:#63d9ec}.select2-white+.select2-container--default.select2-container--open .select2-selection--single{border-color:#fff}.select2-white+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#fff}.select2-container--default .select2-white .select2-dropdown .select2-search__field:focus,.select2-container--default .select2-white .select2-search--inline .select2-search__field:focus,.select2-container--default .select2-white.select2-dropdown .select2-search__field:focus,.select2-white .select2-container--default .select2-dropdown .select2-search__field:focus,.select2-white .select2-container--default .select2-search--inline .select2-search__field:focus,.select2-white .select2-container--default.select2-dropdown .select2-search__field:focus{border:1px solid #fff}.select2-container--default .select2-white .select2-results__option--highlighted,.select2-white .select2-container--default .select2-results__option--highlighted{background-color:#fff;color:#1f2d3d}.select2-container--default .select2-white .select2-results__option--highlighted[aria-selected],.select2-container--default .select2-white .select2-results__option--highlighted[aria-selected]:hover,.select2-white .select2-container--default .select2-results__option--highlighted[aria-selected],.select2-white .select2-container--default .select2-results__option--highlighted[aria-selected]:hover{background-color:#f7f7f7;color:#1f2d3d}.select2-container--default .select2-white .select2-selection--multiple:focus,.select2-white .select2-container--default .select2-selection--multiple:focus{border-color:#fff}.select2-container--default .select2-white .select2-selection--multiple .select2-selection__choice,.select2-white .select2-container--default .select2-selection--multiple .select2-selection__choice{background-color:#fff;border-color:#f2f2f2;color:#1f2d3d}.select2-container--default .select2-white .select2-selection--multiple .select2-selection__choice__remove,.select2-white .select2-container--default .select2-selection--multiple .select2-selection__choice__remove{color:rgba(31,45,61,.7)}.select2-container--default .select2-white .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-white .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover{color:#1f2d3d}.select2-container--default .select2-white.select2-container--focus .select2-selection--multiple,.select2-white .select2-container--default.select2-container--focus .select2-selection--multiple{border-color:#fff}.select2-gray+.select2-container--default.select2-container--open .select2-selection--single{border-color:#afb5ba}.select2-gray+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#afb5ba}.select2-container--default .select2-gray .select2-dropdown .select2-search__field:focus,.select2-container--default .select2-gray .select2-search--inline .select2-search__field:focus,.select2-container--default .select2-gray.select2-dropdown .select2-search__field:focus,.select2-gray .select2-container--default .select2-dropdown .select2-search__field:focus,.select2-gray .select2-container--default .select2-search--inline .select2-search__field:focus,.select2-gray .select2-container--default.select2-dropdown .select2-search__field:focus{border:1px solid #afb5ba}.select2-container--default .select2-gray .select2-results__option--highlighted,.select2-gray .select2-container--default .select2-results__option--highlighted{background-color:#6c757d;color:#fff}.select2-container--default .select2-gray .select2-results__option--highlighted[aria-selected],.select2-container--default .select2-gray .select2-results__option--highlighted[aria-selected]:hover,.select2-gray .select2-container--default .select2-results__option--highlighted[aria-selected],.select2-gray .select2-container--default .select2-results__option--highlighted[aria-selected]:hover{background-color:#656d75;color:#fff}.select2-container--default .select2-gray .select2-selection--multiple:focus,.select2-gray .select2-container--default .select2-selection--multiple:focus{border-color:#afb5ba}.select2-container--default .select2-gray .select2-selection--multiple .select2-selection__choice,.select2-gray .select2-container--default .select2-selection--multiple .select2-selection__choice{background-color:#6c757d;border-color:#60686f;color:#fff}.select2-container--default .select2-gray .select2-selection--multiple .select2-selection__choice__remove,.select2-gray .select2-container--default .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.select2-container--default .select2-gray .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-gray .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.select2-container--default .select2-gray.select2-container--focus .select2-selection--multiple,.select2-gray .select2-container--default.select2-container--focus .select2-selection--multiple{border-color:#afb5ba}.select2-gray-dark+.select2-container--default.select2-container--open .select2-selection--single{border-color:#6d7a86}.select2-gray-dark+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#6d7a86}.select2-container--default .select2-gray-dark .select2-dropdown .select2-search__field:focus,.select2-container--default .select2-gray-dark .select2-search--inline .select2-search__field:focus,.select2-container--default .select2-gray-dark.select2-dropdown .select2-search__field:focus,.select2-gray-dark .select2-container--default .select2-dropdown .select2-search__field:focus,.select2-gray-dark .select2-container--default .select2-search--inline .select2-search__field:focus,.select2-gray-dark .select2-container--default.select2-dropdown .select2-search__field:focus{border:1px solid #6d7a86}.select2-container--default .select2-gray-dark .select2-results__option--highlighted,.select2-gray-dark .select2-container--default .select2-results__option--highlighted{background-color:#343a40;color:#fff}.select2-container--default .select2-gray-dark .select2-results__option--highlighted[aria-selected],.select2-container--default .select2-gray-dark .select2-results__option--highlighted[aria-selected]:hover,.select2-gray-dark .select2-container--default .select2-results__option--highlighted[aria-selected],.select2-gray-dark .select2-container--default .select2-results__option--highlighted[aria-selected]:hover{background-color:#2d3238;color:#fff}.select2-container--default .select2-gray-dark .select2-selection--multiple:focus,.select2-gray-dark .select2-container--default .select2-selection--multiple:focus{border-color:#6d7a86}.select2-container--default .select2-gray-dark .select2-selection--multiple .select2-selection__choice,.select2-gray-dark .select2-container--default .select2-selection--multiple .select2-selection__choice{background-color:#343a40;border-color:#292d32;color:#fff}.select2-container--default .select2-gray-dark .select2-selection--multiple .select2-selection__choice__remove,.select2-gray-dark .select2-container--default .select2-selection--multiple .select2-selection__choice__remove{color:rgba(255,255,255,.7)}.select2-container--default .select2-gray-dark .select2-selection--multiple .select2-selection__choice__remove:hover,.select2-gray-dark .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover{color:#fff}.select2-container--default .select2-gray-dark.select2-container--focus .select2-selection--multiple,.select2-gray-dark .select2-container--default.select2-container--focus .select2-selection--multiple{border-color:#6d7a86}.dark-mode .select2-selection{background-color:#343a40;border-color:#6c757d}.dark-mode .select2-container--disabled .select2-selection--single{background-color:#454d55}.dark-mode .select2-selection--single{background-color:#343a40;border-color:#6c757d}.dark-mode .select2-selection--single .select2-selection__rendered{color:#fff}.dark-mode .select2-dropdown .select2-search__field,.dark-mode .select2-search--inline .select2-search__field{background-color:#343a40;border-color:#6c757d;color:#fff}.dark-mode .select2-dropdown{background-color:#343a40;border-color:#6c757d;color:#fff}.dark-mode .select2-results__option[aria-selected=true]{background-color:#3f474e!important;color:#dee2e6}.dark-mode .select2-container .select2-search--inline .select2-search__field{background-color:transparent;color:#fff}.dark-mode .select2-container--bootstrap4 .select2-selection--multiple .select2-selection__choice{color:#fff}.dark-mode .select2-primary+.select2-container--default.select2-container--open .select2-selection--single{border-color:#85a7ca}.dark-mode .select2-primary+.select2-container--default.select2-container--focus .select2-selection--single{border-color:#85a7ca}.dark-mode .select2-primary .select2-container--default .select2-dropdown .select2-search__field:focus,.dark-mode .select2-primary .select2-container--default .select2-search--inline .select2-search__field:focus,.dark-mode .select2-primary .select2-container--default.select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-primary .select2-dropdown .select2-search__field:focus,.select2-container--default .dark-mode .select2-primary .select2-search--inline .select2-search__field:focus,.select2-container--default .dark-mode .select2-primary.select2-dropdown .select2-search__field:focus{border:1px solid #85a7ca}.dark-mode .select2-primary .select2-container--default .select2-results__option--highlighted,.select2-container--default .dark-mode .select2-primary .select2-results__option--highlighted{background-color:#3f6791;color:#fff}.dark-mode .select2-primary .select2-container--default .select2-results__option--highlighted[aria-selected],.dark-mode .select2-primary .select2-container--default .select2-results__option--highlighted[aria-selected]:hover,.select2-container--default .dark-mode .select2-primary .select2-results__option--highlighted[aria-selected],.select2-container--default .dark-mode .select2-primary .select2-results__option--highlighted[aria-selected]:hover{background-color:#3a5f86;color:#fff}.dark-mode .select2-primary .select2-container--default .select2-selection--multiple:focus,.select2-container--default .dark-mode .select2-primary .select2-selection--multiple:focus{border-color:#85a7ca}.dark-mode .select2-primary .select2-container--default .select2-selection--multiple .select2-selection__choice,.select2-container--default .dark-m-navbar):not(.form-control-sidebar),\n  .custom-select,\n  .custom-file-label,\n  .custom-file-label::after,\n  .custom-control-label::before,\n  .input-group-text {\n    background-color: $dark;\n    color: $white;\n  }\n  .form-control:not(.form-control-navbar):not(.form-control-sidebar):not(.is-invalid):not(:focus),\n  .custom-file-label,\n  .custom-file-label::after {\n    border-color: $gray-600;\n  }\n  select {\n    background-color: $dark;\n    color: $white;\n    border-color: $gray-600;\n  }\n\n  .custom-select {\n    background: $dark $custom-select-dark-background;\n\n    &[multiple]{\n      background: $dark;\n    }\n  }\n\n  .input-group-text {\n    border-color: $gray-600;\n  }\n\n  .custom-control-input:disabled ~ .custom-control-label::before,\n  .custom-control-input[disabled] ~ .custom-control-label::before {\n    background-color: lighten($dark, 5%);\n    border-color: $gray-600;\n    color: $white;\n  }\n\n  input:-webkit-autofill,\n  input:-webkit-autofill:hover,\n  input:-webkit-autofill:focus,\n  textarea:-webkit-autofill,\n  textarea:-webkit-autofill:hover,\n  textarea:-webkit-autofill:focus,\n  select:-webkit-autofill,\n  select:-webkit-autofill:hover,\n  select:-webkit-autofill:focus {\n    -webkit-text-fill-color: $white;\n  }\n\n  .custom-range {\n    &::-webkit-slider-runnable-track {\n      background-color: lighten($dark, 7.5%);\n    }\n    &::-moz-range-track {\n      background-color: lighten($dark, 7.5%);\n    }\n    &::-ms-track {\n      background-color: lighten($dark, 7.5%);\n    }\n\n    @each $name, $color in $theme-colors-alt {\n      @include custom-range-variant($name, $color);\n    }\n\n    @each $name, $color in $colors-alt {\n      @include custom-range-variant($name, $color);\n    }\n  }\n\n  // custom switch color variations\n  .custom-switch {\n    @each $name, $color in $theme-colors-alt {\n      @include custom-switch-variant($name, $color);\n    }\n\n    @each $name, $color in $colors-alt {\n      @include custom-switch-variant($name, $color);\n    }\n  }\n\n  @each $name, $color in $theme-colors-alt {\n    @include custom-control-input-variant($name, $color);\n  }\n\n  @each $name, $color in $colors-alt {\n    @include custom-control-input-variant($name, $color);\n  }\n}\n","//\n// Mixins: Custom Forms\n//\n\n// Custom Switch Variant\n@mixin custom-switch-variant($name, $color) {\n  &.custom-switch-off-#{$name} {\n    .custom-control-input ~ .custom-control-label::before {\n      background-color: #{$color};\n      border-color: darken($color, 20%);\n    }\n\n    .custom-control-input:focus ~ .custom-control-label::before {\n      box-shadow: 0 0 0 1px $body-bg, 0 0 0 2px rgba($color, .25);\n    }\n\n    .custom-control-input ~ .custom-control-label::after {\n      background-color: darken($color, 25%);\n    }\n  }\n\n  &.custom-switch-on-#{$name} {\n    .custom-control-input:checked ~ .custom-control-label::before {\n      background-color: #{$color};\n      border-color: darken($color, 20%);\n    }\n\n    .custom-control-input:checked:focus ~ .custom-control-label::before {\n      box-shadow: 0 0 0 1px $body-bg, 0 0 0 2px rgba($color, .25);\n    }\n\n    .custom-control-input:checked ~ .custom-control-label::after {\n      background-color: lighten($color, 30%);\n    }\n  }\n}\n\n// Custom Range Variant\n@mixin custom-range-variant($name, $color) {\n  &.custom-range-#{$name} {\n    &:focus {\n      outline: none;\n\n      &::-webkit-slider-thumb {\n        box-shadow: 0 0 0 1px $body-bg, 0 0 0 2px rgba($color, .25);\n      }\n\n      &::-moz-range-thumb     {\n        box-shadow: 0 0 0 1px $body-bg, 0 0 0 2px rgba($color, .25);\n      }\n\n      &::-ms-thumb            {\n        box-shadow: 0 0 0 1px $body-bg, 0 0 0 2px rgba($color, .25);\n      }\n    }\n\n    &::-webkit-slider-thumb {\n      background-color: $color;\n\n      &:active {\n        background-color: lighten($color, 35%);\n      }\n    }\n\n    &::-moz-range-thumb {\n      background-color: $color;\n\n      &:active {\n        background-color: lighten($color, 35%);\n      }\n    }\n\n    &::-ms-thumb {\n      background-color: $color;\n\n      &:active {\n        background-color: lighten($color, 35%);\n      }\n    }\n  }\n}\n\n\n// Custom Control Input Variant\n@mixin custom-control-input-variant($name, $color) {\n  $custom-control-indicator-checked-color: $color;\n  $custom-checkbox-indicator-icon-checked: str-replace(url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='#{$custom-control-indicator-checked-color}' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3E%3C/svg%3E\"), \"#\", \"%23\");\n  $custom-radio-indicator-icon-checked: str-replace(url(\"data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='#{$custom-control-indicator-checked-color}'/%3E%3C/svg%3E\"), \"#\", \"%23\");\n\n  .custom-control-input-#{$name} {\n    &:checked ~ .custom-control-label::before {\n      border-color: $color;\n      @include gradient-bg($color);\n    }\n\n    &.custom-control-input-outline:checked {\n      &[type=\"checkbox\"] ~ .custom-control-label::after {\n        background-image: $custom-checkbox-indicator-icon-checked !important;\n      }\n      &[type=\"radio\"] ~ .custom-control-label::after {\n        background-image: $custom-radio-indicator-icon-checked !important;\n      }\n    }\n\n    &:focus ~ .custom-control-label::before {\n      // the mixin is not used here to make sure there is feedback\n      @if $enable-shadows {\n        box-shadow: $input-box-shadow, 0 0 0 $input-btn-focus-width rgba($color, .25);\n      } @else {\n        box-shadow: 0 0 0 $input-btn-focus-width rgba($color, .25);\n      }\n    }\n\n    &:focus:not(:checked) ~ .custom-control-label::before {\n      border-color: lighten($color, 25%);\n    }\n\n    &:not(:disabled):active ~ .custom-control-label::before {\n      background-color: lighten($color, 35%);\n      border-color: lighten($color, 35%);\n    }\n  }\n}\n","//\n// Component: Progress Bar\n//\n\n//General CSS\n.progress {\n  @include box-shadow(none);\n  @include border-radius($progress-bar-border-radius);\n\n  // Vertical bars\n  &.vertical {\n    display: inline-block;\n    height: 200px;\n    margin-right: 10px;\n    position: relative;\n    width: 30px;\n\n    > .progress-bar {\n      bottom: 0;\n      position: absolute;\n      width: 100%;\n    }\n\n    //Sizes\n    &.sm,\n    &.progress-sm {\n      width: 20px;\n    }\n\n    &.xs,\n    &.progress-xs {\n      width: 10px;\n    }\n\n    &.xxs,\n    &.progress-xxs {\n      width: 3px;\n    }\n  }\n}\n\n.progress-group {\n  margin-bottom: map-get($spacers, 2);\n}\n\n// size variation\n.progress-sm {\n  height: 10px;\n}\n\n.progress-xs {\n  height: 7px;\n}\n\n.progress-xxs {\n  height: 3px;\n}\n\n// Remove margins from progress bars when put in a table\n.table {\n  tr > td {\n    .progress {\n      margin: 0;\n    }\n  }\n}\n\n@include dark-mode () {\n  .progress {\n    background: lighten($dark, 7.5%);\n  }\n}\n","//\n// Mixins: Cards Variant\n//\n\n@mixin cards-variant($name, $color) {\n  .card-#{$name} {\n    &:not(.card-outline) {\n      > .card-header {\n        background-color: $color;\n\n        &,\n        a {\n          color: color-yiq($color);\n        }\n\n        a.active {\n          color: color-yiq($white);\n        }\n      }\n    }\n\n    &.card-outline {\n      border-top: 3px solid $color;\n    }\n\n    &.card-outline-tabs {\n      > .card-header {\n        a:hover{\n          border-top: 3px solid $nav-tabs-border-color;\n        }\n        a.active,\n        a.active:hover{\n          border-top: 3px solid $color;\n        }\n      }\n    }\n  }\n\n  .bg-#{$name},\n  .bg-gradient-#{$name},\n  .card-#{$name}:not(.card-outline) {\n    > .card-header {\n      .btn-tool {\n        color: rgba(color-yiq($color), .8);\n\n        &:hover {\n          color: color-yiq($color);\n        }\n      }\n    }\n  }\n\n  .card.bg-#{$name},\n  .card.bg-gradient-#{$name} {\n    .bootstrap-datetimepicker-widget {\n      .table td,\n      .table th {\n        border: none;\n      }\n\n      table thead tr:first-child th:hover,\n      table td.day:hover,\n      table td.hour:hover,\n      table td.minute:hover,\n      table td.second:hover {\n        background-color: darken($color, 8%);\n        color: color-yiq($color);\n      }\n\n      table td.today::before {\n        border-bottom-color: color-yiq($color);\n      }\n\n      table td.active,\n      table td.active:hover {\n        background-color: lighten($color, 10%);\n        color: color-yiq($color);\n      }\n    }\n  }\n}\n\n","//\n// Component: Cards\n//\n\n// Color variants\n@each $name, $color in $theme-colors {\n  @include cards-variant($name, $color);\n}\n\n@each $name, $color in $colors {\n  @include cards-variant($name, $color);\n}\n\n.card {\n  @include box-shadow($card-shadow);\n  margin-bottom: map-get($spacers, 3);\n\n  &.bg-dark {\n    .card-header {\n      border-color: $card-dark-border-color;\n    }\n\n    &,\n    .card-body {\n      color: $white;\n    }\n  }\n\n  &.maximized-card {\n    height: 100% !important;\n    left: 0;\n    max-height: 100% !important;\n    max-width: 100% !important;\n    position: fixed;\n    top: 0;\n    width: 100% !important;\n    z-index: $zindex-modal-backdrop;\n\n    &.was-collapsed .card-body {\n      display: block !important;\n    }\n\n    .card-body {\n      overflow: auto;\n    }\n\n    [data-card-widgett=\"collapse\"] {\n      display: none;\n    }\n\n    .card-header,\n    .card-footer {\n      @include border-radius(0 !important);\n    }\n  }\n\n  // collapsed mode\n  &.collapsed-card {\n    .card-body,\n    .card-footer {\n      display: none;\n    }\n  }\n\n  .nav.flex-column:not(.nav-sidebar) {\n    > li {\n      border-bottom: 1px solid $card-border-color;\n      margin: 0;\n\n      &:last-of-type {\n        border-bottom: 0;\n      }\n    }\n  }\n\n  // fixed height to 300px\n  &.height-control {\n    .card-body {\n      max-height: 300px;\n      overflow: auto;\n    }\n  }\n\n  .border-right {\n    border-right: 1px solid $card-border-color;\n  }\n\n  .border-left {\n    border-left: 1px solid $card-border-color;\n  }\n\n  &.card-tabs {\n    &:not(.card-outline) {\n      > .card-header {\n        border-bottom: 0;\n\n        .nav-item {\n          &:first-child .nav-link {\n            border-left-color: transparent;\n          }\n        }\n      }\n    }\n\n    &.card-outline {\n      .nav-item {\n        border-bottom: 0;\n\n        &:first-child .nav-link {\n          border-left: 0;\n          margin-left: 0;\n        }\n      }\n    }\n\n    .card-tools {\n      margin: .3rem .5rem;\n    }\n\n    &:not(.expanding-card).collapsed-card {\n      .card-header {\n        border-bottom: 0;\n\n        .nav-tabs {\n          border-bottom: 0;\n\n          .nav-item {\n            margin-bottom: 0;\n          }\n        }\n      }\n    }\n\n    &.expanding-card {\n      .card-header {\n        .nav-tabs {\n          .nav-item {\n            margin-bottom: -1px;\n          }\n        }\n      }\n    }\n  }\n\n  &.card-outline-tabs {\n    border-top: 0;\n\n    .card-header {\n      .nav-item {\n        &:first-child .nav-link {\n          border-left: 0;\n          margin-left: 0;\n        }\n      }\n\n      a {\n        border-top: 3px solid transparent;\n\n        &:hover {\n          border-top: 3px solid $nav-tabs-border-color;\n        }\n\n        &.active {\n          &:hover {\n            margin-top: 0;\n          }\n        }\n      }\n    }\n\n    .card-tools {\n      margin: .5rem .5rem .3rem;\n    }\n\n    &:not(.expanding-card).collapsed-card .card-header {\n      border-bottom: 0;\n\n      .nav-tabs {\n        border-bottom: 0;\n\n        .nav-item {\n          margin-bottom: 0;\n        }\n      }\n    }\n\n    &.expanding-card {\n      .card-header {\n        .nav-tabs {\n          .nav-item {\n            margin-bottom: -1px;\n          }\n        }\n      }\n    }\n  }\n\n}\n\n// Maximized Card Body Scroll fix\nhtml.maximized-card {\n  overflow: hidden;\n}\n\n// Add clearfix to header, body and footer\n.card-header,\n.card-body,\n.card-footer {\n  @include clearfix ();\n}\n\n// Box header\n.card-header {\n  background-color: transparent;\n  border-bottom: 1px solid $card-border-color;\n  padding: (($card-spacer-y * .5) * 2) $card-spacer-x;\n  position: relative;\n\n  @if $enable-rounded {\n    @include border-top-radius($border-radius);\n  }\n\n  .collapsed-card & {\n    border-bottom: 0;\n  }\n\n  > .card-tools {\n    float: right;\n    margin-right: -$card-spacer-x * .5;\n\n    .input-group,\n    .nav,\n    .pagination {\n      margin-bottom: -$card-spacer-y * .4;\n      margin-top: -$card-spacer-y * .4;\n    }\n\n    [data-toggle=\"tooltip\"] {\n      position: relative;\n    }\n  }\n}\n\n.card-title {\n  float: left;\n  font-size: $card-title-font-size;\n  font-weight: $card-title-font-weight;\n  margin: 0;\n}\n\n.card-text {\n  clear: both;\n}\n\n\n// Box Tools Buttons\n.btn-tool {\n  background-color: transparent;\n  color: $gray-500;\n  font-size: $font-size-sm;\n  margin: -(($card-spacer-y * .5) * 2) 0;\n  padding: .25rem .5rem;\n\n  .btn-group.show &,\n  &:hover {\n    color: $gray-700;\n  }\n\n  .show &,\n  &:focus {\n    box-shadow: none !important;\n  }\n}\n\n.text-sm {\n  .card-title {\n    font-size: $card-title-font-size-sm;\n  }\n\n  .nav-link {\n    padding: $card-nav-link-padding-sm-y $card-nav-link-padding-sm-x;\n  }\n}\n\n// Box Body\n.card-body {\n  // @include border-radius-sides(0, 0, $border-radius, $border-radius);\n  // .no-header & {\n  //   @include border-top-radius($border-radius);\n  // }\n\n  // Tables within the box body\n  > .table {\n    margin-bottom: 0;\n\n    > thead > tr > th,\n    > thead > tr > td {\n      border-top-width: 0;\n    }\n  }\n\n  // Calendar within the box body\n  .fc {\n    margin-top: 5px;\n  }\n\n  .full-width-chart {\n    margin: -19px;\n  }\n\n  &.p-0 .full-width-chart {\n    margin: -9px;\n  }\n}\n\n.chart-legend {\n  @include list-unstyled ();\n  margin: 10px 0;\n\n  > li {\n    @media (max-width: map-get($grid-breakpoints, sm)) {\n      float: left;\n      margin-right: 10px;\n    }\n  }\n}\n\n// Comment Box\n.card-comments {\n  background-color: $gray-100;\n\n  .card-comment {\n    @include clearfix ();\n    border-bottom: 1px solid $gray-200;\n    padding: 8px 0;\n\n    &:last-of-type {\n      border-bottom: 0;\n    }\n\n    &:first-of-type {\n      padding-top: 0;\n    }\n\n    img {\n      height: $card-img-size;\n      width: $card-img-size;\n      float: left;\n    }\n  }\n\n  .comment-text {\n    color: lighten($gray-700, 20%);\n    margin-left: 40px;\n  }\n\n  .username {\n    color: $gray-700;\n    display: block;\n    font-weight: 600;\n  }\n\n  .text-muted {\n    font-size: 12px;\n    font-weight: 400;\n  }\n}\n\n// Widgets\n//-----------\n\n// Widget: TODO LIST\n.todo-list {\n  list-style: none;\n  margin: 0;\n  overflow: auto;\n  padding: 0;\n\n  // Todo list element\n  > li {\n    @include border-radius(2px);\n    background-color: $gray-100;\n    border-left: 2px solid $gray-200;\n    color: $gray-700;\n    margin-bottom: 2px;\n    padding: 10px;\n\n    &:last-of-type {\n      margin-bottom: 0;\n    }\n\n    > input[type=\"checkbox\"] {\n      margin: 0 10px 0 5px;\n    }\n\n    .text {\n      display: inline-block;\n      font-weight: 600;\n      margin-left: 5px;\n    }\n\n    // Time labels\n    .badge {\n      font-size: .7rem;\n      margin-left: 10px;\n    }\n\n    // Tools and options box\n    .tools {\n      color: theme-color(\"danger\");\n      display: none;\n      float: right;\n\n      // icons\n      > .fa,\n      > .fas,\n      > .far,\n      > .fab,\n      > .fal,\n      > .fad,\n      > .svg-inline--fa,\n      > .ion {\n        cursor: pointer;\n        margin-right: 5px;\n      }\n    }\n\n    &:hover .tools {\n      display: inline-block;\n    }\n\n    &.done {\n      color: darken($gray-500, 25%);\n\n      .text {\n        font-weight: 500;\n        text-decoration: line-through;\n      }\n\n      .badge {\n        background-color: $gray-500 !important;\n      }\n    }\n  }\n\n  // Color variants\n  @each $name, $color in $theme-colors {\n    .#{$name} {\n      border-left-color: $color