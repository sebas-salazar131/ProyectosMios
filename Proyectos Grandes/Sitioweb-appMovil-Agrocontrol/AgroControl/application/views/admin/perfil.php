<?php
 $dataHeader['titulo']="Ver Usuarios";
 $dataSide['session']=$session;
  $this->load->view('layouts/header',$dataHeader, FALSE);
  $this->load->view('layouts/sidebar',$dataSide, FALSE);
 
?>
      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
        <div class="col-12 m-0 p-3">
          <h1 class="text-primary text-center">MI PERFIL</h1>
					<!-- Small Box (Stat card) -->
					<div class="col-md-6">
            <!-- Widget: user widget style 1 -->
						<div class="card card-widget widget-user">
						<!-- Add the bg color to the header using any of the bg-* classes -->
						<div class="widget-user-header text-white"
							style="background: url('<?php echo base_url('dist/img/photo1.png'); ?>') center center;"">
							<h3 class="widget-user-username text-right"><?= explode(" ", $session['nombre'])[0]?></h3>
							<h5 class="widget-user-desc text-right"><?= explode(" ", $session['tipo'])[0]?></h5>
						</div>
						<div class="widget-user-image">
							<img class="img-circle" src="<?php echo base_url();?>/dist/img/user3-128x128.jpg" alt="User Avatar">
						</div>
						<div class="card-footer">
							<div class="row">
							<div class="col-sm-4 border-right">
								<div class="description-block">
								<h5 class="description-header"><?= explode(" ", $session['cedula'])[0]?></h5>
								<span class="description-text">Documento</span>
								</div>
								<!-- /.description-block -->
							</div>
							<!-- /.col -->
							<div class="col-sm-4 border-right">
								<div class="description-block">
								<h5 class="description-header"><?= explode(" ", $session['email'])[0]?></h5>
								<span class="description-text">Correo</span>
								</div>
								<!-- /.description-block -->
							</div>
							<!-- /.col -->
							<div class="col-sm-4">
								<div class="description-block">
								<h5 class="description-header"><?= explode(" ", $session['estado'])[0]?></h5>
								<span class="description-text"><a href="#" ><button type="button" class="btn btn-success" ><i class="fa-solid fa-eye"></i></button></a></span>
								</div>
								<!-- /.description-block -->
							</div>
							<!-- /.col -->
							</div>
							<!-- /.row -->
						</div>
						</div>
            <!-- /.widget-user -->
          </div>
        </div>
      </div>

<?php  $this->load->view('layouts/footer',$dataHeader, FALSE);  ?>
