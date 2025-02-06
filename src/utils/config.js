// src/utils/config.js

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://essay-writing-platform-v2.onrender.com'; // Production URL
  }
  return 'http://localhost:5000'; // Development URL
};

export const API_URL = getBaseUrl(); // Ensure this line exports the API_URL correctly
