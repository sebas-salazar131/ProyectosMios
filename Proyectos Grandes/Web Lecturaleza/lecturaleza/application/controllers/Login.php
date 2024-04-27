<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

	public function index(){
		$data['date_error'] = $this->session->flashdata('date_error');
		$data['datosInvalidos'] = $this->session->flashdata('datosInvalidos');
		$data['tipo'] = $this->session->flashdata('tipo');
		$this->load->view('iniciar_sesion', $data);
	}

	public function validarIngreso(){
		$email = $this->input->post('campo_email');
		$password = $this->input->post('campo_password');

		if ($email!="" && $password!="") {
			//$this->load->model('PersonasModel');
			$this->load->model('UsuariosModel');
			$validacion = $this->UsuariosModel->validarIngreso($email, $password);
			// var_dump($validacion);

			if ($validacion) {
				// var_dump($datosUsuario);
				// EXTRAER LOS DATOS DE LA PERSONA Y USUARIO
				//$datosPersona = $this->PersonasModel->getPersonaByEmail($email);
				$datosUsuario = $this->UsuariosModel->getUsuarioByEmail($email);

				// CREAR LA VARIABLE DE SESION
				$dataSession = [
								  "id_usuario" => $datosUsuario->id_usuario,
								  "documento" => $datosUsuario->documento,
								  "nombres" => $datosUsuario->nombres,
								  "apellidos" => $datosUsuario->apellidos,
								  "telefono" => $datosUsuario->telefono,
								  "direccion" => $datosUsuario->direccion,
								  "email" => $datosUsuario->email,
								  "img" => $datosUsuario->img,
								  "tipo" => $datosUsuario->tipo,
								  "estado" => $datosUsuario->estado,
							   ];
				$this->session->set_userdata("session-mvc", $dataSession);

				// REDIRECCIONAR AL CONTROLADOR INICIAL SEGUN EL TIPO DE USUARIO
				if ( $datosUsuario->tipo == "ADMIN" && $datosUsuario->estado == "ACTIVO") {
					$this->session->set_flashdata('date_valido', true);
					$this->session->set_flashdata('tipo', 'success');
					redirect('admin/Inicio','refresh');
				}else if ( $datosUsuario->tipo == "ADMIN" && $datosUsuario->estado == "INACTIVO"){
					$this->session->set_flashdata('datosInvalidos', true);
					$this->session->set_flashdata('tipo', 'danger');
					redirect('/Login/index', 'refresh');
				}else if( $datosUsuario->tipo == "CLIENTE" ){
					redirect('cliente/Inicio','refresh');
				}else{
					redirect('Login','refresh');
				}
			}else{
				$this->session->set_flashdata('date_error', true);
				// $this->session->set_flashdata('datosInvalidos', true);
				$this->session->set_flashdata('tipo', 'danger');
				redirect('/Login/index', 'refresh');
			}
		}
	}

	public function actualizarSesion($email){

		$datosUsuario = $this->UsuariosModel->getUsuarioByEmail($email);

				// CREAR LA VARIABLE DE SESION
				$dataSession = [
								  "documento" => $datosUsuario->documento,
								  "nombres" => $datosUsuario->nombres,
								  "apellidos" => $datosUsuario->apellidos,
								  "telefono" => $datosUsuario->telefono,
								  "direccion" => $datosUsuario->direccion,
								  "email" => $datosUsuario->email,
								  "img" => $datosUsuario->img,
								  "tipo" => $datosUsuario->tipo,
								  "estado" => $datosUsuario->estado,
							   ];
				$this->session->set_userdata("session-mvc", $dataSession);
	}

	public function cerrarSession(){
		$this->session->sess_destroy();
		redirect('SinLog','refresh');
	}

}