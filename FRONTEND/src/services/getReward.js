import { axiosInstance } from "@/config/axiosConfig"

export const claimReward=async(userId,code)=>{
    try {
        console.log("claim reward");
        
      const response=  await axiosInstance.post(`/api/users/${userId}/referral`,{code})
        return response.data
    } catch (error) {
        console.error("Referal reward not claimed.",error);
        throw (error||"Referal reward not claimed.")
    }
}