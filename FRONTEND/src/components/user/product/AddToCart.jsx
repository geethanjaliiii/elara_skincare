import React, { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddToCart = ({ totalStock ,handleCart,onAdded}) => {
  
  const navigate=useNavigate()
  return (
    <div className="flex items-center space-x-6 p-4 mt-4 ">
      <button
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-white font-semibold transition duration-300 ${
          totalStock !== 0
            ? "bg-black hover:bg-gray-800 shadow-md hover:shadow-lg"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={!onAdded?handleCart:()=>{navigate('/cart')}}
        disabled={totalStock === 0}
        aria-label="Add to Cart"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{!onAdded? totalStock !== 0 ? "Add to Cart" : "Out of Stock":'Go to Cart'}</span>
      </button>

      {/* Wishlist Button */}
      <button
        className="p-3 rounded-full border border-gray-300 hover:border-red-500 transition duration-200"
        aria-label="Add to Wishlist"
      >
        <Heart className="w-5 h-5 text-red-500" />
      </button>
    </div>
  );
};

export default AddToCart;

