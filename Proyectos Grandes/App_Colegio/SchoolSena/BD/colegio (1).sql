-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-06-2023 a las 01:23:54
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
-- Base de datos: `colegio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `cedula_estu` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha` varchar(100) NOT NULL,
  `materia` varchar(100) NOT NULL,
  `asistencia` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asistencia`
--

INSERT INTO `asistencia` (`cedula_estu`, `nombre`, `apellido`, `fecha`, `materia`, `asistencia`) VALUES
('12', 'sebas', 'milo', '2023-06-20', '', 'Asistio'),
('1233', 'felipe', 'miranda', '2023-06-20', '', 'No Asistio'),
('2323', 'camilo', 'sexto', '2023-06-20', '', 'Asistio'),
('11', 'lopex', 'peña', '2023-06-20', '', 'Asistio'),
('44', 'kilo', 'ñomi', '2023-06-20', '', 'Asistio'),
('1225', 'CASEMIRO', 'MOSQUERA', '2023-06-20', '', 'Asistio'),
('1225', 'casemiro', 'marulanda', '2023-06-20', '', 'No Asistio'),
('2323', 'mirella', 'kiralla', '2023-06-20', '', 'No Asistio'),
('12', 'sebas', 'milo', '2023-06-20', '', 'Asistio'),
('1233', 'felipe', 'miranda', '2023-06-20', '', 'Asistio'),
('2323', 'camilo', 'sexto', '2023-06-20', '', 'Asistio'),
('11', 'lopex', 'peña', '2023-06-20', '', 'Asistio'),
('44', 'kilo', 'ñomi', '2023-06-20', '', 'No Asistio'),
('1225', 'CASEMIRO', 'MOSQUERA', '2023-06-20', '', 'No Asistio'),
('1225', 'casemiro', 'marulanda', '2023-06-20', '', 'No Asistio'),
('2323', 'mirella', 'kiralla', '2023-06-20', '', 'No Asistio'),
('12', 'sebas', 'milo', '2023-06-21', 'Matematicas', 'Asistio'),
('1233', 'felipe', 'miranda', '2023-06-21', 'Matematicas', 'Asistio'),
('2323', 'camilo', 'sexto', '2023-06-21', 'Matematicas', 'Asistio'),
('11', 'lopex', 'peña', '2023-06-21', 'Matematicas', 'No Asistio'),
('44', 'kilo', 'ñomi', '2023-06-21', 'Matematicas', 'No Asistio'),
('1225', 'CASEMIRO', 'MOSQUERA', '2023-06-21', 'Matematicas', 'No Asistio'),
('1225', 'casemiro', 'marulanda', '2023-06-21', 'Matematicas', 'Asistio'),
('2323', 'mirella', 'kiralla', '2023-06-21', 'Matematicas', 'Asistio'),
('12', 'sebas', 'milo', '2023-06-21', 'Informatica', 'Asistio'),
('1233', 'felipe', 'miranda', '2023-06-21', 'Informatica', 'Asistio'),
('2323', 'camilo', 'sexto', '2023-06-21', 'Informatica', 'Asistio'),
('11', 'lopex', 'peña', '2023-06-21', 'Informatica', 'Asistio'),
('44', 'kilo', 'ñomi', '2023-06-21', 'Informatica', 'Asistio'),
('1225', 'CASEMIRO', 'MOSQUERA', '2023-06-21', 'Informatica', 'Asistio'),
('1225', 'casemiro', 'marulanda', '2023-06-21', 'Informatica', 'Asistio'),
('2323', 'mirella', 'kiralla', '2023-06-21', 'Informatica', 'Asistio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `espaniol`
--

CREATE TABLE `espaniol` (
  `cedula` varchar(100) NOT NULL,
  `nota1` double NOT NULL,
  `nota2` double NOT NULL,
  `nota3` double NOT NULL,
  `promedio` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `espaniol`
--

INSERT INTO `espaniol` (`cedula`, `nota1`, `nota2`, `nota3`, `promedio`) VALUES
('1225', 0, 0, 5, 1.6666666666666667),
('2323', 1, 3, 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `cedula` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `edad` int(100) NOT NULL,
  `correo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`cedula`, `nombre`, `apellido`, `edad`, `correo`) VALUES
('12', 'sebas', 'milo', 23, 'asaksa@hjsas'),
('1233', 'felipe', 'miranda', 20, 'sasqa@ljsa'),
('2323', 'camilo', 'sexto', 50, 'ksjaksa@hkjsas'),
('11', 'lopex', 'peña', 23, 'sasas@ksas'),
('44', 'kilo', 'ñomi', 32, 'dsdsd@ksdds'),
('1225', 'CASEMIRO', 'MOSQUERA', 90, 'KJSAS@KSJAS'),
('1225', 'casemiro', 'marulanda', 80, 'sasa@ksasa'),
('2323', 'mirella', 'kiralla', 20, 'sasas@sasa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `informatica`
--

CREATE TABLE `informatica` (
  `cedula` varchar(100) NOT NULL,
  `nota1` double NOT NULL,
  `nota2` double NOT NULL,
  `nota3` double NOT NULL,
  `promedio` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `informatica`
--

INSERT INTO `informatica` (`cedula`, `nota1`, `nota2`, `nota3`, `promedio`) VALUES
('1225', 1, 2, 5, 2.6666666666666665),
('2323', 2, 2, 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `matematicas`
--

CREATE TABLE `matematicas` (
  `cedula` varchar(100) NOT NULL,
  `nota1` double NOT NULL,
  `nota2` double NOT NULL,
  `nota3` double NOT NULL,
  `promedio` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `matematicas`
--

INSERT INTO `matematicas` (`cedula`, `nota1`, `nota2`, `nota3`, `promedio`) VALUES
('12', 2, 1, 1, 1.3333333333333333),
('12', 2, 1, 1, 1.3333333333333333),
('1233', 3, 4, 4, 3.6666666666666665),
('1233', 3, 5, 5, 4.333333333333333),
('44', 1, 3, 3, 2.3333333333333335),
('1225', 5, 5, 5, 5),
('1225', 5, 5, 5, 5),
('2323', 2, 1, 1, 1.3333333333333333);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `usuario` varchar(100) NOT NULL,
  `contrasenia` int(100) NOT NULL,
  `materia` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`usuario`, `contrasenia`, `materia`) VALUES
('Sebastian', 2020, 'Matematicas'),
('Garcia', 123, 'Español'),
('Oscar', 11, 'Informatica');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
