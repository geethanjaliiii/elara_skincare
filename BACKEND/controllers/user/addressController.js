const Address = require("../../models/addressModel");
const addressSchema = require("../../utils/validation/addressValidation");
const User = require("../../models/userModel");

const addAddress = async (req, res) => {
  const { user } = req.body;
  try {
    const userExist = await User.findById(user);
    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { error } = addressSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      console.log("error in validation", errorMessages);

      return res
        .status(400)
        .json({ message: "Validation error", details: errorMessages });
    }

    const newAddress = await Address.create(req.body);
    const address = {
      _id:newAddress._id,
      user:newAddress.user,
      fullname: newAddress.fullname,
      phone: newAddress.phone,
      email: newAddress.email,
      addressLine: newAddress.addressLine,
      city: newAddress.city,
      state: newAddress.state,
      landmark: newAddress.landmark,
      pincode: newAddress.pincode,
      addressType: newAddress.addressType,
      isDefault: newAddress.isDefault,
    };
    return res
      .status(200)
      .json({ success: true, message: "Address added", address });
  } catch (error) {
    console.log("Address not added", error);
    res
      .status(500)
      .json({ success: false, message: "Address not added", error });
  }
};

const showAddresses = async (req, res) => {
  const { userId } = req.params;
  try {
    const addresses = await Address.find({ user: userId ,isListed:true}).select("-createdAt -updatedAt -__v")

    if (!addresses) {
      return res
        .status(404)
        .json({ success: false, message: "Addresses not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Addresses for user fetched",
        addresses,
      });
  } catch (error) {
    console.log("fetching addresses failed");
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const editAddress = async (req, res) => {
  const { addressId } = req.params;
  try {
    
    const { error } = addressSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      console.log("error in validation", errorMessages);

      return res
        .status(400)
        .json({
          success: false,
          message: "Validation error",
          details: errorMessages,
        });
    }
    const data = req.body;
    const updatedAddress = await Address.findByIdAndUpdate(addressId, data, {
      new: true,
    }).select("-createdAt -updatedAt -__v")
    console.log("address updated",updatedAddress);
    
    //send response
      res
      .status(200)
      .json({ success: true, message: "Address updated", updatedAddress });
  } catch (error) {
    console.log("error editing address", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const deleteAddress =async(req,res)=>{
  const {userId, addressId}=req.params
  try {
    const address=await Address.findOneAndUpdate({_id:addressId , user:userId},{isListed:false}).select("-createdAt -updatedAt -__v")
    

    if(!address){
      return res.status(404).json({success:false ,message:"Address not found"})
    }
    res.status(200).json({success:true, message:"Address deleted successfully"})
  } catch (error) {
    console.log("Error deleteing address",error);
    res.status(500).json({success:false ,message:"Internal server error",error})
  }
}
module.exports = { addAddress, showAddresses, editAddress ,deleteAddress};
