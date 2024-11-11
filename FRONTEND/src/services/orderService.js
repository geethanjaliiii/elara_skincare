import { adminAxiosInstance, axiosInstance } from "@/config/axiosConfig"


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

export const cancelOrder=async(orderId,itemId)=>{
    const response=await axiosInstance.patch(`api/users/orders/${orderId}/items/${itemId}`)
    return response.data.order
}
//*********************admin*********************** */
export const changeStatus = async (orderId, itemId, newStatus) => {
    const response = await adminAxiosInstance.patch(
      `/api/admin/orders/${orderId}/items/${itemId}`,
      { status: newStatus }
    );
    return response.data.item;
  };

  export const getOrders=async()=>{
    const response=await adminAxiosInstance.get('/api/admin/orders')
    return response.data.orders
}