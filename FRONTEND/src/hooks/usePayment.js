import { initiateRazorpayPayment } from "../services/razorpay";

export const usePayment =(orderMutation,toast)=>{
    const handleRazorpayPayment=async(orderData)=>{
        await initiateRazorpayPayment({
            orderData,
            onSuccess:(finalOrderData)=>{
             orderMutation.mutate(finalOrderData);
            },
            onError:(error)=>{
                toast.error(error.message ||'payment failed.please try again.')
            }
        })
    }
    return {
    handleRazorpayPayment
    }
}