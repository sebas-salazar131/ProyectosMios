<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
</head>
<body>
    <h2>fgbrth</h2>

    <div class="shadow-lg p-5 mb-5 rounded position-absolute top-50 start-50 translate-middle ">
		<form action="<?= base_url('index.php/Login/validarIngreso') ?>" method="POST">
			<h3 class="mb-4">Inicio de Sesion</h3>
			<?php if(isset($errorInData)): ?>
                <div class="alert alert-danger">
                     DATOS INCOMPLETOS
                </div>
            <?php endif ?>

            <?php if(isset($errorInData)): ?>
                <div class="alert alert-danger">
                    datos incorrectos
                </div>
            <?php endif ?>

			<div class="mb-2 ">
				<label for="" class="form-label">Ingrese Email</label>
				<input type="email" class="form-control " name="campo_email" >
			</div>
            <div class="mb-4 ">
				<label for="" class="form-label">Ingrese Contraseña</label>
				<input type="password" class="form-control" name="campo_password" >
			</div>
			<button type="submit" class="btn btn-primary form-control">Submit</button>
       </form>
        <div class="mt-3 ">
            ¿Recuperar Contraseña?
            <a href="#">Click Aqui</a>
            
        </div>
		
	</div>
</body>
</html>