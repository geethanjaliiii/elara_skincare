import React from 'react'



export default function CustomerFeedback({ reviews }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold">Customer Feedback</h3>
      <div className="flex items-center mt-4">
        <div className="text-4xl font-semibold mr-4">4.8</div>
        <div className="flex flex-col w-full">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center">
              <div className="text-yellow-500">{'★'.repeat(stars)}</div>
              <div className="ml-2 text-gray-600">{Math.floor(Math.random() * 100)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
