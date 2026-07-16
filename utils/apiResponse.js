/**
 * Helper to construct standard API success response
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {any} data - Content returned by the endpoint
 * @param {number} statusCode - HTTP status code (default 200)
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Helper to construct standard API error response
 * @param {object} res - Express response object
 * @param {string} message - Error description message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {any} errors - Detailed errors/validation failure info
 */
const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  
  if (errors !== null) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};
