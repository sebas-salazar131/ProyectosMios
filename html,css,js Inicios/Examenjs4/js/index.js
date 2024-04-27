let cont=0;
let cont1=0;
let cont2=0;
let cont3=0;
let cont4=0;
let cont5=0;
let cont6=0;
let cont7=0;
let cont8=0;
let cont9=0;
let cont10=0;
let cont11=0;
let cont12=0;

let valor=2500;
let resultado=0;
let menos=0;


function ocupado1(){
    
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");


    let zona1="zona 1   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

    cont++;
    cont1++;
    if(cont1==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    } 
    
    let dos=document.getElementById('ocu1').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
        
    
    console.log(texto);
    
}

function ocupado2(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 2   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

    cont++;
    cont2++;
    if(cont2==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }
    let dos=document.getElementById('ocu2').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
}

function ocupado3(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 3   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

    
    cont++;
    cont3++;
    if(cont3==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }
    let dos=document.getElementById('ocu3').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
}

function ocupado4(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 4   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

  
    cont++;
    cont4++;
    if(cont4==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }
    let dos=document.getElementById('ocu4').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
   
}

function ocupado5(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 5   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);


    cont++;
    cont5++;
    if(cont5==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }

    let dos=document.getElementById('ocu5').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
}

function ocupado6(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 6   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

    cont++;
    cont6++;
    if(cont6==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }
    let dos=document.getElementById('ocu6').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }

}

function ocupado7(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 7   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

    
    cont++;
    cont7++;
    if(cont7==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }
    let dos=document.getElementById('ocu7').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
    
}

function ocupado8(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 8   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

    
    cont++;
    cont8++;
    if(cont8==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }
    let dos=document.getElementById('ocu8').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
}

function ocupado9(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 9   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

  
    cont++;
    cont9++;
    if(cont9==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }
    let dos=document.getElementById('ocu9').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
}

function ocupado10(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 10   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

    
    cont++;
    cont10++;
    if(cont10==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }
    let dos=document.getElementById('ocu10').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
}

function ocupado11(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 11   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

  
    cont++;
    cont11++;
    if(cont11==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }
    let dos=document.getElementById('ocu11').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
}

function ocupado12(){
    
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const tr=document.createElement("tr");

    let zona1="zona 12   -   ";
    const texto=document.createTextNode(zona1);
    const num=document.createTextNode(valor);
    td1.appendChild(texto);
    td2.appendChild(num);

    tr.appendChild(td1);
    tr.appendChild(td2);

    
    cont++;
    cont12++;
    if(cont12==1){
        document.querySelector("#parqueados").appendChild(tr);
        total(cont);
    }
    let dos=document.getElementById('ocu12').disabled=true;
    if(dos==true){
        document.querySelector("#parqueados").appendChild(tr);
        
    }
}

function disponible1(){
    document.getElementById('ocu1').disabled=false
}
function disponible2(){
    document.getElementById('ocu2').disabled=false
}
function disponible3(){
    document.getElementById('ocu3').disabled=false
}
function disponible4(){
    document.getElementById('ocu4').disabled=false
}
function disponible5(){
    document.getElementById('ocu5').disabled=false
}
function disponible6(){
    document.getElementById('ocu6').disabled=false
}
function disponible7(){
    document.getElementById('ocu7').disabled=false
}
function disponible8(){
    document.getElementById('ocu8').disabled=false
}
function disponible9(){
    document.getElementById('ocu9').disabled=false
}
function disponible10(){
    document.getElementById('ocu10').disabled=false
}
function disponible11(){
    document.getElementById('ocu11').disabled=false
}
function disponible12(){
    document.getElementById('ocu12').disabled=false
}


function total(contador){
    resultado=valor*contador;
    document.getElementById("total").innerHTML=resultado;
}