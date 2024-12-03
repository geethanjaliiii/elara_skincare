const Category = require("../../models/categoryModel");
const categoryValidationSchema = require("../../utils/validation/categoryValidation");

const addCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    //check if category exist
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) {
      console.log("error in category req body", error);

      return res
        .status(400)
        .json({
          success: false,
          message: "validation error",
          errors: error.details.map((details) => details.message),
        });
    }
    const categoryExist = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (categoryExist) {
      return res
        .status(409)
        .json({ success: false, message: "Category already exist!" });
    }
    const newCategory = await Category.create({
      name,
      description,
    });
    console.log("Category added");
    res
      .status(200)
      .json({ success: true, message: "Category added" });
  } catch (error) {
    console.log("error in adding category", error.message);
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

const showCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    if (!categories) {
      return res
        .status(404)
        .json({ success: false, message: "No categories available." });
    }
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

const listCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    category.isListed = !category.isListed;

    await category.save();
    res
      .status(200)
      .json({ success: true, message: "Category status changed.", category });
  } catch (error) {
    console.log("error in listing categories".error.message);
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};
const editCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const data = req.body;
    const { name } = req.body;
    const { error } = categoryValidationSchema.validate(req.body);
    if (error) {
      console.log("error in category req body", error);

      return res
        .status(400)
        .json({
          success: false,
          message: "validation error",
          errors: error.details.map((detail) => detail.message),
        });
    }
    const categoryExist = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (categoryExist && categoryExist._id != catId) {
      return res
        .status(409)
        .json({ success: false, message: "Category already exist!" });
    }
    const updatedData = await Category.findByIdAndUpdate(catId, data, {
      new: true,
    });
    if (updatedData) {
      res
        .status(200)
        .json({ success: true, message: "Category updated", updatedData });
    }
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

const showCategory = async (req, res) => {
  const { catId } = req.params;
  try {
    const category = await Category.findById(catId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Fetched category details", category });
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ message: error.message || "Something went wrong" });
  }
};

const fetchBestCategories=async(req,res)=>{
  try {
      
  } catch (error) {
      
  }
}
module.exports = {
  addCategory,
  showCategories,
  editCategory,
  listCategory,
  showCategory, 
 fetchBestCategories
};
