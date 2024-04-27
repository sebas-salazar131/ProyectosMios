//alert("probando");
//ciclos con JS
//ciclos for

//let num = parseInt(prompt("ingrese un numero del 1 al 10 para la tabla de multiplicar"));

//for (let i=1;i<=10;i++){
 //   document.write("<br>");
  //  document.write(i+" x "+num+" = "+i*num);
//}
//solicitar 2 numeros al usuario e imprimir los numero pares 
//de ese rango dado por el usuario

// let numero1= parseInt(prompt("ingrese numero 1"));
// let numero2= parseInt(prompt("ingrese numero 2"));

 
// if(numero1>numero2){
//     if(numero1%2==1){
//         numero1--;
//     }
//     for (let z=numero1;z>=numero2;z=z-2){
//         document.write("<br>"+z)
//     }    
// }else{
//     if(numero1%2==1){
//         numero1++;
//     }
//     for(let j=numero1;j<=numero2;j=j+2){
//         document.write("<br>"+j);    
//     } 
// }

//solucitar al usuario cuantos numeros desea ingresar?
//pedir la cantidad que el dijo
//imprimir cuantos de esos numeros son: pares, impares, positivos, negativos

// let cant=parseInt(prompt("cuantos numeros desea ingresar"));
// let par=0;
// let impar=0;
// let positivo=0;
// let negativo=0;
// let cero=0

// for (let p=1;p<=cant;p++){
//     let numeros=parseInt(prompt("ingrese los numeros"));
//     if(numeros==0){
//         cero++;
//     } else{
//         if(numeros%2==0){
//             par++;
//         }else{
//             if(numeros%2==1){
//                 impar++;
//             }    
//         }  
//         if(numeros>0){
//             positivo++;
//         }else{
//             if(numeros<0){
//                 negativo++;
//             } 
//         }
//     }
//     document.write("<br>"+numeros);
// }
// document.write("<br>pares: "+par);
// document.write("<br>impar: "+impar);
// document.write("<br>positivo: "+positivo);
// document.write("<br>negativo: "+negativo);
// document.write("<br>ceros: "+cero);


//imprimir las tablas de multiplicar del 1 - 10
// for(let i=1; i<=10;i++){
//     document.write("<br>");
//     for(let j=1;j<=10;j++){
//         document.write("<br>");
//         document.write(i+" x "+j+"="+i*j);
//     }
// }


//MIENTRAS/WHILE/DO

// let num=0
// do{
//     num = parseInt(prompt("ingrese un numero positivo"))
// }while (num<=0);


// let num=0;
// while (num <=0){
//     num = parseInt(prompt("ingrese un numero positivo"));
// }


//EJERCICIO DO/WHILE
let num=0; 
do{
    num=parseInt(prompt("ingrese un numero del 1 al 10 para la tabla de multiplicar"));
}while(num<=0 || num>10);

for (let i=1;i<=11;i++){
    document.write("<br>");
    document.write(i+" x "+num+" = "+i*num);
}

