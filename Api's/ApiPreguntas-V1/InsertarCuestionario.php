<?php 
	include 'Conexion.php';
    if (!empty($_POST["id_usuarios"]) || !empty($_GET["id_usuarios"]))  {
    $id_usuarios = (!empty($_POST["id_usuarios"]))? $_POST["id_usuarios"] : $_GET["id_usuarios"] ;
    
    $consulta = $base_de_datos->prepare("INSERT INTO cuestionarios(id_usuario, cant_preguntas,cant_ok, cant_error, fecha_inicio, fecha_fin) VALUES (:id, 0, 0, 0, NOW(), NULL) ");

    $consulta->bindParam(":id",$id_usuarios);
    $datos= $consulta->execute();
   
   
        if($datos){
            $id_cuestionario= $base_de_datos->lastInsertId();
            $respuesta=[
            
                "status"=> true,
                "message" => "INSERTT##CUESTIONARIO",
                "registros" => $id_cuestionario
            ];
            echo json_encode($respuesta);
        }else{
            $respuesta=[
                "status"=> false,
                "message" => "INSERTT##NOT##CUESTIONARIO"
            ];
            echo json_encode($respuesta);
        }
    
    }else{
        $respuesta= [
            "status"=>false,
            "message"=>"ERROR##DATA"
        ];
        
    }
?>