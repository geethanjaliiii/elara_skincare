const Wishlist = require("../../models/wishlistModel");
const Product = require("../../models/productModel");
const checkStock = require("../../utils/services/checkStock");
const calculateDiscountPrice = require("../../utils/services/calculateDiscountPrice");
// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  const { size, productId } = req.body;

  
const {userId}=req.params
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
        .json({ success: false, message: "The prduct is currently unavailable." });
    }
    const item=product.sizes.find((s)=>s.size==size)
    
    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = new Wishlist({ 
        userId,
         items: [{ 
          productId,
           size ,
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
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.items.push({
         productId ,
         size,
         discount:product.discount,
        price:item.price,
      inStock:item.stock>0});
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist", wishlist ,inWishlist:true});
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

    // if (wishlist) {
    //   wishlist.items = wishlist.items.filter(
    //     (item) => item.productId.toString() !== productId && item.size===size
    //   );
    //   await wishlist.save();
    //   res.status(200).json({ message: "Product removed from wishlist" });
    // } else {
    //   res.status(404).json({ message: "Wishlist not found" });
    // }
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

    console.log('wishlist.items',wishlist.items);
    //to correct the response format 
    // const cleanWishlist=JSON.parse(JSON.stringify(wishlist))
    // const frontendWishlist={
    //   ...cleanWishlist,
    //   items:filteredItems.map((item)=>{
    //  const updatedItem={...item}
    //  if(item?.productId?.offerId){
    //   updatedItem.discount=calculateDiscountPrice(item.productId)
    //  }
    //  return updatedItem
    //   })
    // }
 
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
