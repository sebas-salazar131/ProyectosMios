<?php
defined('BASEPATH') OR exit('No direct script access allowed');


Class Persona extends CI_Model{
	
	public $table = 'personas';
    public $table_id = 'persona_id';

    public function __construct(){
        $this->load->database();
    }

    // function find($id){
    //     $this->db->select();
    //     $this->db->from($this->table);
    //     $this->db->where($this->table_id, $id);

    //     $query = $this->db->get();
    //     return $query->row();
    // }

    // function findAll(){
    //     $this->db->select();
    //     $this->db->from($this->table);
       
    //     $query = $this->db->get();
    //     return $query->result();
    // }

    function insert($data){
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();

    }

    // function update($id, $data){
    //     $this->db->update($this->table, $data);
    //     $this->db->where($this->table_id, $id);

    // }

    // function delete($id){
    //     $this->db->delete($this->table);
    //     $this->db->where($this->table_id, $id);

    // }
}
?>