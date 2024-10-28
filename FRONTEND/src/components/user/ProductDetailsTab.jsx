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


// import React, { useState } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { ThumbsUp,ThumbsDown, ThumbsUpIcon } from 'lucide-react'

// export default function ProductDetailsTabs({ description, reviews }) {
//   const [activeTab, setActiveTab] = useState("description")

//   return (
//     <Card className="w-full mt-8">
//       <Tabs defaultValue="description" onValueChange={setActiveTab}>
//         <TabsList className="grid w-full grid-cols-2">
//           <TabsTrigger value="description">Description</TabsTrigger>
//           <TabsTrigger value="reviews">Reviews & Ratings({reviews.length})</TabsTrigger>
//         </TabsList>
//         <CardContent className="pt-6">
//           <TabsContent value="description">
//            {description}
//           </TabsContent>
//           <TabsContent value="reviews">
//             {reviews.length > 0 ? (
//               <ul className="space-y-4">
//                 {reviews.map((review) => (
//                   <li key={review.id} className="border-b pb-4 last:border-b-0">
//                     <div className="flex items-center justify-between">
//                       <span className="font-semibold">{review.author}</span>
//                       <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
//                     </div>
//                     {review.title && <h4 className="text-sm font-medium mt-1">{review.title}</h4>}
//                     <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
//                     <div className="flex items-center mt-2 space-x-4">
//                       <ThumbsUp  className='text-xs '/>
//                       <ThumbsDown className='text-xs'/>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-500">No reviews yet.</p>
//             )}
//           </TabsContent>
//         </CardContent>
//       </Tabs>
//     </Card>
//   )
// }



