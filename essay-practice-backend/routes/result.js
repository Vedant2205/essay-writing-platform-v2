import express from 'express';
import { getResult } from '../controllers/resultController.js';

const router = express.Router();

// Route to get the result of a specific essay by essay_id
router.get('/:essay_id', getResult);

export default router;
