'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from 'lucide-react'


export default function Component({ 
  cartValue = 1114,
  coupons = [
    {
      code: "SAVE100",
      description: "Get flat ₹100 off on orders above ₹1500",
      discountType: "flat",
      discountValue: 100,
      minPurchaseOrder: 1500,
      isApplicable: false,
      additionalAmount: 386
    },
    {
      code: "SPECIAL20",
      description: "Get 20% off up to ₹200 on orders above ₹1000",
      discountType: "percentage",
      discountValue: 20,
      minPurchaseOrder: 1000,
      isApplicable: true
    },
    {
      code: "FLAT75",
      description: "Get flat ₹75 off on orders above ₹999",
      discountType: "flat",
      discountValue: 75,
      minPurchaseOrder: 999,
      isApplicable: true
    },
    {
      code: "WELCOME50",
      description: "Get 50% off up to ₹150 on orders above ₹2000",
      discountType: "percentage",
      discountValue: 50,
      minPurchaseOrder: 2000,
      isApplicable: false,
      additionalAmount: 886
    }
  ]
}) {
  const [expandedCoupons, setExpandedCoupons] = useState([])
  const [couponCode, setCouponCode] = useState('')

  const toggleExpand = (code) => {
    setExpandedCoupons(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    )
  }

  const availableCoupons = coupons.filter(coupon => coupon.isApplicable)
  const unavailableCoupons = coupons.filter(coupon => !coupon.isApplicable)

  return (
    <div className="max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold mb-2">Available Coupons</h1>
        <p className="text-muted-foreground mb-4">Cart value: ₹{cartValue}</p>
        <div className="relative">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="pr-20"
          />
          <Button 
            className="absolute right-0 top-0 h-full rounded-l-none"
            variant="secondary"
          >
            Apply
          </Button>
        </div>
      </div>

      <div className="p-4 lg:p-8">
        {availableCoupons.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Available Coupons</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availableCoupons.map((coupon) => (
                <CouponCard key={coupon.code} coupon={coupon} expandedCoupons={expandedCoupons} toggleExpand={toggleExpand} />
              ))}
            </div>
          </>
        )}

        {unavailableCoupons.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Unavailable Coupons</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unavailableCoupons.map((coupon) => (
                <CouponCard key={coupon.code} coupon={coupon} expandedCoupons={expandedCoupons} toggleExpand={toggleExpand} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function CouponCard({ coupon, expandedCoupons, toggleExpand }) {
  return (
    <Card 
      className={`overflow-hidden transition-colors ${
        coupon.isApplicable ? "bg-white" : "bg-gray-100"
      }`}
    >
      <CardContent className="p-4 flex">
        <div className={`w-14 sm:w-16 flex items-center justify-center p-2 font-semibold text-xs sm:text-sm text-white ${
          coupon.isApplicable 
            ? coupon.discountType === 'percentage' ? "bg-blue-500" : "bg-green-500"
            : "bg-gray-400"
        }`}>
          {coupon.discountType === 'flat' ? 'FLAT OFF' : '% OFF'}
        </div>
        <div className="flex-1 pl-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-base sm:text-lg">{coupon.code}</h3>
              {coupon.additionalAmount && (
                <p className={`text-xs sm:text-sm ${
                  coupon.isApplicable ? "text-green-600" : "text-gray-600"
                }`}>
                  Add ₹{coupon.additionalAmount} more to avail this offer
                </p>
              )}
            </div>
            <Button 
              variant={coupon.isApplicable ? "default" : "secondary"}
              className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3"
              disabled={!coupon.isApplicable}
            >
              APPLY
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
            {coupon.description}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs p-0"
            onClick={() => toggleExpand(coupon.code)}
          >
            {expandedCoupons.includes(coupon.code) ? (
              <>
                - LESS
                <ChevronUp className="h-3 w-3 ml-1" />
              </>
            ) : (
              <>
                + MORE
                <ChevronDown className="h-3 w-3 ml-1" />
              </>
            )}
          </Button>
          <div className={`grid gap-1 text-xs sm:text-sm text-muted-foreground mt-2 ${
            expandedCoupons.includes(coupon.code) ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}>
            <div className="overflow-hidden">
              <p>• Minimum order value: ₹{coupon.minPurchaseOrder}</p>
              <p>• Maximum discount: 
                {coupon.discountType === 'flat' 
                  ? ` ₹${coupon.discountValue}`
                  : ` ${coupon.discountValue}% of cart value`}
              </p>
              <p>• Valid on all products</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
