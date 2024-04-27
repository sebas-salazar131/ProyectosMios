
<?php
   $dataHeader['titulo']= "Cliente";
   $this->load->view('layouts/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= $session;
//    $dataSidebar['optionSelected'] = 'openLisFarmers';
   $this->load->view('layouts/sidebar', $dataSidebar);
?>

  <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <section class="content">
            <!-- Default box -->
            <div class="card card-solid">
                <div class="container-xl px-4 mt-4">
                    <div class="row">
                        <div class="col-xl-4">
                            <div class="card mb-4 mb-xl-0">
                                <div class="card-header">Imagen de perfil</div>
                                <div class="card-body text-center">
                                    <img class="img-circle img-fluid" src="<?php echo base_url();?>/assets/distCliente/img/clientes/<?php echo $Cliente->img  ?>" alt="Foto del Cliente">
                                    <!-- <div class="small font-italic text-muted mb-4">JPG o PNG máximo 5 MB</div>
                                    <button class="btn btn-success" type="button">Cargar nueva imagen</button> -->
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-8">
                            <div class="card mb-4">
                                <div class="card-header">Detalles del Cliente</div>
                                <div class="card-body">
                                    <form action="<?php echo site_url('admin/inicio/guardarCambiosCliente'); ?>" method="post">
                                    <input type="hidden" name="id_usuario" value="<?php echo isset($Cliente->id_usuario) ? $Cliente->id_usuario : ''; ?>">
                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputDocumento">Número de documento</label>
                                            <input class="form-control" id="inputDocumento" type="text" placeholder="Ingrese el número de documento" name="documento" value="<?php echo $Cliente->documento; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputNombres">Nombre</label>
                                            <input class="form-control" id="inputNombres" type="text" placeholder="Ingrese el nombre" name="nombres" value="<?php echo $Cliente->nombres; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputApellidos">Apellido</label>
                                            <input class="form-control" id="inputApellidos" type="text" placeholder="Ingrese el apellido" name="apellidos" value="<?php echo $Cliente->apellidos; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputEmail">Correo electrónico</label>
                                            <input class="form-control" id="inputEmail" type="email" placeholder="Ingrese el correo electrónico" name="email" value="<?php echo $Cliente->email; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputTelefono">Teléfono</label>
                                            <input class="form-control" id="inputTelefono" type="tel" placeholder="Ingrese el número de teléfono" name="telefono" value="<?php echo $Cliente->telefono; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputDireccion">Dirección</label>
                                            <input class="form-control" id="inputDireccion" type="text" placeholder="Ingrese la dirección" name="direccion" value="<?php echo $Cliente->direccion; ?>" required>
                                        </div>

                                        <!-- <div class="mb-3">
                                            <label class="small mb-1" for="inputEstado">Estado</label>
                                            <select class="form-select" id="inputEstado" name="estado" required>
                                                <option value="ACTIVO" <?php echo ($Cliente->estado == 'ACTIVO') ? 'selected' : ''; ?>>Activo</option>
                                                <option value="INACTIVO" <?php echo ($Cliente->estado == 'INACTIVO') ? 'selected' : ''; ?>>Inactivo</option>
                                            </select>
                                        </div> -->

                                        <button class="btn btn-success" type="submit">Guardar cambios</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <!-- /.card-footer -->
            </div>
            <!-- /.card -->
        </section>

        <!-- /.content -->
    </div>
  <!-- /.content-wrapper -->
  

  <?php
   $this->load->view('layouts/footer');
?>