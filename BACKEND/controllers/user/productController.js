const Product = require("../../models/productModel");

const featuredProducts = async (req, res) => {
  try {
    const bestsellers = await Product.find({ isFeatured: true,isListed:true });
    res
      .status(200)
      .json({ success: true, message: "Bestsellers fetched.", bestsellers });
  } catch (error) {
    console.log("error in fetching bestsellers", error);
    res
      .status(error?.status || 500)
      .json({ message: error || "Something went wrong" });
  }
};

const viewProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      console.log("Invalid product Id");
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id." });
    }
    const product = await Product.findById(id)
      .populate("categoryId", "name")
      
      const relatedProducts=await Product.find({categoryId:product.categoryId, _id:{$ne:id}}).populate('categoryId')
     
    if (!product) {
      return res
        .status(401)
        .json({ success: false, message: "Product not found", error });
    }
    res
      .status(200)
      .json({ success: true, message: "product fetched", product,relatedProducts });
  } catch (error) {
    console.log("error in view products", error);
    res
      .status(error.status || 500)
      .json({ error, message: error.message || "Internal server error" });
  }
};

const fetchProducts = async (req, res) => {
  try {
    const { categoryIds, skinTypes, sort, term, maxPrice, minPrice, page } =
      req.query;
    console.log("skintypes", skinTypes);

    const filter = { isListed: true };
    const sortOrder = {};
    const limit = 6;
    //eg if page=2 ,skip 3
    const skip = limit * (page - 1);

    //filter
    if (categoryIds) {
      const categoryIdArray = categoryIds.split(",");
      filter.categoryId = { $in: categoryIdArray };
    }
    if (skinTypes) {
      const skinTypeArray = skinTypes.split(",");
      console.log("skintypearray",skinTypeArray);
      
      filter.skinType = { $in: skinTypeArray };
    }
    //search term
    if (term) {
      filter.$or = [
        { name: { $regex: term, $options: "i" } },
        //   {'categoryId.name': {$regex: term,$options: 'i'}
        // }
      ];
    }
    //pricerange
    if(minPrice>100 || maxPrice<3500){
      filter.$and=[{price:{$gte:minPrice}},{price:{$lte:maxPrice}}]
    }
    //sort
    if (sort === "lowToHigh") {
      sortOrder.price = 1;
    } else if (sort === "highToLow") {
      sortOrder.price = -1;
    } else if (sort === "inc") {
      sortOrder.name = 1;
    } else if (sort == "dec") {
      sortOrder.name = -1;
    } else if (sort == "newArrivals") {
      sortOrder.createdAt = -1;
    } else if (sort === "featured") {
      sortOrder.isFeatured = -1;
    }
    console.log("filter", filter, "sort", sort);

    const products = await Product.find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name");

    const productCount = await Product.countDocuments(filter);
    res
      .status(200)
      .json({
        success: true,
        message: "Products fetched",
        products,
        totalPages: Math.ceil(productCount / limit),
      });
  } catch (error) {
    console.log("Error fetching products", error.message);
    res.status(error.status).json({ success: false, error: error.message });
  }
};
module.exports = { featuredProducts, viewProduct, fetchProducts };
