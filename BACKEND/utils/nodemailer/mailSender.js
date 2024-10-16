const nodemailer = require('nodemailer')
const dotenv= require('dotenv')
dotenv.config()

const mailSender = async(email,title, body)=>{
    try {
        //create a transporter to send emails
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        //SEND EMAIL TO USERS
        let info = await transporter.sendMail({
            from: "geethanjalis5657@gmail.com",
            to: email,
            subject: title,
            html: body
        });
       
        return info
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports = mailSender