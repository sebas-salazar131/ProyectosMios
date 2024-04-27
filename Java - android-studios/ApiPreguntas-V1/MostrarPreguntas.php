<?php 
    include 'Conexion.php';

    if (!empty($_POST["id_cuestionario"]) || !empty($_GET["id_cuestionario"]))  {
        $id_cuestionario = (!empty($_POST["id_cuestionario"])) ? $_POST["id_cuestionario"] : $_GET["id_cuestionario"];


        $consulta = $base_de_datos->prepare("SELECT id, descripcion, id_correcta,url_imagen FROM preguntas 
        LEFT JOIN respuestas ON preguntas.id = respuestas.id_pregunta AND respuestas.id_cuestionario = :id_cuestionario
        WHERE respuestas.id_pregunta IS NULL
        ORDER BY RAND() LIMIT 1");

        $consulta->bindParam(':id_cuestionario', $id_cuestionario);
        $consulta->execute();

        $datos = $consulta->fetchAll(PDO::FETCH_ASSOC);

        if ($datos) {
            $consulta_opciones = $base_de_datos->prepare("SELECT descripcion, id FROM opciones WHERE id_pregunta = :id_pregunta");
            $consulta_opciones->bindParam(":id_pregunta", $datos[0]['id']);
            $consulta_opciones->execute();
            $opciones = $consulta_opciones->fetchAll(PDO::FETCH_ASSOC);

            $datos[0]['opciones'] = $opciones;

            $respuesta = [
                "status"=> true,
                "message" => "PREGUNTA##FOUND",
                "pregunta" => $datos[0]
            ];
            echo json_encode($respuesta);
        } else {
            $respuesta = [
                "status"=> false,
                "message" => "PREGUNTA##NOT##FOUND"
            ];
            echo json_encode($respuesta);
        }
    } else {
        $respuesta= [
            "status"=>false,
            "message"=>"ERROR##DATA"
        ];
        echo json_encode($respuesta);
    }
?>