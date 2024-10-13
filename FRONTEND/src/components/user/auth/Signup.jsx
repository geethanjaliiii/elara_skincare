// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Footer from '@/components/ui/Footer';
// import Navbar from '@/components/ui/Navbar';

// const Signup = () => {
//     const [name, setName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Signup attempted with:', name, lastName, email, password);
//     };

//     return (
//         <div className="min-h-screen bg-[rgb(248,248,248)] text-[#4a4a4a]">
//             <Navbar />
//             <main className="container mx-auto px-4 lg:px-11 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center">
//                 <div
//                     className="md:w-1/4 hidden md:block bg-cover bg-center h-full rounded-lg shadow-lg"
//                     style={{
//                         backgroundImage: "url('/images/signup (2).jpg')",
//                         height: "500px",
//                         width: "40%",
//                     }}
//                 >
//                 </div>
//                 <div className="md:w-3/4 md:pl-12 w-full max-w-md ml-3">
//                     <h2 className="text-3xl font-semibold mb-6 text-[#6e665e]">Create Account</h2>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         {/* First Name Field */}
//                         <div className="space-y-2">
//                             <Input
//                                 type="text"
//                                 placeholder="First Name"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 required
//                                 className="border rounded-lg p-2 bg-[#fafafa] focus:ring-[#c4b7a6] focus:border-[#c4b7a6]"
//                             />
//                         </div>
//                         {/* Last Name Field */}
//                         <div className="space-y-2">
//                             <Input
//                                 type="text"
//                                 placeholder="Last Name"
//                                 value={lastName}
//                                 onChange={(e) => setLastName(e.target.value)}
//                                 required
//                                 className="border rounded-lg p-2 bg-[#fafafa] focus:ring-[#c4b7a6] focus:border-[#c4b7a6]"
//                             />
//                         </div>
//                         {/* Email Field */}
//                         <div className="space-y-2">
//                             <Input
//                                 type="email"
//                                 placeholder="Email *"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                                 className="border rounded-lg p-2 bg-[#fafafa] focus:ring-[#c4b7a6] focus:border-[#c4b7a6]"
//                             />
//                         </div>
//                         {/* Password Field */}
//                         <div className="space-y-2">
//                             <Input
//                                 type="password"
//                                 placeholder="Password *"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                                 className="border rounded-lg p-2 bg-[#fafafa] focus:ring-[#c4b7a6] focus:border-[#c4b7a6]"
//                             />
//                         </div>
//                         <Button type="submit" className="w-full bg-[#8b7456] text-white hover:bg-[#b19987] rounded-lg py-2">
//                             CREATE ACCOUNT
//                         </Button>
//                     </form>
//                     <p className="mt-4 text-center text-sm text-[#8e8e8e]">
//                         Already have an account?{' '}
//                         <a href="#" className="font-medium text-[#826745] hover:underline">
//                             Login here
//                         </a>
//                     </p>
//                 </div>
//             </main>
//             <Footer />
//         </div>
//     );
// };

// export default Signup;


// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { FcGoogle } from 'react-icons/fc';
// import Footer from '@/components/ui/Footer';
// import Navbar from '@/components/ui/Navbar';

// const Signup = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle signup logic here
//         if (password !== confirmPassword) {
//             console.error("Passwords do not match");
//             return;
//         }
//         console.log('Signup attempted with:', name, email, phone, password);
//     };

//     return (
//         <div className="min-h-screen bg-background text-foreground">
//             <Navbar />
//             <main className="container mx-auto px-4 lg:px-11 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center">
//                 {/* Set the background image using inline styles or Tailwind custom background utility */}
//                 <div
//                     className="md:w-1/4 hidden md:block bg-cover bg-center h-full rounded-lg shadow-lg"
//                     style={{
//                         backgroundImage: "url('/images/signup (2).jpg')",
//                         height: "600px", // You can adjust this value for height
//                         width: "50%", // Adjust this to fit your layout
//                     }}
//                 >
//                 </div>
//                 <div className="md:w-3/4 md:pl-12 w-full max-w-md ml-3">
//                     <h2 className="text-3xl font-semibold mb-6">Create your account</h2>
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         {/* Name Field */}
//                         <div className="space-y-2">
//                             <Label htmlFor="name">Name</Label>
//                             <Input
//                                 type="text"
//                                 id="name"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         {/* Email Field */}
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
//                         {/* Phone Field */}
//                         <div className="space-y-2">
//                             <Label htmlFor="phone">Phone Number</Label>
//                             <Input
//                                 type="tel"
//                                 id="phone"
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         {/* Password Field */}
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
//                         {/* Confirm Password Field */}
//                         <div className="space-y-2">
//                             <Label htmlFor="confirmPassword">Confirm Password</Label>
//                             <Input
//                                 type="password"
//                                 id="confirmPassword"
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <Button type="submit" className="w-full">
//                             Sign up
//                         </Button>
//                     </form>
//                     <div className="mt-4">
//                         <Button variant="outline" className="w-full flex items-center justify-center">
//                             <FcGoogle className="mr-2 h-4 w-4" />
//                             Sign up with Google
//                         </Button>
//                     </div>
//                     <p className="mt-4 text-center text-sm text-muted-foreground">
//                         Already have an account?{' '}
//                         <a href="#" className="font-medium text-primary hover:underline">
//                             Login
//                         </a>
//                     </p>
//                 </div>
//             </main>
//             <Footer />
//         </div>
//     );
// };

// export default Signup;


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from 'react-icons/fc';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';

const Signup = () => {
    const initialFormData = {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword:""
    }
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
       
        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }
        console.log('Signup attempted with:', name, email, phone, password);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="container mx-auto px-4 lg:px-11 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center">
           
                <div
                    className="md:w-1/4 hidden md:block bg-cover bg-center h-full rounded-lg shadow-lg"
                    style={{
                        backgroundImage: "url('/images/signup (2).jpg')",
                        height: "600px", // You can adjust this value for height
                        width: "50%", // Adjust this to fit your layout
                    }}
                >
                </div>
                <div className="md:w-3/4 md:pl-12 w-full max-w-md ml-3">
                    <h2 className="text-3xl font-semibold mb-6">Create your account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {/* Phone Field */}
                        <div className="space-y-2">
                            <Input
                                type="tel"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        {/* Password Field */}
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Sign up
                        </Button>
                    </form>
                    <div className="mt-4">
                        <Button variant="outline" className="w-full flex items-center justify-center">
                            <FcGoogle className="mr-2 h-4 w-4" />
                            Sign up with Google
                        </Button>
                    </div>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <a href="#" className="font-medium text-primary hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Signup;
