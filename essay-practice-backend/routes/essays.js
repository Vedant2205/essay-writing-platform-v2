// /routes/essays.js
import express from 'express';
import { saveEssayWithEvaluation } from '../services/essayService.js'; // Function to save essay and evaluation
import { OAuth2Client } from 'google-auth-library'; // Google OAuth2 Client
import validator from 'validator'; // Validator for text validation

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
  const { exam_id, essayText, userId } = req.body; // Use exam_id here

  console.log('Received data:', { exam_id, essayText, userId });

  // Validate the input
  if (!exam_id || !essayText || !userId) {
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
    // Step 1: Save the essay and evaluate it using the updated function
    const essayWithEvaluation = await saveEssayWithEvaluation(exam_id, essayText, userId); // Pass exam_id here

    console.log('Essay and evaluation result saved:', essayWithEvaluation);

    // Step 2: Return the combined result (essay and evaluation)
    res.status(201).json({
      success: true,
      message: 'Essay submitted and evaluated successfully',
      data: {
        essay: essayWithEvaluation,
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
