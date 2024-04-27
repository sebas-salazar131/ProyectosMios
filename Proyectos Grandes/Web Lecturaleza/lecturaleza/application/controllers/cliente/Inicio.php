<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inicio extends CI_Controller {
	
	public function __construct(){
		parent::__construct();
		$this->load->model('UsuariosModel');
		$this->load->model('ProductosModel');
		$this->load->database();
		$validacion = $this->session->has_userdata("session-mvc");
		if ($validacion) {
			$session = $this->session->userdata("session-mvc");
			if ($session['tipo']=="CLIENTE" && $session['estado']=="ACTIVO") {
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
		$data['productos'] = $this->ProductosModel->obtener_productos();
		$data['session'] = $this->session->userdata("session-mvc");
		$data['date_eliminados'] = $this->session->flashdata('date_eliminados');
		$data['date_validos'] = $this->session->flashdata('date_validos');
		$data['date_editado'] = $this->session->flashdata('date_editado');
		$data['date_error'] = $this->session->flashdata('date_error');
		$data['mensaje_duplicado'] = $this->session->flashdata('mensaje_duplicado');
		$data['mensaje'] = $this->session->flashdata('mensaje');
		$data['tipo'] = $this->session->flashdata('tipo');
		$this->load->view('cliente/inicioCliente', $data);
	}

	public function editarperfil(){
		$data['session'] = $this->session->userdata("session-mvc");
		$id_usuario= $data['session']['id_usuario'];
		$data['cliente'] = $this->UsuariosModel->obtenerClientePorId($id_usuario);
		$this->load->view('cliente/perfil', $data);
	}

	public function guardarCambiosPerfil() {
		$id_usuario = $this->input->post('id_usuario');
		$documento = $this->input->post('documento');
		$nombres = $this->input->post('nombres');
		$apellidos = $this->input->post('apellidos');
		$email = $this->input->post('email');
		$telefono = $this->input->post('telefono');
		$direccion = $this->input->post('direccion');

		if ($id_usuario != null && $nombres != null && $apellidos != null && $email != null && $telefono != null && $direccion != null){
			$resultado = $this->UsuariosModel->actualizarCliente($id_usuario,$documento, $nombres, $apellidos, $email, $telefono,$direccion);
	
			if ($resultado) {
				$_SESSION['mensaje'] = 'Se ha editado correctamente';
				$data['date_validos'] = true;
				$_SESSION['tipo'] = 'success';
				$data['session'] = $this->session->userdata("session-mvc");
				$this->session->set_flashdata('date_editado', true);
				$this->session->set_flashdata('tipo', 'success');
				redirect('cliente/Inicio/editarperfil','refresh');
			} else {
				$_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
				$_SESSION['tipo'] = 'danger';
				$this->session->set_flashdata('date_error', true);
				$this->session->set_flashdata('tipo', 'danger');
				redirect('cliente/Inicio/editarperfil','refresh');
			}
		} else {
			$data['session'] = $this->session->userdata("session-mvc");
            $this->session->set_flashdata('date_incompletos', true);
			$this->session->set_flashdata('tipo', 'danger');
			redirect('admin/inicio/openLisAdmins', 'refresh');
		}
	}

	public function historial(){
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('cliente/historial', $data);
	}

	public function detallesProducto($id_producto){
		
		$data['productos'] = $this->ProductosModel->getProducto($id_producto);
		$data['session'] = $this->session->userdata("session-mvc");
		$data['id_producto']=$id_producto;
		
		//print_r($data['productos']);
		$this->load->view('cliente/detalle_producto', $data);
		
	}

	public function allProductos(){
		
		
		$data['productos'] = $this->ProductosModel->obtener_productos();
		$data['session'] = $this->session->userdata("session-mvc");
		
		
		$this->load->view('cliente/allProductos', $data);
		
	}

	public function subirImagen(){
		
		$data['session'] = $this->session->userdata("session-mvc");
		$documento = $data['session']['documento'];
        $imagen = $_FILES['new_imagen']['name'];

        if (isset($imagen)  && $imagen!="") {
            $tipo_img = $_FILES['new_imagen']['type'];
            $temp = $_FILES['new_imagen']['tmp_name'];

            if (!((strpos($tipo_img,'gif') || strpos($tipo_img,'jpeg') || strpos($tipo_img,'webp') || strpos($tipo_img,'png')))) {
                $_SESSION['mensaje'] = 'Solo se permite archivos jpeg, gif, webp, png';
                $data['session'] = $this->session->userdata("session-mvc");
                
            } else {
                
                $this->load->model('UsuariosModel');

                
                $resultado = $this->UsuariosModel->actualizarImagen($imagen,$documento);

                if ($resultado) {
                    move_uploaded_file($temp, 'assets/distCliente/img/clientes/' . $imagen);   
                    $_SESSION['mensaje'] = 'Se ha subido correctamente';
                    $data['date_validos'] = true;
                    $_SESSION['tipo'] = 'success';
                    $data['session'] = $this->session->userdata("session-mvc");
                    //$this->load->view('cliente/inicioCliente', $data);
					redirect('cliente/Inicio','refresh');
                } else {
                    $_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
                    $_SESSION['tipo'] = 'danger';
                }
            }
        } else {
            $data['session'] = $this->session->userdata("session-mvc");
            $data['dateIncompletos'] = true;
            $this->load->view('cliente/perfil', $data);
        }
	}

	public function traerImagen(){
			
	}

	public function carrito($id){
		$productos = array();
		
		$productos[] = $id;
		$data['session'] = $this->session->userdata("session-mvc");
		$data['carrito'] = $productos;
		
		$data['productos'] = $this->ProductosModel->getProducto($id);
		$this->load->view('cliente/carrito', $data);

	}


	public function vistaCarrito($id_usuario){
		
		$data['session'] = $this->session->userdata("session-mvc");
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


	public function guardarCarrito($id_producto, $id_usuario) {
		$session = $this->session->userdata("session-mvc");
	
		if ($id_usuario != 0) {
			// verifica si el producto ya esta ingresado
			if ($this->ProductosModel->productoEnCarrito($id_producto, $id_usuario)) {
				$this->session->set_flashdata('mensaje_duplicado', true);
				$this->session->set_flashdata('tipo', 'error');
				redirect('cliente/Inicio/index', 'refresh');
			} else {
				// insertar si no esta en el carrito
				if ($this->ProductosModel->insertarCarrito($id_producto, $id_usuario)) {
					$_SESSION['mensaje'] = 'Se ha insertado correctamente';
					$_SESSION['tipo'] = 'success';
					$this->session->set_flashdata('date_validos', true);
					$this->session->set_flashdata('tipo', 'success');
				}
				redirect('cliente/Inicio/index', 'refresh');
			}
		} else {
			redirect('cliente/Inicio', 'refresh');
		}
	}


	public function pedidos($id_cliente){
		$data['session'] = $this->session->userdata("session-mvc");
		$data['pedidos'] = $this->UsuariosModel->traerPedidos($id_cliente);
		
		
		$this->load->view('cliente/historial',$data);

		
	}

	public function detallePedido($id_pedido){
		$data['session'] = $this->session->userdata("session-mvc");
		$pedidos = $this->UsuariosModel->traerProductosPedido($id_pedido);
		$data['cantidad']=$pedidos;
		$productos = array();
		$total_unitario= array();
		foreach ($pedidos as $pedido_info){
			
			$id_producto = $pedido_info->id_producto;
			$datos_producto = $this->ProductosModel->obtenerId_producto($id_producto);
	
			$productos[] = $datos_producto;
			$total_unitario[]=$pedido_info->total_unitario;
		}
		$data['total_unitario']=$total_unitario;
		$data['productos'] = $productos;
		$this->load->view('cliente/detalles_pedido',$data);
	}

	public function producto_por_categoria($tipo){
        $data['session'] = $this->session->userdata("session-mvc");
        $data['productos'] = $this->ProductosModel->Obtener_categoria($tipo);
		$this->load->view('cliente/allProductos', $data);

		
	
	}

	public function eliminarCarrito($id_producto, $id_usuario){
        $data['session'] = $this->session->userdata("session-mvc");
        $resultado=$this->UsuariosModel->eliminarCarrito($id_producto,$id_usuario);
        $id_usuario = $data['session']['id_usuario'];
        echo '<script>window.location.href = "http://localhost/lecturaleza/index.php/Cliente/Inicio/vistaCarrito/'.$id_usuario.'";</script>';
		
    }

	public function crearUsuario(){
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('cliente/registroUsuario', $data);
	}
	// public function crearUsuarioo(){
	// 	$data['usuarios'] = $this->UsuariosModel->insertarCliente();
	// 	$this->load->view('cliente/registroUsuario', $data);
	// }
    
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
			$data['session'] = $this->session->userdata("session-mvc");
			$data['dateIncompletos'] = true;
			$this->session->set_flashdata('date_incompletos', true);
			$this->session->set_flashdata('tipo', 'danger');
			//redirect('cliente/Inicio/registrarUsuarioo', 'refresh');
			//print_r($resultado);
		}	
	}
	
	public function contacto(){
		$data['session'] = $this->session->userdata("session-mvc");
		$this->load->view('cliente/contacto', $data);
	}



	public function insertarPedido(){
		$json = $this->request->getJSON();
        $pedidoModel = new PedidosModel();
        
        foreach ($json as $item) {
            $data = [
                'id_producto' => $item->producto_id,
                'id_usuario' => $item->usuario_id,  // Asumiendo que puedes obtener el ID del usuario desde algún lugar
                'fecha' => date('Y-m-d'),
                'estado' => 'COMPRADO',
                'nombre_recibe' => $item->nombre_recibe,
                'cantidad_compra' => $item->cantidad,
                'total_unitario' => $item->subtotal
            ];
            $pedidoModel->guardarPedido($data);
        }

        return $this->response->setJSON(['status' => 'success']);
	}
}