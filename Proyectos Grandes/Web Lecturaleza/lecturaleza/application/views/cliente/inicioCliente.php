<?php
   $dataHeader['titulo']= "Lecturaleza";
   $this->load->view('layoutsCliente/header', $dataHeader);
?>

<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/sidebar', $dataSidebar);
?>



<!-- Categories Section Begin -->
<section class="categories">
    <div class="container">
        <div class="row">
                <div class="categories__slider owl-carousel">
                        <?php $tipo = "Verdura";
                             $tipo2 = "Lacteos";
                             $tipo3 = "Granos";
                             $tipo4 = "Salsa";
                             $tipo5 = "Fruta";
                             ?>
                    <div class="col-lg-3">
                        <div class="categories__item set-bg" data-setbg="<?php echo base_url();?>/assets/distCliente/img/categories/frutas.jpg">
                            <h5><a href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/producto_por_categoria/'). $tipo5: base_url('index.php/SinLog/producto_por_categoria/'). $tipo5; ?>">Frutas</a></h5>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="categories__item set-bg" data-setbg="<?php echo base_url();?>/assets/distCliente/img/categories/granos.jpg">
                            <h5><a href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/producto_por_categoria/'). $tipo3: base_url('index.php/SinLog/producto_por_categoria/'). $tipo3; ?>">Granos</a></h5>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="categories__item set-bg" data-setbg="<?php echo base_url();?>/assets/distCliente/img/categories/vegetales.jpg">
                            <h5><a href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/producto_por_categoria/'). $tipo: base_url('index.php/SinLog/producto_por_categoria/'). $tipo; ?>">Vegetales</a></h5>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="categories__item set-bg" data-setbg="<?php echo base_url();?>/assets/distCliente/img/categories/lacteos.jpg">
                            <h5><a href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/producto_por_categoria/'). $tipo2: base_url('index.php/SinLog/producto_por_categoria/'). $tipo2; ?>">Lacteos</a></h5>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="categories__item set-bg" data-setbg="<?php echo base_url();?>/assets/distCliente/img/categories/salsas.jpg">
                            <h5><a href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/producto_por_categoria/'). $tipo4: base_url('index.php/SinLog/producto_por_categoria/'). $tipo4; ?>">Salsas</a></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <section class="featured spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="section-title">
                        <h2>Productos recientes</h2>
                    </div>
                    <div class="featured__controls">
                        <ul>
                            <li class="active" data-filter="*">Todo</li>
                            <li data-filter=".Verdura">Verdura</li>
                            <li data-filter=".Fruta">Frutas</li>
                            <li data-filter=".Salsa">Salsas</li>
                            <li data-filter=".Lacteos">Lacteos</li>
                            
                        </ul>
                    </div>
                </div>
            </div>
            <div class="row featured__filter">
                <?php  
                        $totalProductos = count($productos);
                        $nombre = array();
                        $precio = array();
                        $tipo = array();
                        $img = array();
                        $id_producto = array();
                        
                    for ($i = 0; $i < $totalProductos; $i++) {
                        
                            $nombre[] = $productos[$i]->nombre_producto;
                            $precio[] = $productos[$i]->precio_venta;
                            $tipo[] = $productos[$i]->tipo;
                            $img[] = $productos[$i]->img;
                            $descrip ="sdsds";
                            $cant=5;
                            $fecha="12/12";
                            $id_producto[]= $productos[$i]->id_producto;
                            ?>
                            <div class="col-lg-3 col-md-4 col-sm-6 mix <?php echo $tipo[$i]  ?> fastfood">
                                <div class="featured__item">
                                    <div class="featured__item__pic set-bg" data-setbg="<?php if($img[$i]==null){echo base_url();?><?php echo "/assets/distCliente/img/product/producto_sin_imagen.png";}else { echo  base_url()."/assets/distCliente/img/product/".$img[$i];}?>">
                                        <ul class="featured__item__pic__hover">
                                            
                                            <li><a href="<?php echo (isset($session)) ? base_url('index.php/Cliente/inicio/detallesProducto/' . $id_producto[$i]): base_url('index.php/SinLog/detallesProducto/' . $id_producto[$i]) ; ?>"><i class="fa fa-retweet"></i></a></li>
                                            <?php if(isset($session)):?>
                                            <li><a href="<?php echo  base_url('index.php/Cliente/Inicio/guardarCarrito/' . $id_producto[$i].'/'.$session["id_usuario"]); ?>"><i class="fa fa-shopping-cart"></i></a></li>
                                            <?php else: ?>
                                                <li><a href="#" onclick="showAlert();" ><i class="fa fa-shopping-cart"></i></a></li>
                                            <?php endif; ?>
                                        </ul>
                                    </div>                                                                                        
                                    <div class="featured__item__text">
                                        <h6><a href="#"><?php  echo $nombre[$i] ?></a></h6>
                                        <h5> <?php echo "$".$formaro_moneda = number_format($precio[$i] ,0,',','.'); ?></h5>
                                    </div>
                                </div>
                            </div>
                            <?php
                        }
                    ?>


</div>
</div>
</section>

<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/footer', $dataSidebar);
?>
<!-- este es para los datos agregados al carrito -->
<?php if (isset($date_validos)): ?>
    <script>
        Swal.fire({
        title: 'PRODUCTO AGREGADOS',
        text: 'El Producto ha sido agregado al carrito con éxito',
        icon: 'success',
        });
    </script>
<?php endif ?>

