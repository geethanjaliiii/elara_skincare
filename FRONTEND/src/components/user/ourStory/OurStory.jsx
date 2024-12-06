
import { motion } from 'framer-motion'
import { Leaf, Heart, Sprout } from 'lucide-react'


export default function OurStory() {
  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 text-center mb-8">
          The Elara Story
        </h1>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-lg shadow-xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-green-700 mb-4">Our Philosophy</h2>
          <p className="text-lg text-gray-700 mb-6">
            Care for your body and the planet. At Elara, we believe in keeping things real and natural.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Leaf className="w-10 h-10 text-green-500" />}
              title="Vegan & Sustainable"
              description="Our products are 100% vegan and sustainably produced."
            />
            <FeatureCard 
              icon={<Heart className="w-10 h-10 text-green-500" />}
              title="Handmade with Love"
              description="Each product is crafted with care and attention to detail."
            />
            <FeatureCard 
              icon={<Sprout className="w-10 h-10 text-green-500" />}
              title="Ethically Sourced"
              description="We grow most of our ingredients on our own farm."
            />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-lg shadow-xl p-8 flex flex-col md:flex-row items-center"
        >
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <img
              src="https://res.cloudinary.com/dby2ebbkr/image/upload/v1733418477/banners/huhfbrejlvyi1vvq6kje.jpg"
              alt="Geethanjali, Founder of Elara"
              width={400}
              height={400}
              className="rounded-full shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-green-700 mb-4">Hi, Beautiful Soul</h2>
            <p className="text-lg text-gray-700 mb-6">
              "My journey with sensitive, acne-prone skin in school led me to explore natural, organic solutions. This personal experience inspired the creation of Elara. Since our inception, we've been dedicated to crafting skin and hair care products that are pure, natural, and effective. As we help you enhance your natural beauty every day, we remain committed to nurturing our environment. At Elara, we firmly believe that what's good for you should be equally good for our planet."
            </p>
            <p className="text-xl font-semibold text-green-700">
              - Geethanjali, Founder
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-green-50 rounded-lg p-6 shadow-md"
    >
      <div className="flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-green-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

