<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multiplicacion</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
    <h1>Tabla de Multiplicacion</h1>
    <?php
        if(empty($_REQUEST)){
    ?>
     <form action="" method="POST">
        <label for="num">Ingrese el numero a multiplicar</label>
        <input type="number" name="num" />
        <input type="submit" name="submit" value="Enviar"/>
    </form>
    <?php
        }elseif(isset($_REQUEST['num'])){
    ?>
    <form action="" method="POST">
    <?php
        $num= $_REQUEST['num'];
        for($i=1; $i<= 10; $i++){
            $total=$i*$num;
            echo $i," x ",$num," = ", $total, "<br>";
        } 
    }       
    ?>
   <a href="/trabajos_php"><button class="btn btn-outline-dark">Regresar</button></a>

</body>
</html>