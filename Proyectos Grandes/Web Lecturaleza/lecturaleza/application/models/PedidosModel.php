<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PedidosModel extends CI_Model {

	public $table = 'pedidos';
    public $table_id = 'id_pedido';
    protected $allowedFields = ['id_producto', 'id_usuario', 'fecha', 'estado', 'nombre_recibe', 'cantidad_compra', 'total_unitario'];

    public function __construct(){
        $this->load->database();
    }

    

    function find($id){
        $this->db->select();
        $this->db->from($this->table);
        $this->db->where($this->table_id, $id);

        $query = $this->db->get();
        return $query->result_array();
    }

    function findAll(){
        $this->db->select(
            'pedidos.id_pedido,
            usuarios.id_usuario as id_usuario,
            usuarios.nombres as nombres_usuario,
            usuarios.apellidos as apellidos_usuario,
            pedidos.fecha,
            pedidos.estado,
            usuarios.telefono as telefono_usuario,
            productos.nombre_producto AS nombre_producto,
            pedidos.cantidad_compra,
            pedidos.total_unitario'
        );
        $this->db->from($this->table);
        $this->db->join('usuarios', 'pedidos.id_usuario =usuarios.id_usuario');
        $this->db->join('productos', 'pedidos.id_producto = productos.id_producto');
        $query = $this->db->get();
        return $query->result();
    }

    // Método para actualizar el estado del pedido en la base de datos
    public function actualizarEstado($pedidoId, $nuevoEstado) {
        $datos_actualizados = array(
            'estado' => $nuevoEstado
        );
        $this->db->where('id_pedido', $pedidoId);
        return $this->db->update($this->table, $datos_actualizados);
    }
    

    

    function findProductDetailsByPedidoId($pedido_id){
        $this->db->select(
            'productos.nombre_producto,
            pedidos.cantidad_compra,
            pedidos.total_unitario'
        );
        $this->db->from('pedidos');
        $this->db->join('productos', 'pedidos.id_producto = productos.id_producto');
        $this->db->where('pedidos.id_pedido', $pedido_id);
    
        $query = $this->db->get();
        return $query->result();
    }
    
    
    

    public function insertar($id_producto, $id_usuario, $fecha, $nombre_recibe, $cantidad, $total_unitario) {
        $data = array(
            'id_producto' => $id_producto,
            'id_usuario' => $id_usuario,
            'fecha' => $fecha,
            'estado' => "EN PROCESO",
            'nombre_recibe' => $nombre_recibe,
            'cantidad_compra' => $cantidad,
            'total_unitario' => $total_unitario
        );
    
        // Insertar datos en la tabla pedidos
        $this->db->insert('pedidos', $data);
        $insert_id = $this->db->insert_id();
        // Obtener la cantidad disponible del producto
        $this->db->select("cantidad_disponible");
        $this->db->where('id_producto', $id_producto);
        $query = $this->db->get('productos');
        $producto = $query->row(); // Obtener el resultado como objeto
    
        if ($producto) {
            $cant_dis = $producto->cantidad_disponible - $cantidad;
    
            $data_actualizar_cantidad = array(
                'cantidad_disponible' => $cant_dis,
            );
    
            $this->db->where('id_producto', $id_producto);
            $this->db->update('productos', $data_actualizar_cantidad);
        }
    
        
        return $insert_id;
    }

    public function insertarMismaId($id_pedido,$id_producto, $id_usuario, $fecha, $nombre_recibe, $cantidad, $total_unitario) {
        $data = array(
            'id_pedido' => $id_pedido,
            'id_producto' => $id_producto,
            'id_usuario' => $id_usuario,
            'fecha' => $fecha,
            'estado' => "EN PROCESO",
            'nombre_recibe' => $nombre_recibe,
            'cantidad_compra' => $cantidad,
            'total_unitario' => $total_unitario
        );
    
        // Insertar datos en la tabla pedidos
        $this->db->insert('pedidos', $data);
        $insert_id = $this->db->insert_id();
        // Obtener la cantidad disponible del producto
        $this->db->select("cantidad_disponible");
        $this->db->where('id_producto', $id_producto);
        $query = $this->db->get('productos');
        $producto = $query->row(); // Obtener el resultado como objeto
    
        if ($producto) {
            $cant_dis = $producto->cantidad_disponible - $cantidad;
    
            $data_actualizar_cantidad = array(
                'cantidad_disponible' => $cant_dis,
            );
    
            $this->db->where('id_producto', $id_producto);
            $this->db->update('productos', $data_actualizar_cantidad);
        }
    
        
        return "Hola";
    }
    
    

    function updateCancelar($id, $cantidad){

        $this->db->select("cantidad_disponible");
        $this->db->where('id_producto', $id);
        $query = $this->db->get('productos');
        $producto = $query->row(); // Obtener el resultado como objeto
    
        if ($producto) {
            $cant_dis = $producto->cantidad_disponible + $cantidad;
    
            $data_actualizar_cantidad = array(
                'cantidad_disponible' => $cant_dis,
            );
    
            $this->db->where('id_producto', $id);
            $this->db->update('productos', $data_actualizar_cantidad);
        }
       
    }

    function delete($id){
        $this->db->where($this->table_id, $id);
        $this->db->delete($this->table);
    }

    public function guardarPedido($data)
    {
        //falta aca 
        return $this->insert($data);
    }

	

	

		
	

}