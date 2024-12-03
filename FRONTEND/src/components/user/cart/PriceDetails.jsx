

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Tag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import CouponList from "../coupons/CouponList";
import toast, { Toaster } from "react-hot-toast";
import CouponModal from "../coupons/CouponModal";
import { useApplyCouponMutation, useAvailableCoupons } from "@/hooks/admin/customHooks";
import { useSelector } from "react-redux";


const PriceDetails = ({ cart, step, handlePlaceOrder,checkLimit}) => {
  const navigate = useNavigate();
  const { checkStock, allStockOut, fetchCart} = useCart();
  const [open, setOpen] = useState(false);
  const[couponDiscount,setCouponDiscount]=useState(0)
  const [couponCode, setCouponCode] = useState(''); 

  const {mutate:applyCoupon}=useApplyCouponMutation()
  const userId = useSelector((state) => state?.user?.userInfo?._id);
  const { data: availableCoupons, isLoading } = useAvailableCoupons(
    cart?.totalAmount,
    userId
  );

  const handleApplyCoupon = (code) => {
    // Add your coupon application logic here
    const cartValue=cart.totalAmount
   applyCoupon({userId,code,cartValue},{
    onSuccess:(data)=>{
      console.log('coupon applied',code,data?.couponDiscount);
      setCouponCode(code);
      setCouponDiscount(data?.couponDiscount||0)
     console.log(data);
     
      toast.success(`Coupon ${code} applied successfully!`);
    },
    onError:(error)=>{
      console.error("Error applying coupons", error);
      const errorMessage =
        error?.response?.data?.message || "Coupon not applied.";
      toast.error(errorMessage);
    }
   })
    
  };

  // const handleClick = () => {
  //   console.log('status',checkStock());
    
  //   if (step === "bag") {
  //     if (checkStock()) {
  //       fetchCart()
  //       navigate("/checkout/address");
  //     } else {
  //       toast.error("Stock limit exceeded!");
  //     }
  //   } else if (step === "address") {
  //     if (checkStock()) {
  //       fetchCart()
  //       navigate("/checkout/payment");
  //     } else {
  //       toast.error("Stock limit exceeded!");
  //     }
  //   } else if (step === "payment") {
      
  //     if (checkStock()) {
  //       fetchCart()
  //       console.log('coupon code',couponCode);
        
  //       handlePlaceOrder(couponCode,couponDiscount);
  //     } else {
  //       toast.error("Stock limit exceeded!");
  //     }
  //   }
  // };

 const handleClick =async () => {
    
    console.log(fetchCart());
    
    const cartStatus=await checkStock()
    await fetchCart()
    console.log('status',cartStatus);
    
    if (step === "bag") {
      if (cartStatus) {
        
        navigate("/checkout/address");
      } else {
        toast.error("Stock limit exceeded!");
      }
    } else if (step === "address") {
      if (cartStatus) {
        
        navigate("/checkout/payment");
      } else {
        toast.error("Stock limit exceeded!");
      }
    } else if (step === "payment") {
      
      if (cartStatus) {
        
        console.log('coupon code',couponCode);
        
        handlePlaceOrder(couponCode,couponDiscount);
      } else {
        const cart=await fetchCart()
        console.log("caaaart",cart);
        
        toast.error("Stock limit exceeded!");
      }
    }
  };
  return (
    <div className="lg:sticky lg:top-6 lg:h-fit">
      <Toaster />
      {cart && cart?.items?.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">PRICE DETAILS</h2>
            <Separator className="mb-4" />

            {step === "payment" && (
              <div className="mb-4">
                {!couponCode  ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => setOpen(true)}
                  >
                    <Tag className="h-4 w-4" />
                    Apply Coupon
                  </Button>
                ) : (
                  <div className="flex items-center justify-between w-full gap-2 border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{couponCode}</p>
                        <p className="text-xs text-muted-foreground">
                          - Offer applied on the bill
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-red-600 text-sm font-medium hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCouponCode(""); 
                        setCouponDiscount(0)// Clear the coupon code
                      }}
                    >
                      REMOVE
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Price ({cart.totalItems} items)</span>
                <span>₹{cart.totalMRP}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹{(cart.totalDiscount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="">
                  {cart.deliveryCharge >0? cart.deliveryCharge : "Free"}
                </span>
              </div>
           {couponDiscount!=0 &&<div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>- ₹{couponDiscount.toFixed(2)}</span>
              </div>}
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{cart.platformFee}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{(cart.totalAmount-couponDiscount).toFixed(2)}</span>
              </div>
              <div className="text-sm text-green-600">
                You will save ₹{(cart.totalMRP - cart.totalDiscount-couponDiscount).toFixed(2)}{" "}
                on this order
              </div>
            </div>

            {step && (
              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handleClick}
                disabled={allStockOut()||(step === "payment" && checkLimit(cart.totalAmount-couponDiscount))}
              >
                {step === "address" ? "CONTINUE" : "PLACE ORDER"}
              </Button>
            )}

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>
                Safe and Secure Payments. Easy returns. 100% Authentic products.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    
      <CouponModal
        open={open}
        onOpenChange={setOpen}
        availableCoupons={availableCoupons}
        onApplyCoupon={handleApplyCoupon}
      />
    </div>
  );
};

export default PriceDetails;
