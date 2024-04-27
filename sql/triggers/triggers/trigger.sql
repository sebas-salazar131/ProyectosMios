CREATE DATABASE ejtrigger;

USE ejtrigger;

CREATE TABLE cliente(
    id SERIAL,
    nombre VARCHAR(255),
    id_ultimo_pedido BIGINT
);

CREATE TABLE ventas ( id SERIAL,
    id_articulo BIGINT,
    id_cliente BIGINT,
    cantidad INT,
    precio DECIMAL(9,2)
);

INSERT INTO cliente(nombre) VALUES ('Bob');
INSERT INTO cliente(nombre) VALUES ('Sally');
INSERT INTO cliente(nombre) VALUES ('Fred');

CREATE TRIGGER nuevasventas AFTER INSERT ON ventas
    FOR EACH ROW
    UPDATE cliente SET id_ultimo_pedido = NEW.id
    WHERE id = NEW.id_cliente
;

INSERT INTO ventas (id_articulo, id_cliente, cantidad, precio)
VALUES 
(1001, 3, 5, 19.95),
(1002, 2, 3, 14.95),
(1003, 1, 1, 29.95),
(1002, 3, 6, 29.95);

DELIMITER //
CREATE TRIGGER actualizarventas BEFORE UPDATE ON ventas
FOR EACH ROW
BEGIN
 IF ( SELECT bandera FROM ventas WHERE id = NEW.id ) > 0 THEN
 SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: no se 
 puedo actualizar el registro cantidad en ventas';
 END IF;
END;
//
DELIMITER ;

START TRANSACTION;
UPDATE ventas SET cantidad = cantidad + 9 WHERE id = 2;
COMMIT;

SELECT * FROM ventas;

START TRANSACTION;
UPDATE ventas SET cantidad = cantidad + 9 WHERE id = 3;
COMMIT;
SELECT * FROM ventas;

DROP TABLE IF EXISTS ventas;
CREATE TABLE ventas ( id SERIAL, id_articulo BIGINT, id_cliente 
BIGINT, cantidad INT, precio DECIMAL(9,2) );
CREATE TABLE registro ( id SERIAL, marca TIMESTAMP, evento 
VARCHAR(255), nombreusuario VARCHAR(255),nombretabla VARCHAR(255), 
id_tabla BIGINT);

--se supone que tambien se inserta en la tabla de registros pero no me funciona
DELIMITER //
CREATE TRIGGER marcaVenta AFTER INSERT ON ventas
 FOR EACH ROW
 BEGIN
    UPDATE cliente SET id_ultimo_pedido = NEW.id
    WHERE cliente.id = NEW.id_cliente;
    INSERT INTO registro (evento, nombreusuario, nombretabla, 
    id_tabla)
    VALUES ('Inserto', 'el trigger', 'ventas', NEW.id);
 END
//
DELIMITER ;
