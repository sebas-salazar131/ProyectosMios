<?php
    $dataHeader['titulo']= "Perfil";
    $this->load->view('layouts/header', $dataHeader);
?>

<?php
    $dataSidebar['session']= "session";
    $this->load->view('layouts/sidebar');
?>

<div class="content-wrapper">
    <div class="col-12 m-0 p-3">
            <h1 class="text-primary text-center">VER PERSONAS</h1>

            <div class="row">
                <div class="col-md-4">
                <!-- Información del Usuario -->
                    <div class="card">
                        <img src="<?php echo base_url();?>assets/dist/img/user2-160x160.jpg" class="card-img-top" alt="Imagen de Perfil">
                        <div class="card-body">
                        <h5 class="card-title"><?= explode(" ", $session['nombres'])[0]." "?></h5>
                        <p class="card-text">soy ese.</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-8">
                <!-- Detalles del Perfil -->
                    <div class="card">
                        <div class="card-header">
                        Detalles del Perfil
                        </div>
                        <div class="card-body">
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Nombre: </strong><?= explode(" ", $session['nombres'])[0]." "?></li>
                            <li class="list-group-item"><strong>Correo Electrónico: </strong><?= explode(" ", $session['email'])[0]." "?></li>
                            <li class="list-group-item"><strong>Tipo de Usuario: </strong><?= explode(" ", $session['tipo'])[0]." "?></li>
                            <li class="list-group-item"><strong>Estado del Usuario: </strong> <?= explode(" ", $session['estado'])[0]." "?></li>
                        </ul>
                        </div>
                    </div>
                </div>
            </div>
    </div>     
</div>



<?php
    $this->load->view('layouts/footer');
?>