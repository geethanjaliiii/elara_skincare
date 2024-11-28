const Cart = require("../../models/cartModel");
const { Coupon, UserCoupon } = require("../../models/couponModel");
const recalculateCartTotals = require("../../utils/services/recalculateCartTotals");
const { description } = require("../../utils/validation/couponValidation");

const getCoupons = async (req, res) => {
  const { cartValue } = req.query;
  const { userId } = req.params;
  console.log(cartValue);

  try {
    if (!userId || !cartValue || userId == undefined) {
      return res
        .staus(400)
        .json({ success: false, message: "Invalid input parameters" });
    }

    const cartAmount = Number(cartValue);
    const validCoupons = await Coupon.aggregate([
      //basic coupon criteria
      {
        $match: {
          isActive: true,
          expiryDate: { $gt: new Date() },
          minPurchaseOrder: { $lte: cartAmount },
          $expr: {
            $lt: ["$totalAppliedCount", "$usageLimit"],
          },
        },
      },
      {
        //lookup users usage of these coupons
        $lookup: {
          from: "usercoupons",
          let: { couponId: "$_id", maxUsage: "$maxUsagePerUser" }, //let-define variables used in match pipeline stage
          //pipeline is an array od stages to filter usercoupons
          pipeline: [
            {
              $match: {
                //expr to compare fields
                $expr: {
                  $and: [
                    { $eq: ["$userId", userId] },
                    { $eq: ["$couponId", "$$couponId"] }, //2nd couponId is from let
                  ],
                },
              },
            },
          ],
          as: "userUsage",
        },
      },
      //new field userUSAGE ARRAY IS ADDED ,FILTER
      //CHECK IF APPLIED COUNT LESS THAN MAX USAGE
      {
        $match: {
          $or: [
            //if user have never used the coupon before
            { userUsage: { $size: 0 } },
            //user havent reached limit ,checking first element in userusage
            {
              $expr: {
                $lt: [
                  { $arrayElemAt: ["$userUsage.appliedCount", 0] },
                  "$maxUsagePerUser",
                ],
              },
            },
          ],
        },
      },
      // calculate potential discount
      {
        $addFields: {
          potentialDiscount: {
            $cond: {
              if: { $eq: ["$discountType", "percentage"] },
              then: {
                //smallst value among maxDiscountamount and finding percentage discount
                $min: [
                  {
                    $multiply: [
                      cartAmount,
                      { $divide: ["$discountPercentage", 100] },
                    ],
                  },
                  "$maxDiscountAmount",
                ],
              },
              else: "$discountValue",
            },
          },
        },
      },
      //project only necessary value
      {
        $project: {
          code: 1,
          description: 1,
          discountType: 1,
          discountValue: 1,
          discountPercentage: 1,
          maxDiscountAmount: 1,
          minPurchaseOrder: 1,
          expiryDate: 1,
          potentialDiscount: 1,
          userUsage: { $arrayElemAt: ["$userUsage.appliedCount", 0] },
        },
      },
      //sort by priority
      { $sort: { potentialDiscount: -1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "Coupons fetched",
      coupons: validCoupons,
    });
  } catch (error) {
    console.log("error finding coupons", error);
  }
};

const applyCoupon = async (req, res) => {
  const { userId } = req.params;
  const { code ,cartValue} = req.body;
  try {
    console.log(code);

    if (!userId || !code ||!cartValue) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input paramenters" });
    }
    
      const coupon = await Coupon.findOne({
        code: code,
        isActive: true,
        expiryDate: { $gt: new Date() },
      });
      if (!coupon) {
        return res.status(404).json({ message: "Coupon Expired." });
      }
      const alreadyApplied = await UserCoupon.findOne({
        userId: userId,
        couponId: coupon._id,
      });
      if (
        coupon?.totalAppliedCount >= coupon.usageLimit ||
        (alreadyApplied &&
          alreadyApplied?.appliedCount >= coupon.maxUsagePerUser)
      ) {
        return res
          .status(404)
          .json({ success: false, message: "Coupon not applicable." });
      }
      if (cartValue < coupon.minPurchaseOrder) {
        return res.status(500).json({message:`Add item worth ${coupon.minPurchaseOrder-cartValue} to avail the coupon.`})
      }
      //if coupon applicable send discountapplicable to frontend
        const couponDiscount =
          coupon?.discountType == "percentage"
            ? Math.min(
                coupon.maxDiscountAmount,
                (coupon.discountPercentage / 100) * cartValue
              )
            : coupon.discountValue;

    res
      .status(200)
      .json({ success: true, message: "coupon applied", couponDiscount });
  } catch (error) {
    console.log("error applying code", error);
  }
};
const removeCoupon = async (req, res) => {
  try {
  } catch (error) {}
};
const getAllCoupons=async (req,res)=>{
  try {
   const coupons= await Coupon.find({expiryDate:{$gt:new Date()},isActive:true})
   const expiredCoupons=await Coupon.find({expiryDate:{$lt:new Date()},isActive:true})
   console.log("coupons fetched");
   
   res.status(200).json({success:true,message:"coupons fetched",coupons,expiredCoupons})
  } catch (error) {
    console.log("Failed to fetch coupons",error);
    res.status(500).json({success:false,message:"Failed to fetch coupons"})
  }
}
module.exports = { getCoupons, applyCoupon, removeCoupon ,getAllCoupons};
