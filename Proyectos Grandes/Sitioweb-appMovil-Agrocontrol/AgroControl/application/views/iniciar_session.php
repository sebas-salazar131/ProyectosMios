<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>INICIAR SESION</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/dist/sweetalert2.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?= base_url('dist/css/css_login.css') ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
<section id="formulario_login">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-8 col-12">
                <div class="m-0 p-3">
                    <h3 class="text-center mb-3"><b>AGRO CONTROL</b></h3>
                    <?php if (isset($errorInData) || isset($datosInvalidos)): ?>
                        <div class="alert alert-danger">
                            <?php if (isset($errorInData)): ?>
                                DATOS INCOMPLETOS
                            <?php else: ?>
                                NO EXISTE UN USUARIO CON ESOS DATOS
                            <?php endif ?>
                        </div>
                    <?php endif ?>
                    <form action="<?= base_url('index.php/Login/validarIngreso') ?>" method="POST">
                        <h3 class="mb-3"><b>LOGIN</b></h3>
                        <div class="mb-3">
                            <label for="campo_email" class="form-label"><b>E-mail:</b></label>
                            <input class="form-control <?= (isset($valueEmail) && $valueEmail!='')? 'is-valid': ((isset($errorInData))? 'is-invalid':'') ?>" id="campo_email" type="email" name="campo_email" value="<?= (isset($valueEmail))? $valueEmail : '' ?>">
                        </div>
                        <div class="mb-3">
                            <label for="campo_password" class="form-label"><b>Password:</b></label>
                            <input class="form-control <?= (isset($valueEmail) && $valuePassword!='')? 'is-valid': ((isset($errorInData))? 'is-invalid':'') ?>" id="campo_password" type="password" name="campo_password" value="<?= (isset($valuePassword))? $valuePassword : '' ?>">
                        </div>
                        <p class="mb-3">
                            ¿Has olvidado la contraseña?
                            <a href="#" title="Recuperar Contraseña">Recuperar aquí</a>
                        </p>
                        <div class="mb-3">
                            <label for="campo_tipo" class="form-label"><b>Tipo</b></label>
                            <select name="tipo" id="tipo" class="form-select">
                                <option value="ADMIN">ADMIN</option>
                                <option value="AGRICULTOR">AGRICULTOR</option>
                            </select>
                        </div>
                        <div class="row justify-content-center mb-3">
                            <div class="col-12 col-lg-6">
                                <button class="col-12 btn btn-primary" type="submit">INICIAR</button>
                            </div>
                        </div>
                    </form>
                    <div class="text-center">
                        <p>Continuar con</p>
                        <i class="fab fa-google social-btn" title="Google" onclick="location.href='#'"></i>
                        <i class="fab fa-github social-btn" title="GitHub" onclick="location.href='#'"></i>
                        <i class="fab fa-facebook-f social-btn" title="Facebook" onclick="location.href='#'"></i>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-12 col-lg-12">
                            <p class="mb-0">No tienes una cuenta creada?</p>
                            <a href="registrar_cuenta">Registrate Gratis</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-12 p-0">
                <div class="m-0 p-5">
                    <img src="<?= base_url('dist/img/img_agro/img_login.jpeg') ?>" alt="img_agro" class="img-fluid">
                </div>
            </div>
        </div>
    </div>
</section>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.20/dist/sweetalert2.all.min.js"></script>
<?php if (isset($errorInData)): ?>
    <script>
        Swal.fire({
            title: 'DATOS INVALIDOS',
            text: 'El correo y contraseña son obligatorios.',
            icon: 'error',
        });
    </script>
<?php endif ?>
</body>
</html>