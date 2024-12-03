const User = require("../../models/userModel");
const Wallet=require('../../models/WalletModel')
const { v4: uuidv4 } = require("uuid");

const showProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById({ _id: id }).select("-password");
    if(!user){
      return res.status(400).json({message:"user not found"})
    }
    res
      .status(200)
      .json({ success: true, message: "user details fetched", user });
  } catch (error) {
    console.log("error fetching userdetails", error);
    res.status(500).json({ success: false, message: "User data not fetched" });
  }
};

const editProfile=async(req,res)=>{
  const {id}=req.params
  const {email}=req.body
  const data =req.body
  try {
   const user= await User.findById({_id:id})
   if(!user){
    return res.status(404).json({success:false, message:"user not found"})
   }
   if(user.isBlocked){
    return res.status(403).json({success:false,message:"User is blocked"})
   }
   const existingUser =await User.findOne({email: {$regex : new RegExp(`^${email}$`,'i')},_id:{$ne:id}})
   if(existingUser){
    return res.status(409).json({success:false, message: 'User already exist wit the same email'})
   }
   const updatedUser = await User.findByIdAndUpdate(id , data, {new:true}).select('-password')
   res.status(200).json({success:false, updatedUser,message:"User profile updated."})
  } catch (error) {
    console.log("ERROR IN EDITING USER",error);
    res.status(500).json({message:"Internal servere error",error})
  }
}

const claimReferral=async(req,res)=>{
 const {userId}=req.params
 const {code}=req.body
 if(!userId || !code){
  return res.status(400).json({success:false,message:""})
 }
  try {
    const user=await User.findOne({_id:userId})
    if(!user){
     return res.status(404).json({success:false,message:"User not found."})
    }
    if(user.isReferralRewarded){
     return res.status(400).json({success:false,message:"This reward is already claimed"})
    }
    const referrer=await User.findOne({referralCode:code,isBlocked:false})
    if(!referrer){
   return res.status(400).json({success:false,message:"Referral code is invalid!"})
    }
    let userWallet=await Wallet.findOne({userId:user._id})
    const userTransactionDetails={
     transactionId:`WELCOME-${uuidv4()}`,
     type:"credit",
     amount:50,
     status:"success"
    }
   
    if(!userWallet){
   userWallet=new Wallet({
     userId,
   transactionHistory:[userTransactionDetails]
   })
    }else{
     userWallet.transactionHistory.push(userTransactionDetails)
    }
    await userWallet.save()
    let referrerWallet=await Wallet.findOne({userId:referrer._id})
    const referrerTansactionDetails={
     transactionId:`ELA-${uuidv4()}`,
     type:"credit",
     amount:100,
     status:"success"
    }
    if(!referrerWallet){
   referrerWallet=new Wallet({
     userId:referrer._id,
     transactionHistory:[referrerTansactionDetails]
   })
    }else{
     referrerWallet.transactionHistory.push(referrerTansactionDetails)
    }
    await referrerWallet.save()
    res.status(200).json({success:true,message:"Referral Offer claimed",amount:50})
  } catch (error) {
    console.log("eerro claiming referral",error);
    res.status(500).json({success:false,message:"Unable to claim referral offer."})
    
  }
}
module.exports = { showProfile ,editProfile,claimReferral};
