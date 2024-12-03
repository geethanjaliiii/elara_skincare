import { axiosInstance } from "@/config/axiosConfig";

export const fetchProducts=async({queryKey})=>{
    const[,{page,categoryFilters,skinTypeFilters,sortOrder,searchTerm,priceRange}]=queryKey;
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
    if (priceRange[0] > 100 || priceRange[1] < 3000) {
      queryParams.append("maxPrice", priceRange[1]);
      queryParams.append("minPrice", priceRange[0]);
    }
    console.log("query", queryParams);
    const response=await axiosInstance.get(`/api/users/products?${queryParams.toString()}`)
    return response.data
  }
  export const fetchCategories=async()=>{
    const response=await axiosInstance.get('/api/users/categories');
    return response.data.categories
  }
  export const fetchBestSellers=async()=>{
    const response=await axiosInstance.get('/api/users/products/bestsellers')
    return response.data.bestProducts
  }