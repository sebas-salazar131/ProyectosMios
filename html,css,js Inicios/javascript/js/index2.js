console.log("probando");

let num1 = parseInt(prompt("ingrese el primer numero"));
let num2 = parseInt(prompt("ingrese el segundo numero"));
//convertir un numero que esta en texto a entero


let suma = num1+num2;
let resta= num1-num2;
let multi= num1*num2;
let division= num1/num2;

document.write("<p> La suma es: "+suma+"</p>");

document.write("<p> la multiplicacion es: "+multi+"</p>");

document.write("<p>la division es: "+division+"</p>");

//condiciones
if(num1>num2){
    resta= num1-num2;
}else{
    resta= num2-num1;
}
document.write("<p> La resta es: "+resta+"</p>");
