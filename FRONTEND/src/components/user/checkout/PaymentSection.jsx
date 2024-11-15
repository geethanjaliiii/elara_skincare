// PaymentSection.jsx
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BadgePercent, Banknote, CreditCard, Calendar, Wallet, Building2 } from "lucide-react";

export default function PaymentSection({selectedPayment,setSelectedPayment}) {
 

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <OfferBanner />
        <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="space-y-2">
          <PaymentOption value="Cash on Delivery" icon={Banknote} label="Cash On Delivery (Cash/UPI)" />
          <PaymentOption value="Credit Card" icon={CreditCard} label="Credit/Debit Card" offers="4 Offers" />
          <PaymentOption value="PayPal" icon={Building2} label="PayPal" />
          <PaymentOption value="Wallet" icon={Wallet} label="Wallets" offers="2 Offers" />
          <PaymentOption value="Razorpay" icon={Building2} label="Razorpay" />
          <PaymentOption value="UPI" icon={CreditCard} label="UPI (Pay via any App)" />
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

function OfferBanner() {
  return (
    <div className="mb-6 flex items-center gap-2 rounded-lg border p-4">
      <BadgePercent className="h-5 w-5 text-primary" />
      <div>
        <h3 className="font-semibold">Bank Offer</h3>
        <p className="text-sm text-muted-foreground">
          7.5% Instant Discount up to ₹750 on every spend with Myntra Kotak Credit Card.
        </p>
      </div>
    </div>
  );
}

function PaymentOption({ value, icon: Icon, label, offers }) {
  return (
    <div className="flex items-center space-x-4 rounded-lg border p-4">
      <RadioGroupItem value={value} id={value} />
      <Icon className="h-5 w-5" />
      <Label htmlFor={value}>{label}</Label>
      {offers && <span className="ml-auto text-xs text-primary">{offers}</span>}
    </div>
  );
}
