import React from "react";
import { Star } from 'lucide-react';
const ProductInfo = ({ name, price, rating, reviews, discount ,bestSeller,totalStock}) => {
       const discountPrice=price-(price*discount)/100
       const saving =price-discountPrice

    return (

    <div className="mb-6 space-y-2">
      {bestSeller && (<div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full inline-block mb-2">BEST SELLER</div>)}
      <h1 className="text-3xl font-bold mb-2">{name}</h1>
      {/* <p className="text-gray-600 mb-4">{description}</p> */}
      <div className="flex items-center mb-4 space-x-2">
        <div className="flex items-center ">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < Math.floor(4.2) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
          ))}
        </div>
        <span className="ml-2 text-gray-600">(50 Reviews)</span>
        
        <span className={totalStock!=0?"text-green-500":"text-red-500"}>{totalStock!=0?"In Stock":"Sold Out"}</span>
      </div >
      {discount>=30 && (<p className="text-green-500 text-sm font-semibold">Special Price</p>)}
      <div className="flex items-center gap-2">

      <span className="text-2xl font-bold  text-black">₹{discountPrice.toFixed(2)}</span>
      <span className="text-lg line-through text-gray-500">₹{price.toFixed(2)}</span>
      <span className="text-lg font-semibold text-green-600">{discount} % OFF</span>

      </div>
      <p className="text-gray-600 text-sm">You will save ₹{saving.toFixed(2)}</p>
      <p className="text-black">( MRP Inclusive of Taxes )</p>
    </div>
  );
}
  export default ProductInfo

