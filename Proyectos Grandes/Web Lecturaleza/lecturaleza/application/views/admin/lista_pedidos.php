<?php
   $dataHeader['titulo']= "pedidos";
   
   $this->load->view('layouts/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= $session;
//    $dataSidebar['optionSelected'] = 'openLisFarmers';
   $this->load->view('layouts/sidebar', $dataSidebar);
?>


  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>DataTables</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">DataTables</li>
            </ol>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">DataTable with default features</h3>
              </div>
              <!-- /.card-header -->
              <div class="card-body">
                <table id="example1" class="table table-bordered table-striped">

								<thead>
                      <tr>
                      <th scope="col">ID PEDIDO</th>
                      <th scope="col">NOMBRE USUARIO</th>
                      <th scope="col">FECHA</th>
                      <th scope="col">ESTADO</th>
                      <th scope="col">VER</th>
                      <th scope="col">CONCTACTAR</th>
                      <th scope="col">CANCELAR PEDIDO</th>
                      </tr>
                  </thead>
                  <tbody>
                      <?php $idPedido = null ?>
                      <?php $total=0; ?>
                      <?php foreach($pedidos as $key => $PedidosModel) : ?>
                       <?php if($PedidosModel->id_pedido != $idPedido): ?>
                          <tr>
                          <td><?php echo $PedidosModel->id_pedido ?></td>
                          <td><?php echo $PedidosModel->nombres_usuario." ". $PedidosModel->apellidos_usuario ?></td>
                          <td><?php echo $PedidosModel->fecha ?></td>
                          <td> 
                            <select class="form-control estado-select"
                                    data-id-pedido="<?php echo $PedidosModel->id_pedido ?>" 
                                    data-id-usuario="<?php echo $PedidosModel->id_usuario ?>" 
                                    data-url="<?php echo site_url('admin/inicio/actualizarEstadoPedido'); ?>" 
                                    data-url-registrar="<?php echo site_url('admin/inicio/registrarFactura'); ?>">
                                    <?php if ($PedidosModel->estado == 'EN PROCESO') : ?>
                                        <option value="EN PROCESO" data-estado-anterior="EN PROCESO" selected>EN PROCESO</option>
                                        <option value="COMPRADO" data-estado-anterior="EN PROCESO">COMPRADO</option>
                                    <?php elseif ($PedidosModel->estado == 'COMPRADO') : ?>
                                        <option value="EN PROCESO" data-estado-anterior="COMPRADO">EN PROCESO</option>
                                        <option value="COMPRADO" data-estado-anterior="COMPRADO" selected>COMPRADO</option>
                                    <?php endif; ?>
                                </select>
                        </td>
                          <td>
                          <a href="#" class="btn btn-outline-primary ver-detalle" 
                            data-pedido-id="<?php echo $PedidosModel->id_pedido ?>" 
                            data-toggle="modal" data-target="#myModal"><i class="fa-solid fa-eye fa-fade" style="color: #77B5FE	;"></i></a>

                          </td>
                          <td>
                          <a href="https://api.whatsapp.com/send?phone=57<?php echo $PedidosModel->telefono_usuario;?>&text=Gracias por tu pedido. Aquí está la información que solicitaste: [Detalles del pedido]" target="_blank" type="button" class="btn btn-outline-success" id="contactarBtn">
                            <i class="fa-brands fa-whatsapp fa-fade success" style="color: #2cba43;"></i> Contactar
                          </a>
                          </td>
                          <td>
                          <?php if ($PedidosModel->estado == 'EN PROCESO') : ?>
                            <a href="<?php echo site_url('admin/Inicio/cancelarPedido/' . $PedidosModel->id_pedido); ?>" target="_blank" type="button" class="btn btn-outline-danger" id="contactarBtn">
                              CANCELAR PEDIDO
                          </a>
                          <?php endif;  ?>
                          </td>
                          </tr>
                          <?php $idPedido=$PedidosModel->id_pedido ?>
                        <?php endif; ?>
                      <?php endforeach; ?>
                  </tbody>
          
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </section>
    <!-- /.content -->
  </div>



<div class="modal" id="myModal">
 <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Detalles del Pedido</h4>
      </div>
      <div class="modal-body">
        <table class="table table-bordered table-striped" id="detallePedidoTable">
        <thead>
          <tr>
          <th scope="col">PRODUCTO</th>
          <th scope="col">CANTIDAD</th>
          <th scope="col">TOTAL</th>
          
          
        </tr>
        </thead>
          <tbody>
            <!-- Aquí mostraremos los detalles del pedido seleccionado -->
          </tbody>
        </table>
        <b><p class="text-center" id="total">TOTAL:</p></b>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
      </div>
    </div>
 </div>
</div>

<!-- Modal al terminar la compra -->

<!-- Modal al terminar la compra -->
<div class="modal" id="modalTerminado" tabindex="-1" role="dialog" aria-labelledby="modalTerminadoLabel" aria-hidden="true">
    <script>
        var pedidos = <?php echo json_encode($pedidos); ?>;
    </script>
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Pedido TERMINADO</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="totalPedido">Total del Pedido:</label>
                    <input type="text" class="form-control" id="totalPedido" readonly>
                </div>
                <div class="form-group">
                    <label for="cantidadRecibida">Cantidad Recibida:</label>
                    <input type="number" currency="COP" class="form-control" id="cantidadRecibida">
                </div>
                <div class="form-group">
                    <label for="vueltas">Vueltas:</label>
                    <input type="text" class="form-control" id="vueltas" readonly>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" data-dismiss="modal">Aceptar</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<script src="<?php echo base_url();?>/assets/plugins/jquery/jquery.min.js"></script>
<script src="<?php echo base_url();?>/assets/dist/js/pedidos.js"></script>

<!-- Bootstrap 4 -->
<script src="<?php echo base_url();?>/assets/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE App -->
<script src="<?php echo base_url();?>/assets/plugins/datatables/jquery.dataTables.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-responsive/js/dataTables.responsive.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-responsive/js/responsive.bootstrap4.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-buttons/js/dataTables.buttons.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-buttons/js/buttons.bootstrap4.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/jszip/jszip.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/pdfmake/pdfmake.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/pdfmake/vfs_fonts.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-buttons/js/buttons.html5.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-buttons/js/buttons.print.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-buttons/js/buttons.colVis.min.js"></script>
<!-- AdminLTE for demo purposes -->
<!-- <script src="<php echo base_url();?>/assets/dist/js/demo.js"></script> -->
<script src="<?php echo base_url();?>/assets/dist/js/table.js"></script>
<script>
  $(function () {
    $("#example1").DataTable({
      "responsive": true, "lengthChange": false, "autoWidth": false,
      "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    $('#example2').DataTable({
      "paging": true,
      "lengthChange": false,
      "searching": false,
      "ordering": true,
      "info": true,
      "autoWidth": false,
      "responsive": true,
    });
  });
  
</script>

<!-- jQuery -->
<script src="<?php echo base_url();?>/assets/plugins/jquery/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="<?php echo base_url();?>/assets/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
<!-- DataTables  & Plugins -->
<script src="<?php echo base_url();?>/assets/plugins/datatables/jquery.dataTables.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-responsive/js/dataTables.responsive.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-responsive/js/responsive.bootstrap4.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-buttons/js/dataTables.buttons.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-buttons/js/buttons.bootstrap4.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/jszip/jszip.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/pdfmake/pdfmake.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/pdfmake/vfs_fonts.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-buttons/js/buttons.html5.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-buttons/js/buttons.print.min.js"></script>
<script src="<?php echo base_url();?>/assets/plugins/datatables-buttons/js/buttons.colVis.min.js"></script>
<!-- AdminLTE App -->
<script src="<?php echo base_url();?>/assets/dist/js/adminlte.min.js"></script>
<!-- AdminLTE for demo purposes -->
<script src="<?php echo base_url();?>/assets/dist/js/demo.js"></script>
<!-- Page specific script -->
<script>
  $(function () {
    $("#example1").DataTable({
      "responsive": true, "lengthChange": false, "autoWidth": false,
      "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    $('#example2').DataTable({
      "paging": true,
      "lengthChange": false,
      "searching": false,
      "ordering": true,
      "info": true,
      "autoWidth": false,
      "responsive": true,
    });
  });
</script>  



<script>
$(document).ready(function() {

  var detallePedidoTable;
 
  

    $('.ver-detalle').on('click', function() {
      if ($.fn.DataTable.isDataTable('#detallePedidoTable')) {
            detallePedidoTable.destroy();
        }
    var pedidoId = $(this).data('pedido-id');
    var detallesPedido = <?php echo json_encode($pedidos); ?>;
    var detallePedidoHtml = '';
    var detallePedidoData = []; // Agregué esta línea para inicializar el array
    let total = 0;
    let inner = document.getElementById("total");

    // Filtrar detalles del pedido por ID del pedido seleccionado
    detallesPedido.forEach(function(pedido) {
        if (pedido.id_pedido == pedidoId) {
            var total_unitario_formateado = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(pedido.total_unitario);
            let cantidad = parseInt(pedido.total_unitario);
            total += cantidad;
            var total_pagar = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(total);
            inner.innerText = "TOTAL: " + total_pagar;

            // Agregar datos al array
            detallePedidoData.push([pedido.nombre_producto, pedido.cantidad_compra, total_unitario_formateado]);
            detallePedidoHtml += `
                <tr>
                    <td>${pedido.nombre_producto}</td>
                    <td>${pedido.cantidad_compra}</td>
                    <td>${total_unitario_formateado}</td>
                </tr>
            `;
        }
    });

     detallePedidoTable = $('#detallePedidoTable').DataTable({
        "dom": 'Bfrtip',
        "paging": false, // Deshabilita el paginador
        "searching": false,
        "info": false, // Deshabilita el buscador
        "buttons": [{
            extend: 'pdfHtml5',
            text: 'Descargar PDF',
            className: 'btn btn-success mb-4',
            customize: function (doc) {
                doc.styles.title = {
                    color: '#4c8aa0',
                    fontSize: '20',
                    alignment: 'center'
                };
                doc.styles.tableHeader = {
                    fillColor: '#4c8aa0',
                    color: 'white',
                    alignment: 'center'
                };
                doc.content.push({
                    text: 'Total a pagar: ' + new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }).format(total),
                    fontSize: 12,
                    alignment: 'right',
                    margin: [0, 0, 30, 0]
                });
            },
            exportOptions: {
                columns: [0, 1, 2] // Especifica las columnas que quieres incluir en el PDF
            },
            title: 'Detalles del Pedido'
        }]
    });



    detallePedidoTable.clear().rows.add(detallePedidoData).draw();

    
    $('#detallePedidoTable tbody').html(detallePedidoHtml);

    
 });
});
</script>