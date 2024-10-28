
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/Navbar';
import Footer from '../ui/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimate';
import axiosInstance from '@/config/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function EvaraLandingPage() {
  const [bestsellers, setBestsellers] =useState([])
  const navigate =useNavigate()
  useScrollAnimation();

  useEffect(()=>{
    async function fetchBestsellers() {
      try {
        const response = await axiosInstance.get('/api/users/products/bestsellers')
        console.log("Bestsellers fetched.",response?.data?.bestsellers);
        setBestsellers(response?.data?.bestsellers)
      } catch (error) {
        console.log("Error in fetching bestsellers.");
      }
    }
    fetchBestsellers()
  },[])



  const routineSteps = [
    { title: 'Cleanse', image: '/images/category/clense.jpg', description: 'Start with a gentle cleanser to remove impurities.' },
    { title: 'Exfoliate', image: '/images/category/exfoliate.jpg', description: 'Use a natural scrub to remove dead skin cells.' },
    { title: 'Moisturize', image: '/images/category/moisturise.jpg', description: 'Apply a hydrating moisturizer to keep skin supple.' },
    { title: 'Nourish', image: '/images/category/nourish.jpg', description: 'Finish with a nourishing serum or oil for extra care.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden ">
          <img
            src="/images/banner/banner.png"
            alt="EVARA Skincare Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="text-center max-w-3xl px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Unveil Your Skin's Natural Radiance
              </h1>
              <p className="text-xl md:text-2xl text-white mb-6 font-light">
                Experience the transformative power of nature-inspired skincare
              </p>
              <Button
                className="bg-white text-black hover:bg-gray-200 transition-colors duration-300 text-lg py-2 px-6"
              >
                Discover ELARA
              </Button>
            </div>
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Our Bestsellers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestsellers && bestsellers.map((product) => (
                <div
                  key={product._id}
                  className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="text-white mb-4">₹ {product.price}</p>
                      <Button
                        onClick={()=>navigate('/product',{state: {productId:product._id}})}
                        variant="secondary"
                        className="bg-white text-black hover:bg-gray-200 transition-colors duration-300"
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Four Step Routine Section with Scroll Animation */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f5ede4]">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Elara's Four Step Routine
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {routineSteps.map((step, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg scroll-animate"
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-xl font-semibold text-white">
                  {step.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Experience the Natural Difference</h2>
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <img
                src="/images/category/ingre.png"
                alt="Natural ingredients"
                className="w-full h-[500px] object-cover rounded-xl "
              />
              <div className="flex flex-col justify-center space-y-4">
                <p className="text-gray-500 text-lg leading-relaxed">
                  At EVARA, we believe in the power of nature. Our products are crafted with carefully selected natural ingredients to nourish and revitalize your skin. Experience the difference of truly natural skincare that works in harmony with your body's natural processes.
                </p>
                <Button className="w-fit transition-transform hover:scale-105 bg-black text-white hover:bg-gray-800">
                  Discover Our Ingredients
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32  bg-[#f5ede4]">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Customers Say</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
                  <p className="text-gray-600 mb-4 text-lg italic">"EVARA has transformed my skincare routine. My skin has never looked better! The natural ingredients make all the difference."</p>
                  <p className="font-semibold text-gray-800">- Happy Customer {item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}


// import React from 'react'
// import { Button } from '@/components/ui/button'
// import Navbar from '@/components/ui/Navbar'
// import Footer from '../ui/Footer'

// export default function EvaraLandingPage() {
//   const bestsellers = [
//     { name: 'Radiance Serum', image: '/placeholder.svg', price: '$49.99' },
//     { name: 'Hydra Boost Cream', image: '/placeholder.svg', price: '$39.99' },
//     { name: 'Gentle Exfoliating Scrub', image: '/placeholder.svg', price: '$29.99' },
//     { name: 'Soothing Night Mask', image: '/placeholder.svg', price: '$34.99' },
//   ]

//   const routineSteps = [
//     { title: 'Cleanse', image: '/images/category/clense.jpg', description: 'Start with a gentle cleanser to remove impurities.' },
//     { title: 'Exfoliate', image: '/images/category/exfoliate.jpg', description: 'Use a natural scrub to remove dead skin cells.' },
//     { title: 'Moisturize', image: '/placeholder.svg', description: 'Apply a hydrating moisturizer to keep skin supple.' },
//     { title: 'Nourish', image: '/placeholder.svg', description: 'Finish with a nourishing serum or oil for extra care.' },
//   ]

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-1">
//         <section className="relative h-[600px] overflow-hidden">
//           <img
//             src="/images/banner/banner.png"
//             alt="EVARA Skincare Banner"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
//             <div className="text-center max-w-3xl px-4">
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
//                 Unveil Your Skin's Natural Radiance
//               </h1>
//               <p className="text-xl md:text-2xl text-white mb-6 font-light">
//                 Experience the transformative power of nature-inspired skincare
//               </p>
//               <Button
//                 className="bg-white text-black hover:bg-gray-200 transition-colors duration-300 text-lg py-2 px-6"
//               >
//                 Discover EVARA
//               </Button>
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Bestsellers</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//               {bestsellers.map((product, index) => (
//                 <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <div className="text-center">
//                       <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
//                       <p className="text-white mb-4">{product.price}</p>
//                       <Button variant="secondary" className="bg-white text-black hover:bg-gray-200 transition-colors duration-300">
//                         Shop Now
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">EVARA's Four Step Routine</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//               {routineSteps.map((step, index) => (
//                 <div key={index} className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
//                   <img
//                     src={step.image}
//                     alt={step.title}
//                     className="w-full h-72 object-cover rounded-lg mb-4"
//                   />
//                   <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
//                   <p className="text-gray-600">{step.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Experience the Natural Difference</h2>
//             <div className="grid gap-8 lg:grid-cols-2 items-center">
//               <img
//                 src="/placeholder.svg"
//                 alt="Natural ingredients"
//                 className="w-full h-[400px] object-cover rounded-xl"
//               />
//               <div className="flex flex-col justify-center space-y-4">
//                 <p className="text-gray-500 text-lg leading-relaxed">
//                   At EVARA, we believe in the power of nature. Our products are crafted with carefully selected natural ingredients to nourish and revitalize your skin. Experience the difference of truly natural skincare that works in harmony with your body's natural processes.
//                 </p>
//                 <Button className="w-fit transition-transform hover:scale-105 bg-black text-white hover:bg-gray-800">
//                   Discover Our Ingredients
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Customers Say</h2>
//             <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//               {[1, 2, 3].map((item) => (
//                 <div key={item} className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
//                   <p className="text-gray-600 mb-4 text-lg italic">"EVARA has transformed my skincare routine. My skin has never looked better! The natural ingredients make all the difference."</p>
//                   <p className="font-semibold text-gray-800">- Happy Customer {item}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>
//       <Footer/>
//       {/* <footer className="bg-gray-900 text-white py-8">
//         <div className="container px-4 md:px-6 mx-auto">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className="text-sm mb-4 md:mb-0">© 2024 EVARA. All rights reserved.</p>
//             <nav className="flex gap-6">
//               <a className="text-sm hover:underline underline-offset-4" href="#">
//                 Terms of Service
//               </a>
//               <a className="text-sm hover:underline underline-offset-4" href="#">
//                 Privacy Policy
//               </a>
//               <a className="text-sm hover:underline underline-offset-4" href="#">
//                 Contact Us
//               </a>
//             </nav>
//           </div>
//         </div>
//       </footer> */}
//     </div>
//   )
// }


// import { useState, useEffect } from "react";
// import { Img } from "react-image";
// import { bannerData } from "../../config/bannerData";
// import Slider from "react-slick";
// import { Button } from "@/components/ui/button";
// import Navbar from "@/components/ui/Navbar";

// // Import slick-carousel styles
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// export default function EvaraLandingPage() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [carouselColor, setCarouselColor] = useState("#ffffff");

//   const carouselSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     beforeChange: (current, next) => {
//       // Change button color based on slide
//       const colors = ["#f3e5f5", "#e8f5e9", "#fff3e0"];
//       setCarouselColor(colors[next % colors.length]);
//     },
//   };

//   const routineSteps = [
//     {
//       title: "Cleanse",
//       image: "/placeholder.svg",
//       description: "Start with a gentle cleanser to remove impurities.",
//     },
//     {
//       title: "Exfoliate",
//       image: "/placeholder.svg",
//       description: "Use a natural scrub to remove dead skin cells.",
//     },
//     {
//       title: "Moisturize",
//       image: "/placeholder.svg",
//       description: "Apply a hydrating moisturizer to keep skin supple.",
//     },
//     {
//       title: "Nourish",
//       image: "/placeholder.svg",
//       description: "Finish with a nourishing serum or oil for extra care.",
//     },
//   ];

//   const bestsellers = [
//     {
//       name: "Radiance Serum",
//       image: "/placeholder.svg",
//       hoverImage: "/placeholder.svg",
//       price: "$49.99",
//     },
//     {
//       name: "Hydra Boost Cream",
//       image: "/placeholder.svg",
//       hoverImage: "/placeholder.svg",
//       price: "$39.99",
//     },
//     {
//       name: "Gentle Exfoliating Scrub",
//       image: "/placeholder.svg",
//       hoverImage: "/placeholder.svg",
//       price: "$29.99",
//     },
//     {
//       name: "Soothing Night Mask",
//       image: "/placeholder.svg",
//       hoverImage: "/placeholder.svg",
//       price: "$34.99",
//     },
//   ];

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-1">
//         <section className="w-full">
//           <Slider {...carouselSettings}>
//             {bannerData.map((item, index) => (
//               <div key={index} className="relative h-[600px]">
//                 <img
//                   src={item.url}
//                   alt={`Carousel Image`}
//                   layout="fill"
//                   objectFit="cover"
//                 />
                
                
//                 <div className="absolute inset-0 flex items-center justify-start p-10">
//                 <div className="flex flex-col justify-center space-y-4">
//                   <div className="space-y-2">
//                     <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                       Reveal Your Skin's True Potential
//                     </h1>
//                     <p className="max-w-[600px] text-gray-500 md:text-xl">
//                       Discover the power of nature-inspired skincare. Nourish,
//                       protect, and revitalize your skin with EVARA.
//                     </p>
//                   </div>
//                   <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                     <Button className="transition-transform hover:scale-105">
//                       Shop Now
//                     </Button>
//                     <Button
//                       variant="outline"
//                       className="transition-transform hover:scale-105"
//                     >
//                       Learn More
//                     </Button>
//                   </div>
//                 </div>

//                   {/* <div className="text-center">
//                     <h2 className="text-4xl font-bold text-white mb-4">
//                       {item.caption}
//                     </h2>
//                     <p className="text-xl text-white mb-6">
//                       Nourish your skin with EVARA's organic products
//                     </p>
//                     <Button
//                       className="transition-transform hover:scale-105"
//                       style={{
//                         backgroundColor: carouselColor,
//                         color: "#000000",
//                       }}
//                     >
//                       Shop Now
//                     </Button>
//                   </div> */}
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
//               Deyga's Four Step Routine
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {routineSteps.map((step, index) => (
//                 <div
//                   key={index}
//                   className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105"
//                 >
//                   <img
//                     src={step.image}
//                     alt={step.title}
//                     width={300}
//                     height={300}
//                     className="rounded-lg mb-4"
//                   />
//                   <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
//                   <p className="text-gray-600">{step.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
//               Our Bestsellers
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {bestsellers.map((product, index) => (
//                 <div
//                   key={index}
//                   className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
//                 >
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     width={400}
//                     height={400}
//                     className="object-cover w-full h-60 transition-opacity group-hover:opacity-0"
//                   />
//                   <img
//                     src={product.hoverImage}
//                     alt={`${product.name} - hover`}
//                     width={400}
//                     height={400}
//                     className="object-cover w-full h-60 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                     <div className="text-center">
//                       <h3 className="text-xl font-semibold text-white mb-2">
//                         {product.name}
//                       </h3>
//                       <p className="text-white mb-4">{product.price}</p>
//                       <Button
//                         variant="secondary"
//                         className="transition-transform hover:scale-110"
//                       >
//                         View Product
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
//               Experience the Natural Difference
//             </h2>
//             <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
//               <img
//                 src="/placeholder.svg"
//                 alt="Natural ingredients"
//                 width={600}
//                 height={400}
//                 className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
//               />
//               <div className="flex flex-col justify-center space-y-4">
//                 <p className="text-gray-500 md:text-xl">
//                   At EVARA, we believe in the power of nature. Our products are
//                   crafted with carefully selected natural ingredients to nourish
//                   and revitalize your skin. Experience the difference of truly
//                   natural skincare.
//                 </p>
//                 <Button className="w-fit transition-transform hover:scale-105">
//                   Discover Our Ingredients
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
//               Customer Testimonials
//             </h2>
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {[1, 2, 3].map((item) => (
//                 <div
//                   key={item}
//                   className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105"
//                 >
//                   <p className="text-gray-500 mb-4">
//                     "EVARA has transformed my skincare routine. My skin has
//                     never looked better!"
//                   </p>
//                   <p className="font-semibold">- Happy Customer {item}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>
//       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
//         <p className="text-xs text-gray-500">
//           © 2024 EVARA. All rights reserved.
//         </p>
//         <nav className="sm:ml-auto flex gap-4 sm:gap-6">
//           <a className="text-xs hover:underline underline-offset-4" href="#">
//             Terms of Service
//           </a>
//           <a className="text-xs hover:underline underline-offset-4" href="#">
//             Privacy
//           </a>
//         </nav>
//       </footer>
//     </div>
//   );
// }

// import { useState } from 'react'
// import { Button } from '../ui/button'// Assuming you have a Button component
// import Navbar from '../ui/Navbar'

// export default function EvaraLandingPage() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

//   return (
//     <div className="flex flex-col min-h-screen">
//      <Navbar/>
//       <main className="flex-1">
//         <section className="w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6 mx-auto">
//             <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
//               <div className="flex flex-col justify-center space-y-4">
//                 <div className="space-y-2">
//                   <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                     Reveal Your Skin's True Potential
//                   </h1>
//                   <p className="max-w-[600px] text-gray-500 md:text-xl">
//                     Discover the power of nature-inspired skincare. Nourish, protect, and revitalize your skin with EVARA.
//                   </p>
//                 </div>
//                 <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                   <Button className="transition-transform hover:scale-105">Shop Now</Button>
//                   <Button variant="outline" className="transition-transform hover:scale-105">Learn More</Button>
//                 </div>
//               </div>
//               <img
//                 alt="Hero"
//                 className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
//                 height="550"
//                 src="/images/banner/original.png"
//                 width="550"
//               />
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Our Products</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[1, 2, 3, 4].map((item) => (
//                 <div key={item} className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
//                   <img
//                     alt={`Product ${item}`}
//                     className="object-cover w-full h-60"
//                     height="300"
//                     src="/placeholder.svg"
//                     width="400"
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                     <Button variant="secondary" className="transition-transform hover:scale-110">View Product</Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Experience the Natural Difference</h2>
//             <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
//               <img
//                 alt="Natural ingredients"
//                 className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center"
//                 height="400"
//                 src="/placeholder.svg"
//                 width="600"
//               />
//               <div className="flex flex-col justify-center space-y-4">
//                 <p className="text-gray-500 md:text-xl">
//                   At EVARA, we believe in the power of nature. Our products are crafted with carefully selected natural ingredients to nourish and revitalize your skin. Experience the difference of truly natural skincare.
//                 </p>
//                 <Button className="w-fit transition-transform hover:scale-105">Discover Our Ingredients</Button>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Customer Testimonials</h2>
//             <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//               {[1, 2, 3].map((item) => (
//                 <div key={item} className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105">
//                   <p className="text-gray-500 mb-4">"EVARA has transformed my skincare routine. My skin has never looked better!"</p>
//                   <p className="font-semibold">- Happy Customer {item}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>
//       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
//         <p className="text-xs text-gray-500">© 2024 EVARA. All rights reserved.</p>
//         <nav className="sm:ml-auto flex gap-4 sm:gap-6">
//           <a className="text-xs hover:underline underline-offset-4" href="#">
//             Terms of Service
//           </a>
//           <a className="text-xs hover:underline underline-offset-4" href="#">
//             Privacy
//           </a>
//         </nav>
//       </footer>
//     </div>
//   )
// }
