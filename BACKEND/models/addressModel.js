const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    trim:true
  },
  fullname: {
    type: String,
    required: true,
    trim:true
  },
  phone: {
    type: String,
    required: true,
    trim:true,
    match: /^[0-9]{10}$/
  },
  email: {
    type: String,
    required: true,
    trim:true,
    match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  addressLine: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  landmark:{
    type:String,
    trim:true
  },
  pincode:{
    type:String,
    required:true,
    match:/^[0-9]{6}$/,
    trim:true
  },
  addressType:{
    type:String,
    enum:['Home','Work'],
    required:true
  },
  isDefault:{
    type:Boolean,
    default:false
  }
},
{
    timestamps:true
});

addressSchema.pre('save',async function (next){
  //if address being saved is set as default
  if(this.isDefault){
    const Address = mongoose.model("Address", addressSchema);
    //find other address by the same user marked as default

    await Address.updateMany({user:this.user, isDefault:true, _id:{$ne: this._id}},{isDefault:false})
  }
  next()
})
module.exports =mongoose.model('Address',addressSchema)