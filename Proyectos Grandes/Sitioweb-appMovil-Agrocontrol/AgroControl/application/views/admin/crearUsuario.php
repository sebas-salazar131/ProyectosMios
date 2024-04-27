<?php
$dataHeader['titulo'] = "Ver Usuarios";
$dataSide['session'] = $session;
$this->load->view('layouts/header', $dataHeader, FALSE);
$this->load->view('layouts/sidebar', $dataSide, FALSE);
?>

<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper d-flex justify-content-center align-items-center">
  <div class="col-md-8">
    <div class="p-4 bg-light text-success rounded shadow-sm">
      <h1 class="text-center text-success">FORMULARIO:</h1>
      <h1 class="text-center mb-4 text-success">CREAR USUARIO</h1>
      <form id="registroForm" action="#" method="post">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="cedula" class="text-success">Cédula</label>
              <input class="form-control" type="text" placeholder="Ingrese la cédula" id="cedula" name="cedula">
            </div>

            <div class="form-group">
              <label for="nombre" class="text-success">Nombre</label>
              <input class="form-control" type="text" placeholder="Ingrese el nombre" id="nombre" name="nombre">
            </div>

            <div class="form-group">
              <label for="correo" class="text-success">Correo</label>
              <input class="form-control" type="text" placeholder="Ingrese el correo" id="email" name="email">
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label for="apellido" class="text-success">Apellido</label>
              <input class="form-control" type="text" placeholder="Ingrese el apellido" id="apellido" name="apellido">
            </div>

            <div class="form-group">
              <label for="pass" class="text-success">Contraseña</label>
              <input class="form-control" type="password" placeholder="Ingrese la contraseña" id="pass" name="pass">
            </div>

            <div class="form-group">
              <label for="telefono" class="text-success">Teléfono</label>
              <input class="form-control" type="text" placeholder="Ingrese el teléfono" id="telefono" name="telefono">
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="new_imagen" class="form-label text-success">
            <i class="fa-regular fa-image"></i> Seleccione una Imagen
          </label>
          <div class="input-group">
            <div class="custom-file">
              <input type="file" class="custom-file-input" id="new_imagen" name="new_imagen">
              <label class="custom-file-label" for="new_imagen" data-browse="Examinar">Elegir archivo</label>
            </div>
          </div>
          <small id="imagenHelp" class="form-text font-weight-bold">Formatos: JPG, PNG, WEB. Tamaño máximo: 2MB</small>
        </div>

        <button type="submit" class="btn btn-success btn-block">Registrar</button>
      </form>
    </div>
  </div>
</div>

<?php $this->load->view('layouts/footer', $dataHeader, FALSE); ?>

<script>
  // Mostrar el nombre del archivo seleccionado en el campo de entrada de archivos
  document.getElementById('new_imagen').addEventListener('change', function() {
    var fileName = this.files[0].name;
    var label = document.querySelector('.custom-file-label');
    label.textContent = fileName;
  });
</script>
