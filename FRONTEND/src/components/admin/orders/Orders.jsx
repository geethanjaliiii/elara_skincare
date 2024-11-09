"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/orderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { SearchAndFilters } from "./SearchAndFilters";
import { OrdersTable } from "./OrderTable";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "all" || order.status === statusFilter) &&
      (order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <Button variant="outline" className="mb-6">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <OrdersTable orders={filteredOrders} />
        </CardContent>
      </Card>
    </div>
  );
}


// import { useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   MoreHorizontal,
//   Search,
//   SlidersHorizontal,
// } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { getOrders } from "@/services/orderService";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const statusColors = {
//   pending: "bg-yellow-500",
//   processing: "bg-blue-500",
//   shipped: "bg-purple-500",
//   delivered: "bg-green-500",
//   cancelled: "bg-red-500",
// };

// const paymentStatusColors = {
//   paid: "bg-green-500",
//   unpaid: "bg-red-500",
//   refunded: "bg-orange-500",
// };

// export default function AdminOrders() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   //   const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' }>({
//   //     key: 'orderDate',
//   //     direction: 'desc',
//   //   })

//   const {
//     data: orders,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["orders"],
//     queryFn: () => getOrders(),
//   });
//   console.log("orders", orders);

//   //   const filteredOrders = orders||[]
//   //     // ? orders.filter(
//   //     //     (order) =>
//   //     //       (statusFilter === 'all' || order.status === statusFilter) &&
//   //     //       (order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //     //         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
//   //     //   )
//   //     // : []

//   //   const sortedOrders = [...filteredOrders].sort((a, b) => {
//   //     if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
//   //     if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
//   //     return 0
//   //   })

//   //   const handleSort = (key) => {
//   //     setSortConfig((prevConfig) => ({
//   //       key,
//   //       direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
//   //     }))
//   //   }

//   if (isLoading) return <div>Loading orders...</div>;
//   if (error) return <div>Error loading orders: {error.message}</div>;

//   return (
//     <div className="container mx-auto py-10">
//       <Card>
//         <CardHeader>
//           <CardTitle>Orders</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center space-x-2">
//               <div className="relative">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search orders..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-8"
//                 />
//               </div>
//               <Select
//                 value={statusFilter}
//                 onValueChange={(value) =>
//                   setStatusFilter(Order["status"] | "all")
//                 }
//               >
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Statuses</SelectItem>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="processing">Processing</SelectItem>
//                   <SelectItem value="shipped">Shipped</SelectItem>
//                   <SelectItem value="delivered">Delivered</SelectItem>
//                   <SelectItem value="cancelled">Cancelled</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <Button variant="outline">
//               <SlidersHorizontal className="mr-2 h-4 w-4" />
//               Advanced Filters
//             </Button>
//           </div>

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[100px]">
//                     <Button
//                       variant="ghost"
//                       onClick={() => handleSort("orderNumber")}
//                     >
//                       Order #
//                       {/* {sortConfig.key === 'orderNumber' && (
//                         sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
//                       )} */}
//                     </Button>
//                   </TableHead>
//                   <TableHead>
//                     <Button
//                       variant="ghost"
//                       onClick={() => handleSort("customerName")}
//                     >
//                       Customer
//                       {/* {sortConfig.key === 'customerName' && (
//                         sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
//                       )} */}
//                     </Button>
//                   </TableHead>
//                   <TableHead>
//                     <Button
//                       variant="ghost"
//                       onClick={() => handleSort("orderDate")}
//                     >
//                       Date
//                       {/* {sortConfig.key === 'orderDate' && (
//                         sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
//                       )} */}
//                     </Button>
//                   </TableHead>
//                   <TableHead> status</TableHead>

//                   {/* <TableHead>Status</TableHead> */}
//                   <TableHead>Payment</TableHead>
//                   <TableHead className="text-right">
//                     <Button
//                       variant="ghost"
//                       onClick={() => handleSort("totalAmount")}
//                     >
//                       Total
//                       {/* {sortConfig.key === 'totalAmount' && (
//                         sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
//                       )} */}
//                     </Button>
//                   </TableHead>
//                   <TableHead className="w-[100px]">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {orders &&
//                   orders.map((order) => (
//                     <TableRow key={order._id}>
//                       <TableCell className="font-medium">
//                         {order.orderNumber}
//                       </TableCell>
//                       <TableCell>{order.userId.name}</TableCell>
//                       <TableCell>
//                         {new Date(order.orderDate).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>
//                         {order.items.map((item) => (
//                           <div key={item._id} className="space-y-2 flex gap-2 justify-between">
//                             <img
//                               src={item.image}
//                               alt={item.name}
//                               className="h-20 w-20 object-cover rounded p-2"
//                             />
//                             <p>{item.name}</p>

//                             <Select
//                               value={item.status}
//                               onValueChange={(value) =>
//                                 setStatusFilter(order["status"] | "all")
//                               }
//                             >
//                               <SelectTrigger className="w-[180px]">
//                                 <SelectValue
//                                   placeholder={item.status}
//                                   className="text-black"
//                                 />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value={item.status}>
//                                   {item.status}
//                                 </SelectItem>
//                                 <SelectItem value="pending">Pending</SelectItem>
//                                 <SelectItem value="processing">
//                                   Processing
//                                 </SelectItem>
//                                 <SelectItem value="shipped">Shipped</SelectItem>
//                                 <SelectItem value="delivered">
//                                   Delivered
//                                 </SelectItem>
//                                 <SelectItem value="cancelled">
//                                   Cancelled
//                                 </SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>
//                         ))}
//                       </TableCell>

//                       <TableCell>
//                         <Badge
//                           className={`${
//                             paymentStatusColors[order.paymentStatus]
//                           } text-white`}
//                         >
//                           {order.paymentStatus}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         ₹{order.totalAmount.toFixed(2)}
//                       </TableCell>
//                       <TableCell>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" className="h-8 w-8 p-0">
//                               <span className="sr-only">Open menu</span>
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                             <DropdownMenuItem>View details</DropdownMenuItem>
//                             <DropdownMenuItem>Update status</DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem>Cancel order</DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Order Details Dialog */}
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button className="hidden">View Order Details</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Order Details</DialogTitle>
//             <DialogDescription>
//               View and manage the details of this order.
//             </DialogDescription>
//           </DialogHeader>
//           {/* Add order details content here */}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
