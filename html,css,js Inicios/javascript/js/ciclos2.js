//1. preguntar al usuario cuantos numeros desea ingresar, suamr esos numeros e imprimir resultado
//sacarle el promedio e imprimir el resultado tambien 

//2. solicitar varios numeros al usuarios hasta que funcione el cero, multiplicar todos esos numeros y entregar el resultado

//3. preguntar al usuario cuantos productos desea comprar luego pedirle el nombre y el valor unitarios y la cantidad de cada uno de los productos que desea comprar
//cuando el ususario haya ingresado todos los productos imprimir la factura adicionando el iva del 19% imprimiendo el total del iva y el total aparte
//nota: cuando le preguntes al ususario cuantos productos desea comprar no se permite 0 ni negativo

//4. preguntar al usuario cuantos estudiantes hay en el grupo por cada estudiante pedir el nombre, la nota 1, la nota 2 y la nota 3 calcular
// la nota final teniendo en cuenrta que la nota 1 vale 20% la nota 2 el 30% y la nota 3 el 50%
//tambien imprimir la lista de estudiantes con todas las notas y el promedio de grupo

//5. con ciclos imprimir una tabla html de 5 columnas por 10 filas en cada celda llenar los numeros pares en orden desendente

//----DESARROLLO----
//1.

// let num =parseInt(prompt("cuantos numeros desea ingresar"));
// let acum=0;
// for(let i=0;i<num;i++){
//     let cant=parseInt(prompt("ingrese numero"));
//     acum=acum+cant;
// }
// let resultado=acum/num;
// document.write("esta es la suma de sus numeros: "+acum);
// document.write("<br>este es el promedio de sus numeros: "+resultado);

//2.

// let num=1;
// let multi=1;
// do{
//     num=parseInt(prompt("ingrese los numeros"));
//    if(num!=0){
//        multi=multi*num;
//    }
// }while(num!=0){
//     document.write("esta es la multiplicion de todos sus numeros: "+multi);
// }

//3.

// let productos=parseInt(prompt("cuantos productos desea comprar"));
// let iva=0;
// let subtotal=0;
// let total=0;
// for(let p=0; p<productos;p++){
//     let nombre=prompt("ingrese su nombre");
//     let unitario=parseInt(prompt("ingrese el valor unitario"));
//     let cantidad=parseInt(prompt("ingrese la cantidad de cada uno de los productos"));

//     if(cantidad==0 || cantidad<0){
//         alert("no se permiten ni 0 ni negativos");
        
//     }else{
//         do{
//             let cant=parseInt(prompt("ingrese la cantidad: "))
//          }while(cantidad<=0);
//          let resultado=unitario*cantidad;
//          let iva2=resultado*19/100;
//          iva=iva+iva2;
//          subtotal=subtotal+resultado;
//          total=total+resultado+iva2; 
//     }
// }

// document.write("este es el su total de toda su compra sin iva: "+subtotal);
// document.write("<br> este es el valor del iva con una tasa del 19%: "+iva);
// document.write("<br>este es el valor a pagar de su compra: "+total);

//4

// let estudiante=parseInt(prompt("ingrese la cantidad de estudiantes"));
// let nota1=0;
// let nota2=0;
// let nota3=0; 
// let nota=0;
// for (let z=0;z<estudiante;z++){
//     let nombre=prompt("ingrese su nombre:");
//     let nota1=parseInt(prompt("ingrese nota 1:"));
//     let nota2=parseInt(prompt("ingrese nota 2:"));
//     let nota3=parseInt(prompt("ingrese nota 3:"));

//     nota1=nota1*0.2;
//     nota2=nota2*0.3;
//     nota3=nota3*0.5;
//     suma=nota1+nota2+nota3/3;
//     nota=nota+suma;

//     document.write("<br>el nombre del estudiante es: "+nombre);
//     document.write("<br>nota 1 vale el 20%: "+nota1);
//     document.write("<br>nota 2 vale el 30%: "+nota2);
//     document.write("<br>nota 3 vale el 50%: "+nota3);
//     document.write("<br>la nota final del "+nombre+" es: "+suma);
    
// }
// document.write("<br>el promedio del grupo es: "+nota);


//5.
let tabla = "<table border='1'>";
let contador=100;

for (let i=0; i<10 ; i++){
    tabla+="<tr>";
    for(let j=0;j<5;j++){
        tabla +="<td>"+contador+"</td>"
        contador=contador-2;
    }
    tabla +="</tr>";
}
tabla +="</table>";
document.write(tabla);
