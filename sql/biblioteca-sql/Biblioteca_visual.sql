CREATE DATABASE biblioteca;

DROP TABLE IF EXISTS libros;
CREATE TABLE libros(
    codigo char(10) PRIMARY KEY,
    titulo VARCHAR(100),
    anio_publica DATE,
    stock int(30),
    precio_compra int(30),
    editorial VARCHAR(50)
);
INSERT INTO libros (codigo, titulo, anio_publica, stock, precio_compra, editorial)
VALUES
    ('L0001', 'El Señor de los Anillos', '1954-07-29', 50, 20, 'Minotauro'),
    ('L0002', 'Cien años de soledad', '1967-05-30', 30, 15, 'Sudamericana'),
    ('L0003', '1984', '1949-06-08', 40, 18, 'Secker and Warburg'),
    ('L0004', 'Harry Potter y la piedra filosofal', '1997-06-26', 60, 25, 'Bloomsbury'),
    ('L0006', 'Introducción a Python', '2023-01-01', 20, 30, 'TechBooks'),
    ('L0005', 'Matar a un ruiseñor', '1960-07-11', 25, 12, 'J.B. Lippincott');


DROP TABLE IF EXISTS autores;
CREATE TABLE autores(
    id_autor char(10) PRIMARY KEY,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    nacionalidad VARCHAR(100)
);
INSERT INTO autores (id_autor, nombres, apellidos, nacionalidad)
VALUES
    ('A0001', 'J.R.R.', 'Tolkien', 'Británico'),
    ('A0002', 'Gabriel García', 'Márquez', 'Colombiano'),
    ('A0003', 'George', 'Orwell', 'Británico'),
    ('A0004', 'J.K.', 'Rowling', 'Británico'),
    ('A0006', 'Guido', 'van Rossum', 'Neerlandés'),
    ('A0005', 'Harper', 'Lee', 'Estadounidense');


DROP TABLE IF EXISTS categorias;
CREATE TABLE categorias(
    id_categoria char(10) PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion VARCHAR(100)
);
INSERT INTO categorias (id_categoria, nombre, descripcion)
VALUES
    ('C0001', 'Fantasía', 'Historias de mundos imaginarios y seres mágicos.'),
    ('C0002', 'Realismo mágico', 'Narrativas que mezclan lo real y lo fantástico.'),
    ('C0003', 'Distopía', 'Representación de sociedades futuras opresivas.'),
    ('C0004', 'Magia', 'Libros centrados en el uso de la magia.'),
    ('C0006', 'Programación', 'Libros relacionados con programación.'),
    ('C0005', 'Clásico', 'Obras literarias de reconocido valor y relevancia.');

DROP TABLE IF EXISTS libros_categorias;
CREATE TABLE libros_categorias(
    id_categoria char(10),
    codigo char(10),
    PRIMARY KEY(id_categoria, codigo),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (codigo) REFERENCES libros(codigo)
);
INSERT INTO libros_categorias (id_categoria, codigo)
VALUES
    ('C0001', 'L0001'), -- El Señor de los Anillos es de la categoría Fantasía
    ('C0002', 'L0002'), -- Cien años de soledad es de la categoría Realismo mágico
    ('C0003', 'L0003'), -- 1984 es de la categoría Distopía
    ('C0004', 'L0004'), -- Harry Potter es de la categoría Magia
    ('C0006', 'L0006'), --programacion
    ('C0005', 'L0005'); -- Matar a un ruiseñor es de la categoría Clásico
    

DROP TABLE IF EXISTS libros_autores;
CREATE TABLE libros_autores(
    id_autor char(10),
    codigo char(10),
    PRIMARY KEY(id_autor, codigo),
    FOREIGN KEY (id_autor) REFERENCES autores(id_autor),
    FOREIGN KEY (codigo) REFERENCES libros(codigo)
);
INSERT INTO libros_autores (id_autor, codigo)
VALUES
    ('A0001', 'L0001'), -- El Señor de los Anillos fue escrito por J.R.R. Tolkien
    ('A0002', 'L0002'), -- Cien años de soledad fue escrito por Gabriel García Márquez
    ('A0003', 'L0003'), -- 1984 fue escrito por George Orwell
    ('A0004', 'L0004'), -- Harry Potter fue escrito por J.K. Rowling
    ('A0006', 'L0006'),
    ('A0005', 'L0005'); -- Matar a un ruiseñor fue escrito por Harper Lee

DROP TABLE IF EXISTS ciudades;
CREATE TABLE ciudades(
    id_ciudad char(10) PRIMARY KEY,
    nombre VARCHAR(100)
);
INSERT INTO ciudades (id_ciudad, nombre)
VALUES
    ('CIU0001', 'Nueva York'),
    ('CIU0002', 'París'),
    ('CIU0003', 'Tokio'),
    ('CIU0004', 'Sídney'),
    ('CIU0005', 'Roma');


DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios(
    id_usuario char(10) PRIMARY KEY,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    correo VARCHAR(100),
    pass VARCHAR(100),
    direccion VARCHAR(100),
    ciudad VARCHAR(100),
    rol ENUM('A', 'E', 'L'),
    FOREIGN KEY (ciudad) REFERENCES ciudades(id_ciudad)
);
INSERT INTO usuarios (id_usuario, nombres, apellidos, correo, pass, direccion, ciudad, rol)
VALUES
    ('U0001', 'John', 'Doe', 'john.doe@example.com', 'hashed_password_1', '123 Main St', 'CIU0001', 'A'), -- Administrador
    ('U0002', 'Jane', 'Smith', 'jane.smith@example.com', 'hashed_password_2', '456 Oak St', 'CIU0002', 'E'), -- Editor
    ('U0003', 'Alice', 'Johnson', 'alice.johnson@example.com', 'hashed_password_3', '789 Pine St', 'CIU0003', 'L'), -- Lector
    ('U0004', 'Bob', 'Williams', 'bob.williams@example.com', 'hashed_password_4', '101 Elm St', 'CIU0004', 'E'), -- Editor
    ('U0005', 'Eva', 'Davis', 'eva.davis@example.com', 'hashed_password_5', '202 Maple St', 'CIU0005', 'L'); -- Lector

DROP TABLE IF EXISTS facturas;
CREATE TABLE facturas(
    num_factura char(10) PRIMARY KEY,
    id_usuario char(10),
    fecha DATE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
INSERT INTO facturas (num_factura, id_usuario, fecha)
VALUES
    ('F0001', 'U0001', '2023-11-02'),
    ('F0002', 'U0002', '2023-11-03'),
    ('F0003', 'U0003', '2023-11-04'),
    ('F0004', 'U0004', '2023-11-05'),
    ('F0005', 'U0005', '2023-11-06');

DROP TABLE IF EXISTS detalle_factura;
CREATE TABLE detalle_factura(
    num_factura char(10),
    codigo char(10),
    cantidad int(20),
    precio_venta FLOAT(5,2),
    total FLOAT(5,2),
    PRIMARY KEY(num_factura,codigo),
    FOREIGN KEY (num_factura) REFERENCES facturas(num_factura),
    FOREIGN KEY (codigo) REFERENCES libros(codigo)
);
INSERT INTO detalle_factura (num_factura, codigo, cantidad, precio_venta, total)
VALUES
    ('F0001', 'L0001', 2, 15.00, 30.00),
    ('F0001', 'L0002', 1, 18.00, 18.00),
    ('F0002', 'L0003', 3, 22.50, 67.50),
    ('F0003', 'L0004', 1, 25.00, 25.00),
    ('F0004', 'L0005', 2, 12.00, 24.00);

DROP TABLE IF EXISTS envios;
CREATE TABLE envios(
    id_envio char(10) PRIMARY KEY,
    id_factura char(10),
    empresa VARCHAR(100),
    fecha DATE,
    estado ENUM('Activo', 'Inactivo'),
    FOREIGN KEY (id_factura) REFERENCES facturas(num_factura)
);
INSERT INTO envios(id_envio, id_factura, empresa, fecha, estado)
VALUES
    ('E0001', 'F0001', 'EnvioExpress', '2023-11-07', 'Activo'),
    ('E0002', 'F0002', 'FastShip', '2023-11-08', 'Activo'),
    ('E0003', 'F0003', 'SwiftDelivery', '2023-11-09', 'Inactivo'),
    ('E0004', 'F0004', 'RapidShip', '2023-11-10', 'Activo'),
    ('E0005', 'F0005', 'QuickCargo', '2023-11-11', 'Activo');


--1
SELECT libros.titulo, categorias.nombre, autores.nombres FROM libros 
JOIN libros_categorias ON libros.codigo=libros_categorias.codigo
JOIN categorias ON libros_categorias.id_categoria=categorias.id_categoria 
JOIN libros_autores ON libros_autores.codigo=libros.codigo
JOIN autores ON libros_autores.id_autor=autores.id_autor
WHERE categorias.nombre='programaci?n';

--2
SELECT autores.nombres, libros.titulo FROM autores JOIN libros_autores ON autores.id_autor=libros_autores.id_autor
JOIN libros ON libros_autores.codigo=libros.codigo;

--3
SELECT usuarios.nombres AS nombre_lector, facturas.num_factura AS numero_factura FROM
usuarios LEFT JOIN facturas ON facturas.id_usuario = usuarios.id_usuario
WHERE usuarios.rol = 'L';

--4
SELECT * FROM facturas WHERE fecha='2023-11-2';

--5
SELECT SUM(total) AS total FROM facturas
JOIN detalle_factura ON detalle_factura.num_factura=facturas.num_factura WHERE fecha='2023-11-2';

--6
SELECT ciudades.nombre, COUNT(usuarios.id_usuario) AS numero_lectores FROM ciudades 
LEFT JOIN usuarios ON ciudades.id_ciudad = usuarios.ciudad
WHERE usuarios.rol = 'L' GROUP BY ciudades.nombre;

--7
SELECT titulo FROM libros WHERE stock<5;

--8
SELECT usuarios.nombres, detalle_factura.cantidad
FROM usuarios 
JOIN facturas  ON usuarios.id_usuario = facturas.id_usuario
JOIN detalle_factura  ON facturas.num_factura = detalle_factura.num_factura
ORDER BY cantidad DESC LIMIT 1;

--9
SELECT DISTINCT usuarios.nombres, envios.estado  FROM  usuarios JOIN facturas ON usuarios.id_usuario=usuarios.id_usuario
JOIN envios on envios.id_factura=facturas.num_factura;
--10
SELECT libros.codigo, libros.titulo FROM libros
LEFT JOIN detalle_factura ON libros.codigo = detalle_factura.codigo
WHERE detalle_factura.codigo IS NULL;

--11
SELECT usuarios.nombres AS nombre_cliente, facturas.num_factura AS numero_factura, libros.titulo AS titulo_libro, ciudades.nombre AS ciudad_cliente
FROM facturas 
JOIN usuarios ON f.id_usuario = usuarios.id_usuario
JOIN detalle_factura df ON facturas.num_factura = df.num_factura
JOIN libros ON df.codigo = libros.codigo
JOIN ciudades  ON usuarios.ciudad = ciudades.id_ciudad;