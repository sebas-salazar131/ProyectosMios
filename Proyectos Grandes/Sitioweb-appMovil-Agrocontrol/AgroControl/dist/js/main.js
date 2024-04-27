document.getElementById('registroForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita que el formulario se envíe normalmente
  
  registrarPersona(); // Llama a la función para registrar la persona
});


function registrarPersona() {
  // Crea un objeto FormData y añade los datos del formulario
  var formData = new FormData();
  formData.append('cedula', document.getElementById("cedula").value);
  formData.append('nombre', document.getElementById("nombre").value);
  formData.append('apellido', document.getElementById("apellido").value);
  formData.append('email', document.getElementById("email").value);
  formData.append('pass', document.getElementById("pass").value);
  formData.append('telefono', document.getElementById("telefono").value);
  formData.append('estado', "ACTIVO");

  // Realiza una solicitud POST a la API
  fetch('http://localhost/APIenPHP-agricultura/agricultor/Insertar.php', {
    method: 'POST',
    body: formData // Utiliza el objeto FormData como cuerpo de la solicitud
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }
    return response.json();
  })
  .then(data => {
    // Maneja la respuesta de la API
    console.log('Datos enviados correctamente a la API.');
    console.log('Respuesta de la API:', data);
    // Aquí puedes agregar lógica adicional según la respuesta de la API
  })
  .catch(error => {
    // Maneja los errores de la solicitud
    console.error('Error al enviar datos a la API:', error);
  });
}



function cargarDatos(cedula){
  // Crea un objeto FormData y añade los datos del formulario
  var formData = new FormData();
  formData.append('cedula', cedula);
  

  // Realiza una solicitud POST a la API
  fetch('http://localhost/APIenPHP-agricultura/agricultor/getPersona.php', {
    method: 'POST',
    body: formData // Utiliza el objeto FormData como cuerpo de la solicitud
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }
    return response.json();
  })
  .then(data => {
    // Maneja la respuesta de la API
    console.log('Datos enviados correctamente a la API.');
    console.log('Respuesta de la API:', data);
    document.getElementById("cedula").value = data.cedula;
    document.getElementById("nombre").value = data.nombre;
    document.getElementById("apellido").value = data.apellido;
    document.getElementById("email").value = data.email;
    document.getElementById("pass").value = data.pass;
    document.getElementById("telefono").value = data.telefono;
  })
  .catch(error => {
    // Maneja los errores de la solicitud
    console.error('Error al enviar datos a la API:', error);
  });




}

function actualizar(){
  // Crea un objeto FormData y añade los datos del formulario
  var formData = new FormData();
  formData.append('cedula', document.getElementById("cedula").value);
  formData.append('nombre', document.getElementById("nombre").value);
  formData.append('apellido', document.getElementById("apellido").value);
  formData.append('email', document.getElementById("email").value);
  formData.append('pass', document.getElementById("pass").value);
  formData.append('telefono', document.getElementById("telefono").value);
  formData.append('estado', document.getElementById("estado").value);

  // Realiza una solicitud POST a la API
  fetch('http://localhost/APIenPHP-agricultura/agricultor/Update.php', {
    method: 'POST',
    body: formData // Utiliza el objeto FormData como cuerpo de la solicitud
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }
    return response.json();
  })
  .then(data => {
    // Maneja la respuesta de la API
    console.log('Datos enviados correctamente a la API.');
    console.log('Respuesta de la API:', data);
    // Aquí puedes agregar lógica adicional según la respuesta de la API
  })
  .catch(error => {
    // Maneja los errores de la solicitud
    console.error('Error al enviar datos a la API:', error);
  });
}







