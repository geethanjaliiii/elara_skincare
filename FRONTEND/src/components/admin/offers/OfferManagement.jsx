'use client'

import { useState ,useEffect} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryOfferManagement } from './CategoryOfferManagement'
import { ProductOfferManagement } from './ProductOfferManagement'
import { adminAxiosInstance } from '@/config/axiosConfig'
import toast,{ Toaster } from 'react-hot-toast'



export default function OfferManagement() {
const[productOffers,setProductOffers]=useState([])
const[categoryOffers,setCategoryOffers]=useState([])
  
async function fetchOffers(){
  try {
   const response= await adminAxiosInstance.get('/api/admin/offers')
   console.log(response.data);
   
   setCategoryOffers(response.data.categoryOffers)
   setProductOffers(response.data.productOffers)
  } catch (error) {
    console.log("failed to fetch offers",error);
  }
  }
  //function to submit offer
  async function handleAddOffer(offerData, targetType) {
    try {
      const endpoint = targetType === 'Product'
        ? '/api/admin/offers/products'
        : '/api/admin/offers/categories'
      const response = await adminAxiosInstance.post(endpoint, offerData)

      // Update state with the new offer
      if (targetType === 'Product') {
        setProductOffers([...productOffers, response.data.newOffer])
      } else {
        setCategoryOffers([...categoryOffers, response.data.newOffer])
        console.log([...categoryOffers, response.data.newOffer]);
        
      }

      toast.success(`${targetType.charAt(0).toUpperCase() + targetType.slice(1)} offer created successfully`)
      fetchOffers() // Refetch to sync updates
    } catch (error) {
      console.error('Error creating offer:', error)
      const errorMassage=error?.response?.data?.message||'Failed to create offer'
      toast.error(errorMassage)
    }
  }

  useEffect(()=>{
  fetchOffers()
  },[])
  return (
    <div className="container mx-auto py-10">
      <Toaster/>
      <h1 className="text-3xl font-bold mb-6">Offer Management</h1>
      <Tabs defaultValue="category" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="category">Category Offers</TabsTrigger>
          <TabsTrigger value="product">Product Offers</TabsTrigger>
        </TabsList>
        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Category Offers</CardTitle>
              <CardDescription>Manage offers for specific categories</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryOfferManagement
               categoryOffers={categoryOffers}
               onAddOffer={(offerData) => handleAddOffer(offerData, 'Category')} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="product">
          <Card>
            <CardHeader>
              <CardTitle>Product Offers</CardTitle>
              <CardDescription>Manage offers for specific products</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductOfferManagement 
              offers={productOffers}
              onAddOffer={(offerData) => handleAddOffer(offerData, 'Product')}/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}