import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { OrderItem } from "./OrderItem";
  
  export function OrdersTable({ orders ,onApproveReturn,onDeclineReturn}) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Return Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <OrderItem 
              key={order._id} 
              order={order} 
              onApproveReturn={onApproveReturn}
              onDeclineReturn={onDeclineReturn}/>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  