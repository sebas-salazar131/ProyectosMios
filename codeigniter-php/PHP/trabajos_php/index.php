<?php
   $edades= $_REQUEST['edad'];
   $docu= $_REQUEST['documento'];
   $nombre= $_REQUEST['nombre'];
   $apellido= $_REQUEST['apellido'];
   $correo= $_REQUEST['correo'];
   $genero= $_REQUEST['genero'];
   $ciudad= $_REQUEST['ciudad'];
   $perfil= $_REQUEST['perfil'];



   echo "Este es el documento: ", $docu, '<br>';
   echo "Este es el nombre: ", $nombre, '<br>';
   echo "Este es el apellido: ", $apellido, '<br>';
   
   if($edades==13){
       echo "aqui las tengo", '<br>';
   }else{
       echo "Esta es la edad: ", $edades, '<br>';
   }
   echo "Este es el correo: ", $correo, '<br>';
   echo "Este es el sexo: ", $genero, '<br>';
   echo "Esta es la ciudad: ", $ciudad, '<br>';
   echo "Este es el perfil laboral:  ", $perfil, '<br>';


   

?>