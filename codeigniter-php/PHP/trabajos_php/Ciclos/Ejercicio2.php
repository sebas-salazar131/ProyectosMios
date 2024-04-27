<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nota estudiantes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
</head>
<body>
 
    
    <h1>Nota Final</h1>
    <?php
        if(empty($_REQUEST)){
    ?>
    <form action="" method="POST">
        <label for="num">¿Cuantos estudiantes son?</label>
        <input type="number" name="num" />
        <input type="submit" name="submit" value="Enviar"/>
    </form>
    <?php
        }elseif(isset($_REQUEST['num'])){
    ?>

    <form action="" method="POST">
        <?php
        $num= $_REQUEST['num'];
        for($i=0; $i< $num; $i++){
            ?>
            Ingrese el codigo del estudiante <?php echo $i;?>:
            <input type="text" name="codigo[]" value="" /><br><br>
            Ingrese el nombre del estudiantes <?php echo $i;?>:
            <input type="text" name="nombre[]" value="" /><br><br>
            <strong>Ingrese sus notas</strong> <br>
            <input type="number" name="nota1[]" step="0.01" placeholder="Nota 1" /><br>
            <input type="number" name="nota2[]" step="0.01" placeholder="Nota 2" /><br>
            <input type="number" name="nota3[]" step="0.01" placeholder="Nota 3" /><br>
            <br>
        <?php
        
        }
    
        ?>
        <input type="submit" value="Enviar"/>
    </form> 
    <?php
    }else{
    
        $aux=0;
        $aux2="";
        echo "Notas estudiantes", '<br><br>';
        foreach($_REQUEST['codigo'] as $i => $codigo){
           
            $nombre=$_REQUEST['nombre'];
            $nota1[$i]=$_REQUEST['nota1'][$i];
            $nota2[$i]=$_REQUEST['nota2'][$i];
            $nota3[$i]=$_REQUEST['nota3'][$i];
            
            $promedio[$i]=($nota1[$i]+$nota2[$i]+$nota3[$i])/3;

            echo "Nombre: ", $nombre[$i], '<br>';
            echo "Codigo: ", $codigo, '<br>';
            echo "Promedio: ", $promedio[$i], '<br><br>';

            if($promedio[$i]>$aux){
                $aux=$promedio[$i];
                $aux2=$nombre[$i];
            }
            
        }
        ?>
        <strong>Mejor nota:</strong><br>
        <?php
            echo "Nombre: ",$aux2,"<br>";
            echo "Nota: ",$aux;
        ?>
       <?php
    }
    ?>
        
    
        
    
   
        
   
    
        <a href="/trabajos_php"><button class="btn btn-outline-dark">Regresar</button></a>

    
</body>
</html>