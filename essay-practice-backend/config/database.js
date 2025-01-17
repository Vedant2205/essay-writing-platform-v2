import pkg from 'pg'; // Import the entire pg module
const { Pool } = pkg; // Destructure the Pool from the imported module
import dotenv from 'dotenv';

dotenv.config();

// Determine if the app is running in production or development
const isProduction = process.env.NODE_ENV === 'production';

// Create a connection pool for PostgreSQL with SSL enabled for production
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432, // Default port for PostgreSQL
  ssl: isProduction ? { rejectUnauthorized: false } : false, // Enable SSL in production only
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
    return result.rows[0] || null; // Return the question or null if no question found
  } catch (error) {
    console.error('Error fetching question:', error.message);
    throw new Error('Unable to fetch question'); // Re-throw a user-friendly error message
  }
};

// Exporting the pool for reusability
export default pool;
