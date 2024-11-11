import React, { useEffect } from "react";
import ShopProducts from "@/components/user/ShopProducts";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const ShopPage = () => {
   
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
        <ShopProducts />
      
      <Footer />
    </div>
  );
};

export default ShopPage;

