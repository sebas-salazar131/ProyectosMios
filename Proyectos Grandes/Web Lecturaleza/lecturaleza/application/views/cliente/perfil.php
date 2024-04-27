<?php
   $dataHeader['titulo']= "Perfil";
   $this->load->view('layoutsCliente/header', $dataHeader);
?>


<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/perfil', $dataSidebar);
?>


<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/footer', $dataSidebar);
?>