const Joi = require('joi');

// Validation schema for adding or editing a category
const categoryValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Category name should be a text.',
      'string.empty': 'Category name is required.',
      'string.min': 'Category name should have at least 3 characters.',
      'string.max': 'Category name should have at most 50 characters.',
    }),

  description: Joi.string()
    .trim()
    .min(10)
    .max(200)
    .required()
    .messages({
      'string.base': 'Description should be a text.',
      'string.empty': 'Description is required.',
      'string.min': 'Description should have at least 10 characters.',
      'string.max': 'Description should have at most 200 characters.',
    }),
});

// // Function to validate category data
// const validateCategory = (categoryData) => {
//   const validationResult= categoryValidationSchema.validate(categoryData, { abortEarly: false });
//   console.log("Validation Result:", validationResult);
//   return validationResult
// };

module.exports = categoryValidationSchema;
