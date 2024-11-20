import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';
import { RowDataPacket } from 'mysql2';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Route to get all emotion records
// Route to get all emotion records
app.get('/api/emotions', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT happy, sad, surprise, fear, anger, disgust, neutral, timestamp FROM emotion_analysis'
    );
    res.json(rows); // Respond with all emotion data for each record
  } catch (error) {
    console.error("Error fetching emotion records:", error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route to get averages and count of emotion records
app.get('/api/emotions/summary', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        AVG(happy) AS avg_happy, 
        AVG(sad) AS avg_sad, 
        AVG(surprise) AS avg_surprise,
        AVG(fear) AS avg_fear,
        AVG(anger) AS avg_anger,
        AVG(disgust) AS avg_disgust,
        AVG(neutral) AS avg_neutral,
        COUNT(*) AS count 
       FROM emotion_analysis`
    );
  
    // Return the summary of average emotion scores and the count of records
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching emotion summary:", error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
