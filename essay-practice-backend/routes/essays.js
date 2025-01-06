import express from 'express';
import { saveEssayToDatabase, saveEvaluationResult } from '../services/essayService.js'; // Import the save essay and evaluation result functions
import evaluateEssay from '../services/GeminiEvaluation.js'; // Import evaluateEssay function correctly from GeminiEvaluation
import validator from 'validator'; // Import validator for text validation
import { OAuth2Client } from 'google-auth-library'; // Import Google OAuth2 Client

const essayRouter = express.Router();

// Initialize OAuth2 Client
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/oauth2callback';
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Function to count words in a string
const countWords = (text) => text.trim().split(/\s+/).length;

// OAuth Callback Route
essayRouter.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Authorization code is missing.',
    });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code); // Exchange code for tokens
    oauth2Client.setCredentials(tokens); // Set the tokens for future requests

    res.status(200).json({
      success: true,
      message: 'OAuth2 authentication successful',
      tokens,
    });
  } catch (error) {
    console.error('Error during OAuth2 callback:', error);
    res.status(500).json({
      success: false,
      message: 'OAuth2 authentication failed',
      error: error.message,
    });
  }
});

// Route for submitting essays and evaluating them
essayRouter.post('/submit', async (req, res) => {
  const { exam, essayText, userId } = req.body;

  console.log('Received data:', { exam, essayText, userId });

  // Validate the input
  if (!exam || !essayText || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Exam, essayText, and userId are required.',
    });
  }

  // Additional check to ensure essayText is not just spaces
  if (validator.isEmpty(essayText.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Essay text cannot be empty.',
    });
  }

  // Validate the number of words in the essay
  const wordCount = countWords(essayText);
  const minWords = 20; // Minimum word count
  const maxWords = 1000; // Maximum word count

  console.log('Word count:', wordCount);

  if (wordCount < minWords || wordCount > maxWords) {
    return res.status(400).json({
      success: false,
      message: `Essay must be between ${minWords} and ${maxWords} words. Current word count: ${wordCount}`,
    });
  }

  try {
    // Step 1: Save the essay to the database
    const essay = await saveEssayToDatabase(exam, essayText, userId);

    console.log('Essay saved:', essay);

    // Step 2: Evaluate the essay using the Gemini API
    const evaluationResult = await evaluateEssay(exam, essayText);

    console.log('Received evaluation result:', evaluationResult);

    // Step 3: Save the evaluation result in the results table
    const saveResult = await saveEvaluationResult(essay.id, evaluationResult);

    console.log('Evaluation result saved:', saveResult);

    // Step 4: Return the combined result (essay and evaluation)
    res.status(201).json({
      success: true,
      message: 'Essay submitted and evaluated successfully',
      data: {
        essay: essay,
        evaluation: saveResult,
      },
    });
  } catch (error) {
    console.error('Error processing essay submission and evaluation:', error);

    // Check if the error is related to the Gemini API
    if (error.message && error.message.includes('Gemini API')) {
      return res.status(500).json({
        success: false,
        message: 'Error processing essay with Gemini API',
        error: error.message,
      });
    }

    // General error handler
    res.status(500).json({
      success: false,
      message: 'Error processing essay submission and evaluation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
    });
  }
});

export default essayRouter;
