<?php

    $horas=$_REQUEST['hora'];
    $cant_horas=$_REQUEST['cant_horas'];
    $festivos=$_REQUEST['festivos'];

    if($horas=="diurna"){
        $total=50000*$cant_horas;
    }else if($horas=="nocturna"){
        $total=80000*$cant_horas;
    }

    if($total>800000 && $festivos=="no"){
        $porce=$total*10/100;
        $pago=$total-$porce;
        echo "Bro este es tu salario neto con descuento del 10%: ", $pago;
    }else if($total<800000 && $festivos=="no"){
        echo "Bro este es tu salario neto sin decuento: ", $total;
    }else if($total>800000 && $festivos=="si"){
        $porce=$total*10/100;
        $pago=$total-$porce;
        $porce2=$pago*15/100;
        $aumento=$pago+$porce2;
        echo "Bro este es tu salario neto con decuento del 10% y aumento del 15%: ", $aumento;
    }else if($total<800000 && $festivos=="si"){
        $porce=$total*15/100;
        $aumento=$total+$porce;
        echo "Bro este es tu salario neto con aumento del 15%", $aumento;
    }
?>