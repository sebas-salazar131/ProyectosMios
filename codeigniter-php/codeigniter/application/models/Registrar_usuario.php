<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Registrar_usuario extends CI_Model{
    public $table = 'usuarios';
    public $table_id= 'id';
    
    function insert($data){
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();

    }

    public function validarIngreso($email, $password){
        $this->db->select('username, email');
        $this->db->where('email', $email);
        $this->db->where('password', $password);
        $this->db->where('estado', 'Activo');
        $registros = $this->db->get('usuarios')->result();

        if(sizeof($registros)==0){
            return false;
        }else{
            return true;
        }
       
    }
    function findAll(){
        $this->db->select();
        $this->db->from($this->table);
        $query = $this->db->get();
        return $query->result();
    }
    function find($id){
        return $this->db->get_where('usuarios', array('id' => $id))->row_array();
    }
    function update($id, $data){
        $this->db->where($this->table_id, $id);
        $this->db->update($this->table, $data);
    }
    function delete($id){
        $this->db->where($this->table_id, $id);
        $this->db->delete($this->table);
    }
    
}
