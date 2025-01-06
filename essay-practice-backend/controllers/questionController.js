import  getRandomQuestion  from '../config/database.js'; // Ensure the path is correct

// Controller to fetch a random question based on Exam ID
export const fetchRandomQuestion = async (req, res) => {
  try {
    const { examId } = req.params; // Extract examId from request parameters

    // Validate examId
    if (!examId || isNaN(examId)) {
      return res.status(400).json({ message: 'Invalid exam ID. Exam ID must be a number.' });
    }

    // Fetch a random question from the database
    const question = await getRandomQuestion(examId);

    // Check if a question was found
    if (!question) {
      return res.status(404).json({ message: 'No question found for the selected exam.' });
    }

    // Return the question in the response
    res.status(200).json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);

    // Return a detailed error in development mode
    res.status(500).json({
      message: 'Failed to fetch question.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined, // Only expose details in development
    });
  }
};
