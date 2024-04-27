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
    <?php echo form_open(); ?>

    <div class="form-group">
    <?php 
            echo form_label('Serial', 'serial');
            $data = [
                'name'      => 'serial',
                'value'     => '',
                'class' => 'form-control input-lg',
            ];
            echo form_input($data);
        ?>
    </div>

    <div class="form-group">
        <?php 
            echo form_label('Nombre', 'nombre');
            $data = [
                'name'      => 'nombre',
                'value'     => '',
                'class' => 'form-control input-lg',
            ];
            echo form_input($data);
        ?>
    </div>

    <div class="form-group">
        <br>
            <?php 
                echo form_label('Descripcion:', 'descripcion');
            ?>
            <br>
            <?php
            $data = [
                'name'  => 'descripcion',
                'type'  => 'textarea',
                'value' => '',
                'style' =>"margin-top:08px; width:30%; heigth: 5% ",
                'rows'  => '5'
            ];
            echo form_textarea($data);
        ?>

    </div>

    <div class="form-group">
        <?php 
            echo form_label('Valor', 'valor');
            $data = [
                'name'  => 'valor',
                'type'  => 'number',
                'value' => '',
                'class' => 'form-control input-lg',
            ];

            echo form_input($data);
        ?>
    </div>

    <div class="form-group">
        <?php 
            echo form_label('cantidad', 'cantidad');
            $data = [
                'name'  => 'cantidad',
                'type'  => 'number',
                'value' => '',
                'class' => 'form-control input-lg',
            ];

            echo form_input($data);
        ?>
    </div>

    <?php echo form_submit('mysubmit', 'Enviar', "class='btn btn-primary'");?>
     <br>
    <?php echo form_close(); ?>
    <a href="http://localhost/codeigniter/Productos/listado" class="btn btn-success">Ver Productos</a>
</div> 
</body>
</html>