import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Define the API Key and URL from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;

// Function to evaluate an essay with Gemini API
const evaluateEssayWithGemini = async (exam, essayText) => {
  try {
    // Ensure the API URL is available
    if (!GEMINI_API_URL || !GEMINI_API_KEY) {
      throw new Error('Gemini API URL or API Key is missing');
    }

    // Send POST request to Gemini API
    const response = await axios.post(
      GEMINI_API_URL,
      { exam, essayText },
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000, // Set timeout to 5 seconds
      }
    );

    // Ensure the response contains the expected structure
    if (!response.data || !response.data.evaluation) {
      throw new Error('Invalid response from Gemini API');
    }

    // Return the evaluation data
    return response.data.evaluation;
  } catch (error) {
    console.error('Gemini API error:', error); // Log the full error for debugging
    throw new Error('Failed to evaluate the essay with Gemini API: ' + error.message);
  }
};

export default {
  evaluateEssayWithGemini,
};
