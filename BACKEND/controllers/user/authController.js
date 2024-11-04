const jwt = require("jsonwebtoken");
const {OAuth2Client}= require('google-auth-library')
const validator = require("validator");
const bcrypt = require("bcrypt"); 

//models
const User = require("../../models/userModel");
const OTP = require("../../models/otpModel");
const RefreshToken = require("../../models/refreshTokenModel");

//utils
const setCookie = require("../../utils/jwt/setCookie");
const hashPassword = require("../../utils/hashPassword");
const { generateAccessToken, generateRefreshToken,} = require("../../utils/jwt/generateToken");
const generateOTP = require("../../utils/otp/generateOTP");
const sendVerificationEmail = require("../../utils/nodemailer/sendVerificationEmail");

//create instance of OAuth
const client =new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("logging..");
    
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
      });
    }
    if (userExist.isBlocked) {
      console.log("user is blocked");
      
      return res
        .status(403)
        .json({ message: "User is blocked.Please contact support." ,error});
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password",error });
    }
    // Generate tokens
    const userData = { id: userExist._id, email: userExist.email };
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    // Save refresh token
    const newRefreshToken = new RefreshToken({
      token: refreshToken,
      user: userExist._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await newRefreshToken.save();

    // Set refresh token in cookies
    setCookie("userRefreshToken", refreshToken, 24 * 60 * 60 * 1000, res);

    // Send response
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        phone: userExist.phone,
      },
      accessToken,
    });
  } catch (error) {
    console.log("error in login", error.message);
    res.status(500).json({ success: false, message: "Login failed", error });
  }
};

//logic for signup
const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exist" ,error});
    }
    const securePassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      phone,
      password: securePassword,
    });
    console.log("User registered successfully");
  
    const userData = { id: newUser._id, email: newUser.email };
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    const newRefreshToken = new RefreshToken({
      token: refreshToken,
      user: newUser._id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await newRefreshToken.save();
    setCookie("userRefreshToken", refreshToken, 24 * 60 * 60 * 1000, res);
    res.json({
      success: true,
      message: "User Registered Successfully",
      newUser: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
      accessToken,
    });
   
  } catch (error) {
    console.log(error);

    res.status(409).json({ success: false, error: "User Already Exist" });
  }
};

//generate-otp
const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(409).json({ message: "user already exist" });
    }
    const otp = generateOTP();
    console.log("otp:", otp);

    const otpEntry = await OTP.create({
      email,
      otp,
    });
    console.log("otp saved in db", otpEntry);

    sendVerificationEmail(email, otp);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
  }
};

const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const otpData = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("otp query", otpData);
    //verifying otp
    if (!otpData.length || otp !== otpData[0].otp) {
      const errorMessage = otpData.length ? "OTP is not valid" : "OTP expired";
      return res.status(400).json({ success: false, message: errorMessage });
    }
    const user = await User.findOne({ email }).select("-password");
    console.log("user", user);

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully", user });
    console.log("otp verified");
  } catch (error) {
    console.log("error in otp verification", error.message);
  }
};

const refreshUserToken=async(req,res)=>{
  console.log("refreshing access token");
  // const refreshToken =req.body.refreshToken;
  const refreshToken =req.cookies.userRefreshToken;
  if(!refreshToken){
    console.log("No refresh token provided");
    
    return res.status(401).json({error:"No refresh token provided.",success:false})
  }
try {
  
  const decoded= jwt.verify(refreshToken,process.env.REFRESH_TOKEN_KEY)
  const userId =decoded.user.id
  console.log("decoded and userid", decoded, userId,refreshToken);
  
  const storedToken = await RefreshToken.find({token:refreshToken, user:userId, expiresAt: { $gt: new Date() } })
  .limit(1);
  if(!storedToken){
    console.log("Invalid refresh token in database",storedToken);
    
    return res.status(403).json({success:false, error:"Invalid refresh token"})
  }

  //generate access token
  const newAccessToken =generateAccessToken({id:userId,email:decoded.email})

  //send new access token as a response
  res.status(200).json({success:true,accessToken:newAccessToken})

} catch (error) {
  console.log("error in refreshing token",error.message);
  res.status(403).json({success:false,message:'Token verification failed',error})
}
}

const logout=async(req,res)=>{
  try {
    const refreshToken= req.cookies['userRefreshToken']
    console.log(refreshToken);
    await RefreshToken.deleteOne({token:refreshToken})
    document.cookie = "userRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setCookie("userRefreshToken","",1,res)
    res.status(200).json({message:"Logged out successfully"})
  } catch (error) {
    console.log("error in logout",error);
    res.json({success:false,error:error})
  }
}

const googleAuth=async(req,res)=>{
  const {token}=req.body
  try {

    const ticket =await  client.verifyIdToken({
      idToken: token,
      audience:process.env.GOOGLE_CLIENT_ID
    })
    const {name,email}=ticket.getPayload()
     
    //chech if user already exist
    let user = await User.findOne({email}).select(-'password')
    if(!user){
  //proceed sign up
     user =await User.create({name,email})
     console.log("proceed signup");
     
    }else{
      //check if blocked
      
      if(user.isBlocked){
        console.log("user is blocked");
        
        return res.status(403).json({success:false, message:"User is blocked"})
      }
    //proceed login
    }
    console.log("user",user);
    
    const userData = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    const newRefreshToken = new RefreshToken({
      token:refreshToken,
      user:user._id,
      expiresAt:new Date(Date.now()+  24 * 60 * 60 * 1000)
    })
    
    setCookie("userRefreshToken",refreshToken,24 * 60 * 60 * 1000, res)

    res.status(200).json({ success:true, message:"User logged in successfully", user,accessToken})
  } catch (error) {
    console.log("Error in google authentication",error);
    res.status(500).json({success:false, message: "Google authentication failed!"})
  }
}
module.exports = {
  signup,
  sendOTP,
  verifyOTP,
  login,
  refreshUserToken,
  logout,
  googleAuth
};
