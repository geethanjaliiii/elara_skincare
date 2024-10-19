const mongoose = require('mongoose')

const productSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    ingredient:{
        type:String,
        required:true
    },
    skinType:{
        type:String,
        enum: ['normal', 'dry', 'oily', 'combination', 'sensitive'],
        required:true
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    sizes:[
        {
            size:{type:String ,required:true},
            price:{type:Number, required:true},
            stock:{type:Number, required:true}
        }
    ],
    images:[{type:String, required:true}],
    createdAt:{type:Date,default:Date.now}
})

module.exports=mongoose.model('Product',productSchema)