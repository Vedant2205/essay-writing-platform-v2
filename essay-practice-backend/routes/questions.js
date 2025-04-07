import express from 'express';
import pkg from 'pg';

const { Pool } = pkg;
const router = express.Router();

// Create database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to fetch a random question
const getRandomQuestion = async (exam_id) => {
  try {
    const query = `
      SELECT * FROM questions 
      WHERE exam_id = $1 
      ORDER BY RANDOM() 
      LIMIT 1;
    `;
    const result = await pool.query(query, [exam_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('🔥 Error fetching random question:', error);
    throw error;
  }
};

// Define your route
router.get('/', async (req, res) => {
  try {
    const exam_id = req.query.exam_id;
    console.log('📩 Received request for exam_id:', exam_id);
    console.log('🔗 Full request URL:', req.originalUrl);

    if (!exam_id) {
      console.log('❌ No exam_id provided');
      return res.status(400).json({ success: false, message: 'Exam ID is required' });
    }

    const question = await getRandomQuestion(parseInt(exam_id));
    console.log('✅ Retrieved question:', question);

    if (!question) {
      console.log(`⚠️ No question found for exam ID: ${exam_id}`);
      return res.status(404).json({ 
        success: false, 
        message: `No question found for exam ID: ${exam_id}` 
      });
    }

    return res.json({ success: true, question });
  } catch (error) {
    console.error('🔥 Error in questions route:', error);
    console.error('📜 Stack trace:', error.stack);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch question' 
    });
  }
});

// Export the router as default
export default router;
