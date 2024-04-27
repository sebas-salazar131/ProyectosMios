<div class="container-xl px-4 mt-4">
    <!-- Account page navigation-->
    <nav class="nav nav-borders">
        <a class="nav-link active ms-0 btn-success" href="" target="__blank">Perfil</a>
        <a class="nav-link btn-success" href="<?php echo base_url('index.php/cliente/Inicio/pedidos/'.$session['id_usuario']);?>" target="_self">Pedidos</a>
        <a class="nav-link btn-success" href="" target="__blank">Seguridad</a>
        
    </nav>
    <hr class="mt-0 mb-4">
    <div class="row mt-4">
        <div class="col-xl-4">
                <!-- Profile picture card-->
                <div class="card mb-4 mb-xl-0">
                    <div class="card-header">Imagen de perfil</div>
                 
                    <div class="card-body text-center">
                        <!-- Profile picture image-->
                        <img class="img-account-profile rounded-circle mb-2" src="<?php echo base_url('/assets/distCliente/img/clientes/'). $session['img']; ?>" alt="">
                        <!-- Profile picture help block-->
                        <div class="small font-italic text-muted mb-4">JPG o PNG maximo 5 MB</div>
                        <!-- Profile picture upload button-->
                         
                        <form class="mx-auto" action="<?php echo base_url('index.php/cliente/Inicio/subirImagen/' ) ; ?>?>" method="POST" enctype="multipart/form-data">
                            <div class="col">
                                <label for="new_imagen" class="form-label">
                                    <i class="fa-solid fa-file"></i> Seleccione una Imagen
                                </label>
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="new_imagen" name="new_imagen">
                                    <label class="custom-file-label" for="new_imagen" data-browse="Examinar">Elegir archivo</label>
                                </div>
                                <button class="btn btn-success mt-4" type="submit">Cargar nueva imagen</button>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
            <div class="col-xl-8">
                <!-- Account details card-->
                <div class="card mb-4">
                    <div class="card-header">Detalles de la cuenta</div>
                    <div class="card-body">
                        <form action="<?php echo site_url('cliente/Inicio/guardarCambiosPerfil') ?>" method="post">
                            <input class="form-control" id="inputid_usuario" type="hidden" name="id_usuario" placeholder="Enter your first name" value="<?php echo $cliente->id_usuario;  ?>">
                            <!-- Form Row-->
                            <div class="row gx-3 mb-3">
                                <!-- Form Group (first name)-->
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputOrgName">Numero de documento</label>
                                    <input class="form-control" id="inputOrgName" type="text" placeholder="Por favor ingrese su documento" name="documento" value="<?php echo $cliente->documento; ?>" required  readonly>
                                </div>
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputFirstName">Nombre</label>
                                    <input class="form-control" id="inputFirstName" type="text" name="nombres" placeholder="Por favor escriba su nombre" value="<?php echo $cliente->nombres; ?>" required>
                                </div>
                                <!-- Form Group (last name)-->
        
                            </div>
                            <!-- Form Row        -->
                            <div class="row gx-3 mb-3">
                                <!-- Form Group (organization name)-->
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputLastName">Apellido</label>
                                    <input class="form-control" id="inputLastName" type="text" name="apellidos" placeholder="Por favor escriba su apellido" value="<?php echo $cliente->apellidos; ?>" required>
                                </div>
                                <!-- Form Group (location)-->
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputLocation">Direccion</label>
                                    <input class="form-control" id="inputLocation" type="text" placeholder="Por favor ingrese su dirección" name="direccion" value="<?php echo $cliente->direccion; ?>" required>
                                </div>
                            </div>
                            <!-- Form Group (email address)-->
                            <div class="mb-3">
                                <label class="small mb-1" for="inputEmailAddress">Correo electronico</label>
                                <input class="form-control" id="inputEmailAddress" type="email" placeholder="Por favor ingrese su correo" name="email" value="<?php echo $cliente->email; ?>" required>
                            </div>
                            <!-- Form Row-->
                            <div class="row gx-3 mb-3">
                                <!-- Form Group (phone number)-->
                                <div class="col-md-6">
                                    <label class="small mb-1" for="inputPhone">Telefono</label>
                                    <input class="form-control" id="inputPhone" type="tel" placeholder="Por favor ingrese su telefono" name="telefono" value="<?php echo $cliente->telefono; ?>" required>
                                </div>
                                <!-- Form Group (birthday)-->
                                
                            </div>
                            <!-- Save changes button-->
                            <button class="btn btn-success" type="submit">Guardar Cambios</button>
                        </form>
                    </div>
                </div>
            </div>
    </div>
</div>
<br>