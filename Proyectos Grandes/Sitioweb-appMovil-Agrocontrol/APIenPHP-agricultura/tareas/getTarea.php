<?php 
	header("Access-Control-Allow-Origin: * "); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
	header("Access-Control-Allow-Methods: GET, POST");
	header("Access-Control-Allow-Headers: Content-Type");

    include 'Conexion.php';

    if (isset($_GET['id_tarea']) || isset($_GET['titulo']) || isset($_GET['id_cultivo']) || isset($_POST['id_tarea'] ) || isset($_POST['id_cultivo'])) {
        $id_tarea = isset($_GET['id_tarea']) ? $_GET['id_tarea'] : null ;
        $titulo = isset($_GET['titulo']) ? $_GET['titulo'] : null;
        $id_cultivo = isset($_GET['id_cultivo']) ? $_GET['id_cultivo'] : $_POST['id_cultivo'];

        if ($id_tarea !== null || $titulo !== null || $id_cultivo !== null) {
            $consulta = $base_de_datos->query("SELECT * FROM tareas WHERE id_tarea = '$id_tarea' OR titulo = '$titulo' OR id_cultivo='$id_cultivo'");
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
            'mesagge' => "ERROR##DATOS##GETFUERA",
            '$_GET' => $_GET,
            '$_POST' => $_POST
        ];
        echo json_encode($respuesta);
    }
    
    
?>

