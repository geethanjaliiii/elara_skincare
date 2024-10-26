import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL


 const axiosInstance = axios.create({
    baseURL:apiUrl,
    withCredentials: true
})

//interceptor to add access token to header
axiosInstance.interceptors.request.use(
    (config) => {
      // Modify the request configuration
      const token = localStorage.getItem('accessToken'); 
      console.log('accesstok',token);
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
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
      return response;
    },
    async (error) => {
      // Handle errors
      const originalRequest = error.config;
      if (error.response) {
        // Check if the error status is 401 (Unauthorized) and the request hasn't been retried yet
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Prevents infinite loops
          try {
            //refresh the access token with refresh token in cookie
            const refreshResponse = await axiosInstance.post('/api/users/refresh-token', {
              refreshToken: getCookie('userRefreshToken'),
            });
             
             const newAccessToken =refreshResponse.data.accessToken 
             localStorage.setItem('accessToken',newAccessToken)  //store new token

             //update autorization header with new token
             axiosInstance.defaults.headers.common['Authorization'] =`Bearer ${newAccessToken}`

             //retry the original request with new token
             return axiosInstance(originalRequest)
           
          } catch (refreshError) {
            //if refreshing fails ,redirect to login page
             // Redirect the user to the login page
      window.location.href = "/login";
          }
        }
      }
      // Reject the error if not handled
      return Promise.reject(error);
    }
  );
  
  
export default axiosInstance

