let cont_hambu=0;
let cont_sanco=0;
let cont_churra=0;
let cont_cuy=0;
let total_hamburguesa=0;
let total_sancocho=0;
let total_churrasco=0;
let total_cuy=0;
let total=0;
let ultimo=0;
i=0;


function hamburguesa(){
    let producto1="hamburguesa"
    let hambu=12000;
    cont_hambu++;
    return comprar1(producto1, hambu, cont_hambu), resultado(hambu)
}
function sancocho(){
    let producto2="Sancocho"
    let sanco=25000;
    cont_sanco++;
    return comprar2(producto2, sanco, cont_sanco), resul(sanco)
}
function churrasco(){
    let producto3="Churrasco"
    let churra=32000;
    cont_churra++;
    return comprar3(producto3, churra, cont_churra), resul2(churra)
}
function cuy_azado(){
    let producto4="Cuy Azado"
    let cuy=48000;
    cont_cuy++;
    return comprar4(producto4, cuy, cont_cuy), resul3(cuy)
}
function comprar1(prod_1, ham, cont_ham){
    const lista=document.getElementById("datos");
    const tr=document.createElement("tr");
    const td1=document.createElement("td");
    const td2=document.createElement("td");
    const td3=document.createElement("td");
    total_hamburguesa=ham*cont_hambu;

    const text_td1=document.createTextNode(prod_1);
    const text_td2=document.createTextNode(cont_ham);
    const text_td3=document.createTextNode(total_hamburguesa);

    td1.appendChild(text_td1);
    td2.appendChild(text_td2);
    td3.appendChild(text_td3);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    
    
    document.getElementById("producto").innerHTML=prod_1;
    document.getElementById("cant").innerHTML=cont_ham;
    document.getElementById("total_hambu").innerHTML=total_hamburguesa;
   
    
}
function comprar2(prod_2, san, cont_san){
    total_sancocho=san*cont_san;
 

    document.getElementById("producto2").innerHTML=prod_2;
    document.getElementById("cant2").innerHTML=cont_san;
    document.getElementById("total_san").innerHTML=total_sancocho;
    
}
function comprar3(prod_3, chu, cont_chu){
    total_churrasco=chu*cont_chu;


    document.getElementById("producto3").innerHTML=prod_3;
    document.getElementById("cant3").innerHTML=cont_chu;
    document.getElementById("total_chu").innerHTML=total_churrasco;

}

function comprar4(prod_4, cu, cont_cu){
    total_cuy=cu*cont_cu;
 
  
    document.getElementById("producto4").innerHTML=prod_4;
    document.getElementById("cant4").innerHTML=cont_cu;
    document.getElementById("total_cuy").innerHTML=total_cuy;
 
}
function resultado(hambu){
    total=hambu+total;
   
    document.getElementById("total").innerHTML=total;
}
function resul(sanco){
    total=sanco+total;
    document.getElementById("total").innerHTML=total;
}
function resul2(churra){
    total=churra+total;
    document.getElementById("total").innerHTML=total;
}
function resul3(cuy){
    total=cuy+total;
    document.getElementById("total").innerHTML=total;
}

function eliminar_hambur(){
    cont_hambu=cont_hambu-1
    total_hamburguesa=total_hamburguesa-12000
    total=total-12000
    document.getElementById("cant").innerHTML=cont_hambu;
    document.getElementById("total_hambu").innerHTML=total_hamburguesa;
    document.getElementById("total").innerHTML=total;
}
function eliminar_sanco(){
    cont_sanco=cont_sanco-1
    total_sancocho=total_sancocho-25000
    total=total-25000
    document.getElementById("cant2").innerHTML=cont_sanco;
    document.getElementById("total_san").innerHTML=total_sancocho;
    document.getElementById("total").innerHTML=total;
}
function eliminar_churra(){
    cont_churra=cont_churra-1
    total_churrasco=total_churrasco-32000
    total=total-32000
    document.getElementById("cant3").innerHTML=cont_churra;
    document.getElementById("total_chu").innerHTML=total_churrasco;
    document.getElementById("total").innerHTML=total;
}
function eliminar_cuy(){
    cont_cuy=cont_cuy-1
    total_cuy=total_cuy-48000
    total=total-48000
    document.getElementById("cant4").innerHTML=cont_cuy;
    document.getElementById("total_cuy").innerHTML=total_cuy;
    document.getElementById("total").innerHTML=total;
}











