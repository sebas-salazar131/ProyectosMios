<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UsuariosModel extends CI_Model {

	public function validarIngreso($email, $password, $tipo){
		$this->db->select('cedula, email');
		$this->db->where('email', $email);
		$this->db->where('pass', $password );
		$this->db->where('estado', 'ACTIVO');

		if($tipo=="ADMIN"){
			$registros = $this->db->get('admin')->result();
		}else{
			$registros = $this->db->get('agricultores')->result();
		}

		

		if (sizeof($registros)==0) {
			return false;
		}else{
			return true;
		}
	}

	public function getPersonaByEmail($email, $tipo){
		
		if($tipo=="ADMIN"){
			$this->db->select("nombre, cedula, estado, email, pass");
		    $this->db->where('email', $email);
			$registros = $this->db->get('admin')->result();
		}else{
			$this->db->select("nombre, cedula, estado, apellido, email, pass, telefono");
		    $this->db->where('email', $email);
			$registros = $this->db->get('agricultores')->result();
		}

		if (sizeof($registros)!=0) {
			return $registros[0];
		}else{
			return null;
		}
	}

}
