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

--actualizar en tabla inventario cuando se ingrese o salga o producto
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


insert into pedidos_ventas (id, producto, tipo, cantidad) VALUES ('6', '1055', 'Ingresa', 5);


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

DROP TRIGGER IF EXISTS actualiza_pedido_ventas;
DELIMITER //
CREATE TRIGGER actualiza_pedido_ventas AFTER UPDATE ON pedidos_ventas
FOR EACH ROW
BEGIN
  if(NEW.tipo="Ingresa") THEN
    if OLD.cantidad>NEW.cantidad THEN 
        UPDATE inventario SET cantidad_disponible=cantidad_disponible+(OLD.cantidad-NEW.cantidad)*-1
        WHERE cod_producto=OLD.producto;
    ELSE
        UPDATE inventario SET cantidad_disponible=cantidad_disponible-(NEW.cantidad-OLD.cantidad)*-1
        WHERE cod_producto=OLD.producto;
    END IF;   
  ELSE
    UPDATE inventario SET cantidad_disponible=NEW.cantidad
    WHERE cod_producto=OLD.producto;
  END IF;
END;
//
DELIMITER ;





Realizar disparadores para:

- Cuando se inserta un nuevo registro en pedidos_ventas, 
verificar primero si ingresa o sale,

Si ingresa incrementar la cantidad_disponible en la tabla inventario
Si sale disminuir cantidad_disponible en la tabla inventario.

- Cuando se borra un registro en la tabla pedidos_ventas
verificar si el registro borrado tenia ingresa o sale 
y deacuerdo a eso incrementar o disminuir la cantidad_disponible.

- Cuando se actualiza un registro existente en pedidos_ventas, 
verificar primero si ingresa o sale, e incrementar o disminuir la
cantidad_disponible en la tabla inventario.