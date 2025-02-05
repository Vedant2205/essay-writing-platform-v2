import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Determine if we're in a production environment (for SSL)
const isProduction = process.env.NODE_ENV === 'production';

// Create connection pool using DATABASE_URL for Render's PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use Render's DATABASE_URL
  ssl: isProduction ? { rejectUnauthorized: false } : false, // Enable SSL in production
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client can stay idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
});

// Test database connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

// Handle errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Function to fetch a random question based on Exam ID
export const getRandomQuestion = async (examId) => {
  const query = `
    SELECT 
      question_id,
      question_text,
      exam_id,
      created_at
    FROM questions
    WHERE exam_id = $1 
      AND question_text IS NOT NULL 
      AND question_text != ''
    ORDER BY RANDOM()
    LIMIT 1;
  `;

  try {
    const result = await pool.query(query, [examId]);
    if (!result.rows[0]) {
      throw new Error(`No questions found for exam ID: ${exam_Id}`);
    }
    return result.rows[0]; // Return the question if found
  } catch (error) {
    console.error('Error executing query:', error);
    console.error('Query parameters:', [exam_Id]);
    throw new Error(`Failed to fetch question: ${error.message}`);
  }
};

// Function to check database health
export const checkDatabaseHealth = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    return { status: 'healthy', timestamp: result.rows[0].now };
  } catch (error) {
    console.error('Database health check failed:', error);
    throw new Error('Database health check failed');
  }
};

// Graceful shutdown handler for the database pool
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Database pool has ended');
    process.exit(0);
  } catch (error) {
    console.error('Error during pool shutdown:', error);
    process.exit(1);
  }
});

export default pool;
