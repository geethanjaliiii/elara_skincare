import React, { useState } from "react";
import PaymentSection from "@/components/user/checkout/PaymentSection";
import PriceDetails from "@/components/user/cart/PriceDetails";
import { useCart } from "@/context/CartContext";
import { axiosInstance } from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import { useAddress } from "@/context/AddressContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";


export default function CheckoutPayment() {
  const [selectedPayment, setSelectedPayment] = useState("");
  const userId = useSelector((state) => state?.user?.userInfo?._id);
  const { cart ,allStockOut} = useCart();
  const navigate = useNavigate();
  const { shippingAddress } = useAddress();
  
  // const orderMutation =useMutation(placeOrder,{
  //      onSuccess: (data)=>{
  //       toast.success("Order placed successfully!.")
  //       navigate(`/checkout/success/${data.orderId}`);
  //      },
  //      onError:()=>{
  //       toast.error('Ordet not placed.Please try again.')
  //      }
  // })


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
      navigate(`/checkout/success/${data.orderId}`);
    }
   
    console.log(data);
  },
  onError:(error)=>{
    const errorMessage=error?.response?.data?.error||'Ordet not placed.Please try again.'
    toast.error(errorMessage)
  
  }
})


const handlePlaceOrder=()=>{
  const items = cart.items.filter((item)=>item.inStock).map((item) => ({
    productId: item.productId._id,
    name: item.productId.name,
    size: item.size,
    quantity: item.quantity,
    price: item.latestPrice,
    totalPrice: item.latestPrice * item.quantity,
  }));

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
    items,
    totalMRP: cart.totalMRP,
    totalDiscount: cart.totalDiscount,
    shippingFee: cart.deliveryCharge,
    tax: cart.platformFee,
    totalAmount: cart.totalAmount,
    shippingAddress: address,
    paymentMethod: selectedPayment,
  };
  console.log("orderdata", orderData);
  if(items.length>0){
    orderMutation.mutate(orderData)
  }else{
    toast.error("No valid products in cart.")
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



// import React, { useState } from "react";
// import PaymentSection from "@/components/user/checkout/PaymentSection";
// import PriceDetails from "@/components/user/cart/PriceDetails";
// import { useCart } from "@/context/CartContext";
// import { axiosInstance } from "@/config/axiosConfig";
// import { useSelector } from "react-redux";
// import { useAddress } from "@/context/AddressContext";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";


// export default function CheckoutPayment() {
//   const [selectedPayment, setSelectedPayment] = useState("");
//   const userId = useSelector((state) => state?.user?.userInfo?._id);
//   const { cart } = useCart();
//   const navigate = useNavigate();
//   const { shippingAddress } = useAddress();

//   // const orderMutation =useMutation(placeOrder,{
//   //      onSuccess: (data)=>{
//   //       toast.success("Order placed successfully!.")
//   //       navigate(`/checkout/success/${data.orderId}`);
//   //      },
//   //      onError:()=>{
//   //       toast.error('Ordet not placed.Please try again.')
//   //      }
//   // })

// //   function handlePlaceOrder(){
// //     const items = cart.items.map((item) => ({
// //       productId: item.productId._id,
// //       name: item.productId.name,
// //       size: item.size,
// //       quantity: item.quantity,
// //       price: item.latestPrice,
// //       totalPrice: item.latestPrice * item.quantity,
// //     }));

// //     const address = shippingAddress
// //       ? {
// //           fullName: shippingAddress.fullname,
// //           phone: shippingAddress.phone,
// //           email: shippingAddress.email,
// //           addressLine: shippingAddress.addressLine,
// //           city: shippingAddress.city,
// //           state: shippingAddress.state,
// //           pincode: shippingAddress.pincode,
// //           landmark: shippingAddress.landmark,
// //         }
// //       : {};

// //     const orderData = {
// //       userId,
// //       items,
// //       totalMRP: cart.totalMRP,
// //       totalDiscount: cart.totalDiscount,
// //       shippingFee: cart.deliveryCharge,
// //       tax: cart.platformFee,
// //       totalAmount: cart.totalAmount,
// //       shippingAddress: address,
// //       paymentMethod: selectedPayment,
// //     };
// //     console.log("orderdata", orderData);
// // orderMutation.mutate(orderData)
// //   }

//   async function placeOrder() {
//     try {
//       const items = cart.items.map((item) => ({
//         productId: item.productId._id,
//         name: item.productId.name,
//         size: item.size,
//         quantity: item.quantity,
//         price: item.latestPrice,
//         totalPrice: item.latestPrice * item.quantity,
//       }));

//       const address = shippingAddress
//         ? {
//             fullName: shippingAddress.fullname,
//             phone: shippingAddress.phone,
//             email: shippingAddress.email,
//             addressLine: shippingAddress.addressLine,
//             city: shippingAddress.city,
//             state: shippingAddress.state,
//             pincode: shippingAddress.pincode,
//             landmark: shippingAddress.landmark,
//           }
//         : {};

//       const orderData = {
//         userId,
//         items,
//         totalMRP: cart.totalMRP,
//         totalDiscount: cart.totalDiscount,
//         shippingFee: cart.deliveryCharge,
//         tax: cart.platformFee,
//         totalAmount: cart.totalAmount,
//         shippingAddress: address,
//         paymentMethod: selectedPayment,
//       };
//       console.log("orderdata", orderData);

//       const response = await axiosInstance.post(`/api/users/orders`, orderData);
//       console.log("Order placed successfully", response.data);
//       toast.success("Processing your order.");
//       navigate("/checkout/success");
//     } catch (error) {
//       console.log("ORDER NOT PLACED", error);
//       toast.error("Order not placed.Please try again.");
//     }
//   }


//   return (
//     <div className="grid lg:grid-cols-[1fr_400px] gap-6">
//       <Toaster />
//       <PaymentSection
//         selectedPayment={selectedPayment}
//         setSelectedPayment={setSelectedPayment}
//       />
//       <PriceDetails
//         cart={cart}
//         step={"payment"}
//         handlePlaceOrder={placeOrder}
//       />
//     </div>
//   );
// }
