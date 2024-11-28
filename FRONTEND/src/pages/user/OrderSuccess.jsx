import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrderDetails } from "@/services/orderService";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronRight,
  Home,
  Package,
  ShoppingCart,
  Timer,
  XCircle 
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatDeliveryDate, formatOrderDate } from "@/utils/dateFormatting";
import { LoadingSpinner } from "@/App";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ["orderDetails", orderId],
    queryFn: () => getOrderDetails(orderId),
  });
  if (isLoading) return <LoadingSpinner />;
  if (error) {
    navigate("/orders");
  }
  console.log("data", data);
  console.log("error", error);

  const orderDate = new Date(data.orderDate);
  const formattedDate = formatOrderDate(orderDate);
  const formattedTime = orderDate.toLocaleTimeString();
  const expectedDeliveryDate = formatDeliveryDate(data.expectedDeliveryDate);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      {data && (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="flex items-center hover:text-primary">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/cart" className="flex items-center hover:text-primary">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary">Checkout</span>
          </nav>

          {/* Confirmation Card */}
          <Card className="mx-auto max-w-4xl w-full p-10">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {data?.paymentStatus == "Failed" ? (
                  <>
                    <div className="mb-4 rounded-full bg-foreground/5 p-3 ">
                      <XCircle  className="h-14 w-14 text-red-500" />
                    </div>
                    <h1 className="mb-2 text-2xl font-semibold">
                      Payment Failed!
                    </h1>
                  </>
                ) : (
                  <>
                    <div className="mb-4 rounded-full bg-foreground/5 p-3 ">
                      <CheckCircle2 className="h-14 w-14 text-green-500" />
                    </div>
                    <h1 className="mb-2 text-2xl font-semibold">
                      Payment Successful!
                    </h1>
                  </>
                )}
                <p className="text-muted-foreground">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
              </div>

              <Separator className="my-6" />

              {/* Order Details */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-medium">{data.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{formattedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{data.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium text-sm-bold">
                    ₹{data.totalAmount}
                  </span>
                </div>
                {data.transactionId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Transaction ID
                    </span>
                    <span className="font-medium">TXN123456789</span>
                  </div>
                )}
              </div>
              <Separator className="my-6" />

              {/* Delivery Information */}
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="font-medium">Delivery Information</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    Estimated Delivery Date:
                  </p>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      Arriving By {expectedDeliveryDate}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    * Delivery times may vary based on location and other
                    factors
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button variant="outline" asChild>
                  <Link to={`/orders/${orderId}`}>View Order</Link>
                </Button>
                <Button asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>

              {/* Additional Information */}
              <div className="mt-6 text-center text-xs text-muted-foreground">
                A confirmation email has been sent to your registered email
                address.
                <br />
                For any queries, please contact our customer support.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Footer />
    </div>
  );
}
