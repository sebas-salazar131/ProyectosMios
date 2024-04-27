//dolar a pesos
// let acum=0
// for(let i=0;i<5;i++){
//     let dolar= parseInt(prompt("ingrese venta en dolares"+(i+1)));
//     acum=acum+dolar;
// }
// let total=acum*4913;
// document.write("el total de la venta ha sido: "+total);




//2 restaurante
// let arreglo=new Array(5);
// let descuento=[];
// let total=[];

// for (let e=0;e<arreglo.length;e++){
//     let consumo = parseInt(prompt("ingrese el consumo del cliente "+e));
//     arreglo[e]=consumo;
//     if (arreglo[e] >50000){
//         descuento[e]=arreglo[e]*20/100;
//         total[e]=arreglo[e]-descuento[e];
//         document.write("<br>con descuento del cliente "+e+":"+total[e]);
//     }
// }
// document.write("<br>")
// document.write("el consumo de cada cliente fue");
// document.write("<br>")
// for ( e=0;e<arreglo.length;e++){
//     if (arreglo[e]<50000){
//         document.write("<br> cliente sin descuento "+e+":"+arreglo[e]);
//     }else{
//         document.write("<br>con descuento del cliente "+e+":"+total[e]);
//     }

    
// }




//3. formato horas

// let hora=parseInt(prompt("ingrese la hora en formato normal"));
// let tiempo=parseInt(prompt("ingrese 1. am o 2. pm"))
// let minutos=parseInt(prompt("ingrese los minutos"));
// let segundos=parseInt(prompt("ingrese los segundos"));

// if(hora<12 && minutos<=59 && segundos<=59 && tiempo==1){
//     document.write("<br>FORMATO MILITAR")
//     document.write("<br>son las: "+hora+":"+minutos+" con "+segundos+ " segundos AM" )
// }else if(tiempo==2){
//     total2=hora+12
//     document.write("<br>FORMATO MILITAR")
//     document.write("<br>son las: "+total2+":"+minutos+" con "+segundos+ " segundos PM" )
// }




//4. producto

// let n=parseInt(prompt("ingrese numero n"));

// let total1=n;
// for (let a=1;a<arreglo.length+1;a++){
//     total1=total1*a;
//     document.write("<br>"+total1);
// }





//5. multiplicacion decreciente

// let numero=parseInt(prompt("ingrese numero a multiplicar entre 1 y 10"));
// let total=11;
// for(let o=1;o<=10;o++){
//     total=total-1;
//     document.write("<br>")
//     document.write(numero +"x"+ total+" = "+numero*total);
// }



//6. banco-credito

let credito=parseInt(prompt("ingrese el monto que saco a credito"));
let años=parseInt(prompt("a cuantos años saco el credito, (si NO es años coloque 0 y coloque su respuesta en meses)"));
let meses=parseInt(prompt("y cuantos meses"))


if (años==0 && meses<=12){
    let division=credito/meses;
    let interes=division*48/100;
    let cuota=interes+division;
    let conver=credito*48/100;
    let total_pagar=credito+conver;
    document.write("<br>");
    document.write("el interes a pagar mesualmente es: "+interes);
    document.write("<br>");
    document.write("la cuota mesual a pagar es: "+cuota)
    document.write("<br>");
    document.write("el total a pagar es de: "+total_pagar);

}else if(años==1){
    let division=credito/12;
    let interes=division*48/100;
    let cuota=interes+division;
    let conver=credito*48/100;
    let total_pagar=credito+conver;
    document.write("<br>");
    document.write("el interes a pagar mesualmente es: "+interes);
    document.write("<br>");
    document.write("la cuota mesual a pagar es: "+cuota)
    document.write("<br>");
    document.write("el total a pagar es de: "+total_pagar);

}else if(años>1 && años<5){
    total=años*12+meses
    let division=credito/total;
    let interes=division*36/100;
    let cuota=interes+division;
    let conver=credito*36/100;
    let total_pagar=credito+conver;
    document.write("<br>");
    document.write("el interes a pagar mesualmente es: "+interes);
    document.write("<br>");
    document.write("la cuota mesual a pagar es: "+cuota)
    document.write("<br>");
    document.write("el total a pagar es de: "+total_pagar);

}else if(años>=5){
    total=años*12+meses
    let division=credito/total;
    let interes=division*24/100;
    let cuota=interes+division;
    let conver=credito*24/100;
    let total_pagar=credito+conver;
    document.write("<br>");
    document.write("el interes a pagar mesualmente es: "+interes);
    document.write("<br>");
    document.write("la cuota mesual a pagar es: "+cuota)
    document.write("<br>");
    document.write("el total a pagar es de: "+total_pagar);
}

