import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:4000/api'; // Change this if deploying the backend elsewhere

// Fetch all emotion records from the backend
export const fetchEmotions = async () => {
  try {
    const response = await axios.get(`${API_URL}/emotions`);
    return response.data;  // Returns the emotion data (positive, neutral, negative, timestamp)
  } catch (error) {
    console.error("Error fetching emotion records:", error);
    throw new Error('Error fetching emotion records');
  }
};

// Fetch the emotion summary (average and count) from the backend
export const fetchSummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/emotions/summary`);
    return response.data;  // Returns the average emotions and total count
  } catch (error) {
    console.error("Error fetching emotion summary:", error);
    throw new Error('Error fetching emotion summary');
  }
};
