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
 * @since	Version 1.3.0
 * @filesource
 */
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * MySQLi Utility Class
 *
 * @package		CodeIgniter
 * @subpackage	Drivers
 * @category	Database
 * @author		EllisLab Dev Team
 * @link		https://codeigniter.com/userguide3/database/
 */
class CI_DB_mysqli_utility extends CI_DB_utility {

	/**
	 * List databases statement
	 *
	 * @var	string
	 */
	protected $_list_databases	= 'SHOW DATABASES';

	/**
	 * OPTIMIZE TABLE statement
	 *
	 * @var	string
	 */
	protected $_optimize_table	= 'OPTIMIZE TABLE %s';

	/**
	 * REPAIR TABLE statement
	 *
	 * @var	string
	 */
	protected $_repair_table	= 'REPAIR TABLE %s';

	// --------------------------------------------------------------------

	/**
	 * Export
	 *
	 * @param	array	$params	Preferences
	 * @return	mixed
	 */
	protected function _backup($params = array())
	{
		if (count($params) === 0)
		{
			return FALSE;
		}

		// Extract the prefs for simplicity
		extract($params);

		// Build the output
		$output = '';

		// Do we need to include a statement to disable foreign key checks?
		if ($foreign_key_checks === FALSE)
		{
			$output .= 'SET foreign_key_checks = 0;'.$newline;
		}

		foreach ( (array) $tables as $table)
		{
			// Is the table in the "ignore" list?
			if (in_array($table, (array) $ignore, TRUE))
			{
				continue;
			}

			// Get the table schema
			$query = $this->db->query('SHOW CREATE TABLE '.$this->db->escape_identifiers($this->db->database.'.'.$table));

			// No result means the table name was invalid
			if ($query === FALSE)
			{
				continue;
			}

			// Write out the table schema
			$output .= '#'.$newline.'# TABLE STRUCTURE FOR: '.$table.$newline.'#'.$newline.$newline;

			if ($add_drop === TRUE)
			{
				$output .= 'DROP TABLE IF EXISTS '.$this->db->protect_identifiers($table).';'.$newline.$newline;
			}

			$i = 0;
			$result = $query->result_array();
			foreach ($result[0] as $val)
			{
				if ($i++ % 2)
				{
					$output .= $val.';'.$newline.$newline;
				}
			}

			// If inserts are not needed we're done...
			if ($add_insert === FALSE)
			{
				continue;
			}

			// Grab all the data from the current table
			$query = $this->db->query('SELECT * FROM '.$this->db->protect_identifiers($table));

			if ($query->num_rows() === 0)
			{
				continue;
			}

			// Fetch the field names and determine if the field is an
			// integer type. We use this info to decide whether to
			// surround the data with quotes or not

			$i = 0;
			$field_str = '';
			$is_int = array();
			while ($field = $query->result_id->fetch_field())
			{
				// Most versions of MySQL store timestamp as a string
				$is_int[$i] = in_array($field->type, array(MYSQLI_TYPE_TINY, MYSQLI_TYPE_SHORT, MYSQLI_TYPE_INT24, MYSQLI_TYPE_LONG), TRUE);

				// Create a string of field names
				$field_str .= $this->db->escape_identifiers($field->name).', ';
				$i++;
			}

			// Trim off the end comma
			$field_str = preg_replace('/, $/' , '', $field_str);

			// Build the insert string
			foreach ($query->result_array() as $row)
			{
				$val_str = '';

				$i = 0;
				foreach ($row as $v)
				{
					// Is the value NULL?
					if ($v === NULL)
					{
						$val_str .= 'NULL';
					}
					else
					{
						// Escape the data if it's not an integer
						$val_str .= ($is_int[$i] === FALSE) ? $this->db->escape($v) : $v;
					}

					// Append a comma
					$val_str .= ', ';
					$i++;
				}

				// Remove the comma at the end of the string
				$val_str = preg_replace('/, $/' , '', $val_str);

				// Build the INSERT string
				$output .= 'INSERT INTO '.$this->db->protect_identifiers($table).' ('.$field_str.') VALUES ('.$val_str.');'.$newline;
			}

			$output .= $newline.$newline;
		}

		// Do we need to include a statement to re-enable foreign key checks?
		if ($foreign_key_checks === FALSE)
		{
			$output .= 'SET foreign_key_checks = 1;'.$newline;
		}

		return $output;
	}

}
     flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center}.panel-dl-empty-top-about{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-moz-box-orient:vertical;box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;background-color:rgba(255,255,255,.1);border-radius:3px;cursor:pointer}.panel-dl-empty-top-about.hover{background-color:rgba(255,255,255,.2)}.panel-dl-empty-title{font-size:14px;font-weight:700;margin-top:10px;margin-bottom:10px}.panel-dl-empty-description{line-height:15px;margin:10px;margin-bottom:5px;opacity:.8;text-align:center;color:#fff}.panel-dl-empty-library-link{margin-bottom:10px;cursor:pointer;font-weight:700;text-decoration:underline}.panel-dl-empty-adddoccontent-button{margin-top:15px;margin-bottom:10px;font-size:13px;font-weight:500}.panel-dl-empty-middle{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;margin-bottom:5px}.panel-dl-empty-stock-line{-webkit-box-flex:1;-moz-box-flex:1;box-flex:1;-webkit-flex:1 0 auto;-moz-flex:1 0 auto;-ms-flex:1 0 auto;flex:1 0 auto;height:1px;background:#fff;opacity:.5}.panel-dl-empty-stock-icon{-webkit-box-flex:0;-moz-box-flex:0;box-flex:0;-webkit-flex:0 0 auto;-moz-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;font-size:24px;padding:5px;opacity:.5}.panel-dl-empty-bottom{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-moz-box-orient:vertical;box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;text-align:center;line-height:18px}.panel-dl-nolibs-container{position:fixed;top:56px;left:0;right:0;bottom:24px;overflow:hidden;background:#535353;border-top:#272727 solid 1px;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center}.panel-dl-nolibs-middle{margin:auto;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-moz-box-orient:vertical;box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;font-size:12px}.panel-dl-nolibs-library-icon{font-size:50px;opacity:.2}.panel-dl-nolibs-alert-icon{font-size:50px;opacity:.2}.panel-dl-nolibs-cc-icon,.panel-dl-nolibs-cc-icon-syncing{font-size:50px;opacity:.2}.panel-dl-nolibs-message{font-size:11px;line-height:15px;max-width:200px;text-align:center;opacity:.5}.panel-dl-nolibs-retry-button{margin-top:10px;min-width:60px}.panel-dl-nolibs-create-button{margin-top:20px}.panel-dl-nolibs-create-button-syncing{margin-top:40px}.panel-dl-nolibs-progress-bar{width:170px;margin:10px}.panel-dl-nolibs-link{margin-top:15px;cursor:pointer;font-weight:700;text-decoration:underline}.panel-sync-message-container{position:absolute;right:5px;bottom:24px;background-color:#5f5f5f;border-top:1px solid #272727;border-left:1px solid #272727;border-bottom:1px solid #272727;border-right:1px solid #272727;box-shadow:0 0 0 1px rgba(0,0,0,.1),5px 5px 10px rgba(0,0,0,.2)}.panel-sync-message{color:#fff;padding-left:5px;padding-right:5px;font-size:10px;line-height:18px}.panel-ccapp-warning-container{position:absolute;right:4px;bottom:32px}.panel-ccapp-warning-container-box{position:relative;width:220px;padding-top:10px;padding-bottom:10px;padding-left:14px;padding-right:14px;color:#fff;background-color:#2a9af3;border-radius:4px}.panel-ccapp-warning-container-box:after{height:0;width:0;border-color:transparent;border-style:solid;border-width:7px;border-top-color:#2a9af3;content:' ';position:absolute;bottom:-13px;right:30px}.panel-ccapp-warning-message{font-size:13px;font-weight:700}.panel-ccapp-warning-footer{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:justify;-moz-box-pack:justify;box-pack:justify;-webkit-justify-content:space-between;-moz-justify-content:space-between;-ms-justify-content:space-between;-o-justify-content:space-between;justify-content:space-between;-ms-flex-pack:justify;padding-top:10px}.panel-ccapp-warning-button{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;cursor:pointer;font-size:11px;font-weight:700;border:1px solid #fff;border-radius:2px;height:26px;width:93px}.panel-ccapp-warning-button.hover{background-color:#fff;color:#2a9af3}.panel-ccapp-warning-button-icon{cursor:pointer;font-size:18px;padding-right:2px}.panel-dl-contents-quota-message{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;margin-top:10px}.panel-dl-contents-quota-message-icon{font-size:20px;margin-right:10px}.panel-dl-contents-quota-message-text{margin-bottom:5px}.panel-brush-item,.panel-brush-item-selected{width:103px;height:43px;margin-right:2px;margin-bottom:2px;float:left;cursor:pointer;position:relative;border:1px solid #606060}.panel-brush-item-selected{border:2px #606060}.panel-brush-item-img,.panel-brush-item-img-loading{width:100%;height:100%;background-size:contain;background-position:center;background-repeat:no-repeat;background-color:#FFF}.panel-brush-item-img-loading{display:block;opacity:.4}.panel-list-brush-item-img,.panel-list-brush-item-img-loading{width:100%;height:100%;background-size:cover;background-position:center;background-repeat:no-repeat;background-color:#FFF}.panel-list-brush-item-img:hover,.panel-list-brush-item-img.selected,.panel-list-brush-item-img-loading:hover,.panel-list-brush-item-img-loading.selected{background-size:contain}.panel-list-brush-item-thumb{width:32px;height:32px;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;-webkit-flex-shrink:0;-moz-flex-shrink:0;flex-shrink:0;-ms-flex-negative:0;margin-right:10px;border:1px solid #606060}.panel-list-brush-item-thumb:hover,.panel-list-brush-item-thumb.selected{width:82px}.panel-characterstyle-item,.panel-paragraphstyle-item,.panel-textstyle-item{width:68px;height:45px;margin-right:2px;margin-bottom:2px;float:left;cursor:pointer;position:relative;text-align:center;border:1px solid #606060;background:#fff;color:#000}.panel-textstyle-item.disabled-item{background-color:#757575}.panel-textstyle-item-name{text-align:center;font-size:32px;color:#000;background:#fff;line-height:54px}.panel-list-textstyle-item-name{text-align:center;height:30px;width:32px;font-size:20px;color:#000;background:#fff;line-height:28px}.panel-textstyle-color{position:absolute;width:10px;height:6px;top:2px;right:2px}.panel-missing-font-overlay,.panel-missing-font-overlay-list{position:absolute;right:2px;bottom:1px;font-size:14px;z-index:5;color:#FFC20E}.text-missing-rendition-icon{color:#000}.panel-textstyle-list-item-size,.panel-textstyle-list-item-color{-webkit-box-flex:0;-moz-box-flex:0;box-flex:0;-webkit-flex:0 0 auto;-moz-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;font-size:11px;margin-left:5px;margin-right:5px}.panel-textstyle-list-item-color{-webkit-box-flex:0;-moz-4.14,2.31 3.58,3.13 2.16,0.8 2.4,0.12 1.02,0.88 0.95,3.57 0.47,1.69 -1.12,4.66 -1.43,1.84 -3.95,3.94 -1.79,3.21 -2.07,2.48 -0.7,0.06 -0.79,2.1 0.2,5.4 -0.78,4.48 -0.3,1.93 -0.88,1.15 -0.5,3.94 -2.84,3.88 -0.48,3.09 -2.27,1.31 -0.66,1.81 -3.04,-0.01 -4.41,1.17 -1.98,1.35 -3.14,0.89 -3.3,2.44 -2.37,3.06 -0.41,2.32 0.47,1.73 -0.53,3.18 -0.63,1.55 -1.96,1.75 -3.11,5.68 -2.47,2.59 -1.91,1.54 -1.27,3.16 -1.86,1.91 -0.78,-1.9 1.24,-1.57 -1.62,-2.25 -2.2,-1.82 -2.89,-2.08 -1.04,0.09 -2.81,-2.5 z",
                    "BS": "m 258.11,395.45 -0.69,0.15 -0.71,-1.76 -1.05,-0.89 0.61,-1.95 0.84,0.12 0.98,2.55 0.02,1.78 z m -0.8,-8.69 -3.06,0.5 -0.2,-1.15 1.32,-0.25 1.85,0.09 0.09,0.81 z m 2.3,-0.03 -0.48,2.21 -0.52,-0.4 0.05,-1.63 -1.26,-1.23 -0.01,-0.36 2.22,1.41 z",
                    "BT": "m 732.61,383.03 1.14,1 -0.2,1.93 -2.29,0.09 -2.36,-0.21 -1.77,0.49 -2.55,-1.19 -0.05,-0.63 1.85,-2.34 1.51,-0.8 2.01,0.73 1.48,0.08 z",
                    "BW": "m 547.42,516.2 0.56,0.52 0.89,1.71 3.17,3.25 1.2,0.32 0.01,1.05 0.82,1.9 2.17,0.46 1.79,1.36 -3.97,2.22 -2.52,2.26 -0.93,2.03 -0.84,1.15 -1.53,0.25 -0.49,1.47 -0.29,0.96 -1.79,0.72 -2.28,-0.15 -1.34,-0.86 -1.18,-0.38 -1.37,0.72 -0.69,1.48 -1.33,0.93 -1.4,1.39 -2.01,0.32 -0.62,-1.09 0.26,-1.9 -1.67,-2.93 -0.75,-0.46 0,-8.86 2.76,-0.11 0.08,-10.57 2.09,-0.09 4.32,-1.03 1.08,1.21 1.78,-1.15 0.86,-0.01 1.58,-0.66 0.5,0.22 z",
                    "BY": "m 541.35,284.32 2.71,0.04 3.04,-1.8 0.65,-2.72 2.3,-1.57 -0.26,-2.2 1.7,-0.84 3.02,-1.93 2.95,1.26 0.4,1.23 1.47,-0.59 2.74,1.18 0.27,2.31 -0.6,1.32 1.76,3.15 1.14,0.87 -0.17,0.86 1.89,0.83 0.81,1.25 -1.09,1.02 -2.26,-0.16 -0.54,0.44 0.66,1.54 0.69,2.93 -2.41,0.27 -0.86,1 -0.19,2.26 -1.11,-0.43 -2.53,0.22 -0.74,-1.05 -1.05,0.78 -1.05,-0.65 -2.21,-0.09 -3.13,-1.08 -2.83,-0.36 -2.17,0.1 -1.54,1.23 -1.34,0.17 -0.05,-2.01 -0.87,-2.12 1.68,-0.94 0.02,-1.85 -0.78,-1.78 z",
                    "BZ": "m 225.56,413.21 -0.02,-0.43 0.34,-0.14 0.51,0.35 1,-1.77 0.53,-0.04 0.01,0.43 0.53,0.01 -0.04,0.8 -0.46,1.27 0.25,0.45 -0.29,1.05 0.17,0.27 -0.32,1.47 -0.55,0.78 -0.51,0.09 -0.56,1 -0.83,0 0.22,-3.28 z",
                    "CA": "m 199.18,96.48 -0.22,-5.9 3.63,0.58 1.63,0.96 3.35,4.92 -0.76,4.97 -4.15,2.77 -2.28,-3.12 -1.2,-5.18 z m 13.21,12.65 0.33,-1.49 -1.97,-2.45 -5.65,-0.19 0.75,3.68 5.25,0.83 1.29,-0.38 z m 36.35,46.95 3.08,5.1 0.81,0.57 3.07,-1.27 3.02,0.2 2.98,0.28 -0.25,-2.64 -4.84,-5.38 -6.42,-1.08 -1.35,0.67 -0.1,3.55 z m -65.43,-62.7 -2.71,4.19 6.24,0.52 4.61,4.44 4.58,1.5 -1.09,-5.68 -2.14,-6.73 -7.58,-5.35 -5.5,-2.04 0.2,5.69 3.39,3.46 z m 25.9,-10.24 5.13,-0.12 -2.22,4 -0.04,5.3 3.01,5.76 5.81,1.77 4.96,-0.99 5.18,-10.73 3.85,-4.45 -3.38,-4.97 -2.21,-10.65 -4.6,-3.19 -4.72,-3.68 -3.58,-9.56 -6.52,0.94 1.23,4.15 -2.87,1.25 -1.94,5.32 -1.94,7.46 1.78,7.26 3.07,5.13 z m -63.75,53.38 3.92,1.95 12.67,-1.3 -5.82,4.77 0.36,3.43 4.26,-0.24 7.07,-4.58 9.5,-1.67 1.71,-5.22 -0.49,-5.57 -2.94,-0.5 -2.5,1.93 -1.1,-4.13 -0.95,-5.7 -2.9,-1.42 -2.57,4.41 4.01,11.05 -4.9,-0.85 -4.98,-6.79 -7.89,-4 -2.64,3.32 -3.82,11.11 z m 22.56,-42.06 -3.65,-2.9 -1.5,-0.66 -2.88,4.28 -0.05,2 4.66,0.01 3.42,-2.73 z m -1.46,12.35 0.93,-3.99 -3.95,-2.12 -4.09,1.39 -2.27,4.26 4.16,4.21 5.22,-3.75 z m 29.09,33.24 4.62,-1.11 1.28,-8.25 -0.09,-5.95 -2.14,-5.56 -0.22,1.6 -3.94,-0.7 -4.22,4.09 -3.02,-0.37 0.18,8.92 4.6,-0.87 -0.06,6.47 3.01,1.73 z m -3.28,45.61 -5.06,-3.93 -4.71,-4.21 -0.87,-6.18 -1.76,-8.92 -3.14,-3.84 -2.79,-1.55 -2.47,1.42 1.99,9.59 -1.41,3.73 -2.29,-8.98 -2.56,-3.11 -3.17,4.81 -3.9,-4.76 -6.24,2.87 1.4,-4.46 -2.87,-1.87 -7.51,5.84 -1.95,3.71 -2.35,6.77 4.9,2.32 4.33,-0.12 -6.5,3.46 1.48,3.13 3.98,0.17 5.99,-0.67 5.42,1.96 -3.66,1.44 -3.95,-0.37 -4.33,1.41 -1.87,0.87 3.45,6.35 2.49,-0.88 3.83,2.15 1.52,3.65 4.99,-0.73 7.1,-1.16 5.26,-2.65 3.26,-0.48 4.82,2.12 5.07,1.22 0.94,-2.86 -1.79,-3.05 4.6,-0.64 0.33,-3.57 z m 7.74,-0.98 -1.96,3.54 -2.47,2.49 3.83,3.54 2.28,-0.85 3.78,2.36 1.74,-2.73 -1.71,-3.03 -0.84,-1.53 -1.68,-1.46 -2.97,-2.33 z m -17.61,-29.45 -2.13,-2.17 -3.76,0.4 -0.95,1.38 4.37,6.75 2.47,-6.36 z m 28.69,13.17 3.01,-6.93 3.34,-1.85 4.19,-8.74 -5.36,-2.47 -5.84,-0.36 -2.78,2.77 -1.47,4.23 -0.04,4.82 1.75,8.19 3.2,0.34 z m 17.15,-23 5.76,-0.18 8.04,-1.61 3.59,1.28 4.18,-2.26 1.75,-2.84 -0.63,-4.52 -3,-4.23 -4.56,-0.8 -5.71,0.97 -4.46,2.44 -4.09,-0.94 -3.78,-0.5 -1.78,-2.7 -3.22,-2.61 0.64,-4.43 -2.42,-3.98 -5.52,0.03 -3.11,-3.99 -5.78,-0.8 -1.06,5.1 3.25,3.74 5.8,1.45 2.81,5.09 0.34,5.6 0.97,5.99 7.45,3.42 4.54,1.28 z m -89.02,-18.27 5.21,-5.05 2.62,-0.59 2.16,-4.23 0.38,-9.77 -3.85,1.91 -4.3,-0.18 -5.76,8.19 -4.76,8.98 3.8,2.51 4.5,-1.77 z m 72.18,16.17 1.53,-4.14 -1.02,-3.46 -2.45,-3.92 -4.03,3.02 -1.49,4.92 3.4,2.79 4.06,0.79 z m -8.31,11.44 -0.73,-2.88 -5,1.26 -3.34,-2.11 -3.32,4.8 3.09,6.28 -5.72,-1.17 -0.06,3.01 6.97,7.05 1.94,3.38 2.7,0.73 4.6,-3.41 0.5,-8.21 -4.24,-4.07 2.61,-4.66 z m -73.99,153.74 -1.16,-2.34 -2.8,-1.77 -1.39,-2.05 -0.95,-1.5 -2.64,-0.46 -1.72,-0.67 -2.94,-0.96 -0.24,1.02 1.08,2.38 2.89,0.78 0.5,1.23 2.51,1.5 0.84,1.51 4.6,1.92 1.42,-0.59 z m 121.7,-77.63 -2,-2.11 -2.06,0.5 -0.25,-3.06 -3.21,-2.04 -3.07,-2.27 -1.63,-1.75 -1.43,1.03 -0.52,-2.96 -2.03,-0.55 -0.96,6.13 -0.36,5.11 -2.44,3.14 3.8,-0.6 0.96,3.65 3.99,-3.23 2.78,-3.38 1.57,2.86 4.36,1.51 2.5,-1.98 z m -120.53,-52.55 7.38,-4.18 v -3.87 l 3.48,-6.41 6.88,-6.69 3.52,-2.47 -3.01,-4.2 -2.72,-2.95 -7.16,-0.57 -4,-2.16 -9.48,1.63 2.74,6.23 -2.43,6.43 -1.94,6.87 -1.2,3.86 6.47,4.69 1.47,3.79 z m 134.24,27.31 0.32,-1.01 -0.03,-3.17 -2.19,-2.08 -2.57,1.05 -1.19,4.17 0.7,3.56 3.14,-0.36 1.82,-2.16 z m 23.82,7.54 4.41,6.6 3.45,2.85 4.92,-7.87 0.87,-4.93 -4.41,-0.47 -4.03,-6.7 -4.45,-1.64 -6.6,-4.97 5.15,-3.63 -2.65,-7.54 -2.44,-3.35 -6.77,-3.35 -2.92,-5.55 -5.21,1.99 -0.36,-3.86 -3.86,-4.32 -6.22,-4.71 -2.65,3.71 -5.55,2.66 0.42,-6.06 -4.81,-10.05 -7.11,4.06 -2.59,7.7 -2.21,-5.92 2.06,-6.37 -7.24,2.65 -2.88,3.99 -2.15,8.42 0.89,9.05 3.98,0.04 -2.93,3.92 2.33,2.96 4.55,1.25 5.93,2.42 10.2,1.82 5.08,-1.04 1.5,-2.42 2.21,2.79 2.47,0.46 2.97,4.96 -1.8,1.98 5.68,2.63 4.29,3.68 1.08,2.55 0.77,3.24 -3.63,6.93 -0.98,3.44 0.94,2.42 -5.77,0.86 -5.27,0.12 -1.85,4.87 2.37,2.23 8.11,-1.03 -0.04,-1.89 4.08,3.15 4.18,3.28 -0.98,1.77 3.4,3.02 6.02,3.53 7.6,2.39 -0.46,-2.09 -2.92,-3.67 -3.96,-5.37 7.03,5 3.54,1.66 0.97,-4.44 -1.82,-6.3 -1.16,-1.73 -3.81,-3.03 -2.95,-3.91 0.35,-3.94 3.64,-0.9 z M 222.6,51.59 l 2.34,7.29 4.96,5.88 9.81,-1.09 6.31,1.97 -4.38,6.05 -2.21,-1.78 -7.66,-0.71 1.19,8.31 3.96,6.04 -0.8,5.2 -4.97,3.46 -2.27,5.47 4.55,2.65 3.82,8.55 -7.5,-5.7 -1.71,0.94 1.38,9.38 -5.18,2.83 0.35,5.85 5.3,0.63 4.17,1.44 8.24,-1.84 7.33,3.27 7.49,-7.19 -0.06,-3.02 -4.79,0.48 -0.39,-2.84 3.92,-3.83 1.33,-5.15 4.33,-3.83 2.66,-4.76 -2.32,-7.1 1.94,-2.65 -3.86,-1.89 8.49,-1.63 1.79,-3.15 5.78,-2.6 4.8,-13.47 4.57,-4.94 6.62,-11.12 -6.1,0.1 2.54,-4.3 6.78,-3.99 6.84,-8.9 0.12,-5.73 -5.13,-6.04 -6.02,-2.93 -7.49,-1.82 -6.07,-1.49 -6.07,-1.5 -8.1,3.98 -1.49,-2.53 -8.57,0.98 -5.03,2.57 -3.7,3.65 -2.13,11.74 -3.06,-6.01 -3.48,-1.14 -4.12,7.97 -5.5,3.35 -3.27,0.66 -4.17,3.84 0.61,6.65 3.28,5.49 z m 74.4,265 -0.98,-1.98 -1.06,1.26 0.7,1.36 3.56,1.71 1.04,-0.26 1.38,-1.66 -2.6,0.11 -2.04,-0.54 z m -57,-77.86 0.61,1.63 1.98,0.14 3.28,-3.34 0.06,-1.19 -3.85,-0.06 -2.08,2.82 z m 62.13,66.44 -2.87,-1.8 -3.69,-1.09 -0.97,0.37 2.61,2.04 3.63,1.34 1.36,-0.08 -0.07,-0.78 z m 24.88,4.79 -0.36,-2.24 -1.96,0.72 0.87,-3.11 -2.8,-1.32 -1.29,1.05 -2.49,-1.18 0.98,-1.51 -1.88,-0.93 -1.83,1.47 1.86,-3.82 1.5,-2.8 0.54,-1.22 -1.3,-0.2 -2.43,1.55 -1.74,2.53 -2.9,6.92 -2.35,2.56 1.22,1.14 -1.75,1.47 0.43,1.23 5.44,0.13 3.01,-0.25 2.69,1.01 -1.98,1.93 1.67,0.14 3.25,-3.58 0.78,0.53 -0.61,3.37 1.84,0.77 1.27,-0.15 1.18,-3.61 -0.86,-2.6 z m -21.19,4.76 -2.81,4.56 -4.63,0.58 -3.64,-2.01 -0.92,-3.07 -0.89,-4.46 2.65,-2.83 -2.48,-2.09 -4.19,0.43 -5.88,3.53 -4.5,5.45 -2.38,0.67 3.23,-3.8 4.04,-5.57 3.57,-1.9 2.35,-3.11 2.9,-0.3 4.21,0.03 6,0.92 4.74,-0.71 3.53,-3.62 4.62,-1.59 2.01,-1.58 2.04,-1.71 -0.2,-5.19 -1.13,-1.77 -2.18,-0.63 -1.11,-4.05 -1.8,-1.55 -4.47,-1.26 -2.52,-2.82 -3.73,-2.83 1.13,-3.2 -3.1,-6.26 -3.65,-6.89 -2.18,-4.98 -1.86,2.61 -2.68,6.05 -4.06,2.97 -2.03,-3.16 -2.56,-0.85 -0.93,-6.99 0.08,-4.8 -5,-0.44 -0.85,-2.27 -3.45,-3.44 -2.61,-2.04 -2.32,1.58 -2.88,-0.58 -4.81,-1.65 -1.95,1.4 0.94,9.18 1.22,5.12 -3.31,5.75 3.41,4.02 1.9,4.44 0.23,3.42 -1.55,3.5 -3.18,3.46 -4.49,2.28 1.98,2.53 1.46,7.4 -1.52,4.68 -2.16,1.46 -4.17,-4.28 -2.03,-5.17 -0.87,-4.76 0.46,-4.19 -3.05,-0.47 -4.63,-0.28 -2.97,-2.08 -3.51,-1.37 -2.01,-2.38 -2.8,-1.94 -5.21,-2.23 -3.92,1.02 -1.31,-3.95 -1.26,-4.99 -4.12,-0.9 0.15,-6.41 1.09,-4.48 3.04,-6.6 3.43,-4.9 3.26,-0.77 0.19,-4.05 2.21,-2.68 4.01,-0.42 3.25,-4.39 0.82,-2.9 2.7,-5.73 0.84,-3.5 2.9,2.11 3.9,-1.08 5.49,-4.96 0.36,-3.54 -1.98,-3.98 2.09,-4.06 -0.17,-3.87 -3.76,-3.95 -4.14,-1.19 -3.98,-0.62 -0.15,8.71 -2.04,6.56 -2.93,5.3 -2.71,-4.95 0.84,-5.61 -3.35,-5.02 -3.75,6.09 0.01,-7.99 -5.21,-1.63 2.49,-4.01 -3.81,-9.59 -2.84,-3.91 -3.7,-1.44 -3.32,6.43 -0.22,9.34 3.27,3.29 3,4.91 -1.27,7.71 -2.26,-0.2 -1.78,5.88 0.02,-7 -4.34,-2.58 -2.49,1.33 0.32,4.67 -4.09,-0.18 -4.35,1.17 -4.95,-3.35 -3.13,0.6 -2.82,-4.11 -2.26,-1.84 -2.24,0.77 -3.41,0.35 -1.81,2.61 2.86,3.19 -3.05,3.72 -2.99,-4.42 -2.39,1.3 -7.57,0.87 -5.07,-1.59 3.94,-3.74 -3.78,-3.9 -2.75,0.5 -3.86,-1.32 -6.56,-2.89 -4.29,-3.37 -3.4,-0.47 -1.06,2.36 -3.44,1.31 -0.38,-6.15 -3.73,5.5 -4.74,-7.32 -1.94,-0.89 -0.63,3.91 -2.09,1.9 -1.93,-3.39 -4.59,2.05 -4.2,3.55 -4.17,-0.98 -3.4,2.5 -2.46,3.28 -2.92,-0.72 -4.41,-3.8 -5.23,-1.94 -0.02,27.65 -0.01,35.43 2.76,0.17 2.73,1.56 1.96,2.44 2.49,3.6 2.73,-3.05 2.81,-1.79 1.49,2.85 1.89,2.23 2.57,2.42 1.75,3.79 2.87,5.88 4.77,3.2 0.08,3.12 -1.56,2.35 0.06,2.48 3.39,3.45 0.49,3.76 3.59,1.96 -0.4,2.79 1.56,3.96 5.08,1.82 2,1.89 5.43,4.23 0.38,0.01 h 7.96 8.32 2.76 8.55 8.27 8.41 l 8.42,0 9.53,0 9.59,0 5.8,0 0.01,-1.64 0.95,-0.02 0.5,2.35 0.87,0.72 1.96,0.26 2.86,0.67 2.72,1.3 2.27,-0.55 3.45,1.09 1.14,-1.66 1.59,-0.66 0.62,-1.03 0.63,-0.55 2.61,0.86 1.93,0.1 0.67,0.57 0.94,2.38 3.15,0.63 -0.49,1.18 1.11,1.21 -0.48,1.56 1.18,0.51 -0.59,1.37 0.75,0.13 0.53,-0.6 0.55,0.9 2.1,0.5 2.13,0.04 2.27,0.41 2.51,0.78 0.91,1.26 1.82,3.04 -0.9,1.3 -2.28,-0.54 -1.42,-2.44 0.36,2.49 -1.34,2.17 0.15,1.84 -0.23,1.07 -1.81,1.27 -1.32,2.09 -0.62,1.32 1.54,0.24 2.08,-1.2 1.23,-1.06 0.83,-0.17 1.54,0.38 0.75,-0.59 1.37,-0.48 2.44,-0.47 v 0 l 0,0 -0.25,-1.15 -0.13,0.04 -0.86,0.2 -1.12,-0.36 0.84,-1.32 0.85,-0.46 1.98,-0.56 2.37,-0.53 1.24,0.73 0.78,-0.85 0.89,-0.54 0.6,0.29 0.03,0.06 2.87,-2.73 1.27,-0.73 4.26,-0.03 5.17,0 0.28,-0.98 0.9,-0.2 1.19,-0.62 1,-1.82 0.86,-3.15 2.14,-3.1 0.93,1.08 1.88,-0.7 1.25,1.19 0,5.52 1.83,2.25 3.12,-0.48 4.49,-0.13 -4.87,3.26 0.11,3.29 2.13,0.28 3.13,-2.79 2.78,-1.58 6.21,-2.35 3.47,-2.62 -1.81,-1.46 -0.29,-2.92 z m -53.66,-71.1 1.1,-3.12 -0.71,-1.23 -1.15,-0.13 -1.08,1.8 -0.13,0.41 0.74,1.77 1.23,0.5 z m -142.66,36.43 0,0 1.56,-2.35 -1.56,2.35 z m -3.4,3.29 -2.69,0.38 -1.32,-0.62 -0.17,1.52 0.52,2.07 1.42,1.46 1.04,2.13 1.69,2.1 1.12,0.01 -2.44,-3.7 0.83,-5.35 z",
                    "CD": "m 561.96,453.86 -0.17,3.26 1.12,0.37 -0.9,0.99 -1.08,0.74 -1.07,1.46 -0.59,1.29 -0.16,2.24 -0.65,1.06 -0.02,2.1 -0.81,0.78 -0.1,1.66 -0.39,0.21 -0.26,1.53 0.71,1.26 0.18,3.37 0.5,2.57 -0.28,1.46 0.56,1.62 1.63,1.57 1.51,3.55 -1.1,-0.29 -3.77,0.48 -0.75,0.33 -0.8,1.8 0.63,1.25 -0.5,3.35 -0.35,2.85 0.76,0.51 1.96,1.1 0.77,-0.51 0.24,3.08 -2.15,-0.03 -1.15,-1.57 -1.03,-1.22 -2.15,-0.4 -0.63,-1.49 -1.72,0.9 -2.24,-0.4 -0.94,-1.29 -1.78,-0.26 -1.31,0.07 -0.16,-0.88 -0.97,-0.07 -1.28,-0.17 -1.73,0.42 -1.22,-0.07 -0.7,0.26 0.15,-3.37 -0.93,-1.05 -0.21,-1.73 0.41,-1.7 -0.56,-1.09 -0.05,-1.76 -3.41,0.02 0.25,-1.01 -1.43,0.01 -0.15,0.49 -1.74,0.11 -0.71,1.63 -0.42,0.71 -1.55,-0.4 -0.92,0.4 -1.86,0.22 -1.07,-1.47 -0.64,-0.91 -0.81,-1.68 -0.69,-2.09 -8.27,-0.03 -0.99,0.33 -0.81,-0.05 -1.16,0.38 -0.39,-0.87 0.71,-0.3 0.09,-1.22 0.46,-0.72 1.02,-0.58 0.74,0.28 0.96,-1.07 1.52,0.03 0.18,0.79 1.05,0.5 1.65,-1.76 1.63,-1.36 0.71,-0.89 -0.09,-2.3 1.22,-2.71 1.28,-1.43 1.85,-1.34 0.32,-0.89 0.07,-1.02 0.46,-0.97 -0.15,-1.58 0.35,-2.47 0.55,-1.74 0.84,-1.49 0.16,-1.68 0.25,-1.95 1.1,-1.42 1.5,-0.9 2.31,0.95 1.78,1.03 2.05,0.28 2.09,0.54 0.84,-1.68 0.39,-0.22 1.27,0.28 3.13,-1.39 1.1,0.59 0.91,-0.08 0.42,-0.68 1.04,-0.24 2.11,0.29 1.8,0.06 0.93,-0.29 1.69,2.31 1.26,0.33 0.75,-0.47 1.3,0.19 1.56,-0.59 0.67,1.19 z",
                    "CF": "m 518.34,442.91 2.32,-0.22 0.52,-0.72 0.46,0.06 0.7,0.63 3.53,-1.07 1.19,-1.1 1.47,-0.99 -0.28,-0.99 0.79,-0.26 2.71,0.18 2.64,-1.31 2.02,-3.09 1.43,-1.14 1.77,-0.49 0.32,1.22 1.62,1.77 0,1.15 -0.45,1.18 0.18,0.87 0.97,0.81 2.14,1.24 1.53,1.13 0.03,0.92 1.88,1.46 1.17,1.21 0.71,1.68 2.1,1.11 0.45,0.89 -0.93,0.29 -1.8,-0.06 -2.11,-0.29 -1.04,0.24 -0.42,0.68 -0.91,0.08 -1.1,-0.59 -3.13,1.39 -1.27,-0.28 -0.39,0.22 -0.84,1.68 -2.09,-0.54 -2.05,-0.28 -1.78,-1.03 -2.31,-0.95 -1.5,0.9 -1.1,1.42 -0.25,1.95 -1.8,-0.16 -1.9,-0.47 -1.67,1.48 -1.47,2.6 -0.3,-0.81 -0.12,-1.27 -1.28,-0.9 -1.04,-1.44 -0.24,-1 -1.32,-1.46 0.22,-0.83 -0.28,-1.18 0.22,-2.17 0.67,-0.51 z",
                    "CG": "m 511.94,476.97 -1.05,-0.96 -0.85,0.47 -1.13,1.2 -2.3,-2.95 2.13,-1.54 -1.05,-1.85 0.96,-0.7 1.89,-0.34 0.22,-1.24 1.5,1.34 2.48,0.12 0.86,-1.32 0.35,-1.85 -0.31,-2.18 -1.32,-1.64 1.21,-3.23 -0.7,-0.55 -2.08,0.22 -0.79,-1.43 0.21,-1.22 3.53,0.11 2.27,0.73 2.23,0.66 0.2,-1.5 1.47,-2.6 1.67,-1.48 1.9,0.47 1.8,0.16 -0.16,1.68 -0.84,1.49 -0.55,1.74 -0.35,2.47 0.15,1.58 -0.46,0.97 -0.07,1.02 -0.32,0.89 -1.85,1.34 -1.28,1.43 -1.22,2.71 0.09,2.3 -0.71,0.89 -1.63,1.36 -1.65,1.76 -1.05,-0.5 -0.18,-0.79 -1.52,-0.03 -0.96,1.07 z",
                    "CH": "m 502.4,312.59 0.11,0.74 -0.43,1.01 1.27,0.74 1.43,0.11 -0.22,1.67 -1.23,0.69 -2.08,-0.51 -0.61,1.63 -1.33,0.13 -0.49,-0.64 -1.57,1.36 -1.35,0.19 -1.21,-0.86 -0.96,-1.77 -1.34,0.64 0.04,-1.84 2.05,-2.31 -0.09,-1.05 1.28,0.39 0.77,-0.71 2.38,0.03 0.58,-0.9 z",
                    "CI": "m 467.49,449.71 -1.27,0.03 -1.96,-0.55 -1.79,0.03 -3.33,0.49 -1.94,0.81 -2.78,1.02 -0.54,-0.07 0.21,-2.3 0.27,-0.35 -0.08,-1.11 -1.19,-1.17 -0.89,-0.19 -0.82,-0.77 0.61,-1.24 -0.28,-1.36 0.13,-0.82 0.45,0 0.16,-1.23 -0.22,-0.54 0.27,-0.39 1.04,-0.34 -0.69,-2.26 -0.65,-1.16 0.23,-0.97 0.56,-0.21 0.36,-0.26 0.78,0.42 2.16,0.03 0.52,-0.83 0.48,0.06 0.81,-0.32 0.44,1.21 0.65,-0.36 1.16,-0.42 1.26,0.62 0.49,0.93 1.26,0.6 0.98,-0.71 1.32,-0.11 1.92,0.73 0.74,4.01 -1.18,2.36 -0.73,3.17 1.21,2.41 z",
                    "CL": "m 283.06,636.98 0,10.57 3,0 1.69,0.13 -0.93,1.98 -2.4,1.53 -1.38,-0.16 -1.66,-0.4 -2.04,-1.48 -2.94,-0.71 -3.53,-2.71 -2.86,-2.57 -3.86,-5.25 2.31,0.97 3.94,3.13 3.72,1.7 1.45,-2.17 0.91,-3.2 2.58,-1.91 2,0.55 z m 1.16,-112.01 1.1,4.15 2.02,-0.41 0.34,0.76 -0.96,3.16 -3.05,1.51 0.09,5.14 -0.59,1 0.84,1.23 -1.98,1.95 -1.84,2.96 -1,2.9 0.27,3.11 -1.73,3.34 1.29,5.69 0.73,0.61 -0.01,3.09 -1.6,3.31 0.06,2.87 -2.12,2.26 0.01,3.22 0.85,3.46 -1.68,1.3 -0.75,3.22 -0.66,3.75 0.47,4.54 -1.13,0.77 0.65,4.4 1.27,1.46 -0.92,1.63 1.3,0.78 0.3,1.48 -1.22,0.75 0.3,2.33 -1.02,5.35 -1.49,3.52 0.33,2.11 -0.89,2.68 -2.15,1.88 0.25,4.6 0.99,1.6 1.87,-0.28 -0.05,3.33 1.16,2.63 6.78,0.61 2.6,0.71 -2.49,-0.03 -1.35,1.13 -2.53,1.67 -0.45,4.38 -1.19,0.11 -3.16,-1.54 -3.21,-3.25 0,0 -3.49,-2.63 -0.88,-2.87 0.79,-2.62 -1.41,-2.94 -0.36,-7.34 1.19,-4.03 2.96,-3.19 -4.26,-1.19 2.67,-3.57 0.95,-6.56 3.12,1.37 1.46,-7.97 -1.88,-1 -0.88,4.75 -1.77,-0.54 0.88,-5.42 0.96,-6.84 1.29,-2.48 -0.81,-3.5 -0.23,-3.98 1.18,-0.11 1.72,-5.6 1.94,-5.43 1.19,-4.97 -0.65,-4.91 0.84,-2.67 -0.34,-3.96 1.64,-3.87 0.51,-6.04 0.9,-6.37 0.88,-6.75 -0.21,-4.87 -0.58,-4.15 1.44,-0.75 0.75,-1.5 1.37,1.99 0.37,2.12 1.47,1.25 -0.88,2.87 1.51,3.34 z",
                    "CM": "m 512.17,457.32 -0.35,-0.15 -1.66,0.36 -1.71,-0.38 -1.33,0.19 -4.56,-0.07 0.41,-2.2 -1.1,-1.84 -1.28,-0.48 -0.57,-1.25 -0.72,-0.4 0.04,-0.77 0.72,-1.98 1.33,-2.7 0.81,-0.03 1.67,-1.64 1.07,-0.04 1.57,1.15 1.93,-0.95 0.26,-1.16 0.63,-1.14 0.43,-1.42 1.5,-1.16 0.57,-1.97 0.59,-0.63 0.4,-1.47 0.74,-1.81 2.36,-2.2 0.15,-0.95 0.31,-0.51 -1.11,-1.14 0.09,-0.9 0.79,-0.17 1.11,1.83 0.19,1.89 -0.1,1.89 1.52,2.57 -1.56,-0.03 -0.79,0.2 -1.28,-0.28 -0.61,1.33 1.65,1.65 1.22,0.48 0.4,1.17 0.88,1.93 -0.44,0.77 -1.41,2.84 -0.67,0.51 -0.22,2.17 0.28,1.18 -0.22,0.83 1.32,1.46 0.24,1 1.04,1.44 1.28,0.9 0.12,1.27 0.3,0.81 -0.2,1.5 -2.23,-0.66 -2.27,-0.73 z",
                    "CN": "m 784.88,410.66 -2.42,1.41 -2 3,-0.91 -0.08,-2.53 1.38,-1.34  .06,-0.83 1.61,0.07 0.63,1.13 - .23,1.3 -0.65,1.7 z m 48.56,-10 .52 4.88,1.38 3.32,3.03 1.13,3. 5 4.26,0 2.43,-1.65 4.63,-1.24  1.47,3.76 -1.09,1.51 -0.96,4.46 -1.89,3.89 -3.4,-0.7 -2.41,1.4  .74,3.36 -0.4,4.55 -1.43,0.1 0. 2,1.93 -1.81,-2.24 -1.11,2.13 - .33,1.62 0.44,1.97 -2.42,-0.14  1.33,-1.17 -1.93,2.64 -3.09,1.9  -2.28,2.35 -3.92,1.06 -2.06,1. 9 -3.02,0.98 1.49,-1.67 -0.59,- .41 2.22,-2.45 -1.48,-1.93 -2.4 ,1.3 -3.17,2.54 -1.73,2.34 -2.7 ,0.17 -1.43,1.68 1.48,2.41 2.29 0.58 0.09,1.58 2.22,1.02 3.14,- .51 2.49,1.37 1.81,0.09 0.46,1. 4 -3.97,0.97 -1.31,1.87 -2.73,1 73 -1.44,2.39 3.02,1.86 1.1,3.3  1.71,3.05 1.9,2.53 -0.05,2.43  1.76,0.89 0.67,1.73 1.65,1 -0.4 ,2.61 -0.71,2.52 -1.57,0.28 -2. 5,3.41 -2.27,4.09 -2.6,3.68 -3. 6,2.82 -3.9,2.55 -3.16,0.35 -1. 1,1.34 -0.97,-0.98 -1.59,1.5 -3 92,1.5 -2.97,0.46 -0.96,3.15 -1 55,0.17 -0.74,-2.16 0.66,-1.16  3.76,-0.96 -1.33,0.49 -2.82,-0. 8 -1.33,-1.22 0.44,-1.74 -2.56, 0.55 -1.35,-1.14 -2.39,1.62 -2. 3,0.35 -2.24,-0.02 -1.5,0.74 -1 45,0.44 0.42,3.43 -1.5,-0.08 -0 25,-0.7 -0.08,-1.24 -2.06,0.87  1.21,-0.55 -2.08,-1.13 0.82,-2. 1 -1.78,-0.59 -0.67,-2.8 -2.96, .51 0.34,-3.63 2.66,-2.58 0.11, 2.57 -0.08,-2.4 -1.22,-0.75 -0. 4,-1.86 -1.64,0.24 -3.02,-0.47  .95,-1.33 -1.31,-1.99 -2,1.35 - .36,-0.78 -3.23,2.03 -2.55,2.36 -2.26,0.39 -1.23,-0.85 -1.48,-0 08 -2,-0.73 -1.51,0.8 -1.85,2.3  -0.24,-2.48 -1.71,0.66 -3.27,- .31 -3.17,-0.73 -2.28,-1.39 -2. 8,-0.63 -0.94,-1.53 -1.58,-0.46 -2.83,-2.09 -2.25,-0.99 -1.16,0 77 -3.9,-2.26 -2.75,-2.07 -0.79 -3.63 2.01,0.44 0.09,-1.69 -1.1 ,-1.71 0.28,-2.74 -3.01,-3.99 - .61,-1.39 -0.83,-2.66 -2.07,-1. 3 -0.5,-1.01 -0.42,-2.01 0.1,-1 38 -1.7,-0.81 -0.92,0.36 -0.71, 3.32 0.8,-0.83 -0.39,-0.85 2.68 -1.73 1.94,-0.72 2.97,0.49 1.06 -2.35 3.6,-0.44 1,-1.48 4.42,-2 03 0.39,-0.85 -0.22,-2.17 1.92, 1 -2.52,-6.75 5.55,-1.58 1.44,- .89 2.02,-7.26 5.56,1.35 1.56,- .86 0.13,-4.19 2.33,-0.39 2.13, 2.83 1.1,-0.35 0.74,2.97 2.36,2 23 4,1.57 1.93,3.32 -1.08,4.73  .01,1.73 3.33,0.68 3.78,0.55 3. 9,2.45 1.73,0.43 1.28,3.57 1.65 2.27 3.09,-0.09 5.79,0.85 3.73, 0.53 2.77,0.57 4.15,2.29 3.39,0 1.24,1.16 3.26,-2.01 4.53,-1.31 4.2,-0.14 3.28,-1.34 2.01,-2.05 1.96,-1.3 -0.45,-1.28 -0.9,-1.5 1.47,-2.54 1.58,0.36 2.88,0.8 2 79,-2.1 4.28,-1.55 2.05,-2.66 1 97,-1.16 4.07,-0.54 2.21,0.46 0 31,-1.45 -2.54,-2.89 -2.25,-1.3  -2.16,1.54 -2.77,-0.65 -1.59,0 53 -0.72,-1.71 1.98,-4.23 1.37, 3.25 3.37,1.63 3.95,-2.74 -0.03 -1.93 2.53,-4.73 1.56,-1.45 -0. 4,-2.52 -1.54,-1.1 2.32,-2.31 3 48,-0.84 3.72,-0.13 4.2,1.39 2. 6,1.71 1.73,4.61 1.05,1.94 0.98 2.73 1.05,4.31 z",
                    "CO": "m 264.17,464.06 - .2,-0.66 -1.38,-0.92 -0.8,0.44  2.38,-0.39 -0.68,-1.2 -0.52,0.0  -2.81,-1.59 -0.38,-0.87 1.05,- .21 -0.12,-1.39 0.65,-1.01 1.39 -0.19 1.19,-1.75 1.07,-1.46 -1. 4,-0.67 0.53,-1.62 -0.63,-2.56  .6,-0.73 -0.44,-2.37 -1.14,-1.5 0.36,-1.36 0.91,0.2 0.53,-0.84  0.65,-1.65 0.34,-0.42 1.44,0.09 2.11,-1.97 1.15,-0.3 0.03,-0.93 0.52,-2.39 1.61,-1.32 1.76,-0.0  0.22,-0.59 2.2,0.23 2.21,-1.43 1.09,-0.64 1.35,-1.37 1,0.17 0. 3,0.75 -0.54,0.96 -1.8,0.48 -0. 1,1.42 -1.09,0.81 -0.81,1.06 -0 35,2.01 -0.77,1.66 1.44,0.18 0. 6,1.3 0.62,0.62 0.22,1.13 -0.33 1.04 0.1,0.59 0.69,0.23 0.67,0. 8 3.6,-0.27 1.63,0.36 1.98,2.41 1.13,-0.3 2.02,0.15 1.6,-0.32 0 99,0.49 -0.51,1.5 -0.62,0.94 -0 22,2.01 0.56,1.85 0.8,0.83 0.09 0.63 -1.42,1.39 1.02,0.61 0.75, .98 0.85,2.77 -0.53,0.35 -0.54, 1.65 -0.78,-0.88 -0.93,0.96 -5. 6,-0.06 0.03,1.74 1.64,0.29 -0. 9,1.07 -0.56,-0.29 -1.58,0.46 - .01,2.02 1.24,1.02 0.44,1.59 -0 07,1.21 -1.26,7.65 -1.4,-1.49 - .84,-0.06 1.81,-2.84 -2.15,-1.3  -1.68,0.24 -1.01,-0.48 -1.55,0 74 -2.09,-0.35 -1.65,-2.92 -1.3 -0.72 -0.89,-1.32 -1.86,-1.32 z ,
                    "CR": "m  42.88,440.65 -1.52,-0.63 -0.57, 0.59 0.32,-0.49 -0.1,-0.62 -0.7 ,-0.68 -1.1,-0.55 -0.97,-0.36 - .18,-0.83 -0.74,-0.51 0.18,0.83 -0.56,0.67 -0.64,-0.78 -0.9,-0. 8 -0.38,-0.57 0.02,-0.86 0.37,- .9 -0.79,-0.4 0.64,-0.54 0.42,- .37 1.85,0.75 0.64,-0.37 0.89,0 24 0.47,0.58 0.82,0.19 0.67,-0.  0.72,1.54 1.08,1.14 1.32,1.21  1.09,0.25 0.02,1.13 0.58,0.42 - .42,0.34 0.11,0.51 -0.23,0.57 z ,
                    "CU": "m  44.83,397.19 2.43,0.22 2.2,0.03 2.63,1.03 1.12,1.11 2.62,-0.34  .99,0.7 2.38,1.87 1.74,1.35 0.9 ,-0.04 1.68,0.61 -0.21,0.84 2.0 ,0.12 2.12,1.22 -0.33,0.69 -1.8 ,0.38 -1.89,0.15 -1.93,-0.24 -4 01,0.29 1.88,-1.66 -1.14,-0.77  1.81,-0.2 -0.97,-0.86 -0.67,-1.  -1.58,0.11 -2.62,-0.8 -0.84,-0 63 -3.65,-0.47 -0.98,-0.59 1.05 -0.75 -2.75,-0.15 -2.01,1.56 -1 17,0.04 -0.4,0.74 -1.38,0.33 -1 2,-0.29 1.48,-0.93 0.6,-1.09 1. 7,-0.67 1.43,-0.59 2.13,-0.29 z ,
                    "CY": "m  70.56,358.54 1.89,-1.46 -2.55,1 02 -2.02,-0.05 -0.4,0.83 -0.2,0 02 -1.33,0.12 0.65,1.37 1.37,0. 4 2.88,-1.38 -0.09,-0.27 z",
                    "CZ": "m 523.0 ,308.11 -1.3,-0.8 -1.31,0.22 -2 18,-1.3 -0.99,0.32 -1.57,1.74 - .09,-1.37 -1.58,-1.83 -1.43,-1. 4 -0.3,-1.82 -0.49,-1.3 2.04,-0 95 1.04,-1.1 2.01,-0.86 0.71,-0 84 0.74,0.51 1.25,-0.47 1.33,1. 3 2.09,0.39 -0.17,1.21 1.52,0.9 0.42,-1.13 1.92,0.49 0.27,1.37  .08,0.26 1.29,2.13 -0.83,0.01 - .44,0.77 -0.64,0.19 -0.18,0.97  0.54,0.21 -0.08,0.39 -0.95,0.44 -1.25,-0.07 z",
                    "DE": "m 503.32,279.17 0.05 1.88 2.84,1.12 -0.03,1.7 2.85,- .9 1.57,-1.31 3.17,1.89 1.32,1. 1 0.66,2.39 -0.78,1.25 1.01,1.6  0.7,2.45 -0.22,1.56 1.15,2.86  1.25,0.47 -0.74,-0.51 -0.71,0.8  -2.01,0.86 -1.04,1.1 -2.04,0.9  0.49,1.3 0.3,1.82 1.43,1.04 1. 8,1.83 -0.98,1.95 -1.01,0.54 0. ,2.72 -0.27,0.7 -0.87,-0.85 -1. 4,-0.12 -2.01,0.74 -2.47,-0.18  0.4,1.09 -1.42,-1.14 -0.85,0.22 -3,-1.26 -0.58,0.9 -2.38,-0.03  .35,-2.98 1.42,-2.9 -4.04,-0.78 -1.32,-1.13 0.16,-1.89 -0.56,-0 98 0.32,-2.97 -0.48,-4.69 1.69,  0.71,-1.71 0.7,-4.23 -0.53,-1. 8 0.55,-1 2.34,-0.26 0.52,1.04  .91,-2.33 -0.64,-1.79 -0.13,-2. 5 2.12,0.64 z",
                    "DJ": "m 596.3,427.97 0.66, .88 -0.09,1.19 -1.6,0.68 1.21,0 77 -1.04,1.52 -0.62,-0.5 -0.67, .2 -1.57,-0.05 -0.05,-0.86 -0.2 ,-0.79 0.94,-1.33 0.99,-1.26 1. ,0.25 z",
                    " K": "m 511.08,276.09 -1.68,3.97 -2.93,-2.76 -0.39,-2.05 4.11,-1 66 0.89,2.5 z m -4.98,-4.25 -0. 9,1.9 -0.83,-0.55 -2.02,3.59 0. 6,2.39 -1.79,0.74 -2.12,-0.64 - .14,-2.72 -0.08,-5.12 0.47,-1.3  0.8,-1.54 2.47,-0.32 0.98,-1.4  2.26,-1.47 -0.1,2.68 -0.83,1.6  0.34,1.43 1.52,0.76 z",
                    "DO": "m 274.43,40 .6 0.35,-0.51 2.19,0.02 1.66,0. 6 0.74,-0.08 0.51,1.05 1.53,-0. 6 -0.09,0.88 1.25,0.11 1.38,1.0  -1.04,1.2 -1.34,-0.64 -1.28,0. 2 -0.92,-0.14 -0.51,0.54 -1.08, .18 -0.42,-0.72 -0.93,0.43 -1.1 ,2 -0.72,-0.46 -0.15,-0.84 0.06 -0.8 -0.72,-0.88 0.68,-0.5 0.22 -1.13 z",
                    " Z": "m 509.15,396.33 -9.61,5.75 -8.12,5.85 -3.95,1.32 -3.11,0.2  -0.03,-1.88 -1.3,-0.48 -1.75,- .85 -0.66,-1.39 -9.46,-6.55 -9. 6,-6.65 -10.55,-7.53 0.06,-0.61 0,-0.21 -0.03,-3.75 4.53,-2.36  .8,-0.49 2.29,-0.86 1.08,-1.62  .28,-1.29 0.12,-2.41 1.62,-0.29 1.27,-1.21 3.67,-0.56 0.51,-1.2  -0.74,-0.71 -0.97,-3.53 -0.16, 2.05 -1.06,-2.18 2.69,-1.87 3.0 ,-0.6 1.77,-1.43 2.7,-1.05 4.75 -0.62 4.64,-0.29 1.41,0.52 2.64 -1.37 3,-0.03 1.14,0.81 1.91,-0 21 -0.57,1.79 0.45,3.28 -0.66,2 82 -1.73,1.88 0.25,2.53 2.29,1. 8 0.03,0.81 1.72,1.33 1.2,5.86  .91,2.84 0.15,1.48 -0.49,2.59 0 2,1.44 -0.36,1.72 0.25,1.97 -1. 2,1.29 1.66,2.26 0.11,1.32 0.99 1.71 1.31,-0.56 2.22,1.42 z",
                    "EC": "m 250. 5,473.12 1.49,-2.08 -0.61,-1.22 -1.07,1.3 -1.68,-1.23 0.57,-0.7  -0.47,-2.53 0.98,-0.42 0.52,-1 73 1.06,-1.8 -0.2,-1.13 1.54,-0 6 1.92,-1.11 2.81,1.59 0.52,-0. 5 0.68,1.2 2.38,0.39 0.8,-0.44  .38,0.92 1.2,0.66 0.39,2.11 -0. 7,1.81 -3.06,2.92 -3.37,1.1 -1. 2,2.43 -0.53,1.88 -1.59,1.15 -1 17,-1.41 -1.14,-0.3 -1.16,0.22  0.07,-1.02 0.8,-0.66 z",
                    "EE": "m 543.67,26 .96 0.33,-3.12 -1.03,0.67 -1.78 -1.9 -0.25,-3.11 3.55,-1.53 3.5 ,-0.81 3.04,0.92 2.9,-0.17 0.42 0.96 -1.99,3.14 0.83,4.96 -1.2, .66 -2.32,-0.01 -2.41,-1.94 -1. 3,-0.65 z",
                    "EG": "m 573.42,377.53 -0.79,1. 9 -0.6,2.4 -0.76,1.64 -0.66,0.5  -0.93,-1.02 -1.27,-1.42 -2,-4. 7 -0.28,0.29 1.16,3.37 1.72,3.1  2.12,4.88 1.03,1.68 0.9,1.74 2 52,3.4 -0.56,0.53 0.09,1.97 3.2 ,2.71 0.49,0.62 -11.12,0 -10.88 0 -11.27,0 0,-11.23 0,-11.18 -0 84,-2.58 0.72,-2 -0.43,-1.39 1. 1,-1.57 3.73,-0.05 2.7,0.86 2.7 ,0.97 1.3,0.5 2.16,-1.03 1.15,- .93 2.48,-0.27 1.99,0.41 0.77,1 62 0.65,-1.07 2.24,0.77 2.19,0. 9 1.38,-0.82 z",
                    "EH": "m 438.82,383.31 3.6 ,0.01 8.75,0.03 0,0 0,0 -8.75,- .03 -3.62,-0.01 -0.11,0.09 -0.0 ,0.04 -1.78,3.2 -1.86,1.14 -1.0 ,1.91 -0.06,1.65 -0.75,1.79 -0. 4,0.49 -1.56,1.94 -0.96,2.15 0. 8,1.02 -0.92,1.57 -1.08,0.82 -0 13,1.39 -0.12,1.27 0.61,-1 10.9 ,0.02 -0.53,-4.35 0.69,-1.55 2. 2,-0.27 -0.09,-7.86 9.21,0.17 0 -4.73 0.06,-0.61 0,-0.21 z",
                    "ER": "m 594.2 ,428.42 -0.96,-0.93 -1.15,-1.67 -1.24,-0.92 -0.73,-1 -2.44,-1.1  -1.92,-0.03 -0.68,-0.61 -1.64, .68 -1.7,-1.31 -0.88,2.15 -3.26 -0.6 -0.3,-1.15 1.21,-4.25 0.27 -1.93 0.88,-0.9 2.07,-0.48 1.42 -1.67 1.63,3.38 0.77,2.67 1.54, .41 3.82,2.72 1.56,1.64 1.52,1. 6 0.88,0.98 1.38,0.86 -0.85,0.7 z",
                    "ES": "  450.17,334.81 0.14,-2.68 -1.14 -1.66 3.96,-2.77 3.43,0.7 3.77, 0.03 2.98,0.66 2.33,-0.2 4.53,0 12 1.12,1.49 5.16,1.73 1.02,-0. 2 3.16,1.72 3.25,-0.49 0.15,2.1  -2.66,2.49 -3.59,0.78 -0.25,1. 4 -1.73,2.03 -1.08,2.96 1.09,2. 5 -1.62,1.6 -0.6,2.3 -2.12,0.7  1.99,2.69 -3.55,0.05 -2.68,-0.0  -1.75,1.22 -1.07,1.31 -1.38,-0 29 -1.03,-1.17 -0.8,-2 -2.62,-0 54 -0.23,-1.16 1.04,-1.32 0.38, 0.96 -0.96,-1.06 0.77,-2.35 -1. 2,-2.17 1.21,-0.3 0.11,-1.72 0. 6,-0.53 0.03,-2.88 1.3,-1 -0.78 -1.88 -1.64,-0.13 -0.48,0.47 -1 65,0.01 -0.71,-1.84 -1.14,0.55  ",
                    "ET": "m 581.79,421.48 1.7,1.31 1.64,-0. 8 0.68,0.61 1.92,0.03 2.44,1.15 0.73,1 1.24,0.92 1.15,1.67 0.96 0.93 -0.99,1.26 -0.94,1.33 0.21 0.79 0.05,0.86 1.57,0.05 0.67,- .2 0.62,0.5 -0.61,1.01 1.04,1.5  1.03,1.36 1.07,1.01 9.17,3.34  .36,-0.02 -7.93,8.42 -3.65,0.12 -2.5,1.97 -1.79,0.05 -0.77,0.88 -1.92,0 -1.13,-0.94 -2.56,1.17  0.83,1.16 -1.87,-0.22 -0.62,-0. 2 -0.66,0.07 -0.88,-0.02 -3.55, 2.38 -1.95,0 -0.96,-0.91 0,-1.5  -1.46,-0.47 -1.65,-3.05 -1.28, 0.65 -0.5,-1.12 -1.42,-1.37 -1. 2,-0.2 0.96,-1.61 1.48,-0.07 0. 2,-0.86 -0.03,-2.53 0.83,-2.96  .32,-0.8 0.29,-1.16 1.2,-2.17 1 69,-1.42 1.14,-2.81 0.45,-2.47  .26,0.6 z",
                    "FK": "m 303.91,633.38 3.36,-2. 9 2.39,1.12 1.68,-1.79 2.24,2.0  -0.84,1.58 -3.79,1.36 -1.26,-1 59 -2.38,2.05 z",
                    "FI": "m 555.67,193.35 -0 41,5.4 4.3,4.99 -2.59,5.48 3.26 7.96 -1.89,5.76 2.53,4.86 -1.15 4.14 4.15,4.26 -1.06,3.1 -2.6,3 45 -6,7.41 -5.09,0.45 -4.93,2.0  -4.56,1.18 -1.63,-3.07 -2.71,- .87 0.62,-5.72 -1.36,-5.41 1.34 -3.58 2.54,-3.94 6.41,-7.02 1.8 ,-1.39 -0.3,-2.84 -3.9,-3.22 -0 94,-2.7 -0.08,-11.12 -4.37,-5.1  -3.74,-3.81 1.68,-2.08 3.12,4. 5 3.66,-0.39 3.01,1.87 2.67,-3. 4 1.38,-5.85 4.35,-2.78 3.6,3.2  z",
                    "FJ":  m 980.78,508.86 -0.35,1.4 -0.23 0.16 -1.78,0.72 -1.79,0.61 -0.3 ,-1.09 1.4,-0.6 0.89,-0.16 1.64 -0.91 0.58,-0.13 z m -5.84,4.31 -1.27,-0.36 -1.08,1 0.27,1.29 1 55,0.36 1.74,-0.4 0.46,-1.53 -0 96,-0.84 -0.71,0.48 z",
                    "FR": "m 502.31,333 79 -0.93,2.89 -1.27,-0.76 -0.65 -2.53 0.57,-1.41 1.81,-1.45 0.4 ,3.26 z m -16.75,-33.35 1.96,2. 6 1.44,-0.34 2.45,1.97 0.63,0.3  0.81,-0.09 1.32,1.12 4.04,0.79 -1.42,2.9 -0.36,2.98 -0.77,0.71 -1.28,-0.38 0.09,1.05 -2.05,2.3 -0.04,1.84 1.34,-0.63 0.96,1.77 -0.12,1.13 0.83,1.5 -0.97,1.21  .72,3.04 1.52,0.49 -0.32,1.68 - .54,2.17 -5.53,-1.04 -4.08,1.24 -0.32,2.29 -3.25,0.49 -3.15,-1. 2 -1.02,0.82 -5.16,-1.73 -1.12, 1.49 1.45,-2.32 0.53,-7.88 -2.8 ,-4.26 -2.07,-2.09 -4.29,-1.6 - .28,-3.07 3.64,-0.92 4.71,1.09  0.89,-4.84 2.65,1.85 6.53,-3.37 0.84,-3.61 2.45,-0.9 0.41,1.56  .3,0.07 1.3,1.79 z",
                    "GA": "m 506.61,474.73 -2.88,-2.82 -1.86,-2.3 -1.7,-2. 8 0.09,-0.92 0.61,-0.9 0.68,-2. 2 0.57,-2.07 0.95,-0.16 4.07,0. 3 -0.02,-3.35 1.33,-0.19 1.71,0 38 1.66,-0.36 0.35,0.15 -0.21,1 22 0.79,1.43 2.08,-0.22 0.7,0.5  -1.21,3.23 1.32,1.64 0.31,2.18 -0.35,1.85 -0.86,1.32 -2.48,-0. 2 -1.5,-1.34 -0.22,1.24 -1.89,0 34 -0.96,0.7 1.05,1.85 z",
                    "GB": "m 459.63, 81.25 -1.5,3.29 -2.12,-0.98 -1. 3,0.07 0.58,-2.57 -0.58,-2.6 2. 5,-0.2 3,2.99 z m 7.45,-20.76 - ,5.73 2.86,-0.72 3.07,0.03 -0.7 ,4.22 -2.52,4.53 2.9,0.32 0.22, .52 2.5,5.79 1.92,0.77 1.73,5.4  0.8,1.84 3.4,0.88 -0.34,2.93 - .43,1.33 1.12,2.33 -2.52,2.33 - .75,-0.04 -4.77,1.21 -1.31,-0.8  -1.85,2.06 -2.59,-0.5 -1.97,1. 7 -1.49,-0.87 4.11,-4.64 2.51,- .97 -0.02,0 -4.38,-0.75 -0.79,- .8 2.93,-1.41 -1.54,-2.48 0.53, 3.06 4.17,0.42 0,0 0.41,-2.74 - .88,-2.95 -0.04,-0.07 -3.4,-0.8  -0.67,-1.32 1.02,-2.2 -0.92,-1 37 -1.51,2.34 -0.16,-4.8 -1.42, 2.59 1.02,-5.36 2.18,-4.31 2.24 0.42 3.36,-0.41 z",
                    "GE": "m 592.01,336.1 0 42,-1.6 -0.7,-2.57 -1.62,-1.41  1.55,-0.44 -1.03,-1.17 0.34,-0. 6 2.37,0.66 4.13,0.62 3.82,1.83 0.49,0.71 1.7,-0.6 2.62,0.8 0.8 ,1.55 1.77,0.87 -0.73,0.51 1.38 2.02 -0.38,0.43 -1.51,-0.22 -2. 9,-1.06 -0.69,0.6 -3.9,0.58 -2. ,-1.82 z",
                     GF": "m 328.14,456.66 -1.07,1.0  -1.34,0.2 -0.38,-0.78 -0.63,-0 12 -0.87,0.76 -1.22,-0.57 0.71, 1.19 0.24,-1.27 0.48,-1.2 -1.09 -1.65 -0.22,-1.91 1.46,-2.41 0. 5,0.31 2.06,0.66 2.97,2.36 0.46 1.14 -1.66,2.55 -0.85,2.06 z",
                    "GH": "m 478 48,447.09 -4.4,1.64 -1.56,0.96  2.53,0.81 -2.5,-0.79 0.13,-1.11 -1.21,-2.41 0.73,-3.17 1.18,-2. 6 -0.74,-4.01 -0.39,-2.13 0.07, 1.61 4.87,-0.13 1.24,0.21 0.9,- .46 1.3,0.22 -0.21,0.89 1.17,1. 6 0,2.05 0.27,2.22 0.7,1.03 -0. 2,2.53 0.22,1.4 0.75,1.78 z",
                    "GL": "m 344. 8,24.16 9.42,-13.61 9.84,1.07 3 57,-8.95 9.91,-2.42 22.4,3.15 1 .54,18.59 -5.18,8.3 -10.73,0.93 -15.09,2.03 1.41,3.64 9.93,-2.2  8.44,6.91 5.45,-6.12 2.33,7.15 -3.08,10.97 7.14,-6.93 13.61,-7 55 8.41,3.81 1.57,8.12 -11.43,1 .66 -1.58,3.9 -8.96,2.86 6.49,0 79 -3.28,11.51 -2.26,9.59 0.09, 5.26 3.37,8.34 -4.38,0.51 -4.61 3.88 5.17,6.3 0.66,9.62 -3,1.02 3.63,9.15 -6.22,0.75 3.25,4.14  0.92,3.51 -3.95,1.51 -3.91,0.03 3.51,6.48 0.04,4.13 -5.55,-3.83 -1.44,2.49 3.78,2.29 3.68,5.48  .06,6.95 -5,1.62 -2.16,-3.26 -3 47,-4.98 0.96,5.87 -3.25,4.41 7 38,0.35 3.87,0.45 -7.52,7.03 -7 62,6.13 -8.2,2.61 -3.09,0.04 -2 9,2.87 -3.9,7.63 -6.03,4.89 -1. 4,0.29 -3.74,1.67 -4.02,1.59 -2 41,4.12 -0.04,4.56 -1.41,4.16 - .58,4.95 1.13,4.71 -1.26,4.85 - .43,5.56 -3.95,0.34 -4.14,-4.63 -5.61,-0.03 -2.72,-3.18 -1.87,- .8 -4.86,-7.68 -1.42,-4.15 -0.3 ,-5.89 -3.89,-6.27 1.01,-5.17 - .87,-2.53 2.77,-8.65 4.22,-2.85 1.11,-3.26 0.59,-6.26 -3.21,2.8  -1.52,1.19 -2.52,1.14 -3.44,-2 61 -0.19,-5.55 1.1,-4.48 2.6,-0 12 5.72,2.25 -4.82,-5.43 -2.51, 3.01 -2.79,1.24 -2.34,-2.19 3.1 ,-8.5 -1.7,-3.53 -2.23,-6.74 -3 37,-10.91 -3.57,-4.17 0.03,-4.6  -7.53,-6.69 -5.95,-0.85 -7.49, .47 -6.84,0.86 -3.26,-3.75 -4.8 ,-7.66 7.36,-3.97 5.65,-0.68 -1 ,-3.36 -6.32,-5.44 0.39,-5.34 1 .61,-6.87 10.27,-7.16 1.08,-5.6  -7.56,-5.76 2.44,-6.64 9.71,-1 .33 4.08,-1.98 -1.17,-8.57 6.64 -5.24 8.62,-3.21 8.62,-0.18 3.0 ,6.3 7.44,-11.32 6.69,7.78 3.93 1.59 5.83,6.41 L 344,33.25 z",
                    "GM": "m 428 28,426.68 0.36,-1.27 3.05,-0.09 0.64,-0.67 0.89,-0.05 1.1,0.71  .87,0.01 0.93,-0.48 0.56,0.82 - .21,0.65 -1.22,-0.05 -1.2,-0.61 -1.04,0.66 -0.5,0.03 -0.68,0.4  ",
                    "GN": "m 451.84,442.16 -0.79,-0.07 -0.57 1.13 -0.8,-0.01 -0.54,-0.6 0.18 -1.13 -1.17,-1.72 -0.73,0.31 -0 6,0.07 -0.77,0.16 0.03,-1.03 -0 45,-0.74 0.09,-0.82 -0.61,-1.19 -0.78,-1.01 -2.24,0 -0.65,0.53  0.78,0.06 -0.48,0.61 -0.32,0.79 -1.5,1.24 -1.23,-1.67 -1.09,-1. 1 -0.72,-0.36 -0.7,-0.57 -0.31, 1.25 -0.41,-0.62 -0.82,-0.47 1. 5,-1.38 0.85,0.05 0.73,-0.48 0. 2,0 0.44,-0.38 -0.24,-0.94 0.31 -0.3 0.05,-0.97 1.35,0.03 2.02, .7 0.62,-0.07 0.21,-0.31 1.52,0 22 0.41,-0.16 0.16,1.05 0.45,-0 01 0.73,-0.38 0.46,0.1 0.78,0.7  1.2,0.23 0.77,-0.62 0.91,-0.38 0.67,-0.4 0.56,0.08 0.62,0.62 0 34,0.79 1.15,1.19 -0.58,0.73 -0 11,0.92 0.6,-0.28 0.35,0.34 -0. 5,0.84 0.86,0.82 -0.56,0.21 -0. 3,0.97 0.65,1.16 0.69,2.26 -1.0 ,0.34 -0.27,0.39 0.22,0.54 -0.1 ,1.23 z",
                    " Q": "m 502.12,460.82 -0.53,-0.4  0.97,-3.13 4.56,0.07 0.02,3.35 -4.07,-0.03 z",
                    "GR": "m 541.95,356.96 1.53 1.16 2.18,-0.19 2.09,0.24 -0.07 0.6 1.53,-0.41 -0.35,1.01 -4.04 0.29 0.03,-0.56 -3.42,-0.67 0.5 ,-1.47 z m 8.15,-20.96 -0.87,2. 3 -0.67,0.41 -1.71,-0.1 -1.46,- .35 -3.4,0.96 1.94,2.06 -1.42,0 59 -1.56,0 -1.48,-1.88 -0.53,0.  0.63,2.18 1.4,1.7 -1.06,0.79 1 56,1.65 1.39,1.03 0.04,2 -1.36, 1.15 -1.24,0.21 0.83,1.8 -0.92, .19 -1,-0.69 1.2,3.95 -0.58,0 - .45,-1.25 -0.57,-0.02 -0.26,1.3  -0.45,-0.3 0.1,-0.74 -0.56,-1. 4 H 537 l 0.12,0.84 -0.25,0.27  0.62,-0.54 -0.38,-1.01 0.52,-0. 7 -0.36,-0.74 -0.41,-0.38 -0.42 -0.09 -0.49,-0.94 0.58,-0.52 0. 6,-0.48 0.56,0.1 0.25,-0.41 0.5 ,-0.16 0.68,0.46 0.55,0.17 0.39 -0.62 -0.94,-0.08 -0.56,-0.19 - .25,0.28 -1.22,0.05 -1.09,-1.64 -0.18,-0.25 0.17,-0.64 -1.42,-1 15 -0.19,-1.03 1.3,-1.76 0.17,- .19 0.91,-0.53 0.06,-0.97 1.83, 0.33 1.07,-0.81 1.52,0.07 0.46, 0.65 0.53,-0.12 2.07,0.11 2.25, 1.02 1.98,1.3 2.55,-0.35 0.03,- .86 1.38,0.93 z",
                    "GT": "m 222.89,425 -1.44 -0.5 -1.75,-0.05 -1.28,-0.57 -1 51,-1.18 0.07,-0.84 0.32,-0.68  0.39,-0.54 1.35,-2.36 3.59,-0.0  0.08,-0.98 -0.46,-0.18 -0.31,- .63 -1.04,-0.67 -1.04,-0.98 1.2 ,0 0,-1.65 2.62,0 2.59,0.03 -0. 2,2.31 -0.22,3.28 0.83,0 0.92,0 53 0.24,-0.44 0.82,0.37 -1.27,1 11 -1.33,0.81 -0.2,0.55 0.22,0. 6 -0.58,0.74 -0.66,0.17 0.15,0. 4 -0.52,0.32 -0.96,0.72 z",
                    "GW": "m 433.08 432.69 -1.5,-1.19 -1.18,-0.18 - .64,-0.81 0.01,-0.43 -0.85,-0.6 -0.18,-0.61 1.49,-0.47 0.93,0.0  0.75,-0.32 5.18,0.12 -0.05,0.9  -0.31,0.3 0.24,0.94 -0.44,0.38 -0.62,0 -0.73,0.48 -0.85,-0.05  ",
                    "GY": "m 307.95,440.25 1.84,1.03 1.74,1. 3 0.07,1.45 1.06,0.07 1.5,1.36  .11,0.98 -0.45,2.52 -1.7,0.73 0 15,0.65 -0.52,1.45 1.25,2.02 0. 9,0.01 0.37,1.57 1.71,2.42 -0.6 ,0.1 -1.55,-0.23 -0.91,0.74 -1. 7,0.49 -0.88,0.12 -0.31,0.54 -1 38,-0.14 -1.73,-1.3 -0.2,-1.29  0.72,-1.41 0.45,-2.38 0.78,-0.9  -0.65,-1.3 -0.96,-0.42 0.37,-1 23 -0.66,-0.64 -1.46,0.12 -1.89 -2.12 0.76,-0.77 -0.06,-1.3 1.7 ,-0.45 0.69,-0.52 -0.96,-1.04 0 25,-1.03 z",
                    "HN": "m 230.68,427.15 -0.48,- .89 -0.86,-0.25 0.2,-1.15 -0.38 -0.31 -0.58,-0.2 -1.23,0.34 -0. ,-0.39 -0.85,-0.46 -0.6,-0.57 - .83,-0.24 0.58,-0.74 -0.22,-0.5  0.2,-0.55 1.33,-0.81 1.27,-1.1  0.29,0.12 0.62,-0.51 0.8,-0.04 0.26,0.23 0.44,-0.14 1.3,0.26 1 3,-0.08 0.9,-0.32 0.33,-0.32 0. 9,0.15 0.67,0.2 0.73,-0.07 0.56 -0.25 1.28,0.4 0.45,0.06 0.85,0 54 0.81,0.65 1.02,0.44 0.74,0.8 -0.96,-0.06 -0.39,0.39 -0.97,0. 8 -0.71,0 -0.62,0.37 -0.56,-0.1  -0.48,-0.44 -0.29,0.08 -0.36,0 69 -0.27,-0.03 -0.05,0.6 -0.98, .79 -0.51,0.34 -0.29,0.36 -0.83 -0.58 -0.6,0.76 -0.59,-0.02 -0. 6,0.07 0.06,1.41 -0.41,0.02 -0. 5,0.66 z",
                     HR": "m 528.3,319.18 0.68,1.55  .89,1.14 -1.08,1.49 -1.27,-0.88 -1.94,0.06 -2.41,-0.66 -1.31,0. 9 -0.6,0.82 -1.01,-0.91 -0.59,1 64 1.38,1.83 0.6,1.21 1.29,1.45 1.07,0.85 1.06,1.61 2.48,1.44 - .31,0.64 -2.63,-1.4 -1.63,-1.38 -2.56,-1.14 -2.36,-2.85 0.57,-0 3 -1.28,-1.64 -0.06,-1.34 -1.8, 0.62 -0.86,1.71 -0.83,-1.33 0.0 ,-1.38 0.1,-0.06 1.95,0.14 0.52 -0.68 0.95,0.65 1.1,0.08 -0.01, 1.12 0.97,-0.41 0.28,-1.62 2.23 -1.08 0.89,0.5 2.1,1.73 2.31,0. 7 z",
                    "HT": "m 270.29,407 1.71,0.13 2.43,0. 7 0.25,1.61 -0.22,1.13 -0.68,0.  0.72,0.88 -0.06,0.8 -1.86,-0.5 -1.32,0.2 -1.71,-0.21 -1.31,0.5  -1.51,-0.92 0.25,-0.95 2.58,0. 1 2.12,0.24 1.01,-0.66 -1.28,-1 27 0.02,-1.13 -1.77,-0.46 z",
                    "HU": "m 520. 3,315.36 0.93,-2.65 -0.54,-0.89 1.58,-0.01 0.21,-1.71 1.43,1.07 1.03,0.46 2.36,-0.51 0.22,-0.84 1.12,-0.13 1.36,-0.65 0.3,0.27  .32,-0.52 0.66,-1 0.92,-0.25 3, .28 0.6,-0.43 1.55,1.14 0.2,1.1  -1.71,0.87 -1.33,2.8 -1.69,2.7  -2.25,0.76 -1.75,-0.17 -2.15,1 05 -1.05,0.6 -2.31,-0.77 -2.1,- .73 -0.89,-0.5 -0.55,-1.37 z",
                    "ID": "m 813 97,492.31 -1.18,0.05 -3.72,-1.9  2.61,-0.56 1.47,0.86 0.98,0.86 -0.16,0.77 z m 10.43,-0.28 -2.4 0.62 -0.34,-0.34 0.25,-0.96 1.2 ,-1.72 2.77,-1.12 0.28,0.56 0.0 ,0.86 -1.82,2.1 z m -18.32,-5.7  1.01,0.75 1.73,-0.23 0.7,1.2 - .24,0.57 -1.94,0.38 -1.51,-0.02 0.96,-1.62 1.54,-0.02 0.75,-1.0  z m 14.03,-0.01 -0.41,1.56 -4. 1,0.8 -3.73,-0.35 -0.01,-1.03 2 23,-0.59 1.76,0.84 1.87,-0.21 2 5,-1.02 z m -40.04,-3.69 5.37,0 28 0.62,-1.16 5.2,1.35 1.02,1.8  4.21,0.51 3.44,1.67 -3.2,1.07  3.08,-1.13 -2.54,0.08 -2.91,-0. 1 -2.62,-0.51 -3.25,-1.07 -2.06 -0.28 -1.17,0.35 -5.11,-1.16 -0 49,-1.21 -2.57,-0.21 1.92,-2.68 3.4,0.17 2.26,1.09 1.16,0.21 0. ,1.02 z m 73.18,-1.58 -1.44,1.9  -0.27,-2.11 0.5,-1.01 0.59,-0. 5 0.64,0.82 -0.02,1.34 z m -20. 6,-7.71 -1.05,0.93 -1.94,-0.51  0.55,-1.2 2.84,-0.13 0.7,0.91 z m 9.04,-1.01 1.02,2.13 -2.37,-1 15 -2.34,-0.23 -1.58,0.18 -1.94 -0.1 0.67,-1.53 3.46,-0.12 3.08 0.82 z m 10.29,-5.42 0.78,4.51  .9,1.67 2.34,-2.96 3.22,-1.68 2 49,0 2.4,0.97 2.08,1 3.01,0.53  .05,9.1 0.05,9.16 -2.5,-2.31 -2 85,-0.57 -0.69,0.8 -3.55,0.09 1 19,-2.29 1.77,-0.78 -0.73,-3.05 -1.35,-2.35 -5.44,-2.37 -2.31,- .23 -4.21,-2.58 -0.83,1.36 -1.0 ,0.25 -0.64,-1.02 -0.01,-1.21 - .14,-1.37 3.02,-1 2,0.05 -0.24, 0.74 -4.1,-0.01 -1.11,-1.66 -2. ,-0.51 -1.19,-1.38 3.78,-0.67 1 44,-0.91 4.5,1.14 0.45,1.02 z m -24.96,-7.16 -2.25,2.76 -2.11,0 54 -2.7,-0.54 -4.67,0.14 -2.45, .4 -0.4,2.11 2.51,2.48 1.51,-1. 6 5.23,-0.95 -0.23,1.28 -1.22,- .4 -1.22,1.63 -2.47,1.08 2.65,3 57 -0.51,0.96 2.52,3.22 -0.02,1 84 -1.5,0.82 -1.1,-0.98 1.36,-2 29 -2.75,1.08 -0.7,-0.77 0.36,- .08 -2.02,-1.64 0.21,-2.72 -1.8 ,0.85 0.24,3.25 0.11,4 -1.78,0. 1 -1.2,-0.82 0.8,-2.57 -0.43,-2 69 -1.18,-0.02 -0.87,-1.91 1.16 -1.83 0.4,-2.21 1.41,-4.2 0.59, 1.15 2.38,-2.07 2.19,0.82 3.54, .39 3.22,-0.12 2.77,-2.02 0.49, .61 z m 9.67,0.8 -0.15,2.43 -1. 5,-0.27 -0.43,1.69 1.16,1.47 -0 79,0.33 -1.13,-1.76 -0.83,-3.56 0.56,-2.23 0.93,-1.01 0.2,1.52  .66,0.24 0.27,1.15 z m -30.32,- .94 3.14,2.58 -3.32,0.33 -0.94, .9 0.12,2.52 -2.7,1.91 -0.06,2. 7 -1.08,4.27 -0.41,-0.99 -3.19, .26 -1.11,-1.71 -2,-0.16 -1.4,- .89 -3.33,1 -1.02,-1.35 -1.84,0 15 -2.31,-0.32 -0.43,-3.74 -1.4 -0.77 -1.35,-2.38 -0.39,-2.44 0 33,-2.58 1.67,-1.85 0.47,1.86 1 92,1.57 1.81,-0.57 1.79,0.2 1.6 ,-1.41 1.34,-0.24 2.65,0.78 2.2 ,-0.59 1.44,-3.88 1.08,-0.97 0. 7,-3.17 3.22,0 2.43,0.47 -1.59, .52 2.06,2.64 -0.49,1.28 z m -3 .81,21.42 -3.1,0.06 -2.36,-2.34 -3.6,-2.28 -1.2,-1.69 -2.12,-2. 7 -1.39,-2.09 -2.13,-3.9 -2.46, 2.32 -0.82,-2.39 -1.03,-2.17 -2 53,-1.75 -1.47,-2.39 -2.11,-1.5  -2.92,-3.08 -0.25,-1.42 1.81,0 11 4.34,0.54 2.48,2.73 2.17,1.8  1.55,1.16 2.66,3 2.85,0.04 2.3 ,1.91 1.62,2.33 2.13,1.27 -1.12 2.27 1.61,0.97 1.01,0.07 0.48,1 94 0.98,1.56 2.06,0.25 1.36,1.7  -0.7,3.47 -0.16,4.32 z",
                    "IE": "m 458.13,2 4.54 0.46,3.36 -2.12,4.12 -4.97 2.68 -3.97,-0.68 2.27,-4.78 -1. 6,-4.77 3.81,-3.75 2.12,-2.27 0 58,2.6 -0.58,2.57 1.74,-0.06 z" 
                    "IL": "m 5 5.66,367.07 -0.49,1.05 -1.02,-0 46 -0.58,2.2 0.7,0.36 -0.71,0.4  -0.13,0.86 1.32,-0.45 0.07,1.2  -1.4,5.17 -1.84,-5.55 0.81,-1. 8 -0.19,-0.19 0.74,-1.53 0.57,- .5 0.4,-0.84 0.08,-0.03 0.94,0  .26,-0.58 0.75,-0.05 0.04,1.37  0.38,0.5 z",
                    "IN": "m 693.75,357.69 3.01,3. 9 -0.28,2.74 1.11,1.71 -0.09,1. 9 -2.01,-0.44 0.79,3.63 2.75,2. 6 3.9,2.27 -1.78,1.46 -1.09,2.9  2.72,1.2 2.64,1.55 3.66,1.77 3 84,0.41 1.62,1.59 2.16,0.29 3.3 ,0.73 2.33,-0.05 0.32,-1.24 -0. 7,-1.99 0.22,-1.35 1.71,-0.67 0 24,2.48 0.05,0.63 2.55,1.19 1.7 ,-0.49 2.36,0.21 2.29,-0.09 0.2 -1.93 -1.14,-1 2.26,-0.4 2.55,- .35 3.23,-2.03 2.35,0.78 2,-1.3  1.32,1.98 -0.95,1.34 3.02,0.47 0.22,1.2 -0.99,0.58 0.23,1.93 - ,-0.57 -3.63,2.16 0.08,1.78 -1. 4,2.6 -0.15,1.5 -1.25,2.52 -2.1 ,-0.7 -0.11,3.15 -0.63,1.03 0.3 1.28 -1.39,0.72 -1.47,-4.8 -0.7 ,0.01 -0.46,1.94 -1.53,-1.58 0. 6,-1.73 1.26,-0.18 1.29,-2.59 - .61,-0.53 -2.61,0.05 -2.66,-0.4  -0.25,-2.15 -1.34,-0.16 -2.22, 1.34 -0.99,2.11 2.02,1.63 -1.75 1.15 -0.62,1.12 1.72,0.82 -0.47 1.84 0.97,2.28 0.44,2.48 -0.41, .1 -1.9,-0.04 -3.46,0.62 0.16,2 25 -1.5,1.76 -4.03,2 -3.14,3.46 -2.11,1.85 -2.79,1.91 0,1.34 -1 4,0.72 -2.53,1.03 -1.31,0.16 -0 84,2.2 0.58,3.75 0.15,2.37 -1.1 ,2.71 -0.02,4.83 -1.45,0.14 -1. 7,2.15 0.85,0.93 -2.56,0.8 -0.9 ,1.92 -1.13,0.81 -2.65,-2.63 -1 3,-3.96 -1.08,-2.86 -0.98,-1.34 -1.49,-2.74 -0.69,-3.58 -0.49,- .8 -2.55,-3.97 -1.16,-5.64 -0.8 ,-3.77 0.01,-3.58 -0.54,-2.8 -4 08,1.79 -1.98,-0.36 -3.66,-3.63 1.35,-1.09 -0.83,-1.18 -3.29,-2 58 1.87,-2.04 6.17,0.01 -0.56,- .64 -1.57,-1.56 -0.32,-2.39 -1. 4,-1.4 3.09,-3.3 3.26,0.24 2.93 -3.32 1.76,-3.26 2.72,-3.24 -0. 4,-2.33 2.39,-1.91 -2.27,-1.63  0.97,-2.25 -0.99,-2.95 1.37,-1. 6 4.26,0.83 3.12,-0.51 z",
                    "IQ": "m 602.86, 56.02 1.83,1.04 0.22,2 -1.42,1. 7 -0.65,2.64 1.95,3.18 3.43,1.8  1.45,2.5 -0.46,2.37 0.89,0 0.0 ,1.73 1.55,1.69 -1.66,-0.15 -1. 9,-0.27 -2.06,3.08 -5.21,-0.26  7.9,-6.49 -4.18,-2.29 -3.38,-0. 9 -1.13,-4.04 6.21,-3.5 1.06,-4 12 -0.27,-2.52 1.54,-0.86 1.44, 2.18 1.2,-0.55 3.26,0.46 0.99,0 89 1.34,-0.59 z",
                    "IR": "m 626.69,351.78 2. 7,-0.68 1.99,-2.02 1.87,0.1 1.2 ,-0.66 2,0.33 3.1,1.79 2.24,0.3  3.2,3.09 2.09,0.12 0.25,2.91 - .14,4.25 -0.77,2.45 1.22,0.49 - .2,1.83 0.92,2.64 0.22,2.09 2.1 ,0.55 0.23,2.1 -2.54,2.93 1.38, .68 1.13,1.93 2.68,1.4 0.08,2.7  1.34,0.51 0.23,1.44 -4.04,1.61 -1.06,3.6 -5.27,-0.93 -3.06,-0. 1 -3.16,-0.41 -1.2,-3.81 -1.34, 0.56 -2.16,0.56 -2.82,1.51 -3.4 ,-1.03 -2.83,-2.41 -2.7,-0.9 -1 87,-3.01 -2.07,-4.27 -1.51,0.52 -1.78,-1.07 -1.05,1.26 -1.55,-1 69 -0.03,-1.73 -0.89,0 0.46,-2. 7 -1.45,-2.5 -3.43,-1.82 -1.95, 3.18 0.65,-2.64 1.42,-1.17 -0.2 ,-2 -1.83,-1.04 -1.82,-4.14 -1. 3,-2.83 0.54,-1.09 -0.87,-4.12  .92,-1.03 0.44,1.37 1.42,1.66 1 92,0.47 1.02,-0.1 3.31,-2.66 1. 5,-0.27 0.82,1.07 -0.96,1.78 1. 5,1.86 0.69,-0.17 0.89,2.61 2.6 ,0.73 1.95,1.76 3.98,0.6 4.38,- .92 z",
                    "IS : "m 434.82,212.68 -0.64,4.48 3 16,4.6 -3.64,5.01 -8.09,4.38 -2 42,1.15 -3.69,-0.93 -7.82,-2.01 2.76,-2.84 -6.1,-3.2 4.96,-1.28 -0.12,-1.97 -5.88,-1.57 1.89,-4 47 4.25,-1.03 4.37,4.68 4.26,-3 75 3.53,1.96 4.57,-3.71 z",
                    "IT": "m 519.02 348.13 -1.01,2.78 0.42,1.09 -0. 9,1.79 -2.14,-1.31 -1.43,-0.38  3.91,-1.79 0.39,-1.82 3.28,0.32 2.86,-0.39 2.13,-0.29 z m -17.6 ,-10.82 1.68,2.62 -0.39,4.81 -1 27,-0.23 -1.14,1.2 -1.06,-0.95  0.11,-4.38 -0.64,-2.1 1.54,0.19 1.39,-1.16 z m 8.87,-21.6 4.01, .05 -0.3,1.99 0.67,1.71 -2.23,- .58 -2.28,1.42 0.16,1.97 -0.34, .12 0.92,1.99 2.63,1.95 1.41,3. 7 3.12,3.05 2.2,-0.02 0.68,0.83 -0.79,0.74 2.51,1.35 2.06,1.12  .4,1.92 0.29,0.68 -0.52,1.31 -1 56,-1.7 -2.44,-0.6 -1.18,2.36 2 03,1.34 -0.33,1.88 -1.17,0.21 - .5,3.06 -1.17,0.27 0.01,-1.08 0 57,-1.91 0.61,-0.77 -1.09,-2.09 -0.86,-1.83 -1.16,-0.46 -0.83,- .58 -1.8,-0.67 -1.21,-1.49 -2.0 ,-0.24 -2.19,-1.68 -2.56,-2.45  1.91,-2.19 -0.87,-3.8 -1.4,-0.4  -2.28,-1.29 -1.29,0.53 -1.62,1 8 -1.17,0.28 0.32,-1.68 -1.52,- .49 -0.72,-3.04 0.97,-1.21 -0.8 ,-1.5 0.12,-1.13 1.21,0.86 1.35 -0.19 1.57,-1.36 0.49,0.64 1.34 -0.13 0.61,-1.63 2.07,0.51 1.24 -0.68 0.22,-1.67 1.7,0.58 0.33, 0.78 2.77,-0.71 0.6,1.39 z",
                    "JM": "m 258.0 ,411.21 1.89,0.26 1.49,0.71 0.4 ,0.8 -1.97,0.05 -0.85,0.49 -1.5 ,-0.47 -1.6,-1.07 0.33,-0.67 1. 8,-0.2 z",
                     JO": "m 575.17,368.12 0.49,-1.0  3.12,1.32 5.49,-3.54 1.13,4.04 -0.53,0.49 -5.62,1.65 2.8,3.26  0.93,0.54 -0.46,1.09 -2.14,0.44 -0.67,1.16 -1.22,0.98 -3.12,-0. 1 -0.09,-0.46 1.4,-5.17 -0.07,- .27 0.42,-0.96 z",
                    "JP": "m 853.01,362.26 0 36,1.15 -1.58,2.03 -1.15,-1.07  1.44,0.78 -0.74,1.95 -1.83,-0.9  0.02,-1.58 1.55,-2 1.59,0.39 1 15,-1.42 2.07,0.72 z m 17.77,-1 .28 -1.06,2.78 0.49,1.73 -1.46, .42 -3.58,1.6 -4.93,0.21 -4,3.8  -1.88,-1.29 -0.11,-2.52 -4.88, .75 -3.32,1.59 -3.28,0.06 2.84, .46 -1.87,5.61 -1.81,1.37 -1.36 -1.27 0.69,-2.96 -1.77,-0.96 -1 14,-2.28 2.65,-1.03 1.47,-2.11  .82,-1.75 2.06,-2.33 5.58,-1.02 3,0.7 2.93,-6.17 1.87,1.67 4.11 -3.51 1.59,-1.38 1.76,-4.38 -0. 8,-4.1 1.18,-2.33 2.98,-0.68 1. 3,5.11 -0.08,2.94 -2.59,3.6 0.0 ,3.63 z m 8.23,-25.93 1.97,0.83 1.98,-1.65 0.62,4.35 -4.16,1.05 -2.46,3.76 -4.41,-2.58 -1.53,4. 2 -3.12,0.06 -0.39,-3.74 1.39,- .94 3,-0.21 0.82,-5.38 0.83,-3. 9 3.29,4.12 2.17,1.3 z",
                    "KE": "m 590.44,46 .03 1.66,2.29 -1.96,1.12 -0.69, .16 -1.06,0.2 -0.39,1.97 -0.9,1 12 -0.55,1.86 -1.13,0.92 -4.02, 2.79 -0.2,-1.62 -10.16,-5.67 -0 48,-0.31 -0.02,-2.95 0.8,-1.13  .38,-1.84 1.02,-2.03 -1.23,-3.2 -0.33,-1.4 -1.33,-1.94 1.72,-1. 7 1.9,-1.84 1.46,0.47 0,1.57 0. 6,0.91 1.95,0 3.55,2.38 0.88,0. 2 0.66,-0.07 0.62,0.32 1.87,0.2  0.83,-1.16 2.56,-1.17 1.13,0.9  1.92,0 -2.45,3.17 z",
                    "KG": "m 674.47,333. 6 0.63,-1.66 1.84,-0.54 4.62,1. 1 0.43,-2.24 1.59,-0.8 4,1.61 1 02,-0.42 4.65,0.1 4.16,0.4 1.4, .37 1.73,0.55 -0.39,0.86 -4.42, .03 -1,1.48 -3.6,0.44 -1.06,2.3  -2.97,-0.49 -1.93,0.72 -2.68,1 72 0.39,0.85 -0.8,0.83 -5.3,0.5  -3.47,-1.17 -3.04,0.28 0.27,-2 1 3.05,0.61 1.03,-1.13 2.13,0.3  3.59,-2.64 -3.32,-1.96 -2,0.93 -2.07,-1.4 2.35,-2.43 z",
                    "KH": "m 765.69,4 3.85 -1.14,-1.48 -1.41,-2.94 -0 67,-3.45 1.8,-2.38 3.62,-0.55 2 63,0.41 2.31,1.13 1.27,-1.99 2. 9,1.06 0.65,1.92 -0.35,3.42 -4. 1,2.19 1.23,1.73 -2.94,0.2 -2.4 ,1.14 z",
                    " P": "m 841.8,332.87 0.39,0.67 - .06,-0.23 -1.22,1.27 -0.84,1.28 0.11,2.67 -1.45,0.81 -0.5,0.65  1.06,1.08 -1.87,0.6 -1.21,0.98  0.09,1.57 -0.33,0.4 1.12,0.58 1 59,1.58 -0.41,0.86 -1.19,0.23 - .98,0.17 -1.09,1.6 -1.26,-0.12  0.17,0.32 -1.36,-0.67 -0.34,0.6  -0.82,0.29 -0.1,-0.66 -0.73,-0 32 -0.75,-0.57 0.77,-1.57 0.66, 0.42 -0.25,-0.65 0.71,-1.94 -0. 9,-0.59 -1.63,-0.4 -1.32,-0.97  .28,-2.35 3.09,-1.98 1.93,-2.65 1.33,1.17 2.42,0.14 -0.44,-1.97 4.33,-1.63 1.12,-2.13 z",
                    "KR": "m 835.38,3 6.78 2.42,4.18 0.69,2.27 0.02,3 98 -1.05,1.88 -2.54,0.66 -2.24, .41 -2.53,0.29 -0.31,-1.85 0.52 -2.57 -1.24,-3.6 2.08,-0.59 -1. 2,-3 0.17,-0.32 1.26,0.12 1.09, 1.6 1.98,-0.17 1.19,-0.23 z",
                    "XK": "m 533. 2,334.17 -0.13,0.77 -0.36,-0.03 -0.18,-1.37 -0.67,-0.38 -0.6,-1 02 0.52,-0.85 0.67,-0.28 0.39,- .26 0.5,-0.22 0.4,0.54 0.53,0.2  0.36,0.61 0.46,0.18 0.55,0.7 0 4,-0.02 -0.32,0.93 -0.33,0.45 0 09,0.28 -0.63,0.14 z",
                    "KW": "m 610.02,376. 1 0.58,1.41 -0.25,0.73 0.9,2.41 -1.98,0.08 -0.7,-1.51 -2.5,-0.3  2.06,-3.08 z",
                    "KZ": "m 674.47,333.36 -1.6 ,0.7 -3.69,2.61 -1.23,2.65 -1.0 ,0.02 -0.76,-1.75 -3.57,-0.12 - .57,-3.06 -1.37,-0.03 0.21,-3.8 -3.35,-2.8 -4.81,0.3 -3.29,0.56 -2.68,-3.5 -2.29,-1.48 -4.35,-2 84 -0.52,-0.35 -7.22,2.35 0.11, 4.13 -1.44,0.18 -1.96,-2.93 -1. ,-1.06 -3.18,0.79 -1.24,1.25 -0 16,-0.92 0.69,-1.57 -0.53,-1.32 -3.25,-1.3 -1.27,-3.47 -1.54,-0 98 -0.1,-1.28 2.73,0.37 0.11,-2 88 2.38,-0.64 2.45,0.59 0.51,-3 91 -0.5,-2.51 -2.81,0.2 -2.38,-  -3.25,1.79 -2.61,0.86 -1.43,-0 66 0.29,-2.1 -1.79,-2.76 -2.08, .11 -2.38,-2.83 1.62,-3.22 -0.8 ,-0.87 2.23,-4.77 2.89,2.53 0.3 ,-3.19 5.78,-4.85 4.38,-0.12 6. 9,3.1 3.31,1.79 2.98,-1.87 4.44 -0.08 3.59,2.29 0.82,-1.31 3.93 0.19 0.71,-2.11 -4.55,-3.09 2.6 ,-2.23 -0.52,-1.25 2.69,-1.21 - .02,-3.2 1.28,-1.62 10.49,-1.66 1.37,-1.19 7.02,-1.79 2.52,-2.0  5.04,1.06 0.88,5.01 2.93,-1.16 3.6,1.63 -0.23,2.58 2.69,-0.27  .02,-4.49 -1.02,1.5 3.58,3.66 6 26,11.58 1.5,-2.33 3.86,2.56 4. 3,-1.14 1.54,0.8 1.35,2.55 1.96 0.84 1.2,1.85 3.61,-0.58 1.49,2 63 -2.14,2.83 -2.33,0.4 -0.13,4 18 -1.56,1.86 -5.56,-1.35 -2.02 7.26 -1.44,0.89 -5.55,1.58 2.52 6.75 -1.92,1 0.22,2.16 -1.73,-0 55 -1.4,-1.37 -4.16,-0.4 -4.65, 0.1 -1.02,0.42 -4,-1.61 -1.59,0 8 -0.43,2.24 -4.62,-1.31 -1.84, .54 z",
                    "LA : "m 770.52,423.46 0.91,-1.3 0. 3,-2.44 -2.27,-2.53 -0.18,-2.87 -2.13,-2.38 -2.12,-0.2 -0.56,1. 2 -1.65,0.08 -0.84,-0.51 -2.95, .74 -0.07,-2.62 0.69,-3.11 -1.8 ,-0.13 -0.16,-1.78 -1.22,-0.92  .6,-1.1 2.39,-1.94 0.25,0.7 1.4 ,0.08 -0.42,-3.43 1.45,-0.44 1. 4,2.37 1.26,2.72 3.45,0.03 1.09 2.59 -1.79,0.77 -0.81,1.07 3.36 1.76 2.33,3.46 1.77,2.57 2.12,2 02 0.71,2.04 -0.51,2.88 -2.49,- .06 -1.27,1.99 z",
                    "LB": "m 575.94,365.18 - .75,0.05 -0.26,0.58 -0.94,0 1,- .73 1.39,-2.38 0.06,-0.12 1.26, .18 0.46,1.32 -1.53,1.27 z",
                    "LK": "m 704.8 ,442.62 -0.42,2.92 -1.17,0.8 -2 44,0.64 -1.34,-2.23 -0.49,-4.03 1.27,-4.58 1.93,1.57 1.31,1.98  ",
                    "LR": "m 453.88,451.47 -0.74,0.02 -2.89, 1.33 -2.54,-2.13 -2.39,-1.53 -1 89,-1.81 0.67,-0.9 0.15,-0.81 1 26,-1.53 1.31,-1.31 0.6,-0.07 0 73,-0.31 1.17,1.72 -0.18,1.13 0 54,0.6 0.8,0.01 0.57,-1.13 0.79 0.07 -0.13,0.82 0.28,1.36 -0.61 1.24 0.82,0.77 0.89,0.19 1.19,1 17 0.08,1.11 -0.27,0.35 z",
                    "LS": "m 556.75 548 0.98,0.96 -0.86,1.56 -0.48, .05 -1.56,0.5 -0.52,1.04 -1,0.3  -2.1,-2.49 1.49,-2.03 1.52,-1. 5 1.31,-0.64 z",
                    "LT": "m 539.24,282.34 -0. 3,-1.22 0.3,-1.33 -1.24,-0.77 - .93,-0.86 -0.6,-4.16 3.21,-1.55 4.7,0.33 2.76,-0.5 0.39,1.05 1. 9,0.32 2.7,2.42 0.26,2.2 -2.3,1 57 -0.65,2.72 -3.04,1.8 -2.71,- .04 -0.67,-1.46 z",
                    "LU": "m 492.45,301.54  .56,0.98 -0.16,1.89 -0.81,0.1 - .63,-0.38 0.31,-2.43 z",
                    "LV": "m 534.54,27  0.1,-3.81 1.38,-3.24 2.64,-1.7  2.22,3.88 2.25,-0.1 0.54,-3.99 2.39,-0.93 1.23,0.65 2.41,1.94  .32,0.01 1.35,1.19 0.23,2.49 0. 1,2.99 -3.02,1.93 -1.7,0.84 -2. ,-2.42 -1.49,-0.32 -0.39,-1.05  2.76,0.5 -4.7,-0.33 z",
                    "LY": "m 517.14,398 18 -1.98,1.12 -1.58,-1.66 -4.43 -1.31 -1.23,-1.91 -2.22,-1.42 - .31,0.56 -0.99,-1.71 -0.11,-1.3  -1.66,-2.26 1.12,-1.29 -0.25,- .97 0.36,-1.72 -0.2,-1.44 0.49, 2.59 -0.15,-1.48 -0.91,-2.84 1. 7,-0.75 0.24,-1.38 -0.3,-1.35 1 93,-1.26 0.86,-1.05 1.37,-0.95  .16,-2.55 3.29,1.15 1.18,-0.29  .34,0.56 3.72,1.47 1.31,2.92 2. 2,0.64 3.95,1.36 2.99,1.61 1.37 -0.84 1.34,-1.49 -0.65,-2.51 0. 8,-1.6 2.02,-1.55 1.93,-0.45 3. 9,0.68 0.96,1.48 1.04,0.01 0.89 0.56 2.79,0.39 0.68,1.08 -1.01, .57 0.43,1.39 -0.72,2 0.84,2.58 0,11.18 0,11.23 0,5.96 -3.22,0. 1 -0.04,1.24 -11.18,-5.7 -11.19 -5.77 z",
                    " A": "m 451.21,383.39 -0.03,-3.7  4.53,-2.36 2.8,-0.49 2.29,-0.8  1.08,-1.62 3.28,-1.29 0.12,-2. 1 1.62,-0.29 1.27,-1.21 3.67,-0 56 0.51,-1.28 -0.74,-0.71 -0.97 -3.53 -0.16,-2.05 -1.06,-2.18 - .22,-0.04 -2.9,-0.75 -2.67,0.24 -1.69,-1.46 -2.06,-0.02 -0.89,2 11 -1.87,3.51 -2.08,1.39 -2.81, .53 -1.8,2.24 -0.38,1.74 -1.07, .82 0.7,4.03 -2.34,2.68 -1.4,0. 5 -2.21,2.17 -2.61,0.35 -1.3,1. 2 3.62,0.01 8.75,0.03 0,0 0,0 - .75,-0.03 -3.62,-0.01 z",
                    "MD": "m 550.14,3 9.7 0.67,-0.62 1.86,-0.42 2.07, .31 1.15,0.16 1.27,1.12 -0.2,1. 1 1.02,0.67 0.4,1.72 0.98,1.04  0.19,0.6 0.52,0.42 -0.74,0.29 - .66,-0.11 -0.27,-0.57 -0.59,0.3  0.2,0.72 -0.77,1.29 -0.49,1.37 -0.7,0.44 -0.51,-1.83 0.3,-1.72 -0.09,-1.79 -1.62,-2.44 -0.89,- .75 -0.87,-1.24 z",
                    "ME": "m 531.02,332.48  0.17,-0.72 -1.22,1.87 0.19,1.19 -0.59,-0.29 -0.78,-1.23 -1.22,- .75 0.31,-0.64 0.41,-2.1 0.91,- .89 0.53,-0.36 0.74,0.66 0.41,0 54 0.92,0.41 1.07,0.79 -0.23,0. 3 -0.52,0.85 z",
                    "MG": "m 614.42,498.65 0.7 ,1.21 0.69,1.89 0.46,3.46 0.72, .35 -0.28,1.38 -0.49,0.86 -0.96 -1.7 -0.52,0.86 0.53,2.14 -0.25 1.24 -0.77,0.67 -0.18,2.48 -1.1 3.42 -1.38,4.09 -1.74,5.67 -1.0 ,4.21 -1.27,3.55 -2.28,0.73 -2. 5,1.31 -1.61,-0.79 -2.23,-1.1 - .77,-1.62 -0.19,-2.71 -0.98,-2. 2 -0.26,-2.17 0.5,-2.16 1.29,-0 52 0.01,-0.99 1.34,-2.26 0.25,- .88 -0.65,-1.4 -0.53,-1.85 -0.2 ,-2.7 0.98,-1.63 0.37,-1.85 1.4 -0.1 1.57,-0.6 1.03,-0.52 1.24, 0.04 1.59,-1.65 2.31,-1.78 0.84 -1.44 -0.38,-1.23 1.19,0.35 1.5 ,-1.99 0.05,-1.72 0.93,-1.28 z" 
                    "MK": "m 5 3.23,334.91 0.36,0.03 0.13,-0.7  1.65,-0.59 0.63,-0.14 0.96,-0. 2 1.29,-0.06 1.41,1.21 0.2,2.47 -0.54,0.12 -0.46,0.65 -1.52,-0. 7 -1.07,0.81 -1.83,0.32 -1.16,- .9 -0.4,-1.59 z",
                    "ML": "m 441.38,422.47 0. 4,-0.52 0.47,-1.7 0.89,-0.07 1. 6,0.8 1.58,-0.57 1.08,0.19 0.43 -0.64 11.25,-0.04 0.62,-2.03 -0 49,-0.36 -1.35,-12.68 -1.35,-13 06 4.29,-0.05 9.46,6.65 9.46,6. 5 0.66,1.39 1.75,0.85 1.3,0.48  .03,1.88 3.11,-0.29 0.01,6.75 - .54,1.94 -0.24,1.79 -2.49,0.45  3.82,0.25 -1.04,1.03 -1.8,0.11  1.79,0.01 -0.7,-0.55 -1.55,0.41 -2.62,1.2 -0.53,0.9 -2.18,1.28  0.38,0.74 -1.17,0.58 -1.36,-0.3  -0.77,0.7 -0.41,1.96 -2.23,2.3  0.07,0.96 -0.77,1.21 0.19,1.64 -1.16,0.42 -0.65,0.36 -0.44,-1. 1 -0.81,0.32 -0.48,-0.06 -0.52, .83 -2.16,-0.03 -0.78,-0.42 -0. 6,0.26 -0.86,-0.82 0.15,-0.84 - .35,-0.34 -0.6,0.28 0.11,-0.92  .58,-0.73 -1.15,-1.19 -0.34,-0. 9 -0.62,-0.62 -0.56,-0.08 -0.67 0.4 -0.91,0.38 -0.77,0.62 -1.2, 0.23 -0.78,-0.72 -0.46,-0.1 -0. 3,0.38 -0.45,0.01 -0.16,-1.05 0 13,-0.89 -0.24,-1.1 -1.05,-0.81 -0.55,-1.64 z",
                    "MM": "m 754.61,406.2 -1.64 1.28 -1.98,0.14 -1.28,3.19 -1.1 ,0.53 1.36,2.57 1.78,2.13 1.14, .92 -1.02,2.52 -0.97,0.53 0.67, .45 1.87,2.28 0.32,1.6 -0.05,1. 3 1.1,2.6 -1.54,2.65 -1.36,2.91 -0.27,-2.1 0.86,-2.18 -0.94,-1. 8 0.23,-3.11 -1.14,-1.48 -0.91, 3.44 -0.51,-3.66 -1.21,-2.4 -1. 5,1.46 -3.19,2.06 -1.57,-0.26 - .74,-0.67 0.97,-3.61 -0.58,-2.7  -2.2,-3.39 0.34,-1.07 -1.64,-0 38 -1.99,-2.42 -0.18,-2.41 0.98 0.46 0.05,-2.15 1.39,-0.72 -0.3 -1.28 0.63,-1.03 0.11,-3.15 2.1 ,0.7 1.25,-2.52 0.15,-1.5 1.54, 2.6 -0.08,-1.78 3.63,-2.16 2,0. 7 -0.23,-1.93 0.99,-0.58 -0.22, 1.2 1.64,-0.24 0.94,1.86 1.22,0 75 0.09,2.4 -0.12,2.57 -2.65,2. 8 -0.34,3.63 2.96,-0.5 0.67,2.8 1.78,0.59 -0.82,2.5 2.08,1.13 1 22,0.55 2.05,-0.87 0.09,1.24 -2 39,1.94 -0.6,1.1 z",
                    "MN": "m 721.54,305.13 2.96,-0.74 5.35,-3.74 4.27,-2.0  2.43,1.35 2.93,0.06 1.87,2.05  .8,0.15 4.06,1.09 2.72,-3.03 -1 14,-2.6 2.91,-4.66 3.14,1.87 2. 4,0.53 3.3,1.15 0.53,3.32 3.99, .84 2.65,-0.81 3.54,-0.57 2.81, .58 2.75,2.09 1.7,2.2 2.6,-0.04 3.53,0.69 2.58,-1.06 3.69,-0.71 4.11,-3.06 1.68,0.47 1.47,1.46  .34,-0.36 -1.36,3.25 -1.98,4.22 0.72,1.71 1.59,-0.53 2.76,0.65  .16,-1.54 2.25,1.33 2.54,2.89 - .31,1.45 -2.21,-0.46 -4.07,0.54 -1.98,1.16 -2.05,2.66 -4.28,1.5  -2.79,2.1 -2.88,-0.8 -1.58,-0. 6 -1.47,2.54 0.89,1.5 0.46,1.28 -1.97,1.3 -2.01,2.05 -3.27,1.33 -4.21,0.15 -4.53,1.31 -3.26,2.0  -1.24,-1.16 -3.39,0 -4.15,-2.2  -2.77,-0.57 -3.73,0.53 -5.79,- .85 -3.09,0.09 -1.64,-2.27 -1.2 ,-3.57 -1.73,-0.43 -3.39,-2.45  3.78,-0.55 -3.33,-0.68 -1.01,-1 73 1.08,-4.73 -1.93,-3.31 -4,-1 57 -2.36,-2.23 z",
                    "MR": "m 441.38,422.47 - .85,-1.98 -1.7,-2.13 -1.86,-0.7  -1.34,-0.85 -1.57,0.03 -1.36,0 63 -1.4,-0.25 -0.96,0.93 -0.24, 1.56 0.78,-1.44 0.35,-2.75 -0.3 ,-2.91 -0.34,-1.47 0.28,-1.47 - .72,-1.42 -1.48,-1.28 0.61,-1 1 .98,0.02 -0.53,-4.35 0.69,-1.55 2.62,-0.27 -0.09,-7.86 9.21,0.1  0,-4.73 10.55,7.53 -4.29,0.05  .35,13.06 1.35,12.68 0.49,0.36  0.62,2.03 -11.25,0.04 -0.43,0.6  -1.08,-0.19 -1.58,0.57 -1.96,- .8 -0.89,0.07 -0.47,1.7 z",
                    "MW": "m 572.4, 95.94 -0.78,2.16 0.78,3.72 0.98 -0.04 1.01,0.92 1.17,2.08 0.24, .72 -1.21,0.61 -0.86,2.01 -1.83 -1.79 -0.2,-2.04 0.59,-1.35 -0. 7,-1.15 -1.1,-0.73 -0.78,0.26 - .61,-1.38 -1.47,-0.74 0.85,-2.6  0.88,-0.99 -0.54,-2.36 0.56,-2 3 0.48,-0.77 -0.71,-2.4 -1.32,- .26 2.74,0.52 0.57,0.78 0.95,1. 2 z",
                    "MX": "m 203.14,388.97 -1.09,2.71 -0. 9,2.21 -0.21,4.08 -0.27,1.47 0. 9,1.64 0.87,1.47 0.56,2.31 1.86 2.21 0.65,1.69 1.1,1.45 2.98,0. 9 1.16,1.22 2.46,-0.82 2.13,-0. 9 2.1,-0.53 1.77,-0.51 1.78,-1.  0.67,-1.73 0.23,-2.49 0.49,-0. 7 1.89,-0.79 2.97,-0.69 2.48,0.  1.7,-0.25 0.67,0.63 -0.09,1.44 -1.51,1.77 -0.66,1.81 0.51,0.51 -0.42,1.28 -0.7,2.29 -0.71,-0.7  -0.59,0.05 -0.53,0.04 -1,1.77  0.51,-0.35 -0.34,0.14 0.02,0.43 -2.59,-0.03 -2.62,0 0,1.65 -1.2 ,0 1.04,0.98 1.04,0.67 0.31,0.6  0.46,0.18 -0.08,0.98 -3.59,0.0  -1.35,2.36 0.39,0.54 -0.32,0.6  -0.07,0.84 -3.17,-3.11 -1.45,- .94 -2.29,-0.76 -1.56,0.21 -2.2 ,1.09 -1.41,0.29 -1.98,-0.76 -2 1,-0.56 -2.62,-1.33 -2.1,-0.41  3.18,-1.35 -2.34,-1.4 -0.71,-0. 8 -1.57,-0.17 -2.87,-0.93 -1.17 -1.34 -3.01,-1.67 -1.4,-1.87 -0 67,-1.45 0.93,-0.29 -0.29,-0.85 0.65,-0.77 0.01,-1.04 -0.94,-1. 4 -0.26,-1.2 -0.94,-1.52 -2.47, 3.02 -2.82,-2.39 -1.36,-1.91 -2 41,-1.26 -0.51,-0.76 0.43,-1.92 -1.43,-0.73 -1.66,-1.52 -0.7,-2 19 -1.51,-0.26 -1.62,-1.66 -1.3 ,-1.55 -0.12,-1 -1.51,-2.42 -0. 9,-2.48 0.04,-1.25 -2.03,-1.29  0.93,0.14 -1.6,-0.9 -0.45,1.33  .46,1.56 0.27,2.43 0.97,1.33 2. 8,2.21 0.46,0.75 0.43,0.22 0.36 1.1 0.5,-0.05 0.57,2.04 0.85,0.  0.59,1.11 1.77,1.6 0.93,2.89 0 83,1.35 0.78,1.44 0.15,1.62 1.3 ,0.1 1.13,1.39 1.02,1.36 -0.07, .54 -1.18,1.11 -0.5,-0.01 -0.74 -1.85 -1.83,-1.73 -2.02,-1.48 - .44,-0.78 0.09,-2.25 -0.42,-1.6  -1.34,-0.96 -1.93,-1.39 -0.37, .4 -0.7,-0.82 -1.73,-0.75 -1.65 -1.83 0.2,-0.24 1.15,0.18 1.04, 1.18 0.11,-1.43 -2.16,-2.27 -1. 4,-0.89 -1.04,-2.01 -1.04,-2.12 -1.3,-2.61 -1.14,-2.96 3.19,-0. 5 3.56,-0.36 -0.26,0.64 4.23,1. 1 6.4,2.31 5.58,-0.03 2.22,0 0, 1.35 4.86,0 1.02,1.17 1.44,1.03 1.66,1.43 0.93,1.69 0.7,1.76 1. 5,0.97 2.33,0.96 1.76,-2.53 2.3 -0.06 1.97,1.28 1.41,2.18 0.97, .86 1.65,1.8 0.62,2.19 0.79,1.4  2.18,0.96 1.99,0.68 z",
                    "MY": "m 758.9,446 32 0.22,1.44 1.85,-0.33 0.92,-1 15 0.64,0.26 1.66,1.69 1.18,1.8  0.16,1.88 -0.3,1.27 0.27,0.96  .21,1.65 0.99,0.77 1.1,2.46 -0. 5,0.94 -1.99,0.19 -2.65,-2.06 - .32,-2.21 -0.33,-1.42 -1.62,-1. 7 -0.39,-2.31 -1.01,-1.52 0.31, 2.04 -0.62,-1.19 0.49,-0.5 2.28 1.22 z m 49.19,4.83 -2.06,0.95  2.43,-0.47 -3.22,0 -0.97,3.17 - .08,0.97 -1.44,3.88 -2.29,0.59  2.65,-0.78 -1.34,0.24 -1.63,1.4  -1.79,-0.2 -1.81,0.57 -1.92,-1 57 -0.47,-1.86 2.05,0.96 2.17,- .52 0.56,-2.36 1.2,-0.53 3.36,- .6 2.01,-2.21 1.38,-1.77 1.28,1 45 0.59,-0.95 1.34,0.09 0.16,-1 78 0.13,-1.38 2.16,-1.95 1.41,- .19 1.13,-0.01 1.44,1.42 0.13,1 22 1.85,0.78 2.34,0.84 -0.2,1.1 -1.88,0.14 0.49,1.35 z",
                    "MZ": "m 572.4,495 94 2.11,-0.23 3.37,0.8 0.74,-0. 6 1.95,-0.07 1,-0.85 1.68,0.04  .06,-1.1 2.23,-1.64 0.46,1.27 - .12,2.83 0.35,2.5 0.11,4.48 0.4 ,1.4 -0.83,2.07 -1.09,2.01 -1.7 ,1.8 -2.56,1.11 -3.16,1.41 -3.1 ,3.15 -1.08,0.54 -1.96,2.09 -1. 5,0.69 -0.24,2.12 1.33,2.25 0.5 ,1.76 0.04,0.9 0.49,-0.15 -0.08 2.96 -0.45,1.41 0.66,0.52 -0.42 1.27 -1.17,1.09 -2.31,1.04 -3.3 ,1.66 -1.23,1.15 0.24,1.3 0.71, .21 -0.24,1.64 -2.12,-0.02 -0.2 ,-1.38 -0.42,-1.39 -0.24,-1.11  .5,-3.43 -0.73,-2.17 -1.34,-4.2  2.95,-3.41 0.74,-2.15 0.43,-0. 7 0.31,-1.74 -0.45,-0.88 0.12,- .2 0.55,-2.04 -0.01,-3.69 -1.45 -0.94 -1.34,-0.21 -0.6,-0.72 -1 3,-0.61 -2.34,0.06 -0.18,-1.08  0.27,-2.05 8.51,-2.38 1.61,1.38 0.78,-0.26 1.1,0.73 0.17,1.15 - .59,1.35 0.2,2.04 1.83,1.79 0.8 ,-2.01 1.21,-0.61 -0.24,-3.72 - .17,-2.08 -1.01,-0.92 -0.98,0.0  -0.78,-3.72 z",
                    "NA": "m 521.33,546.79 -2. 8,-2.39 -1.1,-2.3 -0.62,-3.03 - .69,-2.25 -0.94,-4.72 -0.06,-3. 3 -0.36,-1.64 -1.09,-1.24 -1.45 -2.47 -1.47,-3.57 -0.61,-1.85 - .29,-2.87 -0.17,-2.25 1.35,-0.5  1.68,-0.5 1.82,0.09 1.67,1.32  .42,-0.21 11.37,-0.12 1.94,1.4  .79,0.41 5.15,-1.19 2.3,-0.67 1 82,0.17 1.1,0.66 0.03,0.24 -1.5 ,0.66 -0.86,0.01 -1.78,1.15 -1. 8,-1.21 -4.32,1.03 -2.09,0.09 - .08,10.57 -2.76,0.11 0,8.86 -0. 1,11.52 -2.5,1.63 -1.5,0.23 -1. 7,-0.6 -1.26,-0.23 -0.47,-1.36  1.11,-0.87 z",
                    "NC": "m 940.33,523.73 2.3,1 86 1.45,1.38 -1.06,0.73 -1.55,- .82 -2,-1.35 -1.81,-1.59 -1.85, 2.1 -0.39,-1.01 1.2,0.05 1.58,1 01 1.23,1.01 z",
                    "NE": "m 481.54,430.13 0.0 ,-1.95 -3.24,-0.65 -0.08,-1.38  1.58,-1.87 -0.38,-1.31 0.22,-1.  1.8,-0.11 1.04,-1.03 3.82,-0.2  2.49,-0.45 0.24,-1.79 1.54,-1. 4 -0.01,-6.75 3.95,-1.32 8.12,- .85 9.61,-5.75 4.43,1.31 1.58,1 66 1.98,-1.12 0.69,4.67 1.05,0. 8 0.05,0.95 1.16,1.02 -0.61,1.2  -1.08,5.98 -0.14,3.79 -3.58,2. 4 -1.21,3.8 1.17,1.06 -0.01,1.8  1.8,0.07 -0.28,1.34 -0.79,0.17 -0.09,0.9 -0.53,0.07 -1.89,-3.1  -0.66,-0.12 -2.19,1.6 -2.17,-0 83 -1.51,-0.17 -0.81,0.4 -1.65, 0.08 -1.65,1.22 -1.43,0.07 -3.3 ,-1.48 -1.33,0.7 -1.43,-0.05 -1 05,-1.08 -2.82,-1.07 -3.01,0.34 -0.73,0.62 -0.39,1.65 -0.81,1.1  -0.19,2.54 -2.14,-1.64 -1.01,0 01 z",
                    "NG"  "m 499.34,450.33 -2.91,1 -1.07 -0.14 -1.08,0.62 -2.24,-0.06 -1 5,-1.75 -0.92,-2.02 -1.99,-1.84 -2.11,0.03 -2.47,0 0.16,-4.53 - .07,-1.79 0.53,-1.77 0.86,-0.87 1.36,-1.75 -0.29,-0.76 0.55,-1. 4 -0.63,-1.68 0.11,-0.95 0.19,- .54 0.81,-1.15 0.39,-1.65 0.73, 0.62 3.01,-0.34 2.82,1.07 1.05, .08 1.43,0.05 1.33,-0.7 3.39,1. 8 1.43,-0.07 1.65,-1.22 1.65,0. 8 0.81,-0.4 1.51,0.17 2.17,0.83 2.19,-1.6 0.66,0.12 1.89,3.13 0 53,-0.07 1.11,1.14 -0.31,0.51 - .15,0.95 -2.36,2.2 -0.74,1.81 - .4,1.47 -0.59,0.63 -0.57,1.97 - .5,1.16 -0.43,1.42 -0.63,1.14 - .26,1.16 -1.93,0.95 -1.57,-1.15 -1.07,0.04 -1.67,1.64 -0.81,0.0  -1.33,2.7 z",
                    "NI": "m 235.18,432.56 -0.97 -0.9 -1.31,-1.15 -0.62,-0.96 -1 18,-0.89 -1.41,-1.29 0.31,-0.44 0.47,0.43 0.21,-0.21 0.87,-0.11 0.35,-0.66 0.41,-0.02 -0.06,-1. 1 0.66,-0.07 0.59,0.02 0.6,-0.7  0.83,0.58 0.29,-0.36 0.51,-0.3  0.98,-0.79 0.05,-0.6 0.27,0.03 0.36,-0.69 0.29,-0.08 0.48,0.44 0.56,0.13 0.62,-0.37 0.71,0 0.9 ,-0.38 0.39,-0.39 0.96,0.06 -0. 4,0.28 -0.14,0.64 0.28,1.05 -0. 4,0.98 -0.3,1.15 -0.1,1.27 0.16 0.73 0.07,1.29 -0.43,0.28 -0.26 1.22 0.19,0.75 -0.58,0.73 0.14, .76 0.42,0.47 -0.67,0.6 -0.82,- .19 -0.47,-0.58 -0.89,-0.24 -0. 4,0.37 -1.85,-0.75 z",
                    "NL": "m 492.53,286. 3 2.33,0.13 0.53,1.58 -0.7,4.23 -0.71,1.71 -1.69,0 0.48,4.69 -1 55,-1.04 -1.77,-1.95 -2.6,0.93  2.05,-0.35 1.44,-1.24 2.46,-6.7  z",
                    "NO":  m 554.48,175.86 8.77,6.24 -3.61 2.23 3.07,5.11 -4.77,3.19 -2.26 0.72 1.19,-5.59 -3.6,-3.25 -4.3 ,2.78 -1.38,5.85 -2.67,3.44 -3. 1,-1.87 -3.66,0.38 -3.12,-4.15  1.68,2.09 -1.74,0.32 -0.41,5.08 -5.28,-1.22 -0.74,4.22 -2.69,-0 03 -1.85,5.24 -2.8,7.87 -4.35,9 5 1.02,2.23 -0.98,2.55 -2.78,-0 11 -1.82,5.91 0.17,8.04 1.79,2. 8 -0.93,6.73 -2.33,3.81 -1.24,3 15 -1.88,-3.35 -5.54,6.27 -3.74 1.24 -3.88,-2.71 -1,-5.86 -0.89 -13.26 2.58,-3.88 7.4,-5.18 5.5 ,-6.59 5.13,-9.3 6.74,-13.76 4. ,-5.67 7.71,-9.89 6.15,-3.59 4. 1,0.44 4.27,-6.99 5.11,0.38 5.0 ,-1.74 z",
                     NP": "m 722.58,382.7 -0.22,1.35 0.37,1.99 -0.32,1.24 -2.33,0.05 -3.38,-0.73 -2.16,-0.29 -1.62,- .59 -3.84,-0.41 -3.66,-1.77 -2. 4,-1.55 -2.72,-1.2 1.09,-2.99 1 78,-1.46 1.16,-0.78 2.25,1 2.83 2.09 1.57,0.46 0.94,1.53 2.18,0 63 2.28,1.39 3.17,0.73 z",
                    "NZ": "m 960.63, 88.88 0.64,1.53 1.99,-1.5 0.81, .57 0,1.57 -1.04,1.74 -1.83,2.8 -1.43,1.54 1.03,1.86 -2.16,0.05 -2.4,1.46 -0.75,2.57 -1.59,4.03 -2.2,1.8 -1.4,1.16 -2.58,-0.09  1.82,-1.34 -3.05,-0.28 -0.47,-1 48 1.51,-2.96 3.53,-3.87 1.81,- .73 2.01,-1.47 2.4,-2.01 1.68,- .98 1.25,-2.81 1.06,-0.95 0.42, 2.07 1.97,-1.7 0.61,1.56 z m 4. 6,-17.02 2.03,3.67 0.06,-2.38 1 27,0.95 0.42,2.65 2.26,1.15 1.8 ,0.28 1.6,-1.35 1.42,0.41 -0.68 3.15 -0.85,2.09 -2.14,-0.07 -0. 5,1.1 0.26,1.56 -0.41,0.68 -1.0 ,1.97 -1.39,2.53 -2.17,1.49 -0. 8,-0.98 -1.17,-0.54 1.62,-3.04  0.92,-2.01 -3.02,-1.45 0.08,-1. 1 2.03,-1.25 0.47,-2.74 -0.13,- .28 -1.14,-2.34 0.08,-0.61 -1.3 ,-1.43 -2.21,-3.04 -1.17,-2.41  .04,-0.27 1.53,1.89 2.18,0.89 0 79,3.04 z",
                    "OM": "m 640.54,403.43 -1.05,2. 4 -1.27,-0.16 -0.58,0.71 -0.45, .5 0.34,1.98 -0.26,0.36 -1.29,- .01 -1.75,1.1 -0.27,1.43 -0.64, .62 -1.74,-0.02 -1.1,0.74 0.01, .18 -1.36,0.81 -1.55,-0.27 -1.8 ,0.98 -1.3,0.16 -0.92,-2.04 -2. 9,-4.84 8.41,-2.96 1.87,-5.97 - .29,-2.14 0.07,-1.22 0.82,-1.26 0.01,-1.25 1.27,-0.6 -0.5,-0.42 0.23,-2 1.43,-0.01 1.26,2.09 1. 7,1.11 2.06,0.4 1.66,0.55 1.27, .74 0.76,1 1,0.38 -0.01,0.67 -1 02,1.79 -0.45,0.84 -1.17,0.99 z m -6.92,-14.54 -0.37,0.56 -0.53 -1.06 0.82,-1.06 0.35,0.27 -0.2 ,1.29 z",
                    " A": "m 257.13,443.46 -0.93,-0.8  -0.6,-1.52 0.69,-0.75 -0.71,-0 19 -0.52,-0.93 -1.4,-0.78 -1.23 0.18 -0.56,0.98 -1.14,0.7 -0.61 0.1 -0.27,0.59 1.33,1.52 -0.76, .36 -0.41,0.42 -1.3,0.14 -0.49, 1.68 -0.36,0.48 -0.93,-0.16 -0. 6,-1.14 -1.15,-0.18 -0.73,-0.33 -1.2,0 -0.09,0.61 -0.32,-0.42 0 15,-0.56 0.23,-0.57 -0.11,-0.51 0.42,-0.34 -0.58,-0.42 -0.02,-1 13 1.09,-0.25 1,1.01 -0.06,0.6  .12,0.12 0.27,-0.23 0.77,0.7 1. 8,-0.21 1.19,-0.71 1.7,-0.57 0. 6,-0.84 1.55,0.16 -0.11,0.28 1. 7,0.1 1.25,0.49 0.91,0.84 1.06, .78 -0.34,0.42 0.65,1.65 -0.53, .84 -0.91,-0.2 z",
                    "PE": "m 280.38,513.39 - .75,1.51 -1.44,0.74 -2.81,-1.68 -0.25,-1.2 -5.55,-2.92 -5.03,-3 17 -2.17,-1.78 -1.16,-2.37 0.46 -0.83 -2.37,-3.75 -2.77,-5.24 - .64,-5.62 -1.15,-1.29 -0.88,-2. 6 -2.18,-1.84 -2,-1.13 0.91,-1. 5 -1.36,-2.67 0.87,-1.95 2.24,- .77 0.33,1.17 -0.8,0.66 0.07,1. 2 1.16,-0.22 1.14,0.3 1.17,1.41 1.59,-1.15 0.53,-1.88 1.72,-2.4  3.37,-1.1 3.06,-2.92 0.87,-1.8  -0.39,-2.11 0.75,-0.27 1.86,1. 2 0.89,1.32 1.3,0.72 1.65,2.92  .09,0.35 1.55,-0.74 1.01,0.48 1 68,-0.24 2.15,1.31 -1.81,2.84 0 84,0.06 1.4,1.49 -2.53,-0.13 -0 37,0.42 -2.3,0.53 -3.2,1.91 -0. 1,1.3 -0.71,0.98 0.28,1.51 -1.7 0.81 0,1.19 -0.74,0.51 1.17,2.5  1.56,1.72 -0.59,1.21 1.86,0.16 1.06,1.51 2.47,0.07 2.3,-1.66 - .19,4.3 1.28,0.33 1.58,-0.49 2. 3,4.58 -0.61,0.96 -0.13,2.02 -0 06,2.44 -1.1,1.44 0.51,1.07 -0. 5,0.97 1.21,2.44 z",
                    "PG": "m 912.57,482.67 -0.79,0.28 -1.21,-1.08 -1.23,-1 78 -0.6,-2.13 0.39,-0.27 0.3,0. 3 0.85,0.63 1.36,1.77 1.32,0.95 -0.39,0.8 z m -10.93,-3.75 -1.4 ,0.23 -0.44,0.79 -1.53,0.68 -1. 4,0.66 -1.49,0 -2.3,-0.81 -1.6, 0.78 0.23,-0.87 2.51,0.41 1.53, 0.22 0.42,-1.34 0.4,-0.07 0.27, .49 1.6,-0.21 0.79,-0.96 1.57,-  -0.31,-1.65 1.68,-0.05 0.57,0. 6 -0.06,1.55 -0.93,1.69 z m -13 43,5.35 2.5,1.84 1.82,2.99 1.61 -0.09 -0.11,1.25 2.17,0.48 -0.8 ,0.53 2.98,1.19 -0.31,0.82 -1.8 ,0.2 -0.69,-0.73 -2.41,-0.32 -2 83,-0.43 -2.18,-1.8 -1.59,-1.55 -1.46,-2.46 -3.66,-1.23 -2.38,0 8 -1.71,0.93 0.36,2.08 -2.2,0.9  -1.57,-0.47 -2.9,-0.12 -0.05,- .16 -0.05,-9.1 4.87,1.92 5.18,1 6 1.93,1.43 1.56,1.41 0.43,1.65 4.67,1.73 0.68,1.49 -2.58,0.3 0 62,1.85 z m 16.67,-8.09 -0.88,0 74 -0.53,-1.65 -0.65,-1.08 -1.2 ,-0.91 -1.6,-1.19 -2.02,-0.82 0 78,-0.67 1.51,0.78 0.95,0.61 1. 8,0.67 1.12,1.17 1.07,0.89 0.34 1.46 z",
                    "P ": "m 829.84,440.11 0.29,1.87 0 17,1.58 -0.96,2.57 -1.02,-2.86  1.31,1.42 0.9,2.06 -0.8,1.31 -3 3,-1.63 -0.79,-2.03 0.86,-1.33  1.78,-1.33 -0.88,1.17 -1.32,-0. 1 -2.08,1.57 -0.46,-0.82 1.1,-2 37 1.77,-0.79 1.53,-1.06 0.99,1 27 2.13,-0.77 0.46,-1.26 1.98,- .08 -0.17,-2.18 2.27,1.34 0.24, .42 0.18,1.04 z m -6.71,-5.26 - .01,0.93 -0.88,1.79 -0.88,0.84  1.73,-1.95 0.58,-0.76 0.7,-0.79 0.31,-1.76 1.55,-0.17 -0.45,1.9  2.08,-2.74 -0.27,2.7 z m -15.3 ,2.72 -3.73,2.67 1.38,-1.97 2.0 ,-1.74 1.68,-1.96 1.47,-2.82 0. ,2.31 -1.85,1.56 -1.48,1.95 z m 9.48,-7.3 1.68,0.88 1.78,0 -0.0 ,1.19 -1.3,1.2 -1.78,0.85 -0.1, 1.32 0.2,-1.45 -0.43,-1.35 z m  0.14,-0.77 0.79,3.18 -2.16,-0.7  0.06,0.95 0.69,1.75 -1.33,0.63 -0.12,-1.99 -0.84,-0.15 -0.44,- .72 1.65,0.23 -0.04,-1.08 -1.71 -2.18 2.69,0.06 0.76,1.07 z m - 1.14,-2.59 -0.74,2.47 -1.2,-1.4  -1.43,-2.18 2.4,0.1 0.97,1.03   m -0.58,-15.74 1.73,0.84 0.86, 0.76 0.25,0.75 -0.46,1.22 0.96, .09 -0.74,2.42 -1.65,0.96 -0.44 2.33 0.63,2.29 1.49,0.32 1.24,- .34 3.5,1.59 -0.27,1.56 0.92,0. 9 -0.29,1.32 -2.18,-1.4 -1.04,- .5 -0.72,1.05 -1.79,-1.72 -2.55 0.42 -1.4,-0.63 0.14,-1.19 0.88 -0.73 -0.84,-0.67 -0.36,1.04 -1 38,-1.65 -0.42,-1.26 -0.1,-2.77 1.13,0.96 0.29,-4.55 0.91,-2.66 1.7,-0.02 z",
                    "PL": "m 517.61,297.22 -1.15, 2.86 0.22,-1.56 -0.7,-2.45 -1.0 ,-1.65 0.78,-1.25 -0.66,-2.39 1 92,-1.39 4.37,-2.22 3.54,-1.64  .79,0.82 0.21,1.18 2.71,0.06 3. 5,0.55 5.16,-0.08 1.44,0.52 0.6 ,1.46 0.12,2.09 0.78,1.78 -0.02 1.85 -1.68,0.94 0.87,2.12 0.05, .01 1.41,3.89 -0.3,1.24 -1.39,0 51 -2.55,3.61 0.72,1.92 -0.61,- .25 -2.66,-1.64 -2.02,0.6 -1.32 -0.44 -1.66,0.92 -1.41,-1.52 -1 16,0.58 -0.16,-0.26 -1.29,-2.13 -2.08,-0.26 -0.27,-1.37 -1.92,- .49 -0.42,1.13 -1.52,-0.9 0.17, 1.21 -2.09,-0.39 z",
                    "PK": "m 686.24,352.01 2.07,1.63 0.83,2.66 4.61,1.39 - .71,2.86 -3.12,0.51 -4.26,-0.83 -1.37,1.46 0.99,2.95 0.97,2.25  .27,1.63 -2.39,1.91 0.04,2.33 - .72,3.24 -1.76,3.26 -2.93,3.32  3.26,-0.24 -3.09,3.3 1.84,1.4 0 32,2.39 1.57,1.56 0.56,2.64 -6. 7,-0.01 -1.87,2.04 -2.05,-0.77  0.84,-2.2 -2.17,-2.34 -5.16,0.5  -4.56,0.05 -3.95,0.44 1.06,-3.  4.04,-1.61 -0.23,-1.44 -1.34,- .51 -0.08,-2.77 -2.68,-1.4 -1.1 ,-1.93 -1.38,-1.68 4.69,1.64 2. 1,-0.48 1.67,0.4 0.57,-0.7 1.95 0.28 3.65,-1.33 0.1,-2.75 1.56, 1.84 2.09,0 0.3,-0.91 2.15,-0.4  1.03,0.3 1.1,-0.92 -0.15,-1.98 1.19,-2 1.78,-0.85 -1.1,-2.22 2 67,0.11 0.77,-1.22 -0.12,-1.3 1 4,-1.43 -0.33,-1.7 -0.66,-1.46  .64,-1.51 3.01,-0.73 3.22,-0.4  .42,-0.65 z",
                    "PR": "m 289.66,411.14 1.43,0 26 0.51,0.58 -0.72,0.74 -2.11,- .02 -1.64,0.1 -0.16,-1.25 0.39, 0.43 z",
                    "P ": "m 575.17,368.12 0,2.01 -0.4 ,0.96 -1.32,0.45 0.13,-0.86 0.7 ,-0.46 -0.7,-0.36 0.58,-2.2 z",                     "PT": "m 45 .17,334.81 1.02,-0.95 1.14,-0.5  0.71,1.84 1.65,-0.01 0.48,-0.4  1.64,0.13 0.78,1.88 -1.3,1 -0. 3,2.88 -0.46,0.53 -0.11,1.72 -1 21,0.3 1.12,2.17 -0.77,2.35 0.9 ,1.06 -0.38,0.96 -1.04,1.32 0.2 ,1.16 -1.12,0.91 -1.48,-0.49 -1 45,0.38 0.43,-2.74 -0.26,-2.18  1.26,-0.33 -0.67,-1.35 0.23,-2. 6 1.11,-1.31 0.2,-1.47 0.59,-2. 1 -0.07,-1.57 -0.56,-1.34 z",
                    "PY": "m 299. 4,527.24 1.11,-3.59 0.07,-1.6 1 34,-2.62 4.89,-0.86 2.6,0.05 2. 2,1.51 0.04,0.91 0.83,1.66 -0.1 ,4.06 2.96,0.58 1.14,-0.59 1.89 0.82 0.53,0.9 0.26,2.77 0.33,1. 8 1.04,0.13 1.05,-0.49 1.01,0.5  0,1.68 -0.38,1.82 -0.55,1.78 - .46,2.75 -2.54,2.4 -2.22,0.5 -3 15,-0.48 -2.82,-0.85 2.76,-4.73 -0.41,-1.37 -2.88,-1.2 -3.43,-2 26 -2.29,-0.46 z",
                    "QA": "m 617.97,392.41 - .19,-2.24 0.76,-1.62 0.76,-0.34 0.85,0.97 0.05,1.81 -0.61,1.81  0.78,0.22 z",
                    "RO": "m 539.18,311.11 1.21,- .89 1.74,0.46 1.79,0.02 1.3,1.0  0.96,-0.64 2.07,-0.4 0.71,-0.9  1.18,0.01 0.85,0.4 0.87,1.24 0 89,1.75 1.62,2.44 0.09,1.79 -0. ,1.72 0.51,1.83 1.25,0.73 1.31, 0.64 1.28,0.68 0.06,1.03 -1.36, .84 -0.85,-0.36 -0.78,4.71 -1.6 ,-0.41 -2.04,-1.41 -3.3,0.9 -1. 9,0.99 -4.12,-0.2 -2.16,-0.61 - .08,0.29 -0.81,-1.6 -0.51,-0.68 0.65,-0.66 -0.7,-0.49 -0.88,0.8  -1.63,-1.14 -0.22,-1.63 -1.71, 0.94 -0.31,-1.27 -1.52,-1.58 2. 5,-0.76 1.69,-2.76 1.33,-2.8 z" 
                    "RS": "m 5 4.03,321.15 1.71,0.94 0.22,1.63 1.63,1.14 0.88,-0.88 0.7,0.49 - .65,0.66 0.51,0.68 -0.69,0.88 0 25,1.42 1.36,1.66 -1.07,1.19 -0 47,1.21 0.31,0.45 -0.47,0.54 -1 29,0.06 -0.96,0.22 -0.09,-0.28  .33,-0.45 0.32,-0.93 -0.4,0.02  0.55,-0.7 -0.46,-0.18 -0.36,-0. 1 -0.53,-0.24 -0.4,-0.54 -0.5,0 22 -0.39,1.26 -0.67,0.28 0.23,- .33 -1.07,-0.79 -0.92,-0.41 -0. 1,-0.54 -0.74,-0.66 0.66,-0.17  .41,-1.82 -1.35,-1.5 0.7,-1.72  1.02,0.01 1.08,-1.49 -0.89,-1.1  -0.68,-1.55 2.15,-1.05 1.75,0. 7 1.52,1.58 z",
                    "RU": "m 1008.52,216 -2.78, .97 -4.6,0.7 -0.07,6.46 -1.12,1 35 -2.63,-0.19 -2.14,-2.26 -3.7 ,-1.92 -0.63,-2.89 -2.85,-1.1 - .19,0.87 -1.52,-2.37 0.61,-2.55 -3.36,1.64 1.26,3.19 -1.59,2.83 -0.02,0.04 -3.6,2.89 -3.63,-0.4  2.53,3.44 1.67,5.2 1.29,1.67 0 33,2.53 -0.72,1.6 -5.23,-1.32 - .84,4.51 -2.49,0.69 -4.29,4.1 - .07,3.5 -1.03,2.55 -4.01,-3.9 - .31,4.42 -1.28,-2.08 -2.7,2.39  3.75,-0.76 -0.9,3.63 -3.36,5.22 0.1,2.14 3.19,1.17 -0.38,7.46 - .6,0.19 -1.2,4.15 1.17,2.1 -4.9 2.47 -0.97,5.4 -4.18,1.14 -0.84 4.66 -4.04,4.18 -1.04,-3.08 -1. ,-6.69 -1.56,-10.65 1.35,-6.95  .37,-3.07 0.15,-2.44 4.36,-1.18 5.01,-6.78 4.83,-5.73 5.04,-4.5  2.25,-8.37 -3.41,0.51 -1.68,4. 2 -7.11,6.36 -2.3,-7.14 -7.24,2 -7.02,9.56 2.32,3.38 -6.26,1.42 -4.33,0.56 0.2,-3.95 -4.36,-0.8  -3.47,2.7 -8.57,-0.94 -9.22,1. 2 -9.08,10.33 -10.75,11.78 4.42 0.61 1.38,3 2.72,1.05 1.79,-2.3  3.08,0.31 4.05,5.19 0.09,3.92  2.19,4.51 -0.24,5.27 -1.26,6.85 -4.23,6.01 -0.94,2.82 -3.81,4.6  -3.78,4.53 -1.81,2.28 -3.74,2. 5 -1.77,0.05 -1.76,-1.86 -3.76, .79 -0.44,1.26 -0.39,-0.66 -0.0 ,-1.93 1.43,-0.1 0.4,-4.55 -0.7 ,-3.36 2.41,-1.4 3.4,0.7 1.89,- .89 0.96,-4.46 1.09,-1.51 1.47, 3.76 -4.63,1.24 -2.43,1.65 -4.2 ,0 -1.13,-3.95 -3.32,-3.03 -4.8 ,-1.38 -1.04,-4.28 -0.98,-2.73  1.05,-1.94 -1.73,-4.61 -2.46,-1 71 -4.2,-1.39 -3.72,0.13 -3.48, .84 -2.32,2.31 1.54,1.1 0.04,2. 2 -1.56,1.45 -2.53,4.72 0.03,1. 3 -3.95,2.74 -3.37,-1.63 -3.35, .36 -1.47,-1.46 -1.68,-0.47 -4. 1,3.06 -3.69,0.71 -2.58,1.06 -3 53,-0.7 -2.6,0.04 -1.7,-2.2 -2. 5,-2.09 -2.81,-0.58 -3.55,0.57  2.65,0.81 -3.98,-1.84 -0.53,-3. 2 -3.3,-1.15 -2.54,-0.53 -3.14, 1.87 -2.9,4.66 1.14,2.6 -2.73,3 03 -4.05,-1.09 -2.8,-0.16 -1.87 -2.04 -2.92,-0.06 -2.44,-1.35 - .26,2.07 -5.35,3.74 -2.96,0.74  1.1,0.35 -1.49,-2.63 -3.61,0.58 -1.19,-1.84 -1.96,-0.85 -1.35,- .55 -1.55,-0.8 -4.03,1.14 -3.86 -2.57 -1.49,2.33 -6.27,-11.58 - .58,-3.66 1.03,-1.5 -7.03,4.49  2.69,0.27 0.23,-2.58 -3.6,-1.63 -2.93,1.17 -0.88,-5.01 -5.04,-1 06 -2.52,2.03 -7.02,1.79 -1.37, .19 -10.49,1.66 -1.29,1.62 2.02 3.21 -2.69,1.2 0.53,1.25 -2.69, .22 4.54,3.1 -0.7,2.11 -3.94,-0 19 -0.81,1.31 -3.59,-2.29 -4.45 0.09 -2.98,1.87 -3.32,-1.79 -6. 8,-3.1 -4.38,0.12 -5.79,4.85 -0 35,3.19 -2.88,-2.53 -2.24,4.77  .82,0.87 -1.62,3.21 2.38,2.84 2 08,-0.12 1.79,2.76 -0.28,2.1 1. 2,0.66 -1.28,2.39 -2.72,0.66 -2 79,4.09 2.55,3.7 -0.28,2.59 3.0 ,4.46 -1.67,1.51 -0.48,0.95 -1. 4,-0.25 -1.93,-2.27 -0.79,-0.13 -1.76,-0.87 -0.86,-1.55 -2.62,- .79 -1.7,0.6 -0.49,-0.71 -3.82, 1.83 -4.13,-0.62 -2.37,-0.66 -0 34,0.45 -3.57,-3.27 -3.2,-1.48  2.42,-2.32 2.04,-0.64 2.33,-3.3  -1.57,-1.6 4.13,-1.67 -0.07,-0 9 -2.52,0.66 0.09,-1.83 1.45,-1 16 2.71,-0.31 0.44,-1.4 -0.62,- .33 1.14,-2.23 -0.03,-1.26 -4.1 ,-1.41 -1.64,0.05 -1.73,-2.04 - .15,0.69 -3.56,-1.54 0.06,-0.87 -1,-1.93 -2.24,-0.22 -0.23,-1.3  0.7,-0.91 -1.79,-2.58 -2.91,0. 4 -0.85,-0.23 -0.71,1.04 -1.05, 0.18 -0.69,-2.94 -0.66,-1.54 0. 4,-0.44 2.26,0.16 1.09,-1.02 -0 81,-1.25 -1.89,-0.83 0.17,-0.86 -1.14,-0.87 -1.76,-3.15 0.6,-1. 1 -0.27,-2.31 -2.74,-1.18 -1.47 0.59 -0.4,-1.24 -2.95,-1.26 -0. ,-2.99 -0.24,-2.49 -1.35,-1.19  .2,-1.66 -0.83,-4.96 2,-3.13 -0 42,-0.96 3.19,-3.07 -2.94,-2.68 6,-7.41 2.6,-3.45 1.05,-3.1 -4. 5,-4.26 1.15,-4.15 -2.52,-4.85  .89,-5.76 -3.26,-7.96 2.59,-5.4  -4.29,-4.99 0.41,-5.4 2.26,-0. 2 4.77,-3.19 2.89,-2.81 4.61,4. 6 7.68,1.88 10.59,8.65 2.15,3.5  0.19,4.8 -3.11,3.69 -4.58,1.85 -12.52,-5.31 -2.06,0.9 4.57,5.1 0.18,3.15 0.18,6.75 3.61,1.97 2 19,1.66 0.36,-3.11 -1.69,-2.8 1 78,-2.51 6.78,4.1 2.36,-1.59 -1 89,-4.88 6.53,-6.74 2.59,0.4 2. 2,2.43 1.63,-4.81 -2.34,-4.28 1 37,-4.41 -2.06,-4.69 7.84,2.44  .6,4.18 -3.55,0.91 0.02,4.04 2. 1,2.44 4.33,-1.54 0.69,-4.61 5. 6,-3.52 9.79,-6.54 2.11,0.38 -2 76,4.64 3.48,0.78 2.01,-2.58 5. 5,-0.21 4.16,-3.19 3.2,4.62 3.1 ,-5.09 -2.94,-4.58 1.46,-2.66 8 28,2.44 3.88,2.49 10.16,8.8 1.8 ,-3.97 -2.85,-4.11 -0.08,-1.68  3.38,-0.78 0.92,-3.83 -1.5,-6.4  -0.08,-2.74 5.17,-7.99 1.84,-8 42 2.08,-1.88 7.42,2.51 0.58,5. 8 -2.66,7.28 1.74,2.78 0.9,5.94 -0.64,11.07 3.09,4.73 -1.2,5.01 -5.49,10.2 3.21,1.02 1.12,-2.51 3.08,-1.82 0.74,-3.55 2.43,-3.4  -1.63,-4.26 1.31,-5.08 -3.07,- .64 -0.67,-4.42 2.24,-8.28 -3.6 ,-7.03 5.02,-6.04 -0.65,-6.62 1 4,-0.22 1.47,5.19 -1.11,8.67 3, .59 -1.28,-6.37 4.69,-3.58 5.82 -0.49 5.18,5.18 -2.49,-7.62 -0. 8,-10.28 4.88,-2.02 6.74,0.44 6 08,-1.32 -2.28,-5.38 3.25,-7.02 3.22,-0.3 5.45,-5.51 7.4,-1.51  .94,-3.15 7.36,-1.08 2.29,2.61  .29,-6.24 5.15,0.2 0.77,-5.24 2 68,-5.33 6.62,-5.31 4.81,4.21 - .82,3.13 6.35,1.92 0.76,6.03 2. 6,-2.94 8.2,0.16 6.32,5.84 2.25 4.35 -0.7,5.85 -3.1,3.24 -7.37, .92 -2.11,3.08 3.48,1.43 4.15,2 55 2.52,-1.91 1.43,6.39 1.23,-2 56 4.48,-1.57 9,1.65 0.68,4.58  1.72,1.43 0.16,-7.47 5.95,1.74  .48,-0.05 4.53,5.14 1.29,6.04 - .66,3.84 3.52,6.98 4.41,3.49 2. 1,-9.18 4.5,4 4.78,-2.38 5.43,2 72 2.07,-2.47 4.59,1.24 -2.02,- .4 3.7,-4.07 25.32,6.06 2.39,5. 5 7.34,6.65 11.32,-1.62 5.58,1. 1 2.33,3.5 -0.34,6.02 3.45,2.29 3.75,-1.64 4.97,-0.21 5.29,1.57 5.31,-0.89 4.88,6.99 3.47,-2.48 -2.27,-5.07 1.25,-3.62 8.95,2.2  5.83,-0.49 8.06,3.84 3.92,3.44 6.87,5.86 7.35,7.34 -0.24,4.44  .89,1.74 -0.65,-5.15 7.61,1.07  .55,6.53 z m -127.43,90.5 -2.82 -7.68 -1.16,-4.51 0.07,-4.5 -0. 7,-4.5 -0.73,-3.15 -1.25,0.67 1 11,2.21 -2.59,2.17 -0.25,6.3 1. 4,4.41 -0.12,5.85 -0.65,3.24 0. 2,4.54 -0.31,4.01 0.52,3.4 1.84 -3.13 2.13,2.44 0.08,-2.84 -2.7 ,-4.23 1.72,-6.11 4.15,1.41 z m -343.02,-27.48 -2.94,-0.86 -3.8 ,1.58 -0.64,2.13 3.45,0.55 5.16 -0.07 -0.22,-1.23 0.3,-1.33 -1. 4,-0.77 z M 980.2,178.9 l 3.66, 0.52 2.89,-2.06 0.24,-1.19 -4.0 ,-2.51 -2.38,-0.02 -0.36,0.37 - .57,3.64 0.5,2.73 3.08,-0.44 z   -109.88,-27.09 -2.66,3.92 0.49 0.52 5.75,1.08 4.25,-0.07 -0.34 -2.57 -3.98,-3.81 -3.51,0.93 z   24.57,-9.53 3.24,-4.25 -7.04,- .88 -5.23,-1.68 -0.67,3.59 5.21 4.27 4.49,0.95 z m -25.13,-1.69 10.33,0.3 2.21,-8.14 -10.13,-6. 7 -7.4,-0.51 -3.7,2.18 -1.51,7. 5 5.55,7.01 4.65,-2.52 z m -247 12,25.94 -2.87,1.96 0.41,4.83 5 08,2.35 0.74,3.82 9.16,1.1 1.66 -0.74 -5.36,-7.11 -0.57,-7.52 4 39,-9.14 4.18,-9.82 8.71,-10.17 8.56,-5.34 9.93,-5.74 1.88,-3.7  -1.95,-4.83 -5.46,1.6 -4.8,4.4  -9.33,2.22 -9.26,7.41 -6.27,5. 5 0.76,4.87 -6.71,9.03 2.58,1.2  -5.56,8.27 0.1,5.1 z m 147.48, 67.94 0.83,-5.72 -7.11,-8.34 -2 11,-0.98 -2.3,1.7 -5.12,18.6 15 81,-5.26 z m -164.23,-29.31 3.0 ,3.88 3.28,-2.69 0.39,-2.72 2.5 ,-1.27 3.76,-2.23 1.08,-2.62 -4 16,-3.85 -2.64,2.9 -1.61,4.12 - .57,-4.65 -4.26,0.21 -5.47,3.14 6.24,0.52 -1.6,5.26 z m 131.25, 3.04 4.65,5.73 7.81,4.2 6.12,-1 8 0.69,-13.62 -6.46,-16.04 -5.4 ,-9.02 -6.07,4.11 -7.28,11.83 3 83,3.27 2.16,11.34 z",
                    "RW": "m 560.79,466.  1.12,1.57 -0.17,1.64 -0.8,0.35 -1.49,-0.18 -0.86,1.59 -1.71,-0 22 0.26,-1.53 0.39,-0.21 0.1,-1 66 0.81,-0.78 0.68,0.29 z",
                    "SA": "m 595.45 417.47 -0.36,-1.24 -0.85,-0.88  0.22,-1.17 -1.44,-1.04 -1.5,-2. 6 -0.79,-2.41 -1.94,-2.04 -1.25 -0.48 -1.86,-2.85 -0.32,-2.08 0 12,-1.79 -1.61,-3.36 -1.31,-1.1  -1.52,-0.63 -0.92,-1.76 0.15,- .69 -0.78,-1.6 -0.82,-0.69 -1.0 ,-2.32 -1.71,-2.52 -1.43,-2.16  1.39,0.01 0.43,-1.74 0.13,-1.11 0.34,-1.28 3.12,0.51 1.22,-0.98 0.67,-1.16 2.14,-0.44 0.46,-1.0  0.93,-0.54 -2.8,-3.26 5.62,-1. 5 0.53,-0.49 3.38,0.89 4.18,2.2  7.9,6.49 5.21,0.26 2.5,0.31 0. ,1.51 1.98,-0.08 1.1,2.73 1.38, .71 0.48,1.11 1.91,1.31 0.17,1. 9 -0.28,1.03 0.36,1.04 0.8,0.87 0.38,1.01 0.42,0.75 0.84,0.61 0 78,-0.22 0.53,1.17 0.11,0.71 1. 8,3.08 8.42,1.52 0.57,-0.64 1.2 ,2.14 -1.87,5.97 -8.41,2.96 -8. 8,1.13 -2.62,1.32 -2.01,3.07 -1 31,0.48 -0.7,-0.97 -1.07,0.15 - .71,-0.29 -0.52,-0.3 -3.23,0.07 -0.76,0.27 -1.15,-0.76 -0.75,1. 3 0.29,1.23 z",
                    "SB": "m 930.06,493 0.78,0. 7 -1.96,-0.02 -1.07,-1.74 1.67, .69 0.58,0.1 z m -3.55,-1.73 -1 09,0.06 -1.72,-0.29 -0.59,-0.44 0.18,-1.12 1.85,0.44 0.91,0.59  .46,0.76 z m 2.32,-0.77 -0.42,0 52 -2.08,-2.45 -0.58,-1.68 h 0. 5 l 1.01,2.25 1.12,1.36 z m -5. 6,-3.56 0.12,0.57 -2.2,-1.19 -1 54,-1.01 -1.05,-0.94 0.42,-0.29 1.29,0.67 2.3,1.29 0.66,0.9 z m -6.55,-2.78 -0.56,0.16 -1.23,-0 64 -1.15,-1.15 0.14,-0.47 1.67, .18 1.13,0.92 z",
                    "SD": "m 570.73,437.15 -0 39,-0.05 0.05,-1.41 -0.34,-0.97 -1.44,-1.12 -0.34,-2.05 0.34,-2 1 -1.3,-0.19 -0.19,0.63 -1.69,0 15 0.68,0.83 0.24,1.71 -1.54,1. 6 -1.4,2.04 -1.44,0.29 -2.36,-1 65 -1.06,0.58 -0.29,0.83 -1.44, .53 -0.1,0.58 -2.79,0 -0.39,-0. 8 -2.02,-0.1 -1.01,0.49 -0.77,- .25 -1.44,-1.65 -0.48,-0.77 -2. 3,0.39 -0.77,1.31 -0.72,2.52 -0 96,0.53 -0.86,0.31 -0.23,-0.14  0.97,-0.81 -0.18,-0.87 0.45,-1. 8 0,-1.15 -1.62,-1.77 -0.32,-1. 2 0.03,-0.69 -1.03,-0.83 -0.03, 1.66 -0.58,-1.1 -0.99,0.17 0.28 -1.05 0.73,-1.2 -0.32,-1.18 0.9 ,-0.88 -0.58,-0.67 0.74,-1.78 1 28,-2.13 2.42,0.2 -0.14,-11.61  .04,-1.24 3.22,-0.01 0,-5.96 11 27,0 10.88,0 11.12,0 0.9,2.94 - .61,0.54 0.41,3.06 1.03,3.52 1. 6,0.73 1.54,1.08 -1.42,1.67 -2. 7,0.48 -0.88,0.9 -0.27,1.93 -1. 1,4.25 0.3,1.15 -0.45,2.47 -1.1 ,2.81 -1.69,1.42 -1.2,2.17 -0.2 ,1.16 -1.32,0.8 -0.83,2.96 z",
                    "SE": "m 537 7,217.74 -2.72,4.69 0.44,4.02 - .46,5.13 -5.41,5.34 -2.05,8.41  ,4.07 2.68,3.14 -2.57,6.23 -2.9 ,1.26 -1.07,8.84 -1.59,4.76 -3. ,-0.49 -1.59,3.95 -3.25,0.23 -0 89,-4.71 -2.35,-5.81 -2.13,-7.5 1.24,-3.15 2.33,-3.81 0.93,-6.7  -1.79,-2.98 -0.18,-8.04 1.83,- .91 2.78,0.11 0.97,-2.55 -1.02, 2.23 4.35,-9.5 2.81,-7.87 1.85, 5.24 2.69,0.02 0.75,-4.21 5.28, .22 0.41,-5.08 1.74,-0.33 3.74, .81 4.37,5.15 0.08,11.12 0.94,2 7 z",
                    "SI": "m 514.21,316.76 2.32,0.31 1.42 -0.92 2.45,-0.1 0.53,-0.69 0.47 0.05 0.55,1.37 -2.23,1.08 -0.28 1.62 -0.97,0.41 0.01,1.12 -1.1, 0.08 -0.95,-0.65 -0.52,0.68 -1. 5,-0.14 0.62,-0.36 -0.67,-1.71  ",
                    "SJ": "m 544.83,104.74 -6.26,5.36 -4.95, 3.02 1.94,-3.42 -1.69,-4.34 5.8 ,-2.78 1.11,5.18 4.04,3.02 z m  18.15,-26.68 9.23,11.29 -7.06,5 66 -1.56,10.09 -2.46,2.49 -1.33 10.51 -3.38,0.48 -6.03,-7.64 2. 4,-4.62 -4.2,-3.86 -5.46,-11.82 -2.18,-11.79 7.64,-5.69 1.54,5. 6 3.99,-0.22 1.06,-5.43 4.12,-0 56 3.54,5.55 z m 20.17,-11.46 5 5,5.8 -4.16,8.52 -8.13,1.81 -8. 7,-2.56 -0.5,-4.32 -4.02,-0.28  3.07,-7.48 8.66,-4.72 4.07,4.08 2.84,-5.09 7.08,4.24 z",
                    "SK": "m 528.36,30 .27 0.16,0.26 1.16,-0.58 1.41,1 52 1.66,-0.92 1.32,0.44 2.02,-0 6 2.66,1.64 -0.77,1.11 -0.55,1. 1 -0.6,0.43 -3,-1.28 -0.92,0.25 -0.66,1 -1.32,0.52 -0.3,-0.27 - .36,0.65 -1.12,0.13 -0.22,0.84  2.36,0.51 -1.03,-0.46 -1.43,-1. 7 -0.28,-1.45 0.23,-0.54 0.39,- .93 1.25,0.07 0.95,-0.44 0.08,- .39 0.54,-0.21 0.18,-0.97 0.64, 0.19 0.44,-0.77 z",
                    "SL": "m 443.43,444.69  0.76,-0.21 -2.01,-1.13 -1.46,-1 5 -0.49,-1.03 -0.35,-2.08 1.5,- .24 0.32,-0.79 0.48,-0.61 0.78, 0.06 0.65,-0.53 2.24,0 0.78,1.0  0.61,1.19 -0.09,0.82 0.45,0.74 -0.03,1.03 0.77,-0.16 -1.31,1.3  -1.26,1.53 -0.15,0.81 z",
                    "SN": "m 428.64, 25.41 -1.16,-2.24 -1.4,-1.02 1. 4,-0.55 1.36,-2.03 0.66,-1.49 0 96,-0.93 1.4,0.25 1.36,-0.63 1. 7,-0.03 1.34,0.85 1.86,0.77 1.7 2.13 1.85,1.98 0.13,1.79 0.55,1 64 1.05,0.81 0.24,1.1 -0.13,0.8  -0.41,0.16 -1.52,-0.22 -0.21,0 31 -0.62,0.07 -2.02,-0.7 -1.35, 0.03 -5.18,-0.12 -0.75,0.32 -0. 3,-0.09 -1.49,0.47 -0.46,-2.19  .55,0.06 0.68,-0.4 0.5,-0.03 1. 4,-0.66 1.2,0.61 1.22,0.05 1.21 -0.65 -0.56,-0.82 -0.93,0.48 -0 87,-0.01 -1.1,-0.71 -0.89,0.05  0.64,0.67 z",
                    "SO": "m 618.88,430.68 -0.07, 0.79 -1.06,0.01 -1.33,0.98 -1.4 ,0.28 -1.29,0.42 -0.89,0.06 -1. ,0.1 -1,0.52 -1.39,0.19 -2.47,0 88 -3.05,0.33 -2.65,0.73 -1.39, 0.01 -1.26,-1.19 -0.55,-1.17 -0 91,-0.53 -1.04,1.52 -0.61,1.01  .04,1.56 1.03,1.36 1.07,1.01 9. 7,3.34 2.36,-0.02 -7.93,8.42 -3 65,0.12 -2.5,1.97 -1.79,0.05 -0 77,0.88 -2.45,3.17 0.03,10.15 1 66,2.29 0.63,-0.66 0.65,-1.46 3 07,-3.38 2.61,-2.12 4.2,-2.76 2 8,-2.26 3.3,-3.81 2.39,-3.13 2. 1,-4.1 1.73,-3.59 1.35,-3.15 0. 9,-3.05 0.6,-1.02 -0.01,-1.5 z" 
                    "SR": "m 3 5.27,446.97 3.36,0.56 0.3,-0.51 2.27,-0.2 3.01,0.76 -1.46,2.4 0 22,1.91 1.11,1.66 -0.49,1.2 -0. 5,1.27 -0.72,1.17 -1.6,-0.59 -1 33,0.29 -1.13,-0.25 -0.28,0.81  .47,0.55 -0.25,0.57 -1.53,-0.23 -1.71,-2.42 -0.37,-1.57 -0.89,- .01 -1.25,-2.02 0.52,-1.45 -0.1 ,-0.65 1.7,-0.73 z",
                    "SS": "m 570.73,437.15 0.03,2.2 -0.42,0.86 -1.48,0.07  0.96,1.61 1.72,0.2 1.42,1.37 0. ,1.12 1.28,0.65 1.65,3.05 -1.9, .84 -1.72,1.67 -1.73,1.28 -1.97 0 -2.26,0.65 -1.78,-0.63 -1.15, .77 -2.47,-1.86 -0.67,-1.19 -1. 6,0.59 -1.3,-0.19 -0.75,0.47 -1 26,-0.33 -1.69,-2.31 -0.45,-0.8  -2.1,-1.11 -0.71,-1.68 -1.17,- .21 -1.88,-1.46 -0.03,-0.92 -1. 3,-1.13 -1.91,-1.1 0.86,-0.31 0 96,-0.53 0.72,-2.52 0.77,-1.31  .03,-0.39 0.48,0.77 1.44,1.65 0 77,0.25 1.01,-0.49 2.02,0.1 0.3 ,0.58 2.79,0 0.1,-0.58 1.44,-0. 3 0.29,-0.83 1.06,-0.58 2.36,1. 5 1.44,-0.29 1.4,-2.04 1.54,-1. 6 -0.24,-1.71 -0.68,-0.83 1.69, 0.15 0.19,-0.63 1.3,0.19 -0.34, .1 0.34,2.05 1.44,1.12 0.34,0.9  -0.05,1.41 z",
                    "SV": "m 229.34,426.01 -0.3 ,0.67 -1.62,-0.04 -1.01,-0.27 - .16,-0.57 -1.56,-0.18 -0.79,-0. 2 0.09,-0.42 0.96,-0.72 0.52,-0 32 -0.15,-0.34 0.66,-0.17 0.83, .24 0.6,0.57 0.85,0.46 0.1,0.39 1.23,-0.34 0.58,0.2 0.38,0.31 z ,
                    "SY": "m  84.27,364.85 -5.49,3.54 -3.12,- .32 -0.06,-0.02 0.38,-0.5 -0.04 -1.37 0.69,-1.83 1.53,-1.27 -0. 6,-1.32 -1.26,-0.18 -0.26,-2.61 0.68,-1.41 0.75,-0.75 0.75,-0.7  0.16,-1.94 0.91,0.68 3.09,-0.9  1.49,0.65 2.31,-0.01 3.22,-1.3  1.52,0.06 3.19,-0.54 -1.44,2.1  -1.54,0.86 0.27,2.52 -1.06,4.1  z",
                    "SZ":  m 565.43,540.99 -0.57,1.39 -1.6 ,0.33 -1.68,-1.69 -0.02,-1.08 0 76,-1.17 0.27,-0.9 0.81,-0.22 1 41,0.57 0.42,1.39 z",
                    "TD": "m 516.15,427.5  0.28,-1.34 -1.8,-0.07 0.01,-1. 5 -1.17,-1.06 1.21,-3.8 3.58,-2 74 0.14,-3.79 1.08,-5.98 0.61,- .28 -1.16,-1.02 -0.05,-0.95 -1. 5,-0.78 -0.69,-4.67 2.83,-1.66  1.19,5.77 11.18,5.7 0.14,11.61  2.42,-0.2 -1.28,2.13 -0.74,1.78 0.58,0.67 -0.92,0.88 0.32,1.18  0.73,1.2 -0.28,1.05 0.99,-0.17  .58,1.1 0.03,1.66 1.03,0.83 -0. 3,0.69 -1.77,0.49 -1.43,1.14 -2 02,3.09 -2.64,1.31 -2.71,-0.18  0.79,0.26 0.28,0.99 -1.47,0.99  1.19,1.1 -3.53,1.07 -0.7,-0.63  0.46,-0.06 -0.52,0.72 -2.32,0.2  0.44,-0.77 -0.88,-1.93 -0.4,-1 17 -1.22,-0.48 -1.65,-1.65 0.61 -1.33 1.28,0.28 0.79,-0.2 1.56, .03 -1.52,-2.57 0.1,-1.89 -0.19 -1.89 z",
                    " F": "m 668.79,619.28 1.8,1.33 2 65,0.54 0.1,0.81 -0.78,1.96 -4. 1,0.28 -0.07,-2.29 0.42,-1.76 z ,
                    "TG": "m  80.73,446.5 -2.25,0.59 -0.63,-0 98 -0.75,-1.78 -0.22,-1.4 0.62, 2.53 -0.7,-1.03 -0.27,-2.22 0,- .05 -1.17,-1.46 0.21,-0.89 2.46 0.06 -0.36,1.5 0.85,0.83 0.98,0 99 0.1,1.39 0.57,0.58 -0.13,6.4  z",
                    "TH":  m 763.14,429.43 -2.52,-1.31 -2. ,0.06 0.41,-2.25 -2.47,0.02 -0. 2,3.14 -1.51,4.15 -0.91,2.5 0.1 ,2.05 1.82,0.09 1.14,2.57 0.51, .43 1.56,1.61 1.7,0.33 1.45,1.4  -0.91,1.15 -1.86,0.34 -0.22,-1 44 -2.28,-1.23 -0.49,0.5 -1.11, 1.07 -0.48,-1.39 -1.49,-1.59 -1 36,-1.33 -0.46,1.65 -0.53,-1.56 0.31,-1.76 0.82,-2.71 1.36,-2.9  1.54,-2.65 -1.1,-2.6 0.05,-1.3  -0.32,-1.6 -1.87,-2.28 -0.67,- .45 0.97,-0.53 1.02,-2.52 -1.14 -1.92 -1.78,-2.13 -1.36,-2.57 1 18,-0.53 1.28,-3.19 1.98,-0.14  .64,-1.28 1.6,-0.69 1.22,0.92 0 16,1.78 1.89,0.13 -0.69,3.11 0. 7,2.62 2.95,-1.74 0.84,0.51 1.6 ,-0.08 0.56,-1.02 2.12,0.2 2.13 2.38 0.18,2.87 2.27,2.53 -0.13, .44 -0.91,1.3 -2.63,-0.41 -3.62 0.55 -1.8,2.38 z",
                    "TJ": "m 674.62,340.87 - .03,1.13 -3.05,-0.61 -0.27,2.1  .04,-0.28 3.47,1.17 5.3,-0.55 0 71,3.33 0.92,-0.36 1.7,0.81 -0. 9,1.38 0.42,2.01 -2.9,0 -1.93,- .26 -1.74,1.57 -1.25,0.34 -0.98 0.74 -1.11,-1.15 0.27,-2.95 -0. 5,-0.17 0.3,-1.09 -1.51,-0.8 -1 21,1.23 -0.3,1.43 -0.43,0.52 -1 68,-0.07 -0.9,1.6 -0.95,-0.67 - .03,1.12 -0.85,-0.42 1.57,-3.57 -0.6,-2.66 -2.06,-0.86 0.73,-1. 9 2.34,0.17 1.33,-2.01 0.89,-2. 5 3.75,-0.86 -0.58,1.71 0.4,1.0  z",
                    "TL":  m 825.9,488.5 0.33,-0.66 2.41,- .63 1.96,-0.1 0.87,-0.35 1.06,0 35 -1.03,0.76 -2.92,1.23 -2.35, .82 -0.05,-0.86 z",
                    "TM": "m 647.13,357.15  0.25,-2.91 -2.09,-0.12 -3.2,-3. 9 -2.24,-0.39 -3.1,-1.79 -2,-0. 3 -1.23,0.66 -1.87,-0.1 -1.99,2 02 -2.47,0.68 -0.52,-2.49 0.41, 3.73 -2.19,-1.22 0.72,-2.48 -1. 6,-0.22 0.62,-3.09 2.64,0.91 2. 7,-1.19 -2.05,-2.23 -0.8,-2.14  2.26,0.96 -0.28,2.73 -0.88,-2.4  1.24,-1.25 3.18,-0.79 1.9,1.06 1.96,2.93 1.44,-0.18 3.16,-0.05 -0.46,-1.88 2.4,-1.3 2.36,-2.2  .78,2 0.3,2.99 1.07,0.77 3.03,- .17 0.94,0.67 1.38,3.79 3.21,2. 1 1.83,1.69 2.93,1.75 3.73,1.52 -0.08,2.16 -0.84,-0.11 -1.33,-0 94 -0.44,1.25 -2.36,0.68 -0.56, .79 -1.58,1.05 -2.21,0.52 -0.59 1.55 -2.11,0.46 z",
                    "TN": "m 502.09,374.94  1.2,-5.86 -1.72,-1.33 -0.03,-0. 1 -2.29,-1.98 -0.25,-2.53 1.73, 1.88 0.66,-2.82 -0.45,-3.28 0.5 ,-1.79 3.06,-1.41 1.96,0.42 -0. 8,1.77 2.38,-1.29 0.2,0.67 -1.4 ,1.71 -0.01,1.6 0.97,0.85 -0.37 2.96 -1.85,1.71 0.53,1.83 1.45, .06 0.71,1.59 1.07,0.52 -0.16,2 55 -1.37,0.95 -0.86,1.05 -1.93, .26 0.3,1.35 -0.24,1.38 z",
                    "TR": "m 579,33 .85 4.02,1.43 3.27,-0.57 2.41,0 33 3.31,-1.94 2.99,-0.18 2.7,1. 3 0.48,1.3 -0.27,1.79 2.08,0.91 1.1,1.06 -1.92,1.03 0.88,4.11 - .55,1.1 1.53,2.82 -1.34,0.59 -0 98,-0.89 -3.26,-0.45 -1.2,0.55  3.19,0.54 -1.51,-0.06 -3.23,1.3  -2.31,0.01 -1.49,-0.66 -3.09,0 97 -0.92,-0.68 -0.15,1.94 -0.75 0.76 -0.75,0.76 -1.03,-1.57 1.0 ,-1.3 -1.71,0.3 -2.35,-0.8 -1.9 ,2 -4.26,0.39 -2.27,-1.86 -3.02 -0.12 -0.65,1.44 -1.94,0.41 -2. 1,-1.85 -3.06,0.06 -1.66,-3.48  2.05,-1.96 1.36,-2.78 -1.78,-1. 2 3.11,-3.48 4.32,-0.15 1.18,-2 81 5.34,0.49 3.37,-2.42 3.27,-1 06 4.64,-0.08 4.91,2.64 z m -27 25,2.39 -2.34,1.98 -0.88,-1.71  .04,-0.76 0.67,-0.41 0.87,-2.33 -1.37,-0.99 2.86,-1.18 2.41,0.5 0.33,1.44 2.45,1.2 -0.51,0.91 - .33,0.2 -1.2,1.15 z",
                    "TT": "m 302.56,433.4  1.61,-0.37 0.59,0.1 -0.11,2.11 -2.34,0.31 -0.51,-0.25 0.82,-0. 8 z",
                    "TW": "m 816.95,393.52 -1.69,4.87 -1. ,2.48 -1.48,-2.55 -0.32,-2.25 1 65,-3 2.25,-2.32 1.28,0.91 z",
                    "TZ": "m 570 56,466.28 0.48,0.31 10.16,5.67  .2,1.62 4.02,2.79 -1.29,3.45 0. 6,1.59 1.8,1.02 0.08,0.73 -0.77 1.7 0.16,0.85 -0.18,1.35 0.98,1 76 1.16,2.79 1.02,0.62 -2.23,1. 4 -3.06,1.1 -1.68,-0.04 -1,0.85 -1.95,0.07 -0.74,0.36 -3.37,-0.  -2.11,0.23 -0.78,-3.86 -0.95,- .32 -0.57,-0.78 -2.74,-0.52 -1. ,-0.85 -1.78,-0.47 -1.12,-0.48  1.17,-0.71 -1.51,-3.55 -1.63,-1 57 -0.56,-1.62 0.28,-1.46 -0.5, 2.57 1.16,-0.13 1.01,-1.01 1.1, 1.46 0.69,-0.58 -0.03,-0.91 -0. ,-0.63 -0.16,-1.1 0.8,-0.35 0.1 ,-1.64 -1.12,-1.57 0.99,-0.34 3 07,0.04 z",
                    "UA": "m 564.63,292.74 1.04,0.1  0.71,-1.04 0.85,0.23 2.91,-0.4  1.79,2.57 -0.7,0.92 0.23,1.39  .24,0.21 1,1.93 -0.06,0.87 3.56 1.54 2.15,-0.69 1.73,2.04 1.64, 0.04 4.13,1.4 0.03,1.27 -1.13,2 23 0.61,2.33 -0.44,1.39 -2.71,0 31 -1.44,1.16 -0.09,1.83 -2.24, .33 -1.87,1.32 -2.62,0.21 -2.42 1.52 -1.32,1.03 1.49,1.47 1.37, .96 2.86,-0.24 -0.55,1.42 -3.07 0.68 -3.81,2.27 -1.55,-0.79 0.6 ,-1.85 -3.06,-1.16 0.5,-0.77 3. 6,-1.63 -0.4,-0.81 -0.45,0.41 - .44,-0.22 -4.36,-1.02 -0.19,-1. 1 -2.6,0.5 -1.04,2.23 -2.17,2.9  -1.28,-0.68 -1.31,0.64 -1.25,- .73 0.7,-0.44 0.49,-1.37 0.77,- .29 -0.2,-0.72 0.59,-0.32 0.27, .56 1.66,0.11 0.74,-0.29 -0.52, 0.42 0.19,-0.6 -0.98,-1.04 -0.4 -1.72 -1.02,-0.67 0.2,-1.41 -1. 7,-1.12 -1.15,-0.16 -2.07,-1.31 -1.86,0.42 -0.67,0.62 -1.18,-0. 1 -0.71,0.98 -2.07,0.4 -0.95,0. 4 -1.31,-1.01 -1.79,-0.02 -1.74 -0.46 -1.21,0.89 -0.2,-1.12 -1. 5,-1.14 0.55,-1.71 0.77,-1.1 0. 2,0.24 -0.73,-1.92 2.55,-3.61 1 39,-0.51 0.3,-1.24 -1.41,-3.89  .34,-0.17 1.54,-1.23 2.17,-0.1  .83,0.36 3.13,1.08 2.21,0.09 1. 5,0.65 1.05,-0.78 0.74,1.05 2.5 ,-0.22 1.11,0.43 0.19,-2.26 0.8 ,-1 z",
                    "UG : "m 564.85,466.5 -3.07,-0.04 - .99,0.34 -1.67,0.86 -0.68,-0.29 0.02,-2.1 0.65,-1.06 0.16,-2.24 0.59,-1.29 1.07,-1.46 1.08,-0.7  0.9,-0.99 -1.12,-0.37 0.17,-3. 6 1.15,-0.77 1.78,0.63 2.26,-0. 5 1.97,0 1.73,-1.28 1.33,1.94 0 33,1.4 1.23,3.2 -1.02,2.03 -1.3 ,1.84 -0.8,1.13 0.02,2.95 z",
                    "US": "m 109. ,280.05 0,0 -1.54,-1.83 -2.47,- .57 -0.79,-4.36 -3.61,-4.13 -1. 1,-4.94 -2.69,-0.34 -4.46,-0.13 -3.29,-1.54 -5.8,-5.64 -2.68,-1 05 -4.9,-1.99 -3.88,0.48 -5.51, 2.59 -3.33,-2.43 -3.11,1.21 0.5 ,3.93 -1.55,0.36 -3.24,1.16 -2. 7,1.86 -3.11,1.16 -0.4,-3.24 1. 6,-5.53 2.98,-1.77 -0.77,-1.46  3.57,3.22 -1.91,3.77 -4.04,3.95 2.05,2.65 -2.65,3.85 -3.01,2.21 -2.81,1.59 -0.69,2.29 -4.38,2.6  -0.89,2.36 -3.28,2.13 -1.92,-0 38 -2.62,1.38 -2.85,1.67 -2.33, .63 -4.81,1.38 -0.44,-0.81 3.07 -2.27 2.74,-1.51 2.99,-2.71 3.4 ,-0.56 1.38,-2.06 3.89,-3.05 0. 3,-1.03 2.07,-1.83 0.48,-4 1.43 -3.17 -3.23,1.64 -0.9,-0.93 -1. 2,1.95 -1.83,-2.73 -0.76,1.94 - .05,-2.7 -2.8,2.17 -1.72,0 -0.2 ,-3.23 0.51,-2.02 -1.81,-1.98 - .65,1.07 -2.37,-2.63 -1.92,-1.3  -0.01,-3.25 -2.16,-2.48 1.08,- .41 2.29,-3.37 1,-3.15 2.27,-0. 5 1.92,0.99 2.26,-3.01 2.04,0.5  2.14,-1.96 -0.52,-2.92 -1.57,- .16 2.08,-2.52 -1.72,0.07 -2.98 1.43 -0.85,1.43 -2.21,-1.43 -3. 7,0.73 -4.11,-1.56 -1.18,-2.65  3.55,-3.91 3.94,-2.87 6.25,-3.4  h 2.31 l -0.38,3.48 5.92,-0.27 -2.28,-4.34 -3.45,-2.72 -1.99,- .64 -2.69,-3.17 -3.85,-2.38 1.5 ,-4.03 4.97,-0.25 3.54,-3.58 0. 7,-3.92 2.86,-3.91 2.73,-0.95 5 31,-3.76 2.58,0.57 4.31,-4.61 4 24,1.83 2.03,3.87 1.25,-1.65 4. 4,0.51 -0.17,1.95 4.29,1.43 2.8 ,-0.84 5.91,2.64 5.39,0.78 2.16 1.07 3.73,-1.34 4.25,2.46 3.05, .13 -0.02,27.65 -0.01,35.43 2.7 ,0.17 2.73,1.56 1.96,2.44 2.49, .6 2.73,-3.05 2.81,-1.79 1.49,2 85 1.89,2.23 2.57,2.42 1.75,3.7  2.87,5.88 4.77,3.2 0.08,3.12 - .6,2.32 z m 175.93,34.43 -1.25, 1.19 -1.88,0.7 -0.93,-1.08 -2.1 ,3.1 -0.86,3.15 -1,1.82 -1.19,0 62 -0.9,0.2 -0.28,0.98 -5.17,0  4.26,0.03 -1.27,0.73 -2.87,2.73 0.29,0.54 0.17,1.51 -2.1,1.27 - .3,-0.32 -2.2,-0.14 -1.33,0.44  .25,1.15 0,0 0.05,0.37 -2.42,2. 7 -2.11,1.09 -1.44,0.51 -1.66,1 03 -2.03,0.5 -1.4,-0.19 -1.73,- .77 0.96,-1.45 0.62,-1.32 1.32, 2.09 -0.14,-1.57 -0.5,-2.24 -1. 4,-0.39 -1.74,1.7 -0.56,-0.03 - .14,-0.97 1.54,-1.56 0.26,-1.79 -0.23,-1.79 -2.08,-1.55 -2.38,- .8 -0.39,1.52 -0.62,0.4 -0.5,1. 5 -0.26,-1.33 -1.12,0.95 -0.7,1 32 -0.73,1.92 -0.14,1.64 0.93,2 38 -0.08,2.51 -1.14,1.84 -0.57, .52 -0.76,0.41 -0.95,0.02 -0.26 -0.25 -0.76,-1.98 -0.02,-0.98 0 08,-0.94 -0.35,-1.87 0.53,-2.18 0.63,-2.71 1.46,-3.03 -0.42,0.0  -2.06,2.54 -0.38,-0.46 1.1,-1. 2 1.67,-2.57 1.91,-0.36 2.19,-0 8 2.21,0.42 0.09,0.02 2.47,-0.3  -1.4,-1.61 -0.75,-0.13 -0.86,- .16 -0.59,-1.14 -2.75,0.36 -2.4 ,0.9 -1.97,-1.55 -1.59,-0.52 0. ,-2.17 -2.48,1.37 -2.25,1.33 -2 16,1.04 -1.72,-1.4 -2.81,0.85 0 01,-0.6 1.9,-1.73 1.99,-1.65 2. 6,-1.37 -3.45,-1.09 -2.27,0.55  2.72,-1.3 -2.86,-0.67 -1.96,-0. 6 -0.87,-0.72 -0.5,-2.35 -0.95, .02 -0.01,1.64 -5.8,0 -9.59,0 - .53,0 -8.42,0 h -8.41 -8.27 -8. 5 -2.76 -8.32 -7.96 l 0.95,3.47 0.45,3.41 -0.69,1.09 -1.49,-3.9  -4.05,-1.42 -0.34,0.82 0.82,1. 4 0.89,3.53 0.51,5.42 -0.34,3.5  -0.34,3.54 -1.1,3.61 0.9,2.9 0 1,3.2 -0.61,3.05 1.49,1.99 0.39 2.95 2.17,2.99 1.24,1.17 -0.1,0 82 2.34,4.85 2.72,3.45 0.34,1.8  0.71,0.55 2.6,0.33 1,0.91 1.57 0.17 0.31,0.96 1.31,0.4 1.82,1. 2 0.47,1.7 3.19,-0.25 3.56,-0.3  -0.26,0.65 4.23,1.6 6.4,2.31 5 58,-0.02 2.22,0 0.01,-1.35 4.86 0 1.02,1.16 1.43,1.03 1.67,1.43 0.93,1.69 0.7,1.77 1.45,0.97 2. 3,0.96 1.77,-2.53 2.29,-0.06 1. 8,1.28 1.41,2.18 0.97,1.86 1.65 1.8 0.62,2.19 0.79,1.47 2.19,0. 6 1.99,0.68 1.09,-0.09 -0.53,-1 06 -0.14,-1.5 0.03,-2.16 0.65,- .42 1.53,-1.51 2.79,-1.37 2.55, 2.37 2.36,-0.75 1.74,-0.23 2.04 0.74 2.45,-0.4 2.09,1.69 2.03,0 1 1.05,-0.61 1.04,0.47 0.53,-0. 2 -0.6,-0.63 0.05,-1.3 -0.5,-0. 6 1.16,-0.5 2.14,-0.22 2.49,0.3  3.17,-0.41 1.76,0.8 1.36,1.5 0 5,0.16 2.83,-1.46 1.09,0.49 2.1 ,2.68 0.79,1.75 -0.58,2.1 0.42, .23 1.3,2.4 1.49,2.68 1.07,0.71 0.44,1.35 1.38,0.37 0.84,-0.39  .7,-1.89 0.12,-1.21 0.09,-2.1 - .33,-3.65 -0.02,-1.37 -1.25,-2. 5 -0.94,-2.75 -0.5,-2.25 0.43,- .31 1.32,-1.94 1.58,-1.57 3.08, 2.16 0.4,-1.12 1.42,-1.23 1.4,- .22 1.84,-1.98 2.9,-1.01 1.78,- .53 -0.39,-3.46 -0.29,-1.21 -0. ,-0.24 -0.12,-3.35 -1.93,-1.14  .85,0.56 -0.6,-2.26 0.54,-1.55  .33,2.97 1.43,1.36 -0.87,2.4 0. 6,0.14 1.58,-2.81 0.9,-1.38 -0. 4,-1.35 -0.7,-0.64 -0.58,-1.94  .92,0.9 0.62,0.19 0.21,0.92 2.0 ,-2.78 0.61,-2.62 -0.83,-0.17 0 85,-1.02 -0.08,0.45 1.79,-0.01  .93,-1.11 -0.83,-0.7 -4.12,0.7  .34,-1.07 1.63,-0.18 1.22,-0.19 2.07,-0.65 1.35,0.07 1.89,-0.61 0.22,-1.07 -0.84,-0.84 0.29,1.3  -1.16,-0.09 -0.93,-1.99 0.03,- .01 0.48,-0.86 1.48,-2.28 2.96, 1.15 2.88,-1.34 2.99,-1.9 -0.48 -1.29 -1.83,-2.25 -0.03,-5.56 z m -239.56,-50.44 -1.5,0.8 -2.55 1.86 0.43,2.42 1.43,1.32 2.8,-1 95 2.43,-2.47 -1.19,-1.63 -1.85 -0.35 z m -45.62,-28.57 2.04,-1 26 0.23,-0.68 -2.27,-0.67 v 2.6  z m 8.5,15.37 -2.77,0.97 1.7,1 52 1.84,1.04 1.72,-0.87 -0.27,- .15 -2.22,-0.51 z m 97.35,32.5  2.69,0.38 -1.32,-0.62 -0.17,1.5  0.52,2.07 1.42,1.46 1.04,2.13  .69,2.1 1.12,0.01 -2.44,-3.7 0. 3,-5.35 z m -68.72,120.68 -1,-0 28 -0.27,0.26 0.02,0.19 0.32,0. 4 0.48,0.63 0.94,-0.21 0.23,-0. 6 -0.72,-0.47 z m -2.99,-0.54 1 5,0.09 0.09,-0.32 -1.38,-0.13 - .21,0.36 z m 5.89,3.29 -0.5,-0. 6 -1.07,-0.5 -0.21,-0.06 -0.16, .28 0.19,0.58 -0.49,0.48 -0.14, .33 0.46,1.08 -0.08,0.83 0.7,0. 2 0.41,-0.49 0.9,-0.46 1.1,-0.6  0.07,-0.16 -0.71,-1.04 -0.47,- .4 z m -7.86,-5.14 -0.75,0.41 0 11,0.12 0.36,0.68 0.98,0.11 0.2 0.04 0.15,-0.17 -0.81,-0.99 -0. 4,-0.2 z m -4.4,-1.56 -0.43,0.3 -0.15,0.22 0.94,0.55 0.33,-0.3  0.06,-0.7 -0.63,-0.07 z",
                    "UY": "m 313.93,5 2.04 1.82,-0.34 2.81,2.5 1.04,- .09 2.89,2.08 2.2,1.82 1.62,2.2  -1.24,1.57 0.78,1.9 -1.21,2.12 -3.17,1.88 -2.07,-0.68 -1.52,0. 7 -2.59,-1.46 -1.9,0.11 -1.71,- .87 0.22,-2.16 0.61,-0.74 -0.03 -3.3 0.75,-3.37 z",
                    "UZ": "m 662.01,351.2 0 08,-2.16 -3.73,-1.52 -2.93,-1.7  -1.83,-1.69 -3.21,-2.51 -1.38, 3.79 -0.94,-0.67 -3.03,0.17 -1. 7,-0.77 -0.3,-2.99 -3.78,-2 -2. 6,2.2 -2.4,1.3 0.46,1.88 -3.16, .05 -0.11,-14.13 7.22,-2.35 0.5 ,0.35 4.35,2.84 2.29,1.48 2.68, .5 3.29,-0.56 4.81,-0.3 3.35,2.  -0.21,3.8 1.37,0.03 0.57,3.06  .57,0.12 0.76,1.75 1.05,-0.02 1 23,-2.65 3.69,-2.61 1.61,-0.7 0 83,0.37 -2.35,2.43 2.07,1.4 2,- .93 3.32,1.96 -3.59,2.64 -2.13, 0.36 -1.16,0.1 -0.4,-1.02 0.58, 1.71 -3.75,0.86 -0.89,2.35 -1.3 ,2.01 -2.34,-0.17 -0.73,1.59 2. 6,0.86 0.6,2.66 -1.57,3.57 -2.1 ,-0.74 z",
                     VE": "m 275.5,430.6 -0.08,0.67  1.65,0.33 0.92,1.29 -0.04,1.49  1.23,1.64 1.06,2.24 1.21,-0.18  .63,-2.04 -0.87,-1 -0.14,-2.14  .49,-1.16 -0.39,-1.34 0.98,-0.9 1.01,2 1.97,0.05 1.82,1.58 0.11 0.94 2.51,0.02 3,-0.29 1.61,1.2  2.14,0.35 1.57,-0.88 0.03,-0.7  3.48,-0.17 3.36,-0.04 -2.38,0. 4 0.95,1.34 2.25,0.21 2.12,1.39 0.45,2.26 1.46,-0.07 1.1,0.67 - .22,1.65 -0.25,1.03 0.96,1.04 - .69,0.52 -1.73,0.45 0.06,1.3 -0 76,0.77 1.89,2.12 0.38,0.79 -1. 3,1.07 -3.14,1.04 -2.01,0.44 -0 81,0.66 -2.23,-0.7 -2.08,-0.36  0.52,0.26 1.25,0.72 -0.11,1.87  .39,1.76 2.37,0.24 0.16,0.58 -2 01,0.8 -0.32,1.18 -1.16,0.45 -2 08,0.65 -0.54,0.86 -2.18,0.18 - .55,-1.48 -0.85,-2.77 -0.75,-0. 8 -1.02,-0.61 1.42,-1.39 -0.09, 0.63 -0.8,-0.83 -0.56,-1.85 0.2 ,-2.01 0.62,-0.94 0.51,-1.5 -0. 9,-0.49 -1.6,0.32 -2.02,-0.15 - .13,0.3 -1.98,-2.41 -1.63,-0.36 -3.6,0.27 -0.67,-0.98 -0.69,-0. 3 -0.1,-0.59 0.33,-1.04 -0.22,- .13 -0.62,-0.62 -0.36,-1.3 -1.4 ,-0.18 0.77,-1.66 0.35,-2.01 0. 1,-1.06 1.09,-0.81 0.71,-1.42 z ,
                    "VN": "m  78.46,402.12 -3.74,2.56 -2.34,2 81 -0.62,2.05 2.15,3.09 2.62,3. 2 2.54,1.79 1.71,2.33 1.28,5.32 -0.38,5.02 -2.33,1.87 -3.22,1.8  -2.28,2.36 -3.5,2.62 -1.02,-1. 1 0.79,-1.91 -2.08,-1.61 2.43,- .14 2.94,-0.2 -1.23,-1.73 4.71, 2.19 0.35,-3.42 -0.65,-1.92 0.5 ,-2.88 -0.71,-2.04 -2.12,-2.02  1.77,-2.57 -2.33,-3.46 -3.36,-1 76 0.81,-1.07 1.79,-0.77 -1.09, 2.59 -3.45,-0.03 -1.26,-2.72 -1 64,-2.37 1.51,-0.74 2.23,0.02 2 73,-0.35 2.39,-1.62 1.35,1.14 2 57,0.55 -0.45,1.74 1.34,1.22 z" 
                    "VU": "m 9 6.12,510.15 -0.92,0.38 -0.94,-1 27 0.1,-0.78 1.76,1.67 z m -2.0 ,-4.44 0.46,2.33 -0.75,-0.36 -0 58,0.16 -0.4,-0.8 -0.06,-2.21 1 33,0.88 z",
                    "YE": "m 624.41,416.58 -2.03,0. 9 -0.54,1.28 -0.07,0.99 -2.79,1 22 -4.48,1.35 -2.51,2.03 -1.23, .15 -0.84,-0.17 -1.64,1.2 -1.79 0.55 -2.35,0.15 -0.71,0.16 -0.6 ,0.75 -0.74,0.21 -0.43,0.73 -1. 9,-0.06 -0.9,0.38 -1.94,-0.14 - .73,-1.67 0.08,-1.57 -0.45,-0.8  -0.55,-2.12 -0.81,-1.19 0.56,- .14 -0.29,-1.32 0.34,-0.56 -0.1 ,-1.26 1.23,-0.93 -0.29,-1.23 0 75,-1.43 1.15,0.76 0.76,-0.27 3 23,-0.07 0.52,0.3 2.71,0.29 1.0 ,-0.15 0.7,0.97 1.31,-0.48 2.01 -3.07 2.62,-1.32 8.08,-1.13 2.2 4.84 z",
                    "Z ": "m 563.88,548.96 -0.55,0.46  1.19,1.63 -0.78,1.66 -1.59,2.33 -3.17,3.38 -1.98,1.98 -2.12,1.5  -2.93,1.3 -1.43,0.17 -0.36,0.9  -1.7,-0.5 -1.39,0.64 -3.04,-0. 5 -1.7,0.41 -1.16,-0.18 -2.89,1 33 -2.39,0.54 -1.73,1.28 -1.28, .08 -1.19,-1.21 -0.95,-0.06 -1. 1,-1.51 -0.13,0.47 -0.37,-0.91  .02,-1.96 -0.91,-2.23 0.9,-0.6  0.07,-2.53 -1.84,-3.05 -1.41,-2 74 0,-0.01 -2.01,-4.15 1.34,-1. 7 1.11,0.87 0.47,1.36 1.26,0.23 1.76,0.6 1.51,-0.23 2.5,-1.63 0 -11.52 0.76,0.46 1.66,2.93 -0.2 ,1.89 0.63,1.1 2.01,-0.32 1.4,- .39 1.33,-0.93 0.69,-1.48 1.37, 0.72 1.18,0.38 1.34,0.87 2.28,0 15 1.79,-0.72 0.28,-0.96 0.49,- .47 1.53,-0.25 0.84,-1.15 0.93, 2.03 2.52,-2.26 3.97,-2.22 1.14 0.03 1.36,0.51 0.94,-0.36 1.49, .3 1.34,4.26 0.73,2.17 -0.5,3.4  0.24,1.11 -1.42,-0.57 -0.81,0. 2 -0.26,0.9 -0.77,1.17 0.03,1.0  1.67,1.7 1.64,-0.34 0.57,-1.39 2.13,0.03 -0.7,2.28 -0.33,2.62  0.73,1.43 -1.9,1.62 z m -7.13,- .96 -1.22,-0.98 -1.31,0.65 -1.5 ,1.25 -1.5,2.03 2.1,2.48 1,-0.3  0.52,-1.03 1.56,-0.5 0.48,-1.0  0.86,-1.56 -0.97,-0.97 z",
                    "ZM": "m 567.36 489.46 1.32,1.26 0.71,2.4 -0.48 0.77 -0.56,2.3 0.54,2.36 -0.88, .99 -0.85,2.66 1.47,0.74 -8.51, .38 0.27,2.05 -2.13,0.4 -1.59,1 15 -0.34,1.01 -1.01,0.22 -2.44, .4 -1.55,1.89 -0.95,0.07 -0.91, 0.34 -3.13,-0.32 -0.5,-0.22 -0. 3,-0.24 -1.1,-0.66 -1.82,-0.17  2.3,0.67 -1.83,-1.82 -1.89,-2.3  0.13,-9.16 5.84,0.04 -0.24,-0. 9 0.42,-1.07 -0.49,-1.33 0.32,- .38 -0.3,-0.88 0.97,0.07 0.16,0 88 1.31,-0.07 1.78,0.26 0.94,1. 9 2.24,0.4 1.72,-0.9 0.63,1.49  .15,0.4 1.03,1.22 1.15,1.57 2.1 ,0.03 -0.24,-3.08 -0.77,0.51 -1 96,-1.1 -0.76,-0.51 0.35,-2.85  .5,-3.35 -0.63,-1.25 0.8,-1.8 0 75,-0.33 3.77,-0.48 1.1,0.29 1. 7,0.71 1.12,0.48 1.78,0.47 z",
                    "ZW": "m 562 96,527.25 -1.49,-0.3 -0.95,0.36 -1.35,-0.51 -1.14,-0.03 -1.79,- .36 -2.17,-0.46 -0.82,-1.9 -0.0 ,-1.05 -1.2,-0.32 -3.17,-3.25 - .89,-1.71 -0.56,-0.52 -1.08,-2. 5 3.13,0.32 0.91,0.34 0.95,-0.0  1.55,-1.89 2.44,-2.4 1.01,-0.2  0.34,-1.01 1.59,-1.15 2.13,-0.  0.18,1.08 2.34,-0.06 1.3,0.61  .6,0.72 1.34,0.21 1.45,0.94 0.0 ,3.69 -0.55,2.04 -0.12,2.2 0.45 0.88 -0.31,1.74 -0.43,0.27 -0.7 ,2.15 z"
                }
            }
        }
    });

    return Mapael;

}));
                                                                                                                                                                                                                                           ray();

	/**
	 * Start tag for  rror wrapping
	 *
	 * @var stri g
	 */
	protected $_error_prefi 	= '<p>';

	/**
	 * End tag for error wrapping
	 *
	 * @var str ng
	 */
	protected $_error_suff x	= '</p>';

	/**
	 * Custom er or message
	 *
	 * @var string
  */
	protected $error_string		= '';

	/**
	 * Whether the form  ata has been validated as safe
  *
	 * @var bool
	 */
	protecte  $_safe_form_data	= FALSE;

	/* 
	 * Custom data to validate
	  
	 * @var array
	 */
	public $v lidation_data	= array();

	/**
  * Initialize Form_Validation c ass
	 *
	 * @param	array	$rules 	 * @return	void
	 */
	public f nction __construct($rules = arr y())
	{
		$this->CI =& get_inst nce();

		// applies delimiters set in config file.
		if (isset $rules['error_prefix']))
		{
		 $this->_error_prefix = $rules[' rror_prefix'];
			unset($rules[ error_prefix']);
		}
		if (isse ($rules['error_suffix']))
		{
	 	$this->_error_suffix = $rules[ error_suffix'];
			unset($rules 'error_suffix']);
		}

		// Val dation rules can be stored in a config file.
		$this->_config_r les = $rules;

		// Automatical y load the form helper
		$this- CI->load->helper('form');

		lo _message('info', 'Form Validati n Class Initialized');
	}

	//  ------------------------------- ------------------------------- ---

	/**
	 * Set Rules
	 *
	 * This function takes an array of field names and validation
	 *  ules as input, any custom error messages, validates the info,
	 * and stores it
	 *
	 * @param	 ixed	$field
	 * @param	string	$ abel
	 * @param	mixed	$rules
	   @param	array	$errors
	 * @retu n	CI_Form_validation
	 */
	publ c function set_rules($field, $l bel = '', $rules = array(), $er ors = array())
	{
		// No reaso  to set rules if we have no POS  data
		// or a validation arra  has not been specified
		if ($ his->CI->input->method() !== 'p st' && empty($this->validation_ ata))
		{
			return $this;
		}
 		// If an array was passed via the first parameter instead of  ndividual string
		// values we cycle through it and recursivel  call this function.
		if (is_a ray($field))
		{
			foreach ($f eld as $row)
			{
				// Housto , we have a problem...
				if ( ! isset($row['field'], $row['ru es']))
				{
					continue;
			 }

				// If the field label wa n't passed we use the field nam 
				$label = isset($row['label ]) ? $row['label'] : $row['fiel '];

				// Add the custom erro  message array
				$errors = (i set($row['errors']) && is_array $row['errors'])) ? $row['errors ] : array();

				// Here we go 
				$this->set_rules($row['fie d'], $label, $row['rules'], $er ors);
			}

			return $this;
		 

		// No fields or no rules? N thing to do...
		if ( ! is_stri g($field) OR $field === '' OR e pty($rules))
		{
			return $thi ;
		}
		elseif ( ! is_array($ru es))
		{
			// BC: Convert pipe separated rules string to an ar ay
			if ( ! is_string($rules)) 			{
				return $this;
			}

		 $rules = preg_split('/\|(?![^\[ *\])/', $rules);
		}

		// If t e field label wasn't passed we  se the field name
		$label = ($ abel === '') ? $field : $label; 
		$indexes = array();

		// Is the field name an array? If it  s an array, we break it apart
	 // into its components so that  e can fetch the corresponding P ST data later
		if (($is_array   (bool) preg_match_all('/\[(.*? \]/', $field, $matches)) === TR E)
		{
			sscanf($field, '%[^[] ', $indexes[0]);

			for ($i =  , $c = count($matches[0]); $i < $c; $i++)
			{
				if ($matches 1][$i] !== '')
				{
					$inde es[] = $matches[1][$i];
				}
	 	}
		}

		// Build our master a ray
		$this->_field_data[$field  = array(
			'field'		=> $field 
			'label'		=> $label,
			'rul s'		=> $rules,
			'errors'	=> $ rrors,
			'is_array'	=> $is_arr y,
			'keys'		=> $indexes,
			' ostdata'	=> NULL,
			'error'		=  ''
		);

		return $this;
	}

	 / ----------------------------- ------------------------------- ------

	/**
	 * By default, fo m validation uses the $_POST ar ay to validate
	 *
	 * If an ar ay is set through this method,  hen this array will
	 * be used instead of the $_POST array
	 * 	 * Note that if you are valida ing multiple arrays, then the
	 * reset_validation() function s ould be called after validating 	 * each array due to the limit tions of CI's singleton
	 *
	 * @param	array	$data
	 * @return	 I_Form_validation
	 */
	public  unction set_data(array $data)
	 
		if ( ! empty($data))
		{
			 this->validation_data = $data;
 	}

		return $this;
	}

	// --- ------------------------------- ------------------------------- 

	/**
	 * Set Error Message
	  
	 * Lets users set their own e ror messages on the fly. Note:
  * The key name has to match th  function name that it correspo ds to.
	 *
	 * @param	array
	 * @param	string
	 * @return	CI_Fo m_validation
	 */
	public funct on set_message($lang, $val = '' 
	{
		if ( ! is_array($lang))
	 {
			$lang = array($lang => $va );
		}

		$this->_error_message  = array_merge($this->_error_me sages, $lang);
		return $this;
 }

	// ------------------------ ------------------------------- -----------

	/**
	 * Set The E ror Delimiter
	 *
	 * Permits a prefix/suffix to be added to ea h error message
	 *
	 * @param	 tring
	 * @param	string
	 * @re urn	CI_Form_validation
	 */
	pu lic function set_error_delimite s($prefix = '<p>', $suffix = '< p>')
	{
		$this->_error_prefix   $prefix;
		$this->_error_suffi  = $suffix;
		return $this;
	}
 	// --------------------------- ------------------------------- --------

	/**
	 * Get Error Me sage
	 *
	 * Gets the error mes age associated with a particula  field
	 *
	 * @param	string	$f eld	Field name
	 * @param	strin 	$prefix	HTML start tag
	 * @pa am 	string	$suffix	HTML end tag 	 * @return	string
	 */
	public function error($field, $prefix   '', $suffix = '')
	{
		if (emp y($this->_field_data[$field]['e ror']))
		{
			return '';
		}

 	if ($prefix === '')
		{
			$pr fix = $this->_error_prefix;
		} 
		if ($suffix === '')
		{
			$ uffix = $this->_error_suffix;
	 }

		return $prefix.$this->_fie d_data[$field]['error'].$suffix 
	}

	// ---------------------- ------------------------------- -------------

	/**
	 * Get Arr y of Error Messages
	 *
	 * Ret rns the error messages as an ar ay
	 *
	 * @return	array
	 */
	 ublic function error_array()
	{ 		return $this->_error_array;
	 

	// ------------------------- ------------------------------- ----------

	/**
	 * Error Stri g
	 *
	 * Returns the error mes ages as a string, wrapped in th  error delimiters
	 *
	 * @para 	string
	 * @param	string
	 * @ eturn	string
	 */
	public funct on error_string($prefix = '', $ uffix = '')
	{
		// No errors,  alidation passes!
		if (count($ his->_error_array) === 0)
		{
	 	return '';
		}

		if ($prefix  == '')
		{
			$prefix = $this-> error_prefix;
		}

		if ($suffi  === '')
		{
			$suffix = $this >_error_suffix;
		}

		// Gener te the error string
		$str = '' 
		foreach ($this->_error_array as $val)
		{
			if ($val !== '' 
			{
				$str .= $prefix.$val. suffix."\n";
			}
		}

		return $str;
	}

	// ----------------- ------------------------------- ------------------

	/**
	 * Ru  the Validator
	 *
	 * This fun tion does all the work.
	 *
	 * @param	string	$group
	 * @retur 	bool
	 */
	public function run $group = '')
	{
		$validation_a ray = empty($this->validation_d ta)
			? $_POST
			: $this->val dation_data;

		// Does the _fi ld_data array containing the va idation rules exist?
		// If no , we look to see if they were a signed via a config file
		if ( ount($this->_field_data) === 0) 		{
			// No validation rules?  We're done...
			if (count($thi ->_config_rules) === 0)
			{
		 	return FALSE;
			}

			if (emp y($group))
			{
				// Is there a validation rule for the parti ular URI being accessed?
				$g oup = trim($this->CI->uri->ruri string(), '/');
				isset($this >_config_rules[$group]) OR $gro p = $this->CI->router->class.'/ .$this->CI->router->method;
			 

			$this->set_rules(isset($th s->_config_rules[$group]) ? $th s->_config_rules[$group] : $thi ->_config_rules);

			// Were w  able to set the rules correctl ?
			if (count($this->_field_da a) === 0)
			{
				log_message( debug', 'Unable to find validat on rules');
				return FALSE;
	 	}
		}

		// Load the language  ile containing error messages
	 $this->CI->lang->load('form_val dation');

		// Cycle through t e rules for each field and matc  the corresponding $validation_ ata item
		foreach ($this->_fie d_data as $field => &$row)
		{
 		// Fetch the data from the va idation_data array item and cac e it in the _field_data array.
 		// Depending on whether the f eld name is an array or a strin  will determine where we get it from.
			if ($row['is_array'] = = TRUE)
			{
				$this->_field_ ata[$field]['postdata'] = $this >_reduce_array($validation_arra , $row['keys']);
			}
			elseif (isset($validation_array[$field ))
			{
				$this->_field_data[ field]['postdata'] = $validatio _array[$field];
			}
		}

		//  xecute validation rules
		// No e: A second foreach (for now) i  required in order to avoid fal e-positives
		//	 for rules lik  'matches', which correlate to  ther validation fields.
		forea h ($this->_field_data as $field => &$row)
		{
			// Don't try t  validate if we have no rules s t
			if (empty($row['rules']))
 		{
				continue;
			}

			$thi ->_execute($row, $row['rules'], $row['postdata']);
		}

		// Di  we end up with any errors?
		$ otal_errors = count($this->_err r_array);
		if ($total_errors > 0)
		{
			$this->_safe_form_dat  = TRUE;
		}

		// Now we need  o re-set the POST data with the new, processed data
		empty($th s->validation_data) && $this->_ eset_post_array();

		return ($ otal_errors === 0);
	}

	// --- ------------------------------- ------------------------------- 

	/**
	 * Prepare rules
	 *
	   Re-orders the provided rules i  order of importance, so that
	 * they can easily be executed l ter without weird checks ...
	  
	 * "Callbacks" are given the  ighest priority (always called) 
	 * followed by 'required' (ca led if callbacks didn't fail),
  * and then every next rule dep nds on the previous one passing 
	 *
	 * @param	array	$rules
	   @return	array
	 */
	protected  unction _prepare_rules($rules)
 {
		$new_rules = array();
		$ca lbacks = array();

		foreach ($ ules as &$rule)
		{
			// Let ' equired' always be the first (n n-callback) rule
			if ($rule = = 'required')
			{
				array_un hift($new_rules, 'required');
	 	}
			// 'isset' is a kind of a weird alias for 'required' ...
 		elseif ($rule === 'isset' &&  empty($new_rules) OR $new_rules 0] !== 'required'))
			{
				ar ay_unshift($new_rules, 'isset') 
			}
			// The old/classic 'ca lback_'-prefixed rules
			elsei  (is_string($rule) && strncmp(' allback_', $rule, 9) === 0)
			 
				$callbacks[] = $rule;
			} 			// Proper callables
			elsei  (is_callable($rule))
			{
				 callbacks[] = $rule;
			}
			// "Named" callables; i.e. array(' ame' => $callable)
			elseif (i _array($rule) && isset($rule[0]  $rule[1]) && is_callable($rule 1]))
			{
				$callbacks[] = $r le;
			}
			// Everything else  oes at the end of the queue
			 lse
			{
				$new_rules[] = $ru e;
			}
		}

		return array_mer e($callbacks, $new_rules);
	}

 // ---------------------------- ------------------------------- -------

	/**
	 * Traverse a mu tidimensional $_POST array inde  until the data is found
	 *
	   @param	array
	 * @param	array
  * @param	int
	 * @return	mixed 	 */
	protected function _reduc _array($array, $keys, $i = 0)
	 
		if (is_array($array) && isse ($keys[$i]))
		{
			return isse ($array[$keys[$i]]) ? $this->_r duce_array($array[$keys[$i]], $ eys, ($i+1)) : NULL;
		}

		//  ULL must be returned for empty  ields
		return ($array === '')   NULL : $array;
	}

	// ------- ------------------------------- ----------------------------

	 **
	 * Re-populate the _POST ar ay with our finalized and proce sed data
	 *
	 * @return	void
	 */
	protected function _reset_p st_array()
	{
		foreach ($this- _field_data as $field => $row)
 	{
			if ($row['postdata'] !==  ULL)
			{
				if ($row['is_arra '] === FALSE)
				{
					isset( _POST[$field]) && $_POST[$field  = is_array($row['postdata']) ? NULL : $row['postdata'];
				}
 			else
				{
					// start wit  a reference
					$post_ref =&  _POST;

					// before we assig  values, make a reference to th  right POST key
					if (count( row['keys']) === 1)
					{
				 	$post_ref =& $post_ref[current $row['keys'])];
					}
					els 
					{
						foreach ($row['ke s'] as $val)
						{
							$po t_ref =& $post_ref[$val];
					 }
					}

					$post_ref = $row 'postdata'];
				}
			}
		}
	}
 	// --------------------------- ------------------------------- --------

	/**
	 * Executes the Validation routines
	 *
	 * @pa am	array
	 * @param	array
	 * @ aram	mixed
	 * @param	int
	 * @ eturn	mixed
	 */
	protected fun tion _execute($row, $rules, $po tdata = NULL, $cycles = 0)
	{
	 // If the $_POST data is an arr y we will run a recursive call
 	//
		// Note: We MUST check if the array is empty or not!
		//       Otherwise empty arrays wi l always pass validation.
		if  is_array($postdata) && ! empty( postdata))
		{
			foreach ($pos data as $key => $val)
			{
				 this->_execute($row, $rules, $v l, $key);
			}

			return;
		}
 		$rules = $this->_prepare_rule ($rules);
		foreach ($rules as  rule)
		{
			$_in_array = FALSE 

			// We set the $postdata va iable with the current data in  ur master array so that
			// e ch cycle of the loop is dealing with the processed data from th  last cycle
			if ($row['is_arr y'] === TRUE && is_array($this- _field_data[$row['field']]['pos data']))
			{
				// We shouldn t need this safety, but just in case there isn't an array index 				// associated with this cyc e we'll bail out
				if ( ! iss t($this->_field_data[$row['fiel ']]['postdata'][$cycles]))
				 
					continue;
				}

				$pos data = $this->_field_data[$row[ field']]['postdata'][$cycles];
