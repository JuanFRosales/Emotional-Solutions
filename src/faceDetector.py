import cv2
import logging
from keras.src.utils import img_to_array
import numpy as np

# Set up logging
logging.basicConfig(level=logging.INFO)

# This function Crops the image and turns it to gray scale 
def crop_the_img(image):
    # Check if the image was loaded
    if image is None:
        return logging.error("Error: Image not found. Check the file path.")
    else:
        logging.info("Image loaded successfully.")
    # Convert RGB to BGR (if needed)
    image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    # Load the Haar Cascade for face detection
    face_classifier = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    # Detect face in the image
    face = face_classifier.detectMultiScale( gray_image, scaleFactor=1.1, 
                                             minNeighbors=5, minSize=(30, 30) )
    if len(face) == 0:
        logging.error("No faces Detected")
        return
    else:
        x, y, w, h = face[0]
        cropped_face = gray_image[y:y + h, x:x + w]

        logging.info("Face cropped successfully.")
        return cropped_face
##################################################################################

# prosess the image furtue resizing, normalaization etc
def processing_image(croped_image):
    # resize the Detected Face with high quality
    image = cv2.resize(croped_image, (48, 48), interpolation=cv2.INTER_LANCZOS4)
    # Convert image to array
    image = img_to_array(image)
    # Add a batch dimension and reshape the image for the model (1, 48, 48, 1)
    # Add channel dimension (1 for grayscale)
    image = np.expand_dims(image, axis=-1)
     # Add batch dimension (1 image)
    image = np.expand_dims(image, axis=0)
    # Normalize the image
    image = image / 255.0

    return image
## the final function that will be called in main.py

def face_detector(imagePath):
    croped_image = crop_the_img(imagePath)
    ready_image = processing_image(croped_image)
    return ready_image

