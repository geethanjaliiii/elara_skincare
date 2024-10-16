// components/AdminLogin.tsx
import React from 'react';

const AdminLogin = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/images/ELARA_LOGO.png"
            alt="Elara Logo"
            className="w-60 h-60"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center">ADMIN LOGIN</h2>

        {/* Form */}
        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email Here"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password Here"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 mt-4 font-semibold text-white bg-gold hover:bg-opacity-90 rounded-md"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
