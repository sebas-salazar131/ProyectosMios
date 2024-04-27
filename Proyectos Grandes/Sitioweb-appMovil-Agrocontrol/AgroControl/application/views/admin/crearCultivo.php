<?php
$dataHeader['titulo'] = "Ver Usuarios";
$dataSide['session'] = $session;
$this->load->view('layouts/header', $dataHeader, FALSE);
$this->load->view('layouts/sidebar', $dataSide, FALSE);
?>

<div class="content-wrapper">
  <div class="col-12 m-0 p-3">
    <h1 class="text-success text-center mb-5">Registrar Cultivo</h1>
    <div class="container bg-light p-4 rounded">
      <div class="col-md-8 mx-auto">
        <form id="registroCultivo" action="#" method="post">
          <div class="form-group">
            <label for="nombre" class="text-success">Nombre del cultivo</label>
            <input class="form-control" type="text" placeholder="Ingrese el nombre del cultivo" id="nombre" name="nombre">
          </div>

          <div class="form-group">
            <label for="descripcion" class="text-success">Descripción</label>
            <textarea id="descripcion" name="descripcion" rows="4" cols="50" class="form-control"></textarea>
          </div>
                    
          <div class="form-group">
            <label for="tipo" class="text-success">Tipo</label>
            <select name="tipo" id="tipo" class="form-control">
              <option value="VERDURAS">VERDURAS</option>
              <option value="FRUTAS">FRUTAS</option>
              <option value="GRANOS">GRANOS</option>
            </select>
          </div>

          <div class="form-group">
            <label for="new_imagen" class="text-success">
              <i class="fa-solid fa-file"></i> Seleccione una Imagen
            </label>
            <div class="input-group">
              <div class="custom-file">
                <input type="file" class="custom-file-input" id="new_imagen" name="new_imagen">
                <label class="custom-file-label" for="new_imagen" data-browse="Examinar">Elegir archivo</label>
              </div>
            </div>
            <small id="imagenHelp" class="form-text text-muted font-weight-bold">Formatos: JPG, PNG, WEB. Tamaño máximo: 2MB</small>
          </div>

          <button type="submit" class="btn btn-success btn-block">Registrar</button>
        </form>
      </div>
    </div> 
  </div> 
</div>

<?php $this->load->view('layouts/footer', $dataHeader, FALSE); ?>

<script>
  document.getElementById('new_imagen').addEventListener('change', function() {
    var fileName = this.files[0].name;
    var label = document.querySelector('.custom-file-label');
    label.textContent = fileName;
  });
</script>