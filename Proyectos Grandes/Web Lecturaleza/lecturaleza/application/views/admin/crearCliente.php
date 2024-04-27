<?php 
$dataHeader['titulo'] = "Crear Cliente";
$this->load->view('layouts/header', $dataHeader); 
?>
<?php 
$dataSidebar['session'] = $session;
$this->load->view('layouts/sidebar', $dataSidebar); 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    
    <title>Crear Cliente</title>
</head>
<body>
    <!-- Content Wrapper. Contains page content -->
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
                    <b> - Cliente </b><br>
                    <b> - IMAGEN </b>
                </div>
            <?php endif ?>
            <!-- Este es para los datos correctos -->
            <?php if (isset($date_validos)): ?>
                <script>
                    Swal.fire({
                        title: 'DATOS VALIDOS',
                        text: 'El Cliente ha sido creado con éxito',
                        icon: 'success',
                    });
                </script>
            <?php endif ?>

            <div class="row justify-content-center">
                <form class="mx-auto" action="<?= base_url('index.php/admin/Inicio/crearClientes'); ?>" method="POST" enctype="multipart/form-data">
                    
                    <div class="card card-login">
                        <div  class="card-header card-header-primary ">
                            <h4 class=" text-center">Registrar Cliente</h4>
                        </div>
                    </div>  
                    
                    <div class="row mb-3">
                        <div class="col">
                            <label for="nuevo_cedula" class="form-label">
                                <i class="fas fa-id-card"></i> Cédula
                            </label>
                            <input type="text" class="form-control" id="nuevo_cedula" name="nuevo_cedula" value="">
                        </div>
                        <div class="col">
                            <label for="nuevo_nombres" class="form-label">
                                <i class="fas fa-id-card"></i> Nombres
                            </label>
                            <input type="text" class="form-control" id="nuevo_nombres" name="nuevo_nombres" value="">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col">
                            <label for="nuevo_apellidos" class="form-label">
                                <i class="fas fa-user"></i> Apellidos
                            </label>
                            <input type="text" class="form-control" id="nuevo_apellidos" name="nuevo_apellidos" value="">
                        </div>
                        <div class="col">
                            <label for="nuevo_telefono" class="form-label">
                                <i class="fas fa-phone"></i> Teléfono
                            </label>
                            <input type="text" class="form-control" id="nuevo_telefono" name="nuevo_telefono" value="">
                        </div>
                        
                    </div>

                    <div class="row mb-3">
                        <div class="col">
                            <label for="nuevo_email" class="form-label">
                                <i class="fas fa-envelope"></i> Email
                            </label>
                            <input type="email" class="form-control" id="nuevo_email" name="nuevo_email" value="">
                        </div>
                        <div class="col">
                            <label for="nuevo_password" class="form-label">
                                <i class="fas fa-lock"></i> Contraseña
                            </label>
                            <input type="password" class="form-control" id="nuevo_password" name="nuevo_password" value="">
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col">
                            <label for="nuevo_estado" class="form-label">
                                <i class="fas fa-toggle-on"></i> Estado
                            </label>
                            <select class="form-control" id="nuevo_estado" name="nuevo_estado" value="ACTIVO">
                                <option value="ACTIVO">ACTIVO</option>
                                <option value="INACTIVO">INACTIVO</option>
                            </select>
                        </div>
                        <div class="col">
                            <label for="nuevo_tipo" class="form-label">
                                <i class="fas fa-user"></i> Tipo
                            </label>
                            <select class="form-control" id="nuevo_tipo" name="nuevo_tipo" value="CLIENTE">
                                <option value="CLIENTE">CLIENTE</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <label for="nuevo_direccion" class="form-label">
                                <i class="fas fa-map-marker-alt"></i> Dirección
                            </label>
                            <input type="text" class="form-control" id="nuevo_direccion" name="nuevo_direccion" value="">
                        </div>
                    </div>

                    <div class="text-center">
                        <button type="submit" class="btn btn-primary" name="guardar">Registrar Cliente</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
</body>
<?php 
$this->load->view('layouts/footer'); 
?>
