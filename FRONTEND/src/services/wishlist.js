import { axiosInstance } from "@/config/axiosConfig"

// export const addToWishlist=async(productId,size,userId)=>{
//   const response= await axiosInstance.post(`/api/users/wishlist/${userId}`,{productId,size})
//    return response
// }

export const getWishlist = async ({ userId }) => {
  if (!userId) {
    throw new Error('userId is required');
  }
  try {
    const response = await axiosInstance.get(`/api/users/wishlist/${userId}`);
    return response.data.wishlist;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error; 
  }
}

export const toggleWishlistItem=async({userId,productId,size})=>{
  const response=   await axiosInstance.post(`api/users/wishlist/toggle`,{productId,userId,size})
   return response.data
 }


export const removeFromWishlist = async ({ userId, itemId }) => {
  const response = await axiosInstance.delete(`/api/users/${userId}/wishlist/${itemId}`);
  return response.data;
};