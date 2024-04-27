<?php 
header("Access-Control-Allow-Origin: *"); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'Conexion.php';

if (!empty($_POST['id_tarea']) && !empty($_POST['estado'])) {
    $ids_tareas = $_POST['id_tarea'];
    $estados = $_POST['estado'];

    try {
        // Itera sobre los IDs de tareas y estados recibidos para actualizar cada tarea
        foreach ($ids_tareas as $index => $id_tarea) {
            $estado = $estados[$index];

            $consulta = $base_de_datos->prepare("UPDATE tareas SET estado=:est WHERE id_tarea = :id ");
            $consulta->bindParam(':id', $id_tarea);
            $consulta->bindParam(':est', $estado);

            $proceso = $consulta->execute();

            if ($proceso) {
                $respuesta = [
                    'status' => true,
                    'message' => "OK##CLIENT##UPDATE"
                ];
            } else {
                $respuesta = [
                    'status' => false,
                    'message' => "ERROR##CLIENT##UPDATE"
                ];
                break; // Sale del bucle si hay un error en una de las actualizaciones
            }
        }

        echo json_encode($respuesta);
    } catch (Exception $e) {
        $respuesta = [
            'status' => false,
            'message' => "ERROR##SQL",
            'exception' => $e->getMessage()
        ];
        echo json_encode($respuesta);
    }
} else {
    $respuesta = [
        'status' => false,
        'message' => "ERROR##DATOS##POST",
        '$_GET' => $_GET,
        '$_POST' => $_POST
    ];
    echo json_encode($respuesta);
}
?>
