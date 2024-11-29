import { axiosInstance } from "@/config/axiosConfig"

export const fetchWallet=async(userId)=>{
   const response= await axiosInstance.get(`/api/users/wallet/${userId}`)
return response.data.wallet
}

export const creditMoneyToWallet=async(paymentData)=>{
console.log("pay data",paymentData);

   const response=await axiosInstance.post(`/api/users/wallet/credit`,paymentData)
return response.data
}