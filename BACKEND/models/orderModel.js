const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerName:{type:String,required:true},
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name:{type:String,required:true},
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, //price per qty
      offerDiscountPrice:{type: Number, required: true},
      couponDiscountPrice:{type: Number, required: true},
      totalMRP:{type:Number,required:true},
      discount: {
        type: Number,
        required: true,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"],
      },
      totalPrice: { type: Number, required: true, min: 0 },
      status: {
        type: String,
        enum: [
          "Pending",
          "Confirmed",
          "Shipped",
          "Delivered",
          "Cancelled",
          "Returned",
        ],
        default: "Pending",
      },
      deliveryDate:{type:Date},
      paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Unpaid", "Refunded", "Failed"],
        default: "Unpaid",
      },
      returnRequest: {
        isRequested: {
          type: Boolean,
          default: false,
        },
        reason: {
          type: String,
        },
        comment: {
          type: String,
        },
        isApproved: {
          type: Boolean,
          default: false,
        },
        isResponseSend: {
          type: Boolean,
          default: false,
        },
      },
    },
  ],
  totalMRP: { type: Number, required: true },
  totalDiscount: { type: Number, default: 0 },
  couponDiscount: { type: Number, default: 0 },
  couponCode: { type: String },
  shippingFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 }, //platform fee
  totalAmount: { type: Number, required: true, min: 0 },
  shippingAddress: {
    //creating a snapshot of shipping address
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
  },
  paymentMethod: {
    type: String,
    enum: [
      "Cash on Delivery",
      "Credit Card",
      "PayPal",
      "Wallet",
      "Razorpay",
      "UPI",
    ],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Unpaid", "Refunded", "Failed"],
    default: "Unpaid",
  },
  transactionId: { type: String },
  orderDate: { type: Date, default: Date.now },
 
  expectedDeliveryDate: { type: Date },
  createdAt:{type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  activityLog: [
    { status: { type: String }, changedAt: { type: Date, default: Date.now } },
  ],
});
module.exports = mongoose.model("Order", orderSchema);
