const mongoose=require('mongoose');
const { wishlist } = require('validator');
const { type } = require('../utils/validation/addressValidation');

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        size: {
          type: String,
          required: true, 
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        price:{
          type:Number,
          required:true,
        },
        
        discount:{
          type:Number,
          required:true,
          min:0,
          max:99
        },
        inStock:{
          type:Boolean,
          default:true
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports =Wishlist