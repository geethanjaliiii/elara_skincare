import React, { useEffect } from "react";
import ShopProducts from "@/components/user/ShopProducts";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ShopHeader from "@/components/user/shop/ShopHeader";
import axiosInstance from "@/config/axiosConfig";
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
