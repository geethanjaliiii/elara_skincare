import React, { useEffect, useState } from "react";
import AddressSection from "@/components/user/checkout/AddressSection";
import PriceDetails from "@/components/user/cart/PriceDetails";
import { useCart } from "@/context/CartContext";
import { axiosInstance } from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import { useAddress } from "@/context/AddressContext";

export default function CheckoutAddress() {
  const [step, setStep] = useState("");
  const { cart,fetchCart } = useCart();
  const {addresses,fetchAddresses}=useAddress()

  useEffect(()=>{
    //to refetch the newest values in addresses and cart
    fetchAddresses()
    fetchCart()
  },[])
  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <AddressSection onDeliverHere={() => setStep("address") } addresses={addresses} />
      <PriceDetails cart={cart} step={step} />
    </div>
  );
}
