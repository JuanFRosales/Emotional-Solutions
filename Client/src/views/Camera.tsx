import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

// Define the type for the props
interface CaptureAndSubmitProps {
    onSubmit: (data: any) => void; // Type of the onSubmit function
}

const CaptureAndSubmit: React.FC<CaptureAndSubmitProps> = ({ onSubmit }) => {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);
    const navigate = useNavigate();

    // Capture Image from webcam
    const captureImage = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setCapturedImage(imageSrc);
            }
        }
    };

    // Submit the captured image to backend
    const submitImage = async () => {
        if (!capturedImage) return;

        setLoading(true);
        setError(null);

        try {
            // Send the image as Base64 in JSON format
            const response = await fetch("http://localhost:5001/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Set content type to application/json
                },
                body: JSON.stringify({
                    image: capturedImage, // Send the base64 image string
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to analyze the image");
            }

            const result = await response.json();
            onSubmit(result.results); // Call the onSubmit function passed from the parent component
            navigate("/results"); // Navigate to the results page
        } catch (err) {
            if (err instanceof Error) {
                setError("Error analyzing the image: " + err.message);
            } else {
                setError("Error analyzing the image");
            }
        } finally {
            setLoading(false);
        }
    };

    // Retake the photo
    const retakeImage = () => {
        setCapturedImage(null); // Reset captured image
    };

    return (
        <div className="container">
            <h1 className="title">How do you feel?</h1>
            <div className="box-placeholder">
                {capturedImage ? (
                    <img src={capturedImage} alt="Captured" width="80%" />
                ) : (
                    <Webcam
                        audio={false}
                        screenshotFormat="image/png" // Keep format as PNG
                        width="80%"
                        videoConstraints={{
                            facingMode: "user",
                        }}
                        ref={webcamRef}
                    />
                )}
            </div>
            <div className="buttons">
                <button
                    className="button"
                    onClick={capturedImage ? submitImage : captureImage}
                >
                    {capturedImage ? " Submit" : "Capture"}
                </button>



                {capturedImage && (
                    <button
                        className="retry-button"
                        onClick={retakeImage}
                    >
                        Retake
                    </button>
                )}
            </div>

            {loading && <div className="spinner"></div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
    );
};

export default CaptureAndSubmit;
