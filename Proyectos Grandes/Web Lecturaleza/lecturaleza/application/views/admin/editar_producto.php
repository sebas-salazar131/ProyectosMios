<?php
$dataHeader['titulo'] = "Editar Producto";
$this->load->view('layouts/header', $dataHeader);
?>

<?php
$dataSidebar['session'] = $session;
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
                                    <?php if ($producto && $producto->img != null) : ?>
                                        <img src="<?php echo base_url(); ?><?php echo "/assets/distCliente/img/product/" . $producto->img ?>" alt="Foto del producto" class="img-circle img-fluid">
                                    <?php else : ?>
                                        <img src="<?php echo base_url(); ?><?php echo "/assets/distCliente/img/product/producto_sin_imagen.png" ?>" alt="Producto sin foto" class="img-circle img-fluid">
                                    <?php endif; ?>
                                    <form class="mx-auto" action="<?php echo base_url().'index.php/admin/Productos/actualizarImagenProduct/'.$producto->id_producto; ?>" method="POST" enctype="multipart/form-data">
                                        <div class="col">
                                            <label for="new_imagen" class="form-label">
                                                <i class="fa-solid fa-file"></i> Seleccione una Imagen
                                            </label>
                                            <div class="custom-file">
                                                <input type="file" class="custom-file-input" id="new_imagen" name="new_imagen" value="<?php $producto -> img ?>">
                                                <label class="custom-file-label" for="new_imagen" data-browse="Examinar" value="<?php $producto -> img ?>">Elegir archivo</label>
                                            </div>
                                            <button class="btn btn-success mt-4" type="submit"   >Cargar nueva imagen</button>
                                        </div>
                                    </form>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-8">
                        <div class="card mb-4">
                            <div class="card-header">Detalles del Producto</div>
                            <div class="card-body">
                                <form action="<?php echo site_url('admin/Productos/guardarCambiosProductos'); ?>" method="post">
                                <input type="hidden" name="id_producto" value="<?php echo isset($producto->id_producto) ? $producto->id_producto : ''; ?>">
                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputNombreProducto">Nombre del Producto</label>
                                        <input class="form-control" id="inputNombreProducto" type="text" placeholder="Ingrese el nombre del producto" name="nombre_producto" value="<?php echo $producto->nombre_producto; ?>" required>
                                    </div>

                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputPrecioVenta">Precio de Venta</label>
                                        <input class="form-control" id="inputPrecioVenta" type="text" placeholder="Ingrese el precio de venta" name="precio_venta" value="<?php echo $producto->precio_venta; ?>" required>
                                    </div>

                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputCantidadDisponible">Cantidad Disponible</label>
                                        <input class="form-control" id="inputCantidadDisponible" type="text" placeholder="Ingrese la cantidad disponible" name="cantidad_disponible" value="<?php echo $producto->cantidad_disponible; ?>" required>
                                    </div>

                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputDescripcion">Descripción</label>
                                        <textarea class="form-control" id="inputDescripcion" placeholder="Ingrese la descripción" name="descripcion" required><?php echo $producto->descripcion; ?></textarea>
                                    </div>

                                    <div class="mb-3">
                                        <label class="small mb-1" for="inputFechaVencimiento">Fecha de Vencimiento</label>
                                        <input class="form-control" id="inputFechaVencimiento" type="text" placeholder="Ingrese la fecha de vencimiento" name="fecha_vencimiento" value="<?php echo $producto->fecha_vencimiento; ?>" required>
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
