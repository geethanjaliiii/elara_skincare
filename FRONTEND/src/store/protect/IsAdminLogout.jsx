import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate,Navigate } from 'react-router-dom'

const IsAdminLogout = ({children}) => {
 const navigate =useNavigate()
 const adminInfo = useSelector((state)=>state?.admin.adminInfo)
 if(adminInfo){
    //login
    console.log("admin active");
    
    return  <Navigate to={'/admin/dashboard'}/>
 }
 return children
}

export default IsAdminLogout
