from flask import Flask, request, jsonify, render_template, url_for
from deepface import DeepFace
from sqlalchemy import create_engine, Column, Integer, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base 
from sqlalchemy.orm import sessionmaker
import os
import cv2
import numpy as np
import base64
import datetime

app = Flask(__name__)

# Configure Upload Folder and Allowed Extensions
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Database setup
DATABASE_URL = 'mysql+mysqlconnector://(user.username):(user.password)@mysql/emotion_analysis_db?charset=utf8mb4&collation=utf8mb4_general_ci'


engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Define emotion categories
EMOTION_CATEGORIES = {
    "happy": "positive",
    "sad": "negative",
    "surprise": "positive",
    "fear": "negative",
    "anger": "negative",
    "disgust": "negative",
    "neutral": "neutral",
}

# Define the EmotionAnalysis model for the database
class EmotionAnalysis(Base):
    __tablename__ = 'emotion_analysis'
    id = Column(Integer, primary_key=True)
    positive = Column(Float)
    neutral = Column(Float)
    negative = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

@app.route('/')
def index():
    return render_template('index.html', uploaded_image=None, detected_face=None)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    image_data = data.get('image')

    if image_data:
        # Decode the base64 image
        header, encoded = image_data.split(',', 1)
        image_bytes = base64.b64decode(encoded)

        # Convert bytes to a numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Save the original image
        original_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'captured_image.png')
        cv2.imwrite(original_image_path, img)

        # Analyze the face for emotions only
        try:
            analysis = DeepFace.analyze(
                img_path=original_image_path,
                actions=['emotion'],
                detector_backend='opencv',
                enforce_detection=False
            )

            # Initialize category counts
            category_counts = {
                "positive": 0,
                "neutral": 0,
                "negative": 0
            }

            # Calculate the total percentage of each category
            total_percentage = 0
            for emotion_data in analysis:
                for emotion, percentage in emotion_data['emotion'].items():
                    category = EMOTION_CATEGORIES.get(emotion)
                    if category:
                        category_counts[category] += percentage
                        total_percentage += percentage

            # Calculate percentages for each category
            results = {
                "positive": float(category_counts["positive"] / total_percentage * 100) if total_percentage > 0 else 0.0,
                "neutral": float(category_counts["neutral"] / total_percentage * 100) if total_percentage > 0 else 0.0,
                "negative": float(category_counts["negative"] / total_percentage * 100) if total_percentage > 0 else 0.0,
            }

            # Store the analysis results in the database
            new_entry = EmotionAnalysis(
                positive=results["positive"],
                neutral=results["neutral"],
                negative=results["negative"]
            )
            session.add(new_entry)
            session.commit()

            # Delete the uploaded image after analysis
            if os.path.exists(original_image_path):
                os.remove(original_image_path)

            return jsonify({
                'success': True,
                'uploaded_image': url_for('static', filename='uploads/captured_image.png'),
                'results': results
            })

        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})

    return jsonify({'success': False, 'error': 'No image data received'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
