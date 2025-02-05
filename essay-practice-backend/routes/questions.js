import express from 'express';
import { fetchRandomQuestion } from '../controllers/questionController.js';

const router = express.Router();

// Route to fetch a random question based on examId
router.get('/:exam_id', fetchRandomQuestion);

export default router;
