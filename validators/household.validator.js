const Joi = require('joi');

const createHouseholdSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    'string.min': 'Household name must be at least 3 characters long',
    'any.required': 'Household name is required'
  }),
  address: Joi.string().trim().min(5).required().messages({
    'string.min': 'Address must be at least 5 characters long',
    'any.required': 'Address is required'
  }),
  memberCount: Joi.number().integer().min(1).default(1).messages({
    'number.min': 'Household must have at least 1 member'
  }),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional()
});

const updateHouseholdSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).optional(),
  address: Joi.string().trim().min(5).optional(),
  memberCount: Joi.number().integer().min(1).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

module.exports = {
  createHouseholdSchema,
  updateHouseholdSchema
};
