const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled",'Partially Cancelled'],
    default: "Pending",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      size: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, //price per qty
      image: { type: String, required: true },
      status: {
        type: String,
        enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
      },
      totalPrice: { type: Number, required: true },
    },
  ],
  totalMRP: { type: Number, required: true },
  totalDiscount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 }, //platform fee
  totalAmount: { type: Number, required: true },
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
    enum: ["Pending","Paid", "Unpaid", "Refunded","Failed"],
    default: "Unpaid",
  },
  transactionId: { type: String },
  orderDate: { type: Date, default: Date.now },
  expectedDeliveryDate: { type: Date },
  updatedAt: { type: Date, default: Date.now },
  activityLog: [
    { status: { type: String }, changedAt: { type: Date, default: Date.now } },
  ],
});
module.exports = mongoose.model("Order", orderSchema);
