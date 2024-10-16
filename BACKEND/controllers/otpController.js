// const otpGenerator = require('otp-generator')
// const OTP = require('../models/otpModel');
// const User = require('../models/userModel')
// const validator = require("validator");

// const sendOTP = async (req,res)=>{
//     try {
//         const  {email}= req.body;
//         //validate email
//         if(!validator.isEmail(data.email)){
//             return res.status(400).json({message:"Invalid email address"})
//         }
//         //check if user is already present
//         const checkUserExist = await User.findOne({ email })
//         if(checkUserExist){
//             return res.status(401).json({
//                 success: false,
//                 message: 'User already registered'
//             })
//         }
//         let otp = otpGenerator.generate(6,{
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets:false,
//             specialChars: false
//         });
//         //check if otp already exist
//         let result = await OTP.findOne({otp:otp})
//         while (result){
//             otp = otpGenerator.generate(6,
//                 {upperCaseAlphabets: false
//                 }
//             )
//             result = await OTP.findOne({otp: otp})
//         }
//         //storing otp in database
//         const otpPayload ={ email, otp}
//         const otpBody = await OTP.create(otpPayload)
//         res.status(200).json({
//             success: true,
//             message: 'otp sent successfully',
//             otp
//         })
//     } catch (error) {
//         console.log("error in otp sending",error.message);
//         return res.status(500).json({success: false, error: error.message})
//     }
// }
// module.exports = {sendOTP}