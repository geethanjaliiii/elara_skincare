import { roundToTwo } from "./roundToTwo"

export const calculateDiscountPrice=(cart,item,couponDiscount=0)=>{
    const totalMRP=item.latestPrice*item.quantity
    const offerDiscount=roundToTwo((item.discount*totalMRP)/100)
    const itemCouponDiscount=roundToTwo(couponDiscount?(totalMRP/cart.totalMRP)*couponDiscount:0)
    return {itemCouponDiscount,offerDiscount}
}