import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import  {questionsRoutes }from './routes/questions.js';
import { essayRouter } from './routes/essays.js';  // Corrected import for named export
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Allow frontend URL or localhost for development
  methods: ['GET', 'POST'],  // Allow GET and POST methods
  allowedHeaders: ['Content-Type'],  // Allow Content-Type header
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/questions', questionsRoutes);
app.use('/api/submit', essayRouter);  // Use the correct route handler

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
