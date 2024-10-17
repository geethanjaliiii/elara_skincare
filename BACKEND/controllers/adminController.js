const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check user
    //check password
    const admin = await Admin.findOne({ email });

    if (admin) {
      const checkPassword = await bcrypt.compare(password, admin.password);
      if (checkPassword) {
        //generate token
        //send response
        res.status(200).json({
          success: true,
          message: "Admin logged in successfully.",
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password!" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }
  } catch (error) {
    console.log("error in admin login", error);
    res.json({ success: false, message: "Login failed", error });
  }
};

const getCustomerDetails = async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);

    res
      .status(200)
      .json({ success: true, message: "Customer details fetched",users});
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
module.exports = { login, getCustomerDetails, editCustomerStatus };
