<?php 
  $dataHeader['titulo'] = "Crear Usuarios";
  $this->load->view('layouts/header', $dataHeader); 
?>
  <?php 
    $dataSidebar['session'] = $session;
    $dataSidebar['optionSelected'] = 'openCrudAjax';
    $this->load->view('layouts/sidebar', $dataSidebar); 
  ?>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">

    <div class="col-12 m-0 p-2 bg-white">
      <div class="row justify-content-end">
         <button class="col-auto btn btn-primary " data-toggle="modal" data-target="#modal-default" >Crear Usuario</button>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>CEDULA</th>
            <th>NOMBRES</th>
            <th>APELLIDOS</th>
            <th>TELEFONO</th>
            <th>DIRECCION</th>
            <th>CORREO</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="tbodyPersonas">
          
        </tbody>
      </table> 
    </div>
  </div>
  <!-- Modal -->
  <div class="modal fade" id="modal-default">
      <div class="modal-dialog">
        <form id="formularioCrearUsuario" action="#" method="POST" >
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Crear Usuario </h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">

              <label class="form-label" for="campo_cedula">CEDULA</label>
              <input type="number" id="campo_cedula" class="form-control" name="campo_cedula" required>

              <label class="form-label" for="campo_nombres">NOMBRES</label>
              <input type="text" id="campo_nombres" class="form-control" name="campo_nombres" required>

              <label class="form-label" for="campo_apellidos">APELLIDOS</label>
              <input type="text" id="campo_apellidos" class="form-control" name="campo_apellidos" required>

              <label class="form-label" for="campo_telefono">TELEFONO</label>
              <input type="text" id="campo_telefono" class="form-control" name="campo_telefono" required>

              <label class="form-label" for="campo_direccion">DIRECCION</label>
              <input type="text" id="campo_direccion" class="form-control" name="campo_direccion" required>

              <label class="form-label" for="campo_email">CORREO</label>
              <input type="text" id="campo_email" class="form-control" name="campo_email">
              <br>
              <label class="form-label" for="campo_tipo">TIPO</label>
              <select name="campo_tipo" id="campo_tipo" class="form-control">
                  <option value="ADMIN">ADMIN</option>
                  <option value="VENDEDOR">VENDEDOR</option>
              </select>
              
            </div>
            <div class="modal-footer justify-content-between">
              <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </form>
        
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
  </div>

  <script src="<?= base_url('dist/js/my_script.js') ?>"></script>
<?php 
  $this->load->view('layouts/footer'); 
?>