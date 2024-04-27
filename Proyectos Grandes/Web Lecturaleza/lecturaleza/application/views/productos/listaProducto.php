<?php 
  $dataHeader['titulo'] = "Lista Productos";
  $this->load->view('layouts/header', $dataHeader); 
?>
  <?php 
    $dataSidebar['session'] = $session;
    $dataSidebar['optionSelected'] = 'openListaProducto';
    $this->load->view('layouts/sidebar', $dataSidebar); 
  ?>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <div class="col-12 m-0 p-2 bg-white">
      <!-- <div class="row justify-content-end">
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalCrearProducto">CREAR PRODUCTO</button>
      </div> -->
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>PRODUCTO</th>
            <th>PRECIO</th>
            <th>CANTIDAD</th>
            <th>DESCRIPCION</th>
            <th>FECHA VENCIMIENTO</th>
            <th>TIPO</th>
            <th>IMAGEN</th>
            <!-- <th></th> -->
          </tr>
        </thead>
        <tbody id="tbodyProductos">
            
        </tbody>
      </table> 
    </div>
  </div>

  <div class="modal fade" id="modalCrearProducto">
    <div class="modal-dialog">
      <form id="formularioCrearProducto" action="#" method="POST" enctype="multipart/form-data">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">CREAR USUARIO</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            
            <label class="form-label" for="campo_producto">PRODUCTO:</label>
            <input id="campo_producto" class="form-control" type="text" required name="campo_producto">

            <label class="form-label" for="campo_precio">PRECIO:</label>
            <input id="campo_precio" class="form-control" type="number" required name="campo_precio">

            <label class="form-label" for="campo_cantidad">CANTIDAD:</label>
            <input id="campo_cantidad" class="form-control" type="number" required name="campo_cantidad">

            <label class="form-label" for="campo_descripcion">DESCRIPCION:</label>
            <input id="campo_descripcion" class="form-control" type="text" required name="campo_descripcion">

            <label class="form-label" for="campo_fecha">FECHA VENCIMIENTO:</label>
            <input id="campo_fecha" class="form-control" type="date" required name="campo_fecha">
            
            <label for="campo_tipo" class="form-label">
              TIPO
            </label>
            <select class="form-control" id="campo_tipo" name="campo_tipo" value="VERDURA">
              <option value="VERDURA">VERDURA</option>
              <option value="FRUTA">FRUTA</option>
              <option value="SALSA">SALSA</option>
              <option value="LACTEOS">LACTEOS</option>
            </select>

            <label for="campo_imagen" class="form-label">
              <i class="fa-solid fa-file"></i> SELECCIONE UNA IMAGEN
            </label>
            <div class="custom-file">
              <input type="file" class="custom-file-input" id="campo_imagen" name="campo_imagen">
              <label class="custom-file-label" for="campo_imagen" data-browse="Examinar">Elegir archivo</label>
            </div>
          </div>

          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-default" data-dismiss="modal">CERRAR</button>
            <button type="submit" class="btn btn-primary">REGISTRAR</button>
          </div>
        </div>
        <!-- /.modal-content -->
      </form>
    </div>
    <!-- /.modal-dialog -->
  </div>
  <script src="<?= base_url('dist/js/my_script.js') ?>"></script>
<?php 
  $this->load->view('layouts/footer'); 
?>
