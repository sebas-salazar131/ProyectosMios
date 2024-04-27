<?php
   include_once("conexion.php");
   $conexion->query("insert into estudiantes(nombre,email,nota) values ('$_REQUEST[nombre]', '$_REQUEST[email]', $_REQUEST[nota])");

   echo "El alumno fue ingresado";

   $consulta = "SELECT * FROM estudiantes";
   $resultado = $conexion->query($consulta);

   while($row=$resultado->fetch_array()){
      echo 'nombre: ', $row['nombre'], '<br>';
   }
?>