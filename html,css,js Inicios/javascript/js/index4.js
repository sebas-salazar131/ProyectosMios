//la empresa x necesita un pequeño programa para calcular el descuento de una compra con las siguientes condiciones
//si compra mas de 5 tangas y ademas el precio total supera los 100.000 hacer un descuento del 10%
//si solo compro 5 tangas y no supera los 100.000 realizar un descuento del 5%
//si compra 20 o mas tangas o el valor total de las tangas superan los 200.000 realizar un descuento del 20%
//solo preguntar al usuario, la cantidad de tangas y el precio unitario
//imprimir subtotal, valor del descuento, tasa de descuento, total a pagar

let cantidad = parseInt(prompt("ingrese la cantidad de tangas que desea realizar"));
let unitario = parseInt(prompt("ingrese el precio unitario "));

let multi=cantidad*unitario;
let resultado="";
let total="";
if(cantidad>5 && multi>100000){
    resultado=multi*10/(100);
    total=multi-resultado;
    document.write("<br>este es el valor del descuento "+resultado);
    document.write("<br>la tasa del descuento fue del 10%");
    document.write("<br>el subtotal es: "+multi);
    document.write("<br>el total a pagar es "+total);
}else{
    if(cantidad==5 && multi<100000){
        resultado=multi*5/(100);
        total=multi-resultado;
        document.write("<br>este es el valor del descuento "+resultado);
        document.write("<br>la tasa del descuento fue del 5%");
        document.write("<br>el subtotal es: "+multi);
        document.write("<br>el total a pagar es "+total);
    }else{
        if(cantidad>1 && cantidad<5 && multi>1 && multi<100000){
            document.write("<br>no hay descuento este es su total ")
            document.write("<br>el total a pagar es "+multi);
    
        }
    }
}

if(cantidad>=20 || multi>200000){
    resultado=multi*20/(100);
    total=multi-resultado;
    document.write("<br>este es el valor del descuento "+resultado);
    document.write("<br>la tasa del descuento fue del 20%");
    document.write("<br>el subtotal es: "+multi);
    document.write("<br>el total a pagar es "+total);
}
