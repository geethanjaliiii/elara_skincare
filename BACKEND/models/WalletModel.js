const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    balance: { type: Number, default: 0 },
    transactionHistory: [
      {
        transactionId: { type: String, unique: true, required: true },
        type: {
          type: String,
          enum: ["credit", "debit", "refund"],
          required: true,
        },
        amount: { type: Number, required: true },
        description: { type: String },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        status: {
          type: String,
          enum: ["success", "failed", "pending"],
          required: true,
        }, // Transaction status
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

walletSchema.pre("save", function(next){
  if(!this.transactionHistory){
    this.balance=0
    return next()
  }
  const successfullTransactions = this.transactionHistory.filter(
    (transaction) => transaction.status === "success"
  )

  this.balance = successfullTransactions?.length>0 ? successfullTransactions.reduce(
    (acc, curr) =>
      curr.type == "refund" || curr.type == "credit"
        ? acc + curr.amount
        : acc - curr.amount,
    0
  ):0

  next();
});
module.exports = mongoose.model("Wallet", walletSchema);
