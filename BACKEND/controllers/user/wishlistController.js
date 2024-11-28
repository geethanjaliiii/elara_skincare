const Wishlist = require("../../models/wishlistModel");
const Product = require("../../models/productModel");
const checkStock = require("../../utils/services/checkStock");
const calculateDiscountPrice = require("../../utils/services/calculateDiscountPrice");
// Add product to wishlist
exports.toggleWishlist = async (req, res) => {
  const { size, productId ,userId} = req.body;

  if (!userId || !size || !productId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields." });
  }
  console.log(size,productId,userId);
  try {
    let wishlist = await Wishlist.findOne({ userId });

    const product = await Product.findOne({
      _id: productId,
      sizes: { $elemMatch: { size: size } },
      isListed: true,
    });
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "The product is currently unavailable." });
    }
    const item=product.sizes.find((s)=>s.size==size)
    
    let status
    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = new Wishlist({ 
        userId,
         items: [{ 
          productId,
           size,
           discount:product.discount,
           price:item.price, 
           inStock:item.stock>0
      }] });
    } else {
      // Check if the product is already in the wishlist
      const productExists = wishlist.items.some(
        (item) => item.productId.toString() === productId && item.size === size
      );

      if (productExists) {
        status='removed from'
        
      wishlist.items=  wishlist.items.filter(item=>!(item.productId.equals(productId) && item.size==size))
        // return res.status(400).json({ message: "Product already in wishlist" });
      }else{
        status='added to'
        wishlist.items.push({
           productId ,
           size,
           discount:product.discount,
          price:item.price,
        inStock:item.stock>0});
      }
      }
      await wishlist.save();
console.log(`Product ${status} wishlist`);
    
    res.status(200).json({ message: `Product ${status} wishlist`, wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { userId, itemId} = req.params;
if(!userId || !itemId){
  return res.status(400).json({success:false,message:"Invalid inputs"})
}
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: userId },
      { $pull: {items:{_id:itemId}}},
      { new: true }
    );

    res.status(200).json({success:true,message:"Item removed from wishlist",wishlist})
  } catch (error) {
    console.error("eror removing item from wish",error);
    
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};

// Get wishlist for user
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlist = await Wishlist.findOne(
      { userId },
    ).populate({path:'items.productId',
      populate:{path:'offerId'}
    });

    if(!wishlist){
      return res.status(400).json({message:"No wishlist found."})
    }
  const filteredItems=wishlist.items.reduce((acc,item)=>{
        if(item.productId.isListed){
          item.inStock=checkStock(item)
         acc.push(item)
        }
      return acc
    },[])
      // Update the database only if filtered items differ
      if (filteredItems.length !== wishlist.items.length) {
        await Wishlist.findOneAndUpdate(
          { _id: wishlist._id },
          { items: filteredItems }
        );
      }
    res
      .status(200)
      .json({
        success: true,
        message: "Wishlist fetched",
        wishlist: wishlist,
      });
  } catch (error) {
    console.log("error fetching wishlist",error);
    
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
};
