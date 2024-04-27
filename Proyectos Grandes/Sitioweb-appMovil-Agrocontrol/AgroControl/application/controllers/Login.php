<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

	public function index(){
		$this->load->view('iniciar_session');
	}

	public function validarIngreso(){
		$email = $this->input->post('campo_email');
		$password = $this->input->post('campo_password');
		$tipo = $this->input->post('tipo');

		if ($email!="" && $password!="") {
			$this->load->model('AdminModel');
			$this->load->model('UsuariosModel');
			$validacion = $this->UsuariosModel->validarIngreso($email, $password, $tipo);

			if ($validacion) {
				// EXTRAER LOS DATOS DE LA PERSONA Y USUARIO
				$datosPersona = $this->UsuariosModel->getPersonaByEmail($email, $tipo);
				//$datosUsuario = $this->UsuariosModel->getUsuarioByEmail($email);

				// CREAR LA VARIABLE DE SESION
				if($tipo=="ADMIN"){
					$dataSession = [
						"cedula" => $datosPersona->cedula,
						"nombre" => $datosPersona->nombre,
						"email" => $datosPersona->email,
						"pass" => $datosPersona->pass,
						"estado" => $datosPersona->estado,
						"foto" => $datosPersona->foto,
						"tipo" => "ADMIN"
					 ];
					 

	  				$this->session->set_userdata("session-mvc", $dataSession);
					  redirect('admin/Inicio','refresh');
				}else{
					$dataSession = [
						"cedula" => $datosPersona->cedula,
						"nombre" => $datosPersona->nombre,
						"apellido" => $datosPersona->apellido,
						"email" => $datosPersona->email,
						"pass" => $datosPersona->pass,
						"telefono" => $datosPersona->telefono,
						"estado" => $datosPersona->estado,
						"img" => $datosPersona->img,
						"tipo" => "AGRICULTOR"
					 ];
					 
	  				$this->session->set_userdata("session-mvc", $dataSession);
					  redirect('vendedor/Inicio','refresh');
				}
				

				// REDIRECCIONAR AL CONTROLADOR INICIAL SEGUN EL TIPO DE USUARIO
				// if ( $datosUsuario->tipo == "ADMIN" ) {
					
				// }else if( $datosUsuario->tipo == "VENDEDOR" ){
					
				// }else{
					
				// }
			}else{
				$data['datosInvalidos'] = true;
				$this->load->view('iniciar_session', $data);
			}		
		}else{
			$data['errorInData'] = true;
			$data['valueEmail'] = $email;
			$data['valuePassword'] = $password;
			$this->load->view('iniciar_session', $data);
		}
	}

	public function registroUsuario(){
		echo "Cargando vista para registrar al usuario";
	}

	public function cerrarSession(){
		$this->session->sess_destroy();
		redirect('Login','refresh');
		
	}

}
