<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Naranjas</title>
</head>
<body>
    <h1>Tiendas naranjas</h1>
    <?php
        if(empty($_REQUEST)){
    ?>
    <form action="" method="POST">
        <label for="num">¿Cuantos clientes?</label>
        <input type="text" name="num" />
        <input type="submit" name="submit" value="Enviar"/>
    </form>
    <?php
        }elseif(isset($_REQUEST['num'])){
    ?>
    
    <form action="" method="POST">
        <?php
        $num= $_REQUEST['num'];
        for($i=0; $i< $num; $i++){
            ?>
            ingrese la cantidad del cliente <?php echo $i;?>:
            <input type="number" name="cantidad[]" value="" />
            <br>
        <?php
        
        }
        ?>
        <input type="submit" value="Enviar"/>
    </form>    
    <?php
    }else{
        $aux=0;
        foreach($_REQUEST['cantidad'] as $cantidad){
            echo "<p>Cantidad: $cantidad</p>";
            if($cantidad>=10){
                $tot=$cantidad*10000;
                $descu=$tot*0.15;
                $total=$tot-$descu;
                echo "tiene descuento", "<br>";
                echo "total a pagar: ", $total;
               
            }else{
                $total=$cantidad*10000;
                echo "no tiene descuento","<br>";
                echo "total a pagar", $total ;
            }
            
            $aux=$aux+$total;
        }
        ?>
        <br>
        <br>
        <?php
        echo "Este es el total a pagar de la tienda: ", $aux;
    }
    ?>

</body>
</html>