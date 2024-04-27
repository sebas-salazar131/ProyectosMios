//se necesita un pequeño programa para calculqar la nota de los estudiantes hacer el calculo y definirla a una tabla nota1, nota2, nota3, y la 
//nota final y promedio del grupo, la nota final se calcula teniendo en cuenta la nota1 vale 30% la nota 20% y la nota3 el 50% solicitar al usuario el nombre 
//del estudiantes con sus 3 notas e irlos imprimiendo 1 a 1 en la tabla actualizando datos  

// let cantidad=parseInt(prompt("ingrese cuantos estudiantes son"));
let notas=[];
let nombre="";
let nota1=0;
let nota2=0;
let nota3=0;
// for (let i=0; i<cantidad;i++){
//     notas[i]=new Array(4);
//     document.write("<br>");
//     nombre =prompt("ingrese el nombre del estudiante "+(i+1));
//     document.write("<br>");
//     notas[i][0]=nombre;
//     nota1=parseInt(prompt("ingrese la nota 1 "));
//     notas[i][1]=nota1;
//     nota2=parseInt(prompt("ingrese la nota 2 "));
//     notas[i][2]=nota2;
//     nota3=parseInt(prompt("ingrese la nota 3"));
//     notas[i][3]=nota3;
     
// }


function salon(){
    document.write("<br>");
    nombre =prompt("ingrese el nombre del estudiante "+(i+1));
    document.write("<br>");
    notas[i][0]=nombre;
    nota1=parseInt(prompt("ingrese la nota 1 "));
    notas[i][1]=nota1;
    nota2=parseInt(prompt("ingrese la nota 2 "));
    notas[i][2]=nota2;
    nota3=parseInt(prompt("ingrese la nota 3"));
    notas[i][3]=nota3;
    
}
document.write(notas);