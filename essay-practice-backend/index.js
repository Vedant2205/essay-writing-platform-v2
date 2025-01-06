import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Import route files
import essayRoutes from './routes/essays.js';
import questionRoutes from './routes/questions.js';

dotenv.config();  // Initialize dotenv to load environment variables

const app = express();

// Middleware
app.use(cors());  // Enable CORS for all origins
app.use(bodyParser.json());  // Parse incoming requests with JSON payloads

// Routes
app.use('/api/essays', essayRoutes);  // Handle routes for essays
app.use('/api/questions', questionRoutes);  // Handle routes for questions

// Default error handling for 404 - Route not found
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;  // Use port from environment or default to 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
