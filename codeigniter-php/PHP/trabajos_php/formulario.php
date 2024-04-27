<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulario PHP</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
    <form action="index.php" method="POST">
        <h5 class="padding-right-4" >Documento:</h5> <input type="number" name="documento">
        <br>
        <br>
        <h5 class="padding-left-2"> Nombre:</h5> <input type="text" name="nombre">
        <br>
        <br>
        <h5 class="padding-left-2"> Apellido: </h5><input type="text" name="apellido">
        <br>
        <br>
        <h5 class="padding-left-4">Edad:</h5> <input type="number" name="edad">
        <br>
        <br>
        <h5 class="padding-left-2">Correo:</h5> <input type="email" name="correo">
        <br>
        <br>
        <h5 class="padding-left-2">Genero:</h5> <input type="radio" name="genero" value="masculino ">Masculino <input type="radio" name="genero" value="femenino">Femenino
        <br>
        <br>
        <h5 class="f">Ciudad:</h5>
        <select name="ciudad">
        <option value="Armenia" name="armenia">Armenia</option>
        <option value="Pereira" name="pereira" selected>Pereira</option>
        <option value="Cartago" name="cartago">Cartago</option>
        </select>
        <br>
        <br>
        <h5 class="padding-left-2">Perfil:</h5>
        <textarea name="perfil" id="" cols="20" rows="5" placeholder="escriba aqui su experiencia"></textarea>
        <br>
        <br>
        <input type="submit" value="Aceptar">
    </form>
   
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
</body>
</html>