const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("userId");
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
    //3.check if item is already cancelled or delivered or out for delivery
    if (item.status === "Cancelled") {
      console.log("item ", item);

      return res.status(400).json({ error: "Item is already cancelled." });
    } else if (
      item.status === "Delivered" ||
      order.paymentStatus === "Refunded"
    ) {
      return res
        .status(400)
        .json({ error: "Item not eligible for cancelling." });
    }
    //4.cancel with mongo query
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: { "items.$[elem].status": "Cancelled" },
        $push: {
          activityLog: {
            status: `Cancelled item: ${item.name}`,
            changedAt: new Date(),
          },
        },
      },
      { arrayFilters: [{ "elem._id": itemId }] },
      { new: true }
    );
    //5.check if moduified
    if (!updatedOrder) {
      return res.status(500).json({ error: "Failed to cancel order" });
    }
    //6.restock
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stock: item.quantity } }
    );
    //check if all items are cancelled,update order status
    // const updatedOrder=await Order.findById(orderId)

    const allProductsCancelled = updatedOrder.items.every(
      (item) => item.status === "Cancelled"
    );
    if (allProductsCancelled) {
      updatedOrder.status = "Cancelled";
    } else {
      updatedOrder.status = "Partially Cancelled";
    }
    await updatedOrder.save();
    res.status(200).json({ message: "Order cancelled" });
  } catch (error) {
    console.log("order not cancelled");
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
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: { "items.$[elem].status": status } },
      { arrayFilters: [{ "elem._id": itemId }] },
      { new: true }
    );
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

    res
      .status(200)
      .json({
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
module.exports = { getOrders, cancelOrder, updateStatus };
