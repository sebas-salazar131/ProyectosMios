-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-06-2023 a las 15:38:51
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
-- Base de datos: `agroecologia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agricultores`
--

CREATE TABLE `agricultores` (
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `telefono` int(11) NOT NULL,
  `ubicacion` varchar(255) NOT NULL,
  `producto` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agricultores`
--

INSERT INTO `agricultores` (`nombre`, `apellido`, `telefono`, `ubicacion`, `producto`) VALUES
('morales', 'dfvgfd', 43534, 'senita', 'cebolla'),
('gerg', 'sebas', 54654, 'sena', 'remolacha');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja`
--

CREATE TABLE `caja` (
  `id` int(100) NOT NULL,
  `producto` varchar(255) NOT NULL,
  `cantidad` int(200) NOT NULL,
  `precio` int(200) NOT NULL,
  `recibido` int(200) NOT NULL,
  `devuelta` int(200) NOT NULL,
  `total` int(200) NOT NULL,
  `fecha` varchar(100) NOT NULL,
  `estado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `caja`
--

INSERT INTO `caja` (`id`, `producto`, `cantidad`, `precio`, `recibido`, `devuelta`, `total`, `fecha`, `estado`) VALUES
(1, 'cebolla', 4, 546, 5000, 2816, 2184, '', 'no activo'),
(2, 'remolacha', 3, 567, 4000, 2299, 1701, '', 'no activo'),
(3, 'cebolla', 4, 546, 200000, 197816, 2184, '', 'no activo'),
(4, 'maracuya', 5, 120000, 2000000, 1400000, 600000, '', 'no activo'),
(5, 'papa', 6, 564, 30000, 26616, 3384, '', 'no activo'),
(6, 'cebolla', 3, 546, 3000, 1362, 1638, '', 'activo'),
(7, 'cebolla', 3, 546, 3300, 1662, 1638, '', 'activo'),
(8, 'cebolla', 4, 546, 4000, 1816, 2184, '', 'activo'),
(9, 'cebolla', 2, 546, 4000, 2908, 1092, '', 'no activo'),
(10, 'tyj', 3, 666, 3333, 1335, 1998, '', 'activo'),
(11, 'tyj', 4, 666, 400000, 397336, 2664, '', 'activo'),
(12, 'cebolla', 3, 546, 5000, 3362, 1638, '', 'activo'),
(13, 'papa', 2, 564, 4000, 2872, 1128, '', 'activo'),
(14, 'papa', 4, 564, 5000, 2744, 2256, '29-06-23', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(200) NOT NULL,
  `producto` varchar(200) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `costo` int(200) NOT NULL,
  `precio` int(200) NOT NULL,
  `cantidad_inventario` int(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `producto`, `descripcion`, `costo`, `precio`, `cantidad_inventario`) VALUES
(45, 'tyj', 'tjyj', 546, 666, 5),
(111, 'remolacha', 'ghj', 456, 567, 5),
(112, 'maracuya', 'la maracuya es muy buena con azucar', 100000, 120000, 6),
(444, 'cebolla', 'srth', 456, 546, 546),
(555, 'papa', 'dfsbh', 34564, 564, 452);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registrar`
--

CREATE TABLE `registrar` (
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `telefono` int(20) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `contrasenia` varchar(20) NOT NULL,
  `sexo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registrar`
--

INSERT INTO `registrar` (`nombre`, `apellido`, `telefono`, `correo`, `contrasenia`, `sexo`) VALUES
('earge', 'earge', 234234, 'jdfg@dgbgfd.com', 'tyjyu', 'masculino'),
('sebas', 'garciqa', 4353, 'jgarca@jdfgd.com', 'tyjyu', 'personalizado'),
('Juan sebastian', 'garcia salazar', 2147483647, 'jgarciasalazar72@gmail.c', 'bfgb', 'masculino'),
('Juan sebastian', 'garcia salazar', 2147483647, 'jgarciasalazar72@gmail.com', 'bfgb', 'masculino'),
('vfdv', 'fdvdf', 4345, 'jsgarcia728@misena.e', 'erge', 'masculino'),
('fwef', 'regere', 4344, 'ka7aam+khgpekjje@gmail.com', 'trge', 'masculino');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agricultores`
--
ALTER TABLE `agricultores`
  ADD PRIMARY KEY (`telefono`);

--
-- Indices de la tabla `caja`
--
ALTER TABLE `caja`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`,`producto`);

--
-- Indices de la tabla `registrar`
--
ALTER TABLE `registrar`
  ADD PRIMARY KEY (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `caja`
--
ALTER TABLE `caja`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
