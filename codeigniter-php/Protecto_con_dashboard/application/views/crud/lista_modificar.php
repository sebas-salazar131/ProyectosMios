<?php
    $dataHeader['titulo']= "Modificar Usuarios";
    $this->load->view('layouts/header', $dataHeader);
?>

<?php
    $dataSidebar['session']= "session";
    $this->load->view('layouts/sidebar');
?>

<div class="content-wrapper">
    <div class="col-12 m-0 p-3">
            <h1 class="text-primary text-center">VER PERSONAS</h1>

            <section class="content">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-12">
                    <div class="card">
                      <div class="card-header">
                        <h3 class="card-title">DataTable with default features</h3>
                        <a href="<?= base_url('index.php/Inicio/registrar') ?>" class="nav-link">
                            <i class="far fa-plus-square"></i>
                            <p><button class="btn btn-primary">Registrar Usuario</button> </p>
                        </a>
                      </div>
                      <!-- /.card-header -->
                      <div class="card-body">
                        <table id="example1" class="table table-bordered table-striped">
                          <thead>
                          <tr>
                                <th>Cedula</th>
                                <th>Nombres</th>
                                <th>Email</th>
                                <th>Estado</th>
                                <th>Tipo</th>
                                <th>accion 1</th>
                                <th>accion 2</th>
                                
                            
                            </tr>
                          </thead>
                          <tbody>
                          <?php foreach ($datos as $dato): ?>
                                <tr>
                                    <td><?php echo $dato->cedula; ?></td>
                                    <td><?php echo $dato->nombres; ?></td>
                                    <td><?php echo $dato->email; ?></td>
                                    <td><?php echo $dato->estado; ?></td>
                                    <td><?php echo $dato->tipo; ?></td>
                                    <td><a href="<?php echo base_url('index.php/Inicio/Modificar/' . $dato->cedula ); ?>"><button class="btn btn-primary">Modificar</button></a></td>
                                    <td><a href="<?php echo base_url('index.php/Inicio/Eliminar/' . $dato->cedula ); ?>"><button class="btn btn-danger">Eliminar</button></a></td>

                                
                                </tr>
                            <?php endforeach; ?>
                          </tbody>
                          <tfoot>
                          <tr>
                            <th>Rendering engine</th>
                            <th>Browser</th>
                            <th>Platform(s)</th>
                            <th>Engine version</th>
                            <th>CSS grade</th>
                            <th>f</th>
                            <th>f</th>
                          </tr>
                          </tfoot>
                        </table>
                      </div>
                      <!-- /.card-body -->
                    </div>
                  </div>
                </div>
              </div>
            </section>
    </div> 
</div>
<?php
    $this->load->view('layouts/footer');
?>

        