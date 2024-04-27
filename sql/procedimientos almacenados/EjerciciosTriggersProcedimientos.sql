CREATE DATABASE almacen_motos;

CREATE TABLE inventario (
  cod_producto CHAR(8) PRIMARY KEY,
  nombre VARCHAR(30),
  cantidad_disponible INT
);

CREATE TABLE pedidos_ventas (
  id INT UNSIGNED AUTO_INCREMENT,
  producto CHAR(8) NOT NULL,
  tipo ENUM('Ingresa', 'Sale'),
  cantidad INT,
  PRIMARY KEY (id),
  FOREIGN KEY (producto) REFERENCES inventario(cod_producto)
);

INSERT INTO inventario VALUES ('1044','KTM Duke 200',0);
INSERT INTO inventario VALUES ('1055','YAMAHA MT 10',0);
INSERT INTO inventario VALUES ('1066','SUZUKY GSX-R 1000',0);

INSERT INTO pedidos_ventas (producto,tipo,cantidad) 
VALUES ('1044','Ingresa',10);

INSERT INTO pedidos_ventas (producto,tipo,cantidad) 
VALUES ('1044','Sale',5);

INSERT INTO pedidos_ventas (producto,tipo,cantidad) 
VALUES ('1044','Sale',2);









Realizar disparadores para:

- Cuando se inserta un nuevo registro en pedidos_ventas, 
verificar primero si ingresa o sale,
Si ingresa incrementar la cantidad_disponible en la tabla inventario
Si sale disminuir cantidad_disponible en la tabla inventario.

DROP TRIGGER IF EXISTS actualizar_inventario;
DELIMITER //
CREATE TRIGGER actualizar_inventario BEFORE INSERT ON pedidos_ventas
FOR EACH ROW
BEGIN
  if(NEW.tipo="Sale") THEN
    if(SELECT cantidad_disponible FROM inventario WHERE cod_producto = NEW.producto)>= NEW.cantidad THEN
      UPDATE inventario SET cantidad_disponible=cantidad_disponible-NEW.cantidad
      WHERE cod_producto=NEW.producto;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay suficientes productos en el inventario';
    END IF;
  ELSE
    UPDATE inventario SET cantidad_disponible=cantidad_disponible+NEW.cantidad
    WHERE cod_producto=NEW.producto;
  END IF;
END;
//
DELIMITER ;







- Cuando se borra un registro en la tabla pedidos_ventas
verificar si el registro borrado tenia ingresa o sale 
y deacuerdo a eso incrementar o disminuir la cantidad_disponible.

DROP TRIGGER IF EXISTS eliminar_inventario;
DELIMITER //
CREATE TRIGGER eliminar_inventario AFTER DELETE ON pedidos_ventas
FOR EACH ROW
BEGIN
  if(OLD.tipo="Sale") THEN
    UPDATE inventario SET cantidad_disponible=cantidad_disponible+OLD.cantidad
    WHERE cod_producto=OLD.producto;
  ELSE
    UPDATE inventario SET cantidad_disponible=cantidad_disponible-OLD.cantidad
    WHERE cod_producto=OLD.producto;
  END IF;
END;
//
DELIMITER ;


- Crear una función que reciba el cod_producto y responda, 
cuantas motos de ese codigo se han vendido.

DELIMITER //
CREATE FUNCTION mostrar_total_venta(cod_producto INT ) RETURNS INT
BEGIN 
DECLARE total INT;
SELECT SUM(cantidad) INTO total FROM pedidos_ventas WHERE producto= cod_producto AND tipo= "Sale";
RETURN total;

END;
//
DELIMITER;

SELECT mostrar_ventas(1044);


- Crear un procedimiento almacenado para actualizar un registro 
en la tabla pedidos_ventas. (tener en cuenta que cuando actualizo el dato cantidad, 
debo actualizar la cantidad_disponible en inventario).


DELIMITER //
CREATE PROCEDURE actualizar_cantidad(id INT, cantidad INT, tipoo VARCHAR(20))
BEGIN
    DECLARE cantidad_antiguo INT;
    DECLARE cantidad_nueva INT;
    IF tipoo="Ingresa" THEN 
        SELECT cantidad_disponible INTO cantidad_antiguo FROM pedidos_ventas WHERE cod_producto=producto;
        IF cantidad_antiguo<cantidad THEN
            SET cantidad_nueva=cantidad-cantidad_antiguo;
            UPDATE inventario SET cantidad_disponible=cantidad_disponible+ cantidad_nueva WHERE cod_producto=id;
            UPDATE pedidos_ventas SET tipo=tipoo WHERE cod_producto=id;
        ELSE 
            SET cantidad_nueva=cantidad-cantidad_antiguo;  

        END IF

    END IF;
END;
//
DELIMITER;


