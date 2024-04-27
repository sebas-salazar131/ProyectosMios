function calcular(){
    let capitaal=parseInt(document.getElementById("capital").value);
    let interees=parseInt(document.getElementById("interes").value);
    let tiempoo=parseInt(document.getElementById("tiempo").value);
    let tr=document.createElement("tr");
    let td1=document.createElement("td");
    let td2=document.createElement("td");
    let td3=document.createElement("td");
    let td4=document.createElement("td");
    let tbody=document.getElementById("datos");
    
    let capital_mensual=capitaal/tiempoo;
    let interes_mensual=interees/tiempoo;

    let interes_a_pagar=(capitaal*interes_mensual)/100;

    let pago_mensual=capital_mensual+interes_a_pagar;

    let pago=(capitaal*interees)/100;
    let pago_total=capitaal+pago;

    console.log(interes_a_pagar);
    console.log(capital_mensual);
    console.log(pago_mensual);
    console.log(pago_total);

    let texto1="Interes Mensual: ";
    let texto2="Capital Mensual: ";
    let texto3="Pago Mensual: ";
    let texto4="Pago Total: ";

    let textotd1=document.createTextNode(interes_a_pagar);
    let textotd2=document.createTextNode(capital_mensual);
    let textotd3=document.createTextNode(pago_mensual);
    let textotd4=document.createTextNode(pago_total);

    td1.appendChild(textotd1);
    td2.appendChild(textotd2);
    td3.appendChild(textotd3);
    td4.appendChild(textotd4);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    tbody.appendChild(tr);
    
    // return document.getElementById("resultado").innerHTML=texto1+"<br>" +texto2 +"<br>"+texto3+"<br>"+ texto4;
    
}

function interesCompuesto(){

    let capitaal=parseInt(document.getElementById("capital").value);
    let interees=parseInt(document.getElementById("interes").value);
    let tiempoo=parseInt(document.getElementById("tiempo").value);

    let capital_mensual=capitaal/tiempoo;
    let interes_mensual=interees/tiempoo;
    let resul=capital_mensual/tiempoo;

    let interes_a_pagar=(capitaal*interes_mensual)/100;

    let pago_mensual=capital_mensual+interes_a_pagar;

    let pago=(capitaal*interees)/100;
    let pago_total=capitaal+pago;

    let tot=interes_a_pagar/tiempoo;
    let int_mensual=tot;
    let aux_cap=capitaal;
    let total=[tiempoo];
    for(let i=0; i<tiempoo; i++){
        
        let tr=document.createElement("tr");
        let td1=document.createElement("td");
        let td2=document.createElement("td");
        let td3=document.createElement("td");
        let td4=document.createElement("td");
        let td5=document.createElement("td");
        let cuerpo=document.getElementById("cuerpo");

        int_mensual=int_mensual-interes_a_pagar;
        aux_cap=aux_cap-capital_mensual;
        let textotd1=document.createTextNode(i+1);
        let textotd2=document.createTextNode(int_mensual);
        let textotd3=document.createTextNode(capital_mensual);
        let textotd4=document.createTextNode(pago_mensual);
        let textotd5=document.createTextNode(aux_cap);

        td1.appendChild(textotd1);
        td2.appendChild(textotd2);
        td3.appendChild(textotd3);
        td4.appendChild(textotd4);
        td5.appendChild(textotd5);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);

        cuerpo.appendChild(tr);
    }

    
}
