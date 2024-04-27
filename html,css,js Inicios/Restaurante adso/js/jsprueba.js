const cont=[];
function añadir(){
    const nombre= document.querySelector("#nombre").value;
    const td1=document.createElement("td");
    const tr2=document.createElement("tr");

    const texto=document.createTextNode(nombre);

    td1.appendChild(texto);
    tr2.appendChild(td1);


    document.querySelector("#datos_nombres").appendChild(tr2);

    
}