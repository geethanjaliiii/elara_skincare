const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const Wallet = require("../../models/WalletModel");
const { v4: uuidv4 } = require("uuid");
const calculateRefundPrice = require("../../utils/services/calculateRefundAmount");
const { message } = require("../../utils/validation/addressValidation");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({createdAt:-1})
      .populate("userId")
      .populate("items.productId");
    if (!orders) {
      return res
        .status(404)
        .json({ success: false, message: "Orders not found" });
    }
    res.status(200).json({ success: true, message: "Orders fetched", orders });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
    console.log("failed to fetch orders in admin", error.message);
  }
};
const cancelOrder = async (req, res) => {
  //USE PATCH
  //GET ORDERID NOT NUMBER
  //GOOD FOR QUERY
  const { orderId, itemId } = req.params;
  console.log("item id", itemId);

  try {
    //1.check if order exist
    if (!orderId || !itemId) {
      return res.status(400).json({ success: false, error: "Invalid inputs" });
    }
    //2.check if item exist
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }
    const item = order.items.find((item) => item._id.equals(itemId));
    if (!item) {
      return res.status(404).json({ error: "Item not found in this order" });
    }
    if (item.status === "Cancelled") {
      return res.status(400).json({ error: "item already cancelled" });
    }
    // Update order and handle refund
    const updateOptions = {
      $set: { "items.$[elem].status": "Cancelled" },
      $push: {
        activityLog: {
          status: `Cancelled item: ${item.name}`,
          changedAt: new Date(),
        },
      },
    };

    // Non-COD payment handling
    let wallet, refundAmount;
    if (order.paymentMethod !== "Cash on Delivery" && item.paymentStatus=='Paid') {
      refundAmount = calculateRefundPrice(order, item);
      const transactionId =
      order.transactionId ||
      (returnItem.paymentMethod == "Cash on Delivery"
        ? `COD-${uuidv4()}`
        : null);
      // Prepare transaction
      const newTransaction = {
        transactionId: transactionId,
        type: "refund",
        amount: refundAmount,
        orderId: order._id,
        status: "success",
      };

      // Find or create wallet
      wallet = await Wallet.findOne({ userId: order.userId });
      if (!wallet) {
        wallet = new Wallet({
          userId: order.userId,
          transactionHistory: [newTransaction],
        });
        console.log("wallet created");
      } else {
        wallet.transactionHistory.push(newTransaction);
      }

      // Update order with refund status
      updateOptions.$set["items.$[elem].paymentStatus"] = "Refunded";
    }

    // Update order
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      updateOptions,
      { arrayFilters: [{ "elem._id": itemId }], new: true }
    );

    // Increase product stock
    await Product.findOneAndUpdate(
      { _id: item.productId },
      { $inc: { "sizes.$[elem].stock": item.quantity } },
      { arrayFilters: [{ "elem.size": item.size }] }
    );

    // Save wallet if exists
    if (wallet) {
      await wallet.save();
      console.log("wallet is updated");
    }
    console.log("order cancelled by admin");

    res.status(200).json({
      success: true,
      message: "Order cancelled",
      order: updatedOrder,
      refundAmount: refundAmount || null,
    });
  } catch (error) {
    console.error("order not cancelled", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error." });
  }
};

//to update order
const updateStatus = async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status } = req.body;

  try {
    if (!orderId || !itemId) {
      return res.status(400).json({ success: false, error: "Invalid inputs" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    const item = order.items.find((item) => item._id.equals(itemId));
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
   if(item.paymentStatus!=='Paid' && status=='Delivered'){
    return res.status(400).json({success:false,message:"Payment process is not completed"})
   }
    const updatedOrder =
      status == "Delivered"
        ? await Order.findOneAndUpdate(
            { _id: orderId },
            {
              $set: {
                "items.$[elem].status": status,
                "items.$[elem].deliveryDate": new Date(),
              },
            },
            { arrayFilters: [{ "elem._id": itemId }] },
            { new: true }
          )
        : await Order.findOneAndUpdate(
            { _id: orderId },
            { $set: { "items.$[elem].status": status } },
            { arrayFilters: [{ "elem._id": itemId }] },
            { new: true }
          );

    console.log("ipdatedorder", updatedOrder);

    if (!updatedOrder) {
      return res.status(500).json({ error: "Status updation failed." });
    }

    const updatedItem = await Order.findOne(
      { _id: orderId, "items._id": itemId },
      { "items.$": 1 } //it will project the first matching item in array
    );
    if (!updatedItem || !updatedItem.items || updatedItem.items.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Updated item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Status updated",
      item: updatedItem.items[0],
    });
  } catch (error) {
    console.log("Error updating status", error);
    res
      .status(500 || error.status)
      .json({ success: false, error: error.message || "Status update failed" });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await Order.find({
      "items.returnRequest.isRequested": true,
      "items.returnRequest.isApproved": false,
      "items.returnRequest.isResponseSend": false,
    }).populate("userId", "name email");
    res
      .status(200)
      .json({
        success: true,
        message: "Fetched pending requests",
        pendingRequests,
      });
  } catch (error) {
    console.error("failed to fetch pending requests");
    res
      .status(500)
      .json({ success: false, message: "failed to fetch pending requests" });
  }
};

const approveReturnRequest = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    if (!orderId || !itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input parameters" });
    }
    const order = await Order.findOne({ _id: orderId, "items._id": itemId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const returnItem = order.items.find((item) => item._id.equals(itemId));
    if (
      !returnItem.returnRequest.isRequested ||
      returnItem.returnRequest.isApproved ||
      returnItem.returnRequest.isResponseSend
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Item not eligible for return." });
    }
    if (
      new Date(returnItem.deliveryDate) <
      new Date(new Date().setDate(new Date().getDate() - 7))
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Return period has expired." });
    }
    if (
      returnItem.status != "Delivered" ||
      returnItem.paymentStatus != "Paid"
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Item not eligible for refund and return",
        });
    }

    //refunf details
    const refundAmount = calculateRefundPrice(order, returnItem);
    let wallet = await Wallet.findOne({ userId: order.userId });

    const transactionId =
      order.transactionId ||
      (returnItem.paymentMethod == "Cash on Delivery"
        ? `COD-${uuidv4()}`
        : null);
    const newTransaction = {
      transactionId: transactionId,
      type: "refund",
      amount: refundAmount,
      orderId: order._id,
      status: "success",
    };
    if (!wallet) {
      wallet = await Wallet.create({
        userId: order.userId,
        transactionHistory: [newTransaction],
      });
    } else {
      wallet.transactionHistory.push(newTransaction);
    }
    await wallet.save()
    returnItem.status = "Returned";
    returnItem.paymentStatus = "Refunded";
    returnItem.isApproved = true;
    returnItem.isResponseSend = true;
    order.paymentStatus = "Refunded";
    await order.save();
    res.status(200).json({ success: true, message: "Return approved." });
  } catch (error) {
    console.error("Error approving returnrequest");
    res
      .status(500)
      .json({ success: false, message: "Failed to approve request" });
  }
};

const declineReturnRequest = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    if (!orderId || !itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input parameters" });
    }
    const order = await Order.findOne({ _id: orderId, "items._id": itemId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const returnItem = order.items.find((item) => item._id.equals(itemId));
    if (
      !returnItem.isRequested ||
      returnItem.isApproved ||
      returnItem.isResponseSend
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid decline request" });
    }
    returnItem.isApproved=false;
    returnItem.isResponseSend = true;
    await order.save();
    res.status(200).json({ success: true, message: "Return Declined" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to decline request" });
  }
};
module.exports = {
  getOrders,
  cancelOrder,
  updateStatus,
  getPendingRequests,
  approveReturnRequest,
  declineReturnRequest,
};
