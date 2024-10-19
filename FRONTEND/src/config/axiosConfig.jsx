import axios from 'axios'
const apiUrl = import.meta.env.VITE_API_URL
 const axiosInstance = axios.create({
    baseURL:apiUrl,
    withCredentials: true
})
// axiosConfig.js
axiosInstance.interceptors.request.use(
    (config) => {
      // Modify the request configuration
      const token = localStorage.getItem('authToken'); // Assuming you're storing the token in localStorage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Handle the request error
      return Promise.reject(error);
    }
  );
  // axiosConfig.js
axiosInstance.interceptors.response.use(
    (response) => {
      // Handle the response data
      return response;
    },
    async (error) => {
      // Handle errors
      const originalRequest = error.config;
      if (error.response) {
        // Check if the error status is 401 (Unauthorized)
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Prevents infinite loops
          try {
            // Optionally, refresh the token here
            const { data } = await axiosInstance.post('/auth/refresh-token', {
              refreshToken: localStorage.getItem('refreshToken'),
            });
  
            // Update token in localStorage and retry original request
            localStorage.setItem('authToken', data.accessToken);
            axiosInstance.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
  
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // Handle token refresh error (e.g., log out the user)
            console.error('Token refresh failed:', refreshError);
          }
        }
      }
      // Reject the error if not handled
      return Promise.reject(error);
    }
  );
  
  
export default axiosInstance

