<!-- Hero Section Begin -->
<section class="hero ">
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
                        <li><a
                                href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/producto_por_categoria/') . $tipo : base_url('index.php/SinLog/producto_por_categoria/') . $tipo; ?>">Verduras</a>
                        </li>
                        <li><a
                                href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/producto_por_categoria/') . $tipo2 : base_url('index.php/SinLog/producto_por_categoria/') . $tipo2; ?>">Lacteos</a>
                        </li>
                        <li><a
                                href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/producto_por_categoria/') . $tipo3 : base_url('index.php/SinLog/producto_por_categoria/') . $tipo3; ?>">Granos</a>
                        </li>
                        <li><a
                                href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/producto_por_categoria/') . $tipo4 : base_url('index.php/SinLog/producto_por_categoria/') . $tipo4; ?>">Salsas</a>
                        </li>
                        <li><a
                                href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/producto_por_categoria/') . $tipo5 : base_url('index.php/SinLog/producto_por_categoria/') . $tipo5; ?>">Frutas</a>
                        </li>

                    </ul>
                </div>
            </div>

            <div class="col-lg-9">
                <div class="hero__search">
                    <div class="hero__search__form">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="¿Que estas buscando?"
                                aria-label="Recipient's username" aria-describedby="basic-addon2" id="barra_busqueda">

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
                                $busqueda = count($productos);
                                $numero = ($busqueda);
                                $nombre = array();
                                $img = array();
                                for ($i = 0; $i < $busqueda; $i++) {
                                    $nombre[] = $productos[$i]->nombre_producto;
                                    $img[] = $productos[$i]->img;
                                    $id_producto[] = $productos[$i]->id_producto;
                                    ?>
                                    <tr>
                                        <td>
                                            <?php
                                            if ($img[$i] == null) {
                                                ?>
                                                <img src="<?php echo base_url(); ?><?php echo "/assets/distCliente/img/product/producto_sin_imagen.png" ?>"
                                                    alt="Producto sin foto">
                                                <?php
                                            } else {

                                                ?>
                                                <a
                                                    href="<?php echo (isset($session)) ? base_url('index.php/Cliente/inicio/detallesProducto/' . $id_producto[$i]) : base_url('index.php/SinLog/detallesProducto/' . $id_producto[$i]); ?>">
                                                    <img src="<?php echo base_url(); ?><?php echo "/assets/distCliente/img/product/" . $img[$i] ?>"
                                                        alt="Foto del producto">
                                                </a>
                                                <?php
                                            }
                                            ?>

                                        </td>
                                        <td>
                                            <a id="link_detalle_producto" style="color: green;"
                                                href="<?php echo (isset($session)) ? base_url('index.php/Cliente/inicio/detallesProducto/' . $id_producto[$i]) : base_url('index.php/SinLog/detallesProducto/' . $id_producto[$i]); ?>">
                                                <?php echo $nombre[$i] ?>
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
                <div id="carouselExampleFade" class="carousel slide carousel-fade">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="<?php echo base_url(); ?>/assets/distCliente/img/foto_1.jpeg"
                                class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block fw-bold ">
                                <h5>LO MEJOR DE LECTURALEZA</h5>
                                <p>Demostramos cada uno de nuestros productos</p>
                            </div>

                        </div>
                        <div class="carousel-item">
                            <img src="<?php echo base_url(); ?>/assets/distCliente/img/foto_2.jpeg"
                                class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block ">
                                <h5 class="text-blue">CORAZONES VERDES</h5>
                                <p class="text-naranja">Descubre y aprende de lo que la naturaleza te da con lo que te
                                    ofrecemos y vendemos</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="<?php echo base_url(); ?>/assets/distCliente/img/foto_3.jpeg"
                                class="d-block w-100" alt="...">
                            <div class="carousel-caption d-none d-md-block">
                                <h5 class="text-rojo">¡CULTIVA TU MENTE EN LECTURALEZA!</h5>
                                <p class="text-blanco">Creemos en el poder de la agricultura sostenible y en el impacto
                                    positivo que puede tener en nuestras vidas y en el mundo que compartimos.</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="<?php echo base_url(); ?>/assets/distCliente/img/foto_4.jpeg"
                                class="d-block w-100" alt="...">
                                <div class="carousel-caption d-none d-md-block">
                                <h5>BUENAS COSECHAS</h5>
                                <p>¡Sembrando Conocimiento, Cosechando Sonrisas!</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="<?php echo base_url(); ?>/assets/distCliente/img/foto_5.jpeg"
                                class="d-block w-100" alt="...">
                                <div class="carousel-caption d-none d-md-block color">
                                <h5 class="text-rojo">UN CUENTO, UN CULTIVO</h5>
                                <p class="text-blanco">Al elegir Lecturaleza, no solo estás adquiriendo productos de primera calidad, sino que también estás apoyando a comunidades agrícolas locales y contribuyendo a un futuro más verde y próspero para todos</p>
                            </div>
                        </div>
                        <div class="carousel-item">
                            <img src="<?php echo base_url(); ?>/assets/distCliente/img/foto_6.jpeg"
                                class="d-block w-100" alt="...">
                                <div class="carousel-caption d-none d-md-block">
                                <h5 class="text-blue">HAZ UN TRATO VERDE</h5>
                                <p class="text-naranja">Gracias por ser parte de nuestra familia Lecturaleza. Juntos, cultivamos un mundo más saludable y vibrante..</p>
                            </div>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
                
            </div>
        </div>
    </div>
</section>
<!-- Hero Section End -->