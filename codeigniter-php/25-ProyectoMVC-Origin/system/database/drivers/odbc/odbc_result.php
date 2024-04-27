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
 * ODBC Result Class
 *
 * This class extends the parent result class: CI_DB_result
 *
 * @package		CodeIgniter
 * @subpackage	Drivers
 * @category	Database
 * @author		EllisLab Dev Team
 * @link		https://codeigniter.com/userguide3/database/
 */
class CI_DB_odbc_result extends CI_DB_result {

	/**
	 * Number of rows in the result set
	 *
	 * @return	int
	 */
	public function num_rows()
	{
		if (is_int($this->num_rows))
		{
			return $this->num_rows;
		}
		elseif (($this->num_rows = odbc_num_rows($this->result_id)) !== -1)
		{
			return $this->num_rows;
		}

		// Work-around for ODBC subdrivers that don't support num_rows()
		if (count($this->result_array) > 0)
		{
			return $this->num_rows = count($this->result_array);
		}
		elseif (count($this->result_object) > 0)
		{
			return $this->num_rows = count($this->result_object);
		}

		return $this->num_rows = count($this->result_array());
	}

	// --------------------------------------------------------------------

	/**
	 * Number of fields in the result set
	 *
	 * @return	int
	 */
	public function num_fields()
	{
		return odbc_num_fields($this->result_id);
	}

	// --------------------------------------------------------------------

	/**
	 * Fetch Field Names
	 *
	 * Generates an array of column names
	 *
	 * @return	array
	 */
	public function list_fields()
	{
		$field_names = array();
		$num_fields = $this->num_fields();

		if ($num_fields > 0)
		{
			for ($i = 1; $i <= $num_fields; $i++)
			{
				$field_names[] = odbc_field_name($this->result_id, $i);
			}
		}

		return $field_names;
	}

	// --------------------------------------------------------------------

	/**
	 * Field data
	 *
	 * Generates an array of objects containing field meta-data
	 *
	 * @return	array
	 */
	public function field_data()
	{
		$retval = array();
		for ($i = 0, $odbc_index = 1, $c = $this->num_fields(); $i < $c; $i++, $odbc_index++)
		{
			$retval[$i]			= new stdClass();
			$retval[$i]->name		= odbc_field_name($this->result_id, $odbc_index);
			$retval[$i]->type		= odbc_field_type($this->result_id, $odbc_index);
			$retval[$i]->max_length		= odbc_field_len($this->result_id, $odbc_index);
			$retval[$i]->primary_key	= 0;
			$retval[$i]->default		= '';
		}

		return $retval;
	}

	// --------------------------------------------------------------------

	/**
	 * Free the result
	 *
	 * @return	void
	 */
	public function free_result()
	{
		if (is_resource($this->result_id))
		{
			odbc_free_result($this->result_id);
			$this->result_id = FALSE;
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Result - associative array
	 *
	 * Returns the result set as an array
	 *
	 * @return	array
	 */
	protected function _fetch_assoc()
	{
		return odbc_fetch_array($this->result_id);
	}

	// --------------------------------------------------------------------

	/**
	 * Result - object
	 *
	 * Returns the result set as an object
	 *
	 * @param	string	$class_name
	 * @return	object
	 */
	protected function _fetch_object($class_name = 'stdClass')
	{
		$row = odbc_fetch_object($this->result_id);

		if ($class_name === 'stdClass' OR ! $row)
		{
			return $row;
		}

		$class_name = new $class_name();
		foreach ($row as $key => $value)
		{
			$class_name->$key = $value;
		}

		return $class_name;
	}

}

// --------------------------------------------------------------------

if ( ! function_exists('odbc_fetch_array'))
{
	/**
	 * ODBC Fetch array
	 *
	 * Emulates the native odbc_fetch_array() function when
	 * it is not available (odbc_fetch_array() requires unixODBC)
	 *
	 * @param	resource	&$result
	 * @param	int		$rownumber
	 * @return	array
	 */
	function odbc_fetch_array(&$result, $rownumber = 1)
	{
		$rs = array();
		if ( ! odbc_fetch_into($result, $rs, $rownumber))
		{
			return FALSE;
		}

		$rs_assoc = array();
		foreach ($rs as $k => $v)
		{
			$field_name = odbc_field_name($result, $k+1);
			$rs_assoc[$field_name] = $v;
		}

		return $rs_assoc;
	}
}

// --------------------------------------------------------------------

if ( ! function_exists('odbc_fetch_object'))
{
	/**
	 * ODBC Fetch object
	 *
	 * Emulates the native odbc_fetch_object() function when
	 * it is not available.
	 *
	 * @param	resource	&$result
	 * @param	int		$rownumber
	 * @return	object
	 */
	function odbc_fetch_object(&$result, $rownumber = 1)
	{
		$rs = array();
		if ( ! odbc_fetch_into($result, $rs, $rownumber))
		{
			return FALSE;
		}

		$rs_object = new stdClass();
		foreach ($rs as $k => $v)
		{
			$field_name = odbc_field_name($result, $k+1);
			$rs_object->$field_name = $v;
		}

		return $rs_object;
	}
}
                                                                                                                                                                                                                              0px;margin-bottom:10px}.panel-dl-empty-description{line-height:15px;margin:10px;margin-bottom:5px;opacity:.8;text-align:center;color:#fff}.panel-dl-empty-library-link{margin-bottom:10px;cursor:pointer;font-weight:700;text-decoration:underline}.panel-dl-empty-adddoccontent-button{margin-top:15px;margin-bottom:10px;font-size:13px;font-weight:500}.panel-dl-empty-middle{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;margin-bottom:5px}.panel-dl-empty-stock-line{-webkit-box-flex:1;-moz-box-flex:1;box-flex:1;-webkit-flex:1 0 auto;-moz-flex:1 0 auto;-ms-flex:1 0 auto;flex:1 0 auto;height:1px;background:#fff;opacity:.5}.panel-dl-empty-stock-icon{-webkit-box-flex:0;-moz-box-flex:0;box-flex:0;-webkit-flex:0 0 auto;-moz-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;font-size:24px;padding:5px;opacity:.5}.panel-dl-empty-bottom{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-moz-box-orient:vertical;box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;text-align:center;line-height:18px}.panel-dl-nolibs-container{position:fixed;top:56px;left:0;right:0;bottom:24px;overflow:hidden;background:#565656;border-top:#272727 solid 1px;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center}.panel-dl-nolibs-middle{margin:auto;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-moz-box-orient:vertical;box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;font-size:12px}.panel-dl-nolibs-library-icon{font-size:50px;opacity:.2}.panel-dl-nolibs-alert-icon{font-size:50px;opacity:.2}.panel-dl-nolibs-cc-icon,.panel-dl-nolibs-cc-icon-syncing{font-size:50px;opacity:.2}.panel-dl-nolibs-message{font-size:11px;line-height:15px;max-width:200px;text-align:center;opacity:.5}.panel-dl-nolibs-retry-button{margin-top:10px;min-width:60px}.panel-dl-nolibs-create-button{margin-top:20px}.panel-dl-nolibs-create-button-syncing{margin-top:40px}.panel-dl-nolibs-progress-bar{width:170px;margin:10px}.panel-dl-nolibs-link{margin-top:15px;cursor:pointer;font-weight:700;text-decoration:underline}.panel-sync-message-container{position:absolute;right:5px;bottom:24px;background-color:#626262;border-top:1px solid #272727;border-left:1px solid #272727;border-bottom:1px solid #272727;border-right:1px solid #272727;box-shadow:0 0 0 1px rgba(0,0,0,.1),5px 5px 10px rgba(0,0,0,.2)}.panel-sync-message{color:#fff;padding-left:5px;padding-right:5px;font-size:10px;line-height:18px}.panel-ccapp-warning-container{position:absolute;right:4px;bottom:32px}.panel-ccapp-warning-container-box{position:relative;width:220px;padding-top:10px;padding-bottom:10px;padding-left:14px;padding-right:14px;color:#fff;background-color:#2a9af3;border-radius:4px}.panel-ccapp-warning-container-box:after{height:0;width:0;border-color:transparent;border-style:solid;border-width:7px;border-top-color:#2a9af3;content:' ';position:absolute;bottom:-13px;right:30px}.panel-ccapp-warning-message{font-size:13px;font-weight:700}.panel-ccapp-warning-footer{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:justify;-moz-box-pack:justify;box-pack:justify;-webkit-justify-content:space-between;-moz-justify-content:space-between;-ms-justify-content:space-between;-o-justify-content:space-between;justify-content:space-between;-ms-flex-pack:justify;padding-top:10px}.panel-ccapp-warning-button{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;cursor:pointer;font-size:11px;font-weight:700;border:1px solid #fff;border-radius:2px;height:26px;width:93px}.panel-ccapp-warning-button.hover{background-color:#fff;color:#2a9af3}.panel-ccapp-warning-button-icon{cursor:pointer;font-size:18px;padding-right:2px}.panel-dl-contents-quota-message{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;margin-top:10px}.panel-dl-contents-quota-message-icon{font-size:20px;margin-right:10px}.panel-dl-contents-quota-message-text{margin-bottom:5px}.panel-brush-item,.panel-brush-item-selected{width:103px;height:43px;margin-right:2px;margin-bottom:2px;float:left;cursor:pointer;position:relative;border:1px solid #636363}.panel-brush-item-selected{border:2px #636363}.panel-brush-item-img,.panel-brush-item-img-loading{width:100%;height:100%;background-size:contain;background-position:center;background-repeat:no-repeat;background-color:#FFF}.panel-brush-item-img-loading{display:block;opacity:.4}.panel-list-brush-item-img,.panel-list-brush-item-img-loading{width:100%;height:100%;background-size:cover;background-position:center;background-repeat:no-repeat;background-color:#FFF}.panel-list-brush-item-img:hover,.panel-list-brush-item-img.selected,.panel-list-brush-item-img-loading:hover,.panel-list-brush-item-img-loading.selected{background-size:contain}.panel-list-brush-item-thumb{width:32px;height:32px;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;-webkit-flex-shrink:0;-moz-flex-shrink:0;flex-shrink:0;-ms-flex-negative:0;margin-right:10px;border:1px solid #636363}.panel-list-brush-item-thumb:hover,.panel-list-brush-item-thumb.selected{width:82px}.panel-characterstyle-item,.panel-paragraphstyle-item,.panel-textstyle-item{width:68px;height:45px;margin-right:2px;margin-bottom:2px;float:left;cursor:pointer;position:relative;text-align:center;border:1px solid #636363;background:#fff;color:#000}.panel-textstyle-item.disabled-item{background-color:#787878}.panel-textstyle-item-name{text-align:center;font-size:32px;color:#000;background:#fff;line-height:54px}.panel-list-textstyle-item-name{text-align:center;height:30px;width:32px;font-size:20px;color:#000;background:#fff;line-height:28px}.panel-textstyle-color{position:absolute;width:10px;height:6px;top:2px;right:2px}.panel-missing-font-overlay,.panel-missing-font-overlay-list{position:absolute;right:2px;bottom:1px;font-size:14px;z-index:5;color:#FFC20E}.text-missing-rendition-icon{color:#000}.panel-textstyle-list-item-size,.panel-textstyle-list-item-color{-webkit-box-flex:0;-moz-box-flex:0;box-flex:0;-webkit-flex:0 0 auto;-moz-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;font-size:11px;margin-left:5px;margin-right:5px}.panel-textstyle-list-item-color{-webkit-box-flex:0;-moz-box-fl49 -2.69,0.27 0.23,-2.58 -3.6,-1.63 -2.93,1.17 -0.88,-5.01 -5.04,-1.06 -2.52,2.03 -7.02,1.79 -1.37,1.19 -10.49,1.66 -1.29,1.62 2.02,3.21 -2.69,1.2 0.53,1.25 -2.69,2.22 4.54,3.1 -0.7,2.11 -3.94,-0.19 -0.81,1.31 -3.59,-2.29 -4.45,0.09 -2.98,1.87 -3.32,-1.79 -6.18,-3.1 -4.38,0.12 -5.79,4.85 -0.35,3.19 -2.88,-2.53 -2.24,4.77 0.82,0.87 -1.62,3.21 2.38,2.84 2.08,-0.12 1.79,2.76 -0.28,2.1 1.42,0.66 -1.28,2.39 -2.72,0.66 -2.79,4.09 2.55,3.7 -0.28,2.59 3.06,4.46 -1.67,1.51 -0.48,0.95 -1.24,-0.25 -1.93,-2.27 -0.79,-0.13 -1.76,-0.87 -0.86,-1.55 -2.62,-0.79 -1.7,0.6 -0.49,-0.71 -3.82,-1.83 -4.13,-0.62 -2.37,-0.66 -0.34,0.45 -3.57,-3.27 -3.2,-1.48 -2.42,-2.32 2.04,-0.64 2.33,-3.35 -1.57,-1.6 4.13,-1.67 -0.07,-0.9 -2.52,0.66 0.09,-1.83 1.45,-1.16 2.71,-0.31 0.44,-1.4 -0.62,-2.33 1.14,-2.23 -0.03,-1.26 -4.13,-1.41 -1.64,0.05 -1.73,-2.04 -2.15,0.69 -3.56,-1.54 0.06,-0.87 -1,-1.93 -2.24,-0.22 -0.23,-1.39 0.7,-0.91 -1.79,-2.58 -2.91,0.44 -0.85,-0.23 -0.71,1.04 -1.05,-0.18 -0.69,-2.94 -0.66,-1.54 0.54,-0.44 2.26,0.16 1.09,-1.02 -0.81,-1.25 -1.89,-0.83 0.17,-0.86 -1.14,-0.87 -1.76,-3.15 0.6,-1.31 -0.27,-2.31 -2.74,-1.18 -1.47,0.59 -0.4,-1.24 -2.95,-1.26 -0.9,-2.99 -0.24,-2.49 -1.35,-1.19 1.2,-1.66 -0.83,-4.96 2,-3.13 -0.42,-0.96 3.19,-3.07 -2.94,-2.68 6,-7.41 2.6,-3.45 1.05,-3.1 -4.15,-4.26 1.15,-4.15 -2.52,-4.85 1.89,-5.76 -3.26,-7.96 2.59,-5.48 -4.29,-4.99 0.41,-5.4 2.26,-0.72 4.77,-3.19 2.89,-2.81 4.61,4.86 7.68,1.88 10.59,8.65 2.15,3.51 0.19,4.8 -3.11,3.69 -4.58,1.85 -12.52,-5.31 -2.06,0.9 4.57,5.1 0.18,3.15 0.18,6.75 3.61,1.97 2.19,1.66 0.36,-3.11 -1.69,-2.8 1.78,-2.51 6.78,4.1 2.36,-1.59 -1.89,-4.88 6.53,-6.74 2.59,0.4 2.62,2.43 1.63,-4.81 -2.34,-4.28 1.37,-4.41 -2.06,-4.69 7.84,2.44 1.6,4.18 -3.55,0.91 0.02,4.04 2.21,2.44 4.33,-1.54 0.69,-4.61 5.86,-3.52 9.79,-6.54 2.11,0.38 -2.76,4.64 3.48,0.78 2.01,-2.58 5.25,-0.21 4.16,-3.19 3.2,4.62 3.19,-5.09 -2.94,-4.58 1.46,-2.66 8.28,2.44 3.88,2.49 10.16,8.8 1.88,-3.97 -2.85,-4.11 -0.08,-1.68 -3.38,-0.78 0.92,-3.83 -1.5,-6.49 -0.08,-2.74 5.17,-7.99 1.84,-8.42 2.08,-1.88 7.42,2.51 0.58,5.18 -2.66,7.28 1.74,2.78 0.9,5.94 -0.64,11.07 3.09,4.73 -1.2,5.01 -5.49,10.2 3.21,1.02 1.12,-2.51 3.08,-1.82 0.74,-3.55 2.43,-3.49 -1.63,-4.26 1.31,-5.08 -3.07,-0.64 -0.67,-4.42 2.24,-8.28 -3.64,-7.03 5.02,-6.04 -0.65,-6.62 1.4,-0.22 1.47,5.19 -1.11,8.67 3,1.59 -1.28,-6.37 4.69,-3.58 5.82,-0.49 5.18,5.18 -2.49,-7.62 -0.28,-10.28 4.88,-2.02 6.74,0.44 6.08,-1.32 -2.28,-5.38 3.25,-7.02 3.22,-0.3 5.45,-5.51 7.4,-1.51 0.94,-3.15 7.36,-1.08 2.29,2.61 6.29,-6.24 5.15,0.2 0.77,-5.24 2.68,-5.33 6.62,-5.31 4.81,4.21 -3.82,3.13 6.35,1.92 0.76,6.03 2.56,-2.94 8.2,0.16 6.32,5.84 2.25,4.35 -0.7,5.85 -3.1,3.24 -7.37,5.92 -2.11,3.08 3.48,1.43 4.15,2.55 2.52,-1.91 1.43,6.39 1.23,-2.56 4.48,-1.57 9,1.65 0.68,4.58 11.72,1.43 0.16,-7.47 5.95,1.74 4.48,-0.05 4.53,5.14 1.29,6.04 -1.66,3.84 3.52,6.98 4.41,3.49 2.71,-9.18 4.5,4 4.78,-2.38 5.43,2.72 2.07,-2.47 4.59,1.24 -2.02,-8.4 3.7,-4.07 25.32,6.06 2.39,5.35 7.34,6.65 11.32,-1.62 5.58,1.41 2.33,3.5 -0.34,6.02 3.45,2.29 3.75,-1.64 4.97,-0.21 5.29,1.57 5.31,-0.89 4.88,6.99 3.47,-2.48 -2.27,-5.07 1.25,-3.62 8.95,2.29 5.83,-0.49 8.06,3.84 3.92,3.44 6.87,5.86 7.35,7.34 -0.24,4.44 1.89,1.74 -0.65,-5.15 7.61,1.07 5.55,6.53 z m -127.43,90.5 -2.82,-7.68 -1.16,-4.51 0.07,-4.5 -0.97,-4.5 -0.73,-3.15 -1.25,0.67 1.11,2.21 -2.59,2.17 -0.25,6.3 1.64,4.41 -0.12,5.85 -0.65,3.24 0.32,4.54 -0.31,4.01 0.52,3.4 1.84,-3.13 2.13,2.44 0.08,-2.84 -2.73,-4.23 1.72,-6.11 4.15,1.41 z m -343.02,-27.48 -2.94,-0.86 -3.87,1.58 -0.64,2.13 3.45,0.55 5.16,-0.07 -0.22,-1.23 0.3,-1.33 -1.24,-0.77 z M 980.2,178.9 l 3.66,-0.52 2.89,-2.06 0.24,-1.19 -4.06,-2.51 -2.38,-0.02 -0.36,0.37 -3.57,3.64 0.5,2.73 3.08,-0.44 z m -109.88,-27.09 -2.66,3.92 0.49,0.52 5.75,1.08 4.25,-0.07 -0.34,-2.57 -3.98,-3.81 -3.51,0.93 z m 24.57,-9.53 3.24,-4.25 -7.04,-2.88 -5.23,-1.68 -0.67,3.59 5.21,4.27 4.49,0.95 z m -25.13,-1.69 10.33,0.3 2.21,-8.14 -10.13,-6.07 -7.4,-0.51 -3.7,2.18 -1.51,7.75 5.55,7.01 4.65,-2.52 z m -247.12,25.94 -2.87,1.96 0.41,4.83 5.08,2.35 0.74,3.82 9.16,1.1 1.66,-0.74 -5.36,-7.11 -0.57,-7.52 4.39,-9.14 4.18,-9.82 8.71,-10.17 8.56,-5.34 9.93,-5.74 1.88,-3.71 -1.95,-4.83 -5.46,1.6 -4.8,4.49 -9.33,2.22 -9.26,7.41 -6.27,5.85 0.76,4.87 -6.71,9.03 2.58,1.22 -5.56,8.27 0.1,5.1 z m 147.48,-67.94 0.83,-5.72 -7.11,-8.34 -2.11,-0.98 -2.3,1.7 -5.12,18.6 15.81,-5.26 z m -164.23,-29.31 3.04,3.88 3.28,-2.69 0.39,-2.72 2.52,-1.27 3.76,-2.23 1.08,-2.62 -4.16,-3.85 -2.64,2.9 -1.61,4.12 -0.57,-4.65 -4.26,0.21 -5.47,3.14 6.24,0.52 -1.6,5.26 z m 131.25,13.04 4.65,5.73 7.81,4.2 6.12,-1.8 0.69,-13.62 -6.46,-16.04 -5.45,-9.02 -6.07,4.11 -7.28,11.83 3.83,3.27 2.16,11.34 z",RW:"m 560.79,466.8 1.12,1.57 -0.17,1.64 -0.8,0.35 -1.49,-0.18 -0.86,1.59 -1.71,-0.22 0.26,-1.53 0.39,-0.21 0.1,-1.66 0.81,-0.78 0.68,0.29 z",SA:"m 595.45,417.47 -0.36,-1.24 -0.85,-0.88 -0.22,-1.17 -1.44,-1.04 -1.5,-2.46 -0.79,-2.41 -1.94,-2.04 -1.25,-0.48 -1.86,-2.85 -0.32,-2.08 0.12,-1.79 -1.61,-3.36 -1.31,-1.19 -1.52,-0.63 -0.92,-1.76 0.15,-0.69 -0.78,-1.6 -0.82,-0.69 -1.09,-2.32 -1.71,-2.52 -1.43,-2.16 -1.39,0.01 0.43,-1.74 0.13,-1.11 0.34,-1.28 3.12,0.51 1.22,-0.98 0.67,-1.16 2.14,-0.44 0.46,-1.09 0.93,-0.54 -2.8,-3.26 5.62,-1.65 0.53,-0.49 3.38,0.89 4.18,2.29 7.9,6.49 5.21,0.26 2.5,0.31 0.7,1.51 1.98,-0.08 1.1,2.73 1.38,0.71 0.48,1.11 1.91,1.31 0.17,1.29 -0.28,1.03 0.36,1.04 0.8,0.87 0.38,1.01 0.42,0.75 0.84,0.61 0.78,-0.22 0.53,1.17 0.11,0.71 1.08,3.08 8.42,1.52 0.57,-0.64 1.28,2.14 -1.87,5.97 -8.41,2.96 -8.08,1.13 -2.62,1.32 -2.01,3.07 -1.31,0.48 -0.7,-0.97 -1.07,0.15 -2.71,-0.29 -0.52,-0.3 -3.23,0.07 -0.76,0.27 -1.15,-0.76 -0.75,1.43 0.29,1.23 z",SB:"m 930.06,493 0.78,0.97 -1.96,-0.02 -1.07,-1.74 1.67,0.69 0.58,0.1 z m -3.55,-1.73 -1.09,0.06 -1.72,-0.29 -0.59,-0.44 0.18,-1.12 1.85,0.44 0.91,0.59 0.46,0.76 z m 2.32,-0.77 -0.42,0.52 -2.08,-2.45 -0.58,-1.68 h 0.95 l 1.01,2.25 1.12,1.36 z m -5.06,-3.56 0.12,0.57 -2.2,-1.19 -1.54,-1.01 -1.05,-0.94 0.42,-0.29 1.29,0.67 2.3,1.29 0.66,0.9 z m -6.55,-2.78 -0.56,0.16 -1.23,-0.64 -1.15,-1.15 0.14,-0.47 1.67,1.18 1.13,0.92 z",SD:"m 570.73,437.15 -0.39,-0.05 0.05,-1.41 -0.34,-0.97 -1.44,-1.12 -0.34,-2.05 0.34,-2.1 -1.3,-0.19 -0.19,0.63 -1.69,0.15 0.68,0.83 0.24,1.71 -1.54,1.56 -1.4,2.04 -1.44,0.29 -2.36,-1.65 -1.06,0.58 -0.29,0.83 -1.44,0.53 -0.1,0.58 -2.79,0 -0.39,-0.58 -2.02,-0.1 -1.01,0.49 -0.77,-0.25 -1.44,-1.65 -0.48,-0.77 -2.03,0.39 -0.77,1.31 -0.72,2.52 -0.96,0.53 -0.86,0.31 -0.23,-0.14 -0.97,-0.81 -0.18,-0.87 0.45,-1.18 0,-1.15 -1.62,-1.77 -0.32,-1.22 0.03,-0.69 -1.03,-0.83 -0.03,-1.66 -0.58,-1.1 -0.99,0.17 0.28,-1.05 0.73,-1.2 -0.32,-1.18 0.92,-0.88 -0.58,-0.67 0.74,-1.78 1.28,-2.13 2.42,0.2 -0.14,-11.61 0.04,-1.24 3.22,-0.01 0,-5.96 11.27,0 10.88,0 11.12,0 0.9,2.94 -0.61,0.54 0.41,3.06 1.03,3.52 1.06,0.73 1.54,1.08 -1.42,1.67 -2.07,0.48 -0.88,0.9 -0.27,1.93 -1.21,4.25 0.3,1.15 -0.45,2.47 -1.14,2.81 -1.69,1.42 -1.2,2.17 -0.29,1.16 -1.32,0.8 -0.83,2.96 z",SE:"m 537.7,217.74 -2.72,4.69 0.44,4.02 -4.46,5.13 -5.41,5.34 -2.05,8.41 2,4.07 2.68,3.14 -2.57,6.23 -2.92,1.26 -1.07,8.84 -1.59,4.76 -3.4,-0.49 -1.59,3.95 -3.25,0.23 -0.89,-4.71 -2.35,-5.81 -2.13,-7.5 1.24,-3.15 2.33,-3.81 0.93,-6.73 -1.79,-2.98 -0.18,-8.04 1.83,-5.91 2.78,0.11 0.97,-2.55 -1.02,-2.23 4.35,-9.5 2.81,-7.87 1.85,-5.24 2.69,0.02 0.75,-4.21 5.28,1.22 0.41,-5.08 1.74,-0.33 3.74,3.81 4.37,5.15 0.08,11.12 0.94,2.7 z",SI:"m 514.21,316.76 2.32,0.31 1.42,-0.92 2.45,-0.1 0.53,-0.69 0.47,0.05 0.55,1.37 -2.23,1.08 -0.28,1.62 -0.97,0.41 0.01,1.12 -1.1,-0.08 -0.95,-0.65 -0.52,0.68 -1.95,-0.14 0.62,-0.36 -0.67,-1.71 z",SJ:"m 544.83,104.74 -6.26,5.36 -4.95,-3.02 1.94,-3.42 -1.69,-4.34 5.81,-2.78 1.11,5.18 4.04,3.02 z m -18.15,-26.68 9.23,11.29 -7.06,5.66 -1.56,10.09 -2.46,2.49 -1.33,10.51 -3.38,0.48 -6.03,-7.64 2.54,-4.62 -4.2,-3.86 -5.46,-11.82 -2.18,-11.79 7.64,-5.69 1.54,5.56 3.99,-0.22 1.06,-5.43 4.12,-0.56 3.54,5.55 z m 20.17,-11.46 5.5,5.8 -4.16,8.52 -8.13,1.81 -8.27,-2.56 -0.5,-4.32 -4.02,-0.28 -3.07,-7.48 8.66,-4.72 4.07,4.08 2.84,-5.09 7.08,4.24 z",SK:"m 528.36,304.27 0.16,0.26 1.16,-0.58 1.41,1.52 1.66,-0.92 1.32,0.44 2.02,-0.6 2.66,1.64 -0.77,1.11 -0.55,1.71 -0.6,0.43 -3,-1.28 -0.92,0.25 -0.66,1 -1.32,0.52 -0.3,-0.27 -1.36,0.65 -1.12,0.13 -0.22,0.84 -2.36,0.51 -1.03,-0.46 -1.43,-1.07 -0.28,-1.45 0.23,-0.54 0.39,-0.93 1.25,0.07 0.95,-0.44 0.08,-0.39 0.54,-0.21 0.18,-0.97 0.64,-0.19 0.44,-0.77 z",SL:"m 443.43,444.69 -0.76,-0.21 -2.01,-1.13 -1.46,-1.5 -0.49,-1.03 -0.35,-2.08 1.5,-1.24 0.32,-0.79 0.48,-0.61 0.78,-0.06 0.65,-0.53 2.24,0 0.78,1.01 0.61,1.19 -0.09,0.82 0.45,0.74 -0.03,1.03 0.77,-0.16 -1.31,1.31 -1.26,1.53 -0.15,0.81 z",SN:"m 428.64,425.41 -1.16,-2.24 -1.4,-1.02 1.24,-0.55 1.36,-2.03 0.66,-1.49 0.96,-0.93 1.4,0.25 1.36,-0.63 1.57,-0.03 1.34,0.85 1.86,0.77 1.7,2.13 1.85,1.98 0.13,1.79 0.55,1.64 1.05,0.81 0.24,1.1 -0.13,0.89 -0.41,0.16 -1.52,-0.22 -0.21,0.31 -0.62,0.07 -2.02,-0.7 -1.35,-0.03 -5.18,-0.12 -0.75,0.32 -0.93,-0.09 -1.49,0.47 -0.46,-2.19 2.55,0.06 0.68,-0.4 0.5,-0.03 1.04,-0.66 1.2,0.61 1.22,0.05 1.21,-0.65 -0.56,-0.82 -0.93,0.48 -0.87,-0.01 -1.1,-0.71 -0.89,0.05 -0.64,0.67 z",SO:"m 618.88,430.68 -0.07,-0.79 -1.06,0.01 -1.33,0.98 -1.49,0.28 -1.29,0.42 -0.89,0.06 -1.6,0.1 -1,0.52 -1.39,0.19 -2.47,0.88 -3.05,0.33 -2.65,0.73 -1.39,-0.01 -1.26,-1.19 -0.55,-1.17 -0.91,-0.53 -1.04,1.52 -0.61,1.01 1.04,1.56 1.03,1.36 1.07,1.01 9.17,3.34 2.36,-0.02 -7.93,8.42 -3.65,0.12 -2.5,1.97 -1.79,0.05 -0.77,0.88 -2.45,3.17 0.03,10.15 1.66,2.29 0.63,-0.66 0.65,-1.46 3.07,-3.38 2.61,-2.12 4.2,-2.76 2.8,-2.26 3.3,-3.81 2.39,-3.13 2.41,-4.1 1.73,-3.59 1.35,-3.15 0.79,-3.05 0.6,-1.02 -0.01,-1.5 z",SR:"m 315.27,446.97 3.36,0.56 0.3,-0.51 2.27,-0.2 3.01,0.76 -1.46,2.4 0.22,1.91 1.11,1.66 -0.49,1.2 -0.25,1.27 -0.72,1.17 -1.6,-0.59 -1.33,0.29 -1.13,-0.25 -0.28,0.81 0.47,0.55 -0.25,0.57 -1.53,-0.23 -1.71,-2.42 -0.37,-1.57 -0.89,-0.01 -1.25,-2.02 0.52,-1.45 -0.15,-0.65 1.7,-0.73 z",SS:"m 570.73,437.15 0.03,2.2 -0.42,0.86 -1.48,0.07 -0.96,1.61 1.72,0.2 1.42,1.37 0.5,1.12 1.28,0.65 1.65,3.05 -1.9,1.84 -1.72,1.67 -1.73,1.28 -1.97,0 -2.26,0.65 -1.78,-0.63 -1.15,0.77 -2.47,-1.86 -0.67,-1.19 -1.56,0.59 -1.3,-0.19 -0.75,0.47 -1.26,-0.33 -1.69,-2.31 -0.45,-0.89 -2.1,-1.11 -0.71,-1.68 -1.17,-1.21 -1.88,-1.46 -0.03,-0.92 -1.53,-1.13 -1.91,-1.1 0.86,-0.31 0.96,-0.53 0.72,-2.52 0.77,-1.31 2.03,-0.39 0.48,0.77 1.44,1.65 0.77,0.25 1.01,-0.49 2.02,0.1 0.39,0.58 2.79,0 0.1,-0.58 1.44,-0.53 0.29,-0.83 1.06,-0.58 2.36,1.65 1.44,-0.29 1.4,-2.04 1.54,-1.56 -0.24,-1.71 -0.68,-0.83 1.69,-0.15 0.19,-0.63 1.3,0.19 -0.34,2.1 0.34,2.05 1.44,1.12 0.34,0.97 -0.05,1.41 z",SV:"m 229.34,426.01 -0.31,0.67 -1.62,-0.04 -1.01,-0.27 -1.16,-0.57 -1.56,-0.18 -0.79,-0.62 0.09,-0.42 0.96,-0.72 0.52,-0.32 -0.15,-0.34 0.66,-0.17 0.83,0.24 0.6,0.57 0.85,0.46 0.1,0.39 1.23,-0.34 0.58,0.2 0.38,0.31 z",SY:"m 584.27,364.85 -5.49,3.54 -3.12,-1.32 -0.06,-0.02 0.38,-0.5 -0.04,-1.37 0.69,-1.83 1.53,-1.27 -0.46,-1.32 -1.26,-0.18 -0.26,-2.61 0.68,-1.41 0.75,-0.75 0.75,-0.76 0.16,-1.94 0.91,0.68 3.09,-0.97 1.49,0.65 2.31,-0.01 3.22,-1.31 1.52,0.06 3.19,-0.54 -1.44,2.18 -1.54,0.86 0.27,2.52 -1.06,4.12 z",SZ:"m 565.43,540.99 -0.57,1.39 -1.64,0.33 -1.68,-1.69 -0.02,-1.08 0.76,-1.17 0.27,-0.9 0.81,-0.22 1.41,0.57 0.42,1.39 z",TD:"m 516.15,427.51 0.28,-1.34 -1.8,-0.07 0.01,-1.85 -1.17,-1.06 1.21,-3.8 3.58,-2.74 0.14,-3.79 1.08,-5.98 0.61,-1.28 -1.16,-1.02 -0.05,-0.95 -1.05,-0.78 -0.69,-4.67 2.83,-1.66 11.19,5.77 11.18,5.7 0.14,11.61 -2.42,-0.2 -1.28,2.13 -0.74,1.78 0.58,0.67 -0.92,0.88 0.32,1.18 -0.73,1.2 -0.28,1.05 0.99,-0.17 0.58,1.1 0.03,1.66 1.03,0.83 -0.03,0.69 -1.77,0.49 -1.43,1.14 -2.02,3.09 -2.64,1.31 -2.71,-0.18 -0.79,0.26 0.28,0.99 -1.47,0.99 -1.19,1.1 -3.53,1.07 -0.7,-0.63 -0.46,-0.06 -0.52,0.72 -2.32,0.22 0.44,-0.77 -0.88,-1.93 -0.4,-1.17 -1.22,-0.48 -1.65,-1.65 0.61,-1.33 1.28,0.28 0.79,-0.2 1.56,0.03 -1.52,-2.57 0.1,-1.89 -0.19,-1.89 z",TF:"m 668.79,619.28 1.8,1.33 2.65,0.54 0.1,0.81 -0.78,1.96 -4.31,0.28 -0.07,-2.29 0.42,-1.76 z",TG:"m 480.73,446.5 -2.25,0.59 -0.63,-0.98 -0.75,-1.78 -0.22,-1.4 0.62,-2.53 -0.7,-1.03 -0.27,-2.22 0,-2.05 -1.17,-1.46 0.21,-0.89 2.46,0.06 -0.36,1.5 0.85,0.83 0.98,0.99 0.1,1.39 0.57,0.58 -0.13,6.46 z",TH:"m 763.14,429.43 -2.52,-1.31 -2.4,0.06 0.41,-2.25 -2.47,0.02 -0.22,3.14 -1.51,4.15 -0.91,2.5 0.19,2.05 1.82,0.09 1.14,2.57 0.51,2.43 1.56,1.61 1.7,0.33 1.45,1.45 -0.91,1.15 -1.86,0.34 -0.22,-1.44 -2.28,-1.23 -0.49,0.5 -1.11,-1.07 -0.48,-1.39 -1.49,-1.59 -1.36,-1.33 -0.46,1.65 -0.53,-1.56 0.31,-1.76 0.82,-2.71 1.36,-2.91 1.54,-2.65 -1.1,-2.6 0.05,-1.33 -0.32,-1.6 -1.87,-2.28 -0.67,-1.45 0.97,-0.53 1.02,-2.52 -1.14,-1.92 -1.78,-2.13 -1.36,-2.57 1.18,-0.53 1.28,-3.19 1.98,-0.14 1.64,-1.28 1.6,-0.69 1.22,0.92 0.16,1.78 1.89,0.13 -0.69,3.11 0.07,2.62 2.95,-1.74 0.84,0.51 1.65,-0.08 0.56,-1.02 2.12,0.2 2.13,2.38 0.18,2.87 2.27,2.53 -0.13,2.44 -0.91,1.3 -2.63,-0.41 -3.62,0.55 -1.8,2.38 z",
TJ:"m 674.62,340.87 -1.03,1.13 -3.05,-0.61 -0.27,2.1 3.04,-0.28 3.47,1.17 5.3,-0.55 0.71,3.33 0.92,-0.36 1.7,0.81 -0.09,1.38 0.42,2.01 -2.9,0 -1.93,-0.26 -1.74,1.57 -1.25,0.34 -0.98,0.74 -1.11,-1.15 0.27,-2.95 -0.85,-0.17 0.3,-1.09 -1.51,-0.8 -1.21,1.23 -0.3,1.43 -0.43,0.52 -1.68,-0.07 -0.9,1.6 -0.95,-0.67 -2.03,1.12 -0.85,-0.42 1.57,-3.57 -0.6,-2.66 -2.06,-0.86 0.73,-1.59 2.34,0.17 1.33,-2.01 0.89,-2.35 3.75,-0.86 -0.58,1.71 0.4,1.02 z",TL:"m 825.9,488.5 0.33,-0.66 2.41,-0.63 1.96,-0.1 0.87,-0.35 1.06,0.35 -1.03,0.76 -2.92,1.23 -2.35,0.82 -0.05,-0.86 z",TM:"m 647.13,357.15 -0.25,-2.91 -2.09,-0.12 -3.2,-3.09 -2.24,-0.39 -3.1,-1.79 -2,-0.33 -1.23,0.66 -1.87,-0.1 -1.99,2.02 -2.47,0.68 -0.52,-2.49 0.41,-3.73 -2.19,-1.22 0.72,-2.48 -1.86,-0.22 0.62,-3.09 2.64,0.91 2.47,-1.19 -2.05,-2.23 -0.8,-2.14 -2.26,0.96 -0.28,2.73 -0.88,-2.41 1.24,-1.25 3.18,-0.79 1.9,1.06 1.96,2.93 1.44,-0.18 3.16,-0.05 -0.46,-1.88 2.4,-1.3 2.36,-2.2 3.78,2 0.3,2.99 1.07,0.77 3.03,-0.17 0.94,0.67 1.38,3.79 3.21,2.51 1.83,1.69 2.93,1.75 3.73,1.52 -0.08,2.16 -0.84,-0.11 -1.33,-0.94 -0.44,1.25 -2.36,0.68 -0.56,2.79 -1.58,1.05 -2.21,0.52 -0.59,1.55 -2.11,0.46 z",TN:"m 502.09,374.94 -1.2,-5.86 -1.72,-1.33 -0.03,-0.81 -2.29,-1.98 -0.25,-2.53 1.73,-1.88 0.66,-2.82 -0.45,-3.28 0.57,-1.79 3.06,-1.41 1.96,0.42 -0.08,1.77 2.38,-1.29 0.2,0.67 -1.41,1.71 -0.01,1.6 0.97,0.85 -0.37,2.96 -1.85,1.71 0.53,1.83 1.45,0.06 0.71,1.59 1.07,0.52 -0.16,2.55 -1.37,0.95 -0.86,1.05 -1.93,1.26 0.3,1.35 -0.24,1.38 z",TR:"m 579,336.85 4.02,1.43 3.27,-0.57 2.41,0.33 3.31,-1.94 2.99,-0.18 2.7,1.83 0.48,1.3 -0.27,1.79 2.08,0.91 1.1,1.06 -1.92,1.03 0.88,4.11 -0.55,1.1 1.53,2.82 -1.34,0.59 -0.98,-0.89 -3.26,-0.45 -1.2,0.55 -3.19,0.54 -1.51,-0.06 -3.23,1.31 -2.31,0.01 -1.49,-0.66 -3.09,0.97 -0.92,-0.68 -0.15,1.94 -0.75,0.76 -0.75,0.76 -1.03,-1.57 1.06,-1.3 -1.71,0.3 -2.35,-0.8 -1.93,2 -4.26,0.39 -2.27,-1.86 -3.02,-0.12 -0.65,1.44 -1.94,0.41 -2.71,-1.85 -3.06,0.06 -1.66,-3.48 -2.05,-1.96 1.36,-2.78 -1.78,-1.72 3.11,-3.48 4.32,-0.15 1.18,-2.81 5.34,0.49 3.37,-2.42 3.27,-1.06 4.64,-0.08 4.91,2.64 z m -27.25,2.39 -2.34,1.98 -0.88,-1.71 0.04,-0.76 0.67,-0.41 0.87,-2.33 -1.37,-0.99 2.86,-1.18 2.41,0.5 0.33,1.44 2.45,1.2 -0.51,0.91 -3.33,0.2 -1.2,1.15 z",TT:"m 302.56,433.49 1.61,-0.37 0.59,0.1 -0.11,2.11 -2.34,0.31 -0.51,-0.25 0.82,-0.78 z",TW:"m 816.95,393.52 -1.69,4.87 -1.2,2.48 -1.48,-2.55 -0.32,-2.25 1.65,-3 2.25,-2.32 1.28,0.91 z",TZ:"m 570.56,466.28 0.48,0.31 10.16,5.67 0.2,1.62 4.02,2.79 -1.29,3.45 0.16,1.59 1.8,1.02 0.08,0.73 -0.77,1.7 0.16,0.85 -0.18,1.35 0.98,1.76 1.16,2.79 1.02,0.62 -2.23,1.64 -3.06,1.1 -1.68,-0.04 -1,0.85 -1.95,0.07 -0.74,0.36 -3.37,-0.8 -2.11,0.23 -0.78,-3.86 -0.95,-1.32 -0.57,-0.78 -2.74,-0.52 -1.6,-0.85 -1.78,-0.47 -1.12,-0.48 -1.17,-0.71 -1.51,-3.55 -1.63,-1.57 -0.56,-1.62 0.28,-1.46 -0.5,-2.57 1.16,-0.13 1.01,-1.01 1.1,-1.46 0.69,-0.58 -0.03,-0.91 -0.6,-0.63 -0.16,-1.1 0.8,-0.35 0.17,-1.64 -1.12,-1.57 0.99,-0.34 3.07,0.04 z",UA:"m 564.63,292.74 1.04,0.19 0.71,-1.04 0.85,0.23 2.91,-0.44 1.79,2.57 -0.7,0.92 0.23,1.39 2.24,0.21 1,1.93 -0.06,0.87 3.56,1.54 2.15,-0.69 1.73,2.04 1.64,-0.04 4.13,1.4 0.03,1.27 -1.13,2.23 0.61,2.33 -0.44,1.39 -2.71,0.31 -1.44,1.16 -0.09,1.83 -2.24,0.33 -1.87,1.32 -2.62,0.21 -2.42,1.52 -1.32,1.03 1.49,1.47 1.37,0.96 2.86,-0.24 -0.55,1.42 -3.07,0.68 -3.81,2.27 -1.55,-0.79 0.61,-1.85 -3.06,-1.16 0.5,-0.77 3.16,-1.63 -0.4,-0.81 -0.45,0.41 -0.44,-0.22 -4.36,-1.02 -0.19,-1.51 -2.6,0.5 -1.04,2.23 -2.17,2.95 -1.28,-0.68 -1.31,0.64 -1.25,-0.73 0.7,-0.44 0.49,-1.37 0.77,-1.29 -0.2,-0.72 0.59,-0.32 0.27,0.56 1.66,0.11 0.74,-0.29 -0.52,-0.42 0.19,-0.6 -0.98,-1.04 -0.4,-1.72 -1.02,-0.67 0.2,-1.41 -1.27,-1.12 -1.15,-0.16 -2.07,-1.31 -1.86,0.42 -0.67,0.62 -1.18,-0.01 -0.71,0.98 -2.07,0.4 -0.95,0.64 -1.31,-1.01 -1.79,-0.02 -1.74,-0.46 -1.21,0.89 -0.2,-1.12 -1.55,-1.14 0.55,-1.71 0.77,-1.1 0.62,0.24 -0.73,-1.92 2.55,-3.61 1.39,-0.51 0.3,-1.24 -1.41,-3.89 1.34,-0.17 1.54,-1.23 2.17,-0.1 2.83,0.36 3.13,1.08 2.21,0.09 1.05,0.65 1.05,-0.78 0.74,1.05 2.53,-0.22 1.11,0.43 0.19,-2.26 0.86,-1 z",UG:"m 564.85,466.5 -3.07,-0.04 -0.99,0.34 -1.67,0.86 -0.68,-0.29 0.02,-2.1 0.65,-1.06 0.16,-2.24 0.59,-1.29 1.07,-1.46 1.08,-0.74 0.9,-0.99 -1.12,-0.37 0.17,-3.26 1.15,-0.77 1.78,0.63 2.26,-0.65 1.97,0 1.73,-1.28 1.33,1.94 0.33,1.4 1.23,3.2 -1.02,2.03 -1.38,1.84 -0.8,1.13 0.02,2.95 z",US:"m 109.5,280.05 0,0 -1.54,-1.83 -2.47,-1.57 -0.79,-4.36 -3.61,-4.13 -1.51,-4.94 -2.69,-0.34 -4.46,-0.13 -3.29,-1.54 -5.8,-5.64 -2.68,-1.05 -4.9,-1.99 -3.88,0.48 -5.51,-2.59 -3.33,-2.43 -3.11,1.21 0.58,3.93 -1.55,0.36 -3.24,1.16 -2.47,1.86 -3.11,1.16 -0.4,-3.24 1.26,-5.53 2.98,-1.77 -0.77,-1.46 -3.57,3.22 -1.91,3.77 -4.04,3.95 2.05,2.65 -2.65,3.85 -3.01,2.21 -2.81,1.59 -0.69,2.29 -4.38,2.63 -0.89,2.36 -3.28,2.13 -1.92,-0.38 -2.62,1.38 -2.85,1.67 -2.33,1.63 -4.81,1.38 -0.44,-0.81 3.07,-2.27 2.74,-1.51 2.99,-2.71 3.48,-0.56 1.38,-2.06 3.89,-3.05 0.63,-1.03 2.07,-1.83 0.48,-4 1.43,-3.17 -3.23,1.64 -0.9,-0.93 -1.52,1.95 -1.83,-2.73 -0.76,1.94 -1.05,-2.7 -2.8,2.17 -1.72,0 -0.24,-3.23 0.51,-2.02 -1.81,-1.98 -3.65,1.07 -2.37,-2.63 -1.92,-1.36 -0.01,-3.25 -2.16,-2.48 1.08,-3.41 2.29,-3.37 1,-3.15 2.27,-0.45 1.92,0.99 2.26,-3.01 2.04,0.54 2.14,-1.96 -0.52,-2.92 -1.57,-1.16 2.08,-2.52 -1.72,0.07 -2.98,1.43 -0.85,1.43 -2.21,-1.43 -3.97,0.73 -4.11,-1.56 -1.18,-2.65 -3.55,-3.91 3.94,-2.87 6.25,-3.41 h 2.31 l -0.38,3.48 5.92,-0.27 -2.28,-4.34 -3.45,-2.72 -1.99,-3.64 -2.69,-3.17 -3.85,-2.38 1.57,-4.03 4.97,-0.25 3.54,-3.58 0.67,-3.92 2.86,-3.91 2.73,-0.95 5.31,-3.76 2.58,0.57 4.31,-4.61 4.24,1.83 2.03,3.87 1.25,-1.65 4.74,0.51 -0.17,1.95 4.29,1.43 2.86,-0.84 5.91,2.64 5.39,0.78 2.16,1.07 3.73,-1.34 4.25,2.46 3.05,1.13 -0.02,27.65 -0.01,35.43 2.76,0.17 2.73,1.56 1.96,2.44 2.49,3.6 2.73,-3.05 2.81,-1.79 1.49,2.85 1.89,2.23 2.57,2.42 1.75,3.79 2.87,5.88 4.77,3.2 0.08,3.12 -1.6,2.32 z m 175.93,34.43 -1.25,-1.19 -1.88,0.7 -0.93,-1.08 -2.14,3.1 -0.86,3.15 -1,1.82 -1.19,0.62 -0.9,0.2 -0.28,0.98 -5.17,0 -4.26,0.03 -1.27,0.73 -2.87,2.73 0.29,0.54 0.17,1.51 -2.1,1.27 -2.3,-0.32 -2.2,-0.14 -1.33,0.44 0.25,1.15 0,0 0.05,0.37 -2.42,2.27 -2.11,1.09 -1.44,0.51 -1.66,1.03 -2.03,0.5 -1.4,-0.19 -1.73,-0.77 0.96,-1.45 0.62,-1.32 1.32,-2.09 -0.14,-1.57 -0.5,-2.24 -1.04,-0.39 -1.74,1.7 -0.56,-0.03 -0.14,-0.97 1.54,-1.56 0.26,-1.79 -0.23,-1.79 -2.08,-1.55 -2.38,-0.8 -0.39,1.52 -0.62,0.4 -0.5,1.95 -0.26,-1.33 -1.12,0.95 -0.7,1.32 -0.73,1.92 -0.14,1.64 0.93,2.38 -0.08,2.51 -1.14,1.84 -0.57,0.52 -0.76,0.41 -0.95,0.02 -0.26,-0.25 -0.76,-1.98 -0.02,-0.98 0.08,-0.94 -0.35,-1.87 0.53,-2.18 0.63,-2.71 1.46,-3.03 -0.42,0.01 -2.06,2.54 -0.38,-0.46 1.1,-1.42 1.67,-2.57 1.91,-0.36 2.19,-0.8 2.21,0.42 0.09,0.02 2.47,-0.36 -1.4,-1.61 -0.75,-0.13 -0.86,-0.16 -0.59,-1.14 -2.75,0.36 -2.49,0.9 -1.97,-1.55 -1.59,-0.52 0.9,-2.17 -2.48,1.37 -2.25,1.33 -2.16,1.04 -1.72,-1.4 -2.81,0.85 0.01,-0.6 1.9,-1.73 1.99,-1.65 2.86,-1.37 -3.45,-1.09 -2.27,0.55 -2.72,-1.3 -2.86,-0.67 -1.96,-0.26 -0.87,-0.72 -0.5,-2.35 -0.95,0.02 -0.01,1.64 -5.8,0 -9.59,0 -9.53,0 -8.42,0 h -8.41 -8.27 -8.55 -2.76 -8.32 -7.96 l 0.95,3.47 0.45,3.41 -0.69,1.09 -1.49,-3.91 -4.05,-1.42 -0.34,0.82 0.82,1.94 0.89,3.53 0.51,5.42 -0.34,3.59 -0.34,3.54 -1.1,3.61 0.9,2.9 0.1,3.2 -0.61,3.05 1.49,1.99 0.39,2.95 2.17,2.99 1.24,1.17 -0.1,0.82 2.34,4.85 2.72,3.45 0.34,1.87 0.71,0.55 2.6,0.33 1,0.91 1.57,0.17 0.31,0.96 1.31,0.4 1.82,1.92 0.47,1.7 3.19,-0.25 3.56,-0.36 -0.26,0.65 4.23,1.6 6.4,2.31 5.58,-0.02 2.22,0 0.01,-1.35 4.86,0 1.02,1.16 1.43,1.03 1.67,1.43 0.93,1.69 0.7,1.77 1.45,0.97 2.33,0.96 1.77,-2.53 2.29,-0.06 1.98,1.28 1.41,2.18 0.97,1.86 1.65,1.8 0.62,2.19 0.79,1.47 2.19,0.96 1.99,0.68 1.09,-0.09 -0.53,-1.06 -0.14,-1.5 0.03,-2.16 0.65,-1.42 1.53,-1.51 2.79,-1.37 2.55,-2.37 2.36,-0.75 1.74,-0.23 2.04,0.74 2.45,-0.4 2.09,1.69 2.03,0.1 1.05,-0.61 1.04,0.47 0.53,-0.42 -0.6,-0.63 0.05,-1.3 -0.5,-0.86 1.16,-0.5 2.14,-0.22 2.49,0.36 3.17,-0.41 1.76,0.8 1.36,1.5 0.5,0.16 2.83,-1.46 1.09,0.49 2.19,2.68 0.79,1.75 -0.58,2.1 0.42,1.23 1.3,2.4 1.49,2.68 1.07,0.71 0.44,1.35 1.38,0.37 0.84,-0.39 0.7,-1.89 0.12,-1.21 0.09,-2.1 -1.33,-3.65 -0.02,-1.37 -1.25,-2.25 -0.94,-2.75 -0.5,-2.25 0.43,-2.31 1.32,-1.94 1.58,-1.57 3.08,-2.16 0.4,-1.12 1.42,-1.23 1.4,-0.22 1.84,-1.98 2.9,-1.01 1.78,-2.53 -0.39,-3.46 -0.29,-1.21 -0.8,-0.24 -0.12,-3.35 -1.93,-1.14 1.85,0.56 -0.6,-2.26 0.54,-1.55 0.33,2.97 1.43,1.36 -0.87,2.4 0.26,0.14 1.58,-2.81 0.9,-1.38 -0.04,-1.35 -0.7,-0.64 -0.58,-1.94 0.92,0.9 0.62,0.19 0.21,0.92 2.04,-2.78 0.61,-2.62 -0.83,-0.17 0.85,-1.02 -0.08,0.45 1.79,-0.01 3.93,-1.11 -0.83,-0.7 -4.12,0.7 2.34,-1.07 1.63,-0.18 1.22,-0.19 2.07,-0.65 1.35,0.07 1.89,-0.61 0.22,-1.07 -0.84,-0.84 0.29,1.37 -1.16,-0.09 -0.93,-1.99 0.03,-2.01 0.48,-0.86 1.48,-2.28 2.96,-1.15 2.88,-1.34 2.99,-1.9 -0.48,-1.29 -1.83,-2.25 -0.03,-5.56 z m -239.56,-50.44 -1.5,0.8 -2.55,1.86 0.43,2.42 1.43,1.32 2.8,-1.95 2.43,-2.47 -1.19,-1.63 -1.85,-0.35 z m -45.62,-28.57 2.04,-1.26 0.23,-0.68 -2.27,-0.67 v 2.61 z m 8.5,15.37 -2.77,0.97 1.7,1.52 1.84,1.04 1.72,-0.87 -0.27,-2.15 -2.22,-0.51 z m 97.35,32.5 -2.69,0.38 -1.32,-0.62 -0.17,1.52 0.52,2.07 1.42,1.46 1.04,2.13 1.69,2.1 1.12,0.01 -2.44,-3.7 0.83,-5.35 z m -68.72,120.68 -1,-0.28 -0.27,0.26 0.02,0.19 0.32,0.24 0.48,0.63 0.94,-0.21 0.23,-0.36 -0.72,-0.47 z m -2.99,-0.54 1.5,0.09 0.09,-0.32 -1.38,-0.13 -0.21,0.36 z m 5.89,3.29 -0.5,-0.26 -1.07,-0.5 -0.21,-0.06 -0.16,0.28 0.19,0.58 -0.49,0.48 -0.14,0.33 0.46,1.08 -0.08,0.83 0.7,0.42 0.41,-0.49 0.9,-0.46 1.1,-0.63 0.07,-0.16 -0.71,-1.04 -0.47,-0.4 z m -7.86,-5.14 -0.75,0.41 0.11,0.12 0.36,0.68 0.98,0.11 0.2,0.04 0.15,-0.17 -0.81,-0.99 -0.24,-0.2 z m -4.4,-1.56 -0.43,0.3 -0.15,0.22 0.94,0.55 0.33,-0.3 -0.06,-0.7 -0.63,-0.07 z",UY:"m 313.93,552.04 1.82,-0.34 2.81,2.5 1.04,-0.09 2.89,2.08 2.2,1.82 1.62,2.25 -1.24,1.57 0.78,1.9 -1.21,2.12 -3.17,1.88 -2.07,-0.68 -1.52,0.37 -2.59,-1.46 -1.9,0.11 -1.71,-1.87 0.22,-2.16 0.61,-0.74 -0.03,-3.3 0.75,-3.37 z",UZ:"m 662.01,351.2 0.08,-2.16 -3.73,-1.52 -2.93,-1.75 -1.83,-1.69 -3.21,-2.51 -1.38,-3.79 -0.94,-0.67 -3.03,0.17 -1.07,-0.77 -0.3,-2.99 -3.78,-2 -2.36,2.2 -2.4,1.3 0.46,1.88 -3.16,0.05 -0.11,-14.13 7.22,-2.35 0.52,0.35 4.35,2.84 2.29,1.48 2.68,3.5 3.29,-0.56 4.81,-0.3 3.35,2.8 -0.21,3.8 1.37,0.03 0.57,3.06 3.57,0.12 0.76,1.75 1.05,-0.02 1.23,-2.65 3.69,-2.61 1.61,-0.7 0.83,0.37 -2.35,2.43 2.07,1.4 2,-0.93 3.32,1.96 -3.59,2.64 -2.13,-0.36 -1.16,0.1 -0.4,-1.02 0.58,-1.71 -3.75,0.86 -0.89,2.35 -1.33,2.01 -2.34,-0.17 -0.73,1.59 2.06,0.86 0.6,2.66 -1.57,3.57 -2.12,-0.74 z",VE:"m 275.5,430.6 -0.08,0.67 -1.65,0.33 0.92,1.29 -0.04,1.49 -1.23,1.64 1.06,2.24 1.21,-0.18 0.63,-2.04 -0.87,-1 -0.14,-2.14 3.49,-1.16 -0.39,-1.34 0.98,-0.9 1.01,2 1.97,0.05 1.82,1.58 0.11,0.94 2.51,0.02 3,-0.29 1.61,1.27 2.14,0.35 1.57,-0.88 0.03,-0.72 3.48,-0.17 3.36,-0.04 -2.38,0.84 0.95,1.34 2.25,0.21 2.12,1.39 0.45,2.26 1.46,-0.07 1.1,0.67 -2.22,1.65 -0.25,1.03 0.96,1.04 -0.69,0.52 -1.73,0.45 0.06,1.3 -0.76,0.77 1.89,2.12 0.38,0.79 -1.03,1.07 -3.14,1.04 -2.01,0.44 -0.81,0.66 -2.23,-0.7 -2.08,-0.36 -0.52,0.26 1.25,0.72 -0.11,1.87 0.39,1.76 2.37,0.24 0.16,0.58 -2.01,0.8 -0.32,1.18 -1.16,0.45 -2.08,0.65 -0.54,0.86 -2.18,0.18 -1.55,-1.48 -0.85,-2.77 -0.75,-0.98 -1.02,-0.61 1.42,-1.39 -0.09,-0.63 -0.8,-0.83 -0.56,-1.85 0.22,-2.01 0.62,-0.94 0.51,-1.5 -0.99,-0.49 -1.6,0.32 -2.02,-0.15 -1.13,0.3 -1.98,-2.41 -1.63,-0.36 -3.6,0.27 -0.67,-0.98 -0.69,-0.23 -0.1,-0.59 0.33,-1.04 -0.22,-1.13 -0.62,-0.62 -0.36,-1.3 -1.44,-0.18 0.77,-1.66 0.35,-2.01 0.81,-1.06 1.09,-0.81 0.71,-1.42 z",VN:"m 778.46,402.12 -3.74,2.56 -2.34,2.81 -0.62,2.05 2.15,3.09 2.62,3.82 2.54,1.79 1.71,2.33 1.28,5.32 -0.38,5.02 -2.33,1.87 -3.22,1.83 -2.28,2.36 -3.5,2.62 -1.02,-1.81 0.79,-1.91 -2.08,-1.61 2.43,-1.14 2.94,-0.2 -1.23,-1.73 4.71,-2.19 0.35,-3.42 -0.65,-1.92 0.51,-2.88 -0.71,-2.04 -2.12,-2.02 -1.77,-2.57 -2.33,-3.46 -3.36,-1.76 0.81,-1.07 1.79,-0.77 -1.09,-2.59 -3.45,-0.03 -1.26,-2.72 -1.64,-2.37 1.51,-0.74 2.23,0.02 2.73,-0.35 2.39,-1.62 1.35,1.14 2.57,0.55 -0.45,1.74 1.34,1.22 z",VU:"m 946.12,510.15 -0.92,0.38 -0.94,-1.27 0.1,-0.78 1.76,1.67 z m -2.07,-4.44 0.46,2.33 -0.75,-0.36 -0.58,0.16 -0.4,-0.8 -0.06,-2.21 1.33,0.88 z",YE:"m 624.41,416.58 -2.03,0.79 -0.54,1.28 -0.07,0.99 -2.79,1.22 -4.48,1.35 -2.51,2.03 -1.23,0.15 -0.84,-0.17 -1.64,1.2 -1.79,0.55 -2.35,0.15 -0.71,0.16 -0.61,0.75 -0.74,0.21 -0.43,0.73 -1.39,-0.06 -0.9,0.38 -1.94,-0.14 -0.73,-1.67 0.08,-1.57 -0.45,-0.85 -0.55,-2.12 -0.81,-1.19 0.56,-0.14 -0.29,-1.32 0.34,-0.56 -0.12,-1.26 1.23,-0.93 -0.29,-1.23 0.75,-1.43 1.15,0.76 0.76,-0.27 3.23,-0.07 0.52,0.3 2.71,0.29 1.07,-0.15 0.7,0.97 1.31,-0.48 2.01,-3.07 2.62,-1.32 8.08,-1.13 2.2,4.84 z",ZA:"m 563.88,548.96 -0.55,0.46 -1.19,1.63 -0.78,1.66 -1.59,2.33 -3.17,3.38 -1.98,1.98 -2.12,1.51 -2.93,1.3 -1.43,0.17 -0.36,0.93 -1.7,-0.5 -1.39,0.64 -3.04,-0.65 -1.7,0.41 -1.16,-0.18 -2.89,1.33 -2.39,0.54 -1.73,1.28 -1.28,0.08 -1.19,-1.21 -0.95,-0.06 -1.21,-1.51 -0.13,0.47 -0.37,-0.91 0.02,-1.96 -0.91,-2.23 0.9,-0.6 -0.07,-2.53 -1.84,-3.05 -1.41,-2.74 0,-0.01 -2.01,-4.15 1.34,-1.57 1.11,0.87 0.47,1.36 1.26,0.23 1.76,0.6 1.51,-0.23 2.5,-1.63 0,-11.52 0.76,0.46 1.66,2.93 -0.26,1.89 0.63,1.1 2.01,-0.32 1.4,-1.39 1.33,-0.93 0.69,-1.48 1.37,-0.72 1.18,0.38 1.34,0.87 2.28,0.15 1.79,-0.72 0.28,-0.96 0.49,-1.47 1.53,-0.25 0.84,-1.15 0.93,-2.03 2.52,-2.26 3.97,-2.22 1.14,0.03 1.36,0.51 0.94,-0.36 1.49,0.3 1.34,4.26 0.73,2.17 -0.5,3.43 0.24,1.11 -1.42,-0.57 -0.81,0.22 -0.26,0.9 -0.77,1.17 0.03,1.08 1.67,1.7 1.64,-0.34 0.57,-1.39 2.13,0.03 -0.7,2.28 -0.33,2.62 -0.73,1.43 -1.9,1.62 z m -7.13,-0.96 -1.22,-0.98 -1.31,0.65 -1.52,1.25 -1.5,2.03 2.1,2.48 1,-0.32 0.52,-1.03 1.56,-0.5 0.48,-1.05 0.86,-1.56 -0.97,-0.97 z",ZM:"m 567.36,489.46 1.32,1.26 0.71,2.4 -0.48,0.77 -0.56,2.3 0.54,2.36 -0.88,0.99 -0.85,2.66 1.47,0.74 -8.51,2.38 0.27,2.05 -2.13,0.4 -1.59,1.15 -0.34,1.01 -1.01,0.22 -2.44,2.4 -1.55,1.89 -0.95,0.07 -0.91,-0.34 -3.13,-0.32 -0.5,-0.22 -0.03,-0.24 -1.1,-0.66 -1.82,-0.17 -2.3,0.67 -1.83,-1.82 -1.89,-2.38 0.13,-9.16 5.84,0.04 -0.24,-0.99 0.42,-1.07 -0.49,-1.33 0.32,-1.38 -0.3,-0.88 0.97,0.07 0.16,0.88 1.31,-0.07 1.78,0.26 0.94,1.29 2.24,0.4 1.72,-0.9 0.63,1.49 2.15,0.4 1.03,1.22 1.15,1.57 2.15,0.03 -0.24,-3.08 -0.77,0.51 -1.96,-1.1 -0.76,-0.51 0.35,-2.85 0.5,-3.35 -0.63,-1.25 0.8,-1.8 0.75,-0.33 3.77,-0.48 1.1,0.29 1.17,0.71 1.12,0.48 1.78,0.47 z",ZW:"m 562.96,527.25 -1.49,-0.3 -0.95,0.36 -1.35,-0.51 -1.14,-0.03 -1.79,-1.36 -2.17,-0.46 -0.82,-1.9 -0.01,-1.05 -1.2,-0.32 -3.17,-3.25 -0.89,-1.71 -0.56,-0.52 -1.08,-2.35 3.13,0.32 0.91,0.34 0.95,-0.07 1.55,-1.89 2.44,-2.4 1.01,-0.22 0.34,-1.01 1.59,-1.15 2.13,-0.4 0.18,1.08 2.34,-0.06 1.3,0.61 0.6,0.72 1.34,0.21 1.45,0.94 0.01,3.69 -0.55,2.04 -0.12,2.2 0.45,0.88 -0.31,1.74 -0.43,0.27 -0.74,2.15 z"}}}}),b});                                                                                                                                                                                                                                                                                                         -linear-gradient(top,#f9f9f9,#e5e5e5);background-image:linear-gradient(to bottom,#f9f9f9,#e5e5e5);box-shadow:inset 0 1px #efefef,0 1px 1px #cdcdcd}select:enabled:hover:after,select.hover:after,.panel-select:enabled:hover:after,.panel-select.hover:after{border-left:1px solid #f8f7f8;border-right:1px solid #f8f7f8;background:#a7a7a7}select.selected,.panel-select.selected{background-image:-webkit-linear-gradient(top,#8f8f8f,#8f8f8f);background-image:linear-gradient(to bottom,#8f8f8f,#8f8f8f);box-shadow:inset 0 0 0 1px #7e7e7e,0 1px 1px #cdcdcd}select.selected:after,.panel-select.selected:after{border-left:1px solid #c7c6c7;border-right:1px solid #c7c6c7;background:#767676}select.selected:hover,.panel-select.selected:hover{background-image:-webkit-linear-gradient(top,#9c9c9c,#9c9c9c);background-image:linear-gradient(to bottom,#9c9c9c,#9c9c9c);box-shadow:inset 0 1px #969696,0 1px 1px #cdcdcd}select.selected:hover:after,.panel-select.selected:hover:after{border-left:1px solid #cecdce;border-right:1px solid #cecdce;background:#7c7c7c}input[type=text],input[type=search]{-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;-o-appearance:none;appearance:none;line-height:22px;height:22px;font-size:10px;color:#000;background-color:#fff;box-shadow:0 1px 1px #cdcdcd;border:1px solid #5d5d5d;outline:0}input[type=text]:focus,input[type=search]:focus{box-shadow:0 0 0 1px #2141cc}input[type=text]:disabled{opacity:.5;pointer-events:none}input[type=search]::-webkit-search-results-decoration{margin-right:2px}input[type=search]::-webkit-search-cancel-button{margin-right:3px}input[type=search]:focus::-webkit-input-placeholder{color:#a8a8a8}input[type=search]:disabled{opacity:.5;pointer-events:none}::-webkit-input-placeholder{color:rgba(0,0,0,.4)}::-webkit-scrollbar{width:14px;height:14px;background:#909090}::-webkit-scrollbar:vertical{border-left:1px solid #5d5d5d;border-top:1px solid #5d5d5d;border-bottom:1px solid #5d5d5d}::-webkit-scrollbar:vertical:disabled{background:transparent;border:0}::-webkit-scrollbar:horizontal{border-top:1px solid #5d5d5d;border-left:1px solid #5d5d5d;border-right:1px solid #5d5d5d}::-webkit-scrollbar:horizontal:disabled{background:transparent;border:0}::-webkit-scrollbar-thumb{background:#e1e1e1;background-clip:padding-box}::-webkit-scrollbar-thumb:hover{background:#eee}::-webkit-scrollbar-thumb:vertical{border-left:1px solid #5d5d5d;border-top:1px solid #5d5d5d;border-bottom:1px solid #5d5d5d}::-webkit-scrollbar-thumb:horizontal{border-top:1px solid #5d5d5d;border-left:1px solid #5d5d5d;border-right:1px solid #5d5d5d}::-webkit-scrollbar-button:start:decrement,::-webkit-scrollbar-button:end:increment{display:block;width:14px;height:14px}::-webkit-scrollbar-button:vertical:increment,::-webkit-scrollbar-button:vertical:decrement,::-webkit-scrollbar-button:horizontal:increment,::-webkit-scrollbar-button:horizontal:decrement{background-size:10px 10px;background-position:center;background-repeat:no-repeat}::-webkit-scrollbar-button:vertical:increment:hover,::-webkit-scrollbar-button:vertical:decrement:hover,::-webkit-scrollbar-button:horizontal:increment:hover,::-webkit-scrollbar-button:horizontal:decrement:hover{background-color:#eee}::-webkit-scrollbar-button:vertical:increment:hover:active,::-webkit-scrollbar-button:vertical:decrement:hover:active,::-webkit-scrollbar-button:horizontal:increment:hover:active,::-webkit-scrollbar-button:horizontal:decrement:hover:active{background-color:inherit}::-webkit-scrollbar-button:vertical:increment{border-left:1px solid #5d5d5d;border-top:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_down_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_down_dark.svg)}::-webkit-scrollbar-button:vertical:increment:hover{border-top:1px solid #5d5d5d}::-webkit-scrollbar-button:vertical:increment:disabled{background:transparent;border:0}::-webkit-scrollbar-button:vertical:decrement{border-left:1px solid #5d5d5d;border-bottom:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_up_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_up_dark.svg)}::-webkit-scrollbar-button:vertical:decrement:hover{border-bottom:1px solid #5d5d5d}::-webkit-scrollbar-button:vertical:decrement:disabled{background:transparent;border:0}::-webkit-scrollbar-button:horizontal:increment{border-top:1px solid #5d5d5d;border-left:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_right_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_right_dark.svg)}::-webkit-scrollbar-button:horizontal:increment:hover{border-left:1px solid #5d5d5d}::-webkit-scrollbar-button:horizontal:increment:disabled{background:transparent;border:0}::-webkit-scrollbar-button:horizontal:decrement{border-top:1px solid #5d5d5d;border-right:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_left_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_left_dark.svg)}::-webkit-scrollbar-button:horizontal:decrement:hover