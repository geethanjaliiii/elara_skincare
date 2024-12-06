// PaymentSection.jsx
import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  BadgePercent,
  Banknote,
  CreditCard,
  Calendar,
  Wallet,
  Building2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchWallet } from "@/services/wallet";
import { Link } from "react-router-dom";

export default function PaymentSection({
  selectedPayment,
  setSelectedPayment,
  wallet,
  walletError,
  walletLoading
}) {
  const userId = useSelector((state) => state?.user?.userInfo._id);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <OfferBanner /> */}
        <RadioGroup
          value={selectedPayment}
          onValueChange={setSelectedPayment}
          className="space-y-2"
        >
          <PaymentOption
            value="Cash on Delivery"
            icon={Banknote}
            label="Cash On Delivery (Cash/UPI)"
          />
          {/* <PaymentOption value="Credit Card" icon={CreditCard} label="Credit/Debit Card" offers="4 Offers" /> */}
         
          <PaymentOption
            value="Wallet"
            icon={Wallet}
            label="Wallets"
            // offers="2 Offers"
          />
         {selectedPayment === "Wallet" && wallet && !walletLoading && (
            <div className="text-green-600 text-sm ml-4">
              ₹{wallet.balance} available in wallet
            </div>
          )}

          {selectedPayment === "Wallet" && walletLoading && (
            <div className="text-sm ml-4">Loading wallet balance...</div>
          )}

          {selectedPayment === "Wallet" && walletError && (
            <div className="text-red-600 text-sm ml-4">
             PLease activate your {<Link to="/wallet" className="text-red-600 text-sm  underline">Wallet.</Link>}
            </div>
          )}
          <PaymentOption value="Razorpay" icon={Building2} label="Razorpay" />
          <PaymentOption
            value="UPI"
            icon={CreditCard}
            label="UPI (Pay via any App)"
          />
        </RadioGroup>
      </CardContent>
    </Card>
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
