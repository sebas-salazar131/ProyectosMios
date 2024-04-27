// let tabla="<table border='1'>";
// let numeros = [[1,2,3], [4,5,6], [7,8,9], [10,11,12]];
// console.log(numeros[2][1]);
// let suma=0;

// for(let i=0; i<4;i++){
//     tabla+="<tr>";
   
//     for(let z=0; z<3;z++){
//         tabla+="<td> "+numeros[i][z]+"</td>";
//         suma=suma+numeros[i][z];
//     }
//     tabla+="</tr>";
// }
// tabla+="</table>";
// document.write(tabla);
// document.write("<br>"+suma);
// document.write("<br>");
// numeros.forEach(function(ele,ind,arr){
//     document.write("<br>* "+ind+" - "+ele);
// })

//crear una matriz que le preguntee al usuario cuantos empleados tiene la empresa, pedir el nombre y las horas que trabajo, valor y preguntar si tiene auxilio de transporte solo dar auxilio de transporte si es menor a dos salarios minimos 140
//sacar el promedio de horas,valor,aux

let cantidad = parseInt(prompt("ingrese cantidad de empleados"));
let nomina = [];
let nombre = "";
let horas_t= 0;
let sueldo= 0;
let aux_trans= 0;

for (let i=0; i<cantidad;i++){
    nomina[i]=new Array(4);
    nombre =prompt("ingrese el nombre del empleado "+(i+1));
    nomina[i][0]=nombre;
    horas_t=parseInt(prompt("ingrese las horas trabajadas del empleado "+(i+1)));
    nomina[i][1]=horas_t;
    sueldo=100000*horas_t;
    nomina[i][2]=sueldo;
    if (sueldo<=2000000){
        aux_trans=140000;
    }else{
        aux_trans=0;
    }
    nomina[i][3]=aux_trans;
}

console.log(nomina);



