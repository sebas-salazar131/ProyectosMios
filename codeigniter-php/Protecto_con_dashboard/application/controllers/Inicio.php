<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inicio extends CI_Controller {
	
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
		$this->load->view('plantilla', $data);
	}

	public function registrar(){
		$this->load->helper('form');
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('crud/registrar', $data);
        if($this->input->server("REQUEST_METHOD")== "POST"){
		    //persona
            $datas["cedula"] = $this->input->post("cedula");
            $datas["nombres"] = $this->input->post("nombres");
            $datas["email"] = $this->input->post("email");
			$datas["estado"] = $this->input->post("shirts");
			$datas["tipo"] = $this->input->post("shirts2");
			$datas["password"] = $this->input->post("password");

            $this->PersonasModel->insert($datas);
        }	
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
        $this->load->view('crud/mostrar', $data); 
	}


	public function lista_editar(){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['datos'] = $this->PersonasModel->obtener_datos(); 
		$this->load->view('crud/lista_modificar', $data); 
	}
	public function mostrar_perfil(){
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('crud/perfil', $data); 
	}

	public function Modificar($cedula){
		$this->load->helper('form');
		$data['session'] = $this->session->userdata("session-mvc");
		//$this->load->model('Producto_model');
        $data['datos'] = $this->PersonasModel->obtener_cedula($cedula);
        $this->load->view('crud/modificar', $data);

		if($this->input->server("REQUEST_METHOD")== "POST"){

		    //persona
            $cedula= $this->input->post("cedula");
            $data2["nombres"] = $this->input->post("nombres");
           
			$data2["email"] = $this->input->post("email");	
			$data2["estado"] = $this->input->post("shirts");	
			$data2["tipo"] = $this->input->post("shirts2"); 

            $this->PersonasModel->update($cedula, $data2);
			redirect('Inicio/lista_editar');
		}
	}
	public function mostrar_eliminar(){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['datos'] = $this->PersonasModel->obtener_datos(); 
        $this->load->view('crud/eliminar', $data); 
	}
	public function Eliminar($cedula){
		//$data['session'] = $this->session->userdata("session-mvc");
        $this->PersonasModel->delete($cedula);
		redirect('Inicio/lista_editar');
    }
	


}

/* End of file Inicio.php */
/* Location: ./application/controllers/admin/Inicio.php */