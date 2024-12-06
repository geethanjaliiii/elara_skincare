"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "@/services/orderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { SearchAndFilters } from "./SearchAndFilters";
import { OrdersTable } from "./OrderTable";
import { useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { useApproveMutation, useDeclineMutation } from "@/hooks/admin/orderHooks";
import toast, { Toaster } from "react-hot-toast";
import { getReturnRequests } from "../api/orders";



export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");


  //return mutations
  const approveMutation=useApproveMutation(toast)
  const declineMutation=useDeclineMutation(toast)
  // const[searchParams,setSearchParams]=useSearchParams()
  // const[page,setPage]=useState(parseInt(searchParams.get('page'))||1)
  // const[totalPages,setTotalPages]=useState(0)
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  const {data:pendingRequests=[],isLoading: returnsLoading}=useQuery({
    queryKey:['pendingRequests'],
    queryFn:getReturnRequests
  })


  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "all" || order.status === statusFilter) &&
      (order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

const onApproveReturn=(orderId,itemId)=>{
approveMutation.mutate({orderId,itemId})
}
const onDeclineReturn=(orderId,itemId)=>{
  declineMutation.mutate({orderId,itemId})
}

  const handlePageChange=()=>{

  }
  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <Toaster/>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
                    {/* Display return notifications */}
                    {pendingRequests.length > 0 && (
            <Alert variant="warning" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Pending Return Requests</AlertTitle>
              <AlertDescription>
                There are <strong>{pendingRequests.length}</strong> return requests pending approval.{" "}
               
              </AlertDescription>
            </Alert>
          )}

          {/* <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          <Button variant="outline" className="mb-6">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button> */}
          <OrdersTable 
          orders={filteredOrders}
          onApproveReturn={onApproveReturn}
          onDeclineReturn={onDeclineReturn} />
        {/* <div className="flex justify-center items-center mt-8 space-x-4">
        <Button
        disabled={page===1}
        onClick={()=>handlePageChange(page-1)}
        >Previous</Button>
         <span>
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
        </div> */}

        </CardContent>
      </Card>
    </div>
  );
}
