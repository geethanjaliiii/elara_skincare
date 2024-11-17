'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function CouponModal({ open, onOpenChange, onApplyCoupon, availableCoupons }) {
  const [couponCode, setCouponCode] = useState('')
  const [selectedCoupon, setSelectedCoupon] = useState('')

  const handleCheck = () => {
    const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase())
    if (coupon) {
      setSelectedCoupon(coupon.code)
    }
  }

  const handleApply = () => {
    if (selectedCoupon) {
      onApplyCoupon(selectedCoupon)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] h-auto max-h-[85vh] flex flex-col ">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>APPLY COUPON</DialogTitle>
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>
        <div className="space-y-4 pt-4 flex-grow overflow-hidden flex flex-col">
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="uppercase"
            />
            <Button
              variant="outline"
              className="shrink-0"
              onClick={handleCheck}
            >
              CHECK
            </Button>
          </div>
          
          <Separator />
          
          <ScrollArea className="flex-grow overflow-y-auto pr-4 max-h-[calc(85vh-100px)]">
            <RadioGroup value={selectedCoupon} onValueChange={setSelectedCoupon}>
              {availableCoupons?.length > 0 && availableCoupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="flex items-center space-x-2 rounded-lg border p-4 mb-2"
                >
                  <RadioGroupItem value={coupon.code} id={coupon.code} />
                  <Label htmlFor={coupon.code} className="flex-1">
                    <div className="font-medium">{coupon.code}</div>
                    <div className="text-sm text-muted-foreground">
                      Save ₹{coupon.potentialDiscount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {coupon.potentialDiscount} upto Rs. 150 on minimum purchase of Rs. {coupon.minPurchaseOrder}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expires on: {coupon.expiryDate}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </ScrollArea>
        </div>
        <div className="pt-4">
          <Button className="w-full" onClick={handleApply} disabled={!selectedCoupon}>
            APPLY
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


// import { useState } from 'react'
// import { X } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { Separator } from '@/components/ui/separator'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// import { Label } from '@/components/ui/label'


// export default function CouponModal({ open, onOpenChange, onApplyCoupon,availableCoupons }) {
//   const [couponCode, setCouponCode] = useState('')
//   const [selectedCoupon, setSelectedCoupon] = useState('')

//   const handleCheck = () => {
//     const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase())
//     if (coupon) {
//       setSelectedCoupon(coupon.code)
//     }
//   }

//   const handleApply = () => {
//     if (selectedCoupon) {
//       onApplyCoupon(selectedCoupon)
//       onOpenChange(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <div className="flex items-center justify-between">
//             <DialogTitle>APPLY COUPON</DialogTitle>
//             {/* <Button
//               variant="ghost"
//               size="icon"
//               className="h-6 w-6 rounded-md"
//               onClick={() => onOpenChange(false)}
//             >
//               <X className="h-4 w-4" />
//             </Button> */}
//           </div>
//         </DialogHeader>
//         <div className="space-y-4 pt-4">
//           <div className="flex gap-2">
//             <Input
//               placeholder="Enter coupon code"
//               value={couponCode}
//               onChange={(e) => setCouponCode(e.target.value)}
//               className="uppercase"
//             />
//             <Button
//               variant="outline"
//               className="shrink-0"
//               onClick={handleCheck}
//             >
//               CHECK
//             </Button>
//           </div>
          
//           <Separator />
          
//           <RadioGroup value={selectedCoupon} onValueChange={setSelectedCoupon}>
//             {availableCoupons?.length>0 && availableCoupons.map((coupon) => (
//               <div
//                 key={coupon.code}
//                 className="flex items-center space-x-2 rounded-lg border p-4"
//               >
//                 <RadioGroupItem value={coupon.code} id={coupon.code} />
//                 <Label htmlFor={coupon.code} className="flex-1">
//                   <div className="font-medium">{coupon.code}</div>
//                   <div className="text-sm text-muted-foreground">
//                     Save ₹{coupon.potentialDiscount}
//                   </div>
//                   <div className="text-xs text-muted-foreground">
//                     {coupon.potentialDiscount} upto Rs. 150 on minimum purchase of Rs. {coupon.minPurchaseOrder}
//                   </div>
//                   <div className="text-xs text-muted-foreground">
//                     Expires on: {coupon.expiryDate}
//                   </div>
//                 </Label>
//               </div>
//             ))}
//           </RadioGroup>

//           <Button className="w-full" onClick={handleApply} disabled={!selectedCoupon}>
//             APPLY
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }