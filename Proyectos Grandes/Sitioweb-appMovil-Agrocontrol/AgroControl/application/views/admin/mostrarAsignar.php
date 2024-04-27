<?php
 $dataHeader['titulo']="Asignar Tarea";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
    
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <div class="col-12 m-0 p-3">
        <h1 class="text-primary text-center">Asignacion de Tareas</h1>

        
      
        <div class="row">
            <?php foreach ($datos['registros'] as $key => $cultivo) { ?>
                <div class="col-md-4 mb-4">
                    <div class="card">
                        
                        <div class="card-body">
                            <h5 class="card-title"><?php echo $cultivo['nombre']; ?></h5>
                            <p class="card-text"><?php echo $cultivo['descripcion']; ?></p>
                            <p><?php echo $cultivo['id_cultivo'] ?></p>
                            <a href="<?= base_url('index.php/admin/Inicio/asignarTarea/'.$cultivo['id_cultivo']) ?>" class="btn btn-primary">ASIGNAR TAREAS</a>
                            
                        </div>
                    </div>
                </div>
            <?php } ?>
        </div>
    </div>


    
</div>


<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>