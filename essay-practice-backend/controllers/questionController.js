export const fetchRandomQuestion = async (req, res) => {
  try {
    let { exam_id } = req.query;
    console.log('Received exam_id:', exam_id); // Add logging

    // Convert exam_id to a number and validate
    exam_id = parseInt(exam_id, 10);
    if (isNaN(exam_id) || exam_id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID. Exam ID must be a positive number.',
      });
    }

    // Fetch a random question from the database
    const question = await getRandomQuestion(exam_id);
    console.log('Retrieved question:', question); // Add logging

    if (!question) {
      return res.status(404).json({
        success: false,
        message: `No question found for exam ID: ${exam_id}`,
      });
    }

    res.status(200).json({
      success: true,
      question,
      message: 'Question retrieved successfully',
    });
  } catch (error) {
    console.error('Error in fetchRandomQuestion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch question.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};