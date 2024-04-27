from fastapi import FastAPI, UploadFile, File
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


endpoint = "https://computer-vision-adso.cognitiveservices.azure.com/"
key = "6fe16dac8e9e40958cdebf866727865a"


# Create an Image Analysis client
client = ImageAnalysisClient(endpoint=endpoint, credential=AzureKeyCredential(key))

@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    # Read the image file
    image_data = file.file.read()

    # Analyze all visual features from the image
    result = client.analyze(
        image_data=image_data,
        visual_features=[
            VisualFeatures.TAGS,
            VisualFeatures.OBJECTS,
            VisualFeatures.CAPTION,
            VisualFeatures.DENSE_CAPTIONS,
            VisualFeatures.READ,
            VisualFeatures.SMART_CROPS,
            VisualFeatures.PEOPLE,
        ],
        gender_neutral_caption=True,
        model_version="latest",
    )

    return {"resultados":result}
