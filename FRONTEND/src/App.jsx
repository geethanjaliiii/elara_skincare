import UserSignup from "./pages/user/auth/UserSignup";
import UserLogin from "./pages/user/auth/UserLogin";
import AdminLoginPage from "./pages/admin/adminLoginPage";
import LandingPage from "./pages/user/LandingPage";
import { Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
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
// import EditProducts from "./components/admin/EditProducts";
export default function App() {
  return (
    <div>
      <Provider store={store}>
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
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/product"
            element={
              <IsUserLogin>
                <ProductPage />
              </IsUserLogin>
            }
          />
          <Route path="/shop" element={
            <IsUserLogin>
              <ShopPage />
              </IsUserLogin>} />
          {/* admin */}
          <Route
            path="/admin"
            element={
              <IsAdminLogout>
                <AdminLoginPage />
              </IsAdminLogout>
            }
          />
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
            <Route path="sales" element={<div>Sales Content</div>} />
            <Route path="settings" element={<div>Settings Content</div>} />
          </Route>
        </Routes>
      </Provider>
    </div>
  );
}

// import UserSignup from "./pages/user/auth/UserSignup";
// import UserLogin from "./pages/user/auth/UserLogin";
// import AdminLoginPage from "./pages/admin/adminLoginPage";
// import LandingPage from "./pages/user/LandingPage";
// import { Route, Routes } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store/store";
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
// import IsAdminLogin from "./store/protect/IsAdminLogin";
// import IsAdminLogout from "./store/protect/IsAdminLogout";

// export default function App() {
//   return (
//     <Provider store={store}>
//       <Routes>
//         {/* User Routes */}
//         <Route path="/login" element={<UserLogin />} />
//         <Route path="/signup" element={<UserSignup />} />
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/product" element={<ProductPage />} />
//         <Route path="/shop" element={<ShopPage />} />

//         {/* Admin Routes */}
//         <Route path="/admin" element={
//           <IsAdminLogout>
//             <AdminLoginPage />
//           </IsAdminLogout>
//         }/>

//         <Route path="/admin/dashboard" element={
//           <IsAdminLogin>
//             <DashboardLayout />
//           </IsAdminLogin>
//         }>
//           {/* Admin Dashboard Child Routes */}
//           <Route index element={<div>Dashboard Content</div>} />
//           <Route path="products" element={<Products />} />
//           <Route path="products/add" element={<AddProduct />} />
//           <Route path="products/edit" element={<EditProduct />} />
//           <Route path="customers" element={<Customers />} />
//           <Route path="categories" element={<Categories />} />
//           <Route path="categories/add" element={<AddCategory />} />
//           <Route path="categories/edit" element={<EditCategory />} />
//           <Route path="sales" element={<div>Sales Content</div>} />
//           <Route path="settings" element={<div>Settings Content</div>} />
//         </Route>
//       </Routes>
//     </Provider>
//   );
// }
