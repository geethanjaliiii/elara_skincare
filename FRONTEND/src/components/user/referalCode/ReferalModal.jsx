'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { X, Wallet } from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { claimReward } from '@/services/getReward'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from '@/store/slices/userSlice'
// import { submitReferralCode } from '../actions/submitReferralCode'

export function ReferralModal({open,setOpen}) {
  // const [open, setOpen] = useState(true)
  const dispatch=useDispatch()
  const[referalCode,setReferalCode]=useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
 const navigate=useNavigate()
const userId=useSelector((state)=>state?.user?.userInfo?._id)

  async function onSubmit (e) {
    e.preventDefault()
    console.log("submitting referal");
    
    setIsSubmitting(true)
    try {
      const result= await claimReward(userId,referalCode)
      setIsSubmitting(false)
     
        toast.success(`Success! $${result.amount} has been added to your wallet.`)
      setMessage(`Success! $${result.amount} has been added to your wallet.`)
      dispatch(setUserDetails(result?.user))
      console.log("Closing modal after success.");
        
      setOpen(false)
      // setTimeout(() => {
      //   console.log("Closing modal after success.");

      //   setOpen(false)
      //   // window.location.reload()
      // }, 3000)
     
    } catch (error) {
      const errorMessage=error?.response?.data?.message||'Invalid referral code. Please try again.'
      setMessage(errorMessage)
      setIsSubmitting(false)
    }
  }
  
const handleChange=(e)=>{
  setReferalCode(e.target.value)
}
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white">
        <div className="grid sm:grid-cols-2">
          <div className="relative hidden sm:block bg-[#f5f1ee] aspect-square">
            <img
              src="/images/girl.jpg"
              alt="Referral bonus illustration"
              width={300}
              height={300}
              className="w-full h-full object-fill"
            />
          </div>
          
          <div className="p-6 sm:p-8">
            <button 
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h4 className="text-lg font-medium tracking-tight text-[#8b7355]">Welcome!</h4>
                <h2 className="text-2xl font-medium tracking-tight text-[#8b7355]">
                  Got a referral code?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your code below to receive a bonus in your wallet
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <input
                  type="text"
                  name="referralCode"
                  onChange={handleChange}
                  value={referalCode}
                  placeholder="Enter your referral code"
                  className="border-[#8b7355] focus-visible:ring-[#8b7355]"
                />
                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#8b7355] hover:bg-[#75614a] text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Applying...' : 'Apply Code'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full border-[#8b7355] text-[#8b7355] hover:bg-[#f5f1ee]"
                    onClick={() => setOpen(false)}
                  >
                    I don't have a code
                  </Button>
                </div>
              </form>
              {message && (
                <div className="text-center text-sm font-medium text-emerald-600">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

