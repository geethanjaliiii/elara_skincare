import React from 'react'

import ProductCard from '../shop/ProductCard'





export default function RelatedProducts({ products }) {
  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold mb-6">You May Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.length>0 && products.map((product) => (
          <ProductCard {...product} key={product._id} category={product.categoryId?.name || ""} />
        ))}
      </div>
    </div>
  )
}