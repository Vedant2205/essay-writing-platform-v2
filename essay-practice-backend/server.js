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

// Validate essential environment variables
const requiredEnvVars = ['SESSION_SECRET', 'DATABASE_URL', 'GEMINI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is not defined in environment variables.`);
    process.exit(1);
  }
}

// Allowed Origins for CORS (frontend URLs)
const allowedOrigins = [
  'https://essay-writing-platform-v2.vercel.app',
  'https://essay-writing-platform-v2-git-main-vedant-dhauskars-projects.vercel.app',
  'https://essay-writing-platform-v2-vedant-dhauskars-projects.vercel.app',
  'http://localhost:3000', // Local development (React)
  'http://localhost:5173'  // Local development (Vite)
];

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Middleware configuration
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Security headers
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.render.com' : undefined
    },
    proxy: true,
  })
);

// API routes
app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/essays', essayRouter);
app.use('/api/results', resultRouter);

// Error handling middleware
app.use(errorHandler);

// Database connection with retry mechanism
const testDatabaseConnection = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await pool.query('SELECT NOW()');
      console.log('Database connected:', res.rows[0].now);
      return true;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
    }
  }
};

// Initialize server with enhanced logging
const initializeServer = async () => {
  try {
    await testDatabaseConnection();
    
    const PORT = process.env.PORT || 5000;
    const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    
    console.log(`Server Details:
- Environment: ${process.env.NODE_ENV}
- Port: ${PORT}
- Database: Connected
- CORS Origins: ${allowedOrigins.join(', ')}
- Session Secure: ${process.env.NODE_ENV === 'production'}
    `);

    const server = app.listen(PORT, () => {
      console.log(`Server running on ${baseUrl}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

// Graceful shutdown handling
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  try {
    await pool.end();
    console.log('Database pool has been closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown('UNCAUGHT_EXCEPTION');
});

// Start the server
initializeServer();
