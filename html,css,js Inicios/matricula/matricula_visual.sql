CREATE DATABASE matricula;

SHOW DATABASES;

USE Matricula;
--TABLA Y FUNCIONES DE PROFESORES--
DROP TABLE IF EXISTS profesores;
CREATE TABLE profesores ( 
    dni CHAR(10) PRIMARY KEY, 
    nombre VARCHAR(40), 
    categoria CHAR(4),
    ingreso DATE
);
INSERT INTO profesores (dni, nombre, categoria, ingreso)
VALUES (21222333, 'MANUEL PALOMAR', 'TEU','1989-06-16'),
(21333444, 'RAFAEL ROMERO', 'ASO6','1992-06-16');

UPDATE profesores SET ingreso='1993-10-01' WHERE dni='21111222';
DELETE FROM profesores WHERE dni = '21111222';
SELECT DISTINCT categoria FROM profesores;
SELECT nombre FROM profesores WHERE categoria = 'TEU';
SELECT nombre FROM profesores WHERE categoria = 'TEU' OR categoria = 'ASO';

--supuestamente es: Nombre de los profesores que imparten una asignatura que no sea la máxima en
--número de créditos. Pero no entendi
SELECT nombre FROM profesores p, asignaturas a, imparte i WHERE p.dni = i.dni AND i.asignatura = a.codigo AND creditos < ANY ( SELECT creditos FROM asignaturas );

--selecciona los datos de los profesores que imparte alguna asignatura
SELECT * FROM profesores WHERE dni IN (SELECT dni FROM imparte);

--que no imparten asignaturas
SELECT * FROM profesores WHERE dni NOT IN (SELECT dni FROM imparte);

--SEGUNDA GUIA--

--Profesores que han ingresado antes de 1990
SELECT * FROM profesores WHERE ingreso < '1990-01-01';--tambien se podria asi: 19900101 o asi tamnien '90-01-01'
--DE LO CONTRARIO NO MOSTRARA ERROR, PERO NO HABRA FILAS PARA MOSTRAR
SELECT * FROM profesores WHERE ingreso < 1990-01-01;

--NOW() devuelve la fecha y hora del servidor en formato 
--datetime CURDATE() y CURTIME() hacen lo mismo pero con la
--fecha y la hora respectivamente
SELECT NOW(), CURDATE(), CURTIME();

--para acomodar el formato de la fecha
SELECT dni,nombre, DATE_FORMAT(ingreso, '%d/%m/%Y') ingreso FROM profesores;

--STR_TO_DATE() una cadena de caracteres en un formato concreto a fecha.
SELECT * FROM profesores WHERE ingreso < STR_TO_DATE('1/1/90','%d/%m/%y');

--seleccona el dia, mes y año de la persona
SELECT DAY(ingreso) día, MONTH(ingreso) mes, YEAR(ingreso) año FROM profesores WHERE nombre='EVA GOMEZ';
--otra manera
SELECT DAYNAME(ingreso) día, DAYOFWEEK(ingreso) numdía, MONTHNAME(ingreso) mes;
--este ya es con hora, minutos y segundos
SELECT DATE_FORMAT(NOW(),'%Y%m%d -- %H:%i:%s') ahora;

--operaciones matematicas dentro de select
SELECT descripcion,(creditos/3)*2 horas FROM asignaturas;
SELECT descripcion, creditos FROM asignaturas WHERE (creditos/3)*2 < 4;

--redondea un valor ingresando el numero normal pero con solo 2 decimales como se muestra:
SELECT ROUND(15.1297,2) redondeo FROM dual;

--numero de filas segun lo que se seleccione
SELECT COUNT(*) profes FROM profesores;






--TABLA Y FUNCIONES DE ASIGNATURAS--
DROP TABLE IF EXISTS asignaturas;
CREATE TABLE asignaturas ( 
    codigo char(5) PRIMARY KEY, 
    descripcion varchar(35), 
    creditos float(3,1),
    creditosp float(3,1)
);
INSERT INTO asignaturas(codigo, descripcion, creditos, creditosp)
VALUES ('FBD', ' FUNDAMENTOS DE LAS BASES DE DATOS', 6.0, 1.5),
('FH', 'FUNDAMENTOS DE LA PROGRAMACION', 9.0, 4.5),
('HI', 'HISTORIA DE LA INFORMATICA', 4.5, ''),
('PC', 'PROGRAMACION CONCURRENTE', 6.0, 1.5);

UPDATE asignaturas SET codigo = 'AAA' WHERE codigo = 'DGBD';
DELETE FROM asignaturas WHERE codigo = 'DGBD';
SELECT creditos, descripcion FROM asignaturas ORDER BY creditos;
SELECT creditos, descripcion FROM asignaturas WHERE creditos > 4.5 ORDER BY creditos DESC;
SELECT creditos, descripcion FROM asignaturas ORDER BY creditos, descripcion;

SELECT * FROM asignaturas WHERE creditosp = '';
SELECT * FROM asignaturas WHERE creditosp = ' ';
SELECT * FROM asignaturas WHERE creditosp = 0;
SELECT * FROM asignaturas WHERE creditosp = NULL;
--
SELECT 'La asignatura ', descripcion, ' tiene ', creditos, ' creditos' FROM asignaturas ORDER BY creditos;
SELECT nombre, descripcion FROM asignaturas, profesores;

--ingresa a las 2 tablas y saca el dni para compararlas --
SELECT nombre, descripcion FROM asignaturas, profesores, imparte WHERE imparte.dni = profesores.dni AND asignatura = código;

--ingresa a todas las tablas
SELECT * FROM asignaturas, profesores, imparte;
SELECT * FROM asignaturas, profesores, imparte WHERE profesores.dni = imparte.dni AND asignatura = codigo;

--seleccion los valores entre 2 numeros
SELECT creditos, descripcion FROM asignaturas WHERE creditos BETWEEN 5 AND 8;

--seleccion la descripcion que esta en los codigos FBD Y HI
SELECT descripcion FROM asignaturas WHERE codigo in ('FBD', 'HI');

--selecciona los que no tenga el codigo de la asignatura
SELECT nombre FROM profesores p, imparte i WHERE p.dni = i.dni AND asignatura NOT IN ('HI', 'FBD', 'DGBD');

--sirve para autocompletar
SELECT * FROM profesores WHERE nombre LIKE 'RAFA%';

SELECT codigo FROM asignaturas WHERE descripcion LIKE '%BASES DE DATOS%';

--Que seleccione 2 caracteres
SELECT codigo FROM asignaturas WHERE codigo LIKE ' ';

--autocomplete
SELECT descripcion FROM asignaturas WHERE descripcion LIKE '%INFORMATIC_'

--selecciona la menor credito utilizando el MIN de la descripcion 
SELECT descripcion, creditos FROM asignaturas WHERE creditos = (SELECT MIN(creditos) FROM asignaturas);

--que selecione todas las asignaturas que tenga mayor creditos que HI
SELECT * FROM asignaturas WHERE creditos >(SELECT creditos FROM asignaturas WHERE codigo = 'HI');

--asignatura con mayor creditos 
SELECT descripcion FROM asignaturas WHERE creditos >= ALL (SELECT creditos FROM asignaturas);
--tambien se puede usar:
SELECT descripcion FROM asignaturas WHERE creditos = (SELECT MAX(creditos) FROM asignaturas);

--selecciona todas las asignaturas que sean mayor en creditos, menos a la que es menor
SELECT descripcion FROM asignaturas WHERE creditos != (SELECT MIN(creditos) FROM asignaturas);


--SEGUNDA GUIA

--SELECCIONA EL NUMERO DE FILAS EN LA TABLA ASIGNATURAS QUE SEAN MAYOR A 4
SELECT COUNT(*) FROM asignaturas WHERE creditos > 4;

--SELECCIONA LOS VALORES QUE SEAN DISTINTOS EN LA COLUNMA CREDITOS
SELECT COUNT(DISTINCT creditos) numcreditos FROM asignaturas;

--EL COUNT NO CUENTA NULOS
SELECT COUNT(*) filas, COUNT(creditosp) valores, COUNT(DISTINCT creditosp) distintos FROM asignaturas;

--EL AVG SIRVE PARA HACER PROMEDIO DE LOS VALORES
SELECT AVG(creditosp) sinDis, AVG(DISTINCT creditosp) conDis FROM asignaturas;


--TERCERA GUIA

--UNE DOS TABLAS Y SELECCIONA LAS QUE TIENEN EL MISMO DNI EN LAS DOS TABLAS (NO SIRVE, MALA PRACTICA)
SELECT * FROM asignaturas, profesores, imparte WHERE profesores.dni = imparte.dni AND asignatura = codigo;

--NO LA ENTENDI (NO SIRVE, MALA PRACTICA)
SELECT i1.dni, ' imparte la misma asignatura que ', i2.dni FROM imparte i1, imparte i2 WHERE i1.asignatura= i2.asignatura;

--SELECCIONA EL DNI(DE LA TABLA PROFESORES) Y EL CODIGO(DE LA TABLA ASIGNATURAS)
SELECT dni, codigo FROM profesores, asignaturas;

--NO LA ENTENDI
SELECT nombre, descripcion FROM asignaturas JOIN imparte ON (codigo=asignatura) JOIN profesores ON (imparte.dni=profesores.dni);

--ES LO MISMO DE ARRIBA SOLO QUE ESTA VEZ NO HAYA LAS QUE TENGA LA PALABRA PROGRAMACION
SELECT nombre, descripcion FROM asignaturas JOIN imparte ON (codigo=asignatura) JOIN profesores ON (imparte.dni=profesores.dni) WHERE descripcion NOT LIKE 'PROGRAMACION%';

--sleccione todo lo que esta en la tabla profesores y asignatura de imparte e imprima lo que esta en la tabla profesores y la fusione con imparte
SELECT profesores.*, imparte.asignatura FROM profesores LEFT JOIN imparte ON (profesores.dni=imparte.dni);

--SELECCIONE EL DNI QUE NO SE ENCUENTRE EN LA TABLA IMPARTE
SELECT * from profesores WHERE dni NOT IN (SELECT dni FROM imparte);

--seleccione lo que esta en profesores solo sin existe en la tabla imparte
SELECT * FROM profesores p WHERE EXISTS (SELECT * FROM imparte i WHERE i.dni = p.dni);


--TABLA Y FUNCIONES DE IMPARTE--
DROP TABLE IF EXISTS imparte;
CREATE TABLE imparte ( 
    dni CHAR(10), 
    asignatura CHAR(5),
    PRIMARY KEY (dni, asignatura),
    FOREIGN KEY (dni) REFERENCES profesores (dni)ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (asignatura) REFERENCES asignaturas (codigo)ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO imparte(dni, asignatura) VALUES (21111222, 'AAA'),(21111222, 'FBD'),
(21333444, 'PC' );

DROP TABLE IF EXISTS coordinadores;
CREATE TABLE coordinadores(
    dni VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(40),
    dpto CHAR(4),
    asig CHAR(5),
    FOREIGN KEY (asig) REFERENCES asignaturas (codigo)
);


--TERCERA GUIA 

INSERT INTO coordinadores (dni, nombre, dpto, asig) VALUES 
(5577, 'AGIPATO CIFUENTES', 'DLSI', 'FH'),
(6655, 'ROMUELDO GOMEZ', 'DLSI', 'HI'),
(9922, 'CATURLO PEREZ', 'DLSI', NULL);

--Muestra todos los coordinadores y, si lo hacen, las asignaturas que coordinan.
SELECT * FROM coordinadores LEFT JOIN asignaturas ON (asignaturas.codigo=coordinadores.asig);

--Muestra los coordinadores que tienen asignatura y todas las asignaturas.
SELECT * FROM coordinadores RIGHT JOIN asignaturas ON (asignaturas.codigo=coordinadores.asig);

--Muestra todos los coordinadores y todas las asignaturas y si hay relación entre ellos
SELECT * FROM coordinadores FULL JOIN asignaturas ON (codigo=asig);
