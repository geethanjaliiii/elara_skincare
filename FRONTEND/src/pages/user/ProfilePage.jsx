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
import Wallet from '@/components/user/wallet/wallet'
import Coupons from '@/components/user/coupons/Coupons'
import Wishlist from '@/components/user/whishlist/wishlist'
import ReferAndEarn from '@/components/user/profile/Refer/ReferAndEarn'
import { useNavigate, useSearchParams } from 'react-router-dom'

const ProfilePage = () => {
    // const [activeItem ,setActiveItem]=useState('My Profile')
   const [searchParams,setSearchParams]=useSearchParams()
   const navigate=useNavigate()
    const [user,setUser]=useState({})
    const userId=useSelector((state)=>state?.user?.userInfo?._id)

    //setting active item from search params
    const activeItem=searchParams.get('tab')||'My Profile'
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
    const handleNavigation=(item)=>{
setSearchParams({tab:item})//update the query params
    }
  return (
    <div className="min-h-screen bg-gray-50">
        <Toaster/>
        <Navbar/>
        <div className="container mx-auto px-4 py-8 mt-2 ">
        <Breadcrumbs items={breadcrumbItems} />
        <div className='mt-6 flex flex-col lg:flex-row lg:gap-8'>
            <ProfileSidebar 
               user={user}
               activeItem={activeItem}
               onNavigate={handleNavigation}
               
               />
               <main className="lg:mt-0 flex-grow">
                {activeItem=='My Profile' && <ProfileForm user={user}/>}
                {activeItem=='Address Book' && <AddressBook userId={user._id}/>}
                {activeItem=='My Orders' &&  <Orders/>}
                {activeItem=='Wallet' && <Wallet  />}
                {activeItem=='Coupons' && <Coupons/>}
                {activeItem=='My Wishlist' && <Wishlist/>}
                {activeItem=='Refer & Earn' && <ReferAndEarn user={user}/>}
               </main>
        </div>
        </div>
        <Footer/>
    </div>
  )
}

export default ProfilePage
