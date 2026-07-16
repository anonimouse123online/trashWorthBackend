const Joi = require('joi');

const createSubmissionSchema = Joi.object({
  householdId: Joi.string().uuid().required().messages({
    'string.guid': 'householdId must be a valid UUID',
    'any.required': 'householdId is required'
  }),
  category: Joi.string().valid('plastic', 'paper', 'metal', 'glass', 'organic', 'e-waste', 'other').required().messages({
    'any.only': 'Category must be one of: plastic, paper, metal, glass, organic, e-waste, other',
    'any.required': 'Category is required'
  }),
  weight: Joi.number().positive().required().messages({
    'number.positive': 'Weight must be greater than zero',
    'any.required': 'Weight is required'
  }),
  notes: Joi.string().trim().max(500).optional()
});

const updateSubmissionStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'verified', 'rejected').required().messages({
    'any.only': 'Status must be pending, verified, or rejected',
    'any.required': 'Status is required'
  }),
  rejectionReason: Joi.string().trim().max(250).when('status', {
    is: 'rejected',
    then: Joi.required(),
    otherwise: Joi.optional()
  }).messages({
    'any.required': 'Rejection reason is required when status is rejected'
  })
});

module.exports = {
  createSubmissionSchema,
  updateSubmissionStatusSchema
};
