import React, { useEffect, useState } from "react";
import  { adminAxiosInstance } from "@/config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { changeCategoryStatus, getCategories } from "../api/categories";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const navigate=useNavigate()

  useEffect(() => {
    // Fetch categories from the database/API
    const fetchCategories = async () => {
      try {
        const categoryList = await getCategories();
        console.log(categoryList);
        setCategories(categoryList);
      } catch (error) {
       console.error(error)
      }
    };
    fetchCategories();
  }, [editStatus,searchTerm]);

  // Handle search operation
  const handleSearch = () => {
    const regex = new RegExp(searchTerm, "i");
    const searchResult = categories.filter(
      (category) => regex.test(category.name) || regex.test(category.description)
    );
    setCategories(searchResult);
  };

  const handleStatusToggle = async (categoryId) => {
    // Toggle category status and refresh data
    try {
      await changeCategoryStatus(categoryId)
    setEditStatus(!editStatus); // Toggle edit mode to trigger re-fetch
    } catch (error) {
      console.error(error);
    }
    
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Categories</h1>

      {/* Search and Add Category Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search categories by name or description."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/2"
        />
        <button
          onClick={handleSearch}
          className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition w-full md:w-auto"
        >
          Search
        </button>
        <button
          onClick={() => navigate('add')}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-500 transition w-full md:w-auto"
        >
          + Add Category
        </button>
      </div>

      {/* Category Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-400 text-black shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-slate-300">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Category Name</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">List / Unlist</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category,index) => (
                <tr key={category._id} className="border-b border-gray-700">
                  <td className="py-2 px-4">{index+1}</td>
                  <td className="py-2 px-4">{category.name}</td>
                  <td className="py-2 px-4">{category.description}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleStatusToggle(category._id)}
                      className={`px-4 py-2 rounded transition ${
                        category.isListed
                          ? "bg-green-600 hover:bg-green-500"
                          : "bg-red-600 hover:bg-red-500"
                      }`}
                    >
                      {category.isListed ? "Unlist" : "List"}
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() =>  {navigate('edit',{state:{catId:category._id}})}}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-2 px-4 text-center text-gray-300">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
