<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends CI_Controller {

	
	public function index(){
		$this->load->view('login');
	}
    public function login(){
		$this->load->view('login');
	}

    public function validarIngreso(){
		$email = $this->input->post('campo_email');
		$password = $this->input->post('campo_password');
		$this->load->database();
		$this->load->helper('form');


		if ($email!="" && $password!="") {

			$this->load->model('PersonasModel');
			$validacion = $this->PersonasModel->validarIngreso($email, $password);

			if ($validacion) {
				// EXTRAER LOS DATOS DE LA PERSONA Y USUARIO
				$datosPersona = $this->PersonasModel->getPersonaByEmail($email);
				

				// CREAR LA VARIABLE DE SESION
				$dataSession = [
								  "cedula" => $datosPersona->cedula,
								  "nombres" => $datosPersona->nombres, 
								  "email" => $datosPersona->email,
								  "password" => $datosPersona->password,
								  "estado" => $datosPersona->estado,
								  "tipo" => $datosPersona->tipo,
							   ];
				$this->session->set_userdata("session-mvc", $dataSession);

				// REDIRECCIONAR AL CONTROLADOR INICIAL SEGUN EL TIPO DE USUARIO
				if ( $datosPersona->tipo == "ADMIN" ) {
					redirect('Inicio','refresh');
				}else if( $datosPersona->tipo == "CAJERO" ){
					redirect('Inicio_cajero','refresh');
				}else{
					redirect('Dashboard','refresh');
				}
				
			}else{
				$data['datosInvalidos'] = true;
				$this->load->view('login', $data);
			}		
		}else{
			$data['errorInData'] = true;
			$data['valueEmail'] = $email;
			$data['valuePassword'] = $password;
			$this->load->view('login', $data);
		}
	}
	public function cerrarSession(){
		$this->session->sess_destroy();
		redirect('Dashboard','refresh');
	}
}
