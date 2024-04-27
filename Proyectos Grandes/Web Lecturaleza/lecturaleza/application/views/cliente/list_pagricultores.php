<?php
   $dataHeader['titulo']= "Carrito";
   $this->load->view('layoutsCliente/header', $dataHeader);
?>

<style>
.list_agri{
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}
.listagri {
	min-height: 100vh;
	display: grid;
	place-items: center;
	margin: 0;
	padding: 0;
	background: linear-gradient(
		to right,
		#fffff,
		#fffff,
		#fffff,
		#fffff,
		#fffff
	);
	font-family: "Martel Sans", sans-serif;
}

#agricultor {
	font-size: 5.25vmin;
	text-align: center;
	color: white;
}
#textos_agri {
	font-size: max(10pt, 2.5vmin);
	line-height: 1.4;
	color: #0e390e;
	margin-bottom: 1.5rem;
}

.wrap {
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	width: 85vmin;
	height: 65vmin;
	margin: 2rem auto;
	border: 8px solid;
	border-image: linear-gradient(
			-50deg,
			green,
			#00b300,
			forestgreen,
			green,
			lightgreen,
			#00e600,
			green
		)
		1;
	transition: 0.3s ease-in-out;
	position: relative;
	overflow: hidden;
}
.overlay {
	position: relative;
	display: flex;
	width: 100%;
	height: 100%;
	padding: 1rem 0.75rem;
	background: #186218;
	transition: 0.4s ease-in-out;
	z-index: 1;
}
.overlay-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 15vmin;
	height: 100%;
	padding: 0.5rem 0 0 0.5rem;
	border: 3px solid;
	border-image: linear-gradient(
			to bottom,
			#aea724 5%,
			forestgreen 35% 65%,
			#aea724 95%
		)
		0 0 0 100%;
	transition: 0.3s ease-in-out 0.2s;
	z-index: 1;
}
.image-content {
	position: absolute;
	top: 0;
	right: 0;
	width: 60vmin;
	height: 100%;
	background-image: url("https://assets.codepen.io/4787486/trees.png");
	background-size: cover;
	transition: 0.3s ease-in-out;
	/* border: 1px solid green; */
}

.inset {
	max-width: 50%;
	margin: 0.25em 1em 1em 0;
	border-radius: 0.25em;
	float: left;
}

.dots {
	position: absolute;
	bottom: 1rem;
	right: 2rem;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
	width: 55px;
	height: 4vmin;
	transition: 0.3s ease-in-out 0.3s;
}
.dot {
	width: 14px;
	height: 14px;
	background: yellow;
	border: 1px solid indigo;
	border-radius: 50%;
	transition: 0.3s ease-in-out 0.3s;
}

.text {
	position: absolute;
	top: 0;
	right: 0;
	width: 60vmin;
	height: 100%;
	padding: 3vmin 4vmin;
	background: #fff;
	box-shadow: inset 1px 1px 15px 0 rgba(0 0 0 / 0.4);
	overflow-y: scroll;
}

.wrap:hover .overlay {
	transform: translateX(-60vmin);
}
.wrap:hover .image-content {
	width: 30vmin;
}
.wrap:hover .overlay-content {
	border: none;
	transition-delay: 0.2s;
	transform: translateX(60vmin);
}
.wrap:hover .dots {
	transform: translateX(1rem);
}
.wrap:hover .dots .dot {
	background: white;
}

/* Animations and timing delays */
.animate {
	animation-duration: 0.7s;
	animation-timing-function: cubic-bezier(0.26, 0.53, 0.74, 1.48);
	animation-fill-mode: backwards;
}
/* Pop In */
.pop {
	animation-name: pop;
}
@keyframes pop {
	0% {
		opacity: 0;
		transform: scale(0.5, 0.5);
	}
	100% {
		opacity: 1;
		transform: scale(1, 1);
	}
}

/* Slide In */
.slide {
	animation-name: slide;
}
@keyframes slide {
	0% {
		opacity: 0;
		transform: translate(4em, 0);
	}
	100% {
		opacity: 1;
		transform: translate(0, 0);
	}
}

/* Slide Left */
.slide-left {
	animation-name: slide-left;
}
@keyframes slide-left {
	0% {
		opacity: 0;
		transform: translate(-40px, 0);
	}
	100% {
		opacity: 1;
		transform: translate(0, 0);
	}
}

.slide-up {
	animation-name: slide-up;
}
@keyframes slide-up {
	0% {
		opacity: 0;
		transform: translateY(3em);
	}
	100% {
		opacity: 1;
		transform: translateY(0);
	}
}

.delay-1 {
	animation-delay: 0.3s;
}
.delay-2 {
	animation-delay: 0.6s;
}
.delay-3 {
	animation-delay: 0.9s;
}
.delay-4 {
	animation-delay: 1.2s;
}
.delay-5 {
	animation-delay: 1.5s;
}
.delay-6 {
	animation-delay: 1.8s;
}
.delay-7 {
	animation-delay: 2.1s;
}
.delay-8 {
	animation-delay: 2.4s;
}

.cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(48%, 1fr)); /* Dos cartas por fila */
    gap: 20px; /* Espacio entre las cartas */
}

@media (max-width: 768px) {
    .cards-container {
        grid-template-columns: 1fr; /* Una carta por fila en dispositivos móviles */
    }
}


</style>

<?php

    $productos_por_pagina = 6;

    $total_productos = count($productos);

    $total_paginas = ceil($total_productos / $productos_por_pagina);


    $pagina_actual = isset($_GET['page']) ? intval($_GET['page']) : 1;


    $inicio = ($pagina_actual - 1) * $productos_por_pagina;

    $productos = array_slice($productos, $inicio, $productos_por_pagina);
?>


<div class="list_agri">
    <div class="mt-5">
        <!-- Formulario de búsqueda -->
        <form class="input-group mb-3" method="post" action="<?php echo base_url('index.php/SinLog/buscarProduAgricultores'); ?>">
            <input type="text" class="form-control" name="buscar" placeholder="Buscar productos">
            <div class="input-group-append">
                <button type="submit" class="btn btn-primary">Buscar</button>
            </div>
        </form>
    </div>
    <div class="listagri cards-container">
        <?php foreach ($productos as $producto): ?>
            <div class="wrap animate pop"> <!-- Agrega las clases animate y pop aquí -->
                <div class="overlay">
                    <div class="overlay-content animate slide-left delay-2"> <!-- Agrega las clases animate y slide-left aquí -->
                        <!-- <h1 id="agricultor" class="animate slide-left pop delay-4"><?php echo $agricultor->nombre . ' ' . $agricultor->apellido; ?></h1> Agrega las clases animate, slide-left, pop y delay-4 aquí -->
                        <p id="textos_agri" class="animate slide-left pop delay-5" style="color: white; margin-bottom: 2.5rem;">AGRICULTOR: <em>Lecturaleza</em></p> <!-- Agrega las clases animate, slide-left, pop y delay-5 aquí -->
                    </div>
                    <div class="image-content animate slide delay-5"></div> <!-- Agrega las clases animate, slide y delay-5 aquí -->
                    <div class="dots animate">
                        <div class="dot animate slide-up delay-6"></div>
                        <div class="dot animate slide-up delay-7"></div>
                        <div class="dot animate slide-up delay-8"></div>
                    </div>
                </div>
                <div class="text">
                    <!-- Contenido de la carta -->
                    <p class="text-muted text-sm"><b>Precio:
                        </b><?php echo $producto->precio_venta; ?></p>
                    <p class="text-muted text-sm"><b>Cantidad Disponible:
                        </b><?php echo $producto->cantidad_disponible; ?></p>
                    <p class="text-muted text-sm"><b>Fecha Vencimiento
                        </b><?php echo $producto->fecha_vencimiento; ?></p>
                    <p class="text-muted text-sm"><b>Tipo: </b><?php echo $producto->tipo; ?></p>
                    <p class="text-muted text-sm"><b>Estado: </b><?php echo $producto->estado; ?>
                    </p>
                    
                    <?php
                        if ($producto->img == null) {
                            ?>
                            <img src="<?php echo base_url(); ?><?php echo "/assets/distCliente/img/product/producto_sin_imagen.png" ?>"
                                alt="Producto sin foto" class="img-circle img-fluid">
                            <?php
                        } else {

                            ?>

                            <img src="<?php echo base_url(); ?><?php echo "/assets/distCliente/img/product/" . $producto->img ?>"
                                alt="Foto del producto" class="img-circle img-fluid">
                            <?php
                        }
                        ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <!-- Paginación -->
    <div class="card-footer">
        <nav aria-label="Contacts Page Navigation">
            <ul class="pagination justify-content-center m-0">
                <!-- Botón para la página anterior -->
                <?php if ($pagina_actual > 1): ?>
                    <li class="page-item"><a class="page-link" href="?page=<?php echo ($pagina_actual - 1); ?>">Anterior</a></li>
                <?php endif; ?>
    
                <!-- Botones para páginas específicas -->
                <?php for ($i = 1; $i <= $total_paginas; $i++): ?>
                    <li class="page-item <?php echo ($i === $pagina_actual) ? 'active' : ''; ?>"><a class="page-link" href="?page=<?php echo $i; ?>"><?php echo $i; ?></a></li>
                <?php endfor; ?>
    
                <!-- Botón para la página siguiente -->
                <?php if ($pagina_actual < $total_paginas): ?>
                    <li class="page-item"><a class="page-link" href="?page=<?php echo ($pagina_actual + 1); ?>">Siguiente</a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </div>
</div>


<?php
   $dataSidebar['session']= $session;
   $this->load->view('layoutsCliente/footer', $dataSidebar);
?>