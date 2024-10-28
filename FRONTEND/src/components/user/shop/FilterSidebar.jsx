
  import React,{useState} from 'react'
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
  const FilterSidebar = ({categories}) => {
    const [priceRange, setPriceRange] = useState([0, 500]);
   
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

    return (
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
    
          <div>
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
          </div>
        </div>
      );
  }
  
  export default FilterSidebar
  