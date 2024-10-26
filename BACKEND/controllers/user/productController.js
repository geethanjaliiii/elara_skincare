const Product=require('../../models/productModel')
const User =require('../../models/userModel')

const featuredProducts=async (req,res)=>{
    try {
      const bestsellers= await Product.find({isFeatured:true})
      res.status(200).json({success:true, message:"Bestsellers fetched.",bestsellers})
     
    } catch (error) {
      console.log("error in fetching bestsellers", error);
      res
        .status(error?.status || 500)
        .json({ message: error || "Something went wrong" });
    }
  }
  module.exports ={featuredProducts}