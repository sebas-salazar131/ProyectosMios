<?php 
	include 'Conexion.php';
    if (!empty($_POST["id_cuestionario"]) || !empty($_GET["id_cuestionario"]) )  {
    
    $id_cuestionario = (!empty($_POST["id_cuestionario"]))? $_POST["id_cuestionario"] : $_GET["id_cuestionario"] ;
    
    $consulta = $base_de_datos->prepare("UPDATE cuestionarios SET cant_preguntas=cant_preguntas+1, cant_ok=cant_ok+1, cant_error=cant_error+0 WHERE id=$id_cuestionario ");

    // $consulta->bindParam(":cp",$cant_preguntas);
    // $consulta->bindParam(":co",$cant_ok);
    // $consulta->bindParam(":ce",$cant_error);
    $datos= $consulta->execute();
   
        if($datos){
            
            $respuesta=[
            
                "status"=> true,
                "message" => "UPDATEE##CUESTIONARIO",
                
            ];
            echo json_encode($respuesta);
        }else{
            $respuesta=[
                "status"=> false,
                "message" => "UPDATEE##NOT##CUESTIONARIO"
            ];
            echo json_encode($respuesta);
        }
   }
    
  
    
?>