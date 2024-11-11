"use client"
import CameraComponent from "@/Components/cameraComponent";
import { useState } from "react";

const HomePage: React.FC = () => {
  const [emotion, setEmotion] = useState<string>('');
  // This is where you handle the image after it's captured
  const handleCapture = (image: string) => {
    console.log('Captured Image:', image);
    sendImageToBackend(image);
  };
  const sendImageToBackend = async (imageData: string) => {
    const formData = new FormData();
    formData.append('file', dataURItoBlob(imageData)); // Convert base64 image to Blob

    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    setEmotion(result.emotion); // Display emotion prediction
  };

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <CameraComponent onCapture={handleCapture} /> 
      {emotion && <h2>Detected Emotion: {emotion}</h2>}
    </div>
  );
};

export default HomePage;
