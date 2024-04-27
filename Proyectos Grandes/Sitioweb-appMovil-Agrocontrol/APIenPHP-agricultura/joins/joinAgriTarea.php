<?php 
	header("Access-Control-Allow-Origin: * "); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
	header("Access-Control-Allow-Methods: GET, POST");
	header("Access-Control-Allow-Headers: Content-Type");

    include 'Conexion.php';

    if (isset($_GET['id_tarea']) || isset($_POST['id_tarea'])  ) {
        $id_tarea = isset($_GET['id_tarea']) ? $_GET['id_tarea'] : $_POST['id_tarea'];
        

       
    
        if ($id_tarea !== null) {
            $consulta = $base_de_datos->query("SELECT agricultores.nombre, agricultores.telefono, agricultores.cedula FROM agricultores JOIN tarea_agricultor ON tarea_agricultor.id_agricultor = agricultores.cedula
            WHERE $id_tarea = tarea_agricultor.id_tarea ");
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
