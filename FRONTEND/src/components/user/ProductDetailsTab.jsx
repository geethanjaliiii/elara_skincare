import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import CustomerFeedback from './product/CustomerFeedback'
import ReviewList from './product/ReviewList'
import WriteReview from './product/WriteReview'

export default function ProductDetailsTabs({ description, reviews }) {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <Card className="w-full mt-8 p-4">
      <Tabs defaultValue="description" onValueChange={setActiveTab} >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>
        <CardContent className="pt-6">
          <TabsContent value="description">
           {description}
          </TabsContent>
          <TabsContent value="reviews">
            <CustomerFeedback reviews={reviews} />
            <ReviewList reviews={reviews} />
            <WriteReview />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}

