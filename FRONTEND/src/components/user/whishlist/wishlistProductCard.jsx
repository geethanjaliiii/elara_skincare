
  
  const wishlistProductCard = ({ item }) => {
    const product = item.productId; 
    return (
      <div className="bg-gray-50 rounded-lg p-3 relative group">
      {item.discount && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          {item.discount}% Off
        </span>
      )}
      <button className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:shadow-md">
        <X />
      </button>
      <img
        src={product?.images?.[0]}
        alt={product?.name || "Product"}
        className="w-full h-40 object-cover mb-3 rounded"
      />
      <div className="space-y-1">
        <p className="text-xs text-gray-600 line-clamp-2">{product?.name}</p>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-sm">
            ${(item.price - (item.price * item.discount) / 100).toFixed(2)}
          </span>
          {item.price && (
            <span className="text-xs text-gray-500 line-through">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>
        <button
          className={`w-full py-1 px-3 rounded text-sm flex items-center justify-center space-x-2 ${
            item.addedToBag
              ? "bg-gray-200 text-gray-800"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          <ShoppingBag size={14} />
          <span>{item.addedToBag ? "Added to Bag" : "Add to Bag"}</span>
        </button>
      </div>
    </div>
    )
  }
  
  export default wishlistProductCard
  