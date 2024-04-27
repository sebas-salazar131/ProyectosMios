<?php
    $dataHeader['titulo']= "Mostrar usuarios";
    $this->load->view('layouts/header', $dataHeader);
?>

<?php
    $dataSidebar['session']= "session";
    $this->load->view('layouts/sidebar_cajero');
?>

<div class="content-wrapper">
    <div class="col-12 m-0 p-3">
            <h1 class="text-primary text-center">VER PERSONAS</h1>
        <form action="<?= base_url('index.php/Inicio/Mostrar')?>" method="POST">
            <div class="input-group">
                <input type="text" class="" name="buscador" placeholder="Buscar por cedula" aria-label="Buscar" aria-describedby="basic-addon2">
                <div class="input-group-append">
                    <button class="btn btn-primary" type="submit">Buscar</button>
                </div>
            </div>
        </form>
        <br>
        <?php
        if(isset($er)){
            echo "lol";
        }
        if(isset($buscador)){
            
            ?>
            <table class="table table-striped">
                <tr>
                    <th>Cedula</th>
                    <th>Nombres</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th>Tipo</th>
                    
                </tr>
                    <?php foreach($buscador as $busca): ?>
                    <tr>
                        <td><?php echo $busca['cedula']; ?></td>
                        <td><?php echo $busca['nombres']; ?></td>
                        <td><?php echo $busca['email']; ?></td>
                        <td><?php echo $busca['estado']; ?></td>
                         <td><?php echo $busca['tipo']; ?></td>


                    
                    </tr>
                <?php endforeach; ?>
                </table>
                <?php
        }else{
          
            echo "entro";
            ?>
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
                               
                            
                            </tr>
                          </thead>
                          <tbody>
                          <?php foreach($datos as $dato): ?>
                            <tr>
                                <td><?php echo $dato->cedula; ?></td>
                                <td><?php echo $dato->nombres; ?></td>
                                <td><?php echo $dato->email; ?></td>
                                <td><?php echo $dato->estado; ?></td>
                                <td><?php echo $dato->tipo; ?></td>

                                
                                
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
            <?php
        }
        ?>

    </div> 
</div>
<?php
    $this->load->view('layouts/footer');
?>
  