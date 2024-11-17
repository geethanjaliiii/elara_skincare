import { adminAxiosInstance } from "@/config/axiosConfig"

export const addCoupon=async(couponData)=>{
    const {data}= await adminAxiosInstance.post('/api/admin/coupons',couponData)
    return data
}
export const fetchCoupons=async()=>{
    const response=await adminAxiosInstance.get('/api/admin/coupons')
    return response?.data?.coupons
}