

import React from 'react';
import { X, Filter, ShoppingBag, Heart } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWishlist, removeFromWishlist } from '@/services/wishlist';
import { useSelector } from 'react-redux';
import { LoadingSpinner } from '@/App';
import { ProductCard } from './ProductCard';
import { EmptyWishlist } from './EmptyWishlist';
import { useWishlist } from '@/hooks/useWishlist';



const Wishlist = () => {
  const userId = useSelector((state) => state?.user?.userInfo?._id);
  const {wishlistData,isLoading,}=useWishlist(userId);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4 mx-auto w-fit">
            <Heart size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Please Login to View Your Wishlist</h2>
          <p className="text-gray-500 mb-6">
            Login to view saved items and manage your wishlist
          </p>
          <a 
            href="/login" 
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const hasItems = wishlistData?.items?.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-8xl mx-auto px-6 py-8 mt-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            
            {hasItems && (
              <>
              <h1 className="text-2xl font-semibold">Wishlist</h1>
              <span className="text-gray-500">
                ({wishlistData.items.length})
              </span>
              </>
              
            )}
          </div>
          
          {hasItems && (
            <div className="flex items-center space-x-4">
              {/* <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <Filter size={20} />
                <span className="hidden sm:inline">Filter</span>
              </button> */}
              {/* <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <ShoppingBag size={20} />
                <span className="hidden sm:inline">Move all to Bag</span>
              </button> */}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {hasItems ? (
            wishlistData.items.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))
          ) : (
            <EmptyWishlist />
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

