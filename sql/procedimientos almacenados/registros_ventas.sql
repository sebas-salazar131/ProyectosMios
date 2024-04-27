CREATE DATABASE registro_ventas;
USE registro_ventas;

CREATE TABLE vendedores (
  id_vendedor INT UNSIGNED AUTO_INCREMENT,
  nombre VARCHAR(30),
  PRIMARY KEY (id_vendedor)
);

-- Insertar registros en la tabla vendedores
INSERT INTO vendedores (nombre) VALUES
('Juan'),
('María'),
('Pedro'),
('Luis'),
('Ana');

CREATE TABLE productos (
  cod_producto INT UNSIGNED AUTO_INCREMENT,
  nombre VARCHAR(30),
  cantidad_disponible INT,
  PRIMARY KEY (cod_producto)
);

-- Insertar registros en la tabla productos
INSERT INTO productos (nombre, cantidad_disponible) VALUES
('Producto A', 10),
('Producto B', 20),
('Producto C', 15),
('Producto D', 25),
('Producto E', 30);

CREATE TABLE ventas (
  codigo_venta INT UNSIGNED AUTO_INCREMENT,
  fecha DATE,
  cod_producto INT UNSIGNED,
  valor FLOAT(10,2),
  cantidad INT,
  id_vendedor INT UNSIGNED,
  PRIMARY KEY (codigo_venta),
  FOREIGN KEY (cod_producto) REFERENCES productos(cod_producto),
  FOREIGN KEY (id_vendedor) REFERENCES vendedores(id_vendedor)
);

CREATE TABLE registro_ventas (
  id_registro INT UNSIGNED AUTO_INCREMENT,
  fecha DATE,
  id_vendedor INT UNSIGNED,
  total_vendido FLOAT(10,2),
  cantidad_productos INT,
  PRIMARY KEY (id_registro),
  FOREIGN KEY (id_vendedor) REFERENCES vendedores(id_vendedor)
);


----------------- TRIGGERS ------------------

-- Cuando se inserta, acutalice o elimine un nuevo registro en ventas se necesita que los trigges mantengan actualizado la cantidad disponible del producto.
-- Antes de insertar o actualizar una venta, revisar si hay cantidad disponible del producto.
DROP TRIGGER intersar_registro;
DELIMITER //
CREATE TRIGGER intersar_registro BEFORE INSERT ON ventas
FOR EACH ROW
BEGIN
    IF(SELECT cantidad_disponible FROM productos WHERE cod_producto=NEW.cod_producto)>=NEW.cantidad THEN
      UPDATE productos SET cantidad_disponible=cantidad_disponible-NEW.cantidad WHERE cod_producto=NEW.cod_producto;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay suficientes productos en el inventario';
    END IF;
END;
//
DELIMITER ; 

DROP TRIGGER actualizar_productos;
DELIMITER //
CREATE TRIGGER actualizar_productos AFTER UPDATE ON ventas
FOR EACH ROW
BEGIN
  DECLARE valor_resto int;
  if(NEW.cantidad>OLD.CANTIDAD) THEN
    IF(SELECT cantidad_disponible FROM productos WHERE cod_producto=NEW.cod_producto)>=NEW.cantidad THEN
      SET valor_resto= NEW.cantidad-OLD.cantidad;
      UPDATE productos SET cantidad_disponible=cantidad_disponible-valor_resto WHERE cod_producto=NEW.cod_producto;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay suficientes productos en el inventario';
    END IF;
  ELSE
    SET valor_resto= OLD.cantidad-NEW.cantidad;
    UPDATE productos SET cantidad_disponible=cantidad_disponible+valor_resto WHERE cod_producto=NEW.cod_producto;
  END IF;
END;
//
DELIMITER ;

DROP TRIGGER eliminar_producto;
DELIMITER //
CREATE TRIGGER eliminar_producto AFTER DELETE ON ventas
FOR EACH ROW
BEGIN
  UPDATE productos SET cantidad_disponible=cantidad_disponible+OLD.cantidad WHERE cod_producto=OLD.cod_producto;
END;
//
DELIMITER ;


-------------------- FUNCTION ----------------------
--mysql -u root -p
--  Crear una función que reciba el id del vendedor y calcule el total en dinero de las ventas que el vendedor realizó en el día.
USE registro_ventas;
DROP FUNCTION totalPorDia;
DELIMITER //
CREATE FUNCTION totalPorDia(id INT)RETURNS INT
BEGIN
  DECLARE total int;
  SELECT  SUM(valor*cantidad) INTO total FROM ventas WHERE id_vendedor=id AND fecha=CURDATE();
  RETURN total; 
END;
//
DELIMITER;
SELECT totalPorDia(1);
----------------------- PROCEDURE -------------------

/*  Crear un procedimiento almacenado para insertar o actualizar un registro  en la tabla registro_ventas.
Esta tabla debe tener calculado el total de dinero y el total de la cantidad de productos que un vendedor vendió en el dia.   Asi para todos los vendedores. (Usar la función anterior).  */
DROP PROCEDURE actualizar_registro;
DELIMITER //
CREATE PROCEDURE actualizar_registro( id_vende INT)
BEGIN
  DECLARE total_pordia int;
  /* DECLARE id_vendedor_registro int; */
  DECLARE cantidad_total int;
  DECLARE fecha_registro DATE;
  DECLARE fecha_ventas DATE;
  DECLARE valor_resto int;
  SET total_pordia= (SELECT totalPorDia(id_vende));
  
  SELECT fecha INTO fecha_ventas FROM ventas WHERE id_vendedor=id_vende;
  SELECT fecha INTO fecha_registro FROM registro_ventas WHERE id_vendedor=id_vende;
  SELECT SUM(cantidad) INTO cantidad_total FROM ventas WHERE id_vendedor=id_vende;

  IF (SELECT id_vendedor FROM registro_ventas WHERE id_vendedor=id_vende) THEN
    IF NEW.cantidad>OLD.cantidad THEN
      SET valor_resto= NEW.cantidad-OLD.cantidad;
      UPDATE registro_ventas SET cantidad_productos=cantidad_productos-valor_resto WHERE id_vendedor=id_vende;
    ELSE
      SET valor_resto= OLD.cantidad-NEW.cantidad;
      UPDATE registro_ventas SET cantidad_productos=cantidad_productos+valor_resto WHERE id_vendedor=id_vende;
    END IF;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'aqui va el actualizar';
  ELSE
    INSERT INTO registro_ventas(fecha, id_vendedor, total_vendido, cantidad_productos) VALUES (fecha_ventas, id_vende, total_pordia, cantidad_total);
  END IF;

END;
//
DELIMITER;
CALL actualizar_registro(1);

