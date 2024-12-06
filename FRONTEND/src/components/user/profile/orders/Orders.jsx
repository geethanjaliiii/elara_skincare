import React, { useState, Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import FilterSheet from './FilterSheets'
import { ChevronRight, Package, Search } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllOrders } from '@/services/orderService'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { usePayment } from '@/hooks/usePayment'
import { retryPayment } from '@/services/razorpay'
import { format } from "date-fns";

const RatingDialog = React.lazy(() => import('@/components/shared/RatingDialouge'))

export default function Orders() {
  const userId = useSelector((state) => state?.user?.userInfo?._id)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatuses,setSelectedStatuses]=useState([])
  const queryClient =useQueryClient()
  const navigate =useNavigate()

  //fetch orderdata
  const { data, error, isLoading } = useQuery({
    queryKey: ['userOrders'],
    queryFn: () => getAllOrders(userId),
     // Using mock data as initial data
  })

  if (isLoading) (<div>Loading</div>)
  if (error) toast.error("Error loading orders")

//handle retry payment
const orderMutation=useMutation({
  mutationFn:retryPayment,
  onSuccess:(data)=>{
   
    toast.success("Payment Completed")
    //Invalidate 'orderDetails to refetch fresh data
    queryClient.invalidateQueries(['orders'])
    queryClient.invalidateQueries(["orderDetails", data.orderId]);
    queryClient.invalidateQueries(["userOrders",data.userId]);
    // navigate(`/checkout/success/${data.orderId}`);
  },
  onError:(error)=>{
    const errorMessage =
        error?.response?.data?.message ||"Payment Failed"
      toast.error(errorMessage);
  }
})

//with retry payment
const {handleRazorpayPayment}=usePayment(orderMutation,toast)

//calling retry function
const handleRetryPayment=(order)=>{
  console.log("trying retry payment with ",order);
  
  handleRazorpayPayment(
    order,
    order._id,
  )
}
    const FilterContent = () => (
      <div className="space-y-4 px-1">
        <div>
          <h3 className="text-sm font-medium mb-2">ORDER STATUS</h3>
          <div className="space-y-2">
            {['on-the-way', 'delivered', 'cancelled', 'returned'].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`${status}-status`}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStatuses([...selectedStatuses, status])
                    } else {
                      setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                    }
                  }}
                />
                <label htmlFor={`${status}-status`} className="text-sm capitalize">
                  {status.replace('-', ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>
       
      </div>
    )
  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/profile" className="hover:underline">
          My Account
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>My Orders</span>
      </div>

      <div className="grid gap-6 ">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your orders here"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <FilterSheet>
              <FilterContent/>
            </FilterSheet>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6">
              {data && data.map((order) => (
                <Card key={order._id} className="overflow-hidden"  >
                  <CardContent className="p-0" >
                    <div className="bg-muted p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                        {order?.items?.every(item=>item.status=='Pending' && item.paymentStatus==='Failed') &&
                         <Button 
                         className="w-20 bg-orange-700"
                         onClick={()=>handleRetryPayment(order)}>PAY</Button>}
                      
                        <p className="font-semibold">Total: ₹{order.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y" >
                      {order.items && order.items.map((product) => (
                        <div key={product._id} className="p-4 flex gap-4">
                          <img
                            src={product.productId.images[0]}
                            alt={product.productId.name}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{product.productId.name}</h3>
                            <div className="text-sm text-muted-foreground space-x-2">
                              {product.size && <span>Size: {product.size}</span>}
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <span><Badge
                                variant="secondary"
                                className={`${
                                  product.status === 'Delivered' ? 'bg-green-500' : 
                                  product.status === 'Cancelled' ? 'bg-red-500' : 
                                  'bg-blue-500'
                                } text-white`}
                              >
                                
                                {product.status} 
                              </Badge>
                               {product.status=='Delivered' && <> on { new Date(product.deliveryDate).toLocaleDateString()}</>}
                                {['Pending','Confirmed','Shipped'].includes(product.status) && <> on {new Date(order.expectedDeliveryDate).toLocaleDateString()}</>}</span>
                              <p className="font-medium">₹{product.totalPrice}</p>
                            </div>
                          
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-end">
                      <Button variant="ghost" size="sm" onClick={()=>navigate(`/orders/${order.orderNumber}`)}>View Details</Button>
                      </div>
                       
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
  
}



// import React, { useState, Suspense } from 'react'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Input } from '@/components/ui/input'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Separator } from '@/components/ui/separator'
// import FilterSheet from './FilterSheets'
// import { ChevronRight, Package, Search, SlidersHorizontal, Star } from 'lucide-react'

// import { useQuery } from '@tanstack/react-query'
// import { getAllOrders } from '@/services/orderService'
// import { toast } from 'react-hot-toast'
// import { Link } from 'react-router-dom'
// import { useSelector } from 'react-redux'

// const RatingDialog = React.lazy(() => import('@/components/shared/RatingDialouge'))

// // Mock data structure for orders with multiple products
// const orders = [
//   {
//     id: '1',
//     orderDate: '2023-11-10',
//     totalAmount: 1388,
//     products: [
//       {
//         id: 'p1',
//         name: 'RED TAPE Casual Sneaker Shoes for Men',
//         image: '/placeholder.svg',
//         price: 1192,
//         color: 'Black',
//         size: '7',
//         status: 'on-the-way',
//         statusText: 'Delivery expected by Nov 15'
//       },
//       {
//         id: 'p2',
//         name: 'Cadbury Celebrations Assorted Chocolate',
//         image: '/placeholder.svg',
//         price: 196,
//         size: 'Standard',
//         status: 'delivered',
//         statusText: 'Delivered on Nov 12'
//       }
//     ]
//   },
//   {
//     id: '2',
//     orderDate: '2023-10-25',
//     totalAmount: 635,
//     products: [
//       {
//         id: 'p3',
//         name: 'ZEBRONICS Zeb-Jaguar Wireless Mouse',
//         image: '/placeholder.svg',
//         price: 346,
//         color: 'Black',
//         status: 'cancelled',
//         statusText: 'Cancelled on Oct 30',
//         cancelReason: 'The delivery partner was unable to deliver to your location'
//       },
//       {
//         id: 'p4',
//         name: 'Logitech K380 Wireless Keyboard',
//         image: '/placeholder.svg',
//         price: 289,
//         color: 'White',
//         status: 'delivered',
//         statusText: 'Delivered on Nov 2'
//       }
//     ]
//   }
// ]


// export default function Component() {
//   const userId =useSelector((state)=>state?.user?.userInfo?._id)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedStatuses, setSelectedStatuses] = useState([])
//   const [selectedYears, setSelectedYears] = useState([])

//   const { data, error, isLoading } = useQuery({
//     queryKey: ['orders'],
//     queryFn:()=> getAllOrders(userId),
//     initialData: orders, // Using mock data as initial data
//   })

//   if (isLoading) toast.loading("Loading orders...")
//   if (error) toast.error("Error loading orders")

//   const filteredOrders = data.filter(order => {
//     const matchesSearch = order.items.some(item => 
//       item.name.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     const matchesStatus = selectedStatuses.length === 0 || order.products.some(product => 
//       selectedStatuses.includes(product.status)
//     )
//     const matchesYear = selectedYears.length === 0 || selectedYears.includes(new Date(order.orderDate).getFullYear().toString())
//     return matchesSearch && matchesStatus && matchesYear
//   })

//   const FilterContent = () => (
//     <div className="space-y-4 px-1">
//       <div>
//         <h3 className="text-sm font-medium mb-2">ORDER STATUS</h3>
//         <div className="space-y-2">
//           {['on-the-way', 'delivered', 'cancelled', 'returned'].map((status) => (
//             <div key={status} className="flex items-center space-x-2">
//               <Checkbox
//                 id={`${status}-status`}
//                 checked={selectedStatuses.includes(status)}
//                 onCheckedChange={(checked) => {
//                   if (checked) {
//                     setSelectedStatuses([...selectedStatuses, status])
//                   } else {
//                     setSelectedStatuses(selectedStatuses.filter(s => s !== status))
//                   }
//                 }}
//               />
//               <label htmlFor={`${status}-status`} className="text-sm capitalize">
//                 {status.replace('-', ' ')}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Separator />
//       <div>
//         <h3 className="text-sm font-medium mb-2">ORDER TIME</h3>
//         <div className="space-y-2">
//           {['2023', '2022', '2021', '2020'].map((year) => (
//             <div key={year} className="flex items-center space-x-2">
//               <Checkbox
//                 id={`${year}-year`}
//                 checked={selectedYears.includes(year)}
//                 onCheckedChange={(checked) => {
//                   if (checked) {
//                     setSelectedYears([...selectedYears, year])
//                   } else {
//                     setSelectedYears(selectedYears.filter(y => y !== year))
//                   }
//                 }}
//               />
//               <label htmlFor={`${year}-year`} className="text-sm">
//                 {year}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="container mx-auto p-4 space-y-4">
//       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//         <Link to="/" className="hover:underline">
//           Home
//         </Link>
//         <ChevronRight className="h-4 w-4" />
//         <Link to="/profile" className="hover:underline">
//           My Account
//         </Link>
//         <ChevronRight className="h-4 w-4" />
//         <span>My Orders</span>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
//         <Card className="h-fit hidden lg:block p-4">
//           <h2 className="font-semibold mb-4">Filters</h2>
//           <FilterContent />
//         </Card>

//         <div className="space-y-4">
//           <div className="flex gap-2">
//             <div className="relative flex-1">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search your orders here"
//                 className="pl-8"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <FilterSheet>
//               <FilterContent />
//             </FilterSheet>
//           </div>

//           <ScrollArea className="h-[calc(100vh-200px)]">
//             <div className="space-y-6">
//               {filteredOrders.map((order) => (
//                 <Card key={order.id} className="overflow-hidden">
//                   <CardContent className="p-0">
//                     <div className="bg-muted p-4">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="font-semibold">Order #{order.id}</p>
//                           <p className="text-sm text-muted-foreground">
//                             Placed on {new Date(order.orderDate).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <p className="font-semibold">Total: ₹{order.totalAmount}</p>
//                       </div>
//                     </div>
//                     <div className="divide-y">
//                       {order.products.map((product) => (
//                         <div key={product.id} className="p-4 flex gap-4">
//                           <image
//                             src={product.image}
//                             alt={product.name}
//                             width={80}
//                             height={80}
//                             className="rounded-md object-cover"
//                           />
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-medium truncate">{product.name}</h3>
//                             <div className="text-sm text-muted-foreground space-x-2">
//                               {product.color && <span>Color: {product.color}</span>}
//                               {product.size && <span>Size: {product.size}</span>}
//                             </div>
//                             <div className="mt-2 flex items-center justify-between gap-2">
//                               <Badge 
//                                 variant="secondary" 
//                                 className={`${
//                                   product.status === 'delivered' ? 'bg-green-500' : 
//                                   product.status === 'cancelled' ? 'bg-red-500' : 
//                                   'bg-blue-500'
//                                 } text-white`}
//                               >
//                                 {product.statusText}
//                               </Badge>
//                               <p className="font-medium">₹{product.price}</p>
//                             </div>
//                             <div className="mt-2 flex justify-between items-center">
//                               {product.status !== 'cancelled' ? (
//                                 <Suspense fallback={<Button variant="outline" size="sm" disabled>Loading...</Button>}>
//                                   <RatingDialog productName={product.name} />
//                                 </Suspense>
//                               ) : (
//                                 <Button variant="outline" size="sm">
//                                   <Package className="mr-2 h-4 w-4" />
//                                   Buy Again
//                                 </Button>
//                               )}
//                               <Button variant="ghost" size="sm">View Details</Button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>
//       </div>
//     </div>
//   )
// }

// import React,{ useState,Suspense } from 'react'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Input } from '@/components/ui/input'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Separator } from '@/components/ui/separator'
// import FilterSheet from './FilterSheets'
// import { ChevronRight, Package, Search } from 'lucide-react'
// import { Link } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import { getAllOrders } from '@/services/orderService'
// import toast from 'react-hot-toast'
// const RatingDialog=React.lazy(()=>import('../../../shared/RatingDialouge'))

// // const orders = [
// //   {
// //     id: 1,
// //     status: 'on-the-way',
// //     statusText: 'Delivery expected by Nov 10',
// //     date: '2023-11-10',
// //     product: {
// //       name: 'RED TAPE Casual Sneaker Shoes for Men',
// //       image: '/placeholder.svg',
// //       price: 1192,
// //       color: 'Black',
// //       size: '7'
// //     }
// //   },
// //   {
// //     id: 2,
// //     status: 'delivered',
// //     statusText: 'Delivered on Oct 31',
// //     date: '2023-10-31',
// //     product: {
// //       name: 'Cadbury Celebrations Assorted Chocolate',
// //       image: '/placeholder.svg',
// //       price: 196,
// //       size: 'Standard'
// //     }
// //   },
// //   {
// //     id: 3,
// //     status: 'cancelled',
// //     statusText: 'Cancelled on Aug 30',
// //     date: '2023-08-30',
// //     product: {
// //       name: 'ZEBRONICS Zeb-Jaguar Wireless Mouse',
// //       image: '/placeholder.svg',
// //       price: 346,
// //       color: 'Black'
// //     },
// //     cancelReason: 'The delivery partner was unable to deliver to your location'
// //   }
// // ]


// export default function Component() {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedStatuses, setSelectedStatuses] = useState([])
//   const [selectedYears, setSelectedYears] = useState([])


// //fetch orders
// const {data,error,isLoading} =useQuery({
//   queryKey:['orders'],
//   queryFn:()=>getAllOrders(userId)
// })
// // if(isLoading) toast.loading("Loading...")
// if(error) toast.error(error.message)
//   const filteredOrders = orders.filter(order => {
//     const matchesSearch = order.product.name.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(order.status)
//     const matchesYear = selectedYears.length === 0 || selectedYears.includes(new Date(order.date).getFullYear().toString())
//     return matchesSearch && matchesStatus && matchesYear
//   })

//   const FilterContent = () => (
//     <div className="space-y-4 px-1">
//       <div>
//         <h3 className="text-sm font-medium mb-2">ORDER STATUS</h3>
//         <div className="space-y-2">
//           {['on-the-way', 'delivered', 'cancelled', 'returned'].map((status) => (
//             <div key={status} className="flex items-center space-x-2">
//               <Checkbox
//                 id={`${status}-status`}
//                 checked={selectedStatuses.includes(status)}
//                 onCheckedChange={(checked) => {
//                   if (checked) {
//                     setSelectedStatuses([...selectedStatuses, status])
//                   } else {
//                     setSelectedStatuses(selectedStatuses.filter(s => s !== status))
//                   }
//                 }}
//               />
//               <label htmlFor={`${status}-status`} className="text-sm capitalize">
//                 {status.replace('-', ' ')}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Separator />
//       <div>
//         <h3 className="text-sm font-medium mb-2">ORDER TIME</h3>
//         <div className="space-y-2">
//           {['2023', '2022', '2021', '2020'].map((year) => (
//             <div key={year} className="flex items-center space-x-2">
//               <Checkbox
//                 id={`${year}-year`}
//                 checked={selectedYears.includes(year)}
//                 onCheckedChange={(checked) => {
//                   if (checked) {
//                     setSelectedYears([...selectedYears, year])
//                   } else {
//                     setSelectedYears(selectedYears.filter(y => y !== year))
//                   }
//                 }}
//               />
//               <label htmlFor={`${year}-year`} className="text-sm">
//                 {year}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )


//   return (
//     <div className="container mx-auto p-4 space-y-4">
//       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//         <Link to="/" className="hover:underline">
//           Home
//         </Link>
//         <ChevronRight className="h-4 w-4" />
//         <Link to="/account" className="hover:underline">
//           My Account
//         </Link>
//         <ChevronRight className="h-4 w-4" />
//         <span>My Orders</span>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
//         <Card className="h-fit hidden lg:block p-4">
//           <h2 className="font-semibold mb-4">Filters</h2>
//           <FilterContent />
//         </Card>

//         <div className="space-y-4">
//           <div className="flex gap-2">
//             <div className="relative flex-1">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search your orders here"
//                 className="pl-8"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <FilterSheet>
//               <FilterContent />
//             </FilterSheet>
//           </div>

//           <ScrollArea className="h-[calc(100vh-200px)]">
//             <div className="space-y-3">
//               {data.map((order) => (
//                 <Card key={order._id} className="p-3">
//                   <div className="flex gap-3">
//                     <image
//                       src={order.product.image}
//                       alt={order.product.name}
//                       width={80}
//                       height={80}
//                       className="rounded-lg object-cover"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-2">
//                         <div className="min-w-0">
//                           <h3 className="font-medium truncate">{order.product.name}</h3>
//                           <div className="text-sm text-muted-foreground space-x-2">
//                             {order.product.color && <span>Color: {order.product.color}</span>}
//                             {order.product.size && <span>Size: {order.product.size}</span>}
//                           </div>
//                         </div>
//                         <p className="font-medium whitespace-nowrap">₹{order.product.price}</p>
//                       </div>
//                       <div className="mt-2 flex items-center justify-between gap-2">
//                         <Badge 
//                           variant="secondary" 
//                           className={`${
//                             order.status === 'delivered' ? 'bg-green-500' : 
//                             order.status === 'cancelled' ? 'bg-red-500' : 
//                             'bg-blue-500'
//                           } text-white`}
//                         >
//                           {order.statusText}
//                         </Badge>
//                         {order.status !== 'cancelled' && (
//                           <Suspense fallback={<div>Loading..</div>}>
//                           <RatingDialog productName={order.product.name} />
//                            </Suspense>)}
//                       </div>
//                       {order.status === 'cancelled' && (
//                         <div className="mt-2">
//                           <Button variant="outline" size="sm" className="w-full">
//                             <Package className="mr-2 h-4 w-4" />
//                             Buy Again
//                           </Button>
//                         </div>
//                       )}
//                       {order.cancelReason && (
//                         <p className="text-sm text-muted-foreground mt-2">{order.cancelReason}</p>
//                       )}
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>
//       </div>
//     </div>
//   )
// }


// import React,{ useState,Suspense } from 'react'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
// import { Checkbox } from '@/components/ui/checkbox'
// import { Input } from '@/components/ui/input'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { Separator } from '@/components/ui/separator'
// import FilterSheet from './FilterSheets'
// import { ChevronRight, Package, Search } from 'lucide-react'
// import { Link } from 'react-router-dom'
// import { useQuery } from '@tanstack/react-query'
// import { getAllOrders } from '@/services/orderService'
// import toast from 'react-hot-toast'
// const RatingDialog=React.lazy(()=>import('../../../shared/RatingDialouge'))

// const orders = [
//   {
//     id: 1,
//     status: 'on-the-way',
//     statusText: 'Delivery expected by Nov 10',
//     date: '2023-11-10',
//     product: {
//       name: 'RED TAPE Casual Sneaker Shoes for Men',
//       image: '/placeholder.svg',
//       price: 1192,
//       color: 'Black',
//       size: '7'
//     }
//   },
//   {
//     id: 2,
//     status: 'delivered',
//     statusText: 'Delivered on Oct 31',
//     date: '2023-10-31',
//     product: {
//       name: 'Cadbury Celebrations Assorted Chocolate',
//       image: '/placeholder.svg',
//       price: 196,
//       size: 'Standard'
//     }
//   },
//   {
//     id: 3,
//     status: 'cancelled',
//     statusText: 'Cancelled on Aug 30',
//     date: '2023-08-30',
//     product: {
//       name: 'ZEBRONICS Zeb-Jaguar Wireless Mouse',
//       image: '/placeholder.svg',
//       price: 346,
//       color: 'Black'
//     },
//     cancelReason: 'The delivery partner was unable to deliver to your location'
//   }
// ]


// export default function Component() {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedStatuses, setSelectedStatuses] = useState([])
//   const [selectedYears, setSelectedYears] = useState([])


// //fetch orders
// const {data,error,isLoading} =useQuery({
//   queryKey:['orders'],
//   queryFn:()=>getAllOrders(userId)
// })
// if(isLoading) toast.loading("Loading...")
// if(error) toast.error(error.message)
//   const filteredOrders = orders.filter(order => {
//     const matchesSearch = order.product.name.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(order.status)
//     const matchesYear = selectedYears.length === 0 || selectedYears.includes(new Date(order.date).getFullYear().toString())
//     return matchesSearch && matchesStatus && matchesYear
//   })

 

//   return (
//     <div className="container mx-auto p-4 space-y-4">
//       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//         <Link to="/" className="hover:underline">
//           Home
//         </Link>
//         <ChevronRight className="h-4 w-4" />
//         <Link to="/account" className="hover:underline">
//           My Account
//         </Link>
//         <ChevronRight className="h-4 w-4" />
//         <span>My Orders</span>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
//         <Card className="h-fit hidden lg:block p-4">
//           <h2 className="font-semibold mb-4">Filters</h2>
//           <FilterContent />
//         </Card>

//         <div className="space-y-4">
//           <div className="flex gap-2">
//             <div className="relative flex-1">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search your orders here"
//                 className="pl-8"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <FilterSheet>
//               <FilterContent />
//             </FilterSheet>
//           </div>

//           <ScrollArea className="h-[calc(100vh-200px)]">
//             <div className="space-y-3">
//               {filteredOrders.map((order) => (
//                 <Card key={order.id} className="p-3">
//                   <div className="flex gap-3">
//                     <image
//                       src={order.product.image}
//                       alt={order.product.name}
//                       width={80}
//                       height={80}
//                       className="rounded-lg object-cover"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-2">
//                         <div className="min-w-0">
//                           <h3 className="font-medium truncate">{order.product.name}</h3>
//                           <div className="text-sm text-muted-foreground space-x-2">
//                             {order.product.color && <span>Color: {order.product.color}</span>}
//                             {order.product.size && <span>Size: {order.product.size}</span>}
//                           </div>
//                         </div>
//                         <p className="font-medium whitespace-nowrap">₹{order.product.price}</p>
//                       </div>
//                       <div className="mt-2 flex items-center justify-between gap-2">
//                         <Badge 
//                           variant="secondary" 
//                           className={`${
//                             order.status === 'delivered' ? 'bg-green-500' : 
//                             order.status === 'cancelled' ? 'bg-red-500' : 
//                             'bg-blue-500'
//                           } text-white`}
//                         >
//                           {order.statusText}
//                         </Badge>
//                         {order.status !== 'cancelled' && (
//                           <Suspense fallback={<div>Loading..</div>}>
//                           <RatingDialog productName={order.product.name} />
//                            </Suspense>)}
//                       </div>
//                       {order.status === 'cancelled' && (
//                         <div className="mt-2">
//                           <Button variant="outline" size="sm" className="w-full">
//                             <Package className="mr-2 h-4 w-4" />
//                             Buy Again
//                           </Button>
//                         </div>
//                       )}
//                       {order.cancelReason && (
//                         <p className="text-sm text-muted-foreground mt-2">{order.cancelReason}</p>
//                       )}
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>
//       </div>
//     </div>
//   )
// }