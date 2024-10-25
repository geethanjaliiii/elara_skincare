
import UserSignup from "./pages/user/auth/UserSignup";
import UserLogin from "./pages/user/auth/UserLogin";
import AdminLoginPage from "./pages/admin/adminLoginPage";
import LandingPage from "./pages/user/LandingPage";
import { Route,Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Customers from "./components/admin/Customers";
import Categories from "./components/admin/Categories";
import DashboardLayout from "./pages/admin/DashboardLayout";
import AddCategory from "./components/admin/AddCategory";
import EditCategory from "./components/admin/EditCategory";
import AddProduct from "./components/admin/AddProduct";
import Products from "./components/admin/Products";

export default function App() {
  return (
    <div>
      <Provider store={store}>
      <Routes>
        <Route path="/login" element={<UserLogin/>}/>
        <Route path="/signup" element={<UserSignup/>}/>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/admin" element={<AdminLoginPage/>}/>
        {/* admin */}
        <Route path="/admin/dashboard" element={<DashboardLayout />}>
          <Route path="dashboard" element={<div>Dashboard Content</div>} />
          <Route path="products" element={<Products/>} />
             <Route path="products/add" element={<AddProduct/>} />
          <Route path="customers" element={<Customers/>} />
          <Route path="categories" element={<Categories/>}/>
            <Route path="categories/add" element={<AddCategory/>}/>
            <Route path="categories/edit" element={<EditCategory/>}/>
          <Route path="sales" element={<div>Sales Content</div>} />
          <Route path="settings" element={<div>Settings Content</div>} />
        </Route>
      </Routes>
      </Provider>
    </div>
  );
}
