const mongoose =require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const uri = process.env.MONGO_URI

const connectDB= async()=>{
    try {
        await mongoose.connect(uri)
        console.log("database connected");
        
    } catch (error) {
        console.log("database not connected");
    }
}

module.exports=connectDB