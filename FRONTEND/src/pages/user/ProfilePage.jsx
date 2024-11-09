import React, { useEffect, useState } from 'react'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import ProfileForm from '@/components/user/profile/ProfileForm'
import ProfileSidebar from '@/components/user/profile/ProfileSidebar'
import { axiosInstance } from '@/config/axiosConfig'
import { useSelector } from 'react-redux'
import toast,{ Toaster } from 'react-hot-toast'
import AddressBook from '@/components/user/profile/address/AddressBook'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Orders from '@/components/user/profile/orders/Orders'

const ProfilePage = () => {
    const [activeItem ,setActiveItem]=useState('My Profile')
    const [user,setUser]=useState({})
    const userId=useSelector((state)=>state?.user?.userInfo?._id)
    const breadcrumbItems=[
        {label:'Account' , href:'/profile'},
        {label:activeItem}
    ]

    useEffect(()=>{
         async function getUserDetails() {
            try {
              const response = await axiosInstance.get(`/api/users/profile/${userId}`)
              setUser(response.data.user)
              console.log("user ",response.data.user);
              
            } catch (error) {
                console.log("user not found",error);
                toast.error("User not found")
            }
         }
         getUserDetails()
    },[userId])
  return (
    <div className="min-h-screen bg-gray-50">
        <Toaster/>
        <Navbar/>
        <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="grid gap-8 md:grid-cols-[300px_1fr] lg:grid-cols-[300px_1fr]">
            <ProfileSidebar 
               user={user}
               activeItem={activeItem}
               onNavigate={setActiveItem}
               
               />
               <main >
                {activeItem=='My Profile' && <ProfileForm user={user}/>}
                {activeItem=='Address Book' && <AddressBook userId={user._id}/>}
                {activeItem=='My Orders' &&  <Orders/>}
               </main>
        </div>
        </div>
        <Footer/>
    </div>
  )
}

export default ProfilePage
