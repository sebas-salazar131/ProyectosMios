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
        <h1 class="text-center">Ver Productos</h1>
        <br>
            <a href="http://localhost/codeigniter/Productos/guardar" class="btn btn-success">Crear Productos</a>
        <br>
        <table class="table table-striped">
            <thead>
                <tr>
                <th scope="col">Serial</th>
                <th scope="col">Nombre</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Valor</th>
                <th scope="col">Cantidad</th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <?php
                    foreach($productos as $key =>$persona ):
                       // if($persona->nombre!=null && $persona->apellido!=null &&  $persona->edad!=null){
                            ?>
                            <tr>
                                <td scope="row"><?php echo $persona->serial ?></td>
                                <td ><?php echo $persona->nombre ?></td>
                                <td ><?php echo $persona->descripcion ?></td>
                                <td ><?php echo $persona->valor ?></td>
                                <td ><?php echo $persona->cantidad ?></td>
                                <td ><a href="<?php echo base_url('index.php/Productos/modificar/' . $persona->serial ); ?>" class="btn btn-primary">Modificar Producto</a></td>
                                <td ><a href="eliminar/<?php echo $persona->serial ?>" class="btn btn-danger">Eliminar Producto</a></td>
                                <td ><a href="ver/<?php echo $persona->serial ?>" class="btn btn-warning">Ver Producto</a></td>
                            </tr>
                            <?php
                       // }
                        ?>
                        
                        
                <?php endforeach; ?>
            </tbody>
            </table>
    </div>
</body>
</html>