const Order = require("../../models/orderModel");
const Product = require("../../models/productModel");
const Cart = require("../../models/cartModel");
const generateOrderNumber = require("../../utils/generateOrderNumber");
const recalculateCartTotals = require("../../utils/services/recalculateCartTotals");

const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      totalMRP,
      totalDiscount,
      shippingFee,
      tax,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const orderNumber = await generateOrderNumber();
    console.log("order number", orderNumber);

    const orderDate = new Date(); //date object
    const deliveryDays = 5;
    const expectedDeliveryDate = new Date(orderDate);
    expectedDeliveryDate.setDate(orderDate.getDate() + deliveryDays);

    //reduce stock for each product in the order
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
      //remove item from cart
    }

    //create new order
    const order = new Order({
      orderNumber,
      userId,
      items,
      totalMRP,
      totalDiscount,
      shippingFee,
      tax,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Unpaid" : "Paid",
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
    await cart.save()
    }
    

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
    const order = await Order.findOne({ orderNumber: orderId });
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

const getAllOrders =async(req,res)=>{
  const {userId}=req.params
  try {
    if(!userId){
      return res.status(400).json({success:false, message:"Invalid credentials"})
    }
  } catch (error) {
    
  }
}
module.exports = { placeOrder, getOrderDetails };
