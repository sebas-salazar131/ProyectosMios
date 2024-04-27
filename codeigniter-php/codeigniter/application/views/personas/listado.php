<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
</head>
<body>
    <div class="container">
        <h1 class="text-center">Ver Personas</h1>
        <br>
            <a href="guardar" class="btn btn-success">Crear Persona</a>
        <br>
        <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Edad</th>
                <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    foreach($personas as $key =>$persona ):
                        if($persona->nombre!=null && $persona->apellido!=null &&  $persona->edad!=null){
                            ?>
                            <tr>
                                <td scope="row"><?php echo $persona->persona_id ?></td>
                                <td ><?php echo $persona->nombre ?></td>
                                <td ><?php echo $persona->apellido ?></td>
                                <td ><?php echo $persona->edad ?></td>
                                <td>
                                    <a href="guardar/<?php echo $persona->persona_id ?>">Editar</a>
                                    <br>
                                    <a href="ver/<?php echo $persona->persona_id ?>">Ver</a>
                                    <br>
                                    <a href="borrar/<?php echo $persona->persona_id ?>">Borrar</a>
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                        
                        
                <?php endforeach; ?>
            </tbody>
            </table>
    </div>
</body>
</html>