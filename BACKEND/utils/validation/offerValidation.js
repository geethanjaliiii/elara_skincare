const Joi = require('joi');
const { Types } = require('mongoose');

const offerValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Offer name is required.',
      'any.required': 'Offer name is mandatory.',
    }),
  offerValue: Joi.number()
    .min(0)
    .max(80)
    .required()
    .messages({
      'number.base': 'Offer value must be a number.',
      'number.min': 'Offer value cannot be less than 0.',
      'number.max': 'Offer value cannot exceed 80.',
      'any.required': 'Offer value is mandatory.',
    }),

  targetId: Joi.string()
    .custom((value, helpers) => {
      if (!Types.ObjectId.isValid(value)) {
        return helpers.message('Target ID must be a valid ObjectId.');
      }
      return value;
    })
    .required()
    .messages({
      'any.required': 'Target ID is mandatory.',
    }),
  startDate: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'Start date must be a valid date.',
      'date.iso': 'Start date must be in ISO format.',
      'any.required': 'Start date is mandatory.',
    }),
  endDate: Joi.date()
    .iso()
    .greater(Joi.ref('startDate'))
    .required()
    .messages({
      'date.base': 'End date must be a valid date.',
      'date.iso': 'End date must be in ISO format.',
      'date.greater': 'End date must be after the start date.',
      'any.required': 'End date is mandatory.',
    }),
 
});

module.exports = offerValidationSchema;
