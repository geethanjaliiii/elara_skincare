const fetchLatestPrice=(item)=>{
    const selectedSize=item.productId.sizes.find((s)=>s.size=item.size)
    return selectedSize.price
        }

module.exports={fetchLatestPrice}        