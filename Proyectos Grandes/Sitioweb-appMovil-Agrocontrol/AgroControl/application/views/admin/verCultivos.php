<?php
 $dataHeader['titulo']="Ver Cultivos";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
<head>
  <link rel="stylesheet" href="<?= base_url('dist/css/css_usuarios.css') ?>">
</head>
    
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    


	<div class="col-12 m-0 p-3">
    <h1 class="text-primary text-center">TABLA CON LISTA DE CULTIVOS</h1>
    <button type="button" class="btn btn-primary rounded-pill">
      <a href="<?= base_url('index.php/admin/Inicio/crearCultivo') ?>" class="nav-link text-white">Crear nuevo cultivo  +</a>
    </button>
    <div class="row mt-3">
	    <?php foreach ($datos['registros'] as $key => $cultivo) { ?>
        <div class="col-md-4">
          <div class="card mb-4 blue-border-top">
            <div class="card-body">
              <div class="d-flex flex-column align-items-center">
                <img src="<?php echo base_url('/dist/img/sandia.png');?>" alt="Imagen" class="rounded-circle" width="150">
                
              </div>
              <div class="d-flex flex-column">
                <p class="card-text d-flex ml-3">
                  <span>Nombre:</span>
                  <span class="ml-auto" style="color: blue;"><?php echo $cultivo['nombre']; ?></span>
                </p>
                <p class="card-text d-flex ml-3">
                  <span>Descripcion:</span>
                  <span class="ml-auto" style="color: blue;"><?php echo $cultivo['descripcion']; ?></span>
                </p>
                <p class="card-text d-flex ml-3">
                  <span>Tipo:</span>
                  <span class="ml-auto" style="color: blue;"><?php echo $cultivo['tipo']; ?></span>
                </p>
              </div>
              <div class="mt-3">
			  <a href="<?= base_url('index.php/admin/Inicio/actualizarCultivo/'.$cultivo['id_cultivo']) ?>" class="btn btn-success col-12"><i class="fa-solid fa-pen"></i></a>
			  
              </div>
			  <div class="mt-3">
			  
			  <button type="button" class="btn btn-danger col-12" onclick="eliminarCultivo( <?php echo $cultivo['id_cultivo']?> ) "><i class="fa-solid fa-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      <?php } ?>
    </div>
  </div>
</div>



<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>
