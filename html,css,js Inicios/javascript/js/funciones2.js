let num1=0;
let num2=0;
let resultado;
let valido = new Boolean(false);
function leer_numeros(){
    num1=parseInt(prompt("ingrese el primero numero"));
    num2=parseInt(prompt("ingrese el segundo numero"));
    if(num1>0 && num2>0){
        valido=true
    }else{
        alert("ingrese un numero correcto");
        return leer_numeros();
    }
   
}

function operacion(que_Quiere){
    switch (que_Quiere) {
        case "suma":
            resultado=num1+num2;
            break;
        case "resta":
            resultado=num1-num2;
            break
        case "multi":
            resultado=num1*num2;
            break
        case "divi":
            resultado=num1/num2;            
        default:
            break;
    }
    document.getElementById("valor").innerHTML=resultado; 

}

