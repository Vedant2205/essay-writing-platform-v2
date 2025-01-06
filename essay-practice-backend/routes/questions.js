import express from 'express';
import { getRandomQuestion } from '../config/database.js'; // Import the database function

const router = express.Router();

// Route to fetch a random question based on Exam ID
router.get('/random-question/:examId', async (req, res) => {
  const { examId } = req.params; // Destructure examId from the params

  // Validate that examId is a numeric value
  if (!examId || isNaN(examId)) {
    return res.status(400).json({ message: 'Invalid exam ID. Exam ID must be a number.' });
  }

  try {
    // Call the database function to get a random question
    const question = await getRandomQuestion(examId);

    // If no question is found, return a 404 error
    if (!question) {
      console.error(`No question found for examId: ${examId}`); // Log the missing question for better debugging
      return res.status(404).json({ message: 'No question found for this exam.' });
    }

    // Send the question as a JSON response
    return res.status(200).json({ question });
  } catch (error) {
    console.error(`Error fetching random question for examId: ${examId}`, error);

    // Return a 500 error with details in development mode
    return res.status(500).json({
      message: 'An error occurred while fetching the random question.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined, // Only expose error details in development
    });
  }
});

export default router;
