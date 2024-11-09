
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import  { adminAxiosInstance } from '@/config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { setAdminDetails,logoutAdmin } from '@/store/slices/adminSlice';
import { Toaster ,toast} from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const AdminLogin = () => {
  const [error,setError]=useState("")
  const dispath=useDispatch()
  const navigate =useNavigate()
  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  // Initial values
  const initialValues = {
    email: '',
    password: '',
  };

  // Form submission handler
  const onSubmit = async(values) => {
    // Handle form submission

    
   
    
    setError("")
    console.log('Form submitting', values);
    //post req in try catch
    //set admin credentials in redux
    try {
      const response = await adminAxiosInstance.post('/api/admin',values)
      toast.success("Admin logged in successfully")
      console.log(response.data);
      
      dispath(setAdminDetails(response.data.admin))
      localStorage.setItem("adminAccessToken",response.data.adminAccessToken)
      setTimeout(()=>{
        navigate('/admin/dashboard')
      },500)
      
     
      console.log("Admin logged in successfully",response.data);
      
    } catch (error) {
      console.log("error in admin login",error.message);
      toast.error("Something went wrong.")
      setError("Something went wrong")
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Toaster/>
      <div className="w-full max-w-md p-8 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/images/ELARA_LOGO.png"
            alt="Elara Logo"
            className="w-60 h-60"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center">ADMIN LOGIN</h2>
        {error && (<p className='text-sm text-red-500'>{error}</p>)}
        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ touched, errors }) => (
            <Form className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email Here"
                  className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    touched.email && errors.email ? 'border-red-500' : 'focus:ring-primary'
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password Here"
                  className={`w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                    touched.password && errors.password ? 'border-red-500' : 'focus:ring-primary'
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 mt-4 font-semibold text-white bg-black hover:bg-opacity-90 rounded-md"
                >
                  Login
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdminLogin;


// import React from 'react';

// const AdminLogin = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-white">
//       <div className="w-full max-w-md p-8 space-y-6">
//         {/* Logo */}
//         <div className="flex justify-center">
//           <img
//             src="/images/ELARA_LOGO.png"
//             alt="Elara Logo"
//             className="w-60 h-60"
//           />
//         </div>

//         {/* Title */}
//         <h2 className="text-2xl font-bold text-center">ADMIN LOGIN</h2>

//         {/* Form */}
//         <form className="mt-6 space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               placeholder="Enter Email Here"
//               className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               placeholder="Enter Password Here"
//               className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>
//           <div>
//             <button
//               type="submit"
//               className="w-full py-2 mt-4 font-semibold text-white bg-gold hover:bg-opacity-90 rounded-md"
//             >
//               Login
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;
