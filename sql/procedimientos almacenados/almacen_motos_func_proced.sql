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

INSERT INTO inventario VALUES ('1044','KTM Duke 200',3);
INSERT INTO inventario VALUES ('1055','YAMAHA MT 10',0);
INSERT INTO inventario VALUES ('1066','SUZUKY GSX-R 1000',0);

INSERT INTO pedidos_ventas (producto,tipo,cantidad) VALUES ('1044','Ingresa',10);
INSERT INTO pedidos_ventas (producto,tipo,cantidad) VALUES ('1044','Sale',5);
INSERT INTO pedidos_ventas (producto,tipo,cantidad) VALUES ('1044','Sale',2);


Ejercicios Funciones y Procedimientos Almacenados.

- Crear una función que reciba el cod_producto y responda, 
cuantas motos de ese codigo se ha vendido la moto. (sale)

- Crear un procedimiento almacenado para actualizar un registro 
en la tabla pedidos_ventas. (tener en cuenta que cuando actualizo el dato cantidad, 
debo actualizar la cantidad_disponible en inventario).

