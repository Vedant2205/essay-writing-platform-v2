import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import pool from './config/database.js';
import questionsRouter from './routes/questions.js';
import essayRouter from './routes/essays.js';
import authRouter from './routes/auth.js';
import resultRouter from './routes/results.js';
import errorHandler from './middleware/errorHandler.js';
import helmet from 'helmet'; // Security best practice
import 'dotenv/config';
console.log("Loaded API Key:", process.env.GEMINI_API_KEY);


dotenv.config();
const app = express();

// Ensure required environment variables are set
const requiredEnvVars = ['SESSION_SECRET', 'DATABASE_URL'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is not defined`);
    process.exit(1);
  }
});

// Allowed frontend domains
const allowedOrigins = [
  'http://localhost:3000', // Frontend (React)
  'http://localhost:5000', // API (Backend)
  // Add your deployed frontend domain here if needed
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Set security headers
app.use(helmet());

// 🔥 **Fix: Add COOP & COEP Headers** 🔥
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Optional for resources
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin'); // Improves security
  next();
});

// Parse incoming JSON data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Secure cookies only in production
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: '/',
  },
};

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(session(sessionConfig));

// Default API response
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

// API routes
app.use('/api/questions', questionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/essays', essayRouter);
app.use('/api/results', resultRouter);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running:
- Environment: ${process.env.NODE_ENV}
- Port: ${PORT}
- Database: Connected
- CORS Origins: ${allowedOrigins.join(', ')}
- Session Secure: ${sessionConfig.cookie.secure}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    pool.end(() => {
      process.exit(0);
    });
  });
});

export default app;
