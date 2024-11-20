import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2"; // Import the Pie chart component
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

// Register required chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Predefined colors for each emotion
const emotionColors: { [key: string]: string } = {
  happy: "#13fc03",   // Red
  sad: "#190dff",     // Blue
  surprise: "#a000fc", // Purple
  fear: "#fc8f00",     // Orange
  angry: "#ff0101",    // Red
  disgust: "#035410",  // Dark Green
  neutral: "#fceb03",  //Yellow
};

interface EmotionResultsProps {
  results: any; // Expecting a results object with emotion percentages
  onReset: () => void;
}

const EmotionResults: React.FC<EmotionResultsProps> = ({ results, onReset }) => {
  const [chartData, setChartData] = useState<any>(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    if (results && results.emotions) {
      // Extract the emotions and their percentages
      const emotions = results.emotions;
      
      // Map emotions to their color and percentage
      const labels = emotions.map((emotion: [string, number]) => emotion[0]);
      const data = emotions.map((emotion: [string, number]) => emotion[1]);
      const backgroundColors = emotions.map(
        (emotion: [string, number]) => emotionColors[emotion[0]] // Map each emotion to a color
      );

      // Prepare the data for the pie chart
      const dataConfig = {
        labels: labels,
        datasets: [
          {
            label: "Emotion Distribution",
            data: data, // Emotion percentages
            backgroundColor: backgroundColors, // Colors from the map
            hoverOffset: 4,
          },
        ],
      };

      setChartData(dataConfig); // Set the chart data state
    }
  }, [results]);

  

  // Function to handle the redirection to the homepage
  const redirectToHome = () => {
    navigate("/"); // Redirect to the homepage ("/")
  };

  return (
    <div className="container">
      {results ? (
        <div>
          <h1 className="title">Emotion Analysis Results</h1>
          <div className="chart-container">
            {chartData && <Pie data={chartData} />} {/* Render the Pie chart if data is ready */}
          </div>
          <div className="emotion-data">
            <h3>Dominant Emotion: {results.dominant_emotion}</h3>
          </div>
        </div>
      ) : (
        <p>No results to display</p>
      )}

      <button onClick={redirectToHome} className="button">Reset and Try Again</button>
    </div>
  );
};

export default EmotionResults;
