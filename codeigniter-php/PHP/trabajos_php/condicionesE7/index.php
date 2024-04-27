<?php

    $nombre = $_REQUEST['nombre'];
    $precio = $_REQUEST['precio'];
    $clave = $_REQUEST['clave'];

    if($clave == 01){
        echo"Nombre: ",$nombre ,'<br>';
        echo"Precio Normal: ",$precio,'<br>';
        echo"Precio con descuento: ",$precio-($precio*0.10);
        
    }else if($clave == 02){
        echo"Nombre: ",$nombre ,'<br>';
        echo"Precio Normal: ",$precio,'<br>';
        echo"Precio con descuento: ",$precio-($precio*0.20);
    }

?>