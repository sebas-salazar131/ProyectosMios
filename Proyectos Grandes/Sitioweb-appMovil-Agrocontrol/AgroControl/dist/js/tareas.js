document.getElementById('registroTarea').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe normalmente
    
    // Aquí puedes agregar la lógica para manejar la solicitud del formulario, por ejemplo, llamando a la función registrarCultivo()
    registrarTarea(); 
});


  

function registrarTarea() {
    // Crea un objeto FormData y añade los datos del formulario
    var formData = new FormData();
    formData.append('titulo', document.getElementById("titulo").value);
    formData.append('descripcion', document.getElementById("descripcion").value);
    formData.append('id_cultivo', document.getElementById("cultivo").value);
    formData.append('estado', document.getElementById("estado").value);

    // Realiza una solicitud POST a la API
    fetch('http://localhost/APIenPHP-agricultura/tareas/Insertar.php', {
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

    window.location.href = 'http://localhost/AgroControl/index.php/admin/Inicio/verTareas';
    })
    .catch(error => {
    // Maneja los errores de la solicitud
    console.error('Error al enviar datos a la API:', error);
    });
}

    function actualizarTarea(){
        // Crea un objeto FormData y añade los datos del formulario
        var formData = new FormData();
        formData.append('id_tarea', document.getElementById("id_tarea").value);
        formData.append('id_cultivo', document.getElementById("id_cultivo").value);
        formData.append('titulo', document.getElementById("titulo").value);
        formData.append('descripcion', document.getElementById("descripcion").value);
        formData.append('estado', document.getElementById("estado").value);
       
        // Realiza una solicitud POST a la API
        fetch('http://localhost/APIenPHP-agricultura/tareas/Update.php', {
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

    function actualizarCultivo(){
    // Crea un objeto FormData y añade los datos del formulario
        var formData = new FormData();
        formData.append('id_cultivo', document.getElementById("id_cultivo").value);
        formData.append('nombre', document.getElementById("nombre").value);
        formData.append('descripcion', document.getElementById("descripcion").value);
        formData.append('tipo', document.getElementById("tipo").value);
    
        // Realiza una solicitud POST a la API
        fetch('http://localhost/APIenPHP-agricultura/cultivos/Update.php', {
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
        window.location.href = 'http://localhost/AgroControl/index.php/admin/Inicio/verTareas';
  }

