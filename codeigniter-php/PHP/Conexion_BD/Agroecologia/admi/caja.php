<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Caja</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" href="admi2.css">
</head>
<body class="otro_body">
    <div class="formulario container">
    <form action="index_caja.php" class=" border border-secondary rounded margen shadow-lg">
        <h2>Caja</h2><hr><br>
        <div class="row">
            <div class="col-12">
                <h4>Producto</h4>
            </div>
            <?php
             include_once("conexion_bd.php"); 
             $buscar=$_REQUEST['producto_comprar'];
             $consulta=$conexion_bd->query("Select * from productos where id='$buscar' or producto='$buscar'");
             $i=0;
             while($row=$consulta->fetch_array()){
             
                $produc=$row['producto'];
                 $precio=$row['precio'];   
                    ?>
                    <div class="col-12">
                        <input type="text" name="producto" value="<?php echo $produc;?>" class="inputs" readonly>
                   </div><br>
                   <div class="col-12">
                        <h4>Cantidad a vender</h4>
                    </div>
                    <div class="col-12">
                        <input type="number" name="cantidad_caja" class="inputs" >
                    </div><br>
                    <div class="col-12">
                        <h4>Precio</h4>
                    </div>
                    <div class="col-12">
                        <input type="number" name="precio" value="<?php echo $precio;?>" class="inputs" readonly >
                    </div><br><br>

            <?php
            $i++;
             }

            ?> 

                <div class="col-12">
                    <h4>Dinero a pagar</h4> <input type="number" name="recibido" class="inputs" >
                </div><br>
                
                </div>
                <br>
                <input type="submit" class="btn btn-primary" value="Pagar">
                            
    </form>
    </div>
   
    <script src="probando.js"></script>
</body>
</html>