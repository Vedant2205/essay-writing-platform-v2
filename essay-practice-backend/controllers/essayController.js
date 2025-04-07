import { evaluateEssayWithGemini } from '../routes/1/services/essayService.js';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Save essay and create evaluation
const saveEssay = async (req, res, next) => {
  try {
    const { exam_id, essay_text, user_id } = req.body;

    if (!exam_id || !essay_text || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'exam_id, essay_text, and user_id are required',
      });
    }

    const wordCount = essay_text.trim().split(/\s+/).length;
    if (wordCount < 20 || wordCount > 1000) {
      return res.status(400).json({
        success: false,
        message: `Essay must be between 20 and 1000 words. Current word count: ${wordCount}`,
      });
    }

    console.log('Saving essay to essays table...');
    const insertEssayQuery = `
      INSERT INTO essays (exam_id, essay_text, user_id, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id;
    `;
    const essayResult = await pool.query(insertEssayQuery, [exam_id, essay_text, user_id]);
    const essayId = essayResult.rows[0].id;

    console.log('Fetching question text from questions table...');
    const questionQuery = `
      SELECT question_text FROM questions WHERE exam_id = $1;
    `;
    const questionResult = await pool.query(questionQuery, [exam_id]);

    let questionText = '';
    if (questionResult.rows.length > 0) {
      questionText = questionResult.rows[0].question_text;
    }

    console.log('Evaluating essay with Gemini...');
    const evaluation = await evaluateEssayWithGemini(exam_id, essay_text);

    if (!validateEvaluationResponse(evaluation)) {
      return res.status(500).json({
        success: false,
        message: 'Invalid evaluation response from Gemini API.',
      });
    }

    console.log('Saving evaluation result in results table...');
    const insertResultQuery = `
      INSERT INTO results (user_id, essay_id, essay_text, score, feedback, word_count, character_count, question_text, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *;
    `;
    const result = await pool.query(insertResultQuery, [
      user_id,
      essayId,
      essay_text,
      evaluation.score,
      evaluation.feedback,
      evaluation.word_count,
      evaluation.character_count,
      questionText,
    ]);

    res.status(201).json({
      success: true,
      data: {
        essay_id: essayId,
        evaluation: result.rows[0],
      },
      message: 'Essay and evaluation saved successfully.',
    });
  } catch (error) {
    console.error('Error saving essay:', error.message);
    next(error);
  }
};

// Re-evaluate essay only (no essay table insert)
const evaluateEssay = async (req, res, next) => {
  try {
    const { exam_id, essay_text, user_id } = req.body;

    if (!exam_id || !essay_text || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'exam_id, essay_text, and user_id are required',
      });
    }

    const wordCount = essay_text.trim().split(/\s+/).length;
    if (wordCount < 20 || wordCount > 1000) {
      return res.status(400).json({
        success: false,
        message: `Essay must be between 20 and 1000 words. Current word count: ${wordCount}`,
      });
    }

    const checkQuery = `
      SELECT score, feedback, word_count, character_count
      FROM results
      WHERE user_id = $1 AND essay_text = $2;
    `;
    const checkResult = await pool.query(checkQuery, [user_id, essay_text]);

    if (checkResult.rows.length > 0) {
      return res.status(200).json({
        success: true,
        data: checkResult.rows[0],
        message: 'Returning cached evaluation.',
      });
    }

    console.log('Evaluating essay with Gemini API...');
    const evaluation = await evaluateEssayWithGemini(exam_id, essay_text);

    if (!validateEvaluationResponse(evaluation)) {
      return res.status(500).json({
        success: false,
        message: 'Invalid evaluation response from Gemini API.',
      });
    }

    res.status(200).json({
      success: true,
      data: evaluation,
      message: 'Essay evaluated successfully (not saved).',
    });
  } catch (error) {
    console.error('Error evaluating essay:', error.message);
    next(error);
  }
};

const validateEvaluationResponse = (response) => {
  return (
    typeof response.score === 'number' &&
    typeof response.word_count === 'number' &&
    typeof response.character_count === 'number' &&
    typeof response.feedback === 'string'
  );
};

export {
  saveEssay,
  evaluateEssay,
};
