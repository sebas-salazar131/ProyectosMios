<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AgricultoresModel extends CI_Model {
	public $table = 'agricultores';
	
    public $table_id = 'id_agricultor';

    public function __construct(){
        $this->load->database();
    }
    
    public function insert($documento, $nombre, $apellido, $telefono, $direccion, $estado, $imagen) {
        $data = array(
            'cedula' => $documento,
            'nombre' => $nombre,
            'apellido' => $apellido,
            'telefono' => $telefono,
            'direccion' => $direccion,
            'estado' => $estado,
            'foto' => $imagen
        );

        // Insertar datos en la tabla productos
        return $this->db->insert('agricultores', $data);
    }

	public function obtenerAgricultores() {
		$this->db->select("id_agricultor,cedula, nombre, apellido, telefono, direccion, estado, foto");
        $this->db->where('estado', 'ACTIVO');
		$registros = $this->db->get('agricultores')->result();
		return $registros;
	}

    public function actualizarImagenAgri($imagen, $documento) {
        $tabla_agri = 'agricultores';
        $data = array(
            'foto' => $imagen
        );
        $this->db->where('cedula', $documento);

        // Actualizar datos en la tabla agricultores
        return $this->db->update($tabla_agri, $data);
    }
	
    function find($id){
        $this->db->select();
        $this->db->from($this->table);
        $this->db->where($this->table_id, $id);

        $query = $this->db->get();
        return $query->row();
    }

  


    function update($id, $data){
        $this->db->where($this->table_id, $id);
        $this->db->update($this->table, $data);
       

    }

    function delete($id){
        $this->db->where($this->table_id, $id);
        $this->db->delete($this->table);
        

    }
    public function obtenerAgricultorPorDocumento($documento) {
		$this->db->select("cedula, nombre, apellido, direccion, telefono, estado, foto");
		$this->db->where('cedula', $documento);
		$resultado = $this->db->get('agricultores')->row();

		return $resultado;
	}

    public function getAgricultorPorCedula($documento) {
		return $this->db->get_where('agricultores', array('cedula' => $documento))->row();
	}
    
    public function actualizarAgricultor($documento, $nombres, $apellidos,  $direccion, $telefono) {
		$data = array(
			'cedula' => $documento,
			'nombre' => $nombres,
			'apellido' => $apellidos,
			'direccion' => $direccion,
			'telefono' => $telefono
		);

		$this->db->where('cedula', $documento);
		$var = $this->db->update('agricultores', $data);  
        echo $this->db->affected_rows();
        return $var;
	}

    public function cambiarEstadoAgricultor($id_agricultor, $nuevo_estado) {
		$this->db->where('id_agricultor', $id_agricultor);
		$datos_actualizados = array('estado' => $nuevo_estado);
	
		return $this->db->update('agricultores', $datos_actualizados);
	}

    public function obtenerProductosPorAgricultor($id_agricultor) {
        $this->db->where('id_agricultor', $id_agricultor);
        $query = $this->db->get('productos');

        return $query->result();
    }
    
    
}
