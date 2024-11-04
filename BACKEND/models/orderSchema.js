const { Schema } = require("mongoose");
const { type } = require("../utils/validation/addressValidation");
const { required } = require("joi");

const orderSchema =new Schema({
    orderNumber:{type:String ,unique:true ,required:true},
    userId:{type:Schema.Types.ObjectId,ref:'User',required:true},
    status:{
        type:String,
        enum:['Pending','Confirmed', 'Shipped', 'Delivered', 'Canceled'],
        default:'Pending'
    },
    items:[
        {
            productId:{type:Schema.Types.ObjectId, ref:'Product',required:true},
            name:{type:String, required:true},
            size:{type:String},
            quantity:{type:Number,required:true},
            price:{type:Number,required:true},//price per qty
            totalPrice:{type:Number, required:true}
    }
    ],
    totalMRP:{type:Number,required:true},
    totalDiscount:{type:Number,default:0},
    shippingFee:{type:Number,default:0},
    tax:{type:Number,default:0},//platform fee
    totalAmount:{type:Number, required:true},
    shippingAddress:{//creating a snapshot of shipping address
        funnName:{type:String, required:true},
        phone:{type:String,required:true},
        email:{type:String,required:true},
        addressLine:{type:String,required:true},
        city:{type:String,required:true},
        state:{type:String,required:true},
        pincode:{type:String,required:true},
        landmark:{type:String}
    },
    paymentMethod:{
        type:String,
        enum:['Cash on Delevery','Credit Card', 'Debit Card', 'PayPal', 'Net Banking', 'UPI'],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:['Paid','Unpaid','Refunded'],
        default:'Unpaid'
    },
    transactionId:{type:String},
    orderDate:{type:Date, default:Date.now},
    updatedAt:{type:Date,default:Date.now},
    activityLog:[
        {status:{type:String},
        changedAt:{type:Date,default:Date.now}}
    ]
})