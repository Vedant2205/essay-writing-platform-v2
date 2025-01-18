import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import { createClient } from 'redis';
import connectRedis from 'connect-redis';
import pool from './config/database.js';
import questionsRouter from './routes/questions.js';
import essayRouter from './routes/essays.js';
import authRouter from './routes/auth.js';
import resultRouter from './routes/result.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const RedisStore = connectRedis(session);
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
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
    await redisClient.quit();
    await pool.end();
    console.log('Resources have been cleaned up');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error.message);
    process.exit(1);
  }
});
