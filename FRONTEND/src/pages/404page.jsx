'use client'

import Footer from "@/components/shared/Footer"
import Navbar from "@/components/shared/Navbar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Cog, Home, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"

export default function ErrorPage() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-cream-200 to-cream-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Cogs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 right-1/4"
      >
        <Cog className="w-16 h-16 text-cream-600/20" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 left-1/4"
      >
        <Cog className="w-24 h-24 text-cream-600/20" />
      </motion.div>

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h1 className="text-[150px] font-bold text-cream-800 leading-none md:text-[200px] tracking-tight">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShoppingBag className="w-20 h-20 text-cream-600/30" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-cream-900">
            Oops! Page Not Found
          </h2>
          <p className="text-cream-700 text-lg max-w-md mx-auto">
            The product you're looking for seems to have wandered off our shelves.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/">
            <Button className="bg-black/30 hover:bg-cream-700 text-white min-w-[200px]">
              <Home className="mr-2 h-4 w-4" />
              Back to Homepage
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" className="border-cream-800 text-cream-800 hover:bg-black hover:text-white min-w-[200px]">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View Products
            </Button>
          </Link>
        </motion.div>

        {/* Circuit Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-[1px] bg-cream-500/20" />
          <div className="absolute top-20 left-10 w-[1px] h-16 bg-cream-500/20" />
          <div className="absolute top-20 right-10 w-16 h-[1px] bg-cream-500/20" />
          <div className="absolute top-20 right-10 w-[1px] h-16 bg-cream-500/20" />
          <div className="absolute bottom-20 left-10 w-16 h-[1px] bg-cream-500/20" />
          <div className="absolute bottom-20 left-10 w-[1px] h-16 bg-cream-500/20" />
          <div className="absolute bottom-20 right-10 w-16 h-[1px] bg-cream-500/20" />
          <div className="absolute bottom-20 right-10 w-[1px] h-16 bg-cream-500/20" />
        </div>
      </div>
    </div>
    <Footer/>
    </>
    
  )
}
