import axios from 'axios';

// Function to evaluate the essay using the Gemini API
const evaluateEssay = async (question, essay) => {
  try {
    const response = await axios.post(
      'https://geminiapi.com/evaluate',
      { question, essay },
      { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
    );

    return response.data; // The review and score are in this response
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    throw error;
  }
};

export { evaluateEssay };
