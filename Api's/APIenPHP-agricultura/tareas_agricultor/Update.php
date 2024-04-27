<?php 
    header("Access-Control-Allow-Origin: *"); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");
    
    include 'Conexion.php';

    if (!empty($_POST['id_agricultor']) and !empty($_POST['id_tarea']) and !empty($_POST['fecha_inicio']) and !empty($_POST['fecha_fin']) ) {

        $id_agricultor= $_POST['id_agricultor'];
        $id_tarea = $_POST['id_tarea'];
        $fecha_inicio = $_POST['fecha_inicio'];
        $fecha_fin = $_POST['fecha_fin'];
        try {
            $consulta = $base_de_datos->prepare("UPDATE tarea_agricultor SET  fecha_inicio=:f_ini, fecha_fin=:f_fin  WHERE id_agricultor = :id_a AND id_cultivo=:id_t ");

            $consulta->bindParam(':id_a', $id_agricultor);
            $consulta->bindParam(':id_t', $id_tarea);
            $consulta->bindParam(':f_ini', $fecha_inicio);
            $consulta->bindParam(':f_fin', $fecha_fin);
            
            
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
