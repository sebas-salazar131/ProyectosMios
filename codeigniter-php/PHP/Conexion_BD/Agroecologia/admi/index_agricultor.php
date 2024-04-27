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

        $consulta=$conexion_bd->query("Select * from agricultores where nombre='$buscar'");
        
        ?>
        <h2 class="text-center mb-4 mt-4">La persona fue encontrada</h2>
       <div class="cont">
            <table class="table">
                <thead>
                <tr>
                    <th scope="col"><?php echo 'Nombre ';?></th>
                    <th scope="col"><?php echo 'Apelldo ';?></th>
                    <th scope="col"><?php echo 'Telefono ';?></th>
                    <th scope="col"><?php echo 'Ubicacion ';?></th>
                    <th scope="col"><?php echo 'Producto ';?></th>
                    
                    </tr>
                <?php
                while($row=$consulta->fetch_array()){ 
                    ?>
                    
                    
                    <tbody>
                        <tr>
                            <td><?php echo  $row['nombre'];?></td>
                            <td><?php echo  $row['apellido'];?></td>
                            <td><?php echo  $row['telefono'];?></td>
                            <td><?php echo  $row['ubicacion'];?></td>
                            <td><?php echo  $row['producto'];?></td>
                            
                                
                            
                            
                        </tr>
                    </tbody>
                    <?php
                }  
                ?>  
                
            </div>
            
            </thead>
            </table>
       </div>
       
    <div class="text-center mt-5 mb-3"> <a href="http://localhost/Conexion_BD/Agroecologia/admi/listar_agricultores.php"><button class="btn btn-primary">Volver</button></a></div>
</body>
</html>