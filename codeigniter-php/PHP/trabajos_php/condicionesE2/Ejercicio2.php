<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Horas trabajadas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
    <form action="index.php" method="POST">
        <h5 class="padding-left-2">Hora laboral</h5> 
        <input type="radio" name="hora" value="diurna">Diurna
        <input type="radio" name="hora" value="nocturna">Nocturna
        <br>
        <br>
        <h5 class="padding-left-4">Horas que trabajo</h5> <input type="number" name="cant_horas">
        <br>
        <br>
        <h5 class="p-2">Trabajo dominicales o festivo?</h5>
        <input type="radio" name="festivos" value="si">chi
        <input type="radio" name="festivos" value="no">no
        <br>
        <br>
        <input type="submit" value="Enviar">

    </form>
    <a href="/trabajos_php"><button class="btn btn-outline-dark">Regresar</button></a>
</body>
</html>