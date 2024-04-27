-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-04-2024 a las 07:46:15
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
-- Base de datos: `agricultura`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `cedula` varchar(20) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL,
  `email` varchar(20) DEFAULT NULL,
  `pass` varchar(20) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO','','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admin`
--

INSERT INTO `admin` (`cedula`, `nombre`, `email`, `pass`, `estado`) VALUES
('1224', 'camilo', 'sasa@sasa', '1234', 'ACTIVO'),
('7878', 'carlos', 'mejia@jsas', '123', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agricultores`
--

CREATE TABLE `agricultores` (
  `cedula` varchar(20) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL,
  `apellido` varchar(30) DEFAULT NULL,
  `email` varchar(20) DEFAULT NULL,
  `pass` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agricultores`
--

INSERT INTO `agricultores` (`cedula`, `nombre`, `apellido`, `email`, `pass`, `telefono`, `estado`) VALUES
('098', 'kilo', 'y medio', 'dasda@sdasa', '222', '12', 'ACTIVO'),
('10009', 'sebas', 'yoyoou', 'gfjvj.q@j,vj,', '9999', '999', 'ACTIVO'),
('23232', 'Jose', 'Angarita', 'angarita@gmail.com', '123', '3232', 'ACTIVO'),
('3443', 'ramiro', 'peche', 'kila@wasa', '23', '121', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agricultor_cultivo`
--

CREATE TABLE `agricultor_cultivo` (
  `id_cultivo` int(20) NOT NULL,
  `id_agricultor` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agricultor_cultivo`
--

INSERT INTO `agricultor_cultivo` (`id_cultivo`, `id_agricultor`) VALUES
(102, '098'),
(103, '098');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cultivos`
--

CREATE TABLE `cultivos` (
  `id_cultivo` int(20) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL,
  `descripcion` varchar(20) DEFAULT NULL,
  `tipo` enum('VERDURAS','FRUTAS','GRANOS') DEFAULT NULL,
  `img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cultivos`
--

INSERT INTO `cultivos` (`id_cultivo`, `nombre`, `descripcion`, `tipo`, `img`) VALUES
(100, 'papa', 'asasas', 'VERDURAS', ''),
(101, 'yuca', 'pa sembra', 'VERDURAS', ''),
(102, 'fresas', 'muy buena ', 'FRUTAS', ''),
(103, 'PERAS', 'MUY DULCE', 'FRUTAS', ''),
(104, 'arroz', 'arrozito', 'GRANOS', ''),
(105, 'zanahoria', 'no me gusta', 'VERDURAS', ''),
(106, 'zanahoria', 'no me gusta', 'VERDURAS', ''),
(107, 'zanahoria', 'no me gusta', 'VERDURAS', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas`
--

CREATE TABLE `tareas` (
  `id_tarea` int(20) NOT NULL,
  `id_cultivo` int(20) DEFAULT NULL,
  `titulo` varchar(20) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` enum('Pendiente','Finalizado') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tareas`
--

INSERT INTO `tareas` (`id_tarea`, `id_cultivo`, `titulo`, `descripcion`, `estado`) VALUES
(2, 101, 'Pelar pap', 'todos los lida', 'Finalizado'),
(3, 100, 'pelar yuc', 'en la de pa', 'Pendiente'),
(4, 103, 'COSECHAR', 'PARA EL DIA 20 DE JU', 'Finalizado'),
(5, 100, 'recoger el', 'todos los dias', 'Pendiente'),
(6, 100, 'lavar p', 'ho', 'Finalizado'),
(7, 104, 'lavar el a', 'lavarlo cada 5 dias', 'Finalizado'),
(8, 104, 'lavar el a', 'lavarlo cada 5 dias', 'Finalizado'),
(9, 103, 'pelar guan', 'pela y pela', 'Finalizado'),
(10, 103, 'pelar guan', 'pela y pela', 'Finalizado'),
(11, 103, 'juas', 'juas', 'Finalizado'),
(12, 107, 'cosechar z', 'no me gusgta', 'Pendiente'),
(13, 107, 'hola', 'no me gusgta', 'Pendiente'),
(14, 100, 'cosechar zanahoria', 'aebsgr', 'Pendiente'),
(15, 100, 'cosechar zana', 'aeb', 'Pendiente'),
(16, 100, 'cosechar zanahoria', '<sdvfa', 'Pendiente'),
(17, 100, 'cosechar zanahoria', 'sdvfa', 'Pendiente'),
(18, 104, 'cosechar zanahoria', 'sdvsv', 'Pendiente'),
(19, 100, 'cosechar zanahoria', 'wfre', 'Pendiente'),
(20, 100, 'cosechar zanahoria', 'zdzbsrg', 'Pendiente'),
(21, 100, 'cosechar ', 'egtt', 'Pendiente'),
(22, 102, 'cultivar fresa', 'esbuena', 'Finalizado'),
(23, 102, 'exportar', 'rapido', 'Finalizado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea_agricultor`
--

CREATE TABLE `tarea_agricultor` (
  `id_agricultor` varchar(20) NOT NULL,
  `id_tarea` int(20) NOT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `evidencia` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarea_agricultor`
--

INSERT INTO `tarea_agricultor` (`id_agricultor`, `id_tarea`, `fecha_inicio`, `fecha_fin`, `evidencia`) VALUES
('098 ', 3, '2023-11-10', '0000-00-00', ''),
('098', 4, '2024-04-11', '2024-04-25', ''),
('098 ', 6, '2023-11-10', '0000-00-00', ''),
('098', 10, '2024-04-23', '2024-04-24', ''),
('098', 21, '2024-04-09', '2024-04-16', ''),
('098', 22, '2024-04-17', '2024-04-26', ''),
('098', 23, '2024-04-02', '2024-04-09', ''),
('23232 ', 3, '2023-11-10', '2023-11-30', ''),
('23232 ', 4, '2023-11-10', '2023-11-20', ''),
('23232 ', 5, '2023-11-10', '2023-11-24', ''),
('23232 ', 6, '2023-11-10', '2023-11-30', ''),
('23232 ', 8, '2023-11-10', '2023-11-24', ''),
('3443 ', 4, '2023-11-13', '2023-11-13', ''),
('3443 ', 5, '2023-11-10', '2023-11-30', ''),
('3443 ', 11, '2023-11-13', '2023-11-13', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`cedula`);

--
-- Indices de la tabla `agricultores`
--
ALTER TABLE `agricultores`
  ADD PRIMARY KEY (`cedula`);

--
-- Indices de la tabla `agricultor_cultivo`
--
ALTER TABLE `agricultor_cultivo`
  ADD PRIMARY KEY (`id_cultivo`,`id_agricultor`),
  ADD KEY `id_agricultor` (`id_agricultor`);

--
-- Indices de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  ADD PRIMARY KEY (`id_cultivo`);

--
-- Indices de la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD PRIMARY KEY (`id_tarea`),
  ADD KEY `id_cultivo` (`id_cultivo`);

--
-- Indices de la tabla `tarea_agricultor`
--
ALTER TABLE `tarea_agricultor`
  ADD PRIMARY KEY (`id_agricultor`,`id_tarea`),
  ADD KEY `id_tarea` (`id_tarea`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  MODIFY `id_cultivo` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT de la tabla `tareas`
--
ALTER TABLE `tareas`
  MODIFY `id_tarea` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `agricultor_cultivo`
--
ALTER TABLE `agricultor_cultivo`
  ADD CONSTRAINT `agricultor_cultivo_ibfk_1` FOREIGN KEY (`id_cultivo`) REFERENCES `cultivos` (`id_cultivo`),
  ADD CONSTRAINT `agricultor_cultivo_ibfk_2` FOREIGN KEY (`id_agricultor`) REFERENCES `agricultores` (`cedula`);

--
-- Filtros para la tabla `tareas`
--
ALTER TABLE `tareas`
  ADD CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`id_cultivo`) REFERENCES `cultivos` (`id_cultivo`);

--
-- Filtros para la tabla `tarea_agricultor`
--
ALTER TABLE `tarea_agricultor`
  ADD CONSTRAINT `tarea_agricultor_ibfk_1` FOREIGN KEY (`id_agricultor`) REFERENCES `agricultores` (`cedula`),
  ADD CONSTRAINT `tarea_agricultor_ibfk_2` FOREIGN KEY (`id_tarea`) REFERENCES `tareas` (`id_tarea`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
