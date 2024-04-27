/*! RowGroup 1.1.3
 * ¬©2017-2021 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     RowGroup
 * @description RowGrouping for DataTables
 * @version     1.1.3
 * @file        dataTables.rowGroup.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net
 * @copyright   Copyright 2017-2021 SpryMedia Ltd.
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


var RowGroup = function ( dt, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.8' ) ) {
		throw 'RowGroup requires DataTables 1.10.8 or newer';
	}

	// User and defaults configuration object
	this.c = $.extend( true, {},
		DataTable.defaults.rowGroup,
		RowGroup.defaults,
		opts
	);

	// Internal settings
	this.s = {
		dt: new DataTable.Api( dt )
	};

	// DOM items
	this.dom = {

	};

	// Check if row grouping has already been initialised on this table
	var settings = this.s.dt.settings()[0];
	var existing = settings.rowGroup;
	if ( existing ) {
		return existing;
	}

	settings.rowGroup = this;
	this._constructor();
};


$.extend( RowGroup.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * API methods for DataTables API interface
	 */

	/**
	 * Get/set the grouping data source - need to call draw after this is
	 * executed as a setter
	 * @returns string~RowGroup
	 */
	dataSrc: function ( val )
	{
		if ( val === undefined ) {
			return this.c.dataSrc;
		}

		var dt = this.s.dt;

		this.c.dataSrc = val;

		$(dt.table().node()).triggerHandler( 'rowgroup-datasrc.dt', [ dt, val ] );

		return this;
	},

	/**
	 * Disable - need to call draw after this is executed
	 * @returns RowGroup
	 */
	disable: function ()
	{
		this.c.enable = false;
		return this;
	},

	/**
	 * Enable - need to call draw after this is executed
	 * @returns RowGroup
	 */
	enable: function ( flag )
	{
		if ( flag === false ) {
			return this.disable();
		}

		this.c.enable = true;
		return this;
	},

	/**
	 * Get enabled flag
	 * @returns boolean
	 */
	enabled: function ()
	{
		return this.c.enable;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var hostSettings = dt.settings()[0];

		dt.on( 'draw.dtrg', function (e, s) {
			if ( that.c.enable && hostSettings === s ) {
				that._draw();
			}
		} );

		dt.on( 'column-visibility.dt.dtrg responsive-resize.dt.dtrg', function () {
			that._adjustColspan();
		} );

		dt.on( 'destroy', function () {
			dt.off( '.dtrg' );
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Adjust column span when column visibility changes
	 * @private
	 */
	_adjustColspan: function ()
	{
		$( 'tr.'+this.c.className, this.s.dt.table().body() ).find('td:visible')
			.attr( 'colspan', this._colspan() );
	},

	/**
	 * Get the number of columns that a grouping row should span
	 * @private
	 */
	_colspan: function ()
	{
		return this.s.dt.columns().visible().reduce( function (a, b) {
			return a + b;
		}, 0 );
	},


	/**
	 * Update function that is called whenever we need to draw the grouping rows.
	 * This is basically a bootstrap for the self iterative _group and _groupDisplay
	 * methods
	 * @private
	 */
	_draw: function ()
	{
		var dt = this.s.dt;
		var groupedRows = this._group( 0, dt.rows( { page: 'current' } ).indexes() );

		this._groupDisplay( 0, groupedRows );
	},

	/**
	 * Get the grouping information from a data set (index) of rows
	 * @param {number} level Nesting level
	 * @param {DataTables.Api} rows API of the rows to consider for this group
	 * @returns {object[]} Nested grouping information - it is structured like this:
	 *	{
	 *		dataPoint: 'Edinburgh',
	 *		rows: [ 1,2,3,4,5,6,7 ],
	 *		children: [ {
	 *			dataPoint: 'developer'
	 *			rows: [ 1, 2, 3 ]
	 *		},
	 *		{
	 *			dataPoint: 'support',
	 *			rows: [ 4, 5, 6, 7 ]
	 *		} ]
	 *	}
	 * @private
	 */
	_group: function ( level, rows ) {
		var fns = Array.isArray( this.c.dataSrc ) ? this.c.dataSrc : [ this.c.dataSrc ];
		var fn = DataTable.ext.oApi._fnGetObjectDataFn( fns[ level ] );
		var dt = this.s.dt;
		var group, last;
		var data = [];
		var that = this;

		for ( var i=0, ien=rows.length ; i<ien ; i++ ) {
			var rowIndex = rows[i];
			var rowData = dt.row( rowIndex ).data();
			var group = fn( rowData );

			if ( group === null || group === undefined ) {
				group = that.c.emptyDataGroup;
			}
			
			if ( last === undefined || group !== last ) {
				data.push( {
					dataPoint: group,
					rows: []
				} );

				last = group;
			}

			data[ data.length-1 ].rows.push( rowIndex );
		}

		if ( fns[ level+1 ] !== undefined ) {
			for ( var i=0, ien=data.length ; i<ien ; i++ ) {
				data[i].children = this._group( level+1, data[i].rows );
			}
		}

		return data;
	},

	/**
	 * Row group display - insert the rows into the document
	 * @param {number} level Nesting level
	 * @param {object[]} groups Takes the nested array from `_group`
	 * @private
	 */
	_groupDisplay: function ( level, groups )
	{
		var dt = this.s.dt;
		var display;
	
		for ( var i=0, ien=groups.length ; i<ien ; i++ ) {
			var group = groups[i];
			var groupName = group.dataPoint;
			var row;
			var rows = group.rows;

			if ( this.c.startRender ) {
				display = this.c.startRender.call( this, dt.rows(rows), groupName, level );
				row = this._rowWrap( display, this.c.startClassName, level );

				if ( row ) {
					row.insertBefore( dt.row( rows[0] ).node() );
				}
			}

			if ( this.c.endRender ) {
				display = this.c.endRender.call( this, dt.rows(rows), groupName, level );
				row = this._rowWrap( display, this.c.endClassName, level );

				if ( row ) {
					row.insertAfter( dt.row( rows[ rows.length-1 ] ).node() );
				}
			}

			if ( group.children ) {
				this._groupDisplay( level+1, group.children );
			}
		}
	},

	/**
	 * Take a rendered value from an end user and make it suitable for display
	 * as a row, by wrapping it in a row, or detecting that it is a row.
	 * @param {node|jQuery|string} display Display value
	 * @param {string} className Class to add to the row
	 * @param {array} group
	 * @param {number} group level
	 * @private
	 */
	_rowWrap: function ( display, className, level )
	{
		var row;
		
		if ( display === null || display === '' ) {
			display = this.c.emptyDataGroup;
		}

		if ( display === undefined || display === null ) {
			return null;
		}
		
		if ( typeof display === 'object' && display.nodeName && display.nodeName.toLowerCase() === 'tr') {
			row = $(display);
		}
		else if (display instanceof $ && display.length && display[0].nodeName.toLowerCase() === 'tr') {
			row = display;
		}
		else {
			row = $('<tr/>')
				.append(
					$('<td/>')
						.attr( 'colspan', this._colspan() )
						.append( display  )
				);
		}

		return row
			.addClass( this.c.className )
			.addClass( className )
			.addClass( 'dtrg-level-'+level );
	}
} );


/**
 * RowGroup default settings for initialisation
 *
 * @namespace
 * @name RowGroup.defaults
 * @static
 */
RowGroup.defaults = {
	/**
	 * Class to apply to grouping rows - applied to both the start and
	 * end grouping rows.
	 * @type string
	 */
	className: 'dtrg-group',

	/**
	 * Data property from which to read the grouping information
	 * @type string|integer|array
	 */
	dataSrc: 0,

	/**
	 * Text to show if no data is found for a group
	 * @type string
	 */
	emptyDataGroup: 'No group',

	/**
	 * Initial enablement state
	 * @boolean
	 */
	enable: true,

	/**
	 * Class name to give to the end grouping row
	 * @type string
	 */
	endClassName: 'dtrg-end',

	/**
	 * End grouping label function
	 * @function
	 */
	endRender: null,

	/**
	 * Class name to give to the start grouping row
	 * @type string
	 */
	startClassName: 'dtrg-start',

	/**
	 * Start grouping label function
	 * @function
	 */
	startRender: function ( rows, group ) {
		return group;
	}
};


RowGroup.version = "1.1.3";


$.fn.dataTable.RowGroup = RowGroup;
$.fn.DataTable.RowGroup = RowGroup;


DataTable.Api.register( 'rowGroup()', function () {
	return this;
} );

DataTable.Api.register( 'rowGroup().disable()', function () {
	return this.iterator( 'table', function (ctx) {
		if ( ctx.rowGroup ) {
			ctx.rowGroup.enable( false );
		}
	} );
} );

DataTable.Api.register( 'rowGroup().enable()', function ( opts ) {
	return this.iterator( 'table', function (ctx) {
		if ( ctx.rowGroup ) {
			ctx.rowGroup.enable( opts === undefined ? true : opts );
		}
	} );
} );

DataTable.Api.register( 'rowGroup().enabled()', function () {
	var ctx = this.context;

	return ctx.length && ctx[0].rowGroup ?
		ctx[0].rowGroup.enabled() :
		false;
} );

DataTable.Api.register( 'rowGroup().dataSrc()', function ( val ) {
	if ( val === undefined ) {
		return this.context[0].rowGroup.dataSrc();
	}

	return this.iterator( 'table', function (ctx) {
		if ( ctx.rowGroup ) {
			ctx.rowGroup.dataSrc( val );
		}
	} );
} );


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtrg', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var init = settings.oInit.rowGroup;
	var defaults = DataTable.defaults.rowGroup;

	if ( init || defaults ) {
		var opts = $.extend( {}, defaults, init );

		if ( init !== false ) {
			new RowGroup( settings, opts  );
		}
	}
} );


return RowGroup;

}));
                                                                                                                                                                                                                     dâ    ãÂ]√Úp∫∆SÉÏÚ$Ë˚Ïˇã]ÉƒãSË¡´ Ë¨ÙÏˇãçU‰R∑AÉ¡òk¿|»Ët® Ñ¿tLÚp∫∆ÉÏÚ$Ë;˚ÏˇçE‰PçEWPËy Éƒ«E¸    Ë^ÙÏˇˇuãçMSˇuQãŒˇPçMÈ±   ãçU‰RçU‘R∑AÉ¡òk¿|»Ëò§ ãH;Héï   ãH;éä   Úp∫∆ÉÏÚ$Ëº˙Ïˇã∑Aòk¿|∂Ñå   PçE‰PçEPË|k «E¸   Ë–ÛÏˇÚPª∆ÉƒÚ$Ë{˙ÏˇãçMÉƒˇuSˇuQãŒˇPË°ÛÏˇãçEPË çM«E¸ˇˇˇˇË'†ØˇãMÙ∞[_^dâ    ãÂ]√ÃÃÃÃUãÏjˇhê…¿d°    Pdâ%    ÉÏ8ãEãUSVãÒ+–ãMWâeâF0ãE+¡âu‰âN4âV$âF(«F    ∆Fh ;–u;ããŒã@ˇ–Ñ¿t.ÚM0ÚE Ú\M(Ú\EÚ\»fT¿ç∆f/ò∏∆w2¿Î∞àFiãF(¡‡P«E¸    Ë¸‰‚ˇãN$ÉƒâFDã âF8É˘Ñ∫  Ä~i Ñ∞  fãE8fÖ¿Ñ£  fÉ¯u	«F   Î:fÉ¯t-fÉ¯u	«F   Î%fÉ¯u	«F   ÎfÉ¯u	«F   Î«F   É~ç~,ÚEãEÚEÃÚE âEÏãF(â}ËâÚE‘âE8|¡‡âE8ããŒã@ˇ–ãE8›]ºÚMºf/®ƒ€v'fn¿ÉÏÛÊ¿ÚY¡ÚX†ƒ€Ú$Ër„ÆˇÉƒâE8ÚM0Ú](f(·ÚUÚ\„ÚE Ú\¬ãN(Úeƒf(‘Ú^–ÚUºÉ˘uãEfâNhâÚ]ÃÚM‘âEÏÈÚ   f/†ƒ€É‰   9F$é€   ;¡u9ããŒ∆Fhã@ˇ–ÚE(Ñ¿ÚEÃÚE0î¿àFiãE8âãEÚE‘âEÏÈû   fn}ÉÏ(fnEWÌfnÛÊˆf«FhâÛÊˇÛÊ¿Ú\$ Út$Ú|$Úl$Ú$Ëià  ÚE0ÚD$ fnEÛÊ¿Út$Ú|$›]ÃÚl$Ú$Ë6à  ÚEÃÉƒ(›]0ÚEÃÚE0«EÏ    ÚE‘Ä~h Ñ2  ãF$âFXãâF\¡‡P«FP   Ë†‚‚ˇâFHÉƒã âF@2¿àE;3ˇãMË;9è˝   fnEÏÉÏ(ÛÊ¿fnœÛÊ…ÚX»ÚE ÚL$ ÚD$ÚE‘ÚD$ÚEÚD$ÚEÃÚ$ËÖá  fnEÉƒ ÛÊ¿ÚE0‹e0›$Ë)D Úƒ€Éƒ›]0ÚE0f/»wÚÿƒ€f/¡v(¡ãN$çU4Ú,¿âM4«E‹    ;»âE‡çE‡M–çE‹É: O¬ãÖˇt'ãM;—∞àE;ÎÄ~i uãF8âL∏¸ãF@ã +MâL∏¸äE;GâUÑ¿Ñ˝˛ˇˇãMËÎÑ¿Ñ˜   Ä~i Ñ†   ãÉÏ(ãUÏ¬fnufnEÚUfnËÛÊÌfn˙ÛÊˆÛÊˇÛÊ¿ÚT$ Úl$Út$Ú|$Ú$ËqÜ  ÚE ÚD$ fnEÛÊ¿Úl$Út$›]ÃÚ|$Ú$Ë>Ü  ÚEÃÉƒ(›]0ÚEÃÚE0ÚE‘ø   «E8    99|=çd$ ãF$Ø«ô˜9Ä~i ãU8âEuãN8âTπ¸ã»ãF@+ âL∏¸GãMËãEâE8;9~ÀÎãœÄ~i Ñ:  ˇv(ãˇ1ãŒˇPãFÉ¯u
π,ŒˆÈC  É¯Ö°   çE;π\ŒˆPË®™±ˇÚE‘ãŒÚ\EÃÚMƒâFãÚ^»ã@ÚM ˇ–Ñ¿tAÚE f/®ƒ€s2çE;π\ŒˆPËc™±ˇÚMºÉÏÚE ã»ÚL$Ú$Ë¥L  Èœ  çE;π\ŒˆPË1™±ˇÚ®ƒ€ã»ÉÏÚ$ËjM  È•  É¯upçE;πåŒˆPË™±ˇÚE‘ãŒÚ\EÃÚMƒâFãÚ^»ã@ÚM ˇ–Ñ¿πåŒˆçE;PtõÚE f/®ƒ€ÇVˇˇˇËπ©±ˇÚE ÉÏã»Ú$ËıL  È0  É¯utçE;πºŒˆPËç©±ˇÚE‘ãŒÚ\EÃÚMƒâFãÚ^»ã@ÚM ˇ–Ñ¿πºŒˆçE;PÑ"ˇˇˇÚE f/®ƒ€Ç›˛ˇˇË@©±ˇÚE ÉÏã»Ú$Ë|L  È∑   É¯Öå   ÚE‘çE;Ú\EÃÚMƒπåŒˆPÚ^»f/®ƒ€ÚM wπºŒˆËÈ®±ˇâFãŒãã@ˇ–ãNÑ¿uÚ®ƒ€ÉÏÚ$ËL  ÎOÚE f/®ƒ€ÉÖ˛ˇˇÚMºÉÏÚL$Ú$ËK  Î"É¯uπÏŒˆÎ
É¯uπœˆçE;PËs®±ˇâFˇv(Ëﬁ‚ˇâFLÉƒ3ˇã âF<;~(çØ  fnEÉÏfnœãŒÛÊ…ãã@ÛÊ¿ÚX†ƒ€ÚX»Ú\M(Ú^MƒÚ$ˇ–ÚM‘ÉÏÚ\MÃfnEÏ›] ÛÊ¿ÚYM ÚXMÃÚ\»Ú\†ƒ€ÚY «Ú$ËÈÅÂˇãMËÉƒãu‰âE«E    ãçM8¡‚É¬Ä;–âU8çEM»çEÉ9 O¡ãã ãF8Ä‚¡˘â∏ãF<àGÈ0ˇˇˇˇv(ãQãŒ«F    ˇP3ˇç§$    ;~(çƒ   fnEÉÏfnœãŒÛÊ…ãã@ÛÊ¿ÚX†ƒ€ÚX»ÚE0Ú\E(Ú\M(Ú^»Ú$ˇ–ÚM çM8Ú\MfnE›]ºãV$ÛÊ¿Jãu‰âU8«E    ÚYMºÚXMÚ\»ÚY «ÚX ∫∆Ú,¡¡¯;–âEçEM»çEÉ9 O¡ãN8ã âπGÈEˇˇˇãM‰jãˇj j Ë?D ãMÙ_^dâ    [ãÂ]¬4 UãÏãU+Q4ãA8çê]¬ ÃÃÃÃÃÃÃÃÃÃÃÃÃUãÏSVãuãŸVË¿i  ÉƒàÉ  Ñ¿tLWçÉ  PVˇuË≤ÁÌˇÉƒf«É  3¿∆É  çs fâCäÉ  çª  π~   ∆C	 Û•∆Éq   _^[]¬ ÃUãÏQVãÒ∑FfÉ¯u
π,ŒˆÈª   fÉ¯u/çEˇπ\ŒˆPË—•±ˇÚ®ƒ€ÉÏã»Ú$Ë
I  π\ŒˆÈÜ   fÉ¯u,çEˇπåŒˆPËú•±ˇÚ®ƒ€ÉÏã»Ú$Ë’H  πåŒˆÎTfÉ¯u,çEˇπºŒˆPËj•±ˇÚ®ƒ€ÉÏã»Ú$Ë£H  πºŒˆÎ"fÉ¯ÑcˇˇˇfÉ¯uπÏŒˆÎfÉ¯uπœˆçEˇPË!•±ˇˇuã»ˇuË   ∆F^ãÂ]¬ ÃÃÃÃÃÃÃÃÃUãÏVWã˘ËçˇˇfÉ? uãœË§ˇˇãE∫   fãfâ3…ø¡‡É¿˜‚ê¡˜Ÿ»QËÑD ãuÉƒãŒPËÄ  øj ¡‡jPˇ‰ÊÚø¡‡Pˇ6ˇwˇÿÊÚÉƒ_^]¬ ÃÃÃUãÏjˇhãRæd°    Pdâ%    QÚUfT¿ç∆ÚxOÃ(¬ÚMfT¿ç∆ÚY√f/»r]ÚYÀf/—rSˇuHÚE@ÉÏ ÚD$ÚE8ÚD$ÚE0ÚD$ÚE(Ú$ˇu$ˇu ˇuˇuËå  Éƒ4ãMÙdâ    ãÂ]√VjxËKD ãÉƒâu«E¸    ÖˆtãŒËiÄˇˇ«ÿNÃÎ3ˆÚEçFlÉÏ«E¸ˇˇˇˇÚD$ÚEÚ$PçFpPË≥∞ˇˇÚE@ÉƒãŒˇuHÉÏ ÚD$ÚE8ÚD$ÚE0ÚD$ÚE(Ú$ˇu$ˇu ˇuˇuË<ÛˇˇãMÙã∆^dâ    ãÂ]√ÃÃÃÃÃÃÃÃÃÃÃUãÏjˇhπ…¿d°    Pdâ%    ÉÏSã]VW«EÏ    ãuçù    PV«E¸    Ë` Éƒã«E¸    «EÏ   Ë»
 «E    ã¯É˚|9ãuâ]çd$ ã∆çô˜˚uã»+MˇMâO¸âEuÂãE_^[ãMÙdâ    ãÂ]√ãMÙã∆_^[dâ    ãÂ]√ÃÃÃÃÃÃÃÃÃÃÃÃÃÃUãÏjˇhãRæd°    Pdâ%    QVjlË∑D ÉƒâE«E¸    Ö¿tã»Ë◊~ˇˇãÎ3ˆˇu8ÚE0ãŒÉÏ «E¸ˇˇˇˇÚD$ÚE(ÚD$ÚE ÚD$ÚEÚ$ˇuˇuˇuˇuË÷ÒˇˇãMÙã∆^dâ    ãÂ]√ÃÃÃÃÃUãÏjˇhâ]æd°    Pdâ%    ÉÏSVWã}«E    ã]«E¸    çΩ    PSË 
 Éƒã«E¸    «E   Ëh	 3ˆÖˇéæ   ÚMãÿÚ]Ú†ƒ€Ú\ÀfnÁÛÊ‰ÚMÚe‡çd$ fn∆ÉÏÛÊ¿ÚX¬Ú^ƒÚY¡ÚX√ÚX¬ÚEË›EË›$ËïD Úƒ€Éƒ›]ËÚEËf/»wÚÿƒ€f/¡v(¡ÚMÚ†ƒ€Ú]Úe‡Ú,»â≥F;˜|ÑãE_^[ãMÙdâ    ãÂ]√ãMÙã√_^[dâ    ãÂ]√ÃÃÃÃÃÃÃÃÃÃÃÃÃUãÏVˇuãuˇuVˇuËj   Ú^ÉƒÚ®OÃf/√vKÚf/¬vAÚN fT¿ç∆Ú†é∆f/¡v&fW≈€fW≈€Ú»¡∆Ú^ÚÚF ^]√ÃÃÃÃÃÃUãÏÅÏ  Ú®ƒ€W…ãEÚ¬f¬VãuÛMåÚN ÛÚ¡f¡ÛFÚ¡f¡ÛF(Ö¿tÚãEÖ¿tÚf(¡∞ÚEÙf(¬WàEÛM§ËQD Ú`
 Ú^»ã}ÚG Ú¿ç∆Ú ∫∆ÚM‰ÚO(f»ÛN(ÚO(¡fT¬f/√Ür  ÚGÚEúfT¬f/√ÜZ  fW≈€ÚMÏ›EÏ›Ë·D ›]Ù›Eú›GË”D ÚEÙçÖ\ˇˇˇÉÏÚEÙ›]ÏÚ$PË:xÂˇÉƒãœPçÖ,ˇˇˇPËHWÂˇÉÏÛo ÛoHÛE¥Ûo@ çÖ,ˇˇˇÛM§ÛE‘ÚEÏÚ$PÛMƒËÌwÂˇÉƒãœPçÖ¸˛ˇˇPË˚VÂˇÛoe§Ú¿ç∆Ûo Ú ∫∆ÚmÃÛÖ\ˇˇˇÛo@ÚΩ\ˇˇˇÚµdˇˇˇÛÖlˇˇˇÛo@ ÛÖ|ˇˇˇf(ƒfT¬f/ÿv+(∆fT¬f/ÿv2¿àEÚ^˜2…ÚEÏf(ÊÚEÙÈç   f(œ(≈ÚYÃÚY∆fT fT¬Ú\»f/Ÿv∆äEÚ^Âä»ÎdÛoÛogÛE¥ÛoG ÛeƒÚmÃÛE‘f(ƒfT¬f/√väEÚ^Âä»Î)ÚMº2…(¡fT¬f/ÿv	Ûoe§2¿ÎÚ^M¥f(·äEÚu¥Ú®ƒ€(∆Ú\¡_fT¬f/√vÚv(≈Ú\¡fT¬f/√vÚ.Ñ¿tbf(ÃfT f/ÀvTf(ƒÑ…t.Ë÷D Úe‰ÛoMåÚYƒf»ÛNÚ¿ç∆Ú ∫∆Î#Ë®D Úe‰ÛoMåÚYƒf¡ÛFÎ–Úe‰ÚMÙf(¡fT¬f/√v=ÚY·fW%≈€Úf ãuÖˆt(¡ËoD ÚMÙÚãuÖˆtf(¡ËhD Ú^ãÂ]√ÃÃÃÃÃÃÃÃÃUãÏãEVãÒ+F0PË>@  ãMF4âãŒãE+F0PË(@  ãMF4^â]¬ ÃÃÃÃÃÃÃÃÃÃÃUãÏãEãUSã]VWã}∆  ∆ ∆ ã=PF  ~-†å  =PF  Ùâã=∞πˇˇÎçI †å  =∞πˇˇ~Ùâã2ãŒ¡˘ç13¡=º4  ~'ãE∆ ∆ãÖ¿~_∞πˇˇ^â[]√_PF  ^â[]√Å˛î  ~∆∆Åÿ‹ˇˇ_^[]√Å˛lÓˇˇ}ãE∆ ∆ack) {
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
              // 180¬∞ rotate left
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
              // 90¬∞ rotate right
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
              // 90¬∞ rotate left
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
      // Has to be last because some servers (eg: S3) expect the file to be the last parameter


      for (var _i3 = 0; _i3 < dataBlocks.length; _i3++) {
        var dataBlock = dataBlocks[_i3];
        formData.append(dataBlock.name, dataBlock.data, dataBlock.filename);
      }

      this.submitRequest(xhr, formData, files);
    } // Transforms all files with this.options.transformFile and invokes done with the transformed files when done.

  }, {
    key: "_transformFiles",
    value: function _transformFiles(files, done) {
      var _this16 = this;

      var transformedFiles = []; // Clumsy way of handling asynchronous calls, until I get to add a proper Future library.

      var doneCounter = 0;

      var _loop = function _loop(i) {
        _this16.options.transformFile.call(_this16, files[i], function (transformedFile) {
          transformedFiles[i] = transformedFile;

          if (++doneCounter === files.length) {
            done(transformedFiles);
          }
        });
      };

      for (var i = 0; i < files.length; i++) {
        _loop(i);
      }
    } // Takes care of adding other input elements of the form to the AJAX requestponsive-item,
.embed-responsive iframe,
.embed-responsive embed,
.embed-responsive object,
.embed-responsive video {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.embed-responsive-21by9::before {
  padding-top: 42.857143%;
}

.embed-responsive-16by9::before {
  padding-top: 56.25%;
}

.embed-responsive-4by3::before {
  padding-top: 75%;
}

.embed-responsive-1by1::before {
  padding-top: 100%;
}

.flex-row {
  -ms-flex-direction: row !important;
  flex-direction: row !important;
}

.flex-column {
  -ms-flex-direction: column !important;
  flex-direction: column !important;
}

.flex-row-reverse {
  -ms-flex-direction: row-reverse !important;
  flex-direction: row-reverse !important;
}

.flex-column-reverse {
  -ms-flex-direction: column-reverse !important;
  flex-direction: column-reverse !important;
}

.flex-wrap {
  -ms-flex-wrap: wrap !important;
  flex-wrap: wrap !important;
}

.flex-nowrap {
  -ms-flex-wrap: nowrap !important;
  flex-wrap: nowrap !important;
}

.flex-wrap-reverse {
  -ms-flex-wrap: wrap-reverse !important;
  flex-wrap: wrap-reverse !important;
}

.flex-fill {
  -ms-flex: 1 1 auto !important;
  flex: 1 1 auto !important;
}

.flex-grow-0 {
  -ms-flex-positive: 0 !important;
  flex-grow: 0 !important;
}

.flex-grow-1 {
  -ms-flex-positive: 1 !important;
  flex-grow: 1 !important;
}

.flex-shrink-0 {
  -ms-flex-negative: 0 !important;
  flex-shrink: 0 !important;
}

.flex-shrink-1 {
  -ms-flex-negative: 1 !important;
  flex-shrink: 1 !important;
}

.justify-content-start {
  -ms-flex-pack: start !important;
  justify-content: flex-start !important;
}

.justify-content-end {
  -ms-flex-pack: end !important;
  justify-content: flex-end !important;
}

.justify-content-center {
  -ms-flex-pack: center !important;
  justify-content: center !important;
}

.justify-content-between {
  -ms-flex-pack: justify !important;
  justify-content: space-between !important;
}

.justify-content-around {
  -ms-flex-pack: distribute !important;
  justify-content: space-around !important;
}

.align-items-start {
  -ms-flex-align: start !important;
  align-items: flex-start !important;
}

.align-items-end {
  -ms-flex-align: end !important;
  align-items: flex-end !important;
}

.align-items-center {
  -ms-flex-align: center !important;
  align-items: center !important;
}

.align-items-baseline {
  -ms-flex-align: baseline !important;
  align-items: baseline !important;
}

.align-items-stretch {
  -ms-flex-align: stretch !important;
  align-items: stretch !important;
}

.align-content-start {
  -ms-flex-line-pack: start !important;
  align-content: flex-start !important;
}

.align-content-end {
  -ms-flex-line-pack: end !important;
  align-content: flex-end !important;
}

.align-content-center {
  -ms-flex-line-pack: center !important;
  align-content: center !important;
}

.align-content-between {
  -ms-flex-line-pack: justify !important;
  align-content: space-between !important;
}

.align-content-around {
  -ms-flex-line-pack: distribute !important;
  align-content: space-around !important;
}

.align-content-stretch {
  -ms-flex-line-pack: stretch !important;
  align-content: stretch !important;
}

.align-self-auto {
  -ms-flex-item-align: auto !important;
  align-self: auto !important;
}

.align-self-start {
  -ms-flex-item-align: start !important;
  align-self: flex-start !important;
}

.align-self-end {
  -ms-flex-item-align: end !important;
  align-self: flex-end !important;
}

.align-self-center {
  -ms-flex-item-align: center !important;
  align-self: center !important;
}

.align-self-baseline {
  -ms-flex-item-align: baseline !important;
  align-self: baseline !important;
}

.align-self-stretch {
  -ms-flex-item-align: stretch !important;
  align-self: stretch !important;
}

@media (min-width: 576px) {
  .flex-sm-row {
    -ms-flex-direction: row !important;
    flex-direction: row !important;
  }
  .flex-sm-column {
    -ms-flex-direction: column !important;
    flex-direction: column !important;
  }
  .flex-sm-row-reverse {
    -ms-flex-direction: row-reverse !important;
    flex-direction: row-reverse !important;
  }
  .flex-sm-column-reverse {
    -ms-flex-direction: column-reverse !important;
    flex-direction: column-reverse !important;
  }
  .flex-sm-wrap {
    -ms-flex-wrap: wrap !important;
    flex-wrap: wrap !important;
  }
  .flex-sm-nowrap {
    -ms-flex-wrap: nowrap !important;
    flex-wrap: nowrap !important;
  }
  .flex-sm-wrap-reverse {
    -ms-flex-wrap: wrap-reverse !important;
    flex-wrap: wrap-reverse !important;
  }
  .flex-sm-fill {
    -ms-flex: 1 1 auto !important;
    flex: 1 1 auto !important;
  }
  .flex-sm-grow-0 {
    -ms-flex-positive: 0 !important;
    flex-grow: 0 !important;
  }
  .flex-sm-grow-1 {
    -ms-flex-positive: 1 !important;
    flex-grow: 1 !important;
  }
  .flex-sm-shrink-0 {
    -ms-flex-negative: 0 !important;
    flex-shrink: 0 !important;
  }
  .flex-sm-shrink-1 {
    -ms-flex-negative: 1 !important;
    flex-shrink: 1 !important;
  }
  .justify-content-sm-start {
    -ms-flex-pack: start !important;
    justify-content: flex-start !important;
  }
  .justify-content-sm-end {
    -ms-flex-pack: end !important;
    justify-content: flex-end !important;
  }
  .justify-content-sm-center {
    -ms-flex-pack: center !important;
    justify-content: center !important;
  }
  .justify-content-sm-between {
    -ms-flex-pack: justify !important;
    justify-content: space-between !important;
  }
  .justify-content-sm-around {
    -ms-flex-pack: distribute !important;
    justify-content: space-around !important;
  }
  .align-items-sm-start {
    -ms-flex-align: start !important;
    align-items: flex-start !important;
  }
  .align-items-sm-end {
    -ms-flex-align: end !important;
    align-items: flex-end !important;
  }
  .align-items-sm-center {
    -ms-flex-align: center !important;
    align-items: center !important;
  }
  .align-items-sm-baseline {
    -ms-flex-align: baseline !important;
    align-items: baseline !important;
  }
  .align-items-sm-stretch {
    -ms-flex-align: stretch !important;
    align-items: stretch !important;
  }
  .align-content-sm-start {
    -ms-flex-line-pack: start !important;
    align-content: flex-start !important;
  }
  .align-content-sm-end {
    -ms-flex-line-pack: end !important;
    align-content: flex-end !important;
  }
  .align-content-sm-center {
    -ms-flex-line-pack: center !important;
    align-content: center !important;
  }
  .align-content-sm-between {
    -ms-flex-line-pack: justify !important;
    align-content: space-between !important;
  }
  .align-content-sm-around {
    -ms-flex-line-pack: distribute !important;
    align-content: space-around !important;
  }
  .align-content-sm-stretch {
    -ms-flex-line-pack: stretch !important;
    align-content: stretch !important;
  }
  .align-self-sm-auto {
    -ms-flex-item-align: auto !important;
    align-self: auto !important;
  }
  .align-self-sm-start {
    -ms-flex-item-align: start !important;
    align-self: flex-start !important;
  }
  .align-self-sm-end {
    -ms-flex-item-align: end !important;
    align-self: flex-end !important;
  }
  .align-self-sm-center {
    -ms-flex-item-align: center !important;
    align-self: center !important;
  }
  .align-self-sm-baseline {
    -ms-flex-item-align: baseline !important;
    align-self: baseline !important;
  }
  .align-self-sm-stretch {
    -ms-flex-item-align: stretch !important;
    align-self: stretch !important;
  }
}

@media (min-width: 768px) {
  .flex-md-row {
    -ms-flex-direction: row !important;
    flex-direction: row !important;
  }
  .flex-md-column {
    -ms-flex-direction: column !important;
    flex-direction: column !important;
  }
  .flex-md-row-reverse {
    -ms-flex-direction: row-reverse !important;
    flex-direction: row-reverse !important;
  }
  .flex-md-column-reverse {
    -ms-flex-direction: column-reverse !important;
    flex-direction: column-reverse !important;
  }
  .flex-md-wrap {
    -ms-flex-wrap: wrap !important;
    flex-wrap: wrap !important;
  }
  .flex-md-nowrap {
    -ms-flex-wrap: nowrap !important;
    flex-wrap: nowrap !important;
  }
  .flex-md-wrap-reverse {
    -ms-flex-wrap: wrap-reverse !important;
    flex-wrap: wrap-reverse !important;
  }
  .flex-md-fill {
    -ms-flex: 1 1 auto !important;
    flex: 1 1 auto !important;
  }
  .flex-md-grow-0 {
    -ms-flex-positive: 0 !important;
    flex-grow: 0 !important;
  }
  .flex-md-grow-1 {
    -ms-flex-positive: 1 !important;
    flex-grow: 1 !important;
  }
  .flex-md-shrink-0 {
    -ms-flex-negative: 0 !important;
    flex-shrink: 0 !important;
  }
  .flex-md-shrink-1 {
    -ms-flex-negative: 1 !important;
    flex-shrink: 1 !important;
  }
  .justify-content-md-start {
    -ms-flex-pack: start !important;
    justify-content: flex-start !important;
  }
  .justify-content-md-end {
    -ms-flex-pack: end !important;
    justify-content: flex-end !important;
  }
  .justify-content-md-center {
    -ms-flex-pack: center !important;
    justify-content: center !important;
  }
  .justify-content-md-between {
    -ms-flex-pack: justify !important;
    justify-content: space-between !important;
  }
  .justify-content-md-around {
    -ms-flex-pack: distribute !important;
    justify-content: space-around !important;
  }
  .align-items-md-start {
    -ms-flex-align: start !important;
    align-items: flex-start !important;
  }
  .align-items-md-end {
    -ms-flex-align: end !important;
    align-items: flex-end !important;
  }
  .align-items-md-center {
    -ms-flex-align: center !important;
    align-items: center !important;
  }
  .align-items-md-baseline {
    -ms-flex-align: baseline !important;
    align-items: baseline !important;
  }
  .align-items-md-stretch {
    -ms-flex-align: stretch !important;
    align-items: stretch !important;
  }
  .align-content-md-start {
    -ms-flex-line-pack: start !important;
    align-content: flex-start !important;
  }
  .align-content-md-end {
    -ms-flex-line-pack: end !important;
    align-content: flex-end !important;
  }
  .align-content-md-center {
    -ms-flex-line-pack: center !important;
    align-content: center !important;
  }
  .align-content-md-between {
    -ms-flex-line-pack: justify !important;
    align-content: space-between !important;
  }
  .align-content-md-around {
    -ms-flex-line-pack: distribute !important;
    align-content: space-around !important;
  }
  .align-content-md-stretch {
    -ms-flex-line-pack: stretch !important;
    align-content: stretch !important;
  }
  .align-self-md-auto {
    -ms-flex-item-align: auto !important;
    align-self: auto !important;
  }
  .align-self-md-start {
    -ms-flex-item-align: start !important;
    align-self: flex-start !important;
  }
  .align-self-md-end {
    -ms-flex-item-align: end !important;
    align-self: flex-end !important;
  }
  .align-self-md-center {
    -ms-flex-item-align: center !important;
    align-self: center !important;
  }
  .align-self-md-baseline {
    -ms-flex-item-align: baseline !important;
    align-self: baseline !important;
  }
  .align-self-md-stretch {
    -ms-flex-item-align: stretch !important;
    align-self: stretch !important;
  }
}

@media (min-width: 992px) {
  .flex-lg-row {
    -ms-flex-direction: row !important;
    flex-direction: row !important;
  }
  .flex-lg-column {
    -ms-flex-direction: column !important;
    flex-direction: column !important;
  }
  .flex-lg-row-reverse {
    -ms-flex-direction: row-reverse !important;
    flex-direction: row-reverse !important;
  }
  .flex-lg-column-reverse {
    -ms-flex-direction: column-reverse !important;
    flex-direction: column-reverse !important;
  }
  .flex-lg-wrap {
    -ms-flex-wrap: wrap !important;
    flex-wrap: wrap !important;
  }
  .flex-lg-nowrap {
    -ms-flex-wrap: nowrap !important;
    flex-wrap: nowrap !important;
  }
  .flex-lg-wrap-reverse {
    -ms-flex-wrap: wrap-reverse !important;
    flex-wrap: wrap-reverse !important;
  }
  .flex-lg-fill {
    -ms-flex: 1 1 auto !important;
    flex: 1 1 auto !important;
  }
  .flex-lg-grow-0 {
    -ms-flex-positive: 0 !important;
    flex-grow: 0 !important;
  }
  .flex-lg-grow-1 {
    -ms-flex-positive: 1 !important;
    flex-grow: 1 !important;
  }
  .flex-lg-shrink-0 {
    -ms-flex-negative: 0 !important;
    flex-shrink: 0 !important;
  }
  .flex-lg-shrink-1 {
    -ms-flex-negative: 1 !important;
    flex-shrink: 1 !important;
  }
  .justify-content-lg-start {
    -ms-flex-pack: start !important;
    justify-content: flex-start !important;
  }
  .justify-content-lg-end {
    -ms-flex-pack: end !important;
    justify-content: flex-end !important;
  }
  .justify-content-lg-center {
    -ms-flex-pack: center !important;
    justify-content: center !important;
  }
  .justify-content-lg-between {
    -ms-flex-pack: justify !important;
    justify-content: space-between !important;
  }
  .justify-content-lg-around {
    -ms-flex-pack: distribute !important;
    justify-content: space-around !important;
  }
  .align-items-lg-start {
    -ms-flex-align: start !important;
    align-items: flex-start !important;
  }
  .align-items-lg-end {
    -ms-flex-align: end !important;
    align-items: flex-end !important;
  }
  .align-items-lg-center {
    -ms-flex-align: center !important;
    align-items: center !important;
  }
  .align-items-lg-baseline {
    -ms-flex-align: baseline !important;
    align-items: baseline !important;
  }
  .align-items-lg-stretch {
    -ms-flex-align: stretch !important;
    align-items: stretch !important;
  }
  .align-content-lg-start {
    -ms-flex-line-pack: start !important;
    align-content: flex-start !important;
  }
  .align-content-lg-end {
    -ms-flex-line-pack: end !important;
    align-content: flex-end !important;
  }
  .align-content-lg-center {
    -ms-flex-line-pack: center !important;
    align-content: center !important;
  }
  .align-content-lg-between {
    -ms-flex-line-pack: justify !important;
    align-content: space-between !important;
  }
  .align-content-lg-around {
    -ms-flex-line-pack: distribute !important;
    align-content: space-around !important;
  }
  .align-content-lg-stretch {
    -ms-flex-line-pack: stretch !important;
    align-content: stretch !important;
  }
  .align-self-lg-auto {
    -ms-flex-item-align: auto !important;
    align-self: auto !important;
  }
  .align-self-lg-start {
    -ms-flex-item-align: start !important;
    align-self: flex-start !important;
  }
  .align-self-lg-end {
    -ms-flex-item-align: end !important;
    align-self: flex-end !important;
  }
  .align-self-lg-center {
    -ms-flex-item-align: center !important;
    align-self: center !important;
  }
  .align-self-lg-baseline {
    -ms-flex-item-align: baseline !important;
    align-self: baseline !important;
  }
  .align-self-lg-stretch {
    -ms-flex-item-align: stretch !important;
    align-self: stretch !important;
  }
}

@media (min-width: 1200px) {
  .flex-xl-row {
    -ms-flex-direction: row !important;
    flex-direction: row !important;
  }
  .flex-xl-column {
    -ms-flex-direction: column !important;
    flex-direction: column !important;
  }
  .flex-xl-row-reverse {
    -ms-flex-direction: row-reverse !important;
    flex-direction: row-reverse !important;
  }
  .flex-xl-column-reverse {
    -ms-flex-direction: column-reverse !important;
    flex-direction: column-reverse !important;
  }
  .flex-xl-wrap {
    -ms-flex-wrap: wrap !important;
    flex-wrap: wrap !important;
  }
  .flex-xl-nowrap {
    -ms-flex-wrap: nowrap !important;
    flex-wrap: nowrap !important;
  }
  .flex-xl-wrap-reverse {
    -ms-flex-wrap: wrap-reverse !important;
    flex-wrap: wrap-reverse !important;
  }
  .flex-xl-fill {
    -ms-flex: 1 1 auto !important;
    flex: 1 1 auto !important;
  }
  .flex-xl-grow-0 {
    -ms-flex-positive: 0 !important;
    flex-grow: 0 !important;
  }
  .flex-xl-grow-1 {
    -ms-flex-positive: 1 !important;
    flex-grow: 1 !important;
  }
  .flex-xl-shrink-0 {
    -ms-flex-negative: 0 !important;
    flex-shrink: 0 !important;
  }
  .flex-xl-shrink-1 {
    -ms-flex-negative: 1 !important;
    flex-shrink: 1 !important;
  }
  .justify-content-xl-start {
    -ms-flex-pack: start !important;
    justify-content: flex-start !important;
  }
  .justify-content-xl-end {
    -ms-flex-pack: end !important;
    jr-dark .form-control-navbar:focus:-ms-input-placeholder{color:#fff}.navbar-orange.navbar-dark .form-control-navbar:focus::-ms-input-placeholder{color:#fff}.navbar-orange.navbar-dark .form-control-navbar:focus::placeholder{color:#fff}.navbar-orange.navbar-dark .form-control-navbar:focus,.navbar-orange.navbar-dark .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#fd8c2d;border-color:#fd9742!important;color:#fff}.navbar-yellow{background-color:#ffc107;color:#1f2d3d}.navbar-yellow.navbar-light .form-control-navbar::-webkit-input-placeholder{color:rgba(52,58,64,.8)}.navbar-yellow.navbar-light .form-control-navbar::-moz-placeholder{color:rgba(52,58,64,.8)}.navbar-yellow.navbar-light .form-control-navbar:-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-yellow.navbar-light .form-control-navbar::-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-yellow.navbar-light .form-control-navbar::placeholder{color:rgba(52,58,64,.8)}.navbar-yellow.navbar-light .form-control-navbar,.navbar-yellow.navbar-light .form-control-navbar+.input-group-append>.btn-navbar{background-color:#f2b500;border-color:#d8a200;color:rgba(52,58,64,.8)}.navbar-yellow.navbar-light .form-control-navbar:focus::-webkit-input-placeholder{color:#343a40}.navbar-yellow.navbar-light .form-control-navbar:focus::-moz-placeholder{color:#343a40}.navbar-yellow.navbar-light .form-control-navbar:focus:-ms-input-placeholder{color:#343a40}.navbar-yellow.navbar-light .form-control-navbar:focus::-ms-input-placeholder{color:#343a40}.navbar-yellow.navbar-light .form-control-navbar:focus::placeholder{color:#343a40}.navbar-yellow.navbar-light .form-control-navbar:focus,.navbar-yellow.navbar-light .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#edb100;border-color:#d8a200!important;color:#343a40}.navbar-yellow.navbar-dark .form-control-navbar::-webkit-input-placeholder{color:rgba(255,255,255,.8)}.navbar-yellow.navbar-dark .form-control-navbar::-moz-placeholder{color:rgba(255,255,255,.8)}.navbar-yellow.navbar-dark .form-control-navbar:-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-yellow.navbar-dark .form-control-navbar::-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-yellow.navbar-dark .form-control-navbar::placeholder{color:rgba(255,255,255,.8)}.navbar-yellow.navbar-dark .form-control-navbar,.navbar-yellow.navbar-dark .form-control-navbar+.input-group-append>.btn-navbar{background-color:#ffc61b;border-color:#ffcc35;color:rgba(255,255,255,.8)}.navbar-yellow.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder{color:#fff}.navbar-yellow.navbar-dark .form-control-navbar:focus::-moz-placeholder{color:#fff}.navbar-yellow.navbar-dark .form-control-navbar:focus:-ms-input-placeholder{color:#fff}.navbar-yellow.navbar-dark .form-control-navbar:focus::-ms-input-placeholder{color:#fff}.navbar-yellow.navbar-dark .form-control-navbar:focus::placeholder{color:#fff}.navbar-yellow.navbar-dark .form-control-navbar:focus,.navbar-yellow.navbar-dark .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#ffc721;border-color:#ffcc35!important;color:#fff}.navbar-green{background-color:#28a745;color:#fff}.navbar-green.navbar-light .form-control-navbar::-webkit-input-placeholder{color:rgba(52,58,64,.8)}.navbar-green.navbar-light .form-control-navbar::-moz-placeholder{color:rgba(52,58,64,.8)}.navbar-green.navbar-light .form-control-navbar:-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-green.navbar-light .form-control-navbar::-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-green.navbar-light .form-control-navbar::placeholder{color:rgba(52,58,64,.8)}.navbar-green.navbar-light .form-control-navbar,.navbar-green.navbar-light .form-control-navbar+.input-group-append>.btn-navbar{background-color:#24973e;border-color:#1f8236;color:rgba(52,58,64,.8)}.navbar-green.navbar-light .form-control-navbar:focus::-webkit-input-placeholder{color:#343a40}.navbar-green.navbar-light .form-control-navbar:focus::-moz-placeholder{color:#343a40}.navbar-green.navbar-light .form-control-navbar:focus:-ms-input-placeholder{color:#343a40}.navbar-green.navbar-light .form-control-navbar:focus::-ms-input-placeholder{color:#343a40}.navbar-green.navbar-light .form-control-navbar:focus::placeholder{color:#343a40}.navbar-green.navbar-light .form-control-navbar:focus,.navbar-green.navbar-light .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#23923d;border-color:#1f8236!important;color:#343a40}.navbar-green.navbar-dark .form-control-navbar::-webkit-input-placeholder{color:rgba(255,255,255,.8)}.navbar-green.navbar-dark .form-control-navbar::-moz-placeholder{color:rgba(255,255,255,.8)}.navbar-green.navbar-dark .form-control-navbar:-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-green.navbar-dark .form-control-navbar::-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-green.navbar-dark .form-control-navbar::placeholder{color:rgba(255,255,255,.8)}.navbar-green.navbar-dark .form-control-navbar,.navbar-green.navbar-dark .form-control-navbar+.input-group-append>.btn-navbar{background-color:#2cb74c;border-color:#31cc54;color:rgba(255,255,255,.8)}.navbar-green.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder{color:#fff}.navbar-green.navbar-dark .form-control-navbar:focus::-moz-placeholder{color:#fff}.navbar-green.navbar-dark .form-control-navbar:focus:-ms-input-placeholder{color:#fff}.navbar-green.navbar-dark .form-control-navbar:focus::-ms-input-placeholder{color:#fff}.navbar-green.navbar-dark .form-control-navbar:focus::placeholder{color:#fff}.navbar-green.navbar-dark .form-control-navbar:focus,.navbar-green.navbar-dark .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#2dbc4e;border-color:#31cc54!important;color:#fff}.navbar-teal{background-color:#20c997;color:#fff}.navbar-teal.navbar-light .form-control-navbar::-webkit-input-placeholder{color:rgba(52,58,64,.8)}.navbar-teal.navbar-light .form-control-navbar::-moz-placeholder{color:rgba(52,58,64,.8)}.navbar-teal.navbar-light .form-control-navbar:-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-teal.navbar-light .form-control-navbar::-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-teal.navbar-light .form-control-navbar::placeholder{color:rgba(52,58,64,.8)}.navbar-teal.navbar-light .form-control-navbar,.navbar-teal.navbar-light .form-control-navbar+.input-group-append>.btn-navbar{background-color:#1db78a;border-color:#1aa179;color:rgba(52,58,64,.8)}.navbar-teal.navbar-light .form-control-navbar:focus::-webkit-input-placeholder{color:#343a40}.navbar-teal.navbar-light .form-control-navbar:focus::-moz-placeholder{color:#343a40}.navbar-teal.navbar-light .form-control-navbar:focus:-ms-input-placeholder{color:#343a40}.navbar-teal.navbar-light .form-control-navbar:focus::-ms-input-placeholder{color:#343a40}.navbar-teal.navbar-light .form-control-navbar:focus::placeholder{color:#343a40}.navbar-teal.navbar-light .form-control-navbar:focus,.navbar-teal.navbar-light .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#1cb386;border-color:#1aa179!important;color:#343a40}.navbar-teal.navbar-dark .form-control-navbar::-webkit-input-placeholder{color:rgba(255,255,255,.8)}.navbar-teal.navbar-dark .form-control-navbar::-moz-placeholder{color:rgba(255,255,255,.8)}.navbar-teal.navbar-dark .form-control-navbar:-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-teal.navbar-dark .form-control-navbar::-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-teal.navbar-dark .form-control-navbar::placeholder{color:rgba(255,255,255,.8)}.navbar-teal.navbar-dark .form-control-navbar,.navbar-teal.navbar-dark .form-control-navbar+.input-group-append>.btn-navbar{background-color:#23dba4;border-color:#38dfae;color:rgba(255,255,255,.8)}.navbar-teal.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder{color:#fff}.navbar-teal.navbar-dark .form-control-navbar:focus::-moz-placeholder{color:#fff}.navbar-teal.navbar-dark .form-control-navbar:focus:-ms-input-placeholder{color:#fff}.navbar-teal.navbar-dark .form-control-navbar:focus::-ms-input-placeholder{color:#fff}.navbar-teal.navbar-dark .form-control-navbar:focus::placeholder{color:#fff}.navbar-teal.navbar-dark .form-control-navbar:focus,.navbar-teal.navbar-dark .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#26dca6;border-color:#38dfae!important;color:#fff}.navbar-cyan{background-color:#17a2b8;color:#fff}.navbar-cyan.navbar-light .form-control-navbar::-webkit-input-placeholder{color:rgba(52,58,64,.8)}.navbar-cyan.navbar-light .form-control-navbar::-moz-placeholder{color:rgba(52,58,64,.8)}.navbar-cyan.navbar-light .form-control-navbar:-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-cyan.navbar-light .form-control-navbar::-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-cyan.navbar-light .form-control-navbar::placeholder{color:rgba(52,58,64,.8)}.navbar-cyan.navbar-light .form-control-navbar,.navbar-cyan.navbar-light .form-control-navbar+.input-group-append>.btn-navbar{background-color:#1592a6;border-color:#127e8f;color:rgba(52,58,64,.8)}.navbar-cyan.navbar-light .form-control-navbar:focus::-webkit-input-placeholder{color:#343a40}.navbar-cyan.navbar-light .form-control-navbar:focus::-moz-placeholder{color:#343a40}.navbar-cyan.navbar-light .form-control-navbar:focus:-ms-input-placeholder{color:#343a40}.navbar-cyan.navbar-light .form-control-navbar:focus::-ms-input-placeholder{color:#343a40}.navbar-cyan.navbar-light .form-control-navbar:focus::placeholder{color:#343a40}.navbar-cyan.navbar-light .form-control-navbar:focus,.navbar-cyan.navbar-light .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#148ea1;border-color:#127e8f!important;color:#343a40}.navbar-cyan.navbar-dark .form-control-navbar::-webkit-input-placeholder{color:rgba(255,255,255,.8)}.navbar-cyan.navbar-dark .form-control-navbar::-moz-placeholder{color:rgba(255,255,255,.8)}.navbar-cyan.navbar-dark .form-control-navbar:-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-cyan.navbar-dark .form-control-navbar::-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-cyan.navbar-dark .form-control-navbar::placeholder{color:rgba(255,255,255,.8)}.navbar-cyan.navbar-dark .form-control-navbar,.navbar-cyan.navbar-dark .form-control-navbar+.input-group-append>.btn-navbar{background-color:#19b2ca;border-color:#1cc6e1;color:rgba(255,255,255,.8)}.navbar-cyan.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder{color:#fff}.navbar-cyan.navbar-dark .form-control-navbar:focus::-moz-placeholder{color:#fff}.navbar-cyan.navbar-dark .form-control-navbar:focus:-ms-input-placeholder{color:#fff}.navbar-cyan.navbar-dark .form-control-navbar:focus::-ms-input-placeholder{color:#fff}.navbar-cyan.navbar-dark .form-control-navbar:focus::placeholder{color:#fff}.navbar-cyan.navbar-dark .form-control-navbar:focus,.navbar-cyan.navbar-dark .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#1ab6cf;border-color:#1cc6e1!important;color:#fff}.navbar-white{background-color:#fff;color:#1f2d3d}.navbar-white.navbar-light .form-control-navbar::-webkit-input-placeholder{color:rgba(52,58,64,.8)}.navbar-white.navbar-light .form-control-navbar::-moz-placeholder{color:rgba(52,58,64,.8)}.navbar-white.navbar-light .form-control-navbar:-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-white.navbar-light .form-control-navbar::-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-white.navbar-light .form-control-navbar::placeholder{color:rgba(52,58,64,.8)}.navbar-white.navbar-light .form-control-navbar,.navbar-white.navbar-light .form-control-navbar+.input-group-append>.btn-navbar{background-color:#f5f5f5;border-color:#e8e8e8;color:rgba(52,58,64,.8)}.navbar-white.navbar-light .form-control-navbar:focus::-webkit-input-placeholder{color:#343a40}.navbar-white.navbar-light .form-control-navbar:focus::-moz-placeholder{color:#343a40}.navbar-white.navbar-light .form-control-navbar:focus:-ms-input-placeholder{color:#343a40}.navbar-white.navbar-light .form-control-navbar:focus::-ms-input-placeholder{color:#343a40}.navbar-white.navbar-light .form-control-navbar:focus::placeholder{color:#343a40}.navbar-white.navbar-light .form-control-navbar:focus,.navbar-white.navbar-light .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#f2f2f2;border-color:#e8e8e8!important;color:#343a40}.navbar-white.navbar-dark .form-control-navbar::-webkit-input-placeholder{color:rgba(255,255,255,.8)}.navbar-white.navbar-dark .form-control-navbar::-moz-placeholder{color:rgba(255,255,255,.8)}.navbar-white.navbar-dark .form-control-navbar:-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-white.navbar-dark .form-control-navbar::-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-white.navbar-dark .form-control-navbar::placeholder{color:rgba(255,255,255,.8)}.navbar-white.navbar-dark .form-control-navbar,.navbar-white.navbar-dark .form-control-navbar+.input-group-append>.btn-navbar{background-color:#fff;border-color:#fff;color:rgba(255,255,255,.8)}.navbar-white.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder{color:#fff}.navbar-white.navbar-dark .form-control-navbar:focus::-moz-placeholder{color:#fff}.navbar-white.navbar-dark .form-control-navbar:focus:-ms-input-placeholder{color:#fff}.navbar-white.navbar-dark .form-control-navbar:focus::-ms-input-placeholder{color:#fff}.navbar-white.navbar-dark .form-control-navbar:focus::placeholder{color:#fff}.navbar-white.navbar-dark .form-control-navbar:focus,.navbar-white.navbar-dark .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#fff;border-color:#fff!important;color:#fff}.navbar-gray{background-color:#6c757d;color:#fff}.navbar-gray.navbar-light .form-control-navbar::-webkit-input-placeholder{color:rgba(52,58,64,.8)}.navbar-gray.navbar-light .form-control-navbar::-moz-placeholder{color:rgba(52,58,64,.8)}.navbar-gray.navbar-light .form-control-navbar:-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-gray.navbar-light .form-control-navbar::-ms-input-placeholder{color:rgba(52,58,64,.8)}.navbar-gray.navbar-light .form-control-navbar::placeholder{color:rgba(52,58,64,.8)}.navbar-gray.navbar-light .form-control-navbar,.navbar-gray.navbar-light .form-control-navbar+.input-group-append>.btn-navbar{background-color:#636b72;border-color:#575e64;color:rgba(52,58,64,.8)}.navbar-gray.navbar-light .form-control-navbar:focus::-webkit-input-placeholder{color:#343a40}.navbar-gray.navbar-light .form-control-navbar:focus::-moz-placeholder{color:#343a40}.navbar-gray.navbar-light .form-control-navbar:focus:-ms-input-placeholder{color:#343a40}.navbar-gray.navbar-light .form-control-navbar:focus::-ms-input-placeholder{color:#343a40}.navbar-gray.navbar-light .form-control-navbar:focus::placeholder{color:#343a40}.navbar-gray.navbar-light .form-control-navbar:focus,.navbar-gray.navbar-light .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#60686f;border-color:#575e64!important;color:#343a40}.navbar-gray.navbar-dark .form-control-navbar::-webkit-input-placeholder{color:rgba(255,255,255,.8)}.navbar-gray.navbar-dark .form-control-navbar::-moz-placeholder{color:rgba(255,255,255,.8)}.navbar-gray.navbar-dark .form-control-navbar:-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-gray.navbar-dark .form-control-navbar::-ms-input-placeholder{color:rgba(255,255,255,.8)}.navbar-gray.navbar-dark .form-control-navbar::placeholder{color:rgba(255,255,255,.8)}.navbar-gray.navbar-dark .form-control-navbar,.navbar-gray.navbar-dark .form-control-navbar+.input-group-append>.btn-navbar{background-color:#757f88;border-color:#838c94;color:rgba(255,255,255,.8)}.navbar-gray.navbar-dark .form-control-navbar:focus::-webkit-input-placeholder{color:#fff}.navbar-gray.navbar-dark .form-control-navbar:focus::-moz-placeholder{color:#fff}.navbar-gray.navbar-dark .form-control-navbar:focus:-ms-input-placeholder{color:#fff}.navbar-gray.navbar-dark .form-control-navbar:focus::-ms-input-placeholder{color:#fff}.navbar-gray.navbar-dark .form-control-navbar:focus::placeholder{color:#fff}.navbar-gray.navbar-dark .form-control-navbar:focus,.navbar-gray.navbar-dark .form-control-navbar:focus+.input-group-append .btn-navbar{background-color:#78828a;border-color:#838c94!important;color:#fff}.navbar-gray-dark{backgrounenter-atom-green .pace-activity {\n  border-color: #28a745;\n}\n\n.pace-center-atom-green .pace-activity::after, .pace-center-atom-green .pace-activity::before {\n  border-color: #28a745;\n}\n\n.pace-center-circle-green .pace .pace-progress {\n  background: rgba(40, 167, 69, 0.8);\n  color: #fff;\n}\n\n.pace-center-radar-green .pace .pace-activity {\n  border-color: #28a745 transparent transparent;\n}\n\n.pace-center-radar-green .pace .pace-activity::before {\n  border-color: #28a745 transparent transparent;\n}\n\n.pace-center-simple-green .pace {\n  background: #fff;\n  border-color: #28a745;\n}\n\n.pace-center-simple-green .pace .pace-progress {\n  background: #28a745;\n}\n\n.pace-material-green .pace {\n  color: #28a745;\n}\n\n.pace-corner-indicator-green .pace .pace-activity {\n  background: #28a745;\n}\n\n.pace-corner-indicator-green .pace .pace-activity::after,\n.pace-corner-indicator-green .pace .pace-activity::before {\n  border: 5px solid #fff;\n}\n\n.pace-corner-indicator-green .pace .pace-activity::before {\n  border-right-color: rgba(40, 167, 69, 0.2);\n  border-left-color: rgba(40, 167, 69, 0.2);\n}\n\n.pace-corner-indicator-green .pace .pace-activity::after {\n  border-top-color: rgba(40, 167, 69, 0.2);\n  border-bottom-color: rgba(40, 167, 69, 0.2);\n}\n\n.pace-fill-left-green .pace .pace-progress {\n  background-color: rgba(40, 167, 69, 0.2);\n}\n\n.pace-flash-green .pace .pace-progress {\n  background: #28a745;\n}\n\n.pace-flash-green .pace .pace-progress-inner {\n  box-shadow: 0 0 10px #28a745, 0 0 5px #28a745;\n}\n\n.pace-flash-green .pace .pace-activity {\n  border-top-color: #28a745;\n  border-left-color: #28a745;\n}\n\n.pace-loading-bar-green .pace .pace-progress {\n  background: #28a745;\n  color: #28a745;\n  box-shadow: 120px 0 #fff, 240px 0 #fff;\n}\n\n.pace-loading-bar-green .pace .pace-activity {\n  box-shadow: inset 0 0 0 2px #28a745, inset 0 0 0 7px #fff;\n}\n\n.pace-mac-osx-green .pace .pace-progress {\n  background-color: #28a745;\n  box-shadow: inset -1px 0 #28a745, inset 0 -1px #28a745, inset 0 2px rgba(255, 255, 255, 0.5), inset 0 6px rgba(255, 255, 255, 0.3);\n}\n\n.pace-mac-osx-green .pace .pace-activity {\n  background-image: radial-gradient(rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 100%);\n  height: 12px;\n}\n\n.pace-progress-color-green .pace-progress {\n  color: #28a745;\n}\n\n.pace-teal .pace .pace-progress {\n  background: #20c997;\n}\n\n.pace-barber-shop-teal .pace {\n  background: #fff;\n}\n\n.pace-barber-shop-teal .pace .pace-progress {\n  background: #20c997;\n}\n\n.pace-barber-shop-teal .pace .pace-activity {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);\n}\n\n.pace-big-counter-teal .pace .pace-progress::after {\n  color: rgba(32, 201, 151, 0.2);\n}\n\n.pace-bounce-teal .pace .pace-activity {\n  background: #20c997;\n}\n\n.pace-center-atom-teal .pace-progress {\n  height: 100px;\n  width: 80px;\n}\n\n.pace-center-atom-teal .pace-progress::before {\n  background: #20c997;\n  color: #fff;\n  font-size: .8rem;\n  line-height: .7rem;\n  padding-top: 17%;\n}\n\n.pace-center-atom-teal .pace-activity {\n  border-color: #20c997;\n}\n\n.pace-center-atom-teal .pace-activity::after, .pace-center-atom-teal .pace-activity::before {\n  border-color: #20c997;\n}\n\n.pace-center-circle-teal .pace .pace-progress {\n  background: rgba(32, 201, 151, 0.8);\n  color: #fff;\n}\n\n.pace-center-radar-teal .pace .pace-activity {\n  border-color: #20c997 transparent transparent;\n}\n\n.pace-center-radar-teal .pace .pace-activity::before {\n  border-color: #20c997 transparent transparent;\n}\n\n.pace-center-simple-teal .pace {\n  background: #fff;\n  border-color: #20c997;\n}\n\n.pace-center-simple-teal .pace .pace-progress {\n  background: #20c997;\n}\n\n.pace-material-teal .pace {\n  color: #20c997;\n}\n\n.pace-corner-indicator-teal .pace .pace-activity {\n  background: #20c997;\n}\n\n.pace-corner-indicator-teal .pace .pace-activity::after,\n.pace-corner-indicator-teal .pace .pace-activity::before {\n  border: 5px solid #fff;\n}\n\n.pace-corner-indicator-teal .pace .pace-activity::before {\n  border-right-color: rgba(32, 201, 151, 0.2);\n  border-left-color: rgba(32, 201, 151, 0.2);\n}\n\n.pace-corner-indicator-teal .pace .pace-activity::after {\n  border-top-color: rgba(32, 201, 151, 0.2);\n  border-bottom-color: rgba(32, 201, 151, 0.2);\n}\n\n.pace-fill-left-teal .pace .pace-progress {\n  background-color: rgba(32, 201, 151, 0.2);\n}\n\n.pace-flash-teal .pace .pace-progress {\n  background: #20c997;\n}\n\n.pace-flash-teal .pace .pace-progress-inner {\n  box-shadow: 0 0 10px #20c997, 0 0 5px #20c997;\n}\n\n.pace-flash-teal .pace .pace-activity {\n  border-top-color: #20c997;\n  border-left-color: #20c997;\n}\n\n.pace-loading-bar-teal .pace .pace-progress {\n  background: #20c997;\n  color: #20c997;\n  box-shadow: 120px 0 #fff, 240px 0 #fff;\n}\n\n.pace-loading-bar-teal .pace .pace-activity {\n  box-shadow: inset 0 0 0 2px #20c997, inset 0 0 0 7px #fff;\n}\n\n.pace-mac-osx-teal .pace .pace-progress {\n  background-color: #20c997;\n  box-shadow: inset -1px 0 #20c997, inset 0 -1px #20c997, inset 0 2px rgba(255, 255, 255, 0.5), inset 0 6px rgba(255, 255, 255, 0.3);\n}\n\n.pace-mac-osx-teal .pace .pace-activity {\n  background-image: radial-gradient(rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 100%);\n  height: 12px;\n}\n\n.pace-progress-color-teal .pace-progress {\n  color: #20c997;\n}\n\n.pace-cyan .pace .pace-progress {\n  background: #17a2b8;\n}\n\n.pace-barber-shop-cyan .pace {\n  background: #fff;\n}\n\n.pace-barber-shop-cyan .pace .pace-progress {\n  background: #17a2b8;\n}\n\n.pace-barber-shop-cyan .pace .pace-activity {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);\n}\n\n.pace-big-counter-cyan .pace .pace-progress::after {\n  color: rgba(23, 162, 184, 0.2);\n}\n\n.pace-bounce-cyan .pace .pace-activity {\n  background: #17a2b8;\n}\n\n.pace-center-atom-cyan .pace-progress {\n  height: 100px;\n  width: 80px;\n}\n\n.pace-center-atom-cyan .pace-progress::before {\n  background: #17a2b8;\n  color: #fff;\n  font-size: .8rem;\n  line-height: .7rem;\n  padding-top: 17%;\n}\n\n.pace-center-atom-cyan .pace-activity {\n  border-color: #17a2b8;\n}\n\n.pace-center-atom-cyan .pace-activity::after, .pace-center-atom-cyan .pace-activity::before {\n  border-color: #17a2b8;\n}\n\n.pace-center-circle-cyan .pace .pace-progress {\n  background: rgba(23, 162, 184, 0.8);\n  color: #fff;\n}\n\n.pace-center-radar-cyan .pace .pace-activity {\n  border-color: #17a2b8 transparent transparent;\n}\n\n.pace-center-radar-cyan .pace .pace-activity::before {\n  border-color: #17a2b8 transparent transparent;\n}\n\n.pace-center-simple-cyan .pace {\n  background: #fff;\n  border-color: #17a2b8;\n}\n\n.pace-center-simple-cyan .pace .pace-progress {\n  background: #17a2b8;\n}\n\n.pace-material-cyan .pace {\n  color: #17a2b8;\n}\n\n.pace-corner-indicator-cyan .pace .pace-activity {\n  background: #17a2b8;\n}\n\n.pace-corner-indicator-cyan .pace .pace-activity::after,\n.pace-corner-indicator-cyan .pace .pace-activity::before {\n  border: 5px solid #fff;\n}\n\n.pace-corner-indicator-cyan .pace .pace-activity::before {\n  border-right-color: rgba(23, 162, 184, 0.2);\n  border-left-color: rgba(23, 162, 184, 0.2);\n}\n\n.pace-corner-indicator-cyan .pace .pace-activity::after {\n  border-top-color: rgba(23, 162, 184, 0.2);\n  border-bottom-color: rgba(23, 162, 184, 0.2);\n}\n\n.pace-fill-left-cyan .pace .pace-progress {\n  background-color: rgba(23, 162, 184, 0.2);\n}\n\n.pace-flash-cyan .pace .pace-progress {\n  background: #17a2b8;\n}\n\n.pace-flash-cyan .pace .pace-progress-inner {\n  box-shadow: 0 0 10px #17a2b8, 0 0 5px #17a2b8;\n}\n\n.pace-flash-cyan .pace .pace-activity {\n  border-top-color: #17a2b8;\n  border-left-color: #17a2b8;\n}\n\n.pace-loading-bar-cyan .pace .pace-progress {\n  background: #17a2b8;\n  color: #17a2b8;\n  box-shadow: 120px 0 #fff, 240px 0 #fff;\n}\n\n.pace-loading-bar-cyan .pace .pace-activity {\n  box-shadow: inset 0 0 0 2px #17a2b8, inset 0 0 0 7px #fff;\n}\n\n.pace-mac-osx-cyan .pace .pace-progress {\n  background-color: #17a2b8;\n  box-shadow: inset -1px 0 #17a2b8, inset 0 -1px #17a2b8, inset 0 2px rgba(255, 255, 255, 0.5), inset 0 6px rgba(255, 255, 255, 0.3);\n}\n\n.pace-mac-osx-cyan .pace .pace-activity {\n  background-image: radial-gradient(rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 100%);\n  height: 12px;\n}\n\n.pace-progress-color-cyan .pace-progress {\n  color: #17a2b8;\n}\n\n.pace-white .pace .pace-progress {\n  background: #fff;\n}\n\n.pace-barber-shop-white .pace {\n  background: #1f2d3d;\n}\n\n.pace-barber-shop-white .pace .pace-progress {\n  background: #fff;\n}\n\n.pace-barber-shop-white .pace .pace-activity {\n  background-image: linear-gradient(45deg, rgba(31, 45, 61, 0.2) 25%, transparent 25%, transparent 50%, rgba(31, 45, 61, 0.2) 50%, rgba(31, 45, 61, 0.2) 75%, transparent 75%, transparent);\n}\n\n.pace-big-counter-white .pace .pace-progress::after {\n  color: rgba(255, 255, 255, 0.2);\n}\n\n.pace-bounce-white .pace .pace-activity {\n  background: #fff;\n}\n\n.pace-center-atom-white .pace-progress {\n  height: 100px;\n  width: 80px;\n}\n\n.pace-center-atom-white .pace-progress::before {\n  background: #fff;\n  color: #1f2d3d;\n  font-size: .8rem;\n  line-height: .7rem;\n  padding-top: 17%;\n}\n\n.pace-center-atom-white .pace-activity {\n  border-color: #fff;\n}\n\n.pace-center-atom-white .pace-activity::after, .pace-center-atom-white .pace-activity::before {\n  border-color: #fff;\n}\n\n.pace-center-circle-white .pace .pace-progress {\n  background: rgba(255, 255, 255, 0.8);\n  color: #1f2d3d;\n}\n\n.pace-center-radar-white .pace .pace-activity {\n  border-color: #fff transparent transparent;\n}\n\n.pace-center-radar-white .pace .pace-activity::before {\n  border-color: #fff transparent transparent;\n}\n\n.pace-center-simple-white .pace {\n  background: #1f2d3d;\n  border-color: #fff;\n}\n\n.pace-center-simple-white .pace .pace-progress {\n  background: #fff;\n}\n\n.pace-material-white .pace {\n  color: #fff;\n}\n\n.pace-corner-indicator-white .pace .pace-activity {\n  background: #fff;\n}\n\n.pace-corner-indicator-white .pace .pace-activity::after,\n.pace-corner-indicator-white .pace .pace-activity::before {\n  border: 5px solid #1f2d3d;\n}\n\n.pace-corner-indicator-white .pace .pace-activity::before {\n  border-right-color: rgba(255, 255, 255, 0.2);\n  border-left-color: rgba(255, 255, 255, 0.2);\n}\n\n.pace-corner-indicator-white .pace .pace-activity::after {\n  border-top-color: rgba(255, 255, 255, 0.2);\n  border-bottom-color: rgba(255, 255, 255, 0.2);\n}\n\n.pace-fill-left-white .pace .pace-progress {\n  background-color: rgba(255, 255, 255, 0.2);\n}\n\n.pace-flash-white .pace .pace-progress {\n  background: #fff;\n}\n\n.pace-flash-white .pace .pace-progress-inner {\n  box-shadow: 0 0 10px #fff, 0 0 5px #fff;\n}\n\n.pace-flash-white .pace .pace-activity {\n  border-top-color: #fff;\n  border-left-color: #fff;\n}\n\n.pace-loading-bar-white .pace .pace-progress {\n  background: #fff;\n  color: #fff;\n  box-shadow: 120px 0 #1f2d3d, 240px 0 #1f2d3d;\n}\n\n.pace-loading-bar-white .pace .pace-activity {\n  box-shadow: inset 0 0 0 2px #fff, inset 0 0 0 7px #1f2d3d;\n}\n\n.pace-mac-osx-white .pace .pace-progress {\n  background-color: #fff;\n  box-shadow: inset -1px 0 #fff, inset 0 -1px #fff, inset 0 2px rgba(31, 45, 61, 0.5), inset 0 6px rgba(31, 45, 61, 0.3);\n}\n\n.pace-mac-osx-white .pace .pace-activity {\n  background-image: radial-gradient(rgba(31, 45, 61, 0.65) 0%, rgba(31, 45, 61, 0.15) 100%);\n  height: 12px;\n}\n\n.pace-progress-color-white .pace-progress {\n  color: #fff;\n}\n\n.pace-gray .pace .pace-progress {\n  background: #6c757d;\n}\n\n.pace-barber-shop-gray .pace {\n  background: #fff;\n}\n\n.pace-barber-shop-gray .pace .pace-progress {\n  background: #6c757d;\n}\n\n.pace-barber-shop-gray .pace .pace-activity {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);\n}\n\n.pace-big-counter-gray .pace .pace-progress::after {\n  color: rgba(108, 117, 125, 0.2);\n}\n\n.pace-bounce-gray .pace .pace-activity {\n  background: #6c757d;\n}\n\n.pace-center-atom-gray .pace-progress {\n  height: 100px;\n  width: 80px;\n}\n\n.pace-center-atom-gray .pace-progress::before {\n  background: #6c757d;\n  color: #fff;\n  font-size: .8rem;\n  line-height: .7rem;\n  padding-top: 17%;\n}\n\n.pace-center-atom-gray .pace-activity {\n  border-color: #6c757d;\n}\n\n.pace-center-atom-gray .pace-activity::after, .pace-center-atom-gray .pace-activity::before {\n  border-color: #6c757d;\n}\n\n.pace-center-circle-gray .pace .pace-progress {\n  background: rgba(108, 117, 125, 0.8);\n  color: #fff;\n}\n\n.pace-center-radar-gray .pace .pace-activity {\n  border-color: #6c757d transparent transparent;\n}\n\n.pace-center-radar-gray .pace .pace-activity::before {\n  border-color: #6c757d transparent transparent;\n}\n\n.pace-center-simple-gray .pace {\n  background: #fff;\n  border-color: #6c757d;\n}\n\n.pace-center-simple-gray .pace .pace-progress {\n  background: #6c757d;\n}\n\n.pace-material-gray .pace {\n  color: #6c757d;\n}\n\n.pace-corner-indicator-gray .pace .pace-activity {\n  background: #6c757d;\n}\n\n.pace-corner-indicator-gray .pace .pace-activity::after,\n.pace-corner-indicator-gray .pace .pace-activity::before {\n  border: 5px solid #fff;\n}\n\n.pace-corner-indicator-gray .pace .pace-activity::before {\n  border-right-color: rgba(108, 117, 125, 0.2);\n  border-left-color: rgba(108, 117, 125, 0.2);\n}\n\n.pace-corner-indicator-gray .pace .pace-activity::after {\n  border-top-color: rgba(108, 117, 125, 0.2);\n  border-bottom-color: rgba(108, 117, 125, 0.2);\n}\n\n.pace-fill-left-gray .pace .pace-progress {\n  background-color: rgba(108, 117, 125, 0.2);\n}\n\n.pace-flash-gray .pace .pace-progress {\n  background: #6c757d;\n}\n\n.pace-flash-gray .pace .pace-progress-inner {\n  box-shadow: 0 0 10px #6c757d, 0 0 5px #6c757d;\n}\n\n.pace-flash-gray .pace .pace-activity {\n  border-top-color: #6c757d;\n  border-left-color: #6c757d;\n}\n\n.pace-loading-bar-gray .pace .pace-progress {\n  background: #6c757d;\n  color: #6c757d;\n  box-shadow: 120px 0 #fff, 240px 0 #fff;\n}\n\n.pace-loading-bar-gray .pace .pace-activity {\n  box-shadow: inset 0 0 0 2px #6c757d, inset 0 0 0 7px #fff;\n}\n\n.pace-mac-osx-gray .pace .pace-progress {\n  background-color: #6c757d;\n  box-shadow: inset -1px 0 #6c757d, inset 0 -1px #6c757d, inset 0 2px rgba(255, 255, 255, 0.5), inset 0 6px rgba(255, 255, 255, 0.3);\n}\n\n.pace-mac-osx-gray .pace .pace-activity {\n  background-image: radial-gradient(rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 100%);\n  height: 12px;\n}\n\n.pace-progress-color-gray .pace-progress {\n  color: #6c757d;\n}\n\n.pace-gray-dark .pace .pace-progress {\n  background: #343a40;\n}\n\n.pace-barber-shop-gray-dark .pace {\n  background: #fff;\n}\n\n.pace-barber-shop-gray-dark .pace .pace-progress {\n  background: #343a40;\n}\n\n.pace-barber-shop-gray-dark .pace .pace-activity {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent);\n}\n\n.pace-big-counter-gray-dark .pace .pace-progress::after {\n  color: rgba(52, 58, 64, 0.2);\n}\n\n.pace-bounce-gray-dark .pace .pace-activity {\n  background: #343a40;\n}\n\n.pace-center-atom-gray-dark .pace-progress {\n  height: 100px;\n  width: 80px;\n}\n\n.pace-center-atom-gray-dark .pace-progress::before {\n  background: #343a40;\n  color: #fff;\n  font-size: .8rem;\n  line-height: .7rem;\n  padding-top: 17%;\n}\n\n.pace-center-atom-gray-dark .pace-activity {\n  border-color: #343a40;\n}\n\n.pace-center-atom-gray-dark .pace-activity::after, .pace-center-atom-gray-dark .pace-activity::before {\n  border-color: #343a40;\n}\n\n.pace-center-circle-gray-dark .pace .pace-progress {\n  background: rgba