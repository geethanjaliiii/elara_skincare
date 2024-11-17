// const Joi = require('joi');

// const couponValidationSchema = Joi.object({
//   code: Joi.string()
//     .trim()
//     .required()
//     .messages({
//       'string.empty': 'Coupon code is required',
//       'any.required': 'Coupon code is required',
//     }),

//   description: Joi.string()
//   .trim()
//     .required()
//     .messages({
//       'string.empty': 'Description is required',
//       'any.required': 'Description is required',
//     }),

//   discountType: Joi.string()
//     .valid('percentage', 'flat')
//     .required()
//     .messages({
//       'any.only': 'Discount type must be either "percentage" or "flat"',
//       'any.required': 'Discount type is required',
//     }),
//     discountPercentage:Joi.number()
//     .min(1)
//     .messages({
//       'number.positive': 'Discount value must be a positive number',
//       'any.required': 'Discount value is required',
//     }),

//   discountValue: Joi.number()
//     .positive()
//     .min(1)
//     .messages({
//       'number.positive': 'Discount value must be a positive number',
//       'any.required': 'Discount value is required',
//     }),

//   minPurchaseOrder: Joi.number()
//     .min(0)
//     .default(0)
//     .messages({
//       'number.min': 'Minimum purchase order must be a non-negative number',
//     }),

//   maxDiscountAmount: Joi.number()
//     .min(0)
//     .default(0)
//     .when('discountType', {
//       is: 'percentage',
//       then: Joi.required().messages({
//         'any.required': 'Max discount amount is required for percentage discount type',
//       }),
//     })
//     .messages({
//       'number.min': 'Maximum discount amount must be a non-negative number',
//     }),

//   validFrom: Joi.date()
//     .default(Date.now)
//     .messages({
//       'date.base': 'Valid from must be a valid date',
//     }),

//   expiryDate: Joi.date()
//     .greater('now')
//     .required()
//     .messages({
//       'date.greater': 'Expiry date must be in the future',
//       'any.required': 'Expiry date is required',
//     }),

//   usageLimit: Joi.number()
//     .integer()
//     .positive()
//     .default(1)
//     .messages({
//       'number.base': 'Usage limit must be a number',
//       'number.positive': 'Usage limit must be a positive number',
//     }),

//   isActive: Joi.boolean().default(true),

//   usersApplied: Joi.array()
//     .items(
//       Joi.object({
//         userId: Joi.string()
//           .regex(/^[0-9a-fA-F]{24}$/)
//           .message('Invalid user ID'),
//         appliedCount:Joi.number(),
//         appliedOn: Joi.date(),
//       })
//     )
//     .messages({
//       'array.base': 'Users applied must be an array of objects',
//     }),
// });

// module.exports = couponValidationSchema;

const Joi = require('joi');

const couponValidationSchema = Joi.object({
  code: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Coupon code is required',
      'any.required': 'Coupon code is required',
    }),

  description: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Description is required',
      'any.required': 'Description is required',
    }),

  discountType: Joi.string()
    .valid('percentage', 'flat')
    .required()
    .messages({
      'any.only': 'Discount type must be either "percentage" or "flat"',
      'any.required': 'Discount type is required',
    }),

  // Conditional validation for discount percentage
  discountPercentage: Joi.number()
    .when('discountType', {
      is: 'percentage',
      then: Joi.number()
        .min(1)
        .max(100)
        .required()
        .messages({
          'number.base': 'Discount percentage must be a number',
          'number.min': 'Discount percentage must be at least 1%',
          'number.max': 'Discount percentage cannot exceed 100%',
          'any.required': 'Discount percentage is required for percentage discount type',
        }),
      otherwise: Joi.forbidden(),
    }),

  // Conditional validation for flat discount value
  discountValue: Joi.number()
    .when('discountType', {
      is: 'flat',
      then: Joi.number()
        .positive()
        .required()
        .messages({
          'number.base': 'Discount value must be a number',
          'number.positive': 'Discount value must be a positive number',
          'any.required': 'Discount value is required for flat discount type',
        }),
      otherwise: Joi.forbidden(),
    }),

  minPurchaseOrder: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Minimum purchase order must be a number',
      'number.min': 'Minimum purchase order must be a non-negative number',
    }),

  // Conditional validation for maximum discount amount (only for percentage type)
  maxDiscountAmount: Joi.number()
    .min(0)
    .when('discountType', {
      is: 'percentage',
      then: Joi.required().messages({
        'any.required': 'Maximum discount amount is required for percentage discount type',
      }),
      otherwise: Joi.forbidden(),
    })
    .messages({
      'number.base': 'Maximum discount amount must be a number',
      'number.min': 'Maximum discount amount must be a non-negative number',
    }),

  validFrom: Joi.date()
    .default(Date.now)
    .messages({
      'date.base': 'Valid from must be a valid date',
    }),

  expiryDate: Joi.date()
    .greater('now')
    .required()
    .messages({
      'date.base': 'Expiry date must be a valid date',
      'date.greater': 'Expiry date must be in the future',
      'any.required': 'Expiry date is required',
    }),

  usageLimit: Joi.number()
    .integer()
    .positive()
    .default(1)
    .messages({
      'number.base': 'Usage limit must be a number',
      'number.integer': 'Usage limit must be an integer',
      'number.positive': 'Usage limit must be a positive number',
    }),

  maxUsagePerUser: Joi.number()
    .integer()
    .positive()
    .default(1)
    .messages({
      'number.base': 'Max usage per user must be a number',
      'number.integer': 'Max usage per user must be an integer',
      'number.positive': 'Max usage per user must be a positive number',
    }),

  isActive: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'isActive must be a boolean',
    }),

  usersApplied: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            'string.pattern.base': 'Invalid user ID format',
            'any.required': 'User ID is required',
          }),
        appliedCount: Joi.number()
          .integer()
          .positive()
          .default(0)
          .messages({
            'number.base': 'Applied count must be a number',
            'number.integer': 'Applied count must be an integer',
            'number.positive': 'Applied count must be a positive number',
          }),
        appliedOn: Joi.date()
          .default(Date.now)
          .messages({
            'date.base': 'Applied date must be a valid date',
          }),
      })
    )
    .messages({
      'array.base': 'Users applied must be an array of objects',
    }),
});

module.exports = couponValidationSchema;
