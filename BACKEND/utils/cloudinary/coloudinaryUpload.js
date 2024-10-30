const cloudinary = require("../../config/cloudinaryConfig");

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
  module.exports={cloudinaryImageUploadMethod}