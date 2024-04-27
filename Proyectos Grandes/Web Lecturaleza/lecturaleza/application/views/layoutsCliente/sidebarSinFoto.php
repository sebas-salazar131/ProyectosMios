 <!-- Hero Section Begin -->
 <section class="hero hero-normal">
        <div class="container">
            <div class="row">
                <div class="col-lg-3">
                    <div class="hero__categories">
                        <div class="hero__categories__all">
                            <i class="fa fa-bars"></i>
                            <span>Categorias</span>
                        </div>
                        <ul>
                            <?php $tipo = "Verdura";
                             $tipo2 = "Lacteos";
                             $tipo3 = "Granos";
                             $tipo4 = "Salsa";
                             $tipo5 = "Fruta";
                             ?>
                            <li><a href="<?php echo base_url('index.php/Cliente/Inicio/producto_por_categoria/'). $tipo; ?>">Verduras</a></li>
                            <li><a href="<?php echo base_url('index.php/Cliente/Inicio/producto_por_categoria/'). $tipo2 ; ?>">Lacteos</a></li>
                            <li><a href="<?php echo base_url('index.php/Cliente/Inicio/producto_por_categoria/'). $tipo3 ; ?>">Granos</a></li>
                            <li><a href="<?php echo base_url('index.php/Cliente/Inicio/producto_por_categoria/'). $tipo4 ; ?>">Salsas</a></li>
                            <li><a href="<?php echo base_url('index.php/Cliente/Inicio/producto_por_categoria/'). $tipo5 ; ?>">Frutas</a></li>
                            
                        </ul>
                    </div>
                </div>
                
                <div class="col-lg-9">
                    <div class="hero__search">
                        <div class="hero__search__form">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="¿Que estas buscando?" aria-label="Recipient's username" aria-describedby="basic-addon2" id="barra_busqueda" >
                            
                        </div>
                        </div>
                        <div class="hero__search__phone">
                            <div class="hero__search__phone__text">
                                <h5></h5>
                            </div>
                        </div>
                        <div class="" id="datos_buscados">
                            <table class="table table-borderless">
                                <thead>
                                    <tr>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php 
                                        $busqueda=count($productos);
                                        $numero=($busqueda);
                                        $nombre = array();
                                        $img = array();
                                        for ($i = 0; $i < $busqueda; $i++) {
                                            $nombre[] = $productos[$i]->nombre_producto;
                                            $img[] = $productos[$i]->img;
                                            $id_producto[]= $productos[$i]->id_producto;
                                            ?>
                                            <tr>
                                                <td>
                                                    <?php
                                                    if($img[$i]==null){
                                                        ?>
                                                            <img src="<?php echo base_url();?><?php echo "/assets/distCliente/img/product/producto_sin_imagen.png"?>" alt="Producto sin foto" >
                                                        <?php
                                                    }else{
                                                            
                                                        ?>
                                                            <a  href="<?php echo base_url('index.php/Cliente/inicio/detallesProducto/' . $id_producto[$i]) ; ?>">
                                                              <img src="<?php echo base_url();?><?php echo "/assets/distCliente/img/product/".$img[$i]?>"   alt="Foto del producto">
                                                            </a> 
                                                        <?php
                                                    }
                                                    ?>

                                                </td>
                                                <td>
                                                    <a id="link_detalle_producto" style="color: green;" href="<?php echo base_url('index.php/Cliente/inicio/detallesProducto/' . $id_producto[$i]) ; ?>">
                                                        <?php  echo $nombre[$i] ?>
                                                    </a>
                                                </td>
                                            </tr>
                                            <div>
                                                <p><span></span></p>     
                                            </div>
                                            <?php
                                        } 
                                        
                                    ?>

                                </tbody>
                            </table>
                        </div>
                    
                </div>
            </div>
        </div>
    </section>
    <!-- Hero Section End -->
    <!-- Hero Section End -->