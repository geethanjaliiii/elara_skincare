import { axiosInstance } from "@/config/axiosConfig"

export const fetchWallet=async(userId)=>{
   const response= await axiosInstance.get(`/api/users/wallet/${userId}`)
return response.data.wallet
}

