//1
// let kilo=2000;


//     let compra= parseFloat(prompt("ingrese cuantos kilos va comprar"));

//     if(compra>0 && compra<=2){
//         let total=compra*kilo;
//         document.write("<br>cliente "+" no hay descuento")
//         document.write("<br>el valor a pagar es de "+total)
//     }else if(compra>2,1 && compra<=5){
//         let total=compra*kilo;
//         let descu=total*10/100;
//         let descuento=total-descu;
//         document.write("<br>cliente " +" tiene un descuento del 10%: su valor es: "+descuento);
//     }else if(compra>=5,1 && compra<=10){
//         let total=compra*kilo;
//         let descu=total*15/100;
//         let descuento=total-descu;
//         document.write("<br>cliente " +" tiene un descuento del 15%: su valor es: "+descuento);
//     }else if(compra>10,1){
//         let total=compra*kilo;
//         let descu=total*20/100;
//         let descuento=total-descu;
//         document.write("<br>cliente " +" tiene un descuento del 20%: su valor es: "+descuento);
//     } 





//2

// let pares=[10];
// let descendente=[10];
// let aux=0;
// for(let z=0; z<10;z++){
//     pares[z]=parseInt(prompt("ingrese numeros pares"));
//     descendente[z]=pares[z];
//     if(pares[z]%2==1){
//         alert("ingrese un numero par");
//         z--;
//     }
//     if(pares[z]==0){
//         z=10;
//     }
// }

// descendente.sort(function(a, b) {
//     return b - a;
// });
// document.write("<br>"+descendente);
// for(let y=0; y<10; y++){
    
//     for(let x=0; x<10+1;x++){
//         for(let j=0; j<10+1; j++){
//             if(pares[j]>pares[j+1]){
//                 aux=pares[j];
//                 pares[j]=pares[j+1];
//                 pares[j+1]=aux;
//             }
//         }
//     }
        
// }

// for(let v=0; v<10; v++){
//     document.write("<br>"+pares[v]);
// }

// //3

let cant=parseInt(prompt("ingrese la cantidad de productos que desea comprar"));

let nombre=[cant];
let articulo=[cant]
let iva=[cant];
let conver=0;
let total=0;
let des=0;
let descuento=0;
for (let o=0; o<cant; o++){
    nombre[o]=prompt("ingrese el nombre del articulo "+o);
    articulo[o]=parseInt(prompt("ingrese el valor del articulo"));
}
for (let u=0; u<cant; u++){
    conver=articulo[u]*19/100;
    iva[u]=articulo[u]+conver;
    document.write("<br>nombre del articulo: "+nombre[u]);
    document.write("<br>la cantidad es : "+cant);
    document.write("<br>el valor unitario es: "+articulo[u]);
    document.write("<br>el iva es del 19% en este articulo vale: "+conver);
    document.write("<br>el valor total de este artitulo es de: "+iva[u]);
    document.write("<br>");
    total+=iva[u];
    
}
document.write("<br>");
if(total>530000){
    des=total*10/100;
    descuento=total-des;
    document.write("<br>el valor a pagar con descuento: "+descuento)
}else{
    document.write("<br>el valor total a pagar es: "+total);
}



//4
// let a=["Abadejo", "Abanico", "Abanto", "ancla", "almun" ];
// let e=["Estrella de mar", "Erizo de mar", "Elefante", "Espejo", "Escuela"];
// let i=["Irara", "Irbis", "iguana", "Isla", "Iglesia"];
// let o=["Oso polar", "Ostra", "Oso Pardo", "Ojo", "Olla"];
// let u=["Urraca", "Urogallo", "Ursón", "Uña", "Uva"];
// let vocales=[5];
// for(let p=0; p<5; p++){
//     vocales[p]=prompt("ingrese la vocal: "+p);
//     if(vocales[p]=='a' || vocales[p]=='e' || vocales[p]=='i' || vocales[p]=='o' || vocales[p]=='u' ){
//         if(vocales[p]=='a'){
//             document.write("<br>palabra con la letra a: "+a[p]);
//         }
//         if(vocales[p]=='e'){
//             document.write("<br>palabra con la letra e: "+e[p]);
//         }
//         if(vocales[p]=='i'){
//             document.write("<br>palabra con la letra i: "+i[p]);
//         }
//         if(vocales[p]=='o'){
//             document.write("<br>palabra con la letra o: "+o[p]);
//         }
//         if(vocales[p]=='u'){
//             document.write("<br>palabra con la letra u: "+u[p]);
//         }
//     }else{
//         alert("escriba una vocal correcta");
//         p--;
//     }
// }

