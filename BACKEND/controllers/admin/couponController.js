const Coupon =require('../../models/couponModel')
const couponValidationSchema=require('../../utils/validation/couponValidation')


const createCoupon=async(req,res)=>{
    
    
    const {code,description,discountType,discountValue,discountPercentage,
        minPurchaseOrder,maxDiscountAmount,usageLimit,expiryDate,maxUsagePerUser}=req.body;
    try {
    if(!code|| !discountType ||!usageLimit||!expiryDate){
        return res.status(400).json({success:false,message:"please provide required fields."})
    }   
    const {error}=couponValidationSchema.validate(req.body);
    if(error){
        const errorMessages=error.details.map((err)=>err.message);
        console.log("Error in validation",errorMessages);
        
        return res.status(400).json({success:false,message:errorMessages})
    }
    //check if coupon code already exist
    const coupon=await Coupon.findOne({code:code,isActive:true});
    if(coupon){
        return res.status(404).json({success:false,message:"Coupon code already exist."})
    }
   
  const newCoupon =new Coupon({
    code,
    description,
    discountType,
    minPurchaseOrder,
   usageLimit,
   expiryDate,
   maxUsagePerUser
  })
  if(discountType=='percentage'){
    newCoupon.discountPercentage=discountPercentage
    newCoupon.maxDiscountAmount=maxDiscountAmount
  }else{
    newCoupon.discountValue=discountValue
  }
  await newCoupon.save()
     res
      .status(201)
      .json({ success: true, message: "Coupon created." });
    } catch (error) {
        console.error("error creating coupon",error.message);
        res.status(500).json({success:false,message:"Coupon not added.Please try again."})
    }
}

const showCoupons=async(req,res)=>{
    console.log("fetching coupons");
    try {
    const coupons=  await Coupon.find().sort({createdAt:-1}) 
    if(!coupons){
        console.log('coupons',coupons);
        
        return res.status(404).json({success:false,message:"Coupon not found"})
    } 
    res.status(200).json({success:true,message:"Coupon fetched ",coupons})
    } catch (error) {
        console.error("error fetching coupon",error.message);
        res.status(500).json({success:false,message:"Failed to fetch coupons"})
    }
}
const deleteCoupon=async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}
module.exports={createCoupon,deleteCoupon,showCoupons}