const Product = require("../../models/productModel");
const cloudinary = require("../../config/cloudinaryConfig");
const Joi = require("joi");

// Define your validation schema using Joi
const productSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required.",
        "any.required": "Name is required."
    }),
    description: Joi.string().required().messages({
        "string.empty": "Description is required.",
        "any.required": "Description is required."
    }),
    ingredient: Joi.string().required().messages({
        "string.empty": "Ingredient is required.",
        "any.required": "Ingredient is required."
    }),
    skinType: Joi.string().valid('normal', 'dry', 'oily', 'combination', 'sensitive').required().messages({
        "any.only": "Invalid skin type. Allowed values are normal, dry, oily, combination, sensitive.",
        "any.required": "Skin type is required."
    }),
    sizes: Joi.array().items(Joi.object({
        size: Joi.string().required().messages({
            "string.empty": "Size is required."
        }),
        price: Joi.number().required().messages({
            "number.base": "Price must be a number.",
            "any.required": "Price is required."
        }),
        stock: Joi.number().required().messages({
            "number.base": "Stock must be a number.",
            "any.required": "Stock is required."
        })
    })).required().messages({
        "array.base": "Sizes must be an array.",
        "any.required": "Sizes are required."
    }),
    categoryId: Joi.string().required().messages({
        "string.empty": "Category ID is required.",
        "any.required": "Category ID is required."
    }),
});

// Cloudinary upload function
const cloudinaryImageUploadMethod = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "products" }, // Optional: Specify a folder in Cloudinary
            (err, result) => {
                if (err) {
                    reject("Upload image error");
                } else {
                    resolve(result.secure_url); // Return secure URL of the uploaded image
                }
            }
        ).end(fileBuffer); // Pass the buffer from Multer
    });
};

// Add product function
const addProduct = async (req, res) => {
    const { name, description, ingredient, skinType, sizes, categoryId } = req.body;

    // Validate request body
    const { error } = productSchema.validate(req.body);
    if (error) {
        const errorMessages = error.details.map(err => err.message);
        return res.status(400).json({ message: "Validation error", details: errorMessages });
    }

    try {
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
            sizes: sizes,
            images: imageUrls,
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Error adding product:", error.message); // Log error for debugging
        res.status(500).json({ message: "Something went wrong while adding the product." });
    }
};

module.exports = { addProduct };


// const Product = require("../../models/productModel");
// const cloudinary = require("../../config/cloudinaryConfig");
// const fs =require('fs')


// const cloudinaryImageUploadMethod = async (fileBuffer) => {
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { folder: "products" },  // Optional: Specify a folder in Cloudinary
//         (err, result) => {
//           if (err) {
//             reject("Upload image error");
//           } else {
//             resolve(result.secure_url);  // Return secure URL of the uploaded image
//           }
//         }
//       ).end(fileBuffer);  // Pass the buffer from Multer
//     });
//   };
  
// const addProduct = async (req, res) => {
//   const { name, description, ingredient, skinType, sizes, categoryId } =
//     req.body;

//   //array to store imageUrls after cloudinary uploads
//   console.log("sizes",sizes);
  

//   try {
//     //handle image upload
//     const files = req.files; // Files uploaded via Multer

    
//     const imageUrls = [];

//     // Upload each file to Cloudinary
//     for (const file of files) {
//       const imageUrl = await cloudinaryImageUploadMethod(file.buffer);  // Upload the buffer
//       imageUrls.push(imageUrl);
//     }
//     //create new product
//     const newProduct = new Product({
//       name,
//       description,
//       ingredient,
//       skinType,
//       categoryId,
//       sizes: sizes,
//       images: imageUrls,
//     });

//     await newProduct.save();
//     res
//       .status(201)
//       .json({ message: "Product added successfully", product: newProduct });
//   } catch (error) {
//     console.log("error adding product", error.message);
//     res
//       .status(error?.status || 500)
//       .json({ message: error.message || "Something went wrong" });
//   }
// };

// module.exports = { addProduct };
