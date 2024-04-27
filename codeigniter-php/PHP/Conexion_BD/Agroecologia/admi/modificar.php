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
                        <th scope="col"><?php echo 'Nombre ';?></th>
                        <th scope="col"><?php echo 'Apelldo ';?></th>
                        <th scope="col"><?php echo 'Telefono ';?></th>
                        <th scope="col"><?php echo 'Ubicacion ';?></th>
                        <th scope="col"><?php echo 'Producto ';?></th>
                        <th scope="col"></th>
                        
                        </tr>
                    <?php
                       $nombre=($_GET['nombre']);
                       $apellido=($_GET['apellido']);
                       $telefono=($_GET['telefono']);
                       $ubicacion=($_GET['ubicacion']);
                       $producto=($_GET['producto']);
                       
                        ?>
                        
                        
                        <tbody>
                            <form action="editarAgricu.php" method="POST">
                            <tr>
                                <td><input type="text" name="nombre" value="<?php echo $nombre; ?>"></td>
                                <td><input type="text" name="apellido" value="<?php echo $apellido; ?>"></td>
                                <td><input type="text" name="telefono" value="<?php echo $telefono; ?>"></td>
                                <td><input type="text" name="ubicacion" value="<?php echo $ubicacion; ?>"></td>
                                <td> <?php
                                    $consulta = "SELECT * FROM productos";
                                    $resultado = $conexion_bd->query($consulta);
                                        ?>
                                        <select name="producto" id="" class="m-2 sele">
                                            <?php   
                                            while($row=$resultado->fetch_array()) {
                                                $produc=$row['producto'];
                                                ?><option value="<?php echo $produc;?>"  class="ml-3"><?php echo $row['producto'];?></option>

                                            <?php
                                            }
                                            ?>
                                        </select></td>
                                        <td>
                                <input type="submit" value="Editar"></td>

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