const User = require("../../models/userModel");

const getCustomerDetails = async (req, res) => {
    const {page, limit,term}=req.query
    try {
        const skip=limit*(page-1)
        const query={}
        if(term){
            query.$or=[{name:{$regex: term,$options: 'i'}},
                {email:{$regex:term, $options:'i'}}
            ]
        }
      const users = await User.find(query).skip(skip).limit(limit);
      if(!users){
        return res.status(404).json({success:false,message:"No users found"})
      }
      const totalUsers=await User.countDocuments()
      res
        .status(200)
        .json({ success: true, message: "Customer details fetched",users,totalPages:Math.ceil(totalUsers/limit)});
    } catch (error) {
      console.log("error fetching customer details", error.message);
  
      res.json({ success: false, message: error.message });
    }
  };
  
  const editCustomerStatus = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId)
  
      if (!user) {
        console.log(user);
        
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      user.isBlocked=!user.isBlocked;
      await user.save()
      res.status(200).json({success:true, message:"Customer status updated",user})
    } catch (error) {
      console.log("Customer status update failed",error.message);
      res.status(500).json({success:false,message:"An error occurred while updating status"})
    }
  };

  module.exports={getCustomerDetails, editCustomerStatus}