import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Eye,EyeClosed ,EyeOff,EyeIcon} from "lucide-react";
import { sendOtp, verifyOtp, resetPassword, resendOtp } from '@/services/forgetPassword';

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resendCoolDown, setResendCoolDown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (resendCoolDown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setResendCoolDown((prev) => prev > 0 ? prev - 1 : 0);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendCoolDown]);

  const handleSendOtp = async (values) => {
    try {
      await sendOtp(values.email);
      setEmail(values.email);
      setStep(2);
      setCanResend(false);
      setResendCoolDown(60);
      toast.success('OTP sent successfully', {
        description: 'Please check your email for the OTP.',
      });
    } catch (error) {
      toast.error('Failed to send OTP', {
        description: error.response?.data?.message || 'Please try again.',
      });
    }
  };

  const handleResendOtp = async () => {
    if (canResend) {
      try {
        await resendOtp(email);
        setCanResend(false);
        setResendCoolDown(60);
        toast.success('OTP resent', {
          description: 'Please check your email for the new OTP.',
        });
      } catch (error) {
        toast.error('Failed to resend OTP', {
          description: 'Please try again later.',
        });
      }
    }
  };

  const handleVerifyOtp = async (values) => {
    try {
      await verifyOtp(email, values.otp);
      setStep(3);
      toast.success('OTP verified successfully');
    } catch (error) {
      toast.error('Invalid OTP', {
        description: error.response?.data?.error || 'Please try again.',
      });
    }
  };

  const handleResetPassword = async (values) => {
    try {
      await resetPassword(email, values.newPassword);
      toast.success('Password reset successful', {
        description: 'Please log in with your new password.',
      });
      navigate('/login');
    } catch (error) {
      toast.error('Password reset failed', {
        description: error.response?.data?.error || 'Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/side-view-woman-posing-with-flower_23-2150512473.jpg?t=st=1731235528~exp=1731239128~hmac=a231d10d50182f6c80810b3f6b397a47037f9eb00c145bf3104316f7dd73a547&w=1060')" }}>
      <Toaster position="top-center" />
      <div className="absolute top-4 left-4 z-20">
        <a href="/" className="text-3xl font-serif text-white hover:text-gray-200 transition-colors">
          Elara
        </a>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
      <div className="w-full max-w-md relative z-10 bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-xl">
        {step === 1 && (
          <Formik
            initialValues={{ email: "" }}
            validationSchema={Yup.object({
              email: Yup.string().email("Invalid email address").required("Email is required"),
            })}
            onSubmit={handleSendOtp}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <h2 className="text-3xl font-serif text-center mb-4">Reset your password</h2>
                <p className="text-center text-gray-600 mb-6">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
                <div>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0f172a] text-white p-2 rounded-md hover:bg-[#1e293b] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send OTP"}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {step === 2 && (
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={Yup.object({
              otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
            })}
            onSubmit={handleVerifyOtp}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <h2 className="text-3xl font-serif text-center mb-4">Verify OTP</h2>
                <p className="text-center text-gray-600 mb-6">
                  Enter the OTP sent to your email.
                </p>
                <div>
                  <Field
                    name="otp"
                    type="text"
                    placeholder="Enter OTP"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="otp" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0f172a] text-white p-2 rounded-md hover:bg-[#1e293b] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className="w-full bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  {canResend ? "Resend OTP" : `Resend OTP in ${resendCoolDown}s`}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {step === 3 && (
          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            validationSchema={Yup.object({
              newPassword: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('New password is required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Confirm your password'),
            })}
            onSubmit={handleResetPassword}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <h2 className="text-3xl font-serif text-center mb-4">Reset Password</h2>
                <div>
                  <Field
                    name="newPassword"
                    type={showPassword?'text':"password"}
                    placeholder="Enter new password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                  {/* Eye icon for toggling visibility */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 pt-2 transform -translate-y-1/2 text-gray-400  "
                  >
                   
                    {showPassword ? <EyeIcon/> :<EyeOff/>}
                  </button>
                </div>
                <div>
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0f172a] text-white p-2 rounded-md hover:bg-[#1e293b] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </Form>
            )}
          </Formik>
        )}
        <div className="text-center mt-4">
          <a
            href="/login"
            className="text-sm text-gray-600 hover:text-[#0f172a] transition-colors"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;

// import { axiosInstance } from "@/config/axiosConfig";
// import { resendOtp, resetPassword, sendOtp, verifyOtp } from "@/services/forgetPassword";
// import { ErrorMessage, Field, Form, Formik } from "formik";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import * as Yup from 'yup';
// import { toast, Toaster } from "sonner";

// const ForgetPassword = () => {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [resendCoolDown, setResendCoolDown] = useState(60);
//   const [canResend, setCanResend] = useState(false);
//   const[otp,setOtp]=useState('')
//   const navigate=useNavigate()
//   useEffect(() => {
//     let timer;
//     if (resendCoolDown > 0) {
//         setCanResend(false)
//       timer = setInterval(() => {
//         setResendCoolDown((prev) =>prev>0? prev-1:0);
//       }, 1000);
      
//     } else {
//       setCanResend(true);
//     }
//     return ()=>clearInterval(timer)
//   }, [resendCoolDown]);
//   const handleSentOtp = async (values) => {
//     try {
//       await sendOtp(values.email);
//       setEmail(values.email);
//       setStep(2);
//       setCanResend(false);
//       setResendCoolDown(60);
//     } catch (error) {
//         const errorMessage = error.response?.data?.message || 'Failed to send OTP';
//       toast.error(errorMessage);
//       console.error("Error sending OTP:", error.response?.data.message);
//     }
//   };
//   const handleResendOtp=async()=>{
//      if(canResend){
//         try {
//             await resendOtp(email)
//             setCanResend(false)
//             setResendCoolDown(60)
//             toast.success('OTP has been send to your email.', {
//         description: 'Please check your email for password reset instructions.',
//       })
      
//         } catch (error) {
//             toast.error('Something went wrong. Please try again.')
//         }
//      }
//   }
//   const handleVerifyOtp=async(values)=>{
//     console.log("otp",values.otp);
    
//     try {
//         await verifyOtp(email,values.otp)
//         setOtp(values.otp)
//         setStep(3)
//         toast.success('OTP verified successfully.')
//     } catch (error) {
//         console.error('Invalid OTP:', error);
//         const errorMessage=error?.response?.data?.error||'Invalid OTP'
//         toast.error(errorMessage)
//     }
//   }
//   const handleResetPassword=async(values)=>{
//     try {
//         await resetPassword(email,values.newPassword)
//         toast.success("Password reset successful! Please log in with your new password.")
//         navigate('/login')
//     } catch (error) {
//         console.error('Invalid OTP:', error.response?.data.message);
//         const errorMessage=error?.response?.data?.error||'Password reset failed.Please try again.'
//         toast.error(errorMessage)
//     }
//   }
//   return (
//     <div>
//         <Toaster/>
//       {step == 1 && (
//         <Formik
//           initialValues={{ email: "" }}
//           validationSchema={Yup.object({
//             email: Yup.string()
//               .email("Invalid email")
//               .required("Email is required"),
//           })}
//           onSubmit={handleSentOtp}
//         >
//           {() => (
//             <Form>
//               <h2>Reset your password</h2>
//               <h4>
//                 Enter your email address and we'll send you instructions to
//                 reset your password.
//               </h4>
//               <Field
//                 name="email"
//                 type="email"
//                 placeholder="Enter your email."
//               />
//               <ErrorMessage name="email" component="div" />
//               <button type="submit">Send OTP</button>
//             </Form>
//           )}
//         </Formik>
//       )}
//       {step === 2 && (
//         <>
//           <Formik
//             initialValues={{ otp: "" }}
//             validationSchema={Yup.object({
//               otp: Yup.string()
//                 .length(6, "OTP must be 6 digits")
//                 .required("OTP is required"),
//             })}
//             onSubmit={handleVerifyOtp}
//           >
//             {() => (
//               <Form>
//                 <h2>Verify OTP</h2>
//                 <Field name="otp" type="text" placeholder="Enter OTP" />
//                 <ErrorMessage name="otp" component="div" />
//                 <button type="submit">Verify OTP</button>
//               </Form>
//             )}
//           </Formik>
//           {/* resendotp btn with timer */}
//           <button onClick={handleResendOtp} disabled={!canResend}>
//             {canResend ? "Resend OTP" : `Resend OTP in ${resendCoolDown} s`}
//           </button>
//         </>
//       )}

// {step === 3 && (
//   <Formik
//     initialValues={{ newPassword: '', confirmPassword: '' }}
//     validationSchema={Yup.object({
//       newPassword: Yup.string()
//         .min(6, 'Password must be at least 6 characters')
//         .required('New password is required'),
//       confirmPassword: Yup.string()
//         .oneOf([Yup.ref('newPassword')], 'Passwords must match')
//         .required('Confirm your password'),
//     })}
//     onSubmit={handleResetPassword}
//   >
//     {() => (
//       <Form>
//         <h2>Reset Password</h2>

//         {/* New Password Field */}
//         <Field
//           name="newPassword"
//           type="password"
//           placeholder="Enter new password"
//         />
//         <ErrorMessage name="newPassword" component="div" />

//         {/* Confirm Password Field */}
//         <Field
//           name="confirmPassword"
//           type="password"
//           placeholder="Confirm new password"
//         />
//         <ErrorMessage name="confirmPassword" component="div" />

//         {/* Submit Button */}
//         <button type="submit">Reset Password</button>
//       </Form>
//     )}
//   </Formik>
// )}

//     </div>
//   );
// };

// export default ForgetPassword;
