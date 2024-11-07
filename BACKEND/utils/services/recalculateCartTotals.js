const recalculateCartTotals=(cart) =>{
    const availableItems = cart.items.filter((item) => item.inStock === true);
  
    // Calculate total items, total MRP, total discount, and total amount
    cart.totalItems = availableItems.length;
    cart.totalMRP = availableItems.reduce((acc, item) => acc + item.latestPrice * item.quantity, 0);
    cart.totalDiscount = availableItems.reduce((acc, item) => acc + (item.discount * item.latestPrice * item.quantity) / 100, 0);
  
    const discountedPrice = cart.totalMRP - cart.totalDiscount;
    cart.totalAmount = discountedPrice - cart.couponDiscount + cart.deliveryCharge + cart.platformFee;
  }
  module.exports=recalculateCartTotals