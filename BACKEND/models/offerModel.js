const mongoose=require('mongoose')

const offerSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    offerValue:{
        type:Number,
        required:true,
        min:0,
        max:80
    },
    targetType:{
        type:String,
        enum:['Category','Product'],
        required:true
    },
    targetId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'targetType',
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timeseries:true})
offerSchema.index({endDate:1},{expireAfterSeconds:0})
module.exports =mongoose.model('Offer',offerSchema)