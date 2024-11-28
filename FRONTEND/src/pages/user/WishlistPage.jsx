import Navbar from '@/components/shared/Navbar'
import Wishlist from '@/components/user/whishlist/wishlist'
import React from 'react'
import Footer from "@/components/shared/Footer";

const WishlistPage = () => {
  return (
    <div>
      <Navbar/>
      <Wishlist/>
     <Footer/>
    </div>
  )
}

export default WishlistPage
