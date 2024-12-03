import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import  { adminAxiosInstance } from "@/config/axiosConfig";
import ImageCropper from "../../shared/ImageCropper";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [productData, setProductData] = useState({name:"",description:"",ingredient:"",categoryId:"",price:"",discount:"",skinType:""});
  const [selectedImages, setSelectedImages] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([{ size: "", stock: "", price: "" }]);
  const [crop, setCrop] = useState(false);
  const [error, setError] = useState({});
  const [loading,setLoading]=useState(false)
  const navigate =useNavigate()

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (event) => {
    
    const files = Array.from(event.target.files);
    if (files.length > 4) {
      toast.error("You can only select up to 4 images");
      return;
    }

    //validate each file type
    const imageFiles =files.filter(file=>file.type.startsWith("image/"))
    if(imageFiles.length!=files.length){
      toast.error("Only image files (PNG, JPG) are allowed");
      return 
    }
   
    //if no files are selected
    if(files.length===0){
      setCrop(false)
    }

    const imageUrls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setSelectedImages(imageUrls);
    setCrop(true);
  };

  const handleCroppedImage = (croppedImageUrl, compressedImage) => {
    setCroppedImages((prevCroppedImages) => [
      ...prevCroppedImages,
      { croppedImageUrl, compressedImage },
    ]);
    setCrop(false);
  };
  


  const handleSizeChange = (index, field, value) => {
    const updatedSizes = sizes.map((size, i) =>
      i === index ? { ...size, [field]: value } : size
    );
    setSizes(updatedSizes);
  };

  const addSizeVariant = () => {
    setSizes([...sizes, { size: "", price: "", stock: "" }]);
  };

  const removeSizeVariant = (index) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
  };

  useEffect(() => {
    async function getCategory() {
      try {
        const response = await adminAxiosInstance.get("/api/admin/categories");
        setCategories(response?.data?.categories);
        
      } catch (error) {
        console.log("error in fetching categories", error.message);
      }
    }
    getCategory();
    
  }, []);

  //validate form before submission
  const validateForm = () => {
    const newError = {};

    if (!productData.name.trim()) {
      newError.name = "Product name is required.";
    }
    if (!productData.description || !productData.description.trim()) {
      newError.description = "Product description is required.";
    }
    if (!productData.ingredient || !productData.ingredient.trim()) {
      newError.ingredient = "Key ingredient is required.";
    }
    if (!productData.categoryId) {
      newError.category = "Please select a category.";
    }
    if(!productData.price){
      newError.price="Product is required."
    }else if(productData.price <0){
      newError.price ="Price cannot be negative."
    }
    if(!productData.discount){
     newError.discount="Discount is required."
    }else if(productData.discount<0 || productData.discount>100){
      newError.discount ="Discount must be between 0 and 100"
    }
    if(!productData.skinType){
      newError.skinType ="Skin tyoe is required."
    }
    if (sizes.length === 0 || sizes.some(size => !size.size || !size.price || !size.stock)) {
      newError.sizes = "Please add at least one size variant with valid size, price, and stock.";
    }
  
    // Validate images
    if (croppedImages.length <3) {
      console.log(croppedImages)
      newError.images = "Please upload at least three image.";
    }else if(croppedImages.length>4){
      console.log(croppedImages);
      
      newError.images ="Only four images can be uploaded."
    }
    setError(newError)
    return Object.keys(newError).length === 0; 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

   if(!validateForm()){
    toast.error("Please fix the form errors before submitting.")
    return;
   }

    const formData = new FormData();

    //append products data
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("ingredient", productData.ingredient);
    formData.append("skinType", productData.skinType);
    formData.append("categoryId", productData.categoryId);
    formData.append("price",productData.price);
    formData.append("discount",productData.discount)
    //append sizes
    sizes.forEach((size, index) => {
      formData.append(`sizes[${index}][size]`, size.size);
      formData.append(`sizes[${index}][price]`, size.price);
      formData.append(`sizes[${index}][stock]`, size.stock);
    });

    //append cropped images
    croppedImages.forEach((image, index) => {
      formData.append(`images`, image.compressedImage);
    });
    try {
      setLoading(true)
      
      window.alert("Product is adding.Please wait.")
      // {loading && toast.loading("Product is addding.Please wait.")}
      const response = await adminAxiosInstance.post(
        "/api/admin/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      console.log(response);
      setLoading(false)
      
      toast.success("Product added successfully");
      navigate('/admin/dashboard/products')
      //reset form state
      setProductData({name:"",description:"",ingredient:"",categoryId:"",price:"",discount:""});
      setCroppedImages([]);
      setCrop(false);
      setSizes([{ size: "", stock: "", price: "" }]);
      setCategories([]);
      setError({})
    } catch (error) {
      const errorMessage=error?.response?.data?.message ||"Failed to add product.Please try again" 
      console.log("Error submitting products", error.message);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Toaster />
      <Button onClick={()=>navigate('/admin/dashboard/products')} className="p-2 h-9">Go Back</Button>
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        Add New Product
      </h1>

      {crop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-5xl w-full mx-4 sm:mx-8 lg:mx-auto shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Crop Images
            </h2>
            <div className="flex flex-wrap gap-6 justify-center">
              {selectedImages.map((imageData, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-md bg-gray-50 w-full sm:w-[48%] md:w-[32%]"
                >
                  <ImageCropper
                    imageSrc={imageData.url}
                    onImageCropped={handleCroppedImage}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {croppedImages.length > 0 && (
        <div className="mt-6">
          <h5 className="text-sm font-semibold mb-4">Product images</h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {croppedImages.map((croppedData, index) => (
              <div key={index} className="relative">
                <img
                  src={croppedData.croppedImageUrl}
                  alt={`Cropped ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() =>
                    setCroppedImages((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="mb-6">
          <Label htmlFor="image-upload" className="block mb-2">
            Upload Images
          </Label>

          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG or GIF (MAX. 4)
                </p>
              </div>
              <Input
                id="image-upload"
                type="file"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
              <br></br>
              {error.images && (
            <p className="text-red-500 text-sm">{error.images}</p>
          )}
            </label>
          </div>
        </div>
        <div>
          <Label htmlFor="product-name">Product Name</Label>
          <Input
            id="product-name"
            placeholder="Enter product name"
            type="text"
            value={productData.name}
            name="name"
            onChange={handleProductChange}
          />
          {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter product description"
            value={productData.description}
            name="description"
            onChange={handleProductChange}
          />
          {error.description && (
            <p className="text-red-500 text-sm">{error.description}</p>
          )}
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
          id="price"
          placeholder="price"
          type="number"
          name="price"
          onChange={handleProductChange}
          value={productData.price}
          />
          {error.price &&  (
            <p className="text-red-500 text-sm">{error.price}</p>
          )}
        </div>

        <div>
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
          id="discount"
          placeholder="Enter discount"
          type="number"
          value={productData.discount}
          name="discount"
          onChange={handleProductChange}
          />
          {error.discount && (
          <p className="text-red-500 text-sm">{error.discount}</p>
        )}
        </div>
        <div>
          <Label htmlFor="key-ingredient">Key Ingredient</Label>
          <Input
            id="key-ingredient"
            placeholder="Enter key ingredient"
            type="text"
            value={productData.ingredient}
            name="ingredient"
            onChange={handleProductChange}
          />
          {error.ingredient && (
            <p className="text-red-500 text-sm">{error.ingredient}</p>
          )}
        </div>

        <div>
          <Label htmlFor="skin-type">Skin Type</Label>
          <Select
            name="skinType"
            onValueChange={(value) =>
              handleProductChange({ target: { name: "skinType", value } })
            }
          >
            <SelectTrigger id="skin-type">
              <SelectValue placeholder="Select skin type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="dry">Dry</SelectItem>
              <SelectItem value="oily">Oily</SelectItem>
              <SelectItem value="combination">Combination</SelectItem>
              <SelectItem value="sensitive">Sensitive</SelectItem>
              <SelectItem value="All skin types">All skin types</SelectItem>
            </SelectContent>
          </Select>
          {error.skinType && (
            <p className="text-red-500 text-sm">{error.skinType}</p>
          )}
        </div>

        <div>
          <Label>Size, Price & Stock</Label>
          {sizes.map((size, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <Input
                type="text"
                placeholder="Size (e.g., 50ml)"
                value={size.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
                className="w-24"
              />
              <Input
                type="number"
                placeholder="Price"
                value={size.price}
                onChange={(e) =>
                  handleSizeChange(index, "price", e.target.value)
                }
                className="w-24"
              />
              <Input
                type="number"
                placeholder="Stock"
                value={size.stock}
                onChange={(e) =>
                  handleSizeChange(index, "stock", e.target.value)
                }
                className="w-24"
              />
              <button
                type="button"
                onClick={() => removeSizeVariant(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSizeVariant}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            + Add Size Variant
          </button>
          {error.sizes && <p className="text-red-500 text-sm">{error.sizes}</p>}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            onValueChange={(value) =>
              handleProductChange({ target: { name: "categoryId", value } })
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error.category && (
            <p className="text-red-500 text-sm">{error.category}</p>
          )}
        </div>

        <Button type="submit" className={loading ?"w-full cursor-not-allowed":"w-full cursor-pointer"}>
          Add Product
        </Button>
      </form>
    </div>
  );
}
