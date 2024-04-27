<?php 
    header("Access-Control-Allow-Origin: *"); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");
    
    include 'Conexion.php';

    if (  !empty($_POST['id_agricultor']) and !empty($_POST['id_cultivo'])  ) {

        
        $id_agricultor= $_POST['id_agricultor'];
        $id_cultivo = $_POST['id_cultivo'];
        
        
        

        try {
            $consulta = $base_de_datos->prepare("INSERT INTO agricultor_cultivo(id_cultivo, id_agricultor) VALUES( :id_c, :id_a ) ");

            
            $consulta->bindParam(':id_a', $id_agricultor);
            $consulta->bindParam(':id_c', $id_cultivo);
         
            
            
            
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
