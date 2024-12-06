// components/Header.tsx
import React from 'react';
import { FiSearch, FiBell, FiMenu } from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import { logoutAdmin } from '@/store/slices/adminSlice';
import { adminAxiosInstance } from '@/config/axiosConfig';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
 async function handleLogout(){
      try {
       const response= await adminAxiosInstance.post('/api/admin/logout')
       dispatch(logoutAdmin())
       localStorage.removeItem("adminAccessToken")
       toast.success("Admin logged out successfully")
       setTimeout(()=>{
        navigate('/admin')
       },500)
      } catch (error) {
        console.log("error logout",error.message);
        toast.error("Logout failed!")
      }
  }
  return (
    <header className="flex justify-between items-center bg-white p-4 shadow-md">
      <Toaster/>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 focus:outline-none md:hidden"
        >
          <FiMenu />
        </button>
      </div>
      
      <Button onClick={handleLogout}>Logout</Button>
    </header>
  );
};

export default Header;

