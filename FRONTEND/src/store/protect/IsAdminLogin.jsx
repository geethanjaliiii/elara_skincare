import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate,Navigate } from 'react-router-dom'


const IsAdminLogin = ({children}) => {
    const navigate=useNavigate()
const adminInfo =useSelector((state)=>state?.admin?.adminInfo)
if(!adminInfo){
    return <Navigate to={'/admin'}/>
}
return children
}

export default IsAdminLogin
