<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PersonasModel extends CI_Model {
	public $table = 'usuarios';
	public function validarIngreso($email, $password){
		$this->db->select('cedula, email, tipo');
		$this->db->where('email', $email);
		$this->db->where('password', $password );
        $this->db->where('estado', 'Activo');
		$registros = $this->db->get('usuarios')->result();

		if (sizeof($registros)==0) {
			return false;
		}else{
			return true;
		}
	}
	public function buscador($cedula){
	    $this->db->select('*');
		$this->db->from('usuarios');
		$this->db->where('cedula', $cedula);
		$registros= $this->db->get();
		if ($registros->num_rows()>0) {
			return $registros->result_array() ;
		}else{
			return [];
		}
	}
    public function getPersonaByEmail($email){
		$this->db->where('email', $email);
		$registros = $this->db->get('usuarios')->result();

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
        $query = $this->db->get('usuarios'); 
        return $query->result(); 
    }
	public function obtener_cedula($cedula) {
        return $this->db->get_where('usuarios', array('cedula' => $cedula))->row_array();
    }
	public function update($cedula, $data) {
        $this->db->where('cedula', $cedula);
        $this->db->update('usuarios', $data);
    }
	function delete($cedula){
		$this->db->where('cedula',$cedula);
		$this->db->delete($this->table);
		return true;
	}
}    