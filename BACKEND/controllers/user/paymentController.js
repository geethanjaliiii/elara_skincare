const Order =require('../../models/orderModel')
const generateOrderNumber=require('../../utils/generateOrderNumber')
const recalculateCartTotals =require('../../utils/services/recalculateCartTotals')
const razorpay =require('../../config/razorpayConfig')
const crypto =require('crypto')

const createOrder= async(req,res)=>{
    const {amount,orderId}=req.body
try {
    console.log(amount,'amounyt');
    
    if(!amount){
        return res.status(400).json({success:false,message:"Amount is required!"})
    }
    console.log("creating order payment");
    
    const options={
        amount:Math.round(amount*100),//conver to paisa,
        currency:'INR',
        receipt:`ela_rcptid_${Math.floor(Math.random*1000)}`,
        payment_capture:1
    }
    const order=await razorpay.orders.create(options);
    console.log("payment created order",order);
    
    if(!order){
        return res.status(500).json({success:false,message:'Failed to create Razorpay order.'})
    }
    res.status(200).json({success:true, order})
} catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
}
}

//sep2.verify the payment signature
const verifyPayment =async(req,res)=>{
    try {
        const{razorpay_order_id, razorpay_payment_id, razorpay_signature}=req.body
        console.log("verifying payment",razorpay_order_id,razorpay_payment_id,razorpay_signature);
        if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
            return res.status(400).json({success:false,message:"Invalid inputs"})
        }
        //generate expected signature using razorpay's secret key
        const generateSignature =crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

        //comapre genrated sinature with received signature from razorpay
        if(generateSignature!==razorpay_signature){
            return res.status(400).json({success:false, message:'Invalid payment signature'})
        }

        //sending success response
        return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const retryPayment=async(req,res)=>{
    const {orderId}=req.params
    const {amount}=req.body
    if(!orderId || !amount ){
        return res.status(400).json({success:false,message:"Invalid input parameters for retry payment"})
    }
    try {
      const order=  await Order.findById(orderId)
      if(!order){
        return res.status(404).json({success:false,message:"Order not found"})
      }
      if(order.paymentStatus!='Failed'){
        return  res.status(400).json({ success: false, message: "Only failed payments can be retried" });
      }
        // Create new Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100), // Convert to paise
            currency: "INR",
            receipt: `retry_${orderId}`,
        });
         // Send Razorpay order details to the frontend
         res.json({ success: true, order: razorpayOrder });
    } catch (error) {
        console.error("Retry payment failed", error);
        res.status(500).json({ success: false, message: "Retry payment failed" });
    }
}
module.exports={createOrder,verifyPayment,retryPayment}