const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  fullName: Joi.string().trim().min(3).max(100).required().messages({
    'string.min': 'Full name must be at least 3 characters long',
    'any.required': 'Full name is required'
  }),
  phoneNumber: Joi.string().trim().pattern(/^[0-9+\-\s()]{7,15}$/).optional().messages({
    'string.pattern.base': 'Please enter a valid phone number'
  }),
  role: Joi.string().valid('household', 'collector', 'admin').default('household').messages({
    'any.only': 'Invalid role. Choose from: household, collector, admin'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

module.exports = {
  registerSchema,
  loginSchema
};
