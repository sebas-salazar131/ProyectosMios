<?php
$dataHeader['titulo'] = "Productos";
$this->load->view('layouts/header', $dataHeader);
?>

<?php
$dataSidebar['session'] = $session;
//    $dataSidebar['optionSelected'] = 'inicio';
$this->load->view('layouts/sidebar', $dataSidebar);
?>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper mt-2">
    <?php if (isset($img_error)): ?>
        <script>
            Swal.fire({
                title: 'IMAGEN ERROR',
                text: 'Solo se permite archivos jpg, gif, webp y png',
                icon: 'danger',
            });
        </script>
    <?php endif ?>
    <!-- este es para los datos correctos -->
    <?php if (isset($date_validos)): ?>
        <script>
            Swal.fire({
                title: 'DATOS VALIDOS',
                text: 'El Producto ha sido creado con éxito',
                icon: 'success',
            });
        </script>
    <?php endif ?>
    <!-- este es para los datos eliminados correctos -->
    <?php if (isset($estado_cambiado)): ?>
        <script>
            Swal.fire({
                title: 'DATO ELIMINADO',
                text: 'El Producto ha sido eliminado con éxito',
                icon: 'success',
            });
        </script>
    <?php endif ?>
    <!-- este es para los datos editados correctos -->
    <?php if (isset($date_editado)): ?>
        <script>
            Swal.fire({
                title: 'DATOS EDITADOS',
                text: 'El Producto ha sido editado con éxito',
                icon: 'success',
            });
        </script>
    <?php endif ?>
    <!-- este es para los datos eliminados correctos -->
    <?php if (isset($date_error)): ?>
        <script>
            Swal.fire({
                title: 'SERVER ERROR',
                text: 'ERROR: Ocurrio un error en el Servidor',
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
            <b> - NOMBRE PRODUCTO </b><br>
        </div>
    <?php endif ?>

    <!-- paginador -->
    <?php

    $productos_por_pagina = 6;

    $total_productos = count($productos);

    $total_paginas = ceil($total_productos / $productos_por_pagina);


    $pagina_actual = isset($_GET['page']) ? intval($_GET['page']) : 1;


    $inicio = ($pagina_actual - 1) * $productos_por_pagina;

    $productos = array_slice($productos, $inicio, $productos_por_pagina);
    ?>

    <!-- Main content -->
    <section class="content">
        <!-- Default box -->
        <div class="card card-solid">
            <div class="card-body pb-0">
                <div>
                    <form class="input-group mb-3" method="post"
                        action="<?php echo base_url('index.php/admin/Productos/buscarProducto'); ?>">
                        <input type="text" class="form-control" name="buscar" placeholder="Buscar Producto">
                        <button type="submit" class="btn btn-primary">Buscar</button>
                    </form>
                </div>
                <a href="<?= base_url('index.php/admin/inicio/openCreateProduct'); ?>"
                    class="btn btn-success btn-lg mb-4 ml-2 mt-2">Agregar Producto</a>
                <div class="row">
                    <!-- Dentro del bucle foreach para mostrar la información de cada usuario -->

                    <?php foreach ($productos as $producto): ?>
                        <div class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column">
                            <div class="card bg-light d-flex flex-fill">
                                <div class="card-header text-center border-bottom-0">
                                    <h2 class="lead"><b><?php echo $producto->nombre_producto; ?></b></h2>

                                </div>
                                <div class="card-body pt-0">
                                    <div class="row">
                                        <div class="col-7">
                                            <p class="text-muted text-sm"><b>Precio:
                                                </b><?php echo $producto->precio_venta; ?></p>
                                            <p class="text-muted text-sm"><b>Cantidad Disponible:
                                                </b><?php echo $producto->cantidad_disponible; ?></p>
                                            <p class="text-muted text-sm"><b>Fecha Vencimiento
                                                </b><?php echo $producto->fecha_vencimiento; ?></p>
                                            <p class="text-muted text-sm"><b>Tipo: </b><?php echo $producto->tipo; ?></p>
                                            <p class="text-muted text-sm"><b>Estado: </b><?php echo $producto->estado; ?>
                                            </p>
                                        </div>
                                        <div class="col-5 text-center">
                                            <?php
                                            if ($producto->img == null) {
                                                ?>
                                                <img src="<?php echo base_url(); ?><?php echo "/assets/distCliente/img/product/producto_sin_imagen.png" ?>"
                                                    alt="Producto sin foto" class="img-circle img-fluid">
                                                <?php
                                            } else {

                                                ?>

                                                <img src="<?php echo base_url(); ?><?php echo "/assets/distCliente/img/product/" . $producto->img ?>"
                                                    alt="Foto del producto" class="img-circle img-fluid">
                                                <?php
                                            }
                                            ?>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="text-right text-center">
                                        <a href="<?php echo site_url('admin/Productos/editarProductos/' . $producto->id_producto); ?>"
                                            class="btn btn-sm btn-success">
                                            <i class="fa-solid fa-pen-to-square"></i> Editar
                                        </a>
                                        <a href="<?php echo site_url('admin/Productos/cambiarEstadoProducto/' . $producto->id_producto); ?>"
                                            class="btn btn-sm btn-danger"
                                            onclick="return confirm('¿Estás seguro de que deseas eliminar este producto?');">
                                            <i class="fa-solid fa-ban"></i> Eliminar
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>

                </div>
            </div>
            <!-- Paginación -->
            <div class="card-footer">
                <nav aria-label="Contacts Page Navigation">
                    <ul class="pagination justify-content-center m-0">
                        <!-- Botón para la página anterior -->
                        <?php if ($pagina_actual > 1): ?>
                            <li class="page-item"><a class="page-link"
                                    href="?page=<?php echo ($pagina_actual - 1); ?>">Anterior</a></li>
                        <?php endif; ?>

                        <!-- Botones para páginas específicas -->
                        <?php for ($i = 1; $i <= $total_paginas; $i++): ?>
                            <li class="page-item <?php echo ($i === $pagina_actual) ? 'active' : ''; ?>"><a
                                    class="page-link" href="?page=<?php echo $i; ?>"><?php echo $i; ?></a></li>
                        <?php endfor; ?>

                        <!-- Botón para la página siguiente -->
                        <?php if ($pagina_actual < $total_paginas): ?>
                            <li class="page-item"><a class="page-link"
                                    href="?page=<?php echo ($pagina_actual + 1); ?>">Siguiente</a></li>
                        <?php endif; ?>
                    </ul>
                </nav>
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

<?php if ($this->session->flashdata('mensaje')): ?>
    <script>
        alert("<?php echo $this->session->flashdata('mensaje'); ?>");
    </script>
<?php endif; ?>