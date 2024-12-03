const calculateDiscountPrice=(product)=>{
  
    let totalDiscount= product.discount+product.offerId.offerValue
     // Cap total discount at 100% to avoid negative prices
  totalDiscount = Math.min(totalDiscount, 100);
return totalDiscount
}

module.exports=calculateDiscountPrice 