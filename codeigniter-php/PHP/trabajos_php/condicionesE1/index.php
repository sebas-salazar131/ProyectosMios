<?php
   $ventas= $_REQUEST['ventas'];
   $precios= $_REQUEST['Precios'];

   $cadena = strval($ventas);
   if($ventas>10000000 && $precios=="precio2"){
      $comision=$ventas*10/100;
      echo "Tiene comicion del 10%: ",$comision;
   }else if($ventas>10000000 && $precios=="precio1"){
      $comision=$ventas*4/100;
      echo "Tiene comicion del 4%: ",$comision;
   }else if($ventas<10000000 && $precios=="precio2"){
      $comision=$ventas*2/100;
      echo "Tiene comicion del 2%: ",$comision;
   }else if($ventas<10000000 && $precios=="precio1" && $ventas>0){
      $comision=$ventas*1/100;
      echo "Tiene comicion del 1%: ",$comision;
   }else if($ventas==0){
      echo "No tienes comision por weba 0%";
   }

?>