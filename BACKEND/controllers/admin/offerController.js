const Product = require("../../models/productModel");
const Offer = require("../../models/offerModel");
const Category = require("../../models/categoryModel");
const offerValidationSchema = require("../../utils/validation/offerValidation");
const fetchProducts = async (req, res) => {
  const { search } = req.query;
  console.log(search);

  if (!search) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter the product name." });
  }
  const filter = { isListed: true };
  try {
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    const products = await Product.find(filter).select("_id name");
    res.status(200).json({ message: "products fetched", products });
  } catch (error) {
    console.log("failed to fetch products", error);

    res.status(500).json({ message: "failed to fetch products" });
  }
};
const createProductoffer = async (req, res) => {
  console.log("creating offer", req.body);

  const { targetId, name, offerValue, startDate, endDate } = req.body;
  try {
    const { error } = offerValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      // Extract meaningful messages from Joi's error details
      const errorMessages = error.details.map((detail) => detail.message);
      console.log("pls validate offer inputs", errorMessages);

      return res.status(400).json({
        success: false,
        message:errorMessages[0] ,
        errors: errorMessages, // Array of detailed errors
      });
    }
    const existingOffer = await Offer.findOne({ name });
    if (existingOffer) {
      return res
        .status(404)
        .json({ success: false, message: "Offer already exist." });
    }

    const newOffer = new Offer({
      name,
      offerValue,
      targetType: "Product",
      targetId,
      startDate: startDate,
      endDate: endDate,
    });

    let responseMessage = "";
    const product = await Product.findById(targetId).populate("offerId");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const offer = await newOffer.save();
    //compare with existing offers
    if (!product.offerId || offerValue > product.offerId.offerValue) {
      product.offerId = offer._id;
      await product.save();
      responseMessage =
        "New offer created and applied as it provides better value";
    } else {
      responseMessage =
        "New offer created but existing offer remains as it provides better value";
    }
    res
      .status(201)
      .json({
        message: "Product offer created successfully",
        newOffer,
        responseMessage,
      });
  } catch (error) {
    console.log("error creating offer", error);

    res
      .status(500)
      .json({ error: "Error creating product offer", details: error });
  }
};

const createCategoryoffer = async (req, res) => {
  console.log("creating cat offer");

  const { targetId, name, offerValue, startDate, endDate } = req.body;
  try {
    const { error } = offerValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      // Extract meaningful messages from Joi's error details
      const errorMessages = error.details.map((detail) => detail.message);
      console.log("pls validate offer inputs", errorMessages);

      return res.status(400).json({
        success: false,
        message: "Validation failed. Please check the input data.",
        errors: errorMessages, // Array of detailed errors
      });
    }

    const existingOffer = await Offer.findOne({ name });
    if (existingOffer) {
      return res
        .status(404)
        .json({ success: false, message: "Offer already exist." });
    }
    const products = await Product.find({ categoryId: targetId }).populate('offerId');
    if(products?.length===0){
      return res.status(400).json({message:'No products found in this category'})
    }
    const newOffer = new Offer({
      name,
      offerValue,
      targetType: "Category",
      targetId,
      startDate,
      endDate,
    });

    const offer = await newOffer.save();
    await Promise.all(
      products.map(async(product)=>{
        if(!product.offerId ||offerValue>product.offerId.offerValue){
          product.offerId=offer._id
          await product.save()
        }
      })
    )
 
    res
      .status(201)
      .json({ message: "Product offer created successfully", offer});
  } catch (error) {
    console.log(error, "error creating cat offer");
    res.status(500).json({ message: "Category offer not created ", error });
  }
};

const fetchOffers = async (req, res) => {
  try {
    const [productOffers, categoryOffers] = await Promise.all([
      Offer.find({ targetType: "Product" }).populate("targetId"),
      Offer.find({ targetType: "Category" }).populate("targetId"),
    ]);
    if (!productOffers && !categoryOffers) {
      return res.status(404).json({ message: "failed to fetch offers" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Offers fetched",
        productOffers,
        categoryOffers,
      });
  } catch (error) {
    console.log("Error fetching offers", error);
    res.status(500).json({ message: "Failed to fetch offers" });
  }
};

const listedCategories = async (req, res) => {
  try {
    console.log("fetching categories");

    const categories = await Category.find({ isListed: true });
    return res
      .status(200)
      .json({ success: true, message: "Categores fetched", categories });
  } catch (error) {
    console.log("error fetching categories", error);

    res.status(500).json({ success: false, message: "categories not fetched" });
  }
};
module.exports = {
  fetchProducts,
  createProductoffer,
  fetchOffers,
  createCategoryoffer,
  listedCategories,
};
