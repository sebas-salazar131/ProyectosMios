<?php 
	include 'Conexion.php';
    if (!empty($_POST["id_cuestionario"]) || !empty($_GET["id_cuestionario"]))  {
    $id_cuestionario = (!empty($_POST["id_cuestionario"]))? $_POST["id_cuestionario"] : $_GET["id_cuestionario"] ;
    
    $consulta = $base_de_datos->prepare("SELECT preguntas.id, preguntas.descripcion, preguntas.id_correcta, preguntas.url_imagen, respuestas.respuesta, respuestas.estado FROM preguntas 
    JOIN respuestas ON preguntas.id = respuestas.id_pregunta 
    JOIN cuestionarios ON respuestas.id_cuestionario = cuestionarios.id
    WHERE respuestas.id_cuestionario = :id AND respuestas.id_pregunta = preguntas.id");

    $consulta->bindParam(":id",$id_cuestionario);
    $consulta->execute();
   

    $datos = $consulta->fetchAll(PDO::FETCH_ASSOC);
    $datos= mb_convert_encoding($datos, "UTF-8", "iso-8859-1");    
    // Codifica los datos en UTF-8, para que se puedan convertir a Json sin problema (Ñ y tildes)
    
    foreach ($datos as &$pregunta) {
        $consulta_opciones = $base_de_datos->prepare("SELECT opciones.descripcion, opciones.id_pregunta, opciones.id FROM opciones WHERE id_pregunta = :id_pregunta");
        $consulta_opciones->bindParam(":id_pregunta", $pregunta['id']);
        $consulta_opciones->execute();
        $pregunta['opciones'] = $consulta_opciones->fetchAll(PDO::FETCH_ASSOC);
    }

   
    if($datos){
            $respuesta=[
                "status"=> true,
                "message" => "PREGUNTA##FOUND",
                "preguntas" => $datos,
                
            ];
            echo json_encode($respuesta);
        }else{
            $respuesta=[
                "status"=> false,
                "message" => "PREGUNTA##NOT##FOUND"
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
