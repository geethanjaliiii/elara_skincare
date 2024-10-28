import axios from "axios";
import store from '../store/store'
import {logoutUser} from '../store/slices/userSlice'
import { Cookie } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
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
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    if (error.response) {
      // Check if the error status is 401 (Unauthorized) and the request hasn't been retried yet
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevents infinite loops
        console.log("retrying request");

        try {
          console.log("attempting to refresh token");
          console.log("refreshToken from cookie");
          retry = true;
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
          window.location.href = "/";
          throw new Error("Session expired. Redirecting to login.");
        }
      }
    }

    // Reject the error if not handled
    return Promise.reject(error);
  }
);

export default axiosInstance;
