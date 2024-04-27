<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
    <form action="index.php" class="content text-center ">
        <div class="rounded">
            <h1>Ingrese Datos</h1>

            <label for="text">Nombre</label>
            <input type="text" name="nombre" class="form-floating mb-3"/><br>
            <label for="num">Cedula</label>
            <input type="number" name="cedula" class="form-floating mb-3"/><br>
            <label for="text">Apellido</label>
            <input type="text" name="apellido" class="form-floating mb-3"/><br>
            <label for="text">Direccion</label>
            <input type="text" name="direccion" class="form-floating mb-3"/><br>
            <label for="num">Telefono</label>
            <input type="number" name="telefono" class="form-floating mb-3"/><br>
            <label for="text">Email</label>
            <input type="email" name="email" class="form-floating mb-3"/><br>
            <br>
            <input type="submit" value="Registrar">
        </div>
        
    </form>
    
</body>
</html>