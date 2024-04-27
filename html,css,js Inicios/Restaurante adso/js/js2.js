const lista = {};

function añadir() {
  const nombre = document.getElementById("nombre").value;

  if (nombre in lista) {
    lista[nombre]++;
  } else {
    lista[nombre] = 1;
  }

  document.getElementById("nombre").value = "";
  actualizarLista();
}

function actualizarLista() {
  const listaHtml = document.getElementById("datos_nombres");

  listaHtml.innerHTML = "";

  // Añadir cada elemento de la lista como un nuevo elemento de lista en HTML
  for (const nombre in lista) {
    const li = document.createElement("li");
    li.textContent = `${nombre}: ${lista[nombre]}`;
    listaHtml.appendChild(li);
  }
}
