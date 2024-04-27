<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inicio extends CI_Controller {
	
	public function __construct(){
		parent::__construct();
		$this->load->model('ProductosModel');
		$this->load->model('UsuariosModel');
		$this->load->model('FacturasModel');
		$this->load->model('AgricultoresModel');
		$this->load->model('Reporte_model');
		$this->load->model('PedidosModel');
		$this->load->model('Venta_model');
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

    // public function index() {
	// 	// Obtener la sesión actual
	// 	$data['session'] = $this->session->userdata("session-mvc");
	
	// 	// Obtener los mensajes flash de fecha válida
	// 	$data['date_validos'] = $this->session->flashdata('date_valido');
	
	// 	// Obtener la fecha actual
	// 	$fecha_actual = date('Y-m-d');
	
	// 	// Obtener los datos para el dashboard
	// 	$data['cantidad_compras'] = $this->Reporte_model->get_cantidad_compras();
	// 	$data['cantidad_productos'] = $this->Reporte_model->get_cantidad_productos();
	// 	$data['cantidad_agricultores_registrados'] = $this->Reporte_model->get_cantidad_agricultores_registrados();
	// 	$data['cantidad_agricultores_activos'] = $this->Reporte_model->get_cantidad_agricultores_activos();
	// 	$data['cantidad_agricultores_inactivos'] = $this->Reporte_model->get_cantidad_agricultores_inactivos();
	// 	$data['cantidad_pedidos_en_proceso'] = $this->Reporte_model->get_cantidad_pedidos_en_proceso();
	// 	$data['cantidad_envios_no_entregados'] = $this->Reporte_model->get_cantidad_envios_no_entregados();
	// 	$data['cantidad_envios_en_camino'] = $this->Reporte_model->get_cantidad_envios_en_camino();
		
	// 	// Obtener el total unitario vendido hoy
	// 	$data['total_vendido'] = $this->Reporte_model->get_total_unitario_vendido_hoy($fecha_actual);
	
	// 	// Cargar la vista con los datos
	// 	$this->load->view('admin/plantillaAdmin', $data);
	// }

	public function index() {
		// Establecer la zona horaria a la de Colombia
		date_default_timezone_set('America/Bogota');
	
		// Obtener la sesión actual
		$data['session'] = $this->session->userdata("session-mvc");
	
		// Obtener los mensajes flash de fecha válida
		$data['date_validos'] = $this->session->flashdata('date_valido');
	
		// Obtener la fecha actual de Colombia
		$fecha_actual = date('Y-m-d');
	
		// Obtener los datos para el dashboard
		$data['cantidad_compras'] = $this->Reporte_model->get_cantidad_compras();
		$data['cantidad_productos'] = $this->Reporte_model->get_cantidad_productos();
		$data['cantidad_agricultores_registrados'] = $this->Reporte_model->get_cantidad_agricultores_registrados();
		$data['cantidad_agricultores_activos'] = $this->Reporte_model->get_cantidad_agricultores_activos();
		$data['cantidad_agricultores_inactivos'] = $this->Reporte_model->get_cantidad_agricultores_inactivos();
		$data['cantidad_pedidos_en_proceso'] = $this->Reporte_model->get_cantidad_pedidos_en_proceso();
		$data['cantidad_envios_no_entregados'] = $this->Reporte_model->get_cantidad_envios_no_entregados();
		$data['cantidad_envios_en_camino'] = $this->Reporte_model->get_cantidad_envios_en_camino();
	
		// Obtener el total unitario vendido hoy
		$total_vendido = $this->Reporte_model->get_total_unitario_vendido_hoy($fecha_actual);
	
		// Verificar si la fecha ya existe en la tabla de ventas
		if ($this->Venta_model->verificar_fecha_existente($fecha_actual)) {
			// Si la fecha ya existe, actualizar el total vendido para esa fecha
			$this->Venta_model->actualizar_total_vendido($fecha_actual, $total_vendido);
		} else {
			// Si la fecha no existe, insertar una nueva fila en la tabla de ventas
			$this->Venta_model->insertar_venta($fecha_actual, $total_vendido);
		}
	
		// Pasar el total vendido a la vista
		$data['total_vendido'] = $total_vendido;
	
		// Obtener todas las ventas registradas
		$data['ventas'] = $this->Venta_model->obtener_ventas();
	
		// Cargar la vista con los datos
		$this->load->view('admin/plantillaAdmin', $data);
	}
	
	
	private function insertar_datos_ventas($fecha, $total_vendido) {
		// Cargar el modelo de ventas
		
	
		// Insertar los datos en la tabla de ventas
		$this->Venta_model->insertar_venta($fecha, $total_vendido);
	}
	

// ------------------- PRODUCTOS ---------------------

	// public function createProduct(){
    //     $producto = $_POST['new_producto'];
    //     $precio = $_POST['new_precio'];
    //     $cantidad = $_POST['new_cantidad'];
    //     $descripcion = $_POST['new_descripcion'];
    //     $f_vencimiento = $_POST['new_fecha'];
    //     $tipo = $_POST['new_tipo'];
    //     $imagen = $_FILES['new_imagen']['name'];

    //     if (isset($imagen) && $producto!="" && $precio!="" && $cantidad!="" && $descripcion!="" && $f_vencimiento!="" && $tipo!="" && $imagen!="") {
    //         $tipo_img = $_FILES['new_imagen']['type'];
    //         $temp = $_FILES['new_imagen']['tmp_name'];

    //         if (!((strpos($tipo_img,'gif') || strpos($tipo_img,'jpeg') || strpos($tipo_img,'webp') || strpos($tipo_img,'png')))) {
    //             $_SESSION['mensaje'] = 'Solo se permite archivos jpeg, gif, webp, png';
    //             $data['session'] = $this->session->userdata("session-mvc");
    //             $this->load->view('admin/lista_productos', $data);
    //         } else {
                
    //             $this->load->model('ProductosModel');

                
    //             $resultado = $this->ProductosModel->insertar($producto, $precio, $cantidad, $descripcion, $f_vencimiento, $tipo, $imagen);

    //             if ($resultado) {
    //                 move_uploaded_file($temp, 'assets/distCliente/img/product/' . $imagen);   
    //                 $_SESSION['mensaje'] = 'Se ha subido correctamente';
    //                 $data['date_validos'] = true;
    //                 $_SESSION['tipo'] = 'success';
    //                 $data['session'] = $this->session->userdata("session-mvc");
    //                 $this->load->view('admin/lista_productos', $data);
    //             } else {
    //                 $_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
    //                 $_SESSION['tipo'] = 'danger';
    //             }
    //         }
    //     } else {
    //         $data['session'] = $this->session->userdata("session-mvc");
    //         $data['dateIncompletos'] = true;
    //         $this->load->view('admin/lista_productos', $data);
    //     }
    // }

	public function openCreateProduct(){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['agricultores'] = $this->ProductosModel->obtenerAgricultores();
		$this->load->view('admin/crearProducto', $data);
	}



	public function openLisAdmins(){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['administradores'] = $this->UsuariosModel-> obtenerAdministradores();
		$data['date_editado'] = $this->session->flashdata('date_editado');
		$data['date_eliminados'] = $this->session->flashdata('date_eliminados');
		$data['date_error'] = $this->session->flashdata('date_error');
		$data['date_incompletos'] = $this->session->flashdata('date_incompletos');
		$data['date_repetidos'] = $this->session->flashdata('date_repetidos');
		$data['date_validos'] = $this->session->flashdata('date_validos');
		$data['estado_cambiado'] = $this->session->flashdata('estado_cambiado');
		$data['img_error'] = $this->session->flashdata('img_error');
		$data['tipo'] = $this->session->flashdata('tipo');

		$this->load->view('admin/lista_administradores', $data);
	}

	
	public function openLisUsers(){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['clientes'] = $this->UsuariosModel->obtenerUsuarios();
		$data['date_editado'] = $this->session->flashdata('date_editado');
		$data['date_eliminados'] = $this->session->flashdata('date_eliminados');
		$data['date_error'] = $this->session->flashdata('date_error');
		$data['date_incompletos'] = $this->session->flashdata('date_incompletos');
		$data['date_repetidos'] = $this->session->flashdata('date_repetidos');
		$data['date_validos'] = $this->session->flashdata('date_validos');
		$data['estado_cambiado'] = $this->session->flashdata('estado_cambiado');
		$data['img_error'] = $this->session->flashdata('img_error');
		$data['tipo'] = $this->session->flashdata('tipo');

		$this->load->view('admin/lista_clientes', $data);
	}

	public function openLisFarmers(){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['agricultores'] = $this->AgricultoresModel->obtenerAgricultores();
		$data['date_editado'] = $this->session->flashdata('date_editado');
		$data['date_eliminados'] = $this->session->flashdata('date_eliminados');
		$data['date_error'] = $this->session->flashdata('date_error');
		$data['date_incompletos'] = $this->session->flashdata('date_incompletos');
		$data['date_repetidos'] = $this->session->flashdata('date_repetidos');
		$data['date_validos'] = $this->session->flashdata('date_validos');
		$data['estado_cambiado'] = $this->session->flashdata('estado_cambiado');
		$data['img_error'] = $this->session->flashdata('img_error');
		$data['tipo'] = $this->session->flashdata('tipo');

		$this->load->view('admin/lista_agricultores', $data);
	}

	public function openLisProducts(){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['productos'] = $this->ProductosModel->obtener_productos();
		$data['date_editado'] = $this->session->flashdata('date_editado');
		$data['date_eliminados'] = $this->session->flashdata('date_eliminados');
		$data['date_error'] = $this->session->flashdata('date_error');
		$data['date_incompletos'] = $this->session->flashdata('date_incompletos');
		$data['date_repetidos'] = $this->session->flashdata('date_repetidos');
		$data['date_validos'] = $this->session->flashdata('date_validos');
		$data['estado_cambiado'] = $this->session->flashdata('estado_cambiado');
		$data['img_error'] = $this->session->flashdata('img_error');
		$data['tipo'] = $this->session->flashdata('tipo');

		$this->load->view('admin/lista_productos', $data);
	}

	public function perfil(){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['administradores'] = $this->UsuariosModel->obtenerAdministradores();
		$data['date_editado'] = $this->session->flashdata('date_editado');
		$data['date_eliminados'] = $this->session->flashdata('date_eliminados');
		$data['date_error'] = $this->session->flashdata('date_error');
		$data['date_incompletos'] = $this->session->flashdata('date_incompletos');
		$data['date_repetidos'] = $this->session->flashdata('date_repetidos');
		$data['date_validos'] = $this->session->flashdata('date_validos');
		$data['estado_cambiado'] = $this->session->flashdata('estado_cambiado');
		$data['img_error'] = $this->session->flashdata('img_error');
		$data['tipo'] = $this->session->flashdata('tipo');
		
	// Busca el administrador que esta registrado y autenticado actualmente
		foreach ($data['administradores'] as $administrador) {
			if ($administrador->documento === $data['session']['documento']) {
				$data['administrador'] = $administrador;
				break;
			}
		}
	
		$this->load->view('admin/perfil_admin', $data);
	}
	
	//  PEDIDOS

	public function listpedidos(){
		$data["pedidos"] = $this->PedidosModel->findAll();
		$data['session'] = $this->session->userdata("session-mvc");

		$this->load->view('admin/lista_pedidos', $data);
	}

	// FACTURAS

	public function openListFacturas(){
		$data["facturas"] = $this->FacturasModel->findAll();
		$data['session'] = $this->session->userdata("session-mvc");

		$this->load->view('admin/datatable_facturas', $data);
	}


	//-------------------- ADMINISTRADOR --------------------------

	public function guardarCambiosPerfil() {
		$id_usuario = $this->input->post('id_usuario');
		$nombres = $this->input->post('nombres');
		$apellidos = $this->input->post('apellidos');
		$email = $this->input->post('email');
		$telefono = $this->input->post('telefono');
		$direccion = $this->input->post('direccion');
		//$estado = $this->input->post('estado');
	
		if ($id_usuario && $nombres && $apellidos && $email && $telefono && $direccion) {
			$resultado = $this->UsuariosModel->actualizarAdministrador($id_usuario, $nombres, $apellidos, $email, $telefono, $direccion);
	
			if ($resultado) {
				$_SESSION['mensaje'] = 'Se ha editado correctamente';
				$data['date_validos'] = true;
				$_SESSION['tipo'] = 'success';
				$data['session'] = $this->session->userdata("session-mvc");
				$this->session->set_flashdata('date_editado', true);
				$this->session->set_flashdata('tipo', 'success');
				redirect('admin/Inicio/perfil', 'refresh');
				// $this->session->set_flashdata('mensaje', 'Cambios guardados correctamente');
				// $this->session->set_flashdata('tipo', 'success');
			} else {
				$_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
				$_SESSION['tipo'] = 'danger';
				$this->session->set_flashdata('date_error', true);
				$this->session->set_flashdata('tipo', 'danger');
				redirect('admin/Inicio/perfil', 'refresh');
				// $this->session->set_flashdata('mensaje', 'Error al guardar los cambios');
				// $this->session->set_flashdata('tipo', 'danger');
			}
		} else {
			$data['session'] = $this->session->userdata("session-mvc");
            $this->session->set_flashdata('date_incompletos', true);
			$this->session->set_flashdata('tipo', 'danger');
			redirect('admin/Inicio/perfil', 'refresh');
			// $this->session->set_flashdata('mensaje', 'Error al guardar los cambios. Datos inválidos.');
			// $this->session->set_flashdata('tipo', 'danger');
		}
	
		// redirect('admin/inicio/openLisAdmins', 'refresh');
	}

	public function cambiarEstadoAdmin($id_usuario) {
		$this->load->model('UsuariosModel');    

		
		$actualizacion = $this->UsuariosModel->cambiarEstadoAdmin($id_usuario, 'INACTIVO');

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

		redirect('admin/inicio/openLisAdmins', 'refresh');
	}

	public function editarAdministrador($id_usuario) {
		$data['session'] = $this->session->userdata("session-mvc");
		$data['administrador'] = $this->UsuariosModel->obtenerAdministradorPorId($id_usuario);
		// $data['date_eliminados'] = $this->session->flashdata('date_eliminados');
		// $data['date_validos'] = $this->session->flashdata('date_validos');
		// $data['date_editado'] = $this->session->flashdata('date_editado');
		// $data['date_error'] = $this->session->flashdata('date_error');
		// $data['mensaje'] = $this->session->flashdata('mensaje');
		// $data['tipo'] = $this->session->flashdata('tipo');
		$this->load->view('admin/editar_admin', $data);
	}
	
	public function subirImagen() {
		$data['session'] = $this->session->userdata("session-mvc");
		$documento = $data['session']['documento'];
		$imagen = $_FILES['new_imagen']['name'];
	
		if (isset($imagen) && $imagen != "") {
			$tipo_img = $_FILES['new_imagen']['type'];
			$temp = $_FILES['new_imagen']['tmp_name'];
	
			// Verificar si el tipo de imagen es válido
			if (!((strpos($tipo_img, 'jpeg') !== false) || (strpos($tipo_img, 'gif') !== false) || (strpos($tipo_img, 'webp') !== false) || (strpos($tipo_img, 'png') !== false))) {
				$_SESSION['mensaje'] = 'Solo se permite archivos jpeg, gif, webp, png';
				$data['session'] = $this->session->userdata("session-mvc");
			} else {
				$this->load->model('UsuariosModel');
				$resultado = $this->UsuariosModel->actualizarImagen($imagen, $documento);
				if ($resultado) {
					move_uploaded_file($temp, 'assets/dist/img/admins/' . $imagen);   
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
				
				
	
				// Crear la imagen redimensionada
				
	
				
	
				if ($resultado) {
					$_SESSION['mensaje'] = 'Se ha subido correctamente';
					$_SESSION['tipo'] = 'success';
				} else {
					$_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
					$_SESSION['tipo'] = 'danger';
				}
			}
		} else {
			$_SESSION['mensaje'] = 'No se ha seleccionado ninguna imagen';
			$_SESSION['tipo'] = 'warning';
		}
	
		// Redirigir al usuario de vuelta a la página de inicio
		redirect('admin/Inicio', 'refresh');
	}

	public function guardarCambiosAdministrador() {
		$id_usuario = $this->input->post('id_usuario');
		$nombres = $this->input->post('nombres');
		$apellidos = $this->input->post('apellidos');
		$email = $this->input->post('email');
		$telefono = $this->input->post('telefono');
		$direccion = $this->input->post('direccion');
		//$estado = $this->input->post('estado');
	
		if ($id_usuario && $nombres && $apellidos && $email && $telefono && $direccion) {
			$resultado = $this->UsuariosModel->actualizarAdministrador($id_usuario, $nombres, $apellidos, $email, $telefono, $direccion);
	
			if ($resultado) {
				$_SESSION['mensaje'] = 'Se ha editado correctamente';
				$data['date_validos'] = true;
				$_SESSION['tipo'] = 'success';
				$data['session'] = $this->session->userdata("session-mvc");
				$this->session->set_flashdata('date_editado', true);
				$this->session->set_flashdata('tipo', 'success');
				redirect('admin/Inicio/openLisAdmins', 'refresh');
				// $this->session->set_flashdata('mensaje', 'Cambios guardados correctamente');
				// $this->session->set_flashdata('tipo', 'success');
			} else {
				$_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
				$_SESSION['tipo'] = 'danger';
				$this->session->set_flashdata('date_error', true);
				$this->session->set_flashdata('tipo', 'danger');
				redirect('admin/Inicio/openLisAdmins', 'refresh');
				// $this->session->set_flashdata('mensaje', 'Error al guardar los cambios');
				// $this->session->set_flashdata('tipo', 'danger');
			}
		} else {
			$data['session'] = $this->session->userdata("session-mvc");
            $this->session->set_flashdata('date_incompletos', true);
			$this->session->set_flashdata('tipo', 'danger');
			redirect('admin/inicio/openLisAdmins', 'refresh');
			// $this->session->set_flashdata('mensaje', 'Error al guardar los cambios. Datos inválidos.');
			// $this->session->set_flashdata('tipo', 'danger');
		}
	
		// redirect('admin/inicio/openLisAdmins', 'refresh');
	}
	
	

	public function openCreateAdmin(){
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('admin/crearAdmin', $data);
	}
	
	public function createAdmin(){
		$documento = $this->input->post('nuevo_cedula');
		$nombres = $this->input->post('nuevo_nombres');
		$apellidos = $this->input->post('nuevo_apellidos');
		$direccion = $this->input->post('nuevo_direccion');
		$telefono = $this->input->post('nuevo_telefono');
		$email = $this->input->post('nuevo_email');
		$tipo = $this->input->post('nuevo_tipo');
		$estado = $this->input->post('nuevo_estado');
		$password = $this->input->post('nuevo_password');
		
		if ($documento!="" && $nombres!="" && $apellidos!="" && $direccion!="" && $telefono!="" && $email!="" && $tipo!="" && $estado!="" && $password!="") {
			$this->load->model('UsuariosModel');
			// Verificar si la cedula del cliente ya existe en la base de datos
			$adminExistente = $this->UsuariosModel->getUsuarioPorCedula($documento);
			if ($adminExistente) {
				// La cedula del cliente ya existe
				$this->session->set_flashdata('date_repetidos', true);
				$this->session->set_flashdata('tipo', 'danger');
				redirect('admin/inicio/openLisAdmins', 'refresh');
			} else {
				$resultado = $this->UsuariosModel->insertarAdmin($documento, $nombres, $apellidos, $direccion, $telefono, $email, $tipo, $estado, $password);
		
				if ($resultado) {
					// $_SESSION['mensaje'] = 'Se ha creado el administrador correctamente';
					// $data['date_validos'] = true;
					// $_SESSION['tipo'] = 'success';
					// $data['session'] = $this->session->userdata("session-mvc");
					$this->session->set_flashdata('date_validos', true);
					$this->session->set_flashdata('tipo', 'success');
					redirect('admin/inicio/openLisAdmins', 'refresh');
				} else {
					// $_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
					// $_SESSION['tipo'] = 'danger';
					$this->session->set_flashdata('date_error', true);
					$this->session->set_flashdata('tipo', 'danger');
					redirect('admin/inicio/openLisAdmins', 'refresh');
				}
			}
		} else {
			// $data['session'] = $this->session->userdata("session-mvc");
			$this->session->set_flashdata('date_incompletos', true);
			$this->session->set_flashdata('tipo', 'danger');
			redirect('admin/inicio/openLisAdmins', 'refresh');
		}
	}
	
	//----------------  vista cliente -----------------------------------//
	public function cambiarEstadoCliente($id_usuario) {
		$this->load->model('UsuariosModel');    

		
		$actualizacion = $this->UsuariosModel->cambiarEstadoCliente($id_usuario, 'INACTIVO');

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

		redirect('admin/inicio/openLisUsers', 'refresh');
	}
	
	

	public function editarCliente($id_usuario) {
		$data['session'] = $this->session->userdata("session-mvc");
		$data['Cliente'] = $this->UsuariosModel->obtenerClientePorId($id_usuario);
		$this->load->view('admin/editar_Cliente', $data);
	}

	public function guardarCambiosCliente() {
		$id_usuario = $this->input->post('id_usuario');
		$documento = $this->input->post('documento');
		$nombres = $this->input->post('nombres');
		$apellidos = $this->input->post('apellidos');
		$email = $this->input->post('email');
		$telefono = $this->input->post('telefono');
		$direccion = $this->input->post('direccion');

		$resultado = $this->UsuariosModel->actualizarCliente($id_usuario, $documento, $nombres, $apellidos, $email, $telefono, $direccion);

		if ($resultado) {
			$_SESSION['mensaje'] = 'Se ha editado correctamente';
			$data['date_validos'] = true;
			$_SESSION['tipo'] = 'success';
			$data['session'] = $this->session->userdata("session-mvc");
			$this->session->set_flashdata('date_editado', true);
			$this->session->set_flashdata('tipo', 'success');
			redirect('admin/Inicio/openLisUsers', 'refresh');
		} else {
			$_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
			$_SESSION['tipo'] = 'danger';
			$this->session->set_flashdata('date_error', true);
			$this->session->set_flashdata('tipo', 'danger');
			redirect('admin/Inicio/openLisUsers', 'refresh');
		}
		$this->session->set_flashdata('date_incompletos', true);
		$this->session->set_flashdata('tipo', 'danger');
		redirect('admin/inicio/openLisAdmins', 'refresh');
	}

	public function opencrearClientes(){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['date_eliminados'] = $this->session->flashdata('date_eliminados');
		$data['date_validos'] = $this->session->flashdata('date_validos');
		$data['date_editado'] = $this->session->flashdata('date_editado');
		$data['date_error'] = $this->session->flashdata('date_error');
		$data['mensaje'] = $this->session->flashdata('mensaje');
		$data['tipo'] = $this->session->flashdata('tipo');
		$this->load->view('admin/crearCliente', $data);
	}
	
	public function crearClientes(){
		$documento = $this->input->post('nuevo_cedula');
		$nombres = $this->input->post('nuevo_nombres');
		$apellidos = $this->input->post('nuevo_apellidos');
		$direccion = $this->input->post('nuevo_direccion');
		$telefono = $this->input->post('nuevo_telefono');
		$email = $this->input->post('nuevo_email');
		$tipo = $this->input->post('nuevo_tipo');
		$estado = $this->input->post('nuevo_estado');
		$password = $this->input->post('nuevo_password');
		
		
		if ($documento!="" && $nombres!="" && $apellidos!="" && $direccion!="" && $telefono!="" && $email!="" && $tipo!="" && $estado!="" && $password!="") {
			$this->load->model('UsuariosModel');
			// Verificar si la cedula del cliente ya existe en la base de datos
			$clienteExistente = $this->UsuariosModel->getUsuarioPorCedula($documento);
			if ($clienteExistente) {
				// La cedula del cliente ya existe
				$this->session->set_flashdata('date_repetidos', true);
				$this->session->set_flashdata('tipo', 'danger');
				redirect('admin/inicio/openLisUsers', 'refresh');
			} else {
				$resultado = $this->UsuariosModel->insertarCliente($documento, $nombres, $apellidos, $direccion, $telefono, $email, $tipo, $estado, $password);
		
				if ($resultado) {
					$_SESSION['mensaje'] = 'Se ha creado el Cliente correctamente';
					$data['date_validos'] = true;
					$_SESSION['tipo'] = 'success';
					$data['session'] = $this->session->userdata("session-mvc");
					$this->session->set_flashdata('date_validos', true);
					$this->session->set_flashdata('tipo', 'success');
					redirect('admin/inicio/openLisUsers', 'refresh');
				} else {
					$_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
					$_SESSION['tipo'] = 'danger';
					$this->session->set_flashdata('date_error', true);
					$this->session->set_flashdata('tipo', 'danger');
					redirect('admin/inicio/openLisUsers', 'refresh');
				}
			}
		} else {
			$data['session'] = $this->session->userdata("session-mvc");
			$data['dateIncompletos'] = true;
			$this->session->set_flashdata('date_incompletos', true);
			$this->session->set_flashdata('tipo', 'danger');
			redirect('admin/inicio/openLisUsers', 'refresh');
		}
	}
	
      // Método para actualizar el estado del pedido
	public function actualizarEstadoPedido()
	{
		// Verificar si se están recibiendo los datos de pedido y nuevo estado
		if (isset($_POST['pedido_id']) && isset($_POST['nuevo_estado'])) {
			// Obtener los datos del pedido desde la solicitud POST
			$pedidoId = $this->input->post('pedido_id');
			$nuevoEstado = $this->input->post('nuevo_estado');
			
			// Llamar al método para actualizar el estado del pedido
			$resultado = $this->PedidosModel->actualizarEstado($pedidoId, $nuevoEstado);
			
			// Enviar una respuesta JSON al cliente
			if ($resultado) {
				echo json_encode(array('success' => true));
			} else {
				echo json_encode(array('success' => false));
			}
		} else {
			// Manejar el caso en que no se reciban los datos esperados
			echo json_encode(array('success' => false, 'message' => 'Datos incompletos'));
		}
	}

  	public function registrarFactura()
	{
		if (isset($_POST['pedido_id']) && isset($_POST['id_usuario']) && isset($_POST['total_pedido'])
        && isset($_POST['cantidad_recibida']) && isset($_POST['vueltas'])) {

			$pedidoId = $this->input->post('pedido_id');
			$idUsuario = $this->input->post('id_usuario');
			$totalPedido = $this->input->post('total_pedido');
			$cantidadRecibida = $this->input->post('cantidad_recibida');
			$vueltas = $this->input->post('vueltas');
			$fecha_actual = date("Y-m-d");

			$resultado_insertar = $this->FacturasModel->insertarFactura($idUsuario, $fecha_actual);

			if ($resultado_insertar) {
				// Operación de insertarvexitosa
				echo json_encode(array('success' => true, 'message' => 'Factura registrada correctamente'));
				$resultado_insertar_detalles = $this->FacturasModel->insertarDetallesFactura($resultado_insertar,$pedidoId,$cantidadRecibida,$vueltas,$totalPedido);
			} else {
				// Error al insertar en la base de datos
				echo json_encode(array('success' => false, 'message' => 'Error al registrar la factura'));
			}

		} else {
			// Datos incompletos
			echo json_encode(array('success' => false, 'message' => 'Datos incompletos'));
		}
	}



    

	// Funcion para el buscador de clientes
	public function buscarClientes() {
		$buscar = $this->input->post('buscar');

		// Validar que se ha ingresado algo en el campo de búsqueda
		if (!empty($buscar)) {
			// Lógica para buscar usuarios que coincidan con el nombre, apellido, teléfono o cédula
			$this->db->like('nombres', $buscar);
			$this->db->or_like('apellidos', $buscar);
			$this->db->or_like('telefono', $buscar);
			$this->db->or_like('documento', $buscar);

			// Filtrar por usuarios activos
			$this->db->where('estado', 'ACTIVO'); // Ajusta esto según la estructura real de tu base de datos
			$this->db->where('tipo', 'CLIENTE');
			// Obtener los resultados de la búsqueda
			$resultados_de_la_busqueda = $this->db->get('usuarios')->result();

			// Pasar los resultados a la vista
			$data['clientes'] = $resultados_de_la_busqueda;
			$data['session'] = $this->session->userdata('session-mvc');

			// Cargar la vista actual con los resultados
			$this->load->view('admin/lista_clientes', $data);
		} else {
		
			redirect('admin/lista_clientes');

		}
	}

	// Funcion para el buscador del administrador
	public function buscarAdministrador() {
		$buscar = $this->input->post('buscar');

		// Validar que se ha ingresado algo en el campo de búsqueda
		if (!empty($buscar)) {
			// Lógica para buscar el administrador  que coincidan con el nombre, apellido, teléfono o cédula
			$this->db->like('nombres', $buscar);
			$this->db->or_like('apellidos', $buscar);
			$this->db->or_like('telefono', $buscar);
			$this->db->or_like('documento', $buscar);

			// Filtrar por administradores activos
			$this->db->where('estado', 'ACTIVO'); // Ajusta esto según la estructura real de tu base de datos
			$this->db->where('tipo', 'ADMIN');
			// Obtener los resultados de la búsqueda
			$resultados_de_la_busqueda = $this->db->get('usuarios')->result();

			// Pasar los resultados a la vista
			$data['administradores'] = $resultados_de_la_busqueda;
			$data['session'] = $this->session->userdata('session-mvc');

			// Cargar la vista actual con los resultados
			$this->load->view('admin/lista_administradores', $data);
		} else {
			redirect('admin/lista_clientes');;
		}
	}

	public function insertarPedido(){
		$data['session'] = $this->session->userdata('session-mvc');
	
		if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['productos'])) {
			foreach ($_POST['productos'] as $index => $producto) {
				$nombre = $producto['nombre'];
				$cantidad = $producto['cantidad'];
				$precio = $producto['precio'];
				
				// Aquí podrías procesar cada producto, como insertarlo en la base de datos
			}
			
			// Redirigir o hacer algo después de procesar los productos
			echo "Pedido recibido";
			$this->load->view('cliente/inicioCliente', $data);
		}
	}


	public function cancelarPedido($id_pedido){
		$this->load->model('PedidosModel');
		$data=$this->PedidosModel->find($id_pedido);
		$id_producto=0;
		$cantidad=0;
		foreach ($data as $item) {
			$id_producto=$item['id_producto'];
			$cantidad=$item['cantidad_compra'];
			$this->PedidosModel->updateCancelar($id_producto, $cantidad);
		}

		$this->PedidosModel->delete($id_pedido);
		
		$data["pedidos"] = $this->PedidosModel->findAll();
		$data['session'] = $this->session->userdata("session-mvc");

		$this->load->view('admin/lista_pedidos', $data);
		
	}
}
