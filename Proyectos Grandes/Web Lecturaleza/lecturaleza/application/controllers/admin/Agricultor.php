<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Agricultor extends CI_Controller
{

	public function __construct()
	{
		parent::__construct();
		$this->load->helper('form');

		$this->load->model('AgricultoresModel');
		$this->load->database();
	}

	public function index(){
		$data['session'] = $this->session->userdata("session-mvc");
        $this->load->view('admin/plantillaAdmin', $data);
	}

	public function listaAgricultores()
	{
		$vdata["agricultores"] = $this->AgricultoresModel->obtenerAgricultores();
		$vdata['session'] = $this->session->userdata("session-mvc");

		$this->load->view('admin/lista_agricultores', $vdata);
	}
	public function crearAgricultores()
	{
		$data['session'] = $this->session->userdata("session-mvc");
		$data['date_editado'] = $this->session->flashdata('date_editado');
		$data['date_eliminados'] = $this->session->flashdata('date_eliminados');
		$data['date_error'] = $this->session->flashdata('date_error');
		$data['date_incompletos'] = $this->session->flashdata('date_incompletos');
		$data['date_repetidos'] = $this->session->flashdata('date_repetidos');
		$data['date_validos'] = $this->session->flashdata('date_validos');
		$data['estado_cambiado'] = $this->session->flashdata('estado_cambiado');
		$data['img_error'] = $this->session->flashdata('img_error');
		$data['tipo'] = $this->session->flashdata('tipo');
		$this->load->view('admin/CrearAgricultor', $data);
	}

	public function actualizarImagenAgri($documento){
        $data['session'] = $this->session->userdata("session-mvc");

        $imagen = $_FILES['new_imagen']['name'];

        if (isset($imagen)  && $imagen!="") {
            $tipo_img = $_FILES['new_imagen']['type'];
            $temp = $_FILES['new_imagen']['tmp_name'];

            if (!((strpos($tipo_img,'gif') || strpos($tipo_img,'jpeg') || strpos($tipo_img,'webp') || strpos($tipo_img,'png')))) {
                $_SESSION['mensaje'] = 'Solo se permite archivos jpeg, gif, webp, png';
                $data['session'] = $this->session->userdata("session-mvc");
				$this->session->set_flashdata('img_error', true);
                $this->session->set_flashdata('tipo', 'danger');
                redirect('admin/inicio/openLisFarmers', 'refresh');
            } else {

                $this->load->model('AgricultoresModel');


                $resultado = $this->AgricultoresModel->actualizarImagenAgri($imagen,$documento);

                if ($resultado) {
                    move_uploaded_file($temp, 'assets/dist/imgAgricultores/' . $imagen);
                    // $_SESSION['mensaje'] = 'Se ha subido correctamente';
                    // $data['date_validos'] = true;
                    // $_SESSION['tipo'] = 'success';
                    // $data['session'] = $this->session->userdata("session-mvc");
                    //$this->load->view('cliente/inicioCliente', $data);
					$this->session->set_flashdata('date_validos', true);
					$this->session->set_flashdata('tipo', 'success');
                    redirect('admin/inicio/openLisFarmers', 'refresh');
                } else {
                    $this->session->set_flashdata('date_error', true);
					$this->session->set_flashdata('tipo', 'danger');
					redirect('admin/Inicio/openLisFarmers', 'refresh');
                }
            }
        } else {
            $this->session->set_flashdata('date_incompletos', true);
			$this->session->set_flashdata('tipo', 'danger');
			redirect('admin/inicio/openLisFarmers', 'refresh');
        }
    }
	
	public function createUsers(){
		$cedula = $_POST['cedula'];
        $nombre = $_POST['nombre'];
        $apellido = $_POST['apellido'];
        $telefono = $_POST['telefono'];
        $direccion = $_POST['direccion'];
        $estado = $_POST['estado'];
        $imagen = $_FILES['new_imagen']['name'];

        if (isset($imagen) && $cedula!="" && $nombre!="" && $apellido!="" && $telefono!="" && $direccion!="" && $estado!="" && $imagen!="") {
            $tipo_img = $_FILES['new_imagen']['type'];
            $temp = $_FILES['new_imagen']['tmp_name'];

            if (!((strpos($tipo_img,'gif') || strpos($tipo_img,'jpeg') || strpos($tipo_img,'webp') || strpos($tipo_img,'png')))) {
                $data['session'] = $this->session->userdata("session-mvc");
                $this->session->set_flashdata('img_error', true);
                $this->session->set_flashdata('tipo', 'danger');
                redirect('admin/inicio/openLisFarmers', 'refresh');
            } else {
                $this->load->model('AgricultoresModel');
                // Verificar si la cedula del agricultor ya existe en la base de datos
                $agricultorExistente = $this->AgricultoresModel->getAgricultorPorCedula($cedula);
    
                if ($agricultorExistente) {
                    // La cedula del agricultor ya existe
                    $this->session->set_flashdata('date_repetidos', true);
                    $this->session->set_flashdata('tipo', 'danger');
                    redirect('admin/inicio/openLisFarmers', 'refresh');
                } else {
                    $resultado = $this->AgricultoresModel->insert($cedula, $nombre, $apellido, $telefono, $direccion, $estado, $imagen);

                    if ($resultado) {
                        move_uploaded_file($temp, 'assets/dist/imgAgricultores/' . $imagen);   
                        // $_SESSION['mensaje'] = 'Se ha subido correctamente';
                        // $data['date_validos'] = true;
                        // $_SESSION['tipo'] = 'success';
                        // $data['productos'] = $this->AgricultoresModel->obtener_productos();
                        // $data['session'] = $this->session->userdata("session-mvc");
                        $this->session->set_flashdata('date_validos', true);
                        $this->session->set_flashdata('tipo', 'success');
                        redirect('admin/inicio/openLisFarmers', 'refresh');
                    } else{
                        $this->session->set_flashdata('date_error', true);
                        $this->session->set_flashdata('tipo', 'danger');
                        redirect('admin/inicio/openLisFarmers', 'refresh');
                    }
                }
            }
        } else {
            $data['session'] = $this->session->userdata("session-mvc");
            $this->session->set_flashdata('date_incompletos', true);
            $this->session->set_flashdata('tipo', 'danger');
            // $data['productos'] = $this->AgricultoresModel->obtener_productos();
            redirect('admin/inicio/openLisFarmers', 'refresh');
        }
	}


	public function ver($id = null)
	{
		$AgricultoresModel = $this->AgricultoresModel->find($id);

		if (isset($AgricultoresModel)) {

			$vdata["cedula"] = $AgricultoresModel->cedula;
			$vdata["nombre"] = $AgricultoresModel->nombre;
			$vdata["apellido"] = $AgricultoresModel->apellido;
			$vdata["direccion"] = $AgricultoresModel->direccion;
			$vdata["telefono"] = $AgricultoresModel->telefono;
			$vdata["estado"] = $AgricultoresModel->estado;
		} else {
			$vdata["cedula"] = $vdata["nombre"] = $vdata["apellido"] = $vdata["direccion"] = $vdata["telefono"] = $vdata["estado"] = "";
		}
		$this->load->view('admin/ver', $vdata);
	}

	// public function borrar($id = null)
	// {
	// 	$this->Producto->delete($id);
	// 	redirect("/admin/listaAgricultores");
	// }

	public function editarAgricultor($documento) {
		$data['session'] = $this->session->userdata("session-mvc");
		$data['agricultor'] = $this->AgricultoresModel->obtenerAgricultorPorDocumento($documento);
		$this->load->view('admin/editar_agricultor', $data);
	}

	public function guardarCambiosAgricultor() {

		$documento = $this->input->post('documento');
        $nombre = $this->input->post('nombre');
        $apellido = $this->input->post('apellido');
        $direccion = $this->input->post('direccion');
        $telefono = $this->input->post('telefono');

        // Verificar si el documento está disponible
        if ($documento) {
            // Llamada a la función actualizarProducto del modelo
            $resultado = $this->AgricultoresModel->actualizarAgricultor($documento, $nombre, $apellido, $direccion, $telefono);

            if ($resultado) {
                // $_SESSION['mensaje'] = 'Se ha editado correctamente';
                // $data['date_editado'] = true;
                // $_SESSION['tipo'] = 'success';
                // $data['session'] = $this->session->userdata("session-mvc");
                $this->session->set_flashdata('date_editado', true);
                $this->session->set_flashdata('tipo', 'success');
                redirect('admin/inicio/openLisFarmers', 'refresh');
                // $this->session->set_flashdata('mensaje', 'Cambios guardados correctamente');
                // $this->session->set_flashdata('tipo', 'success');
            } else {
                // $_SESSION['mensaje'] = 'Error al guardar los cambios';
                // $data['date_error'] = true;
                // $_SESSION['tipo'] = 'danger';
                // $data['session'] = $this->session->userdata("session-mvc");
                $this->session->set_flashdata('date_error', true);
                $this->session->set_flashdata('tipo', 'danger');
                redirect('admin/inicio/openLisFarmers', 'refresh');
                // $this->session->set_flashdata('mensaje', 'Error al guardar los cambios');
                // $this->session->set_flashdata('tipo', 'danger');
            }
        } else {
            // Manejar el caso cuando el documento no está presente
            // $_SESSION['mensaje'] = 'Error: Datos sin llenar';
            // $data['date_incompletos'] = true;
            // $_SESSION['tipo'] = 'danger';
            // $data['session'] = $this->session->userdata("session-mvc");
            $this->session->set_flashdata('date_incompletos', true);
            $this->session->set_flashdata('tipo', 'danger');
            redirect('admin/inicio/openLisFarmers', 'refresh');
            // $this->session->set_flashdata('mensaje', 'ID de producto no válido');
            // $this->session->set_flashdata('tipo', 'danger');
        }
	}

	public function cambiarEstadoAgricultor($id_agricultor) {
		$this->load->model('AgricultoresModel');    

		
		$actualizacion = $this->AgricultoresModel->cambiarEstadoAgricultor($id_agricultor, 'INACTIVO');

		if ($actualizacion) {
			
			// $data['estado_cambiado'] = true;
			// $_SESSION['tipo'] = 'success';
			// $data['session'] = $this->session->userdata("session-mvc");
			$this->session->set_flashdata('estado_cambiado', true);
			$this->session->set_flashdata('tipo', 'success');
		} else {
			
			// $data['estado_error'] = true;
			// $_SESSION['tipo'] = 'danger';
			// $data['session'] = $this->session->userdata("session-mvc");
			$this->session->set_flashdata('estado_error', true);
			$this->session->set_flashdata('tipo', 'danger');
		}

		redirect('admin/inicio/openLisFarmers', 'refresh');
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
			$this->load->view('admin/lista_agricultores', $data);
		} else {
       
			 $data['error_message'] = 'Por favor, ingrese un término de búsqueda.';
			// $this->load->view('tu_vista', $data);
		}
	}

    public function productosAgricultor($id_agricultor) {
        // Carga los productos asociados al agricultor utilizando el ID proporcionado
        $productos = $this->AgricultoresModel->obtenerProductosPorAgricultor($id_agricultor);
    
        // Pasa los datos a la vista
        $data['productos'] = $productos;
        $data['session'] = $this->session->userdata('session-mvc');
    
        // Carga la vista de los productos asociados al agricultor
        $this->load->view('admin/productos_agricultor', $data);
    }
    
    public function productosAgricultor2($id_agricultor) {
        // Carga los productos asociados al agricultor utilizando el ID proporcionado
        $productos = $this->AgricultoresModel->obtenerProductosPorAgricultor($id_agricultor);
    
        // Pasa los datos a la vista
        $data['productos'] = $productos;
        $data['session'] = $this->session->userdata('session-mvc');
    
        // Carga la vista de los productos asociados al agricultor
        $this->load->view('cliente/list_pagricultores', $data);
    }
    
}
