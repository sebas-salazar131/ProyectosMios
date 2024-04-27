-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-04-2024 a las 23:01:50
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lecturaleza`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agricultores`
--

CREATE TABLE `agricultores` (
  `id_agricultor` int(10) NOT NULL,
  `cedula` varchar(50) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT NULL,
  `foto` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agricultores`
--

INSERT INTO `agricultores` (`id_agricultor`, `cedula`, `nombre`, `apellido`, `direccion`, `telefono`, `estado`, `foto`) VALUES
(1, '1033', 'Juana Maria', 'Quiceno', 'Santa Rosa', '3012528961', 'ACTIVO', 'icon_pio.webp'),
(2, '1002', 'Jose', 'Angarita', 'Tu corazon', '311', 'INACTIVO', '2peras.png'),
(3, '1213', 'asfa', 'safas', '13', '33', 'INACTIVO', 'icon_pio.webp'),
(4, '123', 'asd', 'asfass333ASAS', 'asfasf', '2313', 'INACTIVO', 'icon_pio.webp'),
(6, '14586936', 'Juan Esteban', 'Mari ', 'Sena', '3107029541', 'ACTIVO', 'onebanana.jpg'),
(7, '4567894', 'juan esteban', 'marin arboleda', 'calle 110', '310702', 'INACTIVO', NULL),
(8, '10047700', 'juanes', 'marin arboleda', 'calle 110', '777777777777777777', 'INACTIVO', NULL),
(9, '2', 'prueba', 'prueba', 'prueba', '333', 'ACTIVO', 'grafic.png'),
(10, '1', 'Angarita', 'MontañexSS', 'El monte', '31234134', 'ACTIVO', '2peras.png'),
(23, '1', 'Angarita', 'MontañexSS', 'El monte', '31234134', 'INACTIVO', '2peras.png'),
(24, '1', 'Angarita', 'MontañexSS', 'El monte', '31234134', 'INACTIVO', '2peras.png'),
(25, '1', 'Angarita', 'MontañexSS', 'El monte', '31234134', 'INACTIVO', '2peras.png'),
(26, '1', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'INACTIVO', '2peras.png'),
(27, '1', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'INACTIVO', '2peras.png'),
(28, '1', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'INACTIVO', '2peras.png'),
(29, '1', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'INACTIVO', '2peras.png'),
(30, '1', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'INACTIVO', '2peras.png'),
(31, '1', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'PRUEBA', 'INACTIVO', '2peras.png'),
(32, '1', 'sds', 'sfsf', 'sfsf', 'sfsf', 'INACTIVO', '2peras.png'),
(42, '198984', 'miguel', 'antia', 'el campo', '30021569', 'ACTIVO', 'Captura de pantalla 2024-04-16 143709.png'),
(43, '76878465', 'miguel', 'antia', 'el campo', '30021569', 'ACTIVO', 'Captura de pantalla 2024-04-16 143647.png'),
(44, '786888', 'miguel', 'antia', 'el campo', '30021569', 'ACTIVO', 'grafic.png'),
(45, '45345345', 'miguel', 'antia', 'el campo', '30021569', 'ACTIVO', 'grafic.png'),
(46, '68970980', 'miguel', 'antia', 'el campo', '30021569', 'ACTIVO', 'chartjs.png'),
(47, '456076887', 'miguel', 'antia', 'el campo', '30021569', 'ACTIVO', 'Captura de pantalla 2024-04-16 143647.png'),
(48, '63893853', 'miguel', 'antia', 'el campo', '30021569', 'ACTIVO', 'grafic.png'),
(49, '79789', 'miguel', 'antia', 'el campo', '30021569', 'ACTIVO', 'grafic.png'),
(50, '7898465345', 'miguel', 'antia', 'el campo', '30021569', 'ACTIVO', 'grafic.png'),
(51, '89342422', 'CAOIAD', 'montoya', 'dsadadaw', '12232', 'ACTIVO', 'WhatsApp Image 2024-04-15 at 6.37.28 PM.jpeg'),
(52, '89342421', 'aguacate', 'DSAKDH', 'dsadadaw', '12232', 'ACTIVO', 'WhatsApp Image 2024-04-15 at 6.37.28 PM.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agricultor_producto`
--

CREATE TABLE `agricultor_producto` (
  `id_agricultor` int(10) NOT NULL,
  `id_producto` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agricultor_producto`
--

INSERT INTO `agricultor_producto` (`id_agricultor`, `id_producto`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_usuario` int(20) NOT NULL,
  `id_producto` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id_usuario`, `id_producto`) VALUES
(2, 4),
(2, 8),
(2, 9),
(2, 15),
(2, 16),
(2, 27),
(4, 2),
(4, 4),
(19, 2),
(46, 2),
(46, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_factura`
--

CREATE TABLE `detalle_factura` (
  `id_detalle_factura` int(100) NOT NULL,
  `id_factura` int(10) DEFAULT NULL,
  `id_pedido` int(10) DEFAULT NULL,
  `dinero_recibido` int(30) DEFAULT NULL,
  `cambio` int(30) DEFAULT NULL,
  `total` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_factura`
--

INSERT INTO `detalle_factura` (`id_detalle_factura`, `id_factura`, `id_pedido`, `dinero_recibido`, `cambio`, `total`) VALUES
(1, 100, 2, 3000, 1000, 6000),
(2, 100, 2, 3000, 1000, 6000),
(3, 100, 2, 3000, 1000, 6000),
(4, 100, 2, 3000, 1000, 6000),
(5, 104, 2, 3000, 967, 2033),
(6, 105, 2, 20002, 17969, 2033),
(7, 106, 42, 40000, 34389, 5611),
(8, 107, 44, 20000, 18389, 1611),
(9, 108, 2, 3000, 967, 2033),
(10, 109, 2, 5000, 2967, 2033),
(11, 110, 2, 3000, 967, 2033),
(12, 111, 2, 3000, 967, 2033),
(13, 112, 2, 3000, 967, 2033),
(14, 113, 2, 3000, 967, 2033),
(15, 114, 42, 6000, 389, 5611),
(16, 115, 42, 6000, 389, 5611),
(17, 116, 2, 4000, 0, 0),
(18, 117, 2, 4000, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envios`
--

CREATE TABLE `envios` (
  `id_envio` int(10) NOT NULL,
  `id_factura` int(10) DEFAULT NULL,
  `fecha_entrega` date NOT NULL DEFAULT curdate(),
  `estado_entrega` enum('ENTREGADO','NO ENTREGADO','EN CAMINO') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `envios`
--

INSERT INTO `envios` (`id_envio`, `id_factura`, `fecha_entrega`, `estado_entrega`) VALUES
(1000, 100, '2023-10-30', 'NO ENTREGADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `id_factura` int(10) NOT NULL,
  `id_usuario` int(20) DEFAULT NULL,
  `fecha` date NOT NULL DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `facturas`
--

INSERT INTO `facturas` (`id_factura`, `id_usuario`, `fecha`) VALUES
(100, 1, '2023-10-30'),
(101, 37, '2024-04-19'),
(102, 4, '2024-04-19'),
(103, 4, '2024-04-19'),
(104, 1, '2024-04-19'),
(105, 1, '2024-04-19'),
(106, 4, '2024-04-19'),
(107, 4, '2024-04-19'),
(108, 1, '2024-04-19'),
(109, 1, '2024-04-19'),
(110, 1, '2024-04-19'),
(111, 1, '2024-04-19'),
(112, 1, '2024-04-19'),
(113, 1, '2024-04-19'),
(114, 4, '2024-04-19'),
(115, 4, '2024-04-19'),
(116, 1, '2024-04-19'),
(117, 1, '2024-04-19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `liquidacion_agrecultores`
--

CREATE TABLE `liquidacion_agrecultores` (
  `id_agricultor` int(10) DEFAULT NULL,
  `total_pago` int(50) DEFAULT NULL,
  `estado_pago` enum('FINIQUITO','EN PROCESO') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `liquidacion_agrecultores`
--

INSERT INTO `liquidacion_agrecultores` (`id_agricultor`, `total_pago`, `estado_pago`) VALUES
(1, 3000, 'EN PROCESO'),
(1, 3000, 'EN PROCESO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(10) NOT NULL,
  `id_producto` int(10) NOT NULL,
  `id_usuario` int(10) DEFAULT NULL,
  `fecha` date NOT NULL DEFAULT curdate(),
  `estado` enum('COMPRADO','EN PROCESO') DEFAULT NULL,
  `nombre_recibe` varchar(100) DEFAULT NULL,
  `cantidad_compra` int(50) DEFAULT NULL,
  `total_unitario` int(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_producto`, `id_usuario`, `fecha`, `estado`, `nombre_recibe`, `cantidad_compra`, `total_unitario`) VALUES
(2, 1, 1, '2024-04-18', 'COMPRADO', 'ert46', 3, 2000),
(2, 2, 1, '2024-04-18', 'COMPRADO', 'frre', 3, 33),
(42, 2, 4, '2024-04-19', 'COMPRADO', 'Carvajal', 1, 1111),
(42, 4, 4, '2024-04-19', 'COMPRADO', 'Carvajal', 1, 500),
(42, 5, 4, '2024-04-19', 'COMPRADO', 'Carvajal', 2, 1000),
(42, 8, 4, '2024-04-19', 'COMPRADO', 'Carvajal', 1, 3000),
(44, 2, 4, '2024-04-18', 'COMPRADO', 'Carvajal', 1, 1111),
(44, 4, 4, '2024-04-18', 'COMPRADO', 'Carvajal', 1, 500);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(10) NOT NULL,
  `id_agricultor` int(10) NOT NULL,
  `nombre_producto` varchar(50) DEFAULT NULL,
  `precio_venta` int(100) DEFAULT NULL,
  `cantidad_disponible` int(50) DEFAULT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `tipo` enum('Fruta','Verdura','Salsa','Granos','Lacteos') DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT NULL,
  `img` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `id_agricultor`, `nombre_producto`, `precio_venta`, `cantidad_disponible`, `descripcion`, `fecha_vencimiento`, `tipo`, `estado`, `img`) VALUES
(1, 0, 'papa', 2000, 35, 'peraasd', '2023-10-30', NULL, 'ACTIVO', '2peras.png'),
(2, 10, 'cebolla', 1111, 3, 'wrefgw', '2023-10-17', 'Fruta', 'ACTIVO', 'cebolla.jpg'),
(4, 10, 'fresas', 500, 13, 'skasas', '2023-11-15', NULL, 'ACTIVO', 'fresas.jpg'),
(5, 6, 'limon', 500, 17, 'dsadsa', '2023-11-13', 'Fruta', 'ACTIVO', 'limon.jpg'),
(8, 1, 'papa amarilla', 3000, 0, 'La papa es un tubérculo comestible que crece bajo la tierra. Su principal función es almacenar o acumular nutrientes. La planta requiere mucha humedad de forma regular. Responde bien a las temperaturas templadas, sufre cuando es excesiva y sobre todo cuando hay sequía.', '2023-11-21', 'Verdura', 'ACTIVO', 'papa.jpg'),
(9, 0, 'yogourt', 5000, 11, 'jsasa', '2023-11-21', 'Lacteos', 'ACTIVO', 'yogurt.jpg'),
(15, 0, 'Pera', 1500, 6, 'firbosa', '2023-11-23', 'Fruta', 'ACTIVO', 'descargar.jpg'),
(16, 1, 'Salsa de tomate', 3000, 10, 'salsa casera hecha a base de tomates recien cosechados por nuestros agricultores', '2023-11-30', 'Salsa', 'ACTIVO', 'Salsa-de-tomate-casera.jpg'),
(27, 6, 'gatomem', 40000, 500, 'gatomiau', '2023-11-29', NULL, 'INACTIVO', 'gatomeme.jpg'),
(49, 0, 'cabra manola', 5000000, 24, 'deslactosada', '2023-12-02', 'Lacteos', NULL, 'IMG_20200301_131814_502.jpg'),
(50, 6, 'cabra manola', 500000, 4, 'deslactosada', '2023-12-02', 'Lacteos', 'INACTIVO', 'WhatsApp Image 2021-03-24 at 10.01.42 PM (1).jpeg'),
(52, 0, 'quito', 50000, 10, 'wowwow', '2023-12-25', NULL, 'INACTIVO', '70895803_2468684150090801_45650803662258176_n.jpg'),
(53, 0, 'PRUEBA', 1, 1, 'PRUEBA', '2023-12-03', 'Verdura', 'INACTIVO', '2peras.png'),
(54, 0, 'PRUEBA', 1, 1, 'PRUEBA', '2023-12-03', 'Verdura', 'INACTIVO', '2peras.png'),
(55, 0, 'PRUEBA1', 1, 1, 'PRUEBA1', '2023-12-21', 'Verdura', 'INACTIVO', '2peras.png'),
(56, 0, 'PRUEBA2', 1, 1, '2', '2023-12-12', 'Verdura', 'INACTIVO', '2peras.png'),
(57, 2, 'Prueba Agricultor', 2000000, 4, 'Hola', '2024-04-13', NULL, 'ACTIVO', 'Good.jpg'),
(58, 2, 'Prueba Agricultor 2', 3000, 5, 'Hola 2', '2024-04-26', 'Fruta', 'ACTIVO', 'Captura de pantalla 2024-01-27 192950.png'),
(61, 1, 'Juana', 2147483647, 7, 'Juana Insana', '2024-04-19', 'Lacteos', 'ACTIVO', 'Juana_sucia.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(20) NOT NULL,
  `documento` char(15) DEFAULT NULL,
  `nombres` varchar(55) DEFAULT NULL,
  `apellidos` varchar(55) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `tipo` enum('ADMIN','CLIENTE') DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `img` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `documento`, `nombres`, `apellidos`, `email`, `password`, `tipo`, `estado`, `direccion`, `telefono`, `img`) VALUES
(1, '1002', 'Joses', 'Angaritas', 'mattar@gmail.com', '12345', 'ADMIN', 'ACTIVO', 'XDxs', '234', 'agriculture-logo.png'),
(2, '2232', 'carlos', 'sasa', 'juan12@gmail.com', '123', 'CLIENTE', 'ACTIVO', 'dadasda', '232', 'portada-foto-perfil-redes-sociales-consejos-810x540.jpg'),
(4, '6767', 'Carvajal', 'Medina', 'medina@gmail.com', '1234', 'CLIENTE', 'ACTIVO', 'carrera 7 ', '32232', 'descargar.jpg'),
(9, '1045756', 'juanes', 'Arboleda', 'juan@gmail.com', '123', 'ADMIN', 'ACTIVO', 'calle 20', '7777777', NULL),
(19, '1002', 'Jose ', 'Angarita ', 'Jose@gmail.com', '123', 'CLIENTE', 'ACTIVO', 'Carrera 11', '31150000', 'agriculture-logo.png'),
(25, '12345', 'Jhon', 'Mattar', 'Admin@gmail.com', '123', 'ADMIN', 'ACTIVO', 'la casa del admin ', '333333 ', NULL),
(37, '741', 'juanes', 'Arboleda', 'juan@gmail.com', '2010', 'CLIENTE', 'INACTIVO', 'calle 20', '301245', NULL),
(38, '42100444', 'juanes', 'Arboledas', 'j@gmail.com', '12332', 'CLIENTE', 'ACTIVO', 'calle 110', '301245', NULL),
(39, '1004780000', 'quito', 'Arboleda', 'juanes@gmail.com', '1041', 'ADMIN', 'INACTIVO', 'calle 80', '7777777', NULL),
(40, '7410', 'juanito', 'mendoza', 'juanes@mail.com', '102', 'CLIENTE', 'ACTIVO', 'calle 20', '301245', NULL),
(45, '3546435', 'david', 'bedoya', 'david@gmail.com', '12345', 'ADMIN', 'ACTIVO', 'la calle', '646885465', NULL),
(46, '1002', 'Prueba', 'Prueba', 'Prueba@gmail.com', '123', 'CLIENTE', 'ACTIVO', 'Sena', '3012528961', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `total_vendido` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `fecha`, `total_vendido`) VALUES
(1, '2024-04-18', NULL),
(5, '2024-04-19', 5611.00);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agricultores`
--
ALTER TABLE `agricultores`
  ADD PRIMARY KEY (`id_agricultor`);

--
-- Indices de la tabla `agricultor_producto`
--
ALTER TABLE `agricultor_producto`
  ADD PRIMARY KEY (`id_agricultor`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_usuario`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD PRIMARY KEY (`id_detalle_factura`),
  ADD KEY `id_factura` (`id_factura`),
  ADD KEY `id_pedido` (`id_pedido`);

--
-- Indices de la tabla `envios`
--
ALTER TABLE `envios`
  ADD PRIMARY KEY (`id_envio`),
  ADD KEY `id_factura` (`id_factura`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id_factura`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `liquidacion_agrecultores`
--
ALTER TABLE `liquidacion_agrecultores`
  ADD KEY `id_agricultor` (`id_agricultor`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agricultores`
--
ALTER TABLE `agricultores`
  MODIFY `id_agricultor` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  MODIFY `id_detalle_factura` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `envios`
--
ALTER TABLE `envios`
  MODIFY `id_envio` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1001;

--
-- AUTO_INCREMENT de la tabla `facturas`
--
ALTER TABLE `facturas`
  MODIFY `id_factura` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `agricultor_producto`
--
ALTER TABLE `agricultor_producto`
  ADD CONSTRAINT `agricultor_producto_ibfk_1` FOREIGN KEY (`id_agricultor`) REFERENCES `agricultores` (`id_agricultor`),
  ADD CONSTRAINT `agricultor_producto_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD CONSTRAINT `detalle_factura_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `facturas` (`id_factura`),
  ADD CONSTRAINT `detalle_factura_ibfk_2` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`);

--
-- Filtros para la tabla `envios`
--
ALTER TABLE `envios`
  ADD CONSTRAINT `envios_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `facturas` (`id_factura`);

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `liquidacion_agrecultores`
--
ALTER TABLE `liquidacion_agrecultores`
  ADD CONSTRAINT `liquidacion_agrecultores_ibfk_1` FOREIGN KEY (`id_agricultor`) REFERENCES `agricultores` (`id_agricultor`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
