import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AddressProvider } from "./context/AddressContext.jsx";
import { CouponProvider } from "@/context/CouponContext";
// Lazy load components
//auth
const UserSignup = lazy(() => import("./pages/user/auth/UserSignup"));
const UserLogin = lazy(() => import("./pages/user/auth/UserLogin"));
const AdminLoginPage = lazy(() => import("./pages/admin/adminLoginPage"));
//admin
const Customers = lazy(() => import("./components/admin/Customers"));
const Categories = lazy(() => import("./components/admin/categories/Categories.jsx"));
const DashboardLayout = lazy(() => import("./pages/admin/DashboardLayout"));
const AddCategory = lazy(() => import("./components/admin/categories/AddCategory.jsx"));
const EditCategory = lazy(() => import("./components/admin/categories/EditCategory"));
const AddProduct = lazy(() => import("./components/admin/products/AddProduct"));
const Products = lazy(() => import("./components/admin/products/Products.jsx"));
const EditProduct = lazy(() => import("./components/admin/products/EditProduct"));
const Coupons =lazy(()=>import("./components/admin/coupons/coupons.jsx")) ;
const AddCoupon =lazy(()=>import("./components/admin/coupons/addCoupons.jsx")) ;
const AdminOrders = lazy(() => import("./components/admin/orders/Orders"));
const OfferManagement=lazy(()=>import('./components/admin/offers/OfferManagement.jsx'))
//users
import LandingPage from "./pages/user/LandingPage.jsx";
import ShopPage from "./pages/user/ShopPage.jsx";
const ProductPage = lazy(() => import("./pages/user/ProductPage"));
const ProfilePage = lazy(() => import("./pages/user/ProfilePage"));
const CartPage = lazy(() => import("./pages/user/cartPage"));
const CheckoutPage = lazy(() => import("./pages/user/CheckoutPage"));
const OrderSuccess = lazy(() => import("./pages/user/OrderSuccess"));
const Orders = lazy(() => import("./components/user/profile/orders/Orders"));
const OrderDetailsPage = lazy(() => import("./pages/user/OrderDetailsPage"));
const ErrorPage = lazy(() => import("./pages/404page"));
const ForgetPasswordPage = lazy(() => import("./pages/user/auth/ForgetPasswordPage"));
const WishlistPage=lazy(()=>import('./pages/user/WishlistPage.jsx'))
// Import protection components normally since they're lightweight
import IsAdminLogin from "./store/protect/isAdminLogin";
import IsAdminLogout from "./store/protect/IsAdminLogout";
import IsUserLogout from "./store/protect/IsUserLogout";
import IsUserLogin from "./store/protect/IsUserLogin";
import Wallet from "./components/user/wallet/wallet.jsx";
import SalesReport from "./components/admin/sales/salesReport.jsx";
import Dashboard from "./components/admin/dashboard/Dashboard.jsx";
import Wishlist from "./components/user/whishlist/wishlist.jsx";
import BannerManagement from "./components/admin/banners/BannerManagement.jsx";



// Loading component for Suspense fallback
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* user routes */}
          <Route
            path="/login"
            element={
              <IsUserLogout>
                <UserLogin />
              </IsUserLogout>
            }
          />

          <Route
            path="/signup"
            element={
              <IsUserLogout>
                <UserSignup />
              </IsUserLogout>
            }
          />

          <Route
            path="/forget-password"
            element={
              <IsUserLogout>
                <ForgetPasswordPage />
              </IsUserLogout>
            }
          />

          <Route path="/" element={<LandingPage />} />

          <Route
            path="/product/:_id"
            element={
              <IsUserLogin>
                <ProductPage />
              </IsUserLogin>
            }
          />

          <Route
            path="/shop"
            element={
              <IsUserLogin>
                <ShopPage />
              </IsUserLogin>
            }
          />

          <Route
            path="/profile"
            element={
              <IsUserLogin>
                <AddressProvider>
                  <CartProvider>
                    <ProfilePage />
                  </CartProvider>
                </AddressProvider>
              </IsUserLogin>
            }
          />

          <Route
            path="/cart"
            element={
              <IsUserLogin>
                <AddressProvider>
                  <CartProvider>
                    <CouponProvider>
                    <CartPage />
                    </CouponProvider>
                   
                  </CartProvider>
                </AddressProvider>
              </IsUserLogin>
            }
          />
          <Route
          path="/wishlist"
          element={<IsUserLogin>
            <WishlistPage/>
          </IsUserLogin>}/>
          <Route
            path="/checkout/*"
            element={
              <IsUserLogin>
                <CouponProvider>
                <AddressProvider>
                
                  <CartProvider>
                 
                  <CheckoutPage />
                  
                  </CartProvider>
                
                </AddressProvider>
                </CouponProvider>
              </IsUserLogin>
            }
          />

          <Route
            path="/orders"
            element={
              <IsUserLogin>
                <AddressProvider>
                  <CartProvider>
                    <Orders />
                  </CartProvider>
                </AddressProvider>
              </IsUserLogin>
            }
          />
          <Route
            path="/wallet"
            element={
              <IsUserLogin>
               <Wallet/>
              </IsUserLogin>
            }
          />
         

          <Route
            path="/checkout/success/:orderId"
            element={
              <IsUserLogin>
                <AddressProvider>
                  <CartProvider>
                    <OrderSuccess />
                  </CartProvider>
                </AddressProvider>
              </IsUserLogin>
            }
          />

          <Route
            path="/orders/:orderId"
            element={
              <IsUserLogin>
                <AddressProvider>
                  <CartProvider>
                    <OrderDetailsPage />
                  </CartProvider>
                </AddressProvider>
              </IsUserLogin>
            }
          />

          {/* admin routes */}
          <Route
            path="/admin"
            element={
              <IsAdminLogout>
                <AdminLoginPage />
              </IsAdminLogout>
            }
          />

          <Route path="*" element={<ErrorPage />} />

          <Route
            path="/admin/dashboard"
            element={
              <IsAdminLogin>
                <DashboardLayout />
              </IsAdminLogin>
            }
          >
            <Route index element={<Dashboard/>} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit" element={<EditProduct />} />
            <Route path="customers" element={<Customers />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/add" element={<AddCategory />} />
            <Route path="categories/edit" element={<EditCategory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="coupons" element={<Coupons/>}/>
            <Route path="offers" element={<OfferManagement/>}/>
            <Route path="coupons/add" element={<AddCoupon/>}/>
            <Route path="sales" element={<SalesReport/>} />
            <Route path='banners' element={<BannerManagement/>}/>
            
            <Route path="settings" element={<div>Settings Content</div>} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}


// import UserSignup from "./pages/user/auth/UserSignup";
// import UserLogin from "./pages/user/auth/UserLogin";
// import AdminLoginPage from "./pages/admin/adminLoginPage";
// import LandingPage from "./pages/user/LandingPage";
// import { Route, Routes } from "react-router-dom";
// import { CartProvider } from "@/context/CartContext";
// import { AddressProvider } from "./context/AddressContext.jsx";
// import Customers from "./components/admin/Customers";
// import Categories from "./components/admin/Categories";
// import DashboardLayout from "./pages/admin/DashboardLayout";
// import AddCategory from "./components/admin/AddCategory";
// import EditCategory from "./components/admin/EditCategory";
// import AddProduct from "./components/admin/AddProduct";
// import Products from "./components/admin/Products";
// import EditProduct from "./components/admin/EditProduct";
// import ProductPage from "./pages/user/ProductPage";
// import ShopPage from "./pages/user/ShopPage";
// import IsAdminLogin from "./store/protect/isAdminLogin";
// import IsAdminLogout from "./store/protect/IsAdminLogout";
// import IsUserLogout from "./store/protect/IsUserLogout";
// import IsUserLogin from "./store/protect/IsUserLogin";
// import ProfilePage from "./pages/user/ProfilePage";
// import CartPage from "./pages/user/cartPage";
// import CheckoutPage from "./pages/user/CheckoutPage";
// import OrderSuccess from "./pages/user/OrderSuccess";
// import OrderDetails from "./components/user/profile/orders/OrderDetails";
// import Orders from "./components/user/profile/orders/Orders";
// import AdminOrders from "./components/admin/orders/Orders";
// import OrderDetailsPage from "./pages/user/OrderDetailsPage";
// import ErrorPage from "./pages/404page";
// import ForgetPasswordPage from "./pages/user/auth/ForgetPasswordPage";
// import ChangePassword from "./components/user/profile/ChangePasswordModal";


// export default function App() {
//   return (
//     <div>
    
//       <Routes>
//         {/* user */}
//         <Route
//           path="/login"
//           element={
//             <IsUserLogout>
//               <UserLogin />
//             </IsUserLogout>
//           }
//         />

//         <Route
//           path="/signup"
//           element={
//             <IsUserLogout>
//               <UserSignup />
//             </IsUserLogout>
//           }
//         />
//         <Route
//         path="/forget-password" element={<IsUserLogout><ForgetPasswordPage/></IsUserLogout>}/>
//         <Route path="/" element={<LandingPage />} />
//         <Route
//           path="/product"
//           element={
//             <IsUserLogin>
//               <ProductPage />
//             </IsUserLogin>
//           }
//         />
//         <Route
//           path="/shop"
//           element={
//             <IsUserLogin>
//               <ShopPage />
//             </IsUserLogin>
//           }
//         />

//         <Route
//           path="/profile"
//           element={
//             <IsUserLogin>
//               <AddressProvider>
//               <CartProvider>
//                 <ProfilePage />
//               </CartProvider>
//             </AddressProvider>
//             </IsUserLogin>
//           }
//         />
//         <Route
//           path="/cart"
//           element={
//        <IsUserLogin>
//              <AddressProvider>
//               <CartProvider>
//                 <CartPage />
//               </CartProvider>
//             </AddressProvider>
//        </IsUserLogin>
//           }
//         />
       
//         <Route
//           path="/checkout/*"
//           element={
//           <IsUserLogin>
//               <AddressProvider>
//               <CartProvider>
//                 <CheckoutPage />
//               </CartProvider>
//             </AddressProvider>
//           </IsUserLogin>
//           }
//         />
//         <Route
//           path="/orders"
//           element={
//             <IsUserLogin>
//               <AddressProvider>
//               <CartProvider>
//                 <Orders />
//               </CartProvider>
//             </AddressProvider>
//             </IsUserLogin>
//           }
//         />
//         <Route
//           path="/checkout/success/:orderId"
//           element={
//            <IsUserLogin>
//              <AddressProvider>
//               <CartProvider>
//                 <OrderSuccess />
//               </CartProvider>
//             </AddressProvider>
//            </IsUserLogin>
//           }
//         />
//         <Route path="/orders/:orderId" element={
//         <IsUserLogin>
//               <AddressProvider>
//             <CartProvider>
//             <OrderDetailsPage />
//             </CartProvider>
//           </AddressProvider>
//         </IsUserLogin>} />

//         {/* admin */}
//         <Route
//           path="/admin"
//           element={
//             <IsAdminLogout>
//               <AdminLoginPage />
//             </IsAdminLogout>
//           }
//         />
//         <Route path="*" element={<ErrorPage />} />
//         <Route
//           path="/admin/dashboard"
//           element={
//             <IsAdminLogin>
//               <DashboardLayout />
//             </IsAdminLogin>
//           }
//         >
//           <Route index element={<div>DASHBOARD CONTENT</div>} />
//           <Route path="products" element={<Products />} />
//           <Route path="products/add" element={<AddProduct />} />
//           <Route path="products/edit" element={<EditProduct />} />
//           <Route path="customers" element={<Customers />} />
//           <Route path="categories" element={<Categories />} />
//           <Route path="categories/add" element={<AddCategory />} />
//           <Route path="categories/edit" element={<EditCategory />} />
//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="sales" element={<div>Sales Content</div>} />
//           <Route path="settings" element={<div>Settings Content</div>} />
//         </Route>
//       </Routes>
//     </div>
//   );
// }
