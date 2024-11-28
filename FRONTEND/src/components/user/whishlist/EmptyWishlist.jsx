import { X, Filter, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
export const EmptyWishlist = () => 
   {
    return ( <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <Heart size={32} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 text-center mb-6">
          Add items you love to your wishlist. Review them anytime and easily move them to the bag.
        </p>
        <Link
          to="/shop" 
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>)
   }
  ;
  