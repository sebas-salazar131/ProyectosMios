<?php 
	header("Access-Control-Allow-Origin: * "); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
	header("Access-Control-Allow-Methods: GET, POST");
	header("Access-Control-Allow-Headers: Content-Type");

    include 'Conexion.php';

    if (!empty($_GET['cedula']) || !empty($_GET['nombre'])) {
        $cedula = $_GET['cedula'];
        $nombre = $_GET['nombre'];
	    $consulta = $base_de_datos->query("SELECT * FROM agricultores WHERE cedula = '$cedula' OR nombre = '$nombre'");
	    $datos = $consulta->fetchAll();
        $respuesta['registros']=$datos;
		echo json_encode($respuesta);
	}else{
        $respuesta = [
                        'status' => false,
                        'mesagge' => "ERROR##DATOS##GET",
                        '$_GET' => $_GET,
                        '$_POST' => $_POST
                      ];
        echo json_encode($respuesta);
    }
    
?>

