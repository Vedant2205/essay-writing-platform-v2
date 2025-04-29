import db from '../config/database.js';

// Save a result to the database
export const saveEvaluationResult = async (req, res) => {
  const { user_id, exam_id, essay_id, score, feedback, word_count, character_count } = req.body;

  if (!user_id || !exam_id || !essay_id || !score || !feedback || !word_count || !character_count) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const query = `
      INSERT INTO results (user_id, essay_id, score, feedback, word_count, character_count)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [user_id, essay_id, score, feedback, word_count, character_count];
    const result = await db.query(query, values);

    res.status(201).json({ message: 'Result saved successfully!', data: result.rows[0] });
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ error: 'Failed to save result.' });
  }
};

// Fetch result by essay ID and include essay text and question
export const getResultByEssayId = async (req, res) => {
  const { essay_id } = req.params;

  try {
    const query = `
      SELECT 
        r.id AS result_id,
        e.essay_text,
        r.score,
        r.feedback,
        r.word_count,
        r.character_count,
        q.question_text
      FROM results r
      JOIN essays e ON r.essay_id = e.id
      JOIN questions q ON q.id = e.exam_id
      WHERE r.essay_id = $1;
    `;
    const values = [essay_id];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Result not found for this essay.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching result by essay ID:', error);
    res.status(500).json({ error: 'Failed to fetch result.' });
  }
};

// Fetch result by result ID
export const getResultById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT 
        r.id AS result_id,
        e.essay_text,
        r.score,
        r.feedback,
        r.word_count,
        r.character_count,
        q.question_text
      FROM results r
      JOIN essays e ON r.essay_id = e.id
      JOIN questions q ON q.id = e.exam_id
      WHERE r.id = $1;
    `;
    const values = [id];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Result not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching result by ID:', error);
    res.status(500).json({ error: 'Failed to fetch result.' });
  }
};
