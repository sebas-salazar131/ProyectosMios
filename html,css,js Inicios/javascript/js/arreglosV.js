//llenar en un arreglo 5 nombres animales
let animales=["Gato", "Perro", "Oso"];
let numeros=[2,3,5,80];
let de_todo=["pedro",20,true,4.5];

// document.write(animales[1]);
// document.write("<br>");
// document.write(numeros.length);

// document.write("<br>");
// let ultimo=de_todo[de_todo.length-1]
// document.write(ultimo);
// //recorrer un array
for(let i=0;i<animales.length;i++){
    document.write("<br>"+animales[i]);
}

//agregar elementos al final del arreglo
// de_todo.push("Pato");

// //agregar elementos al inicio del arreglo
// de_todo.unshift("tigre")

// //eliminar el ultimo
// de_todo.pop();

// //eliminar el primero
// de_todo.shift();

// de_todo.forEach(function(ele,ind,arr){
//     document.write("<br>* "+ind+" - "+ele);
// })

//buscar el indice de un elemento


let nuevo_animal=prompt("ingrese el nuevo animal para poner al inicio");
animales.push(nuevo_animal);

let nuevo_animal1=prompt("ingrese el nuevo animal para poner al final");
animales.unshift(nuevo_animal1);

document.write("<br>");
animales.forEach(function(ele,ind,arr){
    document.write("<br>* "+ind+" - "+ele);
})

let dato_buscado=prompt("ingrese el nombre del animal");
let pos=animales.indexOf(dato_buscado);
document.write("<br>valor del indice es "+pos);

//eliminar un animal sin importar su indice
animales.splice(pos, 1);

document.write("<br>");
animales.forEach(function(ele,ind,arr){
    document.write("<br>* "+ind+" - "+ele);
})

//copiar array
let copia_animales=animales.slice();
console.log(copia_animales);

//declarar arreglos vacios
let adso = [];
let otro =new Array();



