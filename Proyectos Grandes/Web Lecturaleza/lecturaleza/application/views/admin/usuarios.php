
<?php
   $dataHeader['titulo']= "Admin";
   $this->load->view('layouts/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= $session;
//    $dataSidebar['optionSelected'] = 'inicio';
   $this->load->view('layouts/sidebar', $dataSidebar);
?>

  <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <!-- Main content -->
        <section class="content">
            <!-- Default box -->
            <div class="card card-solid">
                <div class="card-body pb-0">
                    <div class="row">
                        <!-- Dentro del bucle foreach para mostrar la información de cada usuario -->
                        <?php foreach ($usuarios as $usuario): ?>
                            <div class="col-12 col-sm-6 col-md-4 d-flex align-items-stretch flex-column">
                                <div class="card bg-light d-flex flex-fill">
                                    <div class="card-header text-center border-bottom-0">
                                     <h2 class="lead"><b><?php echo $usuario->nombres . ' ' . $usuario->apellidos; ?></b></h2>
                                    </div>
                                    <div class="card-body pt-0">
                                        <div class="row">
                                            <div class="col-7">
                                              <p class="text-muted text-sm"><b>Cédula: </b><?php echo $usuario->documento; ?></p>
                                              <p class="text-muted text-sm"><b>Dirección: </b><?php echo $usuario->direccion; ?></p>
                                              <p class="text-muted text-sm"><b>Télefono </b><?php echo $usuario->telefono; ?></p>
                                              <p class="text-muted text-sm"><b>Tipo: </b><?php echo $usuario->tipo; ?></p>
                                              <p class="text-muted text-sm"><b>Estado: </b><?php echo $usuario->estado; ?></p>
                                            </div>
                                            <div class="col-5 text-center">
                                                <img src="<?php echo base_url();?>/assets/dist/img/avatar.png" alt="Foto del Administrador" class="img-circle img-fluid">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        <div class="text-right">
                                            <a href="#" class="btn btn-sm btn-success">
                                                <i class="fas fa-user"></i> Ver Perfil
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>

                    </div>
                </div>
                <!-- /.card-body -->
                <div class="card-footer">
                    <nav aria-label="Contacts Page Navigation">
                        <ul class="pagination justify-content-center m-0">
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item"><a class="page-link" href="#">4</a></li>
                            <li class="page-item"><a class="page-link" href="#">5</a></li>
                            <li class="page-item"><a class="page-link" href="#">6</a></li>
                            <li class="page-item"><a class="page-link" href="#">7</a></li>
                            <li class="page-item"><a class="page-link" href="#">8</a></li>
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