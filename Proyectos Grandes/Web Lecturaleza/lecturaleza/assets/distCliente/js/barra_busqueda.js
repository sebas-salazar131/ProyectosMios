let barra_busqueda = document.getElementById("barra_busqueda");
let filasProductos = document.querySelectorAll('#datos_buscados tbody tr');

// Funcion para ocultar la tabla con los datos de los productos
function ocultarproductos() {
    document.getElementById('datos_buscados').style.display = 'none';
}

// Funcion para mostar la tabla con los datos de los productos
function mostrarproductos() {
    document.getElementById('datos_buscados').style.display = 'block';
}

// Función para mostrar un mensaje cuando no hay coincidencias
function mostrarMensajeNoEncontrado() {
    var mensajeNoEncontrado = document.getElementById('mensaje_no_encontrado');
    if (mensajeNoEncontrado) {
        mensajeNoEncontrado.style.display = 'none';
    }
}

// Función para buscar productos
function buscarProducto() {
    var filtro = barra_busqueda.value.toUpperCase();
    var coincidencias = 0;

    for (var i = 0; i < filasProductos.length; i++) {
        var nombreProducto = filasProductos[i].getElementsByTagName("td")[1];
        var txtValue = nombreProducto.textContent || nombreProducto.innerText;
        if (txtValue.toUpperCase().indexOf(filtro) > -1) {
            filasProductos[i].style.display = "";
            coincidencias++;
        } else {
            filasProductos[i].style.display = "none";
        }
    }

    // Mostrar mensaje si no hay coincidencias
    if (coincidencias === 0) {
        var mensajeNoEncontrado = document.getElementById('mensaje_no_encontrado');
        if (mensajeNoEncontrado) {
            mensajeNoEncontrado.style.display = 'block';
        }
    } else {
        mostrarMensajeNoEncontrado();
    }
}

// Manejar el estado del input
function estadoinput() {
    if (barra_busqueda.value === "") {
        ocultarproductos();
        mostrarMensajeNoEncontrado(); // Ocultar mensaje si el campo está vacío
    } else {
        mostrarproductos();
        buscarProducto(); // Llamar a la función de búsqueda cuando el input no está vacío
    }
}

// Escuchar el evento input en la barra de búsqueda
barra_busqueda.addEventListener("input", estadoinput);

// Llamar a la función de búsqueda inicialmente
buscarProducto();
