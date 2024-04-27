<?php
$dataHeader['titulo'] = "Ver Usuarios";
$dataSide['session'] = $session;
$this->load->view('layouts/header', $dataHeader, FALSE);
$this->load->view('layouts/sidebar', $dataSide, FALSE);
?>
<head>
  <link rel="stylesheet" href="<?= base_url('dist/css/css_usuarios.css') ?>">
</head>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper mb-3" style="margin-bottom: 100px;"> <!-- Agrega un margen inferior -->
  <div class="col-12 m-0 p-3">
    <h1 class="text-primary text-center">TABLA CON LISTA DE USUARIOS</h1>
    <button type="button" class="btn btn-primary rounded-pill">
      <a href="<?= base_url('index.php/admin/Inicio/openCreateUser') ?>" class="nav-link text-white">Crear Usuario +</a>
    </button>
    <div class="row mt-3">
      <?php foreach ($datos['registros'] as $persona) { ?>
        <div class="col-md-4">
          <div class="card mb-4 blue-border-top">
            <div class="card-body">
              <div class="d-flex flex-column align-items-center">
                <img src="<?php echo base_url('/dist/img/default.png');?>" alt="Imagen de <?php echo $persona['nombre'] . ' ' . $persona['apellido']; ?>" class="rounded-circle" width="150">
                <h5 class="card-title flex-grow-1 mt-3 font-weight-bold"><?php echo $persona['nombre'] . ' ' . $persona['apellido']; ?></h5>
              </div>
              <div class="d-flex flex-column">
                <p class="card-text d-flex ml-3">
                  <span>Cedula:</span>
                  <span class="ml-auto" style="color: blue;"><?php echo $persona['cedula']; ?></span>
                </p>
                <p class="card-text d-flex ml-3">
                  <span>Telefono:</span>
                  <span class="ml-auto" style="color: blue;"><?php echo $persona['telefono']; ?></span>
                </p>
                <p class="card-text d-flex ml-3">
                  <span>Correo:</span>
                  <span class="ml-auto" style="color: blue;"><?php echo $persona['email']; ?></span>
                </p>
                <p class="card-text d-flex ml-3">
                  <span>Estado:</span>
                  <span class="font-weight-bold mx-auto"><?php echo $persona['estado']; ?></span>
                </p>
              </div>
              <div>
                <a href="<?= base_url('index.php/admin/Inicio/actualizarPersona/' . $persona['cedula']) ?>" class="btn btn-primary w-100">Editar</a>
              </div>
            </div>
          </div>
        </div>
      <?php } ?>
    </div>
  </div>
</div>
<br>
<?php $this->load->view('layouts/footer', $dataHeader, FALSE); ?>
