import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PriceDetails = ({cart,step}) => {
  const navigate=useNavigate()
  const handleClick=()=>{
    if(step=='bag'){
        navigate('/checkout/address')
    }
    else if(step=='address'){
      navigate('/checkout/payment')
    }
  }
  return (
    <div className="lg:sticky lg:top-6 lg:h-fit">
          {cart &&
          <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">PRICE DETAILS</h2>
            <Separator className="mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                { cart && <span>Price ({cart.totalItems} items)</span>}
                <span>₹{cart.totalMRP}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹{cart.totalDiscount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">{cart.deleveryCharge?cart.deleveryCharge:'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{cart.platformFee}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{cart.totalAmount}</span>
              </div>
              <div className="text-sm text-green-600">
                You will save ₹{cart.totalMRP-cart.totalDiscount} on this
                order
              </div>
            </div>
            {step &&  <Button className="mt-6 w-full" size="lg" onClick={handleClick}>
            {step==='address'?'CONTINUE':'PLACE ORDER'}
            </Button> }
          
            
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
            </div>
          </CardContent>
        </Card>}
        </div>
  )
}

export default PriceDetails
