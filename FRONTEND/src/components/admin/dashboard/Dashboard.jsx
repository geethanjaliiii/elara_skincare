'use client'

import React, { useState, useEffect } from 'react'
import { adminAxiosInstance } from '@/config/axiosConfig'
import { DashboardHeader } from './components/dashboard-header'
import { BestProductsChart } from './components/best-producta-chart'
import { BestCategoriesChart } from './components/best-categories-chart'
import { RecentOrders } from './components/recentOrders'
import { RevenueChart } from './components/revenue-chart'
import { OverviewCards } from './components/overview-cards'
export default function Dashboard() {
  const [period, setPeriod] = useState('yearly')
  const [dashboardData, setDashboardData] = useState({
    bestProducts: [],
    bestCategories: [],
    recentOrders: [],
    overviewStats: {},
    revenueData: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [period])

  const fetchDashboardData = async () => {
    try {
      const [productsRes, categoriesRes, ordersRes, statsRes, revenueRes] = await Promise.all([
        adminAxiosInstance.get(`/api/admin/dashboard/best-products?period=${period}`),
        adminAxiosInstance.get(`/api/admin/dashboard/best-categories?period=${period}`),
        adminAxiosInstance.get('/api/admin/dashboard/recent-orders'),
        adminAxiosInstance.get(`/api/admin/dashboard/overview-stats?period=${period}`),
        adminAxiosInstance.get(`/api/admin/dashboard/revenue?period=${period}`)
      ])

      setDashboardData({
        bestProducts: productsRes.data.bestProducts,
        bestCategories: categoriesRes.data.bestCategories,
        recentOrders: ordersRes.data.recentOrders,
        overviewStats: statsRes.data.stats,
        revenueData: revenueRes.data.revenueData
      })
      console.log(statsRes);
      
    } catch (error) {
      console.error('Error fetching dashboard data', error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <DashboardHeader period={period} setPeriod={setPeriod} />
      <OverviewCards stats={dashboardData.overviewStats} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BestProductsChart data={dashboardData.bestProducts} />
        <BestCategoriesChart data={dashboardData.bestCategories} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentOrders orders={dashboardData.recentOrders} />
        {/* <RevenueChart data={dashboardData.revenueData} /> */}
      </div>
    </div>
  )
}


// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// import { adminAxiosInstance } from '@/config/axiosConfig';

// const Dashboard = () => {
//   const [period, setPeriod] = useState('yearly');
//   const [bestProducts, setBestProducts] = useState([]);
//   const [bestCategories, setBestCategories] = useState([]);
 

//   useEffect(() => {
//     fetchDashboardData();
//   }, [period]);

//   const fetchDashboardData = async () => {
//     try {
//       const [productsRes, categoriesRes] = await Promise.all([
//         adminAxiosInstance.get(`/api/admin/dashboard/best-products?period=${period}`),
//         adminAxiosInstance.get(`/api/admin/dashboard/best-categories?period=${period}`),
       
//       ]);
// console.log(categoriesRes.data);

//       setBestProducts(productsRes.data.bestProducts);
//       setBestCategories(categoriesRes.data.bestCategories);
   
//     } catch (error) {
//       console.error('Error fetching dashboard data', error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//         <select 
//           value={period} 
//           onChange={(e) => setPeriod(e.target.value)}
//           className="p-2 border rounded"
//         >
//           <option value="monthly">Monthly</option>
//           <option value="yearly">Yearly</option>
//         </select>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* Best Products Chart */}
//         <div className="bg-white p-4 rounded shadow">
//           <h2 className="text-xl mb-4">Top 10 Products</h2>
//           <BarChart width={350} height={300} data={bestProducts}>
//             <XAxis dataKey="productDetails.name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="totalQuantity" fill="#8884d8" />
//           </BarChart>
//         </div>

//         {/* Best Categories Chart */}
//         <div className="bg-white p-4 rounded shadow">
//           <h2 className="text-xl mb-4">Top 10 Categories</h2>
//           <BarChart width={350} height={300} data={bestCategories}>
//             <XAxis dataKey="categoryName" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="totalQuantity" fill="#82ca9d" />
//           </BarChart>
//         </div>

     
//       </div>
//     </div>
//   );
// };

// export default Dashboard;