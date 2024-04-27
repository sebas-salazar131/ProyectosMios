<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
    <title>Document</title>
</head>
<body>
<div class="container">
    <?php echo form_open(); ?>

    <div class="form-group">
    <?php 
            echo form_label('Documento', 'documento');
            $data = [
                'name'      => 'documento',
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
        <?php 
            echo form_label('Apellido', 'apellido');
            $data = [
                'name'  => 'apellido',
                'value' => '',
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
                'type'  => 'number',
                'value' => '',
                'class' => 'form-control input-lg',
            ];

            echo form_input($data);
        ?>
    </div>

    <div class="form-group">
        <?php 
            echo form_label('Correo', 'correo');
            $data = [
                'name'  => 'correo',
                'type'  => 'email',
                'value' => '',
                'class' => 'form-control input-lg',
            ];

            echo form_input($data);
        ?>
    </div>

    <div class="form-group">
        <?php 
            echo form_label('Direccion', 'direccion');
            $data = [
                'name'  => 'direccion',
                'value' => '',
                'class' => 'form-control input-lg',
            ];

            echo form_input($data);
        ?>
    </div>

    <div class="form-group">
        <?php 
            echo form_label('Genero', 'genero');
        ?>
            <br>
        <?php 
            echo form_label('Masculino', 'genero');
        ?>
             <input type="radio" name="genero" value="Masculino" <?= set_radio('myradio', '1', true) ?>>
       <?php 
            echo form_label('Femenino', 'femenino');
        ?>
             <input type="radio" name="genero" value="femenino" <?= set_radio('myradio', '2') ?>>
           <?php
           $data = [
            'name'    => 'genero',
            
        ];
       
        ?>
    </div>

    <!-- check -->
    <div class="form-group">
        <br>
            <?php 
                echo form_label('Habilidades:', 'habilidades');
            ?>
            <br>
            php<input type="checkbox" name="habilidades[]" value="php" ?>>
            python<input type="checkbox" name="habilidades[]" value="python" ?>>
            java<input type="checkbox" name="habilidades[]" value="java" ?>>
            <?php
            $data = [
                'name'  => 'habilidades[]',
                'value' => '',
                'class' => 'form-control input-lg',
            ];
            ?>
            <?php
                // echo form_label('PHP', 'php');
                // echo form_checkbox('newsletter', 'accept', true);
                // $data = [
                //     'name'    => 'habilidades',
                //     'id'      => 'newsletter',
                //     'value'   => 'php',
                //     'checked' => true,
                //     'style'   => 'margin-rigth:10px',
                // ];
                // echo form_label('Python', 'python');
                // echo form_checkbox('newsletter', 'accept', true);
                // $data = [
                //     'name'    => 'habilidades',
                //     'id'      => 'newsletter',
                //     'value'   => 'python',
                //     'checked' => true,
                //     'style'   => 'margin-rigth:10px',
                // ];
                // echo form_label('Java', 'java');
                // echo form_checkbox('newsletter', 'accept', true);
                // $data = [
                //     'name'    => 'habilidades',
                //     'id'      => 'newsletter',
                //     'value'   => 'java',
                //     'checked' => true,
                //     'style'   => 'margin-left:10px',
                // ];  
            ?>
    </div>
    <!-- textarea -->
    <div class="form-group">
        <br>
            <?php 
                echo form_label('Perfil:', 'perfil');
            ?>
            <br>
            <?php
            $data = [
                'name'  => 'perfil',
                'type'  => 'textarea',
                'value' => '',
                'style' =>"margin-top:08px; width:30%; heigth: 5% ",
                'rows'  => '5'
            ];
            echo form_textarea($data);
           ?>

    </div>

    <div class="form-group">
        <br>
            <?php 
                echo form_label('Usuario:', 'usuario');
            ?>
            <br>
            <?php
            $data = [
                'name'  => 'usuario',
                'type'  => '',
                'class' => 'form-control input-lg',
               
            ];
            echo form_input($data);
           ?>

    </div>

    <div class="form-group">
            <?php 
                echo form_label('Contrasenia:', 'contrasenia');
            ?>
            <br>
            <?php
            $data = [
                'name'  => 'contrasenia',
                'type'  => 'password',
                'class' => 'form-control input-lg',
               
            ];
            echo form_input($data);
           ?>

    </div>

    <div class="form-group">
            <?php 
                echo form_label('Año de grado:', 'grado');
            ?>
            <br>
            <?php
            $data = [
                
                '2022'  => '2022',
                '2023'    => '2023',
                '2024'  => '2024',
                '2025' => '2025',
            ];
            
            
            echo form_dropdown('shirts', $data, 'large');
           ?>
       <br>
    </div>
    
      
    <?php echo form_submit('mysubmit', 'Enviar', "class='btn btn-primary'");?>

    <?php echo form_close(); ?>
</div>    
</body>
</html>