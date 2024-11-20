import { axiosInstance } from "@/config/axiosConfig"

export const addToWishlist=async(productId,size)=>{
  const response= await axiosInstance.post('/api/users/wishlist',{productId,size})
   
}