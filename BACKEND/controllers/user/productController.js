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


  const viewProduct=async(req,res)=>{
    const {id}=req.params
try {
  if(!id){
    console.log("Invalid product Id");
    return res.status(400).json({success:false ,message:"Invalid product id."})
  }
 const product= await Product.findById(id).populate("categoryId","name").populate("relatedProducts","name price discount images ")
 if(!product){
  return res.status(401).json({success:false,message:"Product not found",error})
 }
res.status(200).json({success:true, message:"product fetched",product})
} catch (error) {
  console.log("error in view products",error);
  res.status(error.status ||500).json({error,message: error.message||"Internal server error"})
}
  }


 const fetchProducts=async(req,res)=>{
  try {
    const products=await Product.find({}).populate("categoryId", "name")
    res.status(200).json({success:true, message:"Products fetched",products})
  } catch (error) {
    console.log("Error fetching products",error.message);
    res.status(error.status).json({success:false,error:error.message})
  }
 } 
  module.exports ={featuredProducts,viewProduct,fetchProducts}

  