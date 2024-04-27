<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Reporte_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function get_cantidad_compras() {
        $this->db->select('COUNT(*) as cantidad');
        $this->db->from('pedidos');
        $query = $this->db->get();
        return $query->row()->cantidad;
    }

    public function get_cantidad_productos() {
        $this->db->select('COUNT(*) as cantidad');
        $this->db->from('productos');
        $query = $this->db->get();
        return $query->row()->cantidad;
    }

    public function get_cantidad_agricultores_registrados() {
        $this->db->select('COUNT(*) as cantidad');
        $this->db->from('agricultores');
        $query = $this->db->get();
        return $query->row()->cantidad;
    }

    public function get_cantidad_agricultores_activos() {
        $this->db->select('COUNT(*) as cantidad');
        $this->db->from('agricultores');
        $this->db->where('estado', 'ACTIVO');
        $query = $this->db->get();
        return $query->row()->cantidad;
    }

    public function get_cantidad_agricultores_inactivos() {
        $this->db->select('COUNT(*) as cantidad');
        $this->db->from('agricultores');
        $this->db->where('estado', 'INACTIVO');
        $query = $this->db->get();
        return $query->row()->cantidad;
    }

    public function get_cantidad_pedidos_en_proceso() {
        $this->db->select('COUNT(*) as cantidad');
        $this->db->from('pedidos');
        $this->db->where('estado', 'EN PROCESO');
        $query = $this->db->get();
        return $query->row()->cantidad;
    }

    public function get_cantidad_envios_no_entregados() {
        $this->db->select('COUNT(*) as cantidad');
        $this->db->from('envios');
        $this->db->where('estado_entrega', 'NO ENTREGADO');
        $query = $this->db->get();
        return $query->row()->cantidad;
    }

    public function get_cantidad_envios_en_camino() {
        $this->db->select('COUNT(*) as cantidad');
        $this->db->from('envios');
        $this->db->where('estado_entrega', 'EN CAMINO');
        $query = $this->db->get();
        return $query->row()->cantidad;
    }

	public function get_total_unitario_vendido_hoy($fecha_actual) {
		// Convertir la fecha actual al formato de fecha de la base de datos
		$fecha_actual = date('Y-m-d', strtotime($fecha_actual));
	
		$this->db->select('SUM(total_unitario) as total_vendido');
		$this->db->from('pedidos');
		$this->db->where('estado', 'COMPRADO');
		$this->db->where('fecha', $fecha_actual);
		$query = $this->db->get();
		
		// Verificar si hay resultados
		if ($query->num_rows() > 0) {
			return $query->row()->total_vendido;
		} else {
			return 0; // Devolver 0 si no hay ventas hoy
		}
	}
	
	

}

