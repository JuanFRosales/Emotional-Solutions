import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2"; // Import the Pie chart component from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

// Register required chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

interface EmotionResultsProps {
  results: any;
  onReset: () => void;
}

const EmotionResults: React.FC<EmotionResultsProps> = ({ results, onReset }) => {
  // Handle the chart data and options
  const [chartData, setChartData] = useState<any>(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    if (results) {
      // Prepare the data for the pie chart
      const data = {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
          {
            label: "Emotion Distribution",
            data: [results.positive, results.neutral, results.negative], // Assuming the response contains positive, neutral, and negative fields
            backgroundColor: ["#00FF00", "#FFFF00", "#FF0000"], // Colors for each emotion type (green, yellow, red)
            hoverOffset: 4,
          },
        ],
      };

      setChartData(data); // Set the chart data state
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
            <p>Positive: {results.positive.toFixed(1)}%</p>
            <p>Neutral: {results.neutral.toFixed(1)}%</p>
            <p>Negative: {results.negative.toFixed(1)}%</p>
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
