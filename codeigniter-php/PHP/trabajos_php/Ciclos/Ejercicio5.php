<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digitador o diseñador</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
    <h1>Digitador o diseñador</h1>
    <?php
        if(empty($_REQUEST)){    
    ?>
     <form action="" method="POST">
         <?php
         for($i=0; $i<2; $i++){
            ?>
            <label for="num"><strong>Ingrese las horas trabajadas <?php echo $i;?>: </strong> </label>
            <input type="number" name="horas[]" /><br>
            <label for="num"><b> Ingrese sueldo por hora</b></label>
            <input type="number" name="sueldo[]" /><br>
            <label for="num"><strong>Ingrese tipo de trabajado</strong> </label><br>
            <select name="trabajador[]">
                <option value="diseñador" selected>Diseñador</option>
                <option value="digitador" >Digitador</option>
            </select> 
            <br><br>

         <?php   
         }
         ?>
        <input type="submit" name="submit" value="Enviar"/>  
        
    </form>
    <?php
        }else{
            echo "Pagos", '<br><br>';
            $tipo=$_REQUEST['trabajador'];
            $horas=$_REQUEST['horas'];
            $sueldo=$_REQUEST['sueldo'];
            
            for($i=0; $i<2 ; $i++){
            $total=$sueldo[$i]*$horas[$i];
                if($total>=1000000){
                    if($tipo[$i]=="digitador"){
                        $descu=$total*12/100;
                        $descuento=$total-$descu;
                        echo "Señor digitador", '<br>';
                        echo "este es su pago con descuento: ", $descuento, '<br><br>';
                    }else if($tipo[$i]=="diseñador"){
                        $descu=$total*10/100;
                        $descuento=$total-$descu;
                        echo "Señor diseñador",'<br>';
                        echo "este es su pago con descuento: ", $descuento, '<br><br>';
                    }
                }else if($total<1000000){
                    if($tipo[$i]=="digitador"){
                        echo "Señor digitador", '<br>';
                        echo "este es su pago sin desuento: ", $total, '<br><br>';
                    }else if($tipo[$i]=="diseñador"){
                        echo "Señor diseñador", '<br>';
                        echo "este es su pago sin desuento: ", $total, '<br><br>';
                    }

                }
            }
        }   
    ?>
    <a href="/trabajos_php"><button class="btn btn-outline-dark">Regresar</button></a>
</body>
</html>