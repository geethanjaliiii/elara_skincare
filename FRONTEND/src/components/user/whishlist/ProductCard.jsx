import { X, Filter, ShoppingBag, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductCard = ({ item ,handleRemove}) => {
    const productName = item?.productId?.name || 'Product Name Unavailable';
    const productImage = item?.productId?.images?.[0] || '/placeholder.svg?height=200&width=200';
    const price = item?.price || 0;
    const discount = item?.discount || 0;
  
    const discountedPrice = price - (price * discount) / 100;
    const isAddedToBag = false;
  function handleAddToBag(){
    toast.success("Product added to bag")
  }
  
    return (
      <div className="bg-gray-50 rounded-lg p-3 relative group">
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {discount}% Off
          </span>
        )}
        <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:shadow-md"
        onClick={()=>handleRemove(item._id)}>
          <X size={16} />
        </button>
        <img 
          src={productImage}
          alt={productName}
          className="w-full h-40 object-cover mb-3 rounded"
        />
        <div className="space-y-1">
          <p className="text-xs text-gray-600 line-clamp-2">{productName}</p>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">
            ₹{discountedPrice.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-500 line-through">
                ₹{price.toFixed(2)}
              </span>
            )}
          </div>
          <button 
            className={`w-full py-1 px-3 rounded text-sm flex items-center justify-center space-x-2 
              ${isAddedToBag 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-black text-white hover:bg-gray-800'}`}
                onClick={handleAddToBag}
          >
            <ShoppingBag size={14} />
            <span>{isAddedToBag ? 'Added to Bag' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    );
  };