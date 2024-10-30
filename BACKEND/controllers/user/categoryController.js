const Category =require('../../models/categoryModel')

const showCategories = async (req, res) => {
    try {
      const categoriesAvailable = await Category.find({});
      if (!categoriesAvailable) {
        return res
          .status(404)
          .json({ success: false, message: "No categories available." });
      }
    let categories =categoriesAvailable.filter((category)=> category.isListed===true)
      
      res
        .status(200)
        .json({ success: true, message: "Categories fetched.", categories });
    } catch (error) {
      console.log("error in fetching categories".error);
      res
        .status(error?.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  };

  module.exports={showCategories}