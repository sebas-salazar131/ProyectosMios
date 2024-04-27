<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista productos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="admi2.css?v=1">
</head>
<body class="body_listar">
<?php include_once("conexion_bd.php"); ?>

<form action="index_productos.php " method="POST">
    <div class="buscador mt-4">
        <input type="text" name="buscar" placeholder="Buscar con ID" />
        <input type="submit" value="Buscar" />
       
    </div>
</form>

<div class="text-center m-2"> <a href="http://localhost/Conexion_BD/Agroecologia/admi/inicio.php"><button class="btn btn-primary">Volver</button></a></div>
<div class="resultados">

<div class="cont ">
<?php

    $consulta = "SELECT * FROM productos";
    $resultado = $conexion_bd->query($consulta);
    $i=0;
   
        ?>

        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">ID</th>
                    <th scope="col">PRODUCTO</th>
                    <th scope="col">DESCRIPCION</th>
                    <th scope="col">COSTO</th>
                    <th scope="col">PRECIO</th>
                    <th scope="col">CANTIDAD INVENTARIO</th> 
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <?php  while($row=$resultado->fetch_array()){ ?>
                <tr>
                <th scope="row"><?php echo $i;?></th>
                    <td><?php echo $row['id'];?></td>
                    <td><?php echo $row['producto'];?></td>
                    <td><?php echo $row['descripcion'];?></td>
                    <td><?php echo $row['costo'];?></td>
                    <td><?php echo $row['precio'];?></td>
                    <td><?php echo $row['cantidad_inventario'];?></td>
                    <td>
                        <a  class="btn btn-primary>" href="modificarProducto.php?
                            id=<?php echo $row['id']?> &
                            producto=<?php echo $row['producto']?> &
                            descripcion=<?php echo $row['descripcion'] ?> &
                            costo=<?php echo $row['costo'] ?> &
                            precio=<?php echo $row['precio'] ?> &
                            cantidad_inventario=<?php echo $row['cantidad_inventario'] ?> &
                            " title="Editar">
                            <i class="icon-edit">Editar</i>
                        </a>
                    </td>

                    <td>
                      <a  class="btn btn-primary>" data-bs-toggle="modal" data-bs-target="#staticBackdrop1" >
                      <i class="icon-edit eliminar">Eliminar</i>
                    </td>

                </tr>
                
          
       


 
        <!-- Modal eliminar -->
        <div class="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel"></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body text-center">
                   <h1>¿Segur@ que desea eliminar al producto?</h1>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <a  class="btn btn-primary>" href="eliminarProducto.php?
                        id=<?php echo $row['id'] ;?>
                    "
                    title="Eliminar">
                    <i class="icon-edit">Eliminar</i>
                    </a>
              </div>
            </div>
          </div>
        </div>

        <?php
        $i++;
    }

  ?>
    </tbody>
  </table>   
</div>
</body>
</html>