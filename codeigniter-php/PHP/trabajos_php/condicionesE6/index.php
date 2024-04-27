<?php
    $estado = $_REQUEST['estado'];
    $tiempo = $_REQUEST['tiempo'];


    if($estado == "Dormir"){
        $valor = $tiempo*60;
        echo "Usted consumio  ",$valor*1.08," Calorias";
    }else if($estado == "Sentado"){
        $valor = $tiempo*60;
        echo "Usted consumio  ",$valor*1.66," Calorias";
    }

    
?>