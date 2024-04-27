-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-11-2023 a las 00:02:25
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
-- Base de datos: `biblioteca`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autores`
--

CREATE TABLE `autores` (
  `id_autor` char(10) NOT NULL,
  `nombres` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `nacionalidad` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `autores`
--

INSERT INTO `autores` (`id_autor`, `nombres`, `apellidos`, `nacionalidad`) VALUES
('A0001', 'J.R.R.', 'Tolkien', 'Brit?nico'),
('A0002', 'Gabriel Garc?a', 'M?rquez', 'Colombiano'),
('A0003', 'George', 'Orwell', 'Brit?nico'),
('A0004', 'J.K.', 'Rowling', 'Brit?nico'),
('A0005', 'Harper', 'Lee', 'Estadounidense'),
('A0006', 'Guido', 'van Rossum', 'Neerland?s');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` char(10) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`, `descripcion`) VALUES
('C0001', 'Fantas?a', 'Historias de mundos imaginarios y seres m?gicos.'),
('C0002', 'Realismo m?gico', 'Narrativas que mezclan lo real y lo fant?stico.'),
('C0003', 'Distop?a', 'Representaci?n de sociedades futuras opresivas.'),
('C0004', 'Magia', 'Libros centrados en el uso de la magia.'),
('C0005', 'Cl?sico', 'Obras literarias de reconocido valor y relevancia.'),
('C0006', 'Programaci?n', 'Libros relacionados con programaci?n.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id_ciudad` char(10) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id_ciudad`, `nombre`) VALUES
('CIU0001', 'Nueva York'),
('CIU0002', 'Par?s'),
('CIU0003', 'Tokio'),
('CIU0004', 'S?dney'),
('CIU0005', 'Roma');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_factura`
--

CREATE TABLE `detalle_factura` (
  `num_factura` char(10) NOT NULL,
  `codigo` char(10) NOT NULL,
  `cantidad` int(20) DEFAULT NULL,
  `precio_venta` float(5,2) DEFAULT NULL,
  `total` float(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_factura`
--

INSERT INTO `detalle_factura` (`num_factura`, `codigo`, `cantidad`, `precio_venta`, `total`) VALUES
('F0001', 'L0001', 2, 15.00, 30.00),
('F0001', 'L0002', 1, 18.00, 18.00),
('F0002', 'L0003', 3, 22.50, 67.50),
('F0003', 'L0004', 1, 25.00, 25.00),
('F0004', 'L0005', 2, 12.00, 24.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envios`
--

CREATE TABLE `envios` (
  `id_envio` char(10) NOT NULL,
  `id_factura` char(10) DEFAULT NULL,
  `empresa` varchar(100) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `envios`
--

INSERT INTO `envios` (`id_envio`, `id_factura`, `empresa`, `fecha`, `estado`) VALUES
('E0001', 'F0001', 'EnvioExpress', '2023-11-07', 'Activo'),
('E0002', 'F0002', 'FastShip', '2023-11-08', 'Activo'),
('E0003', 'F0003', 'SwiftDelivery', '2023-11-09', 'Inactivo'),
('E0004', 'F0004', 'RapidShip', '2023-11-10', 'Activo'),
('E0005', 'F0005', 'QuickCargo', '2023-11-11', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `num_factura` char(10) NOT NULL,
  `id_usuario` char(10) DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `facturas`
--

INSERT INTO `facturas` (`num_factura`, `id_usuario`, `fecha`) VALUES
('F0001', 'U0001', '2023-11-02'),
('F0002', 'U0002', '2023-11-03'),
('F0003', 'U0003', '2023-11-04'),
('F0004', 'U0004', '2023-11-05'),
('F0005', 'U0005', '2023-11-06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `codigo` char(10) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `anio_publica` date DEFAULT NULL,
  `stock` int(30) DEFAULT NULL,
  `precio_compra` int(30) DEFAULT NULL,
  `editorial` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`codigo`, `titulo`, `anio_publica`, `stock`, `precio_compra`, `editorial`) VALUES
('L0001', 'El Se?or de los Anillos', '1954-07-29', 50, 20, 'Minotauro'),
('L0002', 'Cien a?os de soledad', '1967-05-30', 30, 15, 'Sudamericana'),
('L0003', '1984', '1949-06-08', 40, 18, 'Secker and Warburg'),
('L0004', 'Harry Potter y la piedra filosofal', '1997-06-26', 60, 25, 'Bloomsbury'),
('L0005', 'Matar a un ruise?or', '1960-07-11', 25, 12, 'J.B. Lippincott'),
('L0006', 'Introducci?n a Python', '2023-01-01', 20, 30, 'TechBooks');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros_autores`
--

CREATE TABLE `libros_autores` (
  `id_autor` char(10) NOT NULL,
  `codigo` char(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros_autores`
--

INSERT INTO `libros_autores` (`id_autor`, `codigo`) VALUES
('A0001', 'L0001'),
('A0002', 'L0002'),
('A0003', 'L0003'),
('A0004', 'L0004'),
('A0005', 'L0005'),
('A0006', 'L0006');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros_categorias`
--

CREATE TABLE `libros_categorias` (
  `id_categoria` char(10) NOT NULL,
  `codigo` char(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros_categorias`
--

INSERT INTO `libros_categorias` (`id_categoria`, `codigo`) VALUES
('C0001', 'L0001'),
('C0002', 'L0002'),
('C0003', 'L0003'),
('C0004', 'L0004'),
('C0005', 'L0005'),
('C0006', 'L0006');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` char(10) NOT NULL,
  `nombres` varchar(100) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `pass` varchar(100) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `rol` enum('A','E','L') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombres`, `apellidos`, `correo`, `pass`, `direccion`, `ciudad`, `rol`) VALUES
('U0001', 'John', 'Doe', 'john.doe@example.com', 'hashed_password_1', '123 Main St', 'CIU0001', 'A'),
('U0002', 'Jane', 'Smith', 'jane.smith@example.com', 'hashed_password_2', '456 Oak St', 'CIU0002', 'E'),
('U0003', 'Alice', 'Johnson', 'alice.johnson@example.com', 'hashed_password_3', '789 Pine St', 'CIU0003', 'L'),
('U0004', 'Bob', 'Williams', 'bob.williams@example.com', 'hashed_password_4', '101 Elm St', 'CIU0004', 'E'),
('U0005', 'Eva', 'Davis', 'eva.davis@example.com', 'hashed_password_5', '202 Maple St', 'CIU0005', 'L');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autores`
--
ALTER TABLE `autores`
  ADD PRIMARY KEY (`id_autor`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id_ciudad`);

--
-- Indices de la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD PRIMARY KEY (`num_factura`,`codigo`),
  ADD KEY `codigo` (`codigo`);

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
  ADD PRIMARY KEY (`num_factura`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `libros_autores`
--
ALTER TABLE `libros_autores`
  ADD PRIMARY KEY (`id_autor`,`codigo`),
  ADD KEY `codigo` (`codigo`);

--
-- Indices de la tabla `libros_categorias`
--
ALTER TABLE `libros_categorias`
  ADD PRIMARY KEY (`id_categoria`,`codigo`),
  ADD KEY `codigo` (`codigo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `ciudad` (`ciudad`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_factura`
--
ALTER TABLE `detalle_factura`
  ADD CONSTRAINT `detalle_factura_ibfk_1` FOREIGN KEY (`num_factura`) REFERENCES `facturas` (`num_factura`),
  ADD CONSTRAINT `detalle_factura_ibfk_2` FOREIGN KEY (`codigo`) REFERENCES `libros` (`codigo`);

--
-- Filtros para la tabla `envios`
--
ALTER TABLE `envios`
  ADD CONSTRAINT `envios_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `facturas` (`num_factura`);

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `libros_autores`
--
ALTER TABLE `libros_autores`
  ADD CONSTRAINT `libros_autores_ibfk_1` FOREIGN KEY (`id_autor`) REFERENCES `autores` (`id_autor`),
  ADD CONSTRAINT `libros_autores_ibfk_2` FOREIGN KEY (`codigo`) REFERENCES `libros` (`codigo`);

--
-- Filtros para la tabla `libros_categorias`
--
ALTER TABLE `libros_categorias`
  ADD CONSTRAINT `libros_categorias_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `libros_categorias_ibfk_2` FOREIGN KEY (`codigo`) REFERENCES `libros` (`codigo`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`ciudad`) REFERENCES `ciudades` (`id_ciudad`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
