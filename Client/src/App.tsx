import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CaptureAndSubmit from "./views/Camera";
import EmotionResults from "./views/Results";
import Start from "./views/Start";
import "./App.css";

const App: React.FC = () => {
  const [emotionData, setEmotionData] = useState<any>(null);

  // Function to handle the emotion data submission from CaptureAndSubmit
  const handleSubmitEmotion = (data: any) => {
    setEmotionData(data);
  };

  // Reset the emotion data for the next cycle
  const handleReset = () => {
    setEmotionData(null); // Reset the emotion data for the next cycle
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 id="logo">Emotional Solutions</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route
            path="/capture"
            element={<CaptureAndSubmit onSubmit={handleSubmitEmotion} />}
          />
          <Route
            path="/results"
            element={<EmotionResults results={emotionData} onReset={handleReset} />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
