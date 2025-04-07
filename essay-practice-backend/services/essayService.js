import pkg from 'pg';
import evaluateEssay from './geminiAPI.js'; // Correct Gemini API integration

const { Pool } = pkg;

// Create database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to extract numeric score from Gemini feedback
const extractScoreFromFeedback = (feedback) => {
  const scoreMatch = feedback.match(/Score:\s*(\d+)\s*\/\s*100/i);
  return scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
};

// Function to save essay and evaluation result
const saveEssayWithEvaluation = async (exam_id, essay_text, user_id) => {
  try {
    if (typeof essay_text !== 'string' || essay_text.trim() === '') {
      throw new Error('Essay text cannot be empty or invalid.');
    }

    // Evaluate essay using Gemini API
    const evaluationResult = await evaluateEssay(exam_id, essay_text);

    const feedback = evaluationResult.feedback || '';
    const score = extractScoreFromFeedback(feedback);

    if (isNaN(score) || score < 0 || score > 100) {
      throw new Error('Invalid score extracted from Gemini feedback.');
    }

    // Save essay to 'essays' table
    const insertEssayQuery = `
      INSERT INTO essays (exam_id, essay_text, user_id, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const essayValues = [exam_id, essay_text, user_id];
    const essayResult = await pool.query(insertEssayQuery, essayValues);
    const savedEssay = essayResult.rows[0];

    // Save evaluation to 'results' table
    const insertResultQuery = `
      INSERT INTO results (essay_id, user_id, essay_text, score, feedback, word_count, character_count, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *;
    `;
    const resultValues = [
      savedEssay.id,
      user_id,
      essay_text,
      score,
      feedback,
      evaluationResult.word_count,
      evaluationResult.character_count,
    ];
    const resultInsert = await pool.query(insertResultQuery, resultValues);
    const savedResult = resultInsert.rows[0];

    return { status: 'success', essay: savedEssay, evaluation: savedResult };
  } catch (error) {
    console.error('❌ Error in saveEssayWithEvaluation:', error.message);
    throw error;
  }
};

// Fetch essays by user
const getEssaysByUser = async (user_id) => {
  try {
    const query = `
      SELECT * FROM essays
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching essays by user:', error.message);
    throw error;
  }
};

// Fetch evaluation by essay ID
const getEssayEvaluationById = async (essay_id) => {
  try {
    const query = `
      SELECT * FROM results
      WHERE essay_id = $1;
    `;
    const result = await pool.query(query, [essay_id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching essay evaluation:', error.message);
    throw error;
  }
};

export {
  saveEssayWithEvaluation,
  getEssaysByUser,
  getEssayEvaluationById,
};
