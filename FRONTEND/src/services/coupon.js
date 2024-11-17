import { axiosInstance } from "@/config/axiosConfig"

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
