import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import OTPEnterModal from "./OTPEnterModal";
import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import axiosInstance from "@/config/axiosConfig";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserDetails } from "@/store/slices/userSlice";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Name should only contain alphabets and spaces")
    .required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),
});

const Signup = () => {
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(null);
  const [isOTPModelOpen, setIsOTPModelOpen] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpErrMessage, setOtpErrMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log("signup attempted with:", values);
    setFormData(values);
    try {
      const response = await axiosInstance.post("/api/users/send-otp", {
        email: values.email,
      });
      if (response?.data?.success) {
        setIsOTPModelOpen(true);
        setOtpMessage("OTP sent successfullly. Please check your email.");
        setOtpErrMessage("");
        setError("");
      }
    } catch (error) {
      if (error?.response) {
        setError(error.response?.data?.message);
      }
      console.log(error);
    }
  };

  //logic to send otp to backend for verification
  const handleOTPSubmit = async (otp) => {
    console.log("OTP submitted", otp, formData.email);
    try {
      const response = await axiosInstance.post("/api/users/verify-otp", {
        otp,
        email: formData.email,
      });
      console.log("otp verified",response);
      toast.success("OTP verified.")
      console.log(response?.data);
      if (response?.data?.invalid) {
        setOtpErrMessage(response.data.message);
        setOtpMessage("");
      }

      if (response?.data.expires) {
        setOtpErrMessage(response.data.message);
        setOtpMessage("");
      }

      if (response?.data?.success) {
        setIsOTPModelOpen(false);
        handleFormSubmit();
      }
    } catch (error) {
      console.error("error verifying otp", error);
    }
  };


  const handleFormSubmit = async () => {
    try {
      setError("");
      const response = await axiosInstance.post("/api/users/signup", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      console.log(response.data);

      if (response?.data?.success) {
        const{accessToken}= response.data
        dispatch(setUserDetails(response?.data?.newUser));
        localStorage.setItem('accessToken',accessToken)
        navigate("/");
      }
    } catch (error) {
      if (error?.response) {
        setError(error.response?.data?.message);
      }
      console.log("ERROR IN FORM SUBMISSION",error);
    }
  };

  const resendOTPHandle = async () => {
    try {
      setOtpErrMessage("");
      const response = await axiosInstance.post("/api/users/send-otp", {
        email: formData.email,
      });
      if (response?.data?.success) {
        setOtpMessage("OTP sent successfully.please check your email.");
        setOtpErrMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Toaster/>
      <main className="container mx-auto px-4 lg:px-11 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center">
        <div
          className="md:w-1/4 hidden md:block bg-cover bg-center h-full rounded-lg shadow-lg"
          style={{
            backgroundImage: "url('/images/signup (2).jpg')",
            height: "600px", // You can adjust this value for height
            width: "50%", // Adjust this to fit your layout
          }}
        ></div>
        <div className="md:w-3/4 md:pl-12 w-full max-w-md ml-3 ">
          <h2 className="text-3xl font-semibold mb-6">Create your account</h2>
          {error && (
            <div className="mt-3 text-base text-center text-red-600">
              {error}</div>)}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="border rounded-lg p-2 w-full"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* Email Field */}
                <div className="space-y-2">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border rounded-lg p-2 w-full"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* Phone Field */}
                <div className="space-y-2">
                  <Field
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="border rounded-lg p-2 w-full"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* Password Field */}
                <div className="space-y-2">
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border rounded-lg p-2 w-full"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="border rounded-lg p-2 w-full"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Sign up
                </Button>
              </Form>
            )}
          </Formik>
         <OTPEnterModal isOpen={isOTPModelOpen}
         closeModal={()=>setIsOTPModelOpen(false)}
         onSubmit={handleOTPSubmit}
         onResendOTP={resendOTPHandle}
         otpMessage={otpMessage}
         otpErrMessage={otpErrMessage}/>
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
