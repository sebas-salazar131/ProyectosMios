<!-- Main Sidebar Container -->
<aside class="main-sidebar sidebar-dark-success elevation-4">
        <!-- Brand Logo -->
        <a href="http://localhost/AgroControl/index.php/admin/Inicio" class="brand-link mt-4">
					<div class="footer__widget text-center mb-1" style="">
						<img src="<?= base_url('dist/img/agriculture-logo.png') ?>" alt="" style="width: 200px; margin-top: -50px;  ">
					</div>
				</a>

        <!-- Sidebar -->
        <div class="sidebar">
          <!-- Sidebar user panel (optional) -->
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
							<img src="<?php echo base_url();?>/dist/img/user2-160x160.jpg" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
            </div>
            <div class="info">
						<a href="<?= base_url('index.php/admin/Inicio/mostrarperfil') ?>" class="d-block"><?= explode(" ", $session['nombre'])[0]?></a>
            </div>
          </div>

          <!-- Sidebar Menu -->
          <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
              <li class="nav-header">MENU ADMIN</li>
              <li class="nav-item">

                <a href="<?= base_url('index.php/admin/Inicio/mostrarAgricultores') ?>" class="nav-link">
                  <i class="nav-icon fa-solid fa-users-line"></i>
                  <p>
                    Ver Usuarios
                  </p>
                </a>
              </li>
              <li class="nav-item">

                <a href="<?= base_url('index.php/admin/Inicio/mostrarCultivos') ?>" class="nav-link">
                  <i class="nav-icon fa-solid fa-pepper-hot"></i>
                  <p>
                    Ver cultivos
                  </p>
                </a>
              </li>

              <li class="nav-item">
                <a href="<?= base_url('index.php/admin/Inicio/InsertarTareas') ?>" class="nav-link">
                  <i class="nav-icon fa-solid fa-clipboard"></i>
                  <p>
                    Tareas
                  </p>
                </a>
              </li>
              <li class="nav-item">
                <a href="<?= base_url('index.php/admin/Inicio/mostrarTareasCultivos') ?>" class="nav-link">
                  <i class="nav-icon fa-solid fa-timeline"></i>
                  <p>
                    Asignacion de tareas
                  </p>
                </a>
              </li>
              <li class="nav-item">
                <a href="<?= base_url('index.php/admin/Inicio/mostrarCultivosSeguiemiento') ?>" class="nav-link">
                  <i class=" nav-icon fa-regular fa-calendar-check"></i>
                  <p>
                    Seguimiento
                  </p>
                </a>
              </li>
              <li class="nav-item">
                <a href="<?= base_url('index.php/Login/cerrarSession') ?>" class="nav-link">
								<i class="nav-icon fa-solid fa-right-from-bracket fa-fade" style="color: #df2b0c;"></i>
								<p>
									CERRAR SESION
								</p>
                </a>
              </li>

            </ul>
          </nav>
          <!-- /.sidebar-menu -->
        </div>
        <!-- /.sidebar -->
      </aside>
