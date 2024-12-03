import { adminAxiosInstance, axiosInstance } from "@/config/axiosConfig"

export const createBanner=async(bannerData)=>{
    try {
        console.log("banner data",bannerData);
        
        const response=  await adminAxiosInstance.post(`/api/admin/banners`,bannerData)
        return response.data
    } catch (error) {
        console.error("Error fetching banners:", error);
        throw error
    }

}

export const getBanners=async(req,res)=>{
    
    const response= await adminAxiosInstance.get('/api/admin/banners')
    return response.data?.banners
}

export const deleteBanner=async(id)=>{
    const response=await adminAxiosInstance.patch(`/api/admin/banners/${id}`)
}

export const updateBanner=async({id,updatedData})=>{
    const response=await adminAxiosInstance.put(`/api/admin/banners/${id}`,updatedData)
    return response.data
}