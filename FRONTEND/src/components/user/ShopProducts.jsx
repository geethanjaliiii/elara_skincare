import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronDown, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductCard from "./shop/ProductCard";
import ShopHeader from "./shop/ShopHeader";
import {axiosInstance} from "@/config/axiosConfig";
import FilterSidebar from "./shop/FilterSidebar";

const skinTypes = [
    "Dry",
    "Oily",
    "Combination",
    "Normal",
    "Sensitive",
    "All Skin Types",
  ];

export default function ShopProducts() {

  const [selectedCategory, setSelectedCategory] = useState("All Products");

  const [categories,setCategories] =useState([])
  const [sortOrder, setSortOrder] = useState("lowToHigh");
  const [priceRange, setPriceRange] = useState([0, 2500000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [products,setProducts]=useState([])
  const [skinType, setSkinType]=useState([])
   function handleSkinTypeChange(){}
  useEffect(()=>{
async function fetchProducts() {
  try {
    const response=await  axiosInstance.get('/api/users/products')
    const categoriesResponse=await axiosInstance.get('/api/users/categories')

    setProducts(response.data.products)
    setCategories(categoriesResponse.data.categories)
  } catch (error) {
      console.log("Error fetching products",error.message);
  }
}
fetchProducts()
  },[])

  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === "All Products" ||
        product.category === selectedCategory
    )
    .filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "lowToHigh" ? a.price - b.price : b.price - a.price
    );

  return (
    <>
      <ShopHeader />
      <div className="min-h-screen bg-slate-50 bg-cover bg-center  mt-0">
        <main className="container mx-auto px-4 pb-8 pt-1">
          <p className="text-sm text-gray-600 mb-4 sm:mb-0 p-2">
            {searchTerm
              ? `Showing ${filteredProducts.length} results for ${searchTerm}`
              : `Showing ${products.length} Results`}
          </p>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              className="md:hidden mb-4"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-5 w-5" /> Filters
            </Button>
            {/* Sidebar Filters */}
            <aside
              className={`w-full md:w-64 space-y-6 bg-white p-4 rounded-lg shadow md:sticky md:top-4 ${
                showFilters ? "block" : "hidden"
              } md:block`}
            >
               
              <div>
                <h2 className="text-lg font-semibold mb-2">Categories</h2>
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={`category-${category._id}`}
                      checked={selectedCategory === category}
                      onCheckedChange={() => setSelectedCategory(category)}
                    />
                    <Label htmlFor={`category-${category.name}`}>{category.name}</Label>
                  </div>
                ))}
              </div>
              <div className="mb-4">
        <h3 className="font-semibold mb-2">Skin Type</h3>
        {skinTypes.map((type,index) => (
          <div key={index} className="flex items-center mb-2">
            <Checkbox
              id={`skinType-${type}`}
              checked={skinType.includes(type) }
              onCheckedChange={() => handleSkinTypeChange(type)}
            />
            <label htmlFor={`skinType-${type}`} className="ml-2 text-sm">
              {type}
            </label>
          </div>
        ))}
      </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Price Range</h2>
                <Slider
                  min={0}
                  max={2500000}
                  step={10000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between mt-2">
                  <span>Rp {priceRange[0].toLocaleString()}</span>
                  <span>Rp {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </aside>
            {/* Product Grid */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Sort by <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortOrder("lowToHigh")}>
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("highToLow")}>
                      Price: High to Low
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard {...product} key={product._id}/>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// import { useState } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { ArrowUpDown, ChevronDown, Search } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Slider } from "@/components/ui/slider"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import ProductCard from '../../components/user/shop/ProductCard'

// const categories = [
//   "All Products",
//   "Face",
//   "Body",
//   "Hand & Foot",
//   "Hair",
//   "Makeup",
// ]

// const products = [
//   { id: 1, name: "LANEIGE Water Bank Blue Hyaluronic Cream", category: "Face", price: 2000000, originalPrice: 2200000, rating: 4.6, reviews: 54, image: "/placeholder.svg", isNew: true },
//   { id: 2, name: "The Ordinary Niacinamide 10% + Zinc 1%", category: "Face", price: 280000, originalPrice: 300000, rating: 4.7, reviews: 88, image: "/placeholder.svg", isRecommended: true },
//   { id: 3, name: "Bondi Sands Pure Self Tan Foaming Water", category: "Body", price: 399000, originalPrice: 450000, rating: 4.5, reviews: 32, image: "/placeholder.svg" },
//   { id: 4, name: "Laniege Radian-C Cream", category: "Face", price: 590000, originalPrice: 650000, rating: 4.8, reviews: 76, image: "/placeholder.svg", isRecommended: true },
//   { id: 5, name: "The Ordinary AHA 30% + BHA 2% Peeling Solution", category: "Face", price: 649000, originalPrice: 700000, rating: 4.9, reviews: 102, image: "/placeholder.svg", isNew: true },
// ]

// export default function ShopPage() {
//   const [selectedCategory, setSelectedCategory] = useState("All Products")
//   const [sortOrder, setSortOrder] = useState("lowToHigh")
//   const [priceRange, setPriceRange] = useState([0, 2500000])
//   const [searchTerm, setSearchTerm] = useState("")

//   const filteredProducts = products
//     .filter(product => selectedCategory === "All Products" || product.category === selectedCategory)
//     .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
//     .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
//     .sort((a, b) => sortOrder === "lowToHigh" ? a.price - b.price : b.price - a.price)

//   return (
//     <div className="min-h-screen bg-[url('/placeholder.svg')] bg-cover bg-center">
//       <header className="bg-white shadow-sm">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <h1 className="text-3xl font-bold text-gray-800">shep</h1>
//             <nav>
//               <ul className="flex space-x-4">
//                 <li><a href="#" className="text-gray-600 hover:text-gray-800">Shop</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-gray-800">About</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-gray-800">Contact</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-gray-800">Account</a></li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </header>
//       <main className="container mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row gap-8">
//           <aside className="w-full md:w-64 space-y-6 bg-white p-4 rounded-lg shadow">
//             <div>
//               <h2 className="text-lg font-semibold mb-2">Categories</h2>
//               {categories.map((category) => (
//                 <div key={category} className="flex items-center space-x-2 mb-2">
//                   <Checkbox
//                     id={`category-${category}`}
//                     checked={selectedCategory === category}
//                     onCheckedChange={() => setSelectedCategory(category)}
//                   />
//                   <Label htmlFor={`category-${category}`}>{category}</Label>
//                 </div>
//               ))}
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold mb-2">Price Range</h2>
//               <Slider
//                 min={0}
//                 max={2500000}
//                 step={10000}
//                 value={priceRange}
//                 onValueChange={setPriceRange}
//               />
//               <div className="flex justify-between mt-2">
//                 <span>Rp {priceRange[0].toLocaleString()}</span>
//                 <span>Rp {priceRange[1].toLocaleString()}</span>
//               </div>
//             </div>
//           </aside>
//           <div className="flex-1">
//             <div className="flex justify-between items-center mb-4">
//               <div className="relative">
//                 <Input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10"
//                 />
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline">
//                     Sort by <ChevronDown className="ml-2 h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem onClick={() => setSortOrder("lowToHigh")}>Price: Low to High</DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setSortOrder("highToLow")}>Price: High to Low</DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               <AnimatePresence>
//                 {filteredProducts.map((product) => (
//                   <motion.div
//                     key={product.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <ProductCard {...product} />
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
