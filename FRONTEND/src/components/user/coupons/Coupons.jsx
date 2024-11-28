
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from 'lucide-react'
import { useAllCoupons } from "@/hooks/admin/customHooks"
import { toast,Toaster } from "sonner"



export default function Coupons() {
  const { data, isError } = useAllCoupons()
  

  // If data is empty, initialize empty arrays
  const { coupons = [], expiredCoupons = [] } = data || {}

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    console.log("coupon copied");
    toast.success("Coupon code copied")
    
    // toast({
    //   title: "Coupon code copied",
    //   description: `${code} has been copied to your clipboard.`,
    // })
  }

  const formatDiscount = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountPercentage}% off`
    } else {
      return `₹${coupon.discountValue} off`
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const CouponCard = ({ coupon }) => (
    <Card key={coupon._id} className="relative overflow-hidden">
      <div className="absolute top-3 right-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => copyToClipboard(coupon.code)}
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">
          {formatDiscount(coupon)}
        </CardTitle>
        {coupon.minPurchaseOrder > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            On min. purchase of ₹{coupon.minPurchaseOrder}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Code:</span>
            <code className="rounded bg-muted px-2 py-1 text-sm">
              {coupon.code}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Expiry:</span>
            <span className="text-sm text-muted-foreground">
              {formatDate(coupon.expiryDate)}
            </span>
          </div>
          {coupon.maxDiscountAmount && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Max Discount:</span>
              <span className="text-sm text-muted-foreground">
                ₹{coupon.maxDiscountAmount}
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{coupon.description}</p>
      </CardContent>
    </Card>
  )

  if (isError) {
    return <div>Error loading coupons. Please try again later.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <Toaster/>
      <h1 className="text-3xl font-bold mb-6">Coupons</h1>
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="available">Available Coupons</TabsTrigger>
          <TabsTrigger value="expired">Expired Coupons</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((coupon) => (
              <CouponCard key={coupon._id} coupon={coupon} />
            ))}
          </div>
          {coupons.length === 0 && (
            <p className="text-center text-muted-foreground">No available coupons at the moment.</p>
          )}
        </TabsContent>
        <TabsContent value="expired">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {expiredCoupons.map((coupon) => (
              <CouponCard key={coupon._id} coupon={coupon} />
            ))}
          </div>
          {expiredCoupons.length === 0 && (
            <p className="text-center text-muted-foreground">No expired coupons to display.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}



// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Copy } from 'lucide-react'
// import { useAllCoupons } from "@/hooks/admin/customHooks"
// import { useSelector } from "react-redux"

// // Mock data for coupons
// const availableCoupons = [
//   {
//     id: 1,
//     discount: "Flat 5% off",
//     code: "HOBHOMEDECOR5",
//     expiryDate: "31 Dec 2024",
//     minPurchase: "",
//     productLink: "/products/home-decor"
//   },
//   {
//     id: 2,
//     discount: "Flat 5% off",
//     code: "CHEMISTRYB2G5B4G10",
//     expiryDate: "31 Dec 2024",
//     minPurchase: "On min. purchase of ₹2",
//     productLink: "/products/chemistry"
//   },
//   {
//     id: 3,
//     discount: "Flat 10% off",
//     code: "ILOVEBATA10",
//     expiryDate: "31 Dec 2024",
//     minPurchase: "",
//     productLink: "/products/footwear"
//   },
//   {
//     id: 4,
//     discount: "Flat 10% off",
//     code: "NEWROADSTER",
//     expiryDate: "30 Dec 2024",
//     minPurchase: "On min. purchase of ₹799",
//     productLink: "/products/fashion"
//   }
// ]

// export default function Coupons() {
  
//   const copyToClipboard = (code) => {
//     navigator.clipboard.writeText(code)
//   }
// const {data,isError}=useAllCoupons()
// //if data is empty ,initialize empty array
// const{coupons=[],expiredCoupons=[]}=data||{}
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-semibold mb-6">Available Coupons</h1>
//       <div className="grid gap-6 md:grid-cols-2">
//         {coupons && coupons.map((coupon) => (
//           <Card key={coupon._id} className="relative overflow-hidden">
//             <div className="absolute top-3 right-3">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8"
//                 onClick={() => copyToClipboard(coupon.code)}
//               >
//                 <Copy className="h-4 w-4" />
//                 <span className="sr-only">Copy code</span>
//               </Button>
//             </div>
//             <CardHeader>
//               <CardTitle className="text-xl font-bold text-primary">
//                 {coupon?.discountValue?coupon.discountValue:coupon.discountPetcentage}
//               </CardTitle>
//               {coupon.minPurchase && (
//                 <p className="text-sm text-muted-foreground mt-1">
//                   {coupon.minPurchase}
//                 </p>
//               )}
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Code:</span>
//                   <code className="rounded bg-muted px-2 py-1 text-sm">
//                     {coupon.code}
//                   </code>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Expiry:</span>
//                   <span className="text-sm text-muted-foreground">
//                     {coupon.expiryDate}
//                   </span>
//                 </div>
//               </div>
//               {/* <Link
//                 href={coupon.productLink}
//                 className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium"
//               >
//                 View Products
//                 <svg
//                   className="ml-1 h-4 w-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </Link> */}
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }

