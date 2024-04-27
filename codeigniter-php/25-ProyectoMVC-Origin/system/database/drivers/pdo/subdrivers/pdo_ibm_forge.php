<?php
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP
 *
 * This content is released under the MIT License (MIT)
 *
 * Copyright (c) 2019 - 2022, CodeIgniter Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @package	CodeIgniter
 * @author	EllisLab Dev Team
 * @copyright	Copyright (c) 2008 - 2014, EllisLab, Inc. (https://ellislab.com/)
 * @copyright	Copyright (c) 2014 - 2019, British Columbia Institute of Technology (https://bcit.ca/)
 * @copyright	Copyright (c) 2019 - 2022, CodeIgniter Foundation (https://codeigniter.com/)
 * @license	https://opensource.org/licenses/MIT	MIT License
 * @link	https://codeigniter.com
 * @since	Version 3.0.0
 * @filesource
 */
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * PDO IBM DB2 Forge Class
 *
 * @category	Database
 * @author		EllisLab Dev Team
 * @link		https://codeigniter.com/userguide3/database/
 */
class CI_DB_pdo_ibm_forge extends CI_DB_pdo_forge {

	/**
	 * RENAME TABLE IF statement
	 *
	 * @var	string
	 */
	protected $_rename_table	= 'RENAME TABLE %s TO %s';

	/**
	 * UNSIGNED support
	 *
	 * @var	array
	 */
	protected $_unsigned		= array(
		'SMALLINT'	=> 'INTEGER',
		'INT'		=> 'BIGINT',
		'INTEGER'	=> 'BIGINT'
	);

	/**
	 * DEFAULT value representation in CREATE/ALTER TABLE statements
	 *
	 * @var	string
	 */
	protected $_default		= FALSE;

	// --------------------------------------------------------------------

	/**
	 * ALTER TABLE
	 *
	 * @param	string	$alter_type	ALTER type
	 * @param	string	$table		Table name
	 * @param	mixed	$field		Column definition
	 * @return	string|string[]
	 */
	protected function _alter_table($alter_type, $table, $field)
	{
		if ($alter_type === 'CHANGE')
		{
			$alter_type = 'MODIFY';
		}

		return parent::_alter_table($alter_type, $table, $field);
	}

	// --------------------------------------------------------------------

	/**
	 * Field attribute TYPE
	 *
	 * Performs a data type mapping between different databases.
	 *
	 * @param	array	&$attributes
	 * @return	void
	 */
	protected function _attr_type(&$attributes)
	{
		switch (strtoupper($attributes['TYPE']))
		{
			case 'TINYINT':
				$attributes['TYPE'] = 'SMALLINT';
				$attributes['UNSIGNED'] = FALSE;
				return;
			case 'MEDIUMINT':
				$attributes['TYPE'] = 'INTEGER';
				$attributes['UNSIGNED'] = FALSE;
				return;
			default: return;
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Field attribute UNIQUE
	 *
	 * @param	array	&$attributes
	 * @param	array	&$field
	 * @return	void
	 */
	protected function _attr_unique(&$attributes, &$field)
	{
		if ( ! empty($attributes['UNIQUE']) && $attributes['UNIQUE'] === TRUE)
		{
			$field['unique'] = ' UNIQUE';

			// UNIQUE must be used with NOT NULL
			$field['null'] = ' NOT NULL';
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Field attribute AUTO_INCREMENT
	 *
	 * @param	array	&$attributes
	 * @param	array	&$field
	 * @return	void
	 */
	protected function _attr_auto_increment(&$attributes, &$field)
	{
		// Not supported
	}

}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ok-item-selected{width:103px;height:78px;margin-right:2px;margin-bottom:2px;background-color:#b2b2b2;float:left;cursor:pointer;position:relative;border:1px solid #7d7d7d}.panel-look-item-selected{border:2px #7d7d7d}.look-missing-rendition-icon{color:#000}.panel-look-item-img,.panel-look-item-img-loading{width:100%;height:100%;background-size:contain;background-position:center;background-repeat:no-repeat}.panel-look-item-img-loading{display:block;opacity:.4}.panel-list-look-item-img,.panel-list-look-item-img-loading{width:100%;height:100%;background-size:contain;background-position:center;background-repeat:no-repeat}.panel-unsupported-item,.panel-unsupported-item-selected{width:82px;height:54px;margin-right:2px;margin-bottom:2px;float:left;cursor:pointer;position:relative;border:1px solid #7d7d7d}.panel-unsupported-item-selected{border:2px #7d7d7d}.panel-unsupported-item-img,.panel-unsupported-item-img-loading{width:100%;height:100%;background-size:cover;background-position:center;background-repeat:no-repeat}.panel-unsupported-item-img-loading{display:block;opacity:.4}.panel-list-unsupported-item-img,.panel-list-unsupported-item-img-loading{width:100%;height:100%;background-size:cover;background-position:center;background-repeat:no-repeat}.panel-list-unsupported-item-thumb{width:32px;height:32px;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;margin-right:10px;border:1px solid #7d7d7d}.panel-video-item,.panel-video-item-selected{width:103px;height:78px;margin-right:2px;margin-bottom:2px;background-color:#b2b2b2;float:left;cursor:pointer;position:relative;border:1px solid #7d7d7d}.panel-video-item-selected{border:2px #7d7d7d}.video-missing-rendition-icon{color:#000}.panel-video-item-img,.panel-video-item-img-loading{width:100%;height:100%;background-size:contain;background-position:center;background-repeat:no-repeat}.panel-video-item-img-loading{display:block;opacity:.4}.panel-list-video-item-img,.panel-list-video-item-img-loading{width:100%;height:100%;background-size:contain;background-position:center;background-repeat:no-repeat}.panel-3d-item,.panel-3d-item-selected{width:103px;height:78px;margin-right:2px;margin-bottom:2px;background-color:#b2b2b2;float:left;cursor:pointer;position:relative;border:1px solid #7d7d7d}.panel-3d-item-selected{border:2px #7d7d7d}.missing-3d-rendition-icon{color:#000}.panel-3d-item-img,.panel-3d-item-img-loading{width:100%;height:100%;background-size:contain;background-position:center;background-repeat:no-repeat}.panel-3d-item-img-loading{display:block;opacity:.4}.panel-list-3d-item-img,.panel-list-3d-item-img-loading{width:100%;height:100%;background-size:contain;background-position:center;background-repeat:no-repeat}.panel-dl-stock{position:fixed;top:56px;left:0;right:0;bottom:24px;padding-left:8px;overflow-y:scroll;overflow-x:hidden;background:#a4a4a4;border-top:#575757 solid 1px}.panel-dl-stock-empty,.panel-dl-stock-loading,.panel-dl-stock-noresult{margin:auto;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-moz-box-orient:vertical;box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;height:100%;font-size:12px;padding-right:8px;padding-top:10px}.panel-dl-stock-icon{font-size:50px;opacity:.2;margin-top:10px;margin-bottom:10px}.panel-dl-stock-message,.panel-dl-stock-loading-message,.panel-dl-stock-noresult-tips-message{font-size:11px;line-height:15px;max-width:250px;text-align:center;opacity:.7;margin-bottom:20px}.panel-dl-stock-loading-icon{margin-top:10px;margin-bottom:10px}.panel-dl-stock-noresult-message{text-align:center;font-size:11px;opacity:.7;margin:0 20px 10px}.panel-dl-stock-noresult-tips-message{margin-bottom:6px;opacity:.9}.panel-dl-stock-no-connection-icon{font-size:40px;margin-bottom:10px;opacity:.5}.panel-dl-stock-content{width:100%;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-lines:multiple;-moz-box-lines:multiple;box-lines:multiple;-webkit-flex-wrap:wrap;-moz-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.panel-dl-stock-content-item{position:relative;margin:2px;text-align:center;border:1px solid #7d7d7d}.panel-dl-stock-content-item.hover{border:1px solid #fff}.panel-dl-stock-content-item-img{display:block}.panel-dl-stock-content-item-hover{position:absolute;top:7px;left:7px;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-lines:multiple;-moz-box-lines:multiple;box-lines:multiple;-webkit-flex-wrap:wrap;-moz-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.panel-dl-stock-content-item-action,.panel-dl-stock-content-item-licensed{cursor:pointer;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;width:30px;height:30px;border:0;border-radius:15px;background-color:#303030;margin:0 7px 7px 0}.panel-dl-stock-content-item-action.hover,.hover.panel-dl-stock-content-item-licensed{opacity:.8}.panel-dl-stock-content-item-licensed{cursor:default;background-color:#5B9BD3}.panel-dl-stock-content-item-icon{cursor:pointer;font-size:18px;color:#fff}.panel-dl-stock-content-video-badge{position:absolute;bottom:7px;left:7px;opacity:.9;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-lines:multiple;-moz-box-lines:multiple;box-lines:multiple;-webkit-flex-wrap:wrap;-moz-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;border:#c2ccd0 solid 1px;border-radius:2px;background:transparent;cursor:pointer}.panel-dl-stock-content-video-badge-icon{background:#c2ccd0;width:15px;height:20px;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center}.panel-dl-stock-content-video-badge-icon-triangle{width:0;height:0;border-top:4px solid transparent;border-bottom:4px solid transparent;border-left:5px solid #303030}.panel-dl-stock-content-video-badge-duration{padding:4px}.panel-dl-stock-tips,.panel-dl-stock-view-on-web{width:100%;text-align:center;font-size:11px;padding:15px;margin:5px 5px 5px 2px}.panel-dl-stock-view-on-web{cursor:pointer}.panel-dl-stock-view-on-web.hover{opacity:.6}.panel-dl-stock-view-on-web-message{font-weight:800}.panel-dialog,.panel-dialog-dim{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;position:fixed;top:0;bottom:0;left:0;right:0;z-index:10}.panel-dialog-dim{background-color:rgba(0,0,0,.6)}.panel-dialog-window{vertical-align:middle;background-color:#b8b8b8;border-left:1px solid #575757;border-right:1px solid #575757;border-bottom:1px solid #575757;padding-left:15px;padding-right:15px;padding-bottom:11px;padding-top:13px;position:fixed;top:26px;left:-1px;right:-1px}.panel-dialog-contents{font-size:10px;padding-bottom:6px;padding-right:2px;word-wrap:break-word;max-width:100%}.panel-dialog-header{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:justify;-moz-box-pack:justify;box-pack:justify;-webkit-justify-content:space-between;-moz-justify-content:space-between;-ms-justify-content:space-between;-o-justify-content:space-between;justify-content:space-between;-ms-flex-pack:justify;color:#424242;height:24px;font-size:12px;font-weight:700;padding-bottom:14px}.panel-dialog-title{-webkit-box-flex:1;-moz-box-flex:1;box-flex:1;-webkit-flex:1 1 auto;-moz-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto;min-width:0;max-width:100%;white-space:nowrap;overflow-x:hidden;text-overflow:ellipsis}.panel-dialog-close-b background-position: -64px -128px; }
.ui-icon-close { background-position: -80px -128px; }
.ui-icon-closethick { background-position: -96px -128px; }
.ui-icon-key { background-position: -112px -128px; }
.ui-icon-lightbulb { background-position: -128px -128px; }
.ui-icon-scissors { background-position: -144px -128px; }
.ui-icon-clipboard { background-position: -160px -128px; }
.ui-icon-copy { background-position: -176px -128px; }
.ui-icon-contact { background-position: -192px -128px; }
.ui-icon-image { background-position: -208px -128px; }
.ui-icon-video { background-position: -224px -128px; }
.ui-icon-script { background-position: -240px -128px; }
.ui-icon-alert { background-position: 0 -144px; }
.ui-icon-info { background-position: -16px -144px; }
.ui-icon-notice { background-position: -32px -144px; }
.ui-icon-help { background-position: -48px -144px; }
.ui-icon-check { background-position: -64px -144px; }
.ui-icon-bullet { background-position: -80px -144px; }
.ui-icon-radio-on { background-position: -96px -144px; }
.ui-icon-radio-off { background-position: -112px -144px; }
.ui-icon-pin-w { background-position: -128px -144px; }
.ui-icon-pin-s { background-position: -144px -144px; }
.ui-icon-play { background-position: 0 -160px; }
.ui-icon-pause { background-position: -16px -160px; }
.ui-icon-seek-next { background-position: -32px -160px; }
.ui-icon-seek-prev { background-position: -48px -160px; }
.ui-icon-seek-end { background-position: -64px -160px; }
.ui-icon-seek-start { background-position: -80px -160px; }
/* ui-icon-seek-first is deprecated, use ui-icon-seek-start instead */
.ui-icon-seek-first { background-position: -80px -160px; }
.ui-icon-stop { background-position: -96px -160px; }
.ui-icon-eject { background-position: -112px -160px; }
.ui-icon-volume-off { background-position: -128px -160px; }
.ui-icon-volume-on { background-position: -144px -160px; }
.ui-icon-power { background-position: 0 -176px; }
.ui-icon-signal-diag { background-position: -16px -176px; }
.ui-icon-signal { background-position: -32px -176px; }
.ui-icon-battery-0 { background-position: -48px -176px; }
.ui-icon-battery-1 { background-position: -64px -176px; }
.ui-icon-battery-2 { background-position: -80px -176px; }
.ui-icon-battery-3 { background-position: -96px -176px; }
.ui-icon-circle-plus { background-position: 0 -192px; }
.ui-icon-circle-minus { background-position: -16px -192px; }
.ui-icon-circle-close { background-position: -32px -192px; }
.ui-icon-circle-triangle-e { background-position: -48px -192px; }
.ui-icon-circle-triangle-s { background-position: -64px -192px; }
.ui-icon-circle-triangle-w { background-position: -80px -192px; }
.ui-icon-circle-triangle-n { background-position: -96px -192px; }
.ui-icon-circle-arrow-e { background-position: -112px -192px; }
.ui-icon-circle-arrow-s { background-position: -128px -192px; }
.ui-icon-circle-arrow-w { background-position: -144px -192px; }
.ui-icon-circle-arrow-n { background-position: -160px -192px; }
.ui-icon-circle-zoomin { background-position: -176px -192px; }
.ui-icon-circle-zoomout { background-position: -192px -192px; }
.ui-icon-circle-check { background-position: -208px -192px; }
.ui-icon-circlesmall-plus { background-position: 0 -208px; }
.ui-icon-circlesmall-minus { background-position: -16px -208px; }
.ui-icon-circlesmall-close { background-position: -32px -208px; }
.ui-icon-squaresmall-plus { background-position: -48px -208px; }
.ui-icon-squaresmall-minus { background-position: -64px -208px; }
.ui-icon-squaresmall-close { background-position: -80px -208px; }
.ui-icon-grip-dotted-vertical { background-position: 0 -224px; }
.ui-icon-grip-dotted-horizontal { background-position: -16px -224px; }
.ui-icon-grip-solid-vertical { background-position: -32px -224px; }
.ui-icon-grip-solid-horizontal { background-position: -48px -224px; }
.ui-icon-gripsmall-diagonal-se { background-position: -64px -224px; }
.ui-icon-grip-diagonal-se { background-position: -80px -224px; }


/* Misc visuals
----------------------------------*/

/* Corner radius */
.ui-corner-all,
.ui-corner-top,
.ui-corner-left,
.ui-corner-tl {
	border-top-left-radius: 3px;
}
.ui-corner-all,
.ui-corner-top,
.ui-corner-right,
.ui-corner-tr {
	border-top-right-radius: 3px;
}
.ui-corner-all,
.ui-corner-bottom,
.ui-corner-left,
.ui-corner-bl {
	border-bottom-left-radius: 3px;
}
.ui-corner-all,
.ui-corner-bottom,
.ui-corner-right,
.ui-corner-br {
	border-bottom-right-radius: 3px;
}

/* Overlays */
.ui-widget-overlay {
	background: #aaaaaa;
	opacity: .003;
	-ms-filter: Alpha(Opacity=.3); /* support: IE8 */
}
.ui-widget-shadow {
	-webkit-box-shadow: 0px 0px 5px #666666;
	box-shadow: 0px 0px 5px #666666;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                    ion addArray($vals)
	{
		if ($this->mytype !== 0)
		{
			echo '<strong>XML_RPC_Values</strong>: already initialized as a ['.$this->kindOf().']<br />';
			return 0;
		}

		$this->mytype = $this->xmlrpcTypes['array'];
		$this->me['array'] = $vals;
		return 1;
	}

	// --------------------------------------------------------------------

	/**
	 * Add struct value
	 *
	 * @param	object
	 * @return	int
	 */
	public function addStruct($vals)
	{
		if ($this->mytype !== 0)
		{
			echo '<strong>XML_RPC_Values</strong>: already initialized as a ['.$this->kindOf().']<br />';
			return 0;
		}
		$this->mytype = $this->xmlrpcTypes['struct'];
		$this->me['struct'] = $vals;
		return 1;
	}

	// --------------------------------------------------------------------

	/**
	 * Get value type
	 *
	 * @return	string
	 */
	public function kindOf()
	{
		switch ($this->mytype)
		{
			case 3: return 'struct';
			case 2: return 'array';
			case 1: return 'scalar';
			default: return 'undef';
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Serialize data
	 *
	 * @param	string
	 * @param	mixed
	 * @return	string
	 */
	public function serializedata($typ, $val)
	{
		$rs = '';

		switch ($this->xmlrpcTypes[$typ])
		{
			case 3:
				// struct
				$rs .= "<struct>\n";
				reset($val);
				foreach ($val as $key2 => &$val2)
				{
					$rs .= "<member>\n<name>{$key2}</name>\n".$this->serializeval($val2)."</member>\n";
				}
				$rs .= '</struct>';
				break;
			case 2:
				// array
				$rs .= "<array>\n<data>\n";
				for ($i = 0, $c = count($val); $i < $c; $i++)
				{
					$rs .= $this->serializeval($val[$i]);
				}
				$rs .= "</data>\n</array>\n";
				break;
			case 1:
				// others
				switch ($typ)
				{
					case $this->xmlrpcBase64:
						$rs .= '<'.$typ.'>'.base64_encode( (string) $val).'</'.$typ.">\n";
						break;
					case $this->xmlrpcBoolean:
						$rs .= '<'.$typ.'>'.( (bool) $val ? '1' : '0').'</'.$typ.">\n";
						break;
					case $this->xmlrpcString:
						$rs .= '<'.$typ.'>'.htmlspecialchars( (string) $val).'</'.$typ.">\n";
						break;
					default:
						$rs .= '<'.$typ.'>'.$val.'</'.$typ.">\n";
						break;
				}
			default:
				break;
		}

		return $rs;
	}

	// --------------------------------------------------------------------

	/**
	 * Serialize class
	 *
	 * @return	string
	 */
	public function serialize_class()
	{
		return $this->serializeval($this);
	}

	// --------------------------------------------------------------------

	/**
	 * Serialize value
	 *
	 * @param	object
	 * @return	string
	 */
	public function serializeval($o)
	{
		$array = $o->me;
		list($value, $type) = array(reset($array), key($array));
		return "<value>\n".$this->serializedata($type, $value)."</value>\n";
	}

	// --------------------------------------------------------------------

	/**
	 * Scalar value
	 *
	 * @return	mixed
	 */
	public function scalarval()
	{
		return reset($this->me);
	}

	// --------------------------------------------------------------------

	/**
	 * Encode time in ISO-8601 form.
	 * Useful for sending time in XML-RPC
	 *
	 * @param	int	unix timestamp
	 * @param	bool
	 * @return	string
	 */
	public function iso8601_encode($time, $utc = FALSE)
	{
		return ($utc) ? date('Ymd\TH:i:s', $time) : gmdate('Ymd\TH:i:s', $time);
	}

} // END XML_RPC_Values Class
                                                                                                                                                                                                                                                      x-shadow:inset 0 -1px #dedede,0 1px 1px #d1d1d1}.panel-dl-header-button.hover{background-image:-webkit-linear-gradient(top,#fafafa,#e9e9e9);background-image:linear-gradient(to bottom,#fafafa,#e9e9e9);box-shadow:inset 0 -1px #f3f3f3,0 1px 1px #d1d1d1}.panel-dl-header-button.selected{background-image:-webkit-linear-gradient(top,#929292,#929292);background-image:linear-gradient(to bottom,#929292,#929292);box-shadow:inset 0 1px #808080,0 1px 1px #d1d1d1}.panel-dl-header-button.selected.hover{background-image:-webkit-linear-gradient(top,#9f9f9f,#9f9f9f);background-image:linear-gradient(to bottom,#9f9f9f,#9f9f9f);box-shadow:inset 0 -1px #a1a1a1,0 1px 1px #d1d1d1}select,.panel-select{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;-o-appearance:none;appearance:none;min-width:140px;height:18px;margin:0;padding-left:5px;padding-right:20px;font-size:10px;line-height:16px;font-weight:700;cursor:pointer;appearance:button;position:relative;color:#393939;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;background-color:#d4d4d4;background-image:-webkit-linear-gradient(top,#f2f2f2,#d8d8d8);background-image:linear-gradient(to bottom,#f2f2f2,#d8d8d8);box-shadow:inset 0 1px #dedede,0 1px 1px #d1d1d1;border:1px solid #5e5e5e;outline:0}select:before,.panel-select:before{height:0;width:0;border-color:transparent;border-style:solid;border-width:5px;border-top-color:#393939;-webkit-transform:scaleX(0.65);-moz-transform:scaleX(0.65);-ms-transform:scaleX(0.65);-o-transform:scaleX(0.65);transform:scaleX(0.65);content:' ';position:absolute;top:6px;right:3px}select:after,.panel-select:after{width:3px;height:12px;border-left:1px solid #f4f3f4;border-right:1px solid #f4f3f4;background:#a4a4a4;content:' ';position:absolute;top:2px;right:16px}select:disabled,select.disabled,.panel-select:disabled,.panel-select.disabled{opacity:.5;pointer-events:none}select:enabled:hover,select.hover,.panel-select:enabled:hover,.panel-select.hover{background-image:-webkit-linear-gradient(top,#fafafa,#e9e9e9);background-image:linear-gradient(to bottom,#fafafa,#e9e9e9);box-shadow:inset 0 1px #f3f3f3,0 1px 1px #d1d1d1}select:enabled:hover:after,select.hover:after,.panel-select:enabled:hover:after,.panel-select.hover:after{border-left:1px solid #f9f8f9;border-right:1px solid #f9f8f9;background:#a9a9a9}select.selected,.panel-select.selected{background-image:-webkit-linear-gradient(top,#929292,#929292);background-image:linear-gradient(to bottom,#929292,#929292);box-shadow:inset 0 0 0 1px #808080,0 1px 1px #d1d1d1}select.selected:after,.panel-select.selected:after{border-left:1px solid #c8c7c8;border-right:1px solid #c8c7c8;background:#787878}select.selected:hover,.panel-select.selected:hover{background-image:-webkit-linear-gradient(top,#9f9f9f,#9f9f9f);background-image:linear-gradient(to bottom,#9f9f9f,#9f9f9f);box-shadow:inset 0 1px #a1a1a1,0 1px 1px #d1d1d1}select.selected:hover:after,.panel-select.selected:hover:after{border-left:1px solid #cfcecf;border-right:1px solid #cfcecf;background:#7e7e7e}input[type=text],input[type=search]{-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;-o-appearance:none;appearance:none;line-height:22px;height:22px;font-size:10px;color:#000;background-color:#fff;box-shadow:0 1px 1px #d1d1d1;border:1px solid #5e5e5e;outline:0}input[type=text]:focus,input[type=search]:focus{box-shadow:0 0 0 1px #2141cc}input[type=text]:disabled{opacity:.5;pointer-events:none}input[type=search]::-webkit-search-results-decoration{margin-right:2px}input[type=search]::-webkit-search-cancel-button{margin-right:3px}input[type=search]:focus::-webkit-input-placeholder{color:#a8a8a8}input[type=search]:disabled{opacity:.5;pointer-events:none}::-webkit-input-placeholder{color:rgba(0,0,0,.4)}::-webkit-scrollbar{width:14px;height:14px;background:#939293}::-webkit-scrollbar:vertical{border-left:1px solid #5e5e5e;border-top:1px solid #5e5e5e;border-bottom:1px solid #5e5e5e}::-webkit-scrollbar:vertical:disabled{background:transparent;border:0}::-webkit-scrollbar:horizontal{border-top:1px solid #5e5e5e;border-left:1px solid #5e5e5e;border-right:1px solid #5e5e5e}::-webkit-scrollbar:horizontal:disabled{background:transparent;border:0}::-webkit-scrollbar-thumb{background:#e2e2e2;background-clip:padding-box}::-webkit-scrollbar-thumb:hover{background:#efefef}::-webkit-scrollbar-thumb:vertical{border-left:1px solid #5e5e5e;border-top:1px solid #5e5e5e;border-bottom:1px solid #5e5e5e}::-webkit-scrollbar-thumb:horizontal{border-top:1px solid #5e5e5e;border-left:1px solid #5e5e5e;border-right:1px solid #5e5e5e}::-webkit-scrollbar-button:start:decrement,::-webkit-scrollbar-button:end:increment{display:block;width:14px;height:14px}::-webkit-scrollbar-button:vertical:increment,::-webkit-scrollbar-button:vertical:decrement,::-webkit-scrollbar-button:horizontal:increment,::-webkit-scrollbar-button:horizontal:decrement{background-size:10px 10px;background-position:center;background-repeat:no-repeat}::-webkit-scrollbar-button:vertical:increment:hover,::-webkit-scrollbar-button:vertical:decrement:hover,::-webkit-scrollbar-button:horizontal:increment:hover,::-webkit-scrollbar-button:horizontal:decrement:hover{background-color:#efefef}::-webkit-scrollbar-button:vertical:increment:hover:active,::-webkit-scrollbar-button:vertical:decrement:hover:active,::-webkit-scrollbar-button:horizontal:increment:hover:active,::-webkit-scrollbar-button:horizontal:decrement:hover:active{background-color:inherit}::-webkit-scrollbar-button:vertical:increment{border-left:1px solid #5e5e5e;border-top:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_down_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_down_dark.svg)}::-webkit-scrollbar-button:vertical:increment:hover{border-top:1px solid #5e5e5e}::-webkit-scrollbar-button:vertical:increment:disabled{background:transparent;border:0}::-webkit-scrollbar-button:vertical:decrement{border-left:1px solid #5e5e5e;border-bottom:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_up_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_up_dark.svg)}::-webkit-scrollbar-button:vertical:decrement:hover{border-bottom:1px solid #5e5e5e}::-webkit-scrollbar-button:vertical:decrement:disabled{background:transparent;border:0}::-webkit-scrollbar-button:horizontal:increment{border-top:1px solid #5e5e5e;border-left:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_right_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_right_dark.svg)}::-webkit-scrollbar-button:horizontal:increment:hover{border-left:1px solid #5e5e5e}::-webkit-scrollbar-button:horizontal:increment:disabled{background:transparent;border:0}::-webkit-scrollbar-button:horizontal:decrement{border-top:1px solid #5e5e5e;border-right:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_left_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_left_dark.svg)}::-webkit-scrollbar-button:horizontal:decrement