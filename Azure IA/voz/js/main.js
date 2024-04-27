let texto= document.getElementById('texto');
let btn_start=document.getElementById('btn_start');
let acento = "es-ES-ElviraNeural";
let lenguaje = "es-ES";

btn_start.addEventListener('click', ()=>{
    hablar(texto.value, acento, lenguaje)
});

async function hablar(texto, acento, lenguaje) {
    const apiUrl= 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1';
    const  subscriptionKey= 'de572067f4a04f72971183b7d6de35dc';

    const headers= new Headers();

    headers.append('Ocp-Apim-Subscription-Key',subscriptionKey);
    headers.append('Content-Type', 'application/ssml+xml');
    headers.append('X-Microsoft-OutputFormat', 'audio-16khz-128kbitrate-mono-mp3');
    headers.append('User-Agent', 'curl');

    const ssml = `<speak version='1.0' xml:lang='${lenguaje}'><voice xml:lang='${lenguaje}' xml:gender='Female' name='${acento}'>${texto}</voice></speak>`;

    let config ={
        method: 'POST',
        headers: headers,
        body: ssml
    };

    const peticion = await fetch(apiUrl, config);
    if(peticion.ok){
        const response =await peticion.blob();
        const url = URL.createObjectURL(response);
        const audio = new Audio(url);
        audio.play();
    }else{
        console.log("Error")
    }


}