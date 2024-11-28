import { axiosInstance } from '@/config/axiosConfig';
import { useWishlist } from '@/hooks/useWishlist';
import { addToCart } from '@/services/cart';
import { X, Filter, ShoppingBag, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

export const ProductCard = ({ item }) => {
const [isAddedToBag,setIsAddedToBag]=useState(false)
  const userId = useSelector((state) => state?.user?.userInfo?._id);
  const {removeWishlist}=useWishlist(userId);
const getLatestItemDetails=(item)=>{
  const selectedSize=item.productId.sizes.find((size)=>size.size=item.size)
return {price:selectedSize.price,discount:item.productId.discount}
}
    const productName = item?.productId?.name || 'Product Name Unavailable';
    const productImage = item?.productId?.images?.[0] || '/placeholder.svg?height=200&width=200';
    const price = item?.price || 0;
    const discount = item?.discount || 0;
    const discountedPrice = price - (price * discount) / 100;
    
    async function checkCart(){
      try {
        const response= await axiosInstance.get(`/api/users/${userId}/cart/check`,{params:{productId:item.productId._id,size:item.size}})
      setIsAddedToBag(response.data.inCart)
      } catch (error) {
        console.log("cartstatus not updated");
      }
    }
    useEffect(()=>{
      checkCart()
    },[])
 async function handleAddToBag(){
    const cartItem={}
    cartItem.productId=item.productId._id;
    cartItem.size=item.size;
    cartItem.quantity=1;
    // cartItem.priceAtAddition=getLatestItemDetails(item).price
    cartItem.latestPrice=getLatestItemDetails(item).price
    cartItem.discount=getLatestItemDetails(item).discount
try {
  await addToCart({userId,cartItem})
 checkCart()
  toast.success("Product added to bag")
} catch (error) {
  toast.error("Item not added to cart")
}
  }
  
    return (
      <div className="bg-gray-50 rounded-lg p-3 relative group">
        <Toaster/>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {discount}% Off
          </span>
        )}
        <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:shadow-md"
        onClick={()=>removeWishlist({userId,itemId:item._id})}>
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