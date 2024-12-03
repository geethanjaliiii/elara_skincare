import React from 'react'
import { Copy,Share2,Edit } from "lucide-react";
import { Card, CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import toast, { Toaster } from 'react-hot-toast';
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
const ReferAndEarn = ({user}) => {
    const copyReferralCode = () => {
    
        navigator.clipboard.writeText(user.referralCode);
        toast.success("Referral code copied to clipboard!");
      };
  return (
    <div>
        <Toaster/>
     <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">Refer and Earn</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Your Referral Code</Label>
                <p className="text-2xl font-bold text-primary">{user.referralCode || 'YOURCODE'}</p>
              </div>
              <Button
  onClick={copyReferralCode}
  variant="outline"
  size="sm"
  className="h-8 px-4 text-sm md:h-10 md:px-6 md:text-base flex items-center justify-center"
>
  <Copy className="mr-2 h-4 w-4" />
  <span className="hidden sm:inline">Copy Code</span>
</Button>

              {/* <Button
                onClick={copyReferralCode}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </Button> */}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">How it works:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Share your referral code with friends</li>
              <li>When they sign up using your code, they get ₹50 in their wallet</li>
              <li>You earn ₹100 for each successful referral</li>
            </ul>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Total Referrals</p>
              <p className="text-2xl font-bold text-primary">{user.totalReferrals || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Earnings</p>
              <p className="text-2xl font-bold text-primary">₹{user.referralRewards || 0}</p>
            </div>
          </div>

          <Button className="w-full bg-[#8B4513] hover:bg-[#6F3709]">
            <Share2 className="mr-2 h-4 w-4" /> Share Your Referral Code
          </Button>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export default ReferAndEarn
