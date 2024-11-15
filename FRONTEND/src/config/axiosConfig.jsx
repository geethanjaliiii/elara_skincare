import axios from "axios";
import store from '../store/store'
import {logoutUser} from '../store/slices/userSlice'
import { logoutAdmin } from "@/store/slices/adminSlice";


const apiUrl = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

//interceptor to add access token to header
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify the request configuration
    const token = localStorage.getItem("accessToken");
    console.log("accesstok", token);

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the request error
    return Promise.reject(error);
  }
);

//Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    //if response is successfull ,return it
    console.log("refresh response", response);

    return response;
  },
  async (error) => {
    // Handle errors
    console.log("error", error);

    const originalRequest = error.config;
    // if (originalRequest._retry) {
    //   return Promise.reject(error);
    // }
    if (error.response) {
      // Check if the error status is 401 (Unauthorized) and the request hasn't been retried yet
      if (error.response.status === 401 && error.response.data.error==='Invalid token' && !originalRequest._retry) {
        originalRequest._retry = true; // Prevents infinite loops
        console.log("retrying request");

        try {
          console.log("attempting to refresh token");
          console.log("refreshToken from cookie");
         
          const refreshResponse = await axiosInstance.post(
            "/api/users/refresh-token"
          );

          console.log(
            "access token refreshed refresh response;-",
            refreshResponse
          );

          const newAccessToken = refreshResponse.data.accessToken;

          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken); //store new token

            console.log("new access token", newAccessToken);

            //update autorization header with new token
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            //retry the original request with new token
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          //if refreshing fails ,redirect to login page
          // Redirect the user to the login page
          console.log("redirecting user to home page");
          localStorage.removeItem("accessToken");
          store.dispatch(logoutUser())
          window.location.href = "/login";
          throw new Error("Session expired. Redirecting to login.");
        }
      }
    }
    // Reject the error if not handled
    return Promise.reject(error);
  }
);


export const adminAxiosInstance =axios.create({
  baseURL:apiUrl,
  withCredentials: true
})

adminAxiosInstance.interceptors.request.use(
  (config)=>{
    const token =localStorage.getItem("adminAccessToken")
    if(token){
      config.headers['Authorization']=`Bearer ${token}`
    }
    return config;
  },
  (error)=>{
    return Promise.reject(error)
  }
)

adminAxiosInstance.interceptors.response.use((response)=>{
  console.log("admin refresh response",response);
  return response
},
async(error)=>{
  const originalRequest=error.config;
  if(error.response){
    if(error.response.status===401 && error.response.data.error==='Invalid access token' && !originalRequest._retry){
      originalRequest._retry=true;
      console.log("rerying req");
      try {
        const refreshResponse=await adminAxiosInstance.post('/api/admin/refresh-token')
        const newAccessToken= refreshResponse.data.adminAccessToken
        if(newAccessToken){
          localStorage.setItem("adminAccessToken",newAccessToken)
          console.log("new access token");

          adminAxiosInstance.defaults.headers.common['Authorization']=`Bearer ${newAccessToken}`  
          return adminAxiosInstance(originalRequest);      }
      } catch (error) {
        localStorage.removeItem("adminAccessToken")
        store.dispatch(logoutAdmin())
        console.log("session expired",error);
        window.location.href = "/admin";
       
        
          throw new Error("Session expired. Redirecting to login.");
      }
    }
  }
  return Promise.reject(error);
})