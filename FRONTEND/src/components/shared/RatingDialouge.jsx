import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog'
import { Button } from "../ui/button"
import { Star } from "lucide-react"

export default function RatingDialog({ productName }) {
    const [rating, setRating] = useState(0)
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Star className="mr-2 h-4 w-4" />
            Rate & Review
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate & Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-medium mb-2">{productName}</h4>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`hover:text-yellow-400 ${
                      rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Write your review here..."
            />
            <Button className="w-full">Submit Review</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }