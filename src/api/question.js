import axios from 'axios';

// Centralized API URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Function to fetch a random question based on the selected exam
export const fetchRandomQuestion = async (examId) => {
  if (!examId) {
    throw new Error('Invalid input: examId is required.');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/questions/${examId}/random`);
    return response.data; // Return the question data
  } catch (error) {
    console.error('Error fetching question:', error.message);

    // Handle different types of errors
    if (error.response) {
      // Server responded with an error status (e.g., 404, 500)
      console.error('Server responded with status:', error.response.status);
      throw new Error(
        `Failed to fetch question. Server responded with: ${error.response.data.message || 'Unknown error'}.`
      );
    } else if (error.request) {
      // No response from the server
      console.error('No response from server:', error.request);
      throw new Error('Failed to fetch question. No response received from the server.');
    } else {
      // Any other error (e.g., request setup issues)
      throw new Error(`Failed to fetch question. Error: ${error.message}`);
    }
  }
};
