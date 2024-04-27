<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Document</title>
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <link rel="stylesheet" href="index.css">
</head>
<body>
   <div>

   </div>
   <?php
      include_once("conexionBD.php");

      $conexionBD->query("insert into registrar(nombre,apellido,telefono,correo,contrasenia,sexo) values ('$_REQUEST[nombre]', '$_REQUEST[apellido]',
      $_REQUEST[telefono],'$_REQUEST[correo]', '$_REQUEST[contrasenia]','$_REQUEST[sexo]')");
   ?>

     <div class="container mt-5 text-center">
        <h1>El producto se ha registrado</h1>
        <div class="text-center mt-4"> <a href="http://localhost/Conexion_BD/Agroecologia/admi/inicio.php"><button class="btn btn-primary">Volver</button></a></div>
    </div>
</body>
</html>