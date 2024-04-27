--Ejercicio 001
SELECT articulo.cod, articulo.nombre  FROM articulo WHERE pvp BETWEEN 400 AND 500;

--002
SELECT articulo.cod, articulo.nombre FROM articulo WHERE pvp IN(415,129,1259,3995);

--003
SELECT provincia.codp, provincia.nombre FROM provincia WHERE nombre NOT IN('Huelva', 'Sevilla', 'Asturias', 'Barcelona');

--004
SELECT provincia.codp FROM provincia WHERE  nombre='Alicante/Alacant';

--005
SELECT articulo.cod, articulo.nombre, articulo.pvp FROM articulo WHERE marca LIKE 'S%';

--006
SELECT * FROM usuario WHERE email LIKE '%eps%';

--007
SELECT tv.cod, articulo.nombre, tv.resolucion FROM tv JOIN articulo
ON tv.cod= articulo.cod  WHERE tv.pantalla NOT BETWEEN 22 AND 42;

--008
SELECT tv.cod, articulo.nombre FROM tv
JOIN articulo ON tv.cod = articulo.cod
WHERE tv.panel LIKE '%LED%' AND articulo.pvp <= 1000;

--009
SELECT usuario.email FROM usuario WHERE codpos NOT IN(02012,02018,02032);

--010
SELECT pack.cod, articulo.nombre FROM pack JOIN articulo ON 
pack.cod=articulo.cod;

--011
--YA ENTENDI
SELECT articulo.nombre, stock.entrega FROM cesta 
JOIN articulo ON cesta.articulo = articulo.cod  
JOIN stock ON articulo.cod = stock.articulo
WHERE stock.entrega ='Descatalogado';

--012
SELECT camara.cod, articulo.nombre, articulo.pvp FROM camara JOIN articulo ON
camara.cod=articulo.cod WHERE tipo LIKE '%compacta%';

--013

--014 
SELECT pedido.numPedido, pedido.fecha, usuario.nombre, usuario.apellidos
FROM pedido JOIN usuario ON  pedido.usuario=usuario.email
WHERE usuario.apellidos LIKE '%MARTINEZ%';


--015 los pongo en descendente y luego con el LIMIT cojo el primero de la fila
SELECT cod, nombre, marca FROM articulo ORDER BY pvp DESC LIMIT 1;

--16 dificil
SELECT articulo.nombre, articulo.marca, camara.resolucion
FROM camara 
JOIN articulo ON camara.cod = articulo.cod
WHERE articulo.cod NOT IN (SELECT articulo FROM linped); 

--17
SELECT articulo.cod, articulo.nombre, articulo.marca, camara.tipo FROM articulo JOIN camara 
ON articulo.cod=camara.cod WHERE articulo.marca IN ('Nikon', 'LG', 'Sigma');

--18
SELECT camara.cod, articulo.nombre, articulo.pvp FROM camara JOIN articulo
WHERE camara.tipo LIKE '%r?flex%' ORDER BY articulo.pvp DESC LIMIT 1;

--19 esta mala
SELECT DISTINCT marca.marca
FROM marca
WHERE NOT EXISTS (SELECT articulo.marca tv.cod FROM articulo JOIN tv ON 
articulo.cod=tv.cod WHERE articulo.marca = marca);

--20 dificil

--21
SELECT nombre FROM articulo WHERE nombre LIKE 'EOS';

--22 ta buena
SELECT objetivo.tipo, objetivo.focal
FROM objetivo WHERE objetivo.montura LIKE '%Canon%';

--23
SELECT nombre FROM articulo WHERE articulo.pvp>100 AND 200>=articulo.pvp;

--24
SELECT nombre FROM articulo WHERE articulo.pvp>=100 AND 300>=articulo.pvp;

--25 
SELECT articulo.nombre FROM articulo JOIN camara ON articulo.cod=camara.cod WHERE LEFT(articulo.marca, 1) <> 'S';


--T04 015
SELECT usuario.nombre, usuario.apellidos,
TIMESTAMPDIFF(YEAR,usuario.nacido,'2011-10-13')
AS edadaproximada FROM usuario WHERE usuario.email LIKE '%dlsi.ua.es%' ORDER BY edadaproximada DESC;