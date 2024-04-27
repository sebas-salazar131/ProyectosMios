//1.fecha de nacimiento

// let año=parseInt(prompt("ingrese año de nacimiento"));
// let mes=parseInt(prompt("ingrese mes de nacimiento"));
// let dia=parseInt(prompt("ingrese dia de nacimiento"));
// let año_actual=parseInt(prompt("ingrese año actual"));
// let mes_actual=parseInt(prompt("ingrese mes actual"));
// let dia_actual=parseInt(prompt("ingrese dia actual"));


// let edad_años=año_actual-año;
// let edad_meses=mes-mes_actual;
// let edad_dia=dia_actual-dia;

// if(mes_actual<mes){
//     total=edad_años-1;
//     total2=12-edad_meses;
//     total3=30-edad_dia;
//     document.write("<br>su edad es: "+total);
//     document.write("<br>con meses: "+total2);
//     document.write("<br>con dias: "+total3);
// }else{
//     total2=edad_meses-12;
//     total3=edad_dia-30;
//     document.write("<br>su edad es: "+edad_años);
//     document.write("<br>con meses: "+edad_meses);
//     document.write("<br>con dias: "+edad_dia);
// }





//2. edades

// let edades=[10];
// let prom=1;
// let cont=0;
// let cont2=0;
// let cont3=0;
// let aux=0;
// let aux2=0;
// for(let i=0;i<10;i++){
//     edades[i]=parseInt(prompt("ingrese la edad: "+i));
//     prom+=edades[i];
//     if(edades[i]>120 || edades[i]<0){
//         alert("error escriba un numero correcto");
//         i--;
//     }
//     if (edades[i]<18 && edades[i]>=1){
//         cont++;   
//     }
//     if(edades[i]>18 && edades[i]<60){
//         cont2++;
//     }
//     if(edades[i]>=60 && edades[i]<120){
//         cont3++;
//     }
//     if(edades[i]>aux){
//         aux=edades[i];
//     }
//     if(edades[i]<aux2){
//         aux2=edades;
//     }
// }
// let promedio=prom/10;


// document.write("<br>menores: "+cont);
// document.write("<br>adultos: "+cont2);
// document.write("<br>adultos mayores: "+cont3);
// document.write("<br>la edad mas alta es: "+aux);
// document.write("<br>la edad mas baja es: "+aux2);
// document.write("<br>la edad promedio es: "+promedio);






//3


// let arreglo1=[5];
// let arreglo2=[5];
// let arreglo3=[10];
// let aux=0;
// let aux3=0;

// for (let a=0; a<5; a++){
//     arreglo1[a]=parseInt(prompt("ingrese los primeros 5 numeros "+a));
    
// }
// for(let e=0; e<5; e++){
//     arreglo2[e]=parseInt(prompt("ingrese los otros  5 numeros "+e));
// }
// arreglo3=arreglo1.concat(arreglo2);

// for(let u=0; u<10; u++){
//     for (let j =0; j<10; j++){
//         if(arreglo3[j]>arreglo3[j+1]){
//             aux=arreglo3[j];
//             arreglo3[j]=arreglo3[j+1];
//             arreglo3[j+1]=aux;
//         }
//     }
// }
// for(let o=0; o<10; o++){ 
//     document.write("["+arreglo3[o]+"]");
// }




//sacar el minimo de un arreglo

// let arreglo=[5];
// for(let i=0; i<5;i++){
//     arreglo[i]=parseInt(prompt("ingrese valor: "+i));  
// }
// let min=Math.min.apply(null, arreglo);
// for(let e=0; e<5;e++){
//     document.write(min);
// }



