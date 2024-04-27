<?php
$dataHeader['titulo'] = "Agricultores";

$this->load->view('layouts/header', $dataHeader);
?>

<?php
$dataSidebar['session'] = $session;
//    $dataSidebar['optionSelected'] = 'openLisFarmers';
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
                text: 'El Agricultor ha sido editado con éxito',
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
    <!-- paginador -->
    <?php

    $agricultores_por_pagina = 6;

    $total_agricultores = count($agricultores);

    $total_paginas = ceil($total_agricultores / $agricultores_por_pagina);


    $pagina_actual = isset($_GET['page']) ? intval($_GET['page']) : 1;


    $inicio = ($pagina_actual - 1) * $agricultores_por_pagina;

    $agricultores = array_slice($agricultores, $inicio, $agricultores_por_pagina);
    ?>
    <section class="content">
        <!-- Default box -->
        <div class="card card-solid">
            <div class="card-body pb-0">
                <div>
                    <form class="input-group mb-3" method="post"
                        action="<?php echo base_url('index.php/admin/Agricultor/buscarAgricultores'); ?>">
                        <input type="text" class="form-control" name="buscar" placeholder="Buscar agricultor">
                        <button type="submit" class="btn btn-primary">Buscar</button>
                    </form>
                </div>
                <a href="<?= base_url('index.php/admin/Agricultor/crearAgricultores'); ?>"
                    class="btn btn-success btn-lg mb-4 ml-2 mt-2">Crear Agricultor</a>
                <div class="row">
                    <!-- Dentro del bucle foreach para mostrar la información de cada agricultor -->
                    <?php foreach ($agricultores as $agricultor): ?>
                        <div class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column">
                            <div class="card bg-light d-flex flex-fill">
                                <div class="card-header text-center border-bottom-0">
                                    <h2 class="lead"><b><?php echo $agricultor->nombre . ' ' . $agricultor->apellido; ?></b>
                                    </h2>
                                </div>
                                <div class="card-body pt-0">
                                    <div class="row">
                                        <div class="col-7">
                                            <p class="text-muted text-sm"><b>Cédula: </b><?php echo $agricultor->cedula; ?>
                                            </p>
                                            <p class="text-muted text-sm"><b>Dirección:
                                                </b><?php echo $agricultor->direccion; ?></p>
                                            <p class="text-muted text-sm"><b>Teléfono:
                                                </b><?php echo $agricultor->telefono; ?></p>
                                            <p class="text-muted text-sm"><b>Estado: </b><?php echo $agricultor->estado; ?>
                                            </p>
                                        </div>
                                        <div class="col-5 text-center">
                                            <img src="<?php echo base_url(); ?>assets/dist/imgAgricultores/<?php echo $agricultor->foto ?>"
                                                alt="Foto del Agricultor" class="img-circle img-fluid">
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="text-center">

                                        <a href="<?php echo site_url('admin/Agricultor/editarAgricultor/' . $agricultor->cedula); ?>"
                                            class="btn btn-sm btn-primary">
                                            <i class="fa-solid fa-pen-to-square"></i> Editar
                                        </a>
                                        <a href="<?php echo site_url('admin/Agricultor/cambiarEstadoAgricultor/' . $agricultor->id_agricultor); ?>"
                                            class="btn btn-sm btn-danger"
                                            onclick="return confirm('¿Estás seguro de que deseas eliminar este agricultor?');">
                                            <i class="fa-solid fa-ban"></i> Eliminar
                                        </a>
                                        <a href="<?php echo site_url('admin/Agricultor/productosAgricultor/' . $agricultor->id_agricultor); ?>"
                                            class="btn btn-sm btn-warning">
                                            <i class="fa-solid fa-box"></i> Productos
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