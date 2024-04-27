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
    <div class="container">
        
        <?php
            include_once("conexion_bd.php");
        $buscar = $_REQUEST['buscar'];

        $consulta=$conexion_bd->query("Select * from productos where id='$buscar' or producto='$buscar'");
        
        ?>
        <h2 class="text-center mb-4 mt-4">El producto fue encontrado</h2>
       <div class="cont">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col"><?php echo 'ID ';?></th>
                    <th scope="col"><?php echo 'PRODUCTO ';?></th>
                    <th scope="col"><?php echo 'DESCRIPCION ';?></th>
                    <th scope="col"><?php echo 'COSTO ';?></th>
                    <th scope="col"><?php echo 'PRECIO ';?></th>
                    <th scope="col"><?php echo 'CANTIDAD INVENTARIO ';?></th>
                    <th scope="col"></th>
                    </tr>
                <?php
                while($row=$consulta->fetch_array()){ 
                    ?>
                    
                    
                    <tbody>
                        <tr>
                            <td><?php echo  $row['id'];?></td>
                            <td><?php echo  $row['producto'];?></td>
                            <td><?php echo  $row['descripcion'];?></td>
                            <td><?php echo  $row['costo'];?></td>
                            <td><?php echo  $row['precio'];?></td>
                            <td><?php echo  $row['cantidad_inventario'];?></td>
                            <td>
                                <form action="caja.php">
                                    <input type="submit" class="btn btn-primary" value="Comprar" >
                                    <input type="hidden" name="producto_comprar" value="<?php echo $buscar;?>">
                                </form>
                            </td>
                            
                        </tr>
                    </tbody>
                    <?php
                }  
                ?>  
                
            </div>
            
            </thead>
            </table>
       </div>
       
    <div class="text-center mt-5 mb-3"> <a href="http://localhost/Conexion_BD/Agroecologia/admi/listar_producto.php"><button class="btn btn-primary">Volver</button></a></div>
</body>
</html>