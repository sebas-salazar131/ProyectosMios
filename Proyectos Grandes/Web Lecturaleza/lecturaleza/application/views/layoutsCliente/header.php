<!DOCTYPE html>
<html lang="zxx">

<head>
    <meta charset="UTF-8">
    <meta name="description" content="Ogani Template">
    <meta name="keywords" content="Ogani, unica, creative, html">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?= (isset($titulo)? $titulo : "Lecturaleza")?></title>

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;900&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- Css Styles -->
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/bootstrap.min.css" type="text/css">
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/font-awesome.min.css" type="text/css">
    <!-- alerta -->
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/alert_sinlog.css" type="text/css">
    <!-- alerta fin -->
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/elegant-icons.css" type="text/css">
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/nice-select.css" type="text/css">
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/jquery-ui.min.css" type="text/css">
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/owl.carousel.min.css" type="text/css">
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/slicknav.min.css" type="text/css">
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/style.css" type="text/css">
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/style2.css" type="text/css">
    <link rel="stylesheet" href="<?php echo base_url();?>/assets/distCliente/css/custom-carousel.css" type="text/css">
</head>

<body>
    <!-- Page Preloder -->
    <!-- <div id="preloder">
        <div class="loader"></div>
    </div> -->

    <!-- SWEATALERT CARRITO/PRODUCTOS -->
    <?php if (isset($date_validos)): ?>
        <script>
            Swal.fire({
            title: 'PRODUCTO AGREGADO',
            text: 'El Producto ha sido agregado al carrito con éxito',
            icon: 'success',
            });
        </script>
    <?php endif ?>

    <?php if (isset($mensaje_duplicado)): ?>
        <script>
            Swal.fire({
                icon: 'warning',
                title: 'PRODUCTO YA AGREGADO AL CARRITO',
                text: 'El Producto ya se encuentra registrado en tu bolsa',
                showConfirmButton: true,
                timer: 5000, // temporizador cierre
            });
        </script>
    <?php endif; ?>

    <?php if (isset($mensaje_duplicado2)): ?>
        <script>
            Swal.fire({
                icon: 'warning',
                title: 'ERROR AL AGREGAR EL PRODUCTO AL CARRITO',
                text: 'Error 2033',
                showConfirmButton: true,
                timer: 5000, // temporizador cierre
                didClose: () => {
                    window.location.href = '<?php echo base_url('index.php/Cliente/Inicio/index'); ?>';
                }
            });
        </script>
    <?php endif; ?>

    <!-- menu lateral -->
    <div class="humberger__menu__overlay"></div>
    <div class="humberger__menu__wrapper">
        <div class="humberger__menu__logo">
            <a href="#"><img src="<?= base_url('assets/dist/img/nuevo.png') ?>" alt=""></a>
        </div>
        <div class="humberger__menu__cart">
            <ul>
                <li><a href="#"><i class="fa fa-heart"></i> <span>1</span></a></li>
                <li><a href="#"><i class="fa fa-shopping-bag"></i> <span>3</span></a></li>
            </ul>
            
        </div>
        <div class="humberger__menu__widget">
            
            <div class="header__top__right__auth">
                <a href="#"><i class="fa fa-user"></i> <?= explode(" ", $session['nombres'])[0]." ".explode(" ", $session['apellidos'])[0] ?></a>
            </div>
            
            <div class="header__top__right__auth">
                <a href="<?php echo base_url('index.php/Login/cerrarSession');?>" class="nav-link "> 
                    <i class="nav-icon fa-solid fa-arrow-right-from-bracket"></i>
                    <p class="text-danger">
                        cerrar sesion
                    </p>
                </a>
            </div>
        </div>
        <nav class="humberger__menu__nav mobile-menu">
            <ul>
                <li class="active"><a href="<?php echo base_url();?>/index.html">Inicio</a></li>
                <li><a href=""></a></li>
                <li><a href="./contact.html">Contacto</a></li>
                
            </ul>
        </nav>
        <div id="mobile-menu-wrap"></div>
        <div class="header__top__right__social">
            <a href="#"><i class="fa fa-facebook"></i></a>
            <a href="#"><i class="fa fa-twitter"></i></a>
            <a href="#"><i class="fa fa-linkedin"></i></a>
            <a href="#"><i class="fa fa-pinterest-p"></i></a>
        </div>
        <div class="humberger__menu__contact">
            <ul>
                <li><i class="fa fa-envelope"></i>byte a byte soft</li>
                
            </ul>
        </div>
    </div>

    <!-- Header Section Begin -->
    <header class="header">
        <div class="header__top">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6 col-md-6">
                        <div class="header__top__left">
                            <ul>
                                <!-- <li><i class="fa fa-envelope"></i> ss@gmail.com</li> -->
                                <li>En cada semilla hay un sueño de futuro, en cada cosecha hay un logro de vida</li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6">
                        <div class="header__top__right">
                            <div class="header__top__right__social">
                                <a href="#"><i class="fa fa-facebook"></i></a>
                                <a href="#"><i class="fa fa-twitter"></i></a>
                                <a href="#"><i class="fa fa-linkedin"></i></a>
                                <a href="#"><i class="fa fa-pinterest-p"></i></a>
                            </div>
                            
                            <div class="header__top__right__auth">
                                <a href="<?php echo base_url('index.php/Cliente/Inicio/editarperfil');?>"><i class="fa fa-user"></i> <b> <?=   (isset($session)) ? explode(" ", $session['nombres'])[0]." ".explode(" ", $session['apellidos'])[0] : '' ;  ?> </b> </a>
                            
                            </div>

                            <?php
                            if(!isset($session)){
                            ?>
                            <div class="header__top__right__auth">
                                        <a href="<?php echo base_url('index.php/SinLog/iniciarSesion') ?>" class="nav-link "> 
                                        <i class="nav-icon fa-solid fa-arrow-right-from-bracket"></i>
                                        <p class="text-primary">
                                            Iniciar sesion
                                        </p>
                                        </a>
                            </div>
                            <?php
                                     }
                            ?>


                            <?php
                            if(!isset($session)){
                            ?>
                            <div class="header__top__right__auth">
                                        <a href="<?php echo base_url('index.php/SinLog/opencrearClientes') ?>" class="nav-link "> 
                                        <i class="nav-icon fa-solid fa-arrow-right-from-bracket"></i>
                                        <p class="text-primary">
                                            Registrarse
                                        </p>
                                        </a>
                            </div>
                            <?php
                                     }
                            ?>
                            
                            <?php
                            if(isset($session)){
                            ?>
                            <div class="header__top__right__auth">

                                <a href="<?php echo base_url('index.php/Login/cerrarSession');?>" class="nav-link "> 
                                    <i class="nav-icon fa-solid fa-arrow-right-from-bracket"></i>
                                    <p class="text-danger">
                                         <b>Cerrar sesion</b>
                                    </p>
                                </a>
                            </div>
                            <?php
                                     }
                            ?>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-lg-3">
                    <div class="header__logo">
                        <a href="<?php echo base_url('index.php/Cliente/Inicio');?>"><img src="<?= base_url('assets/dist/img/nuevo.png') ?>" alt=""></a>
                    </div>
                </div>
                <div class="col-lg-6">
                    <nav class="header__menu">
                        <ul>
                            <li ><a href="<?php echo base_url('index.php/Cliente/Inicio');?>">Inicio</a></li>
                            <li><a href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/allProductos/'): base_url('index.php/SinLog/allProductos/');?>">Tienda</a></li>
                            <?php  if(isset($session)){ ?>
                            <li><a href="<?php echo (isset($session)) ?  base_url('index.php/cliente/Inicio/pedidos/'.$session['id_usuario'])  : '' ;  ?>">MIS PEDIDOS</a></li>
                            <?php } ?>
                            <li><a href="<?php echo (isset($session)) ? base_url('index.php/Cliente/Inicio/contacto') : base_url('index.php/SinLog/contacto') ; ?>">Contacto</a></li>
                            <li><a href="<?php echo (isset($session)) ? base_url('index.php/SinLog/listaAgricultores') : base_url('index.php/SinLog/listaAgricultores') ; ?>">Nuestros Agricultores</a></li>

                        </ul>
                    </nav>
                </div>
                <div class="col-lg-3">
                    <div class="header__cart">
                        <ul>
                        <li>
                            <a href="#"><i class="fa fa-heart"></i> <span>1</span></a></li>
                            <?php if(isset($session)): ?>
                                <li><a href="<?php echo base_url('index.php/cliente/Inicio/vistaCarrito/'.$session['id_usuario']); ?>"><i class="fa fa-shopping-cart"></i> <span>3</span></a></li>
                            <?php else: ?>
                                <li><a href="#" onclick="showAlert();"><i class="fa fa-shopping-cart"></i> <span>3</span></a></li>
                            <?php endif; ?>
                        </ul>
                        <div class="header__cart__price">Producto: <span>$150.00</span></div>
                    </div>
                </div>
            </div>
            <div class="humberger__open">
                <i class="fa fa-bars"></i>
            </div>
        </div>
    </header>
    <!-- Header Section End -->