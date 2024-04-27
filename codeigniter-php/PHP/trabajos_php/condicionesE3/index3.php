<?php

   $nota1=$_REQUEST['nota1'];
   $nota2=$_REQUEST['nota2'];
   $nota3=$_REQUEST['nota3'];

   $total1=$nota1+$nota2+$nota3;
   $total=$total1/3;

   if($total>=3.5 ){
       echo "aprobado";
   }else{
       echo "no aprueba";
   }

?>