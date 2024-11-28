const Order=require('../../models/orderModel');
const getPeriodFilters = require('../../utils/services/periodFilters');
const User=require('../../models/userModel')
const fetchBestProducts = async (req, res) => {
  const { period = "yearly" } = req.query;
  const periodFilter = getPeriodFilters(period);
  try {
    
   const bestProducts= await Order.aggregate([
      { $match: periodFilter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.totalPrice"] },
          },
        },
      },
      {$sort:{
        totalQuantity:-1
      }},
      {$limit:10},
      {$lookup:{
        from:'products',
        localField:'_id',
        foreignField:'_id',
        as:'productDetails'
      }},
      {$unwind:"$productDetails"}
    ]);
    res.status(200).json({success:true,bestProducts})
  } catch (error) {
    console.error("Failed to fetch best products",error);
    
    res.status(500).json({success:false,message:"Failed to fetch best products"})
  }
};

const fetchBestCategories=async(req,res)=>{
    console.log("fetching categories");
    
    const { period = "yearly" } = req.query;
    const periodFilter = getPeriodFilters(period);
    try {
      const bestCategories=await Order.aggregate([{
        $match:periodFilter},
        {$unwind:"$items"},
    {$lookup:{
        from:'products',
        localField:'items.productId',
        foreignField:'_id',
        as:'productDetails'
    }},
{$unwind:'$productDetails'},
{$lookup:{
    from:'categories',
    localField:"productDetails.categoryId",
    foreignField:'_id',
    as:"categoryDetails"
}},
{ $unwind: "$categoryDetails" },
{$group:{
    _id:'$productDetails.categoryId',
    categoryName: { $first: "$categoryDetails.name" },
    totalQuantity:{$sum:'$items.quantity'},
    totalRevenue:{$sum:{$multiply:['$items.quantity','$items.totalPrice']}},

}},
{$sort:{totalQuantity:-1}},
{$limit:10}]) 
console.log("bc",bestCategories);

res.status(200).json({success:true,bestCategories}); 
    } catch (error) {
        console.error("Failed to fetch best categories",error);
        res.status(500).json({success:false,message:"Failed to fetch best categories"})
    }
}

const getOverviewStats=async(req,res)=>{
    const{period='yearly'}=req.query
    try {
        const periodFilter=getPeriodFilters(period)
       const stats={}
       const revenueResult=await Order.aggregate([{$match:periodFilter},
        {$group:{
            _id:null,
            totalRevenue:{$sum:"$totalAmount"}
        }}
       ])
stats.totalRevenue=revenueResult[0]?.totalRevenue||0
const totalOrders=await Order.countDocuments(periodFilter)
stats.totalOrders = totalOrders;
const productsSoldResult = await Order.aggregate([{$match:periodFilter},
    {$unwind:"$items"},
    {$group:{
        _id:null,
        totalProductsSold:{$sum:"$items.quantity"}
    }}
])
stats.totalProductsSold = productsSoldResult[0]?.totalProductsSold || 0;
const activeUsers = await User.countDocuments()
stats.conversionRate=(totalOrders/activeUsers)*100
stats.activeUsers=activeUsers

return res.status(200).json({success:true,stats})
    } catch (error) {
        console.error("Failed to fetch stats",error);
        res.status(500).json({success:false,message:"Failed to fetch sats"}) 
    }
}
const getRecentOrders=async(req,res)=>{
    try {
        const recentOrders = await Order.find()
        .sort({ orderDate: -1 }) // Sort by `orderDate` in descending order
        .limit(10) // Limit to the 10 most recent orders
        .select("_id orderNumber userId totalAmount status orderDate items") // Select necessary fields
        .populate({
          path: "userId",
          select: "name email", // Populate user details
        })
        ;
        res.status(200).json({
            success: true,
            recentOrders,
          });
    } catch (error) {
        console.error("Failed to fetch stats",error);
        res.status(500).json({success:false,message:"Failed to fetch recent orders"}) 
    }
}
const getRevenue=async(req,res)=>{
    const{period='yearly'}=req.query
        const periodFilter=getPeriodFilters(period)
    try {
        const revenueData=await Order.aggregate([{$match:periodFilter},
            {$group:{
                _id:null,
                totalRevenue:{$sum:"$totalAmount"}
            }}
           ])
           
           res.status(200).json({
            success: true,
            revenueData,
          });
    } catch (error) {
        console.error("Failed to fetch revenue data",error);
        res.status(500).json({success:false,message:"Failed to fetch revenue data"}) 
    }
}
module.exports = { fetchBestProducts ,fetchBestCategories,getOverviewStats,getRecentOrders,getRevenue};

