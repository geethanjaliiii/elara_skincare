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

otpSchema.pre("save",async function (next) {
    console.log("New document saved to database");
    //only send email when a anew document is created
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp)
    }
    next();
    
})
module.exports = mongoose.model('OTP',otpSchema)