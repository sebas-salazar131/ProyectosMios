<?php
   $dataHeader['titulo']= "Admin";
   $this->load->view('layouts/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= $session;
   $this->load->view('layouts/sidebar', $dataSidebar);
?>

<?php if (isset($date_validos)): ?>
    <script>
      Swal.fire({
        title: 'ADMIN ACTIVO',
        text: '',
        icon: 'success',
      });
    </script>
<?php endif ?>

 
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper imagine">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              
              
            </ol>
          </div>
        </div>
      </div><!-- /.container-fluid -->
    </section>

    <!-- Main content -->
    <div class="footer__widget text-center mb-4">
      <img src="<?php echo $session["img"] ?>" alt="">
    </div>
    <h2 class="text-center">BIENVENIDO <?php echo $session["nombres"]." ".$session["apellidos"] ?> </h1>
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Inicio Admin</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Dashboard Report</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <!-- Small boxes (Stat box) -->
				
        <div class="row">
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-info">
              <div class="inner">
                <h3><?php echo $cantidad_compras; ?></h3>

                <p>Cantidad de compras</p>
              </div>
              <div class="icon">
							<i class="fas fa-shopping-cart"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-success">
              <div class="inner">
                <h3><?php echo $cantidad_productos; ?></h3>

                <p>cantidad de productos</p>
              </div>
              <div class="icon">
							<i class="fa-solid fa-seedling"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-primary">
              <div class="inner">
                <h3><?php echo $cantidad_agricultores_registrados; ?></h3>

                <p>Cantidad de agricultores registrados</p>
              </div>
              <div class="icon">
							<i class="fa-solid fa-users"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
					<!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-success">
              <div class="inner">
                <h3><?php echo $cantidad_agricultores_activos; ?></h3>

                <p>Cantidad de agricultores activos</p>
              </div>
              <div class="icon">
                <i class="ion ion-person-add"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
					<!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-danger">
              <div class="inner">
                <h3><?php echo $cantidad_agricultores_inactivos; ?></h3>

                <p>Cantidad de agricultores inactivos</p>
              </div>
              <div class="icon">
								<i class="fa-solid fa-user-minus"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
          <!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-danger">
              <div class="inner">
                <h3><?php echo $cantidad_pedidos_en_proceso; ?></h3>

                <p>cantidad de pedidos en proceso</p>
              </div>
              <div class="icon">
							<i class="fa-solid fa-cart-arrow-down"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
					<!-- ./col -->
          <div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-danger">
              <div class="inner">
                <h3><?php echo $cantidad_envios_no_entregados; ?></h3>

                <p>cantidad de envios no entregados</p>
              </div>
              <div class="icon">
							<i class="fa-solid fa-cart-flatbed-suitcase"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>
					<div class="col-lg-3 col-6">
            <!-- small box -->
            <div class="small-box bg-danger">
              <div class="inner">
                <h3><?php echo $cantidad_envios_en_camino; ?></h3>

                <p>cantidad de envios en camino</p>
              </div>
              <div class="icon">
							<i class="fa-solid fa-car-side"></i>
              </div>
              <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
            </div>
          </div>

					<div class="col-lg-3 col-6">
						<!-- small box -->
						<div class="small-box bg-danger">
								<div class="inner">
									<h3><?php echo isset($total_vendido) ? $total_vendido : '0'; ?></h3>
									<p>Total unitario vendido hoy</p>
									<p>Fecha: <?php echo date('Y-m-d'); ?></p>
							</div>
							<div class="icon">
									<i class="fa-solid fa-chart-simple"></i>
							</div>
							<a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
						</div>
				  </div>

          <!-- ./col -->
        </div>
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">DataTable with default features</h3>
					</div>
					<!-- /.card-header -->
					<div class="card-body">
						<table id="example1" class="table table-bordered table-striped">

						<thead>
										<tr>
												<th>ID</th>
												<th>Fecha</th>
												<th>Total Vendido</th>
										</tr>
								</thead>
								<tbody>
										<?php foreach ($ventas as $venta): ?>
												<tr>
														<td><?php echo $venta['id']; ?></td>
														<td><?php echo $venta['fecha']; ?></td>
														<td><?php echo $venta['total_vendido']; ?></td>
												</tr>
										<?php endforeach; ?>
								</tbody>

						</table>
					</div>
										<!-- /.card-body -->
									</div>
			</div>	

      <!-- /.card -->

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->

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

  <?php
   $this->load->view('layouts/footer');
?>
