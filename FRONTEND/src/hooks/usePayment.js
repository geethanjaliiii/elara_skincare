import { useState } from "react";
import { addMoneyToWallet, initiateRazorpayPayment } from "../services/razorpay";

export const usePayment =(orderMutation,toast)=>{
    const handleRazorpayPayment=async(orderData,orderId)=>{
        console.log("orderdata in hook",orderData,orderId);
        
        //initialize payment
        await initiateRazorpayPayment({
            orderData,
            orderId,
            onSuccess:(finalOrderData)=>{
                //call api to place order or retry
        
                orderMutation.mutate(finalOrderData);
            },
            onError:(error)=>{
                toast.error(error.message ||'payment failed.please try again.')
            },
            
        })
    }

   
    return {
    handleRazorpayPayment
    }
}
export const useAddMoney=(mutation,toast)=>{
    const handleAddMoneyToWallet=async({userId,amount})=>{
        await addMoneyToWallet({
            userId,
            amount,
            onSuccess:(data)=>{
                console.log(data,'data');
                
                mutation.mutate(data)
            },
            onError:(error)=>{
                toast.error(error.message ||'payment failed.please try again.')
            },
        })
    }
    return{
        handleAddMoneyToWallet
    }
}
