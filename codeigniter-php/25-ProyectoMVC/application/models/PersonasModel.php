<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PersonasModel extends CI_Model {
    public $table = 'personas';
	public function getPersonaByEmail($email){
		$this->db->where('email', $email);
		$registros = $this->db->get('personas')->result();

		if (sizeof($registros)!=0) {
			return $registros[0];
		}else{
			return null;
		}
	}
	function insert($datas){
        $this->db->insert( $this->table, $datas);
        return $this->db->insert_id();

    }

	public function obtener_datos() {
        $query = $this->db->get('personas'); 
        return $query->result(); 
    }

	public function obtener_cedula($cedula) {
        return $this->db->get_where('personas', array('cedula' => $cedula))->row_array();
    }

	public function update($cedula, $data) {
        $this->db->where('cedula', $cedula);
        $this->db->update('personas', $data);
    }

}
