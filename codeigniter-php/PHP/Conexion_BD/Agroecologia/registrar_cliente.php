<?php 
	session_start();
	include_once("conexionBD.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agroecologia</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <div class="formulario ">
        <form name="form1" method="post" action="" class="form-signin">
      	
      	<?php 
	  	if(isset($_POST['correo_inicio']) and isset($_POST['contrasenia-inicio'])){ 
			$correo=($_POST['correo_inicio']);
			$contra=($_POST['contrasenia-inicio']);
			// $con=encrypt($con,$usu);
			
			$consulta=$conexionBD->query("SELECT * FROM registrar WHERE correo='$correo' and contrasenia='$contra'");				
			if($row=$consulta->fetch_array()){
               
				//if($row['estado']=='s'){
                $nombre=$row['nombre'];
                
                $_SESSION['user_name']=$nombre;
                //$_SESSION['tipo_user']=$row['tipo'];
                //$_SESSION['cod_user']=$usu;
              //  if($row['tipo']=='a'){
                    
                    ?>
                    <h1>Bienvenido</h1><br>
                    <h3><?php echo $row['nombre'].' '.$row['apellido']?> </h3>
                    <?php
                    
                    echo '<meta http-equiv="refresh" content="2;url=http://localhost/Conexion_BD/Agroecologia/admi/inicio.php">';
					//}
				//}else{
					//echo ('Usted no se encuentra Activo en la base de datos<br>Consulte con su Administrador de Sistema');	
				//}
			}else{
				echo ('Usuario y Contraseña Incorrecto');
				echo '<center><a href="registrar_cliente.php" class="btn"><strong>Intentar de Nuevo</strong></a></center>';
			}
		}else{
			?>	
            
            <h2>Iniciar Sesion</h2><hr><br>
            <label for="text"><b> Correo Electronico</b></label><br>
            <input type="email" class="rounded" name="correo_inicio"/><br><br>
            <label for="text"><b>Contraseña</b> </label><br>
            <input type="password" class="rounded" name="contrasenia-inicio"/><br><br>
            <button class="btn btn-large btn-primary" type="submit"><strong>Entrar</strong></button>
            <hr>
              <!-- Button trigger modal -->
           
        <?php
		}
	  ?>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Registrarse
            </button>
       </form>
     
     
        
        
       
    </div>

  

<!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content ">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 justify-content-center" id="exampleModalLabel">Datos Personales</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="registrar.php">
                    <div class="modal-body">
                            <div class="input-group">
                                <input type="text" aria-label="First name" name="nombre" placeholder="Nombres" class="form-control">
                                <input type="text" aria-label="Last name" name="apellido" placeholder="Apellidos" class="form-control">
                            </div><br>
                            <div class="input-group mb-3">
                                <input type="number" class="form-control" name="telefono" placeholder="Telefono" aria-label="Username" aria-describedby="basic-addon1">
                            </div>
                            <div class="input-group mb-3">
                                <input type="email" class="form-control" name="correo" correo placeholder="Correo Electronico" aria-label="Username" aria-describedby="basic-addon1">
                            </div>
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" name="contrasenia" placeholder="Contraseña" aria-label="Username" aria-describedby="basic-addon1">
                            </div>
                            <h5>Sexo</h5>
                            <div class="row input container">
                                <div class="col-4 d-inline-block border border-secondary rounded bg-success m-1">
                                    <b> Mujer</b><input type="radio" value="femenino" name="sexo">
                                </div>
                                <div class="col-3 d-inline-block border border-secondary rounded bg-success m-1">
                                <b>Hombre</b> <input type="radio" value="masculino" name="sexo">
                                </div>
                                <div class="col-4 d-inline-block border border-secondary rounded bg-success m-1">
                                <b> Personalizado</b><input type="radio" value="personalizado" name="sexo">
                                </div>  
                          </div><br>
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