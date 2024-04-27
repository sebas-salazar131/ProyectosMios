<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inicio extends CI_Controller {
	
	public function __construct(){
		parent::__construct();
		$this->load->helper('form');
        $this->load->model('PersonasModel');
        $this->load->database();
		$validacion = $this->session->has_userdata("session-mvc");
		if ($validacion) {
			$session = $this->session->userdata("session-mvc");
			if ($session['tipo']=="ADMIN" && $session['estado']=="ACTIVO") {
				return false;
			}else{
				redirect('Login/cerrarSession','refresh');
				die();
			}
		}else{
			redirect('Login/cerrarSession','refresh');
		}
	}

	public function index(){
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('admin/inicio', $data);
	}

	public function listado()
	{
		$vdata["personas"] = $this->PersonasModel->findAll();

		$this->load->view('verUsarios', $vdata);
	}

	public function openCreateUser(){
		
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('admin/crearUsuario', $data);
		

        

    if ($this->input->server("REQUEST_METHOD") == "POST") {
        
       
        

		$usuarios["cedula"]=$this->input->post("documento");
		$usuarios["email"]=$this->input->post("correo");
		$contraseña=$this->input->post("contrasenia");
		$usuarios["password"]=$contraseña;
		$usuarios["tipo"]=$this->input->post("shirts");
		$usuarios["estado"]=$this->input->post("estado");
		

        
		$this->PersonasModel->insertUser($usuarios);
    }

    
	}

	

	public function listUsers(){
		
		$data['session'] = $this->session->userdata("session-mvc");
		$data["personas"] = $this->PersonasModel->findAll();

		
		$this->load->view('admin/verUsuarios', $data);
	}

	function delete ($cedula){
		$resultado['valor']=$this->PersonasModel->eliminar($cedula);
		if($resultado['valor']){
		
			redirect('admin/Inicio/listUsers');
		}
		
	}
	public function modificar($cedula){
		

		$this->load->helper('form');
		$data['session'] = $this->session->userdata("session-mvc");
		//$this->load->model('Producto_model');
        $data['datos'] = $this->PersonasModel->obtener_cedula($cedula);
        $this->load->view('admin/modificar', $data);

		if($this->input->server("REQUEST_METHOD")== "POST"){

		    //persona
            $cedula= $this->input->post("cedula");
        
			$data2["email"] = $this->input->post("email");	
			$data2["estado"] = $this->input->post("shirts");
			$data2["password"] = $this->input->post("password");	
			

            $this->PersonasModel->update($cedula, $data2);
			redirect('admin/Inicio/listUsers');
		}
	}
}

/* End of file Inicio.php */
/* Location: ./application/controllers/admin/Inicio.php */