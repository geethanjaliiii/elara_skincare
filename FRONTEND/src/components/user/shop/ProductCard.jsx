import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'


export default function ProductCard({ _id, name, categoryId, price, sizes, reviews,rating=4.6, images,isFeatured ,discount}) {
  const [isHovered, setIsHovered] = useState(false)
  const navigate=useNavigate()
 const discountPrice=(price-(price*discount)/100).toFixed(2)
const isStockOut=sizes.every(size=>size.stock==0)
  return (
    <Card 
      className="overflow-hidden relative  "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}

    >
      <div className="relative " >
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
          onClick={()=>navigate(`/product/${_id}`,{state: {productId:_id}})}
        >
          {images &&<img src={images[0]} alt={name} className="w-full h-48 object-cover" loading="lazy" />}
        </motion.div>
        <motion.div
         onClick={()=>navigate(`/product/${_id}`,{state: {productId:_id}})}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center "
        >
          <Button variant="secondary" className="text-sm">
            View Product
          </Button>
        </motion.div>
        {/* <button
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button> */}
        {isStockOut? (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Sold Out
          </div>
        ):isFeatured?(<div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          Must Try
        </div>):""}
        {}
      </div>
      <CardContent className="p-4"       onClick={()=>navigate(`/product/${_id}`)}>
        <h3 className="font-semibold text-sm mb-1 truncate">{name}</h3>
       <p className="text-xs text-gray-500 mb-2">{categoryId?.name?categoryId.name: ""}</p>
        <div className="flex items-center space-x-2 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviews?reviews.length:20})</span>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold">₹{discountPrice}</span>
          <span className="text-xs text-gray-500 line-through">₹{price}</span>
          <span className="text-xs text-green-600">({discount}% off)</span>
        </div>
      </CardContent>
    </Card>
  )
}
