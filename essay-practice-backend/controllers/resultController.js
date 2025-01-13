import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getResult = async (req, res, next) => {
  const { essay_id } = req.params;

  try {
    const query = `
      SELECT score, feedback, word_count, character_count
      FROM results
      WHERE essay_id = $1
    `;
    const result = await pool.query(query, [essay_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Result not found for the provided essay ID.',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching result:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export { getResult };
