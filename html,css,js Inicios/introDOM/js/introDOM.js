
function holamundo(){
    let nom=document.getElementById("dato").value;
    let texto="Hola "+nom;
    document.getElementById("dato").value="";
    return document.getElementById("parrafo").innerHTML=texto; 
}

function suma(){
    let number1=parseInt(document.getElementById("dato1").value);
    let number2=parseInt(document.getElementById("dato2").value);
    let total=number1+number2;
    let texto1="Resultado: "+total;
    document.getElementById("dato1").value=("");
    document.getElementById("dato2").value=("");
    return document.getElementById("resultado").innerHTML=texto1;
}

//forma chichi
let todos="";
function agregargusto(){
    let item = document.getElementById("gusto").value;
    todos+="<li>"+item+"</li>";

    return document.getElementById("lista").innerHTML=todos;
}

//forma pro
function agregarGustoPro(){
    //tomar el dato del input que tiene el id gusto
    let dato = document.getElementById("gusto").value;
    //crear un nodo de texto HTML para el navegador 
    let texto=document.createTextNode(dato);

    //creando un elemento li HTML
    const item = document.createElement("li");
    //poner el teexto anterior dentrro del li
    item.appendChild(texto);

    //agregar el item creado a su padre ol
    const ol= document.getElementById("lista");
    //limpiar el input que usamos
    document.getElementById("gusto").value=("");
    //retornar agregando un hijo OL
    return ol.appendChild(item);
}