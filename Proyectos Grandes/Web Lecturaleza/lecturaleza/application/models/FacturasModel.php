<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class FacturasModel extends CI_Model {

	public $table = 'facturas';
    public $table_detalles_factura = 'detalle_factura';
    public $table_id = 'id_factura';
    // protected $allowedFields = ['id_producto', 'id_usuario', 'fecha', 'estado', 'nombre_recibe', 'cantidad_compra', 'total_unitario'];

    public function __construct(){
        $this->load->database();
    }

    function find($id){
        $this->db->select();
        $this->db->from($this->table);
        $this->db->where($this->table_id, $id);

        $query = $this->db->get();
        return $query->row();
    }

    function findAll(){
        $this->db->select(
            'facturas.id_factura,
            usuarios.nombres as nombres_usuario,
            usuarios.apellidos as apellidos_usuario,
            facturas.fecha,
            usuarios.telefono as telefono_usuario'
        );
        $this->db->from($this->table);
        $this->db->join('usuarios', 'facturas.id_usuario =usuarios.id_usuario');
        $query = $this->db->get();
        return $query->result();
    }

    function insertarFactura($idUsuario,$fecha_actual){
        $data = array(
            'id_usuario' => $idUsuario,
            'fecha' => $fecha_actual
        );
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    function insertarDetallesFactura($resultado_insertar,$pedidoId,$cantidadRecibida,$vueltas,$totalPedido){
        $data = array(
            'id_factura' => $resultado_insertar,
            'id_pedido' => $pedidoId,
            'dinero_recibido' => $cantidadRecibida,
            'cambio' => $vueltas,
            'total' => $totalPedido,
        );
        $this->db->insert($this->table_detalles_factura, $data);
        return $this->db->insert_id();
    }

    function insert($data){
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();

    }

    function update($id, $data){
        $this->db->where($this->table_id, $id);
        $this->db->update($this->table, $data);
       

    }

    function delete($id){
        $this->db->where($this->table_id, $id);
        $this->db->delete($this->table);
        

    }

    // public function guardarPedido($data)
    // {
    //     //falta aca 
    //     return $this->insert($data);
    // }
}