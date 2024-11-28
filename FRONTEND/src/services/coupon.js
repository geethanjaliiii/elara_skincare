import { adminAxiosInstance, axiosInstance } from "@/config/axiosConfig"

export const getAvaliableCoupons= async(cartValue,userId)=>{
  try {
    console.log(cartValue,userId);
    
    const {data}= await axiosInstance.get(`/api/users/${userId}/coupons?cartValue=${cartValue}`)
    console.log("coupons available",data?.coupons);
    
    return data?.coupons
  } catch (error) {
    const errorMessage=error?.response?.data?.message||'failed to fetch coupons'
    console.error('Error fetching available coupons ',errorMessage);
   
  }
}

export const applyCoupon=async(userId,code,cartValue)=>{
 
  
  const {data}=await axiosInstance.post(`/api/users/${userId}/coupons`,{code,cartValue})
return data
}

export const showCoupons=async()=>{
//   const {data}=await axiosInstance.get(`/api/users/coupons`)
// return data
try {
  const { data } = await axiosInstance.get(`/api/users/coupons`);
  return data; // Ensure the API returns an object with 'coupons' and 'expiredCoupons'
} catch (error) {
  console.error("Error fetching coupons:", error);
  throw new Error(error.response?.data?.message || "Failed to fetch coupons");
}
}

export const changeCouponStatus=async(couponId)=>{
try {
  console.log("changing status",couponId);
  
 const{data}= await adminAxiosInstance.patch(`/api/admin/coupons/${couponId}`)
 return data
} catch (error) {
  console.log("coupon status not changed",error);
  throw new Error(error.response?.data?.message || "Failed to fetch coupons");
}
}