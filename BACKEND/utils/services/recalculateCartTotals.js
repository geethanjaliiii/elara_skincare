const recalculateCartTotals=(cart) =>{
    const availableItems = cart.items.filter((item) => item.inStock === true);
  
    // Calculate total items, total MRP, total discount, and total amount
    cart.totalItems = availableItems.length;
    cart.totalMRP = availableItems.reduce((acc, item) => acc + item.latestPrice * item.quantity, 0);
    cart.totalDiscount = availableItems.reduce((acc, item) => acc + (item.discount * item.latestPrice * item.quantity) / 100, 0);
  
    const discountedPrice = cart.totalMRP - cart.totalDiscount;
    cart.totalAmount = Math.max(0,discountedPrice - cart.couponDiscount + cart.deliveryCharge + cart.platformFee);
  
     // Round to 2 decimal places for currency
    cart.totalMRP = Number(cart.totalMRP.toFixed(2));
    cart.totalDiscount = Number(cart.totalDiscount.toFixed(2));
    cart.totalAmount = Number(cart.totalAmount.toFixed(2));
  
  return cart
  }
  module.exports=recalculateCartTotals

// function updateCartItem(item,couponDiscount=0,totalMRP){
//   item.itemTotal=item.latestPrice*item.quantity

// item.itemCouponDiscount=(item.latestPrice*item.quantity*couponDiscount)/totalMRP
// item.itemOfferDiscount=(item.latestPrice*item.quantity*item.discount)/100
// item.finalPrice=item.itemTotal-item.itemOfferDiscount-item.itemCouponDiscount

// console.log(item.finalPrice,'dis');

// }

// const recalculateCartTotals=(cart) =>{
//     const availableItems = cart.items.filter((item) => item.inStock === true);
  
//       // Calculate total items, total MRP, total discount, and total amount
//       cart.totalItems = availableItems.length;
//       cart.totalMRP = availableItems.reduce((acc, item) => acc + item.latestPrice * item.quantity, 0);
//     //update cart items
//  availableItems.forEach((item)=>updateCartItem(item,cart.couponDiscount,cart.totalMRP))

//     cart.totalDiscount = availableItems.reduce((acc, item) => acc + (item.itemCouponDiscount+item.itemOfferDiscount),0)
  
//     const discountedPrice = cart.totalMRP - cart.totalDiscount;
//     cart.totalAmount = discountedPrice + cart.deliveryCharge + cart.platformFee;
//   }
//   module.exports=recalculateCartTotals
