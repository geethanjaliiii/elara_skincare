import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import ImageGallery from "./product/ImageGallary";
import ProductInfo from "./product/ProductInfo";
import AddToCart from "./product/AddToCart";
import DeliveryInfo from "./product/DeliveryInfo";
import ProductDetails from "./product/ProductDetails";
import Breadcrumbs from "./product/Breadcrumbs";
import { axiosInstance } from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { useWishlist } from "@/hooks/useWishlist";


const ViewProduct = ({ product }) => {
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState({});
  const [addCart, setAddCart] = useState(false);
  // const[inWishlist,setInWishlist]=useState(false)
  const userId = useSelector((state) => state?.user?.userInfo?._id);
  const [cartItem, setCartItem] = useState({});
  
  const {wishlistData,toggleWishlist}=useWishlist(userId);
console.log("wish",wishlistData);

const isWishlisted =
wishlistData?.items?.some(
  (item) =>
    item.productId._id === product._id && item.size === selectedSize.size
) ?? false;
  console.log(isWishlisted,'isWishlisted');
  
  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSizes(product.sizes);
      const availableSize = product.sizes.filter((size) => size.stock != 0);

      console.log("ac", availableSize);
      if (availableSize?.length != 0) {
        setSelectedSize(availableSize[0]);
        handleSizeSelect(availableSize[0]);
      } else {
        setSelectedSize(product.sizes[0]);
        handleSizeSelect(product.sizes[0]);
      }
    }
  }, [product]);

  const handleSizeSelect = async (size) => {
    console.log(size);
    try {
      const response = await axiosInstance.get(
        `/api/users/${userId}/cart/check`,
        { params: { productId: product._id, size: size.size } }
      );
      console.log("response", response);
      if (response.data) {
        console.log(response);

        setAddCart(response.data.inCart);
      }
      setSelectedSize(size);
    } catch (error) {
      console.error("Error checking cart:", error);
    }
  };
  async function handleCart() {
    try {
      //add image too
      cartItem.productId = product._id;
      cartItem.size = selectedSize.size;
      cartItem.quantity = 1;
      // cartItem.priceAtAddition = selectedSize.price;
      cartItem.latestPrice = selectedSize.price;
      cartItem.discount = product.discount;
      console.log("product adding,USERiD==>", userId);

      const response = await axiosInstance.post(
        `/api/users/${userId}/cart`,
        cartItem
      );
      console.log(response);
      setAddCart(response.data.isAdded);
      toast.success("Product added to cart");
    } catch (error) {
      console.log("Product not added");
      toast.error("Something went wrong.Please try again.");
    }
  }

  function handleToggleWishlist() {
try {
  toggleWishlist({userId,productId:product._id,size:selectedSize.size})
  const message=isWishlisted?"removed from":'added to'
  toast.success(`product ${message} wishlist`)
} catch (error) {
  toast.error("Failed to add product to wishlist.")
}
   
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-8">
      <Toaster />
      <Breadcrumbs
        category={
          product.categoryId || { id: "category-id", name: "Category Name" }
        }
        productName={product.name || "Product Name"}
      />
      <div className="grid md:grid-cols-2 gap-8 mb-8 ">
        <div>
          <ImageGallery images={product.images || []} />
          <div className="hidden md:block">
            <DeliveryInfo />
          </div>
        </div>

        <div className="space-y-2">
          <ProductInfo
            name={product.name || "N/A"}
            discount={product.discount || "Not available"}
            price={selectedSize.price || 0}
            rating={product.rating || 0}
            reviews={product.reviews || []}
            bestSeller={product.isFeatured}
            totalStock={product.totalStock}
          />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">SELECT SIZE</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {sizes &&
                sizes.map((size) => (
                  <button
                    key={size._id}
                    onClick={() => handleSizeSelect(size)}
                    disabled={size.stock === 0}
                    className={`
            relative flex flex-col items-center justify-center p-2 rounded-full border transition-all duration-200 ease-in-out
            ${
              selectedSize?._id === size._id
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200 hover:border-yellow-300"
            }
            ${size.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}
          `}
                  >
                    <span className="text-xs font-semibold text-gray-900">
                      {size.stock!=0?size.size:''}
                    </span>
                    {/* <span className="text-xs text-gray-600">
                      Rs. {size.price}
                    </span> */}
                    {size.stock > 0 && size.stock <= 5 && (
                      <span className="absolute top-1 right-1 px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        {size.stock} left
                      </span>
                    )}
                    {size.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 rounded-full">
                        <span className="text-xs font-medium text-gray-500">
                          Out of stock
                        </span>
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
          <AddToCart
            totalStock={product.totalStock}
            handleCart={handleCart}
            onAdded={addCart}
            whishlistProduct={handleToggleWishlist}
            isWishlisted={isWishlisted}
          />
          <ProductDetails {...product} />
          <div className="block md:hidden">
            <DeliveryInfo />
          </div>

          <div className="flex items-center space-x-2  ">
            <ShieldCheck className="h-5 w-5 " />
            <span className="text-sm font-bold">100 % Original product</span>
          </div>
          {/* <SocialShare /> */}
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;

