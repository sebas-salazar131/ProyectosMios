<?php 
  $dataHeader['titulo'] = "Crear Agricultores";
  $this->load->view('layouts/header', $dataHeader); 
?>
  <?php 
    $dataSidebar['session'] = $session;
    // $dataSidebar['optionSelected'] = 'crearAgricultores';
    $this->load->view('layouts/sidebar', $dataSidebar); 
  ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    
    <title>Crear Agricultores</title>
</head>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper imagine">
    <div class="col-12 m-0 p-3">

      <?php if (isset($date_incompletos)): ?>
        <div class="mt-4 text-center alert alert-danger">
          Faltan datos por llenar
        </div>
      <?php endif ?>
      <?php if (isset($date_repetidos)): ?>
        <div class="mt-4 text-center alert alert-danger">
          Se presentaron datos repetidos:<br>
          <b> - CEDULA </b><br>
        </div>
      <?php endif ?>
      <!-- este es para los datos correctos -->
      <?php if (isset($date_validos)): ?>
        <script>
          Swal.fire({
            title: 'DATOS VALIDOS',
            text: 'EL AGRICULTOR ha sido creado con éxito',
            icon: 'success',
          });
        </script>
      <?php endif ?>

      <div class="row justify-content-center">
        <form class="mx-auto" action="<?= base_url('index.php/admin/Agricultor/createUsers'); ?>" method="POST" enctype="multipart/form-data">

          <div class="card card-login">
            <div  class="card-header card-header-primary ">
                <h4 class=" text-center">Registrar Agricultor</h4>
            </div>
          </div> 

          <div class="row mb-3">
            <div class="col">
              <label for="cedula" class="form-label">
                <i class="fas fa-id-card"></i> Cédula
              </label>
              <input type="number" class="form-control" id="cedula" name="cedula" value="">
            </div>
            <div class="col">
              <label for="nombre" class="form-label">
                <i class="fas fa-user"></i> Nombres
              </label>
              <input type="text" class="form-control" id="nombre" name="nombre" value="">
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <label for="apellido" class="form-label">
                <i class="fas fa-user"></i> Apellidos
              </label>
              <input type="text" class="form-control" id="apellido" name="apellido" value="">
            </div>
            <div class="col">
              <label for="telefono" class="form-label">
                <i class="fas fa-phone"></i> Teléfono
              </label>
              <input type="tel" class="form-control" id="telefono" name="telefono" value="">
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <label for="direccion" class="form-label">
                <i class="fas fa-map-marker-alt"></i> Dirección
              </label>
              <input type="text" class="form-control" id="direccion" name="direccion" value="">
            </div>
            <div class="col">
              <label for="estado" class="form-label">
                  <i class="fas fa-toggle-on"></i> Estado
              </label>
              <select class="form-control" id="estado" name="estado" value="ACTIVO">
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
              </select>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
                <label for="new_imagen" class="form-label">
                  <i class="fa-solid fa-file"></i> Seleccione una Imagen
                </label>
                <div class="custom-file">
                  <input type="file" class="custom-file-input" id="new_imagen" name="new_imagen">
                  <label class="custom-file-label" for="new_imagen" data-browse="Examinar">Elegir archivo</label>
                </div>
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary">REGISTRAR</button>
          </div>
        </form>
      </div>


    </div>
  </div>
<?php 
  $this->load->view('layouts/footer'); 
?>