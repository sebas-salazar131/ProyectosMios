<?php 
	header("Access-Control-Allow-Origin: * "); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
	header("Access-Control-Allow-Methods: GET, POST");
	header("Access-Control-Allow-Headers: Content-Type");

    include 'Conexion.php';

    if (isset($_GET['id_agricultor'])  || isset($_POST['id_agricultor']) ) {
       // $id_cultivo = isset($_GET['id_cultivo']) ? $_GET['id_cultivo'] : null;
        $id_agricultor = isset($_POST['id_agricultor']) ? $_POST['id_agricultor'] : $_GET['id_agricultor'];

       
    
        if ($id_agricultor !== null) {
            $consulta = $base_de_datos->query("SELECT cultivos.*, agricultor_cultivo.id_agricultor FROM cultivos JOIN agricultor_cultivo ON cultivos.id_cultivo= agricultor_cultivo.id_cultivo
            WHERE agricultor_cultivo.id_agricultor =  $id_agricultor ");
            $datos = $consulta->fetchAll();
            $respuesta['registros'] = $datos;
            echo json_encode($respuesta);
        } else {
            $respuesta = [
                'status' => false,
                'mesagge' => "ERROR##DATOS##GET-datos",
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