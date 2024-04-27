<?php 
	include 'Conexion.php';
    if (!empty($_POST["id_cuestionario"]) || !empty($_GET["id_cuestionario"]) && !empty($_POST["id_pregunta"]) || !empty($_GET["id_pregunta"]) && !empty($_POST["respuesta"]) || !empty($_GET["respuesta"]) && !empty($_POST["estado"]) || !empty($_GET["estado"])){
    $id_cuestionario = (!empty($_POST["id_cuestionario"]))? $_POST["id_cuestionario"] : $_GET["id_cuestionario"] ;
    $id_pregunta = (!empty($_POST["id_pregunta"]))? $_POST["id_pregunta"] : $_GET["id_pregunta"] ;
    $respuesta = (!empty($_POST["respuesta"]))? $_POST["respuesta"] : $_GET["respuesta"] ;
    $estado = (!empty($_POST["estado"]))? $_POST["estado"] : $_GET["estado"] ;
    
    $consulta = $base_de_datos->prepare("INSERT INTO respuestas(id_cuestionario, id_pregunta,respuesta, estado, fecha) VALUES (:id_c, :id_p, :res, :est, NOW()) ");

    $consulta->bindParam(":id_c",$id_cuestionario);
    $consulta->bindParam(":id_p",$id_pregunta);
    $consulta->bindParam(":res",$respuesta);
    $consulta->bindParam(":est",$estado);
    $datos= $consulta->execute();
   

       
    // Codifica los datos en UTF-8, para que se puedan convertir a Json sin problema (Ñ y tildes)
    

   
    if($datos){
           
            $respuesta=[
               
                "status"=> true,
                "message" => "INSERTT##RESPUESTAS",
                "registros" => $datos
            ];
            echo json_encode($respuesta);
        }else{
            $respuesta=[
                "status"=> false,
                "message" => "INSERTT##NOT##RESPUESTAS"
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