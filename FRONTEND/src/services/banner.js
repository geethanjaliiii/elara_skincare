import { axiosInstance } from "@/config/axiosConfig";

export const fetchBanners=async()=>{
    try {
      const response=  await axiosInstance.get('/api/users/banners')
      return response.data.banners
    } catch (error) {
        console.log("error fetching banners",error);
        throw error
    }
}