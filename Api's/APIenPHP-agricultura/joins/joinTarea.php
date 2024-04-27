<?php 
    header("Access-Control-Allow-Origin: * "); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");

    include 'Conexion.php';

    if (isset($_GET['id_agricultor']) && isset($_GET['id_cultivo']) || isset($_POST['id_agricultor']) && isset($_POST['id_cultivo'])) {
        $id_agricultor = isset($_GET['id_agricultor']) ? $_GET['id_agricultor'] : $_POST['id_agricultor'];
        $id_cultivo = isset($_GET['id_cultivo']) ? $_GET['id_cultivo'] : $_POST['id_cultivo'];
    
        if ($id_agricultor !== null && $id_cultivo !== null) {
            $consulta = $base_de_datos->query("SELECT tareas.id_tarea, tareas.id_cultivo, tareas.titulo, tareas.descripcion , tarea_agricultor.fecha_fin , tareas.estado  FROM tareas
                INNER JOIN tarea_agricultor ON tareas.id_tarea = tarea_agricultor.id_tarea WHERE tareas.id_cultivo = '$id_cultivo' AND tarea_agricultor.id_agricultor = '$id_agricultor' ");
            $datos = $consulta->fetchAll();
            $respuesta['registros'] = $datos;
            echo json_encode($respuesta);
        } else {
            $respuesta = [
                'status' => false,
                'message' => "ERROR##DATOS##GET",
                '$_GET' => $_GET,
                '$_POST' => $_POST
            ];
            echo json_encode($respuesta);
        }
    } else {
        $respuesta = [
            'status' => false,
            'message' => "ERROR##DATOS##GET",
            '$_GET' => $_GET,
            '$_POST' => $_POST
        ];
        echo json_encode($respuesta);
    }
?>