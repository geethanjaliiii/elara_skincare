const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");

//models
const User = require("../../models/userModel");
const OTP = require("../../models/otpModel");
const RefreshToken = require("../../models/refreshTokenModel");

//utils
const setCookie = require("../../utils/jwt/setCookie");
const hashPassword = require("../../utils/hashPassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt/generateToken");
const generateOTP = require("../../utils/otp/generateOTP");
const sendVerificationEmail = require("../../utils/nodemailer/sendVerificationEmail");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
      });
    }
    if (userExist.isBlocked) {
      return res
        .status(403)
        .json({ message: "User is blocked.Please contact support." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password" });
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
    res.status(500).json({ success: false, mesaage: "Login failed", error });
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
        .json({ success: false, message: "User already exist" });
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

    res.status(409).json({ success: false, message: "User Already Exist" });
  }
};

//generate-otp
//POST /api/users/send-otp
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
module.exports = {
  signup,
  sendOTP,
  verifyOTP,
  login,
};
