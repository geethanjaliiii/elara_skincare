const mongoose = require("mongoose");
const { type } = require("../utils/validation/couponValidation");

const userCouponSchema = new mongoose.Schema(
  {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    appliedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create composite index for faster lookups
userCouponSchema.index({ userId: 1, couponId: 1 });
//main coupon schema
const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 500,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },
    discountValue: {
      type: Number,
      min: 1,
      validate: {
        validator: function (value) {
          return this.discountType === "flat" ? value >= 1 : true;
          //for percentage type
        },
        message: "Discount value must be at least 1 for flat discount type",
      },
    },
    discountPercentage: {
      type: Number,
      min: 1,
      max: 100,
      validate: {
        validator: function (value) {
          return this.discountType === "percentage"
            ? value >= 1 && value <= 100
            : true; //for percentage type
        },
        message:
          "Discount percentage is required for percentage discount type and must be between 1 and 100",
      },
    },
    minPurchaseOrder: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          if (this.discountType == "percentage") {
            return value != undefined && value >= 0;
          }
          return true;
        },
      },
      //for percentage-based discount
    },
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    validFrom: {
      type: Date,
      default: Date.now(),
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      required: true,
      min: 1,
    },

    maxUsagePerUser: {
      type: Number,
      default: 1,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalAppliedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    customerType: {
      type: String,
      enum: ["all", "new", "existing"],
      default: "all",
    },
  },
  {
    timestamps: true,
    indexes: [{ code: 1 }, { isActive: 1 }, { expiryDate: 1 }],
  }
);

//pre-save middleware
couponSchema.pre("save", function (next) {
  if (this.discountType == "percentage" && this.discountValue) {
    return (
      (this.discountValue = undefined)(
        (this.maxDiscountAmount = this.discountPercentage / 100)
      ) * this.minPurchaseOrder
    );
  }
  if (this.discountType == "flat" && this.discountPercentage) {
    return (
      (this.discountPercentage = undefined),
      (this.maxDiscountAmount = undefined)
    );
  }
  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);
const UserCoupon = mongoose.model("userCoupon", userCouponSchema);
module.exports = {
  Coupon,
  UserCoupon,
};
