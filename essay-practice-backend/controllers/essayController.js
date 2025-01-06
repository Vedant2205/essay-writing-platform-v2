import essayService from '../services/essayService.js';
import { Pool } from 'pg';

// Create database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to handle saving the essay
const saveEssay = async (req, res, next) => {
  try {
    const { exam, essayText, userId } = req.body;

    // Validate input
    if (!exam || !essayText || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Exam, essayText, and userId are required',
      });
    }

    // Word count validation: Essay must be between 20 and 1000 words
    const wordCount = essayText.trim().split(/\s+/).length;
    if (wordCount < 20 || wordCount > 1000) {
      return res.status(400).json({
        success: false,
        message: `Essay must be between 20 and 1000 words. Current word count: ${wordCount}`,
      });
    }

    console.log('Saving essay to database...');

    // Save essay with PostgreSQL
    const query = `
      INSERT INTO essays (exam, essay_text, user_id, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *`;
    const values = [exam, essayText, userId];

    const result = await pool.query(query, values);
    const savedEssay = result.rows[0];

    console.log('Essay saved successfully:', savedEssay);

    res.status(201).json({
      success: true,
      data: savedEssay,
    });
  } catch (error) {
    console.error('Error saving essay:', error);
    next(error);
  }
};

// Function to handle essay evaluation
const evaluateEssay = async (req, res, next) => {
  try {
    const { exam, essayText, userId } = req.body;

    // Validate input
    if (!exam || !essayText || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Exam, essayText, and userId are required',
      });
    }

    // Word count validation
    const wordCount = essayText.trim().split(/\s+/).length;
    if (wordCount < 20 || wordCount > 1000) {
      return res.status(400).json({
        success: false,
        message: `Essay must be between 20 and 1000 words. Current word count: ${wordCount}`,
      });
    }

    console.log('Evaluating essay with Gemini API...');

    // Check if essay is already evaluated
    const checkQuery = `
      SELECT evaluation_result
      FROM results
      WHERE user_id = $1 AND essay_text = $2`;
    const checkResult = await pool.query(checkQuery, [userId, essayText]);

    if (checkResult.rows.length > 0) {
      return res.status(200).json({
        success: true,
        data: checkResult.rows[0].evaluation_result,
      });
    }

    // Evaluate essay through Gemini API
    const evaluationResult = await essayService.evaluateEssayWithGemini(exam, essayText);

    console.log('Received evaluation result:', evaluationResult);

    // Validate Gemini API response structure
    const isValidResponse = validateEvaluationResponse(evaluationResult);
    if (!isValidResponse) {
      return res.status(500).json({
        success: false,
        message: 'Invalid response from Gemini API',
      });
    }

    // Save evaluation result in the results table
    const saveQuery = `
      INSERT INTO results (user_id, essay_text, score, feedback, word_count, character_count, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *`;
    const saveResult = await pool.query(saveQuery, [
      userId,
      essayText,
      evaluationResult.score,
      evaluationResult.feedback,
      evaluationResult.word_count,
      evaluationResult.character_count,
    ]);

    console.log('Evaluation result saved successfully:', saveResult.rows[0]);

    res.status(200).json({
      success: true,
      data: saveResult.rows[0],
    });
  } catch (error) {
    console.error('Error evaluating essay:', error);
    next(error);
  }
};

// Function to fetch all saved essays by a user
const getEssaysByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    console.log('Fetching essays for user:', userId);

    const query = `
      SELECT id, exam, essay_text, created_at
      FROM essays
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3`;

    const result = await pool.query(query, [userId, limit, offset]);

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'No essays found for this user',
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching essays by user:', error);
    next(error);
  }
};

// Function to fetch a specific essay by ID
const getEssayById = async (req, res, next) => {
  try {
    const { essayId } = req.params;

    console.log('Fetching essay with ID:', essayId);

    const query = `
      SELECT e.*, r.evaluation_result
      FROM essays e
      LEFT JOIN results r ON e.id = r.essay_id
      WHERE e.id = $1`;

    const result = await pool.query(query, [essayId]);

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Essay not found',
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching essay by ID:', error);
    next(error);
  }
};

// Function to validate Gemini API response structure
const validateEvaluationResponse = (response) => {
  if (
    typeof response.score === 'number' &&
    typeof response.word_count === 'number' &&
    typeof response.character_count === 'number' &&
    typeof response.feedback === 'string'
  ) {
    return true;
  }
  return false;
};

export {
  saveEssay,
  evaluateEssay,
  getEssaysByUser,
  getEssayById,
};
