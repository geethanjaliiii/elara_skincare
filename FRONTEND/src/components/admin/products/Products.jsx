import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Edit,
  List,
  Grid,
  Filter,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import  { adminAxiosInstance } from "@/config/axiosConfig";

const skinTypes = [
"normal",
      "dry",
      "oily",
      "combination",
      "sensitive",
      "All skin types",
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState("recommended");
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [skinTypeFilters, setSkinTypeFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [list, setList] = useState(false);
  const navigate =useNavigate()
  //fetch product details
  useEffect(() => {
    async function fetchData() {
      try {
        //construct query paramenters for filters and sorting
        const queryParams = new URLSearchParams();

        if (categoryFilters.length > 0) {
          queryParams.append("categoryIds", categoryFilters.join(","));
        }
        if (skinTypeFilters.length > 0) {
          queryParams.append("skinTypes", skinTypeFilters.join(","));
        }
        if (priceRange[0] > 0 || priceRange[1] < 500) {
          queryParams.append("minPrice", priceRange[0]);
          queryParams.append("maxPrice", priceRange[1]);
        }
        if (searchTerm) {
          queryParams.append("searchTerm", searchTerm);
        }
        if (sortOption !== "recommended") {
          queryParams.append("sort", sortOption);
        }

        const response = await adminAxiosInstance.get(
          `api/admin/products?${queryParams.toString()}`
        );
        if (!response) {
          console.log("products not found");
          toast.error("Products not found!");
          return;
        }
        setProducts(response?.data?.products);
        console.log("pro", products);
      } catch (error) {
        console.log("products not found", error.message);
      }
    }
    fetchData();
  }, [list, categoryFilters, priceRange, searchTerm, sortOption,skinTypeFilters]);

  //fetch category details
  useEffect(() => {
    async function fetchCategory() {
      try {
        const response = await adminAxiosInstance.get("api/admin/categories");
        console.log(response.data);

        if (!response) {
          console.log("categories not found");
          return;
        }
        const fetchedCategories=response?.data?.categories
        setCategories(fetchedCategories.filter(category=>category.isListed));
        console.log(response.data.categories);
      } catch (error) {
        console.log("categoried not found", error);
      }
      console.log("categories", categories);
    }
    fetchCategory();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setCategoryFilters((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSkinTypeChange = (type) => {
    setSkinTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  //list or unlist products
  const toggleListed = async (_id) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === _id
          ? { ...product, isListed: !product.isListed }
          : product
      )
      
    );
    try {
      await adminAxiosInstance.patch(`/api/admin/products/${_id}`);
      setList(!list);
    } catch (error) {
      console.log("error in listing products", error.message);
    }
  };
  const handleAddProduct = () => {
    navigate('/admin/dashboard/products/add')
  };
  const FilterSidebar = () => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="font-bold text-lg mb-4">Filters</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Category</h3>
        {categories.map((category) => (
          <div key={category._id} className="flex items-center mb-2">
            <Checkbox
              id={`category-${category.name}`}
              checked={categoryFilters.includes(category._id)}
              onCheckedChange={() => handleCategoryChange(category._id)}
            />
            <label
              htmlFor={`category-${category.name}`}
              className="ml-2 text-sm"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Skin Type</h3>
        {skinTypes.map((type) => (
          <div key={type} className="flex items-center mb-2">
            <Checkbox
              id={`skinType-${type}`}
              checked={skinTypeFilters.includes(type)}
              onCheckedChange={() => handleSkinTypeChange(type)}
            />
            <label htmlFor={`skinType-${type}`} className="ml-2 text-sm">
              {type}
            </label>
          </div>
        ))}
      </div>

      {/* <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <Slider
          min={0}
          max={500}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
        />
        <div className="flex justify-between mt-2 text-sm">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div> */}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar for larger screens */}
          <div className="hidden md:block w-64">
            <FilterSidebar />
          </div>

          {/* Product List */}
          <div className="flex-1">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h1 className="text-2xl font-bold">Product List</h1>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button
                      onClick={handleAddProduct}
                      className="sm:p-2"
                    >
                      Add Product
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                    </div>
                    <Select
                      value={sortOption}
                      onValueChange={(value) => setSortOption(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="priceHighLow">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="priceLowHigh">
                          Price: Low to High
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="relative flex-grow">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {/* Filter button for mobile */}
                  <div className="md:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">
                          <Filter className="w-4 h-4 mr-2" /> Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                          <SheetDescription>
                            Apply filters to refine your product search.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-4">
                          <FilterSidebar />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>

              {/* Toggle between grid and list views */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="border rounded-lg p-4 bg-white shadow-md relative"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                      <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                      <p className="text-sm mb-2">
                        Category: {product.categoryId.name}
                      </p>
                      <p className="text-sm mb-2">
                        SkinType: {product.skinType}
                      </p>
                      <p className="text-lg font-semibold">₹{product.price}</p>

                      {/* Admin actions */}
                      <div className="absolute top-2 right-2 flex flex-col space-y-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={()=>navigate('/admin/dashboard/products/edit',{state:{productId:product._id}})}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit product</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => toggleListed(product._id)}
                              >
                                {product.isListed ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {product.isListed ? "Unlist" : "List"} product
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-md"
                            />
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.categoryId.name}</TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>{product.totalStock}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="icon" variant="ghost"  onClick={()=>navigate('/admin/dashboard/products/edit',{state:{productId:product._id}})}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit product</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => toggleListed(product._id)}
                                    >
                                      {product.isListed ? (
                                        <Eye className="w-4 h-4" />
                                      ) : (
                                        <EyeOff className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {product.isListed ? "Unlist" : "List"}{" "}
                                      product
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
