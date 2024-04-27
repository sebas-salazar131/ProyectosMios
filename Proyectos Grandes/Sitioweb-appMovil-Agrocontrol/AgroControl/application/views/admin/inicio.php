<?php
 $dataHeader['titulo']="Ver Usuarios";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
        <div class="col-12 m-0 p-3">
          <h1 class="text-primary text-center">INICIO DEL ADMIN</h1>
					<!-- Small Box (Stat card) -->
					
					<div class="row">
						<div class="col-lg-3 col-6">
							<!-- small card -->
							<div class="small-box bg-info">
								<div class="inner">
									<h3><?php echo $cultivos ?></h3>
									<h3>Cultivos</h3>
								</div>
								<div class="icon">
									<i class="fa-solid fa-seedling"></i>
								</div>
								<a href="<?= base_url('index.php/admin/Inicio/mostrarCultivos') ?>" class="small-box-footer">
									More info <i class="fas fa-arrow-circle-right"></i>
								</a>
							</div>
						</div>
						<!-- ./col -->
						<div class="col-lg-3 col-6">
							<!-- small card -->
							<div class="small-box bg-success">
								<div class="inner">
									<h3><?php echo $tareas; ?></h3>
									<h3>Tareas ingresadas</h3> 
								</div>
								<div class="icon">
									<i class="ion ion-stats-bars"></i>
								</div>
								<a href="<?= base_url('index.php/admin/Inicio/verTareas') ?>" class="small-box-footer">
									More info <i class="fas fa-arrow-circle-right"></i>
								</a>
							</div>
						</div>
						<!-- ./col -->
						<div class="col-lg-3 col-6">
							<!-- small card -->
							<div class="small-box bg-warning">
								<div class="inner">
									<h3 class="text-white"><?php echo $agricultores; ?></h3>
									<h3 class="text-white">Agricultores</h3> 
								</div>
								<div class="icon">
									<i class="fas fa-user-plus"></i>
								</div>
								<a href="<?= base_url('index.php/admin/Inicio/mostrarAgricultores') ?>" class="small-box-footer">
									More info <i class="fas fa-arrow-circle-right"></i>
								</a>
							</div>
						</div>
						<!-- ./col -->
						<div class="col-lg-3 col-6">
							<!-- small card -->
							<div class="small-box bg-danger">
								<div class="inner">
									<h3><?php echo $tareas_finalizadas; ?></h3>
									<h3>Tareas finalizadas</h3> 
								</div>
								<div class="icon">
									<i class="fas fa-chart-pie"></i>
								</div>
								<a href="#" class="small-box-footer">
									More info <i class="fas fa-arrow-circle-right"></i>
								</a>
							</div>
						</div>
						<!-- ./col -->
						<div class="col-lg-3 col-6">
							<!-- small card -->
							<div class="small-box bg-primary">
								<div class="inner">
									<h3><?php echo $tareas_pendientes; ?></h3>
									<h3> Tareas pendientes</h3>
								</div>
								<div class="icon">
									<i class="fas fa-chart-pie"></i>
								</div>
								<a href="#" class="small-box-footer">
									More info <i class="fas fa-arrow-circle-right"></i>
								</a>
							</div>
						</div>
						<!-- ./col -->
					</div>
        </div>
      </div>
	  

<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>
      
      
      
      
