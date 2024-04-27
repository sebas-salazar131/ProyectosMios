<?php
 $dataHeader['titulo']="Ver Tareas";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
    
  <!-- Content Wrapper. Contains page content -->
		<div class="content-wrapper">
		<section class="content mt-4">

      <!-- Default box -->
      <div class="card ">
        <div class="card-header">
          <h3 class="card-title text-primary text-center">Ver tareas</h3>

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
											<th scope="col">id_tarea</th>
											<th scope="col">id_cultivo</th>
											<th scope="col">Titulo</th>
											<th scope="col">descripcion</th>
											<th scope="col">Estado</th>
											
											<th scope="col">Modificar</th>
											<!-- <th scope="col">Eliminar</th> -->
										</tr>
									</thead>
									<tbody>
										<tr>
											<?php   foreach ($datos['registros'] as $key => $tarea) { ?>
												
													<tr>
															<th scope="row"><?php echo $tarea['id_tarea'];  ?></th>
															
															<td><?php echo $tarea['id_cultivo']; ?></td>
															<td><?php echo $tarea['titulo']; ?></td>
															<td><?php echo $tarea['descripcion']; ?></td>
															<td><?php echo $tarea['estado']; ?></td>
															
															<td><a href="<?= base_url('index.php/admin/Inicio/actualizarTarea/'.$tarea['id_tarea']) ?>" ><i class="fa-solid fa-pen-to-square" style="color: #17a00d;"></i></a></td>
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
