const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let errorMessage = 'Something went wrong!';

  // Handle validation errors (e.g., missing data in the request body)
  if (err.name === 'ValidationError') {
    errorMessage = 'Validation failed, please check your data.';
  } 
  // Handle database errors
  else if (err.name === 'DatabaseError' || err.code === 'ECONNREFUSED') {
    errorMessage = 'There was an issue with the database connection or query.';
  } 
  // Handle JSON syntax errors in the request
  else if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    errorMessage = 'Invalid JSON payload.';
  } 
  // Handle errors from the Gemini API
  else if (err.isAxiosError) {
    if (err.response) {
      // If the response has an error message from Gemini
      errorMessage = err.response.data.error.message || 'Error from Gemini API';
    } else if (err.request) {
      // No response received from Gemini
      errorMessage = 'No response received from Gemini API.';
    } else {
      // Any other error in the Gemini request
      errorMessage = 'Error while making API request to Gemini.';
    }
  }

  // Send a structured response with the appropriate error message and stack trace (if not in production)
  res.status(err.status || 500).json({
    message: errorMessage,
    error: process.env.NODE_ENV === 'production' ? {} : err.stack,
  });
};

// Use ES module export syntax
export default errorHandler;
