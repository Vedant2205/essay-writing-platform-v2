import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import questionsRoutes from './routes/questions.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/exam', questionsRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${5000}`);
});
