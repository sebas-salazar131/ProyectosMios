
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
                                    <img class="img-account-profile rounded-circle mb-2" src="<?php echo base_url();?>/assets/dist/img/avatar.png" alt="Foto del Administrador">
                                    <div class="small font-italic text-muted mb-4">JPG o PNG máximo 5 MB</div>
                                    <button class="btn btn-success" type="button">Cargar nueva imagen</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-8">
                            <div class="card mb-4">
                                <div class="card-header">Detalles del Producto</div>
                                <div class="card-body">
                                    <form action="<?php echo site_url('admin/Productos/guardarCambiosProductos'); ?>" method="post">
                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputDocumento">Id Producto</label>
                                            <input class="form-control" id="inputDocumento" type="text" placeholder="Ingrese el número de documento" name="id_producto" value="<?php echo $producto->id_producto; ?>" disabled>
                                        </div>
                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputDocumento">Nombre producto</label>
                                            <input class="form-control" id="inputDocumento" type="text" placeholder="Ingrese nombre" name="nombre_producto" value="<?php echo $producto->nombre_producto; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputNombres">Precio venta</label>
                                            <input class="form-control" id="inputNombres" type="text" placeholder="precio venta" name="precio_venta" value="<?php echo $producto->precio_venta; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputApellidos">Cantidad Disponible</label>
                                            <input class="form-control" id="inputApellidos" type="text" placeholder="Ingrese cant_dis" name="cantidad_disponible" value="<?php echo $producto->cantidad_disponible; ?>" required>
                                        </div>

                                        

                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputTelefono">Descripcion</label>
                                            <input class="form-control" id="inputTelefono" type="tel" placeholder="Ingrese descripcion" name="descripcion" value="<?php echo $producto->descripcion; ?>" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputDireccion">Fecha Vencimiento</label>
                                            <input class="form-control" id="inputDireccion" type="text" placeholder="Ingrese fecha venc" name="fecha_vencimiento" value="<?php echo $producto->fecha_vencimiento; ?>" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputDireccion">Tipo</label>
                                            <input class="form-control" id="inputDireccion" type="file_data" placeholder="Ingrese la tipo" name="tipo" value="<?php echo $producto->tipo; ?>" required>
                                        </div>
                                        <div class="mb-3">
                                            <label class="small mb-1" for="inputDireccion">Foto</label>
                                            <input class="form-control" id="inputDireccion" type="file_data" placeholder="Ingrese la foto" name="foto" value="<?php echo $producto->foto; ?>" required>
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