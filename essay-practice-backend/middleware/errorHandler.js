const errorHandler = (err, req, res, next) => {
  // Log full error details for debugging
  console.error('Error Message:', err.message || 'No error message provided');
  console.error('Error Stack:', err.stack || 'No stack trace available');

  let errorMessage = 'Something went wrong!';
  let statusCode = err.status || 500;

  // Handle database connection error outside the switch block
  if (err.code === 'ECONNREFUSED') {
    errorMessage = 'Database connection error.';
    statusCode = 503;
  }

  // Handle different error types
  switch (err.name) {
    case 'ValidationError':
      const details = err.errors ? Object.values(err.errors).map(e => e.message) : [];
      errorMessage = `Validation failed: ${details.join(', ') || 'Invalid data provided.'}`;
      statusCode = 400;
      break;

    case 'DatabaseError':
      errorMessage = 'Database query error.';
      statusCode = 503;
      break;

    case 'EssaySaveError':
      errorMessage = 'Error saving the essay.';
      statusCode = 500;
      break;

    case 'EssayEvaluateError':
      errorMessage = 'Error evaluating the essay with Gemini API.';
      statusCode = 500;
      break;

    case 'SyntaxError':
      if (err.message?.includes('JSON')) {
        errorMessage = 'Invalid JSON payload.';
        statusCode = 400;
      }
      break;

    case 'AuthenticationError':
      errorMessage = 'Authentication failed.';
      statusCode = 401;
      break;

    case 'AuthorizationError':
      errorMessage = 'You do not have permission to perform this action.';
      statusCode = 403;
      break;

    default:
      break;
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    details: err.details || undefined,
  });
};

export default errorHandler;
