import { axiosInstance } from "@/config/axiosConfig";
import { current } from "@reduxjs/toolkit";


export const loadRazorpayScript = ()=>{
      return new Promise((resolve)=>{
        const script=document.createElement('script');
        script.src='https://checkout.razorpay.com/v1/checkout.js';
        script.async =true;
        script.onload=()=>resolve(true);
        script.onerror=()=>resolve(false);
        document.body.appendChild(script);
      })
}

export const initiateRazorpayPayment=async({
    orderData,
    onSuccess,
    onError
})=>{
    try {
        const isLoaded =await loadRazorpayScript();
        if(!isLoaded){
            throw new Error('Razorpay SDK failed to load');
        }
        const {data}=await axiosInstance.post(`/api/users/payment/create-order`,{
            amount:orderData.totalAmount});
        if(!data.success) throw new Error('Failed to create order')

            const options={
                key:import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount:data.order.amount,
                currency:data.order.currency,
                name:'ELARA',
                description:'Product Purchase',
                order_id:data.order.id,
                handler:async(response)=>{
                    console.log("create payment resp",response);
                    
                    const {data:verificationData}=await axiosInstance.post('/api/users/payment/verify-payment',{
                        razorpay_order_id:response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                     razorpay_signature: response.razorpay_signature,
                    });
                    if(verificationData.success){
                        const finalOrderData ={
                            ...orderData,
                            transactionId:response.razorpay_payment_id,
                            paymentMethod:'Razorpay',
                        };
                        onSuccess(finalOrderData)
                    }else{
                        throw new Error('Payment verification failed');
                    }
                }, 
                prefill: {
                    name: orderData.shippingAddress.fullName,
                    email: orderData.shippingAddress.email,
                    contact: orderData.shippingAddress.phone
                  }, 
                   theme: {
                    color: "#000000"
                  }

            };
            const paymentObject =new window.Razorpay(options);
            paymentObject.open();
    } catch (error) {
        onError(error)
    }
}