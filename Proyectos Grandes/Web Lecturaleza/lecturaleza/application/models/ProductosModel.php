<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ProductosModel extends CI_Model {
	public $table = 'productos';
	
	
	public function insertar($id_agricultor,$producto, $precio, $cantidad, $descripcion, $f_vencimiento, $tipo, $estado, $imagen) {
        $data = array(
            'id_agricultor' => $id_agricultor,
            'nombre_producto' => $producto,
			'precio_venta' => $precio,
			'cantidad_disponible' => $cantidad,
			'descripcion' => $descripcion,
			'fecha_vencimiento' => $f_vencimiento,
			'tipo' => $tipo,
			'estado' => $estado,
			'img' => $imagen
        );

        // Insertar datos en la tabla productos
        return $this->db->insert('productos', $data);
    }

	public function obtener_productos() {
        $this->load->database();
		$this->db->where('estado', 'ACTIVO');
        $query = $this->db->get('productos'); 
        return $query->result();
    }

	public function getProducto($id){
		$this->db->select("nombre_producto,precio_venta, cantidad_disponible, descripcion, img");
		$this->db->where('id_producto', $id);
		$registros = $this->db->get('productos')->result();

		if (sizeof($registros)!=0) {
			return $registros[0];
		}else{
			return null;
		}
	}
	
	public function getProductoPorId($id_producto) {
		return $this->db->get_where('productos', array('id_producto' => $id_producto))->row();
	}


	public function getProductoPorNombre($producto) {
		return $this->db->get_where('productos', array('nombre_producto' => $producto))->row();
	}

	
	public function obtenerId_producto($id_producto) {
		$this->db->select("id_producto, nombre_producto, precio_venta, cantidad_disponible, descripcion, fecha_vencimiento, tipo, img");
		$this->db->where('id_producto', $id_producto);
		$resultado = $this->db->get('productos')->row();

		return $resultado;
	}
	
    public function actualizarImagenProduct($imagen, $id_producto) {
        $tabla_agri = 'productos';
        $data = array(
            'img' => $imagen
        );
        $this->db->where('id_producto', $id_producto);

        // Actualizar datos en la tabla agricultores
        return $this->db->update($tabla_agri, $data);
    }

	public function obtenerAgricultores() {
		$this->db->select("id_agricultor,nombre,apellido");
		$this->db->where('estado', 'ACTIVO');
		$resultado = $this->db->get('agricultores')->result();
		return $resultado;
	}
    
	public function actualizarProducto($id_producto, $nombre_producto, $precio_venta, $cantidad_disponible, $descripcion, $fecha_vencimiento, $tipo) {
		$data = array(
			'nombre_producto' => $nombre_producto,
			'precio_venta' => $precio_venta,
			'cantidad_disponible' => $cantidad_disponible,
			'descripcion' => $descripcion,
			'fecha_vencimiento' => $fecha_vencimiento,
			'tipo' => $tipo
		);
	
		$this->db->where('id_producto', $id_producto);
		return $this->db->update('productos', $data);
	}
	
	


	public function insertarCarrito($id_producto, $id_usuario) {
		$data = array(
			'id_producto' => $id_producto,
			'id_usuario' => $id_usuario
		);
	
		try {
			$this->db->insert('carrito', $data);
			return true;
		} catch (Exception $e) {
			if ($e->getCode() == 1062) {
				return false;
			} else {
				throw $e;
			}
		}
	}

	public function productoEnCarrito($id_producto, $id_usuario) {
		$this->db->where('id_producto', $id_producto);
		$this->db->where('id_usuario', $id_usuario);
		$query = $this->db->get('carrito');
		return $query->num_rows() > 0;
	}
	


	public function obtenerIdCarrito($id_usuario) {
		$this->db->select("id_producto");
		$this->db->where('id_usuario', $id_usuario);
		$resultado = $this->db->get('carrito')->result();
		$id_productos = array();
		foreach ($resultado as $resultados) {
			$id_productos[] = $resultados->id_producto;
		}
	
		return $id_productos;
	}
     

	public function Obtener_categoria($tipo) {
		$this->db->select("id_producto, nombre_producto, precio_venta, cantidad_disponible, descripcion, fecha_vencimiento, tipo, img");
		$this->db->where('tipo', $tipo);
		$registros = $this->db->get('productos')->result();
		return $registros;
   }

   	public function cambiarEstadoProducto($id_producto, $nuevo_estado) {
		$this->db->where('id_producto', $id_producto);
		$datos_actualizados = array('estado' => $nuevo_estado);

		return $this->db->update('productos', $datos_actualizados);
	}



}
