import React from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ShopHeader() {
  return (
    <div className="w-full ">
       
      <div className="relative h-64 md:h-65 overflow-hidden md:block hidden">
        <img
          src="https://res.cloudinary.com/dby2ebbkr/image/upload/v1733253773/shop_1_ggxrl2.jpg"
          alt="Skincare products with leaves and soft lighting"
          className="w-full h-full object-cover "
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Shop</h1>
          <nav className="text-sm md:text-base">
            <ol className="flex items-center">
              <li>
                <a href="/" className="hover:underline">Home</a>
              </li>
              <ChevronRight className="mx-2 h-4 w-4" />
              <li>Shop</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  )
}