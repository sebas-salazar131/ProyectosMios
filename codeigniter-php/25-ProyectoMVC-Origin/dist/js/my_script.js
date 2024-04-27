
let tbodyPersonas = document.getElementById("tbodyPersonas");
let listaPersonas = null;
let formularioCrearUsuario=document.getElementById("formularioCrearUsuario");

formularioCrearUsuario.addEventListener("submit", function(event){
	event.preventDefault();
	registrarUsuario();
});

function base_url(texto){
	return "http://localhost/25-ProyectoMVC-Origin/index.php/"+texto;
}
function registrarUsuario(){
	let datos = new FormData(formularioCrearUsuario);
	let configuracion={
		                method: "POST",
						header:{"Accept": "application/json"},
						body:datos,
	                 };
    fetch( base_url('admin/Usuario/insertarUsuario'), configuracion)
	.then(resp => resp.json())
	.then(data => {
		console.log("Se recibe de la API insertar: ");
		console.log(data);
		if(data.status && data.massage=="OK##INSERT"){
			Swal.fire({
				title: 'Usuario insertado!',
				mensaje: 'se ha creado con exito el usuario!',
				boton: 'success'

			});
		}
		if(data.status && data.massage=="ERROR##DUPLICADO"){
			Swal.fire(
				'Error datos duplicados',
				'es posible que la cedula o el email ya esten existentes!',
				'success'
			  )
		}
		if(data.status && data.massage=="ERROR##DATOS#VACIOS"){
			Swal.fire(
				'Error datos vacios',
				'todos los datos del formularios son oblic¿garios',
				'success'
			  )
		}

	});
}

function cargarPersonas(){
	fetch( base_url("admin/Usuario/getListaUsuarios") )
	.then( res => res.json() )
	.then( data => {
		
		listaPersonas = data;
		tbodyPersonas.innerHTML = "";
		for (var i = 0; i < data.length; i++) {
			html_tr = `
						<tr>
				            <td>${ data[i].cedula }</td>
				            <td>${ data[i].nombres }</td>
				            <td>${ data[i].apellidos }</td>
				            <td>${ data[i].telefono }</td>
				            <td>${ data[i].direccion }</td>
				            <td>${ data[i].email }</td>
				            <td>
				            	<button class="btn btn-primary" onclick="abrirModalEditar(${i})" >
				            		Editar
				            	</button>
				            	<button class="btn btn-danger" onclick="confirmarEliminacion(${i})">
				            		Eliminar
				            	</button>
				            </td>
				        </tr>
					  `;
			tbodyPersonas.innerHTML += html_tr;
		}

	});
}

function abrirModalEditar(indice){
	console.log( "Abriendo modal para editar a:" );
	console.log( listaPersonas[indice] );
}

function confirmarEliminacion(indice){
	console.log( "Abriendo confirmacion para eliminar a:" );
	console.log( listaPersonas[indice] );
}


cargarPersonas();