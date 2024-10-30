import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import ImageGallery from "./product/ImageGallary";
import ProductInfo from "./product/ProductInfo";
import AddToCart from "./product/AddToCart";
import DeliveryInfo from "./product/DeliveryInfo";
import ProductDetails from "./product/ProductDetails";
import Breadcrumbs from "./product/Breadcrumbs";
import SocialShare from "./product/SocialShare";
const ViewProduct = ({ product }) => {
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState({});

  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSizes(product.sizes);
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const dummyReviews = [
    {
      id: "1",
      title: "Great Product!",
      rating: 5,
      comment: "I absolutely love this product. It works wonders for my skin.",
      author: "Jane Doe"
    },
    {
      id: "2",
      title: "Not bad",
      rating: 3,
      comment: "It's okay, but I expected more from this brand.",
      author: "John Smith"
    },
    {
      id: "3",
      rating: 4,
      comment: "Quite good, but the scent is a bit strong for me.",
      author: "Alice Johnson"
    }
  ]
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs 
        category={product.categoryId || { id: "category-id", name: "Category Name" }} 
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
                      {size.size}
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
          <AddToCart totalStock={product.totalStock} />
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
