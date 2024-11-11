import { axiosInstance } from "@/config/axiosConfig";

export const sendOtp=(email)=>axiosInstance.post('/api/users/forget-password',{email})

export const resendOtp=(email)=>axiosInstance.post('/api/users/resend-otp',{email})

export const verifyOtp=(email,otp)=>axiosInstance.post('/api/users/reset/verify-otp',{email,otp})

export const resetPassword=(email,password)=>axiosInstance.post('/api/users/reset-password',{email,password})