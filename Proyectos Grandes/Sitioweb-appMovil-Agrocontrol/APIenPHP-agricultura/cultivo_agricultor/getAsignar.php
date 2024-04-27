<?php 
	header("Access-Control-Allow-Origin: * "); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
	header("Access-Control-Allow-Methods: GET, POST");
	header("Access-Control-Allow-Headers: Content-Type");

    include 'Conexion.php';

    if (isset($_GET['id_agricultor']) || isset($_GET['id_cultivo'])) {
        $id_agricultor = isset($_GET['id_agricultor']) ? $_GET['id_agricultor'] : null;
        $id_cultivo = isset($_GET['id_cultivo']) ? $_GET['id_cultivo'] : null;
    
        if ($id_agricultor !== null || $id_cultivo !== null) {
            $consulta = $base_de_datos->query("SELECT * FROM agricultor_cultivo WHERE id_agricultor = '$id_agricultor' OR id_cultivo = '$id_cultivo'");
            $datos = $consulta->fetchAll();
            $respuesta['registros'] = $datos;
            echo json_encode($respuesta);
        } else {
            $respuesta = [
                'status' => false,
                'mesagge' => "ERROR##DATOS##GET",
                '$_GET' => $_GET,
                '$_POST' => $_POST
            ];
            echo json_encode($respuesta);
        }
    } else {
        $respuesta = [
            'status' => false,
            'mesagge' => "ERROR##DATOS##GET",
            '$_GET' => $_GET,
            '$_POST' => $_POST
        ];
        echo json_encode($respuesta);
    }
    
    
?>

