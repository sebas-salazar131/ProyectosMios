<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Estadisticas_model extends CI_Model {

  public function __construct() {
    parent::__construct();
    $this->load->database();
  }

    public function getEstadisticas() {
      $data['cultivos'] = $this->db->count_all('cultivos');
      $data['agricultores'] = $this->db->count_all('agricultores');
      $data['tareas'] = $this->db->count_all('tareas');
      $data['tareas_finalizadas'] = $this->db->get_where('tareas', array('estado' => 'Finalizado'))->num_rows();
      $data['tareas_pendientes'] = $this->db->get_where('tareas', array('estado' => 'Pendiente'))->num_rows();
      return $data;
  }

}
