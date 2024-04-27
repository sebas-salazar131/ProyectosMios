<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tienda Don Juanito</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
    <?php
       if(empty($_REQUEST)){   
    ?>   
     <form action="" method="POST">
        <label for="num">Ingrese el numero de clientes ingresados</label>
        <input type="number" name="num" />
        <input type="submit" name="submit" value="Enviar"/>
    </form>
    <?php
        }elseif(isset($_REQUEST['num'])){
    ?>
    <form action="" method="POST">
        <?php
            $num= $_REQUEST['num'];
            
            for($i=1; $i<=$num; $i++  ){
            ?>
            <br>
            <h2>Cliente <?php echo $i;?>:</h2>
             <label for="num"><strong>Ingrese el valor de la compra  </strong> </label>
             <input type="number" name="compra[]"><br>
             <label for="num"><strong>Ingrese el valor con lo que pago </strong> </label>
             <input type="number" name="cambio[]"><br>
              <hr>
             <?php
            }
        ?>
        <br>
        <input type="submit" name="submit" class="bg-primary" value="Enviar"/>
    </form>
    <?php
        }else{
            
            ?>
            <h2>Total ventas</h2>
            <?php
                $cambio=$_REQUEST['cambio'];
                $acum=0;
                $acum2=0;
                foreach($_REQUEST['compra'] as $i => $compra){
            ?>
                    <h3>Cliente <?php echo $i;?>: </h3>
                    <?php
                        $descu=$compra*19/100;
                        $iva=$compra+$descu;
                        $devuelta=$cambio[$i]-$iva;
                        echo "Este es el total de venta: ",$iva, '<br>';
                        echo "Este es el valor del iva que se cobro 19%: ",$descu, '<br>';
                        echo "Pago ",$cambio[$i], " su devuelta fue: ", $devuelta, '<br>';
                        $acum+=$iva;
                        $acum2+=$descu;
                }    
                echo '<br>';
                    ?>
            <h2>Ganancias tienda</h2>
            <?php
            echo "Este el valor total: ",$acum, '<br>';
            echo "Este es el total iva: ",$acum2, '<br>';

        }
    ?>    
    <a href="/trabajos_php"><button class="btn btn-outline-dark">Regresar</button></a>
</body>
</html>