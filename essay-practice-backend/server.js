import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import the CORS package
import pool from './config/database.js';
import questionsRouter from './routes/questions.js';
import essayRouter from './routes/essays.js';
import authRouter from './routes/auth.js'; // Import the auth routes
import errorHandler from './middleware/errorHandler.js';

// Initialize the Express app
dotenv.config();
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse incoming requests with JSON payloads

// Routes
app.use('/api/auth', authRouter); // Use the auth routes
app.use('/api/questions', questionsRouter);
app.use('/api/essays', essayRouter); // Use the essays routes

// Global error handler
app.use(errorHandler);

// Test database connection when the server starts
const testDatabaseConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected:', res.rows[0].now);
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1); // Exit if the connection fails
  }
};

// Call the test function on startup
testDatabaseConnection();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Gracefully handle server shutdown to close database connections
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Database pool has been closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database pool:', error.message);
    process.exit(1);
  }
});
