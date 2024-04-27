//1. solicitar al usuario 5 nombre almacenarlo en un arreglo e imprimirlos en una lista no ordenaada
//2. almacenar en un arreglo los numeros impares del 0 al 10 utilizando forEach en javascript
//3.solicitar al usuario varios numeros hasta que funcione el 0 esos numeros deben estar en un arreglo
//imprimir el indice donde quedaron y el numero, tambien el promedio de esos numero

//1.
// let nombre=[""];
// for(let z=0;z<5;z++){
//     let n=prompt("ingrese los nombres: "+z);
//     nombre[z]=n;
    
// }

// for(let z=0;z<5;z++){
    
// }

//2
let numerosImpares = [];

[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((numero) => {
  if (numero % 2 !== 0) {
    numerosImpares.push(numero);
  }
});

document.write("<br>"+numerosImpares);
