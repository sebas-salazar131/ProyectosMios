
let tbodyProductos = document.getElementById("tbodyProductos");
let listaProductos = null;
let formularioCrearProducto = document.getElementById("formularioCrearProducto");

formularioCrearProducto.addEventListener("submit", function(event){
	event.preventDefault();
	registrarProducto();
});

function base_url(texto){
	return "http://localhost/lecturaleza/index.php/"+texto;
}

function registrarProducto(){
	
	let datos = new FormData( formularioCrearProducto );
	let configuracion = {
							method: "POST",
							headers: { "Accept": "application/json" },
							body: datos,
						};
	fetch( base_url('admin/Productos/createProduct'), configuracion )
	.then( resp => resp.json() )
	.then( data => {

		if (data.status && data.message=="OK##INSERT"){
			Swal.fire({
			  title: 'USUARIO INSERTADO',
			  icon: 'success',
			  text: 'Se ha creado con exito el usuario, puede ingresar al sistema usando como contraseña la cedula.',
			  confirmButtonText: 'ENTENDIDO',
			  confirmButtonColor: "#00A100",
			});

			document.getElementById("campo_producto").value = "";
			document.getElementById("campo_precio").value = "";
			document.getElementById("campo_cantidad").value = "";
			document.getElementById("campo_descripcion").value = "";
			document.getElementById("campo_fecha").value = "";
			document.getElementById("campo_tipo").value = "";
			document.getElementById("campo_imagen").value = "----";
			
			cargarProductos();
		}

		if (data.status==false && data.message=="ERROR##DUPLICADO"){
			Swal.fire({
			  title: 'ERROR DATOS DUPLICADOS',
			  icon: 'error',
			  text: 'Es posible que la cedula o el email, se encuentren registrados para otro usuario.',
			  confirmButtonText: 'ENTENDIDO',
			  confirmButtonColor: "#A10000",
			});
		}

		if (data.status==false && data.message=="ERROR##DATOS##VACIOS"){
			Swal.fire({
			  title: 'ERROR DATOS VACIOS',
			  icon: 'error',
			  text: 'Todos los datos del formulario son obligatorios.',
			  confirmButtonText: 'ENTENDIDO',
			  confirmButtonColor: "#A10000",
			});
		}

	});

}



function cargarProductos() {
    fetch(base_url("admin/Productos/getListaProductos"))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); 
        })
        .then(data => {
            let tbodyProductos = document.getElementById("tbodyProductos");
            tbodyProductos.innerHTML = "";

            if (data && data.length > 0) {
                data.forEach(producto => {
                    let listItem = document.createElement("tr");

                    listItem.innerHTML += `
					   <td>${producto.id_producto}</td>
                        <td>${producto.nombre_producto}</td>
                        <td>${producto.precio_venta}</td>
                        <td>${producto.cantidad_disponible}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.fecha_vencimiento}</td>
                        <td>${producto.tipo}</td>
                    `;

                    let imagen = document.createElement("img");
                    if (producto.img) {
                        imagen.src = `/lecturaleza/assets/dist/img/img_productos/${producto.img}`;
                    } else {
                        imagen.src = `assets/dist/img/img_productos/choclon.png`;
                    }
                    imagen.alt = "Imagen del producto";
                    imagen.style.width = "50px"; 
                    let tdImagen = document.createElement("td");
                    tdImagen.appendChild(imagen);
                    listItem.appendChild(tdImagen);

                    tbodyProductos.appendChild(listItem);
                });
            } else {
                console.log('La respuesta está vacía.');
            }
        })
        .catch(error => {
            console.error('Error al cargar la lista de productos:', error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    cargarProductos();
});




function abrirModalEditar(i){
	console.log( "Abriendo modal para editar a:" );
	console.log( listaProductos[i] );
}

function confirmarEliminacion(i){
	console.log( "Abriendo confirmacion para eliminar a:" );
	console.log( listaProductos[i] );
}