const Order =require('../../models/orderModel')
const generateOrderNumber=require('../../utils/generateOrderNumber')
const recalculateCartTotals =require('../../utils/services/recalculateCartTotals')
const razorpay =require('../../config/razorpayConfig')
const crypto =require('crypto')

const createOrder= async(req,res)=>{
    const {amount}=req.body
try {
    if(!amount){
        return res.status(400).json({success:false,message:"Amount is required!"})
    }
    console.log("creating order payment");
    
    const options={
        amount:amount*100,//conver to paisa,
        currency:'INR',
        receipt:`ela_rcptid_${Math.floor(Math.random*1000)}`,
        payment_capture:1
    }
    const order=await razorpay.orders.create(options);
    console.log("payment createed order",order);
    
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

module.exports={createOrder,verifyPayment}