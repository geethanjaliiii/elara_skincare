import React, { useEffect, useRef, useState } from "react";
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
import { calculateTotalPrice } from "@/utils/calculateTotalItemPrice";
import { useQuery } from "@tanstack/react-query";
import { fetchWallet } from "@/services/wallet";
import { roundToTwo } from "@/utils/roundToTwo";
import { calculateDiscountPrice } from "@/utils/calculateDiscountPrice";

export default function CheckoutPayment() {
  const [selectedPayment, setSelectedPayment] = useState("");
  const user = useSelector((state) => state?.user?.userInfo);
  const [orderId,setOrderId]=useState('')
  const userId=user._id
  const name=user.name
 
  const { cart, allStockOut } = useCart();
  const navigate = useNavigate();
  const { shippingAddress } = useAddress();
  // const {couponCode,couponDiscount}=useCoupon()

  const queryClient = useQueryClient();
  const {
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
  } = useQuery({
    queryKey: ["wallet", userId],
    queryFn: () => fetchWallet(userId),
    enabled: selectedPayment === "Wallet",
    retry:false
  });

  function checkLimit(amount) {
    if (selectedPayment == "Wallet") {
      //if no wallet it should be diabled
      //if wallet balance less than amount
      if (!wallet) {
        return true;
      } else if (wallet.balance < amount) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (cart.items?.length == 0) {
      navigate("/orders");
    }
  }, [cart]);
  const placeOrder = async (orderData) => {
    const response = await axiosInstance.post(`/api/users/orders`, orderData);
    return response.data;
  }; 

  const orderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: (data) => {
      if (data?.orderId) {
        toast.success("Order placed successfully!.");
        console.log(data.orderId);

        //Invalidate 'orderDetails to refetch fresh data
        queryClient.invalidateQueries(["orderDetails", data.orderId]);
        setOrderId(data.orderId)
        navigate(`/checkout/success/${data.orderId}`);
      }
      console.log(data);
    },
    onError: (error) => {
    console.log("error in payment",error,orderId);
    
      if(cart.items?.length==0 && orderId){
        navigate(`/checkout/success/${orderId}`);
      }else{
        navigate('/orders')
      }
      const errorMessage =
        error?.response?.data?.error || "Ordet not placed.Please try again.";
      toast.error(errorMessage);
    },
  });
  const { handleRazorpayPayment } = usePayment(orderMutation, toast);

  const handlePlaceOrder = async (couponCode, couponDiscount) => {
    console.log(couponCode, couponDiscount);
     if(cart.totalMRP==0){
      return toast.error("All products are sold Out")

     }
    const totalAmount = cart.totalAmount - (couponDiscount || 0);
    if (selectedPayment==='Wallet' && checkLimit(totalAmount)) {
      if (!wallet) {
        return toast.error("Please activate your Wallet.");
      } else if (wallet.balance < totalAmount) {
        return toast.error("Insufficient wallet balance.");
      }
    }

    const items = cart.items
      .filter((item) => item.inStock)
      .map((item) => ({
        productId: item.productId._id,
        name:item.productId.name,
        size: item.size,
        quantity: item.quantity,
        price: item.latestPrice,
        discount: item.discount, //in %,
        paymentStatus:selectedPayment=='Wallet'?'Paid':'Unpaid',
        couponDiscountPrice:calculateDiscountPrice(cart,item,couponDiscount).itemCouponDiscount,
        offerDiscountPrice:calculateDiscountPrice(cart,item,couponDiscount).offerDiscount,
        totalMRP:item.latestPrice*item.quantity,
        totalPrice: calculateTotalPrice(cart,item,couponDiscount),
      }));
    if (items.length === 0) {
      return toast.error("No valid products in cart.");
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
      customerName:name,
      items,
      totalMRP: cart.totalMRP,
      totalDiscount: cart.totalDiscount,
      shippingFee: cart.deliveryCharge,
      couponDiscount: couponDiscount,
      couponCode: couponCode,
      tax: cart.platformFee,
      totalAmount:roundToTwo( Math.max((cart.totalAmount - (couponDiscount || 0)),0)),
      shippingAddress: address,
      paymentMethod: selectedPayment,
      
    };
    console.log("orderdata", orderData);
    if (selectedPayment === "Razorpay") {
      await handleRazorpayPayment(orderData);
    } else {
      orderMutation.mutate(orderData);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <Toaster />
      <PaymentSection
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
        wallet={wallet}
        walletLoading={walletLoading}
        walletError={walletError}
      />
      {(
        <PriceDetails
          cart={cart}
          step={"payment"}
          handlePlaceOrder={handlePlaceOrder}
          checkLimit={checkLimit}
        />
      )}
    </div>
  );
}
