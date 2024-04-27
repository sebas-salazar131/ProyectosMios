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
        <h2 class="text-center mb-4 mt-4">La persona fue encontrada</h2>
        <?php
            include_once("conexion_bd.php");
        $buscar = $_REQUEST['buscar'];

        $consulta=$conexion_bd->query("Select * from registrar where nombre='$buscar'");
        ?>
        <div class="cont">

                <table class="table">
                <thead>
                    
                <?php
                while($row=$consulta->fetch_array()){ 
                    ?>
                    
                    <tr>
                    <th scope="col"><?php echo 'Nombre: ';?></th>
                    <th scope="col"><?php echo 'Apelldo: ';?></th>
                    <th scope="col"><?php echo 'Telefono: ';?></th>
                    <th scope="col"><?php echo 'Correo: ';?></th>
                    <th scope="col"><?php echo 'Contraseña: ';?></th>
                    <th scope="col"><?php echo 'Genero: ';?></th>
                    </tr>
                    <tbody>
                        <tr>
                            <td><?php echo  $row['nombre'];?></td>
                            <td><?php echo  $row['apellido'];?></td>
                            <td><?php echo  $row['telefono'];?></td>
                            <td><?php echo  $row['correo'];?></td>
                            <td><?php echo  $row['contrasenia'];?></td>
                            <td><?php echo  $row['sexo'];?></td>
                        </tr>
                    </tbody>
                    <?php
                }  
                ?>  
                
            </div>
            </thead>
            </table>
        </div>
        
    <div class="text-center mt-5 mb3"> <a href="http://localhost/Conexion_BD/Agroecologia/admi/listar_usuarios.php"><button class="btn btn-primary">Volver</button></a></div>
</body>
</html>