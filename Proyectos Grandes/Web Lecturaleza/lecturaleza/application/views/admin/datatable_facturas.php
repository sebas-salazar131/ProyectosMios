<?php
   $dataHeader['titulo']= "pedidos";
   
   $this->load->view('layouts/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= $session;
//    $dataSidebar['optionSelected'] = 'openLisFarmers';
   $this->load->view('layouts/sidebar', $dataSidebar);
?>

<div class="content-wrapper">
    <!-- Content Header (Page header) -->

    <!-- Main content -->
    <section class="content mt-4">

      <!-- Default box -->
      <div class="card ">
        <div class="card-header">
          <h3 class="card-title">Lista Facturas</h3>
        </div>
              
              <!-- /.card-header -->
              <div class="card-body">
                <table id="example1" class="table table-bordered table-striped">

                  <thead>
                      <tr>
                      <th scope="col">ID FACTURA</th>
                      <th scope="col">NOMBRE USUARIO</th>
                      <th scope="col">FECHA</th>
                      <!-- <th scope="col">VER</th> -->
                      <!-- <th scope="col">Contactar</th> -->
                      </tr>
                  </thead>
                  <tbody>
                      <?php $idFactura = null ?>
                      <?php $total=0; ?>
                      <?php foreach($facturas as $key => $FacturasModel) : ?>
                       <?php if($FacturasModel->id_factura != $idFactura): ?>
                          <tr>
                          <td><?php echo $FacturasModel->id_factura ?></td>
                          <td><?php echo $FacturasModel->nombres_usuario." ". $FacturasModel->apellidos_usuario ?></td>
                          <td><?php echo $FacturasModel->fecha ?></td>
                          <!-- <td>
                            <a href="#" class="btn btn-outline-primary ver-detalle" data-pedido-id="<?php echo $FacturasModel->id_factura ?>" 
                            data-toggle="modal" data-target="#myModal"><i class="fa-solid fa-eye fa-fade" style="color: #77B5FE	;"></i></a>
                          </td> -->
                          <!-- <td>
                            <a href="https://api.whatsapp.com/send?phone=57<?php echo $FacturasModel->telefono_usuario;?>&text=" target="_blank" type="button" class="btn btn-outline-success" id="contactarBtn">
                                <i class="fa-brands fa-whatsapp fa-fade success" style="color: #2cba43;"></i> Contactar
                            </a>
                          </td> -->
                          </tr>
                          <?php $idFactura=$FacturasModel->id_factura ?>
                        <?php endif; ?>
                      <?php endforeach; ?>
                  </tbody>

                </table>
                
                
              </div>
              <!-- /.card-body -->
            </div>
        <!-- /.card-body -->
        
        <!-- /.card-footer-->
      
      <!-- /.card -->

    </section>
    <!-- /.content -->
  </div>


  <!-- <div class="modal" id="myModal">

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
                        
                </tbody>
                </table>
                <b><p class="text-center" id="total">TOTAL:</p></b>
            </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div> -->

<script src="<?php echo base_url();?>/assets/plugins/jquery/jquery.min.js"></script>

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