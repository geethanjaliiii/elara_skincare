// productValidation.js
const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required.",
    "any.required": "Description is required.",
  }),
  ingredient: Joi.string().required().messages({
    "string.empty": "Ingredient is required.",
    "any.required": "Ingredient is required.",
  }),
  price: Joi.number().required().messages({
    "number.base": "Price must be a number.",
    "any.required": "Price is required.",
  }),
  discount: Joi.number().required().messages({
    "number.base": "Discount must be a number.",
    "any.required": "Discount is required.",
  }),
  skinType: Joi.string()
    .valid(
      "normal",
      "dry",
      "oily",
      "combination",
      "sensitive",
      "All skin types"
    )
    .required()
    .messages({
      "any.only":
        "Invalid skin type. Allowed values are normal, dry, oily, combination, sensitive.",
      "any.required": "Skin type is required.",
    }),
  sizes: Joi.array()
    .items(
      Joi.object({
        size: Joi.string().required().messages({
          "string.empty": "Size is required.",
        }),
        price: Joi.number().required().messages({
          "number.base": "Price must be a number.",
          "any.required": "Price is required.",
        }),
        stock: Joi.number().required().messages({
          "number.base": "Stock must be a number.",
          "any.required": "Stock is required.",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Sizes must be an array.",
      "any.required": "Sizes are required.",
    }),
  categoryId: Joi.string().required().messages({
    "string.empty": "Category ID is required.",
    "any.required": "Category ID is required.",
  }),
  updatedUrls: Joi.array().items(Joi.string().uri()).messages({
    "array.base": "Updated URLs must be an array.",
    "string.uri": "Each URL must be a valid URI."
  }),
  deletedImages: Joi.array().items(Joi.string().uri()).messages({
    "array.base": "Deleted URLs must be an array.",
    "string.uri": "Each URL must be a valid URI."
  })
});

module.exports = productSchema;
