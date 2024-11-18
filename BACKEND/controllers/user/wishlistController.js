const Wishlist = require("../../models/wishlistModel");

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  const { userId,size, productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = new Wishlist({ userId, items: [{ productId ,size}] });
    } else {
      // Check if the product is already in the wishlist
      const productExists = wishlist.items.some(
        (item) => item.productId.toString() === productId && item.size===size
      );

      if (productExists) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.items.push({ productId });
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { userId,size, productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      wishlist.items = wishlist.items.filter(
        (item) => item.productId.toString() !== productId && item.size===size
      );
      await wishlist.save();
      res.status(200).json({ message: "Product removed from wishlist" });
    } else {
      res.status(404).json({ message: "Wishlist not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};

// Get wishlist for user
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate("items.productId");
    res.status(200).json(wishlist || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
};
