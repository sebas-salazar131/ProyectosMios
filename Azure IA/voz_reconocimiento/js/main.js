let recognizer = null;
let texto_de_voz = document.getElementById('texto_de_voz');
let btn_microfono_start = document.getElementById('btn_microfono_start');
let boton_microfono_end = document.getElementById('boton_microfono_end');

function iniciarReconocimiento() {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("de572067f4a04f72971183b7d6de35dc", "eastus");
    speechConfig.speechRecognitionLanguage = "es-ES"; // idioma

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognized = (s,e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
            console.log(e.result.text);
            texto_de_voz.textContent = e.result.text
        }
    };

    recognizer.canceled = (s,e) => {
        console.log(`CANCELED: Reason=${e.reason}`);
        if (e.reason === SpeechSDK.CancellationReason.Error) {
            console.log(`CANCELED: ErrorCode=${e.ErrorCode}`);
            console.log(`CANCELED: ErrorDetails=${e.ErrorDetails}`);
        }
    };
    
}



btn_microfono_start.addEventListener('click', () => {
    iniciarReconocimiento();

    btn_microfono_start.style.display = 'none';
    boton_microfono_end.style.display = 'block';

    // Iniciar el reconocimiento
    recognizer.startContinuousRecognitionAsync();
});

boton_microfono_end.addEventListener('click', () => {
    recognizer.stopContinuousRecognitionAsync();

    boton_microfono_end.style.display = 'none';
    btn_microfono_start.style.display = 'block';
});