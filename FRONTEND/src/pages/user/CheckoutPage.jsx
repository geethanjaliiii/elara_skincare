import React, { useState,useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, CreditCard } from "lucide-react";
import CheckoutAddress from "@/components/user/checkout/CheckoutAddress";
import CheckoutPayment from "@/components/user/checkout/CheckoutPayment";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useCart } from "@/context/CartContext";


export default function CheckoutPage() {
  const navigate = useNavigate();
  const[payActive,setPayActive]=useState(false)
  const {cart,fetchCart}=useCart()
  
 useEffect(()=>{
if(cart?.items?.length===0){
navigate('/orders')
}
 },[cart])
  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-4 mt-16">
      <div className="mb-8 border-b pb-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <NavigationStep icon={ShoppingBag} label="BAG" onClick={async() => {
            await fetchCart();
            navigate("/cart")}} isActive={true}/>
          <NavigationStep icon={MapPin} label="ADDRESS" onClick={async() => {
            await fetchCart()
            navigate("/checkout/address")}} 
            isActive={!payActive} />
          <NavigationStep icon={CreditCard} label="PAYMENT" onClick={async() => {
            setPayActive(true)
            await fetchCart()
            navigate("/checkout/payment")
          }}
          isActive={payActive} />
        </div>
      </div>

      <Routes>
        <Route path="address" element={<CheckoutAddress />} />
        <Route path="payment" element={<CheckoutPayment />} />
      </Routes>
    </div>
    <Footer/>
    </>
  );
}

function NavigationStep({ icon: Icon, label, onClick ,isActive}) {
  return (
    <div className={`flex items-center gap-2  ${isActive ? "text-primary font-medium cursor-pointer" : "text-muted-foreground cursor-not-allowed"}`}
     onClick={isActive?onClick:undefined}>
      <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      <span className={`text-sm  ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
    </div>
  );
}
