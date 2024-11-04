const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredient: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  discount: {
    type: Number,
    required: true,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
  },
  skinType: {
    type: String,
    enum: [
      "normal",
      "dry",
      "oily",
      "combination",
      "sensitive",
      "All skin types",
    ],
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  sizes: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, required: true },
    },
  ],
  images: [{ type: String, required: true }],
  totalStock: {
    type: Number,
    default: 0,
  },
  isFeatured:{
    type:Boolean,
    default:false
  },
  isListed: {
    type: Boolean,
    default: true
  },
  reviews:[
    {
      name:{
        type:String,
      },
      rating:{
        type:Number
      },
      comment:{
        type:String,
      },
      createdAt:{
        type:Date,
        default:Date.now,
      }
    }
  ],
  relatedProducts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product"
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// productSchema.methods.calculateTotalStock=function(){
//    //sum up total stock for each size
//   this.totalStock = this.sizes.reduce((sum, size) => sum + size.stock, 0);
  
// }


productSchema.pre("save", function (next) {
  //sum up total stock for each size
  this.totalStock = this.sizes.reduce((sum, size) => sum + size.stock, 0);
  next();
});

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// productSchema.pre("save",function(next){
//   if(this.sizes && this.sizes.length>0){
//     const lowestPrice=Math.min(...this.sizes.map(size=>size.price))//calculating lowest price
//     this.displayPrice =lowestPrice
//   }else{
//     this.displayPrice=0
//   }
//   next()
// })
module.exports = mongoose.model("Product", productSchema);
