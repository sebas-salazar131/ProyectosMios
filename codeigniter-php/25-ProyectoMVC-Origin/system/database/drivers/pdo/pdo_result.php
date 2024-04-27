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
 * @since	Version 2.1.0
 * @filesource
 */
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * PDO Result Class
 *
 * This class extends the parent result class: CI_DB_result
 *
 * @package		CodeIgniter
 * @subpackage	Drivers
 * @category	Database
 * @author		EllisLab Dev Team
 * @link		https://codeigniter.com/userguide3/database/
 */
class CI_DB_pdo_result extends CI_DB_result {

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
		elseif (count($this->result_array) > 0)
		{
			return $this->num_rows = count($this->result_array);
		}
		elseif (count($this->result_object) > 0)
		{
			return $this->num_rows = count($this->result_object);
		}
		elseif (($num_rows = $this->result_id->rowCount()) > 0)
		{
			return $this->num_rows = $num_rows;
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
		return $this->result_id->columnCount();
	}

	// --------------------------------------------------------------------

	/**
	 * Fetch Field Names
	 *
	 * Generates an array of column names
	 *
	 * @return	bool
	 */
	public function list_fields()
	{
		$field_names = array();
		for ($i = 0, $c = $this->num_fields(); $i < $c; $i++)
		{
			// Might trigger an E_WARNING due to not all subdrivers
			// supporting getColumnMeta()
			$field_names[$i] = @$this->result_id->getColumnMeta($i);
			$field_names[$i] = $field_names[$i]['name'];
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
		try
		{
			$retval = array();

			for ($i = 0, $c = $this->num_fields(); $i < $c; $i++)
			{
				$field = $this->result_id->getColumnMeta($i);

				$retval[$i]			= new stdClass();
				$retval[$i]->name		= $field['name'];
				$retval[$i]->type		= isset($field['native_type']) ? $field['native_type'] : null;
				$retval[$i]->max_length		= ($field['len'] > 0) ? $field['len'] : NULL;
				$retval[$i]->primary_key	= (int) ( ! empty($field['flags']) && in_array('primary_key', $field['flags'], TRUE));
			}

			return $retval;
		}
		catch (Exception $e)
		{
			if ($this->db->db_debug)
			{
				return $this->db->display_error('db_unsupported_feature');
			}

			return FALSE;
		}
	}

	// --------------------------------------------------------------------

	/**
	 * Free the result
	 *
	 * @return	void
	 */
	public function free_result()
	{
		if (is_object($this->result_id))
		{
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
		return $this->result_id->fetch(PDO::FETCH_ASSOC);
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
		return $this->result_id->fetchObject($class_name);
	}

}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          oz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center}.panel-dl-empty-top-about{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-moz-box-orient:vertical;box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;background-color:rgba(242,242,242,.1);border-radius:3px;cursor:pointer}.panel-dl-empty-top-about.hover{background-color:rgba(242,242,242,.2)}.panel-dl-empty-title{font-size:14px;font-weight:700;margin-top:10px;margin-bottom:10px}.panel-dl-empty-description{line-height:15px;margin:10px;margin-bottom:5px;opacity:.8;text-align:center;color:#f2f2f2}.panel-dl-empty-library-link{margin-bottom:10px;cursor:pointer;font-weight:700;text-decoration:underline}.panel-dl-empty-adddoccontent-button{margin-top:15px;margin-bottom:10px;font-size:13px;font-weight:500}.panel-dl-empty-middle{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;margin-bottom:5px}.panel-dl-empty-stock-line{-webkit-box-flex:1;-moz-box-flex:1;box-flex:1;-webkit-flex:1 0 auto;-moz-flex:1 0 auto;-ms-flex:1 0 auto;flex:1 0 auto;height:1px;background:#f2f2f2;opacity:.5}.panel-dl-empty-stock-icon{-webkit-box-flex:0;-moz-box-flex:0;box-flex:0;-webkit-flex:0 0 auto;-moz-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;font-size:24px;padding:5px;opacity:.5}.panel-dl-empty-bottom{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-moz-box-orient:vertical;box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;text-align:center;line-height:18px}.panel-dl-nolibs-container{position:fixed;top:56px;left:0;right:0;bottom:24px;overflow:hidden;background:#2f2f2f;border-top:#1b1b1b solid 1px;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center}.panel-dl-nolibs-middle{margin:auto;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-moz-box-orient:vertical;box-orient:vertical;-webkit-flex-direction:column;-moz-flex-direction:column;flex-direction:column;-ms-flex-direction:column;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;font-size:12px}.panel-dl-nolibs-library-icon{font-size:50px;opacity:.2}.panel-dl-nolibs-alert-icon{font-size:50px;opacity:.2}.panel-dl-nolibs-cc-icon,.panel-dl-nolibs-cc-icon-syncing{font-size:50px;opacity:.2}.panel-dl-nolibs-message{font-size:11px;line-height:15px;max-width:200px;text-align:center;opacity:.5}.panel-dl-nolibs-retry-button{margin-top:10px;min-width:60px}.panel-dl-nolibs-create-button{margin-top:20px}.panel-dl-nolibs-create-button-syncing{margin-top:40px}.panel-dl-nolibs-progress-bar{width:170px;margin:10px}.panel-dl-nolibs-link{margin-top:15px;cursor:pointer;font-weight:700;text-decoration:underline}.panel-sync-message-container{position:absolute;right:5px;bottom:24px;background-color:#3a3a3a;border-top:1px solid #1b1b1b;border-left:1px solid #1b1b1b;border-bottom:1px solid #1b1b1b;border-right:1px solid #1b1b1b;box-shadow:0 0 0 1px rgba(0,0,0,.1),5px 5px 10px rgba(0,0,0,.2)}.panel-sync-message{color:#f2f2f2;padding-left:5px;padding-right:5px;font-size:10px;line-height:18px}.panel-ccapp-warning-container{position:absolute;right:4px;bottom:32px}.panel-ccapp-warning-container-box{position:relative;width:220px;padding-top:10px;padding-bottom:10px;padding-left:14px;padding-right:14px;color:#fff;background-color:#2a9af3;border-radius:4px}.panel-ccapp-warning-container-box:after{height:0;width:0;border-color:transparent;border-style:solid;border-width:7px;border-top-color:#2a9af3;content:' ';position:absolute;bottom:-13px;right:30px}.panel-ccapp-warning-message{font-size:13px;font-weight:700}.panel-ccapp-warning-footer{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:justify;-moz-box-pack:justify;box-pack:justify;-webkit-justify-content:space-between;-moz-justify-content:space-between;-ms-justify-content:space-between;-o-justify-content:space-between;justify-content:space-between;-ms-flex-pack:justify;padding-top:10px}.panel-ccapp-warning-button{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;cursor:pointer;font-size:11px;font-weight:700;border:1px solid #fff;border-radius:2px;height:26px;width:93px}.panel-ccapp-warning-button.hover{background-color:#fff;color:#2a9af3}.panel-ccapp-warning-button-icon{cursor:pointer;font-size:18px;padding-right:2px}.panel-dl-contents-quota-message{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;margin-top:10px}.panel-dl-contents-quota-message-icon{font-size:20px;margin-right:10px}.panel-dl-contents-quota-message-text{margin-bottom:5px}.panel-brush-item,.panel-brush-item-selected{width:103px;height:43px;margin-right:2px;margin-bottom:2px;float:left;cursor:pointer;position:relative;border:1px solid #262626}.panel-brush-item-selected{border:2px #262626}.panel-brush-item-img,.panel-brush-item-img-loading{width:100%;height:100%;background-size:contain;background-position:center;background-repeat:no-repeat;background-color:#FFF}.panel-brush-item-img-loading{display:block;opacity:.4}.panel-list-brush-item-img,.panel-list-brush-item-img-loading{width:100%;height:100%;background-size:cover;background-position:center;background-repeat:no-repeat;background-color:#FFF}.panel-list-brush-item-img:hover,.panel-list-brush-item-img.selected,.panel-list-brush-item-img-loading:hover,.panel-list-brush-item-img-loading.selected{background-size:contain}.panel-list-brush-item-thumb{width:32px;height:32px;display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-moz-box-pack:center;box-pack:center;-webkit-justify-content:center;-moz-justify-content:center;-ms-justify-content:center;-o-justify-content:center;justify-content:center;-ms-flex-pack:center;-webkit-flex-shrink:0;-moz-flex-shrink:0;flex-shrink:0;-ms-flex-negative:0;margin-right:10px;border:1px solid #262626}.panel-list-brush-item-thumb:hover,.panel-list-brush-item-thumb.selected{width:82px}.panel-characterstyle-item,.panel-paragraphstyle-item,.panel-textstyle-item{width:68px;height:45px;margin-right:2px;margin-bottom:2px;float:left;cursor:pointer;position:relative;text-align:center;border:1px solid #262626;background:#fff;color:#000}.panel-textstyle-item.disabled-item{background-color:#595959}.panel-textstyle-item-name{text-align:center;font-size:32px;color:#000;background:#fff;line-height:54px}.panel-list-textstyle-item-name{text-align:center;height:30px;width:32px;font-size:20px;color:#000;background:#fff;line-height:28px}.panel-textstyle-color{position:absolute;width:10px;height:6px;top:2px;right:2px}.panel-missing-font-overlay,.panel-missing-font-overlay-list{position:absolute;right:2px;bottom:1px;font-size:14px;z-index:5;color:#FFC20E}.text-missing-rendition-icon{color:#000}.panel-textstyle-list-item-size,.panel-textstyle-list-item-color{-webkit-box-flex:0;-moz-box-flex:0;box-flex:0;-webkit-flex:0 0 auto;-moz-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;font-size:11px;margin-left:5px;margin-right:5px}.panel-textstyle-list-item-color{-webkit-box-flex:0;-moz-box-flex:0;box-4.3 -1.2,-0.2 -3.2,1.6 -1.8,-1.3 -0.5,-1.6 0.9,-2.3 -0.9,-2.2 -1.4,-0.2 -1.2,-1.4 0.3,-1.2 1.7,-1.1 -0.4,-1.3 z",
                    "HN" : "m 167.43,187.59 4.4,-0.5 3.1,0.3 2.2,1.6 -3.2,0.4 -1.8,1.6 -1.9,0.4 -1.1,1.5 -0.4,-0.5 -0.6,-0.3 0.3,-0.8 -3.2,-1.1 0.4,-1.3 z",
                    "MM" : "m 512.93,177.09 0.7,-0.5 -0.1,-1.3 1.2,-0.8 0.2,-3.3 1.5,0.3 1.8,-3.8 0,-1.5 3.2,-1.8 1.2,-1.8 0.4,-0.6 2.2,1.9 0,3.5 -1.9,1.7 -0.1,2.4 1.8,-0.4 0.6,1.8 1.2,0.2 -0.7,1.8 1.5,0.2 0.5,1.3 1.9,-0.3 -0.9,0.5 -1.2,2 -3,1.3 -0.9,-0.3 -1.2,2.6 2.7,4.6 -1.1,2.6 1.7,2.1 0.9,3.7 -1.7,2.8 -0.3,-5.5 -1.5,-3.2 -0.3,-2.8 -0.8,-1.4 -3.4,2.5 -2.4,-0.6 0.8,-2.9 -1.2,-3.7 -1.8,-1.2 z",
                    "GA" : "m 355.03,215.89 3,0 0,-2.3 0,-0.2 3.7,0.3 -0.1,1.7 2.4,0.6 -1.2,2.2 1.2,0.7 -0.7,3.6 -3.2,-1.1 -1.7,0.8 0.5,2.6 -1.3,0.5 -3.6,-4 -1.1,-2.4 1.1,-0.3 0.1,-1.9 z",
                    "GQ" : "m 358.03,213.59 0,2.3 -3,0 -0.8,-0.4 0.8,-2.2 0.4,0.3 z",
                    "NI" : "m 172.23,196.59 -3.7,-3.4 0.6,-0.3 1.1,-1.5 1.9,-0.4 1.8,-1.6 3.2,-0.4 -1.4,7 0.4,0.9 -1.3,-0.1 z",
                    "LV" : "m 388.63,93.89 0.6,1.9 1,1.9 -1.1,0.9 -1.9,0.4 -3.3,-2.1 -0.8,0.5 -4.5,-0.5 -2,1 0,-2.1 1.3,-2 1.7,-0.5 2,2.1 1.4,-0.7 -0.2,-1.7 1.9,-0.6 2.3,1.5 z",
                    "UG" : "m 397.23,219.69 0,-0.1 0,0.1 z m -4.3,0.7 0,-0.9 0.1,-0.8 0.5,-0.6 -0.4,-0.2 0.5,-1.7 1,-0.8 1.8,-1.3 -0.3,-0.5 -1,-0.5 0.2,-2 5.1,-0.5 0.9,-0.9 1.8,3.4 0.1,1.5 -1.8,2.7 -2.7,0.2 -1.6,2.2 -1.8,0 -0.7,0.1 -1,0.8 z",
                    "MW" : "m 403.13,239.59 0,-0.1 0,0 z m -0.3,-0.3 0,0 0,-0.1 0,0.1 z m -0.9,-3 -0.2,-0.2 0,0 z m -0.4,-0.4 0,0 0,0 z m -2.2,-0.2 0.9,0.4 1,0.2 0.8,3.8 0,3.2 1,0.3 1.9,2.2 -0.1,2.7 -1.3,1 -1.7,-1.3 0.2,-2.9 -1.3,0.4 -0.9,-1.1 -0.7,-0.6 1,-2.3 -0.2,-3.2 0.8,-0.5 z",
                    "AM" : "m 425.33,139.79 -0.2,-0.1 -0.5,0.1 -0.7,-1.5 -1.9,-0.3 -2.1,-1 -0.5,-2.2 1.5,-0.3 1.5,-0.1 1.9,2.4 -0.6,0.4 z m -2.8,-4.9 0,0 -0.1,0 0,0.1 z m 0.4,0.2 -0.1,-0.1 0,0 0,0.1 z m 0.5,0.8 0,0 0.1,-0.1 -0.1,0 z",
                    "SX" : "m 419.13,195.79 1.9,2 2.9,-0.8 1.3,0.4 1.8,-1 3,-0.1 0,3.4 -1.9,2.8 -1.9,0 -5.6,-1.9 -2.7,-3.1 0.6,-0.7 z",
                    "TM" : "m 445.53,132.89 1.5,0.6 -0.4,-1.1 1.8,-1.5 2.5,1.1 0.4,2.1 3.6,0.9 0.9,2.3 6.1,3.9 1.8,0.5 -0.1,1.5 -1.4,-0.5 -1.9,1.1 -0.6,1.8 -4.2,2.4 -1.9,-1 -0.2,-2.1 -1.6,-0.1 -2.9,-2.4 -2.8,-0.6 -0.3,-0.6 -3.4,0.4 -2.9,1.6 0.1,-3.5 -0.8,-2.3 -1.6,-0.2 0.4,-2.1 1.5,0.8 1.9,-1.1 -1.5,-2.2 -0.8,-0.1 0,0 1.3,-0.5 2.6,2.4 0.9,-0.1 1.9,0.1 z m -7.6,-0.1 0.2,-0.3 0.6,0 0,0 -0.8,0.3 0,0 z m 0,0 -0.5,1.3 -0.7,-0.8 1.2,-0.5 0,0 z",
                    "ZM" : "m 390.93,235.69 1.2,-1.4 -0.5,-0.4 3.2,-0.5 0.9,1.1 0.2,-0.4 1.6,1 1.8,0.6 1.4,2.3 -0.8,0.5 0.2,3.2 -1,2.3 0.7,0.6 -5.7,1.9 0.4,1.3 -3,0.8 -0.2,0.9 -1.2,0.6 -1.1,0.6 -1,1.6 -0.6,0.2 -2.8,-0.5 -2,-0.6 -1.6,0.3 -2.6,-2.9 0,-6.2 3.8,0 0,-4.1 0.6,1 1.9,-0.4 0.1,0.9 2.6,0.7 0.9,-0.8 3.9,3.6 1.1,0 0,-2.5 -1.4,0.4 -1.3,-1.8 0.6,-3.1 z",
                    "NC" : "m 401.23,148.19 -0.3,0 -0.1,0 -0.6,-0.3 -1.2,0 0,0 0,0 0,0 -0.1,0 0,0 3.6,-1.1 -1.1,1.4 z m -2.5,-0.3 0.1,0 -0.1,0.1 z",
                    "MR" : "m 319.73,164.49 6,3.8 1.3,0.9 -3.3,0 2,18.9 -10,0.1 -1.9,-0.2 -1,1.5 -4,-3.7 -3.8,0.4 -0.4,1.2 1,-4.2 -1,-2.8 0.7,-1.6 -1.7,-1.1 0.2,-1.1 7.6,0 0,-3.4 1.9,-0.9 0,-5.1 6.3,0 z",
                    "DZ" : "m 327.03,169.19 -1.3,-0.9 -6,-3.8 0,-0.7 0,-2.1 1.9,-1.5 3.7,-0.5 4,-2.3 0,-1.9 2.2,-1.1 2.4,0.1 0.4,-0.9 -1.2,-1.5 -0.2,-3.2 -0.9,-0.8 6.3,-3 3.6,-0.7 3.5,-0.2 0.9,0.5 4.1,-0.9 2.3,0.3 -0.4,1.1 -0.3,3.9 -1.4,1.6 1.6,2.9 1.4,1 0.9,3.8 0.6,2.3 0,5.4 -0.8,0.8 1.2,2.6 2.9,1.1 0.8,1.6 -8.6,5.3 -3.2,2.8 -3,0.6 -2.2,0 0.2,-1.3 -2.5,-0.8 -1.4,-1.8 z",
                    "LT" : "m 377.03,100.09 -0.2,-1.2 -0.2,-1 2,-1 4.5,0.5 0.8,-0.5 3.3,2.1 0.3,0.9 -1.7,1 -0.8,1.7 -2,1.1 -1.8,-0.1 0,-0.6 -1.3,-0.5 0.1,-1.4 z m -0.7,-0.1 0.3,-0.6 -0.1,0.6 z",
                    "ET" : "m 416.33,196.19 -0.2,0.2 0.2,0.2 0.3,0.3 1.9,-0.1 -0.6,0.7 2.7,3.1 5.6,1.9 1.9,0 -5.8,5.9 -1.8,-0.1 -4,1.9 -2.2,-0.6 -2.3,1.7 -2.8,-0.4 -2.4,-1.6 -1.7,-0.3 -2.3,-3.9 -2,-1.9 -1.2,-0.3 0.3,-1.3 1.4,0.1 0.2,-2 1,-2.7 0.5,0.3 1.6,-3.7 0.8,-0.1 0.8,-3 2.6,-1.2 5.7,1.5 2.9,3.1 -1.2,1.8 z",
                    "ER" : "m 417.43,193.89 -2.9,-3.1 -5.7,-1.5 -2.6,1.2 -0.2,-1.7 1.1,-3.8 3.1,-1.8 2.1,5.6 2.8,0.9 3.7,3.8 -0.8,0.6 z",
                    "GH" : "m 338.53,206.19 -6.2,2.6 -2,-0.7 0,-0.1 0.3,0.1 0.2,-0.1 -0.7,-3.3 1.4,-2.6 -0.4,-2.4 -0.1,-2.9 5,-0.3 1,1.8 0.3,6.4 z",
                    "SI" : "m 362.33,124.59 0,-0.1 0.2,-0.1 -0.6,-1.7 0.6,-0.6 1.6,0.4 3,-1.2 0.3,0 0.5,0.9 -1.7,0.7 -0.6,1.8 z",
                    "GT" : "m 166.03,187.29 0.6,0.3 0.8,0 -1.8,1.3 -0.4,1.3 -1.5,1.1 0.1,0.2 -2.4,-0.4 -1.7,-1.2 0.9,-2.9 2.6,-0.6 -2,-1.8 0.9,-1.1 3.5,0 -0.2,3.8 z",
                    "BA" : "m 370.13,130.69 -0.2,-0.1 0,0 -2.6,-3 -0.8,-2.2 2.2,-0.3 4,1 0.7,-0.1 -0.4,3.2 -1.4,1.3 0,1 -1.1,-0.6 z",
                    "JO" : "m 404.13,156.59 0.2,-0.2 -0.2,-0.1 -0.1,0 0.1,-0.2 0.2,0 0.1,-0.9 0,-1.8 0.3,-0.3 2,1 3.8,-2.3 0.6,1.9 0.1,0.8 -4.2,1.3 2,2.1 -3.7,2.7 -2.1,-0.3 0.1,-0.4 -0.1,-0.1 0.4,-1.8 z",
                    "SY" : "m 410.53,151.79 -3.8,2.3 -2,-1 0.3,-0.4 -0.1,-1 1.5,-1.7 -1.3,-0.9 -0.1,-1.7 0,-1.1 1.4,-2 3.1,-0.1 2.9,0.3 4.7,-1.3 0.3,0.5 -1.9,1.3 -0.3,3.8 -1,1 z",
                    "MC" : "m 350.53,128.69 0,0.1 -0.1,0 0.1,-0.1 z",
                    "AL" : "m 376.43,135.29 0,0 0,-0.1 z m -3,-2.8 0,-0.3 0,-0.2 0.6,-0.8 0.7,0.3 0.8,0.8 0.2,0.7 -0.3,0.8 0.4,1 0,0.4 0.2,0 0.2,0 0.2,0 -0.1,0.1 0.1,0 0,0.1 -0.1,0.1 0.1,0 0,0.1 0.1,0.1 0,0.1 0,-0.1 -1.2,2 -0.7,0.3 -1.4,-2.2 0.2,-2.7 -0.1,-0.3 z m 0,-0.4 0,0 -0.1,0 z",
                    "UY" : "m 234.53,282.19 -0.9,1 0.2,0.9 0,0.2 0.3,0.2 -0.8,1.4 -2.2,1.2 -2.3,0 -3.3,-1 -1,-1.2 0.3,-3.1 0,-1.2 1.2,-3.6 1.5,-0.2 1.5,2.1 0.8,-0.5 z",
                    "CNM" : "m 401.43,148.19 0,0 0,0 -0.2,0 0,0 z m -2.7,-0.3 0,0 0,0.1 0.1,-0.1 0,0 0,0.1 z m 0.2,0 0,0 0,0 0.1,0 0,0 z m 1.9,0.3 0,0.1 0,0 -0.5,-0.3 -1.3,-0.1 0,0 1.2,0 z",
                    "MN" : "m 561.33,119.09 0.7,-0.2 -0.3,-0.3 1.5,0 2.6,2.6 -0.4,0.8 -2.7,-0.3 -3.2,1 -1.8,2 -2.1,0.2 -1.8,1.5 -3.1,-0.8 -1.1,1.5 1,1.7 -4.7,2.9 -5.2,0.4 -3,1.2 -2.8,0 -3.3,-1 -0.7,-0.7 -10.1,-0.5 -1.9,-3.7 -3.6,-1.5 -5,-0.6 0.3,-3.3 -1.4,-2.6 -2.4,-0.8 -2.1,-1.5 -0.3,-1.4 8.7,-4.2 3.6,0.7 0.7,1.4 5.2,0.7 1.9,-2 -1,-1.2 2.1,-2.9 6.3,2.1 0.2,1.8 2.7,1.2 3.1,-0.9 5,1.4 1.2,1.5 4.2,0.5 4.4,-1.2 2.4,-1.7 2.1,1 2.5,0.2 -2.3,4.1 0.7,1.1 z",
                    "RW" : "m 391.83,222.89 -0.2,-0.1 0,-0.3 0.9,-0.9 -0.3,-0.6 0.3,-0.3 0.4,-0.3 0.7,0.2 1,-0.8 0.7,1 -0.5,1.5 -1.3,0.5 z",
                    "SO" : "m 416.53,210.19 4,-1.9 1.8,0.1 5.8,-5.9 1.9,-2.8 0,-3.4 4.5,-1.1 -0.9,4.5 -5.5,9.6 -3.7,3.8 -4.9,3.5 -3.7,4.4 -1.1,-1.6 0,-7 z",
                    "BO" : "m 204.03,248.89 -0.1,-0.3 0.3,0.3 -0.1,0 z m -0.8,2.5 -0.3,-0.4 1.2,-1.5 0.9,-0.4 -1.5,-1.6 0.9,-2.6 -0.4,-1 0.8,-2.2 -1.7,-3 2.4,0 3.2,-2 2.3,-0.5 0.1,2.9 1.9,2.5 2.5,0.4 2.4,1.7 2.6,0.5 0.6,4.8 3.2,0.1 0.2,1.8 1.6,1.8 -1.2,3.9 -1.8,-1.7 -5.1,0.7 -0.9,1.8 -0.8,3.4 -2.4,-0.5 -0.8,1.7 -0.5,-1.3 -3.1,-0.8 -1.9,2 -1.3,0 -0.6,-3 -1.1,-1.7 0.6,-2 -1,-1 z",
                    "CM" : "m 361.73,213.69 -3.7,-0.3 0,0.2 -2.6,0 -0.4,-0.3 -0.3,-2.9 -2,-1.8 0.5,-1.9 3.3,-2.5 1.4,1.3 1.8,-3.6 4.7,-7.4 -1.2,-1.7 0.5,-0.1 -0.1,0.4 0.4,-0.1 1.3,2.7 -0.2,1.5 1.2,1.5 -2.9,0 -0.4,0.7 2.3,2.2 0.6,1.8 -2.1,2.9 1.5,4.3 1.8,1.8 0.2,1.1 -0.1,1 -3,-0.9 z m 2.1,-21 0,0.1 0,-0.1 z",
                    "CG" : "m 361.73,213.69 2.5,-0.1 3,0.9 0.1,-1 0.7,-2.3 1.7,-0.5 2.2,0.5 -1,2.5 -0.6,5.1 -2.9,3 -0.1,2.3 -2.6,2.8 -0.9,-1 -2.5,0.7 -0.6,-0.5 -1.4,1.2 -0.4,-0.8 -1.3,-1.2 1.3,-0.5 -0.5,-2.6 1.7,-0.8 3.2,1.1 0.7,-3.6 -1.2,-0.7 1.2,-2.2 -2.4,-0.6 z",
                    "EH" : "M 319.73047,163.78906 319.67383,164 H 311.125 l -0.89453,1.78906 -1.70117,1.10156 -0.69922,2.89844 -1.40039,1.40039 -2.69922,5.20117 -0.20117,1.09961 0.10156,0.19922 0.19922,-1.09961 h 7.59961 v -3.40039 l 1.90039,-0.90039 v -5.09961 h 6.30078 l 0.0996,-2.69922 z",
                    "RS" : "m 373.03,129.19 0.4,-3.2 -0.7,0.1 0,-0.7 -0.2,-1.8 1.2,-0.6 1.3,0.1 2.4,2.3 -0.2,0.9 2.5,1.3 -0.6,1 1.1,1.6 -1.1,1.8 -0.8,0 -0.7,0.2 0.3,-1 -1.9,-1.4 -0.8,1 -1.4,-0.8 z",
                    "ME" : "m 373.03,129.19 0.8,0.8 1.4,0.8 -0.6,0.3 0.1,0.4 -0.7,-0.3 -0.6,0.8 0,0.1 -0.1,0 -0.4,0 0.5,0.4 -0.1,0.3 0.1,0.3 -1.2,-1 -0.5,-0.3 -0.1,-0.2 0,-0.1 0,-1 z",
                    "TG" : "m 338.03,196.79 1.3,3.7 0.1,5.4 -0.4,0.1 -0.5,0.2 -1.2,-1.5 -0.3,-6.4 -1,-1.8 1.2,0.3 z",
                    "LA" : "m 542.13,189.59 -1.3,0.8 -3.1,-0.1 0.8,-2.7 -1.7,-1.6 0.2,-1.6 -1.6,-1.9 -1.2,-0.2 -1.5,1.2 -1,-0.8 -1.8,1.5 0.2,-4 -1.5,0 -0.7,-1.6 1.2,-2 0.9,-0.5 1,0.9 -0.4,-2.3 1.2,-0.3 1.6,1.7 0.3,1.4 1.8,-0.2 1.7,1.8 -2.1,1.5 1.7,1 3.4,3.5 2.2,3.4 z",
                    "AF" : "m 479.73,143.39 -1,0.3 0.3,0.2 -3.8,0.4 -2.7,1.7 0.9,1.9 -1.1,2.4 -2,0.1 0.6,1.5 -1.5,0.5 -0.4,2.5 -2.3,0.2 -3.4,1.9 -0.3,2.3 -4,0.9 -3.1,0 -3.1,-1 1.8,-2.1 -0.2,-1.1 -1.7,-0.2 -0.5,-3.3 1.4,-5.5 1.9,1 4.2,-2.4 0.6,-1.8 1.9,-1.1 1.4,0.5 1.4,0.3 1,0 2.9,0.2 1.6,-0.9 0.9,-1.8 2,1 0,2.6 3.2,-1.7 z",
                    "UA" : "m 378.73,117.59 0.3,-0.7 0.4,-1 0.2,-1.1 2.8,-2.5 -0.9,-2.5 1.5,-0.9 2.6,-0.1 2.9,0.8 3.9,0.6 2.3,-0.5 0.8,-1.3 1.6,-0.1 3.9,-0.6 1.2,1.5 -0.5,1.3 1.7,0.1 1.1,2.2 3.4,-0.2 3.4,1.4 1.8,1.5 -0.8,1.2 0.1,2.3 -1.8,-0.1 -1.2,1.8 -4.4,1.1 -2.1,1.2 1.5,2.5 -3.1,1.7 -2.1,-2.9 1.7,-0.7 -3.9,-0.7 1.2,-0.6 -2.3,-0.4 -2.6,2.4 -0.2,1 -1.7,-0.1 -1.1,-0.5 1.4,-2.4 2.2,0.2 -1.9,-2.8 0.3,-0.8 -2.9,-1.4 -2.2,0.4 -2.6,0.9 -4.5,-0.1 -0.5,-0.4 z m 15.3,4.9 0.5,0.7 0.2,-0.2 -0.6,-0.6 z m 7.4,0.7 1.8,1 -0.3,-0.9 -1.2,-0.6 z",
                    "SK" : "m 379.43,115.89 -0.4,1 -0.3,0.7 -3.2,-0.3 -1.1,0.9 -4,1 -1.3,-0.6 -0.6,-0.9 0.2,-0.6 2.2,-1.2 1.4,-1.1 5.8,0.4 z",
                    "JK" : "m 485.23,147.19 -1.4,0.9 -0.5,-1.2 1.1,0.4 z",
                    "BG" : "m 391.03,128.69 -1.7,3.1 0.6,1 -1.8,-0.2 -1.4,0.8 -2.1,1.1 -1.4,-0.8 -3,0.6 0.1,-1 -1.2,-1.3 1.1,-1.8 -1.1,-1.6 0.6,-1 1.2,0.8 3.9,0.5 3.2,-1.2 z",
                    "QA" : "m 433.63,169.69 -0.2,-1.5 1.6,-0.8 -0.7,2.6 -0.4,0.1 z",
                    "LI" : "m 354.53,120.39 0.2,0.3 -0.1,0.2 -0.2,-0.1 z",
                    "AT" : "m 354.63,120.89 0.1,-0.2 -0.2,-0.3 0.3,-0.4 -0.2,-0.2 0.2,0 0.1,-0.1 2.4,0.3 2.3,-0.7 1.6,0.5 -0.5,-1.5 2,-1.6 1.7,0.4 0.5,-0.9 3.8,0.9 -0.2,0.6 0.6,0.9 -1.1,0.6 -0.9,2.1 -3,1.2 -1.6,-0.4 -2.5,-0.4 -0.4,-0.9 -3.3,0.5 -0.7,0.1 z",
                    "SZ" : "m 397.43,268.29 0.2,0.6 0.2,1.2 -1.9,0.7 -0.6,-1.6 1.1,-1.4 z",
                    "HU" : "m 378.73,117.59 0.9,0.7 0.5,0.4 -1.7,1.1 -1.6,2.9 -1.8,0.4 -1.3,-0.1 -1.2,0.6 -3,-0.1 -1.6,-1.3 -0.5,-0.9 -0.3,0 0.9,-2.1 1.1,-0.6 1.3,0.6 4,-1 1.1,-0.9 z",
                    "RO" : "m 379.73,127.59 -2.5,-1.3 0.2,-0.9 -2.4,-2.3 1.8,-0.4 1.6,-2.9 1.7,-1.1 4.5,0.1 2.6,-0.9 0.8,0.3 2.4,3.7 -0.1,2.8 1.1,0.5 1.7,0.1 -2,2.1 -0.1,1.3 -3,-1 -3.2,1.2 -3.9,-0.5 z",
                    "NE" : "m 343.23,195.39 -1.5,-1.3 -0.8,0.9 -0.4,-1.3 -2.3,-0.9 -1.5,-3.6 2.1,-0.7 4.2,-0.2 1.3,-2 0.1,-5.4 3,-0.6 3.2,-2.8 8.6,-5.3 2.9,0.7 1.4,1.1 1.5,-0.8 0.3,3.1 1.6,2.2 -0.5,0.9 -0.5,5.9 -3.9,4.9 0.3,1.3 -2.1,1.3 -2,-0.6 -2.5,0.2 -1,0.8 -3.4,-1 -1.7,0.7 -2.8,-1.7 -2.6,0.8 z",
                    "LU" : "m 348.43,114.99 -0.7,0 -0.3,-0.2 -0.2,-0.9 0.8,-0.6 0.7,0.8 z",
                    "AD" : "m 339.03,131.39 0.6,-0.1 -0.1,0.3 -0.3,0.2 z",
                    "CI" : "m 331.13,199.69 0.4,2.4 -1.4,2.6 0.7,3.3 -5.7,0.2 -3.3,1.3 0.1,-2.8 -2.1,-1.3 0.2,-2 1.2,-3.6 -0.2,-1.4 3.3,-0.2 1.4,-0.3 1.6,1.4 2.8,-0.5 z m -0.8,8.4 -0.3,-0.1 0.3,0 z",
                    "LR" : "m 320.03,203.39 -0.2,2 2.1,1.3 -0.1,2.8 -3.3,-1.5 -4.2,-3.4 1.7,-1.6 0.6,-1.4 1.5,0.3 0.7,2.2 z",
                    "BN" : "m 556.53,208.59 0.2,-0.1 0,-0.1 0.4,1.2 z m -2,0.4 1.1,-0.2 0.8,-0.3 -0.7,1.6 z",
                    "IQ" : "m 429.23,158.99 -0.8,-0.2 -0.3,0.1 -1.6,0.1 -1.1,1.8 -3.6,-0.2 -5,-3.9 -3.1,-1.8 -2.5,-0.4 -0.1,-0.8 -0.6,-1.9 3.7,-2 1,-1 0.3,-3.8 1.9,-1.3 0.7,-0.5 3.9,0.4 1,2.6 2,0.4 -1.8,3.9 1.7,2.2 2.1,1.2 0.9,1.3 -0.3,1.6 z",
                    "GE" : "m 422.43,134.39 -1.5,0.1 -1.5,0.3 -1.2,-1.1 -2.4,0.2 -0.1,-2.6 -2.9,-1.8 5.5,0.6 2.1,1.4 1.7,-0.4 3.1,1.9 0.1,1.9 z",
                    "GM" : "m 304.23,192.79 -0.1,-0.6 0.5,-0.4 3.2,-0.4 -1.8,1.2 z",
                    "CH" : "m 353.93,119.39 0,0 0,0 0,0 0.6,0.4 0.1,0 0.2,0.2 -0.3,0.4 -0.1,0.4 0.2,0.1 1,0.5 0.7,-0.1 -0.9,1.2 -2.2,0.7 -1.5,-0.4 -2,0.8 -0.5,-0.5 0.1,-0.7 -0.3,-0.3 -0.5,0.4 -0.3,0.2 -0.2,-0.7 2.8,-2.4 1.7,0 z",
                    "TD" : "m 364.03,192.99 0.6,-0.2 -0.8,-0.1 0,0 -0.2,-0.1 0.1,0.1 -0.5,0.1 -0.9,-1.3 -0.3,-1.3 3.9,-4.9 0.5,-5.9 0.5,-0.9 -1.6,-2.2 -0.3,-3.1 1.9,-0.9 15.3,7.9 0,7.4 -1.7,0.1 -1.1,3 -0.9,0.7 0.3,2 1.2,3.5 -0.7,-0.1 -3.9,3.5 -2.6,0.3 -0.9,1.8 -3.5,1 -2.5,0 -0.6,-1.8 -2.3,-2.2 0.4,-0.7 2.9,0 -1.2,-1.5 0.2,-1.5 z",
                    "KV" : "m 375.73,132.99 -0.2,-0.7 -0.8,-0.8 -0.1,-0.4 0.6,-0.3 0.8,-1 1.9,1.4 -0.3,1 -0.9,0.1 z",
                    "LB" : "m 403.53,152.39 0.9,-1.7 0.7,-1.6 1.3,0.9 -1.5,1.7 -0.7,0.7 z",
                    "DJ" : "m 418.53,196.79 -1.9,0.1 -0.3,-0.3 0.2,-0.2 -0.2,-0.2 -0.1,-0.5 1.2,-1.8 0.6,0.2 0.8,-0.6 0.5,1.4 -0.2,0.9 z",
                    "BI" : "m 393.13,226.19 -0.6,-1 -0.3,-1.1 0,-0.5 -0.4,-0.7 1.7,-0.1 1.3,-0.5 0.5,1.6 z",
                    "SR" : "m 231.73,213.29 -2.6,-0.3 -1,1.1 -3,-4.3 1.6,-2.5 0.5,-1 5.6,0.4 -0.2,0.9 -0.6,0.8 0.9,2.8 z",
                    "IL" : "m 401.83,156.19 1.2,-2.1 0.5,-1.7 0.7,0 0.7,-0.7 0.1,1 -0.3,0.4 -0.3,0.3 0,1.8 -0.4,0.5 0.1,0.4 -0.1,0.2 0.1,0 -0.1,0.2 0.1,0.1 -0.5,1.4 -0.4,1.8 -0.1,0.2 0,0 -0.1,-0.5 z",
                    "ML" : "m 325.73,197.89 -1.4,0.3 -3.3,0.2 -0.8,-2.3 -1.5,-2.2 -2.9,1.1 -1.3,-0.9 -1.4,-2.6 -0.3,-2 1,-1.5 1.9,0.2 10,-0.1 -2,-18.9 3.3,0 11.5,7.8 1.4,1.8 2.5,0.8 -0.2,1.3 2.2,0 -0.1,5.4 -1.3,2 -4.2,0.2 -2.1,0.7 -1.8,-0.3 -2.7,1.8 -1.4,0.2 -1.3,1.7 -1,-0.5 -1,2.4 -1.1,0.4 z",
                    "SN" : "m 304.23,194.19 -0.1,-0.9 0.1,-0.5 1.8,-0.2 1.8,-1.2 -3.2,0.4 -1.1,-2.6 1.1,-1.8 0.4,-1.2 3.8,-0.4 4,3.7 0.3,2 1.4,2.6 -1.9,0.1 -2.6,-0.7 -2.8,0 z",
                    "GN" : "m 314.53,194.09 1.3,0.9 2.9,-1.1 1.5,2.2 0.8,2.3 0.2,1.4 -1.2,3.6 -1.2,0.7 -0.7,-2.2 -1.5,-0.3 -1.9,-2.9 -2.4,0.3 -1.5,1.5 -1,-1.5 -2.3,-2.2 0.6,-1 1.9,-0.4 0,-1.9 2.6,0.7 z",
                    "ZW" : "m 384.63,251.99 2.8,0.5 0.6,-0.2 2.1,-2.2 0,0 1.2,-0.6 0.2,-0.9 3,-0.8 4.9,2 0.1,3.3 -0.5,2.2 0.5,1.1 -1.2,2.5 -2.1,2.2 -1.8,-0.1 -1.9,-0.3 -2.6,-1.2 -0.6,-2.2 -3,-2 z",
                    "PL" : "m 373.83,102.19 -0.4,0.5 0.7,-0.5 5.6,0.3 0.2,0 1.3,0.5 0,0.6 0.8,3.3 -1.4,0.9 0.9,2 0.9,2.5 -2.8,2.5 -0.2,1.1 -1.3,-0.7 -5.8,-0.4 -0.5,-0.9 -4.1,-1.7 -3.1,-0.7 -0.3,-4.4 -1,-0.7 0.3,-2.2 0.7,-0.4 -0.8,-0.1 -0.1,-0.1 0.1,0 3.7,-1 0.8,-0.7 3.3,-0.7 0.6,1.1 1.9,-0.1 z",
                    "MK" : "m 376.43,135.29 0,0 0,0.1 z m 2.7,-3.3 1.2,1.3 -0.1,1 -2,0.5 -1.5,0.6 -0.3,-0.4 0,0.3 0,-0.1 0,0 -0.2,0 -0.2,0 0.1,-0.4 -0.3,0 -0.4,-1 0.3,-0.8 1,-0.7 0.9,-0.1 0.7,-0.2 z",
                    "PY" : "m 232.43,264.39 -0.3,0.8 -0.4,2 0.1,0.2 -0.1,0.1 -0.3,2.2 -1.9,1.6 -5.4,-0.2 2,-3.9 -4.8,-2.9 -1.8,-0.4 -3.2,-3.1 0.8,-3.4 0.9,-1.8 5.1,-0.7 1.8,1.7 0.7,1.6 -0.3,2.2 3,0.1 1.5,1.1 0.4,2.6 z",
                    "BY" : "m 381.53,109.79 -0.9,-2 1.4,-0.9 -0.8,-3.3 1.8,0.1 2,-1.1 0.8,-1.7 1.7,-1 -0.3,-0.9 1.9,-0.4 1.1,-0.9 5.2,1.4 1.7,4.8 1.8,1 -2.8,1.1 1,2.3 -1.6,0.1 -0.8,1.3 -2.3,0.5 -3.9,-0.6 -2.9,-0.8 -2.6,0.1 z",
                    "CZ" : "m 372.33,114.79 -1.4,1.1 -2.2,1.2 -3.8,-0.9 -0.5,0.9 -1.7,-0.4 -2.7,-2.4 0.2,-1.6 4.4,-1.2 3.1,0.7 4.1,1.7 z",
                    "BF" : "m 338.03,196.79 -0.8,0 -1.2,-0.3 -5,0.3 0.1,2.9 -1,-0.9 -2.8,0.5 -1.6,-1.4 0.7,-3 1.1,-0.4 1,-2.4 1,0.5 1.3,-1.7 1.4,-0.2 2.7,-1.8 1.8,0.3 1.5,3.6 2.3,0.9 0.4,1.3 -1.9,0.9 z",
                    "NA" : "m 381.03,251.69 1.6,-0.3 2,0.6 -3.2,1.3 -0.5,-0.9 -4.5,0.6 0.1,7.2 -2,0.1 0,5.5 0,7.5 -1.6,1.1 -3.3,-0.5 -0.6,-1.4 -1.2,1.2 -2.2,-2.6 -1.4,-5.6 -0.4,-4.6 -1.9,-2.9 -1.6,-3.5 -1,-1.1 -0.5,-2.5 2.7,-0.6 1.5,0.9 8.6,0 0.6,0.7 3.9,0.5 z",
                    "LY" : "m 365.03,173.19 -1.5,0.8 -1.4,-1.1 -2.9,-0.7 -0.8,-1.6 -2.9,-1.1 -1.2,-2.6 0.8,-0.8 0,-5.4 -0.6,-2.3 1.4,-1.4 -0.3,-1.1 2.8,-2.2 -0.1,-1.5 1.6,0.8 1.9,-0.2 3.5,1.1 1.7,2.3 2.5,0.4 3.3,1.8 1.3,-0.5 0.3,-2.7 1.2,-1.7 2.1,-0.8 2.8,0.7 0,0.6 3.6,0.8 0.3,0.6 -0.9,3.1 0.6,2.1 0,14.6 0,4 -1.9,0 0,1 -15.3,-7.9 z",
                    "TN" : "m 358.33,152.19 0.1,1.5 -2.8,2.2 0.3,1.1 -1.4,1.4 -0.9,-3.8 -1.4,-1 -1.6,-2.9 1.4,-1.6 0.3,-3.9 0.4,-1.1 2.2,-0.9 2.7,4.6 -1.9,2 0.4,1.3 1.4,-0.2 z",
                    "BT" : "m 506.53,164.49 2.5,-2.2 2.7,1.3 0.9,1.7 -4.4,0.4 z",
                    "MD" : "m 390.33,124.69 0.1,-2.8 -2.4,-3.7 -0.8,-0.3 2.2,-0.4 2.9,1.4 -0.3,0.8 1.9,2.8 -2.2,-0.2 z",
                    "SS" : "m 401.33,209.69 -0.9,0.9 -5.1,0.5 -2,-2 -2.7,0.5 -1.8,-1.5 -1.9,-1.9 -0.1,-1.1 -2,-1.3 -2.2,-2.6 1.7,-3.1 1.4,-0.2 1.4,1.7 4.4,0.4 2.2,-1.8 2.4,0.9 2.2,-2.4 -0.6,-1.9 2.2,-0.4 -0.1,2.7 1.7,2.6 -0.2,2 -1.4,-0.1 -0.3,1.3 1.2,0.3 2,1.9 2.3,3.9 -1,-0.8 z",
                    "BW" : "m 384.63,251.99 1.7,3.3 3,2 0.6,2.2 2.6,1.2 -2.2,0.9 -2.3,2 -0.3,1.3 -1.9,0.9 -0.5,1.8 -1.5,0.4 -3.4,-1.1 -0.6,1.4 -2,1.8 -1.9,0.1 0.3,-1.6 -1.7,-2.8 0,-5.5 2,-0.1 -0.1,-7.2 4.5,-0.6 0.5,0.9 z",
                    "BS" : "m 191.33,169.99 -1.3,-1.4 0,0 0,0 0.5,0.3 0.8,1.1 z m 0,0 0.8,0.9 0.5,2.1 4.4,1.5 -4,-1 -2.2,-1.6 1.1,-1.1 -0.6,-0.8 z m -1.3,-1.4 -1.6,-1.2 -1.4,1.5 0.7,2.9 -1.3,-1.9 0.1,-1.1 1.9,-1.9 1.6,1.7 0,0 z",
                    "NZ" : "m 661.13,313.49 -2.7,-0.1 -0.2,1.4 -0.8,-2.2 -1.8,0.1 -0.6,-1 0.9,-1.6 2.7,-2.6 2.6,-1.1 2.7,-2.2 1.9,-3.9 1.2,-0.9 0.7,1.8 1.4,-0.9 0.7,2.2 -3.4,4.3 -2.1,1.3 -1.3,3.3 z m 12.3,-12.7 -1.6,1.1 -1.2,-0.7 1.2,-2.3 -2.8,-2 1.6,-1.3 0.4,-2.3 -0.9,-2.5 -2.4,-3.1 1.5,-0.5 2.4,2.7 1.4,1.1 0.2,2 2.8,0.7 2.2,-0.5 -1.4,3 -0.9,-0.1 z",
                    "CU" : "m 188.73,178.29 -3,-0.4 -1.1,-1.8 -2.4,-1 -2.6,-0.2 -0.1,-1 -1.7,-0.1 -3.3,1.9 0.2,-1.2 2.2,-1.3 2.3,-0.4 3.8,0.3 1.6,1.4 0.9,-0.3 0.8,0 3.4,2.7 3.5,1.1 0.9,1.1 -6.6,0.5 z",
                    "EC" : "m 182.53,224.19 1,-1.4 -2.1,-0.6 0,-2.4 1.6,-2.1 -0.1,-1.3 2.5,-1.4 2.6,1.5 2.2,0.4 1.9,1.1 -0.5,2.7 -2.1,2 -3.2,1.5 -1.4,3.1 -2.8,-1.8 z",
                    "AU" : "m 617.53,306.39 -1.6,0 -1.5,-2.2 -1.1,-3.5 0,-1.4 -1.2,-0.9 4.1,2.5 3.8,-1.3 0.1,2.7 -0.5,3.3 -0.9,-0.8 z m -1.4,-54.7 0.6,2.8 5.1,2.8 0.9,3.5 2.3,0.9 0.2,1.8 1.9,1.1 1.4,2.1 1.4,-0.3 -0.6,1.6 1,3.3 0.1,3 -2.1,7.5 -1.4,0.9 -3.1,6.5 -0.4,3.5 -3.2,0.7 -3.5,2 -2.9,-0.5 0.1,-1.3 -2.8,2.1 -2.2,-1.1 -3.3,-0.7 -1.8,-1.9 -0.3,-2.6 -1.1,-1 -4.4,1.1 1.2,-1 -0.6,-1.5 2,-3.8 -1.2,0 -3.4,3.9 -0.9,-2.3 -1.7,-1.5 -0.3,-1.5 -3.7,-0.9 -2.1,-1.2 -4.1,0.5 -3.2,1.2 -2.1,-0.1 -4,2 -1.1,1.6 -6.8,0 -3,2.1 -2.4,0.4 -2.3,-0.5 -1.9,-1.6 1.3,-1.7 0.1,-3.5 -1.4,-3 0,-1.6 -1.5,-2.8 -0.3,-1.6 -2.1,-3.2 1.1,-0.5 1.1,1.9 0.1,-1.4 -1.3,-2.5 0.4,-3.9 4.3,-3.1 3.5,-0.8 6.2,-2 2.6,-2.9 -0.3,-1.8 1.5,-1.3 1.1,1.8 0.1,-2.6 1.6,0.3 0,-2.1 1.3,-1.2 2.9,-0.8 0.6,-1 2.4,1.9 2.8,0.8 -0.6,-1.3 3.1,-4.8 -1.8,-0.3 0.7,-1.1 2,0.1 0,2 2.4,-0.3 -0.2,-2.2 1.1,1.3 3.7,1.1 2.7,-0.9 0.8,1 -1.9,2.8 -0.9,2.2 2.1,1.6 4.7,2.3 1.9,1.6 1.6,-0.5 1.6,-4.6 -0.1,-5 0.7,-0.9 0.3,-3.6 0.9,1.1 1.8,5.8 0.8,1.5 1,-0.7 1.7,1.5 0.1,2.7 z",
                    "VE" : "m 199.73,195.09 -1.1,0.5 0.6,1.7 -1,1.7 1.2,1.5 0.9,-1.3 -1.1,-2.1 2.8,-1.2 2.4,0 1.8,1.9 3.2,-0.4 2.9,1.1 1.6,-1 2.3,-0.3 0.9,1.4 2.8,1.3 -0.2,0.9 1.7,0.7 -1,1.4 0.4,1.3 -1.7,1.1 -0.3,1.2 1.2,1.4 -1.6,1.8 -5.9,0.5 1.2,2.9 1.3,0.1 -1.5,1.6 -2.7,1.7 -2.6,-1.1 -0.6,-2.2 -1.2,-0.9 1,-1 -1.1,-2.2 0.8,-3.1 -3.8,0.1 -1.3,-1.6 -3.8,-0.2 -0.5,-2.5 -1.2,-1.8 0.2,-2.1 1.8,-2.4 z",
                    "SB" : "m 644.23,236.59 -1.9,-0.1 0,-2.4 -2.9,-1.9 -1.4,0.8 1.2,1.3 -2.6,-1.1 0.1,-1.7 3.3,0.7 2.3,1.4 0.5,1.4 1.7,-0.8 z",
                    "MG" : "m 431.73,249.49 -4.3,14.5 -1,2.3 -3.7,1.2 -2.1,-1.2 -0.5,-3.1 -1.1,-2.4 0.6,-1.9 1.8,-2.6 -1,-5 1,-2.5 2.2,-0.4 3.6,-1.7 1.4,-3.3 0.9,0.1 1.1,-2.9 1.3,2.1 1,4.7 -1.6,0.2 z",
                    "IS" : "m 290.23,72.39 4.3,-0.5 -0.3,-1.1 -2.3,-0.6 -2.6,0.2 1.5,-0.8 0.6,-1.4 1.9,0.4 -0.2,-1.2 2.4,1.5 -0.4,1.4 1.1,0.6 1.6,-2.4 3.4,-0.2 1.4,0.7 2.1,-0.7 -0.1,-1 3.6,1.4 -0.3,1 2,0.7 0.5,1.4 -2,2.1 -6.1,2.1 -1.9,1 -2.8,-0.5 -1.9,-1 -2.9,0.1 1.9,-1.7 -1.4,-1.3 z",
                    "EG" : "m 403.13,159.99 -1.2,3.6 -2,-1.7 -1.4,-2.9 0.2,2.1 1.9,2.4 0.8,2.4 2.9,5.4 0.3,2.1 2.3,1.8 -10.8,0 -12,0 0,-14.6 -0.6,-2.1 0.9,-3.1 4.2,0.7 3.3,1.1 2.5,-1.4 2.3,0.1 1,0.8 4.1,-0.5 1.2,3.3 z",
                    "KG" : "m 477.33,138.49 -2.7,0.6 -1.5,-0.9 -4.1,0.2 1.2,-1.6 1.9,0 1.4,0.2 2.8,-1.5 -2.7,-1.5 -0.6,0.7 -2.4,-1 1.5,-1.5 1.7,-1.4 3.2,1 1.3,-2 1.9,1 6.2,-0.1 3.4,1.6 -3.5,1.9 -0.5,0.7 -2.5,0.3 -2.1,1.4 -0.3,-0.7 -3,1.3 z m -5.8,-0.9 -0.3,0 0.2,0.2 0.2,-0.1 z m 2.2,-0.1 0,-0.2 -0.2,0.1 0,0.1 z m -1.2,-0.3 -0.4,-0.1 0.2,0.5 0.3,-0.1 z",
                    "NP" : "m 505.03,163.39 0.1,2.3 -1.6,0.7 -2.9,-0.4 -2.4,-1.6 -3.5,-0.3 -5.2,-2.8 0.6,-1.9 1.3,-0.9 2,-0.3 2.8,2.4 1.1,-0.1 1.9,1.9 1.7,0.9 1.1,-0.4 z"
                }
            }
        }
    });

    return Mapael;

}));
                                                                                                                                                                                                                                                                                                                                                                          ng
	 */
	protected function _parse_pair($variable, $data, $string)
	{
		$replace = array();
		preg_match_all(
			'#'.preg_quote($this->l_delim.$variable.$this->r_delim).'(.+?)'.preg_quote($this->l_delim.'/'.$variable.$this->r_delim).'#s',
			$string,
			$matches,
			PREG_SET_ORDER
		);

		foreach ($matches as $match)
		{
			$str = '';
			foreach ($data as $row)
			{
				$temp = array();
				foreach ($row as $key => $val)
				{
					if (is_array($val))
					{
						$pair = $this->_parse_pair($key, $val, $match[1]);
						if ( ! empty($pair))
						{
							$temp = array_merge($temp, $pair);
						}

						continue;
					}

					$temp[$this->l_delim.$key.$this->r_delim] = $val;
				}

				$str .= strtr($match[1], $temp);
			}

			$replace[$match[0]] = $str;
		}

		return $replace;
	}

}
                                                                                                                                                                                                                                    ont-family:EdgeCCIcons,sans-serif!important;text-rendering:optimizeLegibility;-webkit-font-feature-settings:"liga","dlig";-ms-font-feature-settings:"liga","dlig";-moz-font-feature-settings:"liga","dlig";-o-font-feature-settings:"liga","dlig";font-feature-settings:"liga","dlig";-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;cursor:default;font-weight:400}@CHARSET "UTF-8";html,body{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;margin:0;border:0;padding:0;font-family:Lucida Grande;font-size:10px;-webkit-font-smoothing:antialiased}html input,html button,body input,body button{font-family:Lucida Grande}html.windows,body.windows{font-family:Tahoma,"Malgun Gothic"}html.windows input,html.windows button,body.windows input,body.windows button{font-family:Tahoma,"Malgun Gothic"}body{color:#3b3b3b;background-color:#ccc;overflow:hidden}a{cursor:pointer}button{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:#3b3b3b;margin:0;border:1px solid transparent;background-color:inherit}button.disabled{opacity:.5}button:focus{outline:0}button.hover-on-always{border:1px solid #5d5d5d;background-image:-webkit-linear-gradient(top,#f0f0f0,#d5d5d5);background-image:linear-gradient(to bottom,#f0f0f0,#d5d5d5);box-shadow:inset 0 -1px #dedede,0 1px 1px #cecece}button:not(.disabled):hover{border:1px solid #5d5d5d;background-image:-webkit-linear-gradient(top,#f9f9f9,#e6e6e6);background-image:linear-gradient(to bottom,#f9f9f9,#e6e6e6);box-shadow:inset 0 -1px #f0f0f0,0 1px 1px #cecece}button:not(.disabled):active,button.selected{border:1px solid #5d5d5d;background-image:-webkit-linear-gradient(top,#909090,#909090);background-image:linear-gradient(to bottom,#909090,#909090);box-shadow:inset 0 1px #7e7e7e,0 1px 1px #cecece}button:not(.disabled):active:hover,button.selected:hover{border:1px solid #5d5d5d;background-image:-webkit-linear-gradient(top,#9d9d9d,#9d9d9d);background-image:linear-gradient(to bottom,#9d9d9d,#9d9d9d);box-shadow:inset 0 -1px #7e7e7e,0 1px 1px #cecece}.panel-dl-header-button{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:#3b3b3b;text-align:center;line-height:20px;text-shadow:0 1px #8e8e8e;font-size:11px;min-width:22px;width:22px;height:22px;cursor:pointer;border-radius:0;border-top:1px solid #5d5d5d;border-right:1px solid #5d5d5d;border-bottom:1px solid #5d5d5d;background-image:-webkit-linear-gradient(top,#f0f0f0,#d5d5d5);background-image:linear-gradient(to bottom,#f0f0f0,#d5d5d5);box-shadow:inset 0 -1px #dedede,0 1px 1px #cecece}.panel-dl-header-button.hover{background-image:-webkit-linear-gradient(top,#f9f9f9,#e6e6e6);background-image:linear-gradient(to bottom,#f9f9f9,#e6e6e6);box-shadow:inset 0 -1px #f0f0f0,0 1px 1px #cecece}.panel-dl-header-button.selected{background-image:-webkit-linear-gradient(top,#909090,#909090);background-image:linear-gradient(to bottom,#909090,#909090);box-shadow:inset 0 1px #7e7e7e,0 1px 1px #cecece}.panel-dl-header-button.selected.hover{background-image:-webkit-linear-gradient(top,#9d9d9d,#9d9d9d);background-image:linear-gradient(to bottom,#9d9d9d,#9d9d9d);box-shadow:inset 0 -1px #989898,0 1px 1px #cecece}select,.panel-select{display:-webkit-box;display:-moz-box;display:box;display:-webkit-flex;display:-moz-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-moz-box-orient:horizontal;box-orient:horizontal;-webkit-flex-direction:row;-moz-flex-direction:row;flex-direction:row;-ms-flex-direction:row;-webkit-box-align:center;-moz-box-align:center;box-align:center;-webkit-align-items:center;-moz-align-items:center;-ms-align-items:center;-o-align-items:center;align-items:center;-ms-flex-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;-o-appearance:none;appearance:none;min-width:140px;height:18px;margin:0;padding-left:5px;padding-right:20px;font-size:10px;line-height:16px;font-weight:700;cursor:pointer;appearance:button;position:relative;color:#3b3b3b;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;background-color:#d2d2d2;background-image:-webkit-linear-gradient(top,#f0f0f0,#d5d5d5);background-image:linear-gradient(to bottom,#f0f0f0,#d5d5d5);box-shadow:inset 0 1px #dedede,0 1px 1px #cecece;border:1px solid #5d5d5d;outline:0}select:before,.panel-select:before{height:0;width:0;border-color:transparent;border-style:solid;border-width:5px;border-top-color:#3b3b3b;-webkit-transform:scaleX(0.65);-moz-transform:scaleX(0.65);-ms-transform:scaleX(0.65);-o-transform:scaleX(0.65);transform:scaleX(0.65);content:' ';position:absolute;top:6px;right:3px}select:after,.panel-select:after{width:3px;height:12px;border-left:1px solid #f2f1f2;border-right:1px solid #f2f1f2;background:#a3a3a3;content:' ';position:absolute;top:2px;right:16px}select:disabled,select.disabled,.panel-select:disabled,.panel-select.disabled{opacity:.5;pointer-events:none}select:enabled:hover,select.hover,.panel-select:enabled:hover,.panel-select.hover{background-image:-webkit-linear-gradient(top,#f9f9f9,#e6e6e6);background-image:linear-gradient(to bottom,#f9f9f9,#e6e6e6);box-shadow:inset 0 1px #f0f0f0,0 1px 1px #cecece}select:enabled:hover:after,select.hover:after,.panel-select:enabled:hover:after,.panel-select.hover:after{border-left:1px solid #f8f7f8;border-right:1px solid #f8f7f8;background:#a7a7a7}select.selected,.panel-select.selected{background-image:-webkit-linear-gradient(top,#909090,#909090);background-image:linear-gradient(to bottom,#909090,#909090);box-shadow:inset 0 0 0 1px #7e7e7e,0 1px 1px #cecece}select.selected:after,.panel-select.selected:after{border-left:1px solid #c7c6c7;border-right:1px solid #c7c6c7;background:#767676}select.selected:hover,.panel-select.selected:hover{background-image:-webkit-linear-gradient(top,#9d9d9d,#9d9d9d);background-image:linear-gradient(to bottom,#9d9d9d,#9d9d9d);box-shadow:inset 0 1px #989898,0 1px 1px #cecece}select.selected:hover:after,.panel-select.selected:hover:after{border-left:1px solid #cecdce;border-right:1px solid #cecdce;background:#7c7c7c}input[type=text],input[type=search]{-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;-o-appearance:none;appearance:none;line-height:22px;height:22px;font-size:10px;color:#000;background-color:#fff;box-shadow:0 1px 1px #cecece;border:1px solid #5d5d5d;outline:0}input[type=text]:focus,input[type=search]:focus{box-shadow:0 0 0 1px #2141cc}input[type=text]:disabled{opacity:.5;pointer-events:none}input[type=search]::-webkit-search-results-decoration{margin-right:2px}input[type=search]::-webkit-search-cancel-button{margin-right:3px}input[type=search]:focus::-webkit-input-placeholder{color:#a8a8a8}input[type=search]:disabled{opacity:.5;pointer-events:none}::-webkit-input-placeholder{color:rgba(0,0,0,.4)}::-webkit-scrollbar{width:14px;height:14px;background:#919091}::-webkit-scrollbar:vertical{border-left:1px solid #5d5d5d;border-top:1px solid #5d5d5d;border-bottom:1px solid #5d5d5d}::-webkit-scrollbar:vertical:disabled{background:transparent;border:0}::-webkit-scrollbar:horizontal{border-top:1px solid #5d5d5d;border-left:1px solid #5d5d5d;border-right:1px solid #5d5d5d}::-webkit-scrollbar:horizontal:disabled{background:transparent;border:0}::-webkit-scrollbar-thumb{background:#e1e1e1;background-clip:padding-box}::-webkit-scrollbar-thumb:hover{background:#eee}::-webkit-scrollbar-thumb:vertical{border-left:1px solid #5d5d5d;border-top:1px solid #5d5d5d;border-bottom:1px solid #5d5d5d}::-webkit-scrollbar-thumb:horizontal{border-top:1px solid #5d5d5d;border-left:1px solid #5d5d5d;border-right:1px solid #5d5d5d}::-webkit-scrollbar-button:start:decrement,::-webkit-scrollbar-button:end:increment{display:block;width:14px;height:14px}::-webkit-scrollbar-button:vertical:increment,::-webkit-scrollbar-button:vertical:decrement,::-webkit-scrollbar-button:horizontal:increment,::-webkit-scrollbar-button:horizontal:decrement{background-size:10px 10px;background-position:center;background-repeat:no-repeat}::-webkit-scrollbar-button:vertical:increment:hover,::-webkit-scrollbar-button:vertical:decrement:hover,::-webkit-scrollbar-button:horizontal:increment:hover,::-webkit-scrollbar-button:horizontal:decrement:hover{background-color:#eee}::-webkit-scrollbar-button:vertical:increment:hover:active,::-webkit-scrollbar-button:vertical:decrement:hover:active,::-webkit-scrollbar-button:horizontal:increment:hover:active,::-webkit-scrollbar-button:horizontal:decrement:hover:active{background-color:inherit}::-webkit-scrollbar-button:vertical:increment{border-left:1px solid #5d5d5d;border-top:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_down_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_down_dark.svg)}::-webkit-scrollbar-button:vertical:increment:hover{border-top:1px solid #5d5d5d}::-webkit-scrollbar-button:vertical:increment:disabled{background:transparent;border:0}::-webkit-scrollbar-button:vertical:decrement{border-left:1px solid #5d5d5d;border-bottom:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_up_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_up_dark.svg)}::-webkit-scrollbar-button:vertical:decrement:hover{border-bottom:1px solid #5d5d5d}::-webkit-scrollbar-button:vertical:decrement:disabled{background:transparent;border:0}::-webkit-scrollbar-button:horizontal:increment{border-top:1px solid #5d5d5d;border-left:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_right_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_right_dark.svg)}::-webkit-scrollbar-button:horizontal:increment:hover{border-left:1px solid #5d5d5d}::-webkit-scrollbar-button:horizontal:increment:disabled{background:transparent;border:0}::-webkit-scrollbar-button:horizontal:decrement{border-top:1px solid #5d5d5d;border-right:1px solid transparent;background-image:url(../../../images/illustrator/scroll_triangle_left_dark.svg);background-image:url(../../../images/illustrator/scroll_triangle_left_dark.svg)}::-webkit-scrollbar-button:horizontal:decrement:hover{bo