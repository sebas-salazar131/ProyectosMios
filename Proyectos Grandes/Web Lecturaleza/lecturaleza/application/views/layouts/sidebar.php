  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="<?php echo base_url('index.php/admin/Inicio');?>#" class="brand-link">
     <i class="far fa-leaf" style="color: #28c913;"></i>
     <div class="footer__widget text-center mb-1" style="">
      <img src="<?= base_url('assets/dist/img/nuevo.png') ?>" alt="" style="width: 300px; margin-top: -50px;  ">
    </div>
    </a>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img src="<?php echo base_url()."/assets/dist/img/admins/".$session['img']; ?>" class="img-circle elevation-2" alt="User Image">
        </div>
        <div class="info">
          <a href="<?php echo base_url('index.php/admin/inicio/perfil'); ?>" class="d-block"><?= explode(" ", $session['nombres'])[0]." ".explode(" ", $session['apellidos'])[0] ?></a>
        </div>
      </div>

      <!-- SidebarSearch Form -->
      <div class="form-inline">
        <div class="input-group" data-widget="sidebar-search">
          <input class="form-control form-control-sidebar " type="search" placeholder="Search" aria-label="Search">
          <div class="input-group-append">
            <button class="btn btn-sidebar">
              <i class="fas fa-search fa-fw"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-header">Acciones</li>
          <li class="nav-item">
            <a href="<?= base_url('index.php/admin/inicio/openLisFarmers'); ?>" class="nav-link " >
              <i class="nav-icon fas fa-seedling"></i>
              <p>
                AGRICULTOR
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="<?= base_url('index.php/admin/inicio/openLisAdmins'); ?>" class="nav-link">
              <i class="nav-icon fa-solid fa-user-plus"></i>
              <p>
                ADMINISTRADOR
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="<?= base_url('index.php/admin/inicio/openLisUsers'); ?>" class="nav-link">
              <i class="nav-icon fa-solid fa-person-circle-plus"></i>
              <p>
                CLIENTES
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="<?= base_url('index.php/admin/inicio/openLisProducts'); ?>" class="nav-link">
              <i class="nav-icon fas fa-apple-alt"></i>
              <p>
                PRODUCTOS
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="<?= base_url('index.php/admin/Inicio/listpedidos'); ?>" class="nav-link">
              <i class="nav-icon fa-solid fa-cart-shopping"></i>
              <p>
                LISTA PEDIDOS
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="<?= base_url('index.php/admin/Inicio/openListFacturas'); ?>" class="nav-link">
            <i class="nav-icon fa-solid fa-file-lines"></i>
              <p>
                FACTURAS
              </p>
            </a>
          </li>
          <li class="nav-item">
            <a href="<?php echo base_url('index.php/Login/cerrarSession');?>" class="nav-link">
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
