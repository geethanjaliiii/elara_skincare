import React, { useState, useEffect } from "react";
import CartItem from "@/components/user/cart/cartItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PriceDetails from "@/components/user/cart/PriceDetails";
import { axiosInstance } from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useCart } from "@/context/CartContext";

export default function CartPage() {

  const {cart,cartItems,updateQuantity,removeItem,fetchCart}=useCart()
  const navigate=useNavigate()
 console.log("cart==",cart);
 
 useEffect(()=>{
  fetchCart()
 },[])
  
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto p-4 lg:p-6 flex-grow mt-16 min-h-screen">
        {cartItems && cartItems.length>0 ?(
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
           
              {/* cartitems */}
              <CartItem
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            </div>
            { <PriceDetails
              cart={cart}
              step={"bag"}
            />}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-auto text-center space-y-4">
            <p className="text-xl font-semibold text-gray-600">
              Your cart is empty!
            </p>
            <p className="text-gray-500">
              Looks like you haven’t added anything to your cart yet.
            </p>
            <Button
              variant="primary text-sm-bold"
              onClick={() => navigate("/shop")}
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
