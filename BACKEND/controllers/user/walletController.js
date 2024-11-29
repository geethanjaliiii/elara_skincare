const Wallet=require('../../models/WalletModel')

const fetchWallet=async(req,res)=>{
    const {userId}=req.params
    if(!userId){
        return res.status(400).json({message:'Invalid request parameters'})
    }
    try {
      const wallet= await Wallet.findOne({userId}) 
      if(!wallet){
        return res.status(404).json({success:false,message:"Please activate your wallet."})
      }
      return res.status(200).json({success:true,message:"Wallet fetched",wallet})
    } catch (error) {
        console.error("failed to fetch wallet",error);
        
        res.status(500).json({message:error?.message||'Failed to fetch wallet'})
    }
}

const addMoney=async(req,res)=>{
  
  const{transactionId,amount,userId}=req.body
  if(!userId || !amount || amount<=0 ||!transactionId){
    return res.status(400).json({success:false,message:"Invalid request"})
  }
  try {
 let wallet= await Wallet.findOne({userId})
 const transactionDetails={transactionId,
  type:"credit",
  amount,
  description:`${amount} credited.`,
  status:'success'
 }
 if(!wallet){
wallet=new Wallet({
  userId:userId,
 transactionHistory:[transactionDetails]
})
 }else{
  wallet.transactionHistory.push(transactionDetails)
 }
 await wallet.save()
 return res.status(200).json({success:true,message:"Amount credited to wallet"})
  } catch (error) {
    console.error("error adding money to wallet",error);
    
    res.status(500).json({success:false,message:"Payment failed"})
  }
}

module.exports={fetchWallet,addMoney}