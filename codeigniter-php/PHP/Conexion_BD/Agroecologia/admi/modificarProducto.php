<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="admi2.css">
</head>
<body  class="body_listar">
    <?php include_once("conexion_bd.php"); ?>
    <div class="container">
        <table class="mt-4">
            <thead>
                    <tr>
                        <th scope="col"><?php echo 'Producto ';?></th>
                        <th scope="col"><?php echo 'Descripcion ';?></th>
                        <th scope="col"><?php echo 'Costo';?></th>
                        <th scope="col"><?php echo 'Precio ';?></th>
                        <th scope="col"><?php echo 'Cantidad_inventario ';?></th>
                        <th scope="col"></th>
                        
                        </tr>
                    <?php
                       $id=($_GET['id']);
                       $producto=($_GET['producto']);
                       $descripcion=($_GET['descripcion']);
                       $costo=($_GET['costo']);
                       $precio=($_GET['precio']);
                       $cantidad_inventario=($_GET['cantidad_inventario']);
                        ?>   
                        <tbody>
                            <form action="editarProducto.php" method="POST">
                            <tr>
                                <input type="hidden" name="id" value="<?php echo $id;?>">
                                <td><input type="text" name="producto" value="<?php echo $producto; ?>"></td>
                                <td><input type="text" name="descripcion" value="<?php echo $descripcion; ?>"></td>
                                <td><input type="number" name="costo" value="<?php echo $costo; ?>"></td>
                                <td><input type="number" name="precio" value="<?php echo $precio; ?>"></td>
                                <td><input type="number" name="cantidad_inventario" value="<?php echo $cantidad_inventario; ?>"></td>
                                
                                <td><input type="submit" value="Editar"></td>

                            </tr>
                            </form>
                        </tbody>
                        <?php
                    
                    ?>  
                    
                </div>
                
                </thead>
        </table>
    </div>
</body>
</html>