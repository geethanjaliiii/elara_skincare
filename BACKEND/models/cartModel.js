const mongoose= require('mongoose')
const { type } = require('../utils/validation/addressValidation')
const { required } = require('joi')

const cartItemSchema =new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    size:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:1
    },
    // priceAtAddition:{
    //     type:Number,
    //     required:true
    // },
    latestPrice:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true,
        min:[0,'Discount cannot be negative'],
        max:[100,'Discount cannot exceed 100%']
    },
    maxQtyPerUser:{
        type:Number,
        default:5
    },
    inStock:{
        type:Boolean,
        default:true
    },
   
})
const CartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
        unique:true  //one user have one cart
    },
    items:[cartItemSchema],
    platformFee:{
        type:Number,
        default:3
    },
},
{
    timestamps:true
})

module.exports =mongoose.model('Cart',CartSchema)

//in stock filed updated