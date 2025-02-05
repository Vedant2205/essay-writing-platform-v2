import { getRandomQuestion } from '../config/database.js';

export const fetchRandomQuestion = async (req, res) => {
  try {
    const { exam_id } = req.params; // Change to exam_id
    
    // Add content type header explicitly
    res.setHeader('Content-Type', 'application/json');

    // Validate exam_id
    if (!exam_id || isNaN(exam_id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID. Exam ID must be a number.'
      });
    }

    // Fetch a random question from the database
    const question = await getRandomQuestion(exam_id);

    // Check if a question was found
    if (!question) {
      return res.status(404).json({
        success: false,
        message: `No question found for the selected exam ID: ${exam_id}`
      });
    }

    // Return the question in the response
    res.status(200).json({
      success: true,
      question,
      message: 'Question retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    
    // Ensure error response is also JSON
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
