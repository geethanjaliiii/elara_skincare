import React from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ShopHeader() {
  return (
    <div className="w-full  ">
         <nav className="text-sm md:text-base sm:hidden block overflow-x-hidden">
            <ol className="flex items-center">
              <li>
                <a href="/" className="hover:underline">Home</a>
              </li>
              <ChevronRight className="mx-2 h-4 w-4" />
              <li>Shop</li>
            </ol>
          </nav>
      <div className="relative h-64 md:h-65 overflow-hidden md:block hidden">
        <img
          src="/images/banner/shop.jpg"
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
      {/* <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 sm:mb-0">
            Showing 1-16 of 32 results
          </p> */}
          {/* <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <Select defaultValue="16">
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="16" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by</span>
              <Select defaultValue="default">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}
        {/* </div>
      </div> */}
    </div>
  )
}