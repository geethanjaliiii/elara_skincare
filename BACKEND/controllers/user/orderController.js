const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const Cart = require("../../models/cartModel");
const { v4: uuidv4 } = require("uuid");
const { Coupon, UserCoupon } = require("../../models/couponModel");
const Wallet = require("../../models/WalletModel");
const generateOrderNumber = require("../../utils/generateOrderNumber");
const recalculateCartTotals = require("../../utils/services/recalculateCartTotals");
const calculateRefundPrice = require("../../utils/services/calculateRefundAmount");

const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      customerName,
      items,
      totalMRP,
      totalDiscount,
      couponDiscount,
      couponCode,
      shippingFee,
      tax,
      totalAmount,
      shippingAddress,
      paymentMethod,
      transactionId,
      paymentStatus,
    } = req.body;
    console.log("placing order");

    if (!userId || !items || !totalAmount || !shippingAddress) {
      return res
        .status(404)
        .json({ success: false, message: "required fields are missing" });
    }

    const orderNumber = await generateOrderNumber();
    console.log("order number", orderNumber);

    const orderDate = new Date(); //date object
    const deliveryDays = 7;
    const expectedDeliveryDate = new Date(orderDate);
    expectedDeliveryDate.setDate(orderDate.getDate() + deliveryDays);

    //check stock for each product in the order
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      const size = product.sizes.find((size) => size.size === item.size);
      if (!size || size.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for product: ${product.name}, size: ${item.size}`
        );
      }
      //Reduce stock
      size.stock -= item.quantity;
      //save product with stock reduction
      await product.save();
    }

    //create new order
    const order = new Order({
      orderNumber,
      userId,
      customerName,
      items,
      totalMRP,
      totalDiscount,
      couponDiscount: couponDiscount ? couponDiscount : 0,
      couponCode: couponCode ? couponCode : "",
      shippingFee,
      tax,
      totalAmount,
      shippingAddress,
      paymentMethod,
      transactionId: transactionId ? transactionId : "",
      paymentStatus:
        paymentStatus ||
        (paymentMethod === "Cash on Delivery" ? "Unpaid" : "Paid"),
      // paymentStatus: paymentMethod === "Cash on Delivery" ? "Unpaid" : "Paid",
      orderDate,
      expectedDeliveryDate,
      activityLog: [{ status: "Order Placed", changedAt: orderDate }],
    });

    await order.save();
    //REMOVE ORDERED ITEMS FROM CART
    const cart = await Cart.findOneAndUpdate(
      { userId },
      {
        $pull: {
          items: {
            $or: items.map((orderItem) => ({
              productId: orderItem.productId,
              size: orderItem.size,
            })),
          },
        },
      }
    );
    if (cart) {
      //SAVE CART WITH NEW VALUES
      recalculateCartTotals(cart);
      await cart.save();
    }
    //ic coupon usage count
    if (couponCode) {
      console.log("have coupon", couponCode);

      const couponUsed = await Coupon.findOneAndUpdate(
        { code: couponCode },
        { $inc: { totalAppliedCount: 1 } },
        { new: true }
      );
      await UserCoupon.findOneAndUpdate(
        { couponId: couponUsed._id, userId: userId },
        { $inc: { appliedCount: 1 } }
      );
    }
    console.log("order placed");

    res.status(201).json({
      success: true,
      message: "ORDER PLACED SUCCESSFULLY",
      orderId: orderNumber,
    });
  } catch (error) {
    console.log("error placing order", error);
    res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ orderNumber: orderId }).populate(
      "items.productId"
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Oder details fetched", order });
  } catch (error) {
    console.log("error in fetching order", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ orderDate: -1 });
    if (!orders) {
      return res
        .status(404)
        .json({ success: false, message: "Orders not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    console.log("error fetching orders", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const cancelOrder = async (req, res) => {
  const { orderId, itemId } = req.params;
  console.log(orderId, itemId);

  try {
    const order = await Order.findOne({ orderNumber: orderId });
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    const item = order.items.find((item) => item._id.equals(itemId));
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    if (item.status === "Cancelled") {
      return res.status(400).json({ error: "item already cancelled" });
    }
    // Update order and handle refund
    const updateOptions = {
      $set: { "items.$[elem].status": "Cancelled" },
      $push: {
        activityLog: {
          status: `Cancelled item: ${item.productId.name}`,
          changedAt: new Date(),
        },
      },
    };

    // Non-COD payment handling
    let wallet, refundAmount;
    if (
      order.paymentMethod !== "Cash on Delivery" &&
      order.paymentStatus === "Paid"
    ) {
      refundAmount = calculateRefundPrice(order, item);
      console.log("cancel refund amount", refundAmount);

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
      } else {
        wallet.transactionHistory.push(newTransaction);
      }

      // Update order with refund status
      updateOptions.$set["items.$[elem].paymentStatus"] = "Refunded";
    }

    // Update order
    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber: orderId },
      updateOptions,
      { arrayFilters: [{ "elem._id": itemId }], new: true }
    );

    console.log("uo", updatedOrder);

    // Increase product stock
    await Product.findOneAndUpdate(
      { _id: item.productId },
      { $inc: { "sizes.$[elem].stock": item.quantity } },
      { arrayFilters: [{ "elem.size": item.size }] }
    );

    // Save wallet if exists
    if (wallet && updatedOrder) {
      await wallet.save();
      console.log("wallet updated");
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled",
      order: updatedOrder,
      refundAmount: refundAmount || null,
    });
  } catch (error) {
    console.log("order cancelation failed", error.message);

    res
      .status(500 || error.status)
      .json({ error: "Order cancellation failed", error });
  }
};

const changePaymentStatus = async (req, res) => {
  const { orderId } = req.params;
  const { transactionId, paymentMethod, paymentStatus } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order || order.paymentStatus != "Failed") {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    order.items.forEach((item) => (item.paymentStatus = "Paid"));
    order.transactionId = transactionId;
    order.paymentMethod = paymentMethod;
    order.paymentStatus = paymentStatus;
    await order.save();
    res
      .status(200)
      .json({ success: true, order, message: "Order payment status updated" });
  } catch (error) {
    console.error("Failed to update payment status", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const sendReturnRequest = async (req, res) => {
  const { orderId, itemId, reason, comment } = req.body;
  if (!orderId || !itemId || !reason) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input parameters" });
  }
  const reqComment = comment ? comment : "";
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const orderItem = order.items.find((item) => item._id.equals(itemId));
    if (orderItem.paymentStatus != "Paid" || orderItem.status != "Delivered") {
      return res
        .status(400)
        .json({ success: false, message: "order not eligible for return." });
    }
    if (
      new Date(orderItem.deliveryDate) <
      new Date(new Date().setDate(new Date().getDate() - 7))
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Return period has expired." });
    }
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, "items._id": itemId },
      {
        $set: {
          "items.$[elem].returnRequest.isRequested": true,
          "items.$[elem].returnRequest.comment": reqComment,
          "items.$[elem].returnRequest.reason": reason,
        },
      },
      { arrayFilters: [{ "elem._id": itemId }] },
      { new: true }
    );
    console.log("updated item", updatedOrder.items);

    return res
      .status(200)
      .json({ success: true, message: "Return request sent" });
  } catch (error) {
    console.error("error sending return request", error);
    res
      .status(500)
      .json({ success: false, message: "Return request not sent" });
  }
};
module.exports = {
  placeOrder,
  getOrderDetails,
  getAllOrders,
  cancelOrder,
  changePaymentStatus,
  sendReturnRequest,
};
//   const updatedOrder =
//     order.paymentMethod == "Cash on Delivery"
//       ? await Order.findOneAndUpdate(
//           { orderNumber: orderId },

//           {
//             $set: { "items.$[elem].status": "Cancelled" },
//             $push: {
//               activityLog: {
//                 status: `Cancelled item:${item.name}`,
//               },
//             },
//           },
//           { arrayFilters: [{ "elem._id": itemId }], new: true }
//         )
//       : await Order.findOneAndUpdate(
//           { orderNumber: orderId },
//           {
//             $set: {
//               "items.$[elem].status": "Cancelled",
//               "items.$[elem].paymentStatus": "Refunded",
//             },
//             $push: {
//               activityLog: {
//                 status: `Cancelled item:${item.name}`,
//               },
//             },
//           },
//           { arrayFilters: [{ "elem._id": itemId }], new: true }
//         );
//   //update order records
//   //if payment mod not cashon delivery payemnt status to refunded and
//   const calculateRefundPrice=(order,item)=>{

//     const offerDiscount=(item.discount*item.totalPrice)/100
//     const itemCouponDiscount=order.couponDiscount/order.items.length;
//     const itemshippingFee=order.shippingFee/order.items.length
//     const itemTax=order.tax/order.items.length
//     const totalPrice=item.totalPrice+itemTax+itemshippingFee
//     return totalPrice-offerDiscount-itemCouponDiscount
//   }

//   if(order.paymentMethod!=='Cash on Delivery'){
//     const refundAmount=calculateRefundPrice(order)
//    let wallet= await Wallet.findOne({userId:order.userId})
//    const newTransaction={
//     transactionId:order.transactionId,
//     type:'refund',
//     amount:refundAmount,
//     orderId:order._id,
//     status:'success'
//   }
//    if(!wallet){
//     wallet= new Wallet({
//       userId:order.userId,
//       transactionHistory:[newTransaction]
//     })
//    }
//   }else{
//      wallet.transactionHistory.push(newTransaction)
//   }
//  await wallet.save()
//   //save to wallet schema

//   //increase stock
//   const product = await Product.findOneAndUpdate(
//     { _id: item.productId },
//     { $inc: { "sizes.$[elem].stock": item.quantity } },
//     { arrayFilters: [{ "elem.size": item.size }] }
//   );
//   console.log("up order", updatedOrder);
//   await product.save();
//   res
//     .status(200)
//     .json({ success: true, message: "Order cancelled", order: updatedOrder });
