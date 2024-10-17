// components/Header.tsx
import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-white p-4 shadow-md">
      <div className="flex items-center">
        <FiSearch className="text-gray-600 mr-4" />
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex items-center space-x-4">
        <FiBell className="text-gray-600" />
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      </div>
    </header>
  );
};

export default Header;
