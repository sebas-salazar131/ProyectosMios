let producto= "";
let precioUnitario=0;
let cantidad=0;
let iva=0;
let total_Producto=0;
let subtotal=0;
let descuento=0;
let total_pagar=0;
let subtotal_producto=0;
let total_descuento=0;
let sub=0;
let i=0;
let array=[];


function capturar_datos(){
    producto=document.getElementById("producto").value;
    precioUnitario=parseInt(document.getElementById("valor_u").value);
    cantidad=parseInt(document.getElementById("cantidad").value);
    console.log("producto: "+producto);
    console.log("Precio Unitario: "+precioUnitario);
    console.log("Cantidad: "+cantidad);

    array[i]=precioUnitario;
    i++;
    return calcular_datos(precioUnitario, cantidad)
}

function calcular_datos(precioU, cant){
    iva=precioU*cant*0.19;
    total_Producto=precioU*cant+iva;
    subtotal+=total_Producto;
    total_pagar+=total_Producto;
    console.log("iva: "+iva);
    console.log("total producto: "+total_Producto);
    console.log("subtotal: "+subtotal);
    return imprimir_datos();
    
}
function imprimir_datos(){
    ordenar();
    const lista=document.getElementById("datos");
    const tr=document.createElement("tr");
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const td3=document.createElement("td");
    const td4=document.createElement("td");
    const td5=document.createElement("td")
    const td6=document.createElement("td");

    const text_td1=document.createTextNode(producto);
    const text_td2=document.createTextNode(precioUnitario);
    const text_td3=document.createTextNode(cantidad);
    const text_td4=document.createTextNode(iva);
    const text_td5=document.createTextNode(array);
    const text_td6=document.createTextNode(total_Producto);

    td1.appendChild(text_td1);
    td2.appendChild(text_td2);
    td3.appendChild(text_td3);
    td4.appendChild(text_td4);
    td5.appendChild(text_td5);
    td6.appendChild(text_td6);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);

    return lista.appendChild(tr), imprimir_foot(), descuentos(), ordenar();
 
}

function imprimir_foot(){
    sub=document.getElementById("subtotal_productos");
    subtotal_producto+=total_Producto;
    document.getElementById("subtotal_productos").innerHTML=subtotal_producto;

}
function descuentos(){
    descuento=parseInt(document.getElementById("descuento").value);
    total_descuento=subtotal-descuento;
    if(descuento>0){
        document.getElementById("total").innerHTML=total_descuento;
        document.getElementById("descuentoss").innerHTML=descuento;
    }else{
        document.getElementById("total").innerHTML=subtotal_producto;
        document.getElementById("descuentoss").innerHTML=0;
    }
    
    // console.log("descuento"+total_descuento)
}

function ordenar(){
 
    array.sort(function(a,b){
        return a-b;
    
    });
    
}
function eliminar(){
    
    capturar_datos()
    for(let i=0; i<array.length;i++){
        array.splice(0, 1);
        document.getElementById("resp").innerHTML=array[i];
    }
    
}
