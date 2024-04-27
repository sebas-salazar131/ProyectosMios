<!-- /.content-wrapper -->
<footer class="main-footer">
        <strong>Copyright &copy; 2023 <a href="https://adminlte.io">ADSO 2593917</a>.</strong>
        All rights reserved.
        <div class="float-right d-none d-sm-inline-block">
          <b>Version</b> 3.2.0
        </div>
      </footer>
    </div>
    <!-- ./wrapper -->

    <!-- jQuery -->
    <script src="<?= base_url('plugins/jquery/jquery.min.js') ?>"></script>
    <!-- Bootstrap 4 -->
    <script src="<?= base_url('plugins/bootstrap/js/bootstrap.bundle.min.js') ?>"></script>
    <!-- AdminLTE App -->
    <script src="<?= base_url('dist/js/adminlte.js') ?>"></script>
    <script src="<?= base_url('dist/js/main.js') ?>"></script>
    <script src="<?= base_url('dist/js/cultivos.js') ?>"></script>
    <script src="<?= base_url('dist/js/tareas.js') ?>"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
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
  </body>
</html>
