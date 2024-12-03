import React from "react";
import Signup from "@/components/user/auth/Signup";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const UserSignup = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <Navbar />
      </header>
      
      <main className="flex-1 flex items-center justify-center bg-background px-4 sm:px-8 py-16">
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-stretch shadow-lg rounded-lg overflow-hidden">
          <div className="hidden md:block w-1/2 h-[536px] bg-cover bg-center rounded-l-lg" style={{
            backgroundImage: "url('/images/signup (2).jpg')"
          }}></div>
          <div className="w-full md:w-1/2 p-8 bg-white rounded-r-lg shadow-lg">
            <Signup />
          </div>
        </div>
      </main>

      <footer className="bg-white shadow-t">
        <Footer />
      </footer>
    </div>
  );
  // return (
  //   <div className="flex flex-col min-h-screen">
  //           <header className="sticky top-0 z-50 bg-white shadow-md">
  //       <Navbar />
  //     </header>
  //     {/* <Navbar /> */}
  //      {/* Signup Content */}
  //      <main className="flex-1 flex items-center justify-center bg-background px-4 sm:px-8 ">
  //       <Signup />
  //     </main>

  //     {/* Footer */}
  //     <footer className="bg-white shadow-t">
  //       <Footer />
  //     </footer>
  //     {/* <Signup className="flex-1" />
  //     <Footer /> */}
  //   </div>
  // );
};

export default UserSignup;
