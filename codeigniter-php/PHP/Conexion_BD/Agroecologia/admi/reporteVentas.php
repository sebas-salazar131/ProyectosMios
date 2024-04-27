<?php

if(isset($_POST['ini']) and isset($_POST['fin'])){
    $inicio=($_POST['ini']);
    $final=($_POST['fin']);
}else{
    $inicio=date('Y-m-d');
    $final=date('Y-m-d');
}
?>

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

        <form action=""  method="post" action="" class="form-search">
            <div class="buscador mt-4">
                <input type="text" name="buscar" placeholder="Buscar..." />
                <input type="submit" value="Buscar" /><br><br>
               
            </div>
        </form>
        <div class="text-center mt-2">
                 <input type="date" name="ini" value="<?php echo $inicio; ?>" autocomplete="off" required>
                <input type="date" name="fin" value="<?php echo $final; ?>" autocomplete="off" required>
                <input type="submit" value="Buscar" /><br>
             <a href="http://localhost/Conexion_BD/Agroecologia/admi/inicio.php"><button class="btn btn-primary">Volver</button></a>
            </div>
        <div class="resultados">
          
         </div>
 
       <div class="cont">
            <table class="table">
           
                <thead>
                <tr>
                    <th scope="col"><?php echo 'ID ';?></th>
                    <th scope="col"><?php echo 'Producto ';?></th>
                    <th scope="col"><?php echo 'Cantidad ';?></th>
                    <th scope="col"><?php echo 'Precio ';?></th>
                    <th scope="col"><?php echo 'Recibido ';?></th>
                    <th scope="col"><?php echo 'Devuelta ';?></th>
                    <th scope="col"><?php echo 'Total ';?></th>
                    <th scope="col"><?php echo 'Fecha ';?></th>
                    <th scope="col"><?php echo 'Estado';?></th>
                    <th scope="col"></th>
                    </tr>
                <?php
                if(isset($_POST['ini']) and isset($_POST['fin'])){
                    // $buscar=($_POST['buscar']);
                    $ini=($_POST['ini']);
					$fin=($_POST['fin']);
                    $consulta=$conexion->query("SELECT * FROM caja WHERE fecha BETWEEN '$ini' and '$fin' ORDER BY nombre DESC");
                    while($row=$consulta->fetch_array()){ 
                        ?>       
                        <tbody>
                            <tr>
                                <td><?php echo $row['id'];?></td>
                                <td><?php echo  $row['producto'];?></td>
                                <td><?php echo  $row['cantidad'];?></td>
                                <td><?php echo  $row['precio'];?></td>
                                <td><?php echo  $row['recibido'];?></td>
                                <td><?php echo  $row['devuelta'];?></td>
                                <td><?php echo  $row['total'];?></td>
                                <td><?php echo $row['fecha'], '<br>';?></td>
                                <td><form action="estado.php" method="POST">
                                    <input type="hidden" name="estado" value="<?php echo  $row['estado'];?>">
                                    <input type="hidden" name="id" value="<?php echo  $row['id'];?>">
                                    <input type="submit" value="modificar" class="btn btn-primary">
                                </form></td>
                                <td><?php echo $row['estado'];?></td>
                                
                                
                            </tr>
                        </tbody>
                        <?php
                    }  	
                }else{
                        		
                    if(isset($_POST['buscar'])){
                        // Consultar
                        $buscar=($_POST['buscar']);
                        $consulta=$conexion_bd->query("SELECT * FROM caja WHERE id='$buscar'");
                        
                        ?>
                        
                        <?php
                        
                        while($row=$consulta->fetch_array()){ 
                            ?>       
                            <tbody>
                                <tr>
                                    <td><?php echo $row['id'];?></td>
                                    <td><?php echo  $row['producto'];?></td>
                                    <td><?php echo  $row['cantidad'];?></td>
                                    <td><?php echo  $row['precio'];?></td>
                                    <td><?php echo  $row['recibido'];?></td>
                                    <td><?php echo  $row['devuelta'];?></td>
                                    <td><?php echo  $row['total'];?></td>
                                    <td><?php echo $row['fecha'], '<br>';?></td>
                                    <td><form action="estado.php" method="POST">
                                        <input type="hidden" name="estado" value="<?php echo  $row['estado'];?>">
                                        <input type="hidden" name="id" value="<?php echo  $row['id'];?>">
                                        <input type="submit" value="modificar" class="btn btn-primary">
                                    </form></td>
                                    <td><?php echo $row['estado'];?></td>
                                    
                                    
                                </tr>
                            </tbody>
                            <?php
                        }  
                    }else {
                        //Listar
                            $consulta=$conexion_bd->query("SELECT * FROM caja ");	 
                            $cont=0;
                            while($row=$consulta->fetch_array()){ ?>
                                
                                <tr>
                                    <td><?php echo $row['id'];?></td>
                                    <td><?php echo $row['producto'];?></td>
                                    <td><?php echo $row['cantidad'];?></td>
                                    <td><?php echo $row['precio'];?></td>
                                    <td><?php echo $row['recibido'];?></td>
                                    <td><?php echo $row['devuelta'];?></td>
                                    <td><?php echo $row['total'], '<br>';?></td>
                                    <td><?php echo $row['fecha'], '<br>';?></td>
                                    <td><form action="estado.php" method="POST">
                                        <input type="hidden" name="estado" value="<?php echo  $row['estado'];?>">
                                        <input type="hidden" name="id" value="<?php echo  $row['id'];?>">
                                        <input type="submit" value="modificar" class="btn btn-primary">
                                </form></td>
                                <td><?php echo $row['estado'];?></td>
                                </tr>
                            
                                
                                <?php
                                if($row['estado']=="activo"){
                                    $cont+=$row['total'];
                                }
                                
                                
                            }	
                            ?>
                            Total:<input type="number" value="<?php echo $cont;?>">
                            <?php
                    }
                }
                ?>
                
            </div>
            
            </thead>
            </table>
       </div>

   
</body>
</html>