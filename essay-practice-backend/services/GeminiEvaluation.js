import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Function to evaluate an essay using the Gemini API with an API Key
const evaluateEssay = async (examId, essayText) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error('Gemini API URL or API Key is missing');
    }

    console.log('Sending request to Gemini API with API Key');

    const response = await axios.post(
      apiUrl,
      { examId, essayText },
      {
        headers: {
          'x-api-key': apiKey, // Use API key for authentication
          'Content-Type': 'application/json',
        },
        timeout: 30000, // Optional: Set timeout for the request
      }
    );

    console.log('Gemini API Response:', response.data);

    const { score, feedback, word_count, character_count } = response.data;

    if (typeof score === 'undefined' || typeof feedback === 'undefined') {
      throw new Error('Invalid response from Gemini API');
    }

    return { score, feedback, word_count, character_count };
  } catch (error) {
    console.error('Error in Gemini API evaluation:', error.message);

    if (error.response) {
      console.error('Gemini API Error Response:', error.response.data);
      throw new Error(error.response.data?.error?.message || 'Gemini API error');
    }

    if (error.request) {
      console.error('No response received from Gemini API');
      throw new Error('No response from Gemini API');
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('Gemini API request timeout');
    }

    throw error;
  }
};

export default evaluateEssay;
