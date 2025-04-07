import express from 'express';
import { saveEvaluationResult } from '../controllers/resultsController.js';

const router = express.Router();

router.post('/save', saveEvaluationResult);

export default router;
