<?php include_once("conexion_bd.php");
  $id=$_POST['id'];
  $producto =$_POST['producto'];
  $descripcion=$_POST['descripcion'];
  $costo=$_POST['costo'];
  $precio=$_POST['precio'];
  $cantidad_inventario=$_POST['cantidad_inventario'];

  $conexion_bd->query("UPDATE productos set producto='$producto', descripcion='$descripcion', costo=$costo, precio=$precio, cantidad_inventario=$cantidad_inventario where id='$id'");
  header("Location: listar_producto.php"); 
?>
