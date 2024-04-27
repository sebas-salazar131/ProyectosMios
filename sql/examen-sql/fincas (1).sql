-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-11-2023 a las 18:03:55
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
-- Base de datos: `fincas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cultivos`
--

CREATE TABLE `cultivos` (
  `id_cultivo` int(20) NOT NULL,
  `nombre_cultivo` varchar(50) DEFAULT NULL,
  `fecha_siembre` date DEFAULT NULL,
  `fecha_cosecha` date DEFAULT NULL,
  `cant_disponible` int(50) DEFAULT NULL,
  `tipo` enum('platanos','aguacate','cafe') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cultivos`
--

INSERT INTO `cultivos` (`id_cultivo`, `nombre_cultivo`, `fecha_siembre`, `fecha_cosecha`, `cant_disponible`, `tipo`) VALUES
(1, 'aguacate', '2023-11-02', '2023-11-30', 7, 'aguacate'),
(2, 'platano verde', '2023-11-03', '0000-00-00', 8, 'platanos'),
(3, 'platano maduro ', '2023-11-02', '2023-11-30', 7, 'platanos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fincas`
--

CREATE TABLE `fincas` (
  `id_finca` int(20) NOT NULL,
  `nombre_finca` varchar(50) DEFAULT NULL,
  `id_ubicacion` int(20) DEFAULT NULL,
  `cant_lotes` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fincas`
--

INSERT INTO `fincas` (`id_finca`, `nombre_finca`, `id_ubicacion`, `cant_lotes`) VALUES
(1, 'romelia', 2, '2'),
(2, 'palmas', 1, '3'),
(3, 'playas', 2, '1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fincas_lote`
--

CREATE TABLE `fincas_lote` (
  `id_finca` int(20) NOT NULL,
  `id_lote` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fincas_lote`
--

INSERT INTO `fincas_lote` (`id_finca`, `id_lote`) VALUES
(2, 1),
(2, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotes`
--

CREATE TABLE `lotes` (
  `id_lote` int(20) NOT NULL,
  `id_cultivo` int(20) DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `cant_plantada` int(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lotes`
--

INSERT INTO `lotes` (`id_lote`, `id_cultivo`, `descripcion`, `cant_plantada`) VALUES
(1, 2, 'buena cosecha', 3),
(2, 3, 'se puede mejorar', 2),
(3, 1, 'mala cosecha', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion`
--

CREATE TABLE `produccion` (
  `id_lote` int(20) DEFAULT NULL,
  `id_cultivo` int(20) DEFAULT NULL,
  `cant_produccion_obtenida` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `produccion`
--

INSERT INTO `produccion` (`id_lote`, `id_cultivo`, `cant_produccion_obtenida`) VALUES
(1, 2, 2),
(3, 1, 1),
(2, 3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones`
--

CREATE TABLE `ubicaciones` (
  `id_ubicacion` int(20) NOT NULL,
  `ciudad` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ubicaciones`
--

INSERT INTO `ubicaciones` (`id_ubicacion`, `ciudad`) VALUES
(1, 'pereira'),
(2, 'bogota'),
(3, 'cali');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(20) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `nombre_usuario` varchar(50) DEFAULT NULL,
  `contrasenia` varchar(50) DEFAULT NULL,
  `rol` enum('Superadministrador','Propietario') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `telefono`, `nombre_usuario`, `contrasenia`, `rol`) VALUES
(1, 'sebas', 'garcia', '444', 'sebabass', '555', 'Propietario'),
(2, 'pepito', 'perez', '333', 'pepas', '555', 'Propietario'),
(3, 'samuel', 'goitia', '666', 'samu', '777', 'Superadministrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_finca`
--

CREATE TABLE `usuario_finca` (
  `id_usuario` int(20) NOT NULL,
  `id_finca` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_finca`
--

INSERT INTO `usuario_finca` (`id_usuario`, `id_finca`) VALUES
(1, 1),
(1, 3),
(2, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  ADD PRIMARY KEY (`id_cultivo`);

--
-- Indices de la tabla `fincas`
--
ALTER TABLE `fincas`
  ADD PRIMARY KEY (`id_finca`),
  ADD KEY `id_ubicacion` (`id_ubicacion`);

--
-- Indices de la tabla `fincas_lote`
--
ALTER TABLE `fincas_lote`
  ADD PRIMARY KEY (`id_finca`,`id_lote`),
  ADD KEY `id_lote` (`id_lote`);

--
-- Indices de la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`id_lote`),
  ADD KEY `id_cultivo` (`id_cultivo`);

--
-- Indices de la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD KEY `id_lote` (`id_lote`),
  ADD KEY `id_cultivo` (`id_cultivo`);

--
-- Indices de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD PRIMARY KEY (`id_ubicacion`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `usuario_finca`
--
ALTER TABLE `usuario_finca`
  ADD PRIMARY KEY (`id_usuario`,`id_finca`),
  ADD KEY `id_finca` (`id_finca`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  MODIFY `id_cultivo` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `fincas`
--
ALTER TABLE `fincas`
  MODIFY `id_finca` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `lotes`
--
ALTER TABLE `lotes`
  MODIFY `id_lote` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  MODIFY `id_ubicacion` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `fincas`
--
ALTER TABLE `fincas`
  ADD CONSTRAINT `fincas_ibfk_1` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicaciones` (`id_ubicacion`);

--
-- Filtros para la tabla `fincas_lote`
--
ALTER TABLE `fincas_lote`
  ADD CONSTRAINT `fincas_lote_ibfk_1` FOREIGN KEY (`id_finca`) REFERENCES `fincas` (`id_finca`),
  ADD CONSTRAINT `fincas_lote_ibfk_2` FOREIGN KEY (`id_lote`) REFERENCES `lotes` (`id_lote`);

--
-- Filtros para la tabla `lotes`
--
ALTER TABLE `lotes`
  ADD CONSTRAINT `lotes_ibfk_1` FOREIGN KEY (`id_cultivo`) REFERENCES `cultivos` (`id_cultivo`);

--
-- Filtros para la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD CONSTRAINT `produccion_ibfk_1` FOREIGN KEY (`id_lote`) REFERENCES `lotes` (`id_lote`),
  ADD CONSTRAINT `produccion_ibfk_2` FOREIGN KEY (`id_cultivo`) REFERENCES `cultivos` (`id_cultivo`);

--
-- Filtros para la tabla `usuario_finca`
--
ALTER TABLE `usuario_finca`
  ADD CONSTRAINT `usuario_finca_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `usuario_finca_ibfk_2` FOREIGN KEY (`id_finca`) REFERENCES `fincas` (`id_finca`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
