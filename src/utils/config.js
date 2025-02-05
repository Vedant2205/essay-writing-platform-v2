src/utils/config.js

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://essay-writing-platform-v2.onrender.com';
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getBaseUrl();