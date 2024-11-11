import React, { useRef, useState, useEffect } from 'react';

interface CameraComponentProps {
  onCapture: (image: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

  // Start webcam feed when the component mounts
  useEffect(() => {
    startWebcam();
  }, []);

  // Start webcam feed using WebRTC's getUserMedia
  const startWebcam = async () => {
    if (videoRef.current) {
      try {
        // Get access to the webcam video stream using WebRTC (getUserMedia)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Set the video stream to the video element
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Error accessing webcam: ', err);
        alert('Failed to access webcam. Please check your browser permissions.');
      }
    }
  };

  // Capture a still image from the video feed
  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Draw current frame from the video onto the canvas
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Get the image data as base64 string
      const imageData = canvas.toDataURL('image/jpeg');
      setImage(imageData); // Store the image for display
      onCapture(imageData); // Call the onCapture prop to pass image back to parent
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        width="100%"
        height="auto"
        onCanPlay={() => console.log('Video is ready to play')}
      ></video>
      <button onClick={capture}>Capture</button>
      {image && (
        <div>
          <h2>Captured Image:</h2>
          <img src={image} alt="Captured" width="100%" />
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
