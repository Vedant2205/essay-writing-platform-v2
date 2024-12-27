import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool for PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to fetch a random question based on Exam ID
export const getRandomQuestion = async (examId) => {
  const query = `
    SELECT question_text
    FROM questions
    WHERE exam_id = $1
    ORDER BY RANDOM()
    LIMIT 1;
  `;

  try {
    const result = await pool.query(query, [examId]);
    return result.rows[0] || null; // Return the question object or null if no question
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
};

export default pool;
