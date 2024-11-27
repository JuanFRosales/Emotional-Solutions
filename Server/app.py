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
logging.basicConfig(level=logging.DEBUG)  # Configure logging for debugging

# Configure Upload Folder and Allowed Extensions
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Database setup: Connect to the MySQL database using SQLAlchemy
DATABASE_URL = 'mysql+mysqlconnector://juan:password@host.docker.internal:3306/emotion_analysis_db?charset=utf8mb4&collation=utf8mb4_general_ci'
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Define the EmotionAnalysis model for storing results in the database
class EmotionAnalysis(Base):
    """
    Model to represent the emotion analysis results in the database.
    
    Attributes:
        id (int): The primary key of the record.
        happy (float): The probability of happiness.
        sad (float): The probability of sadness.
        surprise (float): The probability of surprise.
        fear (float): The probability of fear.
        anger (float): The probability of anger.
        disgust (float): The probability of disgust.
        neutral (float): The probability of neutrality.
        dominant_emotion (str): The dominant emotion detected.
        timestamp (datetime): The timestamp when the analysis was performed.
    """
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


# Initialize the database session
Session = sessionmaker(bind=engine)
session = Session()

@app.route('/')
def index():
    """
    Serve the home page with the emotion recognition form.

    Returns:
        render_template: Renders the HTML template for the homepage.
    """
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Analyze an uploaded image to detect emotions using DeepFace and store the results in the database.
    
    This endpoint receives a base64 encoded image, performs emotion analysis using the DeepFace library, 
    and returns the detected emotions along with the dominant emotion. The results are stored in a MySQL database.

    Request:
        JSON with base64 encoded image data.
        
    Returns:
        JSON response containing success status, image URL, and emotion analysis results.
    """
    data = request.json
    image_data = data.get('image')
    
    if image_data:
        # Decode the base64 image
        header, encoded = image_data.split(',', 1)
        image_bytes = base64.b64decode(encoded)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Save the original image to disk for analysis
        original_image_path = os.path.join(app.config['UPLOAD_FOLDER'], 'captured_image.png')
        cv2.imwrite(original_image_path, img)

        try:
            # Perform emotion analysis using DeepFace
            analysis = DeepFace.analyze(
                img_path=original_image_path,
                actions=['emotion'],  # Analyze emotions
                detector_backend='opencv',
                enforce_detection=False  # Allow analysis without face detection
            )

            # Extract emotions from the analysis results
            emotions = {emotion: float(value) for emotion, value in analysis[0]['emotion'].items()}
            sorted_emotions = sorted(emotions.items(), key=lambda x: x[1], reverse=True)
            dominant_emotion = sorted_emotions[0][0]

            # Log the emotions for debugging
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

            # Add the entry to the session and commit it to the database
            session.add(new_entry)
            session.flush()  # Push changes to the database
            session.commit()  # Commit the transaction

            # Delete the uploaded image after analysis to save space
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
            # Handle any errors during analysis
            return jsonify({'success': False, 'error': str(e)})
    
    # Return error if no image data is received
    return jsonify({'success': False, 'error': 'No image data received'})

if __name__ == '__main__':
    """
    Run the Flask application.

    This will start the server on 0.0.0.0, port 5500.
    """
    app.run(host='0.0.0.0', port=5500)
