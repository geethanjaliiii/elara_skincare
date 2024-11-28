import { adminAxiosInstance } from "@/config/axiosConfig"

export const getReturnRequests=async()=>{
    try {
      const{data}=  await adminAxiosInstance.get('api/admin/orders/return')
      return data.pendingRequests
    } catch (error) {
        throw new Error(error?.response?.data?.message||'Failed to fetch return requests')
    }
}
export const approveReturn=async(orderId,itemId)=>{
    const response=await adminAxiosInstance.put(`/api/admin/orders/${orderId}/approve/${itemId}`)
    return response.data
    }
   export const declineReturn=async(orderId,itemId)=>{
    const response=await adminAxiosInstance.put(`/api/admin/orders/${orderId}/decline/${itemId}`)
    return response.data
    }