import { getRandomQuestion } from '../config/database.js';

export const fetchRandomQuestion = async (req, res) => {
  try {
    const { examId } = req.params;

    // Validate examId
    if (!examId || isNaN(examId)) {
      return res.status(400).json({ message: 'Invalid exam ID.' });
    }

    const question = await getRandomQuestion(examId);

    if (!question) {
      return res.status(404).json({ message: 'No question found for the selected exam.' });
    }

    res.status(200).json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Failed to fetch question.' });
  }
};
