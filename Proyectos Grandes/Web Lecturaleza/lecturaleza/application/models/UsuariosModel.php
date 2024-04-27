<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UsuariosModel extends CI_Model {
	public $table = 'usuarios';
	public $documento='documento';
	public function validarIngreso($email, $password){
		$this->load->database();
		$this->db->select('documento, email, tipo');
		$this->db->where('email', $email);
		$this->db->where('password', $password);
		$this->db->where('estado', 'ACTIVO');
		$registros = $this->db->get('usuarios')->result();

		if (sizeof($registros)==0) {
			return false;
		}else{
			return true;
		}
	}

	public function getUsuarioByEmail($email){
		$this->db->select("id_usuario, documento, nombres, apellidos, email, telefono, direccion, tipo, estado,img");
		$this->db->where('email', $email);
		$registros = $this->db->get('usuarios')->result();

		if (sizeof($registros)!=0) {
			return $registros[0];
		}else{
			return null;
		}
	}
	
	public function obtenerUsuarios() {
		$this->db->select("id_usuario, documento, nombres, apellidos, email, password, tipo, estado, direccion, telefono,img");
		$this->db->where('estado', 'ACTIVO');
		$this->db->where('tipo', 'CLIENTE');
		$registros = $this->db->get('usuarios')->result();
	
		return $registros;
	}
	
	
	public function obtenerAdministradores() {
		$this->db->select("id_usuario, documento, nombres, apellidos, email, telefono, direccion, tipo, estado");
		$this->db->where('estado', 'ACTIVO');
		$this->db->where('tipo', 'ADMIN');
		$registros = $this->db->get('usuarios')->result();
		return $registros;
	}

	public function actualizarImagen($imagen,$documento) {
		
        $data = array(
            
			'img' => $imagen
        );
		$this->db->where($this->documento, $documento);
       
        // Insertar datos en la tabla productos
       return  $this->db->update($this->table, $data);
    }

	// function insert($data1){
    //     $this->db->insert( $this->table, $data1);
    //     return $this->db->insert_id();

    // }

	// public function obtener_datos() {
    //     $query = $this->db->get('usuarios'); 
    //     return $query->result(); 
    // }

	
//---------------------------- MODELO ADMNISTRADOR --------------------------

	public function eliminarAdministrador($id_usuario) {
		if ($id_usuario) {
			$this->db->where('id_usuario', $id_usuario);
			$registrosRelacionados = $this->db->get('facturas')->num_rows();
	
			if ($registrosRelacionados > 0) {
				return false;
			} else {
				$this->db->where('id_usuario', $id_usuario);
				$this->db->delete('usuarios');
	
				return ($this->db->affected_rows() > 0);
			}
		} else {
			return false;
		}
	}

	public function cambiarEstadoAdmin($id_usuario, $nuevo_estado) {
		$this->db->where('id_usuario', $id_usuario);
		$datos_actualizados = array('estado' => $nuevo_estado);
	
		return $this->db->update('usuarios', $datos_actualizados);
	}
	
	
	public function obtenerAdministradorPorId($id_usuario) {
		$this->db->select("id_usuario, documento, nombres, apellidos, email, telefono, direccion, tipo");
		$this->db->where('id_usuario', $id_usuario);
		$resultado = $this->db->get('usuarios')->row();
	
		return $resultado;
	}
	

	public function actualizarAdministrador($id_usuario, $nombres, $apellidos, $email, $telefono, $direccion) {

		$data = array(
			'nombres' => $nombres,
			'apellidos' => $apellidos,
			'email' => $email,
			'telefono' => $telefono,
			'direccion' => $direccion,
		);
	
		$this->db->where('id_usuario', $id_usuario);
		$result = $this->db->update('usuarios', $data);
	
		return $result;
	}
	

	public function insertarAdmin($documento, $nombres, $apellidos, $direccion, $telefono, $email, $tipo, $estado, $password) {
        $data = array(
            'documento' => $documento,
            'nombres' => $nombres,
            'apellidos' => $apellidos,
            'direccion' => $direccion,
            'telefono' => $telefono,
            'email' => $email,
            'tipo' => $tipo,
            'estado' => $estado,
            'password' => $password
        );

        return $this->db->insert('usuarios', $data);
    }


	// -------------------- PEDIDOS ---------------------------
	public function traerPedidos($id_cliente){
		$this->db->select("id_pedido, fecha, estado, total_unitario");
		$this->db->where('id_usuario', $id_cliente);
		$resultado = $this->db->get('pedidos')->result();

		return $resultado;
	}

	public function traerProductosPedido($id_pedido){
		$this->db->select("id_producto,cantidad_compra,total_unitario");
		$this->db->where('id_pedido', $id_pedido);
		$resultado = $this->db->get('pedidos')->result();

		return $resultado;
	}


	//-------- UsuarioModel --- cliente------------------------//
	public function eliminarCliente($id_usuario) {
		if ($id_usuario) {
			$this->db->where('id_usuario', $id_usuario);
			$registrosRelacionados = $this->db->get('facturas')->num_rows();
	
			if ($registrosRelacionados > 0) {
				return false;
			} else {
				$this->db->where('id_usuario', $id_usuario);
				$this->db->delete('usuarios');
	
				return ($this->db->affected_rows() > 0);
			}
		} else {
			return false;
		}
	}

	public function getUsuarioPorCedula($documento) {
		return $this->db->get_where('usuarios', array('documento' => $documento))->row();
	}

	public function obtenerClientePorId($id_usuario) {
		$this->db->select("id_usuario, documento, nombres, apellidos, email, telefono, direccion, tipo, estado, img");
		$this->db->where('id_usuario', $id_usuario);
		$resultado = $this->db->get('usuarios')->row();
	
		return $resultado;
	}

	public function actualizarCliente($id_usuario, $documento, $nombres, $apellidos, $email, $telefono, $direccion) {
		$data = array(
			'documento' => $documento,
			'nombres' => $nombres,
			'apellidos' => $apellidos,
			'email' => $email,
			'telefono' => $telefono,
			'direccion' => $direccion
		);
		$this->db->where('id_usuario', $id_usuario);
		$resultado = $this->db->update('usuarios', $data);
		return $resultado;
	}
	

	public function insertarCliente($documento, $nombres, $apellidos, $direccion, $telefono, $email, $tipo, $estado, $password) {
		$data = array(
			'documento' => $documento,
            'nombres' => $nombres,
            'apellidos' => $apellidos,
            'direccion' => $direccion,
            'telefono' => $telefono,
            'email' => $email,
            'tipo' => $tipo,
            'estado' => $estado,
            'password' => $password
		);
	
		return $this->db->insert('usuarios', $data);
	}

	public function eliminarCarrito($id_producto, $id_usuario){
        $this->db->where('id_producto', $id_producto);
        $this->db->where('id_usuario', $id_usuario);

        $resultado= $this->db->delete('carrito');

        return $resultado;
    }

	// public function insertUser($data) {
    //     $this->db->insert('usuarios', $data);
    //     return $this->db->affected_rows() > 0;
    // }

	public function cambiarEstadoCliente($id_usuario, $nuevo_estado) {
		$this->db->where('id_usuario', $id_usuario);
		$datos_actualizados = array('estado' => $nuevo_estado);
	
		return $this->db->update('usuarios', $datos_actualizados);
	}

	public function extraerTelefono() {
		$this->db->select("telefono");
		$this->db->where('estado', 'ACTIVO');
		$this->db->where('tipo', 'ADMIN');
		$registros = $this->db->get('usuarios')->result_array();
	
		if (!empty($registros)) {
			$indiceAleatorio = mt_rand(0, count($registros) - 1);
			return $registros[$indiceAleatorio]['telefono'];
		} else {
			return null; // O manejar el caso cuando no hay registros
		}
	}
	

}
