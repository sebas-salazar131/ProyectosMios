<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Productos extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $validacion = $this->session->has_userdata("session-mvc");
        if ($validacion) {
            $session = $this->session->userdata("session-mvc");
            if ($session['tipo']=="ADMIN" && $session['estado']=="ACTIVO") {
                $this->load->model('ProductosModel');
                $this->productosModel = $this->ProductosModel;
                return false;
            } else {
                redirect('Login/cerrarSession','refresh');
                die();
            }
        } else {
            redirect('Login/cerrarSession','refresh');
            die();
        }
    }
    
    public function createProduct(){
        $id_agricultor = $_POST['new_agricultor']; 
        $producto = $_POST['new_producto'];
        $precio = $_POST['new_precio'];
        $cantidad = $_POST['new_cantidad'];
        $descripcion = $_POST['new_descripcion'];
        $f_vencimiento = $_POST['new_fecha'];
        $tipo = $_POST['new_tipo'];
        $estado = $_POST['new_estado'];
        $imagen = $_FILES['new_imagen']['name'];

        if (isset($imagen) && $id_agricultor!="" &&  $producto!="" && $precio!="" && $cantidad!="" && $descripcion!="" && $f_vencimiento!="" && $tipo!="" && $estado!="" && $imagen!="") {
            $tipo_img = $_FILES['new_imagen']['type'];
            $temp = $_FILES['new_imagen']['tmp_name'];

            if (!((strpos($tipo_img,'gif') || strpos($tipo_img,'jpeg') || strpos($tipo_img,'webp') || strpos($tipo_img,'png')))) {
                $data['session'] = $this->session->userdata("session-mvc");
                $this->session->set_flashdata('img_error', true);
                $this->session->set_flashdata('tipo', 'danger');
                redirect('admin/inicio/openLisProducts', 'refresh');
            } else {
                $this->load->model('ProductosModel');
                // Verificar si el nombre del producto ya existe en la base de datos
                $productoExistente = $this->ProductosModel->getProductoPorNombre($producto);
    
                if ($productoExistente) {
                    // El nombre del producto ya existe
                    $this->session->set_flashdata('date_repetidos', true);
                    $this->session->set_flashdata('tipo', 'danger');
                    redirect('admin/inicio/openLisProducts', 'refresh');
                } else {
                    $resultado = $this->ProductosModel->insertar($id_agricultor,$producto, $precio, $cantidad, $descripcion, $f_vencimiento, $tipo, $estado, $imagen);

                    if ($resultado) {
                        move_uploaded_file($temp, 'assets/distCliente/img/product/' . $imagen);   
                        // $_SESSION['mensaje'] = 'Se ha subido correctamente';
                        // $data['date_validos'] = true;
                        // $_SESSION['tipo'] = 'success';
                        // $data['productos'] = $this->ProductosModel->obtener_productos();
                        // $data['session'] = $this->session->userdata("session-mvc");
                        $this->session->set_flashdata('date_validos', true);
                        $this->session->set_flashdata('tipo', 'success');
                        redirect('admin/inicio/openLisProducts', 'refresh');
                    } else{
                        $this->session->set_flashdata('date_error', true);
                        $this->session->set_flashdata('tipo', 'danger');
                        redirect('admin/inicio/openLisProducts', 'refresh');
                    }
                }
            }
        } else {
            // $data['session'] = $this->session->userdata("session-mvc");
            $this->session->set_flashdata('date_incompletos', true);
            $this->session->set_flashdata('tipo', 'danger');
            // $data['productos'] = $this->ProductosModel->obtener_productos();
            redirect('admin/inicio/openLisProducts', 'refresh');
        }
    }

    public function obtenerProducto($id_producto) {
        $this->load->model('ProductosModel'); 
    
        // Llamar al modelo para obtener los datos del producto
        $data['productoActual'] = $this->ProductosModel->getProductoPorId($id_producto);
    
        // Cargar la vista con los datos del producto
        $this->load->view('productos/editarProducto', $data);
    }

	// funcion de la API
	public function getListaProductos() {
		$this->load->model('ProductosModel');
		$listaProductos = $this->ProductosModel->getProducto();
		echo json_encode($listaProductos);
	}
    
    public function editarProductos($id_producto) {
        $this->load->model('ProductosModel');
        $data['session'] = $this->session->userdata("session-mvc");
        $data['producto'] = $this->ProductosModel->getProductoPorId($id_producto);
        $this->load->view('admin/editar_producto', $data);

    }

    public function actualizarImagenProduct($id_producto){
        $data['session'] = $this->session->userdata("session-mvc");

        $imagen = $_FILES['new_imagen']['name'];

        if (isset($imagen)  && $imagen!="") {
            $tipo_img = $_FILES['new_imagen']['type'];
            $temp = $_FILES['new_imagen']['tmp_name'];

            if (!((strpos($tipo_img,'gif') || strpos($tipo_img,'jpeg') || strpos($tipo_img,'webp') || strpos($tipo_img,'png')))) {
                $_SESSION['mensaje'] = 'Solo se permite archivos jpeg, gif, webp, png';
                $data['session'] = $this->session->userdata("session-mvc");

            } else {

                $this->load->model('ProductosModel');


                $resultado = $this->ProductosModel->actualizarImagenProduct($imagen,$id_producto);

                if ($resultado) {
                    move_uploaded_file($temp, 'assets/distCliente/img/product/' . $imagen);
                    $_SESSION['mensaje'] = 'Se ha subido correctamente';
                    $data['date_validos'] = true;
                    $_SESSION['tipo'] = 'success';
                    $data['session'] = $this->session->userdata("session-mvc");
                    $this->session->set_flashdata('date_editado', true);
                    $this->session->set_flashdata('tipo', 'success');
                    redirect('admin/inicio/openLisProducts', 'refresh');
                    //$this->load->view('cliente/inicioCliente', $data);
                    // redirect('admin/Inicio','refresh');
                } else {
                    $_SESSION['mensaje'] = 'Ocurrió un error en el servidor';
                    $_SESSION['tipo'] = 'danger';
                }
            }
        } else {
            $data['session'] = $this->session->userdata("session-mvc");
            $data['dateIncompletos'] = true;
            $data['productos'] = $this->ProductosModel->obtener_productos();
            $this->load->view('admin/lista_productos', $data);
        }
    }

	public function guardarCambiosProductos() {
        $id_producto = $this->input->post('id_producto');
        $nombre_producto = $this->input->post('nombre_producto');
        $precio_venta = $this->input->post('precio_venta');
        $cantidad_disponible = $this->input->post('cantidad_disponible');
        $descripcion = $this->input->post('descripcion');
        $fecha_vencimiento = $this->input->post('fecha_vencimiento');
        $tipo = $this->input->post('tipo');

        // Verificar si el id_producto está disponible
        if ($id_producto) {
            // Llamada a la función actualizarProducto del modelo
            $resultado = $this->ProductosModel->actualizarProducto($id_producto, $nombre_producto, $precio_venta, $cantidad_disponible, $descripcion, $fecha_vencimiento, $tipo);

            if ($resultado) {
                // $_SESSION['mensaje'] = 'Se ha editado correctamente';
                // $data['date_editado'] = true;
                // $_SESSION['tipo'] = 'success';
                // $data['session'] = $this->session->userdata("session-mvc");
                $this->session->set_flashdata('date_editado', true);
                $this->session->set_flashdata('tipo', 'success');
                redirect('admin/inicio/openLisProducts', 'refresh');
                // $this->session->set_flashdata('mensaje', 'Cambios guardados correctamente');
                // $this->session->set_flashdata('tipo', 'success');
            } else {
                // $_SESSION['mensaje'] = 'Error al guardar los cambios';
                // $data['date_error'] = true;
                // $_SESSION['tipo'] = 'danger';
                // $data['session'] = $this->session->userdata("session-mvc");
                $this->session->set_flashdata('date_error', true);
                $this->session->set_flashdata('tipo', 'danger');
                redirect('admin/inicio/openLisProducts', 'refresh');
                // $this->session->set_flashdata('mensaje', 'Error al guardar los cambios');
                // $this->session->set_flashdata('tipo', 'danger');
            }
        } else {
            // Manejar el caso cuando el id_producto no está presente
            // $_SESSION['mensaje'] = 'Error: Datos sin llenar';
            // $data['date_incompletos'] = true;
            // $_SESSION['tipo'] = 'danger';
            // $data['session'] = $this->session->userdata("session-mvc");
            $this->session->set_flashdata('date_incompletos', true);
            $this->session->set_flashdata('tipo', 'danger');
            redirect('admin/inicio/openLisProducts', 'refresh');
            // $this->session->set_flashdata('mensaje', 'ID de producto no válido');
            // $this->session->set_flashdata('tipo', 'danger');
        }
    
    }
        // redirect('admin/Inicio/openLisProducts', 'refresh');
    
    
    
    public function cambiarEstadoProducto($id_producto) {
		$this->load->model('ProductosModel');    

		
		$actualizacion = $this->ProductosModel->cambiarEstadoProducto($id_producto, 'INACTIVO');

		if ($actualizacion) {
			// $data['estado_cambiado'] = true;
			// $_SESSION['tipo'] = 'success';
			// $data['session'] = $this->session->userdata("session-mvc");
			$this->session->set_flashdata('estado_cambiado', true);
			$this->session->set_flashdata('tipo', 'success');
            redirect('admin/inicio/openLisProducts', 'refresh');
		} else {
			// $data['estado_error'] = true;
			// $_SESSION['tipo'] = 'danger';
			// $data['session'] = $this->session->userdata("session-mvc");
			$this->session->set_flashdata('date_error', true);
			$this->session->set_flashdata('tipo', 'danger');
            redirect('admin/inicio/openLisProducts', 'refresh');
		}
		redirect('admin/inicio/openLisProducts', 'refresh');
	}

    	// Funcion para el buscador del administrador
	public function buscarProducto() {
		$buscar = $this->input->post('buscar');

		// Validar que se ha ingresado algo en el campo de búsqueda
		if (!empty($buscar)) {
			// Lógica para buscar productosque coincidan con el nombre,precio,cantidad,fecha vencimiento
			$this->db->like('nombre_producto', $buscar);
			$this->db->or_like('precio_venta', $buscar);
			$this->db->or_like('fecha_vencimiento', $buscar);

			// Filtrar por productos activos
			$this->db->where('estado', 'ACTIVO'); // Ajusta esto según la estructura real de tu base de datos

			// Obtener los resultados de la búsqueda
			$resultados_de_la_busqueda = $this->db->get('productos')->result();

			// Pasar los resultados a la vista
			$data['productos'] = $resultados_de_la_busqueda;
			$data['session'] = $this->session->userdata('session-mvc');

			// Cargar la vista actual con los resultados
			$this->load->view('admin/lista_productos', $data);
		} else {
			// Si no se proporciona un término de búsqueda, redirigir o mostrar un mensaje de error, según sea necesario
			redirect('admin/lista_clientes');
			// O mostrar un mensaje de error en la misma vista
			// $data['error_message'] = 'Por favor, ingrese un término de búsqueda.';
			// $this->load->view('tu_vista', $data);
		}
	}
        
    
}

?>
