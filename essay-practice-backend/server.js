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
import helmet from 'helmet'; // Optional but recommended for security

dotenv.config();
const app = express();

const requiredEnvVars = ['SESSION_SECRET', 'DATABASE_URL'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is not defined`);
    process.exit(1);
  }
});

// Allow only frontend domain(s) here
const allowedOrigins = [
  'http://localhost:3000', // Your frontend URL
  // Add any additional frontend domains if deployed (like Vercel, etc.)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Allows cookies to be sent along with the request
}));

// Add helmet for extra security
app.use(helmet());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Secure cookies only in production
    sameSite: 'lax', // Lax mode is fine for local development
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: '/',
  },
};

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Required for secure cookies in production
}

app.use(session(sessionConfig));

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    serverDetails: {
      environment: process.env.NODE_ENV,
      port: process.env.PORT,
      database: 'Connected',
      corsOrigins: allowedOrigins,
    }
  });
});

app.use('/api/questions', questionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/essays', essayRouter);
app.use('/api/results', resultRouter);

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server Details:
- Environment: ${process.env.NODE_ENV}
- Port: ${PORT}
- Database: Connected
- CORS Origins: ${allowedOrigins.join(', ')}
- Session Secure: ${sessionConfig.cookie.secure}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    pool.end(() => {
      process.exit(0);
    });
  });
});

export default app;
