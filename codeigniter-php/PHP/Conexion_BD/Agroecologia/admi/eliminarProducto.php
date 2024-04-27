<?php  include_once("conexion_bd.php");
    $id=$_GET['id'];

    $conexion_bd->query("DELETE FROM productos where id='$id'");
    header("Location: listar_producto.php"); 
?>