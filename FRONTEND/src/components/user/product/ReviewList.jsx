import React from "react";

import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";

export default function ReviewList({ reviews }) {
  return (
    <ul className="space-y-6">
      {reviews.map((review) => (
        <li className="border-b pb-4 last:border-b-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                {review.author[0].toUpperCase()}
              </div>
              <div>
                <span className="font-semibold">{review.author}</span>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
            </div>
            <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
          </div>
          {review.title && (
            <h4 className="text-sm font-medium mb-1">{review.title}</h4>
          )}
          <p className="text-sm text-gray-600">{review.comment}</p>
          <div className="flex items-center mt-2 space-x-4">
            <ThumbsUpIcon className="font-xs" />
            <ThumbsDownIcon className="font-xs" />
          </div>
        </li>
      ))}
    </ul>
  );
}
