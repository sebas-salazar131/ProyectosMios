// //calcular el sueldo por horas trabajadas
// let nombres=new Array;
// let horas_t=new Array;
// let sueldo=new Array;

// let aux=new Array;
// let sueldo_hora=100000;

// function agregar_empleado(){
//     let nom=prompt("Ingrese nombre del empleado");
//     let ht=parseInt(prompt("ingrese las horas trabajadas"));

//     nombres.push(nom);
//     horas_t.push(ht);
//     return console.log(nombres);
// }
// function calcular_sueldo(){
//     horas_t.forEach(function (ele,ind){
//         sueldo.push(ele*sueldo_hora);
//     })
//     sueldo.forEach(function(ele,ind){
//         if(ele>2000000){
//             aux[ind]=0;
//         }else{
//             aux[ind]=140000;
//         }
//     })
//     return imprimir_resultado();
// }
// function transporte(){
//     sueldo.forEach(function(ele,ind){
//         if(ele>2000000){
//             aux[ind]=0;
//         }else{
//             aux[ind]=140000;
//         }
//     })
//     return imprimir_resultado;

// }

// function imprimir_resultado(){
//     tabla="<table border='1'>";
//     tabla+="<tr>";
//     for(let i=0;i<nombres.length;i++){
//         tabla += "<td>"+nombres[i]+" - "+sueldo[i]+" - "+aux[i]+"<br></td>";
//     }
//     tabla+="</tr>"
//     tabla+="</table>"
//     return document.write(tabla);
// }


// //crear una funcion que reciba como paremetro un numero y su exponente y entregar el resultado



// function resultado(){
//     let numero=parseInt(prompt("ingrese el numero"));
//     let exponente=parseInt(prompt("ingrese exponente"));
//     let total=1;
//     for(let i=0;i<exponente;i++){
//         total=total*numero;
//     }
   
//     return total;
// }
//  let tot=resultado();
// document.write(tot);

//construir una funcion que devuelva la tangente 
//contruir una funcion que devuelda un coseno 

//crear una funcion que mee devuelva un numero aleatorio entre 0 y 100
// let numero=0;
// function aleatorio(){
//     numero=Math.floor(Math.random()*100);

//     return numero;
// }
// let total=aleatorio();
// document.write(total);

//funcion aleatoria entre 70 y 90

// let numero1=0;
// function aleatorio(){
//     numero1=Math.floor(Math.random()*(90-70)+70);

//     return numero1;
// }
// let total2=aleatorio();
// document.write(total2);


//crear una funcion que solicita el rango desde donde a donde quiere el numero aleatorio

let min =parseInt(prompt("ingrese el primer numero"));
let max =parseInt(prompt("ingrese el segundo numero"));
let numero1=0;
function aleatorio(){
    numero1=Math.floor(Math.random()*(max-min)+min);

    return numero1;
}
let total2=aleatorio();
document.write(total2);

