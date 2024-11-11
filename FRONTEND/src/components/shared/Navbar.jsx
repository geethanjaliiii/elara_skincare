import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FiShoppingCart, FiMenu } from 'react-icons/fi';
import { FaUser, FaHeart, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/userSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    document.cookie = "userRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(logoutUser());
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50">
      <div className={`w-full  px-4 py-3 flex items-center justify-between transition-all ease-in-out duration-300 ${isScrolled ? 'bg-white bg-opacity-90 shadow-lg' : 'bg-white'} md:rounded-b-lg`}>
        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-serif cursor-pointer" onClick={() => navigate('/')}>
          Elara
        </h1>

        {/* Centered Nav Links and Search */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
          <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
        </div>

        {/* Search and Icons */}
        <div className="flex items-center space-x-4">
          {/* Search Box */}
          <div className=" sm:flex items-center relative">
            <input
              type="text"
              placeholder="Search"
              className="w-24  md:w-36 lg:w-48 rounded-full border bg-gray-100 px-3 py-1 text-sm focus:outline-none focus:ring focus:border-primary"
            />
            <FaSearch className="absolute right-3 top-2 text-gray-500" />
          </div>

          {!isLoggedIn && (
            <Button className="hidden md:block font-medium" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}

          <button onClick={handleCartClick} className="relative">
            <FiShoppingCart className=" sm:text-xs transition-transform text-black/80 transform hover:scale-110 md:h-4 w-4" />
          </button>
          <Link to="/wishlist">
            <FaHeart className="sm:text-xs md:h-4 w-4  text-black/80 transition-transform transform hover:scale-110 hover:text-red-500" />
          </Link>

          {isLoggedIn && (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center">
                <FaUser className="sm:text-xs md:h-4 w-4  text-black/80 transition-transform transform hover:scale-110" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FiMenu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
            <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
            {!isLoggedIn && (
              <Button className="font-medium" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
            {isLoggedIn && (
              <>
                <Link to="/profile" className="text-sm font-medium hover:text-primary">Profile</Link>
                <button className="text-sm text-left font-medium hover:text-primary" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;


// import { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { FiShoppingCart, FiMenu } from 'react-icons/fi';
// import { FaUser, FaHeart, FaSearch } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logoutUser } from '../../store/slices/userSlice';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const isLoggedIn = useSelector((state) => state.user.userInfo);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleCartClick = () => {
//     if (isLoggedIn) {
//       navigate('/cart');
//     } else {
//       navigate('/login');
//     }
//   };

//   const handleLogout = () => {
//     document.cookie = "userRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     dispatch(logoutUser());
//     navigate('/');
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 40);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   return (
//     <header className="fixed top-0 w-full z-50">
//       <div className={`container mx-auto px-4 py-3 flex items-center justify-between border-b rounded-b-lg transition-all ease-in-out duration-300 ${isScrolled ? 'bg-white bg-opacity-70 shadow-lg' : 'bg-white'}`}>
//         {/* Logo */}
//         <h1 className="text-2xl font-serif cursor-pointer" onClick={() => navigate('/')}>Elara</h1>
        
//         {/* Centered Nav Links and Search */}
//         <div className="flex items-center space-x-6">
//           <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
//           <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
//           <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
//           <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
//         </div>

//         {/* Search and Icons */}
//         <div className="flex items-center space-x-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search"
//               className="rounded-full border bg-gray-100 px-4 py-1 text-sm focus:outline-none focus:ring focus:border-primary-light"
//             />
//             <FaSearch className="absolute right-2 top-2 " />
//           </div>
//           {!isLoggedIn && (
//             <Button className="font-medium w-20" onClick={() => navigate('/login')}>Login</Button>
//           )}
//           <button onClick={handleCartClick} className="relative">
//             <FiShoppingCart className=" transition-transform transform hover:scale-110" />
//           </button>
//           <Link to="/wishlist">
//             <FaHeart className=" transition-transform transform hover:scale-110 hover:text-red-500" />
//           </Link>
//           {isLoggedIn && (
//             <div className="relative">
//               <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center">
//                 <FaUser className=" transition-transform transform hover:scale-110" />
//               </button>
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//                   <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
//                   <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//           <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//             <FiMenu className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <nav className="md:hidden border-t mt-16">
//           <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
//             <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
//             <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
//             <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
//             <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
//           </div>
//         </nav>
//       )}
//     </header>
//   );
// };

// export default Navbar;



// import { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { FiShoppingCart, FiMenu } from 'react-icons/fi';
// import { FaUser, FaHeart, FaSearch } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logoutUser } from '../../store/slices/userSlice';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const isLoggedIn = useSelector((state) => state.user.userInfo);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleCartClick = () => {
//     if (isLoggedIn) {
//       navigate('/cart');
//     } else {
//       navigate('/login');
//     }
//   };

//   const handleLogout = () => {
//     document.cookie = "userRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     dispatch(logoutUser());
//     navigate('/');
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 0);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   return (
//     <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-opacity-90 shadow-lg' : 'bg-opacity-10'}`}>
//       <div className="container mx-auto px-4 py-3 flex items-center justify-between bg-white ">
//         {/* Logo */}
//         <h1 className="text-2xl font-serif cursor-pointer" onClick={() => navigate('/')}>Elara</h1>
        
//         {/* Centered Nav Links and Search */}
//         <div className="flex items-center space-x-6">
//           <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
//           <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
//           <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
//           <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
//         </div>

//         {/* Search and Icons */}
//         <div className="flex items-center space-x-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search"
//               className="rounded-full border bg-gray-100 px-4 py-1 text-sm focus:outline-none focus:ring focus:border-primary-light"
//             />
//             <FaSearch className="absolute right-2 top-2 text-muted-foreground" />
//           </div>
//           {!isLoggedIn && (
//             <Button className="font-medium w-20" onClick={() => navigate('/login')}>Login</Button>
//           )}
//           <button onClick={handleCartClick} className="relative">
//             <FiShoppingCart className="text-muted-foreground transition-transform transform hover:scale-110" />
//           </button>
//           <Link to="/wishlist">
//             <FaHeart className="text-muted-foreground transition-transform transform hover:scale-110 hover:text-red-500" />
//           </Link>
//           {isLoggedIn && (
//             <div className="relative">
//               <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center">
//                 <FaUser className="text-muted-foreground transition-transform transform hover:scale-110" />
//               </button>
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//                   <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
//                   <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//           <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//             <FiMenu className="h-5 w-5" />
//           </Button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <nav className="md:hidden border-t mt-16">
//           <div className="container mx-auto px-4 py-2 flex flex-col space-y-2 space-x-2">
//             <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
//             <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
//             <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
//             <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
//           </div>
//         </nav>
//       )}
//     </header>
//   );
// };

// export default Navbar;



// import { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { FiSearch, FiShoppingCart, FiMenu } from 'react-icons/fi';
// import { FaUser, FaHeart } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logoutUser } from '../../store/slices/userSlice';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [navbarOpacity, setNavbarOpacity] = useState(1); // State for navbar opacity
//   const isLoggedIn = useSelector((state) => state.user.userInfo);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       const newOpacity = scrollTop > 100 ? 0.7 : 1; // Adjust the opacity based on scroll position
//       setNavbarOpacity(newOpacity);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   const handleCartClick = () => {
//     if (isLoggedIn) {
//       navigate('/cart');
//     } else {
//       navigate('/login');
//     }
//   };

//   const handleLogout = () => {
//     document.cookie = "userRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     dispatch(logoutUser());
//     navigate('/');
//   };

//   return (
//     <>
//       <header
//         className="fixed top-0 w-full z-50 border-b bg-white shadow-md transition-opacity duration-300"
//         style={{ opacity: navbarOpacity }}
//       >
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <h1 className="text-2xl font-serif cursor-pointer" onClick={() => navigate('/')}>Elara</h1>
//           <nav className="hidden md:flex space-x-6">
//             <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
//             <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
//             <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
//             <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
//           </nav>
//           <div className="flex items-center space-x-4">
//             {!isLoggedIn && (<Button className="font-medium w-20" onClick={() => navigate('/login')}>Login</Button>)}
//             <FiSearch className="text-muted-foreground" />
//             <button onClick={handleCartClick} className="relative">
//               <FiShoppingCart className="text-muted-foreground transition-transform transform hover:scale-110" />
//             </button>
//             <Link to="/wishlist">
//               <FaHeart className="text-muted-foreground stroke-current stroke-2 transition-colors duration-300 transform hover:scale-110 hover:text-red-500" />
//             </Link>
//             {isLoggedIn && (
//               <div className="relative">
//                 <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center">
//                   <FaUser className="text-muted-foreground transition-transform transform hover:scale-110" />
//                 </button>
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//                     <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
//                     <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//             <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//               <FiMenu className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//       </header>
//       {isMenuOpen && (
//         <nav className="md:hidden border-t mt-16">
//           <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
//             <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
//             <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
//             <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
//             <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
//           </div>
//         </nav>
//       )}
//     </>
//   );
// };

// export default Navbar;





// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { FiSearch, FiShoppingCart, FiMenu } from 'react-icons/fi';
// import { FaUser, FaHeart } from 'react-icons/fa';
// import { Link, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { logoutUser } from '../../store/slices/userSlice';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const isLoggedIn = useSelector((state) => state.user.userInfo);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleCartClick = () => {
//     if (isLoggedIn) {
//       navigate('/cart');
//     } else {
//       navigate('/login');
//     }
//   };

//   const handleLogout = () => {
//     document.cookie = "userRefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     dispatch(logoutUser());
//     navigate('/')
//   };

//   return (
//     <>
//       <header className="fixed top-0 w-full z-50 border-b bg-white shadow-md">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <h1 className="text-2xl font-serif cursor-pointer" onClick={() => navigate('/')}>Elara</h1>
//           <nav className="hidden md:flex space-x-6">
//             <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
//             <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
//             <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
//             <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
//           </nav>
//           <div className="flex items-center space-x-4">
//             {!isLoggedIn && (<Button className="font-medium w-20" onClick={() => navigate('/login')}>Login</Button>)}
//             <FiSearch className="text-muted-foreground" />
//             <button onClick={handleCartClick} className="relative">
//               <FiShoppingCart className="text-muted-foreground transition-transform transform hover:scale-110" />
//             </button>
//             <Link to="/wishlist">
//               <FaHeart className="text-muted-foreground stroke-current stroke-2 transition-colors duration-300 transform hover:scale-110 hover:text-red-500" />
//             </Link>
//             {isLoggedIn && (
//               <div className="relative">
//                 <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center">
//                   <FaUser className="text-muted-foreground transition-transform transform hover:scale-110" />
//                 </button>
//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//                     <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
//                     <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//             <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//               <FiMenu className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
//       </header>
//       {isMenuOpen && (
//         <nav className="md:hidden border-t mt-16">
//           <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
//             <Link to="/" className="text-sm font-medium hover:text-primary">HOME</Link>
//             <Link to="/shop" className="text-sm font-medium hover:text-primary">SHOP</Link>
//             <Link to="/about" className="text-sm font-medium hover:text-primary">ABOUT US</Link>
//             <Link to="/contact" className="text-sm font-medium hover:text-primary">CONTACT</Link>
//           </div>
//         </nav>
//       )}
     
//     </>
//   );
// };

// export default Navbar;
