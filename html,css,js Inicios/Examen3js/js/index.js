//1.
// let numero=[99];

// for(let i=0; i<99; i++){
//     numero[i]=parseInt(prompt("ingrese los numeros"));
//     if(numero[i]=='s' || numero[i]=='S'){
//         i=99;
//         break;
//     }  
// }
// str.repeat(numero);



//2 palabra inversa

// let palabra = prompt("Ingresa una palabra");
// let indice = palabra.length - 1;
// while (indice >= 0) {
//   console.log(palabra[indice]);
//   indice--;
// }

//3


// let arreglo =["manzana","naranja", "uva", "pera"];

// for(let i=0; i<4; i++){
//     document.write("<br>["+arreglo[i]+"]");
// }
// var mySet = new Set();
// let agrega=0;
// let x="";
// let eliminar="";

// function agregarfruta(){
//     agrega=prompt("ingrese la nueva fruta");
//     x=arreglo.push(agrega);
// }
// function eliminarfruta(){
//     eliminar=prompt("ingrese la fruta que desea eliminar");
//     for(let v=0; v<4; v++){
//         if(eliminar==arreglo[v]){
//             arreglo[v]="";
//         }
//     }
    
// }
// function imprimir(){
//     document.write(arreglo);
// }

//4

let num=[5];
let valor=0;
for (let o=0; o<5; o++){
    num[o]=parseInt(prompt("ingrese los valores"));
}
valor=parseInt(prompt("ingrese el numero a buscar"));



function verifico(num, valor){
    for(let y=0; y<5; y++){
        if(valor!=num[y]){
            document.write("el valor no esta en el contenido ");
        }else{
            document.write("el valor esta en el contenido");
        }
     
    }
    
}



//5
// let arreglo=[5];
// let total=0;
// for(let u=0; u<5; u++){
//     arreglo[u]=parseInt(prompt("ingrese los valores"))
    
// }

// function imprimir(){
//     for(let s=0; s<5; s++){
//         document.write("["+arreglo[s]*2+"]")
//     }
    
    
// }

