
<?php
   $dataHeader['titulo']= "Agricultor";
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
                                    <img class="img-account-profile rounded-circle mb-2" src="<?php echo base_url();?>assets/dist/imgAgricultores/<?php echo $agricultor->foto?>" alt="Foto agricultor" style="max-width: 100%; max-height: 400px;">
                                    <form class="mx-auto" action="<?php echo base_url().'index.php/admin/Agricultor/actualizarImagenAgri/'.$agricultor->cedula; ?>" method="POST" enctype="multipart/form-data">
                                        <div class="col">
                                            <label for="new_imagen" class="form-label">
                                                <i class="fa-solid fa-file"></i> Seleccione una Imagen
                                            </label>
                                            <div class="custom-file">
                                                <input type="file" class="custom-file-input" id="new_imagen" name="new_imagen">
                                                <label class="custom-file-label" for="new_imagen" data-browse="Examinar">Elegir archivo</label>
                                            </div>
                                            <button class="btn btn-success mt-4" type="submit"   >Cargar nueva imagen</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-8">
                            <div class="card mb-4">
                                <div class="card-header">Detalles del Administrador</div>
                                <div class="card-body">
                                    <form action="<?php echo base_url('index.php/admin/Agricultor/guardarCambiosAgricultor'); ?>" method="POST">
                                        <div class="mb-3">
                                            <label class="small mb-1" for="documento">Número de documento</label>
                                            <input class="form-control" id="documento" type="text" placeholder="Ingrese el número de documento" name="documento" value="<?php echo $agricultor->cedula; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="nombre">Nombre</label>
                                            <input class="form-control" id="nombre" type="text" placeholder="Ingrese el nombre" name="nombre" value="<?php echo $agricultor->nombre; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="apellido">Apellido</label>
                                            <input class="form-control" id="apellido" type="text" placeholder="Ingrese el apellido" name="apellido" value="<?php echo $agricultor->apellido; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="direccion">Dirección</label>
                                            <input class="form-control" id="direccion" type="text" placeholder="Ingrese la dirección" name="direccion" value="<?php echo $agricultor->direccion; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="telefono">Teléfono</label>
                                            <input class="form-control" id="telefono" type="tel" placeholder="Ingrese el número de teléfono" name="telefono" value="<?php echo $agricultor->telefono; ?>" required>
                                        </div>
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