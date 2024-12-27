import axios from 'axios';

// Function to fetch a random question based on the selected exam
export const fetchRandomQuestion = async (examId) => {
  if (!examId) {
    throw new Error('Invalid input: examId is required.');
  }

  try {
    const response = await axios.get(`http://localhost:5000/api/questions/${examId}/random`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error.message);

    // Handle different types of errors
    if (error.response) {
      console.error('Server responded with status:', error.response.status);
      throw new Error(
        `Failed to fetch question. Server responded with: ${error.response.data.message || 'Unknown error'}.`
      );
    } else if (error.request) {
      console.error('No response from server:', error.request);
      throw new Error('Failed to fetch question. No response received from the server.');
    } else {
      throw new Error(`Failed to fetch question. Error: ${error.message}`);
    }
  }
};

// You can add more functions if needed, such as fetching all questions, adding a new question, etc.
