import React from "react";
import PaymentSection from "@/components/user/checkout/PaymentSection";
import PriceDetails from "@/components/user/cart/PriceDetails";
import { useCart } from "@/context/CartContext";

export default function CheckoutPayment() {
    const {cart}=useCart()
    
  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <PaymentSection />
      <PriceDetails cart={cart} step={'payment'} />
    </div>
  );
}
