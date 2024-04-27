CREATE DATABASE rutinas1;
USE rutinas1;
CREATE TABLE puntos (
    id_participante INT NOT NULL,
    genero CHAR(1) NOT NULL,
    competencia_1 INT NOT NULL,
    competencia_2 INT NOT NULL,
    PRIMARY KEY (id_participante)
);
INSERT INTO puntos VALUES(1,'M', 9, 7);
INSERT INTO puntos VALUES(2,'F', 6, 8);
INSERT INTO puntos VALUES(3,'M', 9, 9);
INSERT INTO puntos VALUES(4,'F', 10, 7);
INSERT INTO puntos VALUES(5,'M', 9, 10);

DELIMITER //
CREATE FUNCTION holaMundo() RETURNS VARCHAR(20)
RETURN 'HolaMundo';
//
DELIMITER;

SELECT holaMundo();
SELECT holaMundo() as Retorno;

--Funcion con variable
DELIMITER //
CREATE FUNCTION holaMundo_var() RETURNS VARCHAR(40)
BEGIN 
    DECLARE var_salida VARCHAR(40);
    SET var_salida = 'Hola Mundo desde una Variable';
    RETURN var_salida;
END;
//
DELIMITER;


SELECT holaMundo_var();

DELIMITER //
CREATE FUNCTION saludo (texto CHAR(20)) 
RETURNS CHAR(50)
RETURN CONCAT('Hola, ',texto,'!');
//
DELIMITER ;

DELIMITER //
CREATE FUNCTION elmayor (num1 INT, num2 INT) 
    RETURNS INT
        BEGIN
            DECLARE var_retorno INT;
                IF num1 > num2 THEN
                SET var_retorno = num1;
                ELSE
                SET var_retorno = num2; 
                END IF;
                RETURN var_retorno;
        END;
//
DELIMITER ;

DELIMITER //
CREATE FUNCTION prioridad (cliente_prioridad VARCHAR(1)) RETURNS 
    VARCHAR(20)
    BEGIN
        CASE cliente_prioridad
            WHEN 'A' THEN
            RETURN 'Alto';
            WHEN 'M' THEN
            RETURN 'Medio';
            WHEN 'B' THEN
            RETURN 'Bajo';
            ELSE
            RETURN 'Dato no Valido';
        END CASE;
    END
//
DELIMITER ;


DELIMITER //
CREATE FUNCTION sumas (p_genero CHAR(1)) 
RETURNS INT
    BEGIN
        DECLARE var_suma INT;
        SELECT SUM(competencia_1) 
        INTO var_suma
        FROM puntos
        WHERE genero = p_genero OR p_genero is NULL;
        RETURN var_suma;
    END;
//
DELIMITER ;

SELECT sumas('M');
SELECT 'Hombres' as Genero, sumas('M') as Total_Compe1;


--ejercicio
DELIMITER //
CREATE FUNCTION calcular_todos(comp1 INT, comp2 INT) RETURNS INT
    BEGIN
    DECLARE suma INT;
    SET suma=comp1+comp2;
    RETURN suma;
    END;
//
DELIMITER ;

SELECT competencia_1, competencia_2, calcular_todos(competencia_1, competencia_2) 
FROM puntos;

DELIMITER //
CREATE FUNCTION res_potencia(numero INT, potencia INT) RETURNS INT
BEGIN
DECLARE contador INT DEFAULT 1;
DECLARE resultado INT DEFAULT 1;
WHILE contador <= potencia DO
 SET resultado = resultado * numero ;
 SET contador = contador + 1;
 END WHILE;
RETURN resultado;
END;
//
DELIMITER ;

SELECT res_potencia(2,3);
SELECT res_potencia(3,3);
SELECT res_potencia(2,4);

DELIMITER //
CREATE FUNCTION multiplos(numero INT) RETURNS INT
BEGIN 
    DECLARE contador INT DEFAULT 1;
    DECLARE total INT DEFAULT 0;
    DECLARE tot INT;
    WHILE contador <= 5 DO 
        SET total=total+ numero*contador;
        set contador=contador+1;
    END WHILE;
    RETURN total;
 END;
 //
 DELIMITER ;

SELECT multiplos(2);



DELIMITER //
CREATE FUNCTION actualizar_precios()
RETURNS INT
BEGIN
    DECLARE contador INT DEFAULT 1;
    DECLARE precio_nove INT;
    DECLARE id_arti INT;
    SET id_arti= (SELECT COUNT(*) FROM articulos);

    WHILE contador <= id_arti DO
        SET precio_nove = (SELECT precio FROM novedades WHERE id_articulo=id_articulo);

        UPDATE articulos SET precio=precio_nove WHERE id_articulo=id_articulo;
    END WHILE;
    RETURN precio_nove;
END;
//
DELIMITER;


--EJERCICIOS DE PROCEDIMENTOS Y TRIGGER


CREATE DATABASE ventas;
CREATE TABLE articulos(
    id_articulo INT NOT NULL,
    descripcion VARCHAR(30) NOT NULL,
    precio FLOAT NULL,
    stock INT NOT NULL,
    PRIMARY KEY (id_articulo)
);

CREATE TABLE ventas(
    id_venta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_articulo INT NOT NULL, 
    cantidad INT NOT NULL, 
    total FLOAT DEFAULT NULL,
    FOREIGN KEY (id_articulo) REFERENCES articulos(id_articulo)
);



DROP PROCEDURE insertar_venta;
DELIMITER //
CREATE PROCEDURE insertar_venta(id_arti INT, cantidad INT) 
BEGIN
    DECLARE total1 FLOAT;
    SET total1= (SELECT precio FROM articulos WHERE id_articulo=id_arti)*cantidad;
    INSERT INTO ventas(id_articulo, cantidad, total) VALUES (id_arti, cantidad, total1);
END;
//
DELIMITER;
CALL insertar_venta(3, 2);



DELIMITER //
CREATE TRIGGER actualizar AFTER INSERT ON ventas
FOR EACH ROW
BEGIN
    UPDATE articulos SET stock = stock - NEW.cantidad WHERE id_articulo = NEW.id_articulo;
END;
//
DELIMITER ;



DELIMITER //
CREATE TRIGGER eliminar AFTER DELETE ON ventas
FOR EACH ROW
BEGIN
    UPDATE articulos SET stock = stock + OLD.cantidad WHERE id_articulo = OLD.id_articulo;
END;
//
DELIMITER ;




DELIMITER //
CREATE TRIGGER actualizar_articulo AFTER UPDATE ON ventas
FOR EACH ROW
BEGIN
    DECLARE total FLOAT DEFAULT NULL;
    DECLARE actualizar_ventas FLOAT DEFAULT NULL;
    DECLARE cant INT;
    IF OLD.cantidad>NEW.cantidad THEN      
        SET total = OLD.cantidad-NEW.cantidad;
        SET actualizar_ventas= (SELECT precio FROM articulos WHERE id_articulo=NEW.id_articulo)*total;

        UPDATE articulos SET stock = stock + total WHERE id_articulo = NEW.id_articulo;
        SET cant=1;
        CALL actualizar_total(actualizar_ventas, cant, NEW.id_articulo );
    ELSE
    
        SET total = NEW.cantidad-OLD.cantidad;
        SET actualizar_ventas= (SELECT precio FROM articulos WHERE id_articulo=NEW.id_articulo)*total;
        UPDATE articulos SET stock = stock - total WHERE id_articulo = NEW.id_articulo;
        SET cant=2;
        CALL actualizar_total(actualizar_ventas, cant,  NEW.id_articulo);
    END IF;    
END;
//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE actualizar_total(actualizar_ventas INT, cantidad INT, id_arti INT) 
BEGIN
    IF cantidad=1 THEN
        UPDATE ventas SET total = total - actualizar_ventas WHERE id_articulo = id_arti;
    ELSE
        UPDATE ventas SET total = total + actualizar_ventas WHERE id_articulo = id_arti;
    END IF;      

END;
//
DELIMITER;




INSERT INTO articulos VALUES(1, 'Leche 1L.', 2000, 20);
INSERT INTO articulos VALUES(2, 'Café 250 gr.', 2400, 40);
INSERT INTO articulos VALUES(3, 'Agua 5L.', 3900, 30);
