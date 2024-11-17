import { adminAxiosInstance } from "@/config/axiosConfig";

export const getProducts=async()=>{
    try {
        const response=await adminAxiosInstance.get('/products')
        return response.data?.products
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error
    }
}