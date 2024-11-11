const mailSender=require('../nodemailer/mailSender')

const sendResetPasswordMail=async(email,otp)=>{
    try {
        await mailSender(
            email,
            "ELARA - Password Reset Request",
            `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #0a74da;">Password Reset Request</h2>
              <p>Dear user,</p>
              <p>We received a request to reset your password for your <strong>ELARA</strong> account. Please use the OTP code below to reset your password:</p>
              <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; background-color: #f9f9f9; padding: 10px; border-radius: 5px; color: #0a74da;">${otp}</span>
              </div>
              <p>This OTP code is valid for the next 1 minute. Please do not share this code with anyone.</p>
              <p>If you did not request this, please ignore this email. Your account is safe.</p>
              <hr style="border: none; border-top: 1px solid #ccc;" />
              <p style="font-size: 12px; color: #777;">This email was sent from an unmonitored account. Please do not reply to this email.</p>
              <p style="font-size: 12px; color: #777;">&copy; 2024 ELARA. All rights reserved.</p>
            </div>
            `
        )
        console.log("reset email send"); 
    } catch (error) {
        console.log("error in verification mail response",error);
    }
}
module.exports=sendResetPasswordMail