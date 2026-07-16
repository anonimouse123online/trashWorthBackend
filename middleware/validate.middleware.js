const { errorResponse } = require('../utils/apiResponse');

/**
 * Validation Middleware Creator
 * Validates request data against a Joi schema
 * @param {object} schema - Joi schema object
 * @param {string} source - Request source to validate ('body', 'query', 'params')
 */
const validateMiddleware = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];
    if (!dataToValidate) {
      return errorResponse(res, `Missing request data source: ${source}`, 400);
    }

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: {
          label: ''
        }
      }
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return errorResponse(res, 'Validation failed', 400, details);
    }

    // Replace the request source with the sanitized, validated value
    req[source] = value;
    next();
  };
};

module.exports = validateMiddleware;
