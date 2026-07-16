const { errorResponse } = require('../utils/apiResponse');

/**
 * Global Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Unhandled Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Customize error message for specific types of errors
  if (err.name === 'ValidationError') {
    return errorResponse(res, message, 400, err.details);
  }

  if (err.name === 'UnauthorizedError') {
    return errorResponse(res, 'Invalid credentials or expired token', 401);
  }

  // Hide detailed stack trace in production environment
  const errorDetails = process.env.NODE_ENV === 'development' ? { stack: err.stack } : null;

  return errorResponse(res, message, status, errorDetails);
};

module.exports = errorMiddleware;
