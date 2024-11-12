import UserSignup from "./pages/user/auth/UserSignup";
import UserLogin from "./pages/user/auth/UserLogin";
import AdminLoginPage from "./pages/admin/adminLoginPage";
import LandingPage from "./pages/user/LandingPage";
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AddressProvider } from "./context/AddressContext.jsx";
import Customers from "./components/admin/Customers";
import Categories from "./components/admin/Categories";
import DashboardLayout from "./pages/admin/DashboardLayout";
import AddCategory from "./components/admin/AddCategory";
import EditCategory from "./components/admin/EditCategory";
import AddProduct from "./components/admin/AddProduct";
import Products from "./components/admin/Products";
import EditProduct from "./components/admin/EditProduct";
import ProductPage from "./pages/user/ProductPage";
import ShopPage from "./pages/user/ShopPage";
import IsAdminLogin from "./store/protect/isAdminLogin";
import IsAdminLogout from "./store/protect/IsAdminLogout";
import IsUserLogout from "./store/protect/IsUserLogout";
import IsUserLogin from "./store/protect/IsUserLogin";
import ProfilePage from "./pages/user/ProfilePage";
import CartPage from "./pages/user/cartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import OrderSuccess from "./pages/user/OrderSuccess";
import OrderDetails from "./components/user/profile/orders/OrderDetails";
import Orders from "./components/user/profile/orders/Orders";
import AdminOrders from "./components/admin/orders/Orders";
import OrderDetailsPage from "./pages/user/OrderDetailsPage";
import ErrorPage from "./pages/404page";
import ForgetPasswordPage from "./pages/user/auth/ForgetPasswordPage";
import ChangePassword from "./components/user/profile/ChangePasswordModal";
import Navbar from "./components/shared/Navbar";

export default function App() {
  return (
    <div>
    
      <Routes>
        {/* user */}
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
        path="/forget-password" element={<IsUserLogout><ForgetPasswordPage/></IsUserLogout>}/>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/product"
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
            <AddressProvider>
              <CartProvider>
                <ProfilePage />
              </CartProvider>
            </AddressProvider>
          }
        />
        <Route
          path="/cart"
          element={
            <AddressProvider>
              <CartProvider>
                <CartPage />
              </CartProvider>
            </AddressProvider>
          }
        />
       
        <Route
          path="/checkout/*"
          element={
            <AddressProvider>
              <CartProvider>
                <CheckoutPage />
              </CartProvider>
            </AddressProvider>
          }
        />
        <Route
          path="/orders"
          element={
            <AddressProvider>
              <CartProvider>
                <Orders />
              </CartProvider>
            </AddressProvider>
          }
        />
        <Route
          path="/checkout/success/:orderId"
          element={
            <AddressProvider>
              <CartProvider>
                <OrderSuccess />
              </CartProvider>
            </AddressProvider>
          }
        />
        <Route path="/orders/:orderId" element={
            <AddressProvider>
            <CartProvider>
            <OrderDetailsPage />
            </CartProvider>
          </AddressProvider>} />

        {/* admin */}
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
          <Route index element={<div>DASHBOARD CONTENT</div>} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit" element={<EditProduct />} />
          <Route path="customers" element={<Customers />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit" element={<EditCategory />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="sales" element={<div>Sales Content</div>} />
          <Route path="settings" element={<div>Settings Content</div>} />
        </Route>
      </Routes>
    </div>
  );
}
