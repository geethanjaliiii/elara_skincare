const mongoose = require('mongoose')
const sendVerificationEmail = require('../utils/nodemailer/sendVerificationEmail')

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*1 //document automatically delete after 1 minute
    }
})

//function to send emails
//automatically send email when a new otp soc is created
// async function sendVerificationEmail(email, otp) {
//     try {
//         const mailResponse = await mailSender(
//             email,
//             "Verification Email",
//             "<h1>Please confirm your OTP</h1>",
//             `<p>Here is your OTP code: ${otp}</p>`
//         )
//         console.log("email sent successfully",mailResponse);
//         res.json({message: "otp send succaessfully",mailResponse})
//     } catch (error) {
//         console.log(error.message);
        
//         res.json({message: `email not send ${error.message}`})
//     }
// }

otpSchema.pre("save",async function (next) {
    console.log("New document saved to database");
    //only send email when a anew document is created
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp)
    }
    next();
    
})
module.exports = mongoose.model('OTP',otpSchema)