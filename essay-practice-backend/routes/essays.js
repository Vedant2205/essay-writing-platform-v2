import express from 'express';
import essayService from '../services/essayService.js'; // Import essay service functions

const { saveEssayToDatabase, evaluateEssayWithGemini } = essayService; // Destructure functions from essayService

const essayRouter = express.Router();

// Route for submitting essays
essayRouter.post('/submit', async (req, res) => {
  try {
    const { exam, essayText, userId } = req.body;
    const essay = await saveEssayToDatabase(exam, essayText, userId);
    res.status(200).json(essay);
  } catch (error) {
    res.status(500).json({ message: 'Error saving essay' });
  }
});

// Route for evaluating essays
essayRouter.post('/evaluate', async (req, res) => {
  try {
    const { exam, essayText } = req.body;
    const evaluationResult = await evaluateEssayWithGemini(exam, essayText);
    res.status(200).json(evaluationResult);
  } catch (error) {
    res.status(500).json({ message: 'Error evaluating essay' });
  }
});

// Export essayRouter as a named export
export { essayRouter };
