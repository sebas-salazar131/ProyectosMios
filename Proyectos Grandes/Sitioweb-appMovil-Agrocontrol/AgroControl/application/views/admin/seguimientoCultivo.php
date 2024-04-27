<?php
 $dataHeader['titulo']="Ver Cultivos";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
<head>
<!-- Google Font: Source Sans Pro -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
	<!-- Font Awesome -->
	<link rel="stylesheet" href="<?= base_url('plugins/fontawesome-free/css/all.min.css') ?>">
	<!-- Ionicons -->
	<link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
	<!-- Tempusdominus Bootstrap 4 -->
	<link rel="stylesheet" href="<?= base_url('plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css') ?>">
	<!-- Theme style -->
	<link rel="stylesheet" href="<?= base_url('dist/css/adminlte.min.css') ?>">

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
	
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/brands.min.css" integrity="sha512-8RxmFOVaKQe/xtg6lbscU9DU0IRhURWEuiI0tXevv+lXbAHfkpamD4VKFQRto9WgfOJDwOZ74c/s9Yesv3VvIQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
	
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
	<!-- DataTables -->
	<link rel="stylesheet" href="<?= base_url('plugins/datatables-bs4/css/dataTables.bootstrap4.min.css') ?>">
	<link rel="stylesheet" href="<?= base_url('plugins/datatables-responsive/css/responsive.bootstrap4.min.css') ?>">
	<link rel="stylesheet" href="<?= base_url('plugins/datatables-buttons/css/buttons.bootstrap4.min.css') ?>">
</head>


    
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
		<section class="content mt-4">

      <!-- Default box -->
      <div class="card ">
        <div class="card-header">
          <h3 class="card-title text-primary text-center">Seguimiento</h3>

          <div class="card-tools">
            <button type="button" class="btn btn-tool" data-card-widget="collapse" title="Collapse">
              <i class="fas fa-minus"></i>
            </button>
            <button type="button" class="btn btn-tool" data-card-widget="remove" title="Remove">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
          
              
              <!-- /.card-header -->
              <div class="card-body">
                <table id="example1" class="table table-bordered table-striped">

								<thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Cultivo</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Tipo</th>
            <th scope="col">VER</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <?php   foreach ($datos['registros'] as $key => $tarea) { ?>
              
                <tr>
                    <th scope="row"><?php echo $key ?></th>
                    
                    <td><?php echo $tarea['nombre']; ?></td>
                    <td><?php echo $tarea['descripcion']; ?></td>
                    <td><?php echo $tarea['tipo']; ?></td>
                    
                    <td><a href="<?= base_url('index.php/admin/Inicio/mostrarTareasSeguiemiento/'.$tarea['id_cultivo']) ?>" ><button type="button" class="btn btn-success" ><i class="fa-solid fa-eye"></i></button></a></td>
                    <!-- <td><button type="button" class="btn btn-danger" >Eliminar</button></td> -->
                </tr>

              <?php
            }
            ?>
            
          </tr>
        </tbody>

                  

                </table>
                
                
              </div>
              <!-- /.card-body -->
            </div>
        <!-- /.card-body -->
        
        <!-- /.card-footer-->
      
      <!-- /.card -->

    </section>
    </div>
		
	

		<script src="<?php echo base_url();?>/plugins/jquery/jquery.min.js"></script>

<!-- Bootstrap 4 -->
		<script src="<?php echo base_url();?>/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
		<!-- AdminLTE App -->
		<script src="<?php echo base_url();?>/plugins/datatables/jquery.dataTables.min.js"></script>
		<script src="<?php echo base_url();?>/plugins/datatables-bs4/js/dataTables.bootstrap4.min.js"></script>
		<script src="<?php echo base_url();?>/plugins/datatables-responsive/js/dataTables.responsive.min.js"></script>
		<script src="<?php echo base_url();?>/plugins/datatables-responsive/js/responsive.bootstrap4.min.js"></script>
		<script src="<?php echo base_url();?>/plugins/datatables-buttons/js/dataTables.buttons.min.js"></script>
		<script src="<?php echo base_url();?>/plugins/datatables-buttons/js/buttons.bootstrap4.min.js"></script>
		<script src="<?php echo base_url();?>/plugins/jszip/jszip.min.js"></script>
		<script src="<?php echo base_url();?>/plugins/pdfmake/pdfmake.min.js"></script>
		<script src="<?php echo base_url();?>/plugins/pdfmake/vfs_fonts.js"></script>
		<script src="<?php echo base_url();?>/plugins/datatables-buttons/js/buttons.html5.min.js"></script>
		<script src="<?php echo base_url();?>/plugins/datatables-buttons/js/buttons.print.min.js"></script>
		<script src="<?php echo base_url();?>/plugins/datatables-buttons/js/buttons.colVis.min.js"></script>
		<!-- AdminLTE for demo purposes -->
		
		<!-- <script src="<php echo base_url();?>/assets/dist/js/demo.js"></script> -->
		<script src="<?php echo base_url();?>/dist/js/table.js"></script>
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



<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>
