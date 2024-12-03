import {adminAxiosInstance} from '@/config/axiosConfig';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [errors, setErrors] = useState({
    categoryName: '',
    categoryDescription: '',
  });
  const navigate=useNavigate()
const [error,setError]= useState("")
  // Edge condition checks
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      categoryName: '',
      categoryDescription: '',
    };

    // Category Name: Required, Min length: 3, Max length: 50, No special characters
    if (categoryName.trim() === '') {
      newErrors.categoryName = 'Category Name is required';
      valid = false;
    } else if (categoryName.length < 3) {
      newErrors.categoryName = 'Category Name must be at least 3 characters long';
      valid = false;
    } else if (categoryName.length > 50) {
      newErrors.categoryName = 'Category Name must be less than 50 characters';
      valid = false;
    } else if (!/^[a-zA-Z0-9 ]+$/.test(categoryName)) {
      newErrors.categoryName = 'Category Name should not contain special characters';
      valid = false;
    }

    // Category Description: Required, Min length: 10, Max length: 200
    if (categoryDescription.trim() === '') {
      newErrors.categoryDescription = 'Category Description is required';
      valid = false;
    } else if (categoryDescription.length < 10) {
      newErrors.categoryDescription = 'Description must be at least 10 characters long';
      valid = false;
    } else if (categoryDescription.length > 500) {
      newErrors.categoryDescription = 'Description must be less than 500 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (validateForm()) {
        try {
            const response= await adminAxiosInstance.post('/api/admin/categories',{name:categoryName,description:categoryDescription})
      // Add your logic for submitting the category data (e.g., API call)
      console.log("");
      navigate('/admin/dashboard/categories')
      console.log('Category Name:', categoryName);
      console.log('Category Description:', categoryDescription);

      // Reset form after successful submission
      setCategoryName('');
      setCategoryDescription('');
      setErrors({ categoryName: '', categoryDescription: '' });
      setError("")
        } catch (error) {
            console.log("form submission failed",error.message);
            setError("Category adding failed.")
        }
    
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Category</h1>
      <form onSubmit={handleSubmit} className="border p-4 rounded-lg shadow-md bg-white">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-2" htmlFor="categoryName">
              Category Name:
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter Category Name"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.categoryName ? 'border-red-500' : 'focus:border-blue-500'
              }`}
            />
            {errors.categoryName && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryName}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2" htmlFor="categoryDescription">
              Category Description:
            </label>
            <textarea
              id="categoryDescription"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Enter Category Description"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                errors.categoryDescription ? 'border-red-500' : 'focus:border-blue-500'
              }`}
            />
            {errors.categoryDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryDescription}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black/85 text-white px-6 py-2 rounded-lg hover:bg-slate-600"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
