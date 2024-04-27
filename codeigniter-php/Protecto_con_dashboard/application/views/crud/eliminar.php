<?php
    $dataHeader['titulo']= "Eliminar Usuarios";
    $this->load->view('layouts/header', $dataHeader);
?>

<?php
    $dataSidebar['session']= "session";
    $this->load->view('layouts/sidebar');
?>

<div class="content-wrapper">
    <div class="col-12 m-0 p-3">
            <h1 class="text-primary text-center">Eliminar PERSONAS</h1>
            <section class="content">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-12">
                    <div class="card">
                      <div class="card-header">
                        <h3 class="card-title">DataTable with default features</h3>
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
                                <th>boton</th>
                            
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
      
