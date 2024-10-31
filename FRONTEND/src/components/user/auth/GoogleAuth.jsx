import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import {axiosInstance} from "@/config/axiosConfig";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function GoogleAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const handleError = (error) => {
    console.log("google auth failed",error);
  };
  //handle succe
  //api call with token id
  //in response we will get user details
  //dispatch the details in user

  async function handleSuccess(response) {
    const { credential } = response; //this contain token id
    try {
      const result = await axiosInstance.post("/api/users/google-auth", {
        token: credential,
      });
      if (result.data.success) {
        const{accessToken}= result.data
        dispatch(setUserDetails(result.data.user));
        localStorage.setItem('accessToken',accessToken)
        navigate("/");
      }
      console.log("Sign in with google success");
    } catch (error) {
      if(error.status===403){
        toast.error("Account is blocked")
      }
      console.log("error in google signin",error);
    }
  }
  return (
    <div className="flex justify-center">
      <Toaster/>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}
export default GoogleAuth;
