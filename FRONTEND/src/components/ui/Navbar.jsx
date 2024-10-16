// components/ui/Navbar.tsx
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FiSearch, FiShoppingCart, FiMenu } from 'react-icons/fi';
import { FaUser, FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import {logoutUser} from '../../store/slices/userSlice'
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const dispatch= useDispatch()
  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  const handleLogout=()=>{
       dispatch(logoutUser())
  }
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-serif">Elara</h1>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
          <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <FiSearch className="text-muted-foreground" />
          <button onClick={handleCartClick} className="relative">
            <FiShoppingCart
              className="text-muted-foreground transition-transform transform hover:scale-110"
            />
          </button>
          <Link to="/wishlist">
            <FaHeart 
              className="text-muted-foreground stroke-current stroke-2 transition-colors duration-300  transform hover:scale-110 hover:text-red-500"
            />
          </Link>
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center"
              >
                <FaUser className="text-muted-foreground transition-transform transform hover:scale-110" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FiMenu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden border-t">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
            <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;


