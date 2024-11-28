import CartItem from "@/components/user/cart/CartItem";
import { axiosInstance } from "@/config/axiosConfig";

export const addToCart=async({userId,cartItem})=>{
  const response=  await axiosInstance.post(`/api/users/${userId}/cart`,
        cartItem)
        return response.data
}