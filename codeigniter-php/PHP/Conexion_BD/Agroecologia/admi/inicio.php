<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrador</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" href="index_admi.css">
</head>
<body class="body_inicio">
    <div class="formulario container">
            <form action="index_cliente.php" class="d-inline-block border border-secondary rounded margen shadow-lg bg-ligth ">
                <h2>Agroecologia</h2>
                
                <hr><br>
                    <div class="row">
                        <div class="col-12">
                            <a href="http://localhost/Conexion_BD/Agroecologia/admi/listar_usuarios.php"><button type="button" class="btn btn-primary">Listar Usuarios</button></a>
                            <!-- boton producto -->
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                            Agregar Producto
                            </button>
                            <!-- boton agricultor -->
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Agregar Agricultor 
                            </button>
                            <a href="http://localhost/Conexion_BD/Agroecologia/admi/listar_agricultores.php"><button type="button" class="btn btn-primary">Listar Agricultor</button></a>
                        </div>
                        <div class="col-12 text-center mt-2">
                           <a href="http://localhost/Conexion_BD/Agroecologia/registrar_cliente.php"><button type="button" class="btn btn-primary ">Ir a Pagina Usuarios</button></a> 
                           <a href="http://localhost/Conexion_BD/Agroecologia/admi/listar_producto.php"><button type="button" class="btn btn-primary ">Listar productos</button></a>
                           <a href="http://localhost/Conexion_BD/Agroecologia/admi/reporteVentas.php"><button type="button" class="btn btn-primary ">Reporte Ventas</button></a>
                           
                        </div>
                    </div>
            </form>
            <form action="cerrar_sesion.php" method="post">
                               <button  class="btn btn-danger ">Cerrar sesion</button>
            </form>
    </div>



    <!-- Modal Agricultor-->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Datos Agricultor</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="registro_agricultor.php">
                    <div class="modal-body">
                        <div class="input-group">
                            <input type="text" aria-label="First name" name="nombre" placeholder="Nombres" class="form-control">
                            <input type="text" aria-label="Last name" name="apellido" placeholder="Apellidos" class="form-control">
                        </div><br>
                        <div class="input-group mb-3">
                            <input type="number" class="form-control" name="telefono" placeholder="Telefono" aria-label="Username" aria-describedby="basic-addon1">
                        </div>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" name="ubicacion" correo placeholder="Ciudad o municipio" aria-label="Username" aria-describedby="basic-addon1">
                        </div>
                        
                        <h5>Fruta o verdura que ofrecen</h5>
                            
                        <div class="input-group mb-3">
                            <label for="" class="m-2"><h3>Producto</h3> </label>
                            <?php
                            include_once("conexion_bd.php"); 
                            $consulta = "SELECT * FROM productos";
                            $resultado = $conexion_bd->query($consulta);
                                ?>
                                <select name="productos_select" id="" class="m-2 sele">
                                    <?php   
                                    while($row=$resultado->fetch_array()) {
                                        $produc=$row['producto'];
                                         ?><option value="<?php echo $produc;?>" class="ml-3"><?php echo $row['producto'];?></option>

                                    <?php
                                    }
                                    ?>
                                </select>
                            
                        </div>
                        
                    <div class="modal-footer justify-content-center">
                        <input type="submit" class="btn btn-primary" value="Registrarse"></input>
                    </div>
                    </div>
                </form>
            
            </div>
        </div>
    </div>

     <!-- Modal Producto-->
     <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel1">Datos Producto</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="registro_producto.php">
                <div class="modal-body">
                    <div class="input-group mb-3">
                        <input type="number" class="form-control" name="id" placeholder="ID" aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" name="nombre_producto[]" correo placeholder="Nombre" aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" name="descripcion" correo placeholder="Descripcion" aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <input type="number" class="form-control" name="costo" correo placeholder="Costo" aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <input type="number" class="form-control" name="precio" correo placeholder="Precio" aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <input type="number" class="form-control" name="cantidad" correo placeholder="Cantidad Inventario" aria-label="Username" aria-describedby="basic-addon1">
                    </div>

                    <div class="modal-footer justify-content-center">
                        <input type="submit" class="btn btn-primary" value="Registrarse"></input>
                    </div>
                </div>
            </form>
            

            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
</body>
</html>