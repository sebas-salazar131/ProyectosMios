let=html="";
let o1=1;
let o2=2;
function publicarNoticia(){
    let titulo=document.getElementById("titulo").value;
    let descripcion=document.getElementById("descripcion").value;
    let url_img=document.getElementById("url-img").value;
    console.log(titulo);
    console.log(descripcion);
    console.log(url_img);
    
    

     html+=` <section id="scroll">
                    <div class="container px-5">
                        <div class="row gx-5 align-items-center">
                            <div class="col-lg-6 order-lg-`+o1+`">
                                <div class="p-5"><img class="img-fluid rounded-circle" src="`+url_img+`" alt="..." /></div>
                            </div>
                            <div class="col-lg-6 order-lg-`+o2+`">
                                <div class="p-5">
                                    <h2 class="display-4">`+titulo+`</h2>
                                    <p>`+descripcion+`</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>`;  
            if(o1==1){
                o1=2;
                o2=1;
            }else{
                o1=1;
                o2=2;
            }
     document.getElementById("aqui").innerHTML=html;       
    const span=document.getElementById("aqui");

    let seccion=document.createElement("section");
    let div1=document.createElement("div");
    let div21=document.createElement("div");
    let div31=document.createElement("div");
    let div32=document.createElement("div")
    let div311=document.createElement("div");
    let img=document.createElement("img")
    let div321=document.createElement("div")
    let h2=document.createElement("h2")
    let p=document.createElement("p")
  

    div1.classList.add("container", "px-5");
    div21.classList.add("row", "gx-5", "align-items-center");
    div31.classList.add("col-lg-6", "order-lg-2");
    div32.classList.add("col-lg-6", "order-lg-1");
    div311.classList.add("p-5");
    img.classList.add("img-fluid", "rounded-circle");
    img.src=url_img;
    div321.classList.add("p-5");
    h2.classList.add("display-4");
    h2.textContent=titulo;
    p.textContent=descripcion

    seccion.appendChild(div1);
    div1.appendChild(div21);
    div21.appendChild(div31);
    div21.appendChild(div32);
    div31.appendChild(div311);
    div311.appendChild(img);
    div32.appendChild(div321);
    div321.appendChild(h2);
    div321.appendChild(p)

    console.log(seccion);
    


}