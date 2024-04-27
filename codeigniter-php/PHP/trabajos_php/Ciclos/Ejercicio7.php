<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Imprimir boletin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
    
    <?php
       if(empty($_REQUEST)){   
    ?>   
    <h1>Boletin estudiantil</h1>
     <form action="" method="POST">
        <label for="num">Ingrese el numero estudiantes</label>
        <input type="number" name="num" />
        <input type="submit" name="submit" value="Enviar"/>
    </form>
    <?php
        }elseif(isset($_REQUEST['num'])){
    ?>
    <form action="" method="POST">
        <?php
            $num= $_REQUEST['num'];
            
            for($i=0; $i<$num; $i++  ){
            ?>
            <br>
            <h2>Alumno <?php echo $i;?>:</h2>
             <label for="num"><strong>Ingrese codigo del estudiante </strong> </label>
             <input type="number" name="codigo[]"><br>
             <label for="num"><strong>Ingrese el nombre del estudiante</strong> </label>
             <input type="text" name="nombre[]"><br>
             <label for="num"><strong>Ingrese el numero de indicadores de logros</strong> </label>
             <input type="number" name="logros[]"><br>
              <hr>
             <?php
            }
        ?>
        <br>
        <input type="submit" name="submit" class="bg-primary" value="Enviar"/>
    </form>
    <?php
        }else{
    ?>   
    <h1>Informe boletin</h1> 
    <?php
    $i=1;
        $codigo=$_REQUEST['codigo'];
        $logros=$_REQUEST['logros'];
        foreach($_REQUEST['nombre'] as $i => $nombre){
            if($logros[$i]>=0 && $logros[$i]<=10){
                ?>
                <h2>Estudiante <?php echo $i," ",$nombre; ?>:</h2>
                <?php
                echo "Codigo: ",$codigo[$i], '<br>';
                echo "DEFICIENTE ", '<br>';
            }else if($logros[$i]>10 && $logros[$i]<=30){
                ?>
                <h2>Estudiante <?php echo $i," ",$nombre; ?>:</h2>
                <?php
                echo "Codigo: ",$codigo[$i], '<br>';
                echo "INSUFICIENTE ", '<br>';
            }else if($logros[$i]>30 && $logros[$i]<=50){
                ?>
                <h2>Estudiante <?php echo $i," ",$nombre; ?>:</h2>
                <?php
                echo "Codigo: ",$codigo[$i], '<br>';
                echo "ACEPTABLE ", '<br>';
            }else if($logros[$i]>50 && $logros[$i]<=70){
                ?>
                <h2>Estudiante <?php echo $i," ",$nombre; ?>:</h2>
                <?php
                echo "Codigo: ",$codigo[$i], '<br>';
                echo "BUENO ", '<br>';
            }else if($logros[$i]>70 && $logros[$i]<=90){
                ?>
                <h2>Estudiante <?php echo $i," ",$nombre; ?>:</h2>
                <?php
                echo "Codigo: ",$codigo[$i], '<br>';
                echo "SOBRESALIENTE", '<br>';
            }else if($logros[$i]>90){
                ?>
                <h2>Estudiante <?php echo $i," ",$nombre; ?>:</h2>
                <?php
                echo "Codigo: ",$codigo[$i], '<br>';
                echo "EXCELENTE", '<br>';
            }
        }
    }    
    ?>   
    <a href="/trabajos_php"><button class="btn btn-outline-dark">Regresar</button></a>
</body>
</html>