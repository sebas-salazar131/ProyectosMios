<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista agricultores</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="admi2.css?v=1">
</head>
<body class="body_listar">
<?php include_once("conexion_bd.php"); ?>

<form action="index_agricultor.php" method="POST">
    <div class="buscador mt-4">
        <input type="text" name="buscar" placeholder="Buscar..." />
        <input type="submit" value="Buscar" />
       
    </div>
    
</form>
<div class="text-center m-2"> <a href="http://localhost/Conexion_BD/Agroecologia/admi/inicio.php"><button class="btn btn-primary">Volver</button></a></div>
<div class="resultados">

<div class="cont ">
<?php

    $consulta = "SELECT * FROM agricultores";
    $resultado = $conexion_bd->query($consulta);
    $i=0;
   
        ?>

        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Telefono</th>
                    <th scope="col">Ubicacion</th>
                    <th scope="col">Producto</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    
                </tr>
            </thead>
            <tbody>
                <?php  while($row=$resultado->fetch_array()){ ?>
                <tr>
                <th scope="row"><?php echo $i;?></th>
                    <td><?php echo $row['nombre'];?></td>
                    <td><?php echo $row['apellido'];?></td>
                    <td><?php echo $row['telefono'];?></td>
                    <td><?php echo $row['ubicacion'];?></td>
                    <td><?php echo $row['producto'];?></td>
                    <td>
                        <a  class="btn btn-primary>" href="modificar.php?
                            nombre=<?php echo $row['nombre'] ?> &
                            apellido=<?php echo $row['apellido'] ?> &
                            telefono=<?php echo $row['telefono'] ?> &
                            ubicacion=<?php echo $row['ubicacion'] ?> &
                            producto=<?php echo $row['producto'] ?> &
                            " title="Editar">
                            <i class="icon-edit">Editar</i>
                        </a>
                    </td>
                    <td>
                        <a  class="btn btn-primary>" data-bs-toggle="modal" data-bs-target="#staticBackdrop" >
                     <i class="icon-edit eliminar">Eliminar</i>
                    </a>
                    </td>
                    <td></td>
                    
                </tr>
                
          
        
        <!-- Modal eliminar -->
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel"></h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body text-center">
                   <h1>¿Segur@ que desea eliminar al agricult@r?</h1>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <a  class="btn btn-primary>" href="eliminarAgri.php?
                        telefono=<?php echo $row['telefono'] ;?>
                    "
                    title="Eliminar">
                    <i class="icon-edit">Eliminar</i>
                    </a>
              </div>
            </div>
          </div>
        </div>
        
       
    
    </tbody>
    <?php
$i++;
}

?>

</table>

</div>

</body>
</html>