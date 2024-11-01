
const Joi = require('joi');

const addressSchema = Joi.object({
  user: Joi.string().required().trim(), // Use string for ObjectId
  fullname: Joi.string().required().trim(),
  phone: Joi.string()
    .required()
    .trim()
    .pattern(/^[0-9]{10}$/) // Matches a 10-digit phone number
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits long'
    }),
  email: Joi.string()
    .required()
    .trim()
    .email() // Validates email format
    .messages({
      'string.email': 'Email must be a valid email address'
    }),
  addressLine: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  landmark: Joi.string().optional().trim(),
  pincode: Joi.string()
    .required()
    .pattern(/^[0-9]{6}$/) // Matches a 6-digit pincode
    .trim()
    .messages({
      'string.pattern.base': 'Pincode must be 6 digits long'
    }),
  addressType: Joi.string()
    .valid('Home', 'Work')
    .required(),
  isDefault: Joi.boolean().default(false),
});

// Export the validation schema
module.exports = addressSchema;
