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

// Updated CORS configuration with all required Vercel URLs
app.use(cors({
  origin: [
    'https://essay-writing-platform-v2.vercel.app', // production frontend URL
    'https://essay-writing-platform-v2-git-main-vedant-dhauskars-projects.vercel.app', // staging URL or preview deployments
    'https://essay-writing-platform-v2-vedant-dhauskars-projects.vercel.app', // another staging or preview deployment URL
    'http://localhost:3000'  // for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
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
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for production to allow cross-site cookies
    },
  })
);

app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/essays', essayRouter);
app.use('/api/results', resultRouter);
app.use(errorHandler);

// Database connection check
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

// Close database connection on shutdown
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
