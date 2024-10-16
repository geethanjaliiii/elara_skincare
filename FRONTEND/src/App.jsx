import { Button } from "@/components/ui/button";
import UserSignup from "./pages/user/auth/UserSignup";
import UserLogin from "./pages/user/auth/UserLogin";
import LandingPage from "./pages/user/LandingPage";
import { Route,Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
export default function App() {
  return (
    <div>
      <Provider store={store}>
      <Routes>
        <Route path="/login" element={<UserLogin/>}/>
        <Route path="/signup" element={<UserSignup/>}/>
        <Route path="/" element={<LandingPage/>}/>
      </Routes>
      </Provider>
    </div>
  );
}
