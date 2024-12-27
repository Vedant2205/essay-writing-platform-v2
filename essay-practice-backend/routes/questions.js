import express from 'express';  // Use ES module import syntax
import { getRandomQuestion } from '../config/database.js';  // Make sure this path is correct for your db.js

const router = express.Router();

// Route to fetch a random question based on Exam ID
router.get('/:examId', async (req, res) => {
  const examId = req.params.examId;
  try {
    const question = await getRandomQuestion(examId); // Assuming this function fetches a random question based on examId
    if (question) {
      res.json({ question });  // Send the question back as a JSON response
    } else {
      res.status(404).json({ message: 'No question found for the selected exam.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching the question.' });
  }
});

// Export the router as a named export
export { router as questionsRoutes };
