import React, { useRef, useState, useEffect } from 'react';
import ButtonComponent from './button';
import { TextGenerateEffect } from "./text-generate-effect";
import { useRouter } from 'next/navigation'

const CameraComponent: React.FC = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    startWebcam();
    return () => stopWebcam(); // Clean up stream on unmount
  }, []);

  const startWebcam = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = videoStream;
      setStream(videoStream);
    } catch (err) {
      console.error('Webcam access error:', err);
    }
  };

  const stopWebcam = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setImage(canvas.toDataURL('image/jpeg'));
      stopWebcam();
    }
  };

  const retakeImage = () => {
    setImage(null);
    startWebcam();
  };

  const handleUpload = async ( file: string ) => {
    const base64string = file.split(',')[1];
    const payload = {
      image: base64string,
    };

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data)
        // Construct query parameters manually
        const queryString = new URLSearchParams({
          emotions: JSON.stringify(data)});

        // Use router.push with full URL including query
        router.push(`/EmotionResponse?${queryString}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };



  return (
    <div>
      {!image ? (
        <div className="flex md:justify-center">
          <video
            className="rounded-md"
            autoPlay
            ref={videoRef}
            onCanPlay={() => console.log('Video is ready to play')}
          ></video>
        </div>
      ) : (
        <div className="flex md:justify-center">
          <img src={image} alt="Captured" className="rounded-md" />
        </div>
      )}

      <div className="flex md:justify-center pt-20">
        {!image ? (
          <ButtonComponent onClick={captureImage} title="Capture Image" />
        ) : (
          <ButtonComponent onClick={retakeImage} title="Retake Picture" />
        )}
      </div>
      <div className="flex md:justify-center pt-20">
        <ButtonComponent onClick={() => handleUpload(image!)} title="Submit"/>
      </div>
    </div>
  );
};

export default CameraComponent;
