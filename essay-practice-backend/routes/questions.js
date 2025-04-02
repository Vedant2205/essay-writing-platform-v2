import express from 'express';
const router = express.Router();

// Define your route
router.get('/', async (req, res) => {
  try {
    const exam_id = req.query.exam_id;
    console.log('Received request for exam_id:', exam_id);
    console.log('Full request URL:', req.originalUrl); // Add this line

    if (!exam_id) {
      console.log('No exam_id provided');
      return res.status(400).json({ success: false, message: 'Exam ID is required' });
    }

    const question = await getRandomQuestion(parseInt(exam_id));
    console.log('Retrieved question:', question);

    if (!question) {
      console.log(`No question found for exam ID: ${exam_id}`); // Add this line
      return res.status(404).json({ 
        success: false, 
        message: `No question found for exam ID: ${exam_id}` 
      });
    }

    return res.json({ success: true, question });
  } catch (error) {
    console.error('Error in questions route:', error);
    console.error('Stack trace:', error.stack); // Add this line
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch question' 
    });
  }
});

// Export the router as default
export default router; // Export as default
