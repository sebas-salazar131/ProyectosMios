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