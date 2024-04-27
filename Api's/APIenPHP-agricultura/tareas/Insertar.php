<?php 
    header("Access-Control-Allow-Origin: *"); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");
    
    include 'Conexion.php';

    if (  !empty($_POST['id_cultivo']) and !empty($_POST['titulo']) and !empty($_POST['descripcion'])  and !empty($_POST['estado'])) {

        
        $id_cultivo= $_POST['id_cultivo'];
        $titulo = $_POST['titulo'];
        $descripcion = $_POST['descripcion'];
       
        $estado = $_POST['estado'];

        try {
            $consulta = $base_de_datos->prepare("INSERT INTO tareas(id_cultivo,titulo, descripcion, estado) VALUES( :id_c,:tit, :descr, :est) ");

            
            $consulta->bindParam(':id_c', $id_cultivo);
            $consulta->bindParam(':tit', $titulo);
            $consulta->bindParam(':descr', $descripcion);
           
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
