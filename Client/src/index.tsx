// index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // Import BrowserRouter
import App from "./App";  // Import the App component

// Render the app wrapped in BrowserRouter
const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <BrowserRouter>  {/* Wrap the app inside BrowserRouter */}
    <App />
  </BrowserRouter>
);
