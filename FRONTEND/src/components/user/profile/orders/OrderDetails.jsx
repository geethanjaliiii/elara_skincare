import { useState } from "react";
import {  Package, Truck, Home, X, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { cancelOrder, getOrderDetails } from "@/services/orderService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RatingDialog from "@/components/shared/RatingDialouge";
import OrderTracker from "./OrderTracker";
import { Link } from "react-router-dom";
import { axiosInstance } from "@/config/axiosConfig";
import toast, { Toaster } from "react-hot-toast";
import { DeleteWarningModal } from "@/components/shared/DeleteWarningModal";


export default function OrderDetails() {
  const { orderId } = useParams();
  const [appliedCoupon, setAppliedCoupon] = useState("DISCOUNT10");
  const [isModalOpen,setIsModalOpen]=useState(false)
  const queryClient=useQueryClient()
  const [itemToCancel,setItemToCancel]=useState(null)
  const cancelOrderMutaion=useMutation({
    mutationFn:({orderId,itemId})=>{
      console.log("cancelling");
      
      cancelOrder(orderId,itemId)},
    onSuccess:(data)=>{
      toast.success("order Cancelled");
      console.log('data',data);
      
      queryClient.invalidateQueries(['orders'])
      queryClient.invalidateQueries(['userOrders'],data?.userId)
      queryClient.invalidateQueries(['orderDetails'],orderId)
    },
    onError:(error)=>{
      const errorMessage=error?.response?.data?.error||"Order cancellation failed"
      toast.error(errorMessage)
      console.log("error cancelllling",error);
    }
  })

  const { data, error, isLoading } = useQuery({
    queryKey: ["orderDetails", orderId],
    queryFn: () => getOrderDetails(orderId),
  });
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading order details.</p>;
  console.log("data", data);
  console.log("error", error);

  const handleCancel = (itemId) => {
    setIsModalOpen(true)
    
    if(itemId){
      setItemToCancel(itemId)
      
    }
    else{
      console.log("no itemId");
      
    }
  };
//confirm function for modal
  const confirmCancelOrder=()=>{
   cancelOrderMutaion.mutate({orderId:orderId,itemId:itemToCancel})
   setIsModalOpen(false)
   setItemToCancel(null)
  }
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Toaster/>
      <nav className="mb-8 flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="flex items-center hover:text-primary">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/orders" className="flex items-center hover:text-primary">
            <Package className="mr-2 h-4 w-4" />
            Orders
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary">Order #{data.orderNumber}</span>
        </nav>
      {/* <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order #{data.orderNumber}</h1>
        <Button variant="outline">
          <HelpCircle className="mr-2 h-4 w-4" />
          Need Help?
        </Button>
      </div> */}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {data &&
            data.items.map((item) => (
              <Card key={item._id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col ">
                      <img
                        src={item.productId.images[0]}
                        alt={item.productId.name}
                        className="h-20 w-20 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <h3 className="font-medium">{item.productId.name}</h3>
                        <p className="text-xs">{item.size}</p>
                        <p className="font-medium">₹{item.price}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm capitalize">
                            {item.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({item.status})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      
                      <div className="space-y-2">
                        <OrderTracker
                          currentStatus={data.currentStatus}
                          statusUpdates={{
                            ordered: {
                              date: new Date(
                                data.orderDate
                              ).toLocaleDateString(),
                              time: new Date(
                                data.orderDate
                              ).toLocaleTimeString(),
                            },
                            shipped: data.shippedDate
                              ? {
                                  date: new Date(
                                    data.shippedDate
                                  ).toLocaleDateString(),
                                  time: new Date(
                                    data.shippedDate
                                  ).toLocaleTimeString(),
                                }
                              : undefined,
                            outForDelivery: data.outForDeliveryDate
                              ? {
                                  date: new Date(
                                    data.outForDeliveryDate
                                  ).toLocaleDateString(),
                                  time: new Date(
                                    data.outForDeliveryDate
                                  ).toLocaleTimeString(),
                                }
                              : undefined,
                            delivered: data.deliveredDate
                              ? {
                                  date: new Date(
                                    data.deliveredDate
                                  ).toLocaleDateString(),
                                  time: new Date(
                                    data.deliveredDate
                                  ).toLocaleTimeString(),
                                }
                              : undefined,
                          }}
                          expectedDelivery={new Date(
                            data.expectedDeliveryDate
                          ).toLocaleDateString()}
                        />
                        <div className="flex gap-2 justify-between">
                        {<RatingDialog />}
                        {/* {item.status === "delivered" && <RatingDialog />} */}
                          {item.status !== "delivered" && item.status!='Cancelled'&& (
                            <Button
                              variant="destructive"
                              size="xs"
                              className="text-xs py-1 px-2"
                              disabled={cancelOrderMutaion.isLoading}
                              onClick={() => handleCancel(item._id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <Home className="h-4 w-4 mt-1" />
                <div>
                  <p className="font-medium">{data.shippingAddress.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.shippingAddress.addressLine}
                    <br />
                    {data.shippingAddress.city}
                    <br />
                    {data.shippingAddress.state} -{data.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{data.totalMRP}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">- ₹{data.totalDiscount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{data.shippingFee}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between">
                  <span>Coupon ({appliedCoupon})</span>
                  <span className="text-green-600">- ₹5.00</span>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹{data.totalAmount - 5}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <DeleteWarningModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} onConfirm={confirmCancelOrder} statement={'cancel the order?'}/>
    </div>
  );
}
