import { axiosInstance } from "@/config/axiosConfig";
import { current } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { redirect } from "react-router-dom";
// const contactNumber=useSelector((state)=>state?.user?.userInfo?.phone)

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async ({
  orderData,
  onSuccess,
  onError,
  orderId, //orderId for retry
}) => {
  try {
    console.log("orderId for retry",orderId,orderData);
    
    //load razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error("Razorpay SDK failed to load");
    }

    //different endpoints for new order and retry
    const paymentEndPoint = orderId
      ? `/api/users/payment/${orderId}/retry-payment`
      : `/api/users/payment/create-order`;

      //create razorpay order
    const { data } = await axiosInstance.post(paymentEndPoint, {
      amount: orderData.totalAmount,
      ...(orderId ? { orderId } : {}), //including orderId  for retry
    });
    if (!data.success) throw new Error("Failed to create order");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "ELARA",
      description: "Product Purchase",
      order_id: data.order.id,
      //success handler
      handler: async (response) => {
        console.log("create payment resp", response);

        const { data: verificationData } = await axiosInstance.post(
          "/api/users/payment/verify-payment",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }
        );
        if (verificationData.success) {
          orderData.items.forEach((item)=>item.paymentStatus="Paid")
          const finalOrderData = {
            ...orderData,
            transactionId: response.razorpay_payment_id,
            paymentMethod: "Razorpay",
            paymentStatus:"Paid"
          };
          onSuccess(finalOrderData);
        } else {
          throw new Error("Payment verification failed");
        }
      },
      prefill: {
        name: orderData.shippingAddress.fullName,
        email: orderData.shippingAddress.email,
        contact:  orderData.shippingAddress.phone,
      },
      theme: {
        color: "#000000",
      },

      //Error handlers
      modal:{
        ondismiss:()=>{
            onError(new Error('Payment process was cancelled'))
        }
      },

      callback_url:null,
      redirect:false
    };

    const paymentObject = new window.Razorpay(options);

    //payment failure handler
    paymentObject.on('payment.failed',async function (response) {
        try {
            //detailed error
            console.error('Razorpay Payment Failed', {
                code: response.error.code,
                description: response.error.description,
                source: response.error.source,
                step: response.error.step,
                reason: response.error.reason
              });
               orderData.items.forEach((item)=>item.paymentStatus='Failed')
              const failedOrderData={
                ...orderData,
               paymentMethod:"Razorpay",
               paymentStatus:"Failed"
              }

              onSuccess(failedOrderData)
            //   await axiosInstance.post(`api/users/orders/update-payment-status`,{
            //     orderId:orderId||data.order.id,
            //     status:'payment_failed',
            //     errorSetails:{
            //         code:response.error.code,
            //         description:response.error.description
            //     }
            //   })
              const errorMessage = response.error.description || 'Payment failed';
              onError(new Error(errorMessage));
        } catch (updateError) {
            console.error("Failed to update order status",updateError);
            
        }
    })
    paymentObject.open();
  } catch (error) {
    console.log("payment not completed", error);

    onError(error);
  }
};

export const retryPayment=async(finalOrderData)=>{
  const{_id,paymentStatus,paymentMethod,transactionId}=finalOrderData

try {
   const response= await axiosInstance.put(`/api/users/orders/${_id}/status`,{
      paymentMethod,
      paymentStatus,
      transactionId
    })
    return response.data.order;
} catch (error) {
  console.log("error in retrying paymnet",error);
  
  throw new Error("Failed to update payment status");
}
}