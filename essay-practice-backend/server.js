import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import pool from './config/database.js';
import questionsRouter from './routes/questions.js';
import essayRouter from './routes/essays.js';
import authRouter from './routes/auth.js';
import resultRouter from './routes/result.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/essays', essayRouter);
app.use('/api/results', resultRouter);
app.use(errorHandler);

const testDatabaseConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected:', res.rows[0].now);
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
};

testDatabaseConnection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Database pool has been closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database pool:', error.message);
    process.exit(1);
  }
});
