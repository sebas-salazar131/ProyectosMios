CREATE DATABASE fincas;

DROP TABLE IF EXISTS  usuario;
CREATE TABLE usuario(
    id_usuario int(20) PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    telefono VARCHAR(50),
    nombre_usuario VARCHAR(50),
    contrasenia VARCHAR(50),
    rol ENUM('Superadministrador', 'Propietario')
);

DROP TABLE IF EXISTS fincas;
CREATE TABLE fincas(
    id_finca int(20) PRIMARY KEY AUTO_INCREMENT,
    nombre_finca VARCHAR(50),
    id_ubicacion int(20),
    cant_lotes VARCHAR(50),
    FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id_ubicacion)
);

DROP TABLE IF EXISTS ubicaciones;
CREATE TABLE ubicaciones(
    id_ubicacion int(20) PRIMARY KEY AUTO_INCREMENT,
    ciudad VARCHAR(50)
);

DROP TABLE IF EXISTS usuario_finca;
CREATE TABLE usuario_finca(
    id_usuario int(20), 
    id_finca int(20),
    PRIMARY KEY(id_usuario, id_finca),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_finca) REFERENCES fincas(id_finca)
);

DROP TABLE IF EXISTS lotes;
CREATE TABLE lotes(
    id_lote int(20) PRIMARY KEY AUTO_INCREMENT, 
    id_cultivo int(20),
    descripcion VARCHAR(100),
    cant_plantada int(50),
    FOREIGN KEY (id_cultivo) REFERENCES cultivos(id_cultivo)
);

DROP TABLE IF EXISTS fincas_lote;
CREATE TABLE fincas_lote(
    id_finca int(20),
    id_lote int(20), 
    PRIMARY KEY(id_finca, id_lote),
    FOREIGN KEY (id_finca) REFERENCES fincas(id_finca),
    FOREIGN KEY(id_lote) REFERENCES lotes(id_lote)
);

DROP TABLE IF EXISTS cultivos;
CREATE TABLE cultivos(
    id_cultivo int(20) PRIMARY KEY AUTO_INCREMENT, 
    nombre_cultivo VARCHAR(50),
    fecha_siembre DATE,
    fecha_cosecha DATE,
    cant_disponible int(50),
    tipo ENUM('platanos', 'aguacate', 'cafe')
);

DROP TABLE IF EXISTS produccion;
CREATE TABLE produccion(
    id_lote int(20),
    id_cultivo int(20),
    cant_produccion_obtenida int(20),
    FOREIGN KEY (id_lote) REFERENCES lotes(id_lote),
    FOREIGN KEY (id_cultivo) REFERENCES cultivos(id_cultivo)
);

INSERT INTO usuario(id_usuario, nombre, apellido, telefono,nombre_usuario,contrasenia,rol)
VALUES 
(1, 'sebas', 'garcia', 444, 'sebabass', '555', 'Propietario'),
(2, 'pepito', 'perez', 333, 'pepas', '555', 'Propietario'),
(3, 'samuel', 'goitia', 666, 'samu', '777', 'Superadministrador');

INSERT INTO ubicaciones(id_ubicacion, ciudad)
VALUES
(1, 'pereira'),
(2, 'bogota'),
(3, 'cali');

INSERT INTO fincas(id_finca, nombre_finca, id_ubicacion,cant_lotes)
VALUES 
(1, 'romelia', 2, 2),
(2, 'palmas', 1, 3),
(3, 'playas', 2, 1);

INSERT INTO usuario_finca(id_usuario, id_finca)
VALUES
(2, 2),
(1, 3),
(1, 1);

INSERT INTO cultivos(id_cultivo, nombre_cultivo, fecha_siembre, fecha_cosecha, cant_disponible, tipo)
VALUES
(1,'aguacate', '2023-11-02', '2023-11-30', 7, 'aguacate'),
(2,'platano verde', '2023-11-03', '2023-11-31', 8, 'platanos'),
(3,'platano maduro ', '2023-11-02', '2023-11-30', 7, 'platanos');

INSERT INTO lotes(id_lote, id_cultivo, descripcion,cant_plantada)
VALUES 
(1, 2, 'buena cosecha', 3),
(2, 3, 'hubo problemas', 2),
(3, 1, 'mala cosecha', 1);

INSERT INTO fincas_lote(id_finca,id_lote)
VALUES 
(2, 1),
(2, 2),
(3, 3);

INSERT INTO produccion(id_lote, id_cultivo, cant_produccion_obtenida)
VALUES 
(1, 2, 2),
(3, 1, 1),
(2, 3, 3);


UPDATE lotes SET descripcion='se puede mejorar' WHERE id_lote=2;
UPDATE fincas SET nombre_finca='salitre' WHERE id_finca=1;
UPDATE usuario SET nombre_usuario='bababa' WHERE id_finca=1;

DELETE FROM usuario WHERE id_usuario=3;
DELETE FROM lotes WHERE id_lote=3;
DELETE FROM ubicaciones WHERE id_ubicacion=3;

--CONSULTAS

--1
SELECT usuario.nombre, fincas.nombre_finca, ubicaciones.ciudad
FROM usuario
JOIN usuario_finca ON usuario.id_usuario=usuario_finca.id_usuario
JOIN fincas ON usuario_finca.id_finca=fincas.id_finca
JOIN ubicaciones ON fincas.id_ubicacion=ubicaciones.id_ubicacion;

--2
SELECT ubicaciones.ciudad, COUNT(fincas.id_finca) AS cant_fincas
FROM fincas 
JOIN ubicaciones ON ubicaciones.id_ubicacion=fincas.id_ubicacion
WHERE ubicaciones.ciudad='bogota';

--3
SELECT fincas.nombre_finca, fincas.cant_lotes, ubicaciones.ciudad
FROM fincas
JOIN ubicaciones ON fincas.id_ubicacion=ubicaciones.id_ubicacion
WHERE ubicaciones.ciudad='bogota';

--4
SELECT cultivos.nombre_cultivo, SUM(cant_produccion_obtenida) AS cant_produccion, fincas.nombre_finca
FROM produccion
JOIN cultivos ON cultivos.id_cultivo=produccion.id_cultivo
JOIN lotes ON lotes.id_lote=produccion.id_lote
JOIN fincas_lote ON fincas_lote.id_lote=lotes.id_lote
LEFT JOIN fincas ON fincas_lote.id_finca=fincas.id_finca
WHERE cultivos.nombre_cultivo='aguacate' GROUP BY fincas.id_finca;

--5
SELECT fincas.nombre_finca, lotes.descripcion, cultivos.nombre_cultivo
FROM fincas 
RIGHT JOIN fincas_lote ON fincas.id_finca=fincas_lote.id_finca
JOIN lotes ON fincas_lote.id_lote=lotes.id_lote
JOIN cultivos ON lotes.id_cultivo=cultivos.id_cultivo;

--6
SELECT  fincas.nombre_finca, cultivos.nombre_cultivo, produccion.cant_produccion_obtenida
FROM  produccion
JOIN cultivos ON cultivos.id_cultivo=produccion.id_cultivo
JOIN lotes ON lotes.id_lote=produccion.id_lote
JOIN fincas_lote ON fincas_lote.id_lote=lotes.id_lote
JOIN fincas ON fincas_lote.id_finca=fincas.id_finca
WHERE produccion ORDER BY produccion.cant_produccion_obtenida  DESC LIMIT 1;

