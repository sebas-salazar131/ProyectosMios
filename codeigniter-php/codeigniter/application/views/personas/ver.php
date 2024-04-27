<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ver</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
</head>
<body>
<div class="container">
    <?php echo form_open(); ?>
    
    <div class="form-group">
    <?php 
            echo form_label('Nombre', 'nombre');
            $data = [
                'name'      => 'nombre',
                'value'     => $nombre,
                'readonly'  => 'readonly',
                'class' => 'form-control input-lg',
            ];
            echo form_input($data);
        ?>
    </div>

    <div class="form-group">
        <?php 
            echo form_label('Apellido', 'apellido');
            $data = [
                'name'      => 'apellido',
                'value'     => $apellido,
                'readonly'  => 'readonly',
                'class' => 'form-control input-lg',
            ];
            echo form_input($data);
        ?>
    </div>

    <div class="form-group">
        <?php 
            echo form_label('Edad', 'edad');
            $data = [
                'name'  => 'edad',
                'value' => $edad,
                'readonly'  => 'readonly',
                'class' => 'form-control input-lg',
            ];

            echo form_input($data);
        ?>
    </div>
    <a href="http://localhost/codeigniter/Personas/listado" class="btn btn-success">Volver</a>
</div>
</body>
</html>