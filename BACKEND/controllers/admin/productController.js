const Product = require("../../models/productModel");
const { cloudinaryImageUploadMethod } =require("../../utils/cloudinary/coloudinaryUpload");
const cloudinaryDeleteImages =require('../../utils/cloudinary/deleteImages')
const productSchema =require('../../utils/validation/productValidation')

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
    console.log("error in validation", errorMessages);

    return res
      .status(400)
      .json({ message: "Validation error", details: errorMessages });
  }

  try {
    const productExist=await Product.findOne({name:{$regex: name ,$options: 'i'}})
    if(productExist){
      return res.status(400).json({message:"Product already exist"})
    }
    const files = req.files; // Files uploaded via Multer
    const imageUrls = [];

    // Handle image upload
    for (const file of files) {
      const imageUrl = await cloudinaryImageUploadMethod(file.buffer); // Upload the buffer
      imageUrls.push(imageUrl);
    }

   
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
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    //filter by search term
    if (searchTerm) {
      filters.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { "categoryId.name": { $regex: searchTerm, $options: "i" } },
      ];
    }

    //handle sorting
    const sortOption = {};
    if (sort === "priceHighLow") {
      sortOption.price = -1; //Descending order
    } else if (sort === "priceLowHigh") {
      sortOption.price = 1; //ascending order
    }

    //fetch products
    const products = await Product.find(filters)
      .sort(sortOption)
      .populate("categoryId", "name")

    res
      .status(200)
      .json({ success: true, message: "Product fetched", products });
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
const showProduct = async (req, res) => {
  const { _id } = req.params;
  try {
    const product = await Product.findById(_id).populate("categoryId", "name");
    res
      .status(200)
      .json({ success: true, message: "Product details fetched", product });
  } catch (error) {
    console.log("error in edit product");
    res
      .status(error.status)
      .json({ message: "fetching failed for editing", error });
  }
};


//edit product
const editProduct = async (req, res) => {
  const { _id } = req.params;
  const { name, categoryId, updatedUrls,deletedImages } = req.body;

//validate body


  const { error } = productSchema.validate(req.body);
  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    console.log("error in validation", errorMessages);
    return res
      .status(400)
      .json({ error: "Validation error", details: errorMessages });
  }
 
  const files = req.files;
  const updatedProduct = req.body;

  try {
    const productExist = await Product.findOne({ _id });
    if (!productExist) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("exist", productExist);

    const productWithSameName= await Product.findOne({_id:{$ne:_id},name:name})
    if(productWithSameName){
      return res.status(400).json({message:"Product with same name already exist."})
    }
    //delete previous images
    if(deletedImages){
      try {
        const deleteResults =await cloudinaryDeleteImages(deletedImages)
        console.log("del", deleteResults);
        
      } catch (error) {
        console.log("Images err deleted",error);
      }
    }
    //handle image upload 
    const imageUrls = [];
    for (file of files) {
      const imageUrl = await cloudinaryImageUploadMethod(file.buffer);
      imageUrls.push(imageUrl);
    }

    updatedProduct.images =[...(updatedUrls||[]),...imageUrls]

    Object.assign(productExist, updatedProduct);

    const editedProduct = await productExist.save()
    res
      .status(200)
      .json({ mesaage: "Product edited successfully", product: editedProduct });

  } catch (error) {
    console.error("Error adding product:", error.message); // Log error for debugging
    res.status(500).json({
      message: "Something went wrong while adding the product.",
      error: error.mesaage,
    });
  }
};

module.exports = {
  addProduct,
  showProducts,
  listProduct,
  showProduct,
  editProduct,
};

// const editProduct = async (req, res) => {
//   const { _id } = req.params;
//   const { name, categoryId, updatedUrls,deletedImages } = req.body;

// //validate body


//   const { error } = productSchema.validate(req.body);
//   if (error) {
//     const errorMessages = error.details.map((err) => err.message);
//     console.log("error in validation", errorMessages);
//     return res
//       .status(400)
//       .json({ error: "Validation error", details: errorMessages });
//   }
 
//   const files = req.files;
//   const updatedProduct = req.body;

//   try {
//     const productExist = await Product.findOne({ _id });
//     if (!productExist) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     console.log("exist", productExist);

//     //delete previous images
//     if(deletedImages){
//       try {
//         const deleteResults =await cloudinaryDeleteImages(deletedImages)
//         console.log("del", deleteResults);
        
//       } catch (error) {
//         console.log("Images err deleted",error);
//       }
//     }
//     //handle image upload 
//     const imageUrls = [];
//     for (file of files) {
//       const imageUrl = await cloudinaryImageUploadMethod(file.buffer);
//       imageUrls.push(imageUrl);
//     }

//     const relatedProducts = await Product.find({ categoryId }, "_id");
//     const relatedProductsIds =relatedProducts.length > 0
//         ? relatedProducts.map((product) => product._id)
//         : [];

//     updatedProduct.relatedProducts = relatedProductsIds;

//     updatedProduct.images =[...(updatedUrls||[]),...imageUrls]

   

//     const editedProduct = await Product.findByIdAndUpdate(_id, updatedProduct, {
//       new: true,
//     });
//     res
//       .status(200)
//       .json({ mesaage: "Product edited successfully", product: editedProduct });

//   } catch (error) {
//     console.error("Error adding product:", error.message); // Log error for debugging
//     res.status(500).json({
//       message: "Something went wrong while adding the product.",
//       error: error.mesaage,
//     });
//   }
// };