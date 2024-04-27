
let tbodyPersonas = document.getElementById("tbodyPersonas");
let listaPersonas = document.getElementById("listaPersonas");
let formularioCrearUsuario = document.getElementById("formularioCrearUsuario");

formularioCrearUsuario.addEventListener("submit",function(event){
	event.preventDefault();
	registrarUsuario();
});

function base_url(texto){
	return "http://localhost/lecturaleza/index.php/"+texto;
}
function registrarUsuario(texto) {
	let datos = new FormData(formularioCrearUsuario);
	let configuracion = {
		                   method: "POST",
						   headers:{ "Acept": "application/json"},
						   body: datos,
						};
	fetch( base_url('cliente/inicio/insertarUsuario'), configuracion )
	.then( resp => resp.json() )
	.then( data => {

		if (data.status && data.message == "OK##INSERT") {

			Swal.fire({
				title: 'USUARIO INSERTADO',
				icon:'success',
				text:'Se ha craedo con exito el usuario, puede ingresar al sistema con el documento',
				confirmButtonText:'ENTENDIDO'

			});
			document.getElementById("cedula").value = "";
			document.getElementById("nombres").value = "";
			document.getElementById("apellidos").value = "";
            document.getElementById("telefono").value = "";
            document.getElementById("direccion").value = "";
			document.getElementById("email").value = "";
            document.getElementById("password").value = "";
			cargarPersonas();
			
		}
		if (data.status==false && data.message == "OK##DUPLICADO") {

			Swal.fire({
				title: 'USUARIO INSERTADO',
				icon:'error',
				text:'Es posible que la cedula o email se encuentren registrados en otro usuario',
				confirmButtonText:'ENTENDIDO',
				confirmButtonColor: "#A10000"
			});
			cargarPersonas();
			
		}
		if (data.status==false && data.message == "OK##DATOS##VACIOS") {

			Swal.fire({
				title: 'USUARIO INSERTADO',
				icon:'error',
				text:'Todos los datos del formulario son obligatorio',
				confirmButtonText:'ENTENDIDO',
				confirmButtonColor: "#A10000"
			});
			cargarPersonas();
			
		}

	});					
}

function cargarPersonas(){
	fetch( base_url("admin/inicio/getListaUsuarios") )
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
