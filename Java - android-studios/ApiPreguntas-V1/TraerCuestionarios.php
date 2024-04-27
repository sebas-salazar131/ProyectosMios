<?php 
	include 'Conexion.php';
    if (!empty($_POST["id_usuarios"]) || !empty($_GET["id_usuarios"]))  {
    $id_usuarios = (!empty($_POST["id_usuarios"]))? $_POST["id_usuarios"] : $_GET["id_usuarios"] ;
    
    $consulta = $base_de_datos->prepare("SELECT * FROM cuestionarios WHERE id_usuario=:id");

    $consulta->bindParam(":id",$id_usuarios);
    $consulta->execute();
   

    $datos = $consulta->fetchAll(PDO::FETCH_ASSOC);
    $datos= mb_convert_encoding($datos, "UTF-8", "iso-8859-1");    
    // Codifica los datos en UTF-8, para que se puedan convertir a Json sin problema (Ñ y tildes)
    

   
    if($datos){
            $respuesta=[
                "status"=> true,
                "message" => "USER##FOUND",
                "registros" => $datos
            ];
            echo json_encode($respuesta);
        }else{
            $respuesta=[
                "status"=> false,
                "message" => "USER##NOT##FOUND"
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

