<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>INICIAR SESION</title>

  <!--===============================================================================================-->
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/vendor/bootstrap/css/bootstrap.min.css">
  <!--===============================================================================================-->
  <link rel="stylesheet" type="text/css"
    href="<?php echo base_url(); ?>assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css">
  <!--===============================================================================================-->
  <link rel="stylesheet" type="text/css"
    href="<?php echo base_url(); ?>assets/fonts/Linearicons-Free-v1.0.0/icon-font.min.css">
  <!--===============================================================================================-->
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>/assets/vendor/animate/animate.css">
  <!--===============================================================================================-->
  <link rel="stylesheet" type="text/css"
    href="<?php echo base_url(); ?>assets/vendor/css-hamburgers/hamburgers.min.css">
  <!--===============================================================================================-->
  <link rel="stylesheet" type="text/css"
    href="<?php echo base_url(); ?>assets/vendor/animsition/css/animsition.min.css">
  <!--===============================================================================================-->
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>/assets/vendor/select2/select2.min.css">
  <!--===============================================================================================-->
  <link rel="stylesheet" type="text/css"
    href="<?php echo base_url(); ?>assets/vendor/daterangepicker/daterangepicker.css">
  <!--===============================================================================================-->
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/dist/css/util.css">
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/dist/css/main.css">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <!-- Tempusdominus Bootstrap 4 -->
  
  <!-- script de alerta -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  <!-- -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct" crossorigin="anonymous"></script>
  <link rel="stylesheet" type="text/css" href="<?= base_url('assets/dist/css/styles.css') ?>">
</head>

<body style="background-color: #666666;">
  <div class="limiter">
    <div class="container-login100">
      <div class="wrap-login100 bg-success">
      <div class="login100-more" >
        <video muted="muted" autoplay="" loop=""  style="max-width:100%;height:100%"><source  src="<?= base_url('assets/dist/img/lecturaleza.mp4') ?>"type="video/mp4" ></video>
        </div>
        <?php if (isset($date_error)): ?>
            <script>
                Swal.fire({
                title: 'DATOS INCORRECTOS',
                text: 'ERROR: USUARIO INEXISTENTE',
                icon: 'danger',
                });
            </script>
        <?php endif ?>
        <?php if (isset($datosInvalidos)) { ?>
          <script>
            Swal.fire({
            title: 'DATOS INCORRECTOS',
            text: 'ERROR: DATOS NO COINCIDEN',
            icon: 'danger',
            });
        </script>
        <?php } ?>
        <?php if (isset($errorInData)) { ?>
          <div class="alert alert-danger">
            DATOS INCOMPLETOS
          </div>
          <?php } ?>
          <form class="login100-form validate-form " action="<?= base_url('index.php/Login/validarIngreso') ?>" method="post">
					<span class="login100-form-title p-b-43 ">
						<img src="<?= base_url('assets/dist/img/nuevo.png') ?>"  alt="user image" >
					</span>
					
					<div class="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
						<input class="input100" <?= (isset($valueEmail) && $valueEmail!='')? 'is-valid': ((isset($errorInData))? 'is-invalid':'') ?>" id="campo_email" type="email" name="campo_email" value="<?= (isset($valueEmail))? $valueEmail : '' ?>">
						<span class="focus-input100 "></span>
            <span class="label-input100 ">Correo</span>
					</div>
					
					
					<div class="wrap-input100 validate-input" data-validate="Password is required">
						<input class="input100" <?= (isset($valueEmail) && $valuePassword!='')? 'is-valid': ((isset($errorInData))? 'is-invalid':'') ?>" id="campo_password" type="password" name="campo_password" value="<?= (isset($valuePassword))? $valuePassword : '' ?>">
						<span class="focus-input100"></span>
						<span class="label-input100">Contraseña</span>
					</div>

					<!-- <div class="flex-sb-m w-full p-t-3 p-b-32 mt-4">
						<div>
							<a href="<?php echo base_url('index.php/Cliente/Inicio/opencrearClientes') ?>" class="txt1">
								Quieres formar de nuestra, haz click para registrase
							</a>
						</div>
					</div> -->
          <div class="flex-sb-m w-full p-t-3 p-b-32 mt-4">
						<div>
							<a href="#" class="txt1">
								¿Olviste tu contraseña?
							</a>
						</div>
					</div>
			

					<div class="container-login100-form-btn">
						<button class="login100-form-btn">
							Ingresar
						</button>
					</div>
					<div class="text-center p-t-46 p-b-20 ">
						<span class="txt2">
							o regístrate usando
						</span>
					</div>

					<div class="login100-form-social flex-c-m">
            <a href="#" class="login100-form-social-item flex-c-m bg3 m-r-5">
            <i class="fa-brands fa-google fa-bounce"></i>
						</a>

						<a href="#" class="login100-form-social-item flex-c-m bg1 m-r-5">
            <i class="fa-brands fa-facebook-f fa-bounce"></i>
						</a>

						<a href="#" class="login100-form-social-item flex-c-m bg2 m-r-5">
            <i class="fa-brands fa-twitter fa-bounce"></i>
						</a>
					</div>
          
      </div>
      
    </div>
    
  </div>
  <?php if (isset($errorInData)): ?>
    <script>
      Swal.fire({
        title: 'DATOS INVALIDOS',
        text: 'El correo y contraseña son obligatorios.',
        icon: 'error',
      });
    </script>
  <?php endif ?>
  
  
 
  <!--===============================================================================================-->
  <script src="<?php echo base_url();?>assets/vendor/jquery/jquery-3.2.1.min.js"></script>
  <!--===============================================================================================-->
  <script src="<?php echo base_url();?>assets/vendor/animsition/js/animsition.min.js"></script>
  <!--===============================================================================================-->
  <script src="<?php echo base_url();?>assets/vendor/bootstrap/js/popper.js"></script>
  <script src="<?php echo base_url();?>assets/vendor/bootstrap/js/bootstrap.min.js"></script>
  <!--===============================================================================================-->
  <script src="<?php echo base_url();?>assets/vendor/select2/select2.min.js"></script>
  <!--===============================================================================================-->
  <script src="<?php echo base_url();?>assets/vendor/daterangepicker/moment.min.js"></script>
  <script src="<?php echo base_url();?>assets/vendor/daterangepicker/daterangepicker.js"></script>
  <!--===============================================================================================-->
  <script src="<?php echo base_url();?>assets/vendor/countdowntime/countdowntime.js"></script>
  <!--===============================================================================================-->
  <script src="<?php echo base_url();?>assets/dist/js/main.js"></script>
  <!--===============================================================================================-->
  <script src="<?php echo base_url();?>assets/dist/js/script.js"></script>

</body>

</html>