// components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiSettings,FiPercent } from 'react-icons/fi';
import {
  FaUsers,
  FaChartLine,
  FaTags,
  FaClipboardList,
  FaImage,
  FaSignOutAlt,
  FaThList,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FiHome /> },
    { name: 'Products', path: '/admin/dashboard/products', icon: <FiShoppingCart /> },
    { name: 'Customers', path: '/admin/dashboard/customers', icon: <FaUsers /> },
    { name: 'Sales', path: '/admin/dashboard/sales', icon: <FaChartLine /> },
    { name: 'Order List', path: '/admin/dashboard/orders', icon: <FaClipboardList /> },
    { name: 'Coupons', path: '/admin/dashboard/coupons', icon: <FaTags /> },
    {name:'offers',path:'/admin/dashboard/offers' ,icon:<FiPercent/> },
    { name: 'Banner', path: '/admin/dashboard/banners', icon: <FaImage /> },
    { name: 'Categories', path: '/admin/dashboard/categories', icon: <FaThList /> }, // New Category option
 
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static w-64 h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out`}
    >
      <div className="p-6 flex items-center justify-between md:justify-center">
        <h2 className="text-xl font-bold">Elara Admin</h2>
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-600 focus:outline-none"
        >
          ✕
        </button>
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-3 my-2 transition-colors duration-200 text-gray-600 rounded-lg hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100' : ''
                  }`
                }
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

