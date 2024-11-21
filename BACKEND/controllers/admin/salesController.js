const { date } = require("joi");
const Order = require("../../models/orderModel");

const fetchSalesData = async (req, res) => {
  const { filterType, startDate, endDate, currentPage, ordersPerPage } =
    req.query;
    const limit=Number(ordersPerPage)
  let start, end;
  const now = new Date();
  switch (filterType) {
    case "daily":
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(now.setHours(23, 59, 59, 999));
      break;
    case "weekly":
      const weekStart = now.getDate() - now.getDay();
      start = new Date(now.setDate(weekStart));
      start.setHours(0, 0, 0, 0);
      end = new Date(now.setDate(weekStart + 6));
      end.setHours(23, 59, 59, 999);
      break;
    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    case "custom":
      start = new Date(startDate);
      end = new Date(endDate);
      break;
    default:
      return res.status(400).json({ error: "Invalid filter type" });
  }
  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$items" },
      {$match:{'items.status':'Delivered'}},
      {
        $project: {
          customer: "$customerName",
          date: "$orderDate",
          product: "$items.name",
          quantity: "$items.quantity",
          unitPrice: "$items.price",
          couponDiscount: {
            $cond: {
              if: {$and: [
                { $ne: ["$items", null] }, // Ensure items is not null
                { $eq: [{ $type: "$items" }, "array"] }, // Ensure items is an array
                { $gt: [{ $size: "$items" }, 0] }, // Check for non-empty array
              ],}, // Check for non-empty items array
              then: { $divide: ["$couponDiscount", { $size: "$items" }] },
              else: 0,
            },
          },
          otherDiscount: {
            $divide: [
              {
                $multiply: [
                  "$items.discount",
                  "$items.price",
                  "$items.quantity",
                ],
              },
              100,
            ],
          },
          finalPrice: {
            $subtract: [
              { $multiply: ["$items.price", "$items.quantity"] },
              {
                $add: [
                  "$couponDiscount",
                  { $divide: ["$items.discount", 100] },
                ],
              },
            ],
          },
          // otherDiscount:{$add:['$item.discount',{$divide:['$tax',{$count:'$items'},{$divide:['$shippingFee',{$count:'$items'}]}]}]},
          // finalPrice:{$add:['$items']}
        },
      },
      {
        $skip: (currentPage - 1) * limit,
      },
      { $limit: limit },
    ]);

    const overallSalesDataArray = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
        },
      },
      {$unwind:'$items'}
      ,
      {$match:{'items.status':'Delivered'}},
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalAmount",
          },
          totalOrders: {
            $sum: 1,
          },
          totalDiscount: {
            $sum: { $add: ["$totalDiscount", "$couponDiscount"] },
          },
        },
      },
    ]);
    const overallSalesData = overallSalesDataArray.length > 0 ? overallSalesDataArray[0] : {};
    console.log(salesData, "sd");
    res
      .status(200)
      .json({
        success: true,
        message: "Sales data fetched",
        overallSalesData,
        salesData,
      });
  } catch (error) {
    console.log("failed to fetch sales data", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch sales data" });
  }
};
module.exports = fetchSalesData;
