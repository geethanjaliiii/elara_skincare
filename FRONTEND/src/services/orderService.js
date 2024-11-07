import { axiosInstance } from "@/config/axiosConfig"


//place new order
export const placeOrder=async(orderData)=>{
    const response=await axiosInstance.post(`/api/users/orders`,orderData);
    return response.data
}

export const getOrderDetails=async(orderId)=>{
    console.log("ordrrId in get details",orderId);
    
    const response=await axiosInstance.get(`/api/users/orders/${orderId}`);
    console.log(" order details",response);
    
    return response.data.order
}

export const getAllOrders=async(userId)=>{
    const response=await axiosInstance.get(`/api/users/${userId}/orders`)
    return response.data.orders
}