<?php  include_once("conexion_bd.php");
    $telefono=$_GET['telefono'];

    $conexion_bd->query("DELETE FROM agricultores where telefono='$telefono'");
    header("Location: listar_agricultores.php"); 
?>