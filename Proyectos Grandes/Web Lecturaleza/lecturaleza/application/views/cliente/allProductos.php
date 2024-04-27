<?php
   $dataHeader['titulo']= "Tienda";
   $this->load->view('layoutsCliente/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/sidebarSinFoto', $dataSidebar);
?>



    <!-- Breadcrumb Section End -->
    <section id="product" class="breadcrumb-section set-bg" data-setbg="<?php echo base_url("assets/distCliente/img/cana.jpg");?>">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <div class="breadcrumb__text">
                        <h2 class="text-color">Productos</h2>

                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Product Section Begin -->
    <section class="product spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 col-md-5">
                    <div class="sidebar">
                        <div class="sidebar__item">
                            <h4>Filtrar</h4>
                            <ul>
                                <?php $tipo = "Verdura";
                                $tipo2 = "Lacteos";
                                $tipo3 = "Granos";
                                $tipo4 = "Salsa";
                                $tipo5 = "Fruta";
                                ?>
                                <li><a
                                    href="<?php  echo (isset($session)) ?  base_url('index.php/Cliente/Inicio/producto_por_categoria/') . $tipo : base_url('index.php/SinLog/producto_por_categoria/'). $tipo;   ?>">Verduras</a>
                                </li>
                                <li><a
                                        href="<?php  echo (isset($session)) ?  base_url('index.php/Cliente/Inicio/producto_por_categoria/') . $tipo2 : base_url('index.php/SinLog/producto_por_categoria/'). $tipo2;   ?>">Lacteos</a>
                                </li>
                                <li><a
                                        href="<?php  echo (isset($session)) ?  base_url('index.php/Cliente/Inicio/producto_por_categoria/') . $tipo3 : base_url('index.php/SinLog/producto_por_categoria/'). $tipo3;   ?>">Granos</a>
                                </li>
                                <li><a
                                        href="<?php  echo (isset($session)) ?  base_url('index.php/Cliente/Inicio/producto_por_categoria/') . $tipo4 : base_url('index.php/SinLog/producto_por_categoria/'). $tipo4;   ?>">Salsas</a>
                                </li>
                                <li><a
                                        href="<?php  echo (isset($session)) ?  base_url('index.php/Cliente/Inicio/producto_por_categoria/') . $tipo5 : base_url('index.php/SinLog/producto_por_categoria/'). $tipo5;   ?>">Frutas</a>
                                </li>
                                
                            </ul>
                        </div>
                        
                         <div class="featured__controls">
                        <ul>
                            
                            
                        </ul>
                        </div>
                        <div class="sidebar__item">
                            
                        </div>

                    </div>
                </div>
                <div class="col-lg-9 col-md-7">
                    
                    <div class="filter__item">
                        <div class="row">
                            <div class="col-lg-4 col-md-5">
                        
                               
                            </div>
                            <div class="col-lg-4 col-md-4">
                                <div class="filter__found">
                                    <h6>Total Productos:  <span><?php $numProductos = count($productos); echo $numProductos  ?></span></h6>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-3">
                               
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <?php  
                            foreach($productos as $producto):

                                ?>
                                    <div class="col-lg-4 col-md-6 col-sm-6">
                                        <div class="product__item">
                                            <div class="product__item__pic set-bg" data-setbg="
                                                <?php  
                                                    if($producto->img==null){
                                                       
                                                        echo base_url();?><?php echo "/assets/distCliente/img/product/producto_sin_imagen.png";
                                                    }else{
                                                        echo base_url();?><?php echo "/assets/distCliente/img/product/".$producto->img; 
                                                    }
                                                ?>">
                                                <ul class="product__item__pic__hover">
                                                    
                                                    <li><a href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/detallesProducto/' . $producto->id_producto): base_url('index.php/SinLog/detallesProducto/' . $producto->id_producto) ; ?>"><i class="fa fa-retweet"></i></a></li>
                                                    <?php if(isset($session)){?>
                                                   
                                                    <li><a href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/guardarCarrito/' . $producto->id_producto.'/'.$session["id_usuario"]) : '' ; ?>"><i class="fa fa-shopping-cart"></i></a></li>
                                                    <?php }else{?>

                                                        <li><a href="#" onclick="showAlert();"><i class="fa fa-shopping-cart"></i></a></li>

                                                        <?php } ?>
                                                </ul>
                                            </div>
                                            <div class="product__item__text">
                                                <h6><a href="#"><?php echo $producto->nombre_producto; ?></a></h6>
                                                <h5><?php echo "$".$formaro_moneda = number_format($producto->precio_venta,0,',','.'); ?></h5>
                                            </div>
                                        </div>
                                    </div>
                                <?php
                            endforeach
                        ?>
                        
                    </div>
                    <div class="product__pagination">
                        <a href="#">1</a>
                        <a href="#">2</a>
                        <a href="#">3</a>
                        <a href="#"><i class="fa fa-long-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/footer', $dataSidebar);
?>