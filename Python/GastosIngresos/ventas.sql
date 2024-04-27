CREATE DATABASE ventas;

CREATE TABLE articulos (
    id_articulo INT NOT NULL,
    descripcion VARCHAR(30) NOT NULL,
    precio FLOAT NULL,
    stock INT NOT NULL,
    PRIMARY KEY (id_articulo)
);

CREATE TABLE ventas (
    id_venta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_articulo INT NOT NULL,
    cantidad INT NOT NULL,
    total FLOAT DEFAULT NULL,
    FOREIGN KEY (id_articulo) REFERENCES articulos (id_articulo)
);

-- Un procedimiento almacenado que solicite el id_articulo y la cantidad,  
-- El procedimiento calcula el valor total e insertar la venta.

-- Debe existrir un trigger que actualice el stock.  tambien si actualizo y si elimino

