<?php


class Producto {
    private $nombre;
    private $precio;
    private $cant_disp;
    private $descripcion;
    private $fecha_ven;


    public function __construct($nombre, $precio, $cant_disp, $descripcion, $fecha_ven) {
        $this->nombre = $nombre;
        $this->precio = $precio;
        $this->cant_disp = $cant_disp;
        $this->descripcion = $descripcion;
        $this->fecha_ven = $fecha_ven;
    }

    public function getNombre() {
        return $this->nombre;
    }
    public function getPrecio() {
        return $this->precio;
    }
    public function getCant() {
        return $this->cant_disp;
    }
    public function getDescripcion() {
        return $this->descripcion;
    }

    public function getFecha() {
        return $this->fecha_ven;
    }
}



?>