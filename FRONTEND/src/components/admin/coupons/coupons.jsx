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
import { PlusIcon, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCoupons, useToggleCoupon } from "@/hooks/admin/customHooks";
import toast, { Toaster } from "react-hot-toast";

export default function Coupons() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: coupons, isLoading, isError } = useCoupons();
  const toggleCouponstatus = useToggleCoupon();
  // const { mutate: toggleCouponstatus } = useToggleCoupon();
  if (isLoading) {
    return <p>Loading coupons...</p>;
  }

  if (isError) {
    toast.error("Failed to load coupons. Please try again later.");
    return null;
  }

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = async (couponId, currentStatus) => {
    toggleCouponstatus.mutate(couponId, {
      onSuccess: () => {
        console.log("coupon status changed");
        
        toast.success(
          `Coupon ${!currentStatus ? "unlisted" : "listed"} successfully`
        );
      },
      onError: (error) => {
        console.log("error changing coupon", error);

        toast.error("Failed to update coupon status. Please try again.");
      },
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Input
          placeholder="Search coupons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Link to="/admin/dashboard/coupons/add">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Add New Coupon
          </Button>
        </Link>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>List/Unlist</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountPercentage}%`
                    : `$${coupon.discountValue}`}
                </TableCell>
                <TableCell>
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      coupon.isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  {coupon.totalAppliedCount} / {coupon.usageLimit}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={coupon.isActive}
                    onCheckedChange={() =>
                      handleToggle(coupon._id, coupon.isActive)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {filteredCoupons.map((coupon) => (
          <Card key={coupon._id}>
            <CardHeader>
              <CardTitle className="text-lg">{coupon.code}</CardTitle>
              <CardDescription>
                {coupon.discountType === "percentage"
                  ? `${coupon.discountPercentage}% off`
                  : `$${coupon.discountValue} off`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    coupon.isActive
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Usage: {coupon.totalAppliedCount} / {coupon.usageLimit}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {coupon.isActive ? "Listed" : "Unlisted"}
                  </span>
                  <Switch
                    checked={coupon.isActive}
                    onCheckedChange={() =>
                      handleToggle(coupon._id, coupon.isActive)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { PlusIcon, Pencil, Trash2, ChevronDown } from 'lucide-react'
// import { Link } from 'react-router-dom'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { useCoupons } from '@/hooks/admin/customHooks'
// import toast, { Toaster } from 'react-hot-toast'

// // Mock data for demonstration
// const mockCoupons = [
//   { id: '1', code: 'SUMMER10', discountType: 'percentage', discountValue: 10, expiryDate: '2023-08-31', isActive: true, usageCount: 50, maxUsage: 100 },
//   { id: '2', code: 'FLAT20', discountType: 'flat', discountValue: 20, expiryDate: '2023-09-15', isActive: false, usageCount: 75, maxUsage: 200 },
//   { id: '3', code: 'WELCOME15', discountType: 'percentage', discountValue: 15, expiryDate: '2023-12-31', isActive: true, usageCount: 25, maxUsage: 500 },
//   { id: '4', code: 'HOLIDAY50', discountType: 'flat', discountValue: 50, expiryDate: '2023-12-25', isActive: true, usageCount: 100, maxUsage: 1000 },
// ]

// export default function Coupons() {
//   const [searchTerm, setSearchTerm] = useState('')
//   const{data:coupons ,isLoading,isError}=useCoupons();

//   if(isLoading){

//     return  <p>Loading coupons...</p>;
//   }

//   if(isError){
//     toast.error("Failed to load coupons. Please try again later.")
//     return
//   }
//   const filteredCoupons = mockCoupons.filter(coupon =>
//     coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   return (
//     <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
//       <Toaster/>
//       <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <Input
//           placeholder="Search coupons..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-sm"
//         />
//         <Link to="/admin/dashboard/coupons/add" >
//           <Button>
//             <PlusIcon className="mr-2 h-4 w-4" /> Add New Coupon
//           </Button>
//         </Link>
//       </div>

//       {/* Desktop view */}
//       <div className="hidden md:block overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Code</TableHead>
//               <TableHead>Discount</TableHead>
//               <TableHead>Expiry Date</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Usage</TableHead>
//               <TableHead>List/Unlist</TableHead>
//               {/* <TableHead>Actions</TableHead> */}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {coupons.map((coupon) => (
//               <TableRow key={coupon._id}>
//                 <TableCell className="font-medium">{coupon.code}</TableCell>
//                 <TableCell>{coupon.discountType === 'percentage' ? `${coupon.discountPercentage}%` : `$${coupon.discountValue}`}</TableCell>
//                 <TableCell>{new Date(coupon.expiryDate).toLocaleDateString()}</TableCell>
//                 <TableCell>
//                   <span className={`px-2 py-1 rounded-full text-xs ${coupon.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
//                     {coupon.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                 </TableCell>
//                 <TableCell>{coupon.totalAppliedCount} / {coupon.usageLimit}</TableCell>
//                 <TableCell>
//                   <div className="flex space-x-2">
//                     <Button variant="outline" size="icon">
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button variant="outline" size="icon">
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Mobile view */}
//       <div className="md:hidden space-y-4">
//         {coupons.map((coupon) => (
//           <Card key={coupon._id}>
//             <CardHeader>
//               <CardTitle className="text-lg">{coupon.code}</CardTitle>
//               <CardDescription>
//                 {coupon.discountType === 'percentage' ? `${coupon.discountPercentage}% off` : `$${coupon.discountValue} off`}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm text-muted-foreground">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
//                 <span className={`px-2 py-1 rounded-full text-xs ${coupon.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
//                   {coupon.isActive ? 'Active' : 'Inactive'}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-muted-foreground">Usage: {coupon.totalAppliedCount} / {coupon.usageLimit}</span>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" size="icon">
//                       <ChevronDown className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>
//                       <Pencil className="mr-2 h-4 w-4" /> Edit
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <Trash2 className="mr-2 h-4 w-4" /> Delete
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
