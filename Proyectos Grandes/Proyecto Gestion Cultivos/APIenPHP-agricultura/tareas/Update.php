<?php 
    header("Access-Control-Allow-Origin: *"); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");
    
    include 'Conexion.php';

    if (!empty($_POST['id_tarea']) and  !empty($_POST['id_cultivo']) and !empty($_POST['titulo']) and !empty($_POST['descripcion']) and !empty($_POST['fecha_inicio']) and !empty($_POST['fecha_fin']) and !empty($_POST['estado'])) {
        $id_tarea= $_POST['id_tarea'];
        $id_cultivo= $_POST['id_cultivo'];
        $titulo = $_POST['titulo'];
        $descripcion = $_POST['descripcion'];
        $fecha_inicio = $_POST['fecha_inicio'];
        $fecha_fin = $_POST['fecha_fin'];
        $estado = $_POST['estado'];

        try {
            $consulta = $base_de_datos->prepare("UPDATE tareas SET id_cultivo=:id_c, titulo=:tit, descripcion=:descr, fecha_inicio=:f_ini, fecha_fin=:f_fin, estado=:est  WHERE id_tarea = :id ");
            $consulta->bindParam(':id', $id_tarea);
            $consulta->bindParam(':id_c', $id_cultivo);
            $consulta->bindParam(':tit', $titulo);
            $consulta->bindParam(':descr', $descripcion);
            $consulta->bindParam(':f_ini', $fecha_inicio);
            $consulta->bindParam(':f_fin', $fecha_fin);
            $consulta->bindParam(':est', $estado);
            
            
            $proceso = $consulta->execute();

            if( $proceso ){
                $respuesta = [
                                'status' => true,
                                'mesagge' => "OK##CLIENT##UPDATE"
                              ];
                echo json_encode($respuesta);
            }else{
                $respuesta = [
                                'status' => false,
                                'mesagge' => "ERROR##CLIENT##UPDATE"
                              ];
                echo json_encode($respuesta);
            }
        } catch (Exception $e) {
            $respuesta = [
                            'status' => false,
                            'mesagge' => "ERROR##SQL",
                            'exception' => $e
                          ];
            echo json_encode($respuesta);
        }
    }else{
        $respuesta = [
                        'status' => false,
                        'mesagge' => "ERROR##DATOS##POST",
                        '$_GET' => $_GET,
                        '$_POST' => $_POST
                      ];
        echo json_encode($respuesta);
    }
?>
