<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login_felipe extends CI_Controller {
 
	public function login(){
        $this->load->view('login/login');
       
    }
    public function ingresar(){
        $this->load->model('Registrar_usuario');
        $email=$this->input->post('campo_email');
        $password=$this->input->post('campo_password');
        $validacion = $this->Registrar_usuario->validarIngreso($email, $password);
       
            $this->load->view('login/consultar');
        
    }
    public function registrar(){
        $this->load->helper('form');
        $this->load->model('Registrar_usuario');
        $this->load->view('login/registrar');

        if($this->input->server("REQUEST_METHOD")== "POST"){

            $data["username"] = $this->input->post("username");
            $data["email"] = $this->input->post("email");
            $data["password"] = $this->input->post("password");
            $data["estado"] = $this->input->post("estado");
            
			$this->Registrar_usuario->insert($data);
			
		}
    }
    public function listado(){
        $this->load->model('Registrar_usuario');
		$vdata["personas"] = $this->Registrar_usuario->findAll();
		$this->load->view('login/consultar', $vdata);

	}

    
    public function modificar($id){
		$this->load->helper('form');
		
		$this->load->model('Registrar_usuario');
        $data['datos'] = $this->Registrar_usuario->find($id);
        $this->load->view('login/editar', $data);

		if($this->input->server("REQUEST_METHOD")== "POST"){
            $id= $this->input->post("id");
            $data2["username"] = $this->input->post("username");
            $data2["email"] = $this->input->post("email");
            $data2["password"] = $this->input->post("password");
            $data2["estado"] = $this->input->post("estado");
            $this->Registrar_usuario->update($id, $data2);
			redirect('index.php/Login_felipe/listado');
		}
	}

    public function eliminar($id){
        $this->load->model('Registrar_usuario');
        $this->Registrar_usuario->delete($id);
		redirect('index.php/Login_felipe/listado');
    }
}
