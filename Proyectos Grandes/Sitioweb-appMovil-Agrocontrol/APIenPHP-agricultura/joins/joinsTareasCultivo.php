<?php 
	header("Access-Control-Allow-Origin: * "); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
	header("Access-Control-Allow-Methods: GET, POST");
	header("Access-Control-Allow-Headers: Content-Type");

    include 'Conexion.php';

    if (isset($_GET['id_cultivo']) || isset($_GET['id_agricultor'])  ) {
        $id_cultivo = isset($_GET['id_cultivo']) ? $_GET['id_cultivo'] : null;
        $id_agricultor = isset($_GET['id_agricultor']) ? $_GET['id_agricultor'] : null;

       
    
        if ($id_cultivo !== null || $id_agricultor !== null) {
            $consulta = $base_de_datos->query("SELECT tareas.titulo, tareas.descripcion, tareas.estado FROM tareas JOIN tarea_agricultor ON tareas.id_tarea = tarea_agricultor.id_tarea
            WHERE tareas.id_cultivo = $id_cultivo and tarea_agricultor.id_agricultor = $id_agricultor ");
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
