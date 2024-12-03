import { axiosInstance } from "@/config/axiosConfig";
import axios from "axios";

export const uploadImageToCloudinary=async(file)=>{
    const formData=new FormData()
  formData.append('file',file)
  formData.append('upload_preset','banner_images')
  formData.append('folder', 'banners'); 
  try {
  const response=  await axios.post('https://api.cloudinary.com/v1_1/dby2ebbkr/image/upload',formData,{
    headers: {
    'Content-Type': 'multipart/form-data',
  },})
  console.log('Upload Success:', response.data);  
  return response.data.secure_url;
} catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
}