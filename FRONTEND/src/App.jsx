import { Button } from "@/components/ui/button";
import UserSignup from "./pages/user/auth/UserSignup";
import UserLogin from "./pages/user/auth/UserLogin";
import LandingPage from "./pages/user/LandingPage";
import { Route,Routes } from "react-router-dom";
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<UserLogin/>}/>
        <Route path="/signup" element={<UserSignup/>}/>
        <Route path="/" element={<LandingPage/>}/>
      </Routes>
    </div>
  );
}
