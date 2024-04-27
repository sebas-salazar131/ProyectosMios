<?php
   include_once("conexion_bd.php");
   
   $estado=$_POST['estado'];
   $id=$_POST['id'];
   $consulta=$conexion_bd->query("SELECT * FROM caja  where id='$id'");
   $row=$consulta->fetch_array();
   if($row ['estado']=="activo"){
      $estado="no activo";
      $conexion_bd->query("UPDATE caja set estado='$estado' where id='$id'");
      header("Location: reporteVentas.php"); 
   }else if($row ['estado']=="no activo"){
      $estado="activo";
      $conexion_bd->query("UPDATE caja set estado='$estado' where id='$id'");
      header("Location: reporteVentas.php"); 
   }
 
   
   
?>