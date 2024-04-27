CREATE DATABASE inventario CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE inventario;

DROP TABLE IF EXISTS productos;
CREATE TABLE productos(
    id_producto SMALLINT(5) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nom_producto VARCHAR(50) NOT NULL,
    marca VARCHAR(30),
    u_medida ENUM('Unidad', 'Bulto', 'Kilo', 'Libra', 'Litro') DEFAULT 'Unidad',
    stock FLOAT(5,2)
);

INSERT INTO productos( nom_producto, marca, u_medida, stock) VALUES
('celular', 'iphone', 'Kilo', 0),
('tomate', 'tomateria', 'Kilo', 7),
('aguacate', 'aguacateria', 'Bulto', 8),
('sal', 'saleria', 'libra', 12),
('cebolla', 'iphone', 'Kilo', 9);

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios(
    id_usuario CHAR(10) PRIMARY KEY,
    nom_usuario VARCHAR(30) NOT NULL,
    ape_usuario VARCHAR(30) NOT NULL,
    celular_usuario CHAR(10) NOT NULL,
    correo VARCHAR(80) UNIQUE NOT NULL,
    passw VARCHAR(160) NOT NULL,
    rol ENUM('Admin', 'Editor', 'Lector'),
    estado BOOLEAN 
);

DROP TABLE IF EXISTS movimientos;
CREATE TABLE movimientos(
    id_movimiento INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    producto SMALLINT(5) UNSIGNED NOT NULL,
    cantidad FLOAT(5,2) NOT NULL,
    u_medida ENUM('Unidad', 'Bulto', 'Kilo', 'Libra', 'Litro') DEFAULT 'Unidad',
    usuario CHAR(10),
    tipo ENUM('Compra', 'Gasto'),
    FOREIGN KEY (producto) REFERENCES productos(id_producto),
    FOREIGN KEY (usuario) REFERENCES usuarios(id_usuario)
);

DROP TABLE IF EXISTS contabilidad;
CREATE TABLE contabilidad(
    id_contabilidad INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    movimiento INT(10) UNSIGNED NOT NULL,
    precio_compra FLOAT(5,2) NOT NULL,
    FOREIGN KEY (movimiento) REFERENCES movimientos(id_movimiento)
);