import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate,Navigate } from 'react-router-dom'

const IsUserLogout = ({children}) => {
 
 const userInfo = useSelector((state)=>state?.user.userInfo)
 if(userInfo){
    //login
    console.log("admin active");
    
    return  <Navigate to={'/'}/>
 }
 return children
}

export default IsUserLogout
