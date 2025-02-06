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
import helmet from 'helmet'; // Security middleware (optional)

dotenv.config();
const app = express();

const requiredEnvVars = ['SESSION_SECRET', 'DATABASE_URL'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} is not defined`);
    process.exit(1);
  }
});

const allowedOrigins = [
  'https://essay-writing-platform-v2.onrender.com',
  'https://essay-writing-platform-v2.vercel.app',
  'https://essay-writing-platform-v2-git-main-vedant-dhauskars-projects.vercel.app',
  'https://essay-writing-platform-v2-vedant-dhauskars-projects.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Add helmet for extra security
app.use(helmet());

// Add COOP and COEP headers for cross-origin security
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
  },
  proxy: true
};

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
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
      corsOrigins: allowedOrigins
    }
  });
});

// Route mappings (Ensure these match frontend calls)
app.use('/api/questions', questionsRouter);
app.use('/api/auth', authRouter);
app.use('/api/essays', essayRouter);
app.use('/api/results', resultRouter);

// Health check route
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

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server Details:
- Environment: ${process.env.NODE_ENV}
- Port: ${PORT}
- Database: Connected
- CORS Origins: ${allowedOrigins.join(', ')}
- Session Secure: ${sessionConfig.cookie.secure}
`);
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
