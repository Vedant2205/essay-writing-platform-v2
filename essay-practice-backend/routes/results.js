import { Router } from 'express';
import { saveEvaluationResult, getResultByEssayId, getResultById } from '../controllers/resultsController.js';

const router = Router();

// Save result
router.post('/results', saveEvaluationResult);

// Fetch result by essay ID
router.get('/results/essay/:essay_id', getResultByEssayId);

// Fetch result by result ID
router.get('/results/:id', getResultById);

export default router;
