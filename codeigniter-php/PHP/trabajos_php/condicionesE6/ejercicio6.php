<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calorias</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
<h1>Ejercicio 6-Condiciones</h1>
    <main>
        <div>
            <form action="index.php" method="POST">
                
               
                Estado:<select name="estado" id="">
                    <option value="Sentado" name="sentado">Sentado</option>
                    <option value="Dormir" name="dormir">Dormir</option>
                </select>
                <br>
                <br>
                Tiempo en ese estado <input type="text" name="tiempo">
                <br>
                <br>
                
                <input type="submit" value="Aceptar">
            </form>
            
        </div>
    </main>
    <a href="/trabajos_php"><button class="btn btn-outline-dark">Regresar</button></a>
</body>
</html>