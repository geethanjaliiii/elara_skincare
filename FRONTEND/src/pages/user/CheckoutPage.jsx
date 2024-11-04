import React, { useState,useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, CreditCard } from "lucide-react";
import CheckoutAddress from "@/components/user/checkout/CheckoutAddress";
import CheckoutPayment from "@/components/user/checkout/CheckoutPayment";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";


export default function CheckoutPage() {
  const navigate = useNavigate();
  const[payActive,setPayActive]=useState(false)
  
 
  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-4">
      <div className="mb-8 border-b pb-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <NavigationStep icon={ShoppingBag} label="BAG" onClick={() => navigate("/cart")} />
          <NavigationStep icon={MapPin} label="ADDRESS" onClick={() => {navigate("/checkout/address")}} isActive={!payActive} />
          <NavigationStep icon={CreditCard} label="PAYMENT" onClick={() => {
            setPayActive(true)
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
    <div className={`flex items-center gap-2 cursor-pointer ${isActive ? "text-primary font-medium" : "text-muted-foreground cursor-not-allowed"}`}
     onClick={isActive?onClick:undefined}>
      <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      <span className={`text-sm  ${isActive ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
    </div>
  );
}
