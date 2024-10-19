import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, Edit, Plus, Search, Trash2 } from 'lucide-react'
import Image from 'next/image'

// Mock data for demonstration
const mockProducts = [
  { id: 1, name: "Hydrating Serum", description: "Intense hydration for all skin types", variant: "30ml", stock: 50, price: 29.99, category: "Serum", brand: "Elara", image: "/placeholder.svg" },
  { id: 2, name: "Gentle Cleanser", description: "Soft, foaming cleanser for sensitive skin", variant: "200ml", stock: 100, price: 19.99, category: "Cleanser", brand: "Elara", image: "/placeholder.svg" },
  { id: 3, name: "Brightening Moisturizer", description: "Illuminating daily moisturizer with SPF 30", variant: "50ml", stock: 75, price: 34.99, category: "Moisturizer", brand: "Elara", image: "/placeholder.svg" },
  { id: 4, name: "Exfoliating Toner", description: "Clarifying toner with AHAs and BHAs", variant: "150ml", stock: 60, price: 24.99, category: "Toner", brand: "Elara", image: "/placeholder.svg" },
  { id: 5, name: "Nourishing Night Cream", description: "Rich, restorative night treatment", variant: "50ml", stock: 40, price: 39.99, category: "Moisturizer", brand: "Elara", image: "/placeholder.svg" },
]

export default function Products() {
  const [products, setProducts] = useState(mockProducts)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [filters, setFilters] = useState({ category: 'all', priceRange: [0, 100], quantity: [0, 100] })
  const [searchTerm, setSearchTerm] = useState('')

  const sortProducts = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const getSortedProducts = () => {
    const sortableProducts = [...products]
    if (sortConfig.key !== null) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableProducts
  }

  const getFilteredProducts = () => {
    return getSortedProducts().filter(product => 
      (filters.category === 'all' || product.category === filters.category) &&
      (product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]) &&
      (product.stock >= filters.quantity[0] && product.stock <= filters.quantity[1]) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }

  const handleCategoryChange = (value) => {
    setFilters(prev => ({ ...prev, category: value }))
  }

  const handlePriceRangeChange = (value) => {
    setFilters(prev => ({ ...prev, priceRange: value }))
  }

  const handleQuantityChange = (value) => {
    setFilters(prev => ({ ...prev, quantity: value }))
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log(`Editing product with id: ${id}`)
  }

  const handleUnlist = (id) => {
    // Implement unlist functionality
    console.log(`Unlisting product with id: ${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Skin Care Product List</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add New Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-1 space-y-4">
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Cleanser">Cleanser</SelectItem>
                  <SelectItem value="Toner">Toner</SelectItem>
                  <SelectItem value="Serum">Serum</SelectItem>
                  <SelectItem value="Moisturizer">Moisturizer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price Range</Label>
              <Slider
                min={0}
                max={100}
                step={1}
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                className="mt-2"
              />
              <div className="flex justify-between mt-2">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
            <div>
              <Label>Quantity</Label>
              <Slider
                min={0}
                max={100}
                step={1}
                value={filters.quantity}
                onValueChange={handleQuantityChange}
                className="mt-2"
              />
              <div className="flex justify-between mt-2">
                <span>{filters.quantity[0]}</span>
                <span>{filters.quantity[1]}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full"
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead className="w-[250px]">
                    <button className="font-semibold" onClick={() => sortProducts('name')}>
                      Product Name
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'ascending' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="font-semibold" onClick={() => sortProducts('category')}>
                      Category
                      {sortConfig.key === 'category' && (
                        sortConfig.direction === 'ascending' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="font-semibold" onClick={() => sortProducts('brand')}>
                      Brand
                      {sortConfig.key === 'brand' && (
                        sortConfig.direction === 'ascending' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="font-semibold" onClick={() => sortProducts('price')}>
                      Price
                      {sortConfig.key === 'price' && (
                        sortConfig.direction === 'ascending' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="font-semibold" onClick={() => sortProducts('stock')}>
                      Quantity
                      {sortConfig.key === 'stock' && (
                        sortConfig.direction === 'ascending' ? <ChevronUp className="inline ml-1" /> : <ChevronDown className="inline ml-1" />
                      )}
                    </button>
                  </TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredProducts().map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image src={product.image} alt={product.name} width={50} height={50} className="rounded-md" />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(product.id)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleUnlist(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}