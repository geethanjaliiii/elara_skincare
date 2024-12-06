import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchSalesData } from "@/services/sales";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/App";
import toast, { Toaster } from "react-hot-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Download } from "lucide-react";


export default function SalesReport() {
  const [filterType, setFilterType] = useState("yearly");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "salesData",
      { filterType, startDate, endDate, currentPage, ordersPerPage },
    ],
    queryFn: fetchSalesData,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
  const handleFilterChange = (type) => {
    setFilterType(type);
    refetch();
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) return <div>Failed to load sales data.</div>;

  const totalPages =
    data.overallSalesData.totalOrders / data.overallSalesData.totalOrders;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const DownloadPDF = () => {
    const doc = new jsPDF();
    //title of pdf
    doc.text("Sales Report", 14, 10);

    //define table coloumn
    const headers = [
      [
        "Customer",
        "Order Date",
        "Product",
        "Quantity",
        "Unit Price",
        "Final Price",
      ],
    ];

    //prepare table rows with sale data
    const rows = data.salesData.map((item) => [
      item.customer,
      new Date(item.date).toLocaleDateString(),
      item.product,
      item.quantity,
      `₹${item.unitPrice}`,
      `₹${item.finalPrice}`,
    ]);

    //generate table
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 20,
    });
    //save the PDF with a filename
    doc.save("sales_report.pdf");
  };

  const handleDownloadExcel = () => {
    if (!data || !data.salesData || data.salesData.length === 0) {
      toast.error("No sales data available to download.");
      return;
    }

    //create new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheetData = data.salesData.map((item) => ({
      Customer: item.customer,
      "Order Date": new Date(item.date).toLocaleDateString(),
      Product: item.product,
      Quantity: item.quantity,
      "Unit Price": item.unitPrice.toFixed(2),
      "Coupon Discount": item.couponDiscount.toFixed(2),
      "Other Discount": item.otherDiscount.toFixed(2),
      "Final Price": item.finalPrice.toFixed(2),
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    //add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    //trigger the download
    XLSX.writeFile(workbook, "Sales_Report.xlsx");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Sales Report</h1>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <Select
          value={filterType}
          onValueChange={(value) => handleFilterChange(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select filter type" />
          </SelectTrigger>
          <SelectContent>
            {/* {["custom", "daily", "weekly", "monthly", "yearly"].map((type) =>  */}
            {/* {["daily", "weekly", "monthly", "yearly"].map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))} */}
            {['custom',"daily", "weekly", "monthly", "yearly"].map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filterType === "custom" && (
          <>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-auto"
              
            />
          </>
        )}
      </div>
      {data.salesData ?(<>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{data.overallSalesData.totalSales||0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Discounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{data.overallSalesData.totalDiscount||0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overallSalesData.totalOrders||0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {(
                data.overallSalesData.totalSales ||0/
                data.overallSalesData.totalOrders||1
              ).toFixed(2)||0}
            </div>
          </CardContent>
        </Card>
      </div>


      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Customer</TableHead>
                <TableHead className="text-xs sm:text-sm">Order Date</TableHead>
                <TableHead className="text-xs sm:text-sm">Product</TableHead>
                <TableHead className="text-xs sm:text-sm">Quantity</TableHead>
                <TableHead className="text-xs sm:text-sm">Unit Price</TableHead>
                <TableHead className="text-xs sm:text-sm">
                  Coupon Discount
                </TableHead>
                <TableHead className="text-xs sm:text-sm">
                  Other Discount
                </TableHead>
                <TableHead className="text-xs sm:text-sm">
                  Final Price
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.salesData?.length != 0 ?
                data.salesData.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="text-xs sm:text-sm">
                      {item.customer}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {item.product}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      ₹{item.unitPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      ₹{item.couponDiscount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      ₹{item.otherDiscount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      ₹{item.finalPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )): <div className="px-4">{' No sales to display.'}</div>}
            </TableBody>
          </Table>
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
            >
              Previous
            </PaginationLink>
          </PaginationItem>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page} isActive={currentPage === page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
            >
              Next
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
        <Button variant="outline" onClick={DownloadPDF}>
          Download PDF
        </Button>
      </div></>):<div>{' No sales to display.'}</div>}
    </div>
  );
}
