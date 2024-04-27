<?php
$dataHeader['titulo'] = "Administrador";
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
                text: 'El admin ha sido creado con éxito',
                icon: 'success',
            });
        </script>
    <?php endif ?>
    <!-- este es para los datos eliminados correctos -->
    <?php if (isset($estado_cambiado)): ?>
        <script>
            Swal.fire({
                title: 'ESTADO CAMBIADO',
                text: 'El ADMIN ha sido INHABILITADO exitosamente.',
                icon: 'success',
            });
        </script>
    <?php endif ?>
    <!-- este es para los datos editados correctos -->
    <?php if (isset($date_editado)): ?>
        <script>
            Swal.fire({
                title: 'DATOS EDITADOS',
                text: 'El admin ha sido editado con éxito.',
                icon: 'success',
            });
        </script>
    <?php endif ?>
    <!-- este es para los datos eliminados correctos -->
    <?php if (isset($date_error)): ?>
        <script>
            Swal.fire({
                title: 'ERROR',
                text: 'ERROR: modificar admin',
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
        </div>
    <?php endif ?>

    <!-- paginador -->
    <?php

    $administradores_por_pagina = 6;

    $total_administradores = count($administradores);

    $total_paginas = ceil($total_administradores / $administradores_por_pagina);


    $pagina_actual = isset($_GET['page']) ? intval($_GET['page']) : 1;


    $inicio = ($pagina_actual - 1) * $administradores_por_pagina;

    $administradores = array_slice($administradores, $inicio, $administradores_por_pagina);
    ?>


    <!-- Main content -->
    <section class="content">
        <!-- Default box -->
        <div class="card card-solid">
            <div class="card-body pb-0">
                <!-- Contador para llevar el registro de los administradores mostrados -->
                <?php $contador = 0; ?>
                <div>
                    <form class="input-group mb-3" method="post"
                        action="<?php echo base_url('index.php/admin/inicio/buscarAdministrador'); ?>">
                        <input type="text" class="form-control" name="buscar" placeholder="Buscar Administrador">
                        <button type="submit" class="btn btn-primary">Buscar</button>
                    </form>
                </div>
                <a href="<?= base_url('index.php/admin/Inicio/openCreateAdmin'); ?>"
                    class="btn btn-success btn-lg mb-4 ml-2 mt-2">Crear Administrador</a>

                <div class="row">
                    <!-- Dentro del bucle foreach para mostrar la información de cada usuario -->
                    <?php foreach ($administradores as $administrador): ?>
                        <?php $contador++; ?>
                        <div class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column">
                            <div class="card bg-light d-flex flex-fill">
                                <div class="card-header text-center border-bottom-0">
                                    <h2 class="lead">
                                        <b><?php echo $administrador->nombres . ' ' . $administrador->apellidos; ?></b>
                                    </h2>
                                </div>
                                <div class="card-body pt-0">
                                    <div class="row">
                                        <div class="col-7">
                                            <p class="text-muted text-sm"><b>Cédula:
                                                </b><?php echo $administrador->documento; ?></p>
                                            <p class="text-muted text-sm"><b>Dirección:
                                                </b><?php echo $administrador->direccion; ?></p>
                                            <p class="text-muted text-sm"><b>Télefono:
                                                </b><?php echo $administrador->telefono; ?></p>
                                            <p class="text-muted text-sm"><b>Email: </b><?php echo $administrador->email; ?>
                                            </p>
                                            <p class="text-muted text-sm"><b>Tipo: </b><?php echo $administrador->tipo; ?>
                                            </p>
                                            <!-- <p class="text-muted text-sm"><b>Estado: </b><?php echo $administrador->estado; ?></p> -->
                                        </div>
                                        <div class="col-5 text-center">
                                            <img src="<?php echo base_url(); ?>/assets/dist/img/avatar.png"
                                                alt="Foto del Administrador" class="img-circle img-fluid">
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <div class="text-right text-center">
                                        <a href="<?php echo site_url('admin/Inicio/editarAdministrador/' . $administrador->id_usuario); ?>"
                                            class="btn btn-sm btn-primary">
                                            <i class="fa-solid fa-pen-to-square"></i> Editar
                                        </a>
                                        <a href="<?php echo site_url('admin/Inicio/cambiarEstadoAdmin/' . $administrador->id_usuario); ?>"
                                            class="btn btn-sm btn-danger"
                                            onclick="return confirm('¿Estás seguro de que deseas eliminar este administrador?');">
                                            <i class="fa-solid fa-ban"></i> Eliminar
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <!-- /.card-body -->
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