<?php
    $num1 = $_REQUEST['num1'];
    $num2 = $_REQUEST['num2'];
    
    if($num1<$num2){
        echo "El primer número es: ", $num1,"<br>";
        echo "El segundo número es: ", $num2;
    }else {
        echo "El primer número es: " , $num2,"<br>";
        echo "El segundo número es: " , $num1;
    }
?>