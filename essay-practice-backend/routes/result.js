import express from 'express';
import { fetchRandomQuestion } from '../controllers/questionController.js';

const router = express.Router();

// Route to fetch a random question based on numeric examId
router.get('/:examId', fetchRandomQuestion);

export default router;
