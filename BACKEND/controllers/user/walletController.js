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

module.exports={fetchWallet}