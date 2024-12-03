import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronDown, Search, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import NoProducts from "./shop/NoProducts";
import ProductCard from "./shop/ProductCard";
import ShopHeader from "./shop/ShopHeader";
import { axiosInstance } from "@/config/axiosConfig";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProducts } from "@/services/shop";
import ProductSkeleton from "./shop/productSkeleton";

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
  const [sortOrder, setSortOrder] = useState("popularity");
  const [priceRange, setPriceRange] = useState([100, 3000]);
  const [showFilters, setShowFilters] = useState(false);
  const [skinTypeFilters, setSkinTypeFilters] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const searchTerm = searchParams.get("term") || "";
  console.log(searchTerm);

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
  //fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  //fetch products
  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "products",
      {
        page,
        categoryFilters,
        skinTypeFilters,
        sortOrder,
        searchTerm,
        priceRange,
      },
    ],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  const products = productData?.products || [];
  const totalPages = productData?.totalPages || 1;

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

  const handleClearFilters = () => {
    setCategoryFilters([]);
    setSkinTypeFilters([]);
    setPriceRange([100, 3000]);
    setSortOrder("popularity");
    // setSearchParams({})
    //or
    const params = Object.fromEntries(searchParams.entries());
    delete params.term;
    setSearchParams(params);
  };
  return (
    <>
      <ShopHeader />
      <div className="min-h-screen bg-slate-50 bg-cover bg-center  mt-0">
        {/* <main className="container mx-auto px-4 pb-8 pt-1"> */}
        {isLoading ? (
          <ProductSkeleton count={6} />
        ) : products?.length > 0 ? (
          <main className="container mx-auto px-4 pb-8 pt-4 sm:pt-6 lg:pt-2">
            <p className="text-sm text-gray-600 mb-4 sm:mb-0 p-2">
              {searchTerm
                ? `Showing ${products.length} results for ${searchTerm}`
                : `Showing ${products.length} Results`}
            </p>
            <div className="flex flex-col md:flex-row gap-8 ">
              {/* Mobile Filter Button */}
              
              <div className="flex justify-between items-center  md:hidden">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-1/2 mr-2">
                      <Filter className="mr-2 h-5 w-5" /> Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full sm:max-w-[425px]">
                    {/* Filters content */}
                    <div className="space-y-6">
                      {/* Categories */}
                      <div>
                        <h2 className="text-lg font-semibold mb-2">
                          Categories
                        </h2>
                        {categories.map((category) => (
                          <div
                            key={category._id}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <Checkbox
                              id={`category-${category._id}`}
                              checked={categoryFilters.includes(category._id)}
                              onCheckedChange={() =>
                                handleCategoryChange(category._id)
                              }
                            />
                            <Label htmlFor={`category-${category._id}`}>
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {/* Skin Type */}
                      <div>
                        <h3 className="font-semibold mb-2">Skin Type</h3>
                        {skinTypes.map((type) => (
                          <div key={type} className="flex items-center mb-2">
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
                      {/* Price Range */}
                      <div>
                        <h2 className="text-lg font-semibold mb-2">
                          Price Range
                        </h2>
                        <Slider
                          min={100}
                          max={3500}
                          step={10}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />
                        <div className="flex justify-between mt-2">
                          <span>Rp {priceRange[0].toLocaleString()}</span>
                          <span>Rp {priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                      {/* Clear Filters button */}
                      <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        className="w-full"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenu >
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-1/2">
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

              {/* Sidebar Filters */}
              <aside
                className="hidden md:block w-64 space-y-6 bg-white p-4 rounded-lg shadow sticky top-4"
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
                        onCheckedChange={() =>
                          handleCategoryChange(category._id)
                        }
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
                    max={3500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between mt-2">
                    <span>Rp {priceRange[0].toLocaleString()}</span>
                    <span>Rp {priceRange[1].toLocaleString()}</span>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </aside>
              {/* Product Grid */}
              <div className="flex-1">
                <div className=" hidden md:block justify-between items-center mb-4 space-y-4 sm:space-y-0 ">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-auto ">
                        Sort by <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent><DropdownMenuItem onClick={() => setSortOrder("popularity")}>Popularity</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setSortOrder("lowToHigh")}>Price: Low to High</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setSortOrder("highToLow")}>Price: High to Low</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setSortOrder("featured")}>Featured</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setSortOrder("newArrivals")}>New Arrivals</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setSortOrder("inc")}>aA-zZ</DropdownMenuItem>
      <DropdownMenuItem onClick={() => setSortOrder("dec")}>zZ-aA</DropdownMenuItem></DropdownMenuContent>
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
        ) : (
          <NoProducts />
        )}
      </div>
    </>
  );
}
