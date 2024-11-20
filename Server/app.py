from flask import Flask, request, jsonify, render_template, url_for
from deepface import DeepFace
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import cv2
import numpy as np
import base64
import datetime
from flask_cors import CORS
import logging

# Initialize Flask App
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG) 
# Configure Upload Folder and Allowed Extensions
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Database setup
DATABASE_URL = 'mysql+mysqlconnector://juan:password@host.docker.internal:3306/emotion_analysis_db?charset=utf8mb4&collation=utf8mb4_general_ci'


engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Define the EmotionAnalysis model
class EmotionAnalysis(Base):
    __tablename__ = 'emotion_analysis'
    id = Column(Integer, primary_key=True)
    happy = Column(Float, default=0.0)
    sad = Column(Float, default=0.0)
    surprise = Column(Float, default=0.0)
    fear = Column(Float, default=0.0)
    anger = Column(Float, default=0.0)
    disgust = Column(Float, default=0.0)
    neutral = Column(Float, default=0.0)
    dominant_emotion = Column(String(50))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

# Drop the old table and create a new one
Base.metadata.drop_all(engine)  # Drop the table
Base.metadata.create_all(engine)  # Create the updated table

# Initialize the database session
Session = sessionmaker(bind=engine)
session = Session()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    image_data = data.get('image')
    if image_data:
        # Decode the base64 image
        header, encoded = image_data.split(',', 1)
        image_bytes = base64.b64decode(encoded)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Save the original image
        original_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'captured_image.png')
        cv2.imwrite(original_image_path, img)

        try:
            # Perform emotion analysis
            analysis = DeepFace.analyze(
                img_path=original_image_path,
                actions=['emotion'],
                detector_backend='opencv',
                enforce_detection=False
            )

            # Convert numpy.float32 to float and sort emotions
            emotions = {emotion: float(value) for emotion, value in analysis[0]['emotion'].items()}
            sorted_emotions = sorted(emotions.items(), key=lambda x: x[1], reverse=True)
            dominant_emotion = sorted_emotions[0][0]

            # Log the emotions to inspect before insertion
            logging.debug(f"Emotions detected: {emotions}")
            logging.debug(f"Sorted emotions: {sorted_emotions}")
            logging.debug(f"Dominant emotion: {dominant_emotion}")

            # Store the analysis results in the database
            new_entry = EmotionAnalysis(
                happy=emotions.get('happy', 0.0),
                sad=emotions.get('sad', 0.0),
                surprise=emotions.get('surprise', 0.0),
                fear=emotions.get('fear', 0.0),
                anger=emotions.get('angry', 0.0),
                disgust=emotions.get('disgust', 0.0),
                neutral=emotions.get('neutral', 0.0),
                dominant_emotion=dominant_emotion
            )

            session.add(new_entry)

            # Ensure the data is pushed to the database before commit
            session.flush()  # Push all changes to the database
            session.commit()  # Commit the transaction to save the data

            # Delete the uploaded image after analysis
            if os.path.exists(original_image_path):
                os.remove(original_image_path)

            return jsonify({
                'success': True,
                'uploaded_image': url_for('static', filename='uploads/captured_image.png'),
                'results': {
                    'emotions': sorted_emotions,
                    'dominant_emotion': dominant_emotion
                }
            })
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)})
    return jsonify({'success': False, 'error': 'No image data received'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5500)
