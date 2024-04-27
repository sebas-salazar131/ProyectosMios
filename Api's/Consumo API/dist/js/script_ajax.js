let waitContent = null;
let mostrar_contenido=null; 
let insertarPersona=null;
let form_editarPersona=null;
let form_eliminarPersona=null;
let modalEditar= null;
let modalEliminar=null;
let listaClientes=null;
window.onload = function(){
	waitContent = document.getElementById("waitContent");
	mostrar_contenido=document.getElementById("mostrar_contenido");
	insertarPersona=document.getElementById("insertarPersona");
	form_editarPersona=document.getElementById("form_editarPersona");
	form_eliminarPersona=document.getElementById("form_eliminarPersona");

	options= {
		backdrop: 'static',
		keyboard: false,
		focus: false
	};
	modalEditar= new bootstrap.Modal(document.getElementById('exampleModal2'), options);
	modalEliminar= new bootstrap.Modal(document.getElementById('exampleModal3'), options);

	insertarPersona.addEventListener("submit", function(event){
		event.preventDefault();
		crearCliente();
	});

	form_editarPersona.addEventListener("submit", function(event){
		event.preventDefault();
		editarCliente();
	});

	form_eliminarPersona.addEventListener("submit", function(event){
		event.preventDefault();
		eliminarCliente();
	});

	getClientes();
}
function crearCliente(){
   let cedula=document.getElementById("cedula").value;
   let nombres=document.getElementById("nombres").value;
   let apellidos=document.getElementById("apellidos").value;
   let telefono=document.getElementById("telefono").value;
   let direccion=document.getElementById("direccion").value;
   let email=document.getElementById("email").value;
    
   let datos = new FormData();
   datos.append("cedula", cedula);
   datos.append("nombres", nombres);
   datos.append("apellidos", apellidos);
   datos.append("telefono", telefono);
   datos.append("direccion", direccion);
   datos.append("email", email);

   let configuracion = {
                            method: "POST", 
							headers:{
								"Accept": "application/json",

							},
							body:datos,
                       };

	fetch("http://localhost/ProyectoPHP/Insert.php", configuracion)
	.then(resp => resp.json())
	.then(data =>{
		console.log("Respuesta API: ");
		console.log(data);

		if(data.respuesta.status){
			document.getElementById("cedula").value="";
			document.getElementById("nombres").value="";
			document.getElementById("apellidos").value="";
			document.getElementById("telefono").value="";
			document.getElementById("direccion").value="";
			document.getElementById("email").value="";

			document.getElementById("cedula").focus();

			Swal.fire({
				icon: 'Insertado con Exito',
				title: 'El usuario ha sido creado con exito',
				text: 'Success',
			  })
		}else{
			Swal.fire({
				icon: 'NO Insertado ',
				title: 'El usuario no se ha registrado',
				text: 'Error',
			  })
		}
	});				   


   console.log(cedula);
   console.log(nombres);
   console.log(apellidos);
   console.log(telefono);
   console.log(direccion);
   console.log(email);


}

function getClientes(){
	let endpointLocal = "http://localhost/ProyectoPHP/Obtener.php";
	//waitContent.style.display = 'block';
	fetch( endpointLocal )
	.then( res => res.json() )
	.then( data => {
		listaClientes=data.registros;
		mostrar_contenido.innerHTML = "";
			for (let i=0; i<data.registros.length; i++) {
				let Temp = `
										<th scope="row">${i}</th>
										<td>'${data.registros[i].cedula}'</td>
										<td>'${data.registros[i].nombres}'</td>
										<td>'${data.registros[i].apellidos}'</td>
										<td>'${data.registros[i].telefono}'</td>
										<td>'${data.registros[i].direccion}'</td>
									    <td>'${data.registros[i].email}'</td>
										<td><button type="button" class="col-12 btn btn-outline-primary" data-bs-toggle="modal"  onclick="editarPersona(${i})">Editar</button></td>
										<td><button type="button" class="col-12 btn btn-outline-primary" data-bs-toggle="modal"  onclick="eliminarPersona(${i})">Eliminar</button></td>
                             `;
			 mostrar_contenido.innerHTML += Temp;
			}
		// console.log("Datos servidor:");
		// console.log(data);
		waitContent.style.display = 'none';
	});
}

function eliminarPersona(posicion){
	document.getElementById("eliminar_cedula").value=listaClientes[posicion].cedula;
	document.getElementById("eliminar_nombres").value=listaClientes[posicion].nombres;
	document.getElementById("eliminar_apellidos").value=listaClientes[posicion].apellidos;
	document.getElementById("eliminar_telefono").value=listaClientes[posicion].telefono;
	document.getElementById("eliminar_direccion").value=listaClientes[posicion].direccion;
	document.getElementById("eliminar_email").value=listaClientes[posicion].email;

    modalEliminar.show();
}

function editarPersona(posicion){
	document.getElementById("editar_cedula").value=listaClientes[posicion].cedula;
	document.getElementById("editar_nombres").value=listaClientes[posicion].nombres;
	document.getElementById("editar_apellidos").value=listaClientes[posicion].apellidos;
	document.getElementById("editar_telefono").value=listaClientes[posicion].telefono;
	document.getElementById("editar_direccion").value=listaClientes[posicion].direccion;
	document.getElementById("editar_email").value=listaClientes[posicion].email;

    modalEditar.show();
}

function editarCliente(){
	let cedula=document.getElementById("editar_cedula").value;
   let nombres=document.getElementById("editar_nombres").value;
   let apellidos=document.getElementById("editar_apellidos").value;
   let telefono=document.getElementById("editar_telefono").value;
   let direccion=document.getElementById("editar_direccion").value;
   let email=document.getElementById("editar_email").value;
    
   let datos = new FormData();
   datos.append("cedula", cedula);
   datos.append("nombres", nombres);
   datos.append("apellidos", apellidos);
   datos.append("telefono", telefono);
   datos.append("direccion", direccion);
   datos.append("email", email);

   let configuracion = {
                            method: "POST", 
							headers:{
								"Accept": "application/json",

							},
							body:datos,
                       };

	fetch("http://localhost/ProyectoPHP/Editar.php", configuracion)
	.then(resp => resp.json())
	.then(data =>{
		console.log("Respuesta API: ");
		console.log(data);

		if(data.respuesta.status){
			Swal.fire({
				icon: 'Insertado con Exito',
				title: 'El usuario ha sido creado con exito',
				text: 'Success',
			  })
		}else{
			Swal.fire({
				icon: 'NO Insertado ',
				title: 'El usuario no se ha registrado',
				text: 'Error',
			  })
		}
	});				   


  
}

function eliminarCliente(){
	let cedula=document.getElementById("eliminar_cedula").value;
   let nombres=document.getElementById("eliminar_nombres").value;
   let apellidos=document.getElementById("eliminar_apellidos").value;
   let telefono=document.getElementById("eliminar_telefono").value;
   let direccion=document.getElementById("eliminar_direccion").value;
   let email=document.getElementById("eliminar_email").value;
    
   let datos = new FormData();
   datos.append("cedula", cedula);
   datos.append("nombres", nombres);
   datos.append("apellidos", apellidos);
   datos.append("telefono", telefono);
   datos.append("direccion", direccion);
   datos.append("email", email);

   let configuracion = {
                            method: "POST", 
							headers:{
								"Accept": "application/json",

							},
							body:datos,
                       };

	fetch("http://localhost/ProyectoPHP/Eliminar.php", configuracion)
	.then(resp => resp.json())
	.then(data =>{
		console.log("Respuesta API: ");
		console.log(data);

		if(data.respuesta.status){
			Swal.fire({
				icon: 'Eliminado con Exito',
				title: 'El usuario ha sido Eliminado con exito',
				text: 'Success',
			  })
		}else{
			Swal.fire({
				icon: 'NO Eliminado ',
				title: 'El usuario no se ha eliminado',
				text: 'Error',
			  })
		}
	});				   


  
}
