/*! KeyTable 2.6.4
 * ©2009-2021 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     KeyTable
 * @description Spreadsheet like keyboard navigation for DataTables
 * @version     2.6.4
 * @file        dataTables.keyTable.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2009-2021 SpryMedia Ltd.
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
var namespaceCounter = 0;
var editorNamespaceCounter = 0;


var KeyTable = function ( dt, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw 'KeyTable requires DataTables 1.10.8 or newer';
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.keyTable,
		KeyTable.defaults,
		opts
	);

	// Internal settings
	this.s = {
		/** @type {DataTable.Api} DataTables' API instance */
		dt: new DataTable.Api( dt ),

		enable: true,

		/** @type {bool} Flag for if a draw is triggered by focus */
		focusDraw: false,

		/** @type {bool} Flag to indicate when waiting for a draw to happen.
		  *   Will ignore key presses at this point
		  */
		waitingForDraw: false,

		/** @type {object} Information about the last cell that was focused */
		lastFocus: null,

		/** @type {string} Unique namespace per instance */
		namespace: '.keyTable-'+(namespaceCounter++),

		/** @type {Node} Input element for tabbing into the table */
		tabInput: null
	};

	// DOM items
	this.dom = {

	};

	// Check if row reorder has already been initialised on this table
	var settings = this.s.dt.settings()[0];
	var exisiting = settings.keytable;
	if ( exisiting ) {
		return exisiting;
	}

	settings.keytable = this;
	this._constructor();
};


$.extend( KeyTable.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * API methods for DataTables API interface
	 */

	/**
	 * Blur the table's cell focus
	 */
	blur: function ()
	{
		this._blur();
	},

	/**
	 * Enable cell focus for the table
	 *
	 * @param  {string} state Can be `true`, `false` or `-string navigation-only`
	 */
	enable: function ( state )
	{
		this.s.enable = state;
	},

	/**
	 * Get enable status
	 */
	enabled: function () {
		return this.s.enable;
	},

	/**
	 * Focus on a cell
	 * @param  {integer} row    Row index
	 * @param  {integer} column Column index
	 */
	focus: function ( row, column )
	{
		this._focus( this.s.dt.cell( row, column ) );
	},

	/**
	 * Is the cell focused
	 * @param  {object} cell Cell index to check
	 * @returns {boolean} true if focused, false otherwise
	 */
	focused: function ( cell )
	{
		var lastFocus = this.s.lastFocus;

		if ( ! lastFocus ) {
			return false;
		}

		var lastIdx = this.s.lastFocus.cell.index();
		return cell.row === lastIdx.row && cell.column === lastIdx.column;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the KeyTable instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		this._tabInput();

		var that = this;
		var dt = this.s.dt;
		var table = $( dt.table().node() );
		var namespace = this.s.namespace;
		var editorBlock = false;

		// Need to be able to calculate the cell positions relative to the table
		if ( table.css('position') === 'static' ) {
			table.css( 'position', 'relative' );
		}

		// Click to focus
		$( dt.table().body() ).on( 'click'+namespace, 'th, td', function (e) {
			if ( that.s.enable === false ) {
				return;
			}

			var cell = dt.cell( this );

			if ( ! cell.any() ) {
				return;
			}

			that._focus( cell, null, false, e );
		} );

		// Key events
		$( document ).on( 'keydown'+namespace, function (e) {
			if ( ! editorBlock ) {
				that._key( e );
			}
		} );

		// Click blur
		if ( this.c.blurable ) {
			$( document ).on( 'mousedown'+namespace, function ( e ) {
				// Click on the search input will blur focus
				if ( $(e.target).parents( '.dataTables_filter' ).length ) {
					that._blur();
				}

				// If the click was inside the DataTables container, don't blur
				if ( $(e.target).parents().filter( dt.table().container() ).length ) {
					return;
				}

				// Don't blur in Editor form
				if ( $(e.target).parents('div.DTE').length ) {
					return;
				}

				// Or an Editor date input
				if (
					$(e.target).parents('div.editor-datetime').length ||
					$(e.target).parents('div.dt-datetime').length 
				) {
					return;
				}

				//If the click was inside the fixed columns container, don't blur
				if ( $(e.target).parents().filter('.DTFC_Cloned').length ) {
					return;
				}

				that._blur();
			} );
		}

		if ( this.c.editor ) {
			var editor = this.c.editor;

			// Need to disable KeyTable when the main editor is shown
			editor.on( 'open.keyTableMain', function (e, mode, action) {
				if ( mode !== 'inline' && that.s.enable ) {
					that.enable( false );

					editor.one( 'close'+namespace, function () {
						that.enable( true );
					} );
				}
			} );

			if ( this.c.editOnFocus ) {
				dt.on( 'key-focus'+namespace+' key-refocus'+namespace, function ( e, dt, cell, orig ) {
					that._editor( null, orig, true );
				} );
			}

			// Activate Editor when a key is pressed (will be ignored, if
			// already active).
			dt.on( 'key'+namespace, function ( e, dt, key, cell, orig ) {
				that._editor( key, orig, false );
			} );

			// Active editing on double click - it will already have focus from
			// the click event handler above
			$( dt.table().body() ).on( 'dblclick'+namespace, 'th, td', function (e) {
				if ( that.s.enable === false ) {
					return;
				}

				var cell = dt.cell( this );

				if ( ! cell.any() ) {
					return;
				}

				if ( that.s.lastFocus && this !== that.s.lastFocus.cell.node() ) {
					return;
				}

				that._editor( null, e, true );
			} );

			// While Editor is busy processing, we don't want to process any key events
			editor
				.on('preSubmit', function () {
					editorBlock = true;
				} )
				.on('preSubmitCancelled', function () {
					editorBlock = false;
				} )
				.on('submitComplete', function () {
					editorBlock = false;
				} );
		}

		// Stave saving
		if ( dt.settings()[0].oFeatures.bStateSave ) {
			dt.on( 'stateSaveParams'+namespace, function (e, s, d) {
				d.keyTable = that.s.lastFocus ?
					that.s.lastFocus.cell.index() :
					null;
			} );
		}

		dt.on( 'column-visibility'+namespace, function (e) {
			that._tabInput();
		} );

		// Redraw - retain focus on the current cell
		dt.on( 'draw'+namespace, function (e) {
			that._tabInput();

			if ( that.s.focusDraw ) {
				return;
			}

			var lastFocus = that.s.lastFocus;

			if ( lastFocus ) {
				var relative = that.s.lastFocus.relative;
				var info = dt.page.info();
				var row = relative.row + info.start;

				if ( info.recordsDisplay === 0 ) {
					return;
				}

				// Reverse if needed
				if ( row >= info.recordsDisplay ) {
					row = info.recordsDisplay - 1;
				}

				that._focus( row, relative.column, true, e );
			}
		} );

		// Clipboard support
		if ( this.c.clipboard ) {
			this._clipboard();
		}

		dt.on( 'destroy'+namespace, function () {
			that._blur( true );

			// Event tidy up
			dt.off( namespace );

			$( dt.table().body() )
				.off( 'click'+namespace, 'th, td' )
				.off( 'dblclick'+namespace, 'th, td' );

			$( document )
				.off( 'mousedown'+namespace )
				.off( 'keydown'+namespace )
				.off( 'copy'+namespace )
				.off( 'paste'+namespace );
		} );

		// Initial focus comes from state or options
		var state = dt.state.loaded();

		if ( state && state.keyTable ) {
			// Wait until init is done
			dt.one( 'init', function () {
				var cell = dt.cell( state.keyTable );

				// Ensure that the saved cell still exists
				if ( cell.any() ) {
					cell.focus();
				}
			} );
		}
		else if ( this.c.focus ) {
			dt.cell( this.c.focus ).focus();
		}
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Blur the control
	 *
	 * @param {boolean} [noEvents=false] Don't trigger updates / events (for destroying)
	 * @private
	 */
	_blur: function (noEvents)
	{
		if ( ! this.s.enable || ! this.s.lastFocus ) {
			return;
		}

		var cell = this.s.lastFocus.cell;

		$( cell.node() ).removeClass( this.c.className );
		this.s.lastFocus = null;

		if ( ! noEvents ) {
			this._updateFixedColumns(cell.index().column);

			this._emitEvent( 'key-blur', [ this.s.dt, cell ] );
		}
	},


	/**
	 * Clipboard interaction handlers
	 *
	 * @private
	 */
	_clipboard: function () {
		var dt = this.s.dt;
		var that = this;
		var namespace = this.s.namespace;

		// IE8 doesn't support getting selected text
		if ( ! window.getSelection ) {
			return;
		}

		$(document).on( 'copy'+namespace, function (ejq) {
			var e = ejq.originalEvent;
			var selection = window.getSelection().toString();
			var focused = that.s.lastFocus;

			// Only copy cell text to clipboard if there is no other selection
			// and there is a focused cell
			if ( ! selection && focused ) {
				e.clipboardData.setData(
					'text/plain',
					focused.cell.render( that.c.clipboardOrthogonal )
				);
				e.preventDefault();
			}
		} );

		$(document).on( 'paste'+namespace, function (ejq) {
			var e = ejq.originalEvent;
			var focused = that.s.lastFocus;
			var activeEl = document.activeElement;
			var editor = that.c.editor;
			var pastedText;

			if ( focused && (! activeEl || activeEl.nodeName.toLowerCase() === 'body') ) {
				e.preventDefault();

				if ( window.clipboardData && window.clipboardData.getData ) {
					// IE
					pastedText = window.clipboardData.getData('Text');
				}
				else if ( e.clipboardData && e.clipboardData.getData ) {
					// Everything else
					pastedText = e.clipboardData.getData('text/plain');
				}

				if ( editor ) {
					// Got Editor - need to activate inline editing,
					// set the value and submit
					var options = that._inlineOptions(focused.cell.index());

					editor
						.inline(options.cell, options.field, options.options)
						.set( editor.displayed()[0], pastedText )
						.submit();
				}
				else {
					// No editor, so just dump the data in
					focused.cell.data( pastedText );
					dt.draw(false);
				}
			}
		} );
	},


	/**
	 * Get an array of the column indexes that KeyTable can operate on. This
	 * is a merge of the user supplied columns and the visible columns.
	 *
	 * @private
	 */
	_columns: function ()
	{
		var dt = this.s.dt;
		var user = dt.columns( this.c.columns ).indexes();
		var out = [];

		dt.columns( ':visible' ).every( function (i) {
			if ( user.indexOf( i ) !== -1 ) {
				out.push( i );
			}
		} );

		return out;
	},


	/**
	 * Perform excel like navigation for Editor by triggering an edit on key
	 * press
	 *
	 * @param  {integer} key Key code for the pressed key
	 * @param  {object} orig Original event
	 * @private
	 */
	_editor: function ( key, orig, hardEdit )
	{
		// If nothing focused, we can't take any action
		if (! this.s.lastFocus) {
			return;	
		}

		// DataTables draw event
		if (orig && orig.type === 'draw') {
			return;
		}

		var that = this;
		var dt = this.s.dt;
		var editor = this.c.editor;
		var editCell = this.s.lastFocus.cell;
		var namespace = this.s.namespace + 'e' + editorNamespaceCounter++;

		// Do nothing if there is already an inline edit in this cell
		if ( $('div.DTE', editCell.node()).length ) {
			return;
		}

		// Don't activate Editor on control key presses
		if ( key !== null && (
			(key >= 0x00 && key <= 0x09) ||
			key === 0x0b ||
			key === 0x0c ||
			(key >= 0x0e && key <= 0x1f) ||
			(key >= 0x70 && key <= 0x7b) ||
			(key >= 0x7f && key <= 0x9f)
		) ) {
			return;
		}

		if ( orig ) {
			orig.stopPropagation();

			// Return key should do nothing - for textareas it would empty the
			// contents
			if ( key === 13 ) {
				orig.preventDefault();
			}
		}

		var editInline = function () {
			var options = that._inlineOptions(editCell.index());

			editor
				.one( 'open'+namespace, function () {
					// Remove cancel open
					editor.off( 'cancelOpen'+namespace );

					// Excel style - select all text
					if ( ! hardEdit ) {
						$('div.DTE_Field_InputControl input, div.DTE_Field_InputControl textarea').select();
					}

					// Reduce the keys the Keys listens for
					dt.keys.enable( hardEdit ? 'tab-only' : 'navigation-only' );

					// On blur of the navigation submit
					dt.on( 'key-blur.editor', function (e, dt, cell) {
						if ( editor.displayed() && cell.node() === editCell.node() ) {
							editor.submit();
						}
					} );

					// Highlight the cell a different colour on full edit
					if ( hardEdit ) {
						$( dt.table().container() ).addClass('dtk-focus-alt');
					}

					// If the dev cancels the submit, we need to return focus
					editor.on( 'preSubmitCancelled'+namespace, function () {
						setTimeout( function () {
							that._focus( editCell, null, false );
						}, 50 );
					} );

					editor.on( 'submitUnsuccessful'+namespace, function () {
						that._focus( editCell, null, false );
					} );

					// Restore full key navigation on close
					editor.one( 'close'+namespace, function () {
						dt.keys.enable( true );
						dt.off( 'key-blur.editor' );
						editor.off( namespace );
						$( dt.table().container() ).removeClass('dtk-focus-alt');

						if (that.s.returnSubmit) {
							that.s.returnSubmit = false;
							that._emitEvent( 'key-return-submit', [dt, editCell] );
						}
					} );
				} )
				.one( 'cancelOpen'+namespace, function () {
					// `preOpen` can cancel the display of the form, so it
					// might be that the open event handler isn't needed
					editor.off( namespace );
				} )
				.inline(options.cell, options.field, options.options);
		};

		// Editor 1.7 listens for `return` on keyup, so if return is the trigger
		// key, we need to wait for `keyup` otherwise Editor would just submit
		// the content triggered by this keypress.
		if ( key === 13 ) {
			hardEdit = true;

			$(document).one( 'keyup', function () { // immediately removed
				editInline();
			} );
		}
		else {
			editInline();
		}
	},


	_inlineOptions: function (cellIdx)
	{
		if (this.c.editorOptions) {
			return this.c.editorOptions(cellIdx);
		}

		return {
			cell: cellIdx,
			field: undefined,
			options: undefined
		};
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
			$(ctx.nTable).triggerHandler( name, args );
		} );
	},


	/**
	 * Focus on a particular cell, shifting the table's paging if required
	 *
	 * @param  {DataTables.Api|integer} row Can be given as an API instance that
	 *   contains the cell to focus or as an integer. As the latter it is the
	 *   visible row index (from the whole data set) - NOT the data index
	 * @param  {integer} [column] Not required if a cell is given as the first
	 *   parameter. Otherwise this is the column data index for the cell to
	 *   focus on
	 * @param {boolean} [shift=true] Should the viewport be moved to show cell
	 * @private
	 */
	_focus: function ( row, column, shift, originalEvent )
	{
		var that = this;
		var dt = this.s.dt;
		var pageInfo = dt.page.info();
		var laack) {
            return EXIF.getData(img, function () {
              return callback(EXIF.getTag(this, "Orientation"));
            });
          };
        }

        return loadExif(function (orientation) {
          file.width = img.width;
          file.height = img.height;

          var resizeInfo = _this13.options.resize.call(_this13, file, width, height, resizeMethod);

          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;

          if (orientation > 4) {
            canvas.width = resizeInfo.trgHeight;
            canvas.height = resizeInfo.trgWidth;
          }

          switch (orientation) {
            case 2:
              // horizontal flip
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              break;

            case 3:
              // 180° rotate left
              ctx.translate(canvas.width, canvas.height);
              ctx.rotate(Math.PI);
              break;

            case 4:
              // vertical flip
              ctx.translate(0, canvas.height);
              ctx.scale(1, -1);
              break;

            case 5:
              // vertical flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.scale(1, -1);
              break;

            case 6:
              // 90° rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(0, -canvas.width);
              break;

            case 7:
              // horizontal flip + 90 rotate right
              ctx.rotate(0.5 * Math.PI);
              ctx.translate(canvas.height, -canvas.width);
              ctx.scale(-1, 1);
              break;

            case 8:
              // 90° rotate left
              ctx.rotate(-0.5 * Math.PI);
              ctx.translate(-canvas.height, 0);
              break;
          } // This is a bugfix for iOS' scaling bug.


          drawImageIOSFix(ctx, img, resizeInfo.srcX != null ? resizeInfo.srcX : 0, resizeInfo.srcY != null ? resizeInfo.srcY : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, resizeInfo.trgX != null ? resizeInfo.trgX : 0, resizeInfo.trgY != null ? resizeInfo.trgY : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
          var thumbnail = canvas.toDataURL("image/png");

          if (callback != null) {
            return callback(thumbnail, canvas);
          }
        });
      };

      if (callback != null) {
        img.onerror = callback;
      }

      return img.src = file.dataURL;
    } // Goes through the queue and processes files if there aren't too many already.

  }, {
    key: "processQueue",
    value: function processQueue() {
      var parallelUploads = this.options.parallelUploads;
      var processingLength = this.getUploadingFiles().length;
      var i = processingLength; // There are already at least as many files uploading than should be

      if (processingLength >= parallelUploads) {
        return;
      }

      var queuedFiles = this.getQueuedFiles();

      if (!(queuedFiles.length > 0)) {
        return;
      }

      if (this.options.uploadMultiple) {
        // The files should be uploaded in one request
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          } // Nothing left to process


          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    } // Wrapper for `processFiles`

  }, {
    key: "processFile",
    value: function processFile(file) {
      return this.processFiles([file]);
    } // Loads the file, then calls finishedLoading()

  }, {
    key: "processFiles",
    value: function processFiles(files) {
      var _iterator10 = dropzone_createForOfIteratorHelper(files, true),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var file = _step10.value;
          file.processing = true; // Backwards compatibility

          file.status = Dropzone.UPLOADING;
          this.emit("processing", file);
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }

      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }

      return this.uploadFiles(files);
    }
  }, {
    key: "_getFilesWithXhr",
    value: function _getFilesWithXhr(xhr) {
      var files;
      return files = this.files.filter(function (file) {
        return file.xhr === xhr;
      }).map(function (file) {
        return file;
      });
    } // Cancels the file upload and sets the status to CANCELED
    // **if** the file is actually being uploaded.
    // If it's still in the queue, the file is being removed from it and the status
    // set to CANCELED.

  }, {
    key: "cancelUpload",
    value: function cancelUpload(file) {
      if (file.status === Dropzone.UPLOADING) {
        var groupedFiles = this._getFilesWithXhr(file.xhr);

        var _iterator11 = dropzone_createForOfIteratorHelper(groupedFiles, true),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var groupedFile = _step11.value;
            groupedFile.status = Dropzone.CANCELED;
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }

        if (typeof file.xhr !== "undefined") {
          file.xhr.abort();
        }

        var _iterator12 = dropzone_createForOfIteratorHelper(groupedFiles, true),
            _step12;

        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var _groupedFile = _step12.value;
            this.emit("canceled", _groupedFile);
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }

        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if (file.status === Dropzone.ADDED || file.status === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);

        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }

      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    }
  }, {
    key: "resolveOption",
    value: function resolveOption(option) {
      if (typeof option === "function") {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return option.apply(this, args);
      }

      return option;
    }
  }, {
    key: "uploadFile",
    value: function uploadFile(file) {
      return this.uploadFiles([file]);
    }
  }, {
    key: "uploadFiles",
    value: function uploadFiles(files) {
      var _this14 = this;

      this._transformFiles(files, function (transformedFiles) {
        if (_this14.options.chunking) {
          // Chunking is not allowed to be used with `uploadMultiple` so we know
          // that there is only __one__file.
          var transformedFile = transformedFiles[0];
          files[0].upload.chunked = _this14.options.chunking && (_this14.options.forceChunking || transformedFile.size > _this14.options.chunkSize);
          files[0].upload.totalChunkCount = Math.ceil(transformedFile.size / _this14.options.chunkSize);
        }

        if (files[0].upload.chunked) {
          // This file should be sent in chunks!
          // If the chunking option is set, we **know** that there can only be **one** file, since
          // uploadMultiple is not allowed with this option.
          var file = files[0];
          var _transformedFile = transformedFiles[0];
          var startedChunkCount = 0;
          file.upload.chunks = [];

          var handleNextChunk = function handleNextChunk() {
            var chunkIndex = 0; // Find the next item in file.upload.chunks that is not defined yet.

            while (file.upload.chunks[chunkIndex] !== undefined) {
              chunkIndex++;
            } // This means, that all chunks have already been started.


            if (chunkIndex >= file.upload.totalChunkCount) return;
            startedChunkCount++;
            var start = chunkIndex * _this14.options.chunkSize;
            var end = Math.min(start + _this14.options.chunkSize, _transformedFile.size);
            var dataBlock = {
              name: _this14._getParamName(0),
              data: _transformedFile.webkitSlice ? _transformedFile.webkitSlice(start, end) : _transformedFile.slice(start, end),
              filename: file.upload.filename,
              chunkIndex: chunkIndex
            };
            file.upload.chunks[chunkIndex] = {
              file: file,
              index: chunkIndex,
              dataBlock: dataBlock,
              // In case we want to retry.
              status: Dropzone.UPLOADING,
              progress: 0,
              retries: 0 // The number of times this block has been retried.

            };

            _this14._uploadData(files, [dataBlock]);
          };

          file.upload.finishedChunkUpload = function (chunk, response) {
            var allFinished = true;
            chunk.status = Dropzone.SUCCESS; // Clear the data from the chunk

            chunk.dataBlock = null; // Leaving this reference to xhr intact here will cause memory leaks in some browsers

            chunk.xhr = null;

            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              if (file.upload.chunks[i] === undefined) {
                return handleNextChunk();
              }

              if (file.upload.chunks[i].status !== Dropzone.SUCCESS) {
                allFinished = false;
              }
            }

            if (allFinished) {
              _this14.options.chunksUploaded(file, function () {
                _this14._finished(files, response, null);
              });
            }
          };

          if (_this14.options.parallelChunkUploads) {
            for (var i = 0; i < file.upload.totalChunkCount; i++) {
              handleNextChunk();
            }
          } else {
            handleNextChunk();
          }
        } else {
          var dataBlocks = [];

          for (var _i2 = 0; _i2 < files.length; _i2++) {
            dataBlocks[_i2] = {
              name: _this14._getParamName(_i2),
              data: transformedFiles[_i2],
              filename: files[_i2].upload.filename
            };
          }

          _this14._uploadData(files, dataBlocks);
        }
      });
    } /// Returns the right chunk for given file and xhr

  }, {
    key: "_getChunk",
    value: function _getChunk(file, xhr) {
      for (var i = 0; i < file.upload.totalChunkCount; i++) {
        if (file.upload.chunks[i] !== undefined && file.upload.chunks[i].xhr === xhr) {
          return file.upload.chunks[i];
        }
      }
    } // This function actually uploads the file(s) to the server.
    // If dataBlocks contains the actual data to upload (meaning, that this could either be transformed
    // files, or individual chunks for chunked upload).

  }, {
    key: "_uploadData",
    value: function _uploadData(files, dataBlocks) {
      var _this15 = this;

      var xhr = new XMLHttpRequest(); // Put the xhr object in the file objects to be able to reference it later.

      var _iterator13 = dropzone_createForOfIteratorHelper(files, true),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var file = _step13.value;
          file.xhr = xhr;
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }

      if (files[0].upload.chunked) {
        // Put the xhr object in the right chunk object, so it can be associated later, and found with _getChunk
        files[0].upload.chunks[dataBlocks[0].chunkIndex].xhr = xhr;
      }

      var method = this.resolveOption(this.options.method, files);
      var url = this.resolveOption(this.options.url, files);
      xhr.open(method, url, true); // Setting the timeout after open because of IE11 issue: https://gitlab.com/meno/dropzone/issues/8

      var timeout = this.resolveOption(this.options.timeout, files);
      if (timeout) xhr.timeout = this.resolveOption(this.options.timeout, files); // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179

      xhr.withCredentials = !!this.options.withCredentials;

      xhr.onload = function (e) {
        _this15._finishedUploading(files, xhr, e);
      };

      xhr.ontimeout = function () {
        _this15._handleUploadError(files, xhr, "Request timedout after ".concat(_this15.options.timeout / 1000, " seconds"));
      };

      xhr.onerror = function () {
        _this15._handleUploadError(files, xhr);
      }; // Some browsers do not have the .upload property


      var progressObj = xhr.upload != null ? xhr.upload : xhr;

      progressObj.onprogress = function (e) {
        return _this15._updateFilesUploadProgress(files, xhr, e);
      };

      var headers = {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };

      if (this.options.headers) {
        Dropzone.extend(headers, this.options.headers);
      }

      for (var headerName in headers) {
        var headerValue = headers[headerName];

        if (headerValue) {
          xhr.setRequestHeader(headerName, headerValue);
        }
      }

      var formData = new FormData(); // Adding all @options parameters

      if (this.options.params) {
        var additionalParams = this.options.params;

        if (typeof additionalParams === "function") {
          additionalParams = additionalParams.call(this, files, xhr, files[0].upload.chunked ? this._getChunk(files[0], xhr) : null);
        }

        for (var key in additionalParams) {
          var value = additionalParams[key];

          if (Array.isArray(value)) {
            // The additional parameter contains an array,
            // so lets iterate over it to attach each value
            // individually.
            for (var i = 0; i < value.length; i++) {
              formData.append(key, value[i]);
            }
          } else {
            formData.append(key, value);
          }
        }
      } // Let the user add additional data if necessary


      var _iterator14 = dropzone_createForOfIteratorHelper(files, true),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var _file = _step14.value;
          this.emit("sending", _file, xhr, formData);
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }

      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }

      this._addFormElementData(formData); // Finally add the files
      // Has to be last because some servers (eg: S3) expect t