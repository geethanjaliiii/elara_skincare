

// import * as Yup from 'yup'

// export const validationSchema = Yup.object().shape({
//   code: Yup.string()
//   .trim()
//   .required('Coupon code is required')
//   .min(4, 'Coupon code must be at least 4 characters long')
//   .max(8,'Coupon code must be maximun 8 characters long')
//   .matches(/^[A-Z0-9]+$/, 'Coupon code must be uppercase and contain only letters and numbers')
//   ,
//   description: Yup.string()
//   .required('Description is required')
//   .min(10, 'Description must be at least 10 characters long'),
//   discountType: Yup.string()
//   .oneOf(['percentage', 'flat'], 'Invalid discount type')
//   .required('Discount type is required'),
//   discountValue: Yup.number()
//   .positive('Discount value must be positive')
//   .required('Discount value is required'),
//   discountPercentage: Yup.number()
//   .positive('Discount value must be positive')
//   .required('Discount percentage is required')
//   .min(1)
//   .max(100,'Percentage must be between 1 and 100'),
//   minPurchaseOrder: Yup.number().min(0, 'Minimum purchase order must be non-negative').required('Minimum purchase order is required'),
//   maxDiscountAmount:Yup.number().min(0,'Maximum discount amount must be non-negative'),
//   usageLimit: Yup.number().integer('Usage limit must be an integer').positive('Usage limit must be positive').required('Usage limit is required'),
//   maxUsagePerUser:Yup.number().min(1).integer('Maximum usage per user must be an integer').positive('Maximum usage per user must be positive').required('Maximum usage per user is required'),
//   expiryDate: Yup.date().min(new Date(), 'Expiry date must be in the future').required('Expiry date is required'),
// })

import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  code: Yup.string()
    .required('Coupon code is required')
    .trim(),

  description: Yup.string()
    .required('Description is required')
    .trim(),

  discountType: Yup.string()
    .required('Discount type is required')
    .oneOf(['percentage', 'flat'], 'Discount type must be either percentage or flat'),

  // For percentage discount
  discountPercentage: Yup.mixed()
    .when('discountType', {
      is: 'percentage',
      then: () => Yup.number()
        .required('Discount percentage is required')
        .min(1, 'Minimum discount percentage is 1%')
        .max(100, 'Maximum discount percentage is 100%'),
      otherwise: () => Yup.number().notRequired().nullable()
    }),

  // For flat discount
  discountValue: Yup.mixed()
    .when('discountType', {
      is: 'flat',
      then: () => Yup.number()
        .required('Discount value is required')
        .min(1, 'Minimum discount value is 1'),
      otherwise: () => Yup.number().notRequired().nullable()
    }),

  minPurchaseOrder: Yup.number()
    .min(0, 'Minimum purchase order cannot be negative')
    .default(0),

  maxDiscountAmount: Yup.mixed()
    .when('discountType', {
      is: 'percentage',
      then: () => Yup.number()
        .required('Maximum discount amount is required for percentage discount')
        .min(0, 'Maximum discount amount cannot be negative'),
      otherwise: () => Yup.number().notRequired().nullable()
    }),

  usageLimit: Yup.number()
    .required('Usage limit is required')
    .min(1, 'Usage limit must be at least 1')
    .integer('Usage limit must be a whole number'),

  maxUsagePerUser: Yup.number()
    .required('Maximum usage per user is required')
    .min(1, 'Maximum usage per user must be at least 1')
    .integer('Maximum usage per user must be a whole number')
    .default(1),

  expiryDate: Yup.date()
    .required('Expiry date is required')
    .min(new Date(), 'Expiry date must be in the future'),

  isActive: Yup.boolean()
    .default(true)
});

// Add custom test for maxDiscountAmount validation
validationSchema.test('maxDiscountAmount', 'Invalid maximum discount amount', function(value) {
  if (value.discountType === 'percentage' && value.maxDiscountAmount) {
    const minDiscount = (value.discountPercentage / 100) * value.minPurchaseOrder;
    if (value.maxDiscountAmount < minDiscount) {
      return this.createError({
        path: 'maxDiscountAmount',
        message: 'Maximum discount amount must be greater than or equal to the minimum possible discount'
      });
    }
  }
  return true;
});


