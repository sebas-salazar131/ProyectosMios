<?php

   $compra=$_REQUEST['compra'];
   
   if($compra>=100000){
      $descu=$compra*20/100;
      $descuento=$compra-$descu;
      echo "Por la compra se le hizo un descuento de 20%: ", $descuento;
   }else{
      echo "El valor a pagar es: ", $compra;
   }

?>