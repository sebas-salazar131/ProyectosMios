<?php 
    header("Access-Control-Allow-Origin: *"); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");
    
    include 'Conexion.php';

    if (!empty($_POST['id_cultivo']) and !empty($_POST['nombre']) and !empty($_POST['descripcion']) and !empty($_POST['tipo'])) {

        $nombre= $_POST['nombre'];
        $id_cultivo= $_POST['id_cultivo'];
        $descripcion = $_POST['descripcion'];
        $tipo = $_POST['tipo'];

        try {
            $consulta = $base_de_datos->prepare("UPDATE cultivos SET nombre=:nom, descripcion=:descr, tipo=:tip  WHERE id_cultivo = :id ");

            $consulta->bindParam(':nom', $nombre);
            $consulta->bindParam(':id', $id_cultivo);
            $consulta->bindParam(':descr', $descripcion);
            $consulta->bindParam(':tip', $tipo);
            
            
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
