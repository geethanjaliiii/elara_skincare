// export const calculateTotalPrice=(cart,item,couponDiscount=0)=>{
//     const totalMRP=item.latestPrice*item.quantity
//     const itemDiscount=(item.discount*totalMRP)/100
//     const itemCouponDiscount=couponDiscount?(couponDiscount/cart.items.length):0
//     const itemTax=cart.platformFee/cart.items.length
//     const itemDeliveryCharge=cart.deliveryCharge/cart.items.length
//     return totalMRP-itemDiscount-itemCouponDiscount+itemTax+itemDeliveryCharge
//   }
const roundToTwo = (num) => Number((Math.round(num * 100) / 100).toFixed(2));
export const calculateTotalPrice=(cart,item,couponDiscount=0)=>{
  const totalMRP=item.latestPrice*item.quantity
  const itemDiscount=(item.discount*totalMRP)/100
  const itemCouponDiscount=couponDiscount?(totalMRP/cart.totalMRP)*couponDiscount:0
  const itemTax=(totalMRP/cart.totalMRP)*cart.platformFee
  const itemDeliveryCharge=(totalMRP/cart.totalMRP)*cart.deliveryCharge
  console.log(couponDiscount)
 const maxTotalPrice=Math.max((totalMRP-itemDiscount-itemCouponDiscount+itemTax+itemDeliveryCharge),0)
 return roundToTwo(maxTotalPrice)
}