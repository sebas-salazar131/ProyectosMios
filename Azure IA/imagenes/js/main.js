let input = document.getElementById('input');
let imagen = document.getElementById('imagen');
let inputFile = document.getElementById('inputFile');

const captureButton = document.getElementById('captureButton');
let result = document.getElementById('result');

let key = "0d4e39edd82b487c842dd38396efa4e7";
let endpoint = "https://vision-ultra.cognitiveservices.azure.com/";

const analyzeImgURL = async (url_img) => {
    let headers = {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/json"
    };

    let body = JSON.stringify({url:url_img});

    let config = {
        method:"POST",
        headers:headers,
        body:body
    };

    let url_base = endpoint+"computervision/imageanalysis:analyze?api-version=2024-02-01&features=tags,read,caption,denseCaptions,smartCrops,objects,people&smartcrops-aspect-ratios=0.8,1.2"

    const postData = await fetch(url_base,config);
    const response = await postData.json();
    console.log(response);
    console.log(response.readResult.blocks);
}


input.addEventListener('input', () => {
    if (input.value.length >= 10) {
        imagen.src = input.value;
        analyzeImgURL(imagen.getAttribute("src"));
    }else{
        imagen.src = "";
    }
});


// https://<endpoint>/computervision/imageanalysis:analyze?api-version=2024-02-01&features=tags,read,caption,denseCaptions,smartCrops,objects,people

const analyzeImgFile = async (formData)  => {
    let ruta = "http://localhost:8000/analyze-image";
    try {


        let config = {
            method: "POST",
            body: formData
        }

        const response = await fetch(ruta,config);
        const data = await response.json();
        console.log(data);
        const readResult = data.resultados.readResult.blocks[0].lines;

        let resultJSON = JSON.stringify(readResult);
        result.textContent = resultJSON; 
    } catch (error) {
        console.error("Error:", error);
    }
}


inputFile.addEventListener('change', async (e) => {
    let formData = new FormData();
    const archivo = e.target.files[0];
    
    if (archivo) {
        const reader = new FileReader();
        formData.append("file",archivo);
        reader.onload = async (e) => {
            imagen.src = e.target.result;
        }
        reader.readAsDataURL(archivo);
    }

    await analyzeImgFile(formData);
});

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const photo = document.getElementById('photo');
const startCamera = document.getElementById('startCamera');
let stream;

startCamera.addEventListener('click', () => {
    abrirCamara();
});

// Accede a la cámara
const abrirCamara = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
            stream = mediaStream;
            video.srcObject = mediaStream;
        })
        .catch((error) => {
            console.error('Error al acceder a la cámara:', error);
        });
}

// Captura de foto
captureBtn.addEventListener('click', async () => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;

    // Obtiene la imagen capturada como un archivo Blob
    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'captured-image.png');

        try {
            await analyzeImgFile(formData);
        } catch (error) {
            console.error('Error al enviar la imagen al servidor:', error);
        }
    }, 'image/png');
});