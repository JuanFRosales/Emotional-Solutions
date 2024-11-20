import axios from "axios";

const API_URL = "http://localhost:5500/analyze"; 

// Function to send image to backend
export const analyzeImage = async (imageBase64: string) => {
    try {
        // Log the imageBase64 to ensure it's correctly passed
        console.log("Sending image to backend:", imageBase64);

        // Send the image as a POST request to the Flask backend
        const response = await axios.post(API_URL, {
            image: imageBase64,
        });

        // Log the response for debugging
        console.log("Response from backend:", response.data);

        return response.data; // Return the results from the API
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw error; // Rethrow the error to handle it in the UI
    }
};
