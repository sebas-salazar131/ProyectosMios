<?php
   $dataHeader['titulo']= "Inicio";
   $this->load->view('layouts/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= "session";
   $this->load->view('layouts/sidebar');
?>
   
      <!-- Content Wrapper. Contains page content -->
      <div class="content-wrapper">
        <div class="col-12 m-0 p-3">
          <h1 class="text-primary text-center">Inicio</h1>

          
        </div>
      </div>

<?php
   
   $this->load->view('layouts/footer');
?>