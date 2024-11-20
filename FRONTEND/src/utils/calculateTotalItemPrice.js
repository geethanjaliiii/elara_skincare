export const calculateTotalPrice=(item)=>{
    const totalMRP=item.latestPrice*item.quantity
    const itemDiscount=(item.discount*totalMRP)/100
    return totalMRP-itemDiscount
  }