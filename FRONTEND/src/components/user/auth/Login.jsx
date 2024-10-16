import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from 'react-icons/fc';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axiosInstance from '@/config/axiosConfig';


const Login = () => {
    const [formData, setFormData] =useState(null)
    // Form validation schema using Yup
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const handleSubmit = async(values) => {
        // Handle login logic here with Formik values
        console.log('Login attempted with:', values);
        setFormData(values)
        try {
            await axiosInstance.post('/api/users/login',formData)
        } catch (error) {
            
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
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
                    <Formik
                        initialValues={{ email: '', password: '' }}
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
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Field
                                        as={Input}
                                        type="password"
                                        id="password"
                                        name="password"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                    <div className="mt-4">
                        <Button variant="outline" className="w-full flex items-center justify-center">
                            <FcGoogle className="mr-2 h-4 w-4" />
                            Sign in with Google
                        </Button>
                    </div>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-primary hover:underline">
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


// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { FcGoogle } from 'react-icons/fc';
// import Footer from '@/components/ui/Footer';
// import Navbar from '@/components/ui/Navbar';
// import { Link } from 'react-router-dom';
// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle login logic here
//         console.log('Login attempted with:', email, password);
//     };

//     return (
//         <div className="min-h-screen bg-background text-foreground">
//             <Navbar />
//             <main className="container mx-auto px-4 lg:px-11 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center">
//                 {/* Set the background image using inline styles or Tailwind custom background utility */}
//                 <div
//                     className=" md:w-1/4 hidden md:block bg-cover bg-center h-full rounded-lg shadow-lg"
//                     style={{
//                         backgroundImage: "url('/images/login.jpg')",
//                         height: "600px", // You can adjust this value for height
//                         width: "50%", // Adjust this to fit your layout
                       
//                     }}
//                 >
//                 </div>
//                 <div className="md:w-3/4 md:pl-12 w-full max-w-md  ml-3">
//                     <h2 className="text-3xl font-semibold mb-6">Login to your account</h2>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="email">Email</Label>
//                             <Input
//                                 type="email"
//                                 id="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="password">Password</Label>
//                             <Input
//                                 type="password"
//                                 id="password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <Button type="submit" className="w-full">
//                             Login
//                         </Button>
//                     </form>
//                     <div className="mt-4">
//                         <Button variant="outline" className="w-full flex items-center justify-center">
//                             <FcGoogle className="mr-2 h-4 w-4" />
//                             Sign in with Google
//                         </Button>
//                     </div>
//                     <p className="mt-4 text-center text-sm text-muted-foreground">
//                         Don't have an account?{' '}
//                         <Link to="/signup" className="font-medium text-primary hover:underline">
//                             Sign up
//                         </Link>
//                     </p>
//                 </div>
//             </main>
//             <Footer />
//         </div>
//     );
// };

// export default Login;

