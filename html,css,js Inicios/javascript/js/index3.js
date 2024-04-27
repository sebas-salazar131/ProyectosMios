//programa que solicite al usuario y que diga si es par, impar, negativo, positivo o cero.

let numero=parseInt(prompt("ingrese numero"));
let resultado=""
if(numero==0){
    resultado= ("el numero es cero")
}else{
    if(numero<0){
        resultado = ("el numero es negativo");
    }else{
        resultado = ("el numero es positivo");
    }    
    if(numero%2==0){
        resultado += " y el numero es par ";

    }else{
        resultado += " y el numero es impar";
    }
}
document.write(resultado);

//conectores logicos

//solicitar 3 numeros al usuario y decir cual es mayor, menor y el del medio

let n1 = parseInt(prompt("ingrese el primer numero"));
let n2 = parseInt(prompt("ingrese el segundo numero"));
let n3 = parseInt(prompt("ingrese el tercer numero"));

let mayor = "";
let medio = "";
let menor = "";

if(n1>n2 && n1>n3){
    mayor=n1;
    if(n2>n3){
        medio=n2;
        menor=n3;

    }else{
        medio=n3;
        menor=n2;
    }
}
if(n2>n1 && n2>n3){
    mayor = n2;
    if(n1>n3){
        medio=n1;
        menor=n3;

    }else{
        medio=n3;
        menor=n1;
    }
}
if(n3>n1 && n3>n2){
    mayor = n3;
    if (n1>n2){
        medio =n1;
        menor =n2;

    }else{
        medio=n2;
        menor=n1;
    } 
        
}
document.write("<br>")
document.write("El mayor es: "+ mayor+"<br>");
document.write("El del medio es: "+medio+"<br>");
document.write("el menor es: "+menor);

//solicitar 2 numeros si al menos uno de los es positivo sumarlos sino alertar al usuario

let numero1 = parseInt(prompt("ingrese un numero"));
let numero2 = parseInt(prompt("ingrese otro numero"));

let suma = "";
if(numero1>0 || numero2>0){
    suma = numero1+numero2;
    document.write("<br>la suma es: "+suma);
}else{
    alert("al menos un numero debe ser positivo");
}

