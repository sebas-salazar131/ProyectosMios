<?php 
  $dataHeader['titulo'] = "Eliminar Usuarios";
  $this->load->view('layouts/header', $dataHeader); 
?>
<?php 
  $dataSidebar['session'] = $session;
  $dataSidebar['optionSelected'] = 'openDeleteUser';
  $this->load->view('layouts/sidebar', $dataSidebar); 
?>
<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
  <div class="col-12 m-0 p-3">
    <h1 class="text-primary text-center">FORMULARIO PARA BUSCAR Y ELIMINAR PRODUCTO</h1>

    <form action="<?= base_url('index.php/admin/Productos/eliminarProducto') ?>" method="post">
      <div class="form-group">
        <label for="producto_id">ID del Producto:</label>
        <input type="text" class="form-control" id="producto_id" name="producto_id" required>
      </div>
      <button type="submit" class="btn btn-primary">ELIMINAR</button>
    </form>

    <?php if (isset($producto)): ?>
      <h2>Información del Producto</h2>
      <p>ID: <?= $producto->id_producto ?></p>
      <p>Nombre: <?= $producto->nombre_producto ?></p>
      <button type="submit" class="btn btn-danger">Eliminar Producto</button>
    <?php endif; ?>
  </div>
</div>
<?php $this->load->view('layouts/footer'); ?>
