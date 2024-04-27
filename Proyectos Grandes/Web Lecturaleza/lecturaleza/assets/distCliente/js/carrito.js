let pago=0;
let total_real=0;
let indexado=0;
function enviar_carrito(event,nombre,precio,id){
    console.log(nombre,precio,id);
    event.preventDefault(); 
}

$(function () {
    $('[data-toggle="popover"]').popover()
  })

  function formatearComoMonedaColombiana(numero) {
    // Opciones para el formato de moneda
    const opcionesMoneda = {
        style: 'currency',
        currency: 'COP', // Cambia 'USD' por el código de la moneda que desees
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    };

    // Aplicar formato de moneda y devolver como cadena
    return numero.toLocaleString('es-CO', opcionesMoneda);
}

function sumar(index) {
    let precio = parseFloat(document.getElementById("precio_" + index).value);
    let cantidadInput = document.getElementById("cantidad_" + index);
    let cantidad = parseInt(cantidadInput.value);
    let cant = cantidad + 1;
    cantidadInput.value = cant;

    console.log(cant);

    let precio_total = cant * precio;

    if (index === indexado) {
        let operacion = precio_total - total_real;
        total_real += precio;
        console.log("igual");
        indexado = index;
    } else {
        total_real = precio + total_real;
        console.log("no igual");
    }

    let totalElement = document.getElementById("total_" + index);
    let totalActual = parseInt(totalElement.innerText.replace(/\D/g, '')) || 0; // Elimina caracteres no numéricos
    totalActual += precio_total;

    totalElement.innerText = formatearComoMonedaColombiana(precio_total);

    console.log(precio_total);

    pago += precio_total;
    console.log("+dsadadasd"+formatearComoMonedaColombiana(pago));

    document.getElementById("total_pago").innerText = formatearComoMonedaColombiana(total_real);

    // Resto de tu lógica aquí...
}

function restar(index){
    let precio = parseFloat(document.getElementById("precio_" + index).value);
    let cantidadInput = document.getElementById("cantidad_" + index);
    let cantidad = parseInt(cantidadInput.value);
    if(cantidad>=1){
        
        let cant = cantidad - 1;
        cantidadInput.value = cant;
    
        console.log(cant);
    
        let precio_total = cant * precio;
    
        if (index === indexado) {
            let operacion = precio_total - total_real;
            total_real -= precio;
            console.log("igual");
            indexado = index;
        } else {
            total_real =  total_real-precio;
            console.log("no igual");
        }
    
        let totalElement = document.getElementById("total_" + index);
        let totalActual = parseInt(totalElement.innerText.replace(/\D/g, '')) || 0; // Elimina caracteres no numéricos
        totalActual = precio_total;
    
        totalElement.innerText = formatearComoMonedaColombiana(precio_total);
    
        console.log(precio_total);
    
        pago += precio_total;
        console.log("+dsadadasd"+formatearComoMonedaColombiana(pago));
    
        document.getElementById("total_pago").innerText = formatearComoMonedaColombiana(total_real);
    }else{
        console.log("paila so");
    }
   

}





