const mongoose = require('mongoose');
const SalesSchema = new mongoose.Schema({
    saleDate:{type:Date,required:true},
    orderId:{type:String,required:true,unique:true},
      
})