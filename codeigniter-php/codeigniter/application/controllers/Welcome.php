<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	
	public function index(){
		$this->load->view('welcome_message');
	}
	public function adso_el_mejor(){
		$this->load->view('adso_el_mejor');
	}
}
