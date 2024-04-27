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
        <h1 class="text-center">Ver Usuarios</h1>
       
        <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">username</th>
                <th scope="col">Email</th>
                <th scope="col">Password</th>
                <th scope="col">Estado</th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <?php
                    foreach($personas as $key =>$persona ):
                        if($persona->username!=null && $persona->email!=null &&  $persona->password!=null){
                            ?>
                            <tr>
                                <td scope="row"><?php echo $persona->id ?></td>
                                <td ><?php echo $persona->username ?></td>
                                <td ><?php echo $persona->email ?></td>
                                <td ><?php echo $persona->password ?></td>
                                <td ><?php echo $persona->estado ?></td>
                                <td><a href="modificar/<?php echo $persona->id ?>" class="btn btn-primary">Editar</a> </td>
                                <td><a href="ver/<?php echo $persona->id ?>" class="btn btn-warning">Ver</a></td>
                                <td><a href="eliminar/<?php echo $persona->id ?>" class="btn btn-danger">Borrar</a></td>                                    
                                    
                                    
                               
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