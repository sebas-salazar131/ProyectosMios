<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inicio_cajero extends CI_Controller {
	
	public function __construct(){
		parent::__construct();
		$this->load->model('PersonasModel');
		$this->load->database();
		$validacion = $this->session->has_userdata("session-mvc");
        //$datosPersona = $this->PersonasModel->getPersonaByEmail($email);
		if ($validacion) {
			$session = $this->session->userdata("session-mvc");
			if ($session['estado']=="Activo") {
				return false;
			}else{
				redirect('Dashboard/cerrarSession','refresh');
				die();
			}
		}else{
			redirect('Dashboard/cerrarSession','refresh');
		}
	}

	public function index(){
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('cajero/plantilla_cajero', $data);
	}

	
    public function Mostrar(){
        $data= array();
		//$cedula_buscar = $this->input->post("buscador");
		$cedula_buscar = $this->input->post("buscador");
		if($this->input->server("REQUEST_METHOD")== "POST"){
			
			$resultados= $this->PersonasModel->buscador($cedula_buscar); 
			$data['buscador'] =$resultados;
			$data['error']=true;
		}else{
			$data['datos'] = $this->PersonasModel->obtener_datos(); 
		}	
		$data['session'] = $this->session->userdata("session-mvc");
        $this->load->view('cajero/mostrar', $data); 
	}

}

/* End of file Inicio.php */
/* Location: ./application/controllers/admin/Inicio.php */