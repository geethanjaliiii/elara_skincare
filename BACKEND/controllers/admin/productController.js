const Product = require("../../models/productModel");
const cloudinary = require("../../config/cloudinaryConfig");
const Joi = require("joi");
const { listCategory } = require("./categoryController");

// Define your validation schema using Joi
const productSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required.",
    "any.required": "Description is required.",
  }),
  ingredient: Joi.string().required().messages({
    "string.empty": "Ingredient is required.",
    "any.required": "Ingredient is required.",
  }),
  price: Joi.number().required().messages({
    "number.base": "Price must be a number.",
    "any.required": "Price is required.",
  }),
  discount: Joi.number().required().messages({
    "number.base": "Discount must be a number.",
    "any.required": "Discount is required.",
  }),
  skinType: Joi.string()
    .valid(
      "normal",
      "dry",
      "oily",
      "combination",
      "sensitive",
      "All skin types"
    )
    .required()
    .messages({
      "any.only":
        "Invalid skin type. Allowed values are normal, dry, oily, combination, sensitive.",
      "any.required": "Skin type is required.",
    }),
  sizes: Joi.array()
    .items(
      Joi.object({
        size: Joi.string().required().messages({
          "string.empty": "Size is required.",
        }),
        price: Joi.number().required().messages({
          "number.base": "Price must be a number.",
          "any.required": "Price is required.",
        }),
        stock: Joi.number().required().messages({
          "number.base": "Stock must be a number.",
          "any.required": "Stock is required.",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Sizes must be an array.",
      "any.required": "Sizes are required.",
    }),
  categoryId: Joi.string().required().messages({
    "string.empty": "Category ID is required.",
    "any.required": "Category ID is required.",
  }),
});

// Cloudinary upload function
const cloudinaryImageUploadMethod = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "products" }, // Optional: Specify a folder in Cloudinary
        (err, result) => {
          if (err) {
            reject("Upload image error");
          } else {
            resolve(result.secure_url); // Return secure URL of the uploaded image
          }
        }
      )
      .end(fileBuffer); // Pass the buffer from Multer
  });
};

// Add product function
const addProduct = async (req, res) => {
  const {
    name,
    description,
    ingredient,
    skinType,
    sizes,
    categoryId,
    price,
    discount,
  } = req.body;
  console.log(req.body);

  // Validate request body
  const { error } = productSchema.validate(req.body);
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    console.log("error in validation", error.message);

    return res
      .status(400)
      .json({ message: "Validation error", details: errorMessages });
  }

  try {
    const files = req.files; // Files uploaded via Multer
    const imageUrls = [];

    // Handle image upload
    for (const file of files) {
      const imageUrl = await cloudinaryImageUploadMethod(file.buffer); // Upload the buffer
      imageUrls.push(imageUrl);
    }

    const relatedProducts = await Product.find({ categoryId }, "_id");
    console.log(relatedProducts);

    const relatedProductsIds =
      relatedProducts.length > 0
        ? relatedProducts.map((product) => product._id)
        : [];
    // Create new product
    const newProduct = new Product({
      name,
      description,
      ingredient,
      skinType,
      categoryId,
      price,
      discount,
      sizes: sizes,
      images: imageUrls,
      relatedProducts: relatedProductsIds,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error.message); // Log error for debugging
    res
      .status(500)
      .json({ message: "Something went wrong while adding the product." });
  }
};

const showProducts = async (req, res) => {
  try {
    const { categoryIds, skinTypes, minPrice, maxPrice, searchTerm, sort } =
      req.query;

      console.log(req.query);
      
    //Initialize an empty filter object
    const filters = {};

    if (categoryIds) {
      const categoryArray = categoryIds.split(",");
      filters.categoryId = { $in: categoryArray };
    }
    //filter by skin type
    if (skinTypes) {
      const skinTypeArray = skinTypes.split(",");
      filters.skinType = { $in: skinTypeArray };
    }

    //filter by price
    if(minPrice||maxPrice){
      filters.price={};
      if(minPrice) filters.price.$gte=parseFloat(minPrice)
        if(maxPrice) filters.price.$lte =parseFloat(maxPrice)
    }

    //filter by search term
    if(searchTerm){
      filters.$or=[
        {name: {$regex: searchTerm, $options: 'i'}},
        {'categoryId.name':{$regex: searchTerm,$options: 'i'}}
      ];
    }
     
    //handle sorting
    const sortOption={};
    if(sort=== 'priceHighLow'){
      sortOption.price=-1;  //Descending order
    }else if(sort==='priceLowHigh'){
      sortOption.price =1 //ascending order
    }

    //fetch products
    const products = await Product.find(filters).sort(sortOption)
      .populate("categoryId", "name")
      .populate("relatedProducts", "name price");

    res.status(200).json({success:true, message: "Product fetched", products });

    
  } catch (error) {
    res.status(400).json({ success: false, message: "Data fetching failed." });
    console.log("error in fetching", error.message);
  }
};

//to list or unlist products
const listProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }
    product.isListed = !product.isListed;
    await product.save();
    console.log("product list status updated");

    res.status(200).json({ success: true, message: "Poduct status changed" });
  } catch (error) {
    console.log("error in updating status", error);
    res
      .status(error?.status || 500)
      .json({ message: error || "Something went wrong" });
  }
};


module.exports = { addProduct, showProducts, listProduct };
