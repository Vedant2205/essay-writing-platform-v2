import express from 'express';
import { getRandomQuestion } from '../config/database.js';

const router = express.Router();

router.get('/random-question/:examId', async (req, res) => {
  const { examId } = req.params;

  try {
    if (!examId || isNaN(examId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid exam ID. Please provide a valid number.' 
      });
    }

    const question = await getRandomQuestion(examId);

    if (!question) {
      return res.status(404).json({ 
        success: false,
        message: `No questions found for exam ID: ${examId}` 
      });
    }

    return res.status(200).json({ 
      success: true,
      question,
      message: 'Question retrieved successfully'
    });

  } catch (error) {
    console.error(`Error in /random-question/${examId}:`, error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching question',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;