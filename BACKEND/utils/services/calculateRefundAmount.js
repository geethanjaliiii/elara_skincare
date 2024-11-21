const calculateRefundPrice = (order, item) => {
    const offerDiscount = (item.discount * item.totalPrice) / 100;
    const itemCouponDiscount = order.couponDiscount / order.items.length;
    const itemShippingFee = order.shippingFee / order.items.length;
    const itemTax = order.tax / order.items.length;
    
    return item.totalPrice + itemTax + itemShippingFee - offerDiscount - itemCouponDiscount;
  };

  module.exports=calculateRefundPrice