import React, { useState } from "react";
import PaymentSection from "@/components/user/checkout/PaymentSection";
import PriceDetails from "@/components/user/cart/PriceDetails";
import { useCart } from "@/context/CartContext";
import { axiosInstance } from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import { useAddress } from "@/context/AddressContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePayment } from "@/hooks/usePayment";


export default function CheckoutPayment() {
  const [selectedPayment, setSelectedPayment] = useState("");
  const userId = useSelector((state) => state?.user?.userInfo?._id);
  const { cart ,allStockOut} = useCart();
  const navigate = useNavigate();
  const { shippingAddress } = useAddress();
  
const queryClient =useQueryClient();

const placeOrder=async(orderData)=>{
  const response= await axiosInstance.post(`/api/users/orders`,orderData)
   return response.data
 }

const orderMutation=useMutation({
  mutationFn:placeOrder,
  onSuccess:(data)=>{
    if(data?.orderId){
      toast.success("Order placed successfully!.")
      console.log(data.orderId);

      //Invalidate 'orderDetails to refetch fresh data
      queryClient.invalidateQueries(['orderDetails',data.orderId]);

        navigate(`/checkout/success/${data.orderId}`);
    }
    console.log(data);
  },
  onError:(error)=>{
    const errorMessage=error?.response?.data?.error||'Ordet not placed.Please try again.'
    toast.error(errorMessage)
  
  }
})
const {handleRazorpayPayment}=usePayment(orderMutation,toast)

const handlePlaceOrder=async()=>{
  const items = cart.items.filter((item)=>item.inStock)
  if(items.length===0){
    return toast.error("No valid products in cart.")
  }

  const address = shippingAddress
    ? {
        fullName: shippingAddress.fullname,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        addressLine: shippingAddress.addressLine,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        landmark: shippingAddress.landmark,
      }
    : {};

  const orderData = {
    userId,
    // totalMRP: cart.totalMRP,
    // totalDiscount: cart.totalDiscount,
    // shippingFee: cart.deliveryCharge,
    // tax: cart.platformFee,
    totalAmount: cart.totalAmount,
    shippingAddress: address,
    paymentMethod: selectedPayment,
  };
  console.log("orderdata", orderData);
if(selectedPayment==='Razorpay'){
  await handleRazorpayPayment(orderData)
}else{
  orderMutation.mutate(orderData)
}
  
}

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <Toaster />
      <PaymentSection
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
      />
      {!allStockOut() &&   <PriceDetails
        cart={cart}
        step={"payment"}
        handlePlaceOrder={handlePlaceOrder}
      />}
    
    </div>
  );
}


