-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2023 at 04:50 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `matricula`
--

-- --------------------------------------------------------

--
-- Table structure for table `asignaturas`
--

CREATE TABLE `asignaturas` (
  `codigo` char(5) NOT NULL,
  `descripcion` varchar(35) DEFAULT NULL,
  `creditos` float(3,1) DEFAULT NULL,
  `creditosp` float(3,1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `asignaturas`
--

INSERT INTO `asignaturas` (`codigo`, `descripcion`, `creditos`, `creditosp`) VALUES
('AAA', 'DISE?O Y GESTION DE BASES DE DATOS', 6.0, 3.0),
('FBD', ' FUNDAMENTOS DE LAS BASES DE DATOS', 6.0, 1.5),
('FH', 'FUNDAMENTOS DE LA PROGRAMACION', 9.0, 4.5),
('HI', 'HISTORIA DE LA INFORMATICA', 4.5, 0.0),
('PC', 'PROGRAMACION CONCURRENTE', 6.0, 1.5);

-- --------------------------------------------------------

--
-- Table structure for table `coordinadores`
--

CREATE TABLE `coordinadores` (
  `dni` varchar(10) NOT NULL,
  `nombre` varchar(40) DEFAULT NULL,
  `dpto` char(4) DEFAULT NULL,
  `asig` char(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coordinadores`
--

INSERT INTO `coordinadores` (`dni`, `nombre`, `dpto`, `asig`) VALUES
('5577', 'AGIPATO CIFUENTES', 'DLSI', 'FH'),
('6655', 'ROMUELDO GOMEZ', 'DLSI', 'HI'),
('9922', 'CATURLO PEREZ', 'DLSI', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `imparte`
--

CREATE TABLE `imparte` (
  `dni` char(10) NOT NULL,
  `asignatura` char(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `imparte`
--

INSERT INTO `imparte` (`dni`, `asignatura`) VALUES
('21111222', 'AAA'),
('21111222', 'FBD'),
('21333444', 'PC');

-- --------------------------------------------------------

--
-- Table structure for table `profesores`
--

CREATE TABLE `profesores` (
  `dni` char(10) NOT NULL,
  `nombre` varchar(40) DEFAULT NULL,
  `categoria` char(4) DEFAULT NULL,
  `ingreso` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profesores`
--

INSERT INTO `profesores` (`dni`, `nombre`, `categoria`, `ingreso`) VALUES
('21111222', 'EVA PEREZ', 'TEU', '1993-10-01'),
('21222333', 'MANUEL PALOMAR', 'TEU', '1989-06-16'),
('21333444', 'RAFAEL ROMERO', ' ASO', '1992-06-16');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asignaturas`
--
ALTER TABLE `asignaturas`
  ADD PRIMARY KEY (`codigo`);

--
-- Indexes for table `coordinadores`
--
ALTER TABLE `coordinadores`
  ADD PRIMARY KEY (`dni`),
  ADD KEY `asig` (`asig`);

--
-- Indexes for table `imparte`
--
ALTER TABLE `imparte`
  ADD PRIMARY KEY (`dni`,`asignatura`),
  ADD KEY `asignatura` (`asignatura`);

--
-- Indexes for table `profesores`
--
ALTER TABLE `profesores`
  ADD PRIMARY KEY (`dni`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `coordinadores`
--
ALTER TABLE `coordinadores`
  ADD CONSTRAINT `coordinadores_ibfk_1` FOREIGN KEY (`asig`) REFERENCES `asignaturas` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `imparte`
--
ALTER TABLE `imparte`
  ADD CONSTRAINT `imparte_ibfk_1` FOREIGN KEY (`dni`) REFERENCES `profesores` (`dni`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `imparte_ibfk_2` FOREIGN KEY (`asignatura`) REFERENCES `asignaturas` (`codigo`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
