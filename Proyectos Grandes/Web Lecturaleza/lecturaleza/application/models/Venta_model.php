<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Venta_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function insertar_venta($fecha, $total_vendido) {
        $data = array(
            'fecha' => $fecha,
            'total_vendido' => $total_vendido
        );

        $this->db->insert('ventas', $data);
    }

	public function verificar_fecha_existente($fecha) {
		$this->db->select('id');
		$this->db->from('ventas');
		$this->db->where('fecha', $fecha);
		$query = $this->db->get();
		return $query->num_rows() > 0; // Devuelve true si la fecha existe, false si no
	}
	
	public function actualizar_total_vendido($fecha, $total_vendido) {
		$this->db->set('total_vendido', $total_vendido);
		$this->db->where('fecha', $fecha);
		$this->db->update('ventas');
	}

	public function obtener_ventas() {
        $this->db->select('*');
        $this->db->from('ventas');
        $query = $this->db->get();
        return $query->result_array();
    }
}
