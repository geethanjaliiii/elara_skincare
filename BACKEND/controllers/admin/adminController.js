const bcrypt = require("bcrypt");
const Admin = require("../../models/adminModel");
const RefreshToken=require("../../models/refreshTokenModel")
const User = require("../../models/userModel");
const jwt=require("jsonwebtoken")

//utils
const {generateAccessToken, generateRefreshToken}=require("../../utils/jwt/generateToken");
const setCookie = require("../../utils/jwt/setCookie");


const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  
  try {
    //check user
    //check password
    console.log("finding user");
    
    const admin = await Admin.findOne({ email });
    console.log(admin);
    
      if(!admin){
        console.log("User doesnt exist");
        
        return res.status(400).json({success:false ,message: "User doesn't exist!"})
      }
      console.log("password checking");
      const checkPassword = await bcrypt.compare(password, admin.password);
      console.log("check",checkPassword);
      
      if(!checkPassword){
        return res.status(401).json({success: false, message: "Incorrect password"})
      }

      const adminData ={id:admin._id, email:admin.email, role:admin.role}
           //generate token
           
           const adminAccessToken=generateAccessToken(adminData)
           const adminRefreshToken=generateRefreshToken(adminData)
            //save refresh token
            const newRefreshToken=new RefreshToken({
              token:adminRefreshToken,
              user:admin._id,
              role:admin.role,
              expiresAt:new Date(Date.now()+24*60*60*1000)
             })
       
             await newRefreshToken.save();
             setCookie("adminRefreshToken",adminRefreshToken,24*60*60*100,res)
             res.status(200).json({
              success: true,
              message: "Admin logged in successfully.",
              admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
              },
              adminAccessToken
            });

  
  } catch (error) {
    console.log("error in admin login", error);
    res.status(error.status).json({ success: false, message: "Login failed", error:error.message });
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
const logout=async(req,res)=>{
  try {
    const adminRefreshToken= req.cookies['adminRefreshToken']
    console.log("admin REF",adminRefreshToken);
    await RefreshToken.findOne({token:adminRefreshToken})
    setCookie("adminRefreshToken","",1,res)
    res.status(200).json({message:"Admin logout successfully"})
  } catch (error) {
    console.log("error in logout",error);
    res.status(error.status).json({success:false,error:error})
  }
}

const refreshAccessToken =async(req,res)=>{
  const refreshToken =req.cookies.adminRefreshToken
  if(!refreshToken){
    console.log("NO tokrn provided");
    return res.status(401).json({error:"No refresh token provided.",success:false})
  }
  try {
  const decoded=jwt.verify(refreshToken,process.env.ADMIN_REFRESH_TOKEN_KEY)
  const admin_id =decoded.user.id
  const storedToken =await RefreshToken.find({token:refreshToken,user:admin_id,role:"admin",expiresAt:{$gt:newDate()}}).limit(1)
 if(!storedToken) {
  console.log("Invalid refresh token in database",storedToken);
    
    return res.status(403).json({success:false, error:"Invalid refresh token"})
 }
 const newAccessToken =await generateAccessToken({id:admin_id,email:decoded.email,role:decoded.role})

 res.status(200).json({success:true,adminAccessToken:newAccessToken})
} catch (error) {
  console.log("error in refreshing token",error.message);
  res.status(403).json({success:false,message:'Token verification failed',error})
  }
}
module.exports = { login, getCustomerDetails, editCustomerStatus ,logout,refreshAccessToken};
