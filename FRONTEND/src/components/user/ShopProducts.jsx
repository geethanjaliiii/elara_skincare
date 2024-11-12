import React, { useState, useEffect, Suspense } from "react";
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
import { Label } from "@/components/ui/label";
const NoProducts = React.lazy(() => import("../user/shop/NoProducts"));
import ProductCard from "./shop/ProductCard";
import ShopHeader from "./shop/ShopHeader";
import { axiosInstance } from "@/config/axiosConfig";
import { useSearchParams } from "react-router-dom";

const skinTypes = [
  "dry",
  "oily",
  "combination",
  "normal",
  "sensitive",
  "All Skin Types",
];

export default function ShopProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("popularity");
  const [priceRange, setPriceRange] = useState([100, 25000]);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [skinTypeFilters, setSkinTypeFilters] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const searchTerm = searchParams.get("term") || "";
  const handleSkinTypeChange = (type) => {
    console.log("skintypes", skinTypeFilters);

    setSkinTypeFilters((prev) =>
      prev.includes(type)
        ? prev.filter((skinType) => skinType != type)
        : [...prev, type]
    );
  };
  const handleCategoryChange = (catId) => {
    setCategoryFilters((prev) =>
      prev.includes(catId) ? prev.filter((id) => id != catId) : [...prev, catId]
    );
  };
  useEffect(() => {
    async function fetchProducts() {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", page);
        if (categoryFilters.length > 0) {
          queryParams.append("categoryIds", categoryFilters.join(","));
        }
        if (skinTypeFilters.length > 0) {
          queryParams.append("skinTypes", skinTypeFilters.join(","));
        }
        if (sortOrder != "popularity") {
          queryParams.append("sort", sortOrder);
        }
        if (searchTerm) {
          queryParams.append("term", searchTerm);
        }
        if (priceRange[0] > 100 || priceRange[1] < 10000) {
          queryParams.append("maxPrice", priceRange[1]);
          queryParams.append("minPrice", priceRange[0]);
        }
        console.log("query", queryParams);

        const [response, categoriesResponse] = await Promise.all([
          axiosInstance.get(`/api/users/products?${queryParams.toString()}`),
          axiosInstance.get("/api/users/categories"),
        ]);
        setProducts(response.data.products);
        setCategories(categoriesResponse.data.categories);
        setTotalPages(response.data.totalPages);
        //  setPriceRange(response.data.priceRange)
      } catch (error) {
        console.log("Error fetching products", error.message);
      }
    }
    fetchProducts();
  }, [categoryFilters, skinTypeFilters, sortOrder, searchTerm, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    //breaking the query param url to objects
    //spreading searcparams
    //and updating page
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: newPage,
    });
  };
  return (
    <>{products.length>0 ? (<>
    <ShopHeader />
      <div className="min-h-screen bg-slate-50 bg-cover bg-center  mt-0">
        {/* <main className="container mx-auto px-4 pb-8 pt-1"> */}
        <main className="container mx-auto px-4 pb-8 pt-4 sm:pt-6 lg:pt-2">
          <p className="text-sm text-gray-600 mb-4 sm:mb-0 p-2">
            {searchTerm
              ? `Showing ${products.length} results for ${searchTerm}`
              : `Showing ${products.length} Results`}
          </p>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              className="md:hidden mb-4 "
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
                      checked={categoryFilters.includes(category._id)}
                      onCheckedChange={() => handleCategoryChange(category._id)}
                    />
                    <Label htmlFor={`category-${category.name}`}>
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Skin Type</h3>
                {skinTypes.map((type, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Checkbox
                      id={`skinType-${type}`}
                      checked={skinTypeFilters.includes(type)}
                      onCheckedChange={() => handleSkinTypeChange(type)}
                    />
                    <label
                      htmlFor={`skinType-${type}`}
                      className="ml-2 text-sm"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Price Range</h2>
                <Slider
                  min={100}
                  max={10000}
                  step={10}
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
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0 ">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Sort by <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setSortOrder("popularity")}
                    >
                      Popularity
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("lowToHigh")}>
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("highToLow")}>
                      Price: High to Low
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("featured")}>
                      Featured
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortOrder("newArrivals")}
                    >
                      New Arrivals
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("inc")}>
                      aA-zZ
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder("dec")}>
                      zZ-aA
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  gap-4">
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard {...product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-8 space-x-4">
                <Button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>):<Suspense>
      <NoProducts/></Suspense>}
      
    </>
  );
}
