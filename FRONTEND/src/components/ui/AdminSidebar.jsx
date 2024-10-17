// // components/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiSettings } from 'react-icons/fi';
import { FaUsers, FaChartLine, FaTags, FaClipboardList, FaImage, FaSignOutAlt } from 'react-icons/fa'; // Changed FaBanner to FaImage

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Products', path: '/products', icon: <FiShoppingCart /> },
    { name: 'Customers', path: '/customers', icon: <FaUsers /> },
    { name: 'Sales', path: '/analytics', icon: <FaChartLine /> },
    { name: 'Order List', path: '/orders', icon: <FaClipboardList /> },
    { name: 'Coupons', path: '/coupons', icon: <FaTags /> },
    { name: 'Banner', path: '/banner', icon: <FaImage /> }, // Use FaImage instead of FaBanner
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
    { name: 'Logout', path: '/logout', icon: <FaSignOutAlt /> },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-md fixed">
      <div className="p-6">
        <h2 className="text-xl font-bold">Elara Admin</h2>
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


// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { FiHome, FiShoppingCart, FiSettings } from 'react-icons/fi';
// import { FaUsers, FaChartLine } from 'react-icons/fa';

// const Sidebar = () => {
//   const menuItems = [
//     { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
//     { name: 'Products', path: '/products', icon: <FiShoppingCart /> },
//     { name: 'Customers', path: '/customers', icon: <FaUsers /> },
//     { name: 'Sales', path: '/analytics', icon: <FaChartLine /> },
//     { name: 'Settings', path: '/settings', icon: <FiSettings /> },
//   ];

//   return (
//     <aside className="w-64 h-screen bg-white shadow-md fixed">
//       <div className="p-6">
//         <h2 className="text-xl font-bold">Elara Admin</h2>
//       </div>
//       <nav className="mt-6">
//         <ul>
//           {menuItems.map((item) => (
//             <li key={item.name}>
//               <NavLink
//                 to={item.path}
//                 className={({ isActive }) =>
//                   `flex items-center p-3 my-2 transition-colors duration-200 text-gray-600 rounded-lg hover:bg-gray-100 ${
//                     isActive ? 'bg-gray-100' : ''
//                   }`
//                 }
//               >
//                 <span className="text-lg mr-3">{item.icon}</span>
//                 <span>{item.name}</span>
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
