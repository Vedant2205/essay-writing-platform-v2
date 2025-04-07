import db from '../config/database.js'; // adjust this path if needed

// Save a result to the database
export const saveEvaluationResult = async (req, res) => {
  const { user_id, exam_id, question_id, answer, score, feedback } = req.body;

  if (!user_id || !exam_id || !question_id || !answer || !score || !feedback) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const query = `
      INSERT INTO results (user_id, exam_id, question_id, answer, score, feedback)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [user_id, exam_id, question_id, answer, score, feedback];
    const result = await db.query(query, values);

    res.status(201).json({ message: 'Result saved successfully!', data: result.rows[0] });
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ error: 'Failed to save result.' });
  }
};

// Fetch result by essay ID and include the related question text
export const getResultByEssayId = async (req, res) => {
  const { essay_id } = req.params;

  try {
    const query = `
      SELECT 
        r.id AS result_id,
        r.essay_text,
        r.score,
        r.feedback,
        q.question_text
      FROM results r
      JOIN essays e ON r.essay_id = e.id
      JOIN questions q ON q.exam_id = e.exam_id
      WHERE r.essay_id = $1
    `;

    const values = [essay_id];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Result not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching result by essay ID:', error);
    res.status(500).json({ error: 'Failed to fetch result.' });
  }
};
