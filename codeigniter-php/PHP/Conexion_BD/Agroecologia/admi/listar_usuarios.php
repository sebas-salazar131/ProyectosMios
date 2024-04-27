<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista Usuarios</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" href="admi2.css?v=1">
</head>
<body class="body_listar">

    
    
        <?php include_once("conexion_bd.php"); ?>

        <form action="index.php" method="POST">
            <div class="buscador mt-4">
                <input type="text" name="buscar" placeholder="Buscar..." />
                <input type="submit" value="Buscar" />
            </div>
        </form>
        <div class="text-center mt-2"> <a href="http://localhost/Conexion_BD/Agroecologia/admi/inicio.php"><button class="btn btn-primary">Volver</button></a></div>
        <div class="resultados">
        
        <div class="cont ">
        <?php

            $consulta = "SELECT * FROM registrar";
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
                            <th scope="col">Correo</th>
                            <th scope="col">Contraseña</th>
                            <th scope="col">Sexo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php  while($row=$resultado->fetch_array()){ ?>
                        <tr>
                        <th scope="row"><?php echo $i;?></th>
                            <td><?php echo $row['nombre'];?></td>
                            <td><?php echo $row['apellido'];?></td>
                            <td><?php echo $row['telefono'];?></td>
                            <td><?php echo $row['correo'];?></td>
                            <td><?php echo $row['contrasenia'];?></td>
                            <td><?php echo $row['sexo'], '<br>';?></td>
                        </tr>
                        
                  
                <?php
                $i++;
            }

          ?>
            </tbody>
        </table>
      </div>

   
</body>
</html>