<?php 
	include 'Conexion.php';
    if (!empty($_POST["id"]) || !empty($_GET["id"]) && !empty($_POST["cant_preguntas"]) || !empty($_GET["cant_preguntas"]) && !empty($_POST["cant_ok"]) || !empty($_GET["cant_ok"]) && !isset($_POST["cant_error"]) || !isset($_GET["cant_error"]))  {
        $cant_preguntas = (!empty($_POST["cant_preguntas"])) ? intval($_POST["cant_preguntas"]) : intval($_GET["cant_preguntas"]);
        $cant_ok = (!empty($_POST["cant_ok"])) ? intval($_POST["cant_ok"]) : intval($_GET["cant_ok"]);
        $cant_error = (!empty($_POST["cant_error"])) ? intval($_POST["cant_error"]) : intval($_GET["cant_error"]);
        $id = (!empty($_POST["id"])) ? $_POST["id"] : $_GET["id"];
    $consulta = $base_de_datos->prepare("UPDATE cuestionarios SET cant_preguntas=cant_preguntas+$cant_preguntas, cant_ok=cant_ok+$cant_ok, cant_error=cant_error+$cant_error WHERE id=$id ");
    // $consulta->bindParam(":id",$id_cuestionario);
    //  $consulta->bindParam(":cp",$cant_preguntas);
    // $consulta->bindParam(":co",$cant_ok);
    //  $consulta->bindParam(":ce",$cant_error);
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