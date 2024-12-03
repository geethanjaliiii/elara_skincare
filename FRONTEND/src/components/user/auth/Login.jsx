import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/config/axiosConfig";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/store/slices/userSlice";
import toast, { Toaster } from "react-hot-toast";
import { Eye,EyeClosed ,EyeOff,EyeIcon} from "lucide-react";
import GoogleAuth from "@/components/user/auth/GoogleAuth";
const Login = () => {
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Form validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    // Handle login logic here with Formik values
    console.log("Login attempted with:", values);
    setFormData(values);
    setError("");
    try {
      const response = await axiosInstance.post("/api/users/login", values);
      if (response?.data) {
        const { accessToken } = response.data;

        //store access token in localstorage
        localStorage.setItem("accessToken", accessToken);
        console.log("responw", response?.data);

        dispatch(setUserDetails(response?.data?.user));
        toast.success("User logged in successfully.");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setError(error?.response?.data?.message||"Something went wrong! Please try again.")
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Toaster />
      <main className="container mx-auto px-4 lg:px-11 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center">
        <div
          className="md:w-1/4 hidden md:block bg-cover bg-center h-full rounded-lg shadow-lg"
          style={{
            backgroundImage: "url('/images/login.jpg')",
            height: "600px",
            width: "50%",
          }}
        />
        <div className="md:w-3/4 md:pl-12 w-full max-w-md ml-3">
          <h2 className="text-3xl font-semibold mb-6">Login to your account</h2>
          {error && (
            <div className="mt-3 text-base text-center text-red-600">
              {error}
            </div>
          )}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      className="text-sm hover:text-blue-900"
                      to="/forget-password"
                    >
                      forget password?
                    </Link>
                  </div>

                  <Field
                    as={Input}
                    type={showPassword?'text':"password"}
                    id="password"
                    name="password"
                    placeholder="Enter password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  {/* Eye icon for toggling visibility */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 pt-2 transform -translate-y-1/2 text-gray-400  "
                  >
                   
                    {showPassword ? <EyeIcon/> :<EyeOff/>}
                  </button>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-4">
            <GoogleAuth />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
