import React, { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

const AddToCart = ({ totalStock }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center space-x-6 p-4 mt-4 ">
      {/* Quantity Control */}
      <div className="flex items-center space-x-4">
        <button
          className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition duration-200"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-xl font-semibold">{quantity}</span>
        <button
          className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition duration-200"
          onClick={() => setQuantity(quantity + 1)}
          disabled={totalStock !== 0 && quantity >= totalStock}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-full text-white font-semibold transition duration-300 ${
          totalStock !== 0
            ? "bg-black hover:bg-gray-800 shadow-md hover:shadow-lg"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={totalStock === 0}
        aria-label="Add to Cart"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>{totalStock !== 0 ? "Add to Cart" : "Out of Stock"}</span>
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


// import React, { useState } from "react";
// import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";

// const AddToCart = ({ totalStock }) => {
//   const [quantity, setQuantity] = useState(1);

//   return (
//     <div className="flex items-center space-x-4 m-4 mt-8">
//       {/* Quantity Control */}
//       <div className="flex items-center space-x-2">
//         <button
//           className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition duration-200"
//           onClick={() => setQuantity(Math.max(1, quantity - 1))}
//           disabled={quantity <= 1}
//           aria-label="Decrease quantity"
//         >
//           <Minus className="w-4 h-4 text-gray-600" />
//         </button>
//         <span className="text-lg font-medium">{quantity}</span>
//         <button
//           className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition duration-200"
//           onClick={() => setQuantity(quantity + 1)}
//           disabled={totalStock !== 0 && quantity >= totalStock}
//           aria-label="Increase quantity"
//         >
//           <Plus className="w-4 h-4 text-gray-600" />
//         </button>
//       </div>

//       {/* Add to Cart Button */}
//       <button
//         className={`flex items-center space-x-2 px-4 py-2 rounded-full w-auto text-white font-medium transition duration-200 ${
//           totalStock !== 0
//             ? "bg-black hover:bg-gray-800"
//             : "bg-gray-400 cursor-not-allowed"
//         }`}
//         disabled={totalStock === 0}
//         aria-label="Add to Cart"
//       >
//         <ShoppingCart className="w-4 h-4" />
//         <span>{totalStock !== 0 ? "Add to Cart" : "Out of Stock"}</span>
//       </button>

//       {/* Wishlist Button */}
//       <button
//         className="p-2 rounded-full border border-gray-200 hover:border-red-500 transition duration-200"
//         aria-label="Add to Wishlist"
//       >
//         <Heart className="w-5 h-5 text-red-500 " />
//       </button>
//     </div>
//   );
// };

// export default AddToCart;


// import React ,{useState}from 'react'
// import {  Heart, Minus, Plus, Facebook, Twitter, Instagram } from 'lucide-react';

// const AddToCart = ({totalStock}) => {
//     const [quantity, setQuantity] = useState(1);
    
//     return (
//       <div className='flex space-x-2 items-center m-3'>
//         <div className="flex items-center space-x-4 mb-4">
//           <button
//             className="bg-gray-200 p-2 rounded-full"
//             onClick={() => setQuantity(Math.max(1, quantity - 1))}
//           >
//             <Minus className="w-4 h-4" />
//           </button>
//           <span className="text-xl font-semibold">{quantity}</span>
//           <button
//             className="bg-gray-200 p-2 rounded-full"
//             onClick={() => setQuantity(quantity + 1)}
//           >
//             <Plus className="w-4 h-4" />
//           </button>
//         </div> 
//         <div className="flex space-x-4">
//           <button className="bg-black text-white px-6 py-3 rounded-full flex-grow">{totalStock!=0?"Add To Cart":"Out of Stock"}</button>
//           <button className="border border-black p-3 rounded-full">
//             <Heart className="w-6 h-6" />
//           </button>
//         </div>
//       </div>
//     );
//   };

//   export default AddToCart