<!DOCTYPE html>
<html lang="zxx">

<head>
  <meta charset="UTF-8">
  <meta name="description" content="Ogani Template">
  <meta name="keywords" content="Ogani, unica, creative, html">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Registrarse</title>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" type="text/css" href="<?php echo base_url(); ?>assets/dist/css/style_registro.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" rel="stylesheet">

</head>

<body class="bg-secondary p-2 text-white bg-opacity-50">
  <div class="content-wrapper">
    <div class="col-12 m-0 p-3">

      <?php if (isset($dateIncompletos)): ?>
        <div class="mt-4 text-center alert alert-danger">
          Faltan datos por llenar
        </div>
      <?php endif ?>
      <?php if (isset($datosRepetidos)): ?>
        <div class="mt-4 text-center alert alert-danger">
          Se presentaron datos repetidos:<br>
          <b> - CEDULA </b><br>
          <b> - CORREO </b>
        </div>
      <?php endif ?>
      <!-- este es para los datos correctos -->
      <?php if (isset($date_validos)): ?>
        <script>
          Swal.fire({
            title: 'DATOS VALIDOS',
            text: 'EL usuario ha sido registrado con éxito',
            icon: 'success',
          });
        </script>
      <?php endif ?>
      <div class="container">
    <div class="contact__wrapper shadow-lg mt-n9">
        <div class="row no-gutters">
            <div class="col-lg-5 contact-info__wrapper gradient-brand-color p-5 order-lg-2">
                <h3 class="color--white mb-5">Ponerse en contacto</h3>
    
                <ul class="contact-info__list list-style--none position-relative z-index-101">
                    <li class="mb-4 pl-4">
                        <span class="position-absolute"><i class="fas fa-envelope"></i></span> lecturaleza@gmail.com
                    </li>
                    <li class="mb-4 pl-4">
                        <span class="position-absolute"><i class="fas fa-phone"></i></span> 3137998630
                    </li>
                    <li class="mb-4 pl-4">
                        <span class="position-absolute"><i class="fas fa-map-marker-alt"></i></span> Centro de pereira
                        <br> Sede SENA
                        <br> Carrera 8a No 26-79
    
                        <div class="mt-3">
                            <a href="https://www.google.com/maps" target="_blank" class="text-link link--right-icon text-white">Direccion Exacta <i class="link__icon fa fa-directions"></i></a>
                        </div>
                    </li>
                </ul>
    
                <figure class="figure position-absolute m-0 opacity-06 z-index-100" style="bottom:0; right: 10px">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="444px" height="626px">
                        <defs>
                            <linearGradient id="PSgrad_1" x1="0%" x2="81.915%" y1="57.358%" y2="0%">
                                <stop offset="0%" stop-color="rgb(255,255,255)" stop-opacity="1"></stop>
                                <stop offset="100%" stop-color="rgb(0,54,207)" stop-opacity="0"></stop>
                            </linearGradient>
    
                        </defs>
                        <path fill-rule="evenodd" opacity="0.302" fill="rgb(72, 155, 248)" d="M816.210,-41.714 L968.999,111.158 L-197.210,1277.998 L-349.998,1125.127 L816.210,-41.714 Z"></path>
                        <path fill="url(#PSgrad_1)" d="M816.210,-41.714 L968.999,111.158 L-197.210,1277.998 L-349.998,1125.127 L816.210,-41.714 Z"></path>
                    </svg>
                </figure>
            </div>
    
            <div class="col-lg-7 contact-form__wrapper p-5 order-lg-1">
                <form class="contact-form form-validate" action="<?php echo base_url('index.php/SinLog/registrarUsuarioo');?>" method="POST" novalidate="novalidate">
                    <div class="row">
                        <div class="col-sm-6 mb-3">
                            <div class="form-group">
                                <label class="required-field" for="documento">Documento</label>
                                <input type="text" class="form-control" id="documento" name="documento" placeholder="Documento">
                            </div>
                        </div>
    
                        <div class="col-sm-6 mb-3">
                            <div class="form-group">
                                <label for="Nombres">Nombres</label>
                                <input type="text" class="form-control" id="nombres" name="nombres" placeholder="Nombres">
                            </div>
                        </div>
    
                        <div class="col-sm-6 mb-3">
                            <div class="form-group">
                                <label class="required-field" for="Apellidos">Apellidos</label>
                                <input type="text" class="form-control" id="apellidos" name="apellidos" placeholder="Apellidos">
                            </div>
                        </div>
    
                        <div class="col-sm-6 mb-3">
                            <div class="form-group">
                                <label for="email">Correo</label>
                                <input type="tel" class="form-control" id="email" name="email" placeholder="Correo">
                            </div>
                        </div>
    
                        <div class="col-sm-6 mb-3">
                            <div class="form-group">
                                <label for="contraseña">Contraseña</label>
                                <input type="tel" class="form-control" id="password" name="password" placeholder="Contraseña">
                            </div>
                        </div>

                        <div class="col-sm-6 mb-3">
                            <div class="form-group">
                                <label for="direccion">Direccion</label>
                                <input type="tel" class="form-control" id="direccion" name="nuevo_direccion" placeholder="Direccion">
                            </div>
                        </div>
                        
                        <div class="col-sm-12 mb-3">
                            <div class="form-group">
                                <label for="telefono">Telefono</label>
                                <input type="tel" class="form-control" id="telefono" name="telefono"  placeholder="Telefono">
                            </div>
                        </div>
                        <div class="text-center mt-4">
                        <a href="<?php echo base_url('index.php/SinLog/registrarUsuarioo');?>" type="submit" class="btn btn-danger" >Cancelar</a>
                        <button type="submit"  class="btn btn-success"  >Enviar</button>
                      </div>
    
                    </div>
                </form>
            </div>
            <!-- End Contact Form Wrapper -->
    
        </div>
    </div>
</div>
</body>

</html>
