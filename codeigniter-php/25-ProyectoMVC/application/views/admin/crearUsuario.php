<?php
   $dataHeader['titulo']= "Crear usuarios";
   $this->load->view('layouts/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= "session";
   $this->load->view('layouts/sidebar');
?>
   
      <!-- Content Wrapper. Contains page content -->
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
                          'name'      => 'nombre',
                          'value'     => '',
                          'class' => 'form-control input-lg',
                      ];
                      echo form_input($datas);
                  ?>
              </div>

              <div class="form-group">
                  <?php 
                      echo form_label('Apellido', 'apellido');
                      $datas = [
                          'name'  => 'apellido',
                          'value' => '',
                          'class' => 'form-control input-lg',
                      ];

                      echo form_input($datas);
                  ?>
              </div>

              <div class="form-group">
                  <?php 
                      echo form_label('Telefono', 'telefono');
                      $datas = [
                          'name'  => 'telefono',
                          'value' => '',
                          'class' => 'form-control input-lg',
                      ];

                      echo form_input($datas);
                  ?>
              </div>

              <div class="form-group">
                  <?php 
                      echo form_label('Direccion', 'direccion');
                      $datas = [
                          'name'  => 'direccion',
                          'value' => '',
                          'class' => 'form-control input-lg',
                      ];

                      echo form_input($datas);
                  ?>
              </div>
            

              <div class="form-group">
                  <?php 
                      echo form_label('Correo', 'correo');
                      $data1 = [
                          'name'  => 'correo',
                          'type'  => 'email',
                          'value' => '',
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
                          'name'  => 'contrasenia',
                          'type'  => 'password',
                          'class' => 'form-control input-lg',
                        
                      ];
                      echo form_input($data1);
                    ?>

              </div>

              <div class="form-group">
                      <?php 
                          echo form_label('Estado:', 'estado');
                      ?>
                      <br>
                      <?php
                      $data1 = [
                          'name'  => 'estado',
                          'value' => 'ACTIVO',
                          'class' => 'form-control input-lg',
                          'readonly' => 'true',
                        
                      ];
                      echo form_input($data1);
                    ?>

              </div>

              <div class="form-group">
                      <?php 
                          echo form_label('Foto:', 'foto');
                      ?>
                      <br>
                      <?php
                      $datas = [
                          'name'  => 'foto',
                          'value' => 'defaul.png',
                          'class' => 'form-control input-lg',
                          'readonly' => 'true',
                        
                      ];
                      echo form_input($datas);
                    ?>

              </div>

              <div class="form-group">
                  <?php 
                      echo form_label('Tipo de usuario', 'tipo');
                  ?>
                      <br>
                  <?php 
                      echo form_label('Administrador', 'tipo');
                  ?>
                      <input type="radio" name="tipo" value="ADMIN" <?= set_radio('myradio', '1' ) ?>>
                <?php 
                      echo form_label('Vendedor', 'femenino');
                  ?>
                      <input type="radio" name="tipo" value="VENDEDOR" <?= set_radio('myradio', '2') ?>>
                    <?php
                    $data1 = [
                      'name'    => 'tipo',
                      
                  ];
                
                  ?>
              </div>
              <?php echo form_submit('mysubmit', 'Enviar', "class='btn btn-primary'");?>

              <?php echo form_close(); ?>
           </div> 
      
       </div>

        </div>
      </div>

<?php
   
   $this->load->view('layouts/footer');
?>