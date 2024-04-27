<?php
    $cantidad = $_REQUEST ['cantidad'];

    if($cantidad>3){
        $total=$cantidad*12000;
        echo "Descuento",$total*0.20,'<BR>';
        echo "Total sin descuento: ",$total,'<BR>';
        echo "Total a pagar: ",$total-($total*0.20),'<BR>';
    }else if($cantidad < 3){
        $total=$cantidad*12000;
        echo "Descuento",$total*0.10,'<BR>';
        echo "Total sin descuento: ",$total,'<BR>';
        echo "Total a pagar: ",$total-($total*0.10),'<BR>';
    }
?>