<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inicio extends CI_Controller {
	
	public function __construct(){
		parent::__construct();
		$this->load->helper('form');
        $this->load->model('UsuariosModel');
		$this->load->model('Estadisticas_model');
		$this->load->library('curl');
        $this->load->database();
		$validacion = $this->session->has_userdata("session-mvc");
		if ($validacion) {
			$session = $this->session->userdata("session-mvc");
			if ($session['tipo']=="ADMIN" && $session['estado']=="ACTIVO") {
				print_r($session['tipo']);
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
		// Obtener datos desde el modelo
		$estadisticas = $this->Estadisticas_model->getEstadisticas();
		// Asignar datos a variables individuales
		$cultivos = $estadisticas['cultivos'];
		$agricultores = $estadisticas['agricultores'];
		$tareas = $estadisticas['tareas'];
		$tareas_finalizadas = $estadisticas['tareas_finalizadas'];
		$tareas_pendientes = $estadisticas['tareas_pendientes'];

		// Pasar variables a la vista
		$data['cultivos'] = $cultivos;
		$data['agricultores'] = $agricultores;
		$data['tareas'] = $tareas;
		$data['tareas_finalizadas'] = $tareas_finalizadas;
		$data['tareas_pendientes'] = $tareas_pendientes;
	    $data['session'] = $this->session->userdata("session-mvc");
		// Cargar vista con los datos
		
		$this->load->view('admin/inicio', $data);
		
		
	}

	public function actualizarCultivo($id_cultivo){
		$data['session'] = $this->session->userdata("session-mvc");	
		$data['id_cultivo'] = $id_cultivo;
		$this->load->view('admin/actualizarCultivo', $data);
	}

	public function mostrarCultivos(){
		$url = 'http://localhost/APIenPHP-agricultura/cultivos/Obtener.php';

        // Realizar la solicitud GET a la API
        $response = $this->curl->simple_get($url);

        // Procesar los datos recibidos (puede variar dependiendo de la estructura de los datos)
        $respuesta = json_decode($response, true);

        // Hacer algo con los datos, como pasarlos a la vista
		$data['datos']=$respuesta;
		$data['session'] = $this->session->userdata("session-mvc");
        $this->load->view('admin/verCultivos', $data );
	}

	public function mostrarperfil(){
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('admin/perfil', $data);
	}

	public function crearCultivo(){
		
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('admin/crearCultivo', $data);
	}


	public function mostrarAgricultores(){
		$url = 'http://localhost/APIenPHP-agricultura/agricultor/Obtener.php';

        // Realizar la solicitud GET a la API
        $response = $this->curl->simple_get($url);

        // Procesar los datos recibidos (puede variar dependiendo de la estructura de los datos)
        $respuesta = json_decode($response, true);

        // Hacer algo con los datos, como pasarlos a la vista
		$data['datos']=$respuesta;
		$data['session'] = $this->session->userdata("session-mvc");
        $this->load->view('admin/verUsuarios', $data );
	}



	// public function listado()
	// {
	// 	$vdata["personas"] = $this->PersonasModel->findAll();

	// 	$this->load->view('verUsarios', $vdata);
	// }

	public function openCreateUser(){
		
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('admin/crearUsuario', $data);
		

        

		// if ($this->input->server("REQUEST_METHOD") == "POST") {
		// 	$datas["cedula"] = $this->input->post("documento");
		// 	$datas["nombres"] = $this->input->post("nombre");
		// 	$datas["apellidos"] = $this->input->post("apellido");
		// 	$datas["email"] = $this->input->post("correo");
		// 	$datas["telefono"] = $this->input->post("telefono");
		// 	$datas["direccion"] = $this->input->post("direccion");
		// 	$datas["foto"] = $this->input->post("foto");

		// 	$usuarios["cedula"]=$this->input->post("documento");
		// 	$usuarios["email"]=$this->input->post("correo");
		// 	$contraseña=$this->input->post("contrasenia");
		// 	$usuarios["password"]=md5($contraseña);
		// 	$usuarios["tipo"]=$this->input->post("shirts");
		// 	$usuarios["estado"]=$this->input->post("estado");
			

		// 	$this->PersonasModel->insert($datas);
		// 	$this->PersonasModel->insertUser($usuarios);
		// }

    
	}

	public function actualizarPersona($cedula){
		$data['session'] = $this->session->userdata("session-mvc");	
		$data['cedula'] = $cedula;	
		$this->load->view('admin/actualizarUsuario', $data);
	}



	

	public function InsertarTareas(){

		$url = 'http://localhost/APIenPHP-agricultura/cultivos/Obtener.php';

        // Realizar la solicitud GET a la API
        $response = $this->curl->simple_get($url);

        // Procesar los datos recibidos (puede variar dependiendo de la estructura de los datos)
        $respuesta = json_decode($response, true);

        // Hacer algo con los datos, como pasarlos a la vista
		$data['datos']=$respuesta;
		
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('admin/crearTarea', $data);
	}

	public function verTareas(){
		$url = 'http://localhost/APIenPHP-agricultura/tareas/Obtener.php';

        // Realizar la solicitud GET a la API
        $response = $this->curl->simple_get($url);

        // Procesar los datos recibidos (puede variar dependiendo de la estructura de los datos)
        $respuesta = json_decode($response, true);

        // Hacer algo con los datos, como pasarlos a la vista
		$data['datos']=$respuesta;
		$data['session'] = $this->session->userdata("session-mvc");
        $this->load->view('admin/verTareas', $data );
	}

	public function actualizarTarea($id_tarea){
		$url = 'http://localhost/APIenPHP-agricultura/cultivos/Obtener.php';

        // Realizar la solicitud GET a la API
        $response = $this->curl->simple_get($url);

        // Procesar los datos recibidos (puede variar dependiendo de la estructura de los datos)
        $respuesta = json_decode($response, true);

        // Hacer algo con los datos, como pasarlos a la vista
		$data['datos']=$respuesta;
		
		$data['session'] = $this->session->userdata("session-mvc");	
		$data['id_tarea'] = $id_tarea;	
		$this->load->view('admin/actualizarTarea', $data);
	}

	public function mostrarTareasCultivos(){
		$url = 'http://localhost/APIenPHP-agricultura/cultivos/Obtener.php';

        // Realizar la solicitud GET a la API
        $response = $this->curl->simple_get($url);

        // Procesar los datos recibidos (puede variar dependiendo de la estructura de los datos)
        $respuesta = json_decode($response, true);

        // Hacer algo con los datos, como pasarlos a la vista
		$data['datos']=$respuesta;
		$data['session'] = $this->session->userdata("session-mvc");
        $this->load->view('admin/mostrarAsignar', $data );
	}	


	public function asignarTarea($id_cultivo){
		$url = 'http://localhost/APIenPHP-agricultura/agricultor/Obtener.php';

        // Realizar la solicitud GET a la API
        $response = $this->curl->simple_get($url);

        // Procesar los datos recibidos (puede variar dependiendo de la estructura de los datos)
        $respuesta = json_decode($response, true);

        // Hacer algo con los datos, como pasarlos a la vista
		$data['agricultores']=$respuesta;
		$data['id_cultivo']=$id_cultivo;
		$data['session'] = $this->session->userdata("session-mvc");
        $this->load->view('admin/asignarTarea', $data );
	}

	public function mostrarCultivosSeguiemiento(){
		$url = 'http://localhost/APIenPHP-agricultura/cultivos/Obtener.php';

        // Realizar la solicitud GET a la API
        $response = $this->curl->simple_get($url);

        // Procesar los datos recibidos (puede variar dependiendo de la estructura de los datos)
        $respuesta = json_decode($response, true);

        // Hacer algo con los datos, como pasarlos a la vista
		$data['datos']=$respuesta;
		$data['session'] = $this->session->userdata("session-mvc");
        $this->load->view('admin/seguimientoCultivo', $data );
	}


	public function mostrarTareasSeguiemiento($id_cultivo){
		
		$data['id_cultivo'] = $id_cultivo;
		$data['session'] = $this->session->userdata("session-mvc");
        $this->load->view('admin/seguimientoTarea', $data );
	}

	public function mostrarEstadisticas() {
		// Obtener datos desde el modelo
		$data = $this->Estadisticas_model->getEstadisticas();
	    $data['session'] = $this->session->userdata("session-mvc");
		// Cargar vista con los datos
		$this->load->view('layouts/header', $data);
		$this->load->view('layouts/sidebar', $data);
		$this->load->view('admin/inicio', $data);
		$this->load->view('layouts/footer', $data);
	} 
	
	
}
