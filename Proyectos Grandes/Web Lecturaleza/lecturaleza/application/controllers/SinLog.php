<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SinLog extends CI_Controller {
	
    public function __construct(){
		parent::__construct();
		$this->load->model('UsuariosModel');
		$this->load->model('ProductosModel');
		$this->load->model('PedidosModel');
		$this->load->model('AgricultoresModel');
		$this->load->database();
		$validacion = $this->session->has_userdata("session-mvc");
		
	}
	

    public function index(){
        $data['productos'] = $this->ProductosModel->obtener_productos();
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('cliente/inicioCliente', $data);
	}

    public function iniciarSesion(){
        redirect('Login','refresh');
    }


    public function opencrearClientes(){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['date_eliminados'] = $this->session->flashdata('date_eliminados');
		$data['date_validos'] = $this->session->flashdata('date_validos');
		$data['date_editado'] = $this->session->flashdata('date_editado');
		$data['date_error'] = $this->session->flashdata('date_error');
		$data['mensaje'] = $this->session->flashdata('mensaje');
		$data['tipo'] = $this->session->flashdata('tipo');
		$this->load->view('cliente/registroUsuario', $data);
	}

    public function registrarUsuarioo() {
		$tipo_predeterminado = "CLIENTE";
		$estado_predeterminado = "ACTIVO";

		$documento = $this->input->post('documento');
		$nombres = $this->input->post('nombres');
		$apellidos = $this->input->post('apellidos');
		$direccion = $this->input->post('nuevo_direccion');
		$telefono = $this->input->post('telefono');
		$email = $this->input->post('email');
		$tipo = $tipo_predeterminado ;
		$estado = $estado_predeterminado ;
		$password = $this->input->post('password');
		
		
		if ($documento!="" && $nombres!="" && $apellidos!="" && $direccion!="" && $telefono!="" && $email!="" && $tipo!="" && $estado!="" && $password!="") {
			$this->load->model('UsuariosModel');
			
			$resultado = $this->UsuariosModel->insertarCliente($documento, $nombres, $apellidos, $direccion, $telefono, $email, $tipo, $estado, $password);
	         print_r($resultado);
			if ($resultado) {
				$_SESSION['mensaje'] = 'Se ha creado el Cliente correctamente';
				$data['date_validos'] = true;
				$_SESSION['tipo'] = 'success';
				$data['session'] = $this->session->userdata("session-mvc");
				$this->session->set_flashdata('date_validos', true);
                $this->session->set_flashdata('tipo', 'success');
                redirect('Login', 'refresh');
				print_r($resultado);
			} else {
				$_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
				$_SESSION['tipo'] = 'danger';
				$this->session->set_flashdata('date_error', true);
                $this->session->set_flashdata('tipo', 'danger');
                redirect('cliente/Inicio/registrarUsuarioo', 'refresh');
				print_r($resultado);
			}
		} else {
			$data['dateIncompletos'] = true;
			$this->session->set_flashdata('date_incompletos', true);
			$this->session->set_flashdata('tipo', 'danger');
			//redirect('cliente/Inicio/registrarUsuarioo', 'refresh');
			//print_r($resultado);
		}	
	}

    public function producto_por_categoria($tipo){
        $data['session'] = $this->session->userdata("session-mvc");
        $data['productos'] = $this->ProductosModel->Obtener_categoria($tipo);
		$this->load->view('cliente/allProductos', $data);
	
	}

    public function allProductos(){
		
		
		$data['productos'] = $this->ProductosModel->obtener_productos();
		$data['session'] = $this->session->userdata("session-mvc");
		
		
		$this->load->view('cliente/allProductos', $data);
		
	}

    public function detallesProducto($id_producto){
		
		$data['productos'] = $this->ProductosModel->getProducto($id_producto);
		$data['session'] = $this->session->userdata("session-mvc");
		$data['id_producto']=$id_producto;
		
		//print_r($data['productos']);
		$this->load->view('cliente/detalle_producto', $data);
		
	}

	public function contacto(){
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('cliente/contacto', $data);
	}

	public function insertarPedido(){
		$data['session'] = $this->session->userdata('session-mvc');
		$id_usuario = $data['session']['id_usuario'];
		$nombres = $data['session']['nombres'];
		$ultima_id=0;
		//fecha actual
		$fecha_actual = new DateTime();
        $fecha_formateada = $fecha_actual->format('Y-m-d');
        //echo $fecha_formateada;
	
		if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['productos'])) {
			foreach ($_POST['productos'] as $index => $producto) {
				$id_producto = $producto['id'];
				$nombre = $producto['nombre'];
				$cantidad = $producto['cantidad'];
				$precio = $producto['precio'];

				$total_unitario= $precio * $cantidad;
				if($index==0){
					$ultima_id=$this->PedidosModel->insertar($id_producto, $id_usuario, $fecha_formateada, $nombres, $cantidad, $total_unitario);
				}else{
					$this->PedidosModel->insertarMismaId($ultima_id, $id_producto, $id_usuario, $fecha_formateada, $nombres, $cantidad, $total_unitario);
				}
				
				echo "ultima_id".$ultima_id;
				//echo "Pedido recibido".$nombres."----". $total_unitario ;
				// Aquí podrías procesar cada producto, como insertarlo en la base de datos
			}
			
			// Redirigir o hacer algo después de procesar los productos
			
		}
		$id_productos = $this->ProductosModel->obtenerIdCarrito($id_usuario);
		$productos = array();
		
		foreach ($id_productos as $id_producto) {
			$datos_producto = $this->ProductosModel->obtenerId_producto($id_producto);
	
			$productos[] = $datos_producto;
		}
		$telefono = $this->UsuariosModel->extraerTelefono(); // Agrega un teléfono al arreglo
		
		$data['telefono']=$telefono;
		$data['carrito'] = $productos;
		
		$this->load->view('cliente/carrito', $data);


	}

	public function listaAgricultores()
	{
		$vdata["agricultores"] = $this->AgricultoresModel->obtenerAgricultores();
		$vdata['session'] = $this->session->userdata("session-mvc");

		$this->load->view('cliente/list_agricultores', $vdata);
	}
	// Funcion para el buscador
	public function buscarAgricultores() {
		$buscar = $this->input->post('buscar');

		// Validar que se ha ingresado algo en el campo de búsqueda
		if (!empty($buscar)) {
			// Lógica para buscar agricultores que coincidan con el nombre, apellido, teléfono o cédula
			$this->db->like('nombre', $buscar);
			$this->db->or_like('apellido', $buscar);
			$this->db->or_like('telefono', $buscar);
			$this->db->or_like('cedula', $buscar);
            $this->db->where('estado', 'ACTIVO');
			// Obtener los resultados de la búsqueda
			$resultados_de_la_busqueda = $this->db->get('agricultores')->result();

			// Pasar los resultados a la vista
			$data['agricultores'] = $resultados_de_la_busqueda;
			$data['session'] = $this->session->userdata('session-mvc');

			// Cargar la vista actual con los resultados
			$this->load->view('cliente/list_agricultores', $data);
		} else {
       
			 $data['error_message'] = 'Por favor, ingrese un término de búsqueda.';
			// $this->load->view('tu_vista', $data);
		}
	}

	public function buscarProduAgricultores() {
		$buscar = $this->input->post('buscar');

		// Validar que se ha ingresado algo en el campo de búsqueda
		if (!empty($buscar)) {
			// Lógica para buscar agricultores que coincidan con el nombre, apellido, teléfono o cédula
			$this->db->like('precio_venta', $buscar);
			$this->db->or_like('cantidad_disponible', $buscar);
			$this->db->or_like('fecha_vencimiento', $buscar);
			$this->db->or_like('tipo', $buscar);
            $this->db->where('estado', 'ACTIVO');
			// Obtener los resultados de la búsqueda
			$resultados_de_la_busqueda = $this->db->get('productos')->result();

			// Pasar los resultados a la vista
			$data['productos'] = $resultados_de_la_busqueda;
			$data['session'] = $this->session->userdata('session-mvc');

			// Cargar la vista actual con los resultados
			$this->load->view('cliente/list_pagricultores', $data);
		} else {
       
			 $data['error_message'] = 'Por favor, ingrese un término de búsqueda.';
			// $this->load->view('tu_vista', $data);
		}
	}
	
}