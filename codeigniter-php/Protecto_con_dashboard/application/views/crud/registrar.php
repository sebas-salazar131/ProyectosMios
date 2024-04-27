<?php
    $dataHeader['titulo']= "Crear usuarios";
    $this->load->view('layouts/header', $dataHeader);
?>

<?php
    $dataSidebar['session']= "session";
    $this->load->view('layouts/sidebar');
?>

<div class="content-wrapper">
        <div class="col-12 m-0 p-3">
            <h1 class="text-primary text-center">FORMULARIO PARA CREAR USUARIO</h1>
            <?php echo form_open(); ?>
       
            <div class="container">
              <?php echo form_open(); ?>

              <div class="form-group">
              <?php 
                      echo form_label('Documento', 'documento');
                      $datas = [
                          'name'      => 'cedula',
                          'value'     => '',
                          'class' => 'form-control input-lg',
                      ];
                      echo form_input($datas);
                  ?>
              </div>

              <div class="form-group">
                  <?php 
                      echo form_label('Nombre', 'nombre');
                      $datas = [
                          'name'      => 'nombres',
                          'value'     => '',
                          'class' => 'form-control input-lg',
                      ];
                      echo form_input($datas);
                  ?>
              </div>

              

              <div class="form-group">
                  <?php 
                      echo form_label('Correo', 'correo');
                      $data1 = [
                          'name'  => 'email',
                          'type'  => 'email',
                          
                          'class' => 'form-control input-lg',
                      ];

                      echo form_input($data1);
                  ?>
              </div>
              <div class="form-group">
                      <?php 
                          echo form_label('Contrasenia:', 'contrasenia');
                      ?>
                      <br>
                      <?php
                      $data1 = [
                          'name'  => 'password',
                          'type'  => 'password',
                          'class' => 'form-control input-lg',
                        
                      ];
                      echo form_input($data1);
                    ?>

              </div>

            <div class="form-group mt-3">
                <?php 
                ?>

                    <div class="mr-2">
                <?php
                    echo form_label('Estado', 'tipo');
                    ?>
                    </div> 
                    <?php
                    $data = [
                        'Activo'  => 'Activo',
                        'Inactivo'  => 'Inactivo', 
                    ];
                    echo form_dropdown('shirts', $data, 'large', 'class="form-control"');
                ?>
            </div>

            <div class="form-group mt-3">
                <?php 
                ?>
                    <div class="mr-2">
                <?php
                    echo form_label('Tipo', 'tipo');
                    ?>
                    </div> 
                    <?php
                    $data = [
                        'ADMIN'  => 'ADMIN',
                        'CAJERO'  => 'CAJERO',  
                    ];
                    echo form_dropdown('shirts2', $data, 'large', 'class="form-control"');
                ?>
            </div>

              <?php echo form_submit('mysubmit', 'Enviar', "class='btn btn-primary'");?>

              <?php echo form_close(); ?>
            </div>
        </div>
</div>
<?php
    $this->load->view('layouts/footer');
?>