<?php
$dataHeader['titulo'] = "Perfil Administrador";
$this->load->view('layouts/header', $dataHeader);
?>

<?php
$dataSidebar['session'] = $session;
$this->load->view('layouts/sidebar', $dataSidebar);
?>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
    <!-- este es para los datos correctos -->
    <?php if (isset($date_validos)): ?>
        <script>
          Swal.fire({
            title: 'DATOS VALIDOS',
            text: 'El Agricultor ha sido creado con éxito',
            icon: 'success',
          });
        </script>
    <?php endif ?>
    <!-- este es para los datos eliminados correctos -->
    <?php if (isset($estado_cambiado)): ?>
        <script>
            Swal.fire({
            title: 'DATOS ELIMINADOS',
            text: 'El Agricultor ha sido eliminado con éxito',
            icon: 'success',
            });
        </script>
    <?php endif ?>
    <!-- este es para los datos editados correctos -->
    <?php if (isset($date_editado)): ?>
        <script>
            Swal.fire({
            title: 'DATOS EDITADOS',
            text: 'El ADMIN ha sido editado con éxito',
            icon: 'success',
            });
        </script>
    <?php endif ?>
    <!-- este es para los datos eliminados correctos -->
    <?php if (isset($date_error)): ?>
        <script>
            Swal.fire({
            title: 'SERVIDOR ERROR',
            text: 'ERROR: Error en el Servidor',
            icon: 'danger',
            });
        </script>
    <?php endif ?>
    <?php if (isset($date_incompletos)): ?>
        <div class="mt-4 text-center alert alert-danger">
            Faltan datos por llenar
        </div>
    <?php endif ?>
    <?php if (isset($date_repetidos)): ?>
        <div class="mt-4 text-center alert alert-danger">
            Se presentaron datos repetidos:<br>
            <b> - CEDULA </b><br>
            <b> - TELEFONO </b>
        </div>
    <?php endif ?>
        <section class="content">
            <!-- Default box -->
            <div class="container-xl px-4 mt-4">
                <hr class="mt-0 mb-4">
                <div class="row mt-4">
                    
                    <div class="col-xl-4">
                        <!-- Profile picture card-->
                        <div class="card mb-4 mb-xl-0">
                            <div class="card-header card-perfil">Imagen de perfil</div>
                            <div class="card-body card-perfil-2 text-center">
                                <img class="profile-image rounded-circle mb-2" src="<?php echo base_url() . "/assets/dist/img/admins/" . $session['img']; ?>" alt="">
                                <div class="small font-italic text-muted mb-4">JPG o PNG maximo 5 MB</div>
                                
                                <form class="mx-auto" action="<?php echo base_url('index.php/admin/Inicio/subirImagen/' ) ; ?>" method="POST" enctype="multipart/form-data">
                                    <div class="col">
                                        <label for="new_imagen" class="form-label">
                                            <i class="fa-solid fa-file"></i> Seleccione una Imagen
                                        </label>
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" id="new_imagen" name="new_imagen" onchange="displayFileName()">
                                            <label class="custom-file-label" for="new_imagen" data-browse="Examinar">Elegir archivo</label>
                                        </div>
                                        <button class="btn btn-success mt-4" type="submit">Cargar nueva imagen</button>
                                    </div>
                                </form>
                                
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-8">
                        <!-- Account details card-->
                        <div class="card mb-4">
                            <div class="card-header card-perfil">Detalles del Admin</div>
                            <div class="card-body card-perfil-2">
                                <form action="<?php echo site_url('admin/inicio/guardarCambiosPerfil'); ?>" method="POST" >
                                    <input type="hidden" name="id_usuario" value="<?php echo isset($administrador->id_usuario) ? $administrador->id_usuario : ''; ?>">
                                    <div class="row gx-3 mb-3">
                                        <div class="col-md-6">
                                            <label class="small mb-1" for="inputNombres">Nombre</label>
                                            <input class="form-control" name="nombres" id="inputNombres" type="text" placeholder="Enter your first name" value="<?php echo $administrador->nombres; ?>" required>
                                        </div>
                                        
                                        <div class="col-md-6">
                                            <label class="small mb-1" for="inputApellidos">Apellido</label>
                                            <input class="form-control" name="apellidos" id="inputApellidos" type="text" placeholder="Enter your last name" value="<?php echo $administrador->apellidos; ?>">
                                        </div>
                                    </div>
                                    <!-- Form Row        -->
                                    <div class="row gx-3 mb-3">
                                        
                                        <div class="col-md-6">
                                            <label class="small mb-1" for="inputDocumento">Numero de documento</label>
                                            <input disabled class="form-control d-block" id="inputDocumento" type="text" placeholder="Enter your organization name" value="<?php echo $session['documento'];  ?>">
                                        </div>
                                        
                                        <div class="col-md-6">
                                            <label class="small mb-1" for="inputDireccion">Direccion</label>
                                            <input class="form-control" name="direccion" id="inputDireccion" type="text" placeholder="Enter your location" value="<?php echo $administrador->direccion; ?>">
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputEmail">Correo electronico</label>
                                        <input class="form-control" name="email" id="inputEmail" type="email" placeholder="Enter your email address" value="<?php echo $administrador->email; ?>">
                                    </div>
                                    <!-- Form Row-->
                                    <div class="row gx-3 mb-3">
                                        <div class="col-md-12">
                                            <label class="small mb-1" for="inputTelefono">Telefono</label>
                                            <input class="form-control" name="telefono" id="inputTelefono" type="tel" placeholder="Enter your phone number" value="<?php echo $administrador->telefono; ?>">
                                        </div>
                                        
                                    </div>
                                    <button class="btn btn-success" type="submit">Guardar cambios</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br>
        </section>

        <!-- /.content -->
    </div>
  <!-- /.content-wrapper -->

<?php
    $this->load->view('layouts/footer');
?>