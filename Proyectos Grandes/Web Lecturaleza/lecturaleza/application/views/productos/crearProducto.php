<?php 
  $dataHeader['titulo'] = "Crear Productos";
  $this->load->view('layouts/header', $dataHeader); 
?>
<?php 
  $dataSidebar['session'] = $session;
  $dataSidebar['optionSelected'] = 'openCreateUser';
  $this->load->view('layouts/sidebar', $dataSidebar); 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
</head>
<body>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <div class="col-12 m-0 p-3">

      <?php if (isset($dateIncompletos)): ?>
        <div class="mt-4 text-center alert alert-danger">
          Faltan datos por llenar
        </div>
      <?php endif ?>
      <?php if (isset($datosRepetidos)): ?>
        <div class="mt-4 text-center alert alert-danger">
          Se presentaron datos repetidos:<br>
          <b> - PRODUCTO </b><br>
          <b> - IMAGEN </b>
        </div>
      <?php endif ?>
      <!-- este es para los datos correctos -->
      <?php if (isset($date_validos)): ?>
        <script>
          Swal.fire({
            title: 'DATOS VALIDOS',
            text: 'El Producto ha sido creado con éxito',
            icon: 'success',
          });
        </script>
      <?php endif ?>

      <div class="row justify-content-center">
        <form class="mx-auto" action="<?= base_url('index.php/admin/Productos/createProduct'); ?>" method="POST" enctype="multipart/form-data">
          <div class="row mb-3">
            <div class="col">
              <label for="new_producto" class="form-label">
                <i class="fas fa-id-card"></i> Nombre Producto
              </label>
              <input type="text" class="form-control" id="new_producto" name="new_producto" value="">
            </div>
            <div class="col">
              <label for="new_precio" class="form-label">
                <i class="fas fa-user"></i> Precio Venta
              </label>
              <input type="number" class="form-control" id="new_precio" name="new_precio" value="">
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <label for="new_cantidad" class="form-label">
                <i class="fas fa-user"></i> Cantidad Disponible
              </label>
              <input type="number" class="form-control" id="new_cantidad" name="new_cantidad" value="">
            </div>
            <div class="col">
              <label for="new_descripcion" class="form-label">
                <i class="fas fa-phone"></i> Descripción
              </label>
              <input type="text" class="form-control" id="new_descripcion" name="new_descripcion" value="">
            </div>
          </div>

          <div class="row mb-3">
            <div class="col">
              <label for="new_fecha" class="form-label">
                <i class="fas fa-map-marker-alt"></i> Fecha Vencimiento
              </label>
              <input type="date" class="form-control" id="new_fecha" name="new_fecha" value="">
            </div>
            <div class="col">
              <label for="new_tipo" class="form-label">
                <i class="fas fa-user"></i> Tipo
              </label>
              <select class="form-control" id="new_tipo" name="new_tipo" value="VERDURA">
                <option value="VERDURA">VERDURA</option>
                <option value="FRUTA">FRUTA</option>
                <option value="SALSA">SALSA</option>
                <option value="LACTEOS">LACTEOS</option>
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
            <button type="submit" class="btn btn-primary" name="guardar">Create Product</button>
          </div>
        </form>
      </div>


    </div>
  </div>


</body>
<?php 
  $this->load->view('layouts/footer'); 
?>