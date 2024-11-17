import { adminAxiosInstance} from "@/config/axiosConfig"


export const getCategories =async()=>{
    try {
        const response=await adminAxiosInstance.get("/api/admin/categories")
        return response?.data?.categories
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error
    }
    
}

export const changeCategoryStatus=async(categoryId)=>{
    try {
       await adminAxiosInstance.patch(`/api/admin/categories/list/${categoryId}`);
        
    } catch (error) {
        console.error('error updating status of category')
        throw error
    }
}

