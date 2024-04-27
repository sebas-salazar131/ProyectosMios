CREATE TABLE Productos (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50),
    Precio DECIMAL(10, 2)
);

INSERT INTO Productos (Nombre, Precio) VALUES
    ('Producto A', 10.99),
    ('Producto B', 20.49),
    ('Producto C', 15.75);

CREATE TABLE HistoricoCambios (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    ProductoID INT,
    PrecioAnterior DECIMAL(10, 2),
    PrecioNuevo DECIMAL(10, 2),
    Fecha TIMESTAMP,
    FOREIGN KEY (ProductoID) REFERENCES Productos(ID)
);

CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT,
    cantidad INT,
    fecha_venta DATE,
    FOREIGN KEY (id_producto) REFERENCES productos(ID)
);

-- Insertar algunas ventas de productos de ejemplo
INSERT INTO ventas (id_producto, cantidad, fecha_venta) VALUES (1, 5, '2024-02-21');
INSERT INTO ventas (id_producto, cantidad, fecha_venta) VALUES (2, 3, '2024-02-22');
INSERT INTO ventas (id_producto, cantidad, fecha_venta) VALUES (1, 2, '2024-02-22');
INSERT INTO ventas (id_producto, cantidad, fecha_venta) VALUES (3, 7, '2024-02-23');
INSERT INTO ventas (id_producto, cantidad, fecha_venta) VALUES (1, 4, '2024-02-24');
INSERT INTO ventas (id_producto, cantidad, fecha_venta) VALUES (2, 6, '2024-02-25');
INSERT INTO ventas (id_producto, cantidad, fecha_venta) VALUES (3, 8, '2024-02-26');
INSERT INTO ventas (id_producto, cantidad, fecha_venta) VALUES (1, 3, '2024-02-27');


-- Crear un trigger: Si actualiza el precio de un producto se debe registrar el cambio en la tabla HistoricoCambios.
DELIMITER //
CREATE TRIGGER actualizar_historico AFTER UPDATE on productos
FOR EACH ROW
BEGIN
    INSERT INTO HistoricoCambios(ProductoID, PrecioAnterior, PrecioNuevo, Fecha) VALUES (NEW.ID, OLD.Precio, NEW.Precio, NOW());
END;
//
DELIMITER;

-- Crear un procedimiento almacenado para calcular el total de ventas de un producto en un rango de fechas.
DROP PROCEDURE total_ventas;
DELIMITER //
CREATE PROCEDURE total_ventas( id_productoss INT, fecha_ini DATE, fecha_fin DATE)
BEGIN
    SELECT id_venta, id_producto, cantidad, productos.Precio, (productos.Precio*cantidad) as total, fecha_venta FROM ventas JOIN productos on ventas.id_producto=productos.ID
    WHERE fecha_venta BETWEEN fecha_ini AND fecha_fin AND ventas.id_producto=id_productoss ;

END;
//
DELIMITER;    

CALL total_ventas(1,'2024-02-21','2024-02-23');


-- Crear un procedimiento almacenado para obtener el producto más vendido en un año determinado.
DROP PROCEDURE mas_vendido;
DELIMITER //
CREATE PROCEDURE mas_vendido( anio DATE)
BEGIN
    SELECT productos.nombre, SUM(ventas.cantidad) AS total FROM productos
    JOIN ventas ON productos.ID= ventas.id_producto WHERE YEAR(fecha_venta)= anio
    GROUP BY id_producto ORDER BY total DESC LIMIT 1;
END;
//
DELIMITER;

CALL mas_vendido('2024');

-- Crear un procedimiento almacenado para obtener el total de ventas por mes.



-- Crear un procedimiento almacenado para obtener el total de ventas por  un mes determinado.
DROP PROCEDURE totalPorMes;
DELIMITER //
CREATE PROCEDURE totalPorMes( mes DATE)
BEGIN
    SELECT cantidad, productos.Precio, SUM(productos.Precio*cantidad) as total, fecha_venta FROM ventas JOIN productos on ventas.id_producto=productos.ID
    WHERE MONTH(fecha_venta)=mes;
END;
//
DELIMITER;

CALL totalPorMes('2024');

-- Crear un procedimiento almacenado para calcular el promedio de ventas mensual.
DROP PROCEDURE calcular_promedio;
DELIMITER //
CREATE PROCEDURE calcular_promedio()
BEGIN
    
END;
//
DELIMITER;


-- Crear un procedimiento almacenado para calcular el promedio de ventas mensual de un mes determinado.

-- Crear un procedimiento almacenado para obtener los productos con ventas superiores a un valor dado.



