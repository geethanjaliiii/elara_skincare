// const calculateRefundPrice = (order, item) => {
//     const offerDiscount = (item.discount * item.price) / 100;
//     const itemCouponDiscount = order.couponDiscount / order.items.length;
//     const itemShippingFee = order.shippingFee / order.items.length;
//     const itemTax = order.tax / order.items.length;
    
//     return item.price + itemTax + itemShippingFee - offerDiscount - itemCouponDiscount;
//   };
const roundToTwo = (num) => Number((Math.round(num * 100) / 100).toFixed(2));
const calculateRefundPrice = (order, item) => {
  const offerDiscount = (item.discount * item.price) / 100;
  const itemCouponDiscount = order.couponDiscount *(item.totalMRP/order.totalMRP)
  const itemShippingFee = order.shippingFee *(item.totalMRP/order.totalMRP);
  const itemTax = order.tax*(item.totalMRP/order.totalMRP);
  
  const maxTotalPrice=Math.max((item.price + itemTax + itemShippingFee - offerDiscount - itemCouponDiscount),0)
  return roundToTwo(maxTotalPrice)
};
  module.exports=calculateRefundPrice