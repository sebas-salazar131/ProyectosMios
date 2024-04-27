<?php
    $conexion=new mysqli("localhost", "root","","persona");

    $conexion->query("insert into datos(nombre,cedula,apellido,direccion,telefono,email) values ('$_REQUEST[nombre]', $_REQUEST[cedula],
     '$_REQUEST[apellido]','$_REQUEST[direccion]', $_REQUEST[telefono],'$_REQUEST[email]')");

    echo "La persona fue ingresada";
?>