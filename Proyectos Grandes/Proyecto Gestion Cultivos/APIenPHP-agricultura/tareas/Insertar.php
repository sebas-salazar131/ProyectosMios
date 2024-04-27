<?php 
    header("Access-Control-Allow-Origin: *"); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");
    
    include 'Conexion.php';

    if (  !empty($_POST['id_cultivo']) and !empty($_POST['titulo']) and !empty($_POST['descripcion']) and !empty($_POST['fecha_inicio']) and !empty($_POST['fecha_fin']) and !empty($_POST['estado'])) {

        
        $id_cultivo= $_POST['id_cultivo'];
        $titulo = $_POST['titulo'];
        $descripcion = $_POST['descripcion'];
        $fecha_inicio = $_POST['fecha_inicio'];
        $fecha_fin = $_POST['fecha_fin'];
        $estado = $_POST['estado'];

        try {
            $consulta = $base_de_datos->prepare("INSERT INTO tareas(id_cultivo,titulo, descripcion, fecha_inicio, fecha_fin, estado) VALUES( :id_c,:tit, :descr, :f_ini, :f_fin, :est) ");

            
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
                                'mesagge' => "OK##CULTIVO##INSERT"
                              ];
                echo json_encode($respuesta);
            }else{
                $respuesta = [
                                'status' => false,
                                'mesagge' => "ERROR##CULTIVO##INSERT"
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
