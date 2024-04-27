<?php include_once("conexion_bd.php");

  $nombre =$_POST['nombre'];
  $apellido=$_POST['apellido'];
  $telefono=$_POST['telefono'];
  $ubicacion=$_POST['ubicacion'];
  $producto=$_POST['producto'];

  $conexion_bd->query("UPDATE agricultores set nombre='$nombre', apellido='$apellido', ubicacion='$ubicacion', producto='$producto' where telefono='$telefono'");
  header("Location: listar_agricultores.php"); 
?>

