// const recalculateCartTotals=(cart) =>{
//     const availableItems = cart.items.filter((item) => item.inStock === true);

const calculateDiscountPrice = require("./calculateDiscountPrice");

//     // Calculate total items, total MRP, total discount, and total amount
//     cart.totalItems = availableItems.length;
//     cart.totalMRP = availableItems.reduce((acc, item) => acc + item.latestPrice * item.quantity, 0);
//     cart.totalDiscount = availableItems.reduce((acc, item) => acc + (item.discount * item.latestPrice * item.quantity) / 100, 0);

//     const discountedPrice = cart.totalMRP - cart.totalDiscount;
//     cart.totalAmount = Math.max(0,discountedPrice - cart.couponDiscount + cart.deliveryCharge + cart.platformFee);

//      // Round to 2 decimal places for currency
//     cart.totalMRP = Number(cart.totalMRP.toFixed(2));
//     cart.totalDiscount = Number(cart.totalDiscount.toFixed(2));
//     cart.totalAmount = Number(cart.totalAmount.toFixed(2));

//   return cart
//   }
//   module.exports=recalculateCartTotals

// const calculateItemTotal = (item) => {
//   const quantity = item.quantity || 0;
//   const price = item.latestPrice || 0;
//   const discount = item.discount || 0;

//   return {
//     mrp: price * quantity,
//     discount: (discount * price * quantity) / 100,
//   };
// };

// const roundToTwo = (num) => Number((Math.round(num * 100) / 100).toFixed(2));
// const recalculateCartTotals = (cart) => {
//   const totals = cart.items
//     .filter((item) => item.inStock === true)
//     .reduce(
//       (acc, item) => {
//         const itemTotals = calculateItemTotal(item);
//         return {
//           totalItems: acc.totalItems + 1,
//           totalMRP: acc.totalMRP + itemTotals.mrp,
//           totalDiscount: acc.totalDiscount + itemTotals.discount,
//         };
//       },
//       { totalItems: 0, totalMRP: 0, totalDiscount: 0 }
//     );

//   //update cart with calculated totals
//   Object.assign(cart, {
//     totalItems: totals.totalItems,
//     totalMRP: roundToTwo(totals.totalMRP),
//     totalDiscount: roundToTwo(totals.totalDiscount),
//     totalAmount: roundToTwo(
//       Math.max(
//         0,
//         totals.totalMRP -
//           totals.totalDiscount +
//           (cart.deleveryCharge || 0) +
//           (cart.platformFee || 0)
//       )
//     ),
//   });

//   return cart;
// };
// module.exports = recalculateCartTotals;

  const isOfferValid = (offer) => {
    return offer && new Date() < new Date(offer.expiryDate);
  };


const calculateItemTotal = (item) => {
  const quantity = item.quantity || 0;
  const price = item.latestPrice || 0;
  const discount=(item?.productId?.offerId && isOfferValid(item?.productId?.offerId))?calculateDiscountPrice(item.productId):(item.discount || 0)

  return {
    mrp: price * quantity,
    discount: (discount * price * quantity) / 100,
  };
};

const roundToTwo = (num) => Number((Math.round(num * 100) / 100).toFixed(2));


const recalculateCartTotals = (cart) => {
  const totals = cart.items
    .filter((item) => item.inStock === true)
    .reduce(
      (acc, item) => {
        const itemTotals = calculateItemTotal(item);
        return {
          totalItems: acc.totalItems + 1,
          totalMRP: acc.totalMRP + itemTotals.mrp,
          totalDiscount: acc.totalDiscount + itemTotals.discount,
          
        };
      },
      { totalItems: 0, totalMRP: 0, totalDiscount: 0 }
    );

    const calculateDeliveryCharge=()=>{
      const totalAmount=totals.totalMRP -
      totals.totalDiscount +
      (cart.platformFee || 0)
      return totalAmount>=process.env.THRESHOLD_AMOUNT?0:60
    }

    const deliveryCharge = calculateDeliveryCharge();
  //update cart with calculated totals
  return {...cart, 
    totalItems: totals.totalItems,
    totalMRP: roundToTwo(Math.max(totals.totalMRP,0)),
    totalDiscount: roundToTwo(Math.max(totals.totalDiscount,0)),
    deliveryCharge,
    totalAmount: roundToTwo(
      Math.max(
        0,
        totals.totalMRP -
          totals.totalDiscount +
          (cart.platformFee || 0)+deliveryCharge
      )
    ),
  };

 
};
module.exports = recalculateCartTotals;
