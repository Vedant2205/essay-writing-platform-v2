import db from '../config/database.js'; // Import the database connection
import evaluateEssay from './GeminiEvaluation.js'; // Import evaluateEssay function
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Helper function to create the SQL query for inserting essays
const getInsertQuery = () => `
  INSERT INTO essays (exam_id, essay_text, user_id, created_at)
  VALUES ($1, $2, $3, NOW())
  RETURNING id, exam_id, essay_text, user_id, created_at;
`;

// Function to save an essay to the database
const saveEssayToDatabase = async (examId, essayText, userId) => {
  const query = getInsertQuery();

  try {
    const values = [examId, essayText, userId];
    console.log('Inserting essay into database with values:', values);

    const result = await db.query(query, values);
    console.log('Essay saved to database:', result.rows[0]);
    return result.rows[0]; // Return the saved essay record
  } catch (error) {
    console.error('Error saving essay to database:', error);
    if (error.code === '23505') {
      // Unique constraint violation
      throw new Error('Essay already exists');
    }
    throw new Error('Failed to save essay to database');
  }
};

// Function to fetch essays by user ID
const getEssaysByUserId = async (userId) => {
  const query = `
    SELECT id, exam_id, essay_text, created_at
    FROM essays
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 50;
  `;

  try {
    const result = await db.query(query, [userId]);
    console.log('Fetched essays by user ID:', result.rows);
    return result.rows; // Return the list of essays
  } catch (error) {
    console.error('Error fetching essays by user ID:', error);
    throw new Error('Failed to fetch essays');
  }
};

// Function to fetch a specific essay by its ID
const getEssayById = async (essayId) => {
  const query = `
    SELECT e.*, r.score, r.feedback, r.word_count, r.character_count
    FROM essays e
    LEFT JOIN results r ON e.id = r.essay_id
    WHERE e.id = $1;
  `;

  try {
    const result = await db.query(query, [essayId]);
    console.log('Fetched essay by ID:', result.rows[0]);
    return result.rows[0] || null; // Return the essay or null if not found
  } catch (error) {
    console.error('Error fetching essay by ID:', error);
    throw new Error('Failed to fetch essay');
  }
};

// Function to save the evaluation result to the database
const saveEvaluationResult = async (essayId, evaluationResult) => {
  const query = `
    INSERT INTO results (essay_id, score, feedback, word_count, character_count, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id, essay_id, score, feedback, word_count, character_count, created_at;
  `;

  try {
    const values = [
      essayId,
      evaluationResult.score,
      evaluationResult.feedback,
      evaluationResult.word_count,
      evaluationResult.character_count,
    ];
    console.log('Saving evaluation result:', values);
    const result = await db.query(query, values);
    console.log('Evaluation result saved:', result.rows[0]);
    return result.rows[0]; // Return the saved evaluation result
  } catch (error) {
    console.error('Error saving evaluation result:', error);
    throw new Error('Failed to save evaluation result');
  }
};

// Function to save the essay and evaluate it in two steps
const saveEssayWithEvaluation = async (examId, essayText, userId) => {
  const client = await db.connect();

  try {
    await client.query('BEGIN'); // Start the transaction

    // Step 1: Save the essay to the `essays` table
    const essay = await saveEssayToDatabase(examId, essayText, userId);
    console.log('Essay saved to database:', essay);

    // Step 2: Get evaluation result from Gemini API
    const evaluationResult = await evaluateEssay(examId, essayText);
    console.log('Gemini API returned evaluation result:', evaluationResult);

    // Step 3: Save evaluation result into the `results` table
    const savedEvaluationResult = await saveEvaluationResult(essay.id, evaluationResult);
    console.log('Evaluation result saved to database:', savedEvaluationResult);

    await client.query('COMMIT'); // Commit the transaction
    return { ...essay, evaluationResult: savedEvaluationResult }; // Return the combined result
  } catch (error) {
    await client.query('ROLLBACK'); // Rollback the transaction in case of an error
    console.error('Error saving essay with evaluation:', error);
    throw error;
  } finally {
    client.release(); // Release the client back to the pool
  }
};

// Export the service functions
export {
  saveEssayToDatabase,
  getEssaysByUserId,
  getEssayById,
  saveEssayWithEvaluation,
  saveEvaluationResult,  // Export the new function
};
