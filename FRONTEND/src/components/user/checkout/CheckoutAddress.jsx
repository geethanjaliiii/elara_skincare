import React, { useEffect, useState } from "react";
import AddressSection from "@/components/user/checkout/AddressSection";
import PriceDetails from "@/components/user/cart/PriceDetails";
import { useCart } from "@/context/CartContext";
import { axiosInstance } from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import { useAddress } from "@/context/AddressContext";
import { useNavigate } from "react-router-dom";

export default function CheckoutAddress() {
  const [step, setStep] = useState("");
  const { cart, fetchCart } = useCart();
  const { addresses, fetchAddresses } = useAddress();
  const navigate=useNavigate()
  useEffect(() => {
    //to refetch the newest values in addresses and cart
    fetchAddresses();
    fetchCart();
    if(cart.items?.length==0){
     navigate('/orders')
    }
  }, []);

  const {handleDeliverHere }= useAddress();
  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
      <AddressSection
        onDeliverHere={(selectedAddress) => {
          setStep("address");
          handleDeliverHere(selectedAddress);
        }}
        addresses={addresses}
      />
      <PriceDetails cart={cart} step={step} />
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import AddressSection from "@/components/user/checkout/AddressSection";
// import PriceDetails from "@/components/user/cart/PriceDetails";
// import { useCart } from "@/context/CartContext";
// import { axiosInstance } from "@/config/axiosConfig";
// import { useSelector } from "react-redux";
// import { useAddress } from "@/context/AddressContext";

// export default function CheckoutAddress() {
//   const [step, setStep] = useState("");
//   const { cart,fetchCart } = useCart();
//   const {addresses,fetchAddresses}=useAddress()
//   const [shippingAddress,setShippingAddress]=useState({})
//   useEffect(()=>{
//     //to refetch the newest values in addresses and cart
//     fetchAddresses()
//     fetchCart()
//   },[])

//   function handleDeliverHere(address){
//     setShippingAddress(address)
//     setStep("address")
//   }
//   return (
//     <div className="grid lg:grid-cols-[1fr_400px] gap-6">
//       <AddressSection onDeliverHere={handleDeliverHere } addresses={addresses} />
//       <PriceDetails cart={cart} step={step} />
//     </div>
//   );
// }
