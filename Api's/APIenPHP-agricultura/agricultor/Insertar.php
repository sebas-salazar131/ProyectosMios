<?php 
    header("Access-Control-Allow-Origin: *"); // Permite el acceso desde cualquier origen, o usa "http://localhost" si solo quieres permitirlo desde localhost.
    header("Access-Control-Allow-Methods: GET, POST");
    header("Access-Control-Allow-Headers: Content-Type");
    
    include 'Conexion.php';

    if (!empty($_POST['cedula']) and !empty($_POST['nombre']) and !empty($_POST['email']) and !empty($_POST['pass']) and !empty($_POST['telefono']) and !empty($_POST['estado']) and !empty($_POST['apellido'])) {

        $documento = $_POST['cedula'];
        $nombres = $_POST['nombre'];
        $apellido = $_POST['apellido'];
        $correo = $_POST['email'];
        $contrasenia = $_POST['pass'];
        $telefono = $_POST['telefono'];
        $estado = $_POST['estado'];


        try {
            $consulta = $base_de_datos->prepare("INSERT INTO agricultores(cedula, nombre, apellido, email, pass, telefono, estado) VALUES(:doc, :nom, :apell, :cor, :con, :tel, :est) ");

            $consulta->bindParam(':doc', $documento);
            $consulta->bindParam(':nom', $nombres);
            $consulta->bindParam(':cor', $correo);
            $consulta->bindParam(':con', $contrasenia);
            $consulta->bindParam(':tel', $telefono);
            $consulta->bindParam(':est', $estado);
            $consulta->bindParam(':apell', $apellido);
            
            $proceso = $consulta->execute();

            if( $proceso ){
                $respuesta = [
                                'status' => true,
                                'mesagge' => "OK##CLIENT##INSERT"
                              ];
                echo json_encode($respuesta);
            }else{
                $respuesta = [
                                'status' => false,
                                'mesagge' => "ERROR##CLIENT##INSERT"
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
