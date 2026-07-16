const Joi = require('joi');

const createRewardSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    'string.min': 'Reward title must be at least 3 characters long',
    'any.required': 'Reward title is required'
  }),
  description: Joi.string().trim().max(1000).required().messages({
    'any.required': 'Reward description is required'
  }),
  pointsRequired: Joi.number().integer().positive().required().messages({
    'number.positive': 'Points required must be a positive integer',
    'any.required': 'Points required is required'
  }),
  stock: Joi.number().integer().min(0).default(1).messages({
    'number.min': 'Stock cannot be negative'
  })
});

const redeemRewardSchema = Joi.object({
  rewardId: Joi.string().uuid().required().messages({
    'string.guid': 'rewardId must be a valid UUID',
    'any.required': 'rewardId is required'
  }),
  quantity: Joi.number().integer().positive().default(1).messages({
    'number.positive': 'Quantity must be at least 1'
  })
});

module.exports = {
  createRewardSchema,
  redeemRewardSchema
};
