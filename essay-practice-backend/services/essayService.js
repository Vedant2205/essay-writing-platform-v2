import pkg from 'pg';
import evaluateEssay from './GeminiEvaluation.js'; // Ensure this is correctly importing the evaluation function

const { Pool } = pkg;

// Create database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to save essay and evaluation result
const saveEssayWithEvaluation = async (exam_id, essayText, userId) => {
  try {
    // Step 1: Validate essay text
    if (typeof essayText !== 'string' || essayText.trim() === '') {
      throw new Error('Essay text cannot be empty or invalid.');
    }

    // Step 2: Evaluate essay using the Gemini API
    const evaluationResult = await evaluateEssay(exam_id, essayText);

    // Step 3: Validate evaluation result
    if (
      typeof evaluationResult.score !== 'number' ||
      isNaN(evaluationResult.score) ||
      evaluationResult.score < 0 ||
      evaluationResult.score > 100
    ) {
      throw new Error('Invalid score: must be a numeric value between 0 and 100.');
    }
    if (typeof evaluationResult.feedback !== 'string' || evaluationResult.feedback.trim() === '') {
      throw new Error('Invalid feedback: must be a non-empty string.');
    }

    // Step 4: Save essay to the 'essays' table
    const insertEssayQuery = `
      INSERT INTO essays (exam_id, essay_text, user_id, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `;
    const essayValues = [exam_id, essayText, userId];
    const essayResult = await pool.query(insertEssayQuery, essayValues);
    const savedEssay = essayResult.rows[0];

    console.log('Essay saved successfully:', savedEssay);

    // Step 5: Save evaluation result to the 'results' table
    const insertResultQuery = `
      INSERT INTO results (essay_id, user_id, score, feedback, word_count, character_count, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *;
    `;
    const resultValues = [
      savedEssay.id, // Link essay ID to results table
      userId,
      evaluationResult.score,
      evaluationResult.feedback,
      evaluationResult.word_count,
      evaluationResult.character_count,
    ];
    const resultInsert = await pool.query(insertResultQuery, resultValues);
    const savedResult = resultInsert.rows[0];

    console.log('Evaluation result saved successfully:', savedResult);

    // Return the saved essay and its evaluation
    return { status: 'success', essay: savedEssay, evaluation: savedResult };
  } catch (error) {
    console.error('Error in saveEssayWithEvaluation:', error.message);
    throw error; // Re-throw for handling at the controller level
  }
};

// Function to evaluate essay using Gemini API
const evaluateEssayWithGemini = async (exam_id, essayText) => {
  try {
    const evaluationResult = await evaluateEssay(exam_id, essayText);
    return evaluationResult;
  } catch (error) {
    console.error('Error evaluating essay with Gemini API:', error.message);
    throw error;
  }
};

// Function to fetch all essays submitted by a specific user
const getEssaysByUser = async (userId) => {
  try {
    const query = `
      SELECT * FROM essays
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching essays by user:', error.message);
    throw error;
  }
};

// Function to fetch evaluation result for a specific essay
const getEssayEvaluationById = async (essayId) => {
  try {
    const query = `
      SELECT * FROM results
      WHERE essay_id = $1;
    `;
    const result = await pool.query(query, [essayId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching essay evaluation:', error.message);
    throw error;
  }
};

// Export the functions
export {
  saveEssayWithEvaluation,
  evaluateEssayWithGemini,
  getEssaysByUser,
  getEssayEvaluationById,
};
