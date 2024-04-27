<?php
include 'Conexion.php';
    if( (!empty($_POST["id_usuario"])) || (!empty($_GET["id_usuario"])) ){

        $id_usuario= (!empty($_POST["id_usuario"]))? $_POST["id_usuario"] : $_GET["id_usuario"] ;
        
        
            $consulta = $base_de_datos->prepare("SELECT * FROM cuestionarios WHERE id_usuario=:idu");
            $consulta->bindParam(":idu", $id_usuario);
           
            $consulta->execute();
            // Codifica los datos en UTF-8, para que se puedan convertir a Json sin problema (Ñ y tildes)
            $datos = $consulta->fetchAll(PDO::FETCH_ASSOC);
            $datos = mb_convert_encoding($datos, "UTF-8", "iso-8859-1");
            $respuesta['registros'] = $datos;
            echo json_encode($respuesta);
           
        
        
    }else{
        $respuesta= [
                        "status"=>false,
                        "message"=>"ERROR##DATA"
                    ];
        echo json_encode($respuesta);
    }
    

?>