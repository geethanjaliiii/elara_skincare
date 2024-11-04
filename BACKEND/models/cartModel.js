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
    priceAtAddition:{
        type:Number,
        required:true
    },
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
        default:10
    },
    inStock:{
        type:Boolean,
        default:true
    }
})
const CartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
        unique:true  //one user have one cart
    },
    items:[cartItemSchema],
    totalItems:{
        type:Number,
        default:0
    },
    totalMRP:{
        type:Number,
        default:0
    },
    totalAmount:{
        type:Number,
        default:0
    },
    totalDiscount:{
       type:Number,
       default:0
    },
    appliedCoupons:{
        type:Array,
        default:[]
    },
    couponDiscount:{
      type:Number,
      default:0
    },
    platformFee:{
        type:Number,
        default:3
    },
    deleveryCharge:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
})
CartSchema.pre('save',function(next){
    const availableItems=this.items.filter((item)=>item.inStock===true)
    //calculate total items
    this.totalItems=availableItems.length

    //calculate total mrp
    this.totalMRP=availableItems.reduce((acc,item)=>acc+item.latestPrice*item.quantity,0)
    this.totalDiscount=availableItems.reduce((acc,item)=>acc+item.discount*item.latestPrice*item.quantity/100,0)

    //
    const discountedPrice=this.totalMRP-this.totalDiscount
    this.totalAmount=discountedPrice-this.couponDiscount+this.deleveryCharge+this.platformFee
    next()
})

module.exports =mongoose.model('Cart',CartSchema)

//in stock filed updated