import db from '../config/database.js'; // Using ES module import for database
import { evaluateEssay } from './geminiAPI.js'; // Importing the Gemini API evaluation function

const { query } = db;

// Function to save an essay to the database
const saveEssayToDatabase = async (exam, essayText, userId) => {
  const insertQuery = `
    INSERT INTO essays (exam, essay_text, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [exam, essayText, userId];
  const result = await query(insertQuery, values);
  return result.rows[0];
};

// Function to evaluate an essay using the Gemini API
const evaluateEssayWithGemini = async (question, essayText) => {
  try {
    const evaluationResult = await evaluateEssay(question, essayText); // Call the Gemini API
    return evaluationResult;
  } catch (error) {
    console.error('Error during essay evaluation:', error);
    throw error;
  }
};

// Function to save evaluation results to the database
const saveEvaluationResultToDatabase = async (userId, evaluationResult) => {
  const insertQuery = `
    INSERT INTO evaluations (user_id, score, feedback)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [userId, evaluationResult.score, evaluationResult.feedback];
  const result = await query(insertQuery, values);
  return result.rows[0];
};

// Default export of all functions within an object
export default {
  saveEssayToDatabase,
  evaluateEssayWithGemini,
  saveEvaluationResultToDatabase,
};
