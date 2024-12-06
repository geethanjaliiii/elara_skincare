import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { OrderActionsDropdown } from "./OrderActionsDropdown";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteWarningModal } from "@/components/shared/DeleteWarningModal";
import { adminAxiosInstance } from "@/config/axiosConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { AlertCircle } from 'lucide-react'
import { Modal } from "@/components/shared/Modal";
// import { cancelOrder } from "@/services/orderService";

const paymentStatusColors = {
  paid: "bg-green-500",
  unpaid: "bg-red-500",
  refunded: "bg-orange-500",
};
const statusColors = {
  Pending: "bg-yellow-500",
  Confirmed: "bg-blue-500",
  Shipped: "bg-purple-500",
  Delivered: "bg-green-600",
  Cancelled: "bg-red-600",
};
//array of all status
const statusOrder = Object.keys(statusColors);

export function OrderItem({ order,onApproveReturn,onDeclineReturn }) {
  // State to manage status for each item individually
  const [isModalOpen, setIsmodalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const queryClient = useQueryClient();
const[returnModalOpen,setReturnModalOpen]=useState(false)
  const [itemToCancel, setItemToCancel] = useState(null);
  const [statusMap, setStatusMap] = useState(
    order.items.reduce((acc, item) => {
      acc[item._id] = item.status;
      return acc;
    }, {})
  );
 //open modal
  const openModal=(item,orderId)=>{
    setReturnModalOpen(true);
    setModalData({
      reason: item.returnRequest.reason,
      comment: item.returnRequest.comment,
      orderId: orderId,
      itemId: item._id,
    })
  }
  // Close Modal
  const closeModal = () => {
    setModalData(null);
    setReturnModalOpen(false);
  };
  // Handler to update status for a specific item
  const handleStatusChange = (itemId, newStatus) => {
    console.log(newStatus);
    if (newStatus == "Cancelled") {
      setIsmodalOpen(true);
      setItemToCancel(itemId);
      console.log("open modal");
    } else {
      changeStatusMutation.mutate({
        orderId: order._id,
        itemId,
        status: newStatus,
      });
    }
  };
  //api function call
  const changeStatus = async (orderId, itemId, newStatus) => {
    try {
      const response = await adminAxiosInstance.patch(
        `/api/admin/orders/${orderId}/items/${itemId}`,
        { status: newStatus }
      );
      return response.data.item;
    } catch (error) {
      console.log("error updating status",error);
      
      throw error
    }
    
  };
  //api call to cancel order item
  const cancelOrder = async (itemId) => {
    const response = await adminAxiosInstance.patch(
      `/api/admin/orders/${order._id}/cancel/${itemId}`
    );
    return response.data;
  };

  const changeStatusMutation = useMutation({
    mutationFn: ({ orderId, itemId, status }) =>
      changeStatus(orderId, itemId, status),
    onSuccess: (data) => {
      toast.success("Status updated");
      setStatusMap((prev) => ({
        ...prev,
        [data._id]: data?.status,
      }));
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["userOrders", order.userId]);
      queryClient.invalidateQueries(["orderDetails", order.orderNumber]);
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Status updating failed.";
      console.log("Error in status update", error);
      toast.error(errorMessage);
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: (data) => {
      toast.success("Order cancelled");
      console.log("order cancelled", data);
    
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["userOrders"], order.userId);
      queryClient.invalidateQueries(["orderDetails"], order.orderNumber);
      setIsmodalOpen(false);
      setStatusMap((prev) => ({ ...prev, [itemToCancel]: "Cancelled" }));
    },
    onError: (error) => {
      console.log("cancelling failer", error);
      setIsmodalOpen(false);
      const errorMessage =
        error?.response?.data?.error || "Order cancellation failed.";
      toast.error(errorMessage);
    },
  });

  const handleCancelOrder = () => {
    if (itemToCancel) {
      console.log("calling mutate fun to cancel", itemToCancel);
      cancelOrderMutation.mutate(itemToCancel);
    }
  };
  return (
    <>
      <TableRow key={order._id}>
        <TableCell>{order.orderNumber}</TableCell>
        <TableCell>{order.userId?.name}</TableCell>
        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>

        <TableCell>
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center space-x-2 justify-between"
            >
              <img
                src={item.productId?.images[0]}
                alt={item.productId.name}
                className="h-20 w-20 object-cover rounded p-2"
              />
              <p>{item.productId.name}</p>
              <div key={item._id} className="mb-2">
                <Select
                  value={statusMap[item._id]}
                  disabled={changeStatusMutation.isLoading||cancelOrderMutation.isLoading}//prevent overlapping of api calls
                  onValueChange={(newStatus) => {
                    console.log("selected item", item.name);
                    handleStatusChange(item._id, newStatus);
                  }}
                >
                  <SelectTrigger className="w-[150px] ">
                    <SelectValue>
                      <Badge 
                        className={`${
                          statusColors[statusMap[item._id]]
                        } text-white`}
                      >
                        {statusMap[item._id]}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statusColors).map((status) => (
                      <SelectItem 
                      value={status}
                       key={status}
                       disabled={statusOrder.indexOf(status)<statusOrder.indexOf(statusMap[item._id])||item.status=='Returned'}>
                        <Badge className={`${statusColors[status]} text-white`}>
                          {status}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </TableCell>
        <TableCell>
        {order.items.map((item)=>(
          <div >
            <Badge key={item._id}
            className={`${paymentStatusColors[item.paymentStatus]} text-white my-5`}
          >
            {item.paymentStatus}
          </Badge>
          </div>
        ))}
          
        </TableCell>
        <TableCell className="text-right">
          ₹{order.totalAmount}
        </TableCell>
        <TableCell>
          {order.items.map((item)=>(item.returnRequest.isRequested && !item.returnRequest.isResponseSend && 
            <AlertCircle 
            key={item._id}
             className="cursor-pointer text-warning"
            onClick={()=>openModal(item,order._id)}/>
          ) )}
          <Modal isOpen={returnModalOpen} onClose={closeModal}>
            {modalData && (<>
              <h2 className="text-lg font-bold">Return Details</h2>
              <p>
                <strong>Reason:</strong> {modalData.reason}
              </p>
              <p>
                <strong>Comment:</strong>{" "}
                {modalData.comment || "No comment provided"}
              </p>

              {/* Approve and Decline Buttons */}
              <div className="flex space-x-4 mt-4">
                <Button
                  size="sm"
                  onClick={() => {
                    onApproveReturn(modalData.orderId, modalData.itemId);
                    closeModal(); // Close modal after action
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    onDeclineReturn(modalData.orderId, modalData.itemId);
                    closeModal(); // Close modal after action
                  }}
                >
                  Decline
                </Button>
              </div>
              </>)}
          </Modal>
        {/* {order.items.map((item) => (
          item.returnRequest.isRequested && !item.returnRequest.isResponseSend && (

            <div key={item._id} className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => onApproveReturn(order._id,item._id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeclineReturn(order._id,item._id)}
              >
                Decline
              </Button>
            </div>
          )
        ))} */}
          {/* <OrderActionsDropdown /> */}
        </TableCell>
      </TableRow>

      <DeleteWarningModal
        isOpen={isModalOpen}
        onClose={() => setIsmodalOpen(false)}
        onConfirm={handleCancelOrder}
        statement={"cancel the order. This action can't be undone."}
      />
    </>
  );
}
