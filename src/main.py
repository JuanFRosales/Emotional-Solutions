from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tensorflow as tf
from pydantic import BaseModel
import keras
from keras.api.models import load_model
from PIL import Image
import numpy as np
from io import BytesIO
import logging
from faceDetector import face_detector
import base64


# Initialize FastAPI app
app = FastAPI(title='Emotion Recognition API', version='0.1')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load the emotion recognition model
model = load_model('../models/emotion_model_v3.keras')
# Map model's output to emotions
emotion_labels = ['anger', 'disgust', 'fear', 'happiness', 'sadness', 'surprise', 'neutral']
# Set up logging
logging.basicConfig(level=logging.INFO)

class ImagePayload(BaseModel):
    image: str  # base64 encoded string

@app.post("/predict")
async def predict_emotion(request: Request):
    try:
        # Parse JSON payload
        payload = await request.json()
        base64_string = payload["image"]

        # # Read the uploaded image
        base64_decoded = base64.b64decode(base64_string)
        image = Image.open(BytesIO(base64_decoded))

        image_np = np.array(image)

        # process the image
        prosessed_img = face_detector(image_np)
        
        # Predict the emotion
        prediction = model.predict(prosessed_img)
        # Get the emotion with the highest score
        # Get the class probabilities
        emotion_probabilities = prediction[0]
        # Get the emotion with the highest score
        dominant_emotion_idx = np.argmax(emotion_probabilities)
        dominant_emotion = emotion_labels[dominant_emotion_idx]

        emotions_with_percentages = [
            {"emotion": emotion, "percentage": round(probability * 100, 2)} 
            for emotion, probability in zip(emotion_labels, emotion_probabilities)
        ]
        return JSONResponse(content={
            "dominant_emotion": dominant_emotion,
            "emotions": emotions_with_percentages
        })
    except HTTPException as e:
        # Handle specific HTTP errors (like missing face)
        logging.error(f"HTTP Error: {e.detail}")
        return JSONResponse(status_code=e.status_code, content={"message": e.detail})
    except Exception as e:
        # Catch other general exceptions and return a generic error message
        logging.error(f"Error: {str(e)}")
        return JSONResponse(status_code=500, content={"message": "Oooh no, I couldn't understand. Try again."})