import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function WriteReview() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmitReview = () => {
    console.log("New Review Submitted", { rating, comment })
    setRating(0)
    setComment("")
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2">Write a Review</h4>
      <div className="mb-4">
        <span className="block mb-1">Rate the product:</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <Textarea
        placeholder="Review Content"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleSubmitReview}>Submit Review</Button>
    </div>
  )
}
