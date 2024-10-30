import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate,Navigate } from 'react-router-dom'


const IsUserLogin = ({children}) => {
   
const userInfo =useSelector((state)=>state?.user?.userInfo)
if(!userInfo){
    return <Navigate to={'/login'}/>
}
return children
}

export default IsUserLogin
