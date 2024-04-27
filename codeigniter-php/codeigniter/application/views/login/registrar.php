<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
</head>
<body>
    

    <div class="shadow-lg p-5 mb-5 rounded position-absolute top-50 start-50 translate-middle ">
		
		<h3 class="mb-4">Registrase</h3>
        <div class="form-group">
                <?php echo form_open(); ?>
                    <?php 
                            echo form_label('Username', 'username');
                            $data = [
                                'name'      => 'username',
                                'value'     => '',
                                'class' => 'form-control input-lg',
                            ];
                            echo form_input($data);
                        ?>
                    </div>

                    <div class="form-group">
                        <?php 
                            echo form_label('Email', 'email');
                            $data = [
                                'name'      => 'email',
                                'value'     => '',
                                'class' => 'form-control input-lg',
                            ];
                            echo form_input($data);
                        ?>
                    </div>

                    <div class="form-group">
                        <?php 
                            echo form_label('Password', 'password');
                            $data = [
                                'name'  => 'password',
                                'value' => '',
                                'class' => 'form-control input-lg',
                            ];

                            echo form_input($data);
                        ?>
                    </div>

                    
                    <div class="form-group">
                        <?php 
                            echo form_label('Estado', 'estado');
                        ?>
                            <br>
                        <?php 
                            echo form_label('Activo', 'estado');
                        ?>
                        <input type="radio" name="estado" value="Activo" <?= set_radio('myradio', '1', true) ?>>
                        <?php 
                            echo form_label('Inactivo', 'estado');
                        ?>
                            <input type="radio" name="estado" value="Inactivo" <?= set_radio('myradio', '2') ?>>
                        <?php
                        $data = [
                            'name'    => 'estado',
                            
                        ];
                        ?>
                    </div>
                <br>
                <?php echo form_submit('mysubmit', 'Enviar', "class='btn btn-primary form-control'");?>
                    <br>
                    <?php echo form_close(); ?>
                    <br>
               <a href="http://localhost/codeigniter/Login_felipe/login" class="btn btn-success form-control">Volver</a>
        </div>
        
		
	</div>

    <!-- Modal -->
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
</body>
</html>