<?php
   $dataHeader['titulo']= "modificar";
   $this->load->view('layouts/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= "session";
   $this->load->view('layouts/sidebar');
?>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">

      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper ">
        <div class="col-12 m-0 p-3">
            <h1 class="text-primary text-center">hora de editar pa</h1>
            <?php echo form_open(); ?>  
            <div class="container">
                <div class="form-group">
                    <?php 
                            $data = [
                                'name'      => 'cedula',
                                'value'     => $datos['cedula'],
                                'class'     => 'input-lg form-control ',
                                'readonly'     => 'true'
                            ];
                            echo form_input($data);
                        ?>
                </div>     
                <div class="form-group">
                    <?php 
                            $data = [
                                'name'      => 'nombres',
                                'value'     => $datos['nombres'],
                                'class'     => 'input-lg form-control',
                                
                            ];
                            echo form_input($data);
                        ?>
                </div>     
                <div class="form-group">
                    <?php 
                            $data = [
                                'name'      => 'apellidos',
                                'value'     => $datos['apellidos'],
                                'class'     => 'input-lg form-control ',
                                
                            ];
                            echo form_input($data);
                        ?>
                </div>       
                <div class="form-group">
                    <?php 
                            $data = [
                                'name'      => 'telefono',
                                'value'     => $datos['telefono'],
                                'class'     => 'input-lg form-control',
                                
                            ];
                            echo form_input($data);
                        ?>
                </div>       
                <div class="form-group">
                    <?php 
                            $data = [
                                'name'      => 'direccion',
                                'value'     => $datos['direccion'],
                                'class'     => 'input-lg form-control',
                                
                            ];
                            echo form_input($data);
                        ?>
                </div>       
                <div class="form-group">
                    <?php 
                            $data = [
                                'name'      => 'email',
                                'value'     => $datos['email'],
                                'class'     => 'input-lg form-control',
                                
                            ];
                            echo form_input($data);
                        ?>
                </div>
                <div class="form-group">
                    <?php 
                            $data = [
                                'name'      => 'foto',
                                'value'     => $datos['foto'],
                                'class'     => 'input-lg form-control',
                                'readonly'     => 'true'

                                
                            ];
                            echo form_input($data);
                        ?>
                </div>
           </div>       
                <?php echo form_submit('mysubmit', 'Enviar', "class='btn btn-primary'");?>
            <?php echo form_close(); ?> 
        </div>

        
      </div>

<?php
   
   $this->load->view('layouts/footer');
?>