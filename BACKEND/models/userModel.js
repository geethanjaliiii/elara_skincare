const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
    },
    password:{
        type:String,
        
    },
    isBlocked:{
         type:Boolean,
         default:false
    },
    created_at:{
        type:Date,
        default: Date.now
    }
})
module.exports = mongoose.model('User',userSchema)