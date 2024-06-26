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
 * @since	Version 1.4.1
 * @filesource
 */
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Oracle Forge Class
 *
 * @category	Database
 * @author		EllisLab Dev Team
 * @link		https://codeigniter.com/userguide3/database/
 */
class CI_DB_oci8_forge extends CI_DB_forge {

	/**
	 * CREATE DATABASE statement
	 *
	 * @var	string
	 */
	protected $_create_database	= FALSE;

	/**
	 * CREATE TABLE IF statement
	 *
	 * @var	string
	 */
	protected $_create_table_if	= FALSE;

	/**
	 * DROP DATABASE statement
	 *
	 * @var	string
	 */
	protected $_drop_database	= FALSE;

	/**
	 * DROP TABLE IF statement
	 *
	 * @var	string
	 */
	protected $_drop_table_if	= FALSE;

	/**
	 * UNSIGNED support
	 *
	 * @var	bool|array
	 */
	protected $_unsigned		= FALSE;

	/**
	 * NULL value representation in CREATE/ALTER TABLE statements
	 *
	 * @var	string
	 */
	protected $_null		= 'NULL';

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
		if ($alter_type === 'DROP')
		{
			return parent::_alter_table($alter_type, $table, $field);
		}
		elseif ($alter_type === 'CHANGE')
		{
			$alter_type = 'MODIFY';
		}

		$sql = 'ALTER TABLE '.$this->db->escape_identifiers($table);
		$sqls = array();
		for ($i = 0, $c = count($field); $i < $c; $i++)
		{
			if ($field[$i]['_literal'] !== FALSE)
			{
				$field[$i] = "\n\t".$field[$i]['_literal'];
			}
			else
			{
				$field[$i]['_literal'] = "\n\t".$this->_process_column($field[$i]);

				if ( ! empty($field[$i]['comment']))
				{
					$sqls[] = 'COMMENT ON COLUMN '
						.$this->db->escape_identifiers($table).'.'.$this->db->escape_identifiers($field[$i]['name'])
						.' IS '.$field[$i]['comment'];
				}

				if ($alter_type === 'MODIFY' && ! empty($field[$i]['new_name']))
				{
					$sqls[] = $sql.' RENAME COLUMN '.$this->db->escape_identifiers($field[$i]['name'])
						.' TO '.$this->db->escape_identifiers($field[$i]['new_name']);
				}

				$field[$i] = "\n\t".$field[$i]['_literal'];
			}
		}

		$sql .= ' '.$alter_type.' ';
		$sql .= (count($field) === 1)
				? $field[0]
				: '('.implode(',', $field).')';

		// RENAME COLUMN must be executed after MODIFY
		array_unshift($sqls, $sql);
		return $sqls;
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
		if ( ! empty($attributes['AUTO_INCREMENT']) && $attributes['AUTO_INCREMENT'] === TRUE && stripos($field['type'], 'number') !== FALSE && version_compare($this->db->version(), '12.1', '>='))
		{
			$field['auto_increment'] = ' GENERATED ALWAYS AS IDENTITY';
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Process column
	 *
	 * @param	array	$field
	 * @return	string
	 */
	protected function _process_column($field)
	{
		return $this->db->escape_identifiers($field['name'])
			.' '.$field['type'].$field['length']
			.$field['unsigned']
			.$field['default']
			.$field['auto_increment']
			.$field['null']
			.$field['unique'];
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
				$attributes['TYPE'] = 'NUMBER';
				return;
			case 'MEDIUMINT':
				$attributes['TYPE'] = 'NUMBER';
				return;
			case 'INT':
				$attributes['TYPE'] = 'NUMBER';
				return;
			case 'BIGINT':
				$attributes['TYPE'] = 'NUMBER';
				return;
			default: return;
		}
	}
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ntal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-lines:multiple;-moz-box-lines:multiple;box-lines:multiple;-webkit-flex-wrap:wrap;-moz-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;text-align:center}.panel-dl-contents-drop-area-container{margin:auto;opacity:1;min-width:0;max-width:100%;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-moz-box-orient:vertical;box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;-webkit-animation:popinoutsmall .5s ease-out;-moz-animation:popinoutsmall .5s ease-out;animation:popinoutsmall .5s ease-out}.panel-dl-contents-drop-area-icon{font-size:32px}.panel-dl-contents-drop-area-smaller-icon{font-size:24px}.panel-dl-contents-drop-area-text{font-size:11px;font-weight:bolder;padding:5px 20px;max-width:100%;text-overflow:ellipsis;overflow-x:hidden}.panel-dl-contents-drop-area-subtext{font-size:10px;font-weight:700;padding:30px 10px 10px;max-width:100%;text-overflow:ellipsis;overflow-x:hidden}.panel-dl-contents-area{padding-right:1px}.panel-operation-button{margin-left:50px}.panel-footer{position:fixed;bottom:0;left:0;width:100%}.panel-footer-toolbar{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;width:100%;padding-left:5px;padding-right:5px;height:22px}.panel-footer-toolbar.windows{padding-right:15px}.panel-footer-toolbar-spacing{-webkit-box-flex:1;-moz-box-flex:1;box-flex:1;-webkit-flex:1 1 auto;-moz-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto}.panel-footer-icon,.panel-footer-icon-ok,.panel-footer-icon-error,.panel-footer-icon-warn,.panel-footer-icon-syncing{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:default;color:#dadada;min-width:20px;height:20px;text-align:center;padding-top:1px;padding-left:3px;padding-right:2px;font-size:16px;line-height:16px;margin-left:1px;margin-right:1px;margin-top:0;margin-bottom:0}.panel-footer-icon.shift-padding,.shift-padding.panel-footer-icon-ok,.shift-padding.panel-footer-icon-error,.shift-padding.panel-footer-icon-warn,.shift-padding.panel-footer-icon-syncing{padding-left:2px;padding-right:3px}.panel-footer-icon-ok{height:18px}.panel-footer-icon-ok.ng-enter{-webkit-animation:popinout .5s ease-in;-moz-animation:popinout .5s ease-in;animation:popinout .5s ease-in}.panel-footer-icon-error{height:18px}.panel-footer-icon-warn{height:18px}.panel-footer-icon-syncing{height:17px}.panel-footer-icon-syncing:not(.ng-leave){-webkit-animation:rotating 2s linear infinite;-moz-animation:rotating 2s linear infinite;animation:rotating 2s linear infinite}.panel-footer-divider-container{width:100%;vertical-align:top}.panel-footer-divider{width:100%;background-color:#494949;height:2px;border-bottom:#646464 solid 1px}.panel-drop-options-container{position:fixed;width:100%;height:100%;top:0;table-layout:fixed;bottom:24px;background-color:#515151}.panel-drop-option-item,.panel-drop-option-item-hover{text-align:center;font-size:14px}.panel-drop-option-item-hover{background-color:#717171}.panel-no-rendition-holder{top:50%;left:50%;-webkit-transform:translate(-50.5%,-50%);-moz-transform:translate(-50.5%,-50%);-ms-transform:translate(-50.5%,-50%);-o-transform:translate(-50.5%,-50%);transform:translate(-50.5%,-50%);position:absolute}.panel-dl-contents-relink,.panel-relink-overlay{position:fixed;top:56px;bottom:32px;left:0;right:0}.panel-relink-header{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;margin-top:6px;margin-left:2px}.panel-relink-header-image{font-size:13px;margin-right:5px}.panel-relink-header-image-missing{background-image:url(../../../images/MissingLinkedElement_Light.svg);background-image:url(../../../images/MissingLinkedElement_Light.svg);background-size:14px 14px;background-repeat:no-repeat;width:14px;height:14px;margin-right:5px}.panel-relink-header-text{font-size:11px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;min-width:90%}.panel-relink-overlay{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;background:rgba(84,84,84,.85)}.panel-relink-overlay-message{background-color:#222;font-size:11px;padding:4px 13px 5px;border-radius:4px}.panel-relink-action{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-pack:end;-moz-box-pack:end;box-pack:end;-webkit-justify-content:flex-end;-moz-justify-content:flex-end;-ms-justify-content:flex-end;-o-justify-content:flex-end;justify-content:flex-end;-ms-flex-pack:end;-webkit-box-align:right;-moz-box-align:right;box-align:right;-webkit-align-items:right;-moz-align-items:right;-ms-align-items:right;-o-align-items:right;align-items:right;-ms-flex-align:right;height:30px;padding:5px}.panel-relink-action.windows{margin-right:8px}.panel-relink-action:not(.windows){margin-right:4px}.panel-relink-button-cancel,.panel-relink-button-relink{margin-right:2px;height:20px}.panel-list-item,.panel-list-item-small{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;width:100%;height:32px;margin:4px;margin-left:0;cursor:pointer}.panel-list-item.hover,.panel-list-item-small.hover{background:#6e6e6e}.panel-list-item.selected,.panel-list-item-small.selected{background:#697381}.panel-list-item-small{height:20px;padding-top:2px;padding-bottom:2px;margin-top:2px;margin-bottom:2px}.panel-list-item-thumb,.panel-list-item-thumb-checkered,.panel-list-item-thumb-small,.panel-list-item-thumb-small-border,.panel-list-item-thumb-border,.panel-list-textstyle-thumb,.panel-list-image-item-thumb{-webkit-box-flex:0;-moz-box-flex:0;box-flex:0;-webkit-flex:0 0 32px;-moz-flex:0 0 32px;-ms-flex:0 0 32px;flex:0 0 32px;height:32px;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;margin-right:10px;border:1px solid #616161}.panel-list-item-thumb-checkered{background-color:#b2b2b2;background-image:-webkit-linear-gradient(-495deg,#dcdcdc 25%,transparent 25%,transparent 75%,#dcdcdc 75%,#dcdcdc),-webkit-linear-gradient(-495deg,#dcdcdc 25%,transparent 25%,transparent 75%,#dcdcdc 75%,#dcdcdc);background-image:linear-gradient(225deg,#dcdcdc 25%,transparent 25%,transparent 75%,#dcdcdc 75%,#dcdcdc),linear-gradient(225deg,#dcdcdc 25%,transparent 25%,transparent 75%,#dcdcdc 75%,#dcdcdc);background-size:8px 8px;background-position:0 0,4px 4px;background-clip:border-box}.panel-list-item-thumb-small,.panel-list-item-thumb-small-border{height:16px}.panel-list-item-name-container{-webkit-box-flex:1;-moz-box-flex:1;box-flex:1;-webkit-flex:1 1 auto;-moz-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto;font-size:11px;font-weight:500;min-width:0;overflow-x:hidden;white-space:nowrap;text-overflow:ellipsis;cursor:pointer}.disabled-item:not(.selected) .panel-list-item-name-container{opacity:.3235}.disabled-item.selected .panel-list-item-name-container{opacity:.4}.panel-list-item-name{white-space:nowrap}input.panel-list-item-edit-name{width:100%;padding:0;margin:0;font-si.07,-3.38 2.61,-2.12 4.2,-2.76 2.8,-2.26 3.3,-3.81 2.39,-3.13 2.41,-4.1 1.73,-3.59 1.35,-3.15 0.79,-3.05 0.6,-1.02 -0.01,-1.5 z",
                    "SR": "m 315.27,446.97 3.36,0.56 0.3,-0.51 2.27,-0.2 3.01,0.76 -1.46,2.4 0.22,1.91 1.11,1.66 -0.49,1.2 -0.25,1.27 -0.72,1.17 -1.6,-0.59 -1.33,0.29 -1.13,-0.25 -0.28,0.81 0.47,0.55 -0.25,0.57 -1.53,-0.23 -1.71,-2.42 -0.37,-1.57 -0.89,-0.01 -1.25,-2.02 0.52,-1.45 -0.15,-0.65 1.7,-0.73 z",
                    "SS": "m 570.73,437.15 0.03,2.2 -0.42,0.86 -1.48,0.07 -0.96,1.61 1.72,0.2 1.42,1.37 0.5,1.12 1.28,0.65 1.65,3.05 -1.9,1.84 -1.72,1.67 -1.73,1.28 -1.97,0 -2.26,0.65 -1.78,-0.63 -1.15,0.77 -2.47,-1.86 -0.67,-1.19 -1.56,0.59 -1.3,-0.19 -0.75,0.47 -1.26,-0.33 -1.69,-2.31 -0.45,-0.89 -2.1,-1.11 -0.71,-1.68 -1.17,-1.21 -1.88,-1.46 -0.03,-0.92 -1.53,-1.13 -1.91,-1.1 0.86,-0.31 0.96,-0.53 0.72,-2.52 0.77,-1.31 2.03,-0.39 0.48,0.77 1.44,1.65 0.77,0.25 1.01,-0.49 2.02,0.1 0.39,0.58 2.79,0 0.1,-0.58 1.44,-0.53 0.29,-0.83 1.06,-0.58 2.36,1.65 1.44,-0.29 1.4,-2.04 1.54,-1.56 -0.24,-1.71 -0.68,-0.83 1.69,-0.15 0.19,-0.63 1.3,0.19 -0.34,2.1 0.34,2.05 1.44,1.12 0.34,0.97 -0.05,1.41 z",
                    "SV": "m 229.34,426.01 -0.31,0.67 -1.62,-0.04 -1.01,-0.27 -1.16,-0.57 -1.56,-0.18 -0.79,-0.62 0.09,-0.42 0.96,-0.72 0.52,-0.32 -0.15,-0.34 0.66,-0.17 0.83,0.24 0.6,0.57 0.85,0.46 0.1,0.39 1.23,-0.34 0.58,0.2 0.38,0.31 z",
                    "SY": "m 584.27,364.85 -5.49,3.54 -3.12,-1.32 -0.06,-0.02 0.38,-0.5 -0.04,-1.37 0.69,-1.83 1.53,-1.27 -0.46,-1.32 -1.26,-0.18 -0.26,-2.61 0.68,-1.41 0.75,-0.75 0.75,-0.76 0.16,-1.94 0.91,0.68 3.09,-0.97 1.49,0.65 2.31,-0.01 3.22,-1.31 1.52,0.06 3.19,-0.54 -1.44,2.18 -1.54,0.86 0.27,2.52 -1.06,4.12 z",
                    "SZ": "m 565.43,540.99 -0.57,1.39 -1.64,0.33 -1.68,-1.69 -0.02,-1.08 0.76,-1.17 0.27,-0.9 0.81,-0.22 1.41,0.57 0.42,1.39 z",
                    "TD": "m 516.15,427.51 0.28,-1.34 -1.8,-0.07 0.01,-1.85 -1.17,-1.06 1.21,-3.8 3.58,-2.74 0.14,-3.79 1.08,-5.98 0.61,-1.28 -1.16,-1.02 -0.05,-0.95 -1.05,-0.78 -0.69,-4.67 2.83,-1.66 11.19,5.77 11.18,5.7 0.14,11.61 -2.42,-0.2 -1.28,2.13 -0.74,1.78 0.58,0.67 -0.92,0.88 0.32,1.18 -0.73,1.2 -0.28,1.05 0.99,-0.17 0.58,1.1 0.03,1.66 1.03,0.83 -0.03,0.69 -1.77,0.49 -1.43,1.14 -2.02,3.09 -2.64,1.31 -2.71,-0.18 -0.79,0.26 0.28,0.99 -1.47,0.99 -1.19,1.1 -3.53,1.07 -0.7,-0.63 -0.46,-0.06 -0.52,0.72 -2.32,0.22 0.44,-0.77 -0.88,-1.93 -0.4,-1.17 -1.22,-0.48 -1.65,-1.65 0.61,-1.33 1.28,0.28 0.79,-0.2 1.56,0.03 -1.52,-2.57 0.1,-1.89 -0.19,-1.89 z",
                    "TF": "m 668.79,619.28 1.8,1.33 2.65,0.54 0.1,0.81 -0.78,1.96 -4.31,0.28 -0.07,-2.29 0.42,-1.76 z",
                    "TG": "m 480.73,446.5 -2.25,0.59 -0.63,-0.98 -0.75,-1.78 -0.22,-1.4 0.62,-2.53 -0.7,-1.03 -0.27,-2.22 0,-2.05 -1.17,-1.46 0.21,-0.89 2.46,0.06 -0.36,1.5 0.85,0.83 0.98,0.99 0.1,1.39 0.57,0.58 -0.13,6.46 z",
                    "TH": "m 763.14,429.43 -2.52,-1.31 -2.4,0.06 0.41,-2.25 -2.47,0.02 -0.22,3.14 -1.51,4.15 -0.91,2.5 0.19,2.05 1.82,0.09 1.14,2.57 0.51,2.43 1.56,1.61 1.7,0.33 1.45,1.45 -0.91,1.15 -1.86,0.34 -0.22,-1.44 -2.28,-1.23 -0.49,0.5 -1.11,-1.07 -0.48,-1.39 -1.49,-1.59 -1.36,-1.33 -0.46,1.65 -0.53,-1.56 0.31,-1.76 0.82,-2.71 1.36,-2.91 1.54,-2.65 -1.1,-2.6 0.05,-1.33 -0.32,-1.6 -1.87,-2.28 -0.67,-1.45 0.97,-0.53 1.02,-2.52 -1.14,-1.92 -1.78,-2.13 -1.36,-2.57 1.18,-0.53 1.28,-3.19 1.98,-0.14 1.64,-1.28 1.6,-0.69 1.22,0.92 0.16,1.78 1.89,0.13 -0.69,3.11 0.07,2.62 2.95,-1.74 0.84,0.51 1.65,-0.08 0.56,-1.02 2.12,0.2 2.13,2.38 0.18,2.87 2.27,2.53 -0.13,2.44 -0.91,1.3 -2.63,-0.41 -3.62,0.55 -1.8,2.38 z",
                    "TJ": "m 674.62,340.87 -1.03,1.13 -3.05,-0.61 -0.27,2.1 3.04,-0.28 3.47,1.17 5.3,-0.55 0.71,3.33 0.92,-0.36 1.7,0.81 -0.09,1.38 0.42,2.01 -2.9,0 -1.93,-0.26 -1.74,1.57 -1.25,0.34 -0.98,0.74 -1.11,-1.15 0.27,-2.95 -0.85,-0.17 0.3,-1.09 -1.51,-0.8 -1.21,1.23 -0.3,1.43 -0.43,0.52 -1.68,-0.07 -0.9,1.6 -0.95,-0.67 -2.03,1.12 -0.85,-0.42 1.57,-3.57 -0.6,-2.66 -2.06,-0.86 0.73,-1.59 2.34,0.17 1.33,-2.01 0.89,-2.35 3.75,-0.86 -0.58,1.71 0.4,1.02 z",
                    "TL": "m 825.9,488.5 0.33,-0.66 2.41,-0.63 1.96,-0.1 0.87,-0.35 1.06,0.35 -1.03,0.76 -2.92,1.23 -2.35,0.82 -0.05,-0.86 z",
                    "TM": "m 647.13,357.15 -0.25,-2.91 -2.09,-0.12 -3.2,-3.09 -2.24,-0.39 -3.1,-1.79 -2,-0.33 -1.23,0.66 -1.87,-0.1 -1.99,2.02 -2.47,0.68 -0.52,-2.49 0.41,-3.73 -2.19,-1.22 0.72,-2.48 -1.86,-0.22 0.62,-3.09 2.64,0.91 2.47,-1.19 -2.05,-2.23 -0.8,-2.14 -2.26,0.96 -0.28,2.73 -0.88,-2.41 1.24,-1.25 3.18,-0.79 1.9,1.06 1.96,2.93 1.44,-0.18 3.16,-0.05 -0.46,-1.88 2.4,-1.3 2.36,-2.2 3.78,2 0.3,2.99 1.07,0.77 3.03,-0.17 0.94,0.67 1.38,3.79 3.21,2.51 1.83,1.69 2.93,1.75 3.73,1.52 -0.08,2.16 -0.84,-0.11 -1.33,-0.94 -0.44,1.25 -2.36,0.68 -0.56,2.79 -1.58,1.05 -2.21,0.52 -0.59,1.55 -2.11,0.46 z",
                    "TN": "m 502.09,374.94 -1.2,-5.86 -1.72,-1.33 -0.03,-0.81 -2.29,-1.98 -0.25,-2.53 1.73,-1.88 0.66,-2.82 -0.45,-3.28 0.57,-1.79 3.06,-1.41 1.96,0.42 -0.08,1.77 2.38,-1.29 0.2,0.67 -1.41,1.71 -0.01,1.6 0.97,0.85 -0.37,2.96 -1.85,1.71 0.53,1.83 1.45,0.06 0.71,1.59 1.07,0.52 -0.16,2.55 -1.37,0.95 -0.86,1.05 -1.93,1.26 0.3,1.35 -0.24,1.38 z",
                    "TR": "m 579,336.85 4.02,1.43 3.27,-0.57 2.41,0.33 3.31,-1.94 2.99,-0.18 2.7,1.83 0.48,1.3 -0.27,1.79 2.08,0.91 1.1,1.06 -1.92,1.03 0.88,4.11 -0.55,1.1 1.53,2.82 -1.34,0.59 -0.98,-0.89 -3.26,-0.45 -1.2,0.55 -3.19,0.54 -1.51,-0.06 -3.23,1.31 -2.31,0.01 -1.49,-0.66 -3.09,0.97 -0.92,-0.68 -0.15,1.94 -0.75,0.76 -0.75,0.76 -1.03,-1.57 1.06,-1.3 -1.71,0.3 -2.35,-0.8 -1.93,2 -4.26,0.39 -2.27,-1.86 -3.02,-0.12 -0.65,1.44 -1.94,0.41 -2.71,-1.85 -3.06,0.06 -1.66,-3.48 -2.05,-1.96 1.36,-2.78 -1.78,-1.72 3.11,-3.48 4.32,-0.15 1.18,-2.81 5.34,0.49 3.37,-2.42 3.27,-1.06 4.64,-0.08 4.91,2.64 z m -27.25,2.39 -2.34,1.98 -0.88,-1.71 0.04,-0.76 0.67,-0.41 0.87,-2.33 -1.37,-0.99 2.86,-1.18 2.41,0.5 0.33,1.44 2.45,1.2 -0.51,0.91 -3.33,0.2 -1.2,1.15 z",
                    "TT": "m 302.56,433.49 1.61,-0.37 0.59,0.1 -0.11,2.11 -2.34,0.31 -0.51,-0.25 0.82,-0.78 z",
                    "TW": "m 816.95,393.52 -1.69,4.87 -1.2,2.48 -1.48,-2.55 -0.32,-2.25 1.65,-3 2.25,-2.32 1.28,0.91 z",
                    "TZ": "m 570.56,466.28 0.48,0.31 10.16,5.67 0.2,1.62 4.02,2.79 -1.29,3.45 0.16,1.59 1.8,1.02 0.08,0.73 -0.77,1.7 0.16,0.85 -0.18,1.35 0.98,1.76 1.16,2.79 1.02,0.62 -2.23,1.64 -3.06,1.1 -1.68,-0.04 -1,0.85 -1.95,0.07 -0.74,0.36 -3.37,-0.8 -2.11,0.23 -0.78,-3.86 -0.95,-1.32 -0.57,-0.78 -2.74,-0.52 -1.6,-0.85 -1.78,-0.47 -1.12,-0.48 -1.17,-0.71 -1.51,-3.55 -1.63,-1.57 -0.56,-1.62 0.28,-1.46 -0.5,-2.57 1.16,-0.13 1.01,-1.01 1.1,-1.46 0.69,-0.58 -0.03,-0.91 -0.6,-0.63 -0.16,-1.1 0.8,-0.35 0.17,-1.64 -1.12,-1.57 0.99,-0.34 3.07,0.04 z",
                    "UA": "m 564.63,292.74 1.04,0.19 0.71,-1.04 0.85,0.23 2.91,-0.44 1.79,2.57 -0.7,0.92 0.23,1.39 2.24,0.21 1,1.93 -0.06,0.87 3.56,1.54 2.15,-0.69 1.73,2.04 1.64,-0.04 4.13,1.4 0.03,1.27 -1.13,2.23 0.61,2.33 -0.44,1.39 -2.71,0.31 -1.44,1.16 -0.09,1.83 -2.24,0.33 -1.87,1.32 -2.62,0.21 -2.42,1.52 -1.32,1.03 1.49,1.47 1.37,0.96 2.86,-0.24 -0.55,1.42 -3.07,0.68 -3.81,2.27 -1.55,-0.79 0.61,-1.85 -3.06,-1.16 0.5,-0.77 3.16,-1.63 -0.4,-0.81 -0.45,0.41 -0.44,-0.22 -4.36,-1.02 -0.19,-1.51 -2.6,0.5 -1.04,2.23 -2.17,2.95 -1.28,-0.68 -1.31,0.64 -1.25,-0.73 0.7,-0.44 0.49,-1.37 0.77,-1.29 -0.2,-0.72 0.59,-0.32 0.27,0.56 1.66,0.11 0.74,-0.29 -0.52,-0.42 0.19,-0.6 -0.98,-1.04 -0.4,-1.72 -1.02,-0.67 0.2,-1.41 -1.27,-1.12 -1.15,-0.16 -2.07,-1.31 -1.86,0.42 -0.67,0.62 -1.18,-0.01 -0.71,0.98 -2.07,0.4 -0.95,0.64 -1.31,-1.01 -1.79,-0.02 -1.74,-0.46 -1.21,0.89 -0.2,-1.12 -1.55,-1.14 0.55,-1.71 0.77,-1.1 0.62,0.24 -0.73,-1.92 2.55,-3.61 1.39,-0.51 0.3,-1.24 -1.41,-3.89 1.34,-0.17 1.54,-1.23 2.17,-0.1 2.83,0.36 3.13,1.08 2.21,0.09 1.05,0.65 1.05,-0.78 0.74,1.05 2.53,-0.22 1.11,0.43 0.19,-2.26 0.86,-1 z",
                    "UG": "m 564.85,466.5 -3.07,-0.04 -0.99,0.34 -1.67,0.86 -0.68,-0.29 0.02,-2.1 0.65,-1.06 0.16,-2.24 0.59,-1.29 1.07,-1.46 1.08,-0.74 0.9,-0.99 -1.12,-0.37 0.17,-3.26 1.15,-0.77 1.78,0.63 2.26,-0.65 1.97,0 1.73,-1.28 1.33,1.94 0.33,1.4 1.23,3.2 -1.02,2.03 -1.38,1.84 -0.8,1.13 0.02,2.95 z",
                    "US": "m 109.5,280.05 0,0 -1.54,-1.83 -2.47,-1.57 -0.79,-4.36 -3.61,-4.13 -1.51,-4.94 -2.69,-0.34 -4.46,-0.13 -3.29,-1.54 -5.8,-5.64 -2.68,-1.05 -4.9,-1.99 -3.88,0.48 -5.51,-2.59 -3.33,-2.43 -3.11,1.21 0.58,3.93 -1.55,0.36 -3.24,1.16 -2.47,1.86 -3.11,1.16 -0.4,-3.24 1.26,-5.53 2.98,-1.77 -0.77,-1.46 -3.57,3.22 -1.91,3.77 -4.04,3.95 2.05,2.65 -2.65,3.85 -3.01,2.21 -2.81,1.59 -0.69,2.29 -4.38,2.63 -0.89,2.36 -3.28,2.13 -1.92,-0.38 -2.62,1.38 -2.85,1.67 -2.33,1.63 -4.81,1.38 -0.44,-0.81 3.07,-2.27 2.74,-1.51 2.99,-2.71 3.48,-0.56 1.38,-2.06 3.89,-3.05 0.63,-1.03 2.07,-1.83 0.48,-4 1.43,-3.17 -3.23,1.64 -0.9,-0.93 -1.52,1.95 -1.83,-2.73 -0.76,1.94 -1.05,-2.7 -2.8,2.17 -1.72,0 -0.24,-3.23 0.51,-2.02 -1.81,-1.98 -3.65,1.07 -2.37,-2.63 -1.92,-1.36 -0.01,-3.25 -2.16,-2.48 1.08,-3.41 2.29,-3.37 1,-3.15 2.27,-0.45 1.92,0.99 2.26,-3.01 2.04,0.54 2.14,-1.96 -0.52,-2.92 -1.57,-1.16 2.08,-2.52 -1.72,0.07 -2.98,1.43 -0.85,1.43 -2.21,-1.43 -3.97,0.73 -4.11,-1.56 -1.18,-2.65 -3.55,-3.91 3.94,-2.87 6.25,-3.41 h 2.31 l -0.38,3.48 5.92,-0.27 -2.28,-4.34 -3.45,-2.72 -1.99,-3.64 -2.69,-3.17 -3.85,-2.38 1.57,-4.03 4.97,-0.25 3.54,-3.58 0.67,-3.92 2.86,-3.91 2.73,-0.95 5.31,-3.76 2.58,0.57 4.31,-4.61 4.24,1.83 2.03,3.87 1.25,-1.65 4.74,0.51 -0.17,1.95 4.29,1.43 2.86,-0.84 5.91,2.64 5.39,0.78 2.16,1.07 3.73,-1.34 4.25,2.46 3.05,1.13 -0.02,27.65 -0.01,35.43 2.76,0.17 2.73,1.56 1.96,2.44 2.49,3.6 2.73,-3.05 2.81,-1.79 1.49,2.85 1.89,2.23 2.57,2.42 1.75,3.79 2.87,5.88 4.77,3.2 0.08,3.12 -1.6,2.32 z m 175.93,34.43 -1.25,-1.19 -1.88,0.7 -0.93,-1.08 -2.14,3.1 -0.86,3.15 -1,1.82 -1.19,0.62 -0.9,0.2 -0.28,0.98 -5.17,0 -4.26,0.03 -1.27,0.73 -2.87,2.73 0.29,0.54 0.17,1.51 -2.1,1.27 -2.3,-0.32 -2.2,-0.14 -1.33,0.44 0.25,1.15 0,0 0.05,0.37 -2.42,2.27 -2.11,1.09 -1.44,0.51 -1.66,1.03 -2.03,0.5 -1.4,-0.19 -1.73,-0.77 0.96,-1.45 0.62,-1.32 1.32,-2.09 -0.14,-1.57 -0.5,-2.24 -1.04,-0.39 -1.74,1.7 -0.56,-0.03 -0.14,-0.97 1.54,-1.56 0.26,-1.79 -0.23,-1.79 -2.08,-1.55 -2.38,-0.8 -0.39,1.52 -0.62,0.4 -0.5,1.95 -0.26,-1.33 -1.12,0.95 -0.7,1.32 -0.73,1.92 -0.14,1.64 0.93,2.38 -0.08,2.51 -1.14,1.84 -0.57,0.52 -0.76,0.41 -0.95,0.02 -0.26,-0.25 -0.76,-1.98 -0.02,-0.98 0.08,-0.94 -0.35,-1.87 0.53,-2.18 0.63,-2.71 1.46,-3.03 -0.42,0.01 -2.06,2.54 -0.38,-0.46 1.1,-1.42 1.67,-2.57 1.91,-0.36 2.19,-0.8 2.21,0.42 0.09,0.02 2.47,-0.36 -1.4,-1.61 -0.75,-0.13 -0.86,-0.16 -0.59,-1.14 -2.75,0.36 -2.49,0.9 -1.97,-1.55 -1.59,-0.52 0.9,-2.17 -2.48,1.37 -2.25,1.33 -2.16,1.04 -1.72,-1.4 -2.81,0.85 0.01,-0.6 1.9,-1.73 1.99,-1.65 2.86,-1.37 -3.45,-1.09 -2.27,0.55 -2.72,-1.3 -2.86,-0.67 -1.96,-0.26 -0.87,-0.72 -0.5,-2.35 -0.95,0.02 -0.01,1.64 -5.8,0 -9.59,0 -9.53,0 -8.42,0 h -8.41 -8.27 -8.55 -2.76 -8.32 -7.96 l 0.95,3.47 0.45,3.41 -0.69,1.09 -1.49,-3.91 -4.05,-1.42 -0.34,0.82 0.82,1.94 0.89,3.53 0.51,5.42 -0.34,3.59 -0.34,3.54 -1.1,3.61 0.9,2.9 0.1,3.2 -0.61,3.05 1.49,1.99 0.39,2.95 2.17,2.99 1.24,1.17 -0.1,0.82 2.34,4.85 2.72,3.45 0.34,1.87 0.71,0.55 2.6,0.33 1,0.91 1.57,0.17 0.31,0.96 1.31,0.4 1.82,1.92 0.47,1.7 3.19,-0.25 3.56,-0.36 -0.26,0.65 4.23,1.6 6.4,2.31 5.58,-0.02 2.22,0 0.01,-1.35 4.86,0 1.02,1.16 1.43,1.03 1.67,1.43 0.93,1.69 0.7,1.77 1.45,0.97 2.33,0.96 1.77,-2.53 2.29,-0.06 1.98,1.28 1.41,2.18 0.97,1.86 1.65,1.8 0.62,2.19 0.79,1.47 2.19,0.96 1.99,0.68 1.09,-0.09 -0.53,-1.06 -0.14,-1.5 0.03,-2.16 0.65,-1.42 1.53,-1.51 2.79,-1.37 2.55,-2.37 2.36,-0.75 1.74,-0.23 2.04,0.74 2.45,-0.4 2.09,1.69 2.03,0.1 1.05,-0.61 1.04,0.47 0.53,-0.42 -0.6,-0.63 0.05,-1.3 -0.5,-0.86 1.16,-0.5 2.14,-0.22 2.49,0.36 3.17,-0.41 1.76,0.8 1.36,1.5 0.5,0.16 2.83,-1.46 1.09,0.49 2.19,2.68 0.79,1.75 -0.58,2.1 0.42,1.23 1.3,2.4 1.49,2.68 1.07,0.71 0.44,1.35 1.38,0.37 0.84,-0.39 0.7,-1.89 0.12,-1.21 0.09,-2.1 -1.33,-3.65 -0.02,-1.37 -1.25,-2.25 -0.94,-2.75 -0.5,-2.25 0.43,-2.31 1.32,-1.94 1.58,-1.57 3.08,-2.16 0.4,-1.12 1.42,-1.23 1.4,-0.22 1.84,-1.98 2.9,-1.01 1.78,-2.53 -0.39,-3.46 -0.29,-1.21 -0.8,-0.24 -0.12,-3.35 -1.93,-1.14 1.85,0.56 -0.6,-2.26 0.54,-1.55 0.33,2.97 1.43,1.36 -0.87,2.4 0.26,0.14 1.58,-2.81 0.9,-1.38 -0.04,-1.35 -0.7,-0.64 -0.58,-1.94 0.92,0.9 0.62,0.19 0.21,0.92 2.04,-2.78 0.61,-2.62 -0.83,-0.17 0.85,-1.02 -0.08,0.45 1.79,-0.01 3.93,-1.11 -0.83,-0.7 -4.12,0.7 2.34,-1.07 1.63,-0.18 1.22,-0.19 2.07,-0.65 1.35,0.07 1.89,-0.61 0.22,-1.07 -0.84,-0.84 0.29,1.37 -1.16,-0.09 -0.93,-1.99 0.03,-2.01 0.48,-0.86 1.48,-2.28 2.96,-1.15 2.88,-1.34 2.99,-1.9 -0.48,-1.29 -1.83,-2.25 -0.03,-5.56 z m -239.56,-50.44 -1.5,0.8 -2.55,1.86 0.43,2.42 1.43,1.32 2.8,-1.95 2.43,-2.47 -1.19,-1.63 -1.85,-0.35 z m -45.62,-28.57 2.04,-1.26 0.23,-0.68 -2.27,-0.67 v 2.61 z m 8.5,15.37 -2.77,0.97 1.7,1.52 1.84,1.04 1.72,-0.87 -0.27,-2.15 -2.22,-0.51 z m 97.35,32.5 -2.69,0.38 -1.32,-0.62 -0.17,1.52 0.52,2.07 1.42,1.46 1.04,2.13 1.69,2.1 1.12,0.01 -2.44,-3.7 0.83,-5.35 z m -68.72,120.68 -1,-0.28 -0.27,0.26 0.02,0.19 0.32,0.24 0.48,0.63 0.94,-0.21 0.23,-0.36 -0.72,-0.47 z m -2.99,-0.54 1.5,0.09 0.09,-0.32 -1.38,-0.13 -0.21,0.36 z m 5.89,3.29 -0.5,-0.26 -1.07,-0.5 -0.21,-0.06 -0.16,0.28 0.19,0.58 -0.49,0.48 -0.14,0.33 0.46,1.08 -0.08,0.83 0.7,0.42 0.41,-0.49 0.9,-0.46 1.1,-0.63 0.07,-0.16 -0.71,-1.04 -0.47,-0.4 z m -7.86,-5.14 -0.75,0.41 0.11,0.12 0.36,0.68 0.98,0.11 0.2,0.04 0.15,-0.17 -0.81,-0.99 -0.24,-0.2 z m -4.4,-1.56 -0.43,0.3 -0.15,0.22 0.94,0.55 0.33,-0.3 -0.06,-0.7 -0.63,-0.07 z",
                    "UY": "m 313.93,552.04 1.82,-0.34 2.81,2.5 1.04,-0.09 2.89,2.08 2.2,1.82 1.62,2.25 -1.24,1.57 0.78,1.9 -1.21,2.12 -3.17,1.88 -2.07,-0.68 -1.52,0.37 -2.59,-1.46 -1.9,0.11 -1.71,-1.87 0.22,-2.16 0.61,-0.74 -0.03,-3.3 0.75,-3.37 z",
                    "UZ": "m 662.01,351.2 0.08,-2.16 -3.73,-1.52 -2.93,-1.75 -1.83,-1.69 -3.21,-2.51 -1.38,-3.79 -0.94,-0.67 -3.03,0.17 -1.07,-0.77 -0.3,-2.99 -3.78,-2 -2.36,2.2 -2.4,1.3 0.46,1.88 -3.16,0.05 -0.11,-14.13 7.22,-2.35 0.52,0.35 4.35,2.84 2.29,1.48 2.68,3.5 3.29,-0.56 4.81,-0.3 3.35,2.8 -0.21,3.8 1.37,0.03 0.57,3.06 3.57,0.12 0.76,1.75 1.05,-0.02 1.23,-2.65 3.69,-2.61 1.61,-0.7 0.83,0.37 -2.35,2.43 2.07,1.4 2,-0.93 3.32,1.96 -3.59,2.64 -2.13,-0.36 -1.16,0.1 -0.4,-1.02 0.58,-1.71 -3.75,0.86 -0.89,2.35 -1.33,2.01 -2.34,-0.17 -0.73,1.59 2.06,0.86 0.6,2.66 -1.57,3.57 -2.12,-0.74 z",
                    "VE": "m 275.5,430.6 -0.08,0.67 -1.65,0.33 0.92,1.29 -0.04,1.49 -1.23,1.64 1.06,2.24 1.21,-0.18 0.63,-2.04 -0.87,-1 -0.14,-2.14 3.49,-1.16 -0.39,-1.34 0.98,-0.9 1.01,2 1.97,0.05 1.82,1.58 0.11,0.94 2.51,0.02 3,-0.29 1.61,1.27 2.14,0.35 1.57,-0.88 0.03,-0.72 3.48,-0.17 3.36,-0.04 -2.38,0.84 0.95,1.34 2.25,0.21 2.12,1.39 0.45,2.26 1.46,-0.07 1.1,0.67 -2.22,1.65 -0.25,1.03 0.96,1.04 -0.69,0.52 -1.73,0.45 0.06,1.3 -0.76,0.77 1.89,2.12 0.38,0.79 -1.03,1.07 -3.14,1.04 -2.01,0.44 -0.81,0.66 -2.23,-0.7 -2.08,-0.36 -0.52,0.26 1.25,0.72 -0.11,1.87 0.39,1.76 2.37,0.24 0.16,0.58 -2.01,0.8 -0.32,1.18 -1.16,0.45 -2.08,0.65 -0.54,0.86 -2.18,0.18 -1.55,-1.48 -0.85,-2.77 -0.75,-0.98 -1.02,-0.61 1.42,-1.39 -0.09,-0.63 -0.8,-0.83 -0.56,-1.85 0.22,-2.01 0.62,-0.94 0.51,-1.5 -0.99,-0.49 -1.6,0.32 -2.02,-0.15 -1.13,0.3 -1.98,-2.41 -1.63,-0.36 -3.6,0.27 -0.67,-0.98 -0.69,-0.23 -0.1,-0.59 0.33,-1.04 -0.22,-1.13 -0.62,-0.62 -0.36,-1.3 -1.44,-0.18 0.77,-1.66 0.35,-2.01 0.81,-1.06 1.09,-0.81 0.71,-1.42 z",
                    "VN": "m 778.46,402.12 -3.74,2.56 -2.34,2.81 -0.62,2.05 2.15,3.09 2.62,3.82 2.54,1.79 1.71,2.33 1.28,5.32 -0.38,5.02 -2.33,1.87 -3.22,1.83 -2.28,2.36 -3.5,2.62 -1.02,-1.81 0.79,-1.91 -2.08,-1.61 2.43,-1.14 2.94,-0.2 -1.23,-1.73 4.71,-2.19 0.35,-3.42 -0.65,-1.92 0.51,-2.88 -0.71,-2.04 -2.12,-2.02 -1.77,-2.57 -2.33,-3.46 -3.36,-1.76 0.81,-1.07 1.79,-0.77 -1.09,-2.59 -3.45,-0.03 -1.26,-2.72 -1.64,-2.37 1.51,-0.74 2.23,0.02 2.73,-0.35 2.39,-1.62 1.35,1.14 2.57,0.55 -0.45,1.74 1.34,1.22 z",
                    "VU": "m 946.12,510.15 -0.92,0.38 -0.94,-1.27 0.1,-0.78 1.76,1.67 z m -2.07,-4.44 0.46,2.33 -0.75,-0.36 -0.58,0.16 -0.4,-0.8 -0.06,-2.21 1.33,0.88 z",
                    "YE": "m 624.41,416.58 -2.03,0.79 -0.54,1.28 -0.07,0.99 -2.79,1.22 -4.48,1.35 -2.51,2.03 -1.23,0.15 -0.84,-0.17 -1.64,1.2 -1.79,0.55 -2.35,0.15 -0.71,0.16 -0.61,0.75 -0.74,0.21 -0.43,0.73 -1.39,-0.06 -0.9,0.38 -1.94,-0.14 -0.73,-1.67 0.08,-1.57 -0.45,-0.85 -0.55,-2.12 -0.81,-1.19 0.56,-0.14 -0.29,-1.32 0.34,-0.56 -0.12,-1.26 1.23,-0.93 -0.29,-1.23 0.75,-1.43 1.15,0.76 0.76,-0.27 3.23,-0.07 0.52,0.3 2.71,0.29 1.07,-0.15 0.7,0.97 1.31,-0.48 2.01,-3.07 2.62,-1.32 8.08,-1.13 2.2,4.84 z",
                    "ZA": "m 563.88,548.96 -0.55,0.46 -1.19,1.63 -0.78,1.66 -1.59,2.33 -3.17,3.38 -1.98,1.98 -2.12,1.51 -2.93,1.3 -1.43,0.17 -0.36,0.93 -1.7,-0.5 -1.39,0.64 -3.04,-0.65 -1.7,0.41 -1.16,-0.18 -2.89,1.33 -2.39,0.54 -1.73,1.28 -1.28,0.08 -1.19,-1.21 -0.95,-0.06 -1.21,-1.51 -0.13,0.47 -0.37,-0.91 0.02,-1.96 -0.91,-2.23 0.9,-0.6 -0.07,-2.53 -1.84,-3.05 -1.41,-2.74 0,-0.01 -2.01,-4.15 1.34,-1.57 1.11,0.87 0.47,1.36 1.26,0.23 1.76,0.6 1.51,-0.23 2.5,-1.63 0,-11.52 0.76,0.46 1.66,2.93 -0.26,1.89 0.63,1.1 2.01,-0.32 1.4,-1.39 1.33,-0.93 0.69,-1.48 1.37,-0.72 1.18,0.38 1.34,0.87 2.28,0.15 1.79,-0.72 0.28,-0.96 0.49,-1.47 1.53,-0.25 0.84,-1.15 0.93,-2.03 2.52,-2.26 3.97,-2.22 1.14,0.03 1.36,0.51 0.94,-0.36 1.49,0.3 1.34,4.26 0.73,2.17 -0.5,3.43 0.24,1.11 -1.42,-0.57 -0.81,0.22 -0.26,0.9 -0.77,1.17 0.03,1.08 1.67,1.7 1.64,-0.34 0.57,-1.39 2.13,0.03 -0.7,2.28 -0.33,2.62 -0.73,1.43 -1.9,1.62 z m -7.13,-0.96 -1.22,-0.98 -1.31,0.65 -1.52,1.25 -1.5,2.03 2.1,2.48 1,-0.32 0.52,-1.03 1.56,-0.5 0.48,-1.05 0.86,-1.56 -0.97,-0.97 z",
                    "ZM": "m 567.36,489.46 1.32,1.26 0.71,2.4 -0.48,0.77 -0.56,2.3 0.54,2.36 -0.88,0.99 -0.85,2.66 1.47,0.74 -8.51,2.38 0.27,2.05 -2.13,0.4 -1.59,1.15 -0.34,1.01 -1.01,0.22 -2.44,2.4 -1.55,1.89 -0.95,0.07 -0.91,-0.34 -3.13,-0.32 -0.5,-0.22 -0.03,-0.24 -1.1,-0.66 -1.82,-0.17 -2.3,0.67 -1.83,-1.82 -1.89,-2.38 0.13,-9.16 5.84,0.04 -0.24,-0.99 0.42,-1.07 -0.49,-1.33 0.32,-1.38 -0.3,-0.88 0.97,0.07 0.16,0.88 1.31,-0.07 1.78,0.26 0.94,1.29 2.24,0.4 1.72,-0.9 0.63,1.49 2.15,0.4 1.03,1.22 1.15,1.57 2.15,0.03 -0.24,-3.08 -0.77,0.51 -1.96,-1.1 -0.76,-0.51 0.35,-2.85 0.5,-3.35 -0.63,-1.25 0.8,-1.8 0.75,-0.33 3.77,-0.48 1.1,0.29 1.17,0.71 1.12,0.48 1.78,0.47 z",
                    "ZW": "m 562.96,527.25 -1.49,-0.3 -0.95,0.36 -1.35,-0.51 -1.14,-0.03 -1.79,-1.36 -2.17,-0.46 -0.82,-1.9 -0.01,-1.05 -1.2,-0.32 -3.17,-3.25 -0.89,-1.71 -0.56,-0.52 -1.08,-2.35 3.13,0.32 0.91,0.34 0.95,-0.07 1.55,-1.89 2.44,-2.4 1.01,-0.22 0.34,-1.01 1.59,-1.15 2.13,-0.4 0.18,1.08 2.34,-0.06 1.3,0.61 0.6,0.72 1.34,0.21 1.45,0.94 0.01,3.69 -0.55,2.04 -0.12,2.2 0.45,0.88 -0.31,1.74 -0.43,0.27 -0.74,2.15 z"
                }
            }
        }
    });

    return Mapael;

}));
                                                                                                                                                                                                                                          rray();

	/**
	 * Start tag for error wrapping
	 *
	 * @var string
	 */
	protected $_error_prefix	= '<p>';

	/**
	 * End tag for error wrapping
	 *
	 * @var string
	 */
	protected $_error_suffix	= '</p>';

	/**
	 * Custom error message
	 *
	 * @var string
	 */
	protected $error_string		= '';

	/**
	 * Whether the form data has been validated as safe
	 *
	 * @var bool
	 */
	protected $_safe_form_data	= FALSE;

	/**
	 * Custom data to validate
	 *
	 * @var array
	 */
	public $validation_data	= array();

	/**
	 * Initialize Form_Validation class
	 *
	 * @param	array	$rules
	 * @return	void
	 */
	public function __construct($rules = array())
	{
		$this->CI =& get_instance();

		// applies delimiters set in config file.
		if (isset($rules['error_prefix']))
		{
			$this->_error_prefix = $rules['error_prefix'];
			unset($rules['error_prefix']);
		}
		if (isset($rules['error_suffix']))
		{
			$this->_error_suffix = $rules['error_suffix'];
			unset($rules['error_suffix']);
		}

		// Validation rules can be stored in a config file.
		$this->_config_rules = $rules;

		// Automatically load the form helper
		$this->CI->load->helper('form');

		log_message('info', 'Form Validation Class Initialized');
	}

	// --------------------------------------------------------------------

	/**
	 * Set Rules
	 *
	 * This function takes an array of field names and validation
	 * rules as input, any custom error messages, validates the info,
	 * and stores it
	 *
	 * @param	mixed	$field
	 * @param	string	$label
	 * @param	mixed	$rules
	 * @param	array	$errors
	 * @return	CI_Form_validation
	 */
	public function set_rules($field, $label = '', $rules = array(), $errors = array())
	{
		// No reason to set rules if we have no POST data
		// or a validation array has not been specified
		if ($this->CI->input->method() !== 'post' && empty($this->validation_data))
		{
			return $this;
		}

		// If an array was passed via the first parameter instead of individual string
		// values we cycle through it and recursively call this function.
		if (is_array($field))
		{
			foreach ($field as $row)
			{
				// Houston, we have a problem...
				if ( ! isset($row['field'], $row['rules']))
				{
					continue;
				}

				// If the field label wasn't passed we use the field name
				$label = isset($row['label']) ? $row['label'] : $row['field'];

				// Add the custom error message array
				$errors = (isset($row['errors']) && is_array($row['errors'])) ? $row['errors'] : array();

				// Here we go!
				$this->set_rules($row['field'], $label, $row['rules'], $errors);
			}

			return $this;
		}

		// No fields or no rules? Nothing to do...
		if ( ! is_string($field) OR $field === '' OR empty($rules))
		{
			return $this;
		}
		elseif ( ! is_array($rules))
		{
			// BC: Convert pipe-separated rules string to an array
			if ( ! is_string($rules))
			{
				return $this;
			}

			$rules = preg_split('/\|(?![^\[]*\])/', $rules);
		}

		// If the field label wasn't passed we use the field name
		$label = ($label === '') ? $field : $label;

		$indexes = array();

		// Is the field name an array? If it is an array, we break it apart
		// into its components so that we can fetch the corresponding POST data later
		if (($is_array = (bool) preg_match_all('/\[(.*?)\]/', $field, $matches)) === TRUE)
		{
			sscanf($field, '%[^[][', $indexes[0]);

			for ($i = 0, $c = count($matches[0]); $i < $c; $i++)
			{
				if ($matches[1][$i] !== '')
				{
					$indexes[] = $matches[1][$i];
				}
			}
		}

		// Build our master array
		$this->_field_data[$field] = array(
			'field'		=> $field,
			'label'		=> $label,
			'rules'		=> $rules,
			'errors'	=> $errors,
			'is_array'	=> $is_array,
			'keys'		=> $indexes,
			'postdata'	=> NULL,
			'error'		=> ''
		);

		return $this;
	}

	// --------------------------------------------------------------------

	/**
	 * By default, form validation uses the $_POST array to validate
	 *
	 * If an array is set through this method, then this array will
	 * be used instead of the $_POST array
	 *
	 * Note that if you are validating multiple arrays, then the
	 * reset_validation() function should be called after validating
	 * each array due to the limitations of CI's singleton
	 *
	 * @param	array	$data
	 * @return	CI_Form_validation
	 */
	public function set_data(array $data)
	{
		if ( ! empty($data))
		{
			$this->validation_data = $data;
		}

		return $this;
	}

	// --------------------------------------------------------------------

	/**
	 * Set Error Message
	 *
	 * Lets users set their own error messages on the fly. Note:
	 * The key name has to match the function name that it corresponds to.
	 *
	 * @param	array
	 * @param	string
	 * @return	CI_Form_validation
	 */
	public function set_message($lang, $val = '')
	{
		if ( ! is_array($lang))
		{
			$lang = array($lang => $val);
		}

		$this->_error_messages = array_merge($this->_error_messages, $lang);
		return $this;
	}

	// --------------------------------------------------------------------

	/**
	 * Set The Error Delimiter
	 *
	 * Permits a prefix/suffix to be added to each error message
	 *
	 * @param	string
	 * @param	string
	 * @return	CI_Form_validation
	 */
	public function set_error_delimiters($prefix = '<p>', $suffix = '</p>')
	{
		$this->_error_prefix = $prefix;
		$this->_error_suffix = $suffix;
		return $this;
	}

	// --------------------------------------------------------------------

	/**
	 * Get Error Message
	 *
	 * Gets the error message associated with a particular field
	 *
	 * @param	string	$field	Field name
	 * @param	string	$prefix	HTML start tag
	 * @param 	string	$suffix	HTML end tag
	 * @return	string
	 */
	public function error($field, $prefix = '', $suffix = '')
	{
		if (empty($this->_field_data[$field]['error']))
		{
			return '';
		}

		if ($prefix === '')
		{
			$prefix = $this->_error_prefix;
		}

		if ($suffix === '')
		{
			$suffix = $this->_error_suffix;
		}

		return $prefix.$this->_field_data[$field]['error'].$suffix;
	}

	// --------------------------------------------------------------------

	/**
	 * Get Array of Error Messages
	 *
	 * Returns the error messages as an array
	 *
	 * @return	array
	 */
	public function error_array()
	{
		return $this->_error_array;
	}

	// --------------------------------------------------------------------

	/**
	 * Error String
	 *
	 * Returns the error messages as a string, wrapped in the error delimiters
	 *
	 * @param	string
	 * @param	string
	 * @return	string
	 */
	public function error_string($prefix = '', $suffix = '')
	{
		// No errors, validation passes!
		if (count($this->_error_array) === 0)
		{
			return '';
		}

		if ($prefix === '')
		{
			$prefix = $this->_error_prefix;
		}

		if ($suffix === '')
		{
			$suffix = $this->_error_suffix;
		}

		// Generate the error string
		$str = '';
		foreach ($this->_error_array as $val)
		{
			if ($val !== '')
			{
				$str .= $prefix.$val.$suffix."\n";
			}
		}

		return $str;
	}

	// --------------------------------------------------------------------

	/**
	 * Run the Validator
	 *
	 * This function does all the work.
	 *
	 * @param	string	$group
	 * @return	bool
	 */
	public function run($group = '')
	{
		$validation_array = empty($this->validation_data)
			? $_POST
			: $this->validation_data;

		// Does the _field_data array containing the validation rules exist?
		// If not, we look to see if they were assigned via a config file
		if (count($this->_field_data) === 0)
		{
			// No validation rules?  We're done...
			if (count($this->_config_rules) === 0)
			{
				return FALSE;
			}

			if (empty($group))
			{
				// Is there a validation rule for the particular URI being accessed?
				$group = trim($this->CI->uri->ruri_string(), '/');
				isset($this->_config_rules[$group]) OR $group = $this->CI->router->class.'/'.$this->CI->router->method;
			}

			$this->set_rules(isset($this->_config_rules[$group]) ? $this->_config_rules[$group] : $this->_config_rules);

			// Were we able to set the rules correctly?
			if (count($this->_field_data) === 0)
			{
				log_message('debug', 'Unable to find validation rules');
				return FALSE;
			}
		}

		// Load the language file containing error messages
		$this->CI->lang->load('form_validation');

		// Cycle through the rules for each field and match the corresponding $validation_data item
		foreach ($this->_field_data as $field => &$row)
		{
			// Fetch the data from the validation_data array item and cache it in the _field_data array.
			// Depending on whether the field name is an array or a string will determine where we get it from.
			if ($row['is_array'] === TRUE)
			{
				$this->_field_data[$field]['postdata'] = $this->_reduce_array($validation_array, $row['keys']);
			}
			elseif (isset($validation_array[$field]))
			{
				$this->_field_data[$field]['postdata'] = $validation_array[$field];
			}
		}

		// Execute validation rules
		// Note: A second foreach (for now) is required in order to avoid false-positives
		//	 for rules like 'matches', which correlate to other validation fields.
		foreach ($this->_field_data as $field => &$row)
		{
			// Don't try to validate if we have no rules set
			if (empty($row['rules']))
			{
				continue;
			}

			$this->_execute($row, $row['rules'], $row['postdata']);
		}

		// Did we end up with any errors?
		$total_errors = count($this->_error_array);
		if ($total_errors > 0)
		{
			$this->_safe_form_data = TRUE;
		}

		// Now we need to re-set the POST data with the new, processed data
		empty($this->validation_data) && $this->_reset_post_array();

		return ($total_errors === 0);
	}

	// --------------------------------------------------------------------

	/**
	 * Prepare rules
	 *
	 * Re-orders the provided rules in order of importance, so that
	 * they can easily be executed later without weird checks ...
	 *
	 * "Callbacks" are given the highest priority (always called),
	 * followed by 'required' (called if callbacks didn't fail),
	 * and then every next rule depends on the previous one passing.
	 *
	 * @param	array	$rules
	 * @return	array
	 */
	protected function _prepare_rules($rules)
	{
		$new_rules = array();
		$callbacks = array();

		foreach ($rules as &$rule)
		{
			// Let 'required' always be the first (non-callback) rule
			if ($rule === 'required')
			{
				array_unshift($new_rules, 'required');
			}
			// 'isset' is a kind of a weird alias for 'required' ...
			elseif ($rule === 'isset' && (empty($new_rules) OR $new_rules[0] !== 'required'))
			{
				array_unshift($new_rules, 'isset');
			}
			// The old/classic 'callback_'-prefixed rules
			elseif (is_string($rule) && strncmp('callback_', $rule, 9) === 0)
			{
				$callbacks[] = $rule;
			}
			// Proper callables
			elseif (is_callable($rule))
			{
				$callbacks[] = $rule;
			}
			// "Named" callables; i.e. array('name' => $callable)
			elseif (is_array($rule) && isset($rule[0], $rule[1]) && is_callable($rule[1]))
			{
				$callbacks[] = $rule;
			}
			// Everything else goes at the end of the queue
			else
			{
				$new_rules[] = $rule;
			}
		}

		return array_merge($callbacks, $new_rules);
	}

	// --------------------------------------------------------------------

	/**
	 * Traverse a multidimensional $_POST array index until the data is found
	 *
	 * @param	array
	 * @param	array
	 * @param	int
	 * @return	mixed
	 */
	protected function _reduce_array($array, $keys, $i = 0)
	{
		if (is_array($array) && isset($keys[$i]))
		{
			return isset($array[$keys[$i]]) ? $this->_reduce_array($array[$keys[$i]], $keys, ($i+1)) : NULL;
		}

		// NULL must be returned for empty fields
		return ($array === '') ? NULL : $array;
	}

	// --------------------------------------------------------------------

	/**
	 * Re-populate the _POST array with our finalized and processed data
	 *
	 * @return	void
	 */
	protected function _reset_post_array()
	{
		foreach ($this->_field_data as $field => $row)
		{
			if ($row['postdata'] !== NULL)
			{
				if ($row['is_array'] === FALSE)
				{
					isset($_POST[$field]) && $_POST[$field] = is_array($row['postdata']) ? NULL : $row['postdata'];
				}
				else
				{
					// start with a reference
					$post_ref =& $_POST;

					// before we assign values, make a reference to the right POST key
					if (count($row['keys']) === 1)
					{
						$post_ref =& $post_ref[current($row['keys'])];
					}
					else
					{
						foreach ($row['keys'] as $val)
						{
							$post_ref =& $post_ref[$val];
						}
					}

					$post_ref = $row['postdata'];
				}
			}
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Executes the Validation routines
	 *
	 * @param	array
	 * @param	array
	 * @param	mixed
	 * @param	int
	 * @return	mixed
	 */
	protected function _execute($row, $rules, $postdata = NULL, $cycles = 0)
	{
		// If the $_POST data is an array we will run a recursive call
		//
		// Note: We MUST check if the array is empty or not!
		//       Otherwise empty arrays will always pass validation.
		if (is_array($postdata) && ! empty($postdata))
		{
			foreach ($postdata as $key => $val)
			{
				$this->_execute($row, $rules, $val, $key);
			}

			return;
		}

		$rules = $this->_prepare_rules($rules);
		foreach ($rules as $rule)
		{
			$_in_array = FALSE;

			// We set the $postdata variable with the current data in our master array so that
			// each cycle of the loop is dealing with the processed data from the last cycle
			if ($row['is_array'] === TRUE && is_array($this->_field_data[$row['field']]['postdata']))
			{
				// We shouldn't need this safety, but just in case there isn't an array index
				// associated with this cycle we'll bail out
				if ( ! isset($this->_field_data[$row['field']]['postdata'][$cycles]))
				{
					continue;
				}

				$postdata = $this->_field_data[$row['field']]['postdata'][$cycles];
