import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/shared/Navbar';
import Footer from '../shared/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimate';
import { useNavigate } from 'react-router-dom';
import { ReferralModal } from './referalCode/ReferalModal';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { fetchBestSellers } from '@/services/shop';
import { fetchBanners } from '@/services/banner';

import FounderHero from './landing/Founder';
import VisitUs from './landing/VisitUs';
import { Badge } from '../ui/badge';
import { Gift } from 'lucide-react';

export default function EvaraLandingPage() {

  const navigate = useNavigate();
  const [showReward,setShowReward]=useState(false)
  useScrollAnimation();
  const user = useSelector((state) => state?.user?.userInfo);
  const isReferralRewarded = user ? user?.isReferralRewarded : null;
  const [currentBanner, setCurrentBanner] = useState(0);

  const {data:banners}=useQuery({
    queryKey:['userBanners'],
    queryFn:fetchBanners,
   
  })
  

  const {data:bestsellers,isLoading}=useQuery({
    queryKey:['bestSellers'],
    queryFn:fetchBestSellers,
    select:(data)=>data.map((item)=>item?.productDetails)
  })

  useEffect(() => {
    console.log("banners",banners);
    
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  const routineSteps = [
    { title: 'Cleanse', image: 'https://res.cloudinary.com/dby2ebbkr/image/upload/v1733253394/clense_kblgvv.webp', description: 'Start with a gentle cleanser to remove impurities.' },
    { title: 'Exfoliate', image: 'https://res.cloudinary.com/dby2ebbkr/image/upload/v1733253394/exfoliate_nmalbh.webp', description: 'Use a natural scrub to remove dead skin cells.' },
    { title: 'Moisturize', image: 'https://res.cloudinary.com/dby2ebbkr/image/upload/v1733253403/moisturise_vrd5z3.webp', description: 'Apply a hydrating moisturizer to keep skin supple.' },
    { title: 'Nourish', image: 'https://res.cloudinary.com/dby2ebbkr/image/upload/v1733253404/nourish_lhz4bo.webp', description: 'Finish with a nourishing serum or oil for extra care.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 ">
      {banners?.length>0 && (<section className="relative h-[450px] sm:h-[500px] md:h-[630px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={banners[currentBanner].image}
                alt={banners[currentBanner].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="text-center max-w-3xl px-4">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                  >
                    {banners[currentBanner].title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg sm:text-xl md:text-2xl text-white mb-6 font-light"
                  >
                    {banners[currentBanner].content}
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      className="bg-white text-black hover:bg-gray-200 transition-colors duration-300 text-base sm:text-lg py-2 px-4 sm:px-6"
                      onClick={() => navigate('/shop')}
                    >
                      Discover ELARA
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentBanner ? 'bg-white' : 'bg-gray-400'
                }`}
                onClick={() => setCurrentBanner(index)}
              />
            ))}
          </div>
        </section>)}

        {/* Bestsellers Section */}
        {bestsellers?.length==4 && bestsellers?.length>0 &&<section className="w-full py-12 md:py-24 lg:py-14">
          <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
             Our Bestsellers
          </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              { bestsellers.map((product) => (
                <div
                  key={product._id}
                  className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-32 sm:h-48 md:h-56 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="text-white mb-4">₹ {product.price}</p>
                      <Button
                        onClick={() => navigate('/shop', { state: { productId: product._id } })}
                        variant="secondary"
                        className="bg-white text-black hover:bg-gray-200 transition-colors duration-300 text-xs sm:text-sm"
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>}

        {/* Four Step Routine Section with Scroll Animation */}
<section className="w-full py-12 md:py-24 lg:py-24 bg-[#f5ede4]">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Elara's Four Step Routine
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {routineSteps.map((step, index) => (
            <motion.div
              key={index}
              onClick={() => navigate("/shop")}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

        {/* Natural Ingredients Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-center mb-8 sm:mb-12">Experience the Natural Difference</h2>
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <motion.img
                src="https://res.cloudinary.com/dby2ebbkr/image/upload/v1733253404/ingre_xi1p3j.png"
                alt="Natural ingredients"
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              />
              <motion.div 
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500 text-base sm:text-lg leading-relaxed"
                >
                  At ELARA, we believe in the power of nature. Our products are crafted with carefully selected natural ingredients to nourish and revitalize your skin. Experience the difference of truly natural skincare that works in harmony with your body's natural processes.
                </p>
                <Button className="w-fit transition-transform hover:scale-105 bg-black text-white hover:bg-gray-800 text-sm sm:text-base"
                onClick={()=>navigate('/our-story')}>
                  Discover Our Ingredients
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {!isReferralRewarded && user && (
  <div className="fixed bottom-4 left-4 z-50">
    <Badge 
      className="cursor-pointer hover:scale-105 transition-transform 
                 bg-white/80 backdrop-blur-sm rounded-full p-2 
                 shadow-lg hover:shadow-xl"
      onClick={() => setShowReward(true)}
    >
      <Gift className="w-6 h-6 text-primary" />
    </Badge>
    {<ReferralModal setOpen={setShowReward} open={showReward}/>}
  </div>
)}

        <section>
         <FounderHero/>
        </section>
     

       <section>
        <VisitUs/>
       </section>
   {/* Customer Reviews Section */}
   {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-[#f5ede4]">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-center mb-8 sm:mb-12">What Our Customers Say</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <motion.div 
                  key={item} 
                  className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: item * 0.1 }}
                >
                  <p className="text-gray-600 mb-4 text-base sm:text-lg italic">"EVARA has transformed my skincare routine. My skin has never looked better! The natural ingredients make all the difference."</p>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">- Happy Customer {item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
    </div>
  );
}


// import React, { useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import Navbar from '@/components/shared/Navbar';
// import Footer from '../shared/Footer';
// import { useScrollAnimation } from '@/hooks/useScrollAnimate';
// import {axiosInstance} from '@/config/axiosConfig';
// import { useNavigate } from 'react-router-dom';
// import { ReferralModal } from './referalCode/ReferalModal';
// import { useSelector } from 'react-redux';

// export default function EvaraLandingPage() {
//   const [bestsellers, setBestsellers] =useState([])
//   const navigate =useNavigate()
//   useScrollAnimation();
//   const user = useSelector((state) => state?.user?.userInfo);
//   const isReferralRewarded=user?user?.isReferralRewarded:null
//   useEffect(()=>{
//     async function fetchBestsellers() {
//       try {
//         const response = await axiosInstance.get('/api/users/products/bestsellers')
//         console.log("Bestsellers fetched.",response?.data?.bestsellers);
//         setBestsellers(response?.data?.bestsellers)
//       } catch (error) {
//         console.log("Error in fetching bestsellers.");
//       }
//     }
//     fetchBestsellers()
//   },[])



//   const routineSteps = [
//     { title: 'Cleanse', image: '/images/category/clense.jpg', description: 'Start with a gentle cleanser to remove impurities.' },
//     { title: 'Exfoliate', image: '/images/category/exfoliate.jpg', description: 'Use a natural scrub to remove dead skin cells.' },
//     { title: 'Moisturize', image: '/images/category/moisturise.jpg', description: 'Apply a hydrating moisturizer to keep skin supple.' },
//     { title: 'Nourish', image: '/images/category/nourish.jpg', description: 'Finish with a nourishing serum or oil for extra care.' },
//   ];

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-1 mt-16">
//         {/* Hero Section */}
//         <section className="relative h-[600px] overflow-hidden ">
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
//                 onClick={()=>navigate('/shop')}
//               >
//                 Discover ELARA
//               </Button>
//             </div>
//           </div>
//         </section>
//  {/* {!isReferralRewarded && user && <ReferralModal/> } */}
 
//         {/* Bestsellers Section */}
//         <section className="w-full py-12 md:py-24 lg:py-14 pb-4">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
//               Our Bestsellers
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//               {bestsellers && bestsellers.map((product) => (
//                 <div
//                   key={product._id}
//                   className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105"
//                 >
//                   <img
//                     src={product.images[0]}
//                     alt={product.name}
//                     className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <div className="text-center">
//                       <h3 className="text-xl font-semibold text-white mb-2">
//                         {product.name}
//                       </h3>
//                       <p className="text-white mb-4">₹ {product.price}</p>
//                       <Button
//                         onClick={()=>navigate('/shop',{state: {productId:product._id}})}
//                         variant="secondary"
//                         className="bg-white text-black hover:bg-gray-200 transition-colors duration-300"
//                       >
//                         Shop Now
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Four Step Routine Section with Scroll Animation */}
//         <section className="w-full py-12 md:py-24 lg:py-24 bg-[#f5ede4]">
//       <div className="container  px-4 md:px-6 mx-auto">
//         <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
//           Elara's Four Step Routine
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {routineSteps.map((step, index) => (
//             <div
//               key={index}
//               onClick={()=>navigate('/shop')}
//               className="relative overflow-hidden rounded-lg shadow-lg scroll-animate cursor-pointer"
//             >
//               <img
//                 src={step.image}
//                 alt={step.title}
//                 className="w-full h-full object-cover transition-transform duration-700"
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//                 <h3 className="text-xl font-semibold text-white">
//                   {step.title}
//                 </h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>

//         <section className="w-full py-12 md:py-24 lg:py-32">
//           <div className="container px-4 md:px-6 mx-auto">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Experience the Natural Difference</h2>
//             <div className="grid gap-8 lg:grid-cols-2 items-center">
//               <img
//                 src="/images/category/ingre.png"
//                 alt="Natural ingredients"
//                 className="w-full h-[500px] object-cover rounded-xl "
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

//         <section className="w-full py-12 md:py-24 lg:py-32  bg-[#f5ede4]">
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
//       <Footer />
//     </div>
//   );
// }

