const { isEthereumAddress } = require("validator");
const Cart = require("../../models/cartModel");
const recalculateCartTotals=require('../../utils/services/recalculateCartTotals');
const { message } = require("../../utils/validation/addressValidation");

function checkStock(cart){
  for(let item of cart.items){
    const product=item.productId.sizes.find((size)=>size.size===item.size)
    const sizeInStock=product.stock>0
    if(!sizeInStock){
      item.inStock=false
    }else{
      item.inStock=true
    }
  }
}

const addToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, size } = req.body;
  try {
    const product = req.body;
    console.log("product", product);
    console.log("useriD",userId);
    
    if(!userId){
      return res.status(400).json({error:"Invalid user id"})
    }
    //check if cart for user exist
    const cartExist = await Cart.findOne({ userId });
    if (!cartExist) {
      const cart = await Cart.create({
        userId,
        items: product,
      });
      console.log("product added to cart", cart);
      return res.status(200).json({
        success: true,
        message: "product added to new cart",
        cart,
        isAdded: true,
      });
    }
    const productExist = cartExist.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );
    if (productExist) {
      console.log("product  exist in cart");
      productExist.quantity += 1;
    } else {
      console.log("product dont exist in cart");
      cartExist.items.push(product);
    }
    //recalculating total amounts
     recalculateCartTotals(cartExist)

    await cartExist.save();
    res.status(200).json({
      success: true,
      message: "product added to cart",
      cart: cartExist,
      isAdded: true,
    });
  } catch (error) {
    console.log("error in adding product to cart", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const showCart = async (req, res) => {
  const userId = req.params;
  try {
    const cart = await Cart.findOne(userId).populate("items.productId");
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    //clearing unlisted products from cart
    cart.items=cart.items.filter((item)=>item.productId.isListed)

    //check stock(cart)
    checkStock(cart)

    //recalculating total amount of listed products
    recalculateCartTotals(cart)
    await cart.save()
    
    res.status(200).json({ success: true, message: "Cart fetched", cart });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
    console.log("error fetching cart", error.message);
  }
};

const updateCart = async (req, res) => {
  const { userId, itemId } = req.params;
  const newQty = req.body.quantity;
  try {

    //validate inputs
    if (!userId || !itemId || !newQty || newQty < 1) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid inputs" });
    }

    //find cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    //find item
    const item = cart.items.find((item) => item._id.equals(itemId));
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }
    if(!item.productId.isListed){
      return res.status(404).json({message:"Product is currently unavailable"})
    }
    //validate stock quantity
    const selectedSize = item.productId.sizes.find(
      (size) => size.size === item.size
    );
    if (!selectedSize) {
      return res
        .status(404)
        .json({ success: false, message: "Selected size not found" });
    }
    if (newQty > selectedSize.stock && newQty > item.maxQtyPerUser) {
      return res
        .status(400)
        .json({ success: false, message: "Stock limit exceeded" });
    }
    //update quantity and latest price
    item.quantity = newQty;
    item.latestPrice = selectedSize.price;
    if(selectedSize.stock===0){
      item.inStock=false
    }else{
      item.inStock=true
    }
    //recalculating amount with new values
    recalculateCartTotals(cart)

    await cart.save();
    res.status(200).json({ success: true, message: "Quantity updated", cart });
  } catch (error) {
    console.log("error in cart updation", error);

    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const removeItem =async(req,res)=>{
  const {userId, itemId}=req.params
  try {
    if(!userId || !itemId){
      return res.status(400).json({message:"Invalid input parameters"})
    }
   const cart= await Cart.findOne({userId})
   if(!cart){
    return res.status(404).json({success:false,message:'cart not found'})
   }
  const updatedCart= await Cart.findOneAndUpdate({userId},{$pull:{items:{_id:itemId}}},{new:true}).populate('items.productId')
  //recalculatetotals
  recalculateCartTotals(updatedCart)
  
  await updatedCart.save()
  res.status(200).json({success:true,message:"Cart item removed",cart:updatedCart})
  } catch (error) {
    console.log("error removing item",error);
    res.status(500).json({success:false,message:"Internal server error"})
  }
}

const checkProduct=async(req,res)=>{
const {userId}=req.params
const {productId, size}=req.query
console.log("checking product");

try {
  if(!userId || !productId ||!size){
    return res.status(400).json({message:"Invalid inputs"})
  }
 const cart= await Cart.findOne({userId,'items.productId':productId,'items.size':size})
 if(!cart){
 return  res.json({message:'Product not in cart',inCart:false})
 }
 console.log("product is in cart");
 
 res.json({message:'Product in cart',inCart:true})
} catch (error) {
  console.err("error checking",error.message);
  
}
}
module.exports = { addToCart, showCart, updateCart ,removeItem,checkProduct};
