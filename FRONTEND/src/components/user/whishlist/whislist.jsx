import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'



export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: "Wireless Headphones", price: 129.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 2, name: "Smartwatch", price: 199.99, image: "/placeholder.svg?height=100&width=100" },
    { id: 3, name: "Portable Charger", price: 49.99, image: "/placeholder.svg?height=100&width=100" },
  ])

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id))
  }

  const totalPrice = wishlistItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-4">
          {wishlistItems.map(item => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-l-lg" />
              <CardContent className="flex-grow p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <Link to={`/product/${item.id}`} className="text-blue-500 hover:underline">
                    View Details
                  </Link>
                </div>
                <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove item</span>
                </Button>
              </CardContent>
            </Card>
          ))}
          <div className="text-right">
            <p className="text-xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}