'use client'

import { useState, useCallback, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { PlusCircle } from 'lucide-react'
import { adminAxiosInstance } from "@/config/axiosConfig"
import { debounce } from "lodash"
import toast, { Toaster } from "react-hot-toast"



export function ProductOfferManagement({offers,onAddOffer}) {
  
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [offerName, setOfferName] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)



  async function fetchProducts(query) {
    setLoading(true)
    try {
      const response = await adminAxiosInstance.get(`/api/admin/offers/products`, {
        params: { search: query },
      })
      setProducts(response.data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const debouncedFetchProducts = useCallback(
    debounce((query) => fetchProducts(query), 500),
    []
  )

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedFetchProducts(value)
  }

const handleSubmit = (e) => {
  e.preventDefault()
  if (!selectedProduct || !offerName.trim() || !discountPercentage || !startDate || !endDate) {
    toast.error('Please fill in all fields')
    return
  }

  const offerData = {
    targetId: selectedProduct,
    name: offerName,
    offerValue: parseInt(discountPercentage),
    startDate,
    endDate,
  }

  onAddOffer(offerData)
  // Reset form fields
  setIsDialogOpen(false)
  setSelectedProduct(null)
  setOfferName('')
  setDiscountPercentage('')
  setStartDate('')
  setEndDate('')
  setSearchTerm('')
  
}

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Current Product Offers</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product Offer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Product Offer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Toaster />
                <div className="space-y-2">
                  <Label htmlFor="product">Search Product</Label>
                  <Input
                    id="product"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search for a product"
                  />
                  {loading && <p>Loading...</p>}
                  {products?.length > 0 && (
                    <ul className="border border-gray-300 mt-2 max-h-40 overflow-y-auto">
                      {products.map((product) => (
                        <li
                          key={product._id}
                          onClick={() => {
                            setSelectedProduct(product._id)
                            setSearchTerm(product.name)
                            setProducts([])
                          }}
                          className="cursor-pointer p-2 hover:bg-gray-200"
                        >
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offerName">Offer Name</Label>
                  <Input
                    id="offerName"
                    value={offerName}
                    onChange={(e) => setOfferName(e.target.value)}
                    placeholder="Enter offer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Discount Percentage</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    max='80'
                    min='0'
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                    placeholder="Enter discount percentage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Offer</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
       {offers?.length>0 ?(
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product </TableHead>
              <TableHead>Offer Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              {/* <TableHead>Is Active</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer._id}>
                <TableCell>{offer.targetId.name}</TableCell>
                <TableCell>{offer.name}</TableCell>
                <TableCell>{offer.offerValue}%</TableCell>
                <TableCell>{offer.startDate}</TableCell>
                <TableCell>{offer.endDate}</TableCell>
                {/* <TableCell>
                  <Switch
                    checked={offer.isActive}
                    onCheckedChange={() => toggleOfferStatus(offer.id)}
                    aria-label={`Toggle active status for ${offer.name}`}
                  />
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
       ):( <div className="flex flex-col items-center justify-center p-8 bg-gray-100 border border-gray-300 rounded-lg">
        <p className="text-lg font-semibold text-gray-700">No offers found!</p>
        <span className="text-sm text-gray-500">
          Currently, there are no active product offers.
        </span>
      </div> 
    )}
      
      </div>
    </div>
  )
}