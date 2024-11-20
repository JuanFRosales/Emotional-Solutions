import React, { useEffect, useState } from 'react';
import { fetchSummary } from './api/api';
import { Pie } from 'react-chartjs-2';  // Import the Pie chart component from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import chart.js elements
import './App.css';

// Register necessary chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface EmotionSummary {
  avg_happy: number;
  avg_sad: number;
  avg_surprise: number;
  avg_fear: number;
  avg_anger: number;
  avg_disgust: number;
  avg_neutral: number;
  count: number;
}

const App: React.FC = () => {
  const [summary, setSummary] = useState<EmotionSummary | null>(null);

  // Fetch emotion summary data on component mount
  useEffect(() => {
    const getSummary = async () => {
      try {
        const data = await fetchSummary();
        setSummary(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    getSummary(); // Initial data fetch
    const interval = setInterval(getSummary, 5000);  // Poll every 5 seconds

    return () => clearInterval(interval);  // Cleanup the interval on component unmount
  }, []);

  if (!summary) return <p>Loading...</p>;

  // Calculate total intensity for normalization
  const total = summary.avg_happy + summary.avg_sad + summary.avg_surprise +
               summary.avg_fear + summary.avg_anger + summary.avg_disgust +
               summary.avg_neutral;
  
  // Calculate the percentage for each emotion
  const happyPercent = (summary.avg_happy / total) * 100;
  const sadPercent = (summary.avg_sad / total) * 100;
  const surprisePercent = (summary.avg_surprise / total) * 100;
  const fearPercent = (summary.avg_fear / total) * 100;
  const angerPercent = (summary.avg_anger / total) * 100;
  const disgustPercent = (summary.avg_disgust / total) * 100;
  const neutralPercent = (summary.avg_neutral / total) * 100;

  // Data for the Pie chart
  const chartData = {
    labels: ['Happy', 'Sad', 'Surprise', 'Fear', 'Anger', 'Disgust', 'Neutral'],
    datasets: [
      {
        data: [
          happyPercent, 
          sadPercent, 
          surprisePercent, 
          fearPercent, 
          angerPercent, 
          disgustPercent, 
          neutralPercent
        ],
        backgroundColor: [
          '#00FF00', // green for Happy
          '#190dff', // blue for Sad
          '#a000fc', // purple for Surprise
          '#FF8000', // orange for Fear
          '#FF0000', // red for Anger
          '#035410', // dark green for Disgust
          '#fceb03', // yellow for Neutral
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    
    <div
    className="animated-background"
    style={{
      '--happyPercent': `${happyPercent}%`,
      '--sadPercent': `${sadPercent}%`,
      '--surprisePercent': `${surprisePercent}%`,
      '--fearPercent': `${fearPercent}%`,
      '--angerPercent': `${angerPercent}%`,
      '--disgustPercent': `${disgustPercent}%`,
      '--neutralPercent': `${neutralPercent}%`,
    } as React.CSSProperties} // Inline CSS variables
  >
      <h1>Emotion Map</h1>
      <h2>Total Answers: {summary.count}</h2>

      {/* Pie Chart displaying the emotion distribution */}


      <div className="chart-container" style={{ maxWidth: '500px', margin: 'auto', background: '#eef', borderRadius:'10%' }}>
        <Pie data={chartData} /> 
      </div>


      <div id='summary'>
        <p>Happy: {happyPercent.toFixed(1)}%</p>
        <p>Sad: {sadPercent.toFixed(1)}%</p>
        <p>Surprise: {surprisePercent.toFixed(1)}%</p>
        <p>Fear: {fearPercent.toFixed(1)}%</p>
        <p>Anger: {angerPercent.toFixed(1)}%</p>
        <p>Disgust: {disgustPercent.toFixed(1)}%</p>
        <p>Neutral: {neutralPercent.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default App;
