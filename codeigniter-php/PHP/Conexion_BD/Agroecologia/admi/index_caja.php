
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" href="admi2.css?v=1">

</head>
<body class="otro_body">
<?php
   include_once("conexion_bd.php"); 
   $producto=$_REQUEST['producto'];
   $cantidad=$_REQUEST['cantidad_caja'];
   $precio=$_REQUEST['precio'];
   $recibido=$_REQUEST['recibido'];
   $total=$precio*$cantidad;
   $devuelta=$recibido-$total;
   $estado="activo";
   $fecha= date("d-m-y");
   $consulta=$conexion_bd->query("SELECT * FROM productos where producto='$producto'");
   while($row=$consulta->fetch_array()){
    if($row['cantidad_inventario']>$cantidad){
        if($recibido>$total){
            $cant_inv=$row['cantidad_inventario'];
            $actualizar=$cant_inv-$cantidad;
            $conexion_bd->query("insert into caja(producto,cantidad,precio,recibido,devuelta,total,fecha,estado) values ('$producto', 
             $cantidad,$precio,$recibido , $devuelta, $total,'$fecha', '$estado')");
             $conexion_bd->query("UPDATE productos set cantidad_inventario='$actualizar' WHERE producto='$producto'");
            ?>
             <div class="contenedor">
              <div class="formulario2">
                <h1>Factura</h1><hr><br><br>
                <h3>Producto: <?php echo $producto;?></h3><br>
                <h3>Cantidad: <?php echo $cantidad;?></h3><br>
                <h3>Precio: <?php echo $precio;?></h3><br>
                <h3>Recibido: <?php echo $recibido;?></h3><br>
                <h3>Devuelta: <?php echo $devuelta;?></h3><br>
                <h3>Total: <?php echo $total;?></h3><br> <br>
                <a href="http://localhost/Conexion_BD/Agroecologia/admi/listar_producto.php"><button class="btn btn-primary">Volver</button></a>
            
            <?php
           }else{
            ?>
            <div class="contenedor">
            <div class="formulario2">
                <h2>La cantidad de dinero que ingreso no es suficiente</h2>
                <a href="http://localhost/Conexion_BD/Agroecologia/admi/listar_producto.php"><button class="btn btn-primary">Volver</button></a>
            </div>
            </div>
            <?php
           }
           
       

    }else{
        ?>
        <div class="contenedor">
        <div class="formulario2">
            <h2>No hay cantidad suficiente en el inventario</h2>
            <a href="http://localhost/Conexion_BD/Agroecologia/admi/listar_producto.php"><button class="btn btn-primary">Volver</button></a>
        </div>
        </div>
        <?php
    }
       
    }
   
   ?>

    

    

</body>
</html>
